import { examsListPage } from "./examsList.js";

let editingExamData = null;

export function setExamToEdit(exam) {
  editingExamData = exam;
}

export function createExamPage() {
  const isEdit = !!editingExamData;

  const exam = editingExamData || {
    title: "",
    subject: "physics",
    className: "الصف الثاني الثانوي",
    duration: 60,
    passingScore: 50,
    startDate: "",
    endDate: "",
    manualClose: false,
    isPublished: true,
    questions: []
  };

  return `
  <div style="
    min-height: 100vh;
    background: #0f172a;
    background-image: 
      radial-gradient(at 10% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 40%),
      radial-gradient(at 90% 80%, rgba(16, 185, 129, 0.12) 0px, transparent 40%);
    font-family: 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif;
    padding: 40px 20px;
    direction: rtl;
    color: #fff;
  ">
    <div style="max-width: 850px; margin: 0 auto;">

      <!-- Header Card -->
      <div style="
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95));
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 24px;
        padding: 25px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
      ">
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="width: 50px; height: 50px; background: rgba(99, 102, 241, 0.15); color: #818cf8; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 1px solid rgba(255,255,255,0.08);">
            <i class="fa-solid ${isEdit ? 'fa-pen-to-square' : 'fa-circle-plus'}"></i>
          </div>
          <div>
            <h1 style="font-size: 22px; font-weight: 900; margin: 0 0 4px 0; color: #f8fafc;">
              ${isEdit ? "تعديل الامتحان" : "إنشاء امتحان جديد"}
            </h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">أنواع الأسئلة، تحديد الدرجات، ومساحات الإجابة المقالية النشطة</p>
          </div>
        </div>

        <button id="btnBackToList" style="
          background: rgba(30, 41, 59, 0.6);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
        ">
          <i class="fa-solid fa-arrow-right"></i>
          <span>رجوع</span>
        </button>
      </div>

      <!-- Main Form Container -->
      <div style="
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 24px;
        padding: 35px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
        margin-bottom: 25px;
      ">

        <!-- Subject Selection -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">المادة</label>
          <select id="examSubject" style="
            width: 100%; padding: 14px 18px; background: rgba(15, 23, 42, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
            color: #fff; font-size: 14px; outline: none; font-family: inherit; box-sizing: border-box; cursor: pointer;
          ">
            <option value="physics" ${exam.subject==="physics"?"selected":""} style="background: #0f172a; color: #fff;">⚡ Physics</option>
            <option value="chemistry" ${exam.subject==="chemistry"?"selected":""} style="background: #0f172a; color: #fff;">🧪 Chemistry</option>
          </select>
        </div>

        <!-- Class Selection -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">الصف الدراسي</label>
          <select id="examClass" style="
            width: 100%; padding: 14px 18px; background: rgba(15, 23, 42, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
            color: #fff; font-size: 14px; outline: none; font-family: inherit; box-sizing: border-box; cursor: pointer;
          ">
            <option value="الصف الثاني الثانوي" ${exam.className==="الصف الثاني الثانوي"?"selected":""} style="background: #0f172a; color: #fff;">الصف الثاني الثانوي</option>
            <option value="الصف الثالث الثانوي" ${exam.className==="الصف الثالث الثانوي"?"selected":""} style="background: #0f172a; color: #fff;">الصف الثالث الثانوي</option>
          </select>
        </div>

        <!-- Exam Title -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">عنوان الامتحان</label>
          <input id="examTitle" value="${exam.title || ""}" placeholder="مثال: امتحان الشهر الأول..." style="
            width: 100%; padding: 14px 18px; background: rgba(15, 23, 42, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
            color: #fff; font-size: 14px; outline: none; font-family: inherit; box-sizing: border-box;
          ">
        </div>

        <!-- Duration & Passing Score -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div>
            <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">المدة بالدقائق</label>
            <input id="examDuration" type="number" value="${exam.duration || 60}" style="
              width: 100%; padding: 14px 18px; background: rgba(15, 23, 42, 0.7);
              border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
              color: #fff; font-size: 14px; outline: none; font-family: inherit; box-sizing: border-box;
            ">
          </div>
          <div>
            <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">درجة النجاح</label>
            <input id="examPassingScore" type="number" value="${exam.passingScore || 50}" style="
              width: 100%; padding: 14px 18px; background: rgba(15, 23, 42, 0.7);
              border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
              color: #fff; font-size: 14px; outline: none; font-family: inherit; box-sizing: border-box;
            ">
          </div>
        </div>

        <!-- Start Date & End Date -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div>
            <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">وقت فتح الامتحان تلقائياً</label>
            <input id="examStartDate" type="datetime-local" value="${exam.startDate || ""}" style="
              width: 100%; padding: 14px 18px; background: rgba(15, 23, 42, 0.7);
              border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
              color: #fff; font-size: 14px; outline: none; font-family: inherit; box-sizing: border-box; color-scheme: dark;
            ">
          </div>
          <div>
            <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">وقت إغلاق الامتحان نهائياً</label>
            <input id="examEndDate" type="datetime-local" value="${exam.endDate || ""}" style="
              width: 100%; padding: 14px 18px; background: rgba(15, 23, 42, 0.7);
              border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
              color: #fff; font-size: 14px; outline: none; font-family: inherit; box-sizing: border-box; color-scheme: dark;
            ">
          </div>
        </div>

        <!-- زر التحكم اليدوي الفوري -->
        <div style="background: rgba(15, 23, 42, 0.5); padding: 16px 20px; border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap;">
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #f8fafc;">حالة القفل اليدوي السريع</h4>
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">إغلاق الامتحان يدوياً يمنع الطلاب من دخوله بغض النظر عن الوقت المحدد.</p>
          </div>
          <button type="button" id="toggleManualCloseBtn" data-closed="${exam.manualClose ? 'true' : 'false'}" style="
            background: ${exam.manualClose ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'};
            color: ${exam.manualClose ? '#ef4444' : '#34d399'};
            border: 1px solid ${exam.manualClose ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'};
            padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;
          ">
            ${exam.manualClose ? '🔒 الامتحان مغلق حالياً (اضغط للفتح)' : '🔓 الامتحان مفتوح حالياً (اضغط للغلق)'}
          </button>
        </div>

      </div>

      <!-- Questions Section Wrapper -->
      <div style="margin-bottom: 25px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="font-size: 18px; font-weight: 800; margin: 0; color: #f8fafc;">أسئلة الاختبار</h3>
          <button id="btnAddQuestion" style="
            background: rgba(99, 102, 241, 0.15); color: #818cf8;
            border: 1px solid rgba(99, 102, 241, 0.3); padding: 10px 18px;
            border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer;
            display: inline-flex; align-items: center; gap: 6px; font-family: inherit;
          ">
            <i class="fa-solid fa-plus"></i> إضافة سؤال
          </button>
        </div>

        <div id="questionsList" style="display: flex; flex-direction: column; gap: 15px;">
          ${
            exam.questions?.map(
              (q, i) => createQuestionTemplate(i + 1, q)
            ).join("") || `
            <div style="background: rgba(30, 41, 59, 0.4); border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 25px; text-align: center; color: #64748b; font-size: 14px;">
              لم يتم إضافة أي أسئلة بعد. اضغط على زر "إضافة سؤال" للبدء.
            </div>`
          }
        </div>
      </div>

      <!-- Action Buttons Bottom Panel -->
      <div style="display: flex; gap: 15px;">
        <button id="btnSaveExam" style="
          flex: 1; background: linear-gradient(135deg, #10b981, #059669);
          color: #fff; border: none; padding: 15px; font-size: 15px;
          font-weight: 700; border-radius: 14px; cursor: pointer;
          box-shadow: 0 12px 30px -6px rgba(16, 185, 129, 0.4); font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        ">
          <i class="fa-solid fa-floppy-disk"></i>
          <span>حفظ التعديلات والنشر</span>
        </button>
      </div>

    </div>
  </div>
  `;
}

function createQuestionTemplate(index, qData = {}) {
  const qType = qData.type || "mcq";
  const correctIdx = qData.correctAnswerIndex !== undefined ? qData.correctAnswerIndex : 0;
  const qScore = qData.score !== undefined ? qData.score : 1;

  return `
  <div class="question-card" style="
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 25px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
  ">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
      <h3 style="font-size: 16px; font-weight: 800; margin: 0; color: #818cf8;">
        السؤال رقم ${index}
      </h3>

      <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
        <!-- تحديد درجة السؤال -->
        <div style="display: flex; align-items: center; gap: 6px;">
          <label style="font-size: 12px; color: #cbd5e1;">الدرجة:</label>
          <input type="number" class="q-score" value="${qScore}" min="1" style="
            width: 60px; padding: 6px 8px; background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px;
            color: #fff; font-size: 12px; outline: none; font-family: inherit; text-align: center;
          ">
        </div>

        <!-- تحديد نوع السؤال -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <label style="font-size: 12px; color: #cbd5e1;">نوع السؤال:</label>
          <select class="q-type-select" style="
            padding: 6px 12px; background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px;
            color: #fff; font-size: 12px; outline: none; font-family: inherit; cursor: pointer;
          ">
            <option value="mcq" ${qType === "mcq" ? "selected" : ""}>اختيار من متعدد</option>
            <option value="essay" ${qType === "essay" ? "selected" : ""}>سؤال مقالي</option>
          </select>
        </div>
      </div>
    </div>

    <!-- نص السؤال -->
    <textarea class="q-text" placeholder="اكتب نص السؤال هنا..." style="
      width: 100%; height: 80px; padding: 12px 16px; background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
      color: #fff; font-size: 14px; outline: none; font-family: inherit; box-sizing: border-box; resize: none; margin-bottom: 12px;
    ">${qData.text || ""}</textarea>

    <!-- إرفاق صورة -->
    <div style="margin-bottom: 15px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
      <input type="hidden" class="q-image" value="${qData.questionImage || ""}">
      <div style="flex: 1; min-width: 200px;">
        <input type="file" accept="image/*" class="q-file-input" style="
          width: 100%; padding: 8px; background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
          color: #94a3b8; font-size: 12px; cursor: pointer; color-scheme: dark;
        ">
      </div>
      <div class="image-preview-container" style="${qData.questionImage ? 'display:block;' : 'display:none;'}">
        <img src="${qData.questionImage || ""}" style="max-height: 45px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);" />
      </div>
    </div>

    <!-- خيارات الإجابة (MCQ) -->
    <div class="mcq-options-wrapper" style="display: ${qType === 'essay' ? 'none' : 'block'};">
      <p style="font-size: 13px; color: #94a3b8; margin: 0 0 10px 0;">اختر الخيار الصحيح بالضغط على زر الاختيار المجاور للإجابة:</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <input type="radio" name="correct_${index}" class="q-correct-radio" value="0" ${correctIdx === 0 ? "checked" : ""} style="cursor: pointer; width: 18px; height: 18px;">
          <input class="opt-text" value="${qData.options?.[0] || ""}" placeholder="الإجابة A" style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 10px; color: #fff; font-size: 13px; outline: none; box-sizing: border-box;">
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <input type="radio" name="correct_${index}" class="q-correct-radio" value="1" ${correctIdx === 1 ? "checked" : ""} style="cursor: pointer; width: 18px; height: 18px;">
          <input class="opt-text" value="${qData.options?.[1] || ""}" placeholder="الإجابة B" style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 10px; color: #fff; font-size: 13px; outline: none; box-sizing: border-box;">
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <input type="radio" name="correct_${index}" class="q-correct-radio" value="2" ${correctIdx === 2 ? "checked" : ""} style="cursor: pointer; width: 18px; height: 18px;">
          <input class="opt-text" value="${qData.options?.[2] || ""}" placeholder="الإجابة C" style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 10px; color: #fff; font-size: 13px; outline: none; box-sizing: border-box;">
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <input type="radio" name="correct_${index}" class="q-correct-radio" value="3" ${correctIdx === 3 ? "checked" : ""} style="cursor: pointer; width: 18px; height: 18px;">
          <input class="opt-text" value="${qData.options?.[3] || ""}" placeholder="الإجابة D" style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 10px; color: #fff; font-size: 13px; outline: none; box-sizing: border-box;">
        </div>

      </div>
    </div>

    <!-- مساحة الإجابة ونموذج التصحيح للسؤال المقالي (مساحة واضحة للمعلم والطالب) -->
    <div class="essay-space-wrapper" style="display: ${qType === 'essay' ? 'block' : 'none'}; margin-top: 10px;">
      <div style="
        background: rgba(15, 23, 42, 0.6);
        border: 1px dashed rgba(99, 102, 241, 0.4);
        border-radius: 14px;
        padding: 15px;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #818cf8; font-size: 13px; font-weight: 700;">
          <i class="fa-solid fa-pen-nib"></i>
          <span>مساحة إجابة الطالب المقالية (معاينة) / نموذج الإجابة:</span>
        </div>
        <textarea class="student-essay-answer" placeholder="هنا تظهر مساحة إجابة الطالب الحرة (يمكنك وضع نموذج الإجابة هنا ليسترشد به المعلم عند التصحيح)..." style="
          width: 100%; height: 110px; padding: 12px 16px; background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
          color: #fff; font-size: 14px; outline: none; font-family: inherit; box-sizing: border-box; resize: vertical;
        ">${qData.studentAnswer || ""}</textarea>
        <p style="margin: 6px 0 0 0; font-size: 11px; color: #94a3b8;">* سيحصل الطالب على صندوق كتابة مشابه عند تقديم الإجابة في صفحة الامتحان الخاصة به.</p>
      </div>
    </div>
  </div>
  `;
}

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("q-type-select")) {
    const card = e.target.closest(".question-card");
    const mcqWrapper = card.querySelector(".mcq-options-wrapper");
    const essayWrapper = card.querySelector(".essay-space-wrapper");
    
    if (e.target.value === "essay") {
      mcqWrapper.style.display = "none";
      essayWrapper.style.display = "block";
    } else {
      mcqWrapper.style.display = "block";
      essayWrapper.style.display = "none";
    }
  }

  if (e.target.classList.contains("q-file-input")) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(uploadEvent) {
        const card = e.target.closest(".question-card");
        if (card) {
          card.querySelector(".q-image").value = uploadEvent.target.result;
          const preview = card.querySelector(".image-preview-container");
          preview.style.display = "block";
          preview.querySelector("img").src = uploadEvent.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
});

document.addEventListener("click", (e) => {
  const app = document.querySelector("#app");
  if (!app) return;

  if (e.target.closest("#toggleManualCloseBtn")) {
    const btn = e.target.closest("#toggleManualCloseBtn");
    const isClosed = btn.getAttribute("data-closed") === "true";
    
    if (isClosed) {
      btn.setAttribute("data-closed", "false");
      btn.style.background = "rgba(16, 185, 129,0.2)";
      btn.style.color = "#34d399";
      btn.style.borderColor = "rgba(16, 185, 129, 0.4)";
      btn.innerHTML = "🔓 الامتحان مفتوح حالياً (اضغط للغلق)";
      if (editingExamData) editingExamData.manualClose = false;
    } else {
      btn.setAttribute("data-closed", "true");
      btn.style.background = "rgba(239, 68, 68, 0.2)";
      btn.style.color = "#ef4444";
      btn.style.borderColor = "rgba(239, 68, 68, 0.4)";
      btn.innerHTML = "🔒 الامتحان مغلق حالياً (اضغط للفتح)";
      if (editingExamData) editingExamData.manualClose = true;
    }
    return;
  }

  if (e.target.closest("#btnBackToList")) {
    editingExamData = null;
    app.innerHTML = examsListPage();
    return;
  }

  if (e.target.closest("#btnAddQuestion")) {
    const list = document.querySelector("#questionsList");
    if (list) {
      const emptyMsg = list.querySelector("div[style*='dashed']");
      if (emptyMsg) emptyMsg.remove();

      list.insertAdjacentHTML("beforeend", createQuestionTemplate(list.children.length + 1));
    }
    return;
  }

  if (e.target.closest("#btnSaveExam")) {
    const title = document.querySelector("#examTitle").value.trim();
    const subject = document.querySelector("#examSubject").value;
    const className = document.querySelector("#examClass").value;
    const duration = Number(document.querySelector("#examDuration").value) || 60;
    const passingScore = Number(document.querySelector("#examPassingScore").value) || 50;
    
    const startDate = document.querySelector("#examStartDate").value;
    const endDate = document.querySelector("#examEndDate").value;
    const manualCloseBtn = document.querySelector("#toggleManualCloseBtn");
    const manualClose = manualCloseBtn ? manualCloseBtn.getAttribute("data-closed") === "true" : false;

    if (!title) {
      alert("اكتب عنوان الامتحان");
      return;
    }

    const questions = [...document.querySelectorAll(".question-card")].map(card => {
      const type = card.querySelector(".q-type-select").value;
      const score = Number(card.querySelector(".q-score").value) || 1;
      const options = type === "mcq" ? [...card.querySelectorAll(".opt-text")].map(x => x.value) : [];
      
      let correctAnswerIndex = 0;
      if (type === "mcq") {
        const checkedRadio = card.querySelector(".q-correct-radio:checked");
        if (checkedRadio) {
          correctAnswerIndex = Number(checkedRadio.value);
        }
      }

      const questionImage = card.querySelector(".q-image").value.trim();
      const studentAnswer = type === "essay" ? card.querySelector(".student-essay-answer").value : "";

      return {
        text: card.querySelector(".q-text").value,
        type,
        score,
        questionImage,
        options,
        correctAnswerIndex,
        studentAnswer
      };
    });

    let exams = [];
    try {
      exams = JSON.parse(localStorage.getItem("app_exams")) || [];
    } catch {
      exams = [];
    }

    const newExam = {
      id: editingExamData?.id || Date.now(),
      title,
      subject,
      className,
      grade: className,
      duration,
      passingScore,
      startDate,
      endDate,
      manualClose,
      isPublished: true,
      questions
    };

    if (editingExamData) {
      exams = exams.map(e => e.id === editingExamData.id ? newExam : e);
    } else {
      exams.unshift(newExam);
    }

    localStorage.setItem("app_exams", JSON.stringify(exams));
    alert("✅ تم حفظ الامتحان بنجاح ومساحات الأسئلة المقالية");
    app.innerHTML = examsListPage();
  }
});