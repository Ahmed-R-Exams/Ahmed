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
  recalculateResultsForExam
} from "../services/resultService.js";

import {
  createQuestionTemplate,
  getEditingExam,
  clearEditingExam
} from "./createExam.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

import {
  storage
} from "../firebase.js";

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
      numberElement.textContent =
        number;

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
// PREVIEW IMAGE
// ======================================================

function previewImage(card, src) {

  if (!card || !src)
    return;

  let box =
    card.querySelector(
      ".question-image-box"
    );

  if (!box) {

    box =
      document.createElement("div");

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

  if (!box)
    return;

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
      src="${src}"
      alt="صورة السؤال"
    >

  `;
}


// ======================================================
// UPLOAD IMAGE TO FIREBASE STORAGE
// ======================================================

async function uploadQuestionImage(
  file,
  examId,
  questionId,
  index
) {

  if (!file)
    return "";

  const safeExamId =
    String(examId || "new-exam")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

  const safeQuestionId =
    String(
      questionId ||
      `${Date.now()}-${index}`
    )
      .replace(/[^a-zA-Z0-9_-]/g, "_");

  const extension =
    (
      file.name?.split(".").pop() ||
      "jpg"
    )
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const fileName =
    `${safeQuestionId}_${Date.now()}.${extension || "jpg"}`;

  const storageRef =
    ref(
      storage,
      `exam-images/${safeExamId}/${fileName}`
    );

  await uploadBytes(
    storageRef,
    file,
    {
      contentType:
        file.type ||
        "image/jpeg"
    }
  );

  return await getDownloadURL(
    storageRef
  );
}


// ======================================================
// CONVERT OLD BASE64 IMAGE TO FILE
// ======================================================

async function dataURLToFile(
  dataURL,
  fileName = "question-image.jpg"
) {

  if (
    !dataURL ||
    typeof dataURL !== "string" ||
    !dataURL.startsWith("data:")
  ) {
    return null;
  }

  const response =
    await fetch(dataURL);

  const blob =
    await response.blob();

  return new File(
    [blob],
    fileName,
    {
      type:
        blob.type ||
        "image/jpeg"
    }
  );
}


// ======================================================
// RESOLVE QUESTION IMAGE
// ======================================================
//
// الأولوية:
//
// 1- صورة جديدة من input
// 2- رابط Storage موجود بالفعل
// 3- Base64 قديم -> يتحول تلقائيًا إلى Storage
//
// ======================================================

async function resolveQuestionImage(
  card,
  examId,
  questionId,
  index
) {

  const input =
    card.querySelector(
      ".q-image-file"
    );

  const hidden =
    card.querySelector(
      ".q-image"
    );

  // ----------------------------------------------------
  // صورة جديدة اختارها المستخدم
  // ----------------------------------------------------

  const newFile =
    input?.files?.[0];

  if (newFile) {

    return await uploadQuestionImage(
      newFile,
      examId,
      questionId,
      index
    );

  }

  // ----------------------------------------------------
  // قيمة الصورة القديمة
  // ----------------------------------------------------

  const existingImage =
    hidden?.value || "";

  if (!existingImage)
    return "";

  // ----------------------------------------------------
  // لو رابط Storage / URL عادي
  // ----------------------------------------------------

  if (
    existingImage.startsWith("http://") ||
    existingImage.startsWith("https://")
  ) {

    return existingImage;

  }

  // ----------------------------------------------------
  // لو Base64 قديم
  // نحوله إلى Storage
  // ----------------------------------------------------

  if (
    existingImage.startsWith("data:")
  ) {

    const oldFile =
      await dataURLToFile(
        existingImage,
        `question-${index + 1}.jpg`
      );

    if (!oldFile)
      return "";

    return await uploadQuestionImage(
      oldFile,
      examId,
      questionId,
      index
    );

  }

  return "";
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

      // =================================================
      // QUESTION TYPE
      // =================================================

      if (
        e.target.matches(".q-type-select")
      ) {

        const card =
          e.target.closest(
            ".question-card"
          );

        updateQuestionType(card);

        return;
      }


      // =================================================
      // QUESTION IMAGE
      // =================================================

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
          input.closest(
            ".question-card"
          );

        if (!card)
          return;

        try {

          // ------------------------------------------------
          // لا نحفظ Base64 في hidden input.
          // نستخدم Object URL للمعاينة فقط.
          // ------------------------------------------------

          const previewURL =
            URL.createObjectURL(
              file
            );

          const hidden =
            card.querySelector(
              ".q-image"
            );

          if (hidden) {

            // مهم:
            // نخلي القيمة القديمة كما هي لو موجودة.
            // الملف الجديد سيتم رفعه وقت الحفظ.

          }

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

        if (!card)
          return;

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

        if (!list)
          return;

        const empty =
          list.querySelector(
            ".eb-empty"
          );

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

        // ------------------------------------------------
        // الصورة المكررة لا نعتبرها ملفًا جديدًا.
        // نحتفظ بالرابط الموجود فقط.
        // ------------------------------------------------

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

        const app =
          document.querySelector(
            "#app"
          );

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

async function saveExam(
  saveButton
) {

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
    document.querySelector(
      "#examSubject"
    )?.value ||
    "physics";


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
    )?.value ||
    "";


  const endDate =
    document.querySelector(
      "#examEndDate"
    )?.value ||
    "";


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


  const currentExam =
    getEditingExam();

  const isEdit =
    !!currentExam;


  // ====================================================
  // EXAM ID
  // ====================================================

  const existingExamId =
    currentExam?.firestoreId ||
    currentExam?.id ||
    "";


  // ====================================================
  // DISABLE SAVE
  // ====================================================

  try {

    saveButton.disabled =
      true;

    saveButton.textContent =
      "⏳ جاري تجهيز الأسئلة...";


    // ==================================================
    // BUILD QUESTIONS
    // ==================================================

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
        )
          .map(
            input =>
              input.value
                ?.trim() ||
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
          checked?.value ??
          0
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


      const existingId =
        card.dataset.questionId ||
        `${Date.now()}-${index}`;


      // ==================================================
      // IMAGE
      // ==================================================

      saveButton.textContent =
        `⏳ رفع صورة السؤال ${index + 1}...`;


      const image =
        await resolveQuestionImage(
          card,
          existingExamId ||
            `new-${Date.now()}`,
          existingId,
          index
        );


      // ==================================================
      // ESSAY
      // ==================================================

      if (
        type === "essay"
      ) {

        questions.push({

          id:
            existingId,

          question:
            text,

          text,

          title:
            text,

          type:
            "essay",

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

          image

        });

        continue;
      }


      // ==================================================
      // MCQ
      // ==================================================

      questions.push({

        id:
          existingId,

        question:
          text,

        text,

        title:
          text,

        type:
          "mcq",

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

        correctIndex,

        correctAnswerIndex:
          correctIndex,

        answer:
          normalizedOptions[
            correctIndex
          ] || "",

        image

      });

    }


    // ====================================================
    // EXAM DATA
    // ====================================================

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


    saveButton.textContent =
      "⏳ جاري حفظ الامتحان...";


    let recalcInfo =
      null;


    // ====================================================
    // EDIT
    // ====================================================

    if (isEdit) {

      const examId =
        existingExamId;


      if (!examId) {

        throw new Error(
          "معرف الامتحان غير موجود."
        );

      }


      await updateExam(
        examId,
        examData
      );


      // ================================================
      // إعادة تصحيح نتائج الطلاب
      // ================================================

      try {

        recalcInfo =
          await recalculateResultsForExam(
            examId,
            currentExam.title ||
              title,
            questions
          );

      }
      catch (
        recalcError
      ) {

        console.error(
          "RECALCULATE RESULTS ERROR:",
          recalcError
        );

      }

    }


    // ====================================================
    // NEW EXAM
    // ====================================================

    else {

      await addExam(
        examData
      );

    }


    // ====================================================
    // MESSAGE
    // ====================================================

    const recalcMessage =
      isEdit &&
      recalcInfo &&
      recalcInfo.updated > 0
        ? `\n\n🔄 تم تحديث نتائج ${recalcInfo.updated} طالب/طلاب بناءً على التعديل.`
        : "";


    alert(
      (
        isEdit
          ? "✅ تم حفظ تعديلات الامتحان"
          : "✅ تم حفظ الامتحان بنجاح"
      ) +
      recalcMessage
    );


    clearEditingExam();


    const app =
      document.querySelector(
        "#app"
      );


    if (app) {

      app.innerHTML =
        examsListPage();

      await loadExamsList();

    }

  }
  catch (
    error
  ) {

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


    saveButton.disabled =
      false;


    saveButton.textContent =
      isEdit
        ? "💾 حفظ التعديلات"
        : "💾 حفظ الامتحان";

  }

}