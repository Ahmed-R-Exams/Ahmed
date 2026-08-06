import { physicsPage } from "./physics.js";

export function filesPage() {
  const currentClass = localStorage.getItem("currentClass") || "";
  const currentSub = localStorage.getItem("currentSubject") || "physics";

  let allItems = [];
  try {
    const stored = localStorage.getItem("teacher_boards_management");
    if (stored) allItems = JSON.parse(stored);
  } catch (err) {
    allItems = [];
  }

  const filteredItems = allItems.filter(item => {
    if (!item) return false;

    const type = (item.contentType || item.type || "").trim().toLowerCase();
    const isFile = type === "file" || type === "pdf" || type === "document";

    const sub = (item.subjectName || item.subject || "").trim().toLowerCase();
    const isPhysics = sub === "physics" || sub === "فيزياء";
    const isChemistry = sub === "chemistry" || sub === "كيمياء";
    const matchSubject = (currentSub === "physics" && isPhysics) || (currentSub === "chemistry" && isChemistry);

    const itemClass = (item.className || item.class || "").trim().toLowerCase();
    const studentClass = (currentClass || "").trim().toLowerCase();
    
    const matchClass = !studentClass || !itemClass || 
      itemClass === studentClass ||
      (studentClass.includes("ثاني") && (itemClass.includes("second") || itemClass.includes("ثاني"))) ||
      (studentClass.includes("ثالث") && (itemClass.includes("third") || itemClass.includes("ثالث")));

    return isFile && matchSubject && matchClass;
  });

  if (filteredItems.length === 0) {
    return `
      <div style="min-height: 100vh; background: #0f172a; font-family: 'Cairo', 'Tajawal', sans-serif; padding: 40px 20px; direction: rtl; text-align: right;">
        <div style="max-width: 850px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="color: #f8fafc; font-size: 26px; font-weight: 800; margin: 0;">الملخصات والملفات</h2>
            <button id="backFromFiles" style="background: rgba(30, 41, 59, 0.7); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.12); padding: 10px 22px; font-size: 14px; font-weight: 700; border-radius: 14px; cursor: pointer;">رجوع</button>
          </div>
          <div style="background: rgba(30, 41, 59, 0.7); border: 2px dashed rgba(255, 255, 255, 0.12); padding: 60px 30px; border-radius: 24px; text-align: center; color: #94a3b8;">
            لا توجد ملفات أو ملازم مضافة لهذه المادة والصف حتى الآن.
          </div>
        </div>
      </div>
    `;
  }

  const contentHTML = filteredItems.map(item => {
    const title = item.contentName || item.title || item.name || "ملف بدون عنوان";
    const className = item.className || item.class || currentClass || "عام";
    const fileUrl = item.fileUrl || item.url || "#";
    const isImage = fileUrl.startsWith("data:image/") || /\.(jpg|jpeg|png|webp|gif)$/i.test(fileUrl);
    const isPdf = fileUrl.startsWith("data:application/pdf") || /\.pdf$/i.test(fileUrl);

    return `
      <div style="background: rgba(30, 41, 59, 0.7); padding: 24px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 15px;">
        <div style="display: flex; align-items: center; gap: 18px;">
          <div style="width: 52px; height: 52px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px;">
            <i class="fa-solid ${isImage ? 'fa-image' : 'fa-file-pdf'}"></i>
          </div>
          <div>
            <span style="background: rgba(56, 189, 248, 0.1); color: #38bdf8; font-size: 11px; padding: 4px 10px; border-radius: 6px; font-weight: 700;">${className}</span>
            <h4 style="color: #f8fafc; font-size: 18px; font-weight: 700; margin: 8px 0 0 0;">${title}</h4>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="btn-preview-file" data-url="${fileUrl}" data-type="${isImage ? 'image' : (isPdf ? 'pdf' : 'file')}" data-title="${title}" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 12px 18px; border-radius: 14px; font-size: 14px; font-weight: 700; cursor: pointer;">معاينة</button>
          <a href="${fileUrl}" download="${title}" target="_blank" style="background: linear-gradient(135deg, #0284c7, #0369a1); color: white; padding: 12px 22px; border-radius: 14px; text-decoration: none; font-size: 14px; font-weight: 700; display: inline-block;">تحميل</a>
        </div>
      </div>
    `;
  }).join("");

  return `
  <div style="min-height: 100vh; background: #0f172a; font-family: 'Cairo', 'Tajawal', sans-serif; padding: 40px 20px; direction: rtl; text-align: right;">
    <div style="max-width: 850px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 20px;">
        <h2 style="color: #f8fafc; font-size: 26px; font-weight: 800; margin: 0;">الملخصات والملفات المتاحة</h2>
        <button id="backFromFiles" style="background: rgba(30, 41, 59, 0.7); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.12); padding: 10px 22px; font-size: 14px; font-weight: 700; border-radius: 14px; cursor: pointer;">رجوع</button>
      </div>
      <div>${contentHTML}</div>
    </div>
  </div>

  <div id="filePreviewModal" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); z-index: 9999; align-items: center; justify-content: center; padding: 20px;">
    <div style="background: #1e293b; border-radius: 20px; width: 100%; max-width: 850px; height: 85vh; display: flex; flex-direction: column; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
      <div style="padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(15,23,42,0.5);">
        <h3 id="modalFileTitle" style="color: #f8fafc; font-size: 16px; font-weight: 800; margin: 0;">معاينة الملف</h3>
        <button id="closeFileModal" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div id="modalFileBody" style="padding: 20px; overflow-y: auto; flex: 1; text-align: center; display: flex; align-items: center; justify-content: center;"></div>
    </div>
  </div>
  `;
}

document.addEventListener("click", (e) => {
  if (e.target.closest("#backFromFiles")) {
    const app = document.querySelector("#app");
    if (app) app.innerHTML = physicsPage();
    return;
  }

  const previewBtn = e.target.closest(".btn-preview-file");
  if (previewBtn) {
    const url = previewBtn.getAttribute("data-url");
    const type = previewBtn.getAttribute("data-type");
    const title = previewBtn.getAttribute("data-title");

    const modal = document.getElementById("filePreviewModal");
    const modalTitle = document.getElementById("modalFileTitle");
    const modalBody = document.getElementById("modalFileBody");

    if (modal && modalBody && modalTitle) {
      modalTitle.textContent = title;
      
      if (type === "image") {
        modalBody.innerHTML = `<img src="${url}" style="max-width: 100%; max-height: 70vh; border-radius: 12px; object-fit: contain;" />`;
      } else if (type === "pdf") {
        modalBody.innerHTML = `<iframe src="${url}" style="width: 100%; height: 70vh; border: none; border-radius: 10px;"></iframe>`;
      } else {
        modalBody.innerHTML = `
          <div style="color: #cbd5e1;">
            <p style="margin-bottom: 20px; font-size: 16px;">هذا الملف لا يدعم المعاينة المباشرة داخل المتصفح، يمكنك تحميله مباشرة:</p>
            <a href="${url}" download="${title}" style="background: #0284c7; color: white; padding: 12px 25px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block;">تحميل الملف الآن</a>
          </div>
        `;
      }
      modal.style.display = "flex";
    }
    return;
  }

  if (e.target.closest("#closeFileModal") || e.target.id === "filePreviewModal") {
    const modal = document.getElementById("filePreviewModal");
    if (modal) modal.style.display = "none";
    return;
  }
});