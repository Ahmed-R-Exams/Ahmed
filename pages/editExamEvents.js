// pages/editExamEvents.js

import {
  getExamById,
  updateExam
} from "../services/examService.js";

import {
  manageExamsPage
} from "./manageExams.js";

import {
  manageExamsEvents
} from "./manageExamsEvents.js";


// =====================================================
// HELPERS
// =====================================================

function escapeHtml(value = "") {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function readFileAsDataURL(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload =
        () => resolve(
          reader.result
        );

      reader.onerror =
        reject;

      reader.readAsDataURL(file);

    }
  );

}


// =====================================================
// QUESTION HTML
// =====================================================

function questionHTML(
  question = {},
  index
) {

  const text =
    question.text ||
    question.question ||
    question.title ||
    "";


  const type =
    question.type ||
    "mcq";


  const options =
    Array.isArray(
      question.options
    )
      ? [
          question.options[0] || "",
          question.options[1] || "",
          question.options[2] || "",
          question.options[3] || ""
        ]
      : [
          "",
          "",
          "",
          ""
        ];


  const correct =
    Number(
      question.correctIndex ??
      question.correctAnswerIndex ??
      0
    );


  const image =
    question.image ||
    question.questionImage ||
    "";


  let imageHTML =
    "";


  if (image) {

    const src =
      String(image).startsWith(
        "data:"
      )
        ? image
        : String(image).startsWith(
            "/"
          )
            ? image
            : "/images/" + image;


    imageHTML = `

      <img
        src="${escapeHtml(src)}"
        class="question-image"
        alt="صورة السؤال"
      >

    `;

  }


  return `

<div
  class="edit-question-card"
  data-index="${index}"
  data-question-id="${escapeHtml(
    question.id || ""
  )}"
>

  <div class="edit-question-header">

    <h3>
      السؤال ${index + 1}
    </h3>

    <div class="edit-question-actions">

      <button
        type="button"
        class="duplicateQuestion"
      >
        📄 نسخ السؤال
      </button>

      <button
        type="button"
        class="deleteQuestion"
      >
        🗑 حذف السؤال
      </button>

    </div>

  </div>


  <textarea
    class="editQText"
    placeholder="اكتب السؤال..."
  >${escapeHtml(text)}</textarea>


  <select
    class="editTypeSelect"
  >

    <option
      value="mcq"
      ${type === "mcq" ? "selected" : ""}
    >
      اختيار من متعدد
    </option>

    <option
      value="essay"
      ${type === "essay" ? "selected" : ""}
    >
      سؤال مقالي
    </option>

  </select>


  <div
    class="editMcqOptions"
    style="
      display:${type === "essay" ? "none" : "block"};
    "
  >

    ${options.map(
      (opt, i) => `

      <div class="edit-option-row">

        <input
          type="radio"
          class="editCorrectRadio"
          name="edit_correct_${index}"
          value="${i}"
          ${
            correct === i &&
            type !== "essay"
              ? "checked"
              : ""
          }
        >

        <span>
          ${String.fromCharCode(65 + i)}
        </span>

        <input
          type="text"
          class="editOptText"
          value="${escapeHtml(opt)}"
          placeholder="الإجابة ${String.fromCharCode(65 + i)}"
        >

      </div>

    `
    ).join("")}

  </div>


  <div
    class="editEssayNote"
    style="
      display:${type === "essay" ? "block" : "none"};
    "
  >

    ✍️ سؤال مقالي — الطالب سيكتب إجابته نصيًا،
    وتتم مراجعته وتصحيحه يدويًا.

  </div>


  <div class="edit-score-row">

    <label>
      درجة السؤال
    </label>

    <input
      type="number"
      class="editScore"
      min="1"
      value="${Number(question.score || question.points) || 1}"
    >

  </div>


  <label class="edit-image-label">
    📷 صورة السؤال
  </label>


  <input
    type="file"
    class="editImageFile"
    accept="image/*"
  >


  <input
    type="hidden"
    class="editImage"
    value="${escapeHtml(image)}"
  >


  ${imageHTML}

</div>

`;

}


// =====================================================
// COLLECT QUESTIONS
// =====================================================

async function collectQuestions() {

  const cards =
    Array.from(
      document.querySelectorAll(
        ".edit-question-card"
      )
    );


  const questions =
    [];


  for (
    let index = 0;
    index < cards.length;
    index++
  ) {

    const card =
      cards[index];


    const text =
      card.querySelector(
        ".editQText"
      )?.value?.trim() || "";


    const type =
      card.querySelector(
        ".editTypeSelect"
      )?.value ||
      "mcq";


    const options =
      Array.from(
        card.querySelectorAll(
          ".editOptText"
        )
      )
      .map(
        input =>
          input.value?.trim() || ""
      );


    while (
      options.length < 4
    ) {

      options.push("");

    }


    const selectedRadio =
      card.querySelector(
        ".editCorrectRadio:checked"
      );


    const correctIndex =
      type === "essay"
        ? 0
        : Number(
            selectedRadio?.value ?? 0
          );


    const imageInput =
      card.querySelector(
        ".editImageFile"
      );


    const hiddenImage =
      card.querySelector(
        ".editImage"
      );


    let image =
      hiddenImage?.value ||
      "";


    if (
      imageInput &&
      imageInput.files &&
      imageInput.files.length
    ) {

      image =
        await readFileAsDataURL(
          imageInput.files[0]
        );

    }


    const oldId =
      card.dataset.questionId ||
      "";


    questions.push({

      id:
        oldId ||
        `${Date.now()}-${index}`,

      text,

      question:
        text,

      title:
        text,

      type,

      options:
        type === "essay"
          ? []
          : [
              options[0],
              options[1],
              options[2],
              options[3]
            ],

      correctIndex,

      correctAnswerIndex:
        correctIndex,

      answer:
        type === "essay"
          ? ""
          : (
              options[correctIndex] ||
              ""
            ),

      image,

      score:
        Number(
          card.querySelector(
            ".editScore"
          )?.value
        ) || 1,

      points:
        Number(
          card.querySelector(
            ".editScore"
          )?.value
        ) || 1

    });

  }


  return questions;

}


// =====================================================
// RENDER
// =====================================================

function renderQuestions(
  questions
) {

  const container =
    document.querySelector(
      "#editQuestionsList"
    );


  if (!container)
    return;


  container.innerHTML =
    questions
      .map(
        (question, index) =>
          questionHTML(
            question,
            index
          )
      )
      .join("");

}


// =====================================================
// UPDATE TYPE
// =====================================================

function updateType(card) {

  const select =
    card.querySelector(
      ".editTypeSelect"
    );


  if (!select)
    return;


  const isEssay =
    select.value === "essay";


  const options =
    card.querySelector(
      ".editMcqOptions"
    );


  const note =
    card.querySelector(
      ".editEssayNote"
    );


  if (options) {

    options.style.display =
      isEssay
        ? "none"
        : "block";

  }


  if (note) {

    note.style.display =
      isEssay
        ? "block"
        : "none";

  }

}


// =====================================================
// MAIN EVENTS
// =====================================================

export function editExamEvents(
  examId
) {

  const container =
    document.querySelector(
      "#editExamContainer"
    );


  if (!container)
    return;


  if (
    container.dataset.eventsInitialized ===
    "true"
  ) {

    return;

  }


  container.dataset.eventsInitialized =
    "true";


  // ===================================================
  // CLICK
  // ===================================================

  container.addEventListener(
    "click",
    async (e) => {


      // -----------------------------------------------
      // BACK
      // -----------------------------------------------

      const back =
        e.target.closest(
          "#backToManageExams"
        );


      if (back) {

        e.preventDefault();


        const app =
          document.querySelector(
            "#app"
          );


        if (!app)
          return;


        app.innerHTML =
          manageExamsPage();


        manageExamsEvents();

        return;

      }


      // -----------------------------------------------
      // ADD
      // -----------------------------------------------

      const add =
        e.target.closest(
          "#addEditQuestion"
        );


      if (add) {

        e.preventDefault();


        const questions =
          await collectQuestions();


        questions.push({

          id:
            `${Date.now()}-${questions.length}`,

          text:
            "",

          question:
            "",

          title:
            "",

          type:
            "mcq",

          image:
            "",

          options: [
            "",
            "",
            "",
            ""
          ],

          correctIndex:
            0,

          correctAnswerIndex:
            0,

          answer:
            "",

          score:
            1,

          points:
            1

        });


        renderQuestions(
          questions
        );


        return;

      }


      // -----------------------------------------------
      // DELETE
      // -----------------------------------------------

      const deleteButton =
        e.target.closest(
          ".deleteQuestion"
        );


      if (deleteButton) {

        e.preventDefault();


        const card =
          deleteButton.closest(
            ".edit-question-card"
          );


        if (!card)
          return;


        const cards =
          Array.from(
            container.querySelectorAll(
              ".edit-question-card"
            )
          );


        if (
          cards.length <= 1
        ) {

          alert(
            "لا يمكن حذف السؤال الوحيد في الامتحان."
          );

          return;

        }


        const questions =
          await collectQuestions();


        const index =
          cards.indexOf(
            card
          );


        if (
          index >= 0
        ) {

          questions.splice(
            index,
            1
          );

        }


        renderQuestions(
          questions
        );


        return;

      }


      // -----------------------------------------------
      // DUPLICATE
      // -----------------------------------------------

      const duplicateButton =
        e.target.closest(
          ".duplicateQuestion"
        );


      if (duplicateButton) {

        e.preventDefault();


        const card =
          duplicateButton.closest(
            ".edit-question-card"
          );


        if (!card)
          return;


        const cards =
          Array.from(
            container.querySelectorAll(
              ".edit-question-card"
            )
          );


        const index =
          cards.indexOf(
            card
          );


        if (
          index < 0
        )
          return;


        const questions =
          await collectQuestions();


        const copy =
          JSON.parse(
            JSON.stringify(
              questions[index]
            )
          );


        copy.id =
          `${Date.now()}-${questions.length}`;


        questions.splice(
          index + 1,
          0,
          copy
        );


        renderQuestions(
          questions
        );


        return;

      }


      // -----------------------------------------------
      // SAVE
      // -----------------------------------------------

      const save =
        e.target.closest(
          "#saveExamEdit"
        );


      if (save) {

        e.preventDefault();


        try {

          save.disabled =
            true;


          save.textContent =
            "⏳ جاري الحفظ...";


          const realId =
            container.dataset.examId ||
            examId;


          if (!realId) {

            throw new Error(
              "لم يتم العثور على ID الامتحان."
            );

          }


          const oldExam =
            await getExamById(
              realId
            );


          if (!oldExam) {

            throw new Error(
              "الامتحان غير موجود في Firebase."
            );

          }


          const title =
            document
              .querySelector(
                "#editExamTitle"
              )
              ?.value
              ?.trim() ||
              "";


          if (!title) {

            throw new Error(
              "اكتب عنوان الامتحان أولاً."
            );

          }


          const questions =
            await collectQuestions();


          if (
            !questions.length
          ) {

            throw new Error(
              "يجب أن يحتوي الامتحان على سؤال واحد على الأقل."
            );

          }


          const payload = {

            ...oldExam,

            title,

            questions,

            questionsCount:
              questions.length

          };


          delete payload.id;
          delete payload.firestoreId;


          await updateExam(
            oldExam.firestoreId ||
            realId,
            payload
          );


          save.textContent =
            "✅ تم الحفظ بنجاح";


          alert(
            "✅ تم حفظ تعديلات الامتحان بنجاح"
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
        catch (error) {

          console.error(
            "EDIT EXAM SAVE ERROR:",
            error
          );


          alert(
            "❌ فشل حفظ التعديلات\n\n" +
            (
              error?.message ||
              "حدث خطأ غير معروف"
            )
          );


          save.disabled =
            false;


          save.textContent =
            "💾 حفظ التعديلات";

        }

      }

    }
  );


  // ===================================================
  // CHANGE
  // ===================================================

  container.addEventListener(
    "change",
    async (e) => {


      // -----------------------------------------------
      // TYPE
      // -----------------------------------------------

      if (
        e.target.matches(
          ".editTypeSelect"
        )
      ) {

        const card =
          e.target.closest(
            ".edit-question-card"
          );


        updateType(
          card
        );


        return;

      }


      // -----------------------------------------------
      // IMAGE
      // -----------------------------------------------

      if (
        !e.target.matches(
          ".editImageFile"
        )
      )
        return;


      const input =
        e.target;


      if (
        !input.files ||
        !input.files.length
      )
        return;


      try {

        const card =
          input.closest(
            ".edit-question-card"
          );


        if (!card)
          return;


        const image =
          await readFileAsDataURL(
            input.files[0]
          );


        const hidden =
          card.querySelector(
            ".editImage"
          );


        if (hidden) {

          hidden.value =
            image;

        }


        let img =
          card.querySelector(
            ".question-image"
          );


        if (!img) {

          img =
            document.createElement(
              "img"
            );


          img.className =
            "question-image";


          input.insertAdjacentElement(
            "afterend",
            img
          );

        }


        img.src =
          image;


        img.style.maxWidth =
          "300px";

        img.style.maxHeight =
          "220px";

        img.style.marginTop =
          "15px";

        img.style.borderRadius =
          "12px";

        img.style.display =
          "block";

        img.style.objectFit =
          "contain";

      }
      catch (error) {

        console.error(
          "IMAGE ERROR:",
          error
        );


        alert(
          "❌ لم يتم تحميل الصورة."
        );

      }

    }
  );

}