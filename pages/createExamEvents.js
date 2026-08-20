// pages/createExamEvents.js

import {
  addExam,
  updateExam
} from "../services/examService.js";

import {
  recalculateResultsForExam
} from "../services/resultService.js";

import {
  createQuestionTemplate,
  getEditingExam,
  clearEditingExam
} from "./createExam.js";


// ======================================================
// STATE
// ======================================================

let eventsAttached = false;


// ======================================================
// IMAGE SETTINGS
// ======================================================

const MAX_IMAGE_BYTES =
  350 * 1024;

const IMAGE_MAX_WIDTH =
  1400;

const IMAGE_MAX_HEIGHT =
  1400;

const MIN_IMAGE_WIDTH =
  320;

const MIN_IMAGE_HEIGHT =
  240;


// ======================================================
// YIELD TO BROWSER
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


// ======================================================
// RENUMBER QUESTIONS
// ======================================================

function renumberQuestions() {

  const list =
    document.querySelector(
      "#questionsList"
    );

  if (!list) return;

  const cards =
    Array.from(
      list.querySelectorAll(
        ".question-card"
      )
    );

  cards.forEach(
    (
      card,
      index
    ) => {

      const number =
        index + 1;

      card.dataset.questionIndex =
        String(number);

      const numberElement =
        card.querySelector(
          ".question-number"
        );

      if (numberElement) {

        numberElement.textContent =
          number;

      }

      const title =
        card.querySelector(
          ".question-card-header strong"
        );

      if (title) {

        title.textContent =
          `السؤال ${number}`;

      }

      card
        .querySelectorAll(
          ".q-correct-radio"
        )
        .forEach(
          radio => {

            radio.name =
              `correct_${number}`;

          }
        );

    }
  );

}


// ======================================================
// QUESTION TYPE
// ======================================================

function updateQuestionType(card) {

  if (!card) return;

  const select =
    card.querySelector(
      ".q-type-select"
    );

  const options =
    card.querySelector(
      ".mcq-options"
    );

  const note =
    card.querySelector(
      ".essay-note"
    );

  if (!select) return;

  const isEssay =
    select.value === "essay";

  if (options) {

    options.style.display =
      isEssay
        ? "none"
        : "";

  }

  if (note) {

    note.style.display =
      isEssay
        ? ""
        : "none";

  }

}


// ======================================================
// PREVIEW IMAGE
// ======================================================

function previewImage(
  card,
  src
) {

  if (
    !card ||
    !src
  ) {
    return;
  }

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

    const input =
      card.querySelector(
        ".q-image-file"
      );

    if (input) {

      input.insertAdjacentElement(
        "afterend",
        box
      );

    }

  }

  if (!box) return;

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
      src="${escapeHtml(src)}"
      alt="صورة السؤال"
    >

  `;

}


// ======================================================
// LOAD IMAGE
// ======================================================

function loadImageFromFile(file) {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      if (!file) {

        reject(
          new Error(
            "ملف الصورة غير موجود."
          )
        );

        return;

      }

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

      reader.readAsDataURL(
        file
      );

    }
  );

}


// ======================================================
// DATA URL SIZE
// ======================================================

function getDataUrlBytes(
  dataURL = ""
) {

  if (!dataURL) return 0;

  const commaIndex =
    dataURL.indexOf(",");

  if (
    commaIndex === -1
  ) {
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

  return Math.max(
    0,
    Math.floor(
      (base64.length * 3) / 4
    ) - padding
  );

}


// ======================================================
// DRAW IMAGE TO CANVAS
// ======================================================

function drawImageToCanvas(
  image,
  width,
  height
) {

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
      "2d",
      {
        alpha: false
      }
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

  return canvas;

}


// ======================================================
// COMPRESS IMAGE
// ======================================================

async function compressImage(file) {

  if (!file) return "";

  if (
    !file.type ||
    !file.type.startsWith(
      "image/"
    )
  ) {

    throw new Error(
      "الملف المختار ليس صورة."
    );

  }

  console.log(
    "📷 الصورة الأصلية:",
    file.name,
    file.size,
    "bytes"
  );

  const image =
    await loadImageFromFile(
      file
    );

  const originalWidth =
    image.naturalWidth ||
    image.width;

  const originalHeight =
    image.naturalHeight ||
    image.height;

  if (
    !originalWidth ||
    !originalHeight
  ) {

    throw new Error(
      "أبعاد الصورة غير صالحة."
    );

  }

  let scale =
    Math.min(
      1,
      IMAGE_MAX_WIDTH /
        originalWidth,
      IMAGE_MAX_HEIGHT /
        originalHeight
    );

  let width =
    Math.max(
      1,
      Math.round(
        originalWidth * scale
      )
    );

  let height =
    Math.max(
      1,
      Math.round(
        originalHeight * scale
      )
    );

  let quality =
    0.82;

  // ----------------------------------------------------
  // المحاولة الأولى:
  // الضغط مع الحفاظ على الأبعاد
  // ----------------------------------------------------

  for (
    let attempt = 0;
    attempt < 12;
    attempt++
  ) {

    const canvas =
      drawImageToCanvas(
        image,
        width,
        height
      );

    const dataURL =
      canvas.toDataURL(
        "image/jpeg",
        quality
      );

    const bytes =
      getDataUrlBytes(
        dataURL
      );

    console.log(
      `📷 محاولة ضغط ${attempt + 1}:`,
      `${Math.round(bytes / 1024)}KB`,
      `${width}x${height}`,
      `quality=${quality.toFixed(2)}`
    );

    if (
      bytes <=
      MAX_IMAGE_BYTES
    ) {

      console.log(
        "✅ تم ضغط الصورة:",
        `${Math.round(bytes / 1024)}KB`
      );

      return dataURL;

    }

    quality -=
      0.06;

    if (
      quality < 0.30
    ) {

      quality =
        0.30;

      break;

    }

    await yieldToBrowser();

  }

  // ----------------------------------------------------
  // المحاولة الثانية:
  // تصغير الأبعاد
  // ----------------------------------------------------

  let currentWidth =
    width;

  let currentHeight =
    height;

  for (
    let attempt = 0;
    attempt < 10;
    attempt++
  ) {

    currentWidth =
      Math.max(
        MIN_IMAGE_WIDTH,
        Math.round(
          currentWidth * 0.80
        )
      );

    currentHeight =
      Math.max(
        MIN_IMAGE_HEIGHT,
        Math.round(
          currentHeight * 0.80
        )
      );

    const canvas =
      drawImageToCanvas(
        image,
        currentWidth,
        currentHeight
      );

    const dataURL =
      canvas.toDataURL(
        "image/jpeg",
        0.68
      );

    const bytes =
      getDataUrlBytes(
        dataURL
      );

    console.log(
      `📷 تصغير الصورة ${attempt + 1}:`,
      `${Math.round(bytes / 1024)}KB`,
      `${currentWidth}x${currentHeight}`
    );

    if (
      bytes <=
      MAX_IMAGE_BYTES
    ) {

      console.log(
        "✅ تم تصغير وضغط الصورة"
      );

      return dataURL;

    }

    await yieldToBrowser();

  }

  throw new Error(
    "تعذر ضغط الصورة إلى الحجم المناسب. اختر صورة أصغر."
  );

}


// ======================================================
// RESOLVE QUESTION IMAGE
// ======================================================

async function resolveQuestionImage(
  card
) {

  if (!card) return "";

  const input =
    card.querySelector(
      ".q-image-file"
    );

  const hidden =
    card.querySelector(
      ".q-image"
    );

  const newFile =
    input?.files?.[0];

  // صورة جديدة
  if (newFile) {

    return await compressImage(
      newFile
    );

  }

  // الصورة القديمة
  const existingImage =
    hidden?.value?.trim() ||
    "";

  return existingImage;

}


// ======================================================
// BUILD QUESTION
// ======================================================

async function buildQuestionFromCard(
  card,
  index,
  total
) {

  if (!card) {

    throw new Error(
      `تعذر قراءة السؤال رقم ${index + 1}.`
    );

  }

  const questionNumber =
    index + 1;

  const text =
    card
      .querySelector(
        ".q-text"
      )
      ?.value
      ?.trim() ||
    "";

  const type =
    card
      .querySelector(
        ".q-type-select"
      )
      ?.value ||
    "mcq";

  const score =
    Number(
      card
        .querySelector(
          ".q-score"
        )
        ?.value
    ) || 1;

  const options =
    Array.from(
      card.querySelectorAll(
        ".opt-text"
      )
    ).map(
      input =>
        input.value?.trim() ||
        ""
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
    !Number.isInteger(
      correctIndex
    ) ||
    correctIndex < 0 ||
    correctIndex > 3
  ) {

    correctIndex =
      0;

  }

  const existingId =
    card.dataset.questionId ||
    `${Date.now()}-${index}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

  const hasNewImage =
    !!card.querySelector(
      ".q-image-file"
    )?.files?.length;

  if (hasNewImage) {

    console.log(
      `📷 معالجة صورة السؤال ${questionNumber} من ${total}...`
    );

  }
  else {

    console.log(
      `📝 تجهيز السؤال ${questionNumber} من ${total}...`
    );

  }

  const image =
    await resolveQuestionImage(
      card
    );

  // ====================================================
  // ESSAY
  // ====================================================

  if (
    type === "essay"
  ) {

    return {

      id:
        existingId,

      question:
        text,

      text:
        text,

      title:
        text,

      type:
        "essay",

      score:
        score,

      points:
        score,

      maxScore:
        score,

      options:
        [],

      correctIndex:
        -1,

      correctAnswerIndex:
        -1,

      answer:
        "",

      image:
        image

    };

  }

  // ====================================================
  // MCQ
  // ====================================================

  return {

    id:
      existingId,

    question:
      text,

    text:
      text,

    title:
      text,

    type:
      "mcq",

    score:
      score,

    points:
      score,

    maxScore:
      score,

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

    correctIndex:
      correctIndex,

    correctAnswerIndex:
      correctIndex,

    answer:
      normalizedOptions[
        correctIndex
      ] || "",

    image:
      image

  };

}


// ======================================================
// RETURN TO EXAMS LIST
// ======================================================

async function returnToExamsList() {

  const app =
    document.querySelector(
      "#app"
    );

  if (!app) {

    console.warn(
      "⚠️ APP CONTAINER NOT FOUND"
    );

    return;

  }

  try {

    // --------------------------------------------------
    // تحميل الصفحة ديناميكيًا
    // مهم لمنع circular dependency
    // --------------------------------------------------

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

    // --------------------------------------------------
    // رسم صفحة القائمة
    // --------------------------------------------------

    app.innerHTML =
      module.examsListPage();

    // --------------------------------------------------
    // إعطاء المتصفح فرصة لإنشاء DOM
    // --------------------------------------------------

    await yieldToBrowser();

    // --------------------------------------------------
    // التأكد أن container موجود
    // --------------------------------------------------

    const container =
      document.querySelector(
        "#firebaseExamsList"
      );

    if (!container) {

      throw new Error(
        "لم يتم العثور على #firebaseExamsList بعد رسم صفحة الامتحانات."
      );

    }

    // --------------------------------------------------
    // تحميل الامتحانات من Firestore
    // --------------------------------------------------

    await module.loadExamsList();

  }
  catch (error) {

    console.error(
      "RETURN TO EXAMS LIST ERROR:",
      error
    );

    app.innerHTML = `

      <div style="
        padding:50px;
        text-align:center;
        direction:rtl;
        font-family:Tajawal,Arial,sans-serif;
        color:#ef4444;
      ">

        <h3>
          ❌ حدث خطأ أثناء تحميل قائمة الامتحانات
        </h3>

        <p style="
          color:#94a3b8;
          font-size:13px;
        ">

          ${escapeHtml(
            error?.message ||
            "خطأ غير معروف"
          )}

        </p>

        <button
          type="button"
          id="btnBackToAdmin"
          style="
            margin-top:20px;
            padding:12px 25px;
            border:none;
            border-radius:12px;
            cursor:pointer;
            font-weight:700;
          "
        >
          ⬅ الرجوع للوحة التحكم
        </button>

      </div>

    `;

  }

}


// ======================================================
// EVENTS
// ======================================================

export function createExamEvents() {

  // منع تكرار event listeners
  if (eventsAttached) {

    return;

  }

  eventsAttached =
    true;


  // ====================================================
  // CHANGE
  // ====================================================

  document.addEventListener(
    "change",
    async e => {

      // ------------------------------------------------
      // QUESTION TYPE
      // ------------------------------------------------

      if (
        e.target.matches(
          ".q-type-select"
        )
      ) {

        const card =
          e.target.closest(
            ".question-card"
          );

        updateQuestionType(
          card
        );

        return;

      }

      // ------------------------------------------------
      // IMAGE
      // ------------------------------------------------

      if (
        e.target.matches(
          ".q-image-file"
        )
      ) {

        const input =
          e.target;

        const file =
          input.files?.[0];

        if (!file) return;

        const card =
          input.closest(
            ".question-card"
          );

        if (!card) return;

        if (
          !file.type ||
          !file.type.startsWith(
            "image/"
          )
        ) {

          input.value =
            "";

          alert(
            "❌ الملف المختار ليس صورة."
          );

          return;

        }

        try {

          const previewURL =
            URL.createObjectURL(
              file
            );

          previewImage(
            card,
            previewURL
          );

        }
        catch (error) {

          console.error(
            "QUESTION IMAGE PREVIEW ERROR:",
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
          removeImage.closest(
            ".question-card"
          );

        if (!card) return;

        const input =
          card.querySelector(
            ".q-image-file"
          );

        const hidden =
          card.querySelector(
            ".q-image"
          );

        const box =
          card.querySelector(
            ".question-image-box"
          );

        if (input) {

          input.value =
            "";

        }

        if (hidden) {

          hidden.value =
            "";

        }

        if (box) {

          box.remove();

        }

        return;

      }


      // =================================================
      // ADD QUESTION
      // =================================================

      const addButton =
        e.target.closest(
          "#btnAddQuestion"
        );

      if (addButton) {

        e.preventDefault();
        e.stopPropagation();

        const list =
          document.querySelector(
            "#questionsList"
          );

        if (!list) return;

        const empty =
          list.querySelector(
            ".eb-empty"
          );

        if (empty) {

          empty.remove();

        }

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
          cards[
            cards.length - 1
          ];

        if (lastCard) {

          lastCard.scrollIntoView({
            behavior:
              "smooth",
            block:
              "center"
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

        if (!card) return;

        const list =
          document.querySelector(
            "#questionsList"
          );

        if (!list) return;

        const cards =
          list.querySelectorAll(
            ".question-card"
          );

        if (
          cards.length <= 1
        ) {

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

        if (!card) return;

        const list =
          document.querySelector(
            "#questionsList"
          );

        if (!list) return;

        const clone =
          card.cloneNode(
            true
          );

        // -----------------------------------------------
        // الصورة الجديدة لا يجب أن تكون مرتبطة بالنسخة
        // -----------------------------------------------

        const fileInput =
          clone.querySelector(
            ".q-image-file"
          );

        if (fileInput) {

          fileInput.value =
            "";

        }

        // -----------------------------------------------
        // السؤال المكرر يجب أن يحصل على ID جديد
        // -----------------------------------------------

        delete clone.dataset.questionId;

        // -----------------------------------------------
        // إزالة الصورة القديمة
        // -----------------------------------------------

        const hiddenImage =
          clone.querySelector(
            ".q-image"
          );

        if (hiddenImage) {

          hiddenImage.value =
            "";

        }

        const imageBox =
          clone.querySelector(
            ".question-image-box"
          );

        if (imageBox) {

          imageBox.remove();

        }

        card.insertAdjacentElement(
          "afterend",
          clone
        );

        renumberQuestions();

        clone.scrollIntoView({
          behavior:
            "smooth",
          block:
            "center"
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

        await saveExam(
          saveButton
        );

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

        await returnToExamsList();

        return;

      }

    }
  );

}


// ======================================================
// SAVE EXAM
// ======================================================

async function saveExam(
  saveButton
) {

  // ====================================================
  // BASIC DATA
  // ====================================================

  const title =
    document
      .querySelector(
        "#examTitle"
      )
      ?.value
      ?.trim();

  if (!title) {

    alert(
      "اكتب عنوان الامتحان"
    );

    return;

  }


  const subject =
    document
      .querySelector(
        "#examSubject"
      )
      ?.value ||
    "physics";


  const className =
    document
      .querySelector(
        "#examClass"
      )
      ?.value ||
    "الصف الأول الثانوي";


  const duration =
    Number(
      document
        .querySelector(
          "#examDuration"
        )
        ?.value
    ) || 60;


  const passingScore =
    Number(
      document
        .querySelector(
          "#examPassingScore"
        )
        ?.value
    ) || 50;


  const startDate =
    document
      .querySelector(
        "#examStartDate"
      )
      ?.value ||
    "";


  const endDate =
    document
      .querySelector(
        "#examEndDate"
      )
      ?.value ||
    "";


  // ====================================================
  // QUESTIONS
  // ====================================================

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


  // ====================================================
  // EDIT STATE
  // ====================================================

  const currentExam =
    getEditingExam();

  const isEdit =
    !!currentExam;


  const existingExamId =
    currentExam?.firestoreId ||
    currentExam?.id ||
    "";


  try {

    saveButton.disabled =
      true;

    console.log(
      "======================================"
    );

    console.log(
      "💾 SAVE EXAM START"
    );

    console.log(
      "MODE:",
      isEdit
        ? "EDIT"
        : "CREATE"
    );

    console.log(
      "EXAM ID:",
      existingExamId
    );

    console.log(
      "QUESTIONS:",
      cards.length
    );


    // ==================================================
    // BUILD QUESTIONS
    // ==================================================

    const questions = [];

    for (
      let index = 0;
      index < cards.length;
      index++
    ) {

      const card =
        cards[index];

      const questionNumber =
        index + 1;

      const hasNewImage =
        !!card.querySelector(
          ".q-image-file"
        )?.files?.length;


      saveButton.textContent =
        hasNewImage
          ? `⏳ معالجة صورة السؤال ${questionNumber}...`
          : `⏳ تجهيز السؤال ${questionNumber}...`;


      const question =
        await buildQuestionFromCard(
          card,
          index,
          cards.length
        );


      questions.push(
        question
      );


      await yieldToBrowser();

    }


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

      isOpen:
        true,

      isPublished:
        true,

      published:
        true,

      questions,

      questionsCount:
        questions.length

    };


    // ==================================================
    // SAVE
    // ==================================================

    saveButton.textContent =
      "⏳ جاري حفظ الامتحان...";


    // ==================================================
    // EDIT
    // ==================================================

    if (isEdit) {

      const examId =
        existingExamId;

      if (!examId) {

        throw new Error(
          "معرف الامتحان غير موجود."
        );

      }


      console.log(
        "🔥 UPDATE EXAM:",
        examId
      );


      await updateExam(
        examId,
        examData
      );


      console.log(
        "✅ EXAM UPDATED"
      );


      // ------------------------------------------------
      // إعادة حساب النتائج
      //
      // لا ننتظرها حتى لا نعطل انتقال الصفحة.
      // ------------------------------------------------

      const resultExamTitle =
        currentExam?.title ||
        title;


      Promise.resolve()
        .then(
          () =>
            recalculateResultsForExam(
              examId,
              resultExamTitle,
              questions
            )
        )
        .then(
          info => {

            console.log(
              "🔄 انتهى تحديث النتائج:",
              info
            );

          }
        )
        .catch(
          error => {

            console.error(
              "⚠️ خطأ في تحديث النتائج:",
              error
            );

          }
        );

    }


    // ==================================================
    // CREATE
    // ==================================================

    else {

      console.log(
        "🔥 ADD NEW EXAM"
      );


      await addExam(
        examData
      );


      console.log(
        "✅ EXAM CREATED"
      );

    }


    // ==================================================
    // SUCCESS
    // ==================================================

    alert(
      isEdit
        ? "✅ تم حفظ تعديلات الامتحان بنجاح"
        : "✅ تم حفظ الامتحان بنجاح"
    );


    // ==================================================
    // IMPORTANT
    // إزالة وضع التعديل قبل الانتقال
    // ==================================================

    clearEditingExam();


    // ==================================================
    // RETURN TO LIST
    // ==================================================

    saveButton.textContent =
      "⏳ جاري تحميل قائمة الامتحانات...";


    await returnToExamsList();


  }
  catch (error) {

    console.error(
      "======================================"
    );

    console.error(
      "❌ SAVE EXAM ERROR:",
      error
    );

    console.error(
      "MESSAGE:",
      error?.message
    );

    console.error(
      "CODE:",
      error?.code
    );

    console.error(
      "======================================"
    );


    let message =
      error?.message ||
      "خطأ غير معروف";


    // --------------------------------------------------
    // Firestore size error
    // --------------------------------------------------

    if (
      String(message)
        .toLowerCase()
        .includes(
          "maximum allowed size"
        )
    ) {

      message =
        "حجم الصورة كبير جدًا بالنسبة لـ Firestore. اختر صورة أصغر.";

    }


    // --------------------------------------------------
    // Firestore document size
    // --------------------------------------------------

    if (
      String(message)
        .toLowerCase()
        .includes(
          "document"
        ) &&
      String(message)
        .toLowerCase()
        .includes(
          "size"
        )
    ) {

      message =
        "حجم بيانات الامتحان كبير جدًا. قلل حجم الصور أو عددها.";

    }


    alert(
      "❌ حدث خطأ أثناء حفظ الامتحان\n\n" +
      message
    );


    saveButton.disabled =
      false;


    saveButton.textContent =
      isEdit
        ? "💾 حفظ التعديلات"
        : "💾 حفظ الامتحان";

  }

}