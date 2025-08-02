import day from "dayjs";

const CandidateCV = ({ candidate }) => {
  return (
    <div
      id={`cv-${candidate._id}`}
      style={{
        padding: "32px",
        width: "794px",
        height: "1123px",
        backgroundColor: "#ffffff",
        color: "#000000",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "24px",
          color: "#1D4ED8", // blue-700
        }}
      >
        KERNTINA FOREIGN EMPLOYMENT AGENT PLC
      </h2>

      <div
        style={{
          display: "flex",
          gap: "24px",
        }}
      >
        <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "8px" }}>
          <p><strong>Full Name:</strong> {candidate.firstName} {candidate.middleName}</p>
          <p><strong>Gender:</strong> {candidate.gender}</p>
          <p><strong>Age:</strong> {day().diff(day(candidate.dateOfBirth), "year")}</p>
          <p><strong>Passport No:</strong> {candidate.passportNo}</p>
          <p><strong>Phone No:</strong> {candidate.phoneNo}</p>
          <p><strong>Narrative Phone:</strong> {candidate.narrativePhoneNo}</p>
          <p><strong>Religion:</strong> {candidate.religion}</p>
          <p><strong>Labor ID:</strong> {candidate.laborId}</p>
          <p><strong>CV Status:</strong> {candidate.cvStatus}</p>
          <p><strong>CV Sent To:</strong> {candidate.cvSentTo}</p>
          <p><strong>COC Status:</strong> {candidate.cocStatus}</p>
          <p><strong>Musaned Status:</strong> {candidate.musanedStatus}</p>
          <p><strong>Medical Status:</strong> {candidate.medicalStatus}</p>
          <p><strong>Medical Days:</strong> {candidate.medicalDays}</p>
          <p><strong>Experience Outside:</strong> {candidate.experienceOutside}</p>
          <p><strong>Availability:</strong> {candidate.availabilityStatus}</p>
        </div>
        <div style={{ width: "50%" }}>
          <img
            src={candidate.fullSizePhoto}
            alt="Candidate"
            style={{
              width: "180px",
              height: "250px",
              objectFit: "cover",
              border: "2px solid #D1D5DB", // gray-300
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateCV;
