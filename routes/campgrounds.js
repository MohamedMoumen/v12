var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');//This automatically requires the index.js file

//INDEX - show all campgrounds
router.get("/", function(req, res) {
    Campground.find({}, function(err,camp){//All the camp info from db
        //camp is the returned object from mongo
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:camp});
        }
    })
    // res.render("campgrounds", {campgrounds:campgrounds});
});

//CREATE - add new campground to db
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name; // The req variable contains the form info
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err,camp) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new"); //This page contains a form with method POST and action campgrounds
});

//SHOW - shows more info about one campground
router.get('/:id', function(req, res){
    //find the campground with provided ID\
    Campground.findOne({_id: req.params.id}).populate("comments").exec(function(err, foundCamp){
        if(err) {
            console.log(err);
        } else {
            //render show template with that campground
            //console.log(foundCamp);
            res.render("campgrounds/show", {campground: foundCamp});
        }
    });
});

//EDIT-CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findOne({_id: req.params.id}, function(err, foundCampground) {
        if(err) {
            req.flash('error', "You don't have access to that...");
        }else {
            res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});

//UPDATE-CAMPGROUDN ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findOneAndUpdate({_id: req.params.id},req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findOneAndDelete({_id: req.params.id}, function(err) {
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;