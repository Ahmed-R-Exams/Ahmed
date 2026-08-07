
// pages/teacherLoginModal.js

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase.js";

import { adminPage } from "./admin.js";
import { homePage } from "./home.js";



export function teacherLoginPage() {

return `

<div style="
background:#111827;
padding:40px;
border-radius:25px;
max-width:420px;
margin:auto;
box-shadow:0 20px 40px rgba(0,0,0,.35);
position:relative;
direction:rtl;
">


<div style="
font-size:45px;
margin-bottom:15px;
background:rgba(59,130,246,.15);
width:85px;
height:85px;
display:inline-flex;
align-items:center;
justify-content:center;
border-radius:22px;
">
🔐
</div>


<h2 style="
color:white;
margin-bottom:8px;
font-size:26px;
font-weight:800;
">
Teacher Login
</h2>


<p style="
color:#94a3b8;
font-size:15px;
margin-bottom:30px;
">
تسجيل دخول المعلم للوحة التحكم
</p>



<form id="teacherLoginForm"
style="
display:flex;
flex-direction:column;
gap:18px;
">


<input
type="email"
id="teacherEmail"
placeholder="Email"
required
style="
padding:14px;
border-radius:14px;
border:1px solid #334155;
background:#0f172a;
color:white;
font-size:16px;
"
/>



<input
type="password"
id="teacherPassword"
placeholder="Password"
required
style="
padding:14px;
border-radius:14px;
border:1px solid #334155;
background:#0f172a;
color:white;
font-size:16px;
"
/>



<button
type="submit"
style="
background:#3b82f6;
color:white;
border:none;
padding:14px;
border-radius:14px;
font-weight:bold;
cursor:pointer;
font-size:16px;
"
>
Login
</button>


</form>



<div
id="loginError"
style="
margin-top:15px;
font-weight:bold;
"
></div>



<button
id="backHomeBtnFromLogin"
style="
margin-top:25px;
background:transparent;
color:#94a3b8;
border:none;
cursor:pointer;
"
>
⬅ Back To Home
</button>


</div>

`;

}





export function teacherLoginEvents(){

const app =
document.querySelector("#app");



document.addEventListener(
"submit",
async (e)=>{


if(
!e.target.closest("#teacherLoginForm")
)
return;



e.preventDefault();



const email =
document
.querySelector("#teacherEmail")
.value
.trim();



const password =
document
.querySelector("#teacherPassword")
.value;



const errorDiv =
document.querySelector("#loginError");



try{


await signInWithEmailAndPassword(
auth,
email,
password
);



app.innerHTML =
adminPage();



}
catch(error){


if(errorDiv){

errorDiv.textContent =
"❌ البريد أو كلمة المرور غير صحيحة";

errorDiv.style.color =
"#ef4444";

}


}



});






document.addEventListener(
"click",
async (e)=>{


if(
e.target.closest("#backHomeBtnFromLogin")
){

app.innerHTML =
homePage();

}



if(
e.target.closest("#teacherLogout")
){

await signOut(auth);

app.innerHTML =
homePage();

}


});

}