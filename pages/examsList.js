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
// PRINT EXAM AS PDF
// ======================================================

function printExamAsPDF(exam) {

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
    escapeHtml(
      exam.title ||
      "امتحان"
    );


  const className =
    escapeHtml(
      exam.className ||
      exam.grade ||
      "عام"
    );


  const subject =
    escapeHtml(
      exam.subject ||
      "Physics"
    );


  const duration =
    escapeHtml(
      exam.duration ||
      exam.examTime ||
      0
    );


  const questionsHTML =
    questions
      .map(
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
            Array.isArray(
              question.options
            )
              ? question.options
              : [
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


          const letters = [
            "أ",
            "ب",
            "ج",
            "د"
          ];


          const optionsHTML =
            options
              .map(
                (
                  option,
                  optionIndex
                ) => {

                  if (
                    option === null ||
                    option === undefined ||
                    String(option).trim() === ""
                  ) {

                    return "";

                  }


                  return `

                    <div class="option">

                      <span class="optionLetter">

                        ${
                          letters[
                            optionIndex
                          ] || ""
                        }

                      </span>

                      <span>
                        ${escapeHtml(option)}
                      </span>

                    </div>

                  `;

                }
              )
              .join("");


          const imageHTML =
            image
              ? `

                <div class="questionImage">

                  <img
                    src="${escapeHtml(image)}"
                    alt="صورة السؤال"
                  >

                </div>

              `
              : "";


          const type =
            question.type ||
            "mcq";


          return `

            <div class="question">

              <div class="questionNumber">
                السؤال ${index + 1}
              </div>

              <div class="questionText">
                ${escapeHtml(text)}
              </div>

              ${imageHTML}

              ${
                type === "essay"
                  ? `
                    <div class="essayAnswer">
                      مساحة إجابة الطالب:
                    </div>
                  `
                  : `
                    <div class="options">
                      ${optionsHTML}
                    </div>
                  `
              }

            </div>

          `;

        }
      )
      .join("");


  const printWindow =
    window.open(
      "",
      "_blank",
      "width=900,height=1100"
    );


  if (!printWindow) {

    alert(
      "❌ المتصفح منع نافذة الطباعة.\n\n" +
      "اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى."
    );

    return;

  }


  printWindow.document.open();

  printWindow.document.write(`

<!DOCTYPE html>

<html
  lang="ar"
  dir="rtl"
>

<head>

<meta charset="UTF-8">

<title>
${examTitle}
</title>

<style>

@page {

  size:A4;

  margin:15mm;

}

* {

  box-sizing:border-box;

}

html,
body {

  margin:0;
  padding:0;

}

body {

  font-family:
    Tahoma,
    Arial,
    sans-serif;

  direction:rtl;

  background:white;

  color:#111;

  font-size:14px;

  line-height:1.8;

}

.examHeader {

  text-align:center;

  border-bottom:2px solid #111;

  padding-bottom:15px;

  margin-bottom:20px;

}

.examTitle {

  font-size:25px;

  font-weight:800;

  margin-bottom:8px;

}

.examMeta {

  display:flex;

  justify-content:space-between;

  gap:15px;

  font-size:13px;

  font-weight:600;

  margin-top:12px;

}

.studentInfo {

  display:grid;

  grid-template-columns:1fr 1fr;

  gap:18px;

  margin-bottom:25px;

}

.studentField {

  border-bottom:1px solid #555;

  padding:5px;

  min-height:32px;

}

.question {

  page-break-inside:avoid;

  break-inside:avoid;

  margin-bottom:22px;

  border-bottom:1px solid #ddd;

  padding-bottom:16px;

}

.questionNumber {

  font-weight:800;

  font-size:16px;

  margin-bottom:6px;

}

.questionText {

  font-size:16px;

  font-weight:600;

  margin-bottom:10px;

  white-space:pre-wrap;

}

.questionImage {

  text-align:center;

  margin:12px 0;

}

.questionImage img {

  max-width:100%;

  max-height:260px;

  object-fit:contain;

}

.options {

  display:grid;

  grid-template-columns:1fr 1fr;

  gap:8px 25px;

  margin-top:10px;

}

.option {

  display:flex;

  align-items:flex-start;

  gap:8px;

  font-size:15px;

  min-height:30px;

}

.optionLetter {

  min-width:25px;

  height:25px;

  border:1px solid #222;

  border-radius:50%;

  display:inline-flex;

  align-items:center;

  justify-content:center;

  font-weight:700;

}

.essayAnswer {

  margin-top:20px;

  border:1px solid #aaa;

  min-height:130px;

  padding:10px;

  color:#555;

}

.footer {

  margin-top:30px;

  padding-top:10px;

  border-top:1px solid #999;

  text-align:center;

  font-size:11px;

  color:#555;

}

@media print {

  body {

    -webkit-print-color-adjust:exact;

    print-color-adjust:exact;

  }

}

</style>

</head>

<body>

<div class="examHeader">

  <div class="examTitle">
    ${examTitle}
  </div>

  <div class="examMeta">

    <span>
      الصف: ${className}
    </span>

    <span>
      المادة: ${subject}
    </span>

    <span>
      الزمن: ${duration} دقيقة
    </span>

  </div>

</div>


<div class="studentInfo">

  <div class="studentField">
    اسم الطالب:
  </div>

  <div class="studentField">
    الفصل:
  </div>

</div>


${questionsHTML}


<div class="footer">
  Ahmed.R Exams
</div>


<script>

window.addEventListener(
  "load",
  function() {

    setTimeout(
      function() {

        window.print();

      },
      500
    );

  }
);


window.addEventListener(
  "afterprint",
  function() {

    setTimeout(
      function() {

        window.close();

      },
      300
    );

  }
);

</script>

</body>

</html>

  `);

  printWindow.document.close();

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
    background:#b45309;
    color:white;
    border:none;
    padding:8px 14px;
    border-radius:10px;
    cursor:pointer;
    font-family:inherit;
    font-weight:700;
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

  /*
   * مهم:
   * عند استدعاء الصفحة يتم جدولة التحميل تلقائيًا.
   * وبالتالي لا نعتمد فقط على أن admin.js يستدعي
   * loadExamsList() بعد رسم الصفحة.
   */

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

    /*
     * لا نرمي error هنا.
     * الصفحة ربما لم تُرسم بعد.
     */

    return;

  }


  if (!document.body.contains(container)) {

    return;

  }


  /*
   * لو هناك تحميل حالي:
   * ننتظر نفس العملية بدل تشغيل طلب Firestore
   * ثاني في نفس الوقت.
   */

  if (loadingExamsPromise) {

    try {

      await loadingExamsPromise;

    }
    catch {

      // الخطأ تم التعامل معه داخل العملية الأصلية

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


    /*
     * هنا المصدر الأساسي هو Firestore.
     */

    const firebaseExams =
      await getExams();


    console.log(
      "✅ FIRESTORE EXAMS:",
      Array.isArray(firebaseExams)
        ? firebaseExams.length
        : 0
    );


    /*
     * localStorage موجود فقط كاحتياط
     * للامتحانات القديمة المحلية.
     */

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


    /*
     * Firestore أولًا.
     */

    const firestoreList =
      Array.isArray(firebaseExams)
        ? firebaseExams.map(
            exam => ({
              ...exam,
              source:"firebase"
            })
          )
        : [];


    /*
     * localStorage فقط للامتحانات التي
     * لا يوجد لها نفس ID في Firestore.
     */

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


        pdf.dataset.busy =
          "true";


        try {

          const id =
            pdf.dataset.id;


          const exam =
            findExamById(
              id
            );


          if (!exam) {

            throw new Error(
              "لم يتم العثور على الامتحان."
            );

          }


          printExamAsPDF(
            exam
          );

        }
        catch (error) {

          console.error(
            "PDF EXAM ERROR:",
            error
          );


          alert(
            "❌ حدث خطأ أثناء تجهيز PDF\n\n" +
            (
              error?.message ||
              ""
            )
          );

        }
        finally {

          pdf.dataset.busy =
            "false";

        }


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


          /*
           * تحديث الكاش فورًا.
           */

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


          /*
           * إزالة الامتحان من الكاش فورًا.
           */

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
// ATTACH EVENTS IMMEDIATELY
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