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



function normalizeQuestion(q = {}) {

  const correct =
    q.correctAnswerIndex ??
    q.correctIndex ??
    q.rightIndex ??
    q.correctAnswer ??
    q.answer ??
    0;


  return {

    question:
      q.question ||
      q.text ||
      "",


    text:
      q.text ||
      q.question ||
      "",


    image:
      q.image ||
      q.questionImage ||
      "",


    questionImage:
      q.questionImage ||
      q.image ||
      "",



    options:
      Array.isArray(q.options)
        ? q.options
        : [],



    correctIndex:
      Number(correct),


    correctAnswerIndex:
      Number(correct),


    answer:
      Number(correct),



    type:
      q.type ||
      "mcq",



    score:
      Number(q.score) ||
      1,



    maxScore:
      Number(q.maxScore) ||
      Number(q.points) ||
      Number(q.grade) ||
      Number(q.score) ||
      1,


    studentAnswer:
      q.studentAnswer ||
      ""

  };

}





export async function getExams() {

  const snapshot =
    await getDocs(
      collection(
        db,
        EXAMS_COLLECTION
      )
    );


  return snapshot.docs.map(item => ({

    firestoreId:
      item.id,


    ...item.data()

  }));

}





export async function getExamByFirestoreId(id){

  if(!id)
    return null;


  const snap =
    await getDoc(

      doc(
        db,
        EXAMS_COLLECTION,
        id
      )

    );


  if(!snap.exists())
    return null;


  return {

    firestoreId:
      snap.id,

    ...snap.data()

  };

}





export async function saveExams() {

  return true;

}





export async function addExam(newExam = {}) {


  const exam = {


    ...newExam,



    id:
      newExam.id ||
      Date.now(),



    title:
      newExam.title ||
      "",



    subject:
      newExam.subject ||
      "physics",



    className:
      newExam.className ||
      newExam.grade ||
      "الصف الأول الثانوي",



    grade:
      newExam.grade ||
      newExam.className ||
      "الصف الأول الثانوي",



    duration:
      Number(newExam.duration) ||
      Number(newExam.examTime) ||
      30,



    examTime:
      Number(newExam.examTime) ||
      Number(newExam.duration) ||
      30,



    passingScore:
      Number(newExam.passingScore) ||
      50,



    startDate:
      newExam.startDate ||
      "",



    endDate:
      newExam.endDate ||
      "",



    manualClose:
      Boolean(
        newExam.manualClose
      ),



    isPublished:
      newExam.isPublished !== false,



    questions:
      Array.isArray(newExam.questions)

        ? newExam.questions.map(
            normalizeQuestion
          )

        : []

  };



  const ref =
    await addDoc(

      collection(
        db,
        EXAMS_COLLECTION
      ),

      exam

    );



  return {

    firestoreId:
      ref.id,

    ...exam

  };

}





export async function saveExam(exam){

  return addExam(exam);

}





export async function createExamFromExcel(excelData){


  const imported =
    Array.isArray(excelData)

      ? excelData

      : [excelData];



  for(
    const exam of imported
  ){

    await addExam(exam);

  }



  return getExams();

}





export async function getExamById(idOrTitle){


  const exams =
    await getExams();



  return (

    exams.find(

      e =>

        e.id == idOrTitle ||

        e.title === idOrTitle ||

        e.firestoreId === idOrTitle

    )

    ||

    null

  );

}





export async function updateExam(
  idOrTitle,
  updatedExamData = {}
){


  const exams =
    await getExams();



  const oldExam =
    exams.find(

      e =>

        e.id == idOrTitle ||

        e.title === idOrTitle ||

        e.firestoreId === idOrTitle

    );



  if(!oldExam)
    return null;




  const updatedExam = {


    ...oldExam,


    ...updatedExamData,



    id:
      oldExam.id,



    questions:

      Array.isArray(
        updatedExamData.questions
      )

      ?

      updatedExamData.questions.map(
        normalizeQuestion
      )

      :

      oldExam.questions,



    className:

      updatedExamData.className ||

      updatedExamData.grade ||

      oldExam.className,



    grade:

      updatedExamData.grade ||

      updatedExamData.className ||

      oldExam.grade,



    duration:

      Number(
        updatedExamData.duration
      )

      ||

      Number(
        updatedExamData.examTime
      )

      ||

      oldExam.duration,



    examTime:

      Number(
        updatedExamData.examTime
      )

      ||

      Number(
        updatedExamData.duration
      )

      ||

      oldExam.examTime

  };



  await updateDoc(

    doc(

      db,

      EXAMS_COLLECTION,

      oldExam.firestoreId

    ),

    updatedExam

  );



  return updatedExam;

}





export async function deleteExam(idOrTitle){


  const exams =
    await getExams();



  const exam =
    exams.find(

      e =>

        e.id == idOrTitle ||

        e.title === idOrTitle ||

        e.firestoreId === idOrTitle

    );



  if(!exam)
    return;



  await deleteDoc(

    doc(

      db,

      EXAMS_COLLECTION,

      exam.firestoreId

    )

  );

}