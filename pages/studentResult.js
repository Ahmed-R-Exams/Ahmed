// pages/studentResult.js

import { getResultById } from "../services/resultService.js";


// ======================================================
// LOAD SHARED RESULT
// ======================================================

export async function loadSharedResult(resultId) {

  const app =
    document.querySelector("#app");

  if (!app) {
    return;
  }

  // Loading screen
  app.innerHTML = `
    <div
      dir="rtl"
      style="
        min-height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#0f172a;
        color:white;
        font-family:Cairo,Tajawal,Arial,sans-serif;
        padding:20px;
      "
    >

      <div
        style="
          text-align:center;
          background:#1e293b;
          padding:40px;
          border-radius:20px;
          max-width:500px;
          width:100%;
        "
      >

        <div
          style="
            font-size:45px;
            margin-bottom:15px;
          "
        >
          📊
        </div>

        <h2>
          جاري تحميل النتيجة...
        </h2>

        <p style="color:#94a3b8;">
          يرجى الانتظار
        </p>

      </div>

    </div>
  `;


  try {

    const result =
      await getResultById(
        String(resultId)
      );


    // ==================================================
    // RESULT NOT FOUND
    // ==================================================

    if (!result) {

      app.innerHTML = `
        <div
          dir="rtl"
          style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#0f172a;
            color:white;
            font-family:Cairo,Tajawal,Arial,sans-serif;
            padding:20px;
          "
        >

          <div
            style="
              text-align:center;
              background:#1e293b;
              padding:40px;
              border-radius:20px;
              max-width:550px;
              width:100%;
              border:1px solid #334155;
            "
          >

            <div
              style="
                font-size:55px;
                margin-bottom:15px;
              "
            >
              ❌
            </div>

            <h2
              style="
                color:#f87171;
                margin-bottom:12px;
              "
            >
              النتيجة غير موجودة
            </h2>

            <p
              style="
                color:#cbd5e1;
                line-height:1.8;
              "
            >
              الرابط غير صحيح أو أن النتيجة
              لم تعد موجودة.
            </p>

          </div>

        </div>
      `;

      return;
    }


    // ==================================================
    // SHOW EXACT FIRESTORE RESULT
    // ==================================================

    app.innerHTML =
      studentResultPage(result);

  }
  catch(error) {

    console.error(
      "LOAD SHARED RESULT ERROR:",
      error
    );

    app.innerHTML = `
      <div
        dir="rtl"
        style="
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#0f172a;
          color:white;
          font-family:Cairo,Tajawal,Arial,sans-serif;
          padding:20px;
        "
      >

        <div
          style="
            text-align:center;
            background:#1e293b;
            padding:40px;
            border-radius:20px;
            max-width:550px;
            width:100%;
          "
        >

          <div style="font-size:50px;">
            ⚠️
          </div>

          <h2
            style="
              color:#fbbf24;
            "
          >
            تعذر تحميل النتيجة
          </h2>

          <p
            style="
              color:#cbd5e1;
              line-height:1.8;
            "
          >
            حدث خطأ أثناء الاتصال بقاعدة البيانات.
          </p>

        </div>

      </div>
    `;
  }
}


// ======================================================
// RESULT PAGE
// ======================================================

function studentResultPage(result) {

  const score =
    Number(result.score) || 0;

  const total =
    Number(result.total) || 1;

  const percent =
    Math.round(
      (score / total) * 100
    );


  const passed =
    percent >= 50;


  const questions =
    Array.isArray(result.questions)
      ? result.questions
      : [];


  const answers =
    Array.isArray(result.answers)
      ? result.answers
      : [];


  return `

    <div
      class="student-result-page"
      dir="rtl"
      lang="ar"
      style="
        min-height:100vh;
        background:
          radial-gradient(
            700px 300px at 50% 0%,
            rgba(56,189,248,.10),
            transparent 70%
          ),
          #0f172a;
        color:#f8fafc;
        font-family:
          Cairo,
          Tajawal,
          Arial,
          sans-serif;
        padding:30px 16px 60px;
      "
    >

      <div
        style="
          max-width:900px;
          margin:auto;
        "
      >

        <!-- ========================================= -->
        <!-- HEADER -->
        <!-- ========================================= -->

        <div
          style="
            text-align:center;
            margin-bottom:25px;
          "
        >

          <div
            style="
              font-size:50px;
              margin-bottom:8px;
            "
          >
            📊
          </div>

          <h1
            style="
              margin:0;
              color:#38bdf8;
              font-size:30px;
              font-weight:800;
            "
          >
            نتيجة الامتحان
          </h1>

          <p
            style="
              color:#94a3b8;
              margin-top:8px;
            "
          >
            Ahmed.R Exams
          </p>

        </div>


        <!-- ========================================= -->
        <!-- STUDENT INFO -->
        <!-- ========================================= -->

        <div
          style="
            background:#1e293b;
            border:1px solid #334155;
            border-radius:20px;
            padding:25px;
            margin-bottom:20px;
          "
        >

          <div
            style="
              display:grid;
              grid-template-columns:
                repeat(auto-fit,minmax(220px,1fr));
              gap:15px;
            "
          >

            <div>

              <div
                style="
                  color:#94a3b8;
                  font-size:13px;
                  margin-bottom:5px;
                "
              >
                الطالب
              </div>

              <div
                style="
                  font-size:19px;
                  font-weight:bold;
                "
              >
                👨‍🎓
                ${escapeHTML(
                  result.studentName ||
                  "طالب"
                )}
              </div>

            </div>


            <div>

              <div
                style="
                  color:#94a3b8;
                  font-size:13px;
                  margin-bottom:5px;
                "
              >
                الامتحان
              </div>

              <div
                style="
                  font-size:18px;
                  font-weight:bold;
                "
              >
                📚
                ${escapeHTML(
                  result.examTitle ||
                  "امتحان"
                )}
              </div>

            </div>


            ${
              result.date
                ? `
                  <div>

                    <div
                      style="
                        color:#94a3b8;
                        font-size:13px;
                        margin-bottom:5px;
                      "
                    >
                      التاريخ
                    </div>

                    <div
                      style="
                        font-size:16px;
                      "
                    >
                      🕒
                      ${escapeHTML(
                        result.date
                      )}
                    </div>

                  </div>
                `
                : ""
            }

          </div>

        </div>


        <!-- ========================================= -->
        <!-- SCORE -->
        <!-- ========================================= -->

        <div
          style="
            background:
              linear-gradient(
                135deg,
                #172554,
                #1e293b
              );
            border:1px solid #334155;
            border-radius:25px;
            padding:35px 20px;
            text-align:center;
            margin-bottom:25px;
          "
        >

          <div
            style="
              font-size:14px;
              color:#94a3b8;
              margin-bottom:10px;
            "
          >
            الدرجة النهائية
          </div>

          <div
            style="
              font-size:45px;
              font-weight:800;
              color:
                ${
                  passed
                    ? "#4ade80"
                    : "#f87171"
                };
            "
          >
            ${score}
            /
            ${total}
          </div>

          <div
            style="
              font-size:25px;
              font-weight:bold;
              margin-top:5px;
              color:
                ${
                  passed
                    ? "#4ade80"
                    : "#f87171"
                };
            "
          >
            ${percent}%
          </div>

          <div
            style="
              margin-top:18px;
              display:inline-block;
              padding:9px 25px;
              border-radius:30px;
              background:
                ${
                  passed
                    ? "rgba(34,197,94,.15)"
                    : "rgba(239,68,68,.15)"
                };
              color:
                ${
                  passed
                    ? "#4ade80"
                    : "#f87171"
                };
              border:1px solid
                ${
                  passed
                    ? "#22c55e"
                    : "#ef4444"
                };
              font-weight:bold;
            "
          >
            ${
              passed
                ? "✅ ناجح"
                : "❌ راسب"
            }
          </div>

        </div>


        <!-- ========================================= -->
        <!-- QUESTIONS -->
        <!-- ========================================= -->

        ${
          questions.length
            ? `

              <h2
                style="
                  font-size:21px;
                  margin:25px 0 15px;
                  color:#38bdf8;
                "
              >
                📝 تفاصيل الإجابات
              </h2>

              ${questions
                .map(
                  (q,index) =>
                    renderQuestion(
                      q,
                      index,
                      answers[index]
                    )
                )
                .join("")}

            `
            : `
              <div
                style="
                  background:#1e293b;
                  border:1px solid #334155;
                  border-radius:18px;
                  padding:25px;
                  text-align:center;
                  color:#94a3b8;
                "
              >
                لا توجد تفاصيل للأسئلة في هذه النتيجة.
              </div>
            `
        }


        <!-- ========================================= -->
        <!-- FOOTER -->
        <!-- ========================================= -->

        <div
          style="
            text-align:center;
            color:#64748b;
            margin-top:35px;
            font-size:13px;
          "
        >
          هذه النتيجة مرتبطة بسجل الامتحان المحفوظ.
        </div>

      </div>

    </div>
  `;
}


// ======================================================
// RENDER QUESTION
// ======================================================

function renderQuestion(
  q,
  index,
  studentAnswer
) {

  const type =
    String(
      q?.type || ""
    ).toLowerCase();


  const isEssay =
    type.includes("essay") ||
    type.includes("مقال") ||
    type.includes("written");


  const questionText =
    q?.text ||
    q?.question ||
    "السؤال";


  // ================================================
  // ESSAY
  // ================================================

  if (isEssay) {

    const essayGrade =
      Number(
        (
          // This is only display.
          // We NEVER modify the result.
          // We use the saved essayGrades.
          {}
        )[index]
      ) || null;


    return `

      <div
        style="
          background:#1e293b;
          border:1px solid #334155;
          border-radius:18px;
          padding:20px;
          margin-bottom:15px;
        "
      >

        <div
          style="
            display:flex;
            justify-content:space-between;
            gap:10px;
            margin-bottom:12px;
          "
        >

          <strong>
            س${index + 1}
          </strong>

          <span
            style="
              background:#334155;
              color:#cbd5e1;
              padding:5px 10px;
              border-radius:8px;
              font-size:12px;
            "
          >
            مقالي
          </span>

        </div>


        <div
          style="
            line-height:1.9;
            margin-bottom:15px;
          "
        >
          ${escapeHTML(questionText)}
        </div>


        <div
          style="
            background:#0f172a;
            border-radius:12px;
            padding:15px;
            color:#cbd5e1;
          "
        >

          <div
            style="
              color:#94a3b8;
              font-size:13px;
              margin-bottom:6px;
            "
          >
            إجابة الطالب
          </div>

          ${
            studentAnswer !== undefined &&
            studentAnswer !== null &&
            String(studentAnswer).trim() !== ""
              ? escapeHTML(
                  String(studentAnswer)
                )
              : "لم يتم تقديم إجابة"
          }

        </div>

      </div>

    `;
  }


  // ================================================
  // MCQ
  // ================================================

  const options =
    Array.isArray(q?.options)
      ? q.options
      : Array.isArray(q?.choices)
      ? q.choices
      : [];


  const selectedIndex =
    typeof studentAnswer === "number"
      ? studentAnswer
      : Number(studentAnswer);


  const validSelectedIndex =
    Number.isInteger(
      selectedIndex
    ) &&
    selectedIndex >= 0 &&
    selectedIndex < options.length;


  const correctRaw =
    q?.correctAnswerIndex ??
    q?.correctIndex ??
    q?.rightIndex ??
    q?.correctAnswer;


  const correctIndex =
    normalizeCorrectIndex(
      correctRaw,
      options
    );


  const isCorrect =
    validSelectedIndex &&
    correctIndex >= 0 &&
    selectedIndex === correctIndex;


  const qScore =
    Number(
      q?.score ||
      q?.points ||
      q?.grade ||
      1
    );


  const earned =
    isCorrect
      ? qScore
      : 0;


  return `

    <div
      style="
        background:#1e293b;
        border:1px solid #334155;
        border-radius:18px;
        padding:20px;
        margin-bottom:15px;
      "
    >

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
          margin-bottom:12px;
        "
      >

        <strong>
          س${index + 1}
        </strong>

        <span
          style="
            padding:6px 12px;
            border-radius:8px;
            background:
              ${
                isCorrect
                  ? "rgba(34,197,94,.15)"
                  : "rgba(239,68,68,.15)"
              };
            color:
              ${
                isCorrect
                  ? "#4ade80"
                  : "#f87171"
              };
            font-weight:bold;
            font-size:13px;
          "
        >
          ${earned}/${qScore}
        </span>

      </div>


      <div
        style="
          line-height:1.9;
          margin-bottom:15px;
        "
      >
        ${escapeHTML(questionText)}
      </div>


      ${
        options.length
          ? `

            <div
              style="
                display:flex;
                flex-direction:column;
                gap:8px;
              "
            >

              ${options
                .map(
                  (option,optionIndex) => {

                    const selected =
                      validSelectedIndex &&
                      optionIndex ===
                        selectedIndex;

                    const correct =
                      optionIndex ===
                      correctIndex;


                    let background =
                      "#0f172a";

                    let border =
                      "#334155";

                    let color =
                      "#cbd5e1";


                    if (correct) {
                      background =
                        "rgba(34,197,94,.12)";
                      border =
                        "#22c55e";
                      color =
                        "#4ade80";
                    }
                    else if (selected) {
                      background =
                        "rgba(239,68,68,.12)";
                      border =
                        "#ef4444";
                      color =
                        "#f87171";
                    }


                    return `

                      <div
                        style="
                          padding:11px 14px;
                          border-radius:10px;
                          background:${background};
                          border:1px solid ${border};
                          color:${color};
                        "
                      >

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
                .join("")}

            </div>

          `
          : `

            <div
              style="
                color:#94a3b8;
              "
            >
              إجابة الطالب:
              ${
                validSelectedIndex
                  ? escapeHTML(
                      String(
                        studentAnswer
                      )
                    )
                  : "لم يتم الإجابة"
              }
            </div>

          `
      }

    </div>

  `;
}


// ======================================================
// NORMALIZE CORRECT ANSWER
// ======================================================

function normalizeCorrectIndex(
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


  if (
    /^[1-4]$/.test(raw)
  ) {
    return Number(raw) - 1;
  }


  if (
    /^\d+$/.test(raw)
  ) {

    const n =
      Number(raw);


    if (
      n >= 0 &&
      n < options.length
    ) {
      return n;
    }
  }


  const textIndex =
    options.findIndex(
      option =>
        String(option).trim() ===
        raw
    );


  if (textIndex !== -1) {
    return textIndex;
  }


  return -1;
}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

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