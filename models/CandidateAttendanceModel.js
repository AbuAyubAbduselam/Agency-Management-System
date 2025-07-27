import mongoose from "mongoose";

const CandidateAttendanceSchema = new mongoose.Schema(
  {
    firstName: String,
    middleName: String,
    status: {
      type: String,
      enum: ["Absent", "Present", "Late"],
    },
    classes: {
      type: String,
      enum: ["1", "2", "3", "4"],
    },

    date: Date,

    
  },
  { timestamps: true }
);

const CandidateAttendance =
  mongoose.models.CandidateAttendance ||
  mongoose.model("CandidateAttendance", CandidateAttendanceSchema);

export default CandidateAttendance;
