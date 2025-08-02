import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import day from "dayjs";
import {
  Font,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import amiri from "../assets/fonts/Amiri-Regular.ttf";

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

  const head = [
    [
      "No.",
      ...selectedFields.map((field) => fieldLabels[field] || field),
    ],
  ];

  const body = candidates.map((s, index) => {
    const row = [index + 1];

    selectedFields.forEach((field) => {
      if (field === "Full Name") {
        const fullName = [s.firstName, s.middleName, s.lastName]
          .filter(Boolean)
          .join(" ");
        row.push(fullName);
      } else if (field === "age") {
        row.push(s.dateOfBirth ? day().diff(day(s.dateOfBirth), "year") : "");
      } else if (field === "medicalDate") {
        row.push(s.medicalDate ? day().diff(day(s.medicalDate), "day") + " days" : "");
      } else {
        row.push(s[field] || "");
      }
    });

    return row;
  });

  autoTable(doc, {
    head,
    body,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      halign: "center",
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
    },
    startY: 20,
  });

  doc.save("selected-candidates.pdf");
};






// Register Arabic Font
Font.register({
  family: "Amiri",
  src: amiri,
  fonts: [
    {
      src: amiri,
      fontWeight: "normal",
    },
  ],
});

// Reusable Components
const InfoRow = ({ label, value, repeatLabel }) => (
  <View style={styles.small_container}>
    <Text style={styles.cell}>{label}</Text>
    <Text style={[styles.cell, styles.middleCell]}>{value}</Text>
    <Text style={[styles.cell, styles.rightCell, styles.rtlText]}>{repeatLabel}</Text>
  </View>
);

const HeaderRow = ({ codeText, headerText, containerStyle }) => (
  <View style={[styles.sub_header_container, containerStyle]}>
    <Text style={styles.code}>{codeText}</Text>
    <Text style={styles.sub_header}>{headerText}</Text>
  </View>
);

const RightAlignedInfoRow = ({ label, value, repeatLabel }) => (
  <View style={styles.rightAlignedContainer}>
    <Text style={styles.cellRight}>{label}</Text>
    <Text style={styles.cellRight}>{value}</Text>
    <Text style={[styles.cellRight, styles.rtlText]}>{repeatLabel}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: "Amiri",
  },
  rtlText: {
    direction: "rtl",
    fontFamily: "Amiri",
  },
  header: {
    backgroundColor: "#007bff",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
    padding: 15,
    fontSize: 14,
    fontWeight: "bold",
    height: 60,
  },
  sub_header_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginVertical: 2,
  },
  sub_header: {
    backgroundColor: "#25a0d1",
    color: "#fff",
    textAlign: "center",
    padding: 3,
    fontSize: 10,
    fontWeight: "bold",
    height: 25,
    width: "50%",
  },
  code: {
    backgroundColor: "#25a0d1",
    color: "#fff",
    textAlign: "center",
    padding: 3,
    fontSize: 10,
    fontWeight: "bold",
    height: 25,
    width: "50%",
  },
  small_container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cell: {
    width: "30%",
    padding: 2.5,
    textAlign: "center",
    backgroundColor: "#adbccc",
    fontSize: 8,
  },
  middleCell: {
    width: "45%",
    fontSize: 8,
  },
  rightCell: {
    width: "25%",
    fontSize: 8,
  },
  rightAlignedContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 0.5,
    marginRight: 320,
    width: "50%",
  },
  rightAlignedHeaderContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 0.5,
    marginRight: 330,
    width: "49.5%",
  },
  parallelRowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 0,
  },
  parallelLeftColumn: {
    width: "50%",
  },
  parallelRightColumn: {
    width: "50%",
  },
  cellRight: {
    width: "33%",
    padding: 2.5,
    textAlign: "center",
    backgroundColor: "#adbccc",
    fontSize: 9,
  },
  body: {
    flexDirection: "row",
  },
  image: {
    position: "absolute",
    top: 190,
    left: 305,
    width: 286,
    height: 390,
    objectFit: "contain",
  },
});

const arabicLabels = {
  'FULL NAME': 'الاسم الكامل',
  'NAME': 'الاسم',
  'CONTRACT PERIOD': 'مدة العقد',
  'POSITION': 'الوظيفة',
  'SALARY': 'الراتب',
  'NUMBER': 'رقم الجواز',
  'DATE OF ISSUE': 'تاريخ الإصدار',
  'DATE OF EXPIRY': 'تاريخ الانتهاء',
  'PLACE OF ISSUE': 'مكان الإصدار',
  'ENGLISH': 'اللغة الإنجليزية',
  'ARABIC': 'اللغة العربية',
  'COUNTRY': 'الدولة',
  'PERIOD': 'المدة',
  'NATIONALITY': 'الجنسية',
  'RELIGION': 'الديانة',
  'DATE OF BIRTH': 'تاريخ الميلاد',
  'PLACE OF BIRTH': 'مكان الميلاد',
  'LIVING TOWN': 'مكان الإقامة',
  'MARITAL STATUS': 'الحالة الاجتماعية',
  'SPOKEN LANGUAGES': 'اللغات المحكية',
  'NEXT OF KIN': 'أقرب الأقارب',
'KIN PHONE': 'هاتف القريب',
  'CHILDREN':'عدد الأطفال',
  'WEIGHT':'الوزن',
  'HEIGHT':'الطول',
  'AGE':'العمر',
  'PHONE':'رقم الهاتف',
  'BABY SITTING': 'رعاية الأطفال',
  'CHILDREN CARE': 'العناية بالأطفال',
  'CLEANING': 'تنظيف',
  'WASHING': 'غسيل',
  'IRONING': 'كي',
  'ARABIC COOKING': 'الطبخ العربي',
  'TUTORING': 'التدريس',
  'DISABLE CARE': 'رعاية المعاقين',
  'DRIVING': 'القيادة',
  'SEWING': 'الخياطة',
  'REMARK': 'ملاحظة',
};

// PDF Document
const CandidateCVDocument = ({ candidate }) => {
  const age = day().diff(day(candidate.dateOfBirth), "year");

  console.log(candidate.fullSizePhoto)

  return (
    <Document>
      {/* --- CV Page --- */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.header}>MUBAREK AHMED FOREIGN EMPLOYMENT AGENT</Text>

        <HeaderRow codeText="Code 2020" headerText="APPLICATION FOR EMPLOYMENT" />
        <InfoRow label="FULL NAME" value={`${candidate.firstName} ${candidate.middleName}`} repeatLabel="الاسم الكامل" />
        <InfoRow label="CONTRACT PERIOD" value="2 YEARS" repeatLabel="مدة العقد" />
        <InfoRow label="POSITION" value="HOUSE MAID" repeatLabel="الوظيفة" />
        <InfoRow label="SALARY" value="1000 SAR" repeatLabel="الراتب" />

        <HeaderRow codeText="PASSPORT DETAIL" headerText="بيانات جواز السفر" containerStyle={styles.rightAlignedHeaderContainer} />
        <RightAlignedInfoRow label="NUMBER" value={candidate.passportNo || "EP1011282"} repeatLabel="رقم الجواز" />
        <RightAlignedInfoRow label="DATE OF ISSUE" value="12/2/2014" repeatLabel="تاريخ الإصدار" />
        <RightAlignedInfoRow label="DATE OF EXPIRY" value="12/2/2014" repeatLabel="تاريخ الانتهاء" />
        <RightAlignedInfoRow label="PLACE OF ISSUE" value="ADDIS ABABA" repeatLabel="مكان الإصدار" />

        <HeaderRow codeText="LANGUAGE AND EDUCATION" headerText="اللغة والتعليم" containerStyle={styles.rightAlignedHeaderContainer} />
        <RightAlignedInfoRow label="ENGLISH" value="YES" repeatLabel="اللغة الإنجليزية" />
        <RightAlignedInfoRow label="ARABIC" value="YES" repeatLabel="اللغة العربية" />

        <HeaderRow codeText="EXPERIENCE ABROAD" headerText="الخبرة خارج البلاد" containerStyle={styles.rightAlignedHeaderContainer} />
        <RightAlignedInfoRow label="COUNTRY" value="SAUDI" repeatLabel="الدولة" />
        <RightAlignedInfoRow label="PERIOD" value="2 YEARS" repeatLabel="المدة" />

        <HeaderRow codeText="PERSONAL DATA" headerText="معلومات شخصية" containerStyle={styles.rightAlignedHeaderContainer} />
        <RightAlignedInfoRow label="NATIONALITY" value="ETHIOPIA" repeatLabel="الجنسية" />
        <RightAlignedInfoRow label="RELIGION" value="MUSLIM" repeatLabel="الديانة" />
        <RightAlignedInfoRow label="DATE OF BIRTH" value="23/09/2003" repeatLabel="تاريخ الميلاد" />
        <RightAlignedInfoRow label="PLACE OF BIRTH" value="ADDIS ABABA" repeatLabel="مكان الميلاد" />
        <RightAlignedInfoRow label="LIVING TOWN" value="ADDIS ABABA" repeatLabel="مكان الإقامة" />

        <View style={styles.parallelRowContainer}>
          <View style={styles.parallelLeftColumn}>
            <InfoRow label="AGE" value={age.toString()} repeatLabel="العمر" />
            <InfoRow label="MARITAL STATUS" value="SINGLE" repeatLabel="الحالة الاجتماعية" />
            <InfoRow label="CHILDREN" value="0" repeatLabel=" عدد الأطفال" />
            <InfoRow label="WEIGHT" value="60" repeatLabel="الوزن" />
            <InfoRow label="HEIGHT" value="155" repeatLabel="الطول" />
            <InfoRow label="PHONE" value="0912334566" repeatLabel="رقم الهاتف" />
            <InfoRow label="NEXT OF KIN" value="abdu" repeatLabel="أقرب الأقارب" />
            <InfoRow label="KIN PHONE" value="0912334566" repeatLabel="هاتف القريب" />
          </View>

          <View style={styles.parallelRightColumn}>
            <HeaderRow codeText="SKILLS" headerText="المهارات" />
            <InfoRow label="CLEANING" value="YES" repeatLabel="تنظيف" />
            <InfoRow label="WASHING" value="YES" repeatLabel="غسيل" />
            <InfoRow label="IRONING" value="YES" repeatLabel="كي" />
            <InfoRow label="ARABIC COOKING" value="YES" repeatLabel="الطبخ العربي" />
            <InfoRow label="CHILDREN CARE" value="YES" repeatLabel="العناية بالأطفال" />
            <InfoRow label="DRIVING" value="NO" repeatLabel="القيادة" />
            <InfoRow label="SEWING" value="NO" repeatLabel="الخياطة" />
          </View>
        </View>
        <InfoRow label="REMARK" value=" " repeatLabel="ملاحظة" />

        {candidate.fullSizePhoto && (
          <Image src={candidate.fullSizePhoto} style={styles.image} />
        )}
      </Page>

      {/* --- Passport Scan Page --- */}
      {candidate.passportScan && (
        <Page size="LETTER" style={[styles.page, { alignItems: "center", justifyContent: "center" }]}>
          <Text style={{ fontSize: 22, marginBottom: 10, color: "#25a0d1"}}>Passport Scan</Text>
          <Image
            src={candidate.passportScan}
            style={{
              width: 400,
              height: 550,
              objectFit: "contain",
            }}
          />
        </Page>
      )}
    </Document>
  );
};


// Export multiple PDFs
export const exportCandidateCVs = (candidates) => {
  return candidates.map((candidate) => ({
    filename: `CV-${candidate.firstName}-${candidate.middleName}.pdf`,
    document: <CandidateCVDocument candidate={candidate} />,
  }));
};

export default CandidateCVDocument;
