import { adminPage } from "./admin.js";
import { homePage } from "./home.js";

export function teacherLoginPage() {
  return `
  <div class="tl">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;800&family=Tajawal:wght@400;500;700&family=JetBrains+Mono:wght@500;600&display=swap');

      .tl{
        --ink-950:#0a0f1c;
        --ink-900:#111a2e;
        --ink-800:#1a2440;
        --line:#2a3559;
        --paper:#eef1f8;
        --muted:#93a0c2;
        --gold:#e8b34c;
        --fail:#ef4a63;

        min-height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        font-family:'Tajawal',sans-serif;
        color:var(--paper);
        background:
          radial-gradient(700px 260px at 50% 0%, rgba(232,179,76,.12), transparent 60%),
          linear-gradient(150deg,#0a0f1c,#141f3d 65%,#1c2a52);
      }
      .tl *{box-sizing:border-box;}

      .tl-card{
        width:100%;
        max-width:400px;
        background:var(--ink-900);
        border:1px solid var(--line);
        border-radius:24px;
        padding:44px 34px 34px;
        text-align:center;
        box-shadow:0 25px 50px -20px rgba(0,0,0,.55);
      }

      .tl-seal{
        width:84px;
        height:84px;
        margin:0 auto 20px;
        border-radius:50%;
        border:2px dashed var(--gold);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:34px;
        background:rgba(232,179,76,.08);
        transform:rotate(-6deg);
      }

      .tl-card h2{
        font-family:'Cairo',sans-serif;
        font-weight:800;
        font-size:24px;
        margin:0 0 8px;
        color:#fff;
      }
      .tl-card p{
        color:var(--muted);
        font-size:14px;
        margin:0 0 28px;
      }

      .tl-form{
        display:flex;
        flex-direction:column;
        gap:16px;
      }

      .tl-input{
        padding:14px 16px;
        border-radius:14px;
        border:1px solid var(--line);
        background:var(--ink-800);
        color:var(--paper);
        font-family:'Tajawal',sans-serif;
        font-size:15px;
        text-align:center;
        letter-spacing:2px;
      }
      .tl-input::placeholder{letter-spacing:normal; color:var(--muted);}
      .tl-input:focus-visible{outline:2px solid var(--gold); outline-offset:2px;}

      .tl-submit{
        padding:14px;
        border-radius:14px;
        border:none;
        cursor:pointer;
        font-family:'Cairo',sans-serif;
        font-weight:700;
        font-size:16px;
        color:#fff;
        background:linear-gradient(135deg,#2b5cff,#5b7dff);
        box-shadow:0 10px 24px -8px rgba(43,92,255,.55);
        transition:transform .15s ease, filter .15s ease;
      }
      .tl-submit:hover{filter:brightness(1.1); transform:translateY(-1px);}
      .tl-submit:focus-visible{outline:2px solid var(--gold); outline-offset:2px;}

      #loginError{
        margin-top:14px;
        font-size:13.5px;
        font-weight:600;
        min-height:18px;
      }

      .tl-back-row{
        margin-top:24px;
        padding-top:18px;
        border-top:1px solid var(--line);
      }
      .tl-back{
        background:transparent;
        border:none;
        cursor:pointer;
        color:var(--muted);
        font-family:'Tajawal',sans-serif;
        font-weight:600;
        font-size:13.5px;
        transition:color .15s ease;
      }
      .tl-back:hover{color:var(--gold);}
      .tl-back:focus-visible{outline:2px solid var(--gold); outline-offset:2px;}

      @media (prefers-reduced-motion: reduce){
        .tl-submit, .tl-back{transition:none;}
      }
    </style>

    <div class="tl-card">
      <div class="tl-seal">🔐</div>

      <h2>Teacher Login</h2>
      <p>Please enter your password to access dashboard</p>

      <form id="teacherLoginForm" class="tl-form">
        <input type="password" id="teacherPassword" class="tl-input" placeholder="Enter Password..." required>
        <button type="submit" class="tl-submit">Login</button>
      </form>

      <div id="loginError"></div>

      <div class="tl-back-row">
        <button id="backHomeBtnFromLogin" class="tl-back">⬅ Back To Home</button>
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
      
      if (pass === "Mrmido@123#") { 
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