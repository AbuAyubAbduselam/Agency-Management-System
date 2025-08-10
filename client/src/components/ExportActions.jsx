import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import day from "dayjs";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
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

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: "Cairo",
  },
  rtlText: {
    direction: "rtl",
  },
  mainHeader: {
    backgroundColor: "#1d4ed8",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
    padding: 15,
    fontSize: 14,
    fontWeight: "bold",
    height: 60,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    border: "1px solid #ccc",
  },
  headerCellLeft: {
    backgroundColor: "#0891b2",
    color: "#fff",
    textAlign: "center",
    padding: 3,
    fontSize: 10,
    fontWeight: "bold",
    height: 25,
    width: "50%",
  },
  headerCellRight: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    textAlign: "center",
    padding: 3,
    fontSize: 10,
    fontWeight: "bold",
    height: 25,
    width: "50%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 3,
    border: "1px solid #ccc",
  },
  infoCell: {
    width: "33%",
    textAlign: "center",
    backgroundColor: "#e5e7eb",
    fontSize: "0.87rem",
    fontWeight: "bold",
    border: "1px solid #ccc",
  },
  infoCellMiddle: {
    backgroundColor: "#ffffff",
  },
  infoCellRight: {
    fontWeight: "bold",
  },
  rtlInfoCell: {
    direction: "rtl",
  },
  rightInfoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginRight: 320,
    padding: 3,
    width: "52%",
    border: "1px solid #ccc",
  },
  rightHeaderRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginRight: 330,
    width: "52%",
  },
  rowGroup: {
    flexDirection: "row",
  },
  columnLeft: {
    width: "52.2%",
  },
  columnRight: {
    width: "47%",
    marginTop: -80,
    marginLeft: 8,
  },
  smallCell: {
    width: "33%",
    textAlign: "center",
    backgroundColor: "#e5e7eb",
    fontSize: 9,
  },
  image: {
    position: "absolute",
    top: 227,
    left: 335,
    width: 278,
    height: 375,
    objectFit: "contain",
    border: "1px solid #ccc",
    marginLeft: 7,
  },
});

// 🔷 Shared Components
const InfoRow = ({ label, value, repeatLabel, containerStyle }) => (
  <View style={[styles.infoRow, containerStyle]}>
    <Text style={[styles.infoCell]}>{label}</Text>
    <Text style={[styles.infoCell, styles.infoCellMiddle]}>{value}</Text>
    <Text style={[styles.infoCell, styles.infoCellRight, styles.rtlText]}>{repeatLabel}</Text>
  </View>
);

const HeaderRow = ({ codeText, headerText, containerStyle }) => (
  <View style={[styles.headerRow, containerStyle]}>
    <Text style={styles.headerCellLeft}>{codeText}</Text>
    <Text style={styles.headerCellRight}>{headerText}</Text>
  </View>
);

const RightAlignedInfoRow = ({ label, value, repeatLabel }) => (
  <View style={styles.rightInfoRow}>
    <Text style={[styles.smallCell,{fontWeight:"bold"}]}>{label}</Text>
    <Text style={[styles.smallCell, { backgroundColor: "#fff",border: "1px solid #ccc" }]}>{value}</Text>
    <Text style={[styles.smallCell, styles.rtlText,{ border: "1px solid #ccc",fontWeight:"bold"}]}>{repeatLabel}</Text>
  </View>
);

// 🔷 Main Page Component
export const CandidateCVPages = ({ candidate, agentName, agentLogo }) => {
  const age = day().diff(day(candidate.dateOfBirth), "year");
  const dateOfBirth = day(candidate.dateOfBirth).format("DD MMMM YYYY");
  const dateOfExpiry = day(candidate.passportExpiryDate).format("DD MMMM YYYY");
  const dateOfIssue = day(candidate.passportIssueDate).format("DD MMMM YYYY");

  return (
    <>
      <Page size={{ width: 640, height: 890 }} style={styles.page}>
        
        {/* 🔹 Replace mainHeader with agent name + logo */}
       <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    border: "1px solid #ccc",
    padding: 5,
    minHeight: 60, // ensure consistent height
  }}
>
  {agentLogo ? (
    <Image
      src={agentLogo}
      style={{
        width: 60,
        height: 60,
        objectFit: "contain",
        marginRight: 10,
      }}
    />
  ) : (
    <View
      style={{
        width: 60,
        height: 60,
        marginRight: 10,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 10, color: "#666" }}></Text>
    </View>
  )}

  {agentName || candidate.cvSentTo ? (
    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
      {agentName || candidate.cvSentTo}
    </Text>
  ) : (
    <View
      style={{
        height: 60,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#666" }}>
        
      </Text>
    </View>
  )}
</View>


        <HeaderRow codeText={`Code ${candidate.code}`} headerText="APPLICATION FOR EMPLOYMENT" />
        
        <InfoRow label="FULL NAME" value={`${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`} repeatLabel="الاسم الكامل" />
        <InfoRow label="CONTRACT PERIOD" value="2 YEARS" repeatLabel="مدة العقد" />
        <InfoRow label="POSITION" value={candidate.position} repeatLabel="الوظيفة" />
        <InfoRow label="SALARY" value={`${candidate.salary} SAR`} repeatLabel="الراتب" />

        <HeaderRow codeText="PASSPORT DETAIL" headerText="بيانات جواز السفر" containerStyle={styles.rightHeaderRow} />
        <RightAlignedInfoRow label="NUMBER" value={candidate.passportNo} repeatLabel="رقم الجواز" />
        <RightAlignedInfoRow label="DATE OF ISSUE" value={dateOfIssue} repeatLabel="تاريخ الإصدار" />
        <RightAlignedInfoRow label="DATE OF EXPIRY" value={dateOfExpiry} repeatLabel="تاريخ الانتهاء" />
        <RightAlignedInfoRow label="PLACE OF ISSUE" value={candidate.passportIssuePlace} repeatLabel="مكان الإصدار" />

        <HeaderRow codeText="LANGUAGE AND EDUCATION" headerText="اللغة والتعليم" containerStyle={styles.rightHeaderRow} />
        <RightAlignedInfoRow label="ENGLISH" value={candidate.english} repeatLabel="اللغة الإنجليزية" />
        <RightAlignedInfoRow label="ARABIC" value={candidate.arabic} repeatLabel="اللغة العربية" />

        <HeaderRow codeText="EXPERIENCE ABROAD" headerText="الخبرة خارج البلاد" containerStyle={styles.rightHeaderRow} />
        <RightAlignedInfoRow label="COUNTRY" value={candidate.experienceCountry} repeatLabel="الدولة" />
        <RightAlignedInfoRow label="PERIOD" value={candidate.experiencePeriod} repeatLabel="المدة" />

        <HeaderRow codeText="PERSONAL DATA" headerText="معلومات شخصية" containerStyle={styles.rightHeaderRow} />
        <RightAlignedInfoRow label="NATIONALITY" value="ETHIOPIA" repeatLabel="الجنسية" />
        <RightAlignedInfoRow label="RELIGION" value="MUSLIM" repeatLabel="الديانة" />
        <RightAlignedInfoRow label="DATE OF BIRTH" value={dateOfBirth} repeatLabel="تاريخ الميلاد" />
        <RightAlignedInfoRow label="PLACE OF BIRTH" value={candidate.placeOfBirth} repeatLabel="مكان الميلاد" />
        <RightAlignedInfoRow label="LIVING TOWN" value={candidate.livingTown} repeatLabel="مكان الإقامة" />

        <View style={styles.rowGroup}>
          <View style={styles.columnLeft}>
            <InfoRow label="AGE" value={age.toString()} repeatLabel="العمر" />
            <InfoRow label="MARITAL STATUS" value={candidate.maritalStatus} repeatLabel="الحالة الاجتماعية" />
            <InfoRow label="CHILDREN" value={candidate.children} repeatLabel=" عدد الأطفال" />
            <InfoRow label="WEIGHT" value={`${candidate.weight} kg`} repeatLabel="الوزن" />
            <InfoRow label="HEIGHT" value={`${candidate.height} cm`} repeatLabel="الطول" />
            <InfoRow label="PHONE" value={candidate.phone} repeatLabel="رقم الهاتف" />
          </View>

          <View style={styles.columnRight}>
            <HeaderRow codeText="SKILLS" headerText="المهارات" />
            <InfoRow label="CLEANING" value={candidate.skills.cleaning} repeatLabel="تنظيف" />
            <InfoRow label="WASHING" value={candidate.skills.washing} repeatLabel="غسيل" />
            <InfoRow label="IRONING" value={candidate.skills.ironing} repeatLabel="كي" />
            <InfoRow label="COOKING" value={candidate.skills.cooking} repeatLabel="الطبخ العادي" />
            <InfoRow label="ARABIC COOKING" value={candidate.skills.arabicCooking} repeatLabel="الطبخ العربي" />
            <InfoRow label="CHILDREN CARE" value={candidate.skills.childrenCare} repeatLabel="العناية بالأطفال" />
            <InfoRow label="DRIVING" value={candidate.skills.driving} repeatLabel="القيادة" />
            <InfoRow label="SEWING" value={candidate.skills.sewing} repeatLabel="الخياطة" />
          </View>
        </View>

        <InfoRow label="REMARK" value={candidate.remark} repeatLabel="ملاحظة" />
        {candidate.fullSizePhoto && <Image src={candidate.fullSizePhoto} style={styles.image} />}
      </Page>

      {candidate.passportScan && (
        <Page size="LETTER" style={[styles.page, { alignItems: "center", justifyContent: "center" }]}>
          <Text style={{ fontSize: 22, marginBottom: 10, color: "#25a0d1" }}>Passport Scan</Text>
          <Image src={candidate.passportScan} style={{ width: 400, height: 550, objectFit: "contain" }} />
        </Page>
      )}
    </>
  );
};

export const CombinedPDFDocument = ({ candidates, agentName, agentLogo }) => (
  <Document>
    {candidates.map((candidate, index) => (
      <CandidateCVPages
        key={index}
        candidate={candidate}
        agentName={agentName}
        agentLogo={agentLogo}
      />
    ))}
  </Document>
);


// 🔷 Table Export
export const exportCandidatesTableToPDF = (candidates, selectedFields) => {
  const doc = new jsPDF();

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

    const head = [["No.", ...selectedFields.map((field) => fieldLabels[field] || field)]];


   const body = candidates.map((s, index) => {
    const row = [index + 1];
    selectedFields.forEach((field) => {
      if (field === "Full Name") {
        row.push([s.firstName, s.middleName, s.lastName].filter(Boolean).join(" "));
      } else if (field === "age") {
        row.push(s.dateOfBirth ? dayjs().diff(dayjs(s.dateOfBirth), "year") : "");
      } else if (field === "medicalDate") {
        row.push(s.medicalDate ? dayjs().diff(dayjs(s.medicalDate), "day") + " days" : "");
      } else {
        row.push(s[field] || "");
      }
    });
    return row;
  });

  autoTable(doc, {
    head,
    body,
    styles: { fontSize: 10, cellPadding: 2, halign: "center" },
    headStyles: { fillColor: [22, 160, 133], textColor: 255 },
    startY: 20,
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
