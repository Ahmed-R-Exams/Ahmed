import { jsPDF } from "jspdf";

export function exportExamPDF(exam){

    const pdf = new jsPDF();

    let y = 20;

    pdf.setFontSize(18);
    pdf.text(exam.title,10,y);

    y += 12;

    pdf.setFontSize(12);
    pdf.text(`Time : ${exam.examTime} Minutes`,10,y);

    y += 15;

    exam.questions.forEach((q,index)=>{

        if(y>260){
            pdf.addPage();
            y=20;
        }

        pdf.setFontSize(13);
        pdf.text(`${index+1}) ${q.question}`,10,y);

        y+=8;

        pdf.setFontSize(11);

        pdf.text(`A) ${q.options[0]}`,15,y);
        y+=7;

        pdf.text(`B) ${q.options[1]}`,15,y);
        y+=7;

        pdf.text(`C) ${q.options[2]}`,15,y);
        y+=7;

        pdf.text(`D) ${q.options[3]}`,15,y);
        y+=10;

        pdf.text(
            `Correct : ${String.fromCharCode(65+q.correctIndex)}`,
            15,
            y
        );

        y+=15;

    });

    pdf.save(`${exam.title}.pdf`);

}