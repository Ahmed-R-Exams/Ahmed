import {
  getExams,
  deleteExam
} from "../services/examService.js";


import {
  createExamPage,
  setExamToEdit
} from "./createExam.js";


import {
  adminPage
} from "./admin.js";



let examsCache = [];



// ===============================
// PAGE
// ===============================

export function examsListPage(){

return `


<div style="margin-bottom:20px;">

<button id="btnBackToDashboard"

style="
background:rgba(30,41,59,.6);
color:#cbd5e1;
border:1px solid rgba(255,255,255,.08);
padding:10px 18px;
border-radius:12px;
font-weight:700;
cursor:pointer;
font-family:inherit;
">

⬅ الرجوع للوحة التحكم

</button>

</div>




<div style="
background:linear-gradient(135deg,#1e293b,#0f172a);
border-radius:24px;
padding:25px 30px;
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:30px;
border:1px solid rgba(255,255,255,.08);
">


<div>

<h1 style="
color:#f8fafc;
margin:0;
font-size:22px;
">

إدارة الامتحانات

</h1>


<p style="
color:#94a3b8;
">

عرض وتعديل وحذف الامتحانات المنشورة

</p>


</div>


</div>




<div id="firebaseExamsList">

جاري تحميل الامتحانات...

</div>


`;

}





// ===============================
// LOAD ALL EXAMS
// ===============================

export async function loadExamsList(){


const container =
document.querySelector("#firebaseExamsList");


if(!container)
return;



try{


// Firebase

const firebaseExams =
await getExams();



// LocalStorage القديمة

let localExams = [];

try{

localExams =
JSON.parse(
localStorage.getItem("app_exams")
)
||
[];

}catch{

localExams=[];

}



// دمج

examsCache = [

...firebaseExams.map(e=>({
...e,
source:"firebase"
})),

...localExams.map(e=>({
...e,
source:"local"
}))

];





if(!examsCache.length){


container.innerHTML = `

<div style="
padding:40px;
text-align:center;
color:#94a3b8;
">

لا توجد امتحانات

</div>

`;

return;

}




container.innerHTML = examsCache.map(exam=>{


return `


<div style="
background:linear-gradient(135deg,#1e293b,#0f172a);
border-radius:20px;
padding:22px;
margin-bottom:15px;
display:flex;
justify-content:space-between;
align-items:center;
flex-wrap:wrap;
gap:15px;
">



<div>


<div style="margin-bottom:8px;">


<span style="
background:#312e81;
color:#c7d2fe;
padding:5px 12px;
border-radius:8px;
font-size:12px;
">

${exam.className || "عام"}

</span>




<span style="
background:#065f46;
color:#6ee7b7;
padding:5px 12px;
border-radius:8px;
font-size:12px;
margin-right:5px;
">

${exam.subject || "physics"}

</span>


</div>





<h3 style="
color:white;
margin:5px 0;
">

${exam.title || "امتحان بدون اسم"}

</h3>




<p style="
color:#94a3b8;
font-size:13px;
">

المدة:
${exam.duration || 0}
دقائق

|

الأسئلة:
${exam.questions?.length || 0}

</p>



</div>





<div style="
display:flex;
gap:10px;
">



<button

class="editExam"

data-id="${exam.firestoreId || exam.id}"

style="
background:#3730a3;
color:white;
border:none;
padding:8px 14px;
border-radius:10px;
cursor:pointer;
">

تعديل

</button>





<button

class="deleteExam"

data-id="${exam.firestoreId || exam.id}"

data-source="${exam.source}"

style="
background:#991b1b;
color:white;
border:none;
padding:8px 14px;
border-radius:10px;
cursor:pointer;
">

حذف

</button>



</div>



</div>


`;

}).join("");



}
catch(error){


console.error(error);


container.innerHTML = `

<div style="
color:#ef4444;
padding:30px;
">

حدث خطأ في تحميل الامتحانات

</div>

`;

}


}






// ===============================
// EVENTS
// ===============================


document.addEventListener(
"click",
async(e)=>{


const app =
document.querySelector("#app");


if(!app)
return;




if(
e.target.closest("#btnBackToDashboard")
){

app.innerHTML =
adminPage();

return;

}





const edit =
e.target.closest(".editExam");


if(edit){


const id =
edit.dataset.id;


const exam =
examsCache.find(
x =>
String(x.firestoreId || x.id)
===
String(id)
);



if(exam){


setExamToEdit(exam);


app.innerHTML =
createExamPage();


}


return;


}






const del =
e.target.closest(".deleteExam");



if(del){


if(
confirm("هل تريد حذف الامتحان؟")
){


const id =
del.dataset.id;


const source =
del.dataset.source;




if(source==="firebase"){


await deleteExam(id);


}else{


let exams =
JSON.parse(
localStorage.getItem("app_exams")
)
||
[];


exams =
exams.filter(
e =>
String(e.id)
!==
String(id)
);


localStorage.setItem(
"app_exams",
JSON.stringify(exams)
);


}




await loadExamsList();


}



return;


}



});