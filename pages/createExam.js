// pages/createExam.js

import { addExam } from "../services/examService.js";

let editingExamData = null;

// ======================================================
// EDIT MODE
// ======================================================

export function setExamToEdit(exam) {
  editingExamData = exam || null;
}

export function clearEditingExam() {
  editingExamData = null;
}

// ======================================================
// CREATE EXAM PAGE
// ======================================================

export function createExamPage() {

  const isEdit = !!editingExamData;

  return `

<style>

.eb{
  --ink-950:#0a0f1c;
  --ink-900:#111a2e;
  --ink-800:#1a2440;
  --ink-700:#243057;
  --line:#2a3559;
  --paper:#eef1f8;
  --muted:#93a0c2;
  --gold:#e8b34c;
  --pass:#31c07a;
  --fail:#ef4a63;

  font-family:'Tajawal',sans-serif;
  color:var(--paper);
  max-width:900px;
  margin:auto;
  padding:30px 20px 60px;
}

.eb *{
  box-sizing:border-box;
}

.eb-hero{
  background:
    radial-gradient(
      600px 200px at 15% 0%,
      rgba(232,179,76,.14),
      transparent 60%
    ),
    linear-gradient(
      150deg,
      #0a0f1c,
      #141f3d 65%,
      #1c2a52
    );

  border:1px solid var(--line);
  border-radius:22px;
  padding:26px 28px;
  margin-bottom:22px;
}

.eb-hero h2{
  font-family:'Cairo',sans-serif;
  font-weight:800;
  font-size:23px;
  margin:0 0 4px;
}

.eb-hero span{
  color:var(--muted);
  font-size:13px;
}

.eb-panel{
  background:var(--ink-900);
  border:1px solid var(--line);
  border-radius:20px;
  padding:26px;
  margin-bottom:22px;
}

.eb-grid2{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px;
}

@media(max-width:640px){
  .eb-grid2{
    grid-template-columns:1fr;
  }
}

.eb-field{
  display:flex;
  flex-direction:column;
  gap:8px;
  margin-bottom:18px;
}

.eb-field label{
  font-size:13px;
  font-weight:700;
  color:var(--gold);
}

.eb-field input,
.eb-field select{
  width:100%;
  padding:12px 14px;
  border-radius:12px;
  border:1px solid var(--line);
  background:var(--ink-800);
  color:var(--paper);
  font-family:'Tajawal',sans-serif;
  font-size:14px;
}

.eb-field input:focus-visible,
.eb-field select:focus-visible{
  outline:2px solid var(--gold);
  outline-offset:1px;
}

.eb-qhead{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  margin-bottom:24px;
}

.eb-qhead h3{
  font-family:'Cairo',sans-serif;
  font-weight:800;
  font-size:19px;
  margin:0;
}

.eb-qhead span{
  color:var(--muted);
  font-size:13px;
}

.eb-empty{
  color:var(--muted);
  text-align:center;
  padding:36px 20px;
  border:1px dashed var(--line);
  border-radius:16px;
}

.eb-empty b{
  display:block;
  color:var(--paper);
  font-size:16px;
  margin-bottom:4px;
}

.eb-btn{
  padding:13px 20px;
  border-radius:12px;
  border:1px solid var(--line);
  background:var(--ink-800);
  color:var(--paper);
  font-family:'Tajawal',sans-serif;
  font-weight:700;
  font-size:14px;
  cursor:pointer;
}

.eb-btn:hover{
  filter:brightness(1.15);
}

.eb-btn-add{
  width:100%;
  margin-top:6px;
  border:1.5px dashed var(--line);
  background:transparent;
  color:var(--muted);
}

.eb-btn-add:hover{
  border-color:var(--gold);
  color:var(--gold);
}

.eb-btn-save{
  width:100%;
  padding:16px;
  font-size:17px;
  font-weight:700;
  font-family:'Cairo',sans-serif;
  background:linear-gradient(
    135deg,
    #1fa968,
    #31c07a
  );
  border-color:transparent;
  color:#062015;
}

.eb-btn-back{
  width:100%;
  margin-top:12px;
  background:transparent;
  color:var(--muted);
}

.question-card{
  background:var(--ink-800);
  border:1px solid var(--line);
  border-radius:16px;
  padding:20px;
  margin-top:16px;
}

.question-card-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:16px;
}

.question-number{
  width:32px;
  height:32px;
  border-radius:50%;
  background:var(--ink-700);
  border:1px solid var(--line);
  display:flex;
  align-items:center;
  justify-content:center;
  color:var(--gold);
  font-weight:700;
}

.removeQuestion{
  background:transparent;
  color:var(--fail);
  border:1px solid var(--fail);
  padding:7px 14px;
  border-radius:10px;
  cursor:pointer;
}

.q-text{
  width:100%;
  min-height:90px;
  padding:12px 14px;
  border-radius:12px;
  border:1px solid var(--line);
  background:var(--ink-900);
  color:var(--paper);
  font-family:'Tajawal',sans-serif;
  font-size:14px;
  resize:vertical;
}

.q-type-select{
  width:100%;
  padding:10px 14px;
  margin-top:14px;
  border-radius:10px;
  border:1px solid var(--line);
  background:var(--ink-900);
  color:var(--paper);
  font-family:'Tajawal',sans-serif;
}

.mcq-options{
  margin-top:16px;
}

.option-row{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:10px;
}

.q-correct-radio{
  width:20px;
  height:20px;
  accent-color:var(--pass);
  cursor:pointer;
}

.opt-text{
  flex:1;
  padding:10px 14px;
  border-radius:10px;
  border:1px solid var(--line);
  background:var(--ink-900);
  color:var(--paper);
  font-family:'Tajawal',sans-serif;
}

.q-score-row{
  margin-top:16px;
  display:flex;
  align-items:center;
  gap:10px;
}

.q-score{
  width:80px;
  padding:8px 10px;
  border-radius:10px;
  border:1px solid var(--line);
  background:var(--ink-900);
  color:var(--paper);
}

.question-image-preview{
  max-width:220px;
  max-height:180px;
  border-radius:12px;
  border:1px solid var(--line);
  margin-top:10px;
  display:block;
}

</style>


<div class="eb" dir="rtl">

  <div class="eb-hero">

    <h2>
      ${isEdit ? "✏️ تعديل الامتحان" : "➕ إنشاء امتحان جديد"}
    </h2>

    <span>
      ${isEdit
        ? "تعديل بيانات وأسئلة الامتحان"
        : "إنشاء اختبار جديد للطلاب"}
    </span>

  </div>


  <!-- ============================================== -->
  <!-- EXAM DATA -->
  <!-- ============================================== -->

  <div class="eb-panel">

    <div class="eb-grid2">

      <div class="eb-field">

        <label>
          عنوان الامتحان
        </label>

        <input
          id="examTitle"
          value="${isEdit
            ? escapeHtml(editingExamData?.title || "")
            : ""}"
          placeholder="مثال: اختبار الفيزياء الأول"
        >

      </div>


      <div class="eb-field">

        <label>
          المادة
        </label>

        <select id="examSubject">

          <option
            value="physics"
            ${
              isEdit &&
              String(editingExamData?.subject || "").toLowerCase() ===
              "physics"
                ? "selected"
                : ""
            }
          >
            فيزياء
          </option>

          <option
            value="chemistry"
            ${
              isEdit &&
              String(editingExamData?.subject || "").toLowerCase() ===
              "chemistry"
                ? "selected"
                : ""
            }
          >
            كيمياء
          </option>

        </select>

      </div>

    </div>


    <div class="eb-grid2">

      <div class="eb-field">

        <label>
          الصف
        </label>

        <select id="examClass">

          <option
            value="الصف الأول الثانوي"
            ${
              isEdit &&
              editingExamData?.className ===
              "الصف الأول الثانوي"
                ? "selected"
                : ""
            }
          >
            الصف الأول الثانوي
          </option>

          <option
            value="الصف الثاني الثانوي"
            ${
              isEdit &&
              editingExamData?.className ===
              "الصف الثاني الثانوي"
                ? "selected"
                : ""
            }
          >
            الصف الثاني الثانوي
          </option>

          <option
            value="الصف الثالث الثانوي"
            ${
              isEdit &&
              editingExamData?.className ===
              "الصف الثالث الثانوي"
                ? "selected"
                : ""
            }
          >
            الصف الثالث الثانوي
          </option>

        </select>

      </div>


      <div class="eb-field">

        <label>
          مدة الامتحان بالدقائق
        </label>

        <input
          type="number"
          id="examDuration"
          min="1"
          value="${
            isEdit
              ? Number(editingExamData?.duration) || 60
              : 60
          }"
        >

      </div>

    </div>


    <div class="eb-grid2">

      <div class="eb-field">

        <label>
          درجة النجاح
        </label>

        <input
          type="number"
          id="examPassingScore"
          min="0"
          value="${
            isEdit
              ? Number(editingExamData?.passingScore) || 50
              : 50
          }"
        >

      </div>


      <div class="eb-field">

        <label>
          تاريخ بداية الامتحان
        </label>

        <input
          type="datetime-local"
          id="examStartDate"
          value="${
            isEdit
              ? editingExamData?.startDate || ""
              : ""
          }"
        >

      </div>

    </div>


    <div class="eb-field">

      <label>
        تاريخ نهاية الامتحان
      </label>

      <input
        type="datetime-local"
        id="examEndDate"
        value="${
          isEdit
            ? editingExamData?.endDate || ""
            : ""
        }"
      >

    </div>

  </div>


  <!-- ============================================== -->
  <!-- QUESTIONS -->
  <!-- ============================================== -->

  <div class="eb-panel">

    <div class="eb-qhead">

      <h3>
        📝 أسئلة الامتحان
      </h3>

      <span>
        أضف الأسئلة وحدد الإجابة الصحيحة
      </span>

    </div>


    <div id="questionsList">

      ${
        isEdit &&
        Array.isArray(editingExamData?.questions) &&
        editingExamData.questions.length

          ? editingExamData.questions
              .map(
                (q, i) =>
                  createQuestionTemplate(
                    i + 1,
                    q
                  )
              )
              .join("")

          : `
            <div class="eb-empty">

              <b>
                لا توجد أسئلة
              </b>

              أضف سؤال جديد للبدء

            </div>
          `
      }

    </div>


    <button
      id="btnAddQuestion"
      type="button"
      class="eb-btn eb-btn-add"
    >
      ➕ إضافة سؤال
    </button>

  </div>


  <!-- ============================================== -->
  <!-- ACTIONS -->
  <!-- ============================================== -->

  <div class="eb-panel">

    <button
      id="btnSaveExam"
      type="button"
      class="eb-btn eb-btn-save"
    >
      💾 ${isEdit ? "حفظ التعديلات" : "حفظ الامتحان"}
    </button>


    <button
      id="btnBackToList"
      type="button"
      class="eb-btn eb-btn-back"
    >
      ⬅ رجوع
    </button>

  </div>

</div>

`;
}


// ======================================================
// QUESTION TEMPLATE
// ======================================================

export function createQuestionTemplate(index, question = {}) {

  const options =
    Array.isArray(question.options)
      ? question.options
      : ["", "", "", ""];


  const correctIndex =
    Number.isInteger(
      Number(
        question.correctAnswerIndex
      )
    )
      ? Number(question.correctAnswerIndex)
      : Number(question.correctIndex || 0);


  const questionText =
    question.text ||
    question.question ||
    question.title ||
    "";


  const score =
    Number(question.score) || 1;


  const type =
    question.type || "mcq";


  return `

  <div
    class="question-card"
    data-question-index="${index}"
  >

    <div class="question-card-header">

      <div style="
        display:flex;
        align-items:center;
        gap:10px;
      ">

        <div class="question-number">
          ${index}
        </div>

        <strong>
          السؤال ${index}
        </strong>

      </div>


      <button
        type="button"
        class="removeQuestion"
      >
        حذف
      </button>

    </div>


    <textarea
      class="q-text"
      placeholder="اكتب نص السؤال هنا..."
    >${escapeHtml(questionText)}</textarea>


    <select class="q-type-select">

      <option
        value="mcq"
        ${type === "mcq" ? "selected" : ""}
      >
        اختيار من متعدد
      </option>

      <option
        value="essay"
        ${type === "essay" ? "selected" : ""}
      >
        سؤال مقالي
      </option>

    </select>


    <div class="mcq-options">

      ${["A", "B", "C", "D"]
        .map((letter, i) => {

          return `

          <div class="option-row">

            <input
              type="radio"
              name="correct_${index}"
              class="q-correct-radio"
              value="${i}"
              ${
                correctIndex === i
                  ? "checked"
                  : ""
              }
            >

            <span style="
              width:25px;
              font-weight:bold;
              color:#e8b34c;
            ">
              ${letter}
            </span>

            <input
              type="text"
              class="opt-text"
              value="${escapeHtml(
                options[i] || ""
              )}"
              placeholder="الإجابة ${letter}"
            >

          </div>

          `;

        })
        .join("")}

    </div>


    <div class="q-score-row">

      <label>
        درجة السؤال:
      </label>

      <input
        type="number"
        class="q-score"
        min="1"
        value="${score}"
      >

    </div>


    ${
      question.image
        ? `
          <input
            type="hidden"
            class="q-image"
            value="${escapeHtml(question.image)}"
          >

          <img
            class="question-image-preview"
            src="${escapeHtml(question.image)}"
            alt="صورة السؤال"
          >
        `
        : `
          <input
            type="hidden"
            class="q-image"
            value=""
          >
        `
    }

  </div>

  `;
}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}