var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        	= require("../models/user");

// ================ HOME ================ //
router.get("/", function( req, res) {
    res.render( "restaurants/landing");
})

// ================ SIGN UP ================ //
router.get( "/register", function(req, res) {
    res.render( "register");
})

router.post( "/register", function(req, res) {
    var newUser = new User({ username: req.body.username});
    User.register( newUser, req.body.password, function( err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Sign up successful. Welcome to YelpCamp, " + user.username + "!");
            res.redirect("/restaurants");
        });
    });
});

// ================ LOG IN ================ //
router.get("/login", function(req, res) {
    res.render("login");
})

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/restaurants", 
        failureRedirect: "/login"
    }), function (req, res) {
});

// ================ LOG OUT ================ //
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/restaurants");
})

module.exports = router;