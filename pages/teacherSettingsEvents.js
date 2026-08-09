import { adminPage } from "./admin.js";

let settingsEventsInitialized = false;

export function teacherSettingsEvents() {
  if (settingsEventsInitialized) return;
  settingsEventsInitialized = true;

  document.addEventListener("click", (e) => {
    // حفظ الإعدادات
    if (e.target.closest("#saveSettings")) {
      const examTimeInput = document.getElementById("examTime");
      const scoreToggleInput = document.getElementById("scoreToggle");
      const answersToggleInput = document.getElementById("answersToggle");
      const reviewToggleInput = document.getElementById("reviewToggle");

      if (!examTimeInput || !scoreToggleInput || !answersToggleInput || !reviewToggleInput) {
        return;
      }

      const examTime = Math.max(1, Number(examTimeInput.value) || 30);
      const showScore = scoreToggleInput.checked;
      const showAnswers = answersToggleInput.checked;
      const allowReview = reviewToggleInput.checked;

      localStorage.setItem("examTime", examTime);
      localStorage.setItem("showScore", showScore);
      localStorage.setItem("showAnswers", showAnswers);
      localStorage.setItem("allowReview", allowReview);

      alert("Settings Saved Successfully ✅");

      const app = document.querySelector("#app");
      if (app) {
        app.innerHTML = adminPage();
      }
    }

    // زر الرجوع (Back To Home / Back) الواضح
    if (e.target.closest("#backAdmin")) {
      const app = document.querySelector("#app");
      if (app) {
        app.innerHTML = adminPage();
      }
    }
  });
}