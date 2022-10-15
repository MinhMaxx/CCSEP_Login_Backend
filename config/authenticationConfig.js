//Authentication service
//Check for token before request reach other controller that need authenticating
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret");
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Please login first!"
    });
  }
};