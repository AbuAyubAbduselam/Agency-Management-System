import mongoose from "mongoose";
const CandidateSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    passportNo: String,
    phoneNo: String,
    narrativePhoneNo: String,
    laborId: String,

    religion: {
      type: String,
      enum: ["muslim", "non-muslim"],
      default: "muslim",
    },
    cvStatus: {
      type: String,
      enum: ["done", "waiting"],
      default: "waiting",
    },
    cocStatus: {
      type: String,
      enum: ["done","booked", "waiting"],
      default: "waiting",
    },
    musanedStatus: {
      type: String,
      enum: [ "waiting","done","pending-release"],
      default: "waiting",
    },
    medicalStatus: {
      type: String,
      enum: ["fit", "waiting","unfit","in progress"],
      default: "waiting",
    },
    medicalDate: {
      type: Date,
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "unavailable", "selected"],
      required: true,
      default: "available",
    },
    tasheer: {
      type: String,
      enum: ["waiting", "booked", "done"],
      required: true,
      default: "waiting",
    },
    wokala: {
      type: String,
      enum: ["waiting", "waiting tasdeeq","done"],
      default: "waiting",
    },
    contractCreationDate: {
      type: Date,
      default:Date.now,
    },
    lmis: {
      type: String,
      enum: ["draft", "pending", "issued", "rejected"],
      required: true,
      default: "draft",
    },
   
    ticket: {
      type: String,
      enum: ["waiting", "booked", "done"],
      required: true,
      default: "waiting",
    },
    cvSentTo: {
      type: String,
      enum: [" ","A", "B", "C"],
      required: true,
      default: " ",
    },
    selectedBy: {
      type: String,
      enum: [" ","A", "B", "C"],
      required: true,
      default: " ",
    },
    visaStatus: {
      type: String,
      enum: [" ","ready for embassy", "sent to embassy", "visa issued","visa canceled","arrived ksa"],
      required: true,
      default: " ",
    },

    experienceOutside: {
      type:String,
      default: " ",
    },

    avatar: String,
    fullSizePhoto: String,
  },
  { timestamps: true }
);

const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);

export default Candidate;
