const Listing = require("../models/listing");

// Show all listings
const index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Show form to create new listing
const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show a single listing
const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist !");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// Create a new listing
const createListing = async (req, res, next) => {
  try {
    let url = req.file?.path;
    let filename = req.file?.filename;

    const newListing = new Listing(req.body.listing);
    if (req.user) {
      newListing.owner = req.user._id;
    }

    if (url && filename) {
      newListing.image = { url, filename };
    }

    await newListing.save();
    req.flash("success", "New Listing created !");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

// Show edit form
const renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist !");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// Update a listing
const updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated !");
  res.redirect(`/listings/${id}`);
};

// Delete a listing
const destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted !");
  res.redirect("/listings");
};

// ✅ Export all functions
module.exports = {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  destroyListing
};
