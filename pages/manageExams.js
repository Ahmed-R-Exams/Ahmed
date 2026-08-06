import { createExamPage } from "./createExam.js";
import { examsListPage } from "./examsList.js";
import { importExamEvents } from "./importExamEvents.js";
import { adminPage } from "./admin.js";

export function manageExamsPage() {
  return `
  <div style="
    min-height: 100vh;
    background: #0f172a;
    background-image:
      radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%);
    font-family: 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif;
    padding: 50px 20px;
    direction: rtl;
  ">
    <div style="max-width: 950px; margin: 0 auto;">

      <!-- Hero Header -->
      <div style="
        background: linear-gradient(135deg, #090d16 0%, #1e293b 100%);
        padding: 40px 35px; border-radius: 28px; color: white;
        box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.4);
        margin-bottom: 35px; display: flex; justify-content: space-between; align-items: center;
        flex-wrap: wrap; gap: 20px; border: 1px solid rgba(255, 255, 255, 0.08);
        position: relative; overflow: hidden;
      ">
        <div style="position: absolute; top: -50px; left: -50px; width: 180px; height: 180px; background: rgba(99, 102, 241, 0.15); filter: blur(50px); border-radius: 50%; pointer-events: none;"></div>

        <div style="z-index: 1;">
          <span style="background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; border: 1px solid rgba(99, 102, 241, 0.3); display: inline-block; margin-bottom: 12px;">
            📝 إدارة المحتوى
          </span>
          <h1 style="font-size: 26px; font-weight: 800; margin: 0 0 8px 0; color: #ffffff;">إدارة الامتحانات</h1>
          <p style="color: #94a3b8; font-size: 14.5px; margin: 0;">إنشاء وتعديل وتنظيم اختبارات الفيزياء والكيمياء</p>
        </div>

        <button id="backAdmin" style="
          background: rgba(255, 255, 255, 0.07); color: #f1f5f9;
          border: 1px solid rgba(255, 255, 255, 0.15); padding: 12px 24px; border-radius: 14px;
          cursor: pointer; font-weight: 700; font-size: 14px; font-family: inherit;
          display: flex; align-items: center; gap: 8px; z-index: 1;
        ">
          <span>⬅</span> رجوع للوحة التحكم
        </button>
      </div>

      <!-- Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">

        <div id="cardCreateExam" style="
          cursor: pointer; padding: 32px 26px; text-align: center; border-radius: 22px;
          background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
          transition: all 0.25s ease;
        " onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='rgba(99, 102, 241, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255, 255, 255, 0.08)';">
          <div style="
            width: 60px; height: 60px; margin: 0 auto 18px auto;
            background: rgba(99, 102, 241, 0.15); color: #818cf8; border-radius: 16px;
            display: flex; align-items: center; justify-content: center; font-size: 26px;
            border: 1px solid rgba(255, 255, 255, 0.08);
          ">➕</div>
          <h3 style="color: #f8fafc; font-size: 19px; font-weight: 700; margin: 0 0 8px 0;">إنشاء امتحان جديد</h3>
          <p style="color: #94a3b8; font-size: 13.5px; margin: 0; line-height: 1.6;">بناء اختبار كامل بالأسئلة والمدة والتوقيت</p>
        </div>

        <div id="cardPublishedExams" style="
          cursor: pointer; padding: 32px 26px; text-align: center; border-radius: 22px;
          background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
          transition: all 0.25s ease;
        " onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='rgba(16, 185, 129, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255, 255, 255, 0.08)';">
          <div style="
            width: 60px; height: 60px; margin: 0 auto 18px auto;
            background: rgba(16, 185, 129, 0.15); color: #34d399; border-radius: 16px;
            display: flex; align-items: center; justify-content: center; font-size: 26px;
            border: 1px solid rgba(255, 255, 255, 0.08);
          ">📋</div>
          <h3 style="color: #f8fafc; font-size: 19px; font-weight: 700; margin: 0 0 8px 0;">قائمة الامتحانات</h3>
          <p style="color: #94a3b8; font-size: 13.5px; margin: 0; line-height: 1.6;">عرض وتعديل وحذف الاختبارات المنشورة</p>
        </div>

        <div id="cardImportQuestions" style="
          cursor: pointer; padding: 32px 26px; text-align: center; border-radius: 22px;
          background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
          transition: all 0.25s ease;
        " onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='rgba(245, 158, 11, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255, 255, 255, 0.08)';">
          <div style="
            width: 60px; height: 60px; margin: 0 auto 18px auto;
            background: rgba(245, 158, 11, 0.15); color: #fbbf24; border-radius: 16px;
            display: flex; align-items: center; justify-content: center; font-size: 26px;
            border: 1px solid rgba(255, 255, 255, 0.08);
          ">📥</div>
          <h3 style="color: #f8fafc; font-size: 19px; font-weight: 700; margin: 0 0 8px 0;">استيراد من Excel</h3>
          <p style="color: #94a3b8; font-size: 13.5px; margin: 0; line-height: 1.6;">رفع مجموعة أسئلة دفعة واحدة من ملف إكسل</p>
        </div>

      </div>

      <input type="file" id="excelFile" accept=".xlsx,.xls" style="display:none">

    </div>
  </div>
  `;
}

document.addEventListener("click", (e) => {
  const app = document.querySelector("#app");
  if (!app) return;

  if (e.target.closest("#cardCreateExam")) {
    app.innerHTML = createExamPage();
    return;
  }

  if (e.target.closest("#cardPublishedExams")) {
    app.innerHTML = examsListPage();
    return;
  }

  if (e.target.closest("#cardImportQuestions")) {
    const input = document.getElementById("excelFile");
    if (input) {
      importExamEvents();
      input.click();
    }
    return;
  }

  if (e.target.closest("#backAdmin")) {
    app.innerHTML = adminPage();
    return;
  }
});

export function manageExamsEvents() {}