const express = require("express");
const { body } = require("express-validator/check");

const registrationController = require("../controllers/register");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/registration", isAuth, registrationController.getRegistration);

router.post(
  "/registration",
  [
    body("Fullname").trim(),
    body("EmailId").trim().isEmail(),
    body("MobileNumber").trim().isMobilePhone(),
    body("RegistrationType").trim(),
    body("TicketNumber").trim().isNumeric(),
  ],
  registrationController.postNewRegistration
);

module.exports = router;
