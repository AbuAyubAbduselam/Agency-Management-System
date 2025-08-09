import React from "react";

const TripleRow = ({ label, value, repeat }) => (
  <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "4px" , fontFamily: "'Calibri', Traditional Arabic"}}>
    <tbody>
      <tr>
        <td style={{
          width: "33%",
          border: "1px solid #ccc",
          textAlign: "center",
          fontWeight: "bold",
          backgroundColor: "#e5e7eb",
          padding: "4px",
          fontSize: "0.7rem",
        }}>
          {label}
        </td>
        <td style={{
          width: "33%",
          border: "1px solid #ccc",
          textAlign: "center",
          fontWeight: "bold",
          backgroundColor: "#ffffff",
          padding: "4px",
          fontSize: "0.7rem",
        }}>
          {value}
        </td>
        <td style={{
          width: "33%",
          border: "1px solid #ccc",
          textAlign: "center",
          fontWeight: "bold",
          backgroundColor: "#e5e7eb",
          padding: "4px",
          fontSize: "0.7rem",
        }}>
          {repeat}
        </td>
      </tr>
    </tbody>
  </table>
);


const SubHeader = ({ en, ar }) => (
  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "8px" }}>
    <tbody>
      <tr>
        <td style={{
          width: "50%",
          backgroundColor: "#0891b2",
          textAlign: "center",
          padding: "4px",
          color: "white",
          fontSize: "0.6rem",
          fontWeight: "bold",
        }}>
          {en}
        </td>
        <td style={{
          width: "50%",
          backgroundColor: "#3b82f6",
          textAlign: "center",
          padding: "4px",
          color: "white",
          fontSize: "0.6rem",
          fontWeight: "bold",
        }}>
          {ar}
        </td>
      </tr>
    </tbody>
  </table>
);


const CandidateCVDocxLayout = React.forwardRef(({ candidate }, ref) => {
  const age = new Date().getFullYear() - new Date(candidate.dateOfBirth).getFullYear();

  return (
<div
  ref={ref}
  id={`candidate-cv-${candidate._id}`}
  style={{
    fontFamily: "'Calibri', 'Traditional Arabic', sans-serif",
    fontSize: "12px",
    width: "210mm", // A4 width
    minHeight: "297mm", // A4 height
    padding: "20mm", // for consistent margins
    boxSizing: "border-box",
    position: "relative"
  }}
>
      {/* Header */}

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "8px" }}>
 <tbody>
    <tr>
      <td
        style={{
          backgroundColor: "#1d4ed8",
          color: "white",
          textAlign: "center",
          padding: "26px",
          fontWeight: "bold",
          fontSize: "1.125rem"
        }}
      >
        MUBAREK AHMED FOREIGN EMPLOYMENT AGENT
      </td>
      </tr>
      </tbody>
      </table>

      {/* Dual Sub Header */}
      <SubHeader en="Code 2020" ar="APPLICATION FOR EMPLOYMENT" />

      {/* Top Rows */}
      <TripleRow label="FULL NAME" value={`${candidate.firstName} ${candidate.middleName}`} repeat="الاسم الكامل" />
      <TripleRow label="CONTRACT PERIOD" value="2 YEARS" repeat="مدة العقد" />
      <TripleRow label="POSITION" value="HOUSE MAID" repeat="الوظيفة" />
      <TripleRow label="SALARY" value="1000 SAR" repeat="الراتب" />

      {/* Passport Details */}
      <SubHeader en="PASSPORT DETAIL" ar="بيانات جواز السفر" />
      <TripleRow label="NUMBER" value={candidate.passportNo || "EP1011282"} repeat="رقم الجواز" />
      <TripleRow label="DATE OF ISSUE" value="12/2/2014" repeat="تاريخ الإصدار" />
      <TripleRow label="DATE OF EXPIRY" value="12/2/2014" repeat="تاريخ الانتهاء" />
      <TripleRow label="PLACE OF ISSUE" value="ADDIS ABABA" repeat="مكان الإصدار" />

      {/* Language */}
      <SubHeader en="LANGUAGE AND EDUCATION" ar="اللغة والتعليم" />
      <TripleRow label="ENGLISH" value="YES" repeat="اللغة الإنجليزية" />
      <TripleRow label="ARABIC" value="YES" repeat="اللغة العربية" />

      {/* Experience */}
      <SubHeader en="EXPERIENCE ABROAD" ar="الخبرة خارج البلاد" />
      <TripleRow label="COUNTRY" value="SAUDI" repeat="الدولة" />
      <TripleRow label="PERIOD" value="2 YEARS" repeat="المدة" />

      {/* Flex Section: Personal Data and Skills */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          marginTop: "8px",
          width: "100%"
        }}
      >
        {/* Left: Personal Data */}
        <div style={{ flex: 1 }}>
          <SubHeader en="PERSONAL DATA" ar="معلومات شخصية" />
          <TripleRow label="NATIONALITY" value="ETHIOPIA" repeat="الجنسية" />
          <TripleRow label="RELIGION" value="MUSLIM" repeat="الديانة" />
          <TripleRow label="DATE OF BIRTH" value="23/09/2003" repeat="تاريخ الميلاد" />
          <TripleRow label="PLACE OF BIRTH" value="ADDIS ABABA" repeat="مكان الميلاد" />
          <TripleRow label="LIVING TOWN" value="ADDIS ABABA" repeat="مكان الإقامة" />
          <TripleRow label="AGE" value={age.toString()} repeat="العمر" />
          <TripleRow label="MARITAL STATUS" value="SINGLE" repeat="الحالة الاجتماعية" />
          <TripleRow label="CHILDREN" value="0" repeat="عدد الأطفال" />
          <TripleRow label="WEIGHT" value="60" repeat="الوزن" />
          <TripleRow label="HEIGHT" value="155" repeat="الطول" />
          <TripleRow label="PHONE" value="0912334566" repeat="رقم الهاتف" />
          <TripleRow label="NEXT OF KIN" value="abdu" repeat="أقرب الأقارب" />
          <TripleRow label="KIN PHONE" value="0912334566" repeat="هاتف القريب" />
        </div>

        {/* Right: Skills */}
        <div style={{ flex: 1 }}>
          <SubHeader en="SKILLS" ar="المهارات" />
          <TripleRow label="CLEANING" value="YES" repeat="تنظيف" />
          <TripleRow label="WASHING" value="YES" repeat="غسيل" />
          <TripleRow label="IRONING" value="YES" repeat="كي" />
          <TripleRow label="ARABIC COOKING" value="YES" repeat="الطبخ العربي" />
          <TripleRow label="CHILDREN CARE" value="YES" repeat="العناية بالأطفال" />
          <TripleRow label="DRIVING" value="NO" repeat="القيادة" />
          <TripleRow label="SEWING" value="NO" repeat="الخياطة" />
        </div>
      </div>

      {/* Final Note */}
      <TripleRow label="REMARK" value=" " repeat="ملاحظة" />

      {/* Image */}
      {candidate.fullSizePhoto && (
        <img
          src={candidate.fullSizePhoto}
          alt="Full size"
          style={{
            position: "absolute",
            width: "286px",
            height: "390px",
            objectFit: "contain",
            left: "305px",
            top: "190px",
            border: "1px solid #ccc"
          }}
        />
      )}
    </div>
  );
});

CandidateCVDocxLayout.displayName = "CandidateCVDocxLayout";

export default CandidateCVDocxLayout;
