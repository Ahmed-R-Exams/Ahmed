// services/examService.js

import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from "firebase/firestore";

const EXAMS_COLLECTION = "exams";


// ================= GET ALL EXAMS =================

export async function getExams() {

  const snapshot = await getDocs(
    collection(db, EXAMS_COLLECTION)
  );

  return snapshot.docs.map(item => {

    const data = item.data();

    return {
      firestoreId: item.id,
      id: data.id || item.id,
      ...data
    };

  });

}


// ================= ADD EXAM =================

export async function addExam(examData = {}) {

  const ref = await addDoc(
    collection(db, EXAMS_COLLECTION),
    examData
  );

  return {
    firestoreId: ref.id,
    ...examData
  };

}


// ================= SAVE EXAM =================

export async function saveExam(exam) {

  return addExam(exam);

}


// ================= SAVE EXAMS =================

export async function saveExams(exams = []) {

  if (!Array.isArray(exams)) {
    return [];
  }

  const saved = [];

  for (const exam of exams) {

    const result =
      await addExam(exam);

    saved.push(result);

  }

  return saved;

}


// ======================================================
// CREATE ONE EXAM FROM EXCEL
// ======================================================

export async function createExamFromExcel(excelData) {

  if (!excelData) {
    throw new Error(
      "بيانات Excel غير موجودة."
    );
  }


  let examData = {};
  let questions = [];


  // ----------------------------------------------------
  // Excel data already converted
  // ----------------------------------------------------

  if (
    !Array.isArray(excelData) &&
    typeof excelData === "object"
  ) {

    examData =
      excelData.exam || {};

    questions =
      Array.isArray(
        excelData.questions
      )
        ? excelData.questions
        : [];

  }


  // ----------------------------------------------------
  // Backward compatibility:
  // array = questions
  // ----------------------------------------------------

  else if (
    Array.isArray(excelData)
  ) {

    questions = excelData;

  }


  if (!questions.length) {

    throw new Error(
      "لا توجد أسئلة صالحة في ملف Excel."
    );

  }


  // ----------------------------------------------------
  // Normalize questions
  // ----------------------------------------------------

  questions =
    questions.map(
      (question, index) => {

        const options =
          Array.isArray(
            question.options
          )
            ? question.options
            : [
                question.A || "",
                question.B || "",
                question.C || "",
                question.D || ""
              ];


        let correctIndex =
          Number(
            question.correctAnswerIndex
          );


        if (
          !Number.isInteger(
            correctIndex
          ) ||
          correctIndex < 0 ||
          correctIndex > 3
        ) {

          correctIndex =
            Number(
              question.correctIndex
            );

        }


        if (
          !Number.isInteger(
            correctIndex
          ) ||
          correctIndex < 0 ||
          correctIndex > 3
        ) {

          correctIndex = 0;

        }


        return {

          id:
            question.id ||
            `${Date.now()}-${index}`,

          text:
            question.text ||
            question.title ||
            "",

          title:
            question.title ||
            question.text ||
            "",

          image:
            question.image ||
            "",

          options,

          correctAnswerIndex:
            correctIndex,

          correctIndex,

          answer:
            options[correctIndex] || "",

          type:
            question.type ||
            "mcq",

          points:
            Number(
              question.points
            ) || 1

        };

      }
    );


  // ----------------------------------------------------
  // Create ONE exam
  // ----------------------------------------------------

  const exam = {

    id:
      examData.id ||
      `excel-${Date.now()}`,

    title:
      examData.title ||
      `امتحان مستورد ${new Date().toLocaleDateString("ar-EG")}`,

    subject:
      examData.subject ||
      "physics",

    className:
      examData.className ||
      examData.grade ||
      "الصف الأول الثانوي",

    grade:
      examData.grade ||
      examData.className ||
      "الصف الأول الثانوي",

    duration:
      Number(
        examData.duration
      ) || 60,

    passingScore:
      Number(
        examData.passingScore
      ) || 50,

    startDate:
      examData.startDate ||
      "",

    endDate:
      examData.endDate ||
      "",

    manualClose:
      examData.manualClose === true ||
      examData.manualClose === "true",

    isPublished:
      examData.isPublished !== false &&
      examData.isPublished !== "false",

    questionsCount:
      questions.length,

    questions,

    createdAt:
      new Date().toISOString(),

    source:
      "excel"

  };


  // ----------------------------------------------------
  // SAVE ONE DOCUMENT ONLY
  // ----------------------------------------------------

  const saved =
    await addExam(exam);


  return saved;

}


// ================= GET EXAM BY FIRESTORE ID =================

export async function getExamByFirestoreId(id) {

  if (!id) {
    return null;
  }

  const snap =
    await getDoc(
      doc(
        db,
        EXAMS_COLLECTION,
        id
      )
    );


  if (!snap.exists()) {
    return null;
  }


  return {

    firestoreId:
      snap.id,

    ...snap.data()

  };

}


// ================= GET EXAM BY ID =================

export async function getExamById(id) {

  if (!id) return null;

  // محاولة القراءة المباشرة أولاً (أسرع وأرخص من تحميل كل الامتحانات)
  try {

    const snap = await getDoc(doc(db, EXAMS_COLLECTION, id));

    if (snap.exists()) {
      return {
        firestoreId: snap.id,
        ...snap.data(),
      };
    }

  } catch (error) {
    // id قد لا يكون Firestore doc id صالح (مثلاً id قديم أو عنوان الامتحان)
    // نكمل بالبحث اليدوي بالأسفل بدل رمي الخطأ
  }

  // fallback: بحث يدوي (لدعم المعرفات القديمة أو البحث بعنوان الامتحان)
  const exams =
    await getExams();


  return (

    exams.find(
      exam =>
        String(
          exam.firestoreId
        ) === String(id) ||

        String(
          exam.id
        ) === String(id) ||

        exam.title === id
    )

    || null

  );

}


// ================= UPDATE EXAM =================

export async function updateExam(
  id,
  data
) {

  if (!id) {
    throw new Error(
      "Exam ID is required."
    );
  }


  await updateDoc(
    doc(
      db,
      EXAMS_COLLECTION,
      id
    ),
    data
  );

}


// ================= DELETE EXAM =================

export async function deleteExam(id) {

  if (!id) {
    throw new Error(
      "Exam ID is required."
    );
  }


  await deleteDoc(
    doc(
      db,
      EXAMS_COLLECTION,
      id
    )
  );

}