import Teacher from "../models/TeachersModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";
import fs from "fs/promises";

//===============GET ALL Teachers==================//
export const getAllTeachers = async (req, res) => {
  console.log(44444444444444);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const teachers = await Teacher.find({})

      .skip(skip)
      .limit(limit);
    const totalTeachers = await Teacher.countDocuments({});
    const numOfPages = Math.ceil(totalTeachers / limit);

    res
      .status(StatusCodes.OK)
      .json({ totalTeachers, numOfPages, currentPage: page, teachers });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching teachers" });
  }
};

//==============CREATE CANDIDATE====================//

export const createTeacher = async (req, res) => {
  try {
    const candidateDetail = { ...req.body };

    const teacher = await Teacher.create(candidateDetail);
    res.status(StatusCodes.CREATED).json({ teacher });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Failed to create teacher" });
  }
};

//=============GET SINGLE CANDIDATE================
export const getSingleTeacher = async (req, res) => {
  console.log(11111111);
  const { id } = req.params;

  try {
    const teacher = await Teacher.findOne({ _id: id });

    if (!teacher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "teacher not found" });
    }

    res.status(StatusCodes.OK).json({ teacher });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching teacher" });
  }
};

//---------------UPDATE CANDIDATES
export const updateTeacher = async (req, res) => {
  console.log(33333333, req.body);
  const { id } = req.params;

  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTeacher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "teacher not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: "Teacher is modified", teacher: updatedTeacher });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error updating teacher" });
  }
};

//-----------------DELETE CANDIDATE
export const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const removedTeacher = await Teacher.findByIdAndDelete(id);

    if (!removedTeacher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Teacher not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: "Teacher is deleted", teacher: removedTeacher });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error deleting teacher" });
  }
};

export const showStats = async (req, res) => {
  try {
    let stats = await Candidate.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
      { $group: { _id: "$candidateStatus", count: { $sum: 1 } } },
    ]);

    stats = stats.reduce((acc, curr) => {
      const { _id: title, count } = curr;
      acc[title] = count;
      return acc;
    }, {});

    const defaultStats = {
      pending: stats.pending || 0,
      interview: stats.interview || 0,
      declined: stats.declined || 0,
    };

    let monthlyApplications = await Candidates.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);
    monthlyApplications = monthlyApplications
      .map((item) => {
        const {
          _id: { year, month },
          count,
        } = item;

        const date = day()
          .month(month - 1)
          .year(year)
          .format("MMM YY");
        return { date, count };
      })
      .reverse();

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching statistics" });
  }
};
