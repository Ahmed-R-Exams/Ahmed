// services/fileService.js

import { db, storage } from "../firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";


const FILES_COLLECTION = "files";



// ================= GET FILES =================

export async function getFiles(){

try{


const snapshot =
await getDocs(
collection(
db,
FILES_COLLECTION
)
);



return snapshot.docs.map(item=>({

firestoreId:item.id,

id:item.id,

...item.data()

}));



}
catch(error){

console.error(
"GET FILES ERROR",
error
);


return [];

}


}





// ================= ADD FILE =================

export async function addFile(
fileData,
file
){


const storageRef =
ref(
storage,
`files/${Date.now()}_${file.name}`
);



await uploadBytes(
storageRef,
file
);



const url =
await getDownloadURL(
storageRef
);




const docRef =
await addDoc(
collection(
db,
FILES_COLLECTION
),
{


...fileData,


name:
fileData.name || file.name,


url,


fileUrl:url,


storagePath:
storageRef.fullPath,


created:
new Date().toISOString()


}

);



return {

id:docRef.id,

url

};


}







// ================= DELETE FILE =================

export async function deleteFile(file){


try{


if(file.storagePath){


const storageRef =
ref(
storage,
file.storagePath
);



await deleteObject(
storageRef
)
.catch(()=>{});


}



await deleteDoc(
doc(
db,
FILES_COLLECTION,
file.firestoreId || file.id
)
);



}
catch(error){

console.error(
"DELETE FILE ERROR",
error
);


throw error;


}


}







// ================= GET BY CLASS =================

export async function getFilesByClass(
className
){


const files =
await getFiles();



return files.filter(
file =>

file.class === className
||
file.className === className

);


}