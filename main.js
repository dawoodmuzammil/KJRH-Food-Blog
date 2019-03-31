var express     	=   require("express"),
	app         	=   express(),
	bodyParser  	=   require("body-parser"),
	mongoose    	=   require("mongoose"),
	restaurant  	=   require("./models/restaurant"),
	Comment     	=   require("./models/comment"),
	seedDB      	=   require("./seeds"),
	passport    	=   require("passport"),
	flash			=	require("connect-flash"),
	localStrategy 	=   require("passport-local"),
	User        	=   require("./models/user"),
	methodOverride  =   require("method-override");
	
var commentRoutes       = require("./routes/comments"),
    restaurantsRoutes   = require("./routes/restaurants"),
    indexRoutes         = require("./routes/index");

// seedDB(); //the dummy database
// GENERAL SETTINGS
// mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true });
// mongoose.connect('mongodb://dawood:escada123@ds125932.mlab.com:25932/dawoodmuzammil-yelp');
mongoose.connect( process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use( express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I work at TPS!",
    resave: false,
    saveUninitialized: false
}))
app.use( passport.initialize()); 
app.use( passport.session());
passport.use( new localStrategy( User.authenticate()));
passport.serializeUser( User.serializeUser());
passport.deserializeUser( User.deserializeUser());

// GLOBALisque VARIABLE
app.use( function( req, res, next) {
    res.locals.currentUser	=	req.user;
    res.locals.error		=	req.flash("error");
    res.locals.success		=	req.flash("success");
    next();
});

// IMPORTING ROUTES
app.use( "/", indexRoutes);
app.use( "/restaurants", restaurantsRoutes);
app.use( "/restaurants/:id/comments", commentRoutes);

// ================ LISTEN ================ //
app.listen( process.env.PORT, process.env.IP, function() {
     console.log("YelpCamp has started!");
});