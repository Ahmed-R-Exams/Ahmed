 // pages/reviewResult.js

 import { resultsPage } from "./results.js";
 import { updateResult } from "../services/resultService.js";
 
 
 export function reviewResultPage(result, resultId = null) {
 
 
 const app =
 document.querySelector("#app");
 
 
 
 if(!result){
 
 
 return `
 
 <h2 style="color:#ef4444;">
 Result Not Found
 </h2>
 
 
 <p>
 لا توجد بيانات للنتيجة المطلوبة
 </p>
 
 
 <button
 onclick="location.reload()"
 style="
 background:#0f172a;
 color:white;
 padding:12px 25px;
 border:none;
 border-radius:10px;
 cursor:pointer;
 "
 >
 
 العودة
 
 </button>
 
 `;
 
 
 }
 
 
 
 if(!result.essayGrades){
 
 result.essayGrades = {};
 
 }
 
 
 
 let questions =
 result.questions || [];
 
 
 
 if(!questions.length){
 
 
 try{
 
 
 const activeExam =
 JSON.parse(
 localStorage.getItem("currentActiveExam") || "{}"
 );
 
 
 
 if(activeExam.questions){
 
 questions =
 activeExam.questions;
 
 }
 
 
 
 }catch{
 
 
 questions = [];
 
 }
 
 
 }
 
 
 
 
 let calculatedTotal = 0;
 
 
 
 questions.forEach(q=>{
 
 
 if(
 String(q.type || "")
 .toLowerCase()
 .includes("essay")
 ){
 
 
 calculatedTotal +=
 Number(
 q.maxScore ||
 q.grade ||
 q.points ||
 1
 );
 
 
 
 }else{
 
 
 calculatedTotal +=
 Number(
 q.score || 1
 );
 
 
 
 }
 
 
 });
 
 
 
 if(calculatedTotal > 0){
 
 
 result.total =
 calculatedTotal;
 
 
 }
 
 
 
 const percent =
 Math.round(
 
 (
 Number(result.score || 0)
 /
 Number(result.total || 1)
 )
 *
 100
 
 );
 
 
 
 const passed =
 percent >= 50;
 
 
 
 
 setTimeout(()=>{
 
 
 const backBtn =
 document.getElementById(
 "backToResults"
 );
 
 
 
 if(backBtn){
 
 
 backBtn.onclick = async ()=>{
 
 
 app.innerHTML =
 await resultsPage();
 
 
 };
 
 
 }
 document
.querySelectorAll(".save-essay-grade")
.forEach(btn=>{


btn.onclick = async ()=>{


const qIndex =
Number(
btn.dataset.qindex
);



const input =
document.getElementById(
`essay_grade_${qIndex}`
);



let grade =
Number(input.value) || 0;



const max =
Number(

questions[qIndex].maxScore ||
questions[qIndex].grade ||
questions[qIndex].points ||
1

);



if(grade > max){

grade = max;

}



if(grade < 0){

grade = 0;

}



input.value = grade;



result.essayGrades[qIndex] =
grade;



let mcqScore = 0;



questions.forEach((q,i)=>{


const type =
String(q.type || "")
.toLowerCase();



if(
!type.includes("essay")
){



const student =
Number(
result.answers?.[i]
);



const correct =
Number(
q.correctAnswerIndex ??
q.correctAnswer ??
q.rightIndex
);



if(student === correct){


mcqScore +=
Number(
q.score || 1
);



}



}



});



const essayScore =
Object.values(
result.essayGrades
)
.reduce(
(a,b)=>
a + Number(b),
0
);



result.score =
mcqScore + essayScore;



if(resultId){


await updateResult(
resultId,
{

essayGrades:
result.essayGrades,


score:
result.score,


total:
result.total

}

);



}else{


if(result.id){


await updateResult(
result.id,
{

essayGrades:
result.essayGrades,


score:
result.score,


total:
result.total

}

);



}



}



alert(
"تم تحديث وحفظ الدرجة بنجاح"
);



app.innerHTML =
reviewResultPage(
result,
resultId
);



};


});



},50);
return `

<div style="
max-width:900px;
margin:40px auto;
padding:30px;
background:#0f172a;
color:white;
border-radius:20px;
direction:rtl;
font-family:Cairo;
">


<h2 style="
text-align:center;
color:#38bdf8;
">

مراجعة امتحان الطالب

</h2>



<h3>

👨‍🎓 ${result.studentName || "طالب"}

</h3>



<p>

الامتحان:
<b>
${result.examTitle || "امتحان"}
</b>

</p>



<p>

${result.date || ""}

</p>




<h2 style="
text-align:center;
color:${passed ? "#4ade80":"#f87171"};
">

${result.score}
/
${result.total}

<br>

${percent}%

<br>

${passed ? "✅ ناجح":"❌ راسب"}

</h2>




<h3>

📝 تفاصيل إجابات الطالب والدرجات

</h3>




${
questions.length

?

questions.map((q,index)=>{


const qType =
String(q.type || "")
.toLowerCase();



const studentAns =
result.answers
?
result.answers[index]
:
undefined;



if(
qType.includes("essay")
){



const studentEssayText =
studentAns !== undefined
?
studentAns
:
"لم يتم تقديم إجابة";



const currentEssayGrade =
result.essayGrades &&
result.essayGrades[index] !== undefined
?
result.essayGrades[index]
:
0;



const maxQGrade =
Number(
q.maxScore ||
q.grade ||
q.points ||
1
);



return `


<div style="
margin:20px 0;
padding:20px;
background:#1e293b;
border-radius:15px;
">


<h4>

س${index+1} (مقالي)

</h4>


<p>

${q.text || q.question || ""}

</p>


<p>

👤 إجابة الطالب:

<br>

${studentEssayText}

</p>



<p>

الدرجة:

${currentEssayGrade}/${maxQGrade}

</p>



<input

type="number"

id="essay_grade_${index}"

value="${currentEssayGrade}"

min="0"

max="${maxQGrade}"

step="0.5"

style="
width:80px;
padding:8px;
border-radius:8px;
"



>



<button

class="save-essay-grade"

data-qindex="${index}"

style="
background:#2563eb;
color:white;
border:none;
padding:8px 15px;
border-radius:8px;
cursor:pointer;
"

>

حفظ الدرجة

</button>


</div>


`;



}



const studentAnsIndex =
typeof studentAns === "number"
?
studentAns
:
-1;



const correctIndex =
Number(
q.correctAnswerIndex ??
q.correctAnswer ??
q.rightIndex
);



const studentText =
q.options &&
q.options[studentAnsIndex]
?
q.options[studentAnsIndex]
:
"لم يتم الإجابة";



const correctText =
q.options &&
q.options[correctIndex]
?
q.options[correctIndex]
:
"غير محدد";



const isCorrect =
studentAnsIndex === correctIndex;



const qScore =
Number(
q.score || 1
);



const earned =
isCorrect
?
qScore
:
0;



return `


<div style="
margin:20px 0;
padding:20px;
background:#1e293b;
border-radius:15px;
">


<h4>

س${index+1}

</h4>


<p>

${q.text || q.question || ""}

</p>



<p>

<span style="
background:${isCorrect ? "#dcfce7":"#fee2e2"};
color:${isCorrect ? "#16a34a":"#dc2626"};
padding:5px 10px;
border-radius:8px;
">

${earned}/${qScore}

</span>

</p>



<p>

👤 إجابة الطالب:

${studentText}

</p>



<p>

✅ الإجابة الصحيحة:

${correctText}

</p>



</div>


`;



}).join("")



:

`

لا توجد أسئلة

`

}




<button

id="backToResults"

style="
width:100%;
background:#2563eb;
color:white;
border:none;
padding:14px;
border-radius:12px;
font-size:16px;
font-weight:bold;
cursor:pointer;
"

>

⬅ العودة لصفحة النتائج

</button>


</div>


`;

}