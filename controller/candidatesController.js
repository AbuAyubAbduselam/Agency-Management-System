import Candidate from "../models/candidateModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";
import cloudinary from "cloudinary";
import fs from "fs/promises"; // Use fs/promises for async/await

//===============GET ALL CANDIDATES==================//
export const getAllCandidates = async (req, res) => {
  const {
    search,
    sort,
    page = 1,
    limit = 20,
    ids, // ✅ new param
    ...filters
  } = req.query;

  const queryObject = {};

  // ✅ If ids are provided, filter only those candidates
  if (ids) {
    queryObject._id = { $in: ids.split(",") };
  }

  // Search
  if (search) {
    queryObject.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { middleName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { passportNo: { $regex: search, $options: "i" } },
    ];
  }

  // Allowed filters
  const filterKeys = [
    "medicalStatus",
    "cvStatus",
    "cocStatus",
    "musanedStatus",
    "availabilityStatus",
    "cvSentTo",
    "religion",
    "gender",
  ];

  // Handle multi-select arrays
  filterKeys.forEach((key) => {
    if (filters[key] && filters[key] !== "") {
      const valuesArray = Array.isArray(filters[key])
        ? filters[key]
        : String(filters[key]).split(",");
      if (valuesArray.length > 0) {
        queryObject[key] = { $in: valuesArray };
      }
    }
  });

  // Sorting
  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };
  const sortKey = sortOptions[sort] || sortOptions.newest;

  const skip = (Number(page) - 1) * Number(limit);

  try {
    // ✅ If ids are given, ignore pagination
    const candidatesQuery = Candidate.find(queryObject).sort(sortKey);
    if (!ids) {
      candidatesQuery.skip(skip).limit(Number(limit));
    }

    const candidates = await candidatesQuery;
    const totalCandidates = await Candidate.countDocuments(queryObject);
    const numOfPages = ids ? 1 : Math.ceil(totalCandidates / Number(limit));

    res.status(200).json({
      totalCandidates,
      numOfPages,
      currentPage: Number(page),
      candidates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching candidates" });
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

    // ✅ Parse skills if sent as JSON string
    if (req.body.skills) {
      try {
        req.body.skills = JSON.parse(req.body.skills);
      } catch (err) {
        console.error("Error parsing skills:", err);
        req.body.skills = {};
      }
    }

    // ✅ Parse experiences if sent as JSON string
    if (req.body.experiences) {
      try {
        req.body.experiences = JSON.parse(req.body.experiences);
      } catch (err) {
        console.error("Error parsing experiences:", err);
        req.body.experiences = [];
      }
    }

    const candidateDetail = { ...req.body };

    // ✅ Handle avatar upload
    if (req.files?.avatar) {
      const avatarFile = req.files.avatar;
      const response = await cloudinary.v2.uploader.upload(avatarFile.tempFilePath, {
        folder: "avatars",
      });
      await fs.unlink(avatarFile.tempFilePath);

      candidateDetail.avatar = response.secure_url.replace("/upload/", "/upload/q_auto:best/");
      candidateDetail.avatarPublicId = response.public_id;
    }

    // ✅ Handle fullSizePhoto upload
    if (req.files?.fullSizePhoto) {
      const fullPhotoFile = req.files.fullSizePhoto;
      const response = await cloudinary.v2.uploader.upload(fullPhotoFile.tempFilePath, {
        folder: "fullSizePhotos",
      });
      await fs.unlink(fullPhotoFile.tempFilePath);

      candidateDetail.fullSizePhoto = response.secure_url.replace("/upload/", "/upload/q_auto:best/");
      candidateDetail.fullSizePhotoPublicId = response.public_id;
    }

    // ✅ Handle passportScan upload
    if (req.files?.passportScan) {
      const passportScanFile = req.files.passportScan;
      const response = await cloudinary.v2.uploader.upload(passportScanFile.tempFilePath, {
        folder: "passportScans",
        resource_type: "auto", // Supports images and PDFs
      });
      await fs.unlink(passportScanFile.tempFilePath);

      candidateDetail.passportScan = response.secure_url.replace("/upload/", "/upload/q_auto:best/");
      candidateDetail.passportScanPublicId = response.public_id;
    }

    // ✅ Create candidate
    const candidate = await Candidate.create(candidateDetail);
    res.status(StatusCodes.CREATED).json({ candidate });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to create candidate",
    });
  }
};



export const updateCandidate = async (req, res) => {
  const { id } = req.params;
  console.log(req.body.skills)

  try {
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Candidate not found" });
    }

    // ✅ Handle skills if sent as an object (FormData key/values)
  if (req.body.skills) {
  req.body.skills = JSON.parse(req.body.skills);

  // ✅ Convert Mongoose Map (or any doc property) to plain object
  const existingSkills = candidate.skills instanceof Map
    ? Object.fromEntries(candidate.skills)
    : candidate.skills?.toObject?.() || {};

  req.body.skills = {
    ...existingSkills,
    ...req.body.skills
  };
}

 // ✅ Parse experiences if sent as JSON string
    if (req.body.experiences) {
      try {
        req.body.experiences = JSON.parse(req.body.experiences);
      } catch (err) {
        console.error("Error parsing experiences:", err);
        req.body.experiences = [];
      }
    }

    // === Remove avatar ===
if (req.body.removeAvatar === "true") {
  if (candidate.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(candidate.avatarPublicId);
  }
  req.body.avatar = "";
  req.body.avatarPublicId = "";
}

// === Remove fullSizePhoto ===
if (req.body.removeFullSizePhoto === "true") {
  if (candidate.fullSizePhotoPublicId) {
    await cloudinary.v2.uploader.destroy(candidate.fullSizePhotoPublicId);
  }
  req.body.fullSizePhoto = "";
  req.body.fullSizePhotoPublicId = "";
}

// === Remove passportScan ===
if (req.body.removePassportScan === "true") {
  if (candidate.passportScanPublicId) {
    await cloudinary.v2.uploader.destroy(candidate.passportScanPublicId);
  }
  req.body.passportScan = "";
  req.body.passportScanPublicId = "";
}



    // === Handle avatar upload ===
    if (req.files && req.files.avatar) {
      if (candidate.avatarPublicId) {
        await cloudinary.v2.uploader.destroy(candidate.avatarPublicId);
      }
      const avatarFile = req.files.avatar;
      const avatarRes = await cloudinary.v2.uploader.upload(
        avatarFile.tempFilePath,
        { folder: "avatars" }
      );
      await fs.unlink(avatarFile.tempFilePath);
      req.body.avatar = avatarRes.secure_url.replace(
        "/upload/",
        "/upload/q_auto:best/"
      );
      req.body.avatarPublicId = avatarRes.public_id;
    }

    // === Handle fullSizePhoto upload ===
    if (req.files && req.files.fullSizePhoto) {
      if (candidate.fullSizePhotoPublicId) {
        await cloudinary.v2.uploader.destroy(candidate.fullSizePhotoPublicId);
      }
      const fullPhotoFile = req.files.fullSizePhoto;
      const fullPhotoRes = await cloudinary.v2.uploader.upload(
        fullPhotoFile.tempFilePath,
        { folder: "fullSizePhotos" }
      );
      await fs.unlink(fullPhotoFile.tempFilePath);
      req.body.fullSizePhoto = fullPhotoRes.secure_url.replace(
        "/upload/",
        "/upload/q_auto:best/"
      );
      req.body.fullSizePhotoPublicId = fullPhotoRes.public_id;
    }

    // === Handle passportScan upload ===
    if (req.files && req.files.passportScan) {
      if (candidate.passportScanPublicId) {
        await cloudinary.v2.uploader.destroy(candidate.passportScanPublicId);
      }
      const passportScanFile = req.files.passportScan;
      const passportScanRes = await cloudinary.v2.uploader.upload(
        passportScanFile.tempFilePath,
        {
          folder: "passportScans",
          resource_type: "auto",
        }
      );
      await fs.unlink(passportScanFile.tempFilePath);
      req.body.passportScan = passportScanRes.secure_url.replace(
        "/upload/",
        "/upload/q_auto:best/"
      );
      req.body.passportScanPublicId = passportScanRes.public_id;
    }

    // === Update candidate ===
    const updatedCandidate = await Candidate.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(StatusCodes.OK).json({
      msg: "Candidate is modified",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error updating candidate" });
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
