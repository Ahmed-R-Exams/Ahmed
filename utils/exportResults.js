import * as XLSX from "xlsx";


export function exportResultsExcel(){


    const results =
    JSON.parse(
        localStorage.getItem("examResults")
    ) || [];



    if(!results.length){

        alert("No results to export");

        return;

    }



    const data = results.map(r=>({


        Student: r.studentName,

        Exam: r.examTitle,

        Score: r.score,

        Total: r.total,

        Date: r.date


    }));




    const worksheet =
    XLSX.utils.json_to_sheet(data);



    const workbook =
    XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Results"
    );



    XLSX.writeFile(
        workbook,
        "Ahmed.R_Exam_Results.xlsx"
    );


}