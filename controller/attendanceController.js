import Candidate from "../models/candidateModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";
import cloudinary from "cloudinary";
import fs from "fs/promises"; // Use fs/promises for async/await

//===============GET ALL CANDIDATE==================//
export const getAllSelectedCandidates = async (req, res) => {
  const { search, sort, gender,visaStatus,ticket,wokala,selectedBy,medicalStatus,tasheer,cocStatus,lmis,insideOffice } = req.query;

  const queryObject = { availabilityStatus: 'selected' };

  if (search) {
    queryObject.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { middleName: { $regex: search, $options: "i" } },
    ];
  }
  if (visaStatus && visaStatus !== "Visa Status") {
    queryObject.visaStatus = visaStatus;
  }
  if (insideOffice && insideOffice !== "Office Inside") {
    queryObject.insideOffice = insideOffice;
  }
  if (ticket && ticket !== "Ticket") {  
    queryObject.ticket = ticket;
  }
  if (wokala && wokala !== "Wokala") {
    queryObject.wokala = wokala;
  }
  if (selectedBy && selectedBy !== "Selected By") {
    queryObject.selectedBy = selectedBy;
  }
  if (medicalStatus && medicalStatus !== "Medical Status") {
    queryObject.medicalStatus = medicalStatus;
  }
  if (tasheer && tasheer !== "Tasheer") {
    queryObject.tasheer = tasheer;
  }
  if (cocStatus && cocStatus !== "CoC Status") {
    queryObject.cocStatus = cocStatus;
  }
  if (lmis && lmis !== "LMIS") {
    queryObject.lmis = lmis;
  }
  if (gender && gender !== "Gender") {
    queryObject.gender = gender;
  }

  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const selectedCandidates = await Candidate.find(queryObject)
      .sort(sortKey)
      .skip(skip)
      .limit(limit);
    const totalSelectedCandidates = await Candidate.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalSelectedCandidates / limit);

    res
      .status(StatusCodes.OK)
      .json({ totalSelectedCandidates, numOfPages, currentPage: page, selectedCandidates });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching candidates" });
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
