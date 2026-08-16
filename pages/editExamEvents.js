// pages/editExamEvents.js

import {
  getExamById,
  updateExam
} from "../services/examService.js";

import {
  regradeResultsForExam
} from "../services/resultService.js";

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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

// =====================================================
// OPTIONS NORMALIZATION
// =====================================================

function cleanOptions(list = []) {
  return list.filter(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );
}

function getQuestionOptions(question = {}) {
  // 1) options
  if (Array.isArray(question.options)) {
    const options = cleanOptions(question.options);

    if (options.length > 0) {
      return options;
    }
  }

  // 2) choices
  if (Array.isArray(question.choices)) {
    const options = cleanOptions(question.choices);

    if (options.length > 0) {
      return options;
    }
  }

  // 3) A / B / C / D
  const letterOptions = [
    question.A,
    question.B,
    question.C,
    question.D
  ];

  if (letterOptions.some(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  )) {
    return letterOptions.map(
      (value) =>
        value === undefined ||
        value === null
          ? ""
          : String(value)
    );
  }

  // 4) optionA / optionB / optionC / optionD
  const namedOptions = [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD
  ];

  if (namedOptions.some(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  )) {
    return namedOptions.map(
      (value) =>
        value === undefined ||
        value === null
          ? ""
          : String(value)
    );
  }

  return [];
}

// =====================================================
// CORRECT ANSWER NORMALIZATION
// =====================================================

function getRawCorrectAnswer(question = {}) {
  if (
    question.correctAnswerIndex !== undefined &&
    question.correctAnswerIndex !== null &&
    question.correctAnswerIndex !== ""
  ) {
    return question.correctAnswerIndex;
  }

  if (
    question.correctIndex !== undefined &&
    question.correctIndex !== null &&
    question.correctIndex !== ""
  ) {
    return question.correctIndex;
  }

  if (
    question.rightIndex !== undefined &&
    question.rightIndex !== null &&
    question.rightIndex !== ""
  ) {
    return question.rightIndex;
  }

  if (
    question.correctAnswer !== undefined &&
    question.correctAnswer !== null &&
    question.correctAnswer !== ""
  ) {
    return question.correctAnswer;
  }

  if (
    question.answer !== undefined &&
    question.answer !== null &&
    question.answer !== ""
  ) {
    return question.answer;
  }

  if (
    question.correct !== undefined &&
    question.correct !== null &&
    question.correct !== ""
  ) {
    return question.correct;
  }

  return undefined;
}

function normalizeCorrectIndex(
  value,
  options = []
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return 0;
  }

  // رقم
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    const n = Math.trunc(value);

    if (
      n >= 0 &&
      n < options.length
    ) {
      return n;
    }

    // أحيانًا Excel يخزن 1-4
    if (
      n >= 1 &&
      n <= options.length
    ) {
      return n - 1;
    }
  }

  const raw = String(value).trim();
  const upper = raw.toUpperCase();

  // A/B/C/D
  const letters = {
    A: 0,
    B: 1,
    C: 2,
    D: 3
  };

  if (
    Object.prototype.hasOwnProperty.call(
      letters,
      upper
    )
  ) {
    return letters[upper];
  }

  // 1/2/3/4
  if (/^[1-4]$/.test(raw)) {
    const n = Number(raw) - 1;

    if (n >= 0 && n < options.length) {
      return n;
    }
  }

  // index مباشر
  if (/^\d+$/.test(raw)) {
    const n = Number(raw);

    if (n >= 0 && n < options.length) {
      return n;
    }
  }

  // الإجابة نفسها كنص
  const index = options.findIndex(
    (option) =>
      String(option).trim() === raw
  );

  if (index !== -1) {
    return index;
  }

  return 0;
}

// =====================================================
// QUESTION TYPE
// =====================================================

function normalizeQuestionType(
  question,
  options
) {
  // وجود اختيارات حقيقية = MCQ
  if (options.length > 0) {
    return "mcq";
  }

  const rawType =
    String(
      question.type || ""
    )
      .toLowerCase()
      .trim();

  if (
    rawType.includes("essay") ||
    rawType.includes("مقال") ||
    rawType.includes("written")
  ) {
    return "essay";
  }

  if (
    rawType === "mcq" ||
    rawType.includes("multiple") ||
    rawType.includes("choice") ||
    rawType.includes("اختيار")
  ) {
    return "mcq";
  }

  // لو مفيش type واضح
  return "essay";
}

// =====================================================
// QUESTION HTML
// =====================================================

export function questionHTML(
  question = {},
  index
) {
  const text =
    question.text ||
    question.question ||
    question.title ||
    "";

  // -----------------------------------------------
  // OPTIONS
  // -----------------------------------------------

  let rawOptions =
    getQuestionOptions(question);

  const hasMCQ =
    rawOptions.length > 0;

  const type =
    hasMCQ
      ? "mcq"
      : normalizeQuestionType(
          question,
          rawOptions
        );

  let options = [
    "",
    "",
    "",
    ""
  ];

  if (hasMCQ) {
    options = [
      rawOptions[0] || "",
      rawOptions[1] || "",
      rawOptions[2] || "",
      rawOptions[3] || ""
    ];
  }

  // -----------------------------------------------
  // CORRECT ANSWER
  // -----------------------------------------------

  const rawCorrect =
    getRawCorrectAnswer(question);

  const correct =
    type === "essay"
      ? 0
      : normalizeCorrectIndex(
          rawCorrect,
          options
        );

  // -----------------------------------------------
  // IMAGE
  // -----------------------------------------------

  const image =
    question.image ||
    question.questionImage ||
    "";

  let imageHTML = "";

  if (image) {
    const src =
      String(image).startsWith("data:")
        ? image
        : String(image).startsWith("/")
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

  // -----------------------------------------------
  // HTML
  // -----------------------------------------------

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

  <select class="editTypeSelect">

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

    ${options
      .map(
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
          ${String.fromCharCode(
            65 + i
          )}
        </span>

        <input
          type="text"
          class="editOptText"
          value="${escapeHtml(opt)}"
          placeholder="الإجابة ${String.fromCharCode(
            65 + i
          )}"
        >

      </div>
    `
      )
      .join("")}

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
      value="${
        Number(
          question.score ||
          question.points ||
          question.maxScore ||
          question.grade
        ) || 1
      }"
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

  const questions = [];

  for (
    let index = 0;
    index < cards.length;
    index++
  ) {
    const card = cards[index];

    const text =
      card.querySelector(
        ".editQText"
      )?.value?.trim() || "";

    const selectedType =
      card.querySelector(
        ".editTypeSelect"
      )?.value || "mcq";

    // -----------------------------------------------
    // OPTIONS
    // -----------------------------------------------

    const options =
      Array.from(
        card.querySelectorAll(
          ".editOptText"
        )
      ).map(
        (input) =>
          input.value?.trim() || ""
      );

    while (options.length < 4) {
      options.push("");
    }

    // -----------------------------------------------
    // TYPE
    // -----------------------------------------------

    const hasOptions =
      options.some(
        (option) =>
          String(option).trim() !== ""
      );

    // وجود اختيار واحد على الأقل يعني MCQ
    const type =
      hasOptions
        ? "mcq"
        : selectedType === "essay"
          ? "essay"
          : "mcq";

    // -----------------------------------------------
    // CORRECT ANSWER
    // -----------------------------------------------

    const selectedRadio =
      card.querySelector(
        ".editCorrectRadio:checked"
      );

    let correctIndex = 0;

    if (type === "mcq") {
      correctIndex =
        Number(
          selectedRadio?.value ?? 0
        );

      if (
        !Number.isFinite(
          correctIndex
        ) ||
        correctIndex < 0 ||
        correctIndex > 3
      ) {
        correctIndex = 0;
      }
    }

    // -----------------------------------------------
    // IMAGE
    // -----------------------------------------------

    const imageInput =
      card.querySelector(
        ".editImageFile"
      );

    const hiddenImage =
      card.querySelector(
        ".editImage"
      );

    let image =
      hiddenImage?.value || "";

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

    // -----------------------------------------------
    // ID
    // -----------------------------------------------

    const oldId =
      card.dataset.questionId ||
      "";

    // -----------------------------------------------
    // SCORE
    // -----------------------------------------------

    const score =
      Number(
        card.querySelector(
          ".editScore"
        )?.value
      ) || 1;

    // -----------------------------------------------
    // FINAL QUESTION
    // -----------------------------------------------

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
        type === "mcq"
          ? [
              options[0],
              options[1],
              options[2],
              options[3]
            ]
          : [],

      correctIndex,

      correctAnswerIndex:
        correctIndex,

      // نحفظ الإجابة كنص أيضًا
      answer:
        type === "mcq"
          ? (
              options[correctIndex] ||
              ""
            )
          : "",

      image,

      score,

      points: score
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

  if (!container) {
    return;
  }

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

  if (!select) {
    return;
  }

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

  if (!container) {
    return;
  }

  if (
    container.dataset
      .eventsInitialized ===
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

        if (!app) {
          return;
        }

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

          text: "",

          question: "",

          title: "",

          type: "mcq",

          image: "",

          options: [
            "",
            "",
            "",
            ""
          ],

          correctIndex: 0,

          correctAnswerIndex: 0,

          answer: "",

          score: 1,

          points: 1
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

        if (!card) {
          return;
        }

        const cards =
          Array.from(
            container.querySelectorAll(
              ".edit-question-card"
            )
          );

        if (cards.length <= 1) {
          alert(
            "لا يمكن حذف السؤال الوحيد في الامتحان."
          );

          return;
        }

        const questions =
          await collectQuestions();

        const index =
          cards.indexOf(card);

        if (index >= 0) {
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

        if (!card) {
          return;
        }

        const cards =
          Array.from(
            container.querySelectorAll(
              ".edit-question-card"
            )
          );

        const index =
          cards.indexOf(card);

        if (index < 0) {
          return;
        }

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
          save.disabled = true;

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

          if (!questions.length) {
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

          const finalId =
            oldExam.firestoreId ||
            realId;

          await updateExam(
            finalId,
            payload
          );

          let regradeInfo = {
            updated: 0,
            matched: 0
          };

          try {

            regradeInfo =
              await regradeResultsForExam(
                [
                  finalId,
                  oldExam.id
                ],
                questions,
                oldExam.title || ""
              );

            console.log(
              "REGRADE RESULT:",
              regradeInfo
            );

          } catch (regradeError) {

            console.error(
              "REGRADE ERROR:",
              regradeError
            );

          }

          save.textContent =
            "✅ تم الحفظ بنجاح";

          alert(
            "✅ تم حفظ تعديلات الامتحان بنجاح\n" +
            `تم العثور على ${regradeInfo.matched} نتيجة مرتبطة، وتم تحديث ${regradeInfo.updated} منها.`
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

        } catch (error) {
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

        updateType(card);

        return;
      }

      // -----------------------------------------------
      // IMAGE
      // -----------------------------------------------

      if (
        !e.target.matches(
          ".editImageFile"
        )
      ) {
        return;
      }

      const input =
        e.target;

      if (
        !input.files ||
        !input.files.length
      ) {
        return;
      }

      try {
        const card =
          input.closest(
            ".edit-question-card"
          );

        if (!card) {
          return;
        }

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

      } catch (error) {
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