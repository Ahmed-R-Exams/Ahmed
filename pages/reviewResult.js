import { resultsPage } from "./results.js";

export function reviewResultPage(result, resultIndex = null) {

  const app = document.querySelector("#app");

  if (!result) {
    return `
      <div style="
      max-width:800px;
      margin:40px auto;
      padding:30px;
      text-align:center;
      font-family:Cairo;
      background:white;
      border-radius:20px;
      ">

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

      </div>
    `;
  }


  if (!result.essayGrades) {
    result.essayGrades = {};
  }


  let questions = result.questions || [];


  if (!questions.length) {

    try {

      const activeExam =
        JSON.parse(
          localStorage.getItem("currentActiveExam") || "{}"
        );

      if (activeExam.questions) {
        questions = activeExam.questions;
      }

    } catch {

      questions = [];

    }

  }



  let calculatedTotal = 0;


  questions.forEach(q => {

    if (
      String(q.type || "")
      .toLowerCase()
      .includes("essay")
    ) {

      calculatedTotal += Number(
        q.maxScore ||
        q.grade ||
        q.points ||
        1
      );

    } else {

      calculatedTotal += Number(
        q.score || 1
      );

    }

  });



  if (calculatedTotal > 0) {

    result.total = calculatedTotal;

  }



  const percent =
    Math.round(
      (Number(result.score || 0) /
      Number(result.total || 1)) * 100
    );



  const passed =
    percent >= 50;



  setTimeout(() => {


    const backBtn =
      document.getElementById(
        "backToResults"
      );


    if (backBtn) {

      backBtn.onclick = () => {

        app.innerHTML =
          resultsPage();

      };

    }



    document
    .querySelectorAll(".save-essay-grade")
    .forEach(btn => {


      btn.onclick = () => {


        const qIndex =
          btn.dataset.qindex;



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



        if (grade > max) {

          grade = max;

        }



        if (grade < 0) {

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



          if (
            !type.includes("essay")
          ) {


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
                Number(q.score || 1);

            }


          }


        });


        const essayScore =
          Object.values(
            result.essayGrades
          )
          .reduce(
            (a,b)=>a+Number(b),
            0
          );



        result.score =
          mcqScore + essayScore;
          const storageKeys = [
            "studentResults",
            "teacherResults",
            "examResults",
            "results",
            "teacherScores"
          ];
  
  
          storageKeys.forEach(key => {
  
            try {
  
              let list =
                JSON.parse(
                  localStorage.getItem(key) || "[]"
                );
  
  
              if (Array.isArray(list)) {
  
  
                let index = resultIndex;
  
  
                if (
                  index === null ||
                  !list[index]
                ) {
  
                  index =
                    list.findIndex(r =>
                      r.studentName === result.studentName &&
                      r.examTitle === result.examTitle &&
                      r.date === result.date
                    );
  
                }
  
  
  
                if (index !== -1) {
  
                  list[index] = result;
  
                }
  
  
  
                localStorage.setItem(
                  key,
                  JSON.stringify(list)
                );
  
  
              }
  
  
            } catch(err){
  
              console.error(err);
  
            }
  
  
          });
  
  
  
          alert(
            "تم تحديث وحفظ الدرجة بنجاح"
          );
  
  
  
          app.innerHTML =
            reviewResultPage(
              result,
              resultIndex
            );
  
  
        };
  
  
      });
  
  
  
    },50);
  
  
  
  
  return `
  
  <div style="
  max-width:900px;
  margin:auto;
  padding:30px;
  font-family:Cairo, sans-serif;
  direction:rtl;
  background:#f8fafc;
  min-height:100vh;
  ">
  
  
  
  <div style="
  background:linear-gradient(135deg,#0f172a,#1e293b);
  padding:30px;
  border-radius:20px;
  color:white;
  margin-bottom:25px;
  ">
  
  
  
  <div style="
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex-wrap:wrap;
  gap:20px;
  ">
  
  
  
  <div>
  
  
  <span style="
  background:rgba(59,130,246,.2);
  color:#60a5fa;
  padding:6px 12px;
  border-radius:20px;
  font-size:12px;
  ">
  
  مراجعة امتحان الطالب
  
  </span>
  
  
  
  <h1 style="
  font-size:24px;
  margin:15px 0 8px;
  ">
  
  👨‍🎓 ${result.studentName || "طالب"}
  
  </h1>
  
  
  
  <p style="
  color:#94a3b8;
  ">
  
  الامتحان:
  <b>
  ${result.examTitle || "امتحان"}
  </b>
  
  <br>
  
  ${result.date || ""}
  
  </p>
  
  
  
  </div>
  
  
  
  
  
  <div style="
  background:rgba(255,255,255,.08);
  padding:18px 25px;
  border-radius:15px;
  text-align:center;
  min-width:220px;
  ">
  
  
  
  <div style="
  display:flex;
  justify-content:center;
  align-items:center;
  gap:15px;
  font-size:22px;
  font-weight:800;
  ">
  
  
  
  <span style="
  color:${passed ? "#4ade80":"#f87171"};
  ">
  
  ${result.score}
  /
  ${result.total}
  
  </span>
  
  
  
  <span style="
  font-size:16px;
  background:rgba(59,130,246,.2);
  color:#60a5fa;
  padding:6px 12px;
  border-radius:10px;
  ">
  
  ${percent}%
  
  </span>
  
  
  
  </div>
  
  
  
  <div style="
  margin-top:8px;
  font-size:13px;
  color:#cbd5e1;
  ">
  
  ${passed ? "✅ ناجح":"❌ راسب"}
  
  </div>
  
  
  
  </div>
  
  
  
  
  </div>
  
  
  </div>
  <div style="
background:white;
padding:25px;
border-radius:20px;
border:1px solid #e2e8f0;
box-shadow:0 4px 20px rgba(0,0,0,.03);
">



<h3 style="
margin-top:0;
color:#0f172a;
border-bottom:2px solid #f1f5f9;
padding-bottom:12px;
">

📝 تفاصيل إجابات الطالب والدرجات

</h3>



<div style="
display:flex;
flex-direction:column;
gap:15px;
">


${
questions.length

?

questions.map((q,index)=>{


const qType =
q.type || "mcq";


const studentAns =
result.answers
?
result.answers[index]
:
undefined;



if(qType === "essay"){


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
parseFloat(
q.maxScore ||
q.grade ||
q.points ||
1
);



return `

<div style="
padding:18px;
border-radius:14px;
background:#f8fafc;
border:1px solid #e2e8f0;
">



<div style="
display:flex;
justify-content:space-between;
align-items:center;
gap:10px;
">

<b>

س${index+1} (مقالي)

<br>

${q.text || q.question || ""}

</b>



<span style="
background:#e2e8f0;
padding:5px 10px;
border-radius:8px;
font-size:12px;
">

${currentEssayGrade}/${maxQGrade}

</span>


</div>




<div style="
margin-top:15px;
background:white;
padding:12px;
border-radius:10px;
border:1px solid #cbd5e1;
white-space:pre-wrap;
">

👤

${studentEssayText}

</div>




<div style="
margin-top:12px;
display:flex;
gap:10px;
align-items:center;
">


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
border:1px solid #cbd5e1;
text-align:center;
"



>



<button

class="save-essay-grade"

data-qindex="${index}"

style="
background:#0f172a;
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
q.correctAnswerIndex !== undefined
?
q.correctAnswerIndex
:
q.correctAnswer;



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
studentAnsIndex === Number(correctIndex);



const qScore =
Number(q.score || 1);



const earned =
isCorrect
?
qScore
:
0;



return `


<div style="
padding:18px;
border-radius:14px;
background:#f8fafc;
border:1px solid #e2e8f0;
">



<div style="
display:flex;
justify-content:space-between;
gap:10px;
align-items:center;
">


<b>

س${index+1}

<br>

${q.text || q.question || ""}

</b>



<span style="
background:${isCorrect ? "#dcfce7":"#fee2e2"};
color:${isCorrect ? "#16a34a":"#dc2626"};
padding:5px 10px;
border-radius:8px;
font-size:12px;
">

${earned}/${qScore}

</span>



</div>



<div style="
margin-top:12px;
font-size:14px;
">

👤 إجابة الطالب:

<b>

${studentText}

</b>


<br><br>


✅ الإجابة الصحيحة:

<b>

${correctText}

</b>


</div>



</div>


`;



}).join("")



:

`

<div style="
text-align:center;
padding:40px;
">

لا توجد أسئلة

</div>

`

}



</div>


</div>
<div style="
margin-top:25px;
">

<button

id="backToResults"

style="
width:100%;
background:#0f172a;
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



</div>

`;

}