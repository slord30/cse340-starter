const reviewModel = require("../models/review-model")
const utilities = require("../utilities")

const reviewCont = {}

/* ***************************
    Week 6 - Final Assignment
 *  Build add review view by inventory id 
 * ************************** */
reviewCont.buildAddReview = async function (req, res) {
    let nav  = await utilities.getNav()
    const {review_text, inv_id} = req.body
    const account_id = res.locals.accountData.account_id

    const result = await reviewModel.addReview(review_text, inv_id, account_id)
    
    if (result.rowCount === 1) {
        req.flash("notice", "Review successfully added.")
    }   else {
        req.flash("notice", "Sorry, your review could not be added.")
    }
    
    res.redirect(`/inv/detail/${inv_id}`)
}

/* ***************************
    Week 6 - Final Assignment
 *  Build edit review view 
 * ************************** */
reviewCont.buildEditReview = async function(req, res) {
    const review_id = parseInt(req.params.review_id)
    let nav = await utilities.getNav()
    const reviewData = await reviewModel.getReviewById(review_id)

    res.render("./review/edit-review", {
        title: "Edit Review",
        nav,
        reviewData,
        errors: null
    })    
}

/* ***************************
    Week 6 - Final Assignment
 *  Build update review
 * ************************** */
reviewCont.updateReview = async function (req, res) {
  let nav = await utilities.getNav()  
  const { review_id, review_text } = req.body
  const account_id = res.locals.accountData.account_id
  
  const updateResult = await reviewModel.updateReview(review_text, review_id, account_id)

  if (updateResult) {
    req.flash("notice", "The review was successfully updated.")
    
    res.redirect("/account/") 
  } else {
    const reviewData = await reviewModel.getReviewById(review_id)
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("review/edit-review", {
      title: "Edit Review",
      nav,
      reviewData,
      errors: null,
    })
  }
}

/* ***************************
    Week 6 - Final Assignment
 *  Build delete review
 * ************************** */
reviewCont.deleteReview = async function(req, res) {
    let nav = await utilities.getNav()

    const {review_id } = req.body
    const account_id = res.locals.accountData.account_id

    const result = await reviewModel.deleteReview(review_id, account_id)
    if (result.rowCount > 0) {
        req.flash("notice", "Your review was deleted.")
    }   else {
        req.flash("notice", "Sorry, the deletion failed.")
    }

    res.redirect("/account/")
}

module.exports = reviewCont