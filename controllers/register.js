const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator/check");

const Registration = require("../models/Registration");

exports.getRegistration = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 15;
  let totalItems;
  Registration.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Registration.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((Registrations) => {
      res.status(200).json({
        message: "Fetched Registration Details Successfully.",
        Registrations: Registrations,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getSingleRegistration = (req, res, next) => {
  const regId = req.params.regId;
  Registration.findById(regId)
    .then((reg) => {
      if (!reg) {
        const error = new Error("Could not find Registration Details");
        error.statusCode = 404;
        throw error;
      }
      res
        .status(200)
        .json({ message: "Registration Details fetched", registration: reg });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postNewRegistration = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  //for testing comment out the if block and fetch idcardurl from body
  if (!req.file) {
    const error = new Error("No ID Card provided.");
    error.statusCode = 422;
    throw error;
  }
  const IdCardUrl = req.file.path;
  const Fullname = req.body.Fullname;
  const EmailId = req.body.EmailId;
  const MobileNumber = req.body.MobileNumber;
  const RegistrationType = req.body.RegistrationType;
  const TicketNumber = req.body.TicketNumber;
  Registration.findOne({ EmailId: EmailId }).then((user) => {
    if (user) {
      return res.status(201).json({
        message: " Already Registered ",
        result: user._id,
      });
    }
    const registration = new Registration({
      IdCardUrl: IdCardUrl,
      Fullname: Fullname,
      EmailId: EmailId,
      MobileNumber: MobileNumber,
      RegistrationType: RegistrationType,
      TicketNumber: TicketNumber,
    });
    registration
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Registered successfully!",
          result: result,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};
