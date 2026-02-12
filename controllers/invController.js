const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  const vehicle = await invModel.getInventoryById(inv_id)
  const reviews = await reviewModel.getReviewsByInventoryId(inv_id)


  if (!vehicle) {
    return next({ status: 404, message: "Vehicle not found" })
  }

  let nav = await utilities.getNav()
  const details = await utilities.buildInventoryDetail(vehicle)

  const vehicleData = vehicle[0]

  res.render("./inventory/details", {
    title: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    details,
    reviews: reviews.rows,
    inv_id
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  let nav =await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect
  })
}

/* ***************************
 *  Build "Add Classification" form view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* ***************************
 *  Add classification data to DB / server-side validation
 * ************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const {classification_name} = req.body

  const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )

    nav = await utilities.getNav() //rebuilds nav to show new classification
    const classificationSelect = await utilities.buildClassificationList()

    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect 
    })
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(501).render("./inventory/add-classification", {
      title:"Add Classification",
      nav,
      errors: null
    })
  }
}

/* ***************************
 *  Build "Add New Vehicle" form view
 * ************************** */
invCont.buildNewInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    inv_make: "",
    inv_model: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_year: "",
    inv_miles: "",
    inv_color: "",
    errors: null
  })
}

/* ***************************
 *  Add new inventory
 * ************************** */
invCont.addInventory = async function(req, res) {
  let nav = await utilities.getNav()

  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const addData = await invModel.addInventory(
    inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id
  )

  if (addData) {
    const itemName = `${addData.inv_make} ${addData.inv_model}`
    req.flash("notice", `The ${itemName} was successfully added.`)
    nav = await utilities.getNav()

    const classificationSelect = await utilities.buildClassificationList()

    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect
    })
  } else {
    req.flash("notice", "Failed to add inventory item.")
    let classificationList = await utilities.buildClassificationList(classification_id)

    res.status(500).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList
    })
  }
}

/* ***************************
    Week 5 - Learning
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
    Week 5 - Learning
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()

  const itemData = await invModel.getInventoryById(inv_id)
  const vehicle = itemData[0]
  
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: vehicle.inv_id,
    inv_make: vehicle.inv_make,
    inv_model: vehicle.inv_model,
    inv_year: vehicle.inv_year,
    inv_description: vehicle.inv_description,
    inv_image: vehicle.inv_image,
    inv_thumbnail: vehicle.inv_thumbnail,
    inv_price: vehicle.inv_price,
    inv_miles: vehicle.inv_miles,
    inv_color: vehicle.inv_color,
    classification_id: vehicle.classification_id
  })
}

/* ***************************
    Week 5 - Learning
 *  Update inventory data
 * ************************** */
invCont.updateInventory = async function(req, res, next) {
  let nav = await utilities.getNav()

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id
  )


  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
    Week 5 - Team Activity
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()

  const itemData = await invModel.getInventoryById(inv_id)

  const vehicle = itemData[0]

  const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: vehicle.inv_id,
    inv_make: vehicle.inv_make,
    inv_model: vehicle.inv_model,
    inv_year: vehicle.inv_year,
    inv_price: vehicle.inv_price,
  })
}

/* ***************************
    Week 5 - Team Activity
 *  Delete inventory data
 * ************************** */
invCont.deleteInventory = async function(req, res, next) {
  const inv_id = parseInt(req.body.inv_id)

  const itemData = await invModel.getInventoryById(inv_id);
  
  if (!itemData || itemData.length === 0) {
    req.flash("notice", "Sorry, the vehicle could not be found.")
    return res.redirect("/inv/")
  }

  const vehicle = itemData[0]
  const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`

  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    req.session.save((err) => {
      if (err) return next(err)
      res.redirect("/inv/")
    })
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("/inv/delete/" + inv_id)
  }
}

/* ***************************
    Week 6 - Final Assignment
 *  Build delete classification view
 * ************************** */
invCont.buildDeleteClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const classification_id = parseInt(req.query.classification_id)

  const invCount = await invModel.checkClassificationInventory(classification_id)

  if (invCount > 0) {
    req.flash("notice", "Cannot delete classification if it has inventory items.")
    return res.redirect("/inv/")
  }

  res.render("./inventory/delete-classification", {
    title: "Delete Classification",
    nav,
    classification_id,
    errors: null
  })
}

/* ***************************
    Week 6 - Final Assignment
 *  Process classification deletion
 * ************************** */
invCont.deleteClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const {classification_id} = req.body

  const deleteClassification = await invModel.deleteClassification(classification_id)

  if (deleteClassification) {
    req.flash("notice", "Classification successfully deleted.")
    return res.redirect("/inv")
  } else {
    req.flash("notice", "Delete failed.")
    return res.redirect("/inv")
  }
}


module.exports = invCont