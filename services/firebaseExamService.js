import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where
  } from "firebase/firestore";
  
  import { db } from "../Firebase";
  
  const examsRef = collection(db, "exams");
  
  export async function getExams() {
    const snapshot = await getDocs(examsRef);
  
    return snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data()
    }));
  }
  
  export async function addExam(exam) {
    const docRef = await addDoc(examsRef, exam);
  
    return {
      id: docRef.id,
      ...exam
    };
  }
  
  export async function updateExam(id, data) {
    const ref = doc(db, "exams", id);
  
    await updateDoc(ref, data);
  }
  
  export async function deleteExam(id) {
    const ref = doc(db, "exams", id);
  
    await deleteDoc(ref);
  }
  
  export async function getExamById(id) {
    const ref = doc(db, "exams", id);
  
    const snap = await getDoc(ref);
  
    if (!snap.exists()) return null;
  
    return {
      id: snap.id,
      ...snap.data()
    };
  }
  
  export async function getExamsBySubject(subject) {
    const q = query(
      examsRef,
      where("subject", "==", subject)
    );
  
    const snapshot = await getDocs(q);
  
    return snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data()
    }));
  }