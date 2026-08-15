// pages/admin.js

import { manageExamsPage } from "./manageExams.js";
import { manageExamsEvents } from "./manageExamsEvents.js";
import { teacherBoardsPage } from "./TeacherBoards.js";
import { resultsPage } from "./results.js";
import { homePage } from "./home.js";

import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";


// ======================================================
// ADMIN PAGE
// ======================================================

export function adminPage() {

  return `

<div style="
  background:linear-gradient(135deg,#090d16,#1e293b);
  padding:50px 40px;
  border-radius:32px;
  color:white;
  margin-bottom:45px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex-wrap:wrap;
">

  <div>

    <h1 style="
      color:white;
      margin:0;
    ">
      مرحباً بك، أستاذ أحمد 👨‍🏫
    </h1>

    <p style="
      color:#94a3b8;
    ">
      Ahmed.R Physics Platform
    </p>

  </div>


  <button
    id="backHome"
    style="
      padding:14px 25px;
      border-radius:16px;
      cursor:pointer;
    "
  >
    🚪 الرئيسية
  </button>

</div>


<div
  class="cards"
  style="
    display:grid;
    grid-template-columns:repeat(
      auto-fit,
      minmax(340px,1fr)
    );
    gap:30px;
  "
>


  <!-- إدارة الامتحانات -->

  <div
    class="menu-card"
    id="cardManageExams"
  >

    📝

    <h3>
      إدارة الامتحانات
    </h3>

    <p>
      إنشاء وتعديل ونشر الامتحانات
    </p>

  </div>


  <!-- السبورات والملفات -->

  <div
    class="menu-card"
    id="cardManageTeacherBoards"
  >

    📚

    <h3>
      إدارة السبورات والملفات
    </h3>

    <p>
      رفع الملفات التعليمية
    </p>

  </div>


  <!-- النتائج -->

  <div
    class="menu-card"
    id="cardShowResults"
  >

    📊

    <h3>
      النتائج
    </h3>

    <p>
      متابعة نتائج الطلاب
    </p>

  </div>


</div>

`;

}


// ======================================================
// ADMIN EVENTS
// ======================================================

document.addEventListener(
  "click",
  async (e) => {

    const app =
      document.querySelector("#app");

    if (!app) return;


    // ==================================================
    // إدارة الامتحانات
    // ==================================================

    if (
      e.target.closest("#cardManageExams")
    ) {

      try {

        app.innerHTML = `
          <div style="
            min-height:300px;
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-family:Cairo,sans-serif;
            text-align:center;
          ">
            ⏳ جاري تحميل إدارة الامتحانات...
          </div>
        `;


        // مهم جدًا:
        // manageExamsPage ترجع Promise

        const html =
          await manageExamsPage();


        app.innerHTML =
          html;


        // تشغيل أحداث صفحة إدارة الامتحانات

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
            font-family:Cairo,sans-serif;
          ">

            <h3>
              حدث خطأ أثناء تحميل إدارة الامتحانات
            </h3>

            <p>
              ${escapeHtml(
                error?.message ||
                "خطأ غير معروف"
              )}
            </p>

            <button
              id="adminErrorBack"
              style="
                margin-top:20px;
                padding:12px 25px;
                border:none;
                border-radius:12px;
                cursor:pointer;
              "
            >
              ⬅ رجوع
            </button>

          </div>

        `;

      }

      return;

    }


    // ==================================================
    // إدارة السبورات والملفات
    // ==================================================

    if (
      e.target.closest(
        "#cardManageTeacherBoards"
      )
    ) {

      try {

        app.innerHTML = `
          <div style="
            min-height:300px;
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-family:Cairo,sans-serif;
          ">
            ⏳ جاري تحميل السبورات...
          </div>
        `;


        /*
         * لو teacherBoardsPage أصبحت async
         * الكود ده يشتغل معها أيضًا.
         *
         * ولو كانت sync، await لن يسبب مشكلة.
         */

        const html =
          await teacherBoardsPage();


        app.innerHTML =
          html;

      }
      catch (error) {

        console.error(
          "TEACHER BOARDS ERROR:",
          error
        );


        app.innerHTML = `

          <div style="
            padding:50px;
            color:#ef4444;
            text-align:center;
            direction:rtl;
            font-family:Cairo,sans-serif;
          ">

            <h3>
              حدث خطأ أثناء تحميل السبورات
            </h3>

            <p>
              ${escapeHtml(
                error?.message ||
                "خطأ غير معروف"
              )}
            </p>

          </div>

        `;

      }

      return;

    }


    // ==================================================
    // النتائج
    // ==================================================

    if (
      e.target.closest(
        "#cardShowResults"
      )
    ) {

      try {

        app.innerHTML = `

          <div style="
            padding:50px;
            color:white;
            text-align:center;
            direction:rtl;
            font-family:Cairo,sans-serif;
          ">

            ⏳ جاري تحميل النتائج...

          </div>

        `;


        const html =
          await resultsPage();


        app.innerHTML =
          html;

      }
      catch (err) {

        console.error(
          "RESULTS ERROR:",
          err
        );


        app.innerHTML = `

          <div style="
            padding:50px;
            color:#ef4444;
            text-align:center;
            direction:rtl;
            font-family:Cairo,sans-serif;
          ">

            <h3>
              خطأ في صفحة النتائج
            </h3>

            <br>

            ${escapeHtml(
              err?.message ||
              "خطأ غير معروف"
            )}

          </div>

        `;

      }

      return;

    }


    // ==================================================
    // رجوع من شاشة الخطأ
    // ==================================================

    if (
      e.target.closest(
        "#adminErrorBack"
      )
    ) {

      app.innerHTML =
        adminPage();

      return;

    }


    // ==================================================
    // الرئيسية / تسجيل الخروج
    // ==================================================

    if (
      e.target.closest("#backHome")
    ) {

      try {

        await signOut(auth);

      }
      catch (err) {

        console.error(
          "Sign out error:",
          err
        );

      }


      localStorage.removeItem(
        "teacherLogin"
      );

      localStorage.removeItem(
        "currentRole"
      );


      app.innerHTML =
        homePage();


      return;

    }

  }
);


// ======================================================
// EMPTY EXPORT
// ======================================================

export function adminEvents() {}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

  return String(value ?? "")
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