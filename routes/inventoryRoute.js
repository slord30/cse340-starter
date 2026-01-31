// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classificationValidate = require('../utilities/classification-validate')
const inventoryValidate = require('../utilities/inventory-validate')

// Route to build inventory by classification view
router.get("/type/:classificationId", 
utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory items by classification view
router.get("/detail/:invId", 
utilities.handleErrors(invController.buildInventoryDetail)
);

// Route to build Inventory Management Page
router.get(
    "/",
    utilities.handleErrors(invController.buildManagement)
)

// Assignement 4
// Route to build add classification view
router.get("/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
)

// Assignement 4
// Post classification details
router.post(
    "/add-classification",
    classificationValidate.classificationRules(),
    classificationValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Assignment 4
// Route to build Add New Vehicle view
router.get("/add-inventory",
    utilities.handleErrors(invController.buildNewInventory)
)

// Assignment 4
// Post new inventory to DB
router.post(
    "/add-inventory",
    inventoryValidate.inventoryRules(),
    inventoryValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Assignement 4
// Intentional error route
router.get("/error-test", (req, res, next) => {
    // Create an intentional error
    next(new Error("This is a test 500 error"));
});

module.exports = router;