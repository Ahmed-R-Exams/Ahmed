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
  where,
} from "firebase/firestore";

const RESULTS_COLLECTION = "results";

// ======================================================
// SAVE RESULT
// ======================================================

export async function saveResult(result = {}) {
  const data = {
    ...result,

    createdAt:
      result.createdAt ??
      Date.now(),
  };

  const ref = await addDoc(
    collection(db, RESULTS_COLLECTION),
    data
  );

  return {
    firestoreId: ref.id,
    id: ref.id,
    ...data,
  };
}

// ======================================================
// GET ALL RESULTS
// ======================================================

export async function getResults() {
  const snapshot = await getDocs(
    collection(db, RESULTS_COLLECTION)
  );

  return snapshot.docs.map((item) => ({
    firestoreId: item.id,
    id: item.id,
    ...item.data(),
  }));
}

// ======================================================
// GET RESULT BY ID
// ======================================================

export async function getResultById(id) {
  if (!id) {
    return null;
  }

  try {
    const snap = await getDoc(
      doc(
        db,
        RESULTS_COLLECTION,
        id
      )
    );

    if (!snap.exists()) {
      return null;
    }

    return {
      firestoreId: snap.id,
      id: snap.id,
      ...snap.data(),
    };
  } catch (error) {
    console.error(
      "GET RESULT BY ID ERROR:",
      error
    );

    return null;
  }
}

// ======================================================
// CHECK STUDENT ATTEMPT FOR ONE EXAM
// ======================================================
// مهم:
// لا نحمل كل النتائج.
// نطلب فقط النتائج الخاصة بالامتحان الحالي.
// ثم نتحقق من اسم الطالب محليًا.
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
    // الأفضل: البحث بالـ Firestore examId
    // --------------------------------------------------

    if (examId) {
      const examIdQuery = query(
        collection(db, RESULTS_COLLECTION),
        where(
          "examId",
          "==",
          String(examId)
        )
      );

      snapshot = await getDocs(
        examIdQuery
      );
    }

    // --------------------------------------------------
    // لو مفيش examId، نستخدم العنوان كـ fallback
    // --------------------------------------------------

    if (
      (!snapshot ||
        snapshot.empty) &&
      examTitle
    ) {
      const titleQuery = query(
        collection(db, RESULTS_COLLECTION),
        where(
          "examTitle",
          "==",
          String(examTitle)
        )
      );

      snapshot = await getDocs(
        titleQuery
      );
    }

    if (!snapshot || snapshot.empty) {
      return false;
    }

    const targetStudent =
      String(studentName || "")
        .trim()
        .toLowerCase();

    return snapshot.docs.some(
      (item) => {
        const data = item.data();

        const resultStudent =
          String(
            data.studentName || ""
          )
            .trim()
            .toLowerCase();

        if (
          resultStudent !==
          targetStudent
        ) {
          return false;
        }

        // ----------------------------------------------
        // تأكيد إضافي للامتحان
        // ----------------------------------------------

        if (examId) {
          const resultExamId =
            String(
              data.examId || ""
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
              data.examTitle || ""
            ).trim() ===
            String(
              examTitle || ""
            ).trim()
          );
        }

        return false;
      }
    );
  } catch (error) {
    console.error(
      "CHECK STUDENT ATTEMPT ERROR:",
      error
    );

    // لا نمنع الطالب من الامتحان بسبب خطأ
    // في فحص النتيجة.
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

  await updateDoc(
    doc(
      db,
      RESULTS_COLLECTION,
      id
    ),
    data
  );
}

// ======================================================
// DELETE RESULT
// ======================================================

export async function deleteResult(id) {
  if (!id) {
    throw new Error(
      "Result ID is required."
    );
  }

  await deleteDoc(
    doc(
      db,
      RESULTS_COLLECTION,
      id
    )
  );
}

// ======================================================
// DELETE ALL RESULTS
// ======================================================

export async function deleteAllResults() {
  const snapshot = await getDocs(
    collection(db, RESULTS_COLLECTION)
  );

  for (const item of snapshot.docs) {
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
// RECALCULATION HELPERS
// ======================================================
// نسخة مبسطة من دوال تطبيع الأسئلة الموجودة في exam.js،
// مستقلة هنا عشان الملف ده ميعتمدش على صفحة تأدية الامتحان.
// ======================================================

function getResultQuestionOptions(q) {
  if (!q || typeof q !== "object") {
    return [];
  }

  if (Array.isArray(q.options)) {
    return q.options.filter(
      (op) =>
        op !== undefined &&
        op !== null &&
        String(op).trim() !== ""
    );
  }

  if (Array.isArray(q.choices)) {
    return q.choices.filter(
      (op) =>
        op !== undefined &&
        op !== null &&
        String(op).trim() !== ""
    );
  }

  const letterOptions = [
    q.A,
    q.B,
    q.C,
    q.D,
  ];

  if (
    letterOptions.some(
      (op) =>
        op !== undefined &&
        op !== null &&
        String(op).trim() !== ""
    )
  ) {
    return letterOptions.filter(
      (op) =>
        op !== undefined &&
        op !== null &&
        String(op).trim() !== ""
    );
  }

  return [];
}

function getResultRawCorrectAnswer(q) {
  if (q.correctAnswerIndex !== undefined) {
    return q.correctAnswerIndex;
  }

  if (q.correctIndex !== undefined) {
    return q.correctIndex;
  }

  if (q.rightIndex !== undefined) {
    return q.rightIndex;
  }

  if (q.correctAnswer !== undefined) {
    return q.correctAnswer;
  }

  if (q.answer !== undefined) {
    return q.answer;
  }

  if (q.correct !== undefined) {
    return q.correct;
  }

  return undefined;
}

function normalizeResultCorrectIndex(
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

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return Math.trunc(value);
  }

  const raw = String(value).trim();
  const upper = raw.toUpperCase();

  const letters = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
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
    return Number(raw) - 1;
  }

  if (/^\d+$/.test(raw)) {
    const n = Number(raw);

    if (n >= 0 && n < options.length) {
      return n;
    }
  }

  const textIndex = options.findIndex(
    (op) => String(op).trim() === raw
  );

  if (textIndex !== -1) {
    return textIndex;
  }

  return -1;
}

function isResultQuestionEssay(q) {
  const options = getResultQuestionOptions(q);

  if (options.length > 0) {
    return false;
  }

  const type = String(q.type || "")
    .toLowerCase()
    .trim();

  return (
    type.includes("essay") ||
    type.includes("مقال") ||
    type.includes("written") ||
    type.includes("text") ||
    !type
  );
}

function getResultQuestionScore(q) {
  return Number(
    q.score ||
      q.maxScore ||
      q.points ||
      q.grade ||
      1
  );
}

// ======================================================
// RECALCULATE RESULTS AFTER EXAM EDIT
// ======================================================
// بتتنادى بعد ما المعلم يحفظ تعديل على امتحان.
// بتمر على كل النتائج المرتبطة بالامتحان ده وتعيد حساب
// الدرجة بناءً على الإجابة الصحيحة/الدرجة الجديدة لكل سؤال.
//
// أسس التصميم:
// - الربط بين سؤال الطالب المحفوظ والسؤال الجديد بيتم
//   عن طريق "id" السؤال الثابت (مش الترتيب)، لأن ترتيب
//   الأسئلة وخيارات الإجابة كانت ممكن تتخلط وقت الامتحان.
// - المقارنة بتتم بنص الإجابة نفسه (مش رقم الاختيار)،
//   عشان الاختيارات كانت متبعترة (shuffle) وقت الطالب.
// - سؤال اتحذف من الامتحان: بيتشال من حساب درجة الطالب
//   (لا بيُحسب له ولا عليه).
// - سؤال جديد اتضاف بعد تسليم الطالب: مش بيتحسب على
//   الطالب ده لأنه أصلاً معندوش إجابة عليه.
// - الأسئلة المقالية: بتتحسب في المجموع الكلي، لكن من
//   غير تصحيح تلقائي (نفس منطق التصحيح وقت التسليم).
// ======================================================

export async function recalculateResultsForExam(
  examId,
  examTitle,
  updatedQuestions = []
) {
  if (!examId && !examTitle) {
    return { updated: 0 };
  }

  const questionsById = new Map();

  updatedQuestions.forEach((q) => {
    if (
      q &&
      q.id !== undefined &&
      q.id !== null
    ) {
      questionsById.set(
        String(q.id),
        q
      );
    }
  });

  if (!questionsById.size) {
    return { updated: 0 };
  }

  let snapshot = null;

  try {
    if (examId) {
      const examIdQuery = query(
        collection(db, RESULTS_COLLECTION),
        where(
          "examId",
          "==",
          String(examId)
        )
      );

      snapshot = await getDocs(
        examIdQuery
      );
    }

    if (
      (!snapshot ||
        snapshot.empty) &&
      examTitle
    ) {
      const titleQuery = query(
        collection(db, RESULTS_COLLECTION),
        where(
          "examTitle",
          "==",
          String(examTitle)
        )
      );

      snapshot = await getDocs(
        titleQuery
      );
    }
  } catch (error) {
    console.error(
      "RECALCULATE RESULTS FETCH ERROR:",
      error
    );

    return { updated: 0, error };
  }

  if (!snapshot || snapshot.empty) {
    return { updated: 0 };
  }

  let updatedCount = 0;

  for (const docItem of snapshot.docs) {
    const result = docItem.data();

    const snapshotQuestions =
      Array.isArray(result.questions)
        ? result.questions
        : [];

    const answers =
      Array.isArray(result.answers)
        ? result.answers
        : [];

    if (!snapshotQuestions.length) {
      continue;
    }

    let newScore = 0;
    let newTotal = 0;
    let touchedAnyQuestion = false;

    snapshotQuestions.forEach(
      (snapQ, index) => {

        const qId =
          snapQ &&
          snapQ.id !== undefined &&
          snapQ.id !== null
            ? String(snapQ.id)
            : null;

        if (!qId) {
          return;
        }

        const updatedQ =
          questionsById.get(qId);

        if (!updatedQ) {
          // السؤال اتحذف من الامتحان
          return;
        }

        touchedAnyQuestion = true;

        const qScore =
          getResultQuestionScore(
            updatedQ
          );

        newTotal += qScore;

        if (
          isResultQuestionEssay(
            updatedQ
          )
        ) {
          // مقالي: يُحسب في المجموع فقط
          return;
        }

        const oldOptions =
          getResultQuestionOptions(
            snapQ
          );

        const selectedIndex =
          answers[index];

        const selectedText =
          typeof selectedIndex ===
            "number" &&
          selectedIndex >= 0 &&
          oldOptions[selectedIndex] !==
            undefined
            ? String(
                oldOptions[
                  selectedIndex
                ]
              ).trim()
            : null;

        if (selectedText === null) {
          // الطالب لم يجب على هذا السؤال
          return;
        }

        const newOptions =
          getResultQuestionOptions(
            updatedQ
          );

        const newCorrectIndex =
          normalizeResultCorrectIndex(
            getResultRawCorrectAnswer(
              updatedQ
            ),
            newOptions
          );

        const newCorrectText =
          newCorrectIndex >= 0 &&
          newOptions[
            newCorrectIndex
          ] !== undefined
            ? String(
                newOptions[
                  newCorrectIndex
                ]
              ).trim()
            : null;

        if (
          newCorrectText !== null &&
          selectedText ===
            newCorrectText
        ) {
          newScore += qScore;
        }
      }
    );

    if (!touchedAnyQuestion) {
      continue;
    }

    if (
      newScore === Number(result.score) &&
      newTotal === Number(result.total)
    ) {
      continue;
    }

    const newPercentage = newTotal
      ? Math.round(
          (newScore / newTotal) * 100
        )
      : 0;

    try {
      await updateDoc(
        doc(
          db,
          RESULTS_COLLECTION,
          docItem.id
        ),
        {
          score: newScore,
          total: newTotal,
          percentage: newPercentage,
          recalculatedAt: Date.now(),
        }
      );

      updatedCount++;
    } catch (error) {
      console.error(
        "RECALCULATE RESULT UPDATE ERROR:",
        docItem.id,
        error
      );
    }
  }

  return { updated: updatedCount };
}