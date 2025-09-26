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
import noto from "../../assets/fonts/Cairo-Regular.ttf";
import notoBold from "../../assets/fonts/Cairo-Bold.ttf";
import sraco from "../../assets/images/sraco.png"
import { CandidateCVPages } from "./DefaultCV";

Font.register({
  family: "Cairo",
  fonts: [
    { src: noto, fontWeight: "normal" },
    { src: notoBold, fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    fontFamily: "Cairo",
  },
  rtlText: {
    direction: "rtl",
  },

   image: {
    position: "absolute",
    top: 30,
    left: 45,
    width: 165,
    height: 165,
    objectFit: "cover",
    borderRadius: 90,
  },
   image2: {
    position: "absolute",
    top: 595,
    left: 120,
    width: 250,
    height: 280,
    objectFit: "contain",
  },
   passImage: {
    position: "absolute",
    top: 300,
    left: 365,
    width: 300,
    height: 270,
    objectFit: "contain",
  },
});

// 🔷 Main Page Component
export const SracoCv = ({ candidate }) => {
  const age = day().diff(day(candidate.dateOfBirth), "year");
  const dateOfBirth = day(candidate.dateOfBirth).format("DD/MMM/YYYY");
  const dateOfExpiry = day(candidate.passportExpiryDate).format("DD/MMM/YYYY");
  const dateOfIssue = day(candidate.passportIssueDate).format("DD/MMM/YYYY");

  const skills = candidate.skills instanceof Map 
  ? Object.fromEntries(candidate.skills) 
  : candidate.skills || {};


  return (
    <>
      <Page size={{ width: 640, height: 890 }} style={styles.page}>

        <Image
    src={sraco}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    }}
  />
        
       <Text style={{
        position: "absolute",
        top: 263,
        left: 142,
        fontSize: 10,
        fontWeight: "bold",
        color: "#302e2e",
       }}>
        {`${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`}
       </Text>

       <Text style={{
        position: "absolute",
        top: 282,
        left: 165,
        fontSize: 10,
        fontWeight: "bold",
        color: "#302e2e",
       }}>
        {candidate.passportNo}
       </Text>

       <Text style={{
        position: "absolute",
        top: 301,
        left: 160,
        fontSize: 10,
        fontWeight: "bold",
        color: "#302e2e",
       }}>
        {dateOfBirth}
       </Text>

       <Text style={{
        position: "absolute",
        top: 321,
        left: 175,
        fontSize: 10,
        fontWeight: "bold",
        color: "#302e2e",
       }}>
        {candidate.religion}
       </Text>

       <Text style={{
        position: "absolute",
        top: 341,
        left: 177,
        fontSize: 10,
        fontWeight: "bold",
        color: "#302e2e",
       }}>
        {candidate.maritalStatus}
       </Text>

       <Text style={{
        position: "absolute",
        top: 440,
        left: 230,
        fontSize: 10,
        fontWeight: "bold",
        color: "#302e2e",
       }}>
        Secondary
       </Text>

       <Text style={{
        position: "absolute",
        top: 460,
        left: 235,
        fontSize: 10,
        fontWeight: "bold",
        color: "#302e2e",
       }}>
        {candidate.languageArabic}
       </Text>

       <Text style={{
        position: "absolute",
        top: 488,
        left: 235,
        fontSize: 10,
        fontWeight: "bold",
        color: "#302e2e",
       }}>
        {candidate.languageEnglish}
       </Text>

       <Text style={{
        position: "absolute",
        top: 536,
        left: 275,
        fontSize: 10,
        fontWeight: "bold",
        color: "#302e2e",
       }}>
        {candidate.spokenLanguage}
       </Text>

       <Text style={{
        position: "absolute",
        top: 555,
        left: 160,
        fontSize: 10,
        fontWeight: "bold",
        color: "#302e2e",
       }}>
        {candidate.weight} kg
       </Text>
       <Text style={{
        position: "absolute",
        top: 555,
        left: 330,
        fontSize: 10,
        fontWeight: "bold",
        color: "#302e2e",
       }}>
        {candidate.height} cm
       </Text>
      
        
 {candidate.avatar && <Image src={candidate.avatar} style={styles.image} />}
 {candidate.fullSizePhoto && <Image src={candidate.fullSizePhoto} style={styles.image2} />}

    {candidate.passportScan && (
          <Image src={candidate.passportScan} style={styles.passImage}  />
      )}
   
      </Page>

   
    </>
  );
};

export const CombinedPDFDocument = ({ candidates }) => (
  <Document>
    {candidates.map((candidate, index) => (
      <CandidateCVPages
        key={index}
        candidate={candidate}
       
      />
    ))}
  </Document>
);