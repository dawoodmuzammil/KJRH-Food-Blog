var express = require("express");
var router = express.Router({mergeParams: true});
var restaurant  = require("../models/restaurant");
var Comment  = require("../models/comment");
var middleware = require("../middleware");


// ========================================================================== //
//                              COMMENT ROUTES                                //
// ========================================================================== //

// ================ NEW ================ //
router.get("/new", middleware.isLoggedIn, function(req, res) {
        restaurant.findById( req.params.id, function (err, restaurant) {
            if (err) {
                console.log(err);
            }
            else
            {
                res.render("comments/new", {restaurant: restaurant})
            }
        })
})


// ================ POST ================ //
router.post("/", function( req, res) {
    //lookup restaurant using id
    // create new comment
    // connect new comment to restaurant
    // redirect to camground showpage
    
    restaurant.findById( req.params.id, function(err, restaurant) {
        if (err) {
            console.log( err);
            res.redirect( "/restaurants/landing");
        }
        else {
            Comment.create( req.body.comment, function( err, comment) {
                if (err)
                    console.log(err);
                else {
                    // add username and id to comment
                    comment.author.id = req.user._id; ///////////////////
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    restaurant.comments.push( comment);
                    restaurant.save();
                    req.flash("success", "Your comment has been successfully posted.");
                    res.redirect("/restaurants/" + restaurant._id);
                }
            })
        }
    })
})


// ================ EDIT ================ //
router.get("/:commentId/edit", middleware.checkCommentOwnership, function( req, res) {
    Comment.findById(req.params.commentId, function(err, foundComment) {
        if (err)
            res.redirect("back");
        else {
            req.flash("success", "Successfully made changed to your comment.");
            res.render("comments/edit", {restaurantId: req.params.id, comment: foundComment})
        }
    })
})

// ================ UPDATE ================ //
router.put("/:commentId", middleware.checkCommentOwnership, function( req, res) {
    Comment.findByIdAndUpdate( req.params.commentId, req.body.comment, function( err, updatedComment) {
        if ( err)
            res.redirect("back");
        else {
            req.flash("success", "Successfully updated your comment.");
            res.redirect("/restaurants/" + req.params.id);
        }
    });
});


// ================ DELETE ================ //
router.delete( "/:commentId", middleware.checkCommentOwnership, function( req, res) {
    Comment.findByIdAndRemove( req.params.commentId, function( err)    {
        if (err)
            res.redirect("back");
        else
        {
            req.flash("success", "Successfully deleted your comment.");
            res.redirect("/restaurants/" + req.params.id);
        }
    });
});


module.exports = router;