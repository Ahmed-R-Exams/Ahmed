// services/examService.js

import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  getDocsFromServer,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocFromServer,
  writeBatch,
  deleteField
} from "firebase/firestore";

const EXAMS_COLLECTION = "exams";
const QUESTIONS_COLLECTION = "questions";


// ======================================================
// HELPERS
// ======================================================

function normalizeExamData(
  data = {},
  firestoreId = null
) {

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
      firestoreId ||
      data.firestoreId ||
      "",

    id:
      data.id ||
      firestoreId ||
      "",

    isPublished,

    manualClose

  };

}


// ======================================================
// GET QUESTIONS
// ======================================================

async function getExamQuestions(
  firestoreId
) {

  if (!firestoreId) {
    return [];
  }

  const questionsRef =
    collection(
      db,
      EXAMS_COLLECTION,
      firestoreId,
      QUESTIONS_COLLECTION
    );

  let snapshot;

  try {

    // إجبار القراءة من السيرفر
    snapshot =
      await getDocsFromServer(
        questionsRef
      );

  }
  catch (error) {

    console.warn(
      "⚠️ SERVER QUESTIONS READ FAILED - USING NORMAL READ:",
      error
    );

    snapshot =
      await getDocs(
        questionsRef
      );

  }

  return snapshot.docs
    .map(item => ({

      firestoreId:
        item.id,

      ...item.data()

    }))
    .sort((a, b) => {

      const orderA =
        Number(a.order ?? 0);

      const orderB =
        Number(b.order ?? 0);

      return orderA - orderB;

    });

}


// ======================================================
// DELETE ALL QUESTIONS
// ======================================================

async function deleteExamQuestions(
  firestoreId
) {

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

  let snapshot;

  try {

    snapshot =
      await getDocsFromServer(
        questionsRef
      );

  }
  catch {

    snapshot =
      await getDocs(
        questionsRef
      );

  }

  if (!snapshot.size) {
    return;
  }

  let batch =
    writeBatch(db);

  let counter = 0;

  for (
    const questionDoc
    of snapshot.docs
  ) {

    batch.delete(
      questionDoc.ref
    );

    counter++;

    if (counter === 450) {

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
// CLEAN QUESTION DATA
// ======================================================

function cleanQuestionData(
  question = {},
  order = 0
) {

  const data = {
    ...question,
    order
  };

  delete data.firestoreId;

  return data;

}


// ======================================================
// SAVE QUESTIONS
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

    let questionId =
      question.firestoreId ||
      question.id ||
      "";

    if (!questionId) {

      questionId =
        doc(
          questionsRef
        ).id;

    }

    const questionRef =
      doc(
        questionsRef,
        String(questionId)
      );

    const questionData =
      cleanQuestionData(
        question,
        index
      );

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

    if (counter === 450) {

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

  console.log(
    "🔥 GET EXAMS - SERVER"
  );

  const examsRef =
    collection(
      db,
      EXAMS_COLLECTION
    );

  let snapshot;

  try {

    // ==================================================
    // أهم تعديل
    // ==================================================

    snapshot =
      await getDocsFromServer(
        examsRef
      );

  }
  catch (error) {

    console.warn(
      "⚠️ SERVER READ FAILED - USING NORMAL FIRESTORE READ:",
      error
    );

    snapshot =
      await getDocs(
        examsRef
      );

  }

  console.log(
    "🔥 FIRESTORE DOCUMENTS:",
    snapshot.docs.length
  );

  const exams =
    await Promise.all(

      snapshot.docs.map(
        async item => {

          const data =
            item.data();

          const subQuestions =
            await getExamQuestions(
              item.id
            );

          const questions =
            subQuestions.length > 0
              ? subQuestions
              : (
                  Array.isArray(
                    data.questions
                  )
                    ? data.questions
                    : []
                );

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

  console.log(
    "✅ EXAMS LOADED:",
    exams.length
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

  const questions =
    Array.isArray(
      examData.questions
    )
      ? examData.questions
      : [];

  const examDocument = {
    ...examData,

    questionsCount:
      questions.length
  };

  delete examDocument.questions;

  console.log(
    "🔥 ADD EXAM TO FIRESTORE"
  );

  const ref =
    await addDoc(
      collection(
        db,
        EXAMS_COLLECTION
      ),
      examDocument
    );

  console.log(
    "✅ EXAM DOCUMENT CREATED:",
    ref.id
  );

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

  return addExam(
    exam
  );

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
    const exam
    of exams
  ) {

    const result =
      await addExam(
        exam
      );

    saved.push(
      result
    );

  }

  return saved;

}


// ======================================================
// CREATE EXAM FROM EXCEL
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

          question:
            question.question ||
            question.text ||
            question.title ||
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

  return addExam(
    exam
  );

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

  let snap;

  try {

    snap =
      await getDocFromServer(
        doc(
          db,
          EXAMS_COLLECTION,
          id
        )
      );

  }
  catch {

    snap =
      await getDoc(
        doc(
          db,
          EXAMS_COLLECTION,
          id
        )
      );

  }

  if (!snap.exists()) {

    return null;

  }

  const data =
    snap.data();

  const subQuestions =
    await getExamQuestions(
      snap.id
    );

  const questions =
    subQuestions.length > 0
      ? subQuestions
      : (
          Array.isArray(
            data.questions
          )
            ? data.questions
            : []
        );

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

  try {

    const exam =
      await getExamByFirestoreId(
        id
      );

    if (exam) {

      return exam;

    }

  }
  catch (error) {

    console.warn(
      "Direct exam lookup failed:",
      error
    );

  }

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
    ) ||
    null
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

  const updateData = {
    ...data
  };

  delete updateData.questions;

  delete updateData.firestoreId;

  updateData.questions =
    deleteField();

  if (
    Object.prototype.hasOwnProperty.call(
      data,
      "isPublished"
    )
  ) {

    const isOpen =
      data.isPublished === true ||
      data.isPublished === "true";

    updateData.isPublished =
      isOpen;

    updateData.published =
      isOpen;

    updateData.manualClose =
      !isOpen;

  }

  if (Array.isArray(questions)) {

    updateData.questionsCount =
      questions.length;

  }

  // ====================================================
  // UPDATE MAIN DOCUMENT
  // ====================================================

  await updateDoc(
    doc(
      db,
      EXAMS_COLLECTION,
      id
    ),
    updateData
  );

  // ====================================================
  // NO QUESTIONS
  // ====================================================

  if (!Array.isArray(questions)) {

    return {

      firestoreId:
        id,

      ...updateData

    };

  }

  // ====================================================
  // QUESTIONS
  // ====================================================

  const questionsRef =
    collection(
      db,
      EXAMS_COLLECTION,
      id,
      QUESTIONS_COLLECTION
    );

  let currentSnapshot;

  try {

    currentSnapshot =
      await getDocsFromServer(
        questionsRef
      );

  }
  catch {

    currentSnapshot =
      await getDocs(
        questionsRef
      );

  }

  const currentQuestions =
    currentSnapshot.docs.map(
      item => ({

        firestoreId:
          item.id,

        ...item.data()

      })
    );

  const currentIds =
    new Set(
      currentQuestions.map(
        q =>
          String(
            q.firestoreId
          )
      )
    );

  const usedIds =
    new Set();

  const savedQuestions = [];

  let batch =
    writeBatch(db);

  let counter = 0;

  // ====================================================
  // UPDATE / CREATE QUESTIONS
  // ====================================================

  for (
    let index = 0;
    index < questions.length;
    index++
  ) {

    const question =
      questions[index];

    let questionId =
      question.firestoreId ||
      question.id ||
      "";

    if (
      !questionId ||
      !currentIds.has(
        String(questionId)
      )
    ) {

      const oldByIndex =
        currentQuestions[index];

      if (
        oldByIndex &&
        !usedIds.has(
          String(
            oldByIndex.firestoreId
          )
        )
      ) {

        questionId =
          oldByIndex.firestoreId;

      }

    }

    if (
      !questionId ||
      usedIds.has(
        String(questionId)
      )
    ) {

      questionId =
        doc(
          questionsRef
        ).id;

    }

    questionId =
      String(
        questionId
      );

    usedIds.add(
      questionId
    );

    const questionRef =
      doc(
        questionsRef,
        questionId
      );

    const questionData =
      cleanQuestionData(
        question,
        index
      );

    batch.set(
      questionRef,
      questionData
    );

    savedQuestions.push({

      ...questionData,

      firestoreId:
        questionId

    });

    counter++;

    if (counter === 450) {

      await batch.commit();

      batch =
        writeBatch(db);

      counter = 0;

    }

  }

  // ====================================================
  // DELETE REMOVED QUESTIONS
  // ====================================================

  for (
    const oldQuestion
    of currentQuestions
  ) {

    const oldId =
      String(
        oldQuestion.firestoreId
      );

    if (
      !usedIds.has(oldId)
    ) {

      batch.delete(
        doc(
          questionsRef,
          oldId
        )
      );

      counter++;

      if (counter === 450) {

        await batch.commit();

        batch =
          writeBatch(db);

        counter = 0;

      }

    }

  }

  if (counter > 0) {

    await batch.commit();

  }

  console.log(
    "✅ UPDATE EXAM COMPLETE:",
    id,
    "questions:",
    savedQuestions.length
  );

  return {

    firestoreId:
      id,

    ...updateData,

    questions:
      savedQuestions,

    questionsCount:
      savedQuestions.length

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

  await deleteExamQuestions(
    id
  );

  await deleteDoc(
    doc(
      db,
      EXAMS_COLLECTION,
      id
    )
  );

}