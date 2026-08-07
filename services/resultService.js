import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc
} from "firebase/firestore";


const RESULTS_COLLECTION = "results";



export async function saveResult(result = {}) {

  const data = {

    ...result,

    createdAt:
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


  return {

    id: ref.id,

    ...data

  };

}




export async function getResults(){

  const q =
    query(

      collection(
        db,
        RESULTS_COLLECTION
      ),

      orderBy(
        "createdAt",
        "desc"
      )

    );



  const snapshot =
    await getDocs(q);



  return snapshot.docs.map(item => ({

    id: item.id,

    ...item.data()

  }));

}





export async function getResultById(id){

  if(!id)
    return null;



  const snapshot =
    await getDocs(

      collection(
        db,
        RESULTS_COLLECTION
      )

    );



  const result =
    snapshot.docs.find(
      item =>
        item.id === id
    );



  if(!result)
    return null;



  return {

    id: result.id,

    ...result.data()

  };

}





export async function updateResult(
  id,
  data = {}
){

  if(!id)
    return null;



  await updateDoc(

    doc(
      db,
      RESULTS_COLLECTION,
      id
    ),

    data

  );



  return {

    id,

    ...data

  };

}





export async function deleteResult(id){

  if(!id)
    return;



  await deleteDoc(

    doc(
      db,
      RESULTS_COLLECTION,
      id
    )

  );

}





export async function deleteAllResults(){

  const snapshot =
    await getDocs(

      collection(
        db,
        RESULTS_COLLECTION
      )

    );



  const deletes =
    snapshot.docs.map(item =>

      deleteDoc(

        doc(
          db,
          RESULTS_COLLECTION,
          item.id
        )

      )

    );



  await Promise.all(
    deletes
  );

}