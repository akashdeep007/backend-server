const express = require("express");
const { body } = require("express-validator/check");

const registrationController = require("../controllers/register");

const router = express.Router();

router.get("/registration", registrationController.getRegistration);

router.post(
  "/registration",
  [
    body("Fullname").trim(),
    body("EmailId").trim().isEmail(),
    body("MobileNumber").trim().isMobilePhone(),
    body("RegistrationType").trim(),
    body("TicketNumbe").trim().isNumeric(),
  ],
  registrationController.postNewRegistration
);

module.exports = router;
