import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import day from "dayjs";
import { toast } from "react-toastify";

// Convert image URL to Base64
const getBase64FromUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

// Export a Table of Candidates
export const exportCandidatesTableToPDF = (candidates) => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [
      [
        "No.",
        "Full Name",
        "Gender",
        "Age",
        "Phone",
        "Passport No.",
        "CV Status",
        "Medical",
      ],
    ],
    body: candidates.map((s, index) => [
      index + 1,
      `${s.firstName} ${s.middleName}`,
      s.gender,
      day().diff(day(s.dateOfBirth), "year"),
      s.phoneNo,
      s.passportNo,
      s.cvStatus,
      s.medicalStatus,
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 2,
      halign: "center",
    },
  });
  doc.save("selected-candidates.pdf");
};

// Export Individual CVs with Photo on Right
export const exportCandidateCVs = async (candidates) => {
  if (candidates.length === 0) {
    toast.warning("No candidates selected.");
    return;
  }

  for (const c of candidates) {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(0, 123, 255);
    doc.rect(1, 1, 220, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("KERNTINA FOREIGN EMPLOYMENT AGENT PLC", pageWidth / 2, 20, {
      align: "center",
    });
   
    // Image
    let imageBase64 = null;
    if (c.fullSizePhoto) {
      try {
        imageBase64 = await getBase64FromUrl(c.fullSizePhoto);
        doc.addImage(imageBase64, "JPEG", 1, 60, 95, 150);
    } catch (err) {
        console.warn("Could not load image:", err);
      }
    }

    let y = 60; // start a bit lower than the image top
const labelX = 100;
const valueX = 140;

doc.setTextColor(0);
doc.setFontSize(10);

const addLine = (label, value) => {
  doc.text(`${label}:`, labelX, y);
  doc.text(String(value || "N/A"), valueX, y);
  y += 8;
};
    doc.save(`CV-${c.firstName}-${c.middleName}.pdf`);
  }

};
