import {
  getExamById,
  getExams,
  deleteExam,
  saveExams
} from "../services/examService.js";



import {
  manageExamsPage
} from "./manageExams.js";



import {
  editExamPage
} from "./editExam.js";



import {
  editExamEvents
} from "./editExamEvents.js";



let initialized = false;



export function manageExamsEvents() {

  if (initialized)
    return;



  initialized = true;



  // ==========================================
  // البحث
  // ==========================================

  document.addEventListener(
    "input",
    (e) => {

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
        .querySelectorAll(
          ".examItem"
        )
        .forEach(
          card => {

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

          }
        );

    }
  );





  // ==========================================
  // كل أزرار إدارة الامتحانات
  // ==========================================

  document.addEventListener(
    "click",
    async (e) => {



      // ======================================
      // DELETE
      // ======================================

      const del =
        e.target.closest(
          ".deleteExam"
        );



      if (del) {

        const id =
          del.dataset.id;



        const exam =
          await getExamById(id);



        if (!exam)
          return;



        if (
          confirm(
            `Delete "${exam.title}" ?`
          )
        ) {

          const firestoreId =
            exam.firestoreId;



          if (!firestoreId) {

            alert(
              "❌ لا يوجد Firestore ID للامتحان"
            );

            return;

          }



          await deleteExam(
            firestoreId
          );



          const app =
            document.querySelector(
              "#app"
            );



          if (app) {

            app.innerHTML =
              manageExamsPage();

            manageExamsEvents();

          }

        }



        return;

      }





      // ======================================
      // PUBLISH / HIDE
      // ======================================

      const toggle =
        e.target.closest(
          ".toggleExam"
        );



      if (toggle) {

        const id =
          toggle.dataset.id;



        const exam =
          await getExamById(id);



        if (!exam)
          return;



        exam.published =
          !exam.published;



        const firestoreId =
          exam.firestoreId;



        if (!firestoreId) {

          alert(
            "❌ لا يوجد Firestore ID"
          );

          return;

        }



        await import(
          "../services/examService.js"
        ).then(
          ({ updateExam }) =>
            updateExam(
              firestoreId,
              {
                published:
                  exam.published,

                isPublished:
                  exam.published
              }
            )
        );



        const app =
          document.querySelector(
            "#app"
          );



        if (app) {

          app.innerHTML =
            manageExamsPage();

          manageExamsEvents();

        }



        return;

      }





      // ======================================
      // EDIT
      // ======================================

      const edit =
        e.target.closest(
          ".editExam"
        );



      if (edit) {

        const id =
          edit.dataset.id;



        const app =
          document.querySelector(
            "#app"
          );



        if (!app)
          return;



        app.innerHTML = `

          <div style="
            padding:50px;
            text-align:center;
            color:white;
            direction:rtl;
          ">
            ⏳ جاري تحميل الامتحان...
          </div>

        `;



        const html =
          await editExamPage(id);



        app.innerHTML =
          html;



        editExamEvents(id);



        return;

      }





      // ======================================
      // SAVE EXAM SCHEDULE
      // ======================================

      const save =
        e.target.closest(
          ".saveExamSchedule"
        );



      if (save) {

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



        exam.examTime =
          Math.max(
            1,
            Number(
              timeInput?.value
            ) || 30
          );



        exam.duration =
          exam.examTime;



        exam.startDate =
          startInput?.value || "";



        exam.endDate =
          endInput?.value || "";



        const firestoreId =
          exam.firestoreId;



        if (!firestoreId) {

          alert(
            "❌ لا يوجد Firestore ID"
          );

          return;

        }



        const {
          updateExam
        } =
          await import(
            "../services/examService.js"
          );



        await updateExam(
          firestoreId,
          {
            examTime:
              exam.examTime,

            duration:
              exam.duration,

            startDate:
              exam.startDate,

            endDate:
              exam.endDate
          }
        );



        save.textContent =
          "✅ Saved";



        setTimeout(
          () => {

            save.textContent =
              "💾 Save";

          },
          1200
        );



        return;

      }





      // ======================================
      // SORT TITLE A-Z
      // ======================================

      if (
        e.target.closest(
          "#sortExamAZ"
        )
      ) {

        const exams =
          getExams();



        /*
          getExams() أصبحت async
          لذلك هذا الزر يحتاج تحديثًا
          إذا كان مستخدمًا في الصفحة.
        */

        const list =
          await exams;



        list.sort(
          (a,b) =>
            String(
              a.title || ""
            ).localeCompare(
              String(
                b.title || ""
              )
            )
        );



        const app =
          document.querySelector(
            "#app"
          );



        if (app) {

          app.innerHTML =
            manageExamsPage();

          manageExamsEvents();

        }



        return;

      }





      // ======================================
      // SORT BY QUESTIONS COUNT
      // ======================================

      if (
        e.target.closest("#sortExamQuestions")
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

          manageExamsEvents();

        }

        return;
      }

    }
  );

}