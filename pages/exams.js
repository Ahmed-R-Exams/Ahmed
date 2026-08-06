// 1. عرض قائمة الاختبارات المتاحة بمربعات أصغر وتصميم أنيق مع زر الرجوع
export function examsPage() {
  const allExams =
  JSON.parse(localStorage.getItem("app_exams") || "[]");

const currentClass =
  localStorage.getItem("currentClass") ||
  "الصف الثالث الثانوي";

const currentSubject =
  localStorage.getItem("currentSubject") ||
  "physics";


const filteredExams = allExams.filter(exam => {

  const examClass =
    (exam.className || exam.grade || "")
    .trim();

  const examSubject =
    (exam.subject || "physics")
    .toLowerCase();


  return (
    examClass === currentClass &&
    examSubject === currentSubject.toLowerCase()
  );

});
  const completedExams = JSON.parse(localStorage.getItem("completedExams") || "[]");

  let examsContent = "";
  if (filteredExams.length === 0) {
    examsContent = `
      <div style="text-align: center; padding: 50px 20px; color: #94a3b8; background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.06); box-shadow: 0 20px 40px rgba(0,0,0,0.3); max-width: 600px; margin: 0 auto;">
        <div style="width: 70px; height: 70px; background: rgba(99, 102, 241, 0.1); color: #818cf8; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 15px auto; border: 1px solid rgba(255,255,255,0.08);">
          <i class="fa-solid fa-folder-open"></i>
        </div>
        <p style="font-size: 18px; margin: 0; font-weight: 700; color: #f8fafc;">لا توجد اختبارات مضافة حالياً لهذا الصف.</p>
        <p style="font-size: 14px; margin: 6px 0 0 0; color: #64748b;">يرجى العودة لاحقاً أو التحقق من المعلم.</p>
      </div>
    `;
  } else {
    examsContent = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; justify-content: center;">
        ${filteredExams.map((exam, index) => {
          const examId = exam.id || `exam_${index}`;
          const isCompleted = completedExams.includes(examId);
          
          // فحص حالة الإغلاق (يدوي أو انتهاء الوقت)
          const now = new Date().getTime();
          const endDateTime = exam.endDate ? new Date(exam.endDate).getTime() : null;
          const isManuallyClosed = exam.manualClose === true || exam.manualClose === "true";
          const isTimeExpired = endDateTime && now > endDateTime;
          const isClosed = isManuallyClosed || isTimeExpired;

          const examDataString = encodeURIComponent(JSON.stringify({ ...exam, id: examId }));
          const questionsCount = exam.questions ? exam.questions.length : 0;
          
          return `
          <div style="
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 22px;
            border-radius: 20px;
            border: 1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.3)' : isClosed ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.08)'};
            box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          ">
            
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <span style="background: rgba(99, 102, 241, 0.15); color: #818cf8; font-size: 11px; padding: 5px 12px; border-radius: 10px; font-weight: 700; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 5px;">
                  <i class="fa-solid fa-graduation-cap"></i> ${currentClass}
                </span>
                <div style="width: 34px; height: 34px; background: ${isCompleted ? 'rgba(16, 185, 129, 0.15)' : isClosed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.1)'}; color: ${isClosed ? '#ef4444' : '#10b981'}; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 1px solid ${isClosed ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'};">
                  <i class="fa-solid ${isCompleted ? 'fa-check' : isClosed ? 'fa-lock' : 'fa-file-pen'}"></i>
                </div>
              </div>

              <h3 style="color: #f8fafc; font-size: 18px; font-weight: 800; margin: 0 0 10px 0; line-height: 1.35;">${exam.title || 'اختبار رقم ' + (index + 1)}</h3>
              
              <div style="display: flex; align-items: center; gap: 6px; color: #94a3b8; font-size: 13px; font-weight: 600; margin-bottom: 20px;">
                <i class="fa-solid fa-list-check" style="color: #6366f1;"></i>
                <span>عدد الأسئلة: <strong style="color: #f8fafc;">${questionsCount} أسئلة</strong></span>
              </div>
            </div>
            
            ${isCompleted ? `
              <div style="width: 100%; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 12px; font-size: 14px; font-weight: 700; border-radius: 12px; text-align: center;">
                <i class="fa-solid fa-circle-check" style="margin-left: 5px;"></i> تم تسليمه مسبقاً
              </div>
            ` : isClosed ? `
              <div style="width: 100%; background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 12px; font-size: 14px; font-weight: 700; border-radius: 12px; text-align: center;">
                <i class="fa-solid fa-lock" style="margin-left: 5px;"></i> ${isManuallyClosed ? 'مغلق من قبل المعلم' : 'انقى وقت الامتحان'}
              </div>
            ` : `
              <button class="goToLoginBtn" data-exam-json="${examDataString}" style="
                width: 100%; background: linear-gradient(135deg, #6366f1, #4f46e5);
                color: #fff; border: none; padding: 12px; font-size: 14px;
                font-weight: 700; border-radius: 12px; cursor: pointer;
                box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.4);
                transition: all 0.2s ease; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px;
              " onmouseover="this.style.filter='brightness(1.1)';" onmouseout="this.style.filter='brightness(1)';">
                <span>ابدأ الاختبار الآن</span>
                <i class="fa-solid fa-arrow-left-long" style="font-size: 12px;"></i>
              </button>
            `}
          </div>
        `;}).join('')}
      </div>
    `;
  }

  return `
  <div style="
    min-height: 100vh;
    background: #0f172a;
    background-image: 
      radial-gradient(at 10% 20%, rgba(79, 70, 229, 0.15) 0px, transparent 40%),
      radial-gradient(at 90% 80%, rgba(16, 185, 129, 0.1) 0px, transparent 40%);
    font-family: 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif;
    padding: 50px 20px;
    direction: rtl;
  ">
    <div style="max-width: 950px; margin: 0 auto;">
      
      <!-- زر الرجوع للصفحة الرئيسية -->
      <div style="margin-bottom: 20px;">
        <button id="backToHomeMainBtn" style="
          background: rgba(30, 41, 59, 0.7);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        " onmouseover="this.style.background='rgba(99, 102, 241, 0.2)'; this.style.color='#f8fafc'; this.style.borderColor='rgba(99, 102, 241, 0.4)';" onmouseout="this.style.background='rgba(30, 41, 59, 0.7)'; this.style.color='#cbd5e1'; this.style.borderColor='rgba(255, 255, 255, 0.08)';">
          <i class="fa-solid fa-house" style="color: #818cf8;"></i>
          <span>الرئيسية</span>
        </button>
      </div>

      <!-- ترويسة الصفحة الفاخرة -->
      <div style="
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 24px;
        padding: 35px 30px;
        color: #ffffff;
        text-align: center;
        margin-bottom: 35px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
        position: relative;
        overflow: hidden;
      ">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #6366f1, #10b981, #6366f1);"></div>
        
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 55px; height: 55px; background: rgba(99, 102, 241, 0.15); color: #818cf8; border-radius: 16px; font-size: 24px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);">
          <i class="fa-solid fa-award"></i>
        </div>

        <h1 style="font-size: 30px; font-weight: 900; margin: 0 0 8px 0; color: #f8fafc; letter-spacing: -0.5px;">قائمة الاختبارات المتاحة</h1>
        <p style="color: #94a3b8; font-size: 15px; margin: 0; font-weight: 500;">اختر الاختبار المناسب وابدأ رحلة التميز الآن</p>
      </div>

      ${examsContent}
    </div>
  </div>
  `;
}

// 2. صفحة تسجيل دخول الطالب
export function studentLoginPage() {
  return `
  <div style="
    min-height: 100vh;
    background: #0f172a;
    background-image: 
      radial-gradient(at 10% 20%, rgba(79, 70, 229, 0.18) 0px, transparent 40%),
      radial-gradient(at 90% 80%, rgba(16, 185, 129, 0.12) 0px, transparent 40%);
    font-family: 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    direction: rtl;
  ">
    <div style="
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.9));
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 45px 35px;
      border-radius: 28px;
      width: 100%; max-width: 420px;
      text-align: center;
      box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7);
    ">
      <div style="
        width: 70px; height: 70px; background: rgba(99, 102, 241, 0.15);
        color: #818cf8; border-radius: 20px; display: flex; align-items: center;
        justify-content: center; font-size: 28px; margin: 0 auto 20px auto;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 12px 25px -6px rgba(99, 102, 241, 0.4);
      "><i class="fa-solid fa-user-lock"></i></div>
      
      <h2 style="color: #f8fafc; font-size: 24px; font-weight: 900; margin: 0 0 8px 0;">تسجيل دخول الطالب</h2>
      <p style="color: #94a3b8; font-size: 14px; margin: 0 0 25px 0;">أدخل اسمك الثلاثي للمتابعة وبدء الاختبار</p>
      
      <input type="text" id="loginStudentNameInput" placeholder="اكتب اسمك الثلاثي هنا..." style="
        width: 100%; padding: 15px 18px; background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 14px;
        color: #fff; font-size: 15px; outline: none; margin-bottom: 20px;
        font-family: inherit; box-sizing: border-box; text-align: right;
        transition: all 0.2s;
      " onfocus="this.style.borderColor='#6366f1'; this.style.boxShadow='0 0 0 4px rgba(99,102,241,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.12)'; this.style.boxShadow='none';">
      
      <button id="submitLoginBtn" style="
        width: 100%; background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: #fff; border: none; padding: 15px; font-size: 15px;
        font-weight: 700; border-radius: 14px; cursor: pointer;
        box-shadow: 0 12px 30px -6px rgba(99, 102, 241, 0.5); font-family: inherit;
        transition: all 0.25s ease;
      " onmouseover="this.style.filter='brightness(1.1)';" onmouseout="this.style.filter='brightness(1)';">دخول وبدء الاختبار</button>
    </div>
  </div>
  `;
}

// 3. تفعيل الحماية القصوى ضد النسخ والغش على مستوى الصفحة بالكامل
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("cut", (e) => e.preventDefault());
document.addEventListener("paste", (e) => e.preventDefault());
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("selectstart", (e) => e.preventDefault());

// 4. إدارة الأحداث والتنقل باستخدام Event Delegation
document.addEventListener("click", (e) => {
  const app = document.querySelector("#app");
  if (!app) return;

  const backMainBtn = e.target.closest("#backToHomeMainBtn");
  if (backMainBtn) {
    location.reload();
    return;
  }

  const loginBtn = e.target.closest(".goToLoginBtn");
  if (loginBtn) {
    const examJson = loginBtn.getAttribute("data-exam-json");
    const examData = JSON.parse(decodeURIComponent(examJson));
    
    // التحقق المزدوج قبل فتح صفحة تسجيل الدخول
    const now = new Date().getTime();
    const endDateTime = examData.endDate ? new Date(examData.endDate).getTime() : null;
    if (examData.manualClose === true || examData.manualClose === "true" || (endDateTime && now > endDateTime)) {
      alert("عذراً، هذا الامتحان مغلق حالياً ولا يمكن دخوله.");
      app.innerHTML = examsPage();
      return;
    }

    const completedExams = JSON.parse(localStorage.getItem("completedExams") || "[]");
    if (completedExams.includes(examData.id)) {
      alert("لقد قمت بتسليم هذا الاختبار مسبقاً ولا يمكنك إعادته.");
      app.innerHTML = examsPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    localStorage.setItem("currentSelectedExam", examJson);
    app.innerHTML = studentLoginPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const submitBtn = e.target.closest("#submitLoginBtn");
  if (submitBtn) {
    const nameInput = document.getElementById("loginStudentNameInput");
    const studentName = nameInput ? nameInput.value.trim() : "";

    if (!studentName) {
      alert("الرجاء إدخال الاسم الثلاثي للمتابعة");
      return;
    }

    localStorage.setItem("studentName", studentName);

    const examJson = localStorage.getItem("currentSelectedExam");
    if (examJson) {
      const examData = JSON.parse(decodeURIComponent(examJson));
      
      // التحقق النهائي الحاسمن لمنع أي تجاوز
      const now = new Date().getTime();
      const endDateTime = examData.endDate ? new Date(examData.endDate).getTime() : null;
      if (examData.manualClose === true || examData.manualClose === "true" || (endDateTime && now > endDateTime)) {
        alert("عذراً، تم إغلاق هذا الامتحان ولا يمكن بدء حله.");
        app.innerHTML = examsPage();
        return;
      }
      
      const completedExams = JSON.parse(localStorage.getItem("completedExams") || "[]");
      if (completedExams.includes(examData.id)) {
        alert("لقد قمت بتسليم هذا الاختبار مسبقاً.");
        app.innerHTML = examsPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      launchExamView(examData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert("حدث خطأ في استرداد بيانات الاختبار، يرجى المحاولة مرة أخرى.");
    }
    return;
  }

  const optionLabel = e.target.closest(".option-label");
  if (optionLabel) {
    const parentContainer = optionLabel.closest(".options-container");
    parentContainer.querySelectorAll(".option-label").forEach(lbl => {
      lbl.style.background = "rgba(30, 41, 59, 0.6)";
      lbl.style.borderColor = "rgba(255, 255, 255, 0.05)";
    });
    optionLabel.style.background = "rgba(99, 102, 241, 0.2)";
    optionLabel.style.borderColor = "#6366f1";
    const radio = optionLabel.querySelector("input[type='radio']");
    if (radio) radio.checked = true;
    return;
  }

  const submitExamBtn = e.target.closest("#submitExamBtn");
  if (submitExamBtn) {
    const studentName = localStorage.getItem("studentName") || "طالب";
    const examJson = localStorage.getItem("currentSelectedExam");
    
    if (examJson) {
      const examData = JSON.parse(decodeURIComponent(examJson));
      const completedExams = JSON.parse(localStorage.getItem("completedExams") || "[]");
      
      if (!completedExams.includes(examData.id)) {
        completedExams.push(examData.id);
        localStorage.setItem("completedExams", JSON.stringify(completedExams));
      }

      // حساب الدرجة وتصحيح الأسئلة تلقائياً وحفظها لتظهر في لوحة تحكم المعلم
      const questions = examData.questions || [];
      let score = 0;
      let total = 0;
      const answers = [];

      questions.forEach((q, index) => {
        const qType = String(q.type || "").toLowerCase();
        const isEssay = qType.includes("essay") || qType.includes("مقال");

        if (isEssay) {
          const weight = Number(q.maxScore || q.grade || q.points || 1);
          total += weight;
          const essayInput = document.querySelector(`.essay-answer-input[data-question="${index}"]`);
          const essayText = essayInput ? essayInput.value.trim() : "";
          answers.push(essayText);
          return;
        }

        const weight = Number(q.score || 1);
        total += weight;

        const selectedRadio = document.querySelector(`input[name="question_${index}"]:checked`);
        const value = selectedRadio ? Number(selectedRadio.value) : null;
        answers.push(value);

        const right = q.correctAnswerIndex ?? q.correctIndex ?? q.rightIndex ?? q.correctAnswer;
        if (value !== null && Number(value) === Number(right)) {
          score += weight;
        }
      });

      const resultObj = {
        studentName: studentName,
        examTitle: examData.title || "امتحان",
        examId: examData.id,
        subject: examData.subject || "",
        className: examData.className || "",
        score: score,
        total: total,
        answers: answers,
        questions: questions,
        date: new Date().toLocaleString()
      };

      const existingResults = JSON.parse(localStorage.getItem("examResults") || "[]");
      existingResults.push(resultObj);
      localStorage.setItem("examResults", JSON.stringify(existingResults));
    }
    
    app.innerHTML = `
      <div style="min-height: 100vh; background: #0f172a; color: #fff; display: flex; align-items: center; justify-content: center; padding: 20px; direction: rtl; font-family: 'Cairo', sans-serif;">
        <div style="background: rgba(30, 41, 59, 0.85); backdrop-filter: blur(24px); padding: 45px; border-radius: 28px; border: 1px solid rgba(255, 255, 255, 0.08); text-align: center; max-width: 450px; width: 100%; box-shadow: 0 35px 70px rgba(0,0,0,0.7);">
          <div style="width: 75px; height: 75px; background: rgba(16, 185, 129, 0.15); color: #10b981; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px auto; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 12px 25px -6px rgba(16, 185, 129, 0.4);">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h2 style="color: #f8fafc; font-size: 26px; margin: 0 0 10px 0; font-weight: 900;">أحسنت يا ${studentName}!</h2>
          <p style="color: #94a3b8; font-size: 15px; margin: 0 0 30px 0; line-height: 1.5;">تم إرسال إجاباتك بنجاح وحفظ النتيجة في لوحة التحكم.</p>
          
          <button id="backToHomeFromSuccess" style="
            width: 100%; background: linear-gradient(135deg, #6366f1, #4f46e5);
            color: #fff; border: none; padding: 15px; font-size: 15px; font-weight: 700;
            border-radius: 14px; cursor: pointer; box-shadow: 0 12px 30px -6px rgba(99, 102, 241, 0.5);
            font-family: inherit; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
          " onmouseover="this.style.filter='brightness(1.1)';" onmouseout="this.style.filter='brightness(1)';">
            <i class="fa-solid fa-house"></i>
            <span>العودة للصفحة الرئيسية</span>
          </button>
        </div>
      </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const backHomeBtn = e.target.closest("#backToHomeFromSuccess");
  if (backHomeBtn) {
    app.innerHTML = examsPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
});

// 5. دالة عرض واجهة الاختبار الفعلية مع حماية ضد التحديد والنسخ داخل العناصر
function launchExamView(exam) {
  const app = document.querySelector("#app");
  if (!app) return;

  const studentName = localStorage.getItem("studentName");
  
  app.innerHTML = `
    <div style="min-height: 100vh; background: #0f172a; color: #fff; padding: 40px 20px; direction: rtl; font-family: 'Cairo', sans-serif; max-width: 900px; margin: 0 auto; user-select: none; -webkit-user-select: none;" oncopy="return false;" onpaste="return false;" oncut="return false;">
      <div style="background: rgba(30, 41, 59, 0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); padding: 35px; border-radius: 28px; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 30px 60px rgba(0,0,0,0.6);">
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 25px; flex-wrap: wrap; gap: 15px;">
          <div>
            <span style="color: #818cf8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">اختبار تفاعلي (مؤمن)</span>
            <h2 style="color: #f8fafc; margin: 4px 0 0 0; font-size: 24px; font-weight: 900;">${exam.title || 'الاختبار التفاعلي'}</h2>
          </div>
          <span style="background: rgba(99, 102, 241, 0.15); color: #818cf8; padding: 8px 16px; border-radius: 14px; font-weight: 700; border: 1px solid rgba(255,255,255,0.08); font-size: 14px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-user-graduate"></i> ${studentName}
          </span>
        </div>

        <div id="examQuestionsContainer">
          ${
            exam.questions && exam.questions.length > 0 
              ? exam.questions.map((q, qIndex) => `
                  <div style="background: rgba(15, 23, 42, 0.6); padding: 24px; border-radius: 20px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                    <p style="font-size: 18px; font-weight: 800; color: #f8fafc; margin-top: 0; margin-bottom: 16px; line-height: 1.5;">
                      <span style="color: #6366f1; margin-left: 6px;">س${qIndex + 1}:</span> ${q.text}
                    </p>
                    ${
                      q.type === "essay"
                      ? `
                      <div style="margin-top:20px;">
                      <textarea class="essay-answer-input" data-question="${qIndex}" placeholder="اكتب إجابتك هنا..." style="
                        width:100%; height:180px; padding:15px; background:rgba(30,41,59,0.7);
                        border:1px solid rgba(255,255,255,0.15); border-radius:14px; color:#fff;
                        font-size:16px; font-family:inherit; resize:vertical; outline:none;
                      "></textarea>
                      </div>
                      `
                      : `
                      <div class="options-container" style="display:flex;flex-direction:column;gap:10px;">
                      ${q.options.map((opt,optIndex)=>`
                      <label class="option-label" style="
                        background:rgba(30,41,59,0.6); padding:13px 16px; border-radius:14px;
                        cursor:pointer; border:1px solid rgba(255,255,255,0.05); display:flex;
                        align-items:center; gap:12px;
                      ">
                        <input type="radio" name="question_${qIndex}" value="${optIndex}" style="accent-color:#6366f1;">
                        <span>${opt}</span>
                      </label>
                      `).join("")}
                      </div>
                      `
                    }
                  </div>
                `).join('')
              : '<div style="text-align: center; padding: 30px; color: #94a3b8;"><p style="font-size: 16px;">لا توجد أسئلة مضافة لهذا الاختبار بعد.</p></div>'
          }
        </div>

        ${exam.questions && exam.questions.length > 0 ? `
          <button id="submitExamBtn" style="
            width: 100%; margin-top: 15px; background: linear-gradient(135deg, #10b981, #059669);
            color: #fff; border: none; padding: 16px; font-size: 16px; font-weight: 800;
            border-radius: 16px; cursor: pointer; box-shadow: 0 12px 30px -6px rgba(16, 185, 129, 0.4);
            font-family: inherit; transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 8px;
          " onmouseover="this.style.filter='brightness(1.1)';" onmouseout="this.style.filter='brightness(1)';">
            <span>إرسال وإنهاء الاختبار</span>
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        ` : ''}

      </div>
    </div>
  `;
}