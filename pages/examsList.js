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
  createExamEvents
} from "./createExamEvents.js";

import {
  adminPage
} from "./admin.js";

let examsCache = [];


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


// ======================================================
// CREATE PRINTABLE PDF PAGE
// ======================================================

function printExamAsPDF(exam) {

  if (!exam) {
    alert("❌ لم يتم العثور على الامتحان.");
    return;
  }

  const questions =
    Array.isArray(exam.questions)
      ? exam.questions
      : [];

  if (!questions.length) {
    alert("❌ الامتحان لا يحتوي على أسئلة.");
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
        (question, index) => {

          const text =
            question.question ??
            question.text ??
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


          const optionsHTML =
            options
              .map(
                (option, optionIndex) => {

                  if (
                    option === null ||
                    option === undefined ||
                    String(option).trim() === ""
                  ) {
                    return "";
                  }

                  const letters = [
                    "أ",
                    "ب",
                    "ج",
                    "د"
                  ];

                  return `
                    <div class="option">
                      <span class="optionLetter">
                        ${letters[optionIndex] || ""}
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


          return `
            <div class="question">

              <div class="questionNumber">
                السؤال ${index + 1}
              </div>

              <div class="questionText">
                ${escapeHtml(text)}
              </div>

              ${imageHTML}

              <div class="options">
                ${optionsHTML}
              </div>

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
  size: A4;
  margin: 15mm;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {

  font-family:
    "Tahoma",
    "Arial",
    sans-serif;

  direction: rtl;

  background: white;

  color: #111;

  font-size: 14px;

  line-height: 1.8;
}

.examHeader {

  text-align: center;

  border-bottom:
    2px solid #111;

  padding-bottom: 15px;

  margin-bottom: 20px;
}

.examTitle {

  font-size: 25px;

  font-weight: 800;

  margin-bottom: 8px;
}

.examMeta {

  display: flex;

  justify-content:
    space-between;

  gap: 15px;

  font-size: 13px;

  font-weight: 600;

  margin-top: 12px;
}

.studentInfo {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 18px;

  margin-bottom: 25px;
}

.studentField {

  border-bottom:
    1px solid #555;

  padding: 5px;

  min-height: 32px;
}

.question {

  page-break-inside:
    avoid;

  break-inside:
    avoid;

  margin-bottom: 22px;

  border-bottom:
    1px solid #ddd;

  padding-bottom: 16px;
}

.questionNumber {

  font-weight: 800;

  font-size: 16px;

  margin-bottom: 6px;
}

.questionText {

  font-size: 16px;

  font-weight: 600;

  margin-bottom: 10px;

  white-space: pre-wrap;
}

.questionImage {

  text-align: center;

  margin: 12px 0;
}

.questionImage img {

  max-width: 100%;

  max-height: 260px;

  object-fit: contain;
}

.options {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 8px 25px;

  margin-top: 10px;
}

.option {

  display: flex;

  align-items:
    flex-start;

  gap: 8px;

  font-size: 15px;

  min-height: 30px;
}

.optionLetter {

  min-width: 25px;

  height: 25px;

  border:
    1px solid #222;

  border-radius: 50%;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  font-weight: 700;
}

.footer {

  margin-top: 30px;

  padding-top: 10px;

  border-top:
    1px solid #999;

  text-align: center;

  font-size: 11px;

  color: #555;
}

@media print {

  body {
    -webkit-print-color-adjust:
      exact;

    print-color-adjust:
      exact;
  }

  .question {
    page-break-inside:
      avoid;
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
  function () {

    setTimeout(
      function () {

        window.print();

      },
      500
    );

  }
);

window.addEventListener(
  "afterprint",
  function () {

    setTimeout(
      function () {

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
// PAGE
// ======================================================

export function examsListPage() {

  return `

<div style="margin-bottom:20px;">

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
  background:linear-gradient(135deg,#1e293b,#0f172a);
  border-radius:24px;
  padding:25px 30px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:30px;
  border:1px solid rgba(255,255,255,.08);
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
// LOAD EXAMS
// ======================================================

export async function loadExamsList() {

  const container =
    document.querySelector(
      "#firebaseExamsList"
    );

  if (!container) return;


  try {

    const firebaseExams =
      await getExams();


    let localExams = [];

    try {

      localExams =
        JSON.parse(
          localStorage.getItem(
            "app_exams"
          )
        ) || [];

    } catch {

      localExams = [];

    }


    examsCache = [

      ...firebaseExams.map(
        exam => ({
          ...exam,
          source: "firebase"
        })
      ),

      ...localExams.map(
        exam => ({
          ...exam,
          source: "local"
        })
      )

    ];


    if (!examsCache.length) {

      container.innerHTML = `

<div style="
  padding:40px;
  text-align:center;
  color:#94a3b8;
">

لا توجد امتحانات

</div>

`;

      return;

    }


    container.innerHTML =
      examsCache
        .map(
          (exam) => {

            const isOpen =
              exam.isPublished !== false &&
              exam.isPublished !== "false";


            const examId =
              exam.firestoreId ||
              exam.id;


            return `

<div
  class="examManagementCard"
  data-exam-id="${escapeHtml(examId)}"
  style="
    background:linear-gradient(135deg,#1e293b,#0f172a);
    border-radius:20px;
    padding:22px;
    margin-bottom:15px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    flex-wrap:wrap;
    gap:15px;
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

${escapeHtml(exam.className || "عام")}

</span>


<span style="
  background:#065f46;
  color:#6ee7b7;
  padding:5px 12px;
  border-radius:8px;
  font-size:12px;
  margin-right:5px;
">

${escapeHtml(exam.subject || "physics")}

</span>


<span
  class="examStatus"
  style="
    background:${isOpen ? "#064e3b" : "#7f1d1d"};
    color:${isOpen ? "#6ee7b7" : "#fca5a5"};
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

${escapeHtml(exam.title || "امتحان بدون اسم")}

</h3>


<p style="
  color:#94a3b8;
  font-size:13px;
">

المدة:
${escapeHtml(exam.duration || 0)}
دقائق

|

الأسئلة:
${exam.questions?.length || 0}

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
  data-source="${escapeHtml(exam.source)}"
  data-open="${isOpen}"
  style="
    background:${isOpen ? "#991b1b" : "#047857"};
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
    ? "🔒 غلق "
    : "🔓 فتح "
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

تعديل

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
  data-source="${escapeHtml(exam.source)}"
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

حذف

</button>


</div>


</div>

`;

          }
        )
        .join("");


  } catch (error) {

    console.error(
      "LOAD EXAMS ERROR:",
      error
    );


    container.innerHTML = `

<div style="
  color:#ef4444;
  padding:30px;
  text-align:center;
">

حدث خطأ في تحميل الامتحانات

<br>

<span style="
  font-size:12px;
  color:#94a3b8;
">

${escapeHtml(error?.message || "")}

</span>

</div>

`;

  }

}


// ======================================================
// EVENTS
// ======================================================

document.addEventListener(
  "click",
  async (e) => {

    const app =
      document.querySelector(
        "#app"
      );

    if (!app) return;


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
        pdf.dataset.busy === "true"
      ) {
        return;
      }

      pdf.dataset.busy = "true";

      const id =
        pdf.dataset.id;

      const exam =
        examsCache.find(
          x =>
            String(
              x.firestoreId ||
              x.id
            ) ===
            String(id)
        );

      if (!exam) {

        pdf.dataset.busy = "false";

        alert(
          "❌ لم يتم العثور على الامتحان."
        );

        return;
      }

      try {

        printExamAsPDF(exam);

      } catch (error) {

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

      } finally {

        pdf.dataset.busy = "false";

      }

      return;

    }


    // ==================================================
    // TOGGLE OPEN / CLOSE
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
        toggle.dataset.busy === "true"
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
        toggle.dataset.open === "true";


      const newStatus =
        !currentlyOpen;


      const card =
        toggle.closest(
          ".examManagementCard"
        );


      const status =
        card?.querySelector(
          ".examStatus"
        );


      const oldText =
        toggle.textContent;


      toggle.disabled =
        true;


      toggle.textContent =
        "جاري التحديث...";


      try {

        if (
          source === "firebase"
        ) {

          await updateExam(
            id,
            {
              isPublished:
                newStatus
            }
          );

        } else {

          let exams =
            JSON.parse(
              localStorage.getItem(
                "app_exams"
              )
            ) || [];


          exams =
            exams.map(
              exam => {

                const examId =
                  exam.firestoreId ||
                  exam.id;


                if (
                  String(examId) ===
                  String(id)
                ) {

                  return {
                    ...exam,
                    isPublished:
                      newStatus
                  };

                }


                return exam;

              }
            );


          localStorage.setItem(
            "app_exams",
            JSON.stringify(exams)
          );

        }


        examsCache =
          examsCache.map(
            exam => {

              const examId =
                exam.firestoreId ||
                exam.id;


              if (
                String(examId) ===
                String(id)
              ) {

                return {
                  ...exam,
                  isPublished:
                    newStatus
                };

              }


              return exam;

            }
          );


        toggle.dataset.open =
          String(newStatus);


        toggle.style.background =
          newStatus
            ? "#991b1b"
            : "#047857";


        toggle.textContent =
          newStatus
            ? "🔒 غلق "
            : "🔓 فتح ";


        if (status) {

          status.style.background =
            newStatus
              ? "#064e3b"
              : "#7f1d1d";


          status.style.color =
            newStatus
              ? "#6ee7b7"
              : "#fca5a5";


          status.textContent =
            newStatus
              ? "🟢 مفتوح للطلاب"
              : "🔴 مغلق عن الطلاب";

        }


        toggle.disabled =
          false;


        toggle.dataset.busy =
          "false";

      } catch (error) {

        console.error(
          "TOGGLE EXAM ERROR:",
          error
        );


        toggle.disabled =
          false;


        toggle.dataset.busy =
          "false";


        toggle.dataset.open =
          String(currentlyOpen);


        toggle.textContent =
          oldText;


        alert(
          "حدث خطأ أثناء تغيير حالة الامتحان.\n\n" +
          (error?.message || "")
        );

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
        examsCache.find(
          x =>
            String(
              x.firestoreId ||
              x.id
            ) ===
            String(id)
        );


      if (exam) {

        setExamToEdit(
          exam
        );


        app.innerHTML =
          createExamPage();


        createExamEvents();

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
        !confirm(
          "هل تريد حذف الامتحان؟"
        )
      ) {

        return;

      }


      const id =
        del.dataset.id;


      const source =
        del.dataset.source;


      try {

        if (
          source === "firebase"
        ) {

          await deleteExam(
            id
          );

        } else {

          let exams =
            JSON.parse(
              localStorage.getItem(
                "app_exams"
              )
            ) || [];


          exams =
            exams.filter(
              exam =>
                String(
                  exam.id
                ) !==
                String(id)
            );


          localStorage.setItem(
            "app_exams",
            JSON.stringify(exams)
          );

        }


        await loadExamsList();

      } catch (error) {

        console.error(
          "DELETE EXAM ERROR:",
          error
        );


        alert(
          "حدث خطأ أثناء حذف الامتحان.\n\n" +
          (error?.message || "")
        );

      }


      return;

    }

  },
  true
);