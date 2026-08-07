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



// جلب كل الامتحانات
export async function getExams(){

  const snapshot = await getDocs(
    collection(db, EXAMS_COLLECTION)
  );


  return snapshot.docs.map(item => ({
    firestoreId: item.id,
    id: item.data().id || item.id,
    ...item.data()
  }));

}



// إضافة امتحان
export async function addExam(examData = {}){


  const ref = await addDoc(
    collection(db, EXAMS_COLLECTION),
    examData
  );


  return {
    firestoreId: ref.id,
    ...examData
  };

}



// حفظ امتحان
export async function saveExam(exam){

  return addExam(exam);

}



// حفظ مجموعة امتحانات
export async function saveExams(){

  return true;

}



// استيراد من Excel
export async function createExamFromExcel(excelData){

  const exams = Array.isArray(excelData)
    ? excelData
    : [excelData];


  for(const exam of exams){

    await addExam(exam);

  }


  return getExams();

}



// جلب امتحان بـ Firestore ID
export async function getExamByFirestoreId(id){


  if(!id)
    return null;


  const snap = await getDoc(
    doc(
      db,
      EXAMS_COLLECTION,
      id
    )
  );


  if(!snap.exists())
    return null;



  return {
    firestoreId: snap.id,
    ...snap.data()
  };

}



// جلب امتحان
export async function getExamById(id){


  const exams = await getExams();


  return (

    exams.find(
      e =>
        e.firestoreId === id ||
        e.id == id ||
        e.title === id
    )

    || null

  );

}



// تعديل امتحان
export async function updateExam(id, data){


  await updateDoc(

    doc(
      db,
      EXAMS_COLLECTION,
      id
    ),

    data

  );

}



// حذف امتحان
export async function deleteExam(id){


  await deleteDoc(

    doc(
      db,
      EXAMS_COLLECTION,
      id
    )

  );

}