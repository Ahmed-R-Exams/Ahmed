// pages/exam.js

import { saveResult } from "../services/resultService.js";

console.log("EXAM FILE LOADED");


export function examPage() {

console.log("EXAM PAGE FUNCTION RUNNING");


const studentName =
localStorage.getItem("studentName") || "طالب";


const exam =
JSON.parse(
localStorage.getItem("currentActiveExam") || "{}"
);



const examTitle =
exam.title ||
exam.name ||
"امتحان";



const questions =
Array.isArray(exam.questions)
?
exam.questions
:
[];





setTimeout(()=>{


  const form =
  document.getElementById(
  "examSubmitForm"
  );
  
  console.log("FORM CHECK", form);
  
  if(!form){
  
  console.log(
  "FORM NOT FOUND"
  );
  
  return;
  
  }



if(!form){

console.log(
"FORM NOT FOUND"
);

return;

}




form.addEventListener(
"submit",
async(e)=>{


console.log(
"SUBMIT CLICKED"
);



e.preventDefault();



const formData =
new FormData(form);



let answers = [];

let score = 0;

let total = 0;




questions.forEach(
(q,index)=>{


const qScore =
getQuestionScore(q);



total += qScore;



if(
isEssayQuestion(q)
){


answers[index] =
formData.get(
`question_${index}`
)
||
"";



}else{



const selected =
formData.get(
`question_${index}`
);



const answer =
selected === null
?
-1
:
Number(selected);



answers[index] =
answer;



if(
answer ===
getQuestionCorrectAnswer(q)
){

score += qScore;

}


}



});





console.log(
"SAVING RESULT",
{
studentName,
examTitle,
score,
total,
answers
}
);



console.log("CALLING SAVE RESULT");

console.log("BEFORE SAVE RESULT");

await saveResult({

  studentName,

  examTitle,

  examId:
  exam.firestoreId ||
  exam.id ||
  "",

  score,

  total,

  answers,

  questions,

  percentage:
  calculatePercentage(
    score,
    total
  ),

  createdAt:
  Date.now(),

  date:
  new Date().toLocaleString()

});

console.log("AFTER SAVE RESULT");


localStorage.removeItem("currentActiveExam");
localStorage.removeItem("currentSelectedExam");


const app =
document.querySelector("#app");


if(app){

app.innerHTML = `

<div style="
text-align:center;
padding:40px;
color:white;
">

<h2>
✅ تم حفظ النتيجة بنجاح
</h2>

<p>
جاري العودة للصفحة الرئيسية...
</p>

</div>

`;

setTimeout(()=>{

window.location.reload();

},1500);

}
}

);



},100);




return `

<form id="examSubmitForm">

${
questions.map(
(q,index)=>{

return `

<div style="
background:#fff;
padding:20px;
margin:20px 0;
border-radius:15px;
">


<h3>
${index + 1})
${q.question || q.text || ""}
</h3>



${
q.image || q.questionImage

?

`

<img

src="${q.image || q.questionImage}"

style="
max-width:100%;
border-radius:10px;
margin:15px 0;
"

>

`

:

""

}




${renderAnswers(q,index)}



</div>

`;

}

).join("")
}



<button

type="submit"

style="
width:100%;
padding:15px;
background:#16a34a;
color:white;
border:none;
border-radius:12px;
font-size:18px;
cursor:pointer;
"

>

تسليم الامتحان

</button>



</form>

`;
  
  
  }
  
  
  
  
  function renderAnswers(q,index){
  
  
  
  if(
  isEssayQuestion(q)
  ){
  
  
  return `
  
  
  <textarea
  
  name="question_${index}"
  
  placeholder="اكتب إجابتك هنا"
  
  
  style="
  width:100%;
  min-height:120px;
  padding:15px;
  border-radius:10px;
  border:1px solid #ddd;
  font-size:16px;
  "
  
  
  ></textarea>
  
  
  
  `;
  
  
  
  }
  
  
  
  
  
  return (q.options || [])
  
  .filter(
  op =>
  op &&
  String(op).trim() !== ""
  )
  
  
  .map(
  (op,i)=>{
  
  
  return `
  
  
  <label style="
  display:block;
  padding:12px;
  margin:8px 0;
  background:#f8fafc;
  border-radius:10px;
  cursor:pointer;
  ">
  
  
  
  <input
  
  type="radio"
  
  name="question_${index}"
  
  value="${i}"
  
  
  style="
  margin-left:10px;
  "
  
  >
  
  
  ${op}
  
  
  
  </label>
  
  
  
  `;
  
  
  
  }
  
  ).join("");
  
  
  
  }
  function isEssayQuestion(q){


const type =
String(q.type || "")
.toLowerCase()
.trim();



const hasOptions =
Array.isArray(q.options)
&&
q.options.some(
x =>
x &&
String(x).trim() !== ""
);



return (

type.includes("essay")

||

type.includes("مقال")

||

!hasOptions

);


}





function getQuestionCorrectAnswer(q){



if(
q.correctAnswerIndex !== undefined
){

return Number(
q.correctAnswerIndex
);

}



if(
q.correctIndex !== undefined
){

return Number(
q.correctIndex
);

}



if(
q.rightIndex !== undefined
){

return Number(
q.rightIndex
);

}



if(
q.correctAnswer !== undefined
){

return Number(
q.correctAnswer
);

}



if(
q.answer !== undefined
){

return Number(
q.answer
);

}



return -1;


}





function getQuestionScore(q){


return Number(

q.score ||

q.maxScore ||

q.points ||

q.grade ||

1

);


}





function calculatePercentage(
score,
total
){


if(!total)
return 0;



return Math.round(

(score / total) * 100

);


}


export {

examPage as showExam

};