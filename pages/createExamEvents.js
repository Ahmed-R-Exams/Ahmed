// pages/createExamEvents.js

import {
  examsListPage,
  loadExamsList
} from "./examsList.js";

import {
  adminPage
} from "./admin.js";

import {
  addExam,
  updateExam
} from "../services/examService.js";

import {
  createQuestionTemplate
} from "./createExam.js";

let initialized = false;
let editingExam = null;


// ======================================================
// EDITING EXAM
// ======================================================

export function setEditingExam(exam) {
  editingExam = exam;
}


// ======================================================
// EVENTS
// ======================================================

export function createExamEvents() {

  if (initialized)
    return;

  initialized = true;


  document.addEventListener(
    "click",
    async (e) => {


      // ==================================================
      // ADD QUESTION
      // ==================================================

      if (
        e.target.closest("#btnAddQuestion")
      ) {

        const list =
          document.querySelector("#questionsList");

        if (list) {

          const empty =
            list.querySelector(".eb-empty");

          if (empty)
            empty.remove();


          list.insertAdjacentHTML(
            "beforeend",
            createQuestionTemplate(
              list.querySelectorAll(".question-card").length + 1
            )
          );

        }

        return;
      }


      // ==================================================
      // DELETE QUESTION
      // ==================================================

      if (
        e.target.closest(".removeQuestion")
      ) {

        const card =
          e.target.closest(".question-card");

        if (card)
          card.remove();

        return;
      }


      // ==================================================
      // SAVE EXAM
      // ==================================================

      if (
        e.target.closest("#btnSaveExam")
      ) {

        await saveExam();

        return;
      }


      // ==================================================
      // BACK
      // ==================================================

      if (
        e.target.closest("#btnBackToList")
      ) {

        editingExam = null;

        const app =
          document.querySelector("#app");

        if (app) {

          app.innerHTML =
            adminPage();

        }

        return;
      }

    }
  );

}


// ======================================================
// SAVE EXAM
// ======================================================

async function saveExam() {

  const title =
    document
      .querySelector("#examTitle")
      ?.value
      .trim();


  if (!title) {

    alert(
      "اكتب عنوان الامتحان"
    );

    return;
  }


  // ==================================================
  // BASIC DATA
  // ==================================================

  const subject =
    document
      .querySelector("#examSubject")
      ?.value
      ||
      "physics";


  const className =
    document
      .querySelector("#examClass")
      ?.value
      ||
      "الصف الأول الثانوي";


  const duration =
    Number(
      document
        .querySelector("#examDuration")
        ?.value
    )
    ||
    60;


  const passingScore =
    Number(
      document
        .querySelector("#examPassingScore")
        ?.value
    )
    ||
    50;


  const startDate =
    document
      .querySelector("#examStartDate")
      ?.value
      ||
      "";


  const endDate =
    document
      .querySelector("#examEndDate")
      ?.value
      ||
      "";


  // ==================================================
  // OPEN / CLOSE
  // ==================================================

  const openStatus =
    document
      .querySelector("#examOpenStatus")
      ?.value
      ||
      "open";


  const isOpen =
    openStatus === "open";


  // ==================================================
  // QUESTIONS
  // ==================================================

  const questions =
    [
      ...document.querySelectorAll(
        ".question-card"
      )
    ]
    .map(
      (card) => {

        return {

          question:
            card
              .querySelector(".q-text")
              ?.value
              ||
              "",

          text:
            card
              .querySelector(".q-text")
              ?.value
              ||
              "",

          type:
            card
              .querySelector(".q-type-select")
              ?.value
              ||
              "mcq",

          score:
            Number(
              card
                .querySelector(".q-score")
                ?.value
            )
            ||
            1,

          options:
            [
              ...card.querySelectorAll(
                ".opt-text"
              )
            ]
            .map(
              x => x.value
            ),

          correctIndex:
            Number(
              card
                .querySelector(
                  ".q-correct-radio:checked"
                )
                ?.value
              ||
              0
            ),

          image:
            card
              .querySelector(".q-image")
              ?.value
              ||
              ""

        };

      }
    );


  // ==================================================
  // EXAM DATA
  // ==================================================

  const examData = {

    title,

    subject,

    className,

    grade:
      className,

    duration,

    examTime:
      duration,

    passingScore,

    startDate,

    endDate,

    // ⭐ فتح / غلق الامتحان
    isOpen,

    // الاحتفاظ بالتوافق مع النظام القديم
    isPublished:
      isOpen,

    questions

  };


  // ==================================================
  // SAVE FIREBASE
  // ==================================================

  try {

    if (editingExam) {

      const examId =
        editingExam.firestoreId ||
        editingExam.id;


      await updateExam(
        examId,
        examData
      );

    }

    else {

      await addExam(
        examData
      );

    }


    alert(
      isOpen
        ? "✅ تم حفظ الامتحان وفتحه للطلاب"
        : "✅ تم حفظ الامتحان وإغلاقه عن الطلاب"
    );


    editingExam = null;


    const app =
      document.querySelector("#app");


    if (app) {

      app.innerHTML =
        examsListPage();

      await loadExamsList();

    }

  }

  catch (error) {

    console.error(
      "Save exam error:",
      error
    );

    alert(
      "حدث خطأ أثناء حفظ الامتحان"
    );

  }

}