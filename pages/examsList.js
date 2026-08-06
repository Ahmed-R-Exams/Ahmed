import { createExamPage, setExamToEdit } from "./createExam.js";

export function examsListPage() {
  let exams = [];
  try {
    exams = JSON.parse(localStorage.getItem("app_exams")) || [];
  } catch {
    exams = [];
  }

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
    <div style="max-width: 900px; margin: 0 auto;">

      <!-- Top Back Navigation Bar -->
      <div style="margin-bottom: 20px;">
        <button id="btnBackToDashboard" style="
          background: rgba(30, 41, 59, 0.6);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          transition: all 0.2s ease;
        " onmouseover="this.style.background='rgba(255, 255, 255, 0.08)'; this.style.color='#f8fafc';" onmouseout="this.style.background='rgba(30, 41, 59, 0.6)'; this.style.color='#cbd5e1';">
          <i class="fa-solid fa-arrow-right"></i>
          <span>الرجوع للوحة التحكم</span>
        </button>
      </div>

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
        margin-bottom: 30px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
        flex-wrap: wrap;
        gap: 15px;
      ">
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="width: 50px; height: 50px; background: rgba(99, 102, 241, 0.15); color: #818cf8; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 1px solid rgba(255,255,255,0.08);">
            <i class="fa-solid fa-list-check"></i>
          </div>
          <div>
            <h1 style="font-size: 22px; font-weight: 900; margin: 0 0 4px 0; color: #f8fafc;">إدارة الامتحانات</h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">عرض وتعديل والتحكم في إتاحة الامتحانات للطلاب</p>
          </div>
        </div>

        <button id="btnCreateNewExam" style="
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; border: none; padding: 12px 20px;
          border-radius: 12px; font-size: 14px; font-weight: 700;
          cursor: pointer; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5);
          display: inline-flex; align-items: center; gap: 8px; font-family: inherit;
        ">
          <i class="fa-solid fa-plus"></i>
          <span>إنشاء امتحان جديد</span>
        </button>
      </div>

      <!-- Exams List Container -->
      <div style="display: flex; flex-direction: column; gap: 15px;">
        ${
          exams.length > 0 
          ? exams.map(exam => {
              const isClosed = exam.manualClose === true;
              return `
              <div style="
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 22px 25px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 15px;
              ">
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                    <span style="background: rgba(99, 102, 241, 0.15); color: #818cf8; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 700;">
                      ${exam.className || 'عام'}
                    </span>
                    <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 700;">
                      ${exam.subject === 'physics' ? 'Physics' : 'Chemistry'}
                    </span>
                  </div>
                  <h3 style="font-size: 18px; font-weight: 800; margin: 0 0 6px 0; color: #f8fafc;">
                    ${exam.title}
                  </h3>
                  <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                    المدة: ${exam.duration} د | الأسئلة: ${exam.questions?.length || 0} ${exam.startDate ? `| يبدأ: ${exam.startDate.replace('T', ' ')}` : ''}
                  </p>
                </div>

                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <!-- زر القفل والفتح السريع -->
                  <button class="toggle-quick-lock" data-id="${exam.id}" style="
                    background: ${isClosed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'};
                    color: ${isClosed ? '#ef4444' : '#34d399'};
                    border: 1px solid ${isClosed ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'};
                    padding: 8px 14px; border-radius: 10px; font-size: 12px; font-weight: 700;
                    cursor: pointer; font-family: inherit;
                  ">
                    ${isClosed ? '🔒 مغلق (فتح)' : '🔓 مفتوح (غلق)'}
                  </button>

                  <!-- زر التعديل -->
                  <button class="btn-edit-exam" data-id="${exam.id}" style="
                    background: rgba(99, 102, 241, 0.15); color: #818cf8;
                    border: 1px solid rgba(99, 102, 241, 0.3); padding: 8px 14px;
                    border-radius: 10px; font-size: 12px; font-weight: 700;
                    cursor: pointer; font-family: inherit;
                  ">
                    <i class="fa-solid fa-pen"></i> تعديل
                  </button>

                  <!-- زر الحذف -->
                  <button class="btn-delete-exam" data-id="${exam.id}" style="
                    background: rgba(239, 68, 68, 0.15); color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.3); padding: 8px 14px;
                    border-radius: 10px; font-size: 12px; font-weight: 700;
                    cursor: pointer; font-family: inherit;
                  ">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
              `;
            }).join("")
          : `
            <div style="background: rgba(30, 41, 59, 0.4); border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px; text-align: center; color: #64748b; font-size: 15px;">
              لا توجد أي امتحانات مضافة حتى الآن. اضغط على "إنشاء امتحان جديد" للبدء.
            </div>
          `
        }
      </div>

    </div>
  </div>
  `;
}

document.addEventListener("click", (e) => {
  const app = document.querySelector("#app");
  if (!app) return;

  // زر الرجوع المباشر للوحة التحكم بدون أخطاء
  if (e.target.closest("#btnBackToDashboard")) {
    location.reload();
    return;
  }

  if (e.target.closest("#btnCreateNewExam")) {
    setExamToEdit(null);
    app.innerHTML = createExamPage();
    return;
  }

  const lockBtn = e.target.closest(".toggle-quick-lock");
  if (lockBtn) {
    const id = Number(lockBtn.getAttribute("data-id"));
    let exams = JSON.parse(localStorage.getItem("app_exams")) || [];
    
    exams = exams.map(exam => {
      if (exam.id === id) {
        exam.manualClose = !exam.manualClose;
      }
      return exam;
    });

    localStorage.setItem("app_exams", JSON.stringify(exams));
    app.innerHTML = examsListPage();
    return;
  }

  const editBtn = e.target.closest(".btn-edit-exam");
  if (editBtn) {
    const id = Number(editBtn.getAttribute("data-id"));
    const exams = JSON.parse(localStorage.getItem("app_exams")) || [];
    const examToEdit = exams.find(ex => ex.id === id);
    
    if (examToEdit) {
      setExamToEdit(examToEdit);
      app.innerHTML = createExamPage();
    }
    return;
  }

  const deleteBtn = e.target.closest(".btn-delete-exam");
  if (deleteBtn) {
    if (confirm("هل أنت متأكد من حذف هذا الامتحان نهائياً؟")) {
      const id = Number(deleteBtn.getAttribute("data-id"));
      let exams = JSON.parse(localStorage.getItem("app_exams")) || [];
      exams = exams.filter(ex => ex.id !== id);
      localStorage.setItem("app_exams", JSON.stringify(exams));
      app.innerHTML = examsListPage();
    }
    return;
  }
});