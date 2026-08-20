import "./style.css";

import { homePage } from "./pages/home.js";
import { classesPage } from "./pages/classes.js";
import { subjectPage } from "./pages/subject.js";
import { physicsPage } from "./pages/physics.js";
import { boardsPage } from "./pages/boards.js";
import { filesPage } from "./pages/files.js";

import { examsPage } from "./pages/exams.js";
import { showExam } from "./pages/exam.js";

import { teacherBoardsPage } from "./pages/TeacherBoards.js";
import { adminPage } from "./pages/admin.js";

import {
  teacherLoginPage,
  teacherLoginEvents
} from "./pages/teacherLoginModal.js";

import { teacherSettingsPage } from "./pages/teacherSettings.js";
import { teacherSettingsEvents } from "./pages/teacherSettingsEvents.js";
import { resultsEvents } from "./pages/resultsEvents.js";

import { manageExamsEvents } from "./pages/manageExamsEvents.js";
import { createExamPage } from "./pages/createExam.js";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase.js";

import { loadExamsList } from "./pages/examsList.js";
import { resultsPage } from "./pages/results.js";

import { getResultById } from "./services/resultService.js";
import { reviewResultPage } from "./pages/reviewResult.js";

const app = document.querySelector("#app");


// ================= SHARED RESULT LINK =================
// لو اللينك فيه #result=ID (لينك نتيجة طالب اتبعت له)،
// نعرض نتيجته مباشرة بدل الصفحة الرئيسية.

function getSharedResultId() {
  const hash = window.location.hash || "";
  const match = hash.match(/result=([^&]+)/);

  return match ? decodeURIComponent(match[1]) : null;
}

const sharedResultId = getSharedResultId();


// ================= START =================

// اعرض الصفحة فورًا كأول خطوة (بدل ما تفضل فاضية لو Firebase اتأخر أو اتحظر)

if (sharedResultId) {

  app.innerHTML = `
    <div style="
      padding:60px 20px;
      text-align:center;
      color:#64748b;
      font-family:'Tajawal',Arial,sans-serif;
      direction:rtl;
    ">
      جاري تحميل النتيجة...
    </div>
  `;

  (async () => {

    try {

      const result = await getResultById(sharedResultId);

      if (result) {

        app.innerHTML = reviewResultPage(result);

      } else {

        app.innerHTML = `
          <div style="
            padding:60px 20px;
            text-align:center;
            color:#dc2626;
            font-family:'Tajawal',Arial,sans-serif;
            direction:rtl;
          ">
            تعذر العثور على النتيجة المطلوبة.
            <br>
            <span style="color:#94a3b8;font-size:13px;">
              الرابط غير صحيح أو تم حذف النتيجة.
            </span>
          </div>
        `;

      }

    } catch (error) {

      console.error("LOAD SHARED RESULT ERROR:", error);

      app.innerHTML = `
        <div style="
          padding:60px 20px;
          text-align:center;
          color:#dc2626;
          font-family:'Tajawal',Arial,sans-serif;
          direction:rtl;
        ">
          حدث خطأ أثناء تحميل النتيجة.
        </div>
      `;

    }

  })();

} else {

  app.innerHTML = homePage();

}

// Firebase Auth بيحافظ على جلسة المعلم بنفسه (حتى بعد refresh)، فمجرد ما
// يتأكد إن فيه مستخدم مسجّل دخول فعليًا هيعرض لوحة التحكم تلقائيًا.
// لكن لو الرابط ده رابط نتيجة مشاركة لطالب، منسيبوش الأوث يستبدلها.

onAuthStateChanged(
  auth,
  (user) => {
    if (user && !sharedResultId) {
      app.innerHTML = adminPage();
    }
  },
  (err) => {
    console.error("Firebase auth error:", err);
  }
);



// ================= EVENTS =================

document.addEventListener("click", async (e) => {


// HOME

if(
  e.target.closest("#startBtn") ||
  e.target.closest("#studentLogin")
){

  app.innerHTML = classesPage();

  return;

}



// TEACHER LOGIN

if(
  e.target.closest("#teacherLogin") ||
  e.target.closest("#adminBtn")
){

  if(
    auth.currentUser
  ){

    app.innerHTML = adminPage();

  }else{

    app.innerHTML = teacherLoginPage();

    teacherLoginEvents();

  }

  return;

}



// PHYSICS

if(
  e.target.closest("#physicsBtn")
){

  app.innerHTML = physicsPage();

  return;

}



// EXAMS

if(
  e.target.closest("#openExams") ||
  e.target.closest("#examBtn") ||
  e.target.closest("#btnExams")
){

  app.innerHTML = examsPage();

  return;

}



// DIRECT OPEN EXAM

if(
  e.target.closest("#startExam")
){

  app.innerHTML = showExam();

  return;

}



// BOARDS

if(
  e.target.closest("#boardsBtn")
){

  app.innerHTML = await boardsPage();

  return;

}



// FILES

if(
  e.target.closest("#filesBtn")
){

  app.innerHTML = await filesPage();

  return;

}



// MANAGE EXAMS

if(
  e.target.closest("#manageExamsBtn")
){

  app.innerHTML = manageExamsPage();

  manageExamsEvents();

  return;

}



// CREATE EXAM

if(
  e.target.closest("#btnCreateExam")
){

  app.innerHTML = createExamPage();

  return;

}



// EXAMS LIST

if(
  e.target.closest("#btnExamsList")
){

  loadExamsList();

  return;

}



// TEACHER BOARDS

if(
  e.target.closest("#manageBoardsBtn")
){

  app.innerHTML = teacherBoardsPage();

  return;

}



// SETTINGS

if(
  e.target.closest("#teacherSettingsBtn")
){

  app.innerHTML = teacherSettingsPage();

  teacherSettingsEvents();

  return;

}



// RESULTS

if(
  e.target.closest("#resultsBtn")
){

  app.innerHTML = resultsPage();

  resultsEvents();

  return;

}



// BACK ADMIN

if(
  e.target.closest("#btnBackToAdmin")
){

  app.innerHTML = adminPage();

  return;

}



// BACK

if(
  e.target.closest("#backBtn") ||
  e.target.closest("#btnBack")
){

  app.innerHTML = classesPage();

  return;

}


});