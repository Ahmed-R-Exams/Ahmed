import * as XLSX from "xlsx";



// ================= READ EXCEL =================

export function readExcel(file, callback){



const reader = new FileReader();



reader.onload = function(e){



try{


const data =
new Uint8Array(
e.target.result
);



const workbook =
XLSX.read(
data,
{
type:"array"
}
);




const sheet =
workbook.Sheets[
workbook.SheetNames[0]
];




const rows =
XLSX.utils.sheet_to_json(
sheet,
{
defval:""
}
);





const questions = rows
.map(row=>({



question:

row.Question ||
row.question ||
row.QUESTION ||
"",




image:

row.Image ||
row.image ||
row.IMAGE ||
"",





options:[

row.A ||
row.a ||
"",

row.B ||
row.b ||
"",

row.C ||
row.c ||
"",

row.D ||
row.d ||
""

],





answer:

String(
row.Answer ||
row.answer ||
row.ANSWER ||
""
)
.trim()
.toUpperCase()



}))



.filter(q=>q.question);



callback(questions);



}

catch(error){


console.error(
"Excel Error:",
error
);


alert(
"Excel file error"
);


}



};



reader.readAsArrayBuffer(file);



}