import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
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

    medicalStatus: {
      type: String,
      enum: ["", "fit", "waiting", "unfit", "in progress", "booked"],
      default: "",
    },

    medicalDate: Date,
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
      enum: ["", "A", "B", "C"],
      default: "",
    },

    selectedBy: {
      type: String,
      enum: ["", "A", "B", "C"],
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
    nextOfKin: { type: String, default: "" },
    kinPhone: { type: String, default: "" },
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

    nationality: { type: String, default: "" },
    passportIssueDate: Date,
    passportExpiryDate: Date,
    passportIssuePlace: { type: String, default: "" },
    contractPeriod: { type: String, default: "" },
    position: { type: String, default: "" },
    salary: { type: String, default: "" },

    languageEnglish: {
      type: String,
      enum: ["", "yes", "no"],
      default: "",
    },

    languageArabic: {
      type: String,
      enum: ["", "yes", "no"],
      default: "",
    },

    experienceCountry: { type: String, default: "" },
    experiencePeriod: { type: String, default: "" },
    remark: { type: String, default: "" },
    skills: { type: [String], default: [] },

    avatar: {
      type: String,
      default:
        "https://ui-avatars.com/api/?name=User&background=ccc&color=555",
    },

    fullSizePhoto: { type: String, default: "" },
    passportScan: { type: String, default: "" },
  },
  { timestamps: true }
);

const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);

export default Candidate;
