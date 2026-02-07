const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver account registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

/* ****************************************
 *  Unit 5 - Learning & Assignment
    Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", { 
      title: "Login", 
      nav, 
      errors: null, 
      account_email })
  }

  try {
    const correctPassword = await bcrypt.compare(account_password, accountData.account_password)
    if (!correctPassword) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", { 
        title: "Login", 
        nav, 
        errors: null, 
        account_email })
    }

    req.session.loggedin = true
    req.session.accountData = {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_email: accountData.account_email,
      account_type: accountData.account_type
    }

    // Remove password from object before JWT
    const tokenData = { ...accountData }
    delete tokenData.account_password

    // JWT cookie
    const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 3600 * 1000
    })

    req.flash("notice", "You are logged in.")

    return res.redirect("/account/")
  } catch (error) {
    console.error(error)
    return next(error)
  }
}

/* ****************************************
 *  Unit 5 - Learning/Team Building
    Deliver account management view
 * ************************************ */
async function buildAccountManagement(req, res, next) {
  const nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: req.session.accountData,
    errors: null
  })
}

/* ****************************************
 *  Unit 5 - Assignement
    Process logout
 * ************************************ */
async function accountLogout(req, res, next) {
  req.session.destroy(err => {
    if (err) {
      console.error(err)
      return next(err)
    }
    res.clearCookie("jwt") // remove JWT cookie
    return res.redirect("/")
  })
}

/* ****************************************
 *  Unit 5 - Assignement Task 5
    Deliver update account view
 * ************************************ */
async function buildUpdateAccount(req, res, next) {
  const nav = await utilities.getNav()
  const account_id = req.params.account_id
  const accountData = await accountModel.getAccountById(account_id)

  if (!accountData) {
    req.flash("notice", "Account not found")
    return res.redirect("/account/")
  }

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    accountData,
    errors: null
  })  
}

/* ****************************************
 *  Unit 5 - Assignement Task 5
    Process account info update
 * ************************************ */
async function updateAccountInfo(req, res, next) {
  const nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body
  
  const existingAccount = await accountModel.getAccountByEmail(account_email)
  if (existingAccount && existingAccount.account_id != account_id) {
    req.flash("notice", "Email already in use. Please choose another.")
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: req.body,
      errors: [{msg: "Email already exists"}]
    })
  }

  const result = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (result) {
    req.flash("notice", "Account successfully updated.")
  } else {
    req.flash("notice", "Account update failed.")
  }

  const updatedData = await accountModel.getAccountById(account_id)
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: updatedData,
    errors: null
    })
  }

/* ****************************************
 *  Unit 5 - Assignement Task 5
    Process Password Change
 * ************************************ */
async function updatePassword (req, res, next) {
  const nav = await utilities.getNav()
  const {account_id, account_password} = req.body

  if (!account_password) {
    req.flash("notice", "Password cannot be empty.")
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: req.body,
      errors: [{msg: "Password cannot be empty."}]
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const result = await accountModel.updatePassword(account_id, hashedPassword)

    if (result) {
      req.flash("notice", "Password successfully updated.")
    } else {
      req.flash("notice", "Password update failed.")
    }

    const updatedData = await accountModel.getAccountById(account_id)
    res.render("account/management", {
      title: "Account Management",
      nav,
      accountData: updatedData,
      errors: null
    })
  } catch (error) {
    next(error)
  } 
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, accountLogout, buildUpdateAccount, updateAccountInfo, updatePassword }