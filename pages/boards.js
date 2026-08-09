import { physicsPage } from "./physics.js";
import { db } from "../firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function boardsPage() {
  const currentClass = localStorage.getItem("currentClass") || "";
  const currentSub = localStorage.getItem("currentSubject") || "physics";

  const snap = await getDocs(query(collection(db, "content"), where("contentType", "==", "board")));
  const allItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const filteredItems = allItems.filter(item => {
    const sub = (item.subject || item.subjectName || "").trim().toLowerCase();
    const matchSubject = sub === currentSub;
    const itemClass = (item.className || "").trim();
    const matchClass = !currentClass || !itemClass || itemClass === currentClass;
    return matchSubject && matchClass;
  });

  if (filteredItems.length === 0) {
    return `
      <div style="min-height: 100vh; background: #0f172a; font-family: 'Cairo', 'Tajawal', sans-serif; padding: 40px 20px; direction: rtl; text-align: right;">
        <div style="max-width: 850px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="color: #f8fafc; font-size: 24px; font-weight: 800; margin: 0;">السبورات الدراسية</h2>
            <button id="backFromBoards" style="background: rgba(30, 41, 59, 0.7); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.12); padding: 10px 20px; font-size: 14px; font-weight: 700; border-radius: 12px; cursor: pointer;">⬅ رجوع</button>
          </div>
          <div style="background: rgba(30, 41, 59, 0.7); border: 2px dashed rgba(255, 255, 255, 0.12); padding: 50px 30px; border-radius: 20px; text-align: center; color: #94a3b8; font-size: 16px;">
            لا توجد سبورات مضافة لهذه المادة والصف حتى الآن.
          </div>
        </div>
      </div>
    `;
  }

  const contentHTML = filteredItems.map(item => {
    const title = item.contentName || "سبورة بدون عنوان";
    const className = item.className || currentClass || "عام";
    const fileUrl = item.fileUrl || "#";
    const isImage = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(fileUrl) || (item.fileName && /\.(jpg|jpeg|png|webp|gif)$/i.test(item.fileName));

    return `
      <div style="background: rgba(30, 41, 59, 0.7); padding: 22px; border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
        <div>
          <span style="background: rgba(99, 102, 241, 0.15); color: #818cf8; font-size: 12px; padding: 4px 10px; border-radius: 6px; font-weight: 700;">${className}</span>
          <h4 style="color: #f8fafc; font-size: 18px; font-weight: 700; margin: 8px 0 0 0;">📚 ${title}</h4>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="btn-preview-board" data-url="${fileUrl}" data-type="${isImage ? "image" : "file"}" data-title="${title}" style="background: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); padding: 10px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;">
            <i class="fa-solid fa-eye"></i> معاينة
          </button>
          <a href="${fileUrl}" download="${title}" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 10px 18px; border-radius: 12px; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-download"></i> تحميل
          </a>
        </div>
      </div>
    `;
  }).join("");

  return `
  <div style="min-height: 100vh; background: #0f172a; font-family: 'Cairo', 'Tajawal', sans-serif; padding: 40px 20px; direction: rtl; text-align: right;">
    <div style="max-width: 850px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 20px;">
        <h2 style="color: #f8fafc; font-size: 26px; font-weight: 800; margin: 0;">السبورات الدراسية المتاحة</h2>
        <button id="backFromBoards" style="background: rgba(30, 41, 59, 0.7); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.12); padding: 10px 20px; font-size: 14px; font-weight: 700; border-radius: 12px; cursor: pointer;">⬅ رجوع</button>
      </div>
      <div>${contentHTML}</div>
    </div>
  </div>

  <div id="boardPreviewModal" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); z-index: 9999; align-items: center; justify-content: center; padding: 20px;">
    <div style="background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; width: 100%; max-width: 750px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
      <div style="padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <h3 id="modalBoardTitle" style="color: #f8fafc; font-size: 16px; font-weight: 800; margin: 0;">معاينة المرفق</h3>
        <button id="closeBoardModal" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div id="modalBoardBody" style="padding: 20px; overflow-y: auto; flex: 1; text-align: center;"></div>
    </div>
  </div>
  `;
}

document.addEventListener("click", async (e) => {
  if (e.target.closest("#backFromBoards")) {
    const app = document.querySelector("#app");
    if (app) app.innerHTML = physicsPage();
    return;
  }

  const previewBtn = e.target.closest(".btn-preview-board");
  if (previewBtn) {
    const url = previewBtn.getAttribute("data-url");
    const type = previewBtn.getAttribute("data-type");
    const title = previewBtn.getAttribute("data-title");

    const modal = document.getElementById("boardPreviewModal");
    const modalTitle = document.getElementById("modalBoardTitle");
    const modalBody = document.getElementById("modalBoardBody");

    if (modal && modalBody && modalTitle) {
      modalTitle.textContent = title;
      if (type === "image") {
        modalBody.innerHTML = `
          <img src="${url}" style="max-width: 100%; max-height: 60vh; border-radius: 12px; margin-bottom: 15px;" /><br>
          <a href="${url}" download="${title}" style="background: #10b981; color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: 700; display: inline-block;">تحميل الصورة</a>
        `;
      } else {
        modalBody.innerHTML = `<a href="${url}" download="${title}" style="background: #10b981; color: white; padding: 12px 25px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block;">تحميل الملف</a>`;
      }
      modal.style.display = "flex";
    }
    return;
  }

  if (e.target.closest("#closeBoardModal") || e.target.id === "boardPreviewModal") {
    const modal = document.getElementById("boardPreviewModal");
    if (modal) modal.style.display = "none";
    return;
  }
});