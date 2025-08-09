import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import mongoose from "mongoose";
import Candidate from "../models/candidateModel.js";
import User from "../models/userModel.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith("no candidate with id")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("Not authorized")) {
          throw new UnauthorizedError("Not authorized to access this route");
        }
        throw new BadRequestError();
      }
      next();
    },
  ];
};

export const validateCandidateInput = withValidationErrors([
  body("firstName").notEmpty().withMessage("First name is required"),
  body("middleName").notEmpty().withMessage("Middle name is required"),
  body("gender").notEmpty().withMessage("Gender is required"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Invalid date format, use YYYY-MM-DD"),

  body("passportNo").notEmpty().withMessage("Passport No. is required"),

  body("phoneNo")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  body("narrativePhoneNo")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid narrative phone number"),

  body("laborId").notEmpty().withMessage("Labor ID is required"),

  body("religion")
    .notEmpty()
    .withMessage("Religion is required")
    .isIn(["muslim", "non-muslim"])
    .withMessage("Religion is required"),
  body("cvStatus")
    .notEmpty()
    .withMessage("CV Status is required")
    .isIn(["done", "waiting"])
    .withMessage("CV Status required"),

  body("cocStatus")
    .notEmpty()
    .withMessage("COC Status is required")
    .isIn(["done", "waiting","booked"])
    .withMessage("COC Status required"),

  body("musanedStatus")
    .notEmpty()
    .withMessage("Musaned Status is required")
    .isIn(["done","pending-release", "waiting"])
    .withMessage("Musaned Status required"),

  body("medicalStatus")
    .notEmpty()
    .withMessage("Medical Status is required")
    .isIn(["done", "waiting"])
    .withMessage("Medical Status required"),

  body("experienceOutside")
    .notEmpty()
    .withMessage("Experience Outside Country is required"),

  body("availabilityStatus")
    .notEmpty()
    .withMessage("Availability status is required")
    .isIn(["available", "uavailable", "selected"])
    .withMessage("Availability status must be required"),
]);


export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const candidate = await Candidate.findById(value);
    console.log(111333, candidate);
    if (!candidate) throw new NotFoundError(`no candidate with id : ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === candidate.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("Not authorized to access this route");
  }),
]);

export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exists");
      }
    }),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("The pasword character must be greater than 8"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error("email already exists");
      }
    }),
  body("lastName").notEmpty().withMessage("last name is required"),
  body("location").notEmpty().withMessage("location is required"),
]);
