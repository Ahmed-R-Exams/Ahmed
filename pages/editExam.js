import {
  getExamById
} from "../services/examService.js";


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value = "") {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// =====================================================
// EDIT EXAM PAGE
// =====================================================

export async function editExamPage(id) {

  const exam =
    await getExamById(id);


  if (!exam) {

    return `

      <div style="
        padding:50px;
        text-align:center;
        direction:rtl;
        color:white;
      ">

        <h3>
          الامتحان غير موجود
        </h3>

        <button
          id="backToManageExams"
          style="
            padding:12px 25px;
            border:none;
            border-radius:12px;
            cursor:pointer;
          "
        >
          ⬅ رجوع
        </button>

      </div>

    `;

  }


  const questions =
    Array.isArray(exam.questions)
      ? exam.questions
      : [];


  return `

<style>

.ee{
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

.ee *{
  box-sizing:border-box;
}

.ee-hero{

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

.ee-hero h2{
  font-family:'Cairo',sans-serif;
  font-weight:800;
  font-size:23px;
  margin:0 0 4px;
}

.ee-hero span{
  color:var(--muted);
  font-size:13px;
}

.ee-panel{

  background:var(--ink-900);
  border:1px solid var(--line);
  border-radius:20px;
  padding:26px;
  margin-bottom:22px;

}

.ee-field{

  display:flex;
  flex-direction:column;
  gap:8px;
  margin-bottom:18px;

}

.ee-field label{

  font-size:13px;
  font-weight:700;
  color:var(--gold);

}

.ee-field input,
.ee-field select{

  width:100%;
  padding:12px 14px;
  border-radius:12px;
  border:1px solid var(--line);
  background:var(--ink-800);
  color:var(--paper);
  font-family:'Tajawal',sans-serif;
  font-size:14px;

}

.ee-qhead{

  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  margin-bottom:24px;

}

.ee-qhead h3{

  font-family:'Cairo',sans-serif;
  font-weight:800;
  font-size:19px;
  margin:0;

}

.ee-qhead span{

  color:var(--muted);
  font-size:13px;

}

.edit-question-card{

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

.editQText{

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

.editImageFile{

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

.question-image{

  max-width:220px;
  max-height:180px;

  border-radius:12px;

  border:1px solid var(--line);

  margin-top:10px;

  display:block;

  object-fit:contain;

}

.ee-btn{

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

.ee-btn-add{

  width:100%;

  margin-top:20px;

  border:1.5px dashed var(--line);

  background:transparent;

  color:var(--muted);

}

.ee-btn-save{

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

.ee-btn-back{

  width:100%;
  margin-top:12px;

  background:transparent;
  color:var(--muted);

}

.deleteQuestion{

  background:transparent;

  color:var(--fail);

  border:1px solid var(--fail);

  padding:7px 14px;

  border-radius:10px;

  cursor:pointer;

}

.duplicateQuestion{

  background:transparent;

  color:#818cf8;

  border:1px solid #6366f1;

  padding:7px 14px;

  border-radius:10px;

  cursor:pointer;

}

</style>


<div
  id="editExamContainer"
  class="ee"
  dir="rtl"
  data-exam-id="${escapeHtml(
    exam.firestoreId || exam.id
  )}"
>


  <!-- HERO -->

  <div class="ee-hero">

    <h2>
      ✏️ تعديل الامتحان
    </h2>

    <span>
      تعديل بيانات وأسئلة الامتحان
    </span>

  </div>


  <!-- EXAM DATA -->

  <div class="ee-panel">


    <div class="ee-field">

      <label>
        عنوان الامتحان
      </label>

      <input
        id="editExamTitle"
        value="${escapeHtml(
          exam.title || ""
        )}"
        placeholder="عنوان الامتحان"
      >

    </div>


    <div class="ee-field">

      <label>
        المادة
      </label>

      <select id="editExamSubject">

        <option
          value="physics"
          ${
            String(
              exam.subject || ""
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
            String(
              exam.subject || ""
            ).toLowerCase() === "chemistry"
              ? "selected"
              : ""
          }
        >
          كيمياء
        </option>

      </select>

    </div>


    <div class="ee-field">

      <label>
        الصف
      </label>

      <select id="editExamClass">

        <option
          value="الصف الأول الثانوي"
          ${
            exam.className ===
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
            exam.className ===
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
            exam.className ===
            "الصف الثالث الثانوي"
              ? "selected"
              : ""
          }
        >
          الصف الثالث الثانوي
        </option>

      </select>

    </div>


    <div class="ee-field">

      <label>
        مدة الامتحان بالدقائق
      </label>

      <input
        type="number"
        id="editExamDuration"
        min="1"
        value="${Number(
          exam.duration
        ) || 60}"
      >

    </div>


    <div class="ee-field">

      <label>
        درجة النجاح
      </label>

      <input
        type="number"
        id="editExamPassingScore"
        min="0"
        value="${Number(
          exam.passingScore
        ) || 50}"
      >

    </div>


    <div class="ee-field">

      <label>
        تاريخ بداية الامتحان
      </label>

      <input
        type="datetime-local"
        id="editExamStartDate"
        value="${escapeHtml(
          exam.startDate || ""
        )}"
      >

    </div>


    <div class="ee-field">

      <label>
        تاريخ نهاية الامتحان
      </label>

      <input
        type="datetime-local"
        id="editExamEndDate"
        value="${escapeHtml(
          exam.endDate || ""
        )}"
      >

    </div>

  </div>


  <!-- QUESTIONS -->

  <div class="ee-panel">

    <div class="ee-qhead">

      <h3>
        📝 أسئلة الامتحان
      </h3>

      <span>
        عدّل الأسئلة وحدد نوع كل سؤال
      </span>

    </div>


    <div id="editQuestionsList">

      ${
        questions.length
          ? questions
              .map(
                (q,index) =>
                  questionHTML(
                    q,
                    index
                  )
              )
              .join("")
          : `
            <div style="
              text-align:center;
              color:#93a0c2;
              padding:30px;
            ">
              لا توجد أسئلة
            </div>
          `
      }

    </div>


    <button
      id="addEditQuestion"
      type="button"
      class="ee-btn ee-btn-add"
    >
      ➕ إضافة سؤال
    </button>

  </div>


  <!-- ACTIONS -->

  <div class="ee-panel">

    <button
      id="saveExamEdit"
      type="button"
      class="ee-btn ee-btn-save"
    >
      💾 حفظ التعديلات
    </button>

    <button
      id="backToManageExams"
      type="button"
      class="ee-btn ee-btn-back"
    >
      ⬅ رجوع
    </button>

  </div>


</div>

`;

}


// =====================================================
// QUESTION HTML
// =====================================================

function questionHTML(
  question = {},
  index
) {

  const text =
    question.text ||
    question.question ||
    question.title ||
    "";


  const options =
    Array.isArray(question.options)
      ? [
          question.options[0] || "",
          question.options[1] || "",
          question.options[2] || "",
          question.options[3] || ""
        ]
      : ["","","",""];


  const correct =
    Number(
      question.correctIndex ??
      question.correctAnswerIndex ??
      0
    );


  const type =
    question.type === "essay"
      ? "essay"
      : "mcq";


  const score =
    Number(
      question.score ??
      question.points ??
      1
    ) || 1;


  const image =
    question.image ||
    question.questionImage ||
    "";


  let imageHTML = "";


  if (image) {

    const src =
      String(image).startsWith("data:")
        ? image
        : String(image).startsWith("/")
          ? image
          : "/images/" + image;


    imageHTML = `

      <img
        src="${escapeHtml(src)}"
        class="question-image"
      >

    `;

  }


  return `

<div
  class="edit-question-card"
  data-index="${index}"
>


  <div class="question-card-header">

    <div style="
      display:flex;
      align-items:center;
      gap:10px;
    ">

      <div class="question-number">
        ${index + 1}
      </div>

      <strong>
        السؤال ${index + 1}
      </strong>

    </div>


    <div style="
      display:flex;
      gap:8px;
      flex-wrap:wrap;
    ">

      <button
        type="button"
        class="duplicateQuestion"
      >
        📄 نسخ
      </button>

      <button
        type="button"
        class="deleteQuestion"
      >
        🗑 حذف
      </button>

    </div>

  </div>


  <textarea
    class="editQText"
    placeholder="اكتب نص السؤال هنا..."
  >${escapeHtml(text)}</textarea>


  <!-- TYPE -->

  <select
    class="q-type-select"
  >

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


  <!-- MCQ -->

  <div
    class="mcq-options"
    style="${
      type === "essay"
        ? "display:none;"
        : ""
    }"
  >

    ${["A","B","C","D"]
      .map(
        (letter,i) => `

        <div class="option-row">

          <input
            type="radio"
            name="edit_correct_${index}"
            class="q-correct-radio"
            value="${i}"
            ${
              correct === i
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
      .join("")}

  </div>


  <!-- ESSAY -->

  <div
    class="essay-note"
    style="${
      type === "essay"
        ? ""
        : "display:none;"
    }"
  >

    ✍️ سؤال مقالي — مفيش اختيارات هنا، والطالب هيكتب إجابته في مساحة نصية مخصصة أثناء الامتحان، وهتحتاج تصححها يدويًا بعد التسليم.

  </div>


  <!-- SCORE -->

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


  <!-- IMAGE -->

  <label class="q-image-label">
    📷 إرفاق صورة للسؤال (اختياري)
  </label>


  <input
    type="file"
    class="editImageFile"
    accept="image/*"
  >


  <input
    type="hidden"
    class="editImage"
    value="${escapeHtml(image)}"
  >


  ${imageHTML}


</div>

`;

}