// pages/examsList.js

import {
  getExams,
  deleteExam,
  updateExam
} from "../services/examService.js";

import {
  createExamPage,
  setExamToEdit
} from "./createExam.js";

import {
  adminPage
} from "./admin.js";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


// ======================================================
// STATE
// ======================================================

let examsCache = [];

let loadingExamsPromise = null;

let eventsAttached = false;

let autoLoadTimer = null;


// ======================================================
// HELPERS
// ======================================================

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function yieldToBrowser() {

  return new Promise(resolve => {

    setTimeout(resolve, 0);

  });

}


// ======================================================
// GET EXAM ID
// ======================================================

function getExamId(exam) {

  if (!exam) return "";

  return String(
    exam.firestoreId ||
    exam.id ||
    ""
  );

}


// ======================================================
// GET EXAM OPEN STATUS
// ======================================================

function getExamOpenStatus(exam) {

  if (!exam) return false;

  return (
    exam.isPublished !== false &&
    exam.isPublished !== "false"
  );

}


// ======================================================
// FIND EXAM
// ======================================================

function findExamById(id) {

  if (!id) return null;

  return (
    examsCache.find(
      exam =>
        getExamId(exam) === String(id)
    ) ||
    null
  );

}


// ======================================================
// GET CORRECT ANSWER
// ======================================================

function getCorrectAnswer(question) {

  if (!question) return null;

  const candidates = [

    question.correctAnswer,

    question.correctOption,

    question.answer,

    question.correct,

    question.rightAnswer,

    question.correctChoice,

    question.solution,

    question.modelAnswer

  ];


  for (const value of candidates) {

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {

      return value;

    }

  }


  return null;

}


// ======================================================
// NORMALIZE CORRECT ANSWER
// ======================================================

function normalizeAnswer(value, options = []) {

  if (
    value === undefined ||
    value === null
  ) {

    return -1;

  }


  const raw =
    String(value)
      .trim()
      .toLowerCase();


  if (!raw) return -1;


  // A / B / C / D

  const letters = {
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3,

    "أ": 0,
    "ب": 1,
    "ج": 2,
    "د": 3,

    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3
  };


  if (
    Object.prototype.hasOwnProperty.call(
      letters,
      raw
    )
  ) {

    return letters[raw];

  }


  // نص الاختيار نفسه

  const index =
    options.findIndex(
      option =>
        String(option ?? "")
          .trim()
          .toLowerCase() === raw
    );


  if (index !== -1) {

    return index;

  }


  // لو القيمة رقمية بالفعل

  const numeric =
    Number(raw);


  if (
    Number.isInteger(numeric)
  ) {

    if (
      numeric >= 0 &&
      numeric < options.length
    ) {

      return numeric;

    }


    if (
      numeric >= 1 &&
      numeric <= options.length
    ) {

      return numeric - 1;

    }

  }


  return -1;

}


// ======================================================
// GET QUESTION OPTIONS
// ======================================================

function getQuestionOptions(question) {

  if (!question) return [];

  if (
    Array.isArray(
      question.options
    )
  ) {

    return question.options;

  }


  return [

    question.A ??
      question.optionA ??
      "",

    question.B ??
      question.optionB ??
      "",

    question.C ??
      question.optionC ??
      "",

    question.D ??
      question.optionD ??
      ""

  ];

}


// ======================================================
// RENDER LOADING
// ======================================================

function renderLoading(container) {

  if (!container) return;

  if (!document.body.contains(container)) {
    return;
  }

  container.innerHTML = `

    <div style="
      padding:50px 20px;
      text-align:center;
      direction:rtl;
      color:#94a3b8;
    ">

      <div style="
        font-size:38px;
        margin-bottom:15px;
      ">
        ⏳
      </div>

      <div style="
        color:#e2e8f0;
        font-size:17px;
        font-weight:700;
      ">
        جاري تحميل الامتحانات من Firestore...
      </div>

      <div style="
        color:#64748b;
        font-size:12px;
        margin-top:8px;
      ">
        يرجى الانتظار...
      </div>

    </div>

  `;

}


// ======================================================
// RENDER EMPTY
// ======================================================

function renderEmpty(container) {

  if (!container) return;

  if (!document.body.contains(container)) {
    return;
  }

  container.innerHTML = `

    <div style="
      padding:50px 20px;
      text-align:center;
      direction:rtl;
      background:rgba(15,23,42,.45);
      border:1px solid rgba(255,255,255,.06);
      border-radius:20px;
    ">

      <div style="
        font-size:42px;
        margin-bottom:15px;
      ">
        📚
      </div>

      <div style="
        color:#e2e8f0;
        font-size:18px;
        font-weight:700;
      ">
        لا توجد امتحانات
      </div>

      <div style="
        color:#64748b;
        font-size:13px;
        margin-top:8px;
      ">
        لم يتم إنشاء أي امتحانات حتى الآن.
      </div>

    </div>

  `;

}


// ======================================================
// RENDER ERROR
// ======================================================

function renderError(
  container,
  error
) {

  if (!container) return;

  if (!document.body.contains(container)) {
    return;
  }

  const message =
    error?.message ||
    "خطأ غير معروف";

  container.innerHTML = `

    <div style="
      padding:40px 20px;
      text-align:center;
      direction:rtl;
      background:rgba(127,29,29,.12);
      border:1px solid rgba(239,68,68,.2);
      border-radius:20px;
    ">

      <div style="
        font-size:40px;
        margin-bottom:12px;
      ">
        ❌
      </div>

      <h3 style="
        margin:0 0 10px;
        color:#fca5a5;
      ">
        حدث خطأ في تحميل الامتحانات
      </h3>

      <div style="
        color:#94a3b8;
        font-size:12px;
        line-height:1.8;
        max-width:700px;
        margin:auto;
        word-break:break-word;
      ">

        ${escapeHtml(message)}

      </div>

      <button
        type="button"
        id="btnRetryExams"
        style="
          margin-top:20px;
          background:#3730a3;
          color:white;
          border:none;
          padding:10px 20px;
          border-radius:10px;
          cursor:pointer;
          font-family:inherit;
          font-weight:700;
        "
      >
        🔄 إعادة المحاولة
      </button>

    </div>

  `;

}


// ======================================================
// CREATE PDF DIRECTLY
// ======================================================

async function downloadExamPDF(
  exam,
  answered = false
) {

  if (!exam) {

    alert(
      "❌ لم يتم العثور على الامتحان."
    );

    return;

  }


  const questions =
    Array.isArray(exam.questions)
      ? exam.questions
      : [];


  if (!questions.length) {

    alert(
      "❌ الامتحان لا يحتوي على أسئلة."
    );

    return;

  }


  const examTitle =
    exam.title ||
    "امتحان";


  const className =
    exam.className ||
    exam.grade ||
    "عام";


  const subject =
    exam.subject ||
    "Physics";


  const duration =
    exam.duration ||
    exam.examTime ||
    0;


  // ====================================================
  // CREATE TEMPORARY HTML
  // ====================================================

  const pdfContainer =
    document.createElement("div");


  pdfContainer.style.position =
    "fixed";

  pdfContainer.style.left =
    "-100000px";

  pdfContainer.style.top =
    "0";

  pdfContainer.style.width =
    "794px";

  pdfContainer.style.background =
    "#ffffff";

  pdfContainer.style.color =
    "#111827";

  pdfContainer.style.direction =
    "rtl";

  pdfContainer.style.fontFamily =
    "Tahoma, Arial, sans-serif";

  pdfContainer.style.padding =
    "42px";

  pdfContainer.style.boxSizing =
    "border-box";


  // ====================================================
  // HEADER
  // ====================================================

  let html = `

    <div style="
      text-align:center;
      padding:22px 20px;
      border-radius:18px;
      background:
        linear-gradient(
          135deg,
          #111827,
          #312e81
        );
      color:white;
      margin-bottom:25px;
    ">

      <div style="
        font-size:28px;
        font-weight:900;
        letter-spacing:.3px;
        margin-bottom:8px;
      ">
        ${escapeHtml(examTitle)}
      </div>

      <div style="
        font-size:12px;
        opacity:.85;
        margin-bottom:15px;
      ">
        Ahmed.R Exams
      </div>

      <div style="
        display:flex;
        justify-content:space-between;
        gap:10px;
        font-size:13px;
        font-weight:700;
      ">

        <span>
          الصف: ${escapeHtml(className)}
        </span>

        <span>
          المادة: ${escapeHtml(subject)}
        </span>

        <span>
          الزمن: ${escapeHtml(duration)} دقيقة
        </span>

      </div>

    </div>


    <div style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:18px;
      margin-bottom:25px;
    ">

      <div style="
        border-bottom:2px solid #94a3b8;
        padding:7px 4px;
        font-size:14px;
        color:#374151;
      ">
        اسم الطالب:
      </div>

      <div style="
        border-bottom:2px solid #94a3b8;
        padding:7px 4px;
        font-size:14px;
        color:#374151;
      ">
        الفصل:
      </div>

    </div>

  `;


  // ====================================================
  // QUESTIONS
  // ====================================================

  questions.forEach(
    (
      question,
      index
    ) => {

      const text =
        question.question ??
        question.text ??
        question.title ??
        "";


      const image =
        question.image ??
        question.imageUrl ??
        "";


      const options =
        getQuestionOptions(
          question
        );


      const correctValue =
        getCorrectAnswer(
          question
        );


      const correctIndex =
        normalizeAnswer(
          correctValue,
          options
        );


      const type =
        question.type ||
        "mcq";


      html += `

        <div style="
          margin-bottom:24px;
          padding:18px;
          border:1px solid #e5e7eb;
          border-radius:15px;
          background:#ffffff;
          page-break-inside:avoid;
        ">

          <div style="
            font-size:16px;
            font-weight:900;
            color:#312e81;
            margin-bottom:9px;
          ">
            السؤال ${index + 1}
          </div>

          <div style="
            font-size:16px;
            font-weight:600;
            color:#111827;
            line-height:1.9;
            margin-bottom:12px;
            white-space:pre-wrap;
          ">
            ${escapeHtml(text)}
          </div>

      `;


      // ==================================================
      // IMAGE
      // ==================================================

      if (image) {

        html += `

          <div style="
            text-align:center;
            margin:15px 0;
          ">

            <img
              src="${escapeHtml(image)}"
              style="
                max-width:100%;
                max-height:300px;
                object-fit:contain;
                border-radius:10px;
              "
            >

          </div>

        `;

      }


      // ==================================================
      // ESSAY
      // ==================================================

      if (type === "essay") {

        html += `

          <div style="
            min-height:130px;
            border:2px dashed #9ca3af;
            border-radius:12px;
            margin-top:15px;
            padding:12px;
            color:#6b7280;
            font-size:13px;
          ">
            مساحة إجابة الطالب
          </div>

        `;

      }

      else {

        html += `

          <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px 14px;
            margin-top:12px;
          ">
        `;


        const letters = [
          "أ",
          "ب",
          "ج",
          "د"
        ];


        options.forEach(
          (
            option,
            optionIndex
          ) => {

            if (
              option === null ||
              option === undefined ||
              String(option).trim() === ""
            ) {

              return;

            }


            const isCorrect =
              answered &&
              correctIndex === optionIndex;


            html += `

              <div style="
                display:flex;
                align-items:center;
                gap:9px;
                min-height:42px;
                padding:8px 10px;
                border-radius:10px;

                ${
                  isCorrect
                    ? `
                      background:#dcfce7;
                      border:2px solid #22c55e;
                      color:#166534;
                      font-weight:800;
                    `
                    : `
                      background:#f8fafc;
                      border:1px solid #d1d5db;
                      color:#111827;
                    `
                }

                box-sizing:border-box;
              ">

                <span style="
                  width:25px;
                  height:25px;
                  min-width:25px;
                  border-radius:50%;
                  display:inline-flex;
                  align-items:center;
                  justify-content:center;

                  ${
                    isCorrect
                      ? `
                        background:#22c55e;
                        color:white;
                        border:2px solid #15803d;
                      `
                      : `
                        background:white;
                        color:#374151;
                        border:1px solid #6b7280;
                      `
                  }

                  font-size:13px;
                  font-weight:900;
                ">
                  ${
                    isCorrect
                      ? "✓"
                      : letters[optionIndex]
                  }
                </span>

                <span style="
                  font-size:14px;
                  line-height:1.7;
                ">
                  ${escapeHtml(option)}
                </span>

              </div>

            `;

          }
        );


        html += `

          </div>

        `;

      }


      html += `

        </div>

      `;

    }
  );


  // ====================================================
  // FOOTER
  // ====================================================

  html += `

    <div style="
      margin-top:25px;
      padding-top:14px;
      border-top:2px solid #e5e7eb;
      text-align:center;
      font-size:11px;
      color:#6b7280;
    ">

      Ahmed.R Exams
      <span style="
        margin:0 8px;
        color:#9ca3af;
      ">
        •
      </span>
      ${
        answered
          ? "مجاب"
          : "غير مجاب"
      }

    </div>

  `;


  pdfContainer.innerHTML =
    html;


  document.body.appendChild(
    pdfContainer
  );


  try {

    // ==================================================
    // WAIT FOR IMAGES
    // ==================================================

    const images =
      Array.from(
        pdfContainer.querySelectorAll(
          "img"
        )
      );


    await Promise.all(
      images.map(
        img =>
          new Promise(
            resolve => {

              if (img.complete) {

                resolve();

                return;

              }


              img.onload =
                resolve;

              img.onerror =
                resolve;

            }
          )
      )
    );


    await yieldToBrowser();


    // ==================================================
    // HTML -> CANVAS
    // ==================================================

    const canvas =
      await html2canvas(
        pdfContainer,
        {
          scale:2,

          useCORS:true,

          allowTaint:false,

          backgroundColor:"#ffffff",

          logging:false,

          imageTimeout:15000
        }
      );


    // ==================================================
    // CREATE PDF
    // ==================================================

    const pdf =
      new jsPDF(
        "p",
        "mm",
        "a4"
      );


    const pageWidth =
      pdf.internal.pageSize.getWidth();


    const pageHeight =
      pdf.internal.pageSize.getHeight();


    const margin =
      8;


    const usableWidth =
      pageWidth -
      margin * 2;


    const imageWidth =
      usableWidth;


    const imageHeight =
      canvas.height *
      imageWidth /
      canvas.width;


    const pageImageHeight =
      pageHeight -
      margin * 2;


    let renderedHeight = 0;

    let pageNumber = 0;


    while (
      renderedHeight <
      imageHeight
    ) {

      if (pageNumber > 0) {

        pdf.addPage();

      }


      const sourceY =
        renderedHeight *
        canvas.width /
        imageWidth;


      const sourceHeight =
        Math.min(
          pageImageHeight *
            canvas.width /
            imageWidth,
          canvas.height -
            sourceY
        );


      const tempCanvas =
        document.createElement(
          "canvas"
        );


      tempCanvas.width =
        canvas.width;


      tempCanvas.height =
        Math.ceil(
          sourceHeight
        );


      const tempContext =
        tempCanvas.getContext(
          "2d"
        );


      tempContext.drawImage(
        canvas,

        0,
        sourceY,

        canvas.width,
        sourceHeight,

        0,
        0,

        canvas.width,
        sourceHeight
      );


      const pageData =
        tempCanvas.toDataURL(
          "image/jpeg",
          0.95
        );


      const actualHeight =
        sourceHeight *
        imageWidth /
        canvas.width;


      pdf.addImage(
        pageData,
        "JPEG",
        margin,
        margin,
        imageWidth,
        actualHeight,
        undefined,
        "FAST"
      );


      renderedHeight +=
        pageImageHeight;


      pageNumber++;

    }


    // ==================================================
    // SAVE DIRECTLY
    // ==================================================

    const safeTitle =
      String(examTitle)
        .replace(
          /[\\/:*?"<>|]/g,
          "_"
        )
        .trim() ||
      "exam";


    const fileName =
      `${safeTitle}_${answered ? "مجاب" : "غير_مجاب"}.pdf`;


    pdf.save(
      fileName
    );


  }
  catch (error) {

    console.error(
      "PDF GENERATION ERROR:",
      error
    );


    alert(
      "❌ حدث خطأ أثناء إنشاء PDF\n\n" +
      (
        error?.message ||
        "خطأ غير معروف"
      )
    );

  }
  finally {

    if (
      pdfContainer &&
      pdfContainer.parentNode
    ) {

      pdfContainer.parentNode.removeChild(
        pdfContainer
      );

    }

  }

}


// ======================================================
// PDF MENU
// ======================================================

function showPdfMenu(
  button,
  exam
) {

  // حذف أي قائمة قديمة

  document
    .querySelectorAll(
      ".examPdfMenu"
    )
    .forEach(
      menu =>
        menu.remove()
    );


  const menu =
    document.createElement(
      "div"
    );


  menu.className =
    "examPdfMenu";


  menu.style.position =
    "fixed";

  menu.style.zIndex =
    "999999";

  menu.style.minWidth =
    "190px";

  menu.style.padding =
    "8px";

  menu.style.borderRadius =
    "16px";

  menu.style.background =
    "rgba(15,23,42,.98)";

  menu.style.border =
    "1px solid rgba(255,255,255,.12)";

  menu.style.boxShadow =
    "0 20px 50px rgba(0,0,0,.45)";

  menu.style.backdropFilter =
    "blur(12px)";

  menu.style.direction =
    "rtl";


  menu.innerHTML = `

    <div style="
      color:#94a3b8;
      font-size:11px;
      padding:6px 10px 8px;
      font-weight:700;
    ">
      اختر نوع PDF
    </div>


    <button
      type="button"
      class="pdfChoiceAnswered"
      style="
        width:100%;
        border:none;
        cursor:pointer;
        padding:11px 12px;
        border-radius:11px;
        background:transparent;
        color:#e2e8f0;
        font-family:inherit;
        font-size:14px;
        font-weight:800;
        text-align:right;
      "
    >
      <span style="
        display:inline-flex;
        width:28px;
        height:28px;
        border-radius:8px;
        align-items:center;
        justify-content:center;
        background:#166534;
        margin-left:7px;
      ">
        ✓
      </span>

      مجاب

    </button>


    <button
      type="button"
      class="pdfChoiceBlank"
      style="
        width:100%;
        border:none;
        cursor:pointer;
        padding:11px 12px;
        border-radius:11px;
        background:transparent;
        color:#e2e8f0;
        font-family:inherit;
        font-size:14px;
        font-weight:800;
        text-align:right;
      "
    >
      <span style="
        display:inline-flex;
        width:28px;
        height:28px;
        border-radius:8px;
        align-items:center;
        justify-content:center;
        background:#334155;
        margin-left:7px;
      ">
        □
      </span>

      غير مجاب

    </button>

  `;


  document.body.appendChild(
    menu
  );


  const rect =
    button.getBoundingClientRect();


  let top =
    rect.bottom + 8;


  let left =
    rect.right -
    190;


  if (
    left < 10
  ) {

    left = 10;

  }


  if (
    top + 130 >
    window.innerHeight
  ) {

    top =
      rect.top -
      138;

  }


  menu.style.top =
    `${Math.max(10, top)}px`;

  menu.style.left =
    `${Math.max(10, left)}px`;


  const answeredButton =
    menu.querySelector(
      ".pdfChoiceAnswered"
    );


  const blankButton =
    menu.querySelector(
      ".pdfChoiceBlank"
    );


  const closeMenu =
    () => {

      if (
        menu &&
        menu.parentNode
      ) {

        menu.parentNode.removeChild(
          menu
        );

      }

    };


  answeredButton.addEventListener(
    "mouseenter",
    () => {

      answeredButton.style.background =
        "rgba(34,197,94,.15)";

    }
  );


  answeredButton.addEventListener(
    "mouseleave",
    () => {

      answeredButton.style.background =
        "transparent";

    }
  );


  blankButton.addEventListener(
    "mouseenter",
    () => {

      blankButton.style.background =
        "rgba(99,102,241,.15)";

    }
  );


  blankButton.addEventListener(
    "mouseleave",
    () => {

      blankButton.style.background =
        "transparent";

    }
  );


  answeredButton.addEventListener(
    "click",
    async event => {

      event.preventDefault();
      event.stopPropagation();


      closeMenu();


      button.disabled =
        true;

      button.innerHTML =
        "⏳ جاري إنشاء PDF...";


      try {

        await downloadExamPDF(
          exam,
          true
        );

      }
      finally {

        button.disabled =
          false;

        button.innerHTML =
          "📄 PDF";

      }

    }
  );


  blankButton.addEventListener(
    "click",
    async event => {

      event.preventDefault();
      event.stopPropagation();


      closeMenu();


      button.disabled =
        true;

      button.innerHTML =
        "⏳ جاري إنشاء PDF...";


      try {

        await downloadExamPDF(
          exam,
          false
        );

      }
      finally {

        button.disabled =
          false;

        button.innerHTML =
          "📄 PDF";

      }

    }
  );


  setTimeout(
    () => {

      const outsideClick =
        event => {

          if (
            !menu.contains(
              event.target
            ) &&
            event.target !== button
          ) {

            closeMenu();

            document.removeEventListener(
              "click",
              outsideClick,
              true
            );

          }

        };


      document.addEventListener(
        "click",
        outsideClick,
        true
      );

    },
    0
  );

}


// ======================================================
// RENDER EXAMS
// ======================================================

function renderExams(
  container
) {

  if (!container) return;

  if (!document.body.contains(container)) {
    return;
  }


  if (!examsCache.length) {

    renderEmpty(container);

    return;

  }


  container.innerHTML =
    examsCache
      .map(
        exam => {

          const isOpen =
            getExamOpenStatus(
              exam
            );


          const examId =
            getExamId(
              exam
            );


          const questionsCount =
            Array.isArray(
              exam.questions
            )
              ? exam.questions.length
              : Number(
                  exam.questionsCount
                ) || 0;


          return `

<div
  class="examManagementCard"
  data-exam-id="${escapeHtml(examId)}"
  style="
    background:linear-gradient(
      135deg,
      #1e293b,
      #0f172a
    );

    border-radius:20px;

    padding:22px;

    margin-bottom:15px;

    display:flex;

    justify-content:space-between;

    align-items:center;

    flex-wrap:wrap;

    gap:15px;

    border:1px solid
      rgba(255,255,255,.05);
  "
>


<div>

  <div style="
    margin-bottom:8px;
  ">

    <span style="
      background:#312e81;
      color:#c7d2fe;
      padding:5px 12px;
      border-radius:8px;
      font-size:12px;
    ">

      ${escapeHtml(
        exam.className ||
        exam.grade ||
        "عام"
      )}

    </span>


    <span style="
      background:#065f46;
      color:#6ee7b7;
      padding:5px 12px;
      border-radius:8px;
      font-size:12px;
      margin-right:5px;
    ">

      ${escapeHtml(
        exam.subject ||
        "physics"
      )}

    </span>


    <span
      class="examStatus"
      style="
        background:
          ${
            isOpen
              ? "#064e3b"
              : "#7f1d1d"
          };

        color:
          ${
            isOpen
              ? "#6ee7b7"
              : "#fca5a5"
          };

        padding:5px 12px;

        border-radius:8px;

        font-size:12px;

        margin-right:5px;
      "
    >

      ${
        isOpen
          ? "🟢 مفتوح للطلاب"
          : "🔴 مغلق عن الطلاب"
      }

    </span>

  </div>


  <h3 style="
    color:white;
    margin:5px 0;
  ">

    ${escapeHtml(
      exam.title ||
      "امتحان بدون اسم"
    )}

  </h3>


  <p style="
    color:#94a3b8;
    font-size:13px;
    margin:6px 0 0;
  ">

    المدة:
    ${escapeHtml(
      exam.duration ||
      exam.examTime ||
      0
    )}
    دقائق

    |

    الأسئلة:
    ${questionsCount}

  </p>

</div>


<div style="
  display:flex;
  gap:10px;
  flex-wrap:wrap;
">


<button
  type="button"
  class="toggleExam"
  data-id="${escapeHtml(examId)}"
  data-source="${escapeHtml(
    exam.source || "firebase"
  )}"
  data-open="${isOpen}"
  style="
    background:
      ${
        isOpen
          ? "#991b1b"
          : "#047857"
      };

    color:white;

    border:none;

    padding:8px 14px;

    border-radius:10px;

    cursor:pointer;

    font-family:inherit;

    font-weight:700;
  "
>

  ${
    isOpen
      ? "🔒 غلق"
      : "🔓 فتح"
  }

</button>


<button
  type="button"
  class="editExam"
  data-id="${escapeHtml(examId)}"
  style="
    background:#3730a3;
    color:white;
    border:none;
    padding:8px 14px;
    border-radius:10px;
    cursor:pointer;
    font-family:inherit;
    font-weight:700;
  "
>

  ✏️ تعديل

</button>


<button
  type="button"
  class="pdfExam"
  data-id="${escapeHtml(examId)}"
  style="
    background:
      linear-gradient(
        135deg,
        #f59e0b,
        #b45309
      );

    color:white;
    border:none;
    padding:8px 16px;
    border-radius:10px;
    cursor:pointer;
    font-family:inherit;
    font-weight:800;
    box-shadow:
      0 5px 15px
      rgba(245,158,11,.18);
  "
>

  📄 PDF

</button>


<button
  type="button"
  class="deleteExam"
  data-id="${escapeHtml(examId)}"
  data-source="${escapeHtml(
    exam.source || "firebase"
  )}"
  style="
    background:#991b1b;
    color:white;
    border:none;
    padding:8px 14px;
    border-radius:10px;
    cursor:pointer;
    font-family:inherit;
    font-weight:700;
  "
>

  🗑 حذف

</button>


</div>

</div>

          `;

        }
      )
      .join("");

}


// ======================================================
// PAGE
// ======================================================

export function examsListPage() {

  scheduleAutoLoad();


  return `

<div style="
  margin-bottom:20px;
">

<button
  id="btnBackToDashboard"
  type="button"
  style="
    background:rgba(30,41,59,.6);
    color:#cbd5e1;
    border:1px solid rgba(255,255,255,.08);
    padding:10px 18px;
    border-radius:12px;
    font-weight:700;
    cursor:pointer;
    font-family:inherit;
  "
>

  ⬅ الرجوع للوحة التحكم

</button>

</div>


<div style="
  background:linear-gradient(
    135deg,
    #1e293b,
    #0f172a
  );

  border-radius:24px;

  padding:25px 30px;

  display:flex;

  justify-content:space-between;

  align-items:center;

  margin-bottom:30px;

  border:1px solid
    rgba(255,255,255,.08);
">

<div>

<h1 style="
  color:#f8fafc;
  margin:0;
  font-size:22px;
">

  إدارة الامتحانات

</h1>

<p style="
  color:#94a3b8;
  margin:8px 0 0;
">

  عرض وتعديل وحذف وفتح وغلق وتحميل الامتحانات PDF

</p>

</div>

</div>


<div id="firebaseExamsList">

  جاري تحميل الامتحانات...

</div>

`;

}


// ======================================================
// AUTO LOAD
// ======================================================

function scheduleAutoLoad() {

  if (autoLoadTimer) {

    clearTimeout(
      autoLoadTimer
    );

    autoLoadTimer =
      null;

  }


  let attempts = 0;

  const maxAttempts = 50;


  const tryLoad = async () => {

    attempts++;


    const container =
      document.querySelector(
        "#firebaseExamsList"
      );


    if (
      container &&
      document.body.contains(
        container
      )
    ) {

      try {

        await loadExamsList();

      }
      catch (error) {

        console.error(
          "AUTO LOAD EXAMS ERROR:",
          error
        );

      }

      return;

    }


    if (
      attempts <
      maxAttempts
    ) {

      autoLoadTimer =
        setTimeout(
          tryLoad,
          50
        );

    }

  };


  autoLoadTimer =
    setTimeout(
      tryLoad,
      0
    );

}


// ======================================================
// LOAD EXAMS LIST
// ======================================================

export async function loadExamsList() {

  const container =
    document.querySelector(
      "#firebaseExamsList"
    );


  if (!container) {

    console.warn(
      "⚠️ EXAMS LIST CONTAINER NOT FOUND"
    );

    return;

  }


  if (!document.body.contains(container)) {

    return;

  }


  if (loadingExamsPromise) {

    try {

      await loadingExamsPromise;

    }
    catch {

      // handled

    }

    return;

  }


  loadingExamsPromise =
    loadExamsListInternal(
      container
    );


  try {

    await loadingExamsPromise;

  }
  finally {

    loadingExamsPromise =
      null;

  }

}


// ======================================================
// INTERNAL LOAD
// ======================================================

async function loadExamsListInternal(
  container
) {

  try {

    if (
      !container ||
      !document.body.contains(container)
    ) {

      return;

    }


    renderLoading(
      container
    );


    await yieldToBrowser();


    console.log(
      "======================================"
    );

    console.log(
      "🔥 GET EXAMS FROM FIRESTORE"
    );


    const firebaseExams =
      await getExams();


    console.log(
      "✅ FIRESTORE EXAMS:",
      Array.isArray(firebaseExams)
        ? firebaseExams.length
        : 0
    );


    let localExams = [];


    try {

      const stored =
        localStorage.getItem(
          "app_exams"
        );


      if (stored) {

        const parsed =
          JSON.parse(
            stored
          );


        if (
          Array.isArray(parsed)
        ) {

          localExams =
            parsed;

        }

      }

    }
    catch (error) {

      console.warn(
        "LOCAL EXAMS READ ERROR:",
        error
      );

      localExams = [];

    }


    const firestoreList =
      Array.isArray(firebaseExams)
        ? firebaseExams.map(
            exam => ({
              ...exam,
              source:"firebase"
            })
          )
        : [];


    const firestoreIds =
      new Set(
        firestoreList.map(
          exam =>
            getExamId(exam)
        )
        .filter(Boolean)
        .map(String)
      );


    const localList =
      Array.isArray(localExams)
        ? localExams
            .filter(
              exam => {

                const id =
                  getExamId(exam);

                if (!id) {

                  return true;

                }

                return !firestoreIds.has(
                  String(id)
                );

              }
            )
            .map(
              exam => ({
                ...exam,
                source:"local"
              })
            )
        : [];


    examsCache = [
      ...firestoreList,
      ...localList
    ];


    console.log(
      "📚 TOTAL EXAMS:",
      examsCache.length
    );


    if (
      !container ||
      !document.body.contains(container)
    ) {

      return;

    }


    renderExams(
      container
    );


  }
  catch (error) {

    console.error(
      "======================================"
    );

    console.error(
      "❌ LOAD EXAMS ERROR:",
      error
    );

    console.error(
      "MESSAGE:",
      error?.message
    );

    console.error(
      "CODE:",
      error?.code
    );

    console.error(
      "======================================"
    );


    renderError(
      container,
      error
    );

  }

}


// ======================================================
// EVENTS
// ======================================================

function attachEvents() {

  if (eventsAttached) {

    return;

  }


  eventsAttached =
    true;


  document.addEventListener(
    "click",
    async e => {

      const app =
        document.querySelector(
          "#app"
        );


      if (!app) return;


      // ==================================================
      // RETRY
      // ==================================================

      const retry =
        e.target.closest(
          "#btnRetryExams"
        );


      if (retry) {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();


        await loadExamsList();

        return;

      }


      // ==================================================
      // PDF
      // ==================================================

      const pdf =
        e.target.closest(
          ".pdfExam"
        );


      if (pdf) {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();


        if (
          pdf.dataset.busy ===
          "true"
        ) {

          return;

        }


        const id =
          pdf.dataset.id;


        const exam =
          findExamById(
            id
          );


        if (!exam) {

          alert(
            "❌ لم يتم العثور على الامتحان."
          );

          return;

        }


        showPdfMenu(
          pdf,
          exam
        );


        return;

      }


      // ==================================================
      // TOGGLE
      // ==================================================

      const toggle =
        e.target.closest(
          ".toggleExam"
        );


      if (toggle) {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();


        if (
          toggle.dataset.busy ===
          "true"
        ) {

          return;

        }


        toggle.dataset.busy =
          "true";


        const id =
          toggle.dataset.id;


        const source =
          toggle.dataset.source;


        const currentlyOpen =
          toggle.dataset.open ===
          "true";


        const newStatus =
          !currentlyOpen;


        try {

          toggle.disabled =
            true;


          toggle.textContent =
            "جاري التحديث...";


          if (
            source ===
            "firebase"
          ) {

            await updateExam(
              id,
              {
                isPublished:
                  newStatus,

                published:
                  newStatus
              }
            );

          }
          else {

            let exams = [];


            try {

              exams =
                JSON.parse(
                  localStorage.getItem(
                    "app_exams"
                  )
                ) || [];

            }
            catch {

              exams = [];

            }


            exams =
              Array.isArray(exams)
                ? exams
                : [];


            exams =
              exams.map(
                exam => {

                  const examId =
                    getExamId(
                      exam
                    );


                  if (
                    String(examId) ===
                    String(id)
                  ) {

                    return {
                      ...exam,

                      isPublished:
                        newStatus,

                      published:
                        newStatus
                    };

                  }


                  return exam;

                }
              );


            localStorage.setItem(
              "app_exams",
              JSON.stringify(
                exams
              )
            );

          }


          const cachedExam =
            findExamById(
              id
            );


          if (cachedExam) {

            cachedExam.isPublished =
              newStatus;

            cachedExam.published =
              newStatus;

          }


          await loadExamsList();

        }
        catch (error) {

          console.error(
            "TOGGLE EXAM ERROR:",
            error
          );


          alert(
            "حدث خطأ أثناء تغيير حالة الامتحان.\n\n" +
            (
              error?.message ||
              ""
            )
          );


        }
        finally {

          toggle.disabled =
            false;

          toggle.dataset.busy =
            "false";

        }


        return;

      }


      // ==================================================
      // BACK TO DASHBOARD
      // ==================================================

      const back =
        e.target.closest(
          "#btnBackToDashboard"
        );


      if (back) {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();


        app.innerHTML =
          adminPage();


        return;

      }


      // ==================================================
      // EDIT
      // ==================================================

      const edit =
        e.target.closest(
          ".editExam"
        );


      if (edit) {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();


        const id =
          edit.dataset.id;


        const exam =
          findExamById(
            id
          );


        if (!exam) {

          alert(
            "❌ لم يتم العثور على الامتحان."
          );

          return;

        }


        setExamToEdit(
          exam
        );


        app.innerHTML =
          createExamPage();


        await yieldToBrowser();


        try {

          const module =
            await import(
              "./createExamEvents.js"
            );


          if (
            typeof module.createExamEvents ===
            "function"
          ) {

            module.createExamEvents();

          }

        }
        catch (error) {

          console.error(
            "CREATE EXAM EVENTS ERROR:",
            error
          );


          alert(
            "❌ تعذر فتح صفحة تعديل الامتحان."
          );

        }


        return;

      }


      // ==================================================
      // DELETE
      // ==================================================

      const del =
        e.target.closest(
          ".deleteExam"
        );


      if (del) {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();


        if (
          del.dataset.busy ===
          "true"
        ) {

          return;

        }


        const confirmed =
          confirm(
            "هل تريد حذف الامتحان؟"
          );


        if (!confirmed) {

          return;

        }


        del.dataset.busy =
          "true";


        del.disabled =
          true;


        const id =
          del.dataset.id;


        const source =
          del.dataset.source;


        try {

          if (
            source ===
            "firebase"
          ) {

            await deleteExam(
              id
            );

          }
          else {

            let exams = [];


            try {

              exams =
                JSON.parse(
                  localStorage.getItem(
                    "app_exams"
                  )
                ) || [];

            }
            catch {

              exams = [];

            }


            exams =
              Array.isArray(exams)
                ? exams
                : [];


            exams =
              exams.filter(
                exam => {

                  const examId =
                    getExamId(
                      exam
                    );


                  return (
                    String(examId) !==
                    String(id)
                  );

                }
              );


            localStorage.setItem(
              "app_exams",
              JSON.stringify(
                exams
              )
            );

          }


          examsCache =
            examsCache.filter(
              exam =>
                getExamId(exam) !==
                String(id)
            );


          await loadExamsList();

        }
        catch (error) {

          console.error(
            "DELETE EXAM ERROR:",
            error
          );


          alert(
            "حدث خطأ أثناء حذف الامتحان.\n\n" +
            (
              error?.message ||
              ""
            )
          );

        }
        finally {

          del.dataset.busy =
            "false";

          del.disabled =
            false;

        }


        return;

      }

    },
    true
  );

}


// ======================================================
// ATTACH EVENTS
// ======================================================

attachEvents();


// ======================================================
// OPTIONAL GLOBAL REFRESH
// ======================================================

export async function refreshExamsList() {

  examsCache = [];

  await loadExamsList();

}


// ======================================================
// DEFAULT EXPORT
// ======================================================

export default {

  examsListPage,

  loadExamsList,

  refreshExamsList

};