import {
  getFiles,
  addFile,
  deleteFile
} from "../services/fileService.js";

export function manageFilesPage() {
  const files = getFiles();

  return `
  <div class="container" style="direction: rtl; text-align: right;">
    <h1>📚 إدارة السبورات والملفات</h1>
    <p class="subtitle">رفع السبورات، ملفات الـ PDF، والمستندات الدراسية</p>

    <div class="card">
      <label>اسم المحتوى</label>
      <input id="fileName" placeholder="مثال: الوحدة الأولى - الحركة">

      <label>المادة الدراسية</label>
      <select id="fileSubject">
        <option value="physics">فيزياء (Physics)</option>
        <option value="chemistry">كيمياء (Chemistry)</option>
      </select>

      <label>الصف الدراسي</label>
      <select id="fileClass">
        <option value="grade2">الثاني الثانوي (Second Secondary)</option>
        <option value="grade3">الثالث الثانوي (Third Secondary)</option>
      </select>

      <label>نوع المحتوى</label>
      <select id="fileType">
        <option value="board">📚 سبورة دراسية (Board Image)</option>
        <option value="file">📂 ملف / ملزمة PDF (File / PDF)</option>
      </select>

      <label>إرفاق الملف</label>
      <input type="file" id="uploadFile">

      <button id="saveFile">💾 حفظ ونشر</button>
    </div>

    <h2>المحتويات المضافة مسبقاً</h2>

    <div class="cards">
      ${
        files.length
          ? files
              .map(
                (file) => `
          <div class="menu-card">
            <h3>${file.name || file.contentName}</h3>
            <p>المادة: ${file.subjectName === "chemistry" || file.subject === "chemistry" ? "كيمياء" : "فيزياء"}</p>
            <p>الصف: ${file.class || file.className}</p>
            <p>النوع: ${file.type === "board" || file.contentType === "board" ? "📚 سبورة" : "📂 ملف"}</p>
            <a href="${file.url || file.fileUrl}" download="${file.name || file.contentName}">⬇ تحميل</a>
            <button class="deleteFile" data-id="${file.id}">🗑 حذف</button>
          </div>
        `
              )
              .join("")
          : `
          <div class="menu-card">
            <h3>لا توجد محتويات حتى الآن</h3>
            <p>قم برفع أول سبورة أو ملف دراسي</p>
          </div>
        `
      }
    </div>

    <button id="backAdmin">⬅ رجوع</button>
  </div>
  `;
}

let filesEventsInitialized = false;

export function manageFilesEvents() {
  if (filesEventsInitialized) return;
  filesEventsInitialized = true;

  document.addEventListener("click", (e) => {
    if (e.target.closest("#saveFile")) {
      const input = document.getElementById("uploadFile");
      const name = document.getElementById("fileName")?.value.trim();
      const subjectName = document.getElementById("fileSubject")?.value;
      const className = document.getElementById("fileClass")?.value;
      const type = document.getElementById("fileType")?.value;

      if (!input || !input.files[0]) {
        alert("الرجاء اختيار ملف أولاً");
        return;
      }

      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = function (ev) {
        addFile({
          id: Date.now(),
          name: name || file.name,
          contentName: name || file.name,
          subject: subjectName,
          subjectName: subjectName,
          class: className,
          className: className,
          type: type,
          contentType: type,
          url: ev.target.result,
          fileUrl: ev.target.result
        });

        document.querySelector("#app").innerHTML = manageFilesPage();
      };

      reader.readAsDataURL(file);
      return;
    }

    const delBtn = e.target.closest(".deleteFile");
    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      deleteFile(id);
      document.querySelector("#app").innerHTML = manageFilesPage();
      return;
    }
  });
}