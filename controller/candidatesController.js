import Candidate from "../models/candidateModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";
import cloudinary from "cloudinary";
import fs from "fs/promises"; // Use fs/promises for async/await

//===============GET ALL CANDIDATES==================//
export const getAllCandidates = async (req, res) => {
  const { search, sort, medicalStatus, gender, religion, cvStatus, cocStatus, musanedStatus, availabilityStatus, cvSentTo } = req.query;

  const queryObject = {};

  if (search) {
    queryObject.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { middleName: { $regex: search, $options: "i" } },
    ];
  }

  if (medicalStatus && medicalStatus !== "Medical Status") {
    queryObject.medicalStatus = medicalStatus;
  }
  if (cvStatus && cvStatus !== "CV Status") {
    queryObject.cvStatus = cvStatus;
  }
  if (cocStatus && cocStatus !== "CoC Status") {
    queryObject.cocStatus = cocStatus;
  }
  if (musanedStatus && musanedStatus !== "Musaned Status") {
    queryObject.musanedStatus = musanedStatus;
  }
  if (availabilityStatus && availabilityStatus !== "Availability Status") {
    queryObject.availabilityStatus = availabilityStatus;
  }
  if (cvSentTo && cvSentTo !== "CV Sent To") {
    queryObject.cvSentTo = cvSentTo;
  }
  if (religion && religion !== "Religion") {
    queryObject.religion = religion;
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
    const candidates = await Candidate.find(queryObject)
      .sort(sortKey)
      .skip(skip)
      .limit(limit);
    const totalCandidates = await Candidate.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalCandidates / limit);

    res
      .status(StatusCodes.OK)
      .json({ totalCandidates, numOfPages, currentPage: page, candidates });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching candidates" });
  }
};

//===============GET CHECKED CANDIDATES==================//
export const getCheckedCandidates = async (req, res) => {
  const ids = req.query.ids?.split(",") || [];

  try {
    const candidates = await Candidate.find({ _id: { $in: ids } });
    res.status(StatusCodes.OK).json({ candidates });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching selected candidates" });
  }
};

//==============CREATE CANDIDATE====================//

export const createCandidate = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;
    const candidateDetail = { ...req.body };

    // Handle avatar upload
    if (req.files?.avatar) {
      const avatarFile = req.files.avatar;
      const response = await cloudinary.v2.uploader.upload(avatarFile.tempFilePath, {
        folder: 'avatars',
      });
      await fs.unlink(avatarFile.tempFilePath);

      candidateDetail.avatar = response.secure_url;
      candidateDetail.avatarPublicId = response.public_id;
    }

    // Handle fullSizePhoto upload
    if (req.files?.fullSizePhoto) {
      const fullPhotoFile = req.files.fullSizePhoto;
      const response = await cloudinary.v2.uploader.upload(fullPhotoFile.tempFilePath, {
        folder: 'fullSizePhotos',
      });
      await fs.unlink(fullPhotoFile.tempFilePath);

      candidateDetail.fullSizePhoto = response.secure_url;
      candidateDetail.fullSizePhotoPublicId = response.public_id;
    }

    const candidate = await Candidate.create(candidateDetail);
    res.status(StatusCodes.CREATED).json({ candidate });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to create candidate",
    });
  }
};


//=============GET SINGLE CANDIDATE================
export const getSingleCandidate = async (req, res) => {
  const { id } = req.params;

  try {
    const candidate = await Candidate.findOne({ _id: id });

    if (!candidate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Candidate not found" });
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


export const updateCandidate = async (req, res) => {
  const { id } = req.params;

  try {
    // Upload avatar if provided
    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar;
      const avatarRes = await cloudinary.v2.uploader.upload(avatarFile.tempFilePath, {
        folder: "avatars",
      });
      await fs.unlink(avatarFile.tempFilePath);
      req.body.avatar = avatarRes.secure_url;
      req.body.avatarPublicId = avatarRes.public_id;
    }

    // Upload fullSizePhoto if provided
    if (req.files && req.files.fullSizePhoto) {
      const fullPhotoFile = req.files.fullSizePhoto;
      const fullPhotoRes = await cloudinary.v2.uploader.upload(fullPhotoFile.tempFilePath, {
        folder: "fullsize-photos",
      });
      await fs.unlink(fullPhotoFile.tempFilePath);
      req.body.fullSizePhoto = fullPhotoRes.secure_url;
      req.body.fullSizePhotoPublicId = fullPhotoRes.public_id;
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCandidate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Candidate not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: "Candidate is modified", candidate: updatedCandidate });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error updating candidate" });
  }
};


//-----------------DELETE CANDIDATE
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
