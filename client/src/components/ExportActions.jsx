import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  
  Font,
} from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import noto from "../assets/fonts/Cairo-Regular.ttf";
import notoBold from "../assets/fonts/Cairo-Bold.ttf";
import dayjs from "dayjs";

Font.register({
  family: "Cairo",
  fonts: [
    { src: noto, fontWeight: "normal" },
    { src: notoBold, fontWeight: "bold" },
  ],
});



// 🔷 Table Export
export const exportCandidatesTableToPDF = (candidates, selectedFields) => {
  const fieldLabels = {
    "Full Name": "Full Name",
    gender: "Gender",
    age: "Age",
    phoneNo: "Phone",
    passportNo: "Passport No.",
    cvStatus: "CV Status",
    medicalStatus: "Medical",
    narrative: "Narrative",
    narrativePhoneNo: "Narrative Phone",
    religion: "Religion",
    availabilityStatus: "Availability",
    laborId: "Labor ID",
    cocStatus: "COC Status",
    musanedStatus: "Musaned Status",
    medicalDate: "Medical Days",
    experienceOutside: "Experience Outside",
    cvSentTo: "CV Sent To",
    tasheerDate: "Tasheer Date",
    ticketDate: "Ticket Date",
    ticket: "Ticket",
    qrCode: "Qr code",
    wokala: "Wokala",
  };

  const head = [["No.", ...selectedFields.map((field) => fieldLabels[field] || field)]];

  const body = candidates.map((s, index) => {
    const row = [index + 1];
    selectedFields.forEach((field) => {
      if (field === "Full Name") {
        row.push([s.firstName, s.middleName, s.lastName].filter(Boolean).join(" "));
      } else if (field === "age") {
        row.push(s.dateOfBirth ? dayjs().diff(dayjs(s.dateOfBirth), "year") : "");
      } else if (field === "tasheerDate" || field === "ticketDate") {
        row.push(s[field] ? dayjs(s[field]).format("DD/MM/YY hh:mm A") : "");
      } else if (field === "medicalDate") {
        row.push(s[field] ? dayjs(s[field]).format("DD/MM/YY") : "");
      } else {
        row.push(s[field] ?? "");
      }
    });
    return row;
  });

  // Decide orientation by number of columns (including the "No." column)
  const totalColumns = 1 + selectedFields.length;
  const LANDSCAPE_COL_THRESHOLD = 8; // switch to landscape at 8+ columns
  const orientation = totalColumns >= LANDSCAPE_COL_THRESHOLD ? "landscape" : "portrait";

  const doc = new jsPDF({ orientation });

  autoTable(doc, {
    head,
    body,
    startY: 20,
    styles: {
      fontSize: totalColumns >= 10 ? 8 : 10,
      cellPadding: 2,
      halign: "center",
      overflow: "linebreak",
    },
    headStyles: { fillColor: [0, 102, 204], textColor: 255 },
  });

  const blob = doc.output("blob");
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");
};


export const exportCandidatesTableToExcel = (candidates, selectedFields) => {
  const fieldLabels = {
    "Full Name": "Full Name",
    gender: "Gender",
    age: "Age",
    phoneNo: "Phone",
    passportNo: "Passport No.",
    cvStatus: "CV Status",
    medicalStatus: "Medical",
    narrativePhoneNo: "Narrative Phone",
    religion: "Religion",
    availabilityStatus: "Availability",
    laborId: "Labor ID",
    cocStatus: "COC Status",
    musanedStatus: "Musaned Status",
    medicalDate: "Medical Days",
    experienceOutside: "Experience Outside",
    cvSentTo: "CV Sent To",
  };

  const data = candidates.map((c) => {
    const row = {};
    selectedFields.forEach((field) => {
      if (field === "Full Name") {
        row[fieldLabels[field]] = [c.firstName, c.middleName, c.lastName].filter(Boolean).join(" ");
      } else if (field === "age") {
        row[fieldLabels[field]] = c.dateOfBirth ? dayjs().diff(dayjs(c.dateOfBirth), "year") : "";
      } else if (field === "medicalDate") {
        row[fieldLabels[field]] = c.medicalDate ? dayjs().diff(dayjs(c.medicalDate), "day") + " days" : "";
      } else {
        row[fieldLabels[field] || field] = c[field] || "";
      }
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

  XLSX.writeFile(workbook, "CandidatesTable.xlsx");
};
