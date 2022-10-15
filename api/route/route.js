const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const auth = require("../../config/authenticationConfig")

//Router

//Routing request to coresponding controller function
router.post("/register", userController.register);
router.post("/login", userController.login);
//Check for authentication before route to getUserDetails()
router.get("/me", auth,userController.getUserDetails);

module.exports = router;