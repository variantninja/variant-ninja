var express = require('express');
var app = express();
var compression = require('compression');
var serveStatic = require('serve-static');
//var extend = require('xtend');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var flash    = require('connect-flash');
var stormpath = require('express-stormpath');
var session      = require('express-session');
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// set up the express application
app.use(allowCrossDomain);
app.use(favicon(__dirname + '/../public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({
	dest: __dirname + '/../views/', // this is where new pages are uploaded via Multer
	rename: function (fieldname, filename) {
    	return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
  	},
	onFileUploadStart: function (file, req, res) {
  		console.log(file.fieldname + ' is starting to upload...')
	},
	onFileUploadComplete: function (file, req, res) {
  		console.log(file.fieldname + ' uploaded to  ' + file.path)
	},
	onFilesLimit: function () {
  		console.log('You crossed the file limit! Are you adding an HTML file?')
	}
})); 


// Set up the Stormpath application
require('./stormpath.js')(app, stormpath);

/* It's not quite Project Metosis, but this is going to allow us to
 * serve meta pages (static resources) that are isolated from the core application middleware
 * and all of its dependencies. We also serve the web static pages that are pulling
 * in the app for loading and download in the browser [(]via serverStatic() below]
 *
*/
//View Engine setup
app.set('views', __dirname + '/../views');
// Configure expressjs (ejs) engine, for it will be #awesome for us.
app.engine('html', require('ejs').renderFile);


// Use gzip compression
app.use(compression());

//connect some custom POST middleware
//app.post('/exampleMiddleware', require('./example').exampleImport);


/*
 * Load Variant statically, as new middleware function to serve files from within specified directory
 * This allows us to operate Variant as a thin browser client with no dependency on server middleware
*/
app.use(serveStatic(__dirname + '/../public'));

/* This is to allow Bleeding Edge changes to be seen from the active
 * node.js server that is serving us.
*/
app.use(function(req, res, next) {
	res.renderDebug = function(page) {
		return res.render(page, {
			cache: !req.query.hasOwnProperty('debug')
		});
	};
	next();
});



/*
 * Load Variant routes
*/

/* KISS. A keep it simple routing scheme here... forever. This app is intended to
 * be a single page app with meta pages, both of which we can assign routes for.
*/

// routes ======================================================================
require('./routes.js')(app, stormpath); // load our routes and pass in our app and fully configured stormpath
//require('./routes.js')(app); // load our routes and pass in our app








module.exports = app;