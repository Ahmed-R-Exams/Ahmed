import * as XLSX from "xlsx";
import { getResults } from "../services/resultService.js";

export async function exportResultsExcel() {

  const results = await getResults();

  if (!results.length) {
    alert("لا توجد نتائج لتصديرها");
    return;
  }

  const data = results.map((r) => ({
    Student: r.studentName,
    Exam: r.examTitle,
    Score: r.score,
    Total: r.total,
    Percentage: r.percentage,
    Date: r.date,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

  XLSX.writeFile(workbook, "Ahmed.R_Exam_Results.xlsx");
}
