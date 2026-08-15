// pages/createExam.js

let editingExamData = null;

// ======================================================
// EDITING EXAM
// ======================================================

export function setExamToEdit(exam) {
  editingExamData = exam || null;
}

export function clearEditingExam() {
  editingExamData = null;
}

export function getEditingExam() {
  return editingExamData;
}

// ======================================================
// CREATE EXAM PAGE
// ======================================================

export function createExamPage() {

  const currentExam = editingExamData;
  const isEdit = !!currentExam;

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

.q-image-label{
  display:block;
  margin-top:16px;
  margin-bottom:8px;
  font-size:13px;
  color:var(--muted);
}

.q-image-file{
  width:100%;
  padding:10px 14px;
  border-radius:10px;
  border:1px dashed var(--line);
  background:var(--ink-900);
  color:var(--paper);
  font-family:'Tajawal',sans-serif;
  font-size:13px;
  cursor:pointer;
}

/* =====================================================
   IMAGE BOX
===================================================== */

.question-image-box{
  position:relative;
  display:inline-block;
  margin-top:12px;
  max-width:240px;
}

.question-image-preview{
  max-width:240px;
  max-height:190px;
  border-radius:12px;
  border:1px solid var(--line);
  display:block;
  object-fit:contain;
  background:#0a0f1c;
}

/* زر إلغاء الصورة */

.removeQuestionImage{
  position:absolute;
  top:-9px;
  left:-9px;

  width:28px;
  height:28px;

  border-radius:50%;
  border:2px solid #fff;

  background:var(--fail);
  color:#fff;

  font-size:17px;
  font-weight:900;

  display:flex;
  align-items:center;
  justify-content:center;

  cursor:pointer;

  z-index:10;

  box-shadow:0 3px 10px rgba(0,0,0,.35);
}

.removeQuestionImage:hover{
  transform:scale(1.08);
  filter:brightness(1.1);
}

.essay-note{
  margin-top:16px;
  padding:14px;
  border-radius:10px;
  background:var(--ink-900);
  border:1px solid var(--line);
  color:var(--muted);
  font-size:13.5px;
  line-height:1.7;
}

</style>

<div class="eb" dir="rtl">

  <div class="eb-hero">

    <h2>
      ${
        isEdit
          ? "✏️ تعديل الامتحان"
          : "➕ إنشاء امتحان جديد"
      }
    </h2>

    <span>
      ${
        isEdit
          ? "تعديل بيانات وأسئلة الامتحان"
          : "إنشاء اختبار جديد للطلاب"
      }
    </span>

  </div>


  <!-- ================================================== -->
  <!-- EXAM INFO -->
  <!-- ================================================== -->

  <div class="eb-panel">

    <div class="eb-grid2">

      <div class="eb-field">

        <label>
          عنوان الامتحان
        </label>

        <input
          id="examTitle"
          value="${
            isEdit
              ? escapeHtml(
                  currentExam?.title || ""
                )
              : ""
          }"
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
              String(
                currentExam?.subject || ""
              ).toLowerCase() === "physics"
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
              String(
                currentExam?.subject || ""
              ).toLowerCase() === "chemistry"
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
              currentExam?.className ===
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
              currentExam?.className ===
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
              currentExam?.className ===
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
              ? Number(
                  currentExam?.duration
                ) || 60
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
              ? Number(
                  currentExam?.passingScore
                ) || 50
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
              ? currentExam?.startDate || ""
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
            ? currentExam?.endDate || ""
            : ""
        }"
      >

    </div>

  </div>


  <!-- ================================================== -->
  <!-- QUESTIONS -->
  <!-- ================================================== -->

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
        Array.isArray(
          currentExam?.questions
        ) &&
        currentExam.questions.length

          ? currentExam.questions
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


  <!-- ================================================== -->
  <!-- SAVE -->
  <!-- ================================================== -->

  <div class="eb-panel">

    <button
      id="btnSaveExam"
      type="button"
      class="eb-btn eb-btn-save"
    >
      💾 ${
        isEdit
          ? "حفظ التعديلات"
          : "حفظ الامتحان"
      }
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

export function createQuestionTemplate(
  index,
  question = {}
) {

  const options =
    getQuestionOptionsForEditor(
      question
    );

  const correctIndex =
    getCorrectIndexForEditor(
      question,
      options
    );

  const questionText =
    question.text ||
    question.question ||
    question.title ||
    "";

  const score =
    Number(
      question.score ??
      question.points ??
      question.maxScore ??
      question.grade ??
      1
    ) || 1;

  const type =
    getQuestionTypeForEditor(
      question,
      options
    );

  const image =
    question.image ||
    question.questionImage ||
    question.imageUrl ||
    "";

  return `

  <div
    class="question-card"
    data-question-index="${index}"
    ${
      question.id
        ? `data-question-id="${escapeHtml(
            question.id
          )}"`
        : ""
    }
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
        ${
          type === "mcq"
            ? "selected"
            : ""
        }
      >
        اختيار من متعدد
      </option>

      <option
        value="essay"
        ${
          type === "essay"
            ? "selected"
            : ""
        }
      >
        سؤال مقالي
      </option>

    </select>


    <div
      class="mcq-options"
      style="${
        type === "essay"
          ? "display:none;"
          : ""
      }"
    >

      ${
        ["A", "B", "C", "D"]
          .map(
            (letter, i) => `

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

      `
          )
          .join("")
      }

    </div>


    <div
      class="essay-note"
      style="${
        type === "essay"
          ? ""
          : "display:none;"
      }"
    >
      ✍️ سؤال مقالي — الطالب سيكتب إجابته في مساحة نصية أثناء الامتحان، ويمكن تصحيحه يدويًا بعد التسليم.
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


    <label class="q-image-label">
      📷 إرفاق صورة للسؤال (اختياري)
    </label>


    <input
      type="file"
      class="q-image-file"
      accept="image/*"
      onchange="previewQuestionImage(this)"
    >


    <input
      type="hidden"
      class="q-image"
      value="${escapeHtml(image)}"
    >


    ${
      image
        ? `
          <div class="question-image-box">

            <button
              type="button"
              class="removeQuestionImage"
              onclick="removeQuestionImage(this)"
              title="إلغاء الصورة"
            >
              ×
            </button>

            <img
              class="question-image-preview"
              src="${escapeHtml(
                getImageSrc(image)
              )}"
              alt="صورة السؤال"
            >

          </div>
        `
        : ""
    }

  </div>

  `;
}


// ======================================================
// IMAGE PREVIEW
// ======================================================

function previewQuestionImage(input) {

  const card =
    input.closest(".question-card");

  if (!card) {
    return;
  }

  const file =
    input.files?.[0];

  if (!file) {
    return;
  }

  if (
    !file.type ||
    !file.type.startsWith("image/")
  ) {
    input.value = "";
    return;
  }

  const reader =
    new FileReader();

  reader.onload = function(event) {

    const imageData =
      event.target?.result || "";

    if (!imageData) {
      return;
    }

    const hidden =
      card.querySelector(".q-image");

    if (hidden) {
      hidden.value = imageData;
    }

    let box =
      card.querySelector(
        ".question-image-box"
      );

    if (!box) {

      box =
        document.createElement("div");

      box.className =
        "question-image-box";

      input.insertAdjacentElement(
        "afterend",
        box
      );

    }

    box.innerHTML = `

      <button
        type="button"
        class="removeQuestionImage"
        onclick="removeQuestionImage(this)"
        title="إلغاء الصورة"
      >
        ×
      </button>

      <img
        class="question-image-preview"
        src="${imageData}"
        alt="صورة السؤال"
      >

    `;

  };

  reader.readAsDataURL(file);
}


// ======================================================
// REMOVE IMAGE
// ======================================================

function removeQuestionImage(button) {

  const card =
    button.closest(".question-card");

  if (!card) {
    return;
  }

  const fileInput =
    card.querySelector(
      ".q-image-file"
    );

  const hidden =
    card.querySelector(
      ".q-image"
    );

  const imageBox =
    card.querySelector(
      ".question-image-box"
    );

  if (fileInput) {
    fileInput.value = "";
  }

  if (hidden) {
    hidden.value = "";
  }

  if (imageBox) {
    imageBox.remove();
  }
}


// ======================================================
// MAKE IMAGE FUNCTIONS AVAILABLE TO HTML
// ======================================================

window.previewQuestionImage =
  previewQuestionImage;

window.removeQuestionImage =
  removeQuestionImage;


// ======================================================
// NORMALIZE EDITOR OPTIONS
// ======================================================

function getQuestionOptionsForEditor(
  question
) {

  if (!question || typeof question !== "object") {
    return ["", "", "", ""];
  }

  if (
    Array.isArray(question.options)
  ) {

    return [
      question.options[0] ?? "",
      question.options[1] ?? "",
      question.options[2] ?? "",
      question.options[3] ?? ""
    ];

  }

  if (
    Array.isArray(question.choices)
  ) {

    return [
      question.choices[0] ?? "",
      question.choices[1] ?? "",
      question.choices[2] ?? "",
      question.choices[3] ?? ""
    ];

  }

  const letters = [
    question.A,
    question.B,
    question.C,
    question.D
  ];

  if (
    letters.some(
      value =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    )
  ) {

    return letters.map(
      value =>
        value === undefined ||
        value === null
          ? ""
          : String(value)
    );

  }

  const named = [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD
  ];

  if (
    named.some(
      value =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    )
  ) {

    return named.map(
      value =>
        value === undefined ||
        value === null
          ? ""
          : String(value)
    );

  }

  const numbered = [
    question.choice1,
    question.choice2,
    question.choice3,
    question.choice4
  ];

  if (
    numbered.some(
      value =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    )
  ) {

    return numbered.map(
      value =>
        value === undefined ||
        value === null
          ? ""
          : String(value)
    );

  }

  return ["", "", "", ""];
}


// ======================================================
// NORMALIZE CORRECT ANSWER
// ======================================================

function getCorrectIndexForEditor(
  question,
  options
) {

  let value;

  if (
    question.correctAnswerIndex !==
    undefined
  ) {

    value =
      question.correctAnswerIndex;

  }
  else if (
    question.correctIndex !==
    undefined
  ) {

    value =
      question.correctIndex;

  }
  else if (
    question.rightIndex !==
    undefined
  ) {

    value =
      question.rightIndex;

  }
  else if (
    question.correctAnswer !==
    undefined
  ) {

    value =
      question.correctAnswer;

  }
  else if (
    question.answer !==
    undefined
  ) {

    value =
      question.answer;

  }
  else if (
    question.correct !==
    undefined
  ) {

    value =
      question.correct;

  }
  else {

    return 0;

  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {

    if (
      value >= 0 &&
      value < 4
    ) {

      return Math.trunc(value);

    }

    if (
      value >= 1 &&
      value <= 4
    ) {

      return Math.trunc(value) - 1;

    }

  }

  const raw =
    String(value)
      .trim();

  const upper =
    raw.toUpperCase();

  const letterMap = {
    A:0,
    B:1,
    C:2,
    D:3
  };

  if (
    Object.prototype.hasOwnProperty.call(
      letterMap,
      upper
    )
  ) {

    return letterMap[upper];

  }

  if (
    /^[1-4]$/.test(raw)
  ) {

    return Number(raw) - 1;

  }

  const index =
    options.findIndex(
      option =>
        String(option).trim() === raw
    );

  if (
    index >= 0
  ) {

    return index;

  }

  return 0;
}


// ======================================================
// DETECT QUESTION TYPE
// ======================================================

function getQuestionTypeForEditor(
  question,
  options
) {

  const rawType =
    String(
      question?.type || ""
    )
      .trim()
      .toLowerCase();

  if (
    rawType === "essay" ||
    rawType.includes("essay") ||
    rawType.includes("مقال") ||
    rawType.includes("written")
  ) {

    return "essay";

  }

  if (
    options.some(
      option =>
        String(option).trim() !== ""
    )
  ) {

    return "mcq";

  }

  if (
    question.correctAnswer !== undefined ||
    question.correctAnswerIndex !== undefined ||
    question.correctIndex !== undefined ||
    question.answer !== undefined ||
    question.correct !== undefined
  ) {

    return "mcq";

  }

  return rawType === "text"
    ? "essay"
    : "mcq";
}


// ======================================================
// IMAGE SRC
// ======================================================

function getImageSrc(image) {

  const value =
    String(image || "");

  if (!value) {
    return "";
  }

  if (
    value.startsWith("data:") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  ) {

    return value;

  }

  return "/images/" + value;
}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

  return String(value ?? "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}