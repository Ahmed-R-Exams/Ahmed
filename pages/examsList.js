import {
  getExams,
  deleteExam,
  updateExam
} from "../services/examService.js";

import {
  createExamPage,
  setExamToEdit
} from "./createExam.js";

import {
  adminPage
} from "./admin.js";

let examsCache = [];


// ======================================================
// PAGE
// ======================================================

export function examsListPage() {

  return `

<div style="margin-bottom:20px;">

<button
  id="btnBackToDashboard"
  type="button"
  style="
    background:rgba(30,41,59,.6);
    color:#cbd5e1;
    border:1px solid rgba(255,255,255,.08);
    padding:10px 18px;
    border-radius:12px;
    font-weight:700;
    cursor:pointer;
    font-family:inherit;
  "
>

⬅ الرجوع للوحة التحكم

</button>

</div>


<div style="
  background:linear-gradient(135deg,#1e293b,#0f172a);
  border-radius:24px;
  padding:25px 30px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:30px;
  border:1px solid rgba(255,255,255,.08);
">

<div>

<h1 style="
  color:#f8fafc;
  margin:0;
  font-size:22px;
">

إدارة الامتحانات

</h1>

<p style="
  color:#94a3b8;
">

عرض وتعديل وحذف وفتح وغلق الامتحانات للطلاب

</p>

</div>

</div>


<div id="firebaseExamsList">

جاري تحميل الامتحانات...

</div>

`;

}


// ======================================================
// LOAD EXAMS
// ======================================================

export async function loadExamsList() {

  const container =
    document.querySelector(
      "#firebaseExamsList"
    );

  if (!container) return;


  try {

    const firebaseExams =
      await getExams();


    let localExams = [];

    try {

      localExams =
        JSON.parse(
          localStorage.getItem(
            "app_exams"
          )
        ) || [];

    } catch {

      localExams = [];

    }


    examsCache = [

      ...firebaseExams.map(
        exam => ({
          ...exam,
          source: "firebase"
        })
      ),

      ...localExams.map(
        exam => ({
          ...exam,
          source: "local"
        })
      )

    ];


    if (!examsCache.length) {

      container.innerHTML = `

<div style="
  padding:40px;
  text-align:center;
  color:#94a3b8;
">

لا توجد امتحانات

</div>

`;

      return;

    }


    container.innerHTML =
      examsCache
        .map(
          (exam) => {

            const isOpen =
              exam.isPublished !== false &&
              exam.isPublished !== "false";


            const examId =
              exam.firestoreId ||
              exam.id;


            return `

<div
  class="examManagementCard"
  data-exam-id="${examId}"
  style="
    background:linear-gradient(135deg,#1e293b,#0f172a);
    border-radius:20px;
    padding:22px;
    margin-bottom:15px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    flex-wrap:wrap;
    gap:15px;
  "
>


<div>


<div style="
  margin-bottom:8px;
">


<span style="
  background:#312e81;
  color:#c7d2fe;
  padding:5px 12px;
  border-radius:8px;
  font-size:12px;
">

${exam.className || "عام"}

</span>


<span style="
  background:#065f46;
  color:#6ee7b7;
  padding:5px 12px;
  border-radius:8px;
  font-size:12px;
  margin-right:5px;
">

${exam.subject || "physics"}

</span>


<span
  class="examStatus"
  style="
    background:${isOpen ? "#064e3b" : "#7f1d1d"};
    color:${isOpen ? "#6ee7b7" : "#fca5a5"};
    padding:5px 12px;
    border-radius:8px;
    font-size:12px;
    margin-right:5px;
  "
>

${
  isOpen
    ? "🟢 مفتوح للطلاب"
    : "🔴 مغلق عن الطلاب"
}

</span>


</div>


<h3 style="
  color:white;
  margin:5px 0;
">

${exam.title || "امتحان بدون اسم"}

</h3>


<p style="
  color:#94a3b8;
  font-size:13px;
">

المدة:
${exam.duration || 0}
دقائق

|

الأسئلة:
${exam.questions?.length || 0}

</p>


</div>



<div style="
  display:flex;
  gap:10px;
  flex-wrap:wrap;
">


<button
  type="button"
  class="toggleExam"
  data-id="${examId}"
  data-source="${exam.source}"
  data-open="${isOpen}"
  style="
    background:${isOpen ? "#991b1b" : "#047857"};
    color:white;
    border:none;
    padding:8px 14px;
    border-radius:10px;
    cursor:pointer;
    font-family:inherit;
    font-weight:700;
  "
>

${
  isOpen
    ? "🔒 غلق "
    : "🔓 فتح "
}

</button>



<button
  type="button"
  class="editExam"
  data-id="${examId}"
  style="
    background:#3730a3;
    color:white;
    border:none;
    padding:8px 14px;
    border-radius:10px;
    cursor:pointer;
    font-family:inherit;
    font-weight:700;
  "
>

تعديل

</button>



<button
  type="button"
  class="deleteExam"
  data-id="${examId}"
  data-source="${exam.source}"
  style="
    background:#991b1b;
    color:white;
    border:none;
    padding:8px 14px;
    border-radius:10px;
    cursor:pointer;
    font-family:inherit;
    font-weight:700;
  "
>

حذف

</button>


</div>


</div>

`;

          }
        )
        .join("");


  } catch (error) {

    console.error(
      "LOAD EXAMS ERROR:",
      error
    );


    container.innerHTML = `

<div style="
  color:#ef4444;
  padding:30px;
  text-align:center;
">

حدث خطأ في تحميل الامتحانات

<br>

<span style="
  font-size:12px;
  color:#94a3b8;
">

${error?.message || ""}

</span>

</div>

`;

  }

}


// ======================================================
// EVENTS
// ======================================================

document.addEventListener(
  "click",
  async (e) => {

    const app =
      document.querySelector(
        "#app"
      );

    if (!app) return;


    // ==================================================
    // TOGGLE OPEN / CLOSE
    // ==================================================

    const toggle =
      e.target.closest(
        ".toggleExam"
      );


    if (toggle) {

      /*
       * مهم:
       * امنع أي Listener آخر على document
       * من استقبال نفس الضغطة.
       */

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();


      if (
        toggle.dataset.busy === "true"
      ) {

        return;

      }


      toggle.dataset.busy =
        "true";


      const id =
        toggle.dataset.id;


      const source =
        toggle.dataset.source;


      const currentlyOpen =
        toggle.dataset.open === "true";


      const newStatus =
        !currentlyOpen;


      const card =
        toggle.closest(
          ".examManagementCard"
        );


      const status =
        card?.querySelector(
          ".examStatus"
        );


      const oldText =
        toggle.textContent;


      toggle.disabled =
        true;


      toggle.textContent =
        "جاري التحديث...";


      try {

        // ==============================================
        // FIREBASE
        // ==============================================

        if (
          source === "firebase"
        ) {

          await updateExam(
            id,
            {
              isPublished:
                newStatus
            }
          );

        }

        // ==============================================
        // LOCAL
        // ==============================================

        else {

          let exams =
            JSON.parse(
              localStorage.getItem(
                "app_exams"
              )
            ) || [];


          exams =
            exams.map(
              exam => {

                const examId =
                  exam.firestoreId ||
                  exam.id;


                if (
                  String(examId) ===
                  String(id)
                ) {

                  return {
                    ...exam,
                    isPublished:
                      newStatus
                  };

                }


                return exam;

              }
            );


          localStorage.setItem(
            "app_exams",
            JSON.stringify(exams)
          );

        }


        // ==============================================
        // UPDATE CACHE
        // ==============================================

        examsCache =
          examsCache.map(
            exam => {

              const examId =
                exam.firestoreId ||
                exam.id;


              if (
                String(examId) ===
                String(id)
              ) {

                return {
                  ...exam,
                  isPublished:
                    newStatus
                };

              }


              return exam;

            }
          );


        // ==============================================
        // UPDATE BUTTON
        // ==============================================

        toggle.dataset.open =
          String(newStatus);


        toggle.style.background =
          newStatus
            ? "#991b1b"
            : "#047857";


        toggle.textContent =
          newStatus
            ? "🔒 غلق "
            : "🔓 فتح ";


        // ==============================================
        // UPDATE STATUS BADGE
        // ==============================================

        if (status) {

          status.style.background =
            newStatus
              ? "#064e3b"
              : "#7f1d1d";


          status.style.color =
            newStatus
              ? "#6ee7b7"
              : "#fca5a5";


          status.textContent =
            newStatus
              ? "🟢 مفتوح للطلاب"
              : "🔴 مغلق عن الطلاب";

        }


        toggle.disabled =
          false;


        toggle.dataset.busy =
          "false";


        /*
         * لا يوجد:
         *
         * loadExamsList()
         *
         * ولا:
         *
         * app.innerHTML
         *
         *
         * لذلك الصفحة لن تخرج.
         */

      } catch (error) {

        console.error(
          "TOGGLE EXAM ERROR:",
          error
        );


        toggle.disabled =
          false;


        toggle.dataset.busy =
          "false";


        toggle.dataset.open =
          String(currentlyOpen);


        toggle.textContent =
          oldText;


        alert(
          "حدث خطأ أثناء تغيير حالة الامتحان.\n\n" +
          (error?.message || "")
        );

      }


      return;

    }


    // ==================================================
    // BACK TO DASHBOARD
    // ==================================================

    const back =
      e.target.closest(
        "#btnBackToDashboard"
      );


    if (back) {

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();


      app.innerHTML =
        adminPage();


      return;

    }


    // ==================================================
    // EDIT
    // ==================================================

    const edit =
      e.target.closest(
        ".editExam"
      );


    if (edit) {

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();


      const id =
        edit.dataset.id;


      const exam =
        examsCache.find(
          x =>
            String(
              x.firestoreId ||
              x.id
            ) ===
            String(id)
        );


      if (exam) {

        setExamToEdit(
          exam
        );


        app.innerHTML =
          createExamPage();

      }


      return;

    }


    // ==================================================
    // DELETE
    // ==================================================

    const del =
      e.target.closest(
        ".deleteExam"
      );


    if (del) {

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();


      if (
        !confirm(
          "هل تريد حذف الامتحان؟"
        )
      ) {

        return;

      }


      const id =
        del.dataset.id;


      const source =
        del.dataset.source;


      try {

        if (
          source === "firebase"
        ) {

          await deleteExam(
            id
          );

        } else {

          let exams =
            JSON.parse(
              localStorage.getItem(
                "app_exams"
              )
            ) || [];


          exams =
            exams.filter(
              exam =>
                String(
                  exam.id
                ) !==
                String(id)
            );


          localStorage.setItem(
            "app_exams",
            JSON.stringify(exams)
          );

        }


        await loadExamsList();

      } catch (error) {

        console.error(
          "DELETE EXAM ERROR:",
          error
        );


        alert(
          "حدث خطأ أثناء حذف الامتحان.\n\n" +
          (error?.message || "")
        );

      }


      return;

    }

  },
  true
);