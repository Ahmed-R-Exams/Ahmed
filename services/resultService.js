// services/resultService.js

import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";


const RESULTS_COLLECTION = "results";


// ======================================================
// NORMALIZE RESULT
// ======================================================

function normalizeResult(
  firestoreId,
  data = {}
) {

  return {
    ...data,

    id: firestoreId,

    firestoreId
  };
}


// ======================================================
// SAVE RESULT
// ======================================================

export async function saveResult(
  result = {}
) {

  const data = {
    ...result,

    createdAt:
      result.createdAt ??
      Date.now()
  };

  const ref =
    await addDoc(
      collection(
        db,
        RESULTS_COLLECTION
      ),
      data
    );

  return normalizeResult(
    ref.id,
    data
  );
}


// ======================================================
// GET ALL RESULTS
// ======================================================

export async function getResults() {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          RESULTS_COLLECTION
        )
      );

    return snapshot.docs.map(
      item =>
        normalizeResult(
          item.id,
          item.data()
        )
    );

  }
  catch (error) {

    console.error(
      "GET RESULTS ERROR:",
      error
    );

    return [];
  }
}


// ======================================================
// GET RESULT BY ID
// ======================================================

export async function getResultById(
  id
) {

  if (!id) {
    return null;
  }

  const cleanId =
    String(id).trim();

  if (!cleanId) {
    return null;
  }

  try {

    const snap =
      await getDoc(
        doc(
          db,
          RESULTS_COLLECTION,
          cleanId
        )
      );

    if (!snap.exists()) {
      return null;
    }

    return normalizeResult(
      snap.id,
      snap.data()
    );

  }
  catch (error) {

    console.error(
      "GET RESULT BY ID ERROR:",
      error
    );

    return null;
  }
}


// ======================================================
// CHECK STUDENT ATTEMPT
// ======================================================

export async function hasStudentAttemptedExam(
  examId,
  studentName,
  examTitle = ""
) {

  if (!examId && !examTitle) {
    return false;
  }

  try {

    let snapshot = null;


    // --------------------------------------------------
    // SEARCH BY EXAM ID
    // --------------------------------------------------

    if (examId) {

      const examIdQuery =
        query(
          collection(
            db,
            RESULTS_COLLECTION
          ),
          where(
            "examId",
            "==",
            String(examId)
          )
        );

      snapshot =
        await getDocs(
          examIdQuery
        );
    }


    // --------------------------------------------------
    // FALLBACK BY TITLE
    // --------------------------------------------------

    if (
      (!snapshot ||
        snapshot.empty) &&
      examTitle
    ) {

      const titleQuery =
        query(
          collection(
            db,
            RESULTS_COLLECTION
          ),
          where(
            "examTitle",
            "==",
            String(examTitle)
          )
        );

      snapshot =
        await getDocs(
          titleQuery
        );
    }


    if (
      !snapshot ||
      snapshot.empty
    ) {

      return false;
    }


    const targetStudent =
      String(
        studentName || ""
      )
        .trim()
        .toLowerCase();


    return snapshot.docs.some(
      item => {

        const data =
          item.data();


        const resultStudent =
          String(
            data.studentName ||
            ""
          )
            .trim()
            .toLowerCase();


        if (
          resultStudent !==
          targetStudent
        ) {

          return false;
        }


        if (examId) {

          const resultExamId =
            String(
              data.examId ||
              ""
            );


          if (
            resultExamId ===
            String(examId)
          ) {

            return true;
          }
        }


        if (examTitle) {

          return (
            String(
              data.examTitle ||
              ""
            )
              .trim() ===
            String(
              examTitle ||
              ""
            )
              .trim()
          );
        }


        return false;
      }
    );

  }
  catch (error) {

    console.error(
      "CHECK STUDENT ATTEMPT ERROR:",
      error
    );

    return false;
  }
}


// ======================================================
// UPDATE RESULT
// ======================================================

export async function updateResult(
  id,
  data = {}
) {

  if (!id) {

    throw new Error(
      "Result ID is required."
    );
  }


  const cleanId =
    String(id).trim();


  await updateDoc(
    doc(
      db,
      RESULTS_COLLECTION,
      cleanId
    ),
    data
  );
}


// ======================================================
// DELETE RESULT
// ======================================================

export async function deleteResult(
  id
) {

  if (!id) {

    throw new Error(
      "Result ID is required."
    );
  }


  const cleanId =
    String(id).trim();


  await deleteDoc(
    doc(
      db,
      RESULTS_COLLECTION,
      cleanId
    )
  );
}


// ======================================================
// DELETE ALL RESULTS
// ======================================================

export async function deleteAllResults() {

  const snapshot =
    await getDocs(
      collection(
        db,
        RESULTS_COLLECTION
      )
    );


  for (
    const item
    of snapshot.docs
  ) {

    await deleteDoc(
      doc(
        db,
        RESULTS_COLLECTION,
        item.id
      )
    );
  }
}


// ======================================================
// QUESTION OPTIONS
// ======================================================

function getQuestionOptions(
  q = {}
) {

  if (
    Array.isArray(
      q.options
    )
  ) {

    return q.options;
  }


  if (
    Array.isArray(
      q.choices
    )
  ) {

    return q.choices;
  }


  const letters = [
    q.A,
    q.B,
    q.C,
    q.D
  ];


  if (
    letters.some(
      value =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    )
  ) {

    return letters;
  }


  return [];
}


// ======================================================
// NORMALIZE CORRECT ANSWER
// ======================================================

function normalizeCorrectIndex(
  value,
  options = []
) {

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {

    return -1;
  }


  // -----------------------------------------------
  // NUMBER
  // -----------------------------------------------

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {

    const n =
      Math.trunc(value);


    // المشروع يستخدم 0-based
    if (
      n >= 0 &&
      n < options.length
    ) {

      return n;
    }


    // دعم البيانات القديمة 1-based
    if (
      n >= 1 &&
      n <= options.length
    ) {

      return n - 1;
    }


    return -1;
  }


  const raw =
    String(value).trim();


  // -----------------------------------------------
  // LETTER
  // -----------------------------------------------

  const letters = {
    A: 0,
    B: 1,
    C: 2,
    D: 3
  };


  const upper =
    raw.toUpperCase();


  if (
    Object.prototype.hasOwnProperty.call(
      letters,
      upper
    )
  ) {

    return letters[upper];
  }


  // -----------------------------------------------
  // 1 - 4
  // -----------------------------------------------

  if (
    /^[1-4]$/.test(raw)
  ) {

    const n =
      Number(raw) - 1;


    if (
      n >= 0 &&
      n < options.length
    ) {

      return n;
    }
  }


  // -----------------------------------------------
  // 0 - 3
  // -----------------------------------------------

  if (
    /^\d+$/.test(raw)
  ) {

    const n =
      Number(raw);


    if (
      n >= 0 &&
      n < options.length
    ) {

      return n;
    }
  }


  // -----------------------------------------------
  // ANSWER TEXT
  // -----------------------------------------------

  const textIndex =
    options.findIndex(
      option =>
        String(option).trim() ===
        raw
    );


  if (
    textIndex !== -1
  ) {

    return textIndex;
  }


  return -1;
}


// ======================================================
// QUESTION TYPE
// ======================================================

function isEssayQuestion(
  q = {}
) {

  const type =
    String(
      q.type || ""
    )
      .toLowerCase()
      .trim();


  return (
    type.includes("essay") ||
    type.includes("مقال") ||
    type.includes("written")
  );
}


// ======================================================
// QUESTION ID
// ======================================================

function getQuestionId(
  q,
  index
) {

  if (!q) {
    return `index-${index}`;
  }


  const id =
    q.id ??
    q.firestoreId ??
    q.questionId;


  if (
    id !== undefined &&
    id !== null &&
    String(id).trim() !== ""
  ) {

    return String(id);
  }


  return `index-${index}`;
}


// ======================================================
// FIND OLD ANSWER
// ======================================================

function getOldAnswerForQuestion(
  oldQuestions,
  oldAnswers,
  newQuestion,
  newIndex
) {

  // --------------------------------------------------
  // أولاً: البحث بالـ ID
  // --------------------------------------------------

  const newId =
    getQuestionId(
      newQuestion,
      newIndex
    );


  if (
    Array.isArray(oldQuestions) &&
    Array.isArray(oldAnswers)
  ) {

    const oldIndex =
      oldQuestions.findIndex(
        (oldQuestion, index) =>
          getQuestionId(
            oldQuestion,
            index
          ) === newId
      );


    if (
      oldIndex !== -1 &&
      oldIndex < oldAnswers.length
    ) {

      return oldAnswers[oldIndex];
    }
  }


  // --------------------------------------------------
  // FALLBACK
  // للنتائج القديمة التي لا تحتوي IDs
  // --------------------------------------------------

  if (
    Array.isArray(oldAnswers) &&
    newIndex < oldAnswers.length
  ) {

    return oldAnswers[newIndex];
  }


  return undefined;
}


// ======================================================
// REBUILD ANSWERS
// ======================================================
//
// مهم جدًا:
//
// عند تعديل الامتحان:
//
// السؤال الحالي رقم 3 قد يكون كان رقم 4.
//
// لذلك لا نعتمد على index فقط.
// نبحث أولاً عن ID السؤال.
//
// ثم نحافظ على إجابة الطالب نفسها.
//
// ======================================================

function rebuildAnswers(
  result,
  examQuestions
) {

  const oldQuestions =
    Array.isArray(
      result.questions
    )
      ? result.questions
      : [];


  const oldAnswers =
    Array.isArray(
      result.answers
    )
      ? result.answers
      : [];


  return examQuestions.map(
    (question, index) => {

      const answer =
        getOldAnswerForQuestion(
          oldQuestions,
          oldAnswers,
          question,
          index
        );


      return answer === undefined
        ? null
        : answer;
    }
  );
}


// ======================================================
// CALCULATE RESULT
// ======================================================

function calculateResult(
  result,
  examQuestions
) {

  const answers =
    rebuildAnswers(
      result,
      examQuestions
    );


  const oldEssayGrades =
    result.essayGrades &&
    typeof result.essayGrades === "object"
      ? result.essayGrades
      : {};


  const newEssayGrades = {};


  let score = 0;
  let total = 0;


  examQuestions.forEach(
    (q, index) => {

      if (
        !q ||
        typeof q !== "object"
      ) {

        return;
      }


      const maxScore =
        Number(
          q.score ??
          q.points ??
          q.maxScore ??
          q.grade ??
          1
        ) || 1;


      total += maxScore;


      // ==========================================
      // ESSAY
      // ==========================================

      if (
        isEssayQuestion(q)
      ) {

        const oldGrade =
          Number(
            oldEssayGrades[index] ??
            0
          );


        const grade =
          Math.max(
            0,
            Math.min(
              oldGrade,
              maxScore
            )
          );


        newEssayGrades[index] =
          grade;


        score += grade;


        return;
      }


      // ==========================================
      // MCQ
      // ==========================================

      const options =
        getQuestionOptions(q);


      const correctIndex =
        normalizeCorrectIndex(
          q.correctAnswerIndex ??
          q.correctIndex ??
          q.rightIndex ??
          q.correctAnswer ??
          q.answer ??
          q.correct,
          options
        );


      const studentRaw =
        answers[index];


      let studentIndex =
        -1;


      if (
        typeof studentRaw === "number" &&
        Number.isFinite(studentRaw)
      ) {

        studentIndex =
          Math.trunc(
            studentRaw
          );
      }
      else if (
        studentRaw !== undefined &&
        studentRaw !== null &&
        String(studentRaw).trim() !== ""
      ) {

        studentIndex =
          normalizeCorrectIndex(
            studentRaw,
            options
          );
      }


      if (
        studentIndex >= 0 &&
        studentIndex === correctIndex
      ) {

        score += maxScore;
      }

    }
  );


  const percent =
    total > 0
      ? Math.round(
          (score / total) * 100
        )
      : 0;


  return {

    answers,

    questions:
      examQuestions,

    essayGrades:
      newEssayGrades,

    score,

    total,

    percent

  };
}


// ======================================================
// FETCH RESULTS FOR EXAM
// ======================================================

async function getResultsForExam(
  examId,
  examTitle = ""
) {

  let snapshot =
    null;


  // --------------------------------------------------
  // BY EXAM ID
  // --------------------------------------------------

  if (examId) {

    const examIdQuery =
      query(
        collection(
          db,
          RESULTS_COLLECTION
        ),
        where(
          "examId",
          "==",
          String(examId)
        )
      );


    snapshot =
      await getDocs(
        examIdQuery
      );
  }


  // --------------------------------------------------
  // FALLBACK BY TITLE
  // --------------------------------------------------

  if (
    (!snapshot ||
      snapshot.empty) &&
    examTitle
  ) {

    const titleQuery =
      query(
        collection(
          db,
          RESULTS_COLLECTION
        ),
        where(
          "examTitle",
          "==",
          String(examTitle)
        )
      );


    snapshot =
      await getDocs(
        titleQuery
      );
  }


  return snapshot;
}


// ======================================================
// REGRADE RESULTS FOR EXAM
// ======================================================
//
// هذه هي الدالة التي يستدعيها:
//
// pages/editExamEvents.js
//
// بعد حفظ تعديل الامتحان.
//
// ======================================================

export async function regradeResultsForExam(
  examIds = [],
  examQuestions = [],
  examTitle = ""
) {

  // --------------------------------------------------
  // NORMALIZE IDS
  // --------------------------------------------------

  const ids =
    Array.isArray(examIds)
      ? examIds
      : [examIds];


  const cleanIds =
    ids
      .filter(
        id =>
          id !== undefined &&
          id !== null &&
          String(id).trim() !== ""
      )
      .map(
        id =>
          String(id).trim()
      );


  if (
    !cleanIds.length &&
    !examTitle
  ) {

    return {
      updated: 0,
      matched: 0
    };
  }


  if (
    !Array.isArray(examQuestions) ||
    !examQuestions.length
  ) {

    return {
      updated: 0,
      matched: 0
    };
  }


  // --------------------------------------------------
  // GET RESULTS
  // --------------------------------------------------

  let allDocs = [];


  try {

    const seen =
      new Set();


    for (
      const examId
      of cleanIds
    ) {

      const snapshot =
        await getResultsForExam(
          examId,
          ""
        );


      if (
        !snapshot ||
        snapshot.empty
      ) {

        continue;
      }


      snapshot.docs.forEach(
        item => {

          if (
            !seen.has(
              item.id
            )
          ) {

            seen.add(
              item.id
            );


            allDocs.push(
              item
            );
          }
        }
      );
    }


    // ------------------------------------------------
    // TITLE FALLBACK
    // ------------------------------------------------

    if (
      !allDocs.length &&
      examTitle
    ) {

      const snapshot =
        await getResultsForExam(
          "",
          examTitle
        );


      if (
        snapshot &&
        !snapshot.empty
      ) {

        allDocs =
          snapshot.docs;
      }
    }

  }
  catch (error) {

    console.error(
      "REGRADE FETCH ERROR:",
      error
    );


    throw error;
  }


  // --------------------------------------------------
  // NO RESULTS
  // --------------------------------------------------

  if (!allDocs.length) {

    console.log(
      "ℹ️ No results found for exam."
    );


    return {
      updated: 0,
      matched: 0
    };
  }


  let updated = 0;

  let matched =
    allDocs.length;


  // --------------------------------------------------
  // UPDATE EVERY RESULT
  // --------------------------------------------------

  for (
    const item
    of allDocs
  ) {

    try {

      const result =
        normalizeResult(
          item.id,
          item.data()
        );


      // ----------------------------------------------
      // CALCULATE AGAINST CURRENT EXAM
      // ----------------------------------------------

      const recalculated =
        calculateResult(
          result,
          examQuestions
        );


      // ----------------------------------------------
      // UPDATE RESULT
      // ----------------------------------------------

      const updateData = {

        // الأسئلة الجديدة
        questions:
          recalculated.questions,

        // إجابات الطالب بنفس ترتيب الأسئلة الجديدة
        answers:
          recalculated.answers,

        // الدرجات المقالية
        essayGrades:
          recalculated.essayGrades,

        // الدرجة الجديدة
        score:
          recalculated.score,

        // المجموع الجديد
        total:
          recalculated.total,

        // النسبة الجديدة
        percent:
          recalculated.percent,

        // تحديث اسم الامتحان أيضًا
        ...(examTitle
          ? {
              examTitle:
                examTitle
            }
          : {}),

        // وقت آخر إعادة تصحيح
        regradedAt:
          Date.now()

      };


      await updateDoc(
        doc(
          db,
          RESULTS_COLLECTION,
          item.id
        ),
        updateData
      );


      updated++;


      console.log(
        `✅ Result regraded: ${item.id}`,
        {
          score:
            recalculated.score,

          total:
            recalculated.total,

          percent:
            recalculated.percent
        }
      );

    }
    catch (error) {

      console.error(
        "❌ REGRADE RESULT ERROR:",
        item.id,
        error
      );
    }
  }


  return {
    updated,
    matched
  };
}


// ======================================================
// RECALCULATE RESULTS FOR EXAM
// ======================================================
//
// احتفظنا بالدالة القديمة أيضًا
// حتى لا تتكسر أي ملفات أخرى تستخدمها.
//
// ======================================================

export async function recalculateResultsForExam(
  examId,
  examQuestions = [],
  examTitle = ""
) {

  const result =
    await regradeResultsForExam(
      [examId],
      examQuestions,
      examTitle
    );


  return {
    updated:
      result.updated
  };
}