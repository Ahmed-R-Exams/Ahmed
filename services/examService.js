// services/examService.js

import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  writeBatch
} from "firebase/firestore";

const EXAMS_COLLECTION = "exams";
const QUESTIONS_COLLECTION = "questions";


// ======================================================
// HELPERS
// ======================================================

function normalizeExamData(data = {}, firestoreId = null) {

  const isPublished =
    data.isPublished === false ||
    data.isPublished === "false"
      ? false
      : true;

  const manualClose =
    data.manualClose === true ||
    data.manualClose === "true";

  return {

    ...data,

    firestoreId:
      firestoreId || data.firestoreId || "",

    id:
      data.id ||
      firestoreId ||
      "",

    isPublished,

    manualClose

  };

}


// ======================================================
// GET QUESTIONS FROM SUBCOLLECTION
// ======================================================

async function getExamQuestions(firestoreId) {

  if (!firestoreId) {
    return [];
  }

  try {

    const questionsRef =
      collection(
        db,
        EXAMS_COLLECTION,
        firestoreId,
        QUESTIONS_COLLECTION
      );

    const snapshot =
      await getDocs(questionsRef);

    return snapshot.docs
      .map(item => {

        return {

          firestoreId:
            item.id,

          ...item.data()

        };

      })
      .sort((a, b) => {

        const orderA =
          Number(a.order ?? 0);

        const orderB =
          Number(b.order ?? 0);

        return orderA - orderB;

      });

  } catch (error) {

    console.error(
      "خطأ أثناء تحميل أسئلة الامتحان:",
      error
    );

    return [];

  }

}


// ======================================================
// DELETE ALL QUESTIONS
// ======================================================

async function deleteExamQuestions(firestoreId) {

  if (!firestoreId) {
    return;
  }

  const questionsRef =
    collection(
      db,
      EXAMS_COLLECTION,
      firestoreId,
      QUESTIONS_COLLECTION
    );

  const snapshot =
    await getDocs(questionsRef);

  if (!snapshot.size) {
    return;
  }


  // Firestore Batch maximum = 500 operations
  let batch =
    writeBatch(db);

  let counter = 0;


  for (const questionDoc of snapshot.docs) {

    batch.delete(questionDoc.ref);

    counter++;


    if (counter === 500) {

      await batch.commit();

      batch =
        writeBatch(db);

      counter = 0;

    }

  }


  if (counter > 0) {

    await batch.commit();

  }

}


// ======================================================
// SAVE QUESTIONS AS SUBCOLLECTION
// ======================================================

async function saveExamQuestions(
  firestoreId,
  questions = []
) {

  if (
    !firestoreId ||
    !Array.isArray(questions)
  ) {

    return [];

  }


  const questionsRef =
    collection(
      db,
      EXAMS_COLLECTION,
      firestoreId,
      QUESTIONS_COLLECTION
    );


  const savedQuestions = [];


  // Firestore batch maximum 500 writes
  let batch =
    writeBatch(db);

  let counter = 0;


  for (
    let index = 0;
    index < questions.length;
    index++
  ) {

    const question =
      questions[index];


    const questionId =
      question.firestoreId ||
      question.id ||
      `question-${index + 1}`;


    const questionRef =
      doc(
        questionsRef,
        String(questionId)
      );


    const questionData = {

      ...question,

      firestoreId:
        undefined,

      order:
        index

    };


    // حذف الحقل undefined
    delete questionData.firestoreId;


    batch.set(
      questionRef,
      questionData
    );


    savedQuestions.push({

      ...questionData,

      firestoreId:
        questionRef.id

    });


    counter++;


    if (counter === 500) {

      await batch.commit();

      batch =
        writeBatch(db);

      counter = 0;

    }

  }


  if (counter > 0) {

    await batch.commit();

  }


  return savedQuestions;

}


// ======================================================
// GET ALL EXAMS
// ======================================================

export async function getExams() {

  const snapshot =
    await getDocs(
      collection(
        db,
        EXAMS_COLLECTION
      )
    );


  const exams =
    await Promise.all(

      snapshot.docs.map(
        async item => {

          const data =
            item.data();


          let questions = [];


          // ==================================================
          // NEW SYSTEM
          // Questions stored in subcollection
          // ==================================================

          if (
            !Array.isArray(data.questions)
          ) {

            questions =
              await getExamQuestions(
                item.id
              );

          }


          // ==================================================
          // OLD SYSTEM
          // Keep compatibility with existing exams
          // ==================================================

          else {

            questions =
              data.questions;

          }


          return {

            ...normalizeExamData(
              data,
              item.id
            ),

            questions,

            questionsCount:
              Number(
                data.questionsCount
              ) ||
              questions.length

          };

        }
      )

    );


  return exams;

}


// ======================================================
// ADD EXAM
// ======================================================

export async function addExam(
  examData = {}
) {

  if (
    !examData ||
    typeof examData !== "object"
  ) {

    throw new Error(
      "بيانات الامتحان غير صحيحة."
    );

  }


  // ==================================================
  // استخراج الأسئلة خارج Document الامتحان
  // ==================================================

  const questions =
    Array.isArray(
      examData.questions
    )
      ? examData.questions
      : [];


  // لا تحفظ questions داخل exam document
  const examDocument = {

    ...examData,

    questionsCount:
      questions.length

  };


  delete examDocument.questions;


  // ==================================================
  // إنشاء Exam Document
  // ==================================================

  const ref =
    await addDoc(
      collection(
        db,
        EXAMS_COLLECTION
      ),
      examDocument
    );


  // ==================================================
  // حفظ الأسئلة في Subcollection
  // ==================================================

  if (questions.length > 0) {

    await saveExamQuestions(
      ref.id,
      questions
    );

  }


  return {

    firestoreId:
      ref.id,

    ...examDocument,

    questions,

    questionsCount:
      questions.length

  };

}


// ======================================================
// SAVE EXAM
// ======================================================

export async function saveExam(
  exam
) {

  return addExam(exam);

}


// ======================================================
// SAVE EXAMS
// ======================================================

export async function saveExams(
  exams = []
) {

  if (!Array.isArray(exams)) {

    return [];

  }


  const saved = [];


  for (
    const exam of exams
  ) {

    const result =
      await addExam(exam);

    saved.push(result);

  }


  return saved;

}


// ======================================================
// CREATE ONE EXAM FROM EXCEL
// ======================================================

export async function createExamFromExcel(
  excelData
) {

  if (!excelData) {

    throw new Error(
      "بيانات Excel غير موجودة."
    );

  }


  let examData = {};
  let questions = [];


  // ==================================================
  // Excel data already converted
  // ==================================================

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


  // ==================================================
  // Backward compatibility
  // array = questions
  // ==================================================

  else if (
    Array.isArray(excelData)
  ) {

    questions =
      excelData;

  }


  if (!questions.length) {

    throw new Error(
      "لا توجد أسئلة صالحة في ملف Excel."
    );

  }


  // ==================================================
  // NORMALIZE QUESTIONS
  // ==================================================

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
            question.question ||
            "",

          title:
            question.title ||
            question.text ||
            question.question ||
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


  // ==================================================
  // CREATE ONE EXAM
  // ==================================================

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


  // ==================================================
  // SAVE
  // addExam الآن يفصل questions تلقائيًا
  // ==================================================

  const saved =
    await addExam(exam);


  return saved;

}


// ======================================================
// GET EXAM BY FIRESTORE ID
// ======================================================

export async function getExamByFirestoreId(
  id
) {

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


  const data =
    snap.data();


  let questions = [];


  // ==================================================
  // NEW SYSTEM
  // ==================================================

  if (
    !Array.isArray(
      data.questions
    )
  ) {

    questions =
      await getExamQuestions(
        snap.id
      );

  }


  // ==================================================
  // OLD SYSTEM
  // ==================================================

  else {

    questions =
      data.questions;

  }


  return {

    firestoreId:
      snap.id,

    ...normalizeExamData(
      data,
      snap.id
    ),

    questions,

    questionsCount:
      Number(
        data.questionsCount
      ) ||
      questions.length

  };

}


// ======================================================
// GET EXAM BY ID
// ======================================================

export async function getExamById(
  id
) {

  if (!id) {

    return null;

  }


  // ==================================================
  // DIRECT FIRESTORE ID
  // ==================================================

  try {

    const snap =
      await getDoc(
        doc(
          db,
          EXAMS_COLLECTION,
          id
        )
      );


    if (snap.exists()) {

      return getExamByFirestoreId(
        snap.id
      );

    }

  } catch (error) {

    console.warn(
      "Direct exam lookup failed:",
      error
    );

  }


  // ==================================================
  // FALLBACK
  // ==================================================

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


// ======================================================
// UPDATE EXAM
// ======================================================

export async function updateExam(
  id,
  data
) {

  if (!id) {

    throw new Error(
      "Exam ID is required."
    );

  }


  if (
    !data ||
    typeof data !== "object"
  ) {

    throw new Error(
      "Exam data is required."
    );

  }


  // ==================================================
  // QUESTIONS
  // ==================================================

  const hasQuestions =
    Object.prototype.hasOwnProperty.call(
      data,
      "questions"
    );


  const questions =
    hasQuestions &&
    Array.isArray(
      data.questions
    )
      ? data.questions
      : null;


  // ==================================================
  // DOCUMENT DATA
  // ==================================================

  let updateData = {

    ...data

  };


  // لا تحفظ questions داخل Exam Document
  delete updateData.questions;


  // ==================================================
  // تحديث حالة الفتح / الغلق
  // ==================================================

  if (
    Object.prototype.hasOwnProperty.call(
      data,
      "isPublished"
    )
  ) {

    const isOpen =
      data.isPublished === true ||
      data.isPublished === "true";


    updateData = {

      ...updateData,

      isPublished:
        isOpen,

      manualClose:
        !isOpen

    };

  }


  // ==================================================
  // تحديث عدد الأسئلة
  // ==================================================

  if (
    Array.isArray(
      questions
    )
  ) {

    updateData.questionsCount =
      questions.length;

  }


  // ==================================================
  // UPDATE EXAM DOCUMENT
  // ==================================================

  await updateDoc(
    doc(
      db,
      EXAMS_COLLECTION,
      id
    ),
    updateData
  );


  // ==================================================
  // UPDATE QUESTIONS
  // ==================================================

  if (
    Array.isArray(
      questions
    )
  ) {

    await deleteExamQuestions(
      id
    );


    await saveExamQuestions(
      id,
      questions
    );

  }


  // ==================================================
  // RETURN
  // ==================================================

  return {

    firestoreId:
      id,

    ...updateData,

    ...(Array.isArray(questions)
      ? {
          questions
        }
      : {})

  };

}


// ======================================================
// DELETE EXAM
// ======================================================

export async function deleteExam(
  id
) {

  if (!id) {

    throw new Error(
      "Exam ID is required."
    );

  }


  // ==================================================
  // DELETE QUESTIONS FIRST
  // ==================================================

  await deleteExamQuestions(
    id
  );


  // ==================================================
  // DELETE EXAM DOCUMENT
  // ==================================================

  await deleteDoc(
    doc(
      db,
      EXAMS_COLLECTION,
      id
    )
  );

}