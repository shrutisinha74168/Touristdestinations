const Listing = require("./models/listing");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// ✅ Final FIXED: isOwner middleware
module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    // ✅ 1. Check if listing exists
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    // ✅ 2. Check if user is logged in (just in case)
    if (!req.user) {
      req.flash("error", "You must be logged in.");
      return res.redirect("/login");
    }

    // ✅ 3. Check ownership safely
    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "You are not authorized to do that!");
      return res.redirect(`/listings/${id}`);
    }

    next();

  } catch (err) {
    console.error("isOwner middleware error:", err);
    req.flash("error", "Something went wrong.");
    return res.redirect("/listings");
  }
};
