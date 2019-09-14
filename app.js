var express = require('express'),
app         = express(),
bodyParser  = require('body-parser'),
mongoose    = require('mongoose'),
Campground = require('./models/campground'),
seedDB = require('./seeds'),
Comment = require('./models/comment'),
passport = require('passport'),
LocalStrategy = require('passport-local'),
User = require('./models/user'),
methodOverride = require('method-override'),
flash = require('connect-flash');

//Requiring route files
var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');

//Connecting to the db and seeding
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });//yelp_camp is db name
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); //seed the db

//Passport configuration
app.use(require('express-session')({
    secret: "my dick is so god damn hot!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This is a middle ware that will run for all routes
app.use(function(req, res, next) {
    //This is passing the username to every ejs template
    //currentUser is the name used in the temps
    //req.user is the username which if not logged in will undefined
    res.locals.currentUser = req.user;
    //Instead of passing in an object to every single template 
    //This way makes it easier to use message in the header with no problems
    //error is the key in the middleware/index file at which the isLoggedin middlware resides
    //in case of not logging in flash will prompt an error
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

//Using the routes which must be in correct order
//If not in order, some routes might override others...
app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Server Started on PORT ' + process.env.PORT);
});

//app.listen(3000);