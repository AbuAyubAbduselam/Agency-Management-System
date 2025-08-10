import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    code: { type: String, default: "" },
    firstName: { type: String, default: "" },
    middleName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    dateOfBirth: { type: Date },

    gender: {
      type: String,
      enum: ["", "male", "female"],
      default: "",
    },

    passportNo: { type: String, default: "" },
    phoneNo: { type: String, default: "" },
    narrativePhoneNo: { type: String, default: "" },
    laborId: { type: String, default: "" },

    religion: {
      type: String,
      enum: ["", "muslim", "non-muslim"],
      default: "",
    },

    cvStatus: {
      type: String,
      enum: ["", "done", "waiting"],
      default: "",
    },

    cocStatus: {
      type: String,
      enum: ["", "done", "booked", "waiting"],
      default: "",
    },

    musanedStatus: {
      type: String,
      enum: ["", "waiting", "done", "pending-release"],
      default: "",
    },
    passportStatus: {
      type: String,
      enum: ["", "original", "scan"],
      default: "",
    },

    medicalStatus: {
      type: String,
      enum: ["", "fit", "waiting", "unfit", "in progress", "booked"],
      default: "",
    },

    
    medicalDate: {
      type: Date,
      default: () => new Date(),
    },
    ticketDate: {
      type: Date,
      default: () => new Date(),
    },
    tasheerDate: {
      type: Date,
      default: () => new Date(),
    },

    availabilityStatus: {
      type: String,
      enum: ["", "available", "unavailable", "selected"],
      default: "",
    },

    tasheer: {
      type: String,
      enum: ["", "waiting", "booked", "done"],
      default: "",
    },

    wokala: {
      type: String,
      enum: ["", "waiting", "waiting tasdeeq", "done"],
      default: "",
    },

    contractCreationDate: {
      type: Date,
      default: Date.now,
    },

    lmis: {
      type: String,
      enum: ["", "draft", "pending", "issued", "rejected"],
      default: "",
    },

    ticket: {
      type: String,
      enum: ["", "waiting", "booked", "done"],
      default: "",
    },

    cvSentTo: {
      type: String,
      enum: ["", "SARAYA AL-RIYADH RECRUITMENT", "QUICK TICKET FOR RECRUITMENT"],
      default: "",
    },

    selectedBy: {
      type: String,
      enum: ["", "SARAYA AL-RIYADH RECRUITMENT", "QUICK TICKET FOR RECRUITMENT"],
      default: "",
    },

    visaStatus: {
      type: String,
      enum: [
        "",
        "ready for embassy",
        "sent to embassy",
        "visa issued",
        "visa canceled",
        "arrived ksa",
      ],
      default: "",
    },

    experienceOutside: { type: String, default: "" },

    spokenLanguages: { type: String, default: "" },
    code: { type: String, default: "" },
    narrative: { type: String, default: "" },
    children: Number,
    weight: { type: String, default: "" },
    height: { type: String, default: "" },
    age: Number,
    placeOfBirth: { type: String, default: "" },
    livingTown: { type: String, default: "" },

    maritalStatus: {
      type: String,
      enum: ["", "single", "married", "divorced", "widowed"],
      default: "",
    },

    nationality: { type: String, default: "Ethiopia" },
    passportIssueDate: Date,
    passportExpiryDate: Date,
    passportIssuePlace: { type: String, default: "" },
    contractPeriod: { type: String, default: "2 years" },
    position: { type: String, default: "" },
    salary: { type: String, default: "" }, 

    languageEnglish: { 
      type: String,
      enum: ["","veryGood", "good", "poor"],
      default: "",
    },

    languageArabic: {
      type: String,
      enum: ["", "veryGood", "good","poor"],
      default: "",
    },

    experienceCountry: { type: String, default: "" },
    experiencePeriod: { type: String, default: "" },
    remark: { type: String, default: "" },
    skills: {
  type: Map,
  of: {
    type: String,
    enum: ["", "yes", "no"],
    default: "",
  },
  default: {},
},


    avatar: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    },

    fullSizePhoto: { type: String, default: "" },
    passportScan: { type: String, default: "" },
  },
  { timestamps: true }
);

const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);

export default Candidate;
