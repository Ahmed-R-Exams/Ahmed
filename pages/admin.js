import { manageExamsPage } from "./manageExams.js";
import { teacherBoardsPage } from "./TeacherBoards.js";
import { resultsPage } from "./results.js";
import { homePage } from "./home.js";

export function adminPage() {
  return `
  <div class="container admin-page" style="max-width: 1200px; margin: 0 auto; padding: 35px; font-family: 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif; direction: rtl; min-height: 100vh; background: #0f172a; background-image: radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%);">
    
    <!-- Hero Banner -->
    <div style="background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); padding: 50px 40px; border-radius: 32px; color: white; box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.4); margin-bottom: 45px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 25px; border: 1px solid rgba(255, 255, 255, 0.08); position: relative; overflow: hidden;">
      
      <!-- Background Glow Effect -->
      <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(59, 130, 246, 0.15); filter: blur(50px); border-radius: 50%; pointer-events: none;"></div>

      <div style="z-index: 1;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
          <span style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; padding: 7px 18px; border-radius: 20px; font-size: 14px; font-weight: 700; border: 1px solid rgba(59, 130, 246, 0.35); display: inline-flex; align-items: center; gap: 6px;">
            <span>🛡️</span> لوحة تحكم المعلم الاحترافية
          </span>
          <span style="background: rgba(34, 197, 94, 0.15); color: #4ade80; padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
            <span style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #4ade80;"></span> النظام نشط
          </span>
        </div>
        <h1 style="font-size: 30px; font-weight: 800; margin: 0 0 10px 0; color: #ffffff; letter-spacing: -0.5px;">
          مرحباً بك، أستاذ أحمد 👨‍🏫
        </h1>
        <p style="color: #94a3b8; font-size: 17px; margin: 0; font-weight: 500;">
          Ahmed.R Physics Platform • إدارة شاملة ومتقدمة للاختبارات، الشروح، ومتابعة الطلاب بدقة.
        </p>
      </div>

      <div style="z-index: 1;">
        <button id="backHome" style="background: rgba(255, 255, 255, 0.07); color: #f1f5f9; border: 1px solid rgba(255, 255, 255, 0.15); padding: 14px 28px; border-radius: 16px; cursor: pointer; font-weight: 700; font-size: 15px; transition: all 0.25s ease; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px;">
          <span>🚪</span> تسجيل الخروج / الرئيسية
        </button>
      </div>
    </div>

    <!-- Section Title -->
    <div style="margin-bottom: 25px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
      <h2 style="font-size: 22px; font-weight: 800; color: #f8fafc; margin: 0; display: flex; align-items: center; gap: 10px;">
        <span style="background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(255,255,255,0.08); width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 16px;">⚡</span> الأقسام الرئيسية للوحة التحكم
      </h2>
      <span style="font-size: 14px; color: #94a3b8; font-weight: 600;">اختر قسماً للبدء</span>
    </div>

    <!-- Cards Grid -->
    <div class="cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 30px; margin-bottom: 40px;">

      <!-- Card 1: Manage Exams -->
      <div class="menu-card" id="cardManageExams" style="cursor: pointer; padding: 40px 35px; text-align: right; border-radius: 28px; border: 1px solid rgba(255,255,255,0.08); background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(16px); box-shadow: 0 15px 30px -10px rgba(0,0,0,0.3); transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(59,130,246,0.4)'; this.style.boxShadow='0 20px 40px -10px rgba(59,130,246,0.25)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.08)'; this.style.boxShadow='0 15px 30px -10px rgba(0,0,0,0.3)';">
        <div style="position: absolute; top: 0; right: 0; width: 6px; height: 100%; background: #3b82f6;"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
          <div style="font-size: 42px; background: rgba(59, 130, 246, 0.15); width: 85px; height: 85px; display: flex; align-items: center; justify-content: center; border-radius: 22px; border: 1px solid rgba(255,255,255,0.08);">
            📝
          </div>
          <span style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; padding: 6px 14px; border-radius: 12px; font-size: 13px; font-weight: 700;">إدارة شاملة</span>
        </div>

        <h3 style="color: #f8fafc; font-size: 24px; font-weight: 800; margin-bottom: 10px;">إدارة الامتحانات</h3>
        <p style="font-size: 15px; color: #94a3b8; margin: 0; font-weight: 500; line-height: 1.6;">إنشاء، تعديل، ونشر الاختبارات وتحديد إعدادات ظهور النتائج للطلاب بدقة تامة.</p>
      </div>

      <!-- Card 2: Manage Boards & Files -->
      <div class="menu-card" id="cardManageTeacherBoards" style="cursor: pointer; padding: 40px 35px; text-align: right; border-radius: 28px; border: 2px solid rgba(59,130,246,0.4); background: linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(30,58,138,0.25) 100%); backdrop-filter: blur(16px); box-shadow: 0 15px 35px -10px rgba(59,130,246,0.15); transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 20px 40px -10px rgba(59,130,246,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 15px 35px -10px rgba(59,130,246,0.15)';">
        <div style="position: absolute; top: 0; right: 0; width: 6px; height: 100%; background: #2563eb;"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
          <div style="font-size: 42px; background: rgba(59, 130, 246, 0.18); width: 85px; height: 85px; display: flex; align-items: center; justify-content: center; border-radius: 22px; border: 1px solid rgba(255,255,255,0.08);">
            📚
          </div>
          <span style="background: rgba(59, 130, 246, 0.18); color: #93c5fd; padding: 6px 14px; border-radius: 12px; font-size: 13px; font-weight: 700;">الملفات والشروح</span>
        </div>

        <h3 style="color: #f8fafc; font-size: 24px; font-weight: 800; margin-bottom: 10px;">إدارة السبورات والملفات</h3>
        <p style="font-size: 15px; color: #bfdbfe; margin: 0; font-weight: 500; line-height: 1.6;">رفع ومشاركة ملفات السبورة والملفات التعليمية بصيغة PDF للطلاب بكل سهولة.</p>
      </div>

      <!-- Card 3: Results -->
      <div class="menu-card" id="cardShowResults" style="cursor: pointer; padding: 40px 35px; text-align: right; border-radius: 28px; border: 1px solid rgba(255,255,255,0.08); background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(16px); box-shadow: 0 15px 30px -10px rgba(0,0,0,0.3); transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(16,185,129,0.4)'; this.style.boxShadow='0 20px 40px -10px rgba(16,185,129,0.25)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.08)'; this.style.boxShadow='0 15px 30px -10px rgba(0,0,0,0.3)';">
        <div style="position: absolute; top: 0; right: 0; width: 6px; height: 100%; background: #10b981;"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
          <div style="font-size: 42px; background: rgba(16, 185, 129, 0.15); width: 85px; height: 85px; display: flex; align-items: center; justify-content: center; border-radius: 22px; border: 1px solid rgba(255,255,255,0.08);">
            📊
          </div>
          <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 6px 14px; border-radius: 12px; font-size: 13px; font-weight: 700;">التقارير</span>
        </div>

        <h3 style="color: #f8fafc; font-size: 24px; font-weight: 800; margin-bottom: 10px;">النتائج</h3>
        <p style="font-size: 15px; color: #94a3b8; margin: 0; font-weight: 500; line-height: 1.6;">متابعة إجابات الطلاب، تصحيح الأسئلة المقالية، ورصد الدرجات والتقارير النهائية.</p>
      </div>

    </div>

  </div>
  `;
}

document.addEventListener("click", (e) => {
  const app = document.querySelector("#app");
  if (!app) return;

  if (e.target.closest("#cardManageExams")) {
    app.innerHTML = manageExamsPage();
    return;
  }

  if (e.target.closest("#cardManageTeacherBoards")) {
    app.innerHTML = teacherBoardsPage();
    return;
  }

  if (e.target.closest("#cardShowResults")) {
    app.innerHTML = resultsPage();
    return;
  }

  if (e.target.closest("#backHome")) {
    localStorage.removeItem("teacherLogin");
    app.innerHTML = homePage();
    return;
  }
});

export function adminEvents() {}