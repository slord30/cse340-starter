// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", 
utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory items by classification view
router.get("/detail/:invId", 
utilities.handleErrors(invController.buildInventoryDetail)
);

// Intentional error route
router.get("/error-test", (req, res, next) => {
    // Create an intentional error
    next(new Error("This is a test 500 error"));
});

module.exports = router;