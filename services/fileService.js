// ================= FILE SERVICE =================


const STORAGE_KEY = "ahmedR_files";




// ================= GET FILES =================

export function getFiles(){


const data =
localStorage.getItem(
STORAGE_KEY
);



if(!data){

return [];

}



return JSON.parse(data);


}






// ================= SAVE FILES =================

export function saveFiles(files){


localStorage.setItem(

STORAGE_KEY,

JSON.stringify(files)

);


}







// ================= ADD FILE =================

export function addFile(file){


const files =
getFiles();



files.push({

id:
Date.now(),


name:
file.name,


class:
file.class,


type:
file.type || "file",


url:
file.url,


created:
new Date().toISOString()


});



saveFiles(files);


}







// ================= DELETE FILE =================

export function deleteFile(id){


const files =
getFiles()
.filter(
file =>
file.id !== id
);



saveFiles(files);


}







// ================= GET BY CLASS =================

export function getFilesByClass(className){


return getFiles()
.filter(

file =>
file.class === className

);


}







// ================= SORT =================

export function sortFilesByName(){


return getFiles()
.sort(

(a,b)=>
a.name.localeCompare(b.name)

);


}