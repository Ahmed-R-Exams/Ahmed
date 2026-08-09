import { adminPage } from "./admin.js";

let initialized = false;

export function teacherEvents() {
  if (initialized) return;
  initialized = true;

  document.addEventListener("click", (e) => {
    const login = e.target.closest("#teacherLoginBtn");
    if (!login) return;

    const usernameInput = document.getElementById("teacherUsername");
    const passwordInput = document.getElementById("teacherPassword");
    const error = document.getElementById("loginError");

    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (username === "Ahmed" && password === "1234") {
      localStorage.setItem("teacherLogin", "true");
      localStorage.setItem("currentRole", "teacher");

      const app = document.querySelector("#app");
      if (app) {
        app.innerHTML = adminPage();
      }
      return;
    }

    if (error) {
      error.textContent = "❌ اسم المستخدم أو كلمة المرور غير صحيحة";
      error.style.color = "#ef4444";
      error.style.fontSize = "13px";
      error.style.marginTop = "10px";
      error.style.textAlign = "center";
      error.style.fontWeight = "600";
    }
  });
}