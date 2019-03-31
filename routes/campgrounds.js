var express     = require("express");
var router      = express.Router();
var restaurant  = require("../models/restaurant");
var comment  = require("../models/comment");
var middleware = require("../middleware");


// ========================================================================== //
//                           restaurant ROUTES                                //
// ========================================================================== //



// ================ INDEX ================ //
router.get("/", function( req, res) {
    // get all restaurants from database
    restaurant.find({}, function( err, allrestaurants) {
        if (err)
            console.log(err);
        else
            res.render("restaurants/index", {restaurants: allrestaurants});
    });
});

// ================ NEW ================ //
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("restaurants/new");
});

// ================ CREATE ================ //
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = { // NEW WAY TO ASSOCIATE
        id: req.user.id,
        username: req.user.username
    }
    var newrestaurant = {name: name, image: image, description: description, author: author};
    
    restaurant.create( newrestaurant, function (err, createdrestaurant) {
        if (err) {
            console.log(err);
        }
        else {
            req.flash("success", "Successfully added restaurant.");
            res.redirect("/restaurants");
        }
    });
});

// ================ SHOW ================ //
router.get("/:id", function( req, res) {
    // find the restaurant with provided ID
    restaurant.findById( req.params.id).populate("comments").exec( function( err, foundrestaurant) {
        if (err) {
            console.log( err);
        }
        res.render("restaurants/show", {restaurant: foundrestaurant});
    })
});

// ============= EDIT ============= //
router.get( "/:id/edit", middleware.checkOwnership, function (req, res) {
    restaurant.findById( req.params.id, function( err, foundrestaurant) { //need to find because we need to know which restaurant we are editing
        res.render( "restaurants/edit", {restaurant: foundrestaurant}); // passing restaurant
    });
});

// ============= UPDATE ============= //
router.put("/:id", middleware.checkOwnership, function(req, res) {
    restaurant.findByIdAndUpdate( req.params.id, req.body.restaurant, function ( err, updatedrestaurant) {
        if ( err)
            res.redirect("/restaurants");
        else {
            req.flash("success", "Successfully updated restaurant.");
            res.redirect( "/restaurants/" + req.params.id);
        }
    }); 
});

// ============= DESTROY ============= //
router.delete("/:id", middleware.checkOwnership, function( req, res) {
    restaurant.findByIdAndRemove( req.params.id, function( err) {
        if (err)
            res.redirect("/restaurants");
        else {
            req.flash("success", "Successfully deleted restaurant.");
            res.redirect("/restaurants");
        }
    });
});

module.exports = router;