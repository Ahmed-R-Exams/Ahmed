import {
  createExamPage,
  } from "./createExam.js";
  
  
  import {
  createExamEvents
  } from "./createExamEvents.js";
  
  
  import {
  examsListPage,
  loadExamsList
  } from "./examsList.js";
  
  
  import {
  importExamEvents
  } from "./importExamEvents.js";
  
  
  import {
  adminPage
  } from "./admin.js";
  
  
  
  
  export function manageExamsPage(){
  
  
  return `
  
  <div style="
  padding:20px;
  color:#f8fafc;
  ">
  
  
  <h2>
  📝 إدارة المحتوى
  </h2>
  
  
  <h1>
  إدارة الامتحانات
  </h1>
  
  
  <p style="
  color:#94a3b8;
  ">
  إنشاء وتعديل وتنظيم اختبارات الفيزياء والكيمياء
  </p>
  
  
  
  <button
  id="backAdmin"
  style="
  background:rgba(255,255,255,.07);
  color:#f1f5f9;
  border:1px solid rgba(255,255,255,.15);
  padding:12px 24px;
  border-radius:14px;
  cursor:pointer;
  font-weight:700;
  ">
  
  ⬅ رجوع للوحة التحكم
  
  </button>
  
  
  
  
  <div style="
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:20px;
  margin-top:30px;
  ">
  
  
  
  <div
  id="cardCreateExam"
  style="
  cursor:pointer;
  padding:32px 26px;
  text-align:center;
  border-radius:22px;
  background:rgba(30,41,59,.7);
  border:1px solid rgba(255,255,255,.08);
  ">
  
  <h2>➕</h2>
  
  <h3>
  إنشاء امتحان جديد
  </h3>
  
  <p>
  بناء اختبار كامل بالأسئلة والمدة والتوقيت
  </p>
  
  </div>
  
  
  
  
  <div
  id="cardPublishedExams"
  style="
  cursor:pointer;
  padding:32px 26px;
  text-align:center;
  border-radius:22px;
  background:rgba(30,41,59,.7);
  border:1px solid rgba(255,255,255,.08);
  ">
  
  <h2>📋</h2>
  
  <h3>
  قائمة الامتحانات
  </h3>
  
  <p>
  عرض وتعديل وحذف الاختبارات المنشورة
  </p>
  
  </div>
  
  
  
  
  <div
  id="cardImportQuestions"
  style="
  cursor:pointer;
  padding:32px 26px;
  text-align:center;
  border-radius:22px;
  background:rgba(30,41,59,.7);
  border:1px solid rgba(255,255,255,.08);
  ">
  
  <h2>📥</h2>
  
  <h3>
  استيراد من Excel
  </h3>
  
  <p>
  رفع مجموعة أسئلة دفعة واحدة
  </p>
  
  
  <input
  type="file"
  id="excelFile"
  accept=".xlsx,.xls"
  style="display:none"
  />
  
  
  </div>
  
  
  
  </div>
  
  
  </div>
  
  `;
  
  }
  
  
  
  
  
  
  document.addEventListener(
  "click",
  (e)=>{
  
  
  const app =
  document.querySelector("#app");
  
  
  if(!app)
  return;
  
  
  
  
  
  // فتح إنشاء امتحان
  
  if(
  e.target.closest("#cardCreateExam")
  ){
  
  
  app.innerHTML =
  createExamPage();
  
  
  
  // تشغيل أحداث صفحة الإنشاء
  
  createExamEvents();
  
  
  return;
  
  }
  
  
  
  
  
  // قائمة الامتحانات
  
  if(
  e.target.closest("#cardPublishedExams")
  ){
  
  
  app.innerHTML =
  examsListPage();
  
  
  loadExamsList();
  
  
  return;
  
  
  }
  
  
  
  
  
  // Excel
  
  if(
  e.target.closest("#cardImportQuestions")
  ){
  
  
  const input =
  document.querySelector("#excelFile");
  
  
  if(input){
  
  importExamEvents();
  
  input.click();
  
  }
  
  
  return;
  
  
  }
  
  
  
  
  
  // رجوع لوحة التحكم
  
  if(
  e.target.closest("#backAdmin")
  ){
  
  
  app.innerHTML =
  adminPage();
  
  
  return;
  
  
  }
  
  
  
  });
  
  
  
  
  
  export function manageExamsEvents(){
  
  }