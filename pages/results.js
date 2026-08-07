// pages/results.js

import {
  getResults,
  deleteResult,
  deleteAllResults
  } from "../services/resultService.js";
  
  import {
  getExams
  } from "../services/examService.js";
  
  import {
  adminPage
  } from "./admin.js";
  
  import {
  reviewResultPage
  } from "./reviewResult.js";
  
  
  export async function resultsPage(){
  
  
  const resultsData =
  await getResults();
  
  
  const results =
  Array.isArray(resultsData)
  ?
  resultsData
  :
  [];
  
  
  
  const examsData =
  await getExams();
  
  
  const exams =
  Array.isArray(examsData)
  ?
  examsData
  :
  [];
  
  
  
  const students =
  [
  ...new Set(
  results.map(
  r=>r.studentName || "Unknown"
  )
  )
  ];
  
  
  
  const totalSubmissions =
  results.length;
  
  
  
  const passedCount =
  results.filter(r=>{
  
  
  const total =
  Number(r.total)||100;
  
  
  const score =
  Number(r.score)||0;
  
  
  return (
  (score/total)*100
  )>=50;
  
  
  }).length;
  
  
  
  const successRate =
  totalSubmissions
  ?
  Math.round(
  (passedCount/totalSubmissions)*100
  )
  :
  0;
  
  
  
  setTimeout(()=>{
  
  
  const app =
  document.querySelector("#app");
  
  
  
  const back =
  document.getElementById(
  "backAdmin"
  );
  
  
  
  if(back){
  
  back.onclick=()=>{
  
  app.innerHTML =
  adminPage();
  
  };
  
  }
  
  
  
  
  const refresh =
  document.getElementById(
  "refreshResults"
  );
  
  
  
  if(refresh){
  
  refresh.onclick=
  async()=>{
  
  app.innerHTML =
  await resultsPage();
  
  };
  
  }
  
  
  
  
  const deleteAll =
  document.getElementById(
  "deleteAllResults"
  );
  
  
  
  if(deleteAll){
  
  deleteAll.onclick=
  async()=>{
  
  
  if(
  !confirm(
  "حذف كل النتائج؟"
  )
  )
  return;
  
  
  
  await deleteAllResults();
  
  
  app.innerHTML =
  await resultsPage();
  
  
  };
  
  
  }
  
  
  
  
  // ✅ زر طباعة الكشف
  
  const reportBtn =
  document.getElementById(
  "studentReport"
  );
  
  
  
  if(reportBtn){
  
  reportBtn.onclick = ()=>{
  
  
  const visibleCards =
  [
  ...document.querySelectorAll(
  "#resultsTable .menu-card"
  )
  ]
  .filter(
  card =>
  card.style.display !== "none"
  );
  
  
  
  const selectedResults =
  visibleCards.map(card=>{
  
  
  return results.find(
  r =>
  String(r.id) ===
  String(card.dataset.resultId)
  );
  
  
  })
  .filter(Boolean);
  
  
  
  if(!selectedResults.length){
  
  alert(
  "لا توجد نتائج للطباعة"
  );
  
  return;
  
  }
  
  
  
  printStudentReport(
  "كشف نتائج الطلاب",
  selectedResults
  );
  
  
  
  };
  
  
  }
  
  
  
  
  
  
  const search =
  document.getElementById(
  "searchStudent"
  );
  
  
  
  const studentFilter =
  document.getElementById(
  "filterStudent"
  );
  
  
  
  const examFilter =
  document.getElementById(
  "filterExam"
  );
  
  
  
  function updateFilter(){
  
  
  const text =
  (
  search?.value || ""
  )
  .toLowerCase()
  .trim();
  
  
  
  const student =
  studentFilter?.value || "";
  
  
  
  const exam =
  examFilter?.value || "";
  
  
  
  const cards =
  [
  ...document.querySelectorAll(
  "#resultsTable .menu-card"
  )
  ];
  
  
  
  cards.forEach(card=>{
  
  
  const studentName =
  (
  card.dataset.student || ""
  )
  .toLowerCase();
  
  
  
  const examName =
  (
  card.dataset.exam || ""
  )
  .toLowerCase();
  
  
  
  const okSearch =
  !text ||
  studentName.includes(text) ||
  examName.includes(text);
  
  
  
  const okStudent =
  !student ||
  card.dataset.student === student;
  
  
  
  const okExam =
  !exam ||
  card.dataset.exam === exam;
  
  
  
  card.style.display =
  (
  okSearch &&
  okStudent &&
  okExam
  )
  
  ?
  
  "block"
  
  :
  
  "none";
  
  
  });
  
  
  }
  
  
  
  search?.addEventListener(
  "input",
  updateFilter
  );
  
  
  studentFilter?.addEventListener(
  "change",
  updateFilter
  );
  
  
  examFilter?.addEventListener(
  "change",
  updateFilter
  );
  
  

  const table =
document.getElementById(
"resultsTable"
);



if(table){

table.onclick =
async(e)=>{


const del =
e.target.closest(
".deleteResult"
);



if(del){

e.stopPropagation();


await deleteResult(
del.dataset.result
);



app.innerHTML =
await resultsPage();


return;

}




const card =
e.target.closest(
".menu-card"
);



if(card){


const result =
results.find(
r =>
String(r.id)
===
String(card.dataset.resultId)
);



if(result){

app.innerHTML =
reviewResultPage(
result
);

}


}



};


}



},50);



return `


<div style="
background:linear-gradient(135deg,#090d16,#1e293b);
padding:35px;
border-radius:25px;
color:white;
margin-bottom:30px;
">


<button id="backAdmin"

style="
padding:10px 18px;
border-radius:12px;
border:none;
cursor:pointer;
margin-bottom:20px;
">

⬅ العودة للوحة التحكم

</button>



<h1>
📊 نتائج الطلاب
</h1>



<p>
عدد التسليمات:
<b>${totalSubmissions}</b>
</p>



<p>
نسبة النجاح:
<b>${successRate}%</b>
</p>


</div>





<div style="
display:flex;
gap:15px;
flex-wrap:wrap;
margin-bottom:30px;
">



<input

id="searchStudent"

placeholder="🔍 بحث عن طالب أو امتحان"

style="
padding:14px;
border-radius:12px;
border:none;
flex:1;
min-width:250px;
"

>




<select

id="filterStudent"

style="
padding:14px;
border-radius:12px;
"

>


<option value="">
👨‍🎓 كل الطلاب
</option>


${
students.map(
s=>`

<option value="${s}">
${s}
</option>

`
).join("")
}


</select>






<select

id="filterExam"

style="
padding:14px;
border-radius:12px;
"

>


<option value="">
📚 كل الامتحانات
</option>



${
exams.map(
e=>`

<option value="${e.title || ""}">
${e.title || "امتحان"}
</option>

`
).join("")
}


</select>





<button id="refreshResults"

style="
padding:14px 20px;
border:none;
border-radius:12px;
cursor:pointer;
">

🔄 تحديث

</button>





<button id="studentReport"

style="
padding:14px 20px;
border:none;
border-radius:12px;
cursor:pointer;
background:#2563eb;
color:white;
">

📄 طباعة كشف

</button>





<button id="deleteAllResults"

style="
padding:14px 20px;
border:none;
border-radius:12px;
cursor:pointer;
background:#dc2626;
color:white;
">

🗑 حذف الكل

</button>



</div>





<div

id="resultsTable"

style="
display:grid;
grid-template-columns:
repeat(auto-fit,minmax(300px,1fr));
gap:20px;
"



>


${
results.length

?

results.map(r=>{


const score =
Number(r.score)||0;



const total =
Number(r.total)||100;



const percent =
Math.round(
(score/total)*100
);



return `


<div

class="menu-card"

data-result-id="${r.id}"

data-student="${r.studentName || ""}"

data-exam="${r.examTitle || ""}"


style="
padding:25px;
background:#111827;
color:white;
border-radius:20px;
cursor:pointer;
"


>



<h3 style="
color:#ffffff;
font-size:20px;
font-weight:700;
">

👨‍🎓 ${
r.studentName || "طالب"
}

</h3>



<p>

📚 ${
r.examTitle || "امتحان"
}

</p>



<p>

الدرجة:
${score}/${total}

</p>



<p>

النسبة:
${percent}%

</p>



<button

class="deleteResult"

data-result="${r.id}"


style="
padding:8px 15px;
background:#dc2626;
color:white;
border:none;
border-radius:10px;
cursor:pointer;
"

>

حذف

</button>



</div>



`;


}).join("")


:

`

<h2>
لا توجد نتائج حتى الآن
</h2>

`

}


</div>


`;

}

function printStudentReport(
  title,
  studentResults
  ){
  
  
  const win =
  window.open(
  "",
  "",
  "width=900,height=700"
  );
  
  
  
  const total =
  studentResults.reduce(
  (a,r)=>
  a + (Number(r.total)||100),
  0
  );
  
  
  
  const score =
  studentResults.reduce(
  (a,r)=>
  a + (Number(r.score)||0),
  0
  );
  
  
  
  const avg =
  total
  ?
  Math.round(
  (score/total)*100
  )
  :
  0;
  
  
  
  win.document.write(`
  
  <html>
  
  <head>
  
  <title>
  ${title}
  </title>
  
  
  <style>
  
  body{
  
  font-family:Arial;
  direction:rtl;
  padding:30px;
  
  }
  
  
  
  h2{
  
  text-align:center;
  
  }
  
  
  
  table{
  
  width:100%;
  border-collapse:collapse;
  margin-top:25px;
  
  }
  
  
  
  th,td{
  
  border:1px solid #333;
  padding:10px;
  text-align:center;
  
  }
  
  
  
  th{
  
  background:#eee;
  
  }
  
  
  
  </style>
  
  
  </head>
  
  
  
  <body>
  
  
  
  <h2>
  ${title}
  </h2>
  
  
  
  <p>
  النسبة العامة:
  ${avg}%
  </p>
  
  
  
  <table>
  
  
  <tr>
  
  <th>
  الطالب
  </th>
  
  
  <th>
  الامتحان
  </th>
  
  
  <th>
  الدرجة
  </th>
  
  
  <th>
  النسبة
  </th>
  
  
  </tr>
  
  
  
  ${
  studentResults.map(r=>{
  
  
  const percent =
  Math.round(
  (
  Number(r.score||0)
  /
  Number(r.total||100)
  )
  *100
  );
  
  
  
  return `
  
  
  <tr>
  
  
  <td>
  ${r.studentName || ""}
  </td>
  
  
  
  <td>
  ${r.examTitle || "امتحان"}
  </td>
  
  
  
  <td>
  ${r.score || 0}/${r.total || 0}
  </td>
  
  
  
  <td>
  ${percent}%
  </td>
  
  
  
  </tr>
  
  
  `;
  
  
  }).join("")
  }
  
  
  
  </table>
  
  
  
  </body>
  
  
  </html>
  
  
  `);
  
  
  
  win.document.close();
  
  
  
  win.print();
  
  
  }