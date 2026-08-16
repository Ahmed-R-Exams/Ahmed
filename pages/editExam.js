import {
  getExamById
} from "../services/examService.js";

import {
  questionHTML
} from "./editExamEvents.js";


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
        color:#eef1f8;
        font-family:'Tajawal',sans-serif;
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
            background:#1a2440;
            color:#eef1f8;
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

@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;800&family=Tajawal:wght@400;500;700&display=swap');

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
  --accent:#6366f1;

  font-family:'Tajawal',sans-serif;
  color:var(--paper);
  max-width:900px;
  margin:auto;
  padding:30px 20px 60px;
}

.ee *{
  box-sizing:border-box;
}

/* ---------------- HERO ---------------- */

.ee-hero{
  position:relative;
  overflow:hidden;

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

  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  flex-wrap:wrap;
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

/* ---------------- PANEL ---------------- */

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
  transition:border-color .15s ease;
}

.ee-field input:focus-visible,
.ee-field select:focus-visible{
  outline:none;
  border-color:var(--gold);
}

.ee-qhead{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  margin-bottom:24px;
  flex-wrap:wrap;
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

/* ---------------- QUESTION CARD ---------------- */

.edit-question-card{
  background:var(--ink-800);
  border:1px solid var(--line);
  border-radius:16px;
  padding:20px;
  margin-top:16px;
}

.edit-question-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:16px;
  flex-wrap:wrap;
}

.edit-question-header h3{
  font-family:'Cairo',sans-serif;
  font-weight:800;
  font-size:16px;
  margin:0;
  color:var(--paper);
}

.edit-question-actions{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
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

.editQText:focus-visible{
  outline:none;
  border-color:var(--gold);
}

.editTypeSelect{
  width:100%;
  padding:10px 14px;
  margin-top:14px;
  border-radius:10px;
  border:1px solid var(--line);
  background:var(--ink-900);
  color:var(--paper);
  font-family:'Tajawal',sans-serif;
  font-size:14px;
  cursor:pointer;
}

.editMcqOptions{
  margin-top:16px;
}

.edit-option-row{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:10px;
}

.editCorrectRadio{
  width:20px;
  height:20px;
  flex:0 0 auto;
  accent-color:var(--pass);
  cursor:pointer;
}

.edit-option-row > span{
  width:22px;
  flex:0 0 auto;
  font-weight:800;
  color:var(--gold);
  font-family:'Cairo',sans-serif;
}

.editOptText{
  flex:1;
  min-width:0;
  padding:10px 14px;
  border-radius:10px;
  border:1px solid var(--line);
  background:var(--ink-900);
  color:var(--paper);
  font-family:'Tajawal',sans-serif;
  font-size:14px;
}

.editOptText:focus-visible{
  outline:none;
  border-color:var(--gold);
}

.editEssayNote{
  margin-top:16px;
  padding:14px;
  border-radius:10px;
  background:var(--ink-900);
  border:1px solid var(--line);
  color:var(--muted);
  font-size:13.5px;
  line-height:1.7;
}

.edit-score-row{
  margin-top:16px;
  display:flex;
  align-items:center;
  gap:10px;
}

.edit-score-row label{
  font-size:13px;
  color:var(--muted);
  white-space:nowrap;
}

.editScore{
  width:80px;
  padding:8px 10px;
  border-radius:10px;
  border:1px solid var(--line);
  background:var(--ink-900);
  color:var(--paper);
  font-family:'Tajawal',sans-serif;
}

.edit-image-label{
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

/* ---------------- BUTTONS ---------------- */

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
  transition:filter .15s ease, transform .1s ease;
}

.ee-btn:hover{
  filter:brightness(1.15);
}

.ee-btn:active{
  transform:translateY(1px);
}

.ee-btn-add{
  width:100%;
  margin-top:20px;
  border:1.5px dashed var(--line);
  background:transparent;
  color:var(--muted);
}

.ee-btn-add:hover{
  border-color:var(--gold);
  color:var(--gold);
}

.ee-btn-save{
  width:100%;
  padding:16px;
  font-size:17px;
  font-weight:700;
  font-family:'Cairo',sans-serif;
  background:linear-gradient(135deg,#1fa968,#31c07a);
  border-color:transparent;
  color:#062015;
}

.ee-btn-save:disabled{
  opacity:.6;
  cursor:not-allowed;
}

.ee-btn-back{
  width:100%;
  margin-top:12px;
  background:transparent;
  color:var(--muted);
}

.ee-btn-back:hover{
  color:var(--paper);
}

.deleteQuestion{
  background:transparent;
  color:var(--fail);
  border:1px solid var(--fail);
  padding:7px 14px;
  border-radius:10px;
  cursor:pointer;
  font-family:'Tajawal',sans-serif;
  font-size:13px;
  font-weight:700;
  transition:background .15s ease;
}

.deleteQuestion:hover{
  background:rgba(239,74,99,.12);
}

.duplicateQuestion{
  background:transparent;
  color:#818cf8;
  border:1px solid var(--accent);
  padding:7px 14px;
  border-radius:10px;
  cursor:pointer;
  font-family:'Tajawal',sans-serif;
  font-size:13px;
  font-weight:700;
  transition:background .15s ease;
}

.duplicateQuestion:hover{
  background:rgba(99,102,241,.12);
}

@media(max-width:640px){
  .ee{
    padding:18px 14px 50px;
  }

  .ee-hero{
    padding:20px;
  }

  .ee-hero h2{
    font-size:20px;
  }

  .ee-panel{
    padding:18px;
  }
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

    <div>

      <h2>
        ✏️ تعديل الامتحان
      </h2>

      <span>
        تعديل بيانات وأسئلة الامتحان
      </span>

    </div>

    <button
      id="backToManageExams"
      type="button"
      class="ee-btn"
    >
      ⬅ رجوع
    </button>

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

  </div>


</div>

`;

}