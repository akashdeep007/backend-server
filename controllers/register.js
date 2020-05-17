exports.getRegistration = (req, res, next) => {
  res.status(200).json({});
};

exports.postNewRegistration = (req, res, next) => {
  // Create in db
  res.status(201).json({
    message: "Registered successfully!",
    post: { id: new Date().toISOString() },
  });
};
