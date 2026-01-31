const invModel = require("../models/inventory-model")
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
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)

  if (!data || data.length === 0) {
    return next ({status: 404, message: "Vehicle not found"})
  }

  let nav = await utilities.getNav()
  const details = await utilities.buildInventoryDetail(data)
  const vehicle = data[0]

  res.render("./inventory/details", {
    title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    details
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  let nav =await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav
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

    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav
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
 *  Add inventory
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
    req.flash("notice", "New vehicle inventory was successfully added.")
    nav = await utilities.getNav()

    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav
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



module.exports = invCont