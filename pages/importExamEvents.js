import {
  readExcelFile,
  convertExcelQuestions
} from "../services/excelService.js";


import {
  createExamFromExcel
} from "../services/examService.js";


import {
  manageExamsPage
} from "./manageExams.js";


import {
  manageExamsEvents
} from "./manageExamsEvents.js";



// ================= IMPORT EXCEL =================

export function importExamEvents(){


const input =
document.getElementById(
"excelFile"
);


if(!input)
return;



input.onchange =
async()=>{


const file =
input.files[0];


if(!file)
return;



try{


const rows =
await readExcelFile(file);



const questions =
convertExcelQuestions(rows);



if(!questions.length){

alert(
"No Questions Found In Excel"
);

return;

}



const title =
file.name
.replace(
/\.(xlsx|xls)$/i,
""
);



createExamFromExcel(
title,
questions
);



alert(
"Excel Imported Successfully ✅"
);



document.querySelector("#app")
.innerHTML =
manageExamsPage();



manageExamsEvents();



}
catch(error){


console.error(error);


alert(
"Excel Import Error ❌"
);


}


};


}