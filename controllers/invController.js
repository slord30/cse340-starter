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
  const inv_id = parseInt(req.params.invId)
  const vehicle = await invModel.getInventoryById(inv_id)

  if (!vehicle) {
    return next({ status: 404, message: "Vehicle not found" })
  }

  let nav = await utilities.getNav()
  const details = await utilities.buildInventoryDetail(vehicle)

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
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
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
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
    Week 5 - Team Activity
 *  Delete inventory data
 * ************************** */
invCont.deleteInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const itemData = await invModel.getInventoryById(inv_id);

  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    const itemName = itemData.inv_make + " " + itemData.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id
    })
  }
}

module.exports = invCont