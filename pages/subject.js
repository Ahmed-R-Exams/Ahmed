import { classesPage } from "./classes.js";
import { physicsPage } from "./physics.js";
import { chemistryPage } from "./chemistry.js";

export function subjectPage() {
  const currentClass = localStorage.getItem("currentClass") || "الصف الدراسي";

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
      
      <!-- زر العودة لصفحة الصفوف -->
      <div style="margin-bottom: 30px;">
        <button id="backToClassesBtn" style="
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
          <i class="fa-solid fa-arrow-right"></i> تغيير الصف الدراسي
        </button>
      </div>

      <!-- ترويسة الصفحة -->
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
          background: linear-gradient(90deg, #6366f1, #10b981, #6366f1);
        "></div>
        
        <span style="
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          font-size: 14px;
          padding: 6px 16px;
          border-radius: 10px;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: inline-block;
          margin-bottom: 15px;
        ">${currentClass}</span>
        
        <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 10px 0; color: #f8fafc;">اختر المادة الدراسية</h1>
        <p style="color: #94a3b8; font-size: 17px; margin: 0;">حدد المادة التي تريد استعراض محتواها والمقررات الخاصة بها</p>
      </div>

      <!-- شبكة المواد (فيزياء وكيمياء) -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 25px;
      ">

        <!-- مادة الفيزياء -->
        <div id="selectPhysicsBtn" style="
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          padding: 40px 30px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          text-align: center;
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        " onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(129,140,248,0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.08)';">
          <div style="
            width: 64px; height: 64px;
            background: rgba(99, 102, 241, 0.15);
            color: #818cf8;
            border-radius: 18px;
            display: flex; align-items: center; justify-content: center;
            font-size: 26px; margin: 0 auto 20px auto;
            border: 1px solid rgba(255, 255, 255, 0.08);
          "><i class="fa-solid fa-atom"></i></div>
          <h3 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin: 0 0 10px 0;">مادة الفيزياء</h3>
          <p style="color: #94a3b8; font-size: 15px; margin: 0; line-height: 1.6;">محاضرات، سبورة الشرح، والاختبارات الشاملة</p>
        </div>

        <!-- مادة الكيمياء -->
        <div id="selectChemistryBtn" style="
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          padding: 40px 30px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          text-align: center;
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        " onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(52,211,153,0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.08)';">
          <div style="
            width: 64px; height: 64px;
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border-radius: 18px;
            display: flex; align-items: center; justify-content: center;
            font-size: 26px; margin: 0 auto 20px auto;
            border: 1px solid rgba(255, 255, 255, 0.08);
          "><i class="fa-solid fa-flask"></i></div>
          <h3 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin: 0 0 10px 0;">مادة الكيمياء</h3>
          <p style="color: #94a3b8; font-size: 15px; margin: 0; line-height: 1.6;">محاضرات، تفاعلات وشروحات واختبارات شاملة</p>
        </div>

      </div>

    </div>
  </div>
  `;
}

// التحكم بالضغط بنفس أسلوب ملفات مشروعك
document.addEventListener("click", (e) => {
  const app = document.querySelector("#app");
  if (!app) return;

  if (e.target.closest("#selectPhysicsBtn")) {
    localStorage.setItem("currentSubject", "physics");
    app.innerHTML = physicsPage();
    return;
  }

  if (e.target.closest("#selectChemistryBtn")) {
    localStorage.setItem("currentSubject", "chemistry");
    app.innerHTML = chemistryPage();
    return;
  }

  if (e.target.closest("#backToClassesBtn")) {
    app.innerHTML = classesPage();
    return;
  }
});