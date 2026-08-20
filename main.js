import "./style.css";

import {
  homePage
} from "./pages/home.js";

import {
  classesPage
} from "./pages/classes.js";

import {
  physicsPage
} from "./pages/physics.js";

import {
  boardsPage
} from "./pages/boards.js";

import {
  filesPage
} from "./pages/files.js";

import {
  examsPage
} from "./pages/exams.js";

import {
  showExam
} from "./pages/exam.js";

import {
  teacherBoardsPage
} from "./pages/TeacherBoards.js";

import {
  adminPage
} from "./pages/admin.js";

import {
  teacherLoginPage,
  teacherLoginEvents
} from "./pages/teacherLoginModal.js";

import {
  teacherSettingsPage
} from "./pages/teacherSettings.js";

import {
  teacherSettingsEvents
} from "./pages/teacherSettingsEvents.js";

import {
  resultsEvents
} from "./pages/resultsEvents.js";

import {
  manageExamsEvents
} from "./pages/manageExamsEvents.js";

import {
  createExamPage
} from "./pages/createExam.js";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  auth
} from "./firebase.js";

import {
  resultsPage
} from "./pages/results.js";

import {
  getResultById
} from "./services/resultService.js";

import {
  reviewResultPage
} from "./pages/reviewResult.js";

import {
  openAdminPage,
  openExamsList,
  openCreateExamPage,
  backToAdmin
} from "./pages/appRouter.js";


// ======================================================
// APP
// ======================================================

const app =
  document.querySelector(
    "#app"
  );


// ======================================================
// SHARED RESULT
// ======================================================

function getSharedResultId() {

  const url =
    new URL(
      window.location.href
    );


  const queryResult =
    url.searchParams.get(
      "result"
    );


  if (queryResult) {

    return queryResult;

  }


  const hash =
    url.hash || "";


  const match =
    hash.match(
      /(?:^#|&)result=([^&]+)/
    );


  if (match) {

    return decodeURIComponent(
      match[1]
    );

  }


  return null;

}


const sharedResultId =
  getSharedResultId();


// ======================================================
// START
// ======================================================

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

      const result =
        await getResultById(
          sharedResultId
        );


      if (result) {

        app.innerHTML =
          reviewResultPage(
            result
          );

      }
      else {

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

            <span style="
              color:#94a3b8;
              font-size:13px;
            ">

              الرابط غير صحيح أو تم حذف النتيجة.

            </span>

          </div>

        `;

      }

    }
    catch (error) {

      console.error(
        "LOAD SHARED RESULT ERROR:",
        error
      );


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

}
else {

  app.innerHTML =
    homePage();

}


// ======================================================
// FIREBASE AUTH
// ======================================================

onAuthStateChanged(
  auth,
  user => {

    if (
      user &&
      !sharedResultId
    ) {

      openAdminPage();

    }

  },
  error => {

    console.error(
      "Firebase auth error:",
      error
    );

  }
);


// ======================================================
// MAIN NAVIGATION
// ======================================================

document.addEventListener(
  "click",
  async e => {

    // ==================================================
    // HOME / STUDENT
    // ==================================================

    if (
      e.target.closest(
        "#startBtn"
      ) ||
      e.target.closest(
        "#studentLogin"
      )
    ) {

      app.innerHTML =
        classesPage();

      return;

    }


    // ==================================================
    // TEACHER LOGIN
    // ==================================================

    if (
      e.target.closest(
        "#teacherLogin"
      ) ||
      e.target.closest(
        "#adminBtn"
      )
    ) {

      if (
        auth.currentUser
      ) {

        openAdminPage();

      }
      else {

        app.innerHTML =
          teacherLoginPage();

        teacherLoginEvents();

      }

      return;

    }


    // ==================================================
    // PHYSICS
    // ==================================================

    if (
      e.target.closest(
        "#physicsBtn"
      )
    ) {

      app.innerHTML =
        physicsPage();

      return;

    }


    // ==================================================
    // EXAMS
    // ==================================================

    if (
      e.target.closest(
        "#openExams"
      ) ||
      e.target.closest(
        "#examBtn"
      ) ||
      e.target.closest(
        "#btnExams"
      )
    ) {

      app.innerHTML =
        examsPage();

      return;

    }


    // ==================================================
    // DIRECT EXAM
    // ==================================================

    if (
      e.target.closest(
        "#startExam"
      )
    ) {

      app.innerHTML =
        showExam();

      return;

    }


    // ==================================================
    // BOARDS
    // ==================================================

    if (
      e.target.closest(
        "#boardsBtn"
      )
    ) {

      app.innerHTML =
        await boardsPage();

      return;

    }


    // ==================================================
    // FILES
    // ==================================================

    if (
      e.target.closest(
        "#filesBtn"
      )
    ) {

      app.innerHTML =
        await filesPage();

      return;

    }


    // ==================================================
    // MANAGE EXAMS
    // ==================================================

    if (
      e.target.closest(
        "#manageExamsBtn"
      )
    ) {

      try {

        app.innerHTML = `

          <div style="
            padding:50px;
            text-align:center;
            color:white;
            direction:rtl;
          ">

            ⏳ جاري تحميل إدارة الامتحانات...

          </div>

        `;


        const module =
          await import(
            "./pages/manageExams.js"
          );


        const html =
          await module.manageExamsPage();


        app.innerHTML =
          html;


        manageExamsEvents();

      }
      catch (error) {

        console.error(
          "MANAGE EXAMS ERROR:",
          error
        );


        app.innerHTML = `

          <div style="
            padding:50px;
            color:#ef4444;
            text-align:center;
            direction:rtl;
          ">

            حدث خطأ أثناء تحميل إدارة الامتحانات.

            <br><br>

            ${escapeHtml(
              error?.message ||
              "خطأ غير معروف"
            )}

          </div>

        `;

      }

      return;

    }


    // ==================================================
    // CREATE EXAM
    // ==================================================

    if (
      e.target.closest(
        "#btnCreateExam"
      )
    ) {

      openCreateExamPage();

      return;

    }


    // ==================================================
    // EXAMS LIST
    // ==================================================

    if (
      e.target.closest(
        "#btnExamsList"
      )
    ) {

      try {

        await openExamsList();

      }
      catch (error) {

        console.error(
          "OPEN EXAMS LIST ERROR:",
          error
        );

      }

      return;

    }


    // ==================================================
    // TEACHER BOARDS
    // ==================================================

    if (
      e.target.closest(
        "#manageBoardsBtn"
      )
    ) {

      app.innerHTML =
        teacherBoardsPage();

      return;

    }


    // ==================================================
    // SETTINGS
    // ==================================================

    if (
      e.target.closest(
        "#teacherSettingsBtn"
      )
    ) {

      app.innerHTML =
        teacherSettingsPage();

      teacherSettingsEvents();

      return;

    }


    // ==================================================
    // RESULTS
    // ==================================================

    if (
      e.target.closest(
        "#resultsBtn"
      )
    ) {

      try {

        app.innerHTML =
          await resultsPage();

        resultsEvents();

      }
      catch (error) {

        console.error(
          "RESULTS ERROR:",
          error
        );

      }

      return;

    }


    // ==================================================
    // BACK ADMIN
    // ==================================================

    if (
      e.target.closest(
        "#btnBackToAdmin"
      )
    ) {

      backToAdmin();

      return;

    }


    // ==================================================
    // BACK
    // ==================================================

    if (
      e.target.closest(
        "#backBtn"
      ) ||
      e.target.closest(
        "#btnBack"
      )
    ) {

      app.innerHTML =
        classesPage();

      return;

    }

  }
);


// ======================================================
// ESCAPE
// ======================================================

function escapeHtml(value) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}