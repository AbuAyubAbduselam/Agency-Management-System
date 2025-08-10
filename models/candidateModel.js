import mongoose from "mongoose";
import { statusOptions } from "../client/src/utils/constants.js";

// Helper function to get only `value` items from statusOptions arrays
const enumValues = (key) => statusOptions[key]?.map(opt => opt.value) || [];

const CandidateSchema = new mongoose.Schema(
  {
    code: { type: String, default: "" },
    firstName: { type: String, default: "" },
    middleName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    dateOfBirth: { type: Date },

    gender: {
      type: String,
      enum: enumValues("gender"),
      default: "",
    },

    passportNo: { type: String, default: "" },
    phoneNo: { type: String, default: "" },
    narrativePhoneNo: { type: String, default: "" },
    laborId: { type: String, default: "" },

    religion: {
      type: String,
      enum: enumValues("religion"),
      default: "",
    },

    cvStatus: {
      type: String,
      enum: enumValues("cvStatus"),
      default: "",
    },

    cocStatus: {
      type: String,
      enum: enumValues("cocStatus"),
      default: "",
    },

    musanedStatus: {
      type: String,
      enum: enumValues("musanedStatus"),
      default: "",
    },

    passportStatus: {
      type: String,
      enum: enumValues("passportStatus"),
      default: "",
    },

    medicalStatus: {
      type: String,
      enum: enumValues("medicalStatus"),
      default: "",
    },

    medicalDate: { type: Date, default: "" },
    ticketDate: { type: Date, default: "" },
    tasheerDate: { type: Date, default: "" },

    availabilityStatus: {
      type: String,
      enum: enumValues("availabilityStatus"),
      default: "",
    },

    tasheer: {
      type: String,
      enum: enumValues("tasheer"),
      default: "",
    },

    wokala: {
      type: String,
      enum: enumValues("wokala"),
      default: "",
    },

    contractCreationDate: { type: Date, default: "" },

    lmis: {
      type: String,
      enum: enumValues("lmis"),
      default: "",
    },

    qrCode: {
      type: String,
      enum: enumValues("qrCode"),
      default: "",
    },

    ticket: {
      type: String,
      enum: enumValues("ticket"),
      default: "",
    },

    cvSentTo: {
      type: String,
      enum: enumValues("cvSentTo"),
      default: "",
    },

    selectedBy: {
      type: String,
      enum: enumValues("selectedBy"),
      default: "",
    },

    insideOffice: {
      type: String,
      enum: enumValues("insideOffice"),
      default: "",
    },

    visaStatus: {
      type: String,
      enum: enumValues("visaStatus"),
      default: "",
    },

    experienceOutside: { type: String, default: "" },

    spokenLanguages: { type: String, default: "" },
    narrative: { type: String, default: "" },
    children: Number,
    weight: { type: String, default: "" },
    height: { type: String, default: "" },
    age: Number,
    placeOfBirth: { type: String, default: "" },
    livingTown: { type: String, default: "" },

    maritalStatus: {
      type: String,
      enum: enumValues("maritalStatus"),
      default: "",
    },

    nationality: { type: String, default: "Ethiopia" },
    passportIssueDate: Date,
    passportExpiryDate: Date,
    passportIssuePlace: { type: String, default: "" },
    contractPeriod: { type: String, default: "2 years" },

    position: {
      type: String,
      enum: enumValues("position"),
      default: "",
    },

    salary: { type: String, default: "" },

    languageEnglish: {
      type: String,
      enum: enumValues("language"),
      default: "",
    },

    languageArabic: {
      type: String,
      enum: enumValues("language"),
      default: "",
    },

    experienceCountry: { type: String, default: "" },
    experiencePeriod: { type: String, default: "" },
    arrivalCity: { type: String, default: "" },

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
