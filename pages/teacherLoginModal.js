import { adminPage } from "./admin.js";
import { homePage } from "./home.js";

export function teacherLoginPage() {
  return `
  <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
    <div style="background: #1e293b; padding: 45px 35px; border-radius: 28px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5); width: 100%; max-width: 420px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.08); position: relative; overflow: hidden;">
      
      <!-- Background Glow Effect -->
      <div style="position: absolute; top: -40px; right: -40px; width: 150px; height: 150px; background: rgba(59, 130, 246, 0.15); filter: blur(40px); border-radius: 50%; pointer-events: none;"></div>

      <div style="font-size: 45px; margin-bottom: 15px; background: rgba(59, 130, 246, 0.15); width: 85px; height: 85px; display: inline-flex; align-items: center; justify-content: center; border-radius: 22px; border: 1px solid rgba(59, 130, 246, 0.3);">🔐</div>
      
      <h2 style="color: #ffffff; margin-bottom: 8px; font-size: 26px; font-weight: 800;">Teacher Login</h2>
      <p style="color: #94a3b8; font-size: 15px; margin-bottom: 30px; font-weight: 500;">Please enter your password to access dashboard</p>
      
      <form id="teacherLoginForm" style="display: flex; flex-direction: column; gap: 18px;">
        <input type="password" id="teacherPassword" placeholder="Enter Password..." required style="
          padding: 14px 18px; 
          border: 1px solid rgba(255, 255, 255, 0.12); 
          background: #0f172a;
          color: #ffffff;
          border-radius: 14px; 
          font-size: 16px;
          outline: none;
          transition: all 0.2s;
        " />
        
        <button type="submit" style="
          background: #3b82f6; 
          color: white; 
          border: none; 
          padding: 14px; 
          border-radius: 14px; 
          cursor: pointer; 
          font-weight: 700;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          transition: all 0.2s;
        ">
          Login
        </button>
      </form>

      <div id="loginError" style="margin-top: 15px; font-size: 14px; font-weight: 600;"></div>

      <div style="margin-top: 25px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px;">
        <button id="backHomeBtnFromLogin" style="
          background: transparent; 
          color: #94a3b8; 
          border: none; 
          cursor: pointer; 
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s;
        ">
          ⬅ Back To Home
        </button>
      </div>

    </div>
  </div>
  `;
}

// أحداث صفحة تسجيل الدخول
export function teacherLoginEvents() {
  const app = document.querySelector("#app");

  document.addEventListener("submit", (e) => {
    if (e.target.closest("#teacherLoginForm")) {
      e.preventDefault();
      const pass = document.getElementById("teacherPassword").value;
      const errorDiv = document.getElementById("loginError");
      
      if (pass === "1234") { 
        localStorage.setItem("teacherLogin", "true");
        localStorage.setItem("currentRole", "teacher");
        app.innerHTML = adminPage();
      } else {
        if (errorDiv) {
          errorDiv.textContent = "❌ كلمة المرور غير صحيحة!";
          errorDiv.style.color = "#ef4444";
        }
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("#backHomeBtnFromLogin")) {
      app.innerHTML = homePage();
    }
  });
}