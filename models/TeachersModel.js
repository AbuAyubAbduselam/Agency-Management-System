import mongoose from "mongoose";

const TeachersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    classAssigned: {
      type: [String], // Array of strings for multi-select
      required: true,
    },
    teacherID: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to generate a 2-digit teacherID
TeachersSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate a 2-digit random number between 10 and 99
    const randomNumber = Math.floor(10 + Math.random() * 90);
    // Assign the 2-digit number to the teacherID field
    this.teacherID = `${randomNumber}`;
  }
  next();
});

// Avoid OverwriteModelError by checking if the model is already compiled
const Teacher =
  mongoose.models.Teacher || mongoose.model("Teacher", TeachersSchema);

export default Teacher;
