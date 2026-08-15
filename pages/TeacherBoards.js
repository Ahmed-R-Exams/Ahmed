// pages/teacherBoards.js

import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";


// ======================================================
// TEACHER BOARDS PAGE
// ======================================================

export async function teacherBoardsPage() {

  let boards = [];

  try {

    const snap = await getDocs(
      query(
        collection(db, "content"),
        where("contentType", "==", "board")
      )
    );

    boards = snap.docs.map(item => ({
      id: item.id,
      ...item.data()
    }));

    boards.sort(
      (a, b) =>
        Number(b.createdAt || 0) -
        Number(a.createdAt || 0)
    );

  } catch (error) {

    console.error(
      "LOAD BOARDS ERROR:",
      error
    );

  }


  return `

<style>

.teacher-boards-page{
  min-height:100vh;
  background:#0f172a;
  font-family:'Cairo','Tajawal',sans-serif;
  padding:40px 20px 70px;
  direction:rtl;
  color:#fff;
}

.teacher-boards-container{
  max-width:950px;
  margin:0 auto;
}


/* ======================================================
   HEADER
====================================================== */

.tb-header{

  background:
    linear-gradient(
      135deg,
      rgba(30,41,59,.92),
      rgba(15,23,42,.98)
    );

  border-radius:24px;
  padding:30px;

  display:flex;
  justify-content:space-between;
  align-items:center;

  margin-bottom:30px;

  border:1px solid rgba(255,255,255,.08);

}

.tb-header-info{
  display:flex;
  align-items:center;
  gap:15px;
}

.tb-header-icon{

  width:55px;
  height:55px;

  background:rgba(99,102,241,.15);
  color:#818cf8;

  border-radius:16px;

  display:flex;
  align-items:center;
  justify-content:center;

  font-size:24px;

}

.tb-header h1{

  font-size:24px;
  font-weight:900;

  margin:0 0 5px;

  color:#f8fafc;

}

.tb-header p{

  color:#94a3b8;
  font-size:14px;

  margin:0;

}

.tb-back{

  background:rgba(255,255,255,.08);
  color:#e2e8f0;

  border:1px solid rgba(255,255,255,.12);

  padding:10px 20px;

  border-radius:12px;

  font-size:14px;
  font-weight:700;

  cursor:pointer;

  font-family:inherit;

}


/* ======================================================
   UPLOAD PANEL
====================================================== */

.tb-panel{

  background:
    linear-gradient(
      135deg,
      rgba(30,41,59,.82),
      rgba(15,23,42,.94)
    );

  border-radius:24px;

  padding:35px;

  border:1px solid rgba(255,255,255,.08);

  margin-bottom:30px;

}

.tb-panel-title{

  font-size:20px;
  font-weight:800;

  margin:0 0 20px;

  color:#f8fafc;

}

.tb-grid{

  display:grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(250px,1fr)
    );

  gap:20px;

  margin-bottom:20px;

}

.tb-field label{

  display:block;

  color:#cbd5e1;

  font-size:14px;
  font-weight:700;

  margin-bottom:8px;

}

.tb-input,
.tb-select{

  width:100%;

  padding:12px 16px;

  background:rgba(15,23,42,.75);

  border:1px solid rgba(255,255,255,.1);

  border-radius:12px;

  color:#fff;

  box-sizing:border-box;

  font-family:inherit;

}

.tb-file{

  width:100%;

  padding:12px;

  background:rgba(15,23,42,.6);

  border:1px dashed rgba(255,255,255,.2);

  border-radius:12px;

  color:#94a3b8;

  box-sizing:border-box;

  cursor:pointer;

  font-family:inherit;

}

.tb-warning{

  color:#fbbf24;

  font-size:12.5px;

  margin:0 0 20px;

}

.tb-save{

  background:
    linear-gradient(
      135deg,
      #6366f1,
      #4f46e5
    );

  color:white;

  border:none;

  padding:14px 28px;

  border-radius:14px;

  font-size:15px;
  font-weight:700;

  cursor:pointer;

  font-family:inherit;

}

.tb-save:disabled{

  opacity:.6;
  cursor:not-allowed;

}


/* ======================================================
   MANAGEMENT PANEL
====================================================== */

.tb-management{

  background:
    linear-gradient(
      135deg,
      rgba(30,41,59,.82),
      rgba(15,23,42,.94)
    );

  border-radius:24px;

  padding:30px;

  border:1px solid rgba(255,255,255,.08);

}

.tb-management-header{

  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:15px;

  margin-bottom:22px;

}

.tb-management-title{

  margin:0;

  color:#f8fafc;

  font-size:20px;

  font-weight:800;

}

.tb-count{

  background:rgba(99,102,241,.15);

  color:#818cf8;

  border:1px solid rgba(99,102,241,.2);

  padding:5px 12px;

  border-radius:20px;

  font-size:12px;

  font-weight:700;

}


/* ======================================================
   BOARD CARD
====================================================== */

.tb-board-card{

  background:rgba(15,23,42,.65);

  border:1px solid rgba(255,255,255,.08);

  border-radius:18px;

  padding:18px;

  margin-bottom:14px;

  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:18px;

  transition:.2s ease;

}

.tb-board-card:hover{

  border-color:rgba(99,102,241,.35);

  transform:translateY(-1px);

}

.tb-board-info{

  min-width:0;
  flex:1;

}

.tb-board-top{

  display:flex;

  align-items:center;

  gap:8px;

  flex-wrap:wrap;

  margin-bottom:8px;

}

.tb-subject{

  background:rgba(99,102,241,.15);

  color:#818cf8;

  padding:4px 9px;

  border-radius:7px;

  font-size:11px;

  font-weight:700;

}

.tb-class{

  background:rgba(16,185,129,.12);

  color:#34d399;

  padding:4px 9px;

  border-radius:7px;

  font-size:11px;

  font-weight:700;

}

.tb-board-name{

  color:#f8fafc;

  font-size:16px;

  font-weight:800;

  margin:0;

  overflow:hidden;

  text-overflow:ellipsis;

  white-space:nowrap;

}

.tb-file-name{

  color:#64748b;

  font-size:11px;

  margin-top:5px;

  overflow:hidden;

  text-overflow:ellipsis;

  white-space:nowrap;

}

.tb-actions{

  display:flex;

  align-items:center;

  gap:8px;

  flex-shrink:0;

}

.tb-preview{

  background:rgba(99,102,241,.12);

  color:#818cf8;

  border:1px solid rgba(99,102,241,.25);

  padding:9px 13px;

  border-radius:10px;

  cursor:pointer;

  font-family:inherit;

  font-size:12px;

  font-weight:700;

}

.tb-delete{

  background:rgba(239,68,68,.10);

  color:#f87171;

  border:1px solid rgba(239,68,68,.25);

  padding:9px 13px;

  border-radius:10px;

  cursor:pointer;

  font-family:inherit;

  font-size:12px;

  font-weight:700;

}

.tb-delete:hover{

  background:rgba(239,68,68,.18);

}


/* ======================================================
   EMPTY
====================================================== */

.tb-empty{

  text-align:center;

  padding:45px 20px;

  border:1px dashed rgba(255,255,255,.12);

  border-radius:16px;

  color:#64748b;

}

.tb-empty-icon{

  font-size:35px;
  margin-bottom:10px;

}

.tb-empty strong{

  display:block;

  color:#cbd5e1;

  font-size:15px;

  margin-bottom:5px;

}


/* ======================================================
   MODAL
====================================================== */

.tb-modal{

  display:none;

  position:fixed;

  inset:0;

  background:rgba(2,6,23,.86);

  z-index:99999;

  align-items:center;

  justify-content:center;

  padding:20px;

}

.tb-modal-box{

  width:100%;

  max-width:800px;

  max-height:90vh;

  background:#1e293b;

  border:1px solid rgba(255,255,255,.1);

  border-radius:20px;

  overflow:hidden;

  display:flex;

  flex-direction:column;

}

.tb-modal-header{

  padding:17px 20px;

  display:flex;

  justify-content:space-between;

  align-items:center;

  border-bottom:1px solid rgba(255,255,255,.08);

}

.tb-modal-header h3{

  margin:0;

  color:#f8fafc;

  font-size:16px;

}

.tb-modal-close{

  width:34px;
  height:34px;

  border:none;

  border-radius:50%;

  background:rgba(239,68,68,.15);

  color:#f87171;

  cursor:pointer;

  font-size:16px;

}

.tb-modal-body{

  padding:20px;

  overflow:auto;

  text-align:center;

}

.tb-modal-body img{

  max-width:100%;

  max-height:70vh;

  border-radius:12px;

}


/* ======================================================
   MOBILE
====================================================== */

@media(max-width:650px){

  .teacher-boards-page{
    padding:20px 12px 50px;
  }

  .tb-header{

    padding:20px;

    align-items:flex-start;

  }

  .tb-header h1{
    font-size:19px;
  }

  .tb-header p{
    font-size:12px;
  }

  .tb-header-icon{
    width:45px;
    height:45px;
    font-size:19px;
  }

  .tb-back{
    padding:8px 12px;
  }

  .tb-panel,
  .tb-management{
    padding:20px;
  }

  .tb-board-card{

    align-items:stretch;

    flex-direction:column;

  }

  .tb-actions{

    width:100%;

  }

  .tb-preview,
  .tb-delete{

    flex:1;

  }

}

</style>


<div class="teacher-boards-page">

  <div class="teacher-boards-container">


    <!-- ==================================================
         HEADER
    ================================================== -->

    <div class="tb-header">

      <div class="tb-header-info">

        <div class="tb-header-icon">
          <i class="fa-solid fa-chalkboard-user"></i>
        </div>

        <div>

          <h1>
            لوحة تحكم المعلم
          </h1>

          <p>
            إدارة السبورات، الملفات، والمستندات الدراسية
          </p>

        </div>

      </div>


      <button
        id="teacherBackBtn"
        class="tb-back"
      >
        ⬅ رجوع
      </button>

    </div>



    <!-- ==================================================
         UPLOAD
    ================================================== -->

    <div class="tb-panel">

      <h3 class="tb-panel-title">
        رفع محتوى جديد
      </h3>


      <div class="tb-grid">


        <div class="tb-field">

          <label>
            اسم المحتوى
          </label>

          <input
            id="fileName"
            class="tb-input"
            type="text"
            placeholder="مثال: الوحدة الأولى - الحركة"
          >

        </div>


        <div class="tb-field">

          <label>
            المادة الدراسية
          </label>

          <select
            id="fileSubject"
            class="tb-select"
          >

            <option value="physics">
              فيزياء (Physics)
            </option>

            <option value="chemistry">
              كيمياء (Chemistry)
            </option>

          </select>

        </div>


        <div class="tb-field">

          <label>
            الصف الدراسي
          </label>

          <select
            id="fileClass"
            class="tb-select"
          >

            <option value="الصف الثاني الثانوي">
              الثاني الثانوي
            </option>

            <option value="الصف الثالث الثانوي">
              الثالث الثانوي
            </option>

          </select>

        </div>


        <div class="tb-field">

          <label>
            نوع المحتوى
          </label>

          <select
            id="fileType"
            class="tb-select"
          >

            <option value="board">
              📚 سبورة دراسية
            </option>

            <option value="file">
              📂 ملف / ملزمة PDF
            </option>

          </select>

        </div>

      </div>


      <div class="tb-field">

        <label>
          اختر الملف المرفق
        </label>

        <input
          type="file"
          id="uploadFile"
          class="tb-file"
          accept="image/*,.pdf"
        >

      </div>


      <p class="tb-warning">

        ⚠️ الملف لازم يكون أصغر من 900 كيلوبايت تقريبًا.

      </p>


      <button
        id="saveFile"
        class="tb-save"
      >
        حفظ ونشر المحتوى
      </button>

    </div>



    <!-- ==================================================
         MANAGEMENT
    ================================================== -->

    <div class="tb-management">

      <div class="tb-management-header">

        <h3 class="tb-management-title">
          🗂️ إدارة السبورات
        </h3>

        <span class="tb-count">
          ${boards.length} سبورة
        </span>

      </div>


      <div id="teacherBoardsList">

        ${
          boards.length
            ? boards.map(board => {

                const subject =
                  String(
                    board.subject ||
                    board.subjectName ||
                    "physics"
                  ).toLowerCase();

                const subjectText =
                  subject === "chemistry"
                    ? "كيمياء"
                    : "فيزياء";


                const title =
                  board.contentName ||
                  board.fileName ||
                  "سبورة بدون عنوان";


                const className =
                  board.className ||
                  "عام";


                const fileUrl =
                  board.fileUrl ||
                  board.url ||
                  "";


                return `

                <div
                  class="tb-board-card"
                  data-board-id="${board.id}"
                >

                  <div class="tb-board-info">

                    <div class="tb-board-top">

                      <span class="tb-subject">
                        ${subjectText}
                      </span>

                      <span class="tb-class">
                        ${className}
                      </span>

                    </div>

                    <p class="tb-board-name">
                      📚 ${escapeHtml(title)}
                    </p>

                    <div class="tb-file-name">
                      ${escapeHtml(
                        board.fileName || ""
                      )}
                    </div>

                  </div>


                  <div class="tb-actions">

                    ${
                      fileUrl
                        ? `
                          <button
                            class="tb-preview-board"
                            data-url="${escapeHtml(fileUrl)}"
                            data-title="${escapeHtml(title)}"
                          >
                            👁 معاينة
                          </button>
                        `
                        : ""
                    }


                    <button
                      class="tb-delete-board"
                      data-id="${board.id}"
                      data-title="${escapeHtml(title)}"
                    >
                      🗑️ حذف
                    </button>

                  </div>

                </div>

                `;

              }).join("")
            : `

              <div class="tb-empty">

                <div class="tb-empty-icon">
                  📚
                </div>

                <strong>
                  لا توجد سبورات مضافة
                </strong>

                أضف أول سبورة من نموذج الرفع بالأعلى.

              </div>

            `
        }

      </div>

    </div>

  </div>

</div>



<!-- ======================================================
     PREVIEW MODAL
====================================================== -->

<div
  id="teacherBoardPreviewModal"
  class="tb-modal"
>

  <div class="tb-modal-box">

    <div class="tb-modal-header">

      <h3 id="teacherBoardPreviewTitle">
        معاينة السبورة
      </h3>

      <button
        id="closeTeacherBoardPreview"
        class="tb-modal-close"
      >
        ✕
      </button>

    </div>


    <div
      id="teacherBoardPreviewBody"
      class="tb-modal-body"
    ></div>

  </div>

</div>

`;

}


// ======================================================
// EVENTS
// ======================================================

document.addEventListener(
  "click",
  async e => {


    // ==================================================
    // SAVE
    // ==================================================

    if (
      e.target.closest("#saveFile")
    ) {

      const saveBtn =
        e.target.closest("#saveFile");


      const input =
        document.getElementById(
          "uploadFile"
        );


      const nameInput =
        document.getElementById(
          "fileName"
        );


      const subjectSelect =
        document.getElementById(
          "fileSubject"
        );


      const classSelect =
        document.getElementById(
          "fileClass"
        );


      const typeSelect =
        document.getElementById(
          "fileType"
        );


      if (
        !input ||
        !input.files ||
        !input.files[0]
      ) {

        alert(
          "الرجاء اختيار ملف أو سبورة أولاً!"
        );

        return;

      }


      const file =
        input.files[0];


      if (
        file.size >
        900 * 1024
      ) {

        alert(
          "الملف كبير أوي. لازم يكون أصغر من 900 كيلوبايت تقريبًا."
        );

        return;

      }


      const contentName =
        nameInput?.value.trim() ||
        file.name;


      const subject =
        subjectSelect?.value ||
        "physics";


      const className =
        classSelect?.value ||
        "الصف الثاني الثانوي";


      const contentType =
        typeSelect?.value ||
        "board";


      saveBtn.disabled = true;

      saveBtn.textContent =
        "جاري الحفظ...";


      const reader =
        new FileReader();


      reader.onload =
        async ev => {

          try {

            await addDoc(
              collection(
                db,
                "content"
              ),
              {

                contentName,

                subject,

                subjectName:
                  subject,

                className,

                contentType,

                fileUrl:
                  ev.target.result,

                fileName:
                  file.name,

                createdAt:
                  Date.now()

              }
            );


            alert(
              "تم حفظ ونشر المحتوى بنجاح وصار متاحاً للطلاب!"
            );


            if (nameInput) {
              nameInput.value = "";
            }


            if (input) {
              input.value = "";
            }


            /*
             * إعادة تحميل الصفحة حتى تظهر
             * السبورة الجديدة في لوحة الإدارة
             */

            location.reload();


          } catch (err) {

            console.error(
              "Save Error:",
              err
            );


            alert(
              "حدث خطأ أثناء الحفظ، حاول تاني."
            );


            saveBtn.disabled = false;

            saveBtn.textContent =
              "حفظ ونشر المحتوى";

          }

        };


      reader.onerror =
        () => {

          alert(
            "حدث خطأ أثناء قراءة الملف."
          );


          saveBtn.disabled = false;

          saveBtn.textContent =
            "حفظ ونشر المحتوى";

        };


      reader.readAsDataURL(
        file
      );

      return;

    }



    // ==================================================
    // DELETE BOARD
    // ==================================================

    const deleteBtn =
      e.target.closest(
        ".tb-delete-board"
      );


    if (deleteBtn) {

      const id =
        deleteBtn.dataset.id;


      const title =
        deleteBtn.dataset.title ||
        "هذه السبورة";


      if (!id) {

        alert(
          "تعذر تحديد السبورة."
        );

        return;

      }


      const confirmed =
        confirm(
          `هل أنت متأكد من حذف "${title}"؟\n\nسيتم حذف السبورة من قاعدة البيانات ولن تظهر للطلاب.`
        );


      if (!confirmed) {
        return;
      }


      deleteBtn.disabled = true;

      deleteBtn.textContent =
        "جاري الحذف...";


      try {

        await deleteDoc(
          doc(
            db,
            "content",
            id
          )
        );


        const card =
          deleteBtn.closest(
            ".tb-board-card"
          );


        if (card) {

          card.remove();

        }


        /*
         * تحديث العداد
         */

        const countElement =
          document.querySelector(
            ".tb-count"
          );


        if (countElement) {

          const cards =
            document.querySelectorAll(
              ".tb-board-card"
            ).length;


          countElement.textContent =
            `${cards} سبورة`;

        }


        const remaining =
          document.querySelectorAll(
            ".tb-board-card"
          ).length;


        if (!remaining) {

          const list =
            document.getElementById(
              "teacherBoardsList"
            );


          if (list) {

            list.innerHTML = `

              <div class="tb-empty">

                <div class="tb-empty-icon">
                  📚
                </div>

                <strong>
                  لا توجد سبورات مضافة
                </strong>

                أضف أول سبورة من نموذج الرفع بالأعلى.

              </div>

            `;

          }

        }


      } catch (error) {

        console.error(
          "DELETE BOARD ERROR:",
          error
        );


        alert(
          "حدث خطأ أثناء حذف السبورة."
        );


        deleteBtn.disabled = false;

        deleteBtn.textContent =
          "🗑️ حذف";

      }

      return;

    }



    // ==================================================
    // PREVIEW
    // ==================================================

    const previewBtn =
      e.target.closest(
        ".tb-preview-board"
      );


    if (previewBtn) {

      const url =
        previewBtn.dataset.url;


      const title =
        previewBtn.dataset.title ||
        "معاينة السبورة";


      const modal =
        document.getElementById(
          "teacherBoardPreviewModal"
        );


      const modalTitle =
        document.getElementById(
          "teacherBoardPreviewTitle"
        );


      const modalBody =
        document.getElementById(
          "teacherBoardPreviewBody"
        );


      if (
        !modal ||
        !modalTitle ||
        !modalBody
      ) {
        return;
      }


      modalTitle.textContent =
        title;


      if (
        url.startsWith(
          "data:image/"
        ) ||
        /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(
          url
        )
      ) {

        modalBody.innerHTML = `

          <img
            src="${url}"
            alt="${escapeHtml(title)}"
          >

        `;

      } else {

        modalBody.innerHTML = `

          <div
            style="
              padding:40px;
              color:#94a3b8;
            "
          >

            <div
              style="
                font-size:40px;
                margin-bottom:15px;
              "
            >
              📄
            </div>

            <p>
              هذا الملف لا يمكن عرضه كصورة.
            </p>

            <a
              href="${url}"
              target="_blank"
              style="
                display:inline-block;
                margin-top:15px;
                background:#10b981;
                color:#fff;
                padding:11px 20px;
                border-radius:10px;
                text-decoration:none;
                font-weight:700;
              "
            >
              فتح الملف
            </a>

          </div>

        `;

      }


      modal.style.display =
        "flex";


      return;

    }



    // ==================================================
    // CLOSE PREVIEW
    // ==================================================

    if (
      e.target.closest(
        "#closeTeacherBoardPreview"
      ) ||
      e.target.id ===
        "teacherBoardPreviewModal"
    ) {

      const modal =
        document.getElementById(
          "teacherBoardPreviewModal"
        );


      if (modal) {

        modal.style.display =
          "none";

      }

      return;

    }



    // ==================================================
    // BACK
    // ==================================================

    if (
      e.target.closest(
        "#teacherBackBtn"
      )
    ) {

      location.reload();

      return;

    }

  }
);


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

  return String(
    value ?? ""
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}