import mongoose from "mongoose";

const StudentAttendanceSchema = new mongoose.Schema(
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

    idNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

const StudentAttendance =
  mongoose.models.StudentAttendance ||
  mongoose.model("StudentAttendance", StudentAttendanceSchema);

export default StudentAttendance;
