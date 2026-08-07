import {
examsListPage,
loadExamsList
} from "./examsList.js";

import {
adminPage
} from "./admin.js";

import {
addExam,
updateExam
} from "../services/examService.js";


let initialized = false;
let editingExam = null;



export function setEditingExam(exam){

editingExam = exam;

}




export function createExamEvents(){


if(initialized)
return;


initialized = true;



document.addEventListener(
"click",
async(e)=>{



// ADD QUESTION

if(
e.target.closest("#btnAddQuestion")
){

const list =
document.querySelector("#questionsList");


if(list){

list.insertAdjacentHTML(
"beforeend",
createQuestionTemplate(
list.children.length + 1
)
);

}


return;

}





// DELETE QUESTION

if(
e.target.closest(".removeQuestion")
){

const card =
e.target.closest(".question-card");


if(card)
card.remove();


return;

}





// SAVE

if(
e.target.closest("#btnSaveExam")
){

await saveExam();

return;

}





// BACK CREATE EXAM

if(
  e.target.closest("#btnBackToList")
  ){
  
  editingExam = null;
  
  const app =
  document.querySelector("#app");
  
  if(app){
  
  app.innerHTML =
  adminPage();
  
  }
  
  return;
  
  }

});



}






async function saveExam(){


const title =
document.querySelector("#examTitle")
?.value
.trim();



if(!title){

alert(
"اكتب عنوان الامتحان"
);

return;

}



const subject =
document.querySelector("#examSubject")
?.value
||
"physics";



const className =
document.querySelector("#examClass")
?.value
||
"الصف الأول الثانوي";



const duration =
Number(
document.querySelector("#examDuration")
?.value
)
||
60;



const passingScore =
Number(
document.querySelector("#examPassingScore")
?.value
)
||
50;



const questions =
[
...document.querySelectorAll(".question-card")
]
.map(
(card)=>{


return {

question:
card.querySelector(".q-text")
?.value
||
"",


text:
card.querySelector(".q-text")
?.value
||
"",


type:
card.querySelector(".q-type-select")
?.value
||
"mcq",


score:
Number(
card.querySelector(".q-score")
?.value
)
||
1,


options:
[
...card.querySelectorAll(".opt-text")
]
.map(
x=>x.value
),


correctIndex:
Number(
card.querySelector(
".q-correct-radio:checked"
)
?.value
||0
)


};


});



const examData = {

title,

subject,

className,

grade:
className,

duration,

examTime:
duration,

passingScore,


questions,


isPublished:true

};




try{


if(editingExam){


await updateExam(
editingExam.firestoreId,
examData
);


}else{


await addExam(
examData
);


}



alert(
"✅ تم الحفظ"
);



editingExam=null;



const app =
document.querySelector("#app");



if(app){

app.innerHTML =
examsListPage();

await loadExamsList();

}



}
catch(error){

console.error(error);


alert(
"حدث خطأ أثناء الحفظ"
);


}



}






function createQuestionTemplate(index){


return `

<div class="question-card">


<button
type="button"
class="removeQuestion"
>
🗑 حذف السؤال
</button>



<input
class="q-correct-radio"
type="radio"
name="correct_${index}"
value="0"
checked
>


<input
class="q-correct-radio"
type="radio"
name="correct_${index}"
value="1"
>


<input
class="q-correct-radio"
type="radio"
name="correct_${index}"
value="2"
>


<input
class="q-correct-radio"
type="radio"
name="correct_${index}"
value="3"
>



</div>

`;

}