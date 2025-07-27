import Candidate from "../models/candidateModel.js";
import CandidateAttendance from "../models/CandidateAttendanceModel.js";
import { StatusCodes } from "http-status-codes";

export const numOfCandidates = async (req, res) => {
  try {
    // Get total number of candidates
    const numOfAllCandidate = await Candidate.countDocuments({});

    // Get number of male and female candidates
    
    const numOfMaleCandidates = await Candidate.countDocuments({ gender: "male" });
    const numOfFemaleCandidates = await Candidate.countDocuments({
      gender: "female",
    });

    // Get number of candidates in each class
    const numOfClass1 = await Candidate.countDocuments({ classes: "1" });
    const numOfClass2 = await Candidate.countDocuments({ classes: "2" });
    const numOfClass3 = await Candidate.countDocuments({ classes: "3" });
    const numOfClass4 = await Candidate.countDocuments({ classes: "4" });

    // Return the data in the response
    return res.status(StatusCodes.OK).json({
      totalCandidates: numOfAllCandidate,
      maleCandidates: numOfMaleCandidates,
      femaleCandidates:numOfFemaleCandidates,
      
      classBreakdown: {
        1: numOfClass1,
        2: numOfClass2,
        3: numOfClass3,
        4: numOfClass4,
      },
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error });
  }
};

export const attendanceStats = async (req, res) => {
  try {
    const { year, month } = req.query;

    const selectedYear = year ? parseInt(year) : new Date().getFullYear();
    const selectedMonth = month ? parseInt(month) - 1 : new Date().getMonth(); // Month is 0-indexed in JS

    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    const attendanceData = await CandidateAttendance.aggregate([
      {
        $match: {
          date: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: {
            class: "$classes",
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.class",
          stats: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // Format the results to show per class with statuses
    const formattedAttendance = attendanceData.map((classData) => {
      const classInfo = {
        class: classData._id,
        stats: {
          Present: 0,
          Absent: 0,
          Late: 0,
        },
      };

      // Update the status counts (Present, Absent, Late)
      classData.stats.forEach((stat) => {
        classInfo.stats[stat.status] = stat.count;
      });

      return classInfo;
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: formattedAttendance,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch attendance stats.",
    });
  }
};
