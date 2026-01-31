const utilities = require(".")
const { body, validationResult } = require("express-validator")
// const invModel = require("../models/inventory-model")

const validate = {}

/*  **********************************
  * Assignment 4
  * New Classification Name Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .matches(/^[A-Za-z]+$/)
            .withMessage("Field is empty.")
    ]
}

  /* ******************************
 * Assignment 4
 * Check data and return errors 
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors,
            classification_name
        })
    }
    
    next()
}

module.exports = validate

