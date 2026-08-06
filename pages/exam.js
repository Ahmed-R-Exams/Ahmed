import { resultsPage } from "./results.js";


export function examPage() {


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
    exam.questions || [];



  setTimeout(() => {


    const form =
      document.getElementById("examSubmitForm");


    if (!form) return;



    form.addEventListener("submit", (e) => {


      e.preventDefault();



      const formData =
        new FormData(form);



      let answers = [];

      let score = 0;

      let total = 0;



      questions.forEach((q, index) => {



        const qType =
          String(q.type || "")
            .toLowerCase()
            .trim();



        const hasOptions =
          Array.isArray(q.options) &&
          q.options.some(
            x => x && String(x).trim() !== ""
          );



        const isEssay =
          qType.includes("essay") ||
          qType.includes("مقال") ||
          !hasOptions;



        if (isEssay) {



          const essayAnswer =
            formData.get(
              `question_${index}`
            ) || "";



          answers[index] =
            essayAnswer;



          total += Number(
            q.maxScore ||
            q.grade ||
            q.points ||
            1
          );



        } else {



          const selected =
            formData.get(
              `question_${index}`
            );



          const answer =
            selected !== null
              ? Number(selected)
              : -1;



          answers[index] =
            answer;



          const questionScore =
            Number(q.score || 1);



          total += questionScore;



          const correct =
            q.correctAnswerIndex !== undefined
              ? Number(q.correctAnswerIndex)
              :
              (
                q.correctAnswer !== undefined
                  ? Number(q.correctAnswer)
                  :
                  Number(q.rightIndex)
              );



          if (answer === correct) {


            score += questionScore;


          }



        }



      });



      const result = {


        studentName,


        examTitle,


        score,


        total,


        answers,


        questions,


        date:
          new Date()
            .toLocaleString(),


        timeSpent: 0


      };



      let oldResults =
        JSON.parse(
          localStorage.getItem("examResults") || "[]"
        );



      oldResults.push(result);



      localStorage.setItem(
        "examResults",
        JSON.stringify(oldResults)
      );



      alert(
        "✅ تم تسليم الامتحان بنجاح"
      );



      const app =
        document.querySelector("#app");



      if (app) {


        app.innerHTML = `

        <div style="
        max-width:600px;
        margin:50px auto;
        padding:30px;
        text-align:center;
        direction:rtl;
        font-family:Cairo;
        background:#0f172a;
        color:white;
        border-radius:20px;
        ">


        <h2>
        📊 نتيجة الامتحان
        </h2>


        <h3>
        ${studentName}
        </h3>


        <p>
        الدرجة:
        <b>${score}</b>
        /
        <b>${total}</b>
        </p>


        <p>
        النسبة:
        <b>
        ${
          total
          ?
          Math.round(
            (score / total) * 100
          )
          :
          0
        }%
        </b>
        </p>


        <button
        onclick="location.reload()"
        style="
        padding:12px 25px;
        border:none;
        border-radius:10px;
        background:#16a34a;
        color:white;
        cursor:pointer;
        "
        >

        العودة

        </button>


        </div>

        `;


      }


    });


  },50);




return `
<div id="examSecureContainer"

style="
max-width:900px;
margin:auto;
padding:30px;
direction:rtl;
font-family:Cairo,sans-serif;
user-select:none;
">


<div style="
background:#0f172a;
color:white;
padding:25px;
border-radius:18px;
margin-bottom:25px;
">


<h2>
📝 ${examTitle}
</h2>



<div>
الطالب :
<b>${studentName}</b>
</div>



</div>





<form id="examSubmitForm">



${
questions.length

?

questions.map((q,index)=>{


const qType =
String(q.type || "")
.toLowerCase()
.trim();



const hasOptions =
Array.isArray(q.options)
&&
q.options.some(
x=>x && String(x).trim() !== ""
);



const isEssay =
qType.includes("essay")
||
qType.includes("مقال")
||
!hasOptions;



return `


<div style="
background:white;
padding:20px;
border-radius:15px;
margin-bottom:20px;
border:1px solid #ddd;
color:#1e293b;
">



<h3>
السؤال ${index+1}
</h3>




<p style="
font-weight:700;
font-size:16px;
">

${q.text || q.question || ""}

</p>





${
q.questionImage || q.image

?

`

<img

src="${
q.questionImage ||
q.image
}"

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






${
isEssay

?

`

<textarea

name="question_${index}"

placeholder="اكتب إجابتك هنا"

style="
width:100%;
height:150px;
padding:15px;
border-radius:10px;
border:1px solid #ccc;
font-family:inherit;
box-sizing:border-box;
resize:vertical;
"

></textarea>


`

:

(q.options || [])

.filter(
op=>op && String(op).trim() !== ""
)

.map((op,i)=>`


<label style="
display:flex;
gap:10px;
padding:12px;
margin:8px 0;
background:#f8fafc;
border-radius:10px;
cursor:pointer;
align-items:center;
">



<input

type="radio"

name="question_${index}"

value="${i}"

style="
width:18px;
height:18px;
cursor:pointer;
"

>



<span>

${op}

</span>



</label>


`)

.join("")


}



</div>


`;

})

.join("")


:

`

<div style="
color:white;
text-align:center;
padding:50px;
">

لا توجد أسئلة

</div>


`

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
font-weight:bold;
"

>


تسليم الامتحان


</button>



</form>

</div>

`;

}

export { examPage as showExam };



function saveExamResult(result) {

  let oldResults =
    JSON.parse(
      localStorage.getItem("examResults") || "[]"
    );


  oldResults.push(result);


  localStorage.setItem(
    "examResults",
    JSON.stringify(oldResults)
  );

}




function calculatePercentage(score,total){

  if(!total) return 0;

  return Math.round(
    (score / total) * 100
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
    q.correctAnswer !== undefined
  ){

    return Number(
      q.correctAnswer
    );

  }



  if(
    q.rightIndex !== undefined
  ){

    return Number(
      q.rightIndex
    );

  }



  return -1;

}




function getQuestionScore(q){


  return Number(

    q.score ||

    q.points ||

    q.grade ||

    q.maxScore ||

    1

  );


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
function finishExam(){

  const app =
    document.querySelector("#app");


  if(app){

    app.innerHTML = `

    <div style="
    max-width:600px;
    margin:50px auto;
    padding:30px;
    background:#0f172a;
    color:white;
    text-align:center;
    border-radius:20px;
    direction:rtl;
    font-family:Cairo;
    ">

    <h2>
    ✅ تم إنهاء الامتحان
    </h2>


    <p>
    تم حفظ إجاباتك بنجاح
    </p>


    <button
    onclick="location.reload()"
    style="
    padding:12px 25px;
    background:#16a34a;
    color:white;
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

}





function showReview(result){


  const app =
    document.querySelector("#app");


  if(!app) return;



  app.innerHTML = `

  <div style="
  max-width:900px;
  margin:auto;
  padding:30px;
  direction:rtl;
  font-family:Cairo;
  ">


  <h2>
  مراجعة الإجابات
  </h2>



  ${
    result.questions.map((q,i)=>`

    <div style="
    background:white;
    padding:20px;
    margin:15px 0;
    border-radius:12px;
    border:1px solid #ddd;
    ">


    <h3>
    السؤال ${i+1}
    </h3>


    <p>
    ${q.text || q.question || ""}
    </p>


    <p>
    إجابتك:
    <b>
    ${
      result.answers[i] ?? "-"
    }
    </b>
    </p>


    </div>


    `).join("")
  }



  </div>

  `;


}




