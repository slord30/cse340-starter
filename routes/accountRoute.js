// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const loginValidate = require('../utilities/login-validation')

// Route to Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Account Management View
router.get("/", 
utilities.checkLogin,  
utilities.handleErrors(accountController.buildAccountManagement))

// Route to Account Login View
// router.post("/login", utilities.handleErrors(accountController.accountLogin))

// Route to Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  loginValidate.loginRules(),
  loginValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Week 5 - Assignement Task 1
// Route to logout
router.get("/logout", 
  utilities.handleErrors(accountController.accountLogout)
)

// Week 5 - Assignment Task 5
// Route to account update view
router.get("/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Route to post the updated account info
router.post("/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountInfo)
)

// Route to process password change
router.post("/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;