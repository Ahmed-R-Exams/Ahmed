export function teacherSettingsPage() {
    const showScore = localStorage.getItem("showScore") !== "false";
    const examTime = localStorage.getItem("examTime") || 30;
    const showAnswers = localStorage.getItem("showAnswers") !== "false";
    const allowReview = localStorage.getItem("allowReview") !== "false";
  
    const toggleRow = (id, label, desc, checked) => `
      <label for="${id}" style="
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        cursor: pointer; padding: 6px 0;
      ">
        <span>
          <span style="display:block; color:#f8fafc; font-size:15px; font-weight:700;">${label}</span>
          <span style="display:block; color:#94a3b8; font-size:12.5px; margin-top:2px;">${desc}</span>
        </span>
        <span style="position:relative; display:inline-block; width:46px; height:26px; flex-shrink:0;">
          <input type="checkbox" id="${id}" ${checked ? "checked" : ""} style="
            opacity:0; width:0; height:0;
          " onclick="
            this.nextElementSibling.style.background = this.checked ? '#6366f1' : 'rgba(255,255,255,0.12)';
            this.nextElementSibling.firstElementChild.style.transform = this.checked ? 'translateX(-20px)' : 'translateX(0)';
          ">
          <span style="
            position:absolute; inset:0; border-radius:999px; transition:.2s;
            background:${checked ? "#6366f1" : "rgba(255,255,255,0.12)"};
            border:1px solid rgba(255,255,255,0.1);
          ">
            <span style="
              position:absolute; top:2px; right:2px; width:20px; height:20px; border-radius:50%;
              background:#fff; transition:.2s; transform:${checked ? "translateX(-20px)" : "translateX(0)"};
            "></span>
          </span>
        </span>
      </label>
    `;
  
    return `
    <div style="
      min-height: 100vh;
      background: #0f172a;
      background-image:
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%);
      font-family: 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif;
      padding: 50px 20px;
      direction: rtl;
    ">
      <div style="max-width: 720px; margin: 0 auto;">
  
        <!-- Hero Header -->
        <div style="
          background: linear-gradient(135deg, #090d16 0%, #1e293b 100%);
          padding: 40px 35px; border-radius: 28px; color: white;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.4);
          margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 20px; border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative; overflow: hidden;
        ">
          <div style="position: absolute; top: -50px; left: -50px; width: 180px; height: 180px; background: rgba(99, 102, 241, 0.15); filter: blur(50px); border-radius: 50%; pointer-events: none;"></div>
  
          <div style="z-index: 1;">
            <span style="background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; border: 1px solid rgba(99, 102, 241, 0.3); display: inline-block; margin-bottom: 12px;">
              ⚙️ إعدادات النظام
            </span>
            <h1 style="font-size: 26px; font-weight: 800; margin: 0; color: #ffffff;">إعدادات الاختبارات</h1>
          </div>
  
          <button id="backAdmin" style="
            background: rgba(255, 255, 255, 0.07); color: #f1f5f9;
            border: 1px solid rgba(255, 255, 255, 0.15); padding: 12px 24px; border-radius: 14px;
            cursor: pointer; font-weight: 700; font-size: 14px; font-family: inherit;
            display: flex; align-items: center; gap: 8px; z-index: 1;
          ">
            <span>⬅</span> رجوع للوحة التحكم
          </button>
        </div>
  
        <!-- Settings Card -->
        <div style="
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 35px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
        ">
  
          <div style="margin-bottom: 26px;">
            <label style="display:block; color:#f8fafc; font-size:15px; font-weight:700; margin-bottom:10px;">
              ⏱️ مدة الاختبار (بالدقائق)
            </label>
            <input
              id="examTime"
              type="number"
              value="${examTime}"
              style="
                width:100%; padding:14px 16px; border-radius:14px;
                background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
                color: #fff; box-sizing: border-box; font-size:15px; font-family: inherit;
              "
            >
          </div>
  
          <div style="display:flex; flex-direction:column; gap:20px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.08);">
            ${toggleRow("scoreToggle", "📊 إظهار الدرجة بعد الاختبار", "الطالب يشوف درجته فور التسليم", showScore)}
            ${toggleRow("answersToggle", "👁️ إظهار الإجابات الصحيحة", "الطالب يشوف الحل الصحيح لكل سؤال", showAnswers)}
            ${toggleRow("reviewToggle", "🔁 السماح بمراجعة الإجابات", "الطالب يقدر يراجع ورقته بعد التسليم", allowReview)}
          </div>
  
          <button id="saveSettings" style="
            margin-top: 30px; width: 100%;
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            color: #fff; border: none; padding: 15px; font-size: 15px; font-weight: 800;
            border-radius: 14px; cursor: pointer; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5);
            font-family: inherit;
          ">
            💾 حفظ الإعدادات
          </button>
  
        </div>
  
      </div>
    </div>
    `;
  }