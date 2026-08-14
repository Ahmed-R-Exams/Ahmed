// pages/admin.js

import { manageExamsPage } from "./manageExams.js";
import { manageExamsEvents } from "./manageExamsEvents.js";
import { teacherBoardsPage } from "./TeacherBoards.js";
import { resultsPage } from "./results.js";
import { homePage } from "./home.js";

import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";


export function adminPage() {

return `

<div style="
background:linear-gradient(135deg,#090d16,#1e293b);
padding:50px 40px;
border-radius:32px;
color:white;
margin-bottom:45px;
display:flex;
justify-content:space-between;
align-items:center;
flex-wrap:wrap;
">

<div>

<h1 style="
color:white;
margin:0;
">
مرحباً بك، أستاذ أحمد 👨‍🏫
</h1>

<p style="
color:#94a3b8;
">
Ahmed.R Physics Platform
</p>

</div>


<button id="backHome"

style="
padding:14px 25px;
border-radius:16px;
cursor:pointer;
">

🚪 الرئيسية

</button>


</div>




<div class="cards"

style="
display:grid;
grid-template-columns:repeat(auto-fit,minmax(340px,1fr));
gap:30px;
">



<div class="menu-card"
id="cardManageExams">

📝

<h3>
إدارة الامتحانات
</h3>

<p>
إنشاء وتعديل ونشر الامتحانات
</p>

</div>




<div class="menu-card"
id="cardManageTeacherBoards">

📚

<h3>
إدارة السبورات والملفات
</h3>

<p>
رفع الملفات التعليمية
</p>

</div>





<div class="menu-card"
id="cardShowResults">

📊

<h3>
النتائج
</h3>

<p>
متابعة نتائج الطلاب
</p>

</div>



</div>

`;

}




document.addEventListener(
"click",
async (e)=>{


const app =
document.querySelector("#app");


if(!app)
return;



// الامتحانات

if(
    e.target.closest("#cardManageExams")
    ){
    
    app.innerHTML =
    manageExamsPage();
    
    manageExamsEvents();
    
    return;
    
    }



// السبورات

if(
e.target.closest("#cardManageTeacherBoards")
){

app.innerHTML =
teacherBoardsPage();

return;

}



// النتائج

if(
e.target.closest("#cardShowResults")
){

try{

app.innerHTML = `
<div style="
padding:50px;
color:white;
text-align:center;
">
⏳ جاري تحميل النتائج...
</div>
`;


const html =
await resultsPage();


app.innerHTML =
html;


}
catch(err){

console.error(err);


app.innerHTML = `

<div style="
padding:50px;
color:red;
">

خطأ في صفحة النتائج

<br>

${err.message}

</div>

`;

}


return;

}




// رجوع للرئيسية (تسجيل خروج فعلي من Firebase)

if(
e.target.closest("#backHome")
){

signOut(auth).catch((err) => {
console.error("Sign out error:", err);
});


app.innerHTML =
homePage();


return;

}



});



export function adminEvents(){}