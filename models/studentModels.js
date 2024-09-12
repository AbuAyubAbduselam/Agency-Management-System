import mongoose from "mongoose";
import surahs from "../utils/constant.js";

const StudentSchema = new mongoose.Schema(
  {
    firstName: String,
    middleName: String,
    lastName: String,

    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    qiratLevel: {
      type: String,
      enum: surahs.map((surah) => surah.value),
    },

    classes: {
      type: String,
      enum: ["1", "2", "3", "4"],
    },

    schoolName: String,
    address: String,

    parentName: String,
    parentPhoneNumber: String,
    avatar: String,

    idNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

StudentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    this.idNumber = `${randomNumber}/${this.classes}`;
  }
  next();
});

const Student =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);

export default Student;
