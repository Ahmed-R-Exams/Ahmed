// pages/exams.js

import { showExam } from "./exam.js";

import {
  getExams,
  getExamByFirestoreId
} from "../services/examService.js";


// ======================================================
// TEMP EXAMS MEMORY
// ======================================================

window.__studentExamsList =
  window.__studentExamsList || [];


// ======================================================
// EXAMS PAGE
// ======================================================

export function examsPage() {

  const currentClass =
    localStorage.getItem("currentClass") ||
    localStorage.getItem("currentGrade") ||
    "";

  const currentSubject =
    localStorage.getItem("currentSubject") ||
    "physics";


  setTimeout(() => {

    loadStudentExams(
      currentClass,
      currentSubject
    );

  }, 0);


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
          type="button"
          style="
            padding:10px 18px;
            border-radius:12px;
            cursor:pointer;
            font-family:Cairo;
          "
        >
          الرئيسية
        </button>


        <h1 style="
          color:white;
          text-align:center;
          margin:30px;
        ">
          قائمة الاختبارات المتاحة
        </h1>


        <div id="studentFirebaseExams">

          <div style="
            text-align:center;
            padding:50px 20px;
            background:#1e293b;
            border-radius:20px;
            color:white;
          ">

            <h3>
              جاري تحميل الاختبارات...
            </h3>

          </div>

        </div>

      </div>

    </div>
  `;
}


// ======================================================
// LOAD STUDENT EXAMS
// ======================================================

async function loadStudentExams(
  currentClass,
  currentSubject
) {

  const container =
    document.querySelector(
      "#studentFirebaseExams"
    );


  if (!container) return;


  try {

    const allExams =
      await getExams();


    const normalize = (value) =>
      String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");


    const selectedClass =
      normalize(currentClass);


    const selectedSubject =
      normalize(currentSubject);


    const exams =
      Array.isArray(allExams)
        ? allExams
        : [];


    const filteredExams =
      exams.filter((exam) => {

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


        const classMatch =
          !selectedClass ||
          examClass.includes(
            selectedClass
          ) ||
          selectedClass.includes(
            examClass
          );


        const subjectMatch =
          examSubject ===
            selectedSubject ||
          (
            selectedSubject ===
              "physics" &&
            examSubject === ""
          );


        return (
          classMatch &&
          subjectMatch
        );

      });


    // ==================================================
    // STORE FRESH LIST
    // ==================================================

    window.__studentExamsList =
      filteredExams;


    // ==================================================
    // COMPLETED
    // ==================================================

    let completedExams = [];

    try {

      completedExams =
        JSON.parse(
          localStorage.getItem(
            "completedExams"
          ) || "[]"
        );

      if (!Array.isArray(completedExams)) {
        completedExams = [];
      }

    } catch {

      completedExams = [];

    }


    // ==================================================
    // NO EXAMS
    // ==================================================

    if (!filteredExams.length) {

      container.innerHTML = `

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

      return;

    }


    // ==================================================
    // EXAMS CARDS
    // ==================================================

    container.innerHTML = `

      <div style="
        display:grid;
        grid-template-columns:
          repeat(auto-fill,minmax(260px,1fr));
        gap:20px;
      ">

        ${filteredExams
          .map((exam, index) => {

            const examId =
              exam.firestoreId ||
              exam.id ||
              `exam_${index}`;


            const isCompleted =
              completedExams.includes(
                examId
              ) ||
              completedExams.includes(
                String(examId)
              );


            // ==================================================
            // FIREBASE PUBLISH STATUS
            // ==================================================

            const isPublished =
              exam.isPublished === true ||
              exam.isPublished === "true";


            // ==================================================
            // MANUAL CLOSE
            // ==================================================

            const isManuallyClosed =
              exam.manualClose === true ||
              exam.manualClose === "true";


            // ==================================================
            // END DATE
            // ==================================================

            const endDateTime =
              exam.endDate
                ? new Date(
                    exam.endDate
                  ).getTime()
                : null;


            const isExpired =
              endDateTime &&
              Date.now() >
                endDateTime;


            // ==================================================
            // FINAL CLOSED STATE
            // ==================================================

            const isClosed =
              !isPublished ||
              isManuallyClosed ||
              isExpired;


            return `

              <div style="
                background:#1e293b;
                padding:22px;
                border-radius:20px;
              ">

                <h3 style="
                  color:white;
                  margin-top:0;
                ">
                  ${
                    exam.title ||
                    exam.name ||
                    "اختبار"
                  }
                </h3>


                <p style="
                  color:#94a3b8;
                ">
                  ${
                    exam.className ||
                    currentClass
                  }
                </p>


                <p style="
                  color:#94a3b8;
                ">
                  عدد الأسئلة:

                  ${
                    Array.isArray(
                      exam.questions
                    )
                      ? exam.questions.length
                      : 0
                  }

                </p>


                ${
                  isCompleted

                    ? `

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

                    : isClosed

                    ? `

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

                    : `

                      <button
                        type="button"
                        class="goToLoginBtn"
                        data-exam-index="${index}"

                        style="
                          width:100%;
                          padding:12px;
                          background:#6366f1;
                          color:white;
                          border:none;
                          border-radius:12px;
                          cursor:pointer;
                          font-family:Cairo;
                          font-weight:bold;
                        "
                      >

                        ابدأ الاختبار

                      </button>

                    `
                }

              </div>

            `;

          })
          .join("")}

      </div>

    `;

  } catch (error) {

    console.error(
      "Student exams Firebase error:",
      error
    );


    container.innerHTML = `

      <div style="
        color:#ef4444;
        padding:30px;
        background:#1e293b;
        border-radius:20px;
        text-align:center;
      ">

        <h3>
          حدث خطأ في تحميل الامتحانات
        </h3>

        <p style="
          color:#94a3b8;
        ">

          ${
            error?.message ||
            "تأكد من الاتصال بالإنترنت."
          }

        </p>

      </div>

    `;

  }

}


// ======================================================
// STUDENT LOGIN PAGE
// ======================================================

export function studentLoginPage() {

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
          autocomplete="off"

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
          "
        >


        <button
          id="submitLoginBtn"
          type="button"

          style="
            width:100%;
            padding:15px;
            background:#6366f1;
            color:white;
            border:none;
            border-radius:12px;
            cursor:pointer;
            font-weight:bold;
            font-family:Cairo;
          "
        >

          دخول وبدء الاختبار

        </button>

      </div>

    </div>

  `;

}


// ======================================================
// EVENTS
// ======================================================

document.addEventListener(
  "click",
  async (e) => {

    const app =
      document.querySelector("#app");


    if (!app) return;


    // ==================================================
    // BACK HOME
    // ==================================================

    const backMainBtn =
      e.target.closest(
        "#backToHomeMainBtn"
      );


    if (backMainBtn) {

      window.location.reload();

      return;

    }


    // ==================================================
    // START EXAM
    // ==================================================

    const loginBtn =
      e.target.closest(
        ".goToLoginBtn"
      );


    if (loginBtn) {

      const index =
        Number(
          loginBtn.dataset.examIndex
        );


      const oldExam =
        window.__studentExamsList?.[
          index
        ];


      if (!oldExam) {

        alert(
          "تعذر العثور على بيانات الامتحان."
        );

        return;

      }


      // ==================================================
      // GET FRESH EXAM FROM FIREBASE
      // ==================================================

      let exam =
        oldExam;


      try {

        const firestoreId =
          oldExam.firestoreId ||
          "";


        if (firestoreId) {

          const freshExam =
            await getExamByFirestoreId(
              firestoreId
            );


          if (freshExam) {

            exam =
              freshExam;

          }

        }

      } catch (error) {

        console.error(
          "FRESH EXAM CHECK ERROR:",
          error
        );

      }


      // ==================================================
      // FINAL FIREBASE OPEN CHECK
      // ==================================================

      const isPublished =
        exam.isPublished === true ||
        exam.isPublished === "true";


      const isManuallyClosed =
        exam.manualClose === true ||
        exam.manualClose === "true";


      const endDateTime =
        exam.endDate
          ? new Date(
              exam.endDate
            ).getTime()
          : null;


      const isExpired =
        endDateTime &&
        Date.now() >
          endDateTime;


      if (
        !isPublished ||
        isManuallyClosed ||
        isExpired
      ) {

        alert(
          "هذا الامتحان مغلق حاليًا."
        );


        await loadStudentExams(
          localStorage.getItem(
            "currentClass"
          ) ||
          localStorage.getItem(
            "currentGrade"
          ) ||
          "",

          localStorage.getItem(
            "currentSubject"
          ) ||
          "physics"
        );


        return;

      }


      // ==================================================
      // SAVE FRESH EXAM
      // ==================================================

      window.__selectedExamForLaunch =
        exam;


      window.__studentExamsList[index] =
        exam;


      localStorage.setItem(
        "currentSelectedExam",
        JSON.stringify({

          id:
            exam.id ||
            "",

          firestoreId:
            exam.firestoreId ||
            "",

          title:
            exam.title ||
            exam.name ||
            ""

        })
      );


      app.innerHTML =
        studentLoginPage();


      setTimeout(() => {

        const input =
          document.getElementById(
            "loginStudentNameInput"
          );


        if (input) {

          input.focus();

        }

      }, 50);


      return;

    }


    // ==================================================
    // STUDENT LOGIN
    // ==================================================

    const submitBtn =
      e.target.closest(
        "#submitLoginBtn"
      );


    if (submitBtn) {

      const input =
        document.getElementById(
          "loginStudentNameInput"
        );


      if (!input) return;


      const name =
        input.value.trim();


      if (!name) {

        alert(
          "اكتب اسم الطالب"
        );


        input.focus();

        return;

      }


      let exam =
        window.__selectedExamForLaunch ||
        window.__activeExam ||
        null;


      if (!exam) {

        alert(
          "تعذر العثور على الامتحان، ارجع لقائمة الامتحانات وحاول مرة أخرى."
        );

        return;

      }


      // ==================================================
      // VERY IMPORTANT:
      // RE-CHECK FIREBASE BEFORE ACTUAL EXAM
      // ==================================================

      try {

        const firestoreId =
          exam.firestoreId ||
          "";


        if (firestoreId) {

          const freshExam =
            await getExamByFirestoreId(
              firestoreId
            );


          if (freshExam) {

            exam =
              freshExam;

            window.__selectedExamForLaunch =
              freshExam;

          }

        }

      } catch (error) {

        console.error(
          "FINAL FIREBASE EXAM CHECK ERROR:",
          error
        );


        alert(
          "تعذر التأكد من حالة الامتحان. حاول مرة أخرى."
        );


        return;

      }


      // ==================================================
      // FINAL OPEN CHECK
      // ==================================================

      const isPublished =
        exam.isPublished === true ||
        exam.isPublished === "true";


      const isManuallyClosed =
        exam.manualClose === true ||
        exam.manualClose === "true";


      const endDateTime =
        exam.endDate
          ? new Date(
              exam.endDate
            ).getTime()
          : null;


      const isExpired =
        endDateTime &&
        Date.now() >
          endDateTime;


      if (
        !isPublished ||
        isManuallyClosed ||
        isExpired
      ) {

        alert(
          "هذا الامتحان مغلق حاليًا."
        );


        window.__selectedExamForLaunch =
          null;


        return;

      }


      // ==================================================
      // PREVENT RETAKE
      // ==================================================

      const examId =
        exam.firestoreId ||
        exam.id ||
        "";


      try {

        const results =
          JSON.parse(
            localStorage.getItem(
              "examResults"
            ) || "[]"
          );


        const alreadyDone =
          results.some(
            (r) =>

              String(
                r.examId ||
                ""
              ) ===
              String(
                examId
              )

              &&

              String(
                r.studentName ||
                ""
              ).trim() ===
              name

          );


        if (alreadyDone) {

          alert(
            "لقد سبق لك أداء هذا الاختبار"
          );

          return;

        }

      } catch (error) {

        console.warn(
          "LOCAL RESULTS CHECK ERROR:",
          error
        );

      }


      // ==================================================
      // SAVE STUDENT
      // ==================================================

      localStorage.setItem(
        "studentName",
        name
      );


      // ==================================================
      // PASS EXAM TO EXAM PAGE
      // ==================================================

      window.__activeExam =
        exam;


      launchExamView(
        exam
      );


      return;

    }


    // ==================================================
    // BACK AFTER EXAM
    // ==================================================

    const backHomeAfterExam =
      e.target.closest(
        "#backHomeAfterExam"
      );


    if (backHomeAfterExam) {

      localStorage.removeItem(
        "currentSelectedExam"
      );


      localStorage.removeItem(
        "studentName"
      );


      window.__activeExam =
        null;


      window.__selectedExamForLaunch =
        null;


      window.location.reload();


      return;

    }

  }
);


// ======================================================
// LAUNCH EXAM
// ======================================================

function launchExamView(exam) {

  if (!exam) {

    alert(
      "تعذر فتح الامتحان."
    );

    return;

  }


  // ==================================================
  // FINAL SAFETY CHECK
  // ==================================================

  const isPublished =
    exam.isPublished === true ||
    exam.isPublished === "true";


  const isManuallyClosed =
    exam.manualClose === true ||
    exam.manualClose === "true";


  const endDateTime =
    exam.endDate
      ? new Date(
          exam.endDate
        ).getTime()
      : null;


  const isExpired =
    endDateTime &&
    Date.now() >
      endDateTime;


  if (
    !isPublished ||
    isManuallyClosed ||
    isExpired
  ) {

    alert(
      "هذا الامتحان مغلق حاليًا."
    );

    return;

  }


  // ==================================================
  // SAVE ACTIVE EXAM
  // ==================================================

  window.__activeExam =
    exam;


  // ==================================================
  // SAVE LIGHT REFERENCE ONLY
  // ==================================================

  localStorage.setItem(
    "currentActiveExamRef",
    JSON.stringify({

      firestoreId:
        exam.firestoreId ||
        "",

      id:
        exam.id ||
        "",

      title:
        exam.title ||
        exam.name ||
        ""

    })
  );


  // ==================================================
  // REMOVE OLD FULL EXAM
  // ==================================================

  localStorage.removeItem(
    "currentActiveExam"
  );


  const app =
    document.querySelector(
      "#app"
    );


  if (!app) return;


  try {

    app.innerHTML =
      showExam();

  } catch (error) {

    console.error(
      "SHOW EXAM ERROR:",
      error
    );


    app.innerHTML = `

      <div style="
        min-height:100vh;
        background:#0f172a;
        color:white;
        display:flex;
        align-items:center;
        justify-content:center;
        text-align:center;
        direction:rtl;
        font-family:Cairo;
        padding:30px;
      ">

        <div>

          <h2>
            حدث خطأ أثناء فتح الامتحان
          </h2>


          <p style="
            color:#94a3b8;
          ">

            ${
              error?.message ||
              ""
            }

          </p>

        </div>

      </div>

    `;

  }

}