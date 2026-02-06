const utilities = require(".");
const { body, validationResult } = require("express-validator");

const validate = {};

/* **********************************
 * Assignment 4
   Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required.")
      .matches(/^[A-Za-z0-9\s\-]+$/),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Make is required.")
      .matches(/^[A-Za-z0-9\s\-]+$/),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image").trim().notEmpty().withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_year")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be between 1900 and 2099."),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),

    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ];
};

/* ******************************
 * Assignment 4
 * Check data and return errors
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();

    let classificationList = await utilities.buildClassificationList(
      req.body.classification_id,
    );

    return res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors,
      ...req.body,
    });
  }

  next();
};

/* ******************************
 * Week 5 - Learning
 * Check data and return errors
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();

    let classificationList = await utilities.buildClassificationList(
      req.body.classification_id,
    );

    return res.render("./inventory/edit-inventory", {
      title: "Edit " + req.body.inv_make + " " + req.body.inv_model,
      nav,
      classificationSelect: classificationList,
      inv_id,
      errors,
      ...req.body,
    });
  }

  next();
};

/* ******************************
 * Week 5 - Learning
 * Inventory update validation rules
 * ***************************** */
validate.newInventoryRules = () => {
  return validate.inventoryRules();
};

module.exports = validate;
