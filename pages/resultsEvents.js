import { reviewResultPage } from "./reviewResult.js";
import { resultsPage } from "./results.js";
import { adminPage } from "./admin.js";

let resultsEventsInitialized = false;

export function resultsEvents() {
  const search = document.getElementById("searchStudent");
  const filter = document.getElementById("filterExam");
  const sort = document.getElementById("sortResults");
  const app = document.querySelector("#app");

  function getResults() {
    return JSON.parse(localStorage.getItem("examResults")) || [];
  }

  function saveResults(results) {
    localStorage.setItem("examResults", JSON.stringify(results));
  }

  function update() {
    const cards = [...document.querySelectorAll("#resultsTable .menu-card")];
    const searchText = (search?.value || "").toLowerCase().trim();
    const examValue = filter?.value || "";

    cards.forEach((card) => {
      const student = (card.dataset.student || "").toLowerCase();
      const exam = (card.dataset.exam || "").toLowerCase();

      const searchOK = student.includes(searchText) || exam.includes(searchText);
      const filterOK = !examValue || card.dataset.exam === examValue;

      card.style.display = searchOK && filterOK ? "flex" : "none";
    });

    const table = document.getElementById("resultsTable");
    if (!table) return;

    const visible = cards.filter((card) => card.style.display !== "none");

    visible.sort((a, b) => {
      const scoreA = Number(a.dataset.score) || 0;
      const scoreB = Number(b.dataset.score) || 0;
      const idA = Number(a.dataset.resultId) || 0;
      const idB = Number(b.dataset.resultId) || 0;

      switch (sort?.value) {
        case "highest":
          return scoreB - scoreA;
        case "lowest":
          return scoreA - scoreB;
        case "oldest":
          return idA - idB;
        default:
          return idB - idA;
      }
    });

    visible.forEach((card) => table.appendChild(card));
  }

  if (search) search.oninput = update;
  if (filter) filter.onchange = update;
  if (sort) sort.onchange = update;

  const deleteAll = document.getElementById("deleteAllResults");
  if (deleteAll) {
    deleteAll.onclick = () => {
      if (!confirm("Delete all results?")) return;
      localStorage.removeItem("examResults");
      app.innerHTML = resultsPage();
      resultsEvents();
    };
  }

  const refresh = document.getElementById("refreshResults");
  if (refresh) {
    refresh.onclick = () => {
      app.innerHTML = resultsPage();
      resultsEvents();
    };
  }

  const backAdmin = document.getElementById("backAdmin");
  if (backAdmin) {
    backAdmin.onclick = () => {
      app.innerHTML = adminPage();
    };
  }

  const allPDF = document.getElementById("downloadAllResultsPdf");
  if (allPDF) {
    allPDF.onclick = async () => {
      const results = getResults();
      if (!results.length) {
        alert("No Results available to export.");
        return;
      }
      await createPDF(results, "All_Results");
    };
  }

  if (resultsEventsInitialized) return;
  resultsEventsInitialized = true;

  // ربط عام آمن وسريع لكل الأزرار داخل جدول النتائج
  document.addEventListener("click", async (e) => {
    const reviewBtn = e.target.closest(".reviewResult");
    if (reviewBtn) {
      const id = Number(reviewBtn.dataset.result);
      const results = getResults();
      const result = results[id];
      if (result) {
        app.innerHTML = reviewResultPage(result);
      }
      return;
    }

    const delBtn = e.target.closest(".deleteResult");
    if (delBtn) {
      const id = Number(delBtn.dataset.result);
      if (!confirm("Delete this result?")) return;

      const results = getResults();
      results.splice(id, 1);
      saveResults(results);

      app.innerHTML = resultsPage();
      resultsEvents();
      return;
    }

    const pdfBtn = e.target.closest(".downloadResultPdf");
    if (pdfBtn) {
      const id = Number(pdfBtn.dataset.result);
      const results = getResults();
      const result = results[id];
      if (result) {
        await createPDF([result], `Student_Result_${result.studentName || "Result"}`);
      }
      return;
    }
  });
}

async function createPDF(results, fileName) {
  try {
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    const doc = new jsPDF();
    doc.text("Ahmed.R Physics Results", 14, 15);

    const rows = results.map((r) => [
      r.studentName || "",
      r.examTitle || "",
      `${r.score}/${r.total}`,
      Math.round((r.score / r.total) * 100) + "%",
      r.date || ""
    ]);

    doc.autoTable({
      startY: 25,
      head: [["Student", "Exam", "Score", "Percent", "Date"]],
      body: rows
    });

    doc.save(fileName + ".pdf");
  } catch (err) {
    console.error("PDF Generation Error:", err);
    alert("Error generating PDF file.");
  }
}