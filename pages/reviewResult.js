// pages/reviewResult.js

import { resultsPage } from "./results.js";

import {
  updateResult
} from "../services/resultService.js";


// ======================================================
// HELPERS
// ======================================================

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ======================================================
// OPTIONS
// ======================================================

function getQuestionOptions(q) {

  if (!q || typeof q !== "object") {
    return [];
  }

  if (Array.isArray(q.options)) {
    return q.options;
  }

  if (Array.isArray(q.choices)) {
    return q.choices;
  }

  const letterOptions = [
    q.A,
    q.B,
    q.C,
    q.D
  ];

  if (
    letterOptions.some(
      value =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    )
  ) {

    return letterOptions.filter(
      value =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );
  }

  const namedOptions = [
    q.optionA,
    q.optionB,
    q.optionC,
    q.optionD
  ];

  if (
    namedOptions.some(
      value =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    )
  ) {

    return namedOptions.filter(
      value =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );
  }

  return [];
}


// ======================================================
// RAW CORRECT ANSWER
// ======================================================

function getRawCorrectAnswer(q) {

  if (!q || typeof q !== "object") {
    return undefined;
  }

  if (
    q.correctAnswerIndex !== undefined &&
    q.correctAnswerIndex !== null
  ) {
    return q.correctAnswerIndex;
  }

  if (
    q.correctIndex !== undefined &&
    q.correctIndex !== null
  ) {
    return q.correctIndex;
  }

  if (
    q.rightIndex !== undefined &&
    q.rightIndex !== null
  ) {
    return q.rightIndex;
  }

  if (
    q.correctAnswer !== undefined &&
    q.correctAnswer !== null
  ) {
    return q.correctAnswer;
  }

  if (
    q.answer !== undefined &&
    q.answer !== null
  ) {
    return q.answer;
  }

  if (
    q.correct !== undefined &&
    q.correct !== null
  ) {
    return q.correct;
  }

  return undefined;
}


// ======================================================
// NORMALIZE CORRECT ANSWER
// ======================================================

function normalizeCorrectAnswer(
  value,
  options = []
) {

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return -1;
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {

    return Math.trunc(value);
  }

  const raw =
    String(value).trim();

  const upper =
    raw.toUpperCase();

  const letters = {
    A: 0,
    B: 1,
    C: 2,
    D: 3
  };

  if (
    Object.prototype.hasOwnProperty.call(
      letters,
      upper
    )
  ) {

    return letters[upper];
  }


  // 1 = A
  // 2 = B
  // 3 = C
  // 4 = D

  if (/^[1-4]$/.test(raw)) {

    return Number(raw) - 1;
  }


  // 0-based index

  if (/^\d+$/.test(raw)) {

    const number =
      Number(raw);

    if (
      number >= 0 &&
      number < options.length
    ) {

      return number;
    }
  }


  // correct answer stored as text

  const textIndex =
    options.findIndex(
      option =>
        String(option).trim() === raw
    );

  if (textIndex !== -1) {
    return textIndex;
  }

  return -1;
}


// ======================================================
// CORRECT ANSWER
// ======================================================

function getQuestionCorrectAnswer(q) {

  const options =
    getQuestionOptions(q);

  return normalizeCorrectAnswer(
    getRawCorrectAnswer(q),
    options
  );
}


// ======================================================
// QUESTION TYPE
// ======================================================

function isEssayQuestion(q) {

  const options =
    getQuestionOptions(q);

  if (options.length > 0) {
    return false;
  }

  const type =
    String(
      q?.type || ""
    )
      .toLowerCase()
      .trim();

  return (
    type.includes("essay") ||
    type.includes("مقال") ||
    type.includes("written") ||
    type.includes("text") ||
    !type
  );
}


// ======================================================
// QUESTION SCORE
// ======================================================

function getQuestionScore(q) {

  const score = Number(
    q?.score ??
    q?.maxScore ??
    q?.points ??
    q?.grade ??
    1
  );

  return Number.isFinite(score) && score > 0
    ? score
    : 1;
}


// ======================================================
// GET STUDENT ANSWER
// ======================================================

function getStudentAnswer(result, index) {

  if (
    !result ||
    !Array.isArray(result.answers)
  ) {
    return undefined;
  }

  return result.answers[index];
}


// ======================================================
// CALCULATE MCQ SCORE
// ======================================================

function calculateMCQScore(
  questions,
  answers
) {

  if (!Array.isArray(questions)) {
    return 0;
  }

  let total = 0;

  questions.forEach(
    (question, index) => {

      if (
        isEssayQuestion(question)
      ) {
        return;
      }

      const student =
        Array.isArray(answers)
          ? Number(answers[index])
          : NaN;

      const correct =
        getQuestionCorrectAnswer(
          question
        );

      if (
        Number.isFinite(student) &&
        Number.isFinite(correct) &&
        student === correct
      ) {

        total +=
          getQuestionScore(
            question
          );
      }

    }
  );

  return total;
}


// ======================================================
// CALCULATE ESSAY SCORE
// ======================================================

function calculateEssayScore(
  essayGrades
) {

  if (
    !essayGrades ||
    typeof essayGrades !== "object"
  ) {
    return 0;
  }

  return Object.values(
    essayGrades
  ).reduce(
    (
      total,
      value
    ) =>
      total +
      (
        Number(value) || 0
      ),
    0
  );
}


// ======================================================
// REVIEW RESULT PAGE
// ======================================================

export function reviewResultPage(
  result,
  resultId = null,
  publicView = false
) {

  const app =
    document.querySelector("#app");


  // ====================================================
  // RESULT NOT FOUND
  // ====================================================

  if (!result) {

    return `

      <div style="
        max-width:700px;
        margin:80px auto;
        padding:40px;
        background:#0f172a;
        color:white;
        border-radius:20px;
        text-align:center;
        direction:rtl;
        font-family:Cairo,Arial;
      ">

        <h2 style="color:#ef4444;">
          ❌ النتيجة غير موجودة
        </h2>

        <p>
          لا توجد بيانات للنتيجة المطلوبة
        </p>

        ${
          publicView
            ? ""
            : `
              <button
                id="backToResults"
                style="
                  background:#2563eb;
                  color:white;
                  padding:12px 25px;
                  border:none;
                  border-radius:10px;
                  cursor:pointer;
                "
              >
                العودة
              </button>
            `
        }

      </div>

    `;
  }


  // ====================================================
  // IMPORTANT
  // ====================================================
  //
  // هنا نعتمد فقط على result.
  //
  // ممنوع استخدام:
  //
  // currentActiveExam
  // localStorage للامتحان الحالي
  // أي امتحان آخر
  //
  // لأن النتيجة يجب أن تعرض النسخة المحفوظة
  // داخل نفس نتيجة الطالب.
  //
  // ====================================================


  const questions =
    Array.isArray(result.questions)
      ? result.questions
      : [];


  const answers =
    Array.isArray(result.answers)
      ? result.answers
      : [];


  // ====================================================
  // NO QUESTIONS
  // ====================================================

  if (!questions.length) {

    return `

      <div style="
        max-width:700px;
        margin:80px auto;
        padding:40px;
        background:#0f172a;
        color:white;
        border-radius:20px;
        text-align:center;
        direction:rtl;
        font-family:Cairo,Arial;
      ">

        <h2 style="color:#f59e0b;">
          ⚠️ لا توجد أسئلة محفوظة مع هذه النتيجة
        </h2>

        <p style="
          color:#cbd5e1;
          line-height:1.8;
        ">

          هذه النتيجة القديمة لا تحتوي على نسخة الأسئلة
          التي أداها الطالب.

        </p>

        ${
          publicView
            ? ""
            : `
              <button
                id="backToResults"
                style="
                  background:#2563eb;
                  color:white;
                  padding:12px 25px;
                  border:none;
                  border-radius:10px;
                  cursor:pointer;
                "
              >
                ⬅ العودة للنتائج
              </button>
            `
        }

      </div>

    `;
  }


  // ====================================================
  // ESSAY GRADES
  // ====================================================

  if (
    !result.essayGrades ||
    typeof result.essayGrades !== "object"
  ) {

    result.essayGrades = {};
  }


  // ====================================================
  // TOTAL
  // ====================================================

  let calculatedTotal = 0;

  questions.forEach(
    q => {

      calculatedTotal +=
        getQuestionScore(q);

    }
  );


  let safeTotal =
    Number(result.total);


  if (
    !Number.isFinite(safeTotal) ||
    safeTotal <= 0
  ) {

    safeTotal =
      calculatedTotal;
  }


  if (!safeTotal) {
    safeTotal = 1;
  }


  // ====================================================
  // SCORE
  // ====================================================
  //
  // مهم:
  // النتيجة المعروضة أولًا هي النتيجة المحفوظة.
  //
  // لا نعيد حسابها من امتحان آخر.
  //
  // ====================================================

  let score =
    Number(result.score);

  if (!Number.isFinite(score)) {
    score = 0;
  }


  const percent =
    Math.round(
      (score / safeTotal) * 100
    );


  const passed =
    percent >= 50;


  // ====================================================
  // BACK BUTTON + ESSAY EVENTS
  // ====================================================

  setTimeout(
    () => {

      const backBtn =
        document.getElementById(
          "backToResults"
        );


      if (backBtn) {

        backBtn.onclick =
          async () => {

            if (!app) {
              return;
            }

            app.innerHTML =
              await resultsPage();

          };
      }


      // ==================================================
      // PUBLIC VIEW
      // ==================================================

      if (publicView) {
        return;
      }


      // ==================================================
      // ESSAY SAVE
      // ==================================================

      document
        .querySelectorAll(
          ".save-essay-grade"
        )
        .forEach(
          button => {

            button.onclick =
              async () => {

                try {

                  const qIndex =
                    Number(
                      button.dataset.qindex
                    );


                  const input =
                    document.getElementById(
                      `essay_grade_${qIndex}`
                    );


                  if (!input) {
                    return;
                  }


                  const q =
                    questions[qIndex];


                  const max =
                    getQuestionScore(q);


                  let grade =
                    Number(
                      input.value
                    ) || 0;


                  grade =
                    Math.max(
                      0,
                      Math.min(
                        grade,
                        max
                      )
                    );


                  input.value =
                    grade;


                  result.essayGrades[
                    qIndex
                  ] = grade;


                  // --------------------------------------
                  // RECALCULATE MCQ
                  // --------------------------------------

                  const mcqScore =
                    calculateMCQScore(
                      questions,
                      answers
                    );


                  // --------------------------------------
                  // ESSAY SCORE
                  // --------------------------------------

                  const essayScore =
                    calculateEssayScore(
                      result.essayGrades
                    );


                  // --------------------------------------
                  // FINAL SCORE
                  // --------------------------------------

                  result.score =
                    mcqScore +
                    essayScore;


                  // --------------------------------------
                  // SAVE
                  // --------------------------------------

                  const id =
                    resultId ||
                    result.firestoreId ||
                    result.id;


                  if (!id) {

                    throw new Error(
                      "Result ID غير موجود"
                    );
                  }


                  await updateResult(
                    id,
                    {

                      essayGrades:
                        result.essayGrades,

                      score:
                        result.score,

                      total:
                        safeTotal

                    }
                  );


                  alert(
                    "تم تحديث وحفظ الدرجة بنجاح"
                  );


                  if (app) {

                    app.innerHTML =
                      reviewResultPage(
                        result,
                        id,
                        false
                      );

                  }

                }
                catch (error) {

                  console.error(
                    "SAVE ESSAY GRADE ERROR:",
                    error
                  );

                  alert(
                    "حدث خطأ أثناء حفظ الدرجة."
                  );

                }

              };

          }
        );

    },
    50
  );


  // ====================================================
  // QUESTIONS HTML
  // ====================================================

  const questionsHTML =
    questions
      .map(
        (
          q,
          index
        ) => {


          // ==================================================
          // مهم جدًا
          // الإجابة تؤخذ من نفس result فقط
          // ==================================================

          const studentAns =
            getStudentAnswer(
              result,
              index
            );


          // ============================================
          // ESSAY
          // ============================================

          if (
            isEssayQuestion(q)
          ) {

            const studentEssayText =
              studentAns !== undefined &&
              studentAns !== null &&
              String(studentAns).trim() !== ""
                ? String(studentAns)
                : "لم يتم تقديم إجابة";


            const currentEssayGrade =
              result.essayGrades &&
              result.essayGrades[index] !== undefined
                ? Number(
                    result.essayGrades[index]
                  ) || 0
                : 0;


            const maxQGrade =
              getQuestionScore(q);


            return `

              <div style="
                margin:20px 0;
                padding:20px;
                background:#1e293b;
                border-radius:15px;
              ">

                <h4 style="
                  margin-top:0;
                  color:#38bdf8;
                ">

                  س${index + 1}
                  (مقالي)

                </h4>


                ${
                  q.image ||
                  q.questionImage
                    ? `

                      <img
                        src="${escapeHTML(
                          q.image ||
                          q.questionImage
                        )}"
                        style="
                          max-width:100%;
                          display:block;
                          margin:15px auto;
                          border-radius:12px;
                        "
                      >

                    `
                    : ""
                }


                <p style="
                  line-height:1.9;
                ">

                  ${escapeHTML(
                    q.text ||
                    q.question ||
                    ""
                  )}

                </p>


                <p style="
                  background:#0f172a;
                  padding:15px;
                  border-radius:10px;
                  line-height:1.9;
                ">

                  👤 إجابة الطالب:

                  <br><br>

                  ${escapeHTML(
                    studentEssayText
                  )}

                </p>


                <p>

                  الدرجة:

                  <b>

                    ${currentEssayGrade}

                    /

                    ${maxQGrade}

                  </b>

                </p>


                ${
                  publicView
                    ? ""
                    : `

                      <div style="
                        display:flex;
                        gap:10px;
                        align-items:center;
                        flex-wrap:wrap;
                      ">

                        <input
                          type="number"
                          id="essay_grade_${index}"
                          value="${currentEssayGrade}"
                          min="0"
                          max="${maxQGrade}"
                          step="0.5"
                          style="
                            width:90px;
                            padding:9px;
                            border-radius:8px;
                            border:1px solid #475569;
                            background:#0f172a;
                            color:white;
                          "
                        >

                        <button
                          class="save-essay-grade"
                          data-qindex="${index}"
                          style="
                            background:#2563eb;
                            color:white;
                            border:none;
                            padding:9px 16px;
                            border-radius:8px;
                            cursor:pointer;
                            font-weight:bold;
                          "
                        >

                          حفظ الدرجة

                        </button>

                      </div>

                    `
                }

              </div>

            `;

          }


          // ============================================
          // MCQ
          // ============================================

          const studentAnsIndex =
            Number.isFinite(
              Number(studentAns)
            )
              ? Number(studentAns)
              : -1;


          const options =
            getQuestionOptions(q);


          const correctIndex =
            getQuestionCorrectAnswer(q);


          const studentText =
            studentAnsIndex >= 0 &&
            studentAnsIndex < options.length
              ? options[studentAnsIndex]
              : "لم يتم الإجابة";


          const correctText =
            correctIndex >= 0 &&
            correctIndex < options.length
              ? options[correctIndex]
              : "غير محدد";


          const isCorrect =
            studentAnsIndex ===
            correctIndex;


          const qScore =
            getQuestionScore(q);


          const earned =
            isCorrect
              ? qScore
              : 0;


          return `

            <div style="
              margin:20px 0;
              padding:20px;
              background:#1e293b;
              border-radius:15px;
            ">

              <h4 style="
                margin-top:0;
                color:#38bdf8;
              ">

                س${index + 1}

              </h4>


              ${
                q.image ||
                q.questionImage
                  ? `

                    <img
                      src="${escapeHTML(
                        q.image ||
                        q.questionImage
                      )}"
                      style="
                        max-width:100%;
                        display:block;
                        margin:15px auto;
                        border-radius:12px;
                      "
                    >

                  `
                  : ""
              }


              <p style="
                line-height:1.9;
              ">

                ${escapeHTML(
                  q.text ||
                  q.question ||
                  ""
                )}

              </p>


              <p>

                <span style="
                  background:${
                    isCorrect
                      ? "#dcfce7"
                      : "#fee2e2"
                  };

                  color:${
                    isCorrect
                      ? "#16a34a"
                      : "#dc2626"
                  };

                  padding:5px 10px;
                  border-radius:8px;
                  font-weight:bold;
                ">

                  ${earned}/${qScore}

                </span>

              </p>


              <p style="
                line-height:1.9;
              ">

                👤 إجابة الطالب:

                <b>

                  ${escapeHTML(
                    studentText
                  )}

                </b>

              </p>


              <p style="
                line-height:1.9;
              ">

                ✅ الإجابة الصحيحة:

                <b>

                  ${escapeHTML(
                    correctText
                  )}

                </b>

              </p>


              ${
                options.length
                  ? `

                    <div style="
                      margin-top:15px;
                      padding-top:15px;
                      border-top:1px solid #334155;
                    ">

                      ${
                        options
                          .map(
                            (
                              option,
                              optionIndex
                            ) => {

                              const selected =
                                optionIndex ===
                                studentAnsIndex;


                              const correct =
                                optionIndex ===
                                correctIndex;


                              let background =
                                "#0f172a";


                              let border =
                                "#334155";


                              if (
                                correct
                              ) {

                                background =
                                  "#052e16";

                                border =
                                  "#16a34a";
                              }


                              if (
                                selected &&
                                !correct
                              ) {

                                background =
                                  "#450a0a";

                                border =
                                  "#dc2626";
                              }


                              return `

                                <div style="
                                  margin:7px 0;
                                  padding:10px;
                                  border-radius:9px;
                                  background:${background};
                                  border:1px solid ${border};
                                ">

                                  ${
                                    selected
                                      ? "👤 "
                                      : ""
                                  }

                                  ${
                                    correct
                                      ? "✅ "
                                      : ""
                                  }

                                  ${escapeHTML(
                                    option
                                  )}

                                </div>

                              `;

                            }
                          )
                          .join("")
                      }

                    </div>

                  `
                  : ""
              }

            </div>

          `;

        }
      )
      .join("");


  // ====================================================
  // PAGE
  // ====================================================

  return `

    <div style="
      max-width:900px;
      margin:40px auto;
      padding:30px;
      background:#0f172a;
      color:white;
      border-radius:20px;
      direction:rtl;
      font-family:Cairo,Arial;
      box-sizing:border-box;
    ">


      <h2 style="
        text-align:center;
        color:#38bdf8;
        margin-top:0;
      ">

        ${
          publicView
            ? "📊 نتيجة الطالب"
            : "مراجعة امتحان الطالب"
        }

      </h2>


      <h3>

        👨‍🎓

        ${escapeHTML(
          result.studentName ||
          "طالب"
        )}

      </h3>


      <p>

        الامتحان:

        <b>

          ${escapeHTML(
            result.examTitle ||
            "امتحان"
          )}

        </b>

      </p>


      <p>

        ${escapeHTML(
          result.date ||
          ""
        )}

      </p>


      <div style="
        margin:25px 0;
        padding:20px;
        background:#1e293b;
        border-radius:15px;
        text-align:center;
      ">

        <h2 style="
          margin:0;
          color:${
            passed
              ? "#4ade80"
              : "#f87171"
          };
        ">

          ${score}
          /
          ${safeTotal}

          <br>

          ${percent}%

          <br>

          ${
            passed
              ? "✅ ناجح"
              : "❌ راسب"
          }

        </h2>

      </div>


      <h3>

        📝 تفاصيل إجابات الطالب والدرجات

      </h3>


      ${questionsHTML}


      ${
        publicView

          ? `

            <div style="
              margin-top:30px;
              padding:15px;
              text-align:center;
              background:#1e293b;
              border-radius:12px;
              color:#94a3b8;
            ">

              هذه النتيجة تم عرضها من الرابط المرسل للطالب.

            </div>

          `

          : `

            <button
              id="backToResults"
              style="
                width:100%;
                background:#2563eb;
                color:white;
                border:none;
                padding:14px;
                border-radius:12px;
                font-size:16px;
                font-weight:bold;
                cursor:pointer;
              "
            >

              ⬅ العودة لصفحة النتائج

            </button>

          `
      }

    </div>

  `;
}