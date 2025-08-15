import Candidate from "../models/candidateModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";
import cloudinary from "cloudinary";
import fs from "fs/promises"; // Use fs/promises for async/await

//===============GET ALL CANDIDATE==================//
export const getAllSelectedCandidates = async (req, res) => {
  try {
    const {
      search,
      sort,
      page = 1,
      limit = 20,
      ids, // ✅ now supports CSV string from frontend
      startDate,
      endDate,
      tasheerStart,
      tasheerEnd,
      ticketStart,
      ticketEnd,
      ...filters
    } = req.query;

    const queryObject = { availabilityStatus: "Selected" };

    // ✅ If ids are provided, fetch only those
    if (ids) {
      const idsArray = Array.isArray(ids) ? ids : ids.split(",");
      queryObject._id = { $in: idsArray };
    }

    if (search) {
      queryObject.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { middleName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { passportNo: { $regex: search, $options: "i" } },
      ];
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "All" && value !== key) {
        const valuesArray = Array.isArray(value) ? value : String(value).split(",");
        queryObject[key] = { $in: valuesArray };
      }
    });

    const addDateRange = (field, start, end) => {
      if (start || end) {
        queryObject[field] = {};
        if (start) queryObject[field].$gte = new Date(start);
        if (end) queryObject[field].$lte = new Date(end);
      }
    };

    addDateRange("contractDate", startDate, endDate);
    addDateRange("tasheerDate", tasheerStart, tasheerEnd);
    addDateRange("ticketDate", ticketStart, ticketEnd);

    const sortOptions = {
      newest: "-createdAt",
      oldest: "createdAt",
      "a-z": "position",
      "z-a": "-position",
    };
    const sortKey = sortOptions[sort] || sortOptions.newest;

    const skip = (Number(page) - 1) * Number(limit);

    let candidatesQuery = Candidate.find(queryObject).sort(sortKey);

    // ✅ If ids are given, ignore pagination
    if (!ids) {
      candidatesQuery = candidatesQuery.skip(skip).limit(Number(limit));
    }

    const selectedCandidates = await candidatesQuery;
    const totalSelectedCandidates = await Candidate.countDocuments(queryObject);
    const numOfPages = ids ? 1 : Math.ceil(totalSelectedCandidates / Number(limit));

    res.status(200).json({
      totalSelectedCandidates,
      numOfPages,
      currentPage: Number(page),
      selectedCandidates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching candidates" });
  }
};






//==============CREATE CANDIDATE====================//



//=============GET SINGLE SELECTED CANDIDATE================
export const getSingleSelectedCandidate = async (req, res) => {
  const { id } = req.params;

  try {
    const candidate = await Candidate.findOne({ _id: id });

    if (!candidate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "candidate not found" });
    }

    res.status(StatusCodes.OK).json({ candidate });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching candidate" });
  }
};

//---------------UPDATE CANDIDATE
export const updateSelectedCandidate = async (req, res) => {
  console.log(33333333, req.body);
  const { id } = req.params;

  try {
    const updatedSelectedCandidate = await Candidate.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSelectedCandidate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "candidate not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: "Candidate is modified", candidate: updatedSelectedCandidate });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error updating candidate" });
  }
};

//-----------------DELETE cANDIDATE
export const deleteCandidate = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const removedCandidate = await Candidate.findByIdAndDelete(id);

    if (!removedCandidate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Candidate not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: "Candidate is deleted", candidate: removedCandidate });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error deleting candidate" });
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

    let monthlyApplications = await Candidate.aggregate([
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
