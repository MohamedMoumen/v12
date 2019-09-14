// all the middleware functions goes here
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findOne({_id: req.params.id}, function(err, foundCampground) {
            if(err) {
                req.flash('error', 'Campground not found');
                res.reidrect('back');
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'Permission denied');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'Please log in first');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findOne({_id: req.params.comment_id}, function(err, foundComment) {
            if(err) {
                res.render('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', "Permession denied");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', "Please Login first");
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please Login First!');
    res.redirect('/login');
}


module.exports = middlewareObj;