import { getExams } from "../services/examService.js";
import { adminPage } from "./admin.js";
import { reviewResultPage } from "./reviewResult.js";


export function resultsPage() {


  const results =
    JSON.parse(
      localStorage.getItem("examResults") || "[]"
    );


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


      deleteAll.onclick = ()=>{


        if(
          !confirm(
            "Are you sure you want to delete all results?"
          )
        )
          return;



        localStorage.removeItem(
          "examResults"
        );



        app.innerHTML =
          resultsPage();


      };


    }





    const refresh =
      document.getElementById(
        "refreshResults"
      );



    if(refresh){


      refresh.onclick = ()=>{


        app.innerHTML =
          resultsPage();


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
      (e)=>{



        const delBtn =
          e.target.closest(
            ".deleteResult"
          );



        if(delBtn){


          e.stopPropagation();



          const id =
            Number(
              delBtn.dataset.result
            );



          if(
            !confirm(
              "Delete this result?"
            )
          )
            return;



          let currentResults =
            JSON.parse(
              localStorage.getItem(
                "examResults"
              )
              ||
              "[]"
            );



          currentResults.splice(
            id,
            1
          );



          localStorage.setItem(
            "examResults",
            JSON.stringify(
              currentResults
            )
          );



          app.innerHTML =
            resultsPage();



          return;


        }





        const pdfBtn =
          e.target.closest(
            ".downloadResultPdf"
          );



        if(pdfBtn){


          e.stopPropagation();



          const id =
            Number(
              pdfBtn.dataset.result
            );



          const currentResults =
            JSON.parse(
              localStorage.getItem(
                "examResults"
              )
              ||
              "[]"
            );



          if(currentResults[id]){

            printResultsTable(
              [
                currentResults[id]
              ],
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
            Number(
              card.dataset.resultId
            );



          const currentResults =
            JSON.parse(
              localStorage.getItem(
                "examResults"
              )
              ||
              "[]"
            );



          const resultItem =
            currentResults[id];



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

  <div class="container"
  
  style="
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
  
  
  <!-- Back Button -->
  
  <div style="margin-bottom:20px;">
  
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
  
  </div>
  
  
  
  
  
  <!-- Header -->
  
  <div style="
  background:linear-gradient(135deg,#1e293b 0%,#090d16 100%);
  padding:40px;
  border-radius:28px;
  margin-bottom:30px;
  box-shadow:0 20px 40px -15px rgba(0,0,0,.5);
  border:1px solid rgba(255,255,255,.08);
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex-wrap:wrap;
  gap:25px;
  ">
  
  
  <div>
  
  <div style="
  display:inline-flex;
  background:rgba(59,130,246,.2);
  color:#60a5fa;
  padding:7px 16px;
  border-radius:30px;
  font-size:13px;
  font-weight:700;
  ">
  
  🛡️ Admin Control Center
  
  </div>
  
  
  <h1 style="
  font-size:36px;
  margin:12px 0;
  ">
  
  📊 Exam Results Dashboard
  
  </h1>
  
  
  <p style="
  color:#94a3b8;
  ">
  
  Monitor performance metrics and student reports.
  
  </p>
  
  
  </div>
  
  
  
  
  
  <div style="
  display:flex;
  gap:15px;
  ">
  
  
  <div style="
  background:rgba(255,255,255,.06);
  padding:16px 22px;
  border-radius:16px;
  text-align:center;
  ">
  
  
  <div id="statSubmissions"
  
  style="
  font-size:24px;
  font-weight:800;
  color:#38bdf8;
  ">
  
  ${totalSubmissions}
  
  </div>
  
  
  <div>
  Submissions
  </div>
  
  
  </div>
  
  
  
  
  
  <div style="
  background:rgba(255,255,255,.06);
  padding:16px 22px;
  border-radius:16px;
  text-align:center;
  ">
  
  
  <div id="statSuccessRate"
  
  style="
  font-size:24px;
  font-weight:800;
  color:#4ade80;
  ">
  
  ${successRate}%
  
  </div>
  
  
  <div>
  Success Rate
  </div>
  
  
  </div>
  
  
  </div>
  
  
  </div>
  
  
  
  
  
  
  <!-- Filters -->
  
  <div style="
  background:#1e293b;
  padding:28px;
  border-radius:24px;
  margin-bottom:30px;
  ">
  
  
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
  s=>
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
  e=>
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
  
  
  </div>

  <!-- Results Cards -->

<div style="
background:#1e293b;
padding:30px;
border-radius:24px;
">


<div id="resultsTable"

style="
display:grid;
grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
gap:22px;
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


const passed =
percent >= 50;



return `


<div

class="menu-card"


data-result-id="${index}"


data-student="${r.studentName || ""}"


data-exam="${r.examTitle || ""}"


data-score="${score}"


data-total="${total}"



style="
padding:25px;
background:#0f172a;
border-radius:20px;
cursor:pointer;
display:flex;
flex-direction:column;
gap:15px;
border:1px solid rgba(255,255,255,.08);
">



<h3 style="
margin:0;
color:white;
">

👨‍🎓 ${r.studentName || "Unknown"}

</h3>



<div style="
color:#60a5fa;
font-weight:bold;
">

📝 ${r.examTitle || "N/A"}

</div>



<div style="
background:rgba(255,255,255,.05);
padding:12px;
border-radius:12px;
text-align:center;
display:flex;
justify-content:center;
align-items:center;
gap:15px;
flex-wrap:wrap;
">


<div style="
font-size:25px;
font-weight:800;
color:white;
">

Score:
<b>
${score}/${total}
</b>

</div>



<div style="
font-size:18px;
font-weight:800;
color:${passed ? "#4ade80":"#f87171"};
">


</div>



<div style="
font-size:25px;
font-weight:bold;
color:#60a5fa;
background:rgba(59,130,246,.15);
padding:6px 12px;
border-radius:10px;
">

${percent}%

</div>


</div>




<div style="
display:flex;
gap:8px;
">


<button

class="downloadResultPdf"

data-result="${index}"

style="
flex:1;
padding:9px;
border-radius:10px;
cursor:pointer;
">

📄 PDF

</button>




<button

class="deleteResult"

data-result="${index}"

style="
flex:1;
padding:9px;
border-radius:10px;
cursor:pointer;
">

🗑 Delete

</button>


</div>



</div>


`;

}).join("")



:


`

<div style="
padding:70px;
text-align:center;
color:#94a3b8;
">

📂 No Results Available

</div>

`

}


</div>


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
(a,r)=>a+(Number(r.total)||100),
0
);



const score =
studentResults.reduce(
(a,r)=>a+(Number(r.score)||0),
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

<meta charset="UTF-8">

<title>
Student Report
</title>

<style>

body{
font-family:Arial;
direction:rtl;
padding:30px;
}


table{

width:100%;
border-collapse:collapse;

}


td,th{

border:1px solid #ccc;
padding:10px;
text-align:center;

}


th{

background:#0f172a;
color:white;

}

</style>

</head>


<body>


<h2>
📊 تقرير الطالب
</h2>


<h3>
${studentName}
</h3>


<p>
عدد الامتحانات:
${studentResults.length}
</p>


<p>
المتوسط:
${avg}%
</p>



<table>

<tr>

<th>
الامتحان
</th>

<th>
الدرجة
</th>

<th>
التاريخ
</th>

</tr>


${
studentResults.map(r=>`

<tr>

<td>
${r.examTitle||""}
</td>


<td>
${r.score||0}/${r.total||100}
</td>


<td>
${r.date||""}
</td>


</tr>

`).join("")
}


</table>



<script>

window.onload=function(){
window.print();
}

</script>


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