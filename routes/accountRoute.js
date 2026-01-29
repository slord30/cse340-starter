// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to Account Login View
router.post("/login", utilities.handleErrors(accountController.accountLogin))

// Route to Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)


module.exports = router;