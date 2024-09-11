import { StatusCodes } from "http-status-codes";
import StudentAttendance from "../models/StudentAttendanceModel.js";
import dayjs from "dayjs";
import TeacherAttendance from "../models/TeacherAttendanceModel.js";

export const getAttendanceByDate = async (req, res) => {
  try {
    const { date, classes } = req.query;
    console.log(classes);
    const queryObject = {};

    const isDateFound = await StudentAttendance.find({
      date: new Date(date),
    });

    if (!isDateFound) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this date." });
    }

    if (isDateFound) {
      queryObject.date = date;
    }
    if (classes && classes !== "all") {
      queryObject.classes = classes;
    }
    const attendanceRecords = await StudentAttendance.find(queryObject);
    console.log(attendanceRecords);

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const createAttendance = async (req, res) => {
  try {
    const currentDate = dayjs().format("YYYY-MM-DD");
    const attendanceData = req.body;
    const { idNumber } = attendanceData;

    const existingAttendance = await StudentAttendance.findOne({
      idNumber: idNumber,
      date: currentDate,
    });

    let Attendance1;
    if (existingAttendance) {
      existingAttendance.set(attendanceData);
      Attendance1 = await existingAttendance.save();
    } else {
      Attendance1 = await StudentAttendance.create({
        ...attendanceData,
        idNumber,
        date: currentDate,
      });
    }
    console.log(Attendance1);

    res.status(StatusCodes.CREATED).json({ Attendance1 });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
export const getTeacherAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    console.log(date);

    const query = date ? { date: new Date(date) } : {};

    const teacherAttendance = await TeacherAttendance.find(query);

    res.status(StatusCodes.OK).json({ teacherAttendance });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

export const createTeacherAttendance = async (req, res) => {
  try {
    // Get current date without time
    const currentDate = dayjs().startOf("day").toDate();

    const attendanceData = req.body;
    const { teacherID } = attendanceData;

    // Find if the attendance already exists for this teacher on the current date
    const existingAttendance = await TeacherAttendance.findOne({
      teacherID: teacherID,
      date: currentDate,
    });

    let Attendance1;
    if (existingAttendance) {
      // Update existing record
      existingAttendance.set(attendanceData);
      Attendance1 = await existingAttendance.save();
    } else {
      // Create a new attendance record
      Attendance1 = await TeacherAttendance.create({
        ...attendanceData,
        teacherID,
        date: currentDate,
      });
    }

    res.status(StatusCodes.CREATED).json({ Attendance1 });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
