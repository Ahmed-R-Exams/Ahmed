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

import {
  examsListPage,
  loadExamsList
} from "./examsList.js";


// =====================================================
// IMAGE SETTINGS
// =====================================================

const MAX_IMAGE_BYTES = 450 * 1024;

const IMAGE_MAX_WIDTH = 1400;
const IMAGE_MAX_HEIGHT = 1400;


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


// =====================================================
// OPTIONS
// =====================================================

function cleanOptions(list = []) {

  return list.filter(
    value =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );
}


function getQuestionOptions(question = {}) {

  if (Array.isArray(question.options)) {

    const options =
      cleanOptions(question.options);

    if (options.length > 0) {
      return options;
    }
  }


  if (Array.isArray(question.choices)) {

    const options =
      cleanOptions(question.choices);

    if (options.length > 0) {
      return options;
    }
  }


  const letterOptions = [
    question.A,
    question.B,
    question.C,
    question.D
  ];


  if (
    letterOptions.some(
      value =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    )
  ) {

    return letterOptions.map(
      value =>
        value === undefined ||
        value === null
          ? ""
          : String(value)
    );
  }


  const namedOptions = [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD
  ];


  if (
    namedOptions.some(
      value =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    )
  ) {

    return namedOptions.map(
      value =>
        value === undefined ||
        value === null
          ? ""
          : String(value)
    );
  }


  return [];
}


// =====================================================
// CORRECT ANSWER
// =====================================================

function getRawCorrectAnswer(question = {}) {

  const fields = [
    "correctAnswerIndex",
    "correctIndex",
    "rightIndex",
    "correctAnswer",
    "answer",
    "correct"
  ];


  for (const field of fields) {

    if (
      question[field] !== undefined &&
      question[field] !== null &&
      question[field] !== ""
    ) {

      return question[field];
    }
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


    if (
      n >= 1 &&
      n <= options.length
    ) {

      return n - 1;
    }
  }


  const raw =
    String(value).trim();


  const upper =
    raw.toUpperCase();


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


  if (/^[1-4]$/.test(raw)) {

    const n =
      Number(raw) - 1;

    if (
      n >= 0 &&
      n < options.length
    ) {

      return n;
    }
  }


  if (/^\d+$/.test(raw)) {

    const n =
      Number(raw);

    if (
      n >= 0 &&
      n < options.length
    ) {

      return n;
    }
  }


  const index =
    options.findIndex(
      option =>
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


  return "mcq";
}


// =====================================================
// DATA URL SIZE
// =====================================================

function getDataUrlBytes(dataURL = "") {

  if (!dataURL) {
    return 0;
  }


  const commaIndex =
    dataURL.indexOf(",");


  if (commaIndex === -1) {
    return 0;
  }


  const base64 =
    dataURL.slice(
      commaIndex + 1
    );


  const padding =
    base64.endsWith("==")
      ? 2
      : base64.endsWith("=")
        ? 1
        : 0;


  return Math.floor(
    (base64.length * 3) / 4
  ) - padding;
}


// =====================================================
// LOAD IMAGE
// =====================================================

function loadImageFromFile(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();


      reader.onload = () => {

        const image =
          new Image();


        image.onload = () => {

          resolve(image);
        };


        image.onerror = () => {

          reject(
            new Error(
              "تعذر قراءة الصورة."
            )
          );
        };


        image.src =
          reader.result;
      };


      reader.onerror = () => {

        reject(
          new Error(
            "تعذر قراءة ملف الصورة."
          )
        );
      };


      reader.readAsDataURL(file);
    }
  );
}


// =====================================================
// COMPRESS IMAGE
// =====================================================

async function compressImage(file) {

  if (!file) {
    return "";
  }


  if (
    file.size <= MAX_IMAGE_BYTES &&
    file.type === "image/jpeg"
  ) {

    return new Promise(
      (resolve, reject) => {

        const reader =
          new FileReader();


        reader.onload =
          () =>
            resolve(
              reader.result
            );


        reader.onerror =
          () =>
            reject(
              new Error(
                "تعذر قراءة الصورة."
              )
            );


        reader.readAsDataURL(file);
      }
    );
  }


  const image =
    await loadImageFromFile(file);


  let width =
    image.naturalWidth ||
    image.width;


  let height =
    image.naturalHeight ||
    image.height;


  const scale =
    Math.min(
      1,
      IMAGE_MAX_WIDTH / width,
      IMAGE_MAX_HEIGHT / height
    );


  width =
    Math.max(
      1,
      Math.round(
        width * scale
      )
    );


  height =
    Math.max(
      1,
      Math.round(
        height * scale
      )
    );


  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    width;


  canvas.height =
    height;


  const ctx =
    canvas.getContext(
      "2d"
    );


  if (!ctx) {

    throw new Error(
      "المتصفح لا يدعم معالجة الصور."
    );
  }


  ctx.fillStyle =
    "#ffffff";


  ctx.fillRect(
    0,
    0,
    width,
    height
  );


  ctx.drawImage(
    image,
    0,
    0,
    width,
    height
  );


  let quality =
    0.82;


  let dataURL =
    canvas.toDataURL(
      "image/jpeg",
      quality
    );


  for (
    let attempt = 0;
    attempt < 10;
    attempt++
  ) {

    const size =
      getDataUrlBytes(
        dataURL
      );


    if (
      size <=
      MAX_IMAGE_BYTES
    ) {

      return dataURL;
    }


    quality -= 0.06;


    if (
      quality < 0.25
    ) {

      break;
    }


    dataURL =
      canvas.toDataURL(
        "image/jpeg",
        quality
      );
  }


  let currentWidth =
    width;


  let currentHeight =
    height;


  for (
    let attempt = 0;
    attempt < 7;
    attempt++
  ) {

    currentWidth =
      Math.max(
        320,
        Math.round(
          currentWidth * 0.8
        )
      );


    currentHeight =
      Math.max(
        240,
        Math.round(
          currentHeight * 0.8
        )
      );


    canvas.width =
      currentWidth;


    canvas.height =
      currentHeight;


    ctx.fillStyle =
      "#ffffff";


    ctx.fillRect(
      0,
      0,
      currentWidth,
      currentHeight
    );


    ctx.drawImage(
      image,
      0,
      0,
      currentWidth,
      currentHeight
    );


    dataURL =
      canvas.toDataURL(
        "image/jpeg",
        0.70
      );


    const size =
      getDataUrlBytes(
        dataURL
      );


    if (
      size <=
      MAX_IMAGE_BYTES
    ) {

      return dataURL;
    }
  }


  throw new Error(
    "الصورة كبيرة جدًا حتى بعد ضغطها. اختر صورة أصغر."
  );
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


  const rawOptions =
    getQuestionOptions(
      question
    );


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


  const rawCorrect =
    getRawCorrectAnswer(
      question
    );


  const correct =
    type === "essay"
      ? 0
      : normalizeCorrectIndex(
          rawCorrect,
          options
        );


  const image =
    question.image ||
    question.questionImage ||
    "";


  let imageHTML =
    "";


  if (image) {

    imageHTML = `

      <div
        class="question-image-box"
      >

        <button
          type="button"
          class="removeEditQuestionImage"
          title="حذف الصورة"
        >
          ×
        </button>

        <img
          src="${escapeHtml(image)}"
          class="question-image"
          alt="صورة السؤال"
          style="
            max-width:300px;
            max-height:220px;
            margin-top:15px;
            border-radius:12px;
            display:block;
            object-fit:contain;
          "
        >

      </div>

    `;
  }


  return `

<div
  class="edit-question-card"
  data-index="${index}"
  data-question-id="${escapeHtml(
    question.firestoreId ||
    question.id ||
    ""
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
      display:${type === "essay"
        ? "none"
        : "block"};
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
      display:${type === "essay"
        ? "block"
        : "none"};
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

async function collectQuestions(
  examId,
  saveButton
) {

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

    const card =
      cards[index];


    const number =
      index + 1;


    const text =
      card.querySelector(
        ".editQText"
      )?.value?.trim() ||
      "";


    if (!text) {

      throw new Error(
        `اكتب نص السؤال رقم ${number}.`
      );
    }


    const selectedType =
      card.querySelector(
        ".editTypeSelect"
      )?.value ||
      "mcq";


    const options =
      Array.from(
        card.querySelectorAll(
          ".editOptText"
        )
      ).map(
        input =>
          input.value?.trim() ||
          ""
      );


    while (
      options.length < 4
    ) {

      options.push("");
    }


    const hasOptions =
      options.some(
        option =>
          String(option).trim() !== ""
      );


    const type =
      hasOptions
        ? "mcq"
        : selectedType === "essay"
          ? "essay"
          : "mcq";


    const selectedRadio =
      card.querySelector(
        ".editCorrectRadio:checked"
      );


    let correctIndex =
      Number(
        selectedRadio?.value ?? 0
      );


    if (
      !Number.isInteger(
        correctIndex
      ) ||
      correctIndex < 0 ||
      correctIndex > 3
    ) {

      correctIndex = 0;
    }


    const oldId =
      card.dataset.questionId ||
      `${Date.now()}-${index}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;


    // =================================================
    // IMAGE
    // =================================================

    const imageInput =
      card.querySelector(
        ".editImageFile"
      );


    const hiddenImage =
      card.querySelector(
        ".editImage"
      );


    const newFile =
      imageInput?.files?.[0];


    let image =
      hiddenImage?.value?.trim() ||
      "";


    if (newFile) {

      saveButton.textContent =
        `⏳ تجهيز صورة السؤال ${number}...`;


      console.log(
        `📷 ضغط صورة السؤال ${number}...`
      );


      image =
        await compressImage(
          newFile
        );


      console.log(
        `✅ تم تجهيز صورة السؤال ${number}`
      );

    } else {

      saveButton.textContent =
        `⏳ تجهيز السؤال ${number}...`;
    }


    // =================================================
    // SCORE
    // =================================================

    const score =
      Number(
        card.querySelector(
          ".editScore"
        )?.value
      ) || 1;


    // =================================================
    // QUESTION OBJECT
    // =================================================

    questions.push({

      id:
        oldId,

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

      A:
        type === "mcq"
          ? options[0]
          : "",

      B:
        type === "mcq"
          ? options[1]
          : "",

      C:
        type === "mcq"
          ? options[2]
          : "",

      D:
        type === "mcq"
          ? options[3]
          : "",

      correctIndex:
        type === "mcq"
          ? correctIndex
          : -1,

      correctAnswerIndex:
        type === "mcq"
          ? correctIndex
          : -1,

      answer:
        type === "mcq"
          ? options[
              correctIndex
            ] || ""
          : "",

      image,

      score,

      points:
        score,

      maxScore:
        score

    });
  }


  return questions;
}


// =====================================================
// COLLECT WITHOUT IMAGE PROCESSING
// =====================================================

function collectQuestionsWithoutUpload() {

  const cards =
    Array.from(
      document.querySelectorAll(
        ".edit-question-card"
      )
    );


  return cards.map(
    (card, index) => {

      const text =
        card.querySelector(
          ".editQText"
        )?.value?.trim() ||
        "";


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
            input.value?.trim() ||
            ""
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


      let correctIndex =
        Number(
          selectedRadio?.value ?? 0
        );


      if (
        !Number.isInteger(
          correctIndex
        ) ||
        correctIndex < 0 ||
        correctIndex > 3
      ) {

        correctIndex = 0;
      }


      const score =
        Number(
          card.querySelector(
            ".editScore"
          )?.value
        ) || 1;


      return {

        id:
          card.dataset.questionId ||
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
            : options,

        A:
          type === "mcq"
            ? options[0]
            : "",

        B:
          type === "mcq"
            ? options[1]
            : "",

        C:
          type === "mcq"
            ? options[2]
            : "",

        D:
          type === "mcq"
            ? options[3]
            : "",

        correctIndex:
          type === "essay"
            ? -1
            : correctIndex,

        correctAnswerIndex:
          type === "essay"
            ? -1
            : correctIndex,

        answer:
          type === "essay"
            ? ""
            : options[
                correctIndex
              ] || "",

        image:
          card.querySelector(
            ".editImage"
          )?.value ||
          "",

        score,

        points:
          score,

        maxScore:
          score

      };
    }
  );
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
    card?.querySelector(
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
    async e => {

      // ===============================================
      // BACK
      // ===============================================

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


      // ===============================================
      // ADD QUESTION
      // ===============================================

      const add =
        e.target.closest(
          "#addEditQuestion"
        );


      if (add) {

        e.preventDefault();


        const questions =
          collectQuestionsWithoutUpload();


        questions.push({

          id:
            `${Date.now()}-${questions.length}-${Math.random()
              .toString(36)
              .slice(2, 8)}`,

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

          A: "",

          B: "",

          C: "",

          D: "",

          correctIndex: 0,

          correctAnswerIndex: 0,

          answer: "",

          score: 1,

          points: 1,

          maxScore: 1

        });


        renderQuestions(
          questions
        );


        return;
      }


      // ===============================================
      // DELETE QUESTION
      // ===============================================

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


        if (
          cards.length <= 1
        ) {

          alert(
            "لا يمكن حذف السؤال الوحيد في الامتحان."
          );


          return;
        }


        const index =
          cards.indexOf(card);


        const questions =
          collectQuestionsWithoutUpload();


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


      // ===============================================
      // DUPLICATE QUESTION
      // ===============================================

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
          collectQuestionsWithoutUpload();


        const copy =
          JSON.parse(
            JSON.stringify(
              questions[index]
            )
          );


        copy.id =
          `${Date.now()}-${questions.length}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;


        copy.image =
          "";


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


      // ===============================================
      // REMOVE IMAGE
      // ===============================================

      const removeImage =
        e.target.closest(
          ".removeEditQuestionImage"
        );


      if (removeImage) {

        e.preventDefault();


        const card =
          removeImage.closest(
            ".edit-question-card"
          );


        if (!card) {
          return;
        }


        const input =
          card.querySelector(
            ".editImageFile"
          );


        const hidden =
          card.querySelector(
            ".editImage"
          );


        const box =
          card.querySelector(
            ".question-image-box"
          );


        if (input) {
          input.value = "";
        }


        if (hidden) {
          hidden.value = "";
        }


        if (box) {
          box.remove();
        }


        return;
      }


      // ===============================================
      // SAVE
      // ===============================================

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


          console.log(
            "================================="
          );


          console.log(
            "✏️ EDIT EXAM SAVE START"
          );


          console.log(
            "Exam ID:",
            realId
          );


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


          // ==========================================
          // COLLECT QUESTIONS
          // ==========================================

          save.textContent =
            "⏳ جاري تجهيز الأسئلة...";


          const questions =
            await collectQuestions(
              oldExam.firestoreId ||
                realId,
              save
            );


          if (!questions.length) {

            throw new Error(
              "يجب أن يحتوي الامتحان على سؤال واحد على الأقل."
            );
          }


          console.log(
            "✅ QUESTIONS READY:",
            questions.length
          );


          // ==========================================
          // PAYLOAD
          // ==========================================

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


          // ==========================================
          // FIRESTORE
          // ==========================================

          save.textContent =
            "⏳ جاري حفظ الامتحان...";


          console.log(
            "🔥 Updating Firestore..."
          );


          await updateExam(
            finalId,
            payload
          );


          console.log(
            "✅ Firestore update completed."
          );


          // ==========================================
          // REGRADE RESULTS
          // ==========================================

          let regradeInfo = {
            updated: 0,
            matched: 0
          };


          try {

            console.log(
              "🔄 Starting result regrade..."
            );


            regradeInfo =
              await regradeResultsForExam(
                [
                  finalId,
                  oldExam.id
                ],
                questions,
                oldExam.title ||
                  title
              );


            console.log(
              "✅ Regrade completed:",
              regradeInfo
            );

          }
          catch (regradeError) {

            console.error(
              "⚠️ REGRADE ERROR:",
              regradeError
            );

          }


          // ==========================================
          // SUCCESS
          // ==========================================

          save.textContent =
            "✅ تم الحفظ بنجاح";


          console.log(
            "================================="
          );


          console.log(
            "🎉 EDIT EXAM SAVE SUCCESS"
          );


          alert(
            "✅ تم حفظ تعديلات الامتحان بنجاح\n\n" +
            `تم العثور على ${regradeInfo.matched || 0} نتيجة مرتبطة، وتم تحديث ${regradeInfo.updated || 0} منها.`
          );


          // =================================================
          // العودة مباشرة إلى قائمة الامتحانات
          // =================================================

          const app =
            document.querySelector(
              "#app"
            );


          if (app) {

            /*
             * مهم جدًا:
             *
             * لا نعرض manageExamsPage()
             * لأن هذه الصفحة مجرد صفحة إدارة
             * وليست قائمة الامتحانات.
             *
             * نعرض examsListPage()
             * ثم نعيد تحميل البيانات من Firestore.
             */

            app.innerHTML =
              examsListPage();


            /*
             * هذه الخطوة هي التي كانت ناقصة.
             *
             * بدونها القائمة لا يتم تحديثها
             * إلا بعد Refresh.
             */

            await loadExamsList();

          }


        }
        catch (error) {

          console.error(
            "================================="
          );


          console.error(
            "❌ EDIT EXAM SAVE ERROR:",
            error
          );


          console.error(
            "Message:",
            error?.message
          );


          console.error(
            "Code:",
            error?.code
          );


          console.error(
            "================================="
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


        return;
      }

    }
  );


  // ===================================================
  // CHANGE
  // ===================================================

  container.addEventListener(
    "change",
    async e => {

      // ===============================================
      // QUESTION TYPE
      // ===============================================

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


      // ===============================================
      // IMAGE
      // ===============================================

      if (
        !e.target.matches(
          ".editImageFile"
        )
      ) {

        return;
      }


      const input =
        e.target;


      const file =
        input.files?.[0];


      if (!file) {
        return;
      }


      const card =
        input.closest(
          ".edit-question-card"
        );


      if (!card) {
        return;
      }


      try {

        const previewURL =
          URL.createObjectURL(
            file
          );


        let box =
          card.querySelector(
            ".question-image-box"
          );


        if (!box) {

          box =
            document.createElement(
              "div"
            );


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
            class="removeEditQuestionImage"
            title="حذف الصورة"
          >
            ×
          </button>

          <img
            src="${previewURL}"
            class="question-image"
            alt="صورة السؤال"
            style="
              max-width:300px;
              max-height:220px;
              margin-top:15px;
              border-radius:12px;
              display:block;
              object-fit:contain;
            "
          >

        `;

      }
      catch (error) {

        console.error(
          "EDIT IMAGE PREVIEW ERROR:",
          error
        );


        alert(
          "❌ لم يتم تحميل الصورة."
        );
      }

    }
  );
}