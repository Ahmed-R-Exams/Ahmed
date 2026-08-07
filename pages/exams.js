export function examsPage() {

  const allExams =
    JSON.parse(localStorage.getItem("app_exams") || "[]");


  const currentClass =
    localStorage.getItem("currentClass") ||
    localStorage.getItem("currentGrade") ||
    "";


  const currentSubject =
    localStorage.getItem("currentSubject") ||
    "physics";


  const normalize = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");



  const filteredExams = allExams.filter(exam => {


    const examClass =
    normalize(
      exam.className ||
      exam.grade ||
      exam.class ||
      ""
    );


    const examSubject =
    normalize(
      exam.subject ||
      exam.sub ||
      "physics"
    );



    const selectedClass =
    normalize(currentClass);


    const selectedSubject =
    normalize(currentSubject);



    const classMatch =
    !selectedClass ||
    examClass.includes(selectedClass) ||
    selectedClass.includes(examClass);



    const subjectMatch =
    examSubject === selectedSubject ||
    (
      selectedSubject === "physics" &&
      examSubject === ""
    );



    return classMatch && subjectMatch;


  });





  const completedExams =
  JSON.parse(
    localStorage.getItem("completedExams") || "[]"
  );



  let examsContent = "";




  if(filteredExams.length === 0){


    examsContent = `

    <div style="
    text-align:center;
    padding:50px 20px;
    background:#1e293b;
    border-radius:20px;
    color:white;
    ">


    <h3>
    لا توجد اختبارات متاحة
    </h3>


    </div>

    `;


  }

  else {



    examsContent = `


    <div style="
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
    gap:20px;
    ">


    ${
    filteredExams.map((exam,index)=>{


      const examId =
      exam.id || `exam_${index}`;



      const isCompleted =
      completedExams.includes(examId);



      const endDateTime =
      exam.endDate
      ? new Date(exam.endDate).getTime()
      : null;



      const isClosed =
      exam.manualClose === true ||
      exam.manualClose === "true" ||
      (
        endDateTime &&
        Date.now() > endDateTime
      );



      const examDataString =
      encodeURIComponent(
        JSON.stringify({
          ...exam,
          id:examId
        })
      );



      return `


      <div style="
      background:#1e293b;
      padding:22px;
      border-radius:20px;
      ">


      <h3 style="
      color:white;
      ">
      ${exam.title || "اختبار"}
      </h3>



      <p style="
      color:#94a3b8;
      ">
      ${exam.className || currentClass}
      </p>



      <p style="
      color:#94a3b8;
      ">
      عدد الأسئلة:
      ${exam.questions?.length || 0}
      </p>




      ${
      isCompleted

      ?

      `
      <div style="
      background:#065f46;
      padding:12px;
      border-radius:10px;
      text-align:center;
      color:white;
      ">
      تم التسليم
      </div>
      `


      :


      isClosed


      ?

      `
      <div style="
      background:#7f1d1d;
      padding:12px;
      border-radius:10px;
      text-align:center;
      color:white;
      ">
      الامتحان مغلق
      </div>
      `


      :


      `

      <button
      class="goToLoginBtn"
      data-exam-json="${examDataString}"
      style="
      width:100%;
      padding:12px;
      background:#6366f1;
      color:white;
      border:none;
      border-radius:12px;
      cursor:pointer;
      ">

      ابدأ الاختبار

      </button>

      `

      }



      </div>


      `;


    }).join("")
    }


    </div>


    `;


  }




  return `


  <div style="
  min-height:100vh;
  background:#0f172a;
  padding:40px 20px;
  direction:rtl;
  font-family:Cairo;
  ">


  <div style="
  max-width:950px;
  margin:auto;
  ">



  <button
  id="backToHomeMainBtn"
  style="
  padding:10px 18px;
  border-radius:12px;
  cursor:pointer;
  ">

  الرئيسية

  </button>



  <h1 style="
  color:white;
  text-align:center;
  margin:30px;
  ">

  قائمة الاختبارات المتاحة

  </h1>



  ${examsContent}



  </div>


  </div>


  `;

}

export function studentLoginPage(){

  return `
  
  <div style="
  min-height:100vh;
  background:#0f172a;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  direction:rtl;
  font-family:Cairo;
  ">
  
  
  <div style="
  background:#1e293b;
  padding:40px;
  border-radius:25px;
  width:100%;
  max-width:420px;
  text-align:center;
  ">
  
  
  <h2 style="
  color:white;
  ">
  
  تسجيل دخول الطالب
  
  </h2>
  
  
  
  <input
  id="loginStudentNameInput"
  type="text"
  placeholder="اكتب الاسم الثلاثي"
  style="
  width:100%;
  padding:15px;
  margin:20px 0;
  border-radius:12px;
  background:#0f172a;
  color:white;
  border:1px solid #334155;
  box-sizing:border-box;
  font-family:Cairo;
  ">
  
  
  
  <button
  id="submitLoginBtn"
  style="
  width:100%;
  padding:15px;
  background:#6366f1;
  color:white;
  border:none;
  border-radius:12px;
  cursor:pointer;
  font-weight:bold;
  ">
  
  دخول وبدء الاختبار
  
  </button>
  
  
  
  </div>
  
  </div>
  
  `;
  
  }
  
  
  
  
  
  
  document.addEventListener("click",(e)=>{
  
  
  const app =
  document.querySelector("#app");
  
  
  if(!app)
  return;
  
  
  
  
  
  // زر الرئيسية
  
  const backMainBtn =
  e.target.closest("#backToHomeMainBtn");
  
  
  
  if(backMainBtn){
  
  location.reload();
  
  return;
  
  }
  
  
  
  
  
  
  
  // زر ابدأ الاختبار
  
  const loginBtn =
  e.target.closest(".goToLoginBtn");
  
  
  
  if(loginBtn){
  
  
  
  const examJson =
  loginBtn.getAttribute(
  "data-exam-json"
  );
  
  
  
  localStorage.setItem(
  "currentSelectedExam",
  examJson
  );
  
  
  
  app.innerHTML =
  studentLoginPage();
  
  
  
  return;
  
  }
  
  
  
  
  
  
  
  
  // تسجيل دخول الطالب
  
  const submitBtn =
  e.target.closest("#submitLoginBtn");
  
  
  
  if(submitBtn){
  
  
  
  const input =
  document.getElementById(
  "loginStudentNameInput"
  );
  
  
  
  const name =
  input.value.trim();
  
  
  
  
  if(!name){
  
  
  alert("اكتب اسم الطالب");
  
  
  return;
  
  }
  
  
  
  
  
  const examJson =
  localStorage.getItem(
  "currentSelectedExam"
  );
  
  
  
  
  if(!examJson)
  return;
  
  
  
  
  const exam =
  JSON.parse(
  decodeURIComponent(examJson)
  );
  
  
  
  
  
  // منع إعادة الامتحان
  
  const results =
  JSON.parse(
  localStorage.getItem("examResults") || "[]"
  );
  
  
  
  
  const alreadyDone =
  results.some(r =>
  
  String(r.examId) === String(exam.id)
  
  &&
  
  r.studentName === name
  
  );
  
  
  
  
  if(alreadyDone){
  
  
  
  alert(
  "لقد سبق لك أداء هذا الاختبار"
  );
  
  
  
  return;
  
  }
  
  
  
  
  
  localStorage.setItem(
  "studentName",
  name
  );
  
  
  
  
  launchExamView(exam);
  
  
  
  return;
  
  }
  
  
  
  
  
  
  
  
  // اختيار الإجابة
  
  const option =
  e.target.closest(".option-label");
  
  
  
  if(option){
  
  
  
  const box =
  option.closest(
  ".options-container"
  );
  
  
  
  box.querySelectorAll(
  ".option-label"
  )
  .forEach(item=>{
  
  
  item.style.background =
  "#334155";
  
  
  });
  
  
  
  
  option.style.background =
  "#6366f1";
  
  
  
  const radio =
  option.querySelector(
  "input[type='radio']"
  );
  
  
  
  if(radio)
  radio.checked=true;
  
  
  
  
  return;
  
  }
  
  
  
  
  
  // زر العودة بعد التسليم
  
  const backHomeAfterExam =
  e.target.closest(
  "#backHomeAfterExam"
  );
  
  
  
  if(backHomeAfterExam){
  
  
  localStorage.removeItem(
  "currentSelectedExam"
  );
  
  
  
  localStorage.removeItem(
  "studentName"
  );
  
  
  
  location.reload();
  
  
  
  return;
  
  }
  
  
  
  
  
  
  
  // إرسال الامتحان
  
  const submitExam =
  e.target.closest(
  "#submitExamBtn"
  );
  
  
  
  if(submitExam){
  
  
  const examJson =
  localStorage.getItem(
  "currentSelectedExam"
  );
  
  
  
  if(!examJson)
  return;
  
  
  
  const exam =
  JSON.parse(
  decodeURIComponent(examJson)
  );
  
  
  
  const studentName =
  localStorage.getItem(
  "studentName"
  )
  ||
  "طالب";
  
  
  
  let score = 0;
  
  let total = 0;
  
  
  
  exam.questions.forEach((q,index)=>{
  
  
  const selected =
  document.querySelector(
  `input[name="question_${index}"]:checked`
  );
  
  
  
  const answer =
  selected
  ?
  Number(selected.value)
  :
  null;
  
  
  
  const mark =
  Number(q.score || 1);
  
  
  
  total += mark;
  
  
  
  if(
  answer !== null &&
  answer === Number(q.correctAnswerIndex)
  ){
  
  score += mark;
  
  }
  
  
  
  });
  
  
  
  
  
  const results =
  JSON.parse(
  localStorage.getItem("examResults") || "[]"
  );
  
  
  
  
  
  results.push({
  
  studentName,
  
  examId:exam.id,
  
  examTitle:
  exam.title || "اختبار",
  
  score,
  
  total,
  
  date:
  new Date().toLocaleString()
  
  });
  
  
  
  
  
  localStorage.setItem(
  "examResults",
  JSON.stringify(results)
  );
  
  
  
  
  
  app.innerHTML = `
  
  <div style="
  min-height:100vh;
  background:#0f172a;
  display:flex;
  align-items:center;
  justify-content:center;
  direction:rtl;
  font-family:Cairo;
  color:white;
  ">
  
  
  <div style="
  background:#1e293b;
  padding:40px;
  border-radius:20px;
  text-align:center;
  ">
  
  
  <h2>
  ✅ تم إرسال الاختبار بنجاح
  </h2>
  
  
  <button
  id="backHomeAfterExam"
  style="
  margin-top:20px;
  padding:15px 30px;
  background:#6366f1;
  color:white;
  border:none;
  border-radius:12px;
  cursor:pointer;
  ">
  
  العودة للصفحة الرئيسية
  
  </button>
  
  
  
  </div>
  
  
  </div>
  
  `;
  
  
  
  return;
  
  }
  
  
  
  });

  function launchExamView(exam){


    const app =
    document.querySelector("#app");
    
    
    
    const studentName =
    localStorage.getItem(
    "studentName"
    )
    ||
    "طالب";
    
    
    
    app.innerHTML = `
    
    
    <div style="
    min-height:100vh;
    background:#0f172a;
    color:white;
    padding:30px;
    direction:rtl;
    font-family:Cairo;
    ">
    
    
    
    <h2>
    ${exam.title || "اختبار"}
    </h2>
    
    
    
    <p>
    الطالب: ${studentName}
    </p>
    
    
    
    
    ${
    exam.questions.map((q,i)=>`
    
    
    <div style="
    background:#1e293b;
    padding:20px;
    margin-bottom:20px;
    border-radius:15px;
    ">
    
    
    
    <h3>
    س${i+1}: ${q.text || ""}
    </h3>
    
    
    
    
    
    <div class="options-container">
    
    
    
    ${
    q.options.map((op,j)=>`
    
    
    <label
    class="option-label"
    style="
    display:block;
    padding:12px;
    margin:8px 0;
    background:#334155;
    border-radius:10px;
    cursor:pointer;
    transition:.2s;
    ">
    
    
    
    <input
    type="radio"
    name="question_${i}"
    value="${j}"
    style="
    margin-left:8px;
    ">
    
    
    
    ${op}
    
    
    
    </label>
    
    
    `).join("")
    }
    
    
    
    </div>
    
    
    
    </div>
    
    
    
    `).join("")
    }
    
    
    
    
    <button
    id="submitExamBtn"
    style="
    width:100%;
    padding:15px;
    background:#10b981;
    color:white;
    border:none;
    border-radius:12px;
    font-weight:bold;
    cursor:pointer;
    font-family:Cairo;
    ">
    
    إرسال وإنهاء الاختبار
    
    </button>
    
    
    
    </div>
    
    
    
    `;
    
    }