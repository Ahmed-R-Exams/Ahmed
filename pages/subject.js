import { classesPage } from "./classes.js";
import { physicsPage } from "./physics.js";
import { chemistryPage } from "./chemistry.js";


export function subjectPage(){

const currentClass =
localStorage.getItem("currentClass") || "الصف الدراسي";


return `

<style>

.subject-page{

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



.subject-container{

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

color:white;

border-color:#79B8FF;

}



.subject-header{

background:#111A2C;

border:1px solid rgba(121,184,255,.18);

border-radius:24px;

padding:45px 30px;

text-align:center;

margin:35px 0;

box-shadow:0 20px 40px rgba(0,0,0,.35);

}



.class-badge{

display:inline-block;

background:rgba(121,184,255,.15);

color:#79B8FF;

padding:8px 18px;

border-radius:12px;

font-weight:700;

font-size:14px;

border:1px solid rgba(121,184,255,.25);

}



.subject-header h1{

color:white;

font-size:32px;

font-weight:900;

margin:20px 0 10px;

}



.subject-header p{

color:#8A96AD;

font-size:16px;

}



.subject-grid{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(280px,1fr));

gap:25px;

}



.subject-card{

background:#111A2C;

border:1px solid rgba(121,184,255,.18);

border-radius:22px;

padding:40px 25px;

text-align:center;

cursor:pointer;

transition:.3s;

}



.subject-card:hover{

transform:translateY(-7px);

box-shadow:0 20px 40px rgba(94,164,255,.15);

}



.subject-icon{

width:70px;

height:70px;

margin:auto;

border-radius:20px;

display:flex;

align-items:center;

justify-content:center;

font-size:32px;

}



.physics{

background:rgba(94,164,255,.15);

color:#79B8FF;

}



.chemistry{

background:rgba(255,143,84,.15);

color:#FF8F54;

}



.subject-card h3{

color:white;

font-size:23px;

margin:20px 0 10px;

}



.subject-card p{

color:#8A96AD;

font-size:15px;

line-height:1.7;

}



</style>



<div class="subject-page">

<div class="subject-container">


<button class="back-btn" id="backToClassesBtn">

← تغيير الصف الدراسي

</button>



<div class="subject-header">


<div class="class-badge">

${currentClass}

</div>


<h1>

اختر المادة الدراسية

</h1>


<p>

حدد المادة للوصول إلى المحتوى والامتحانات

</p>


</div>




<div class="subject-grid">


<div class="subject-card" id="selectPhysicsBtn">


<div class="subject-icon physics">

⚛️

</div>


<h3>

الفيزياء

</h3>


<p>

محاضرات - سبورات - امتحانات - مراجعات

</p>


</div>




<div class="subject-card" id="selectChemistryBtn">


<div class="subject-icon chemistry">

🧪

</div>


<h3>

الكيمياء

</h3>


<p>

شرح - تفاعلات - تدريبات - اختبارات

</p>


</div>



</div>


</div>

</div>


`;

}




document.addEventListener("click",(e)=>{


const app=document.querySelector("#app");

if(!app)return;



if(e.target.closest("#selectPhysicsBtn")){


localStorage.setItem(
"currentSubject",
"physics"
);


app.innerHTML=physicsPage();

return;

}




if(e.target.closest("#selectChemistryBtn")){


localStorage.setItem(
"currentSubject",
"chemistry"
);


app.innerHTML=chemistryPage();

return;

}




if(e.target.closest("#backToClassesBtn")){


app.innerHTML=classesPage();

return;

}


});