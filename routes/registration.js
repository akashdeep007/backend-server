const express = require("express");

const registrationController = require("../controllers/register");

const router = express.Router();

router.get("/registration", registrationController.getRegistration);

router.post("/registration", registrationController.postNewRegistration);

module.exports = router;
