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