// pages/results.js

import {
  getResults,
  deleteResult,
  deleteAllResults
} from "../services/resultService.js";

import { getExams } from "../services/examService.js";

import { adminPage } from "./admin.js";

import { reviewResultPage } from "./reviewResult.js";

import { exportResultsExcel } from "../utils/exportResults.js";

export async function resultsPage() {
  const resultsData = await getResults();

  const results = Array.isArray(resultsData)
    ? resultsData
    : [];

  const examsData = await getExams();

  const exams = Array.isArray(examsData)
    ? examsData
    : [];

  const students = [
    ...new Set(
      results.map(
        r => r.studentName || "Unknown"
      )
    )
  ];

  const totalSubmissions =
    results.length;

  const passedCount =
    results.filter(r => {
      const total =
        Number(r.total) || 100;

      const score =
        Number(r.score) || 0;

      return (
        (score / total) * 100 >= 50
      );
    }).length;

  const successRate =
    totalSubmissions
      ? Math.round(
          (passedCount /
            totalSubmissions) *
            100
        )
      : 0;

  setTimeout(() => {
    const app =
      document.querySelector("#app");

    // ================= BACK =================

    const back =
      document.getElementById(
        "backAdmin"
      );

    if (back) {
      back.onclick = () => {
        app.innerHTML =
          adminPage();
      };
    }

    // ================= REFRESH =================

    const refresh =
      document.getElementById(
        "refreshResults"
      );

    if (refresh) {
      refresh.onclick = async () => {
        app.innerHTML =
          await resultsPage();
      };
    }

    // ================= EXCEL =================

    const exportExcel =
      document.getElementById(
        "exportExcelResults"
      );

    if (exportExcel) {
      exportExcel.onclick =
        async () => {
          exportExcel.disabled =
            true;

          try {
            await exportResultsExcel();
          } finally {
            exportExcel.disabled =
              false;
          }
        };
    }

    // ================= DELETE ALL =================

    const deleteAll =
      document.getElementById(
        "deleteAllResults"
      );

    if (deleteAll) {
      deleteAll.onclick =
        async () => {
          if (
            !confirm(
              "حذف كل النتائج؟"
            )
          ) {
            return;
          }

          await deleteAllResults();

          app.innerHTML =
            await resultsPage();
        };
    }

    // ================= PRINT REPORT =================

    const reportBtn =
      document.getElementById(
        "studentReport"
      );

    if (reportBtn) {
      reportBtn.onclick = () => {
        const visibleCards =
          [
            ...document.querySelectorAll(
              "#resultsTable .rp-card"
            )
          ].filter(
            card =>
              card.style.display !==
              "none"
          );

        const selectedResults =
          visibleCards
            .map(card =>
              results.find(
                r =>
                  String(r.id) ===
                  String(
                    card.dataset
                      .resultId
                  )
              )
            )
            .filter(Boolean);

        if (
          !selectedResults.length
        ) {
          alert(
            "لا توجد نتائج للطباعة"
          );

          return;
        }

        printStudentReport(
          "كشف نتائج الطلاب",
          selectedResults
        );
      };
    }

    // ================= SHARE RESULT =================

    document
      .querySelectorAll(
        ".shareResult"
      )
      .forEach(button => {
        button.onclick = e => {
          e.stopPropagation();

          const resultId =
            button.dataset.result;

          const result =
            results.find(
              r =>
                String(r.id) ===
                String(resultId)
            );

          if (!result) {
            alert(
              "تعذر العثور على النتيجة"
            );

            return;
          }

          const shareUrl =
            buildResultShareUrl(
              result.id
            );

          const student =
            result.studentName ||
            "الطالب";

          const exam =
            result.examTitle ||
            "الامتحان";

          const message =
            `📊 نتيجة الطالب ${student}\n\n` +
            `📚 الامتحان: ${exam}\n\n` +
            `يمكنك مشاهدة تفاصيل النتيجة كاملة من الرابط التالي:\n` +
            `${shareUrl}`;

          const whatsappUrl =
            `https://wa.me/?text=${encodeURIComponent(
              message
            )}`;

          window.open(
            whatsappUrl,
            "_blank"
          );
        };
      });

    // ================= COPY RESULT LINK =================

    document
      .querySelectorAll(
        ".copyResultLink"
      )
      .forEach(button => {
        button.onclick = async e => {
          e.stopPropagation();

          const resultId =
            button.dataset.result;

          const shareUrl =
            buildResultShareUrl(
              resultId
            );

          try {
            await navigator.clipboard.writeText(
              shareUrl
            );

            const oldText =
              button.textContent;

            button.textContent =
              "✅ تم نسخ الرابط";

            setTimeout(() => {
              button.textContent =
                oldText;
            }, 1800);
          } catch {
            prompt(
              "انسخ رابط النتيجة:",
              shareUrl
            );
          }
        };
      });

    // ================= FILTERS =================

    const search =
      document.getElementById(
        "searchStudent"
      );

    const studentFilter =
      document.getElementById(
        "filterStudent"
      );

    const examFilter =
      document.getElementById(
        "filterExam"
      );

    const sortSelect =
      document.getElementById(
        "sortResults"
      );

    const statTotal =
      document.getElementById(
        "statTotal"
      );

    const statRate =
      document.getElementById(
        "statRate"
      );

    const statStudents =
      document.getElementById(
        "statStudents"
      );

    function getResultPercent(r) {
      const score =
        Number(r.score) || 0;

      const total =
        Number(r.total) || 100;

      return total
        ? (score / total) * 100
        : 0;
    }

    function applySort() {
      const grid =
        document.getElementById(
          "resultsTable"
        );

      if (!grid) {
        return;
      }

      const sortValue =
        sortSelect?.value ||
        "recent";

      const cards =
        [
          ...grid.querySelectorAll(
            ".rp-card"
          )
        ];

      const withData =
        cards
          .map(card => {
            const result =
              results.find(
                r =>
                  String(r.id) ===
                  String(
                    card.dataset
                      .resultId
                  )
              );

            return {
              card,
              result
            };
          })
          .filter(
            item => item.result
          );

      withData.sort((a, b) => {
        switch (sortValue) {

          case "scoreDesc":
            return (
              getResultPercent(
                b.result
              ) -
              getResultPercent(
                a.result
              )
            );

          case "scoreAsc":
            return (
              getResultPercent(
                a.result
              ) -
              getResultPercent(
                b.result
              )
            );

          case "studentAsc":
            return String(
              a.result
                .studentName ||
                ""
            ).localeCompare(
              String(
                b.result
                  .studentName ||
                  ""
              ),
              "ar"
            );

          case "studentDesc":
            return String(
              b.result
                .studentName ||
                ""
            ).localeCompare(
              String(
                a.result
                  .studentName ||
                  ""
              ),
              "ar"
            );

          case "examAsc":
            return String(
              a.result
                .examTitle ||
                ""
            ).localeCompare(
              String(
                b.result
                  .examTitle ||
                  ""
              ),
              "ar"
            );

          case "recent":
          default:
            return (
              (
                Number(
                  b.result
                    .createdAt
                ) || 0
              ) -
              (
                Number(
                  a.result
                    .createdAt
                ) || 0
              )
            );
        }
      });

      withData.forEach(
        item => {
          grid.appendChild(
            item.card
          );
        }
      );
    }

    function updateFilter() {
      const text =
        (
          search?.value || ""
        )
          .toLowerCase()
          .trim();

      const student =
        studentFilter?.value ||
        "";

      const exam =
        examFilter?.value ||
        "";

      const cards = [
        ...document.querySelectorAll(
          "#resultsTable .rp-card"
        )
      ];

      cards.forEach(card => {
        const studentName =
          (
            card.dataset.student ||
            ""
          ).toLowerCase();

        const examName =
          (
            card.dataset.exam ||
            ""
          ).toLowerCase();

        const okSearch =
          !text ||
          studentName.includes(
            text
          ) ||
          examName.includes(text);

        const okStudent =
          !student ||
          card.dataset.student ===
            student;

        const okExam =
          !exam ||
          card.dataset.exam ===
            exam;

        card.style.display =
          okSearch &&
          okStudent &&
          okExam
            ? "block"
            : "none";
      });

      const visibleCards =
        cards.filter(
          card =>
            card.style.display !==
            "none"
        );

      const visibleTotal =
        visibleCards.length;

      const visiblePassed =
        visibleCards.filter(
          card =>
            card.dataset.tier !==
            "fail"
        ).length;

      const visibleRate =
        visibleTotal
          ? Math.round(
              (visiblePassed /
                visibleTotal) *
                100
            )
          : 0;

      const visibleStudents =
        new Set(
          visibleCards.map(
            card =>
              card.dataset.student
          )
        ).size;

      if (statTotal) {
        statTotal.textContent =
          visibleTotal;
      }

      if (statRate) {
        statRate.textContent =
          `${visibleRate}%`;
      }

      if (statStudents) {
        statStudents.textContent =
          visibleStudents;
      }
    }

    search?.addEventListener(
      "input",
      updateFilter
    );

    studentFilter?.addEventListener(
      "change",
      updateFilter
    );

    examFilter?.addEventListener(
      "change",
      updateFilter
    );

    sortSelect?.addEventListener(
      "change",
      () => {
        applySort();
        updateFilter();
      }
    );

    // ================= TABLE =================

    const table =
      document.getElementById(
        "resultsTable"
      );

    if (table) {
      table.onclick =
        async e => {
          // حذف
          const del =
            e.target.closest(
              ".deleteResult"
            );

          if (del) {
            e.stopPropagation();

            await deleteResult(
              del.dataset.result
            );

            app.innerHTML =
              await resultsPage();

            return;
          }

          // مشاركة
          const share =
            e.target.closest(
              ".shareResult"
            );

          if (share) {
            return;
          }

          // نسخ
          const copy =
            e.target.closest(
              ".copyResultLink"
            );

          if (copy) {
            return;
          }

          // فتح المراجعة
          const card =
            e.target.closest(
              ".rp-card"
            );

          if (card) {
            const result =
              results.find(
                r =>
                  String(r.id) ===
                  String(
                    card.dataset
                      .resultId
                  )
              );

            if (result) {
              app.innerHTML =
                reviewResultPage(
                  result
                );
            }
          }
        };
    }
  }, 50);

  return `
  <div class="rp" dir="rtl" lang="ar">

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;800&family=Tajawal:wght@400;500;700&family=JetBrains+Mono:wght@500;600&display=swap');

      .rp{
        --ink-950:#0a0f1c;
        --ink-900:#111a2e;
        --ink-800:#1a2440;
        --ink-700:#243057;
        --line:#2a3559;
        --paper:#eef1f8;
        --muted:#93a0c2;
        --gold:#e8b34c;
        --pass:#31c07a;
        --warn:#f0a63a;
        --fail:#ef4a63;

        font-family:'Tajawal',sans-serif;
        color:var(--paper);
      }

      .rp *{
        box-sizing:border-box;
      }

      .rp-hero{
        position:relative;
        overflow:hidden;
        background:
          radial-gradient(
            600px 200px at 15% 0%,
            rgba(232,179,76,.14),
            transparent 60%
          ),
          linear-gradient(
            150deg,
            #0a0f1c,
            #141f3d 65%,
            #1c2a52
          );

        border:1px solid var(--line);
        border-radius:22px;
        padding:30px 32px;
        margin-bottom:24px;
      }

      .rp-hero-top{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:16px;
        flex-wrap:wrap;
        margin-bottom:22px;
      }

      .rp-back{
        display:inline-flex;
        align-items:center;
        gap:8px;
        padding:10px 18px;
        border-radius:12px;
        border:1px solid var(--line);
        background:var(--ink-800);
        color:var(--paper);
        font-family:'Tajawal',sans-serif;
        font-weight:500;
        font-size:14px;
        cursor:pointer;
      }

      .rp-title{
        display:flex;
        align-items:baseline;
        gap:12px;
      }

      .rp-title h1{
        font-family:'Cairo',sans-serif;
        font-weight:800;
        font-size:26px;
        margin:0;
      }

      .rp-title span{
        color:var(--muted);
        font-size:13px;
      }

      .rp-stats{
        display:grid;
        grid-template-columns:
          repeat(auto-fit,minmax(150px,1fr));
        gap:14px;
      }

      .rp-stat{
        background:var(--ink-900);
        border:1px solid var(--line);
        border-radius:14px;
        padding:14px 16px;
      }

      .rp-stat b{
        display:block;
        font-family:'JetBrains Mono',monospace;
        font-size:24px;
        color:var(--gold);
      }

      .rp-stat span{
        font-size:12.5px;
        color:var(--muted);
      }

      .rp-toolbar{
        display:flex;
        gap:12px;
        flex-wrap:wrap;
        margin-bottom:26px;
      }

      .rp-search{
        flex:1;
        min-width:220px;
        padding:13px 16px;
        border-radius:12px;
        border:1px solid var(--line);
        background:var(--ink-900);
        color:var(--paper);
        font-family:'Tajawal',sans-serif;
        font-size:14px;
      }

      .rp-select{
        padding:13px 14px;
        border-radius:12px;
        border:1px solid var(--line);
        background:var(--ink-900);
        color:var(--paper);
        font-family:'Tajawal',sans-serif;
        font-size:14px;
        cursor:pointer;
      }

      .rp-btn{
        padding:13px 18px;
        border-radius:12px;
        border:1px solid var(--line);
        background:var(--ink-800);
        color:var(--paper);
        font-family:'Tajawal',sans-serif;
        font-weight:500;
        font-size:14px;
        cursor:pointer;
        white-space:nowrap;
      }

      .rp-btn-primary{
        background:
          linear-gradient(
            135deg,
            #2b5cff,
            #5b7dff
          );
        border-color:transparent;
      }

      .rp-btn-whatsapp{
        background:
          linear-gradient(
            135deg,
            #16a34a,
            #22c55e
          );
        border-color:transparent;
        color:white;
      }

      .rp-btn-copy{
        background:#334155;
      }

      .rp-btn-danger{
        background:
          linear-gradient(
            135deg,
            #c81e3a,
            #ef4a63
          );
        border-color:transparent;
      }

      .rp-grid{
        display:grid;
        grid-template-columns:
          repeat(auto-fit,minmax(280px,1fr));
        gap:18px;
      }

      .rp-card{
        position:relative;
        background:var(--ink-900);
        border:1px solid var(--line);
        border-inline-start:4px solid var(--line);
        border-radius:18px;
        padding:22px;
        cursor:pointer;
      }

      .rp-card:hover{
        border-color:var(--gold);
      }

      .rp-card[data-tier="good"]{
        border-inline-start-color:var(--pass);
      }

      .rp-card[data-tier="pass"]{
        border-inline-start-color:var(--warn);
      }

      .rp-card[data-tier="fail"]{
        border-inline-start-color:var(--fail);
      }

      .rp-stamp{
        position:absolute;
        top:16px;
        inset-inline-end:16px;
        width:64px;
        height:64px;
        border-radius:50%;
        border:2px dashed var(--line);
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        transform:rotate(-8deg);
        font-family:'Cairo',sans-serif;
        pointer-events:none;
      }

      .rp-stamp b{
        font-family:'JetBrains Mono',monospace;
        font-size:15px;
      }

      .rp-stamp span{
        font-size:9px;
        font-weight:700;
      }

      .rp-card[data-tier="good"] .rp-stamp{
        border-color:var(--pass);
        color:var(--pass);
      }

      .rp-card[data-tier="pass"] .rp-stamp{
        border-color:var(--warn);
        color:var(--warn);
      }

      .rp-card[data-tier="fail"] .rp-stamp{
        border-color:var(--fail);
        color:var(--fail);
      }

      #resultsTable .rp-card h3{
        font-family:'Cairo',sans-serif;
        font-weight:700;
        font-size:17px;
        margin:0 0 6px;
        padding-inline-end:74px;
        color:var(--paper)!important;
      }

      .rp-card .rp-exam{
        color:var(--muted);
        font-size:13.5px;
        margin:0 0 14px;
      }

      .rp-card .rp-score{
        font-family:'JetBrains Mono',monospace;
        font-size:14px;
        color:var(--paper);
        background:var(--ink-800);
        display:inline-block;
        padding:4px 10px;
        border-radius:8px;
        margin-bottom:16px;
      }

      .rp-actions{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin-top:4px;
      }

      .rp-action{
        width:100%;
        padding:9px;
        border-radius:10px;
        cursor:pointer;
        font-family:'Tajawal',sans-serif;
        font-size:13px;
        font-weight:700;
        border:1px solid var(--line);
        color:white;
      }

      .rp-action.shareResult{
        background:
          linear-gradient(
            135deg,
            #15803d,
            #22c55e
          );
      }

      .rp-action.copyResultLink{
        background:#334155;
      }

      .rp-delete{
        display:block;
        width:100%;
        margin-top:8px;
        padding:9px;
        background:transparent;
        color:var(--fail);
        border:1px solid var(--fail);
        border-radius:10px;
        cursor:pointer;
        font-family:'Tajawal',sans-serif;
        font-size:13px;
      }

      .rp-empty{
        text-align:center;
        padding:60px 20px;
        color:var(--muted);
        border:1px dashed var(--line);
        border-radius:18px;
        grid-column:1 / -1;
      }

      .rp-empty b{
        display:block;
        font-family:'Cairo',sans-serif;
        font-size:18px;
        color:var(--paper);
        margin-bottom:6px;
      }

      @media(max-width:520px){
        .rp-hero{
          padding:22px;
        }

        .rp-title h1{
          font-size:21px;
        }

        .rp-actions{
          grid-template-columns:1fr;
        }
      }
    </style>

    <div class="rp-hero">

      <div class="rp-hero-top">

        <button
          id="backAdmin"
          class="rp-back"
        >
          ⬅ العودة للوحة التحكم
        </button>

        <div class="rp-title">

          <h1>
            📊 نتائج الطلاب
          </h1>

          <span>
            سجل درجات جميع الامتحانات
          </span>

        </div>

      </div>

      <div class="rp-stats">

        <div class="rp-stat">
          <b id="statTotal">
            ${totalSubmissions}
          </b>
          <span>
            عدد التسليمات
          </span>
        </div>

        <div class="rp-stat">
          <b id="statRate">
            ${successRate}%
          </b>
          <span>
            نسبة النجاح
          </span>
        </div>

        <div class="rp-stat">
          <b id="statStudents">
            ${students.length}
          </b>
          <span>
            عدد الطلاب
          </span>
        </div>

      </div>

    </div>

    <div class="rp-toolbar">

      <input
        id="searchStudent"
        class="rp-search"
        placeholder="🔍 بحث عن طالب أو امتحان"
      >

      <select
        id="filterStudent"
        class="rp-select"
      >

        <option value="">
          👨‍🎓 كل الطلاب
        </option>

        ${students
          .map(
            s =>
              `<option value="${escapeHTML(
                s
              )}">
                ${escapeHTML(s)}
              </option>`
          )
          .join("")}

      </select>

      <select
        id="filterExam"
        class="rp-select"
      >

        <option value="">
          📚 كل الامتحانات
        </option>

        ${exams
          .map(
            e =>
              `<option value="${escapeHTML(
                e.title || ""
              )}">
                ${escapeHTML(
                  e.title || "امتحان"
                )}
              </option>`
          )
          .join("")}

      </select>

      <select
        id="sortResults"
        class="rp-select"
      >

        <option value="recent">
          🕒 الأحدث أولاً
        </option>

        <option value="scoreDesc">
          ⬆️ الأعلى درجة
        </option>

        <option value="scoreAsc">
          ⬇️ الأقل درجة
        </option>

        <option value="studentAsc">
          🔤 اسم الطالب (أ-ي)
        </option>

        <option value="studentDesc">
          🔤 اسم الطالب (ي-أ)
        </option>

        <option value="examAsc">
          📚 اسم الامتحان (أ-ي)
        </option>

      </select>

      <button
        id="refreshResults"
        class="rp-btn"
      >
        🔄 تحديث
      </button>

      <button
        id="exportExcelResults"
        class="rp-btn"
      >
        📊 تصدير Excel
      </button>

      <button
        id="studentReport"
        class="rp-btn rp-btn-primary"
      >
        📄 طباعة كشف
      </button>

      <button
        id="deleteAllResults"
        class="rp-btn rp-btn-danger"
      >
        🗑 حذف الكل
      </button>

    </div>

    <div
      id="resultsTable"
      class="rp-grid"
    >

      ${
        results.length
          ? results
              .map(r => {

                const score =
                  Number(r.score) || 0;

                const total =
                  Number(r.total) || 100;

                const percent =
                  Math.round(
                    (score / total) *
                      100
                  );

                const tier =
                  percent >= 70
                    ? "good"
                    : percent >= 50
                    ? "pass"
                    : "fail";

                const stampLabel =
                  percent >= 50
                    ? "ناجح"
                    : "راسب";

                return `

                <div
                  class="menu-card rp-card"
                  data-tier="${tier}"
                  data-result-id="${escapeHTML(
                    r.id
                  )}"
                  data-student="${escapeHTML(
                    r.studentName || ""
                  )}"
                  data-exam="${escapeHTML(
                    r.examTitle || ""
                  )}"
                >

                  <div class="rp-stamp">

                    <b>
                      ${percent}%
                    </b>

                    <span>
                      ${stampLabel}
                    </span>

                  </div>

                  <h3>
                    👨‍🎓
                    ${escapeHTML(
                      r.studentName ||
                        "طالب"
                    )}
                  </h3>

                  <p class="rp-exam">
                    📚
                    ${escapeHTML(
                      r.examTitle ||
                        "امتحان"
                    )}
                  </p>

                  <div class="rp-score">
                    ${score} / ${total}
                  </div>

                  <div class="rp-actions">

                    <button
                      type="button"
                      class="rp-action shareResult"
                      data-result="${escapeHTML(
                        r.id
                      )}"
                    >
                      📤 إرسال للطالب
                    </button>

                    <button
                      type="button"
                      class="rp-action copyResultLink"
                      data-result="${escapeHTML(
                        r.id
                      )}"
                    >
                      🔗 نسخ الرابط
                    </button>

                  </div>

                  <button
                    type="button"
                    class="deleteResult rp-delete"
                    data-result="${escapeHTML(
                      r.id
                    )}"
                  >
                    حذف
                  </button>

                </div>

              `;
              })
              .join("")
          : `
            <div class="rp-empty">

              <b>
                لا توجد نتائج حتى الآن
              </b>

              نتائج الطلاب هتظهر هنا بعد تسليم الامتحانات

            </div>
          `
      }

    </div>

  </div>
  `;
}

// ======================================================
// SHARE URL
// ======================================================

function buildResultShareUrl(resultId) {
  const url =
    new URL(
      window.location.href
    );

  url.search = "";

  url.hash =
    `result=${encodeURIComponent(
      resultId
    )}`;

  return url.toString();
}

// ======================================================
// ESCAPE HTML
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
// PRINT
// ======================================================

function printStudentReport(
  title,
  studentResults
) {
  const win =
    window.open(
      "",
      "",
      "width=900,height=700"
    );

  if (!win) {
    alert(
      "يرجى السماح بفتح النوافذ المنبثقة."
    );

    return;
  }

  const total =
    studentResults.reduce(
      (a, r) =>
        a +
        (Number(r.total) ||
          100),
      0
    );

  const score =
    studentResults.reduce(
      (a, r) =>
        a +
        (Number(r.score) ||
          0),
      0
    );

  const avg =
    total
      ? Math.round(
          (score / total) *
            100
        )
      : 0;

  win.document.write(`
    <html>

    <head>

      <title>
        ${escapeHTML(title)}
      </title>

      <style>

        @import url(
          'https://fonts.googleapis.com/css2?family=Cairo:wght@700;800&family=Tajawal:wght@400;500&display=swap'
        );

        body{
          font-family:'Tajawal',Arial,sans-serif;
          direction:rtl;
          padding:40px;
          color:#111827;
        }

        h2{
          font-family:'Cairo',sans-serif;
          text-align:center;
        }

        .sub{
          text-align:center;
          color:#6b7280;
        }

        table{
          width:100%;
          border-collapse:collapse;
          margin-top:25px;
        }

        th,
        td{
          border:1px solid #d1d5db;
          padding:10px;
          text-align:center;
        }

        th{
          background:#111827;
          color:#fff;
        }

        tr:nth-child(even) td{
          background:#f9fafb;
        }

      </style>

    </head>

    <body>

      <h2>
        ${escapeHTML(title)}
      </h2>

      <p class="sub">
        النسبة العامة:
        ${avg}%
      </p>

      <table>

        <tr>
          <th>الطالب</th>
          <th>الامتحان</th>
          <th>الدرجة</th>
          <th>النسبة</th>
        </tr>

        ${studentResults
          .map(r => {

            const percent =
              Math.round(
                (Number(
                  r.score || 0
                ) /
                  Number(
                    r.total || 100
                  )) *
                  100
              );

            return `
              <tr>

                <td>
                  ${escapeHTML(
                    r.studentName ||
                      ""
                  )}
                </td>

                <td>
                  ${escapeHTML(
                    r.examTitle ||
                      "امتحان"
                  )}
                </td>

                <td>
                  ${r.score || 0}
                  /
                  ${r.total || 0}
                </td>

                <td>
                  ${percent}%
                </td>

              </tr>
            `;
          })
          .join("")}

      </table>

    </body>

    </html>
  `);

  win.document.close();

  win.focus();

  win.print();
}