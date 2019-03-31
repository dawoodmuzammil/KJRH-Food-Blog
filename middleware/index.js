var restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkOwnership = function( req, res, next) 
{
    if ( req.isAuthenticated()) 
    {
        restaurant.findById( req.params.id, function( err, foundrestaurant) 
        { //need to find because we need to know which restaurant we are editing
            if (err)
                res.redirect("back");
            else 
            {
                if ( foundrestaurant.author.id.equals( req.user._id)) 
                    next();
                else {
                    req.flash("error", "You don't have the permission to make that changes.");
                    res.redirect("back");
                }
            }
        });
    }
    else 
        res.redirect("back");
}

middlewareObj.checkCommentOwnership = function( req, res, next) {
    if ( req.isAuthenticated()) 
    {
        Comment.findById( req.params.commentId, function( err, foundComment) 
        { //need to find because we need to know which restaurant we are editing
            if (err)
                res.redirect("back");
            else 
            {
                // console.log( foundComment.author.id);
                if (foundComment.author.id.equals(req.user._id))
                    next(); 
                else {
                    req.flash("error", "You don't have the permission to make that changes.");
                    res.redirect("back");
                }
            }
        });
    }
    else 
        res.redirect("back");
}

middlewareObj.isLoggedIn = function( req, res, next) {
    if ( req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first.");
    res.redirect("/login");
}

module.exports = middlewareObj;