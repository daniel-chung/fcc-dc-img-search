// /app/index.js
'use strict';


// Set up ----------------------------------------------------------------------
var path = process.cwd();
var ImgSearchServer = require(path + '/app/controllers/imgSearch.server.js');


// Main index function ---------------------------------------------------------
module.exports = function (app) {

	// Server side controllers ---------------------------------------------- //
	var imgSearchServer = new ImgSearchServer();


	// HOME PAGE (with login links) ----------------------------------------- //
	app.route('/')
		.get(function(req, res) {
			res.sendFile(path + '/view/index.html');
	});


	// API CALLS ------------------------------------------------------------ //
	app.route('/api/imagesearch/:searchStr')
		.get(imgSearchServer.search);

	app.route('/api/latest/imagesearch')
		.get(imgSearchServer.getHistory);


	// Error page ----------------------------------------------------------- //
	app.route('/error')
		.get(function(req, res) {
			res.send('This is an error page');
		});

};


// EOF -------------------------------------------------------------------------
