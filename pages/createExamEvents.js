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
  createQuestionTemplate,
  getEditingExam,
  clearEditingExam
} from "./createExam.js";

let eventsAttached = false;

// ======================================================
// RENUMBER QUESTIONS
// ======================================================

function renumberQuestions() {

  const list =
    document.querySelector("#questionsList");

  if (!list)
    return;

  const cards =
    Array.from(
      list.querySelectorAll(".question-card")
    );

  cards.forEach((card, index) => {

    const number =
      index + 1;

    card.dataset.questionIndex =
      number;

    const numberElement =
      card.querySelector(".question-number");

    if (numberElement)
      numberElement.textContent = number;

    const title =
      card.querySelector(
        ".question-card-header strong"
      );

    if (title)
      title.textContent =
        `السؤال ${number}`;

    card
      .querySelectorAll(".q-correct-radio")
      .forEach(radio => {

        radio.name =
          `correct_${number}`;

      });

  });
}

// ======================================================
// QUESTION TYPE
// ======================================================

function updateQuestionType(card) {

  if (!card)
    return;

  const select =
    card.querySelector(".q-type-select");

  const options =
    card.querySelector(".mcq-options");

  const note =
    card.querySelector(".essay-note");

  if (!select)
    return;

  const isEssay =
    select.value === "essay";

  if (options)
    options.style.display =
      isEssay ? "none" : "";

  if (note)
    note.style.display =
      isEssay ? "" : "none";
}

// ======================================================
// READ IMAGE
// ======================================================

function readFileAsDataURL(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload =
        () => resolve(reader.result);

      reader.onerror =
        reject;

      reader.readAsDataURL(file);

    }
  );
}

// ======================================================
// EVENTS
// ======================================================

export function createExamEvents() {

  if (eventsAttached)
    return;

  eventsAttached = true;

  // ====================================================
  // CHANGE
  // ====================================================

  document.addEventListener(
    "change",
    async e => {

      // QUESTION TYPE
      if (
        e.target.matches(".q-type-select")
      ) {

        const card =
          e.target.closest(".question-card");

        updateQuestionType(card);

        return;
      }

      // QUESTION IMAGE
      if (
        e.target.matches(".q-image-file")
      ) {

        const input =
          e.target;

        const file =
          input.files?.[0];

        if (!file)
          return;

        const card =
          input.closest(".question-card");

        if (!card)
          return;

        try {

          const result =
            await readFileAsDataURL(file);

          const hidden =
            card.querySelector(".q-image");

          if (hidden)
            hidden.value = result;

          let box =
            card.querySelector(
              ".question-image-box"
            );

          if (!box) {

            box =
              document.createElement("div");

            box.className =
              "question-image-box";

            input.insertAdjacentElement(
              "afterend",
              box
            );

          }

          box.innerHTML = `

            <button
              type="button"
              class="removeQuestionImage"
              title="إلغاء الصورة"
            >
              ×
            </button>

            <img
              class="question-image-preview"
              src="${result}"
              alt="صورة السؤال"
            >

          `;

        }
        catch (error) {

          console.error(
            "QUESTION IMAGE ERROR:",
            error
          );

          alert(
            "❌ لم يتم تحميل الصورة."
          );

        }

      }

    }
  );

  // ====================================================
  // CLICK
  // ====================================================

  document.addEventListener(
    "click",
    async e => {

      // =================================================
      // REMOVE IMAGE
      // =================================================

      const removeImage =
        e.target.closest(
          ".removeQuestionImage"
        );

      if (removeImage) {

        e.preventDefault();
        e.stopPropagation();

        const card =
          removeImage.closest(".question-card");

        if (!card)
          return;

        const input =
          card.querySelector(".q-image-file");

        const hidden =
          card.querySelector(".q-image");

        const box =
          card.querySelector(
            ".question-image-box"
          );

        if (input)
          input.value = "";

        if (hidden)
          hidden.value = "";

        if (box)
          box.remove();

        return;
      }

      // =================================================
      // ADD QUESTION
      // =================================================

      const addButton =
        e.target.closest("#btnAddQuestion");

      if (addButton) {

        e.preventDefault();
        e.stopPropagation();

        const list =
          document.querySelector(
            "#questionsList"
          );

        if (!list)
          return;

        const empty =
          list.querySelector(".eb-empty");

        if (empty)
          empty.remove();

        const count =
          list.querySelectorAll(
            ".question-card"
          ).length;

        list.insertAdjacentHTML(
          "beforeend",
          createQuestionTemplate(
            count + 1
          )
        );

        renumberQuestions();

        const cards =
          list.querySelectorAll(
            ".question-card"
          );

        const lastCard =
          cards[cards.length - 1];

        if (lastCard) {

          lastCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        }

        return;
      }

      // =================================================
      // DELETE QUESTION
      // =================================================

      const deleteButton =
        e.target.closest(
          ".removeQuestion"
        );

      if (deleteButton) {

        e.preventDefault();
        e.stopPropagation();

        const card =
          deleteButton.closest(
            ".question-card"
          );

        if (!card)
          return;

        const list =
          document.querySelector(
            "#questionsList"
          );

        if (!list)
          return;

        const cards =
          list.querySelectorAll(
            ".question-card"
          );

        if (cards.length <= 1) {

          alert(
            "لا يمكن حذف السؤال الوحيد في الامتحان."
          );

          return;
        }

        card.remove();

        renumberQuestions();

        return;
      }

      // =================================================
      // DUPLICATE QUESTION
      // =================================================

      const duplicateButton =
        e.target.closest(
          ".duplicateQuestion"
        );

      if (duplicateButton) {

        e.preventDefault();
        e.stopPropagation();

        const card =
          duplicateButton.closest(
            ".question-card"
          );

        if (!card)
          return;

        const list =
          document.querySelector(
            "#questionsList"
          );

        if (!list)
          return;

        const clone =
          card.cloneNode(true);

        const fileInput =
          clone.querySelector(
            ".q-image-file"
          );

        if (fileInput)
          fileInput.value = "";

        card.insertAdjacentElement(
          "afterend",
          clone
        );

        renumberQuestions();

        clone.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        return;
      }

      // =================================================
      // SAVE
      // =================================================

      const saveButton =
        e.target.closest(
          "#btnSaveExam"
        );

      if (saveButton) {

        e.preventDefault();
        e.stopPropagation();

        await saveExam(saveButton);

        return;
      }

      // =================================================
      // BACK
      // =================================================

      const backButton =
        e.target.closest(
          "#btnBackToList"
        );

      if (backButton) {

        e.preventDefault();
        e.stopPropagation();

        clearEditingExam();

        const app =
          document.querySelector("#app");

        if (app) {

          app.innerHTML =
            examsListPage();

          await loadExamsList();

        }

        return;
      }

    }
  );
}

// ======================================================
// SAVE EXAM
// ======================================================

async function saveExam(saveButton) {

  const title =
    document
      .querySelector("#examTitle")
      ?.value
      ?.trim();

  if (!title) {

    alert("اكتب عنوان الامتحان");

    return;
  }

  const subject =
    document.querySelector(
      "#examSubject"
    )?.value || "physics";

  const className =
    document.querySelector(
      "#examClass"
    )?.value ||
    "الصف الأول الثانوي";

  const duration =
    Number(
      document.querySelector(
        "#examDuration"
      )?.value
    ) || 60;

  const passingScore =
    Number(
      document.querySelector(
        "#examPassingScore"
      )?.value
    ) || 50;

  const startDate =
    document.querySelector(
      "#examStartDate"
    )?.value || "";

  const endDate =
    document.querySelector(
      "#examEndDate"
    )?.value || "";

  const cards =
    Array.from(
      document.querySelectorAll(
        ".question-card"
      )
    );

  if (!cards.length) {

    alert(
      "أضف سؤالًا واحدًا على الأقل."
    );

    return;
  }

  const questions =
    cards.map((card, index) => {

      const text =
        card
          .querySelector(".q-text")
          ?.value
          ?.trim() || "";

      const type =
        card
          .querySelector(".q-type-select")
          ?.value || "mcq";

      const score =
        Number(
          card
            .querySelector(".q-score")
            ?.value
        ) || 1;

      const options =
        Array.from(
          card.querySelectorAll(
            ".opt-text"
          )
        )
        .map(
          input =>
            input.value?.trim() || ""
        );

      const normalizedOptions = [
        options[0] || "",
        options[1] || "",
        options[2] || "",
        options[3] || ""
      ];

      const checked =
        card.querySelector(
          ".q-correct-radio:checked"
        );

      let correctIndex =
        Number(
          checked?.value ?? 0
        );

      if (
        !Number.isInteger(correctIndex) ||
        correctIndex < 0 ||
        correctIndex > 3
      ) {

        correctIndex = 0;

      }

      const image =
        card
          .querySelector(".q-image")
          ?.value || "";

      const existingId =
        card.dataset.questionId || "";

      if (type === "essay") {

        return {

          id:
            existingId ||
            `${Date.now()}-${index}`,

          question: text,
          text,
          title: text,

          type: "essay",

          score,
          points: score,
          maxScore: score,

          options: [],

          correctIndex: -1,
          correctAnswerIndex: -1,

          answer: "",

          image

        };

      }

      return {

        id:
          existingId ||
          `${Date.now()}-${index}`,

        question: text,
        text,
        title: text,

        type: "mcq",

        score,
        points: score,
        maxScore: score,

        options:
          normalizedOptions,

        A:
          normalizedOptions[0],

        B:
          normalizedOptions[1],

        C:
          normalizedOptions[2],

        D:
          normalizedOptions[3],

        correctIndex,

        correctAnswerIndex:
          correctIndex,

        answer:
          normalizedOptions[
            correctIndex
          ] || "",

        image

      };

    });

  const currentExam =
    getEditingExam();

  const isEdit =
    !!currentExam;

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

    isOpen: true,

    isPublished: true,

    published: true,

    questions,

    questionsCount:
      questions.length

  };

  try {

    saveButton.disabled = true;

    saveButton.textContent =
      "⏳ جاري الحفظ...";

    if (isEdit) {

      const examId =
        currentExam.firestoreId ||
        currentExam.id;

      if (!examId) {

        throw new Error(
          "معرف الامتحان غير موجود."
        );

      }

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
      isEdit
        ? "✅ تم حفظ تعديلات الامتحان"
        : "✅ تم حفظ الامتحان بنجاح"
    );

    clearEditingExam();

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
      "SAVE EXAM ERROR:",
      error
    );

    alert(
      "❌ حدث خطأ أثناء حفظ الامتحان\n\n" +
      (
        error?.message ||
        "خطأ غير معروف"
      )
    );

    saveButton.disabled = false;

    saveButton.textContent =
      isEdit
        ? "💾 حفظ التعديلات"
        : "💾 حفظ الامتحان";

  }

}