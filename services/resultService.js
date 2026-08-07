// services/resultService.js

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



// ================= SAVE RESULT =================

export async function saveResult(result = {}) {


  const data = {

    ...result,

    createdAt:
      Date.now()

  };



  console.log(
    "TRY SAVE RESULT",
    data
  );



  try {


    const ref =
      await addDoc(

        collection(
          db,
          RESULTS_COLLECTION
        ),

        data

      );



    console.log(
      "RESULT SAVED ID:",
      ref.id
    );



    return {

      id: ref.id,

      ...data

    };



  } catch(error) {


    console.error(
      "SAVE RESULT ERROR:",
      error
    );


    throw error;


  }

}





// ================= GET RESULTS =================

export async function getResults(){


  try {



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



    const results =
      snapshot.docs.map(

        item => ({

          id:item.id,

          ...item.data()

        })

      );



    console.log(
      "RESULTS FROM FIREBASE:",
      results
    );



    return results;



  } catch(error) {


    console.error(
      "GET RESULTS ERROR:",
      error
    );


    return [];


  }


}





// ================= GET ONE RESULT =================

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



  const item =
    snapshot.docs.find(

      d =>
      d.id === id

    );



  if(!item)
  return null;



  return {

    id:item.id,

    ...item.data()

  };


}





// ================= UPDATE RESULT =================

export async function updateResult(
id,
data = {}
){


  if(!id)
  return;



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





// ================= DELETE RESULT =================

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





// ================= DELETE ALL RESULTS =================

export async function deleteAllResults(){


  const snapshot =
    await getDocs(

      collection(

        db,

        RESULTS_COLLECTION

      )

    );



  const deletes =
    snapshot.docs.map(

      item =>

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