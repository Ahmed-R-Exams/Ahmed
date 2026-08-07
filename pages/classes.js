import { homePage } from "./home.js";
import { subjectPage } from "./subject.js";


window.selectGrade = function(gradeName) {

  localStorage.setItem("currentClass", gradeName);
  localStorage.setItem("currentGrade", gradeName);

  localStorage.removeItem("filtered_exams");

  const app = document.querySelector("#app");

  if(app){
    app.innerHTML = subjectPage();
  }

};


window.goBackHome = function(){

  const app = document.querySelector("#app");

  if(app){
    app.innerHTML = homePage();
  }

};



export function classesPage(){

return `

<style>

.classes-page{

min-height:100vh;

background:
linear-gradient(
rgba(8,11,20,.96),
rgba(8,11,20,.96)
),

repeating-linear-gradient(
0deg,
rgba(94,164,255,.05) 0px,
transparent 1px,
transparent 38px
),

repeating-linear-gradient(
90deg,
rgba(94,164,255,.05) 0px,
transparent 1px,
transparent 38px
);

font-family:'Cairo','Tajawal',sans-serif;

direction:rtl;

padding:40px 20px;

}



.classes-container{

max-width:900px;

margin:auto;

}



.back-btn{

background:#111A2C;

color:#B3BDD1;

border:1px solid rgba(121,184,255,.25);

padding:12px 22px;

border-radius:14px;

cursor:pointer;

font-family:inherit;

font-weight:700;

transition:.3s;

}


.back-btn:hover{

transform:translateY(-3px);

border-color:#79B8FF;

color:white;

}



.classes-header{

background:#111A2C;

border:1px solid rgba(121,184,255,.18);

border-radius:24px;

padding:45px 30px;

text-align:center;

margin:35px 0;

box-shadow:0 20px 40px rgba(0,0,0,.35);

}



.classes-icon{

width:85px;

height:85px;

margin:auto;

border-radius:25px;

display:flex;

align-items:center;

justify-content:center;

font-size:35px;

color:#79B8FF;

background:rgba(94,164,255,.15);

border:1px solid rgba(121,184,255,.25);

}



.classes-header h1{

color:white;

font-size:32px;

margin:20px 0 10px;

font-weight:900;

}



.classes-header p{

color:#8A96AD;

font-size:16px;

}



.grade-grid{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(280px,1fr));

gap:25px;

}



.grade-card{

background:#111A2C;

border:1px solid rgba(121,184,255,.18);

border-radius:22px;

padding:40px 25px;

text-align:center;

cursor:pointer;

transition:.3s;

}



.grade-card:hover{

transform:translateY(-7px);

border-color:#79B8FF;

box-shadow:0 20px 40px rgba(94,164,255,.15);

}



.grade-icon{

width:65px;

height:65px;

margin:auto;

border-radius:18px;

display:flex;

align-items:center;

justify-content:center;

font-size:28px;

}



.second{

background:rgba(94,164,255,.15);

color:#79B8FF;

}



.third{

background:rgba(255,143,84,.15);

color:#FF8F54;

}



.grade-card h3{

color:white;

font-size:22px;

margin:20px 0 10px;

}



.grade-card p{

color:#8A96AD;

font-size:14px;

line-height:1.7;

}



</style>



<div class="classes-page">

<div class="classes-container">


<button class="back-btn" onclick="goBackHome()">

← العودة للرئيسية

</button>



<div class="classes-header">


<div class="classes-icon">

🎓

</div>


<h1>

اختر الصف الدراسي

</h1>


<p>

حدد صفك للوصول إلى المواد والامتحانات

</p>


</div>




<div class="grade-grid">



<div class="grade-card"

onclick="selectGrade('الصف الثاني الثانوي')">


<div class="grade-icon second">

📘

</div>


<h3>

الصف الثاني الثانوي

</h3>


<p>

محتوى الفصل الدراسي والامتحانات والمراجعات

</p>


</div>






<div class="grade-card"

onclick="selectGrade('الصف الثالث الثانوي')">


<div class="grade-icon third">

🏆

</div>


<h3>

الصف الثالث الثانوي

</h3>


<p>

مراجعات الثانوية العامة والاختبارات النهائية

</p>


</div>



</div>



</div>

</div>


`;

}