import day from "dayjs";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import noto from "../../assets/fonts/Cairo-Regular.ttf";
import notoBold from "../../assets/fonts/Cairo-Bold.ttf";
import sanad from "../../assets/images/sanad.png"
import tick from "../../assets/images/tick.png"
import untick from "../../assets/images/untick.png"
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
    top: 155,
    left: 73,
    width: 120,
    height: 125,
    objectFit: "cover",
  },
   image2: {
    position: "absolute",
    top: 325,
    left: 73,
    width: 120,
    height: 250,
    objectFit: "cover",
  },
   passImage: {
    position: "absolute",
    top: 300,
    left: 365,
    width: 100,
    height: 270,
    objectFit: "contain",
  },
});

// 🔷 Main Page Component
export const SanadCv = ({ candidate }) => {
  const age = day().diff(day(candidate.dateOfBirth), "year");
  const dateOfBirth = day(candidate.dateOfBirth).format("DD/MMM/YYYY");
  const dateOfExpiry = day(candidate.passportExpiryDate).format("DD/MMM/YYYY");
  const dateOfIssue = day(candidate.passportIssueDate).format("DD/MMM/YYYY");
  const presentDate = day().format("DD/MM/YYYY");


  const skills = candidate.skills instanceof Map 
  ? Object.fromEntries(candidate.skills) 
  : candidate.skills || {};

  console.log(skills.cooking)

  return (
    <>
      <Page size={{ width: 640, height: 890 }} style={styles.page}>

        <Image
    src={sanad}
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
        top: 210,
        left: 245,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {presentDate}
       </Text>

       <Text style={{
        position: "absolute",
        top: 210,
        left: 380,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.code}
       </Text>

       <Text style={{
        position: "absolute",
        top: 210,
        left: 505,
        fontSize: 8,
        color: "#5b5454",
       }}>
       FIRST TIME
       </Text>

        <Text style={{
        position: "absolute",
        top: 225,
        left: 370,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.position}
       </Text>

        <Text style={{
        position: "absolute",
        top: 238,
        left: 372,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.salary} SAR
       </Text>

        <Text style={{
        position: "absolute",
        top: 277,
        left: 346,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {`${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`}
       </Text>

        <Text style={{
        position: "absolute",
        top: 292,
        left: 362,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.livingTown}
       </Text>

        <Text style={{
        position: "absolute",
        top: 305,
        left: 371,
        fontSize: 8,
        color: "#5b5454",
       }}>
       Ethiopia
       </Text>

        <Text style={{
        position: "absolute",
        top: 320,
        left: 373,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.gender}
       </Text>

        <Text style={{
        position: "absolute",
        top: 335,
        left: 375,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {age} yrs
       </Text>

        <Text style={{
        position: "absolute",
        top: 350,
        left: 364,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {dateOfBirth}
       </Text>

        <Text style={{
        position: "absolute",
        top: 363,
        left: 370,
        fontSize: 8,
        color: "#5b5454",
       }}>
       Secondary
       </Text>

        <Text style={{
        position: "absolute",
        top: 377,
        left: 373,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.religion}
       </Text>

        <Text style={{
        position: "absolute",
        top: 392,
        left: 375,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.maritalStatus}
       </Text>

        <Text style={{
        position: "absolute",
        top: 407,
        left: 382,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.children} 
       </Text>

        <Text style={{
        position: "absolute",
        top: 420,
        left: 374,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.height}
       </Text>

        <Text style={{
        position: "absolute",
        top: 434,
        left: 378,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.weight}
       </Text>

        <Text style={{
        position: "absolute",
        top: 448,
        left: 378,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.languageArabic}
       </Text>

        <Text style={{
        position: "absolute",
        top: 462,
        left: 378,
        fontSize: 8,
        color: "#5b5454",
       }}>
       {candidate.languageEnglish}
       </Text>
     <Image
  src={tick}
  style={{
    position: "absolute",
    top: 660,
    left: 241,
    width: 25,
    height: 25,
  }}
/>
     <Image
  src={tick}
  style={{
    position: "absolute",
    top: 660,
    left: 111,
    width: 25,
    height: 25,
  }}
/>
{
  skills.elderCare === "yes" ? <Image
  src={tick}
  style={{
    position: "absolute",
    top: 660,
    left: 372,
    width: 25,
    height: 25,
  }}
/> : <Image
  src={untick}
  style={{
    position: "absolute",
    top: 660,
    left: 372,
    width: 25,
    height: 25,
  }}
/>
}
{
  skills.specialNeed === "yes" ? <Image
  src={tick}
  style={{
    position: "absolute",
    top: 660,
    left: 503,
    width: 25,
    height: 25,
  }}
/> : <Image
  src={untick}
  style={{
    position: "absolute",
    top: 660,
    left: 503,
    width: 25,
    height: 25,
  }}
/>
}
{
  skills.cooking === "yes" ? <Image
  src={tick}
  style={{
    position: "absolute",
    top: 776,
    left: 202,
    width: 25,
    height: 25,
  }}
/> : <Image
  src={untick}
  style={{
    position: "absolute",
    top: 776,
    left: 202,
    width: 25,
    height: 25,
  }}
/>
}


     <Image
  src={untick}
  style={{
    position: "absolute",
    top: 776,
    left: 513,
    width: 25,
    height: 25,
  }}
/>
     <Image
  src={tick}
  style={{
    position: "absolute",
    top: 776,
    left: 97,
    width: 25,
    height: 25,
  }}
/>
     <Image
  src={tick}
  style={{
    position: "absolute",
    top: 776,
    left: 306.5,
    width: 25,
    height: 25,
  }}
/>
     <Image
  src={tick}
  style={{
    position: "absolute",
    top: 776,
    left: 410,
    width: 25,
    height: 25,
  }}
/>


        
       
      
        
 {candidate.avatar && <Image src={candidate.avatar} style={styles.image} />}
 {candidate.fullSizePhoto && <Image src={candidate.fullSizePhoto} style={styles.image2} />}

   
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