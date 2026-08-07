// pages/results.js

import { getResults, deleteResult, deleteAllResults } from "../services/resultService.js";
import { getExams } from "../services/examService.js";
import { adminPage } from "./admin.js";
import { reviewResultPage } from "./reviewResult.js";


export async function resultsPage() {


const results =
await getResults();


const exams =
getExams() || [];



const students =
[
...new Set(
results.map(
r => r.studentName || "Unknown"
)
)
];



let totalSubmissions =
results.length;



let passedCount =
results.filter(r=>{


const total =
Number(r.total) || 100;


const score =
Number(r.score) || 0;



return (
(score / total) * 100
) >= 50;



}).length;



let successRate =
totalSubmissions
?
Math.round(
(passedCount / totalSubmissions) * 100
)
:
0;



setTimeout(()=>{


const app =
document.querySelector("#app");



const search =
document.getElementById("searchStudent");



const studentFilter =
document.getElementById("filterStudent");



const examFilter =
document.getElementById("filterExam");



const reportBtn =
document.getElementById("studentReport");



const subCountEl =
document.getElementById("statSubmissions");



const successRateEl =
document.getElementById("statSuccessRate");




function update(){


const cards =
[
...document.querySelectorAll(
"#resultsTable .menu-card"
)
];



const searchText =
(
search?.value || ""
)
.toLowerCase()
.trim();



const selectedStudent =
studentFilter?.value || "";



const selectedExam =
examFilter?.value || "";



let visibleCount = 0;

let visiblePassed = 0;



cards.forEach(card=>{


const student =
(
card.dataset.student || ""
)
.toLowerCase();



const exam =
(
card.dataset.exam || ""
)
.toLowerCase();



const score =
Number(card.dataset.score) || 0;



const total =
Number(card.dataset.total) || 100;



const percent =
(score / total) * 100;



const searchOK =
!searchText ||
student.includes(searchText) ||
exam.includes(searchText);



const studentOK =
!selectedStudent ||
card.dataset.student === selectedStudent;



const examOK =
!selectedExam ||
card.dataset.exam === selectedExam;



if(
searchOK &&
studentOK &&
examOK
){


card.style.display =
"flex";


visibleCount++;


if(percent >= 50)
visiblePassed++;


}else{


card.style.display =
"none";


}



});



if(subCountEl)
subCountEl.textContent =
visibleCount;



if(successRateEl)
successRateEl.textContent =
(
visibleCount
?
Math.round(
(visiblePassed / visibleCount) * 100
)
:
0
)
+
"%";


}
if(search)
search.oninput = update;


if(studentFilter)
studentFilter.onchange = update;


if(examFilter)
examFilter.onchange = update;




if(reportBtn){


reportBtn.onclick = ()=>{


const selectedStudent =
studentFilter?.value || "";



if(!selectedStudent){


alert(
"اختر اسم الطالب أولاً"
);


return;


}



const studentResults =
results.filter(
r =>
(r.studentName || "") === selectedStudent
);



printStudentReport(
selectedStudent,
studentResults
);



};


}






const deleteAll =
document.getElementById(
"deleteAllResults"
);



if(deleteAll){


deleteAll.onclick = async ()=>{


if(
!confirm(
"Are you sure you want to delete all results?"
)
)
return;



await deleteAllResults();



app.innerHTML =
await resultsPage();



};


}





const refresh =
document.getElementById(
"refreshResults"
);



if(refresh){


refresh.onclick = async ()=>{


app.innerHTML =
await resultsPage();



};


}





const backAdmin =
document.getElementById(
"backAdmin"
);



if(backAdmin){


backAdmin.onclick = ()=>{


app.innerHTML =
adminPage();



};


}






const tableContainer =
document.getElementById(
"resultsTable"
);



if(tableContainer){


tableContainer.onclick =
async (e)=>{



const delBtn =
e.target.closest(
".deleteResult"
);



if(delBtn){


e.stopPropagation();



const id =
delBtn.dataset.result;



if(
!confirm(
"Delete this result?"
)
)
return;



await deleteResult(id);



app.innerHTML =
await resultsPage();



return;


}






const pdfBtn =
e.target.closest(
".downloadResultPdf"
);



if(pdfBtn){


e.stopPropagation();



const id =
pdfBtn.dataset.result;



const result =
results.find(
r =>
r.id === id
);



if(result){


printResultsTable(
[result],
"Student Result"
);



}



return;


}






const card =
e.target.closest(
".menu-card"
);



if(card){


const id =
card.dataset.resultId;



const resultItem =
results.find(
r =>
r.id === id
);



if(
resultItem &&
typeof reviewResultPage === "function"
){


app.innerHTML =
reviewResultPage(
resultItem
);



}



}


};


}


},50);
return `

<div style="
max-width:1200px;
margin:0 auto;
padding:35px;
font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
background:#0f172a;
min-height:100vh;
direction:ltr;
text-align:left;
color:#f8fafc;
">


<button id="backAdmin"

style="
background:rgba(255,255,255,0.08);
color:#e2e8f0;
border:1px solid rgba(255,255,255,0.12);
padding:9px 16px;
font-size:13px;
font-weight:700;
border-radius:12px;
cursor:pointer;
">

⬅ Back to Dashboard

</button>



<h1>
🛡️ Admin Control Center
</h1>


<h2>
📊 Exam Results Dashboard
</h2>


<p>
Monitor performance metrics and student reports.
</p>



<div style="
display:flex;
gap:20px;
margin:25px 0;
">


<div>
Total Submissions

<h2 id="statSubmissions">
${totalSubmissions}
</h2>

</div>



<div>

Success Rate

<h2 id="statSuccessRate">

${successRate}%

</h2>

</div>


</div>





<div style="
display:flex;
gap:15px;
flex-wrap:wrap;
">


<input

id="searchStudent"

placeholder="🔍 Search student or exam"

style="
flex:1;
min-width:250px;
padding:14px;
border-radius:14px;
border:1px solid rgba(255,255,255,.12);
background:#0f172a;
color:white;
">



<select

id="filterStudent"

style="
padding:14px;
border-radius:14px;
background:#0f172a;
color:white;
min-width:220px;
">


<option value="">

👨‍🎓 All Students

</option>



${
students.map(
s =>
`

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
border-radius:14px;
background:#0f172a;
color:white;
min-width:220px;
">


<option value="">

📂 All Exams

</option>



${
exams.map(
e =>
`

<option value="${e.title}">
${e.title}
</option>

`
).join("")
}



</select>



<button

id="studentReport"

style="
padding:14px 22px;
border:none;
border-radius:14px;
background:#2563eb;
color:white;
font-weight:700;
cursor:pointer;
">

📄 Student Report

</button>


</div>




<div

id="resultsTable"

style="
display:grid;
grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
gap:22px;
margin-top:30px;
">


${
results.length

?


results.map((r,index)=>{


const total =
Number(r.total)||100;


const score =
Number(r.score)||0;



const percent =
Math.round(
(score / total) * 100
);



return `


<div

class="menu-card"

data-result-id="${r.id}"

data-student="${r.studentName || ""}"

data-exam="${r.examTitle || ""}"

data-score="${score}"

data-total="${total}"


style="
padding:25px;
background:#111827;
border-radius:20px;
cursor:pointer;
display:flex;
flex-direction:column;
gap:15px;
border:1px solid rgba(255,255,255,.08);
">


<h3>
👨‍🎓 ${r.studentName || "Unknown"}
</h3>


<p>
📝 ${r.examTitle || "N/A"}
</p>


<p>
Score:
${score}/${total}
</p>


<p>
${percent}%
</p>


<div>


<button

class="downloadResultPdf"

data-result="${r.id}"

>

📄 PDF

</button>



<button

class="deleteResult"

data-result="${r.id}"

>

🗑 Delete

</button>


</div>


</div>


`;


}).join("")


:


`

<h3>
📂 No Results Available
</h3>

`

}



</div>


</div>

`;

}




function printStudentReport(studentName, studentResults){


const win =
window.open(
"",
"",
"width=900,height=700"
);



const total =
studentResults.reduce(
(a,r)=>
a+(Number(r.total)||100),
0
);



const score =
studentResults.reduce(
(a,r)=>
a+(Number(r.score)||0),
0
);



const avg =
total
?
Math.round(
(score / total) * 100
)
:
0;



win.document.write(`

<h2>
Ahmed.R Physics Report
</h2>

<h3>
${studentName}
</h3>


<p>
Average:
${avg}%
</p>


</body>

</html>

`);



win.document.close();


}




function printResultsTable(results,title){


printStudentReport(
title,
results
);


}