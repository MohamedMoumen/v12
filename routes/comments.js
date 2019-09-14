var express = require('express');
var router = express.Router({mergeParams: true});//Merges the params from all files I guess
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');//This automatically requires the index.js file

//Comments New
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Campground.findOne({_id: req.params.id}, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground, campground});
        }
    });
});

//Comments Create
router.post('/', middleware.isLoggedIn, function(req,res) {
    Campground.findOne({_id: req.params.id}, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash('error', "Something went wrong..."); 
                    console.log(err);
                } else {
                    //req.user is given by passport
                    //req.user shows the current logged in user
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', "Comment added");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    })
});

//EDIT-COMMENT ROUTE/FORM
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
    Comment.findOne({_id: req.params.comment_id}, function(err, foundComment) {
        if(err) {
            req.flash('error', "Can't do that...");
            res.redirect('back');
        } else {
            res.render('comments/edit',{
                campground_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

//UPDATE-COMMENT ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findOneAndUpdate({_id: req.params.comment_id}, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', "Comment updated");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DELETE-COMMENT ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findOneAndDelete({_id: req.params.comment_id}, function(err) {
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', "Comment deleted");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;