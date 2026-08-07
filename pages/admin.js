import { manageExamsPage } from "./manageExams.js";
import { teacherBoardsPage } from "./TeacherBoards.js";
import { resultsPage } from "./results.js";
import { homePage } from "./home.js";

export function adminPage() {
  return `
<!-- Hero Banner -->
<div style="background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); padding: 50px 40px; border-radius: 32px; color: white; box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.4); margin-bottom: 45px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 25px; border: 1px solid rgba(255, 255, 255, 0.08); position: relative; overflow: hidden;">

<div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(59, 130, 246, 0.15); filter: blur(50px); border-radius: 50%; pointer-events: none;"></div>


<div style="z-index:1;">

<div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">

<span style="background:rgba(59,130,246,.2);color:#60a5fa;padding:7px 18px;border-radius:20px;font-size:14px;font-weight:700;">
🛡️ لوحة تحكم المعلم الاحترافية
</span>


<span style="background:rgba(34,197,94,.15);color:#4ade80;padding:7px 16px;border-radius:20px;font-size:13px;font-weight:700;">
🟢 النظام نشط
</span>

</div>


<h1 style="font-size:30px;font-weight:800;margin:0 0 10px;color:white;">
مرحباً بك، أستاذ أحمد 👨‍🏫
</h1>


<p style="color:#94a3b8;font-size:17px;margin:0;">
Ahmed.R Physics Platform • إدارة شاملة ومتقدمة للاختبارات، الشروح، ومتابعة الطلاب بدقة.
</p>


</div>


<div style="z-index:1;">

<button id="backHome"
style="
background:rgba(255,255,255,.07);
color:#f1f5f9;
border:1px solid rgba(255,255,255,.15);
padding:14px 28px;
border-radius:16px;
cursor:pointer;
font-weight:700;
">

🚪 تسجيل الخروج / الرئيسية

</button>

</div>


</div>


<!-- باقي تصميم الكروت كما هو بدون تعديل -->

<div class="cards"
style="
display:grid;
grid-template-columns:repeat(auto-fit,minmax(340px,1fr));
gap:30px;
margin-bottom:40px;
">


<div class="menu-card"
id="cardManageExams">

📝

<h3>
إدارة الامتحانات
</h3>

<p>
إنشاء، تعديل، ونشر الاختبارات وتحديد إعدادات ظهور النتائج.
</p>

</div>



<div class="menu-card"
id="cardManageTeacherBoards">

📚

<h3>
إدارة السبورات والملفات
</h3>

<p>
رفع ومشاركة ملفات السبورة والملفات التعليمية.
</p>

</div>




<div class="menu-card"
id="cardShowResults">

📊

<h3>
النتائج
</h3>

<p>
متابعة إجابات الطلاب وتصحيح الأسئلة المقالية.
</p>

</div>


</div>

`;
}
document.addEventListener("click", async (e) => {

  const app = document.querySelector("#app");
  
  if (!app) return;
  
  
  
  // إدارة الامتحانات
  if (e.target.closest("#cardManageExams")) {
  
  app.innerHTML = manageExamsPage();
  
  return;
  
  }
  
  
  
  // إدارة السبورات والملفات
  if (e.target.closest("#cardManageTeacherBoards")) {
  
  app.innerHTML = teacherBoardsPage();
  
  return;
  
  }
  
  
  
  // النتائج
  if (e.target.closest("#cardShowResults")) {
  
  app.innerHTML = resultsPage();
  
  
  // تشغيل أحداث النتائج بعد تحميل الصفحة
  const module =
  await import("./results.js");
  
  
  if(module.resultsEvents){
  
  module.resultsEvents();
  
  }
  
  
  return;
  
  }
  
  
  
  // العودة للرئيسية
  if (e.target.closest("#backHome")) {
  
  localStorage.removeItem("teacherLogin");
  
  
  app.innerHTML =
  homePage();
  
  
  return;
  
  }
  
  
  });
  
  
  
  export function adminEvents() {}
