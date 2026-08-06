import { subjectPage } from "./subject.js";
import { boardsPage } from "./boards.js";
import { filesPage } from "./files.js";
import { examsPage } from "./exams.js";

export function chemistryPage(){
  const currentClass = localStorage.getItem("currentClass") || "";

  return `
  <div style="
    min-height: 100vh;
    background: #0f172a;
    background-image: 
      radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%);
    font-family: 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif;
    padding: 50px 20px;
    direction: rtl;
  ">
    <div style="max-width: 900px; margin: 0 auto;">
      
      <!-- زر العودة لاختيار المادة -->
      <div style="margin-bottom: 30px;">
        <button id="backToSubjectsBtn" style="
          background: rgba(30, 41, 59, 0.7);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 12px 22px;
          font-size: 15px;
          font-weight: 700;
          border-radius: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
        ">
          <i class="fa-solid fa-arrow-right"></i> تغيير المادة الدراسية
        </button>
      </div>

      <!-- الترويسة -->
      <div style="
        background: rgba(30, 41, 59, 0.7);
        backdrop-filter: blur(16px);
        border-radius: 24px;
        padding: 45px 35px;
        color: #ffffff;
        text-align: center;
        margin-bottom: 40px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #10b981, #38bdf8, #10b981);
        "></div>
        
        <span style="
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          font-size: 14px;
          padding: 6px 16px;
          border-radius: 10px;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: inline-block;
          margin-bottom: 15px;
        ">${currentClass}</span>
        
        <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 10px 0; color: #f8fafc;">منصة مادة الكيمياء</h1>
        <p style="color: #94a3b8; font-size: 17px; margin: 0;">اختر القسم المطلوب لاستعراض المحتوى، الاختبارات، والملفات</p>
      </div>

      <!-- شبكة الأقسام (Exams, Boards, Files) -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
      ">

        <!-- الاختبارات -->
        <div id="chemistryExamsBtn" style="
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          padding: 35px 25px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          text-align: center;
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        " onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(52,211,153,0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.08)';">
          <div style="
            width: 60px; height: 60px;
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; margin: 0 auto 20px auto;
            border: 1px solid rgba(255, 255, 255, 0.08);
          "><i class="fa-solid fa-file-pen"></i></div>
          <h3 style="color: #f8fafc; font-size: 20px; font-weight: 700; margin: 0 0 8px 0;">الاختبارات</h3>
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">اختبر مستواك وتدرب على الأسئلة</p>
        </div>

        <!-- سبورة الشرح / الحصص -->
        <div id="chemistryBoardsBtn" style="
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          padding: 35px 25px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          text-align: center;
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        " onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(56,189,248,0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.08)';">
          <div style="
            width: 60px; height: 60px;
            background: rgba(56, 189, 248, 0.15);
            color: #38bdf8;
            border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; margin: 0 auto 20px auto;
            border: 1px solid rgba(255, 255, 255, 0.08);
          "><i class="fa-solid fa-chalkboard-user"></i></div>
          <h3 style="color: #f8fafc; font-size: 20px; font-weight: 700; margin: 0 0 8px 0;">سبورة الشرح</h3>
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">شروحات المحاضرات والسبورة التفاعلية</p>
        </div>

        <!-- الملفات والملازم -->
        <div id="chemistryFilesBtn" style="
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          padding: 35px 25px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          text-align: center;
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        " onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(251,191,36,0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.08)';">
          <div style="
            width: 60px; height: 60px;
            background: rgba(245, 158, 11, 0.15);
            color: #fbbf24;
            border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; margin: 0 auto 20px auto;
            border: 1px solid rgba(255, 255, 255, 0.08);
          "><i class="fa-solid fa-folder-open"></i></div>
          <h3 style="color: #f8fafc; font-size: 20px; font-weight: 700; margin: 0 0 8px 0;">الملفات والملازم</h3>
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">تحميل الكتب والملازم بصيغة PDF</p>
        </div>

      </div>

    </div>
  </div>
  `;
}

document.addEventListener("click", (e) => {
  const app = document.querySelector("#app");
  if(!app) return;

  if(e.target.closest("#chemistryExamsBtn")){
    const allExams = JSON.parse(localStorage.getItem("app_exams")) || [];
    const grade = localStorage.getItem("currentClass") || "";
  
    const result = allExams.filter(exam => {
      const subject = String(exam.subject || "").toLowerCase();
  
      return (
        (subject === "chemistry" || subject === "كيمياء") &&
        exam.className === grade
      );
    });
  
    localStorage.setItem(
      "filtered_exams",
      JSON.stringify(result)
    );
  
    app.innerHTML = examsPage();
    return;
  }

  if(e.target.closest("#chemistryBoardsBtn")){
    app.innerHTML = boardsPage();
    return;
  }

  if(e.target.closest("#chemistryFilesBtn")){
    app.innerHTML = filesPage();
    return;
  }

  if(e.target.closest("#backToSubjectsBtn")){
    app.innerHTML = subjectPage();
    return;
  }
});