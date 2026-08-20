// pages/appRouter.js


// ======================================================
// APP ROUTER
// ======================================================
// مسؤول فقط عن التنقل بين صفحات لوحة التحكم.
// لا يتم تحميل صفحات الامتحانات بشكل static لتجنب
// circular dependencies بين:
// appRouter.js
// examsList.js
// createExam.js
// createExamEvents.js
// ======================================================


// ======================================================
// APP
// ======================================================

function getApp() {

    const app =
      document.querySelector(
        "#app"
      );
  
    if (!app) {
  
      throw new Error(
        "لم يتم العثور على عنصر #app."
      );
  
    }
  
    return app;
  
  }
  
  
  // ======================================================
  // YIELD
  // ======================================================
  
  function yieldToBrowser() {
  
    return new Promise(
      resolve => {
  
        setTimeout(
          resolve,
          0
        );
  
      }
    );
  
  }
  
  
  // ======================================================
  // ADMIN
  // ======================================================
  
  export async function openAdminPage() {
  
    const app =
      getApp();
  
  
    try {
  
      // تحميل الصفحة عند الحاجة فقط
      const module =
        await import(
          "./admin.js"
        );
  
  
      if (
        typeof module.adminPage !==
        "function"
      ) {
  
        throw new Error(
          "adminPage غير موجودة."
        );
  
      }
  
  
      app.innerHTML =
        module.adminPage();
  
  
      await yieldToBrowser();
  
    }
    catch (error) {
  
      console.error(
        "OPEN ADMIN PAGE ERROR:",
        error
      );
  
  
      app.innerHTML = `
  
        <div style="
          padding:50px;
          text-align:center;
          direction:rtl;
          color:#ef4444;
          font-family:Tajawal,Arial,sans-serif;
        ">
  
          <h3>
            ❌ تعذر فتح لوحة التحكم
          </h3>
  
          <p style="
            color:#94a3b8;
            font-size:13px;
          ">
  
            ${
              String(
                error?.message ||
                "خطأ غير معروف"
              )
            }
  
          </p>
  
        </div>
  
      `;
  
      throw error;
  
    }
  
  }
  
  
  // ======================================================
  // EXAMS LIST
  // ======================================================
  
  export async function openExamsList() {
  
    const app =
      getApp();
  
  
    try {
  
      // ==================================================
      // تحميل examsList عند الحاجة فقط
      // ==================================================
  
      const module =
        await import(
          "./examsList.js"
        );
  
  
      if (
        typeof module.examsListPage !==
        "function"
      ) {
  
        throw new Error(
          "examsListPage غير موجودة."
        );
  
      }
  
  
      if (
        typeof module.loadExamsList !==
        "function"
      ) {
  
        throw new Error(
          "loadExamsList غير موجودة."
        );
  
      }
  
  
      // ==================================================
      // رسم الصفحة
      // ==================================================
  
      app.innerHTML =
        module.examsListPage();
  
  
      // ==================================================
      // تأكيد أن DOM تم إنشاؤه
      // ==================================================
  
      await yieldToBrowser();
  
  
      const container =
        document.querySelector(
          "#firebaseExamsList"
        );
  
  
      if (!container) {
  
        throw new Error(
          "لم يتم إنشاء #firebaseExamsList."
        );
  
      }
  
  
      // ==================================================
      // تحميل الامتحانات
      // ==================================================
  
      await module.loadExamsList();
  
  
      // ==================================================
      // تأكيد نهائي
      // ==================================================
  
      if (
        !document.body.contains(
          container
        )
      ) {
  
        console.warn(
          "⚠️ Exams list container was removed during loading."
        );
  
      }
  
    }
    catch (error) {
  
      console.error(
        "OPEN EXAMS LIST ERROR:",
        error
      );
  
  
      // مهم:
      // لا نترك الصفحة معلقة على
      // "جاري تحميل الامتحانات..."
  
      if (app) {
  
        app.innerHTML = `
  
          <div style="
            padding:50px;
            text-align:center;
            direction:rtl;
            color:#ef4444;
            font-family:Tajawal,Arial,sans-serif;
          ">
  
            <h3>
              ❌ تعذر تحميل قائمة الامتحانات
            </h3>
  
            <p style="
              color:#94a3b8;
              font-size:13px;
              line-height:1.8;
            ">
  
              ${
                String(
                  error?.message ||
                  "خطأ غير معروف"
                )
              }
  
            </p>
  
            <button
              id="btnRetryExamsList"
              type="button"
              style="
                margin-top:15px;
                padding:11px 22px;
                border:none;
                border-radius:10px;
                cursor:pointer;
                font-weight:700;
                font-family:inherit;
              "
            >
  
              🔄 إعادة تحميل الامتحانات
  
            </button>
  
          </div>
  
        `;
  
  
        // ==================================================
        // RETRY
        // ==================================================
  
        const retryButton =
          document.querySelector(
            "#btnRetryExamsList"
          );
  
  
        if (retryButton) {
  
          retryButton.onclick =
            async () => {
  
              retryButton.disabled =
                true;
  
              retryButton.textContent =
                "⏳ جاري المحاولة...";
  
  
              try {
  
                await openExamsList();
  
              }
              catch (retryError) {
  
                console.error(
                  "RETRY EXAMS LIST ERROR:",
                  retryError
                );
  
              }
  
            };
  
        }
  
      }
  
  
      throw error;
  
    }
  
  }
  
  
  // ======================================================
  // CREATE EXAM
  // ======================================================
  
  export async function openCreateExamPage() {
  
    const app =
      getApp();
  
  
    try {
  
      // ==================================================
      // تحميل createExam عند الحاجة فقط
      // ==================================================
  
      const module =
        await import(
          "./createExam.js"
        );
  
  
      if (
        typeof module.createExamPage !==
        "function"
      ) {
  
        throw new Error(
          "createExamPage غير موجودة."
        );
  
      }
  
  
      // ==================================================
      // رسم الصفحة
      // ==================================================
  
      app.innerHTML =
        module.createExamPage();
  
  
      await yieldToBrowser();
  
  
      // ==================================================
      // تشغيل الأحداث بعد إنشاء DOM
      // ==================================================
  
      const eventsModule =
        await import(
          "./createExamEvents.js"
        );
  
  
      if (
        typeof eventsModule.createExamEvents ===
        "function"
      ) {
  
        eventsModule.createExamEvents();
  
      }
  
  
    }
    catch (error) {
  
      console.error(
        "OPEN CREATE EXAM PAGE ERROR:",
        error
      );
  
  
      app.innerHTML = `
  
        <div style="
          padding:50px;
          text-align:center;
          direction:rtl;
          color:#ef4444;
          font-family:Tajawal,Arial,sans-serif;
        ">
  
          <h3>
            ❌ تعذر فتح صفحة إنشاء الامتحان
          </h3>
  
          <p style="
            color:#94a3b8;
            font-size:13px;
          ">
  
            ${
              String(
                error?.message ||
                "خطأ غير معروف"
              )
            }
  
          </p>
  
        </div>
  
      `;
  
  
      throw error;
  
    }
  
  }
  
  
  // ======================================================
  // BACK TO ADMIN
  // ======================================================
  
  export async function backToAdmin() {
  
    await openAdminPage();
  
  }