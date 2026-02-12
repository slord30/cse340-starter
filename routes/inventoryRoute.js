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
    utilities.checkEmployeeorAdmin,
    utilities.handleErrors(invController.buildManagement)
)

// Week 4 - Assignement 
// Route to build add classification view
router.get("/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
)

// Week 4 - Assignement
// Post classification details
router.post(
    "/add-classification",
    classificationValidate.classificationRules(),
    classificationValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Week 4 - Assignment 
// Route to build Add New Vehicle view
router.get("/add-inventory",
    utilities.checkEmployeeorAdmin,
    utilities.handleErrors(invController.buildNewInventory)
)

// Week 4 - Assignment 
// Post new inventory to DB
router.post(
    "/add-inventory",
    inventoryValidate.inventoryRules(),
    inventoryValidate.checkInventoryData,
    utilities.checkEmployeeorAdmin,
    utilities.handleErrors(invController.addInventory)
)

// Week 4 - Assignement
// Intentional error route
router.get("/error-test", (req, res, next) => {
    // Create an intentional error
    next(new Error("This is a test 500 error"));
});

// Week 5 - Learning
// Route to Inventory List
router.get("/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
)

// Week 5 - Learning
// Route to modifiy inventory
router.get("/edit/:inv_id", 
    utilities.checkEmployeeorAdmin,
    utilities.handleErrors(invController.buildEditInventory)
)

// Week 5 - Learning
// Route to post the updated inventory to the database
router.post("/edit-inventory/",
    inventoryValidate.newInventoryRules(),
    inventoryValidate.checkUpdateData,
    utilities.checkEmployeeorAdmin,
    utilities.handleErrors(invController.updateInventory)
)

// Week 5 - Team Activity
// Route to delete inventory
router.get("/delete/:inv_id",
    utilities.checkEmployeeorAdmin,
    utilities.handleErrors(invController.buildDeleteInventory)
)

// Week 5 - Team Activity
// Route to post the deleted inventory to the database
router.post("/delete-inventory/",
    utilities.checkEmployeeorAdmin,
    utilities.handleErrors(invController.deleteInventory)
)

// Week 6 - Final Assignment
// Route to confirm classification does not have inventory
router.get(
    "/delete-classification",
    utilities.checkEmployeeorAdmin,
    utilities.handleErrors(invController.buildDeleteClassification)
)

// Route to process classification deletion
router.post(
    "/delete-classification",
    utilities.checkEmployeeorAdmin,
    utilities.handleErrors(invController.deleteClassification)
)

module.exports = router;