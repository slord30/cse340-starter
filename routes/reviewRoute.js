// Needed Resources
const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")

// Route to post new review
router.post(
    "/add",
    utilities.checkLogin, //checkLogin comes from my utilities/index.js authentication middleware
    reviewController.buildAddReview
)

// Route to post updated review
router.post(
    "/update",
    utilities.checkLogin,
    reviewController.updateReview
)

// Route to post deleted review
router.post(
    "/delete",
    utilities.checkLogin,
    reviewController.deleteReview
)

// Route to deliver edit review view
router.get(
    "/edit/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.buildEditReview)
)

module.exports = router
