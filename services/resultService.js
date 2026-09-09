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
// NORMALIZE ANSWER INDEX
// ======================================================
//
// النظام الأساسي:
// index يبدأ من 0.
//
// 0 = A
// 1 = B
// 2 = C
// 3 = D
//
// ======================================================

function normalizeAnswerIndex(
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


  // --------------------------------------------------
  // NUMBER
  // --------------------------------------------------

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {

    const n =
      Math.trunc(value);


    // النظام الحالي 0-based

    if (
      n >= 0 &&
      n < options.length
    ) {

      return n;
    }


    return -1;
  }


  const raw =
    String(value).trim();


  if (!raw) {
    return -1;
  }


  // --------------------------------------------------
  // LETTER
  // --------------------------------------------------

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

    const index =
      letters[upper];


    return (
      index >= 0 &&
      index < options.length
    )
      ? index
      : -1;
  }


  // --------------------------------------------------
  // 1 - 4
  // --------------------------------------------------

  if (
    /^[1-4]$/.test(raw)
  ) {

    const index =
      Number(raw) - 1;


    if (
      index >= 0 &&
      index < options.length
    ) {

      return index;
    }
  }


  // --------------------------------------------------
  // TEXT
  // --------------------------------------------------

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
// GET CORRECT ANSWER
// ======================================================

function getCorrectAnswerValue(
  q = {}
) {

  // --------------------------------------------------
  // IMPORTANT
  //
  // correctAnswerIndex / correctIndex هما المصدر
  // الأساسي الحالي في المشروع.
  // --------------------------------------------------

  if (
    q.correctAnswerIndex !== undefined &&
    q.correctAnswerIndex !== null &&
    q.correctAnswerIndex !== ""
  ) {

    return q.correctAnswerIndex;
  }


  if (
    q.correctIndex !== undefined &&
    q.correctIndex !== null &&
    q.correctIndex !== ""
  ) {

    return q.correctIndex;
  }


  if (
    q.rightIndex !== undefined &&
    q.rightIndex !== null &&
    q.rightIndex !== ""
  ) {

    return q.rightIndex;
  }


  if (
    q.correctAnswer !== undefined &&
    q.correctAnswer !== null &&
    q.correctAnswer !== ""
  ) {

    return q.correctAnswer;
  }


  if (
    q.answer !== undefined &&
    q.answer !== null &&
    q.answer !== ""
  ) {

    return q.answer;
  }


  if (
    q.correct !== undefined &&
    q.correct !== null &&
    q.correct !== ""
  ) {

    return q.correct;
  }


  return null;
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

  const newId =
    getQuestionId(
      newQuestion,
      newIndex
    );


  // --------------------------------------------------
  // SEARCH BY ID
  // --------------------------------------------------

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
  // FALLBACK BY INDEX
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
// GET QUESTION SCORE
// ======================================================

function getQuestionScore(
  q = {}
) {

  const values = [
    q.score,
    q.points,
    q.maxScore,
    q.grade
  ];


  for (
    const value
    of values
  ) {

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {

      const number =
        Number(value);


      if (
        Number.isFinite(number) &&
        number >= 0
      ) {

        return number;
      }
    }
  }


  return 1;
}


// ======================================================
// GET ESSAY GRADE
// ======================================================

function getEssayGrade(
  essayGrades,
  index,
  questionId
) {

  if (
    !essayGrades ||
    typeof essayGrades !== "object"
  ) {

    return 0;
  }


  if (
    essayGrades[index] !== undefined
  ) {

    return (
      Number(
        essayGrades[index]
      ) || 0
    );
  }


  if (
    questionId &&
    essayGrades[questionId] !== undefined
  ) {

    return (
      Number(
        essayGrades[questionId]
      ) || 0
    );
  }


  return 0;
}


// ======================================================
// CALCULATE RESULT
// ======================================================
//
// الحساب بالكامل من examQuestions الحالية.
//
// لا نستخدم:
// score القديم
// total القديم
// percent القديم
//
// ======================================================

function calculateResult(
  result,
  examQuestions
) {

  const questions =
    Array.isArray(examQuestions)
      ? examQuestions
      : [];


  const answers =
    rebuildAnswers(
      result,
      questions
    );


  const oldEssayGrades =
    result.essayGrades &&
    typeof result.essayGrades === "object"
      ? result.essayGrades
      : {};


  const newEssayGrades = {};


  let score = 0;

  let total = 0;


  // --------------------------------------------------
  // CALCULATE
  // --------------------------------------------------

  questions.forEach(
    (q, index) => {

      if (
        !q ||
        typeof q !== "object"
      ) {

        return;
      }


      const maxScore =
        getQuestionScore(q);


      total += maxScore;


      // ==============================================
      // ESSAY
      // ==============================================

      if (
        isEssayQuestion(q)
      ) {

        const questionId =
          getQuestionId(
            q,
            index
          );


        const oldGrade =
          getEssayGrade(
            oldEssayGrades,
            index,
            questionId
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


      // ==============================================
      // MCQ
      // ==============================================

      const options =
        getQuestionOptions(q);


      const correctValue =
        getCorrectAnswerValue(q);


      const correctIndex =
        normalizeAnswerIndex(
          correctValue,
          options
        );


      const studentValue =
        answers[index];


      const studentIndex =
        normalizeAnswerIndex(
          studentValue,
          options
        );


      console.log(
        `📝 Q${index + 1}`,
        {
          correctValue,
          correctIndex,
          studentValue,
          studentIndex,
          maxScore
        }
      );


      if (
        correctIndex !== -1 &&
        studentIndex !== -1 &&
        correctIndex === studentIndex
      ) {

        score += maxScore;
      }

    }
  );


  // --------------------------------------------------
  // PERCENT
  // --------------------------------------------------

  const percent =
    total > 0
      ? Math.round(
          (score / total) * 100
        )
      : 0;


  return {

    answers,

    questions,

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
  // BY ID
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
  // BY TITLE
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

    throw new Error(
      "لا توجد أسئلة صالحة لإعادة التصحيح."
    );
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

  const matched =
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
      // IMPORTANT:
      // الحساب من الأسئلة الحالية فقط
      // ----------------------------------------------

      const recalculated =
        calculateResult(
          result,
          examQuestions
        );


      const now =
        Date.now();


      const updateData = {

        // الأسئلة الحالية
        questions:
          recalculated.questions,

        // إجابات الطالب بعد إعادة الترتيب
        answers:
          recalculated.answers,

        // درجات المقال
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

        // توافق مع أي صفحة تستخدم percentage
        percentage:
          recalculated.percent,

        // اسم الامتحان
        ...(examTitle
          ? {
              examTitle:
                examTitle
            }
          : {}),

        // أوقات التحديث
        regradedAt:
          now,

        recalculatedAt:
          now
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
          student:
            result.studentName,

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