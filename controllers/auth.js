const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedAdmin;
  Admin.findOne({ email: email })
    .then((Admin) => {
      if (!Admin) {
        const error = new Error("A Admin with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }
      loadedAdmin = Admin;
      return bcrypt.compare(password, Admin.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedAdmin.email,
          AdminId: loadedAdmin._id.toString(),
        },
        "somesupersecretsecret",
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({ token: token, AdminId: loadedAdmin._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
