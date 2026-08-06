export function teacherBoardsPage() {
  return `
  <div style="min-height: 100vh; background: #0f172a; font-family: 'Cairo', 'Tajawal', sans-serif; padding: 40px 20px; direction: rtl; text-align: right; color: #fff;">
    <div style="max-width: 950px; margin: 0 auto;">
      
      <div style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95)); border-radius: 24px; padding: 30px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.08);">
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="width: 55px; height: 55px; background: rgba(99, 102, 241, 0.15); color: #818cf8; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
            <i class="fa-solid fa-chalkboard-user"></i>
          </div>
          <div>
            <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 5px 0; color: #f8fafc;">لوحة تحكم المعلم</h1>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">إدارة السبورات، الملفات، والمستندات الدراسية</p>
          </div>
        </div>
        <button id="teacherBackBtn" style="background: rgba(255, 255, 255, 0.08); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.12); padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;">⬅ رجوع</button>
      </div>

      <div style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9)); border-radius: 24px; padding: 35px; border: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 35px;">
        <h3 style="font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 20px; color: #f8fafc;">رفع محتوى جديد</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
          <div>
            <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">اسم المحتوى</label>
            <input id="fileName" placeholder="مثال: الوحدة الأولى - الحركة" style="width: 100%; padding: 12px 16px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #fff; box-sizing: border-box; font-family: inherit;">
          </div>
          <div>
            <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">المادة الدراسية</label>
            <select id="fileSubject" style="width: 100%; padding: 12px 16px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #fff; box-sizing: border-box; font-family: inherit;">
              <option value="physics">فيزياء (Physics)</option>
              <option value="chemistry">كيمياء (Chemistry)</option>
            </select>
          </div>
          <div>
            <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">الصف الدراسي</label>
            <select id="fileClass" style="width: 100%; padding: 12px 16px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #fff; box-sizing: border-box; font-family: inherit;">
              <option value="الصف الثاني الثانوي">الثاني الثانوي (Second Secondary)</option>
              <option value="الصف الثالث الثانوي">الثالث الثانوي (Third Secondary)</option>
            </select>
          </div>
          <div>
            <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">نوع المحتوى</label>
            <select id="fileType" style="width: 100%; padding: 12px 16px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #fff; box-sizing: border-box; font-family: inherit;">
              <option value="board">📚 سبورة دراسية (Board Image)</option>
              <option value="file">📂 ملف / ملزمة PDF (File / PDF)</option>
            </select>
          </div>
        </div>
        <div style="margin-bottom: 25px;">
          <label style="display: block; color: #cbd5e1; font-size: 14px; font-weight: 700; margin-bottom: 8px;">اختر الملف المرفق</label>
          <input type="file" id="uploadFile" style="width: 100%; padding: 10px; background: rgba(15, 23, 42, 0.6); border: 1px dashed rgba(255, 255, 255, 0.2); border-radius: 12px; color: #94a3b8; box-sizing: border-box; cursor: pointer;">
        </div>
        <button id="saveFile" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; padding: 14px 28px; border-radius: 14px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit;">حفظ ونشر المحتوى</button>
      </div>

    </div>
  </div>
  `;
}

// تفعيل الأحداث للزر والرفع
document.addEventListener("click", (e) => {
  if (e.target.closest("#saveFile")) {
    const input = document.getElementById("uploadFile");
    const nameInput = document.getElementById("fileName");
    const subjectSelect = document.getElementById("fileSubject");
    const classSelect = document.getElementById("fileClass");
    const typeSelect = document.getElementById("fileType");

    if (!input || !input.files || !input.files[0]) {
      alert("الرجاء اختيار ملف أو سبورة أولاً!");
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (ev) {
      try {
        let existingItems = [];
        const stored = localStorage.getItem("teacher_boards_management");
        if (stored) {
          existingItems = JSON.parse(stored);
        }

        const newItem = {
          id: Date.now(),
          name: nameInput?.value.trim() || file.name,
          contentName: nameInput?.value.trim() || file.name,
          subject: subjectSelect?.value || "physics",
          subjectName: subjectSelect?.value || "physics",
          class: classSelect?.value || "الصف الثاني الثانوي",
          className: classSelect?.value || "الصف الثاني الثانوي",
          type: typeSelect?.value || "board",
          contentType: typeSelect?.value || "board",
          url: ev.target.result,
          fileUrl: ev.target.result
        };

        existingItems.push(newItem);
        localStorage.setItem("teacher_boards_management", JSON.stringify(existingItems));

        alert("تم حفظ ونشر المحتوى بنجاح وصار متاحاً للطلاب!");
        
        if (nameInput) nameInput.value = "";
        if (input) input.value = "";
      } catch (err) {
        console.error("Storage Error:", err);
        alert("حدث خطأ أثناء حفظ الملف (قد يكون حجم الملف كبيراً جداً).");
      }
    };

    reader.readAsDataURL(file);
    return;
  }

  if (e.target.closest("#teacherBackBtn")) {
    // يمكنك تعديل هذه الوظيفة حسب الصفحة الرئيسية التي ترغب في الرجوع إليها
    const app = document.querySelector("#app");
    if (app) {
      // مثال: العودة للصفحة الرئيسية أو لوحة الاختيار
      location.reload(); 
    }
    return;
  }
});