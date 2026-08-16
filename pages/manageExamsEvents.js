// pages/manageExamsEvents.js

import {
  getExamById,
  getExams,
  deleteExam
} from "../services/examService.js";

import {
  manageExamsPage
} from "./manageExams.js";

import {
  createExamPage,
  setExamToEdit
} from "./createExam.js";

import {
  createExamEvents
} from "./createExamEvents.js";

let initialized = false;

// ======================================================
// MANAGE EXAMS EVENTS
// ======================================================

export function manageExamsEvents() {

  if (initialized)
    return;

  initialized = true;

  // ====================================================
  // SEARCH
  // ====================================================

  document.addEventListener(
    "input",
    e => {

      if (
        e.target.id !==
        "searchExam"
      )
        return;

      const value =
        e.target.value
          .toLowerCase()
          .trim();

      document
        .querySelectorAll(".examItem")
        .forEach(card => {

          const title =
            (
              card.dataset.title ||
              ""
            )
            .toLowerCase();

          const id =
            String(
              card.dataset.id ||
              ""
            );

          card.style.display =
            title.includes(value) ||
            id.includes(value)
              ? ""
              : "none";

        });

    }
  );

  // ====================================================
  // CLICK
  // ====================================================

  document.addEventListener(
    "click",
    async e => {

      // =================================================
      // DELETE
      // =================================================

      const del =
        e.target.closest(
          ".deleteExam"
        );

      if (del) {

        e.preventDefault();
        e.stopPropagation();

        const id =
          del.dataset.id;

        const exam =
          await getExamById(id);

        if (!exam)
          return;

        if (
          !confirm(
            `هل تريد حذف "${exam.title}" ؟`
          )
        )
          return;

        const firestoreId =
          exam.firestoreId;

        if (!firestoreId) {

          alert(
            "❌ لا يوجد Firestore ID للامتحان"
          );

          return;

        }

        try {

          await deleteExam(
            firestoreId
          );

          const app =
            document.querySelector("#app");

          if (app) {

            app.innerHTML =
              manageExamsPage();

            await refreshManagePage();

          }

        }
        catch (error) {

          console.error(
            "DELETE EXAM ERROR:",
            error
          );

          alert(
            "❌ فشل حذف الامتحان\n\n" +
            (
              error?.message ||
              "خطأ غير معروف"
            )
          );

        }

        return;
      }

      // =================================================
      // PUBLISH / HIDE
      // =================================================

      const toggle =
        e.target.closest(
          ".toggleExam"
        );

      if (toggle) {

        e.preventDefault();
        e.stopPropagation();

        const id =
          toggle.dataset.id;

        const exam =
          await getExamById(id);

        if (!exam)
          return;

        const firestoreId =
          exam.firestoreId;

        if (!firestoreId) {

          alert(
            "❌ لا يوجد Firestore ID"
          );

          return;

        }

        try {

          const {
            updateExam
          } =
            await import(
              "../services/examService.js"
            );

          const newPublished =
            !(
              exam.published ??
              exam.isPublished ??
              false
            );

          await updateExam(
            firestoreId,
            {
              published:
                newPublished,

              isPublished:
                newPublished
            }
          );

          const app =
            document.querySelector("#app");

          if (app) {

            app.innerHTML =
              manageExamsPage();

            await refreshManagePage();

          }

        }
        catch (error) {

          console.error(
            "TOGGLE EXAM ERROR:",
            error
          );

          alert(
            "❌ فشل تغيير حالة الامتحان\n\n" +
            (
              error?.message ||
              "خطأ غير معروف"
            )
          );

        }

        return;
      }

      // =================================================
      // EDIT
      // =================================================

      const edit =
        e.target.closest(
          ".editExam"
        );

      if (edit) {

        e.preventDefault();
        e.stopPropagation();

        const id =
          edit.dataset.id;

        if (!id) {

          alert(
            "❌ معرف الامتحان غير موجود."
          );

          return;

        }

        const app =
          document.querySelector("#app");

        if (!app)
          return;

        app.innerHTML = `

          <div style="
            padding:60px 20px;
            text-align:center;
            color:white;
            direction:rtl;
            font-family:Tajawal,sans-serif;
          ">
            ⏳ جاري تحميل الامتحان...
          </div>

        `;

        try {

          const exam =
            await getExamById(id);

          if (!exam) {

            throw new Error(
              "لم يتم العثور على الامتحان."
            );

          }

          // مهم:
          // نضع الامتحان في state الخاص
          // بصفحة createExam
          setExamToEdit(exam);

          // نعرض نفس صفحة الإنشاء
          app.innerHTML =
            createExamPage();

          // الأحداث مرة واحدة
          createExamEvents();

          return;

        }
        catch (error) {

          console.error(
            "OPEN EDIT EXAM ERROR:",
            error
          );

          app.innerHTML = `

            <div style="
              padding:50px 20px;
              text-align:center;
              direction:rtl;
              color:white;
              font-family:Tajawal,sans-serif;
            ">

              <div style="
                font-size:22px;
                margin-bottom:12px;
              ">
                ❌ فشل فتح الامتحان للتعديل
              </div>

              <div style="
                color:#9aa6c7;
                margin-bottom:22px;
              ">
                ${
                  error?.message ||
                  "خطأ غير معروف"
                }
              </div>

              <button
                id="backAfterEditError"
                style="
                  padding:12px 22px;
                  border-radius:10px;
                  border:1px solid #2a3559;
                  background:#1a2440;
                  color:white;
                  cursor:pointer;
                  font-family:Tajawal,sans-serif;
                "
              >
                ⬅ العودة
              </button>

            </div>

          `;

        }

        return;
      }

      // =================================================
      // BACK AFTER EDIT ERROR
      // =================================================

      if (
        e.target.closest(
          "#backAfterEditError"
        )
      ) {

        e.preventDefault();

        const app =
          document.querySelector("#app");

        if (app) {

          app.innerHTML =
            manageExamsPage();

          await refreshManagePage();

        }

        return;
      }

      // =================================================
      // SAVE SCHEDULE
      // =================================================

      const save =
        e.target.closest(
          ".saveExamSchedule"
        );

      if (save) {

        e.preventDefault();
        e.stopPropagation();

        const id =
          save.dataset.id;

        const exam =
          await getExamById(id);

        if (!exam)
          return;

        const timeInput =
          document.querySelector(
            `.examTime[data-id="${id}"]`
          );

        const startInput =
          document.querySelector(
            `.examStartDate[data-id="${id}"]`
          );

        const endInput =
          document.querySelector(
            `.examEndDate[data-id="${id}"]`
          );

        const examTime =
          Math.max(
            1,
            Number(
              timeInput?.value
            ) || 30
          );

        const startDate =
          startInput?.value || "";

        const endDate =
          endInput?.value || "";

        const firestoreId =
          exam.firestoreId;

        if (!firestoreId) {

          alert(
            "❌ لا يوجد Firestore ID"
          );

          return;

        }

        try {

          const {
            updateExam
          } =
            await import(
              "../services/examService.js"
            );

          await updateExam(
            firestoreId,
            {
              examTime,
              duration:
                examTime,
              startDate,
              endDate
            }
          );

          save.textContent =
            "✅ تم الحفظ";

          setTimeout(
            () => {

              save.textContent =
                "💾 حفظ";

            },
            1200
          );

        }
        catch (error) {

          console.error(
            "SAVE SCHEDULE ERROR:",
            error
          );

          alert(
            "❌ فشل حفظ بيانات الامتحان\n\n" +
            (
              error?.message ||
              "خطأ غير معروف"
            )
          );

        }

        return;
      }

      // =================================================
      // SORT A-Z
      // =================================================

      if (
        e.target.closest(
          "#sortExamAZ"
        )
      ) {

        const exams =
          await getExams();

        exams.sort(
          (a, b) =>
            String(
              a.title || ""
            ).localeCompare(
              String(
                b.title || ""
              )
            )
        );

        const app =
          document.querySelector("#app");

        if (app) {

          app.innerHTML =
            manageExamsPage();

          await refreshManagePage();

        }

        return;
      }

      // =================================================
      // SORT QUESTIONS
      // =================================================

      if (
        e.target.closest(
          "#sortExamQuestions"
        )
      ) {

        const exams =
          await getExams();

        exams.sort(
          (a, b) =>
            (b.questions?.length || 0) -
            (a.questions?.length || 0)
        );

        const app =
          document.querySelector("#app");

        if (app) {

          app.innerHTML =
            manageExamsPage();

          await refreshManagePage();

        }

        return;
      }

    }
  );
}

// ======================================================
// REFRESH MANAGE PAGE
// ======================================================

async function refreshManagePage() {

  try {

    const {
      loadManageExams
    } =
      await import(
        "./manageExams.js"
      );

    if (
      typeof loadManageExams ===
      "function"
    ) {

      await loadManageExams();

    }

  }
  catch (error) {

    console.warn(
      "MANAGE PAGE REFRESH:",
      error
    );

  }

}