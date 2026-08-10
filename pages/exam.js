// pages/exam.js

import { saveResult, getResults } from "../services/resultService.js";
import { getExamByFirestoreId } from "../services/examService.js";
import { startTimer, stopTimer } from "../utils/timer.js";
import { examSettings } from "../config/settings.js";

// ======================================================
// TEACHER SETTINGS
// ======================================================

function readExamSettings() {
  return {
    examTimeMinutes: Math.max(
      1,
      Number(localStorage.getItem("examTime")) || 30
    ),

    // النتيجة والمراجعة مقفولة حاليًا بعد التسليم.
    // سيتم التحكم فيها لاحقًا من لوحة المعلم.
    showScore: false,
    showAnswers: false,
    allowReview: false,
  };
}

// ======================================================
// STYLES
// ======================================================

function injectExamStyles() {
  if (document.getElementById("examPageStyles")) return;

  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap";

  document.head.appendChild(fontLink);

  const style = document.createElement("style");

  style.id = "examPageStyles";

  style.textContent = `
    .exam-wrap{
      font-family:'Cairo',sans-serif;
      direction:rtl;
      max-width:960px;
      margin:0 auto;
      padding:16px 16px 60px;
      color:#1e293b;
      -webkit-user-select:none;
      user-select:none;
    }

    .exam-wrap textarea,
    .exam-wrap input{
      -webkit-user-select:text;
      user-select:text;
    }

    .exam-header{
      background:linear-gradient(135deg,#4f46e5,#7c3aed);
      border-radius:20px;
      padding:24px 20px;
      color:#fff;
      margin-bottom:22px;
      box-shadow:0 10px 30px -10px rgba(79,70,229,.5);
    }

    .exam-header h1{
      margin:0 0 4px;
      font-size:22px;
      font-weight:800;
    }

    .exam-header .student{
      font-size:14px;
      opacity:.9;
      margin:0 0 16px;
    }

    .exam-progress-track{
      background:rgba(255,255,255,.25);
      border-radius:999px;
      height:10px;
      overflow:hidden;
    }

    .exam-progress-fill{
      height:100%;
      width:0%;
      background:#fff;
      border-radius:999px;
      transition:width .35s ease;
    }

    .exam-progress-label{
      font-size:12px;
      margin-top:8px;
      opacity:.9;
      font-weight:600;
    }

    .exam-layout{
      display:flex;
      gap:20px;
      align-items:flex-start;
    }

    .exam-sidebar{
      flex:0 0 220px;
      position:sticky;
      top:16px;
      background:#fff;
      border:1px solid #eef0f5;
      border-radius:16px;
      padding:16px;
    }

    .exam-sidebar-title{
      font-size:13px;
      font-weight:800;
      color:#475569;
      margin:0 0 12px;
    }

    .exam-sidebar-grid{
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:10px;
      max-height:calc(100vh - 120px);
      overflow-y:auto;
      padding:2px;
    }

    .exam-nav-btn{
      width:100%;
      height:42px;
      border:1.5px solid #eef0f5;
      background:#f8fafc;
      border-radius:10px;
      font-family:inherit;
      font-size:15px;
      font-weight:700;
      color:#475569;
      cursor:pointer;
      display:flex;
      align-items:center;
      justify-content:center;
      transition:all .15s ease;
    }

    .exam-nav-btn:hover{
      border-color:#c7d2fe;
      background:#f1f4fd;
    }

    .exam-nav-btn.answered{
      background:#ecfdf5;
      border-color:#6ee7b7;
      color:#047857;
    }

    .exam-nav-btn.active{
      background:#4f46e5;
      border-color:#4f46e5;
      color:#fff;
    }

    .exam-main{
      flex:1;
      min-width:0;
    }

    .exam-q-card{
      background:#fff;
      padding:20px;
      margin:0 0 16px;
      border-radius:16px;
      border:1px solid #eef0f5;
      box-shadow:0 2px 10px -6px rgba(15,23,42,.12);
      transition:box-shadow .2s ease, border-color .2s ease;
      scroll-margin-top:16px;
    }

    .exam-q-card.exam-q-hidden{
      display:none;
    }

    .exam-q-counter{
      font-size:13px;
      font-weight:700;
      color:#94a3b8;
      margin:0 0 8px;
    }

    .exam-q-card.exam-q-answered{
      border-color:#c7d2fe;
      box-shadow:0 8px 22px -10px rgba(79,70,229,.35);
    }

    .exam-q-card.exam-q-flash{
      border-color:#818cf8;
    }

    .exam-q-title{
      display:flex;
      gap:10px;
      align-items:flex-start;
      margin:0 0 14px;
      font-size:16px;
      font-weight:700;
      line-height:1.6;
    }

    .exam-q-badge{
      flex:0 0 auto;
      width:28px;
      height:28px;
      border-radius:9px;
      background:#eef2ff;
      color:#4f46e5;
      font-size:13px;
      font-weight:800;
      display:flex;
      align-items:center;
      justify-content:center;
    }

    .exam-q-img{
      max-width:100%;
      border-radius:12px;
      margin:6px 0 16px;
      display:block;
      pointer-events:none;
    }

    .exam-option{
      display:flex;
      align-items:center;
      gap:10px;
      padding:12px 14px;
      margin:8px 0;
      background:#f8fafc;
      border:1.5px solid #eef0f5;
      border-radius:12px;
      cursor:pointer;
      font-size:15px;
      transition:background .15s ease, border-color .15s ease;
    }

    .exam-option:hover{
      background:#f1f4fd;
    }

    .exam-option input{
      accent-color:#4f46e5;
      width:18px;
      height:18px;
      flex:0 0 auto;
      cursor:pointer;
    }

    .exam-option.checked{
      background:#eef2ff;
      border-color:#818cf8;
    }

    .exam-essay{
      width:100%;
      min-height:120px;
      padding:14px;
      border-radius:12px;
      border:1.5px solid #eef0f5;
      font-size:15px;
      font-family:inherit;
      resize:vertical;
      box-sizing:border-box;
    }

    .exam-essay:focus{
      outline:none;
      border-color:#818cf8;
      background:#f8f9ff;
    }

    .exam-submit-bar{
      position:sticky;
      bottom:12px;
      margin-top:10px;
      display:flex;
      gap:12px;
    }

    .exam-step-btn{
      flex:1;
      padding:15px;
      border-radius:14px;
      font-family:inherit;
      font-size:15px;
      font-weight:700;
      cursor:pointer;
      border:1.5px solid #e2e8f0;
      background:#fff;
      color:#334155;
      transition:all .15s ease;
    }

    .exam-step-btn:hover{
      border-color:#c7d2fe;
      background:#f8fafc;
    }

    .exam-step-btn:disabled{
      opacity:.35;
      cursor:not-allowed;
    }

    .exam-step-next{
      background:linear-gradient(135deg,#4f46e5,#4338ca);
      border-color:transparent;
      color:#fff;
      box-shadow:0 10px 24px -8px rgba(79,70,229,.5);
    }

    .exam-step-next:hover{
      background:linear-gradient(135deg,#4338ca,#3730a3);
    }

    .exam-submit-btn{
      flex:1;
      padding:15px;
      background:linear-gradient(135deg,#16a34a,#15803d);
      color:#fff;
      border:none;
      border-radius:14px;
      font-size:15px;
      font-weight:700;
      font-family:inherit;
      cursor:pointer;
      box-shadow:0 10px 24px -8px rgba(22,163,74,.55);
      transition:transform .15s ease, box-shadow .15s ease;
    }

    .exam-submit-btn:hover{
      transform:translateY(-1px);
      box-shadow:0 14px 28px -8px rgba(22,163,74,.6);
    }

    .exam-submit-btn:active{
      transform:translateY(0);
    }

    .exam-done{
      text-align:center;
      padding:60px 20px;
      color:#fff;
    }

    .exam-done .check{
      width:64px;
      height:64px;
      border-radius:50%;
      background:rgba(255,255,255,.15);
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:32px;
      margin:0 auto 16px;
    }

    .exam-done h2{
      margin:0 0 10px;
      font-size:22px;
    }

    .exam-done p{
      margin:0;
      opacity:.9;
      font-size:15px;
    }

    .exam-locked{
      font-family:'Cairo',sans-serif;
      direction:rtl;
      max-width:520px;
      margin:40px auto;
      background:#fff;
      border-radius:20px;
      padding:36px 24px;
      text-align:center;
      box-shadow:0 10px 30px -12px rgba(15,23,42,.25);
    }

    .exam-locked .icon{
      width:64px;
      height:64px;
      border-radius:50%;
      background:#fef2f2;
      color:#dc2626;
      font-size:30px;
      display:flex;
      align-items:center;
      justify-content:center;
      margin:0 auto 16px;
    }

    .exam-locked h2{
      margin:0 0 8px;
      font-size:19px;
      color:#1e293b;
    }

    .exam-locked p{
      margin:0 0 20px;
      color:#64748b;
      font-size:14px;
      line-height:1.7;
    }

    .exam-locked button{
      background:#4f46e5;
      color:#fff;
      border:none;
      border-radius:12px;
      padding:12px 24px;
      font-family:inherit;
      font-size:14px;
      font-weight:700;
      cursor:pointer;
    }

    .exam-loading{
      font-family:'Cairo',sans-serif;
      direction:rtl;
      max-width:420px;
      margin:60px auto;
      text-align:center;
      color:#64748b;
    }

    .exam-loading .spinner{
      width:36px;
      height:36px;
      border-radius:50%;
      border:3px solid #e2e8f0;
      border-top-color:#4f46e5;
      margin:0 auto 14px;
      animation:examSpin .8s linear infinite;
    }

    @keyframes examSpin{
      to{
        transform:rotate(360deg);
      }
    }

    @media (max-width:720px){
      .exam-layout{
        flex-direction:column;
      }

      .exam-sidebar{
        position:sticky;
        top:0;
        z-index:5;
        width:100%;
        padding:10px 12px;
      }

      .exam-sidebar-title{
        margin:0 0 8px;
      }

      .exam-sidebar-grid{
        max-height:none;
        grid-template-columns:none;
        grid-auto-flow:column;
        grid-auto-columns:48px;
        overflow-x:auto;
        overflow-y:hidden;
      }

      .exam-nav-btn{
        height:48px;
        font-size:14px;
      }
    }
  `;

  document.head.appendChild(style);
}

// ======================================================
// RANDOMIZATION
// ======================================================

function shuffleArray(arr) {
  const a = arr.slice();

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

function shuffleQuestionOptions(q) {
  if (isEssayQuestion(q)) return q;

  if (!examSettings.shuffleOptions) return q;

  const options = Array.isArray(q.options) ? q.options : [];

  const correctIndex = getQuestionCorrectAnswer(q);

  const indexed = options.map((op, i) => ({
    op,
    i,
  }));

  const shuffled = shuffleArray(indexed);

  const newOptions = shuffled.map((item) => item.op);

  const newCorrectIndex = shuffled.findIndex(
    (item) => item.i === correctIndex
  );

  const cloned = Object.assign({}, q);

  delete cloned.correctIndex;
  delete cloned.rightIndex;
  delete cloned.correctAnswer;
  delete cloned.answer;

  cloned.options = newOptions;
  cloned.correctAnswerIndex = newCorrectIndex;

  return cloned;
}

// ======================================================
// REMOVE UNDEFINED
// ======================================================

function stripUndefinedDeep(value) {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedDeep(item));
  }

  if (value && typeof value === "object") {
    const clean = {};

    Object.keys(value).forEach((key) => {
      if (value[key] === undefined) return;

      clean[key] = stripUndefinedDeep(value[key]);
    });

    return clean;
  }

  return value;
}

// ======================================================
// ATTEMPT LOCK
// ======================================================

function sanitizeKey(str) {
  return String(str || "")
    .trim()
    .replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, "_");
}

function getAttemptKey(examId) {
  return `examAttempt_${sanitizeKey(examId)}`;
}

function hasAlreadyAttempted(key) {
  return localStorage.getItem(key) === "done";
}

function markAttempted(key) {
  localStorage.setItem(key, "done");
}

// ======================================================
// ANTI CHEAT
// ======================================================

function applyAntiCheat(root) {
  const block = (e) => e.preventDefault();

  root.addEventListener("contextmenu", block);
  root.addEventListener("copy", block);
  root.addEventListener("cut", block);
  root.addEventListener("dragstart", block);

  root.addEventListener("selectstart", (e) => {
    const tag = e.target.tagName;

    if (tag === "TEXTAREA" || tag === "INPUT") return;

    e.preventDefault();
  });

  const keyBlock = (e) => {
    const k = (e.key || "").toLowerCase();

    const blocked =
      k === "f12" ||
      (e.ctrlKey &&
        e.shiftKey &&
        ["i", "j", "c"].includes(k)) ||
      (e.ctrlKey && ["u", "s", "p"].includes(k)) ||
      (e.metaKey &&
        e.altKey &&
        ["i", "j", "c"].includes(k));

    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  document.addEventListener("keydown", keyBlock);
}

// ======================================================
// CHECK PREVIOUS ATTEMPT
// ======================================================

async function checkAlreadyAttempted(
  examId,
  examTitle,
  studentName
) {
  const attemptKey = getAttemptKey(
    examId
  );

  if (hasAlreadyAttempted(attemptKey)) {
    return true;
  }

  try {
    const results = await getResults();

    const studentKey = sanitizeKey(studentName);

    return results.some((r) => {
      if (sanitizeKey(r.studentName) !== studentKey) {
        return false;
      }

      if (examId) {
        return (
          sanitizeKey(r.examId) ===
          sanitizeKey(examId)
        );
      }

      return (
        sanitizeKey(r.examTitle) ===
        sanitizeKey(examTitle)
      );
    });
  } catch (error) {
    console.error(
      "ATTEMPT CHECK ERROR:",
      error
    );

    return false;
  }
}

// ======================================================
// LOCKED SCREEN
// ======================================================

function lockedScreenHTML() {
  return `
    <div class="exam-locked">
      <div class="icon">🔒</div>

      <h2>
        لقد قمت بأداء هذا الامتحان من قبل
      </h2>

      <p>
        لا يمكن أداء نفس الامتحان أكثر من مرة واحدة.
        إذا كنت تظن أن هذا خطأ، تواصل مع المسؤول.
      </p>

      <button id="examLockedBackBtn">
        العودة للصفحة الرئيسية
      </button>
    </div>
  `;
}

// ======================================================
// EXAM TEMPLATE
// ======================================================

function buildExamTemplate(
  examTitle,
  studentName,
  questions
) {
  return `
    <div class="exam-wrap">

    <div class="exam-header">

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:12px;
      ">

        <div>
          <h1>${examTitle}</h1>

          <p class="student">
            الطالب: ${studentName}
          </p>
        </div>

        <div id="examTimerBox" style="
          background:rgba(255,255,255,.15);
          border-radius:14px;
          padding:8px 16px;
          text-align:center;
          font-weight:800;
          font-size:18px;
          min-width:80px;
        ">
          ⏱
          <span id="examTimerLabel">
            --:--
          </span>
        </div>

      </div>

      <div class="exam-progress-track">
        <div
          class="exam-progress-fill"
          id="examProgressFill"
        ></div>
      </div>

      <p
        class="exam-progress-label"
        id="examProgressLabel"
      >
        تمت الإجابة عن 0 من ${questions.length} سؤال
      </p>

    </div>

    <div class="exam-layout">

      <div class="exam-sidebar">

        <p class="exam-sidebar-title">
          الأسئلة (${questions.length})
        </p>

        <div class="exam-sidebar-grid">

          ${questions
            .map(
              (q, index) => `
                <button
                  type="button"
                  class="exam-nav-btn"
                  data-index="${index}"
                >
                  ${index + 1}
                </button>
              `
            )
            .join("")}

        </div>

      </div>

      <div class="exam-main">

        <form id="examSubmitForm">

          ${questions
            .map((q, index) => {
              return `
                <div
                  class="exam-q-card${
                    index === 0
                      ? ""
                      : " exam-q-hidden"
                  }"
                  id="examQCard${index}"
                  data-index="${index}"
                >

                  <p class="exam-q-counter">
                    سؤال ${index + 1} من ${
                questions.length
              }
                  </p>

                  <h3 class="exam-q-title">

                    <span class="exam-q-badge">
                      ${index + 1}
                    </span>

                    <span>
                      ${q.question || q.text || ""}
                    </span>

                  </h3>

                  ${
                    q.image || q.questionImage
                      ? `
                        <img
                          class="exam-q-img"
                          src="${
                            q.image ||
                            q.questionImage
                          }"
                        >
                      `
                      : ""
                  }

                  ${renderAnswers(q, index)}

                </div>
              `;
            })
            .join("")}

          <div class="exam-submit-bar">

            <button
              type="button"
              class="exam-step-btn exam-step-next"
              id="examNextBtn"
            >
              التالي
            </button>

            <button
              type="button"
              class="exam-submit-btn"
              id="examSubmitBtn"
              style="display:none;"
            >
              تسليم الامتحان
            </button>

            <button
              type="button"
              class="exam-step-btn"
              id="examPrevBtn"
              disabled
            >
              السابق
            </button>

          </div>

        </form>

      </div>

    </div>

    </div>
  `;
}

// ======================================================
// POST SUBMIT SCREEN
// ======================================================
// مهم:
// لا توجد نتيجة.
// لا توجد مراجعة.
// لا توجد إجابات.
// لا يوجد زر مراجعة.
// ======================================================

function buildDoneScreen() {
  return `
    <div class="exam-done">

      <div class="check">
        ✅
      </div>

      <h2>
        تم تسليم الامتحان بنجاح
      </h2>

      <p>
        تم حفظ إجاباتك بنجاح.
      </p>

      <p style="
        margin-top:10px;
        opacity:.75;
      ">
        سيتم إعلان النتيجة من قبل المعلم.
      </p>

    </div>
  `;
}

// ======================================================
// REVIEW SCREEN
// ======================================================
// موجود في الكود تحسبًا لاستخدامه مستقبلًا.
// لكنه غير قابل للوصول بعد التسليم حاليًا.
// ======================================================

function buildReviewScreen({
  questions,
  answers,
  settings,
}) {
  const rows = questions
    .map((q, index) => {
      if (isEssayQuestion(q)) {
        return `
          <div class="exam-q-card">

            <p class="exam-q-counter">
              سؤال ${index + 1}
            </p>

            <h3 class="exam-q-title">
              <span>
                ${q.question || q.text || ""}
              </span>
            </h3>

            <p style="
              background:#f8fafc;
              border-radius:12px;
              padding:12px;
              white-space:pre-wrap;
            ">
              إجابتك:
              ${answers[index] || "(بدون إجابة)"}
            </p>

          </div>
        `;
      }

      const correctIndex =
        getQuestionCorrectAnswer(q);

      const studentAnswer =
        answers[index];

      const isCorrect =
        studentAnswer === correctIndex;

      const optionsHTML = (q.options || [])
        .filter(
          (op) =>
            op &&
            String(op).trim() !== ""
        )
        .map((op, i) => {
          let bg = "#f8fafc";
          let border = "#eef0f5";

          if (
            settings.showAnswers &&
            i === correctIndex
          ) {
            bg = "#ecfdf5";
            border = "#6ee7b7";
          }

          if (
            i === studentAnswer &&
            !isCorrect
          ) {
            bg = "#fef2f2";
            border = "#fca5a5";
          }

          if (
            i === studentAnswer &&
            isCorrect
          ) {
            bg = "#ecfdf5";
            border = "#6ee7b7";
          }

          return `
            <div style="
              display:flex;
              align-items:center;
              gap:10px;
              padding:10px 14px;
              margin:6px 0;
              background:${bg};
              border:1.5px solid ${border};
              border-radius:12px;
              font-size:15px;
            ">
              ${
                i === studentAnswer
                  ? "👉"
                  : ""
              }

              <span>${op}</span>
            </div>
          `;
        })
        .join("");

      return `
        <div class="exam-q-card">

          <p class="exam-q-counter">
            سؤال ${index + 1}
            ${
              settings.showAnswers
                ? ` — ${
                    isCorrect
                      ? "✅ صحيحة"
                      : "❌ خاطئة"
                  }`
                : ""
            }
          </p>

          <h3 class="exam-q-title">
            <span>
              ${q.question || q.text || ""}
            </span>
          </h3>

          ${optionsHTML}

        </div>
      `;
    })
    .join("");

  return `
    <div class="exam-wrap">

      <div class="exam-header">

        <h1>
          مراجعة الإجابات
        </h1>

      </div>

      <div class="exam-main">
        ${rows}
      </div>

      <button
        id="examReviewBackBtn"
        class="exam-step-btn exam-step-next"
        style="
          width:100%;
          margin-top:16px;
        "
      >
        الصفحة الرئيسية
      </button>

    </div>
  `;
}

// ======================================================
// WIRE EXAM
// ======================================================

function wireUpExam({
  studentName,
  examTitle,
  exam,
  examId,
  attemptKey,
  questions,
  settings,
}) {
  const wrap =
    document.querySelector(".exam-wrap");

  const form =
    document.getElementById(
      "examSubmitForm"
    );

  if (!form) {
    return;
  }

  if (wrap) {
    applyAntiCheat(wrap);
  }

  // ====================================================
  // TIMER
  // ====================================================

  const timerLabel =
    document.getElementById(
      "examTimerLabel"
    );

  let secondsLeft =
    settings.examTimeMinutes * 60;

  let autoSubmitting = false;

  function renderTimer() {
    const m = Math.floor(
      secondsLeft / 60
    );

    const s =
      secondsLeft % 60;

    if (timerLabel) {
      timerLabel.textContent =
        `${String(m).padStart(
          2,
          "0"
        )}:${String(s).padStart(
          2,
          "0"
        )}`;

      if (secondsLeft <= 60) {
        timerLabel.style.color =
          "#fecaca";
      }
    }
  }

  renderTimer();

  startTimer(
    () => {
      secondsLeft -= 1;

      renderTimer();

      return secondsLeft > 0;
    },

    () => {
      if (autoSubmitting) {
        return;
      }

      autoSubmitting = true;

      handleSubmit(true);
    }
  );

  // ====================================================
  // PROGRESS
  // ====================================================

  const progressFill =
    document.getElementById(
      "examProgressFill"
    );

  const progressLabel =
    document.getElementById(
      "examProgressLabel"
    );

  function updateProgress() {
    let answered = 0;

    questions.forEach(
      (q, index) => {
        const navBtn =
          document.querySelector(
            `.exam-nav-btn[data-index="${index}"]`
          );

        let isAnswered = false;

        if (
          isEssayQuestion(q)
        ) {
          const el =
            form.querySelector(
              `[name="question_${index}"]`
            );

          isAnswered =
            !!el &&
            String(
              el.value || ""
            ).trim() !== "";
        } else {
          const checked =
            form.querySelector(
              `[name="question_${index}"]:checked`
            );

          isAnswered =
            !!checked;
        }

        if (isAnswered) {
          answered++;
        }

        if (navBtn) {
          navBtn.classList.toggle(
            "answered",
            isAnswered
          );
        }
      }
    );

    const total =
      questions.length || 1;

    const pct =
      Math.round(
        (answered / total) *
          100
      );

    if (progressFill) {
      progressFill.style.width =
        pct + "%";
    }

    if (progressLabel) {
      progressLabel.textContent =
        `تمت الإجابة عن ${answered} من ${questions.length} سؤال`;
    }
  }

  form.addEventListener(
    "change",
    (e) => {
      const card =
        e.target.closest(
          ".exam-q-card"
        );

      if (card) {
        card.classList.add(
          "exam-q-answered"
        );

        card
          .querySelectorAll(
            ".exam-option"
          )
          .forEach((opt) => {
            const input =
              opt.querySelector(
                "input"
              );

            opt.classList.toggle(
              "checked",
              !!input &&
                input.checked
            );
          });
      }

      updateProgress();
    }
  );

  form.addEventListener(
    "input",
    (e) => {
      if (
        e.target.tagName ===
        "TEXTAREA"
      ) {
        updateProgress();
      }
    }
  );

  updateProgress();

  // ====================================================
  // QUESTION NAVIGATION
  // ====================================================

  const cards =
    Array.from(
      document.querySelectorAll(
        ".exam-q-card"
      )
    );

  const navButtons =
    document.querySelectorAll(
      ".exam-nav-btn"
    );

  const prevBtn =
    document.getElementById(
      "examPrevBtn"
    );

  const nextBtn =
    document.getElementById(
      "examNextBtn"
    );

  const submitBtn =
    document.getElementById(
      "examSubmitBtn"
    );

  let currentIndex = 0;

  function showQuestion(index) {
    if (
      index < 0 ||
      index >= cards.length
    ) {
      return;
    }

    currentIndex = index;

    cards.forEach(
      (card) => {
        const cardIndex =
          Number(
            card.getAttribute(
              "data-index"
            )
          );

        card.classList.toggle(
          "exam-q-hidden",
          cardIndex !==
            currentIndex
        );
      }
    );

    navButtons.forEach(
      (btn) => {
        const btnIndex =
          Number(
            btn.getAttribute(
              "data-index"
            )
          );

        btn.classList.toggle(
          "active",
          btnIndex ===
            currentIndex
        );
      }
    );

    if (prevBtn) {
      prevBtn.disabled =
        currentIndex === 0;
    }

    const isLast =
      currentIndex ===
      questions.length - 1;

    if (nextBtn) {
      nextBtn.style.display =
        isLast ? "none" : "";
    }

    if (submitBtn) {
      submitBtn.style.display =
        isLast ? "" : "none";
    }

    const activeCard =
      document.getElementById(
        `examQCard${currentIndex}`
      );

    if (activeCard) {
      activeCard.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener(
      "click",
      () =>
        showQuestion(
          currentIndex - 1
        )
    );
  }

  if (nextBtn) {
    nextBtn.addEventListener(
      "click",
      () =>
        showQuestion(
          currentIndex + 1
        )
    );
  }

  navButtons.forEach(
    (btn) => {
      btn.addEventListener(
        "click",
        () => {
          showQuestion(
            Number(
              btn.getAttribute(
                "data-index"
              )
            )
          );
        }
      );
    }
  );

  showQuestion(0);

  // ====================================================
  // SUBMIT
  // ====================================================

  async function handleSubmit(
    isAutoSubmit
  ) {
    stopTimer();

    if (isAutoSubmit) {
      alert(
        "انتهى وقت الاختبار، سيتم تسليم إجاباتك تلقائيًا."
      );
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent =
        "جاري الحفظ...";
    }

    try {
      const formData =
        new FormData(form);

      let answers = [];

      let score = 0;

      let total = 0;

      questions.forEach(
        (q, index) => {
          const qScore =
            getQuestionScore(q);

          total += qScore;

          if (
            isEssayQuestion(q)
          ) {
            answers[index] =
              formData.get(
                `question_${index}`
              ) || "";
          } else {
            const selected =
              formData.get(
                `question_${index}`
              );

            const answer =
              selected === null
                ? -1
                : Number(selected);

            answers[index] =
              answer;

            if (
              answer ===
              getQuestionCorrectAnswer(
                q
              )
            ) {
              score += qScore;
            }
          }
        }
      );

      const resultPayload =
        stripUndefinedDeep({
          studentName,
          examTitle,

          examId:
            exam.firestoreId ||
            exam.id ||
            "",

          score,
          total,

          answers,

          questions,

          percentage:
            calculatePercentage(
              score,
              total
            ),

          createdAt:
            Date.now(),

          date:
            new Date().toLocaleString(),
        });

      // حفظ النتيجة في Firebase
      await saveResult(
        resultPayload
      );

      // منع إعادة أداء الامتحان
      markAttempted(
        attemptKey
      );

      localStorage.removeItem(
        "currentActiveExam"
      );

      localStorage.removeItem(
        "currentActiveExamRef"
      );

      localStorage.removeItem(
        "currentSelectedExam"
      );

      const app =
        document.querySelector(
          "#app"
        );

      if (app) {
        // ==================================================
        // هنا التغيير المطلوب:
        //
        // لا درجة
        // لا مراجعة
        // لا إجابات صحيحة
        // لا زر مراجعة
        //
        // الطالب يرى فقط رسالة التسليم.
        // ==================================================

        app.innerHTML =
          buildDoneScreen();

        // العودة للرئيسية فقط
        const homeBtn =
          document.createElement(
            "button"
          );

        homeBtn.textContent =
          "الصفحة الرئيسية";

        homeBtn.style.cssText = `
          margin-top:20px;
          padding:12px 24px;
          border-radius:12px;
          border:none;
          background:rgba(255,255,255,.12);
          color:#fff;
          font-weight:700;
          cursor:pointer;
          font-family:inherit;
          font-size:14px;
        `;

        homeBtn.addEventListener(
          "click",
          () => {
            window.location.reload();
          }
        );

        const done =
          app.querySelector(
            ".exam-done"
          );

        if (done) {
          done.appendChild(
            homeBtn
          );
        }
      }
    } catch (error) {
      console.error(
        "SUBMIT ERROR:",
        error
      );

      if (submitBtn) {
        submitBtn.disabled =
          false;

        submitBtn.textContent =
          "تسليم الامتحان";
      }

      const detail =
        error &&
        error.message
          ? error.message
          : "";

      alert(
        "حدث خطأ أثناء حفظ النتيجة، حاول مرة أخرى." +
          (detail
            ? `\n(${detail})`
            : "")
      );
    }
  }

  if (submitBtn) {
    submitBtn.addEventListener(
      "click",
      () =>
        handleSubmit(false)
    );
  }

  // safety net
  form.addEventListener(
    "submit",
    (e) => {
      e.preventDefault();

      handleSubmit(false);
    }
  );
}

// ======================================================
// MAIN EXAM PAGE
// ======================================================

export function examPage() {
  injectExamStyles();

  const studentName =
    localStorage.getItem(
      "studentName"
    ) || "طالب";

  const examRef =
    JSON.parse(
      localStorage.getItem(
        "currentActiveExamRef"
      ) || "{}"
    );

  const legacyExam =
    JSON.parse(
      localStorage.getItem(
        "currentActiveExam"
      ) || "{}"
    );

  const examId =
    examRef.firestoreId ||
    examRef.id ||
    legacyExam.firestoreId ||
    legacyExam.id ||
    "";

  const examTitle =
    examRef.title ||
    legacyExam.title ||
    legacyExam.name ||
    "امتحان";

  const attemptKey =
    getAttemptKey(
      examId ||
        examTitle
    );

  setTimeout(
    async () => {
      const app =
        document.querySelector(
          "#app"
        );

      if (!app) {
        return;
      }

      const alreadyAttempted =
        await checkAlreadyAttempted(
          examId,
          examTitle,
          studentName
        );

      if (alreadyAttempted) {
        markAttempted(
          attemptKey
        );

        app.innerHTML =
          lockedScreenHTML();

        const backBtn =
          document.getElementById(
            "examLockedBackBtn"
          );

        if (backBtn) {
          backBtn.addEventListener(
            "click",
            () => {
              localStorage.removeItem(
                "currentActiveExam"
              );

              localStorage.removeItem(
                "currentActiveExamRef"
              );

              localStorage.removeItem(
                "currentSelectedExam"
              );

              window.location.reload();
            }
          );
        }

        return;
      }

      // جلب الامتحان من Firebase
      let exam =
        legacyExam;

      if (examId) {
        const fresh =
          await getExamByFirestoreId(
            examId
          ).catch(
            () => null
          );

        if (fresh) {
          exam = fresh;
        }
      }

      const rawQuestions =
        Array.isArray(
          exam.questions
        )
          ? exam.questions
          : [];

      const orderedQuestions =
        examSettings.shuffleQuestions
          ? shuffleArray(
              rawQuestions
            )
          : rawQuestions;

      const questions =
        orderedQuestions.map(
          shuffleQuestionOptions
        );

      const settings =
        readExamSettings();

      app.innerHTML =
        buildExamTemplate(
          examTitle,
          studentName,
          questions
        );

      wireUpExam({
        studentName,
        examTitle,
        exam,
        examId,
        attemptKey,
        questions,
        settings,
      });
    },
    50
  );

  return `
    <div class="exam-loading">

      <div class="spinner"></div>

      <p>
        جاري تجهيز الامتحان...
      </p>

    </div>
  `;
}

// ======================================================
// ANSWERS
// ======================================================

function renderAnswers(q, index) {
  if (isEssayQuestion(q)) {
    return `
      <textarea
        class="exam-essay"
        name="question_${index}"
        placeholder="اكتب إجابتك هنا"
      ></textarea>
    `;
  }

  return (q.options || [])
    .filter(
      (op) =>
        op &&
        String(op).trim() !== ""
    )
    .map(
      (op, i) => `
        <label class="exam-option">

          <input
            type="radio"
            name="question_${index}"
            value="${i}"
          >

          <span>
            ${op}
          </span>

        </label>
      `
    )
    .join("");
}

// ======================================================
// QUESTION HELPERS
// ======================================================

function isEssayQuestion(q) {
  const type = String(
    q.type || ""
  )
    .toLowerCase()
    .trim();

  const hasOptions =
    Array.isArray(q.options) &&
    q.options.some(
      (x) =>
        x &&
        String(x).trim() !== ""
    );

  return (
    type.includes("essay") ||
    type.includes("مقال") ||
    !hasOptions
  );
}

function getQuestionCorrectAnswer(q) {
  if (
    q.correctAnswerIndex !==
    undefined
  ) {
    return Number(
      q.correctAnswerIndex
    );
  }

  if (
    q.correctIndex !==
    undefined
  ) {
    return Number(
      q.correctIndex
    );
  }

  if (
    q.rightIndex !==
    undefined
  ) {
    return Number(
      q.rightIndex
    );
  }

  if (
    q.correctAnswer !==
    undefined
  ) {
    return Number(
      q.correctAnswer
    );
  }

  if (
    q.answer !==
    undefined
  ) {
    return Number(
      q.answer
    );
  }

  return -1;
}

function getQuestionScore(q) {
  return Number(
    q.score ||
      q.maxScore ||
      q.points ||
      q.grade ||
      1
  );
}

function calculatePercentage(
  score,
  total
) {
  if (!total) {
    return 0;
  }

  return Math.round(
    (score / total) * 100
  );
}

export {
  examPage as showExam,
};