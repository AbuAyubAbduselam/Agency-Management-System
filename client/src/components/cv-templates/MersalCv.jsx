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
import mersalTemp from "../../assets/images/mersal-cv.png"
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
    padding: 20,
    fontSize: 9,
    fontFamily: "Cairo",
  },
  rtlText: {
    direction: "rtl",
  },

   image: {
    position: "absolute",
    top: 16,
    left: 71,
    width: 110,
    height: 126,
    objectFit: "cover",
    borderRadius: 20,
  },
});

// 🔷 Main Page Component
export const MersalCv = ({ candidate }) => {
  const age = day().diff(day(candidate.dateOfBirth), "year");
  const dateOfBirth = day(candidate.dateOfBirth).format("DD MMMM YYYY");
  const dateOfExpiry = day(candidate.passportExpiryDate).format("DD/MMM/YYYY");
  const dateOfIssue = day(candidate.passportIssueDate).format("DD/MMM/YYYY");

  const skills = candidate.skills instanceof Map 
  ? Object.fromEntries(candidate.skills) 
  : candidate.skills || {};


  return (
    <>
      <Page size={{ width: 640, height: 890 }} style={styles.page}>

        <Image
    src={mersalTemp}
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
        top: 145,
        left: 290,
        fontSize: 12,
        fontWeight: "bold",
        color: "#efeeee",
       }}>
        {`${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`}
       </Text>
       <Text style={{
        position: "absolute",
        top: 175,
        left: 335,
        fontSize: 12,
        fontWeight: "bold",
        color: "#efeeee",
       }}>
       {candidate.position} 
       </Text>

       {/* left */}
       <Text style={{
        position: "absolute",
        top: 262,
        left: 220,
        fontSize: 11,
        color: "#5e5858",
       }}>
       Ethiopia
       </Text>
       <Text style={{
        position: "absolute",
        top: 288,
        left: 210,
        fontSize: 11,
        color: "#5e5858",
       }}>
       {candidate.religion}
       </Text>
       <Text style={{
        position: "absolute",
        top: 312,
        left: 218,
        fontSize: 11,
        color: "#5e5858",
       }}>
       {age} years
       </Text>
       <Text style={{
        position: "absolute",
        top: 338,
        left: 205,
        fontSize: 9,
        color: "#5e5858",
       }}>
       {dateOfBirth}
       </Text>
       <Text style={{
        position: "absolute",
        top: 363,
        left: 216,
        fontSize: 9,
        color: "#5e5858",
       }}>
       {candidate.placeOfBirth}
       </Text>
       <Text style={{
        position: "absolute",
        top: 387,
        left: 216,
        fontSize: 9,
        color: "#5e5858",
       }}>
       {candidate.livingTown}
       </Text>
       <Text style={{
        position: "absolute",
        top: 413,
        left: 215,
        fontSize: 9,
        color: "#5e5858",
       }}>
       {candidate.maritalStatus}
       </Text>
       <Text style={{
        position: "absolute",
        top: 441,
        left: 223,
        fontSize: 9,
        color: "#5e5858",
       }}>
       {candidate.weight}
       </Text>
       <Text style={{
        position: "absolute",
        top: 464,
        left: 222,
        fontSize: 9,
        color: "#5e5858",
       }}>
       {candidate.height}
       </Text>
       <Text style={{
        position: "absolute",
        top: 488,
        left: 222,
        fontSize: 9,
        color: "#5e5858",
       }}>
       White
       </Text>


        {/* right */}
        <Text style={{
        position: "absolute",
        top: 249,
        left: 473,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
        {candidate.salary} SAR
        </Text>
        <Text style={{
        position: "absolute",
        top: 265,
        left: 477,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
        2 Years
        </Text>
        <Text style={{
        position: "absolute",
        top: 322,
        left: 460,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
        {candidate.passportNo}
        </Text>
        <Text style={{
        position: "absolute",
        top: 343,
        left: 456,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
        {dateOfIssue}
        </Text>
        <Text style={{
        position: "absolute",
        top: 358,
        left: 456,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
        {dateOfExpiry}
        </Text>
        <Text style={{
        position: "absolute",
        top: 379,
        left: 456,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
        {candidate.passportIssuePlace}
        </Text>
        <Text style={{
        position: "absolute",
        top: 449,
        left: 465,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
        {candidate.languageEnglish}
        </Text>
        <Text style={{
        position: "absolute",
        top: 466,
        left: 465,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
        {candidate.languageArabic}
        </Text>
        <Text style={{
        position: "absolute",
        top: 483,
        left: 450,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
        Secondary
        </Text>

        {/* Middle Experience part */}
        <Text style={{
        position: "absolute",
        top: 580,
        left: 160 ,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
        {candidate.experiencePeriod}
        </Text>

        <Text style={{
        position: "absolute",
        top: 580,
        left: 295 ,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
        House Maid
        </Text>

        <Text style={{
        position: "absolute",
        top: 580,
        left: 485,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
       {candidate.experienceCountry}
        </Text>

        {/* SKILLS */}

         <Text style={{
        position: "absolute",
        top: 653,
        left: 312,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
       {skills.childrenCare}
        </Text>
         <Text style={{
        position: "absolute",
        top: 665,
        left: 312,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
       {skills.cleaning}
        </Text>

         <Text style={{
        position: "absolute",
        top: 678,
        left: 312,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
       {skills.washing}
        </Text>
         <Text style={{
        position: "absolute",
        top: 691,
        left: 312,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
       {skills.ironing}
        </Text>

         <Text style={{
        position: "absolute",
        top: 701,
        left: 312,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
       {skills.cooking}
        </Text>
         <Text style={{
        position: "absolute",
        top: 714,
        left: 312,  
        fontSize: 10,
        color: "#5e5858",
       }}>  
       {skills.sewing}
        </Text>
        
 {candidate.avatar && <Image src={candidate.avatar} style={styles.image} />}
   
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