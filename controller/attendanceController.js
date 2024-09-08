import { StatusCodes } from "http-status-codes";
import StudentAttendance from "../models/StudentAttendanceModel.js";
import dayjs from "dayjs";
import TeacherAttendance from "../models/TeacherAttendanceModel.js";

export const getAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    console.log(date);

    const query = date ? { date: new Date(date) } : {};

    const studentAttendance = await StudentAttendance.find(query);

    res.status(StatusCodes.OK).json({ studentAttendance });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};
export const createAttendance = async (req, res) => {
  try {
    const currentDate = dayjs().format("YYYY-MM-DD");
    const attendanceData = req.body;
    const { idNumber } = attendanceData;
    console.log(req.body);

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
        attendanceData,
        idNumber,
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
