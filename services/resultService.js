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

    // IMPORTANT:
    // Firestore ID هو المصدر الوحيد للـ id
    id: firestoreId,

    firestoreId: firestoreId
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

  // لا نعتمد على id الموجود داخل object
  // لأن Firestore سيعطي document ID جديد.

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

  } catch (error) {

    console.error(
      "GET RESULTS ERROR:",
      error
    );

    return [];
  }
}


// ======================================================
// GET RESULT BY FIRESTORE ID
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

  } catch (error) {

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

  } catch (error) {

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
// QUESTION HELPERS
// ======================================================

function getResultQuestionOptions(
  q
) {

  if (
    !q ||
    typeof q !== "object"
  ) {

    return [];
  }

  if (
    Array.isArray(q.options)
  ) {

    return q.options;
  }

  if (
    Array.isArray(q.choices)
  ) {

    return q.choices;
  }

  return [];
}


// ======================================================
// RECALCULATE RESULTS
// ======================================================

export async function recalculateResultsForExam(
  examId,
  examQuestions = [],
  examTitle = ""
) {

  if (
    !examId &&
    !examTitle
  ) {

    return {
      updated: 0
    };
  }

  if (
    !Array.isArray(
      examQuestions
    ) ||
    !examQuestions.length
  ) {

    return {
      updated: 0
    };
  }

  const questionsById =
    new Map();

  examQuestions.forEach(
    q => {

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

      if (
        q &&
        q.firestoreId !== undefined &&
        q.firestoreId !== null
      ) {

        questionsById.set(
          String(
            q.firestoreId
          ),
          q
        );
      }
    }
  );

  if (
    !questionsById.size
  ) {

    return {
      updated: 0
    };
  }

  let snapshot =
    null;

  try {

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

  } catch (error) {

    console.error(
      "RECALCULATE RESULTS FETCH ERROR:",
      error
    );

    return {
      updated: 0
    };
  }

  if (
    !snapshot ||
    snapshot.empty
  ) {

    return {
      updated: 0
    };
  }

  let updated = 0;

  for (
    const item
    of snapshot.docs
  ) {

    const result =
      normalizeResult(
        item.id,
        item.data()
      );

    const answers =
      Array.isArray(
        result.answers
      )
        ? result.answers
        : [];

    let score = 0;
    let total = 0;

    examQuestions.forEach(
      (q, index) => {

        const type =
          String(
            q?.type || ""
          ).toLowerCase();

        if (
          type.includes("essay")
        ) {

          const max =
            Number(
              q.maxScore ||
              q.grade ||
              q.points ||
              1
            );

          total += max;

          const essayGrade =
            Number(
              result.essayGrades?.[
                index
              ] || 0
            );

          score +=
            Math.max(
              0,
              Math.min(
                essayGrade,
                max
              )
            );

          return;
        }

        const qScore =
          Number(
            q?.score || 1
          );

        total += qScore;

        const studentAnswer =
          Number(
            answers[index]
          );

        const correctAnswer =
          Number(
            q?.correctAnswerIndex ??
            q?.correctAnswer ??
            q?.rightIndex
          );

        if (
          Number.isFinite(
            studentAnswer
          ) &&
          Number.isFinite(
            correctAnswer
          ) &&
          studentAnswer ===
            correctAnswer
        ) {

          score += qScore;
        }
      }
    );

    try {

      await updateDoc(
        doc(
          db,
          RESULTS_COLLECTION,
          item.id
        ),
        {
          score,
          total
        }
      );

      updated++;

    } catch (error) {

      console.error(
        "UPDATE RESULT ERROR:",
        item.id,
        error
      );
    }
  }

  return {
    updated
  };
}