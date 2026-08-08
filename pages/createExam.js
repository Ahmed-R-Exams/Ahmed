import {
  addExam
} from "../services/examService.js";


let editingExamData = null;



export function setExamToEdit(exam){

  editingExamData = exam;

}




export function createExamPage(){

const isEdit = !!editingExamData;

return `
<div class="eb" dir="rtl" lang="ar">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;800&family=Tajawal:wght@400;500;700&family=JetBrains+Mono:wght@500;600&display=swap');

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
      --warn:#f0a63a;
      --fail:#ef4a63;
      font-family:'Tajawal',sans-serif;
      color:var(--paper);
      max-width:900px;
      margin:auto;
      padding:30px 20px 60px;
    }
    .eb *{box-sizing:border-box;}

    .eb-hero{
      background:
        radial-gradient(600px 200px at 15% 0%, rgba(232,179,76,.14), transparent 60%),
        linear-gradient(150deg,#0a0f1c,#141f3d 65%,#1c2a52);
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
    @media (max-width:640px){ .eb-grid2{grid-template-columns:1fr;} }

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
    .eb-field select:focus-visible{outline:2px solid var(--gold); outline-offset:1px;}
    .eb-field input[type="number"]{font-family:'JetBrains Mono',monospace;}

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
      color:var(--paper);
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
      font-family:'Cairo',sans-serif;
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
      font-weight:500;
      font-size:14px;
      cursor:pointer;
      transition:filter .15s ease, transform .15s ease;
    }
    .eb-btn:hover{filter:brightness(1.15); transform:translateY(-1px);}
    .eb-btn:focus-visible{outline:2px solid var(--gold); outline-offset:2px;}

    .eb-btn-add{
      width:100%;
      margin-top:6px;
      border:1.5px dashed var(--line);
      background:transparent;
      color:var(--muted);
    }
    .eb-btn-add:hover{border-color:var(--gold); color:var(--gold);}

    .eb-btn-save{
      width:100%;
      padding:16px;
      font-size:17px;
      font-weight:700;
      font-family:'Cairo',sans-serif;
      background:linear-gradient(135deg,#1fa968,#31c07a);
      border-color:transparent;
      color:#062015;
    }

    .eb-btn-back{
      width:100%;
      margin-top:12px;
      background:transparent;
      color:var(--muted);
    }

    .eb-qcard{
      background:var(--ink-800);
      border:1px solid var(--line);
      border-radius:16px;
      padding:20px;
      margin-top:16px;
    }

    .eb-qcard-top{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      margin-bottom:14px;
    }
    .eb-qnum{
      display:flex;
      align-items:center;
      gap:10px;
    }
    .eb-qnum b{
      width:32px;
      height:32px;
      border-radius:50%;
      background:var(--ink-700);
      border:1px solid var(--line);
      display:flex;
      align-items:center;
      justify-content:center;
      font-family:'JetBrains Mono',monospace;
      font-size:13px;
      color:var(--gold);
      flex:0 0 auto;
    }
    .eb-qnum span{
      font-family:'Cairo',sans-serif;
      font-weight:700;
      font-size:15px;
    }

    .eb-remove{
      background:transparent;
      color:var(--fail);
      border:1px solid var(--fail);
      padding:7px 14px;
      border-radius:10px;
      cursor:pointer;
      font-size:13px;
      font-family:'Tajawal',sans-serif;
      transition:background .15s ease, color .15s ease;
    }
    .eb-remove:hover{background:var(--fail); color:#fff;}

    .eb-textarea{
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
    .eb-textarea:focus-visible{outline:2px solid var(--gold); outline-offset:1px;}

    .eb-file-row{margin-top:12px;}
    .eb-file{
      color:var(--muted);
      font-size:13px;
      font-family:'Tajawal',sans-serif;
    }
    .eb-file::file-selector-button{
      padding:9px 16px;
      margin-inline-end:12px;
      border-radius:10px;
      border:1px solid var(--line);
      background:var(--ink-700);
      color:var(--paper);
      font-family:'Tajawal',sans-serif;
      font-size:13px;
      cursor:pointer;
    }
    .eb-file::file-selector-button:hover{filter:brightness(1.2);}

    .eb-preview img{
      max-width:220px;
      border-radius:12px;
      border:1px solid var(--line);
      margin-top:10px;
      display:block;
    }

    .eb-type-field{margin-top:16px;}
    .eb-type-field label{
      display:block;
      font-size:12.5px;
      color:var(--muted);
      margin-bottom:6px;
    }
    .eb-type-field select{
      padding:10px 14px;
      border-radius:10px;
      border:1px solid var(--line);
      background:var(--ink-900);
      color:var(--paper);
      font-family:'Tajawal',sans-serif;
      font-size:13.5px;
    }

    .eb-mcq{margin-top:16px;}

    /* ===== Signature element: scantron-style answer bubbles ===== */
    .eb-bubble-row{
      display:flex;
      align-items:center;
      gap:12px;
      margin-bottom:10px;
    }
    .eb-bubble-wrap{
      position:relative;
      width:34px;
      height:34px;
      flex:0 0 auto;
    }
    .eb-bubble-wrap input[type="radio"]{
      position:absolute;
      inset:0;
      opacity:0;
      margin:0;
      cursor:pointer;
      z-index:2;
    }
    .eb-bubble-letter{
      position:absolute;
      inset:0;
      border-radius:50%;
      border:2px solid var(--line);
      display:flex;
      align-items:center;
      justify-content:center;
      font-family:'JetBrains Mono',monospace;
      font-size:13px;
      font-weight:600;
      color:var(--muted);
      background:var(--ink-900);
      pointer-events:none;
      transition:background .15s ease, border-color .15s ease, color .15s ease;
    }
    .eb-bubble-wrap input:checked + .eb-bubble-letter{
      background:var(--pass);
      border-color:var(--pass);
      color:#062015;
    }
    .eb-bubble-wrap input:focus-visible + .eb-bubble-letter{
      outline:2px solid var(--gold);
      outline-offset:2px;
    }
    .eb-opt-text{
      flex:1;
      padding:10px 14px;
      border-radius:10px;
      border:1px solid var(--line);
      background:var(--ink-900);
      color:var(--paper);
      font-family:'Tajawal',sans-serif;
      font-size:14px;
    }
    .eb-opt-text:focus-visible{outline:2px solid var(--gold); outline-offset:1px;}

    .eb-essay textarea{
      width:100%;
      min-height:110px;
      padding:12px 14px;
      border-radius:12px;
      border:1px solid var(--line);
      background:var(--ink-900);
      color:var(--paper);
      font-family:'Tajawal',sans-serif;
      font-size:14px;
      resize:vertical;
    }

    .eb-score{
      margin-top:16px;
      display:flex;
      align-items:center;
      gap:10px;
    }
    .eb-score label{font-size:13px; color:var(--muted);}
    .eb-score input{
      width:80px;
      padding:8px 10px;
      border-radius:10px;
      border:1px solid var(--line);
      background:var(--ink-900);
      color:var(--paper);
      font-family:'JetBrains Mono',monospace;
      font-size:14px;
    }

    @media (prefers-reduced-motion: reduce){
      .eb-btn, .eb-remove, .eb-bubble-letter{transition:none;}
    }
  </style>

  <div class="eb-hero">
    <h2>${isEdit ? "✏️ تعديل الامتحان" : "➕ إنشاء امتحان جديد"}</h2>
    <span>${isEdit ? "عدّل بيانات الامتحان والأسئلة ثم احفظ" : "املأ بيانات الامتحان وأضف الأسئلة"}</span>
  </div>

  <div class="eb-panel">

    <div class="eb-field">
      <label>عنوان الامتحان</label>
      <input id="examTitle" value="${isEdit ? editingExamData.title || "" : ""}" placeholder="عنوان الامتحان">
    </div>

    <div class="eb-grid2">
      <div class="eb-field">
        <label>المادة</label>
        <select id="examSubject">
          <option value="physics" ${isEdit && editingExamData.subject === "physics" ? "selected" : ""}>فيزياء</option>
          <option value="chemistry" ${isEdit && editingExamData.subject === "chemistry" ? "selected" : ""}>كيمياء</option>
        </select>
      </div>

      <div class="eb-field">
        <label>الصف</label>
        <select id="examClass">
          <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
          <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
          <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
        </select>
      </div>
    </div>

    <div class="eb-grid2">
      <div class="eb-field">
        <label>مدة الامتحان بالدقائق</label>
        <input type="number" id="examDuration" value="${isEdit ? editingExamData.duration || 60 : 60}">
      </div>

      <div class="eb-field">
        <label>درجة النجاح</label>
        <input type="number" id="examPassingScore" value="${isEdit ? editingExamData.passingScore || 50 : 50}">
      </div>
    </div>

    <div class="eb-grid2">
      <div class="eb-field">
        <label>تاريخ بداية الامتحان</label>
        <input type="datetime-local" id="examStartDate" value="${isEdit ? editingExamData.startDate || "" : ""}">
      </div>

      <div class="eb-field">
        <label>تاريخ نهاية الامتحان</label>
        <input type="datetime-local" id="examEndDate" value="${isEdit ? editingExamData.endDate || "" : ""}">
      </div>
    </div>

  </div>

  <div class="eb-panel">
    <div class="eb-qhead">
      <h3>الأسئلة</h3>
      <span>رتّب الأسئلة بالترتيب اللي هتظهر بيه للطالب</span>
    </div>

    <div id="questionsList">
      ${
        isEdit && editingExamData.questions
          ? editingExamData.questions.map((q, i) => createQuestionTemplate(i + 1, q)).join("")
          : `<div class="eb-empty"><b>لا توجد أسئلة</b>أضف سؤال جديد للبدء</div>`
      }
    </div>

    <button id="btnAddQuestion" type="button" class="eb-btn eb-btn-add">➕ إضافة سؤال</button>
  </div>

  <button id="btnSaveExam" class="eb-btn eb-btn-save">💾 حفظ الامتحان</button>
  <button id="btnBackToList" type="button" class="eb-btn eb-btn-back">⬅ رجوع</button>

</div>
`;

}



export function createQuestionTemplate(index, question = {}){

return `
<div class="question-card eb-qcard">

  <div class="eb-qcard-top">
    <div class="eb-qnum">
      <b>${index}</b>
      <span>السؤال</span>
    </div>
    <button type="button" class="removeQuestion eb-remove">🗑 حذف السؤال</button>
  </div>

  <textarea class="q-text eb-textarea" placeholder="نص السؤال">${question.text || question.question || ""}</textarea>

  <div class="eb-file-row">
    <input type="file" class="q-file-input eb-file" accept="image/*">
  </div>

  <input type="hidden" class="q-image" value="${question.image || ""}">

  <div class="image-preview-container eb-preview" style="display:${question.image ? "block" : "none"};">
    <img src="${question.image || ""}">
  </div>

  <div class="eb-type-field">
    <label>نوع السؤال</label>
    <select class="q-type-select">
      <option value="mcq" ${question.type === "mcq" ? "selected" : ""}>اختيار من متعدد</option>
      <option value="essay" ${question.type === "essay" ? "selected" : ""}>سؤال مقالي</option>
    </select>
  </div>

  <div class="mcq-options-wrapper eb-mcq" style="display:${question.type === "essay" ? "none" : "block"};">
    ${["A", "B", "C", "D"]
      .map((x, i) => {
        const checked =
          Number(question.correctIndex ?? question.correctAnswerIndex ?? 0) === i ? "checked" : "";
        return `
        <div class="eb-bubble-row">
          <div class="eb-bubble-wrap">
            <input type="radio" class="q-correct-radio" name="correct_${index}" value="${i}" ${checked} aria-label="الإجابة الصحيحة ${x}">
            <span class="eb-bubble-letter">${x}</span>
          </div>
          <input class="opt-text eb-opt-text" value="${question.options?.[i] || ""}" placeholder="الإجابة ${x}">
        </div>
        `;
      })
      .join("")}
  </div>

  <div class="essay-space-wrapper eb-essay" style="display:${question.type === "essay" ? "block" : "none"};">
    <textarea class="student-essay-answer" placeholder="نموذج الإجابة المقالية">${question.modelAnswer || ""}</textarea>
  </div>

  <div class="eb-score">
    <label>درجة السؤال</label>
    <input type="number" class="q-score" value="${question.score || 1}" min="1">
  </div>

</div>
`;

}



export function clearEditingExam(){

editingExamData = null;

}