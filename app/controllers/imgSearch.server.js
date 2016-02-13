// /app/controllers/imgSearch.server.js
'use strict';


// Set up ----------------------------------------------------------------------
var querystring = require('querystring');
var request = require("request");
var PastSearches = require('../models/pastSearches.js');


// Main export class -----------------------------------------------------------
function imgSearchServer () {

  // Search method -------------------------------------------------------- //
  this.search = function (req, res) {

  // Set up the Google Search API
		var googAPI = "https://www.googleapis.com/customsearch/v1";
		var searchStr = req.params.searchStr;
		var customeEngine = process.env.GOOG_CSE;
		var safety = "medium";
		var offSet = req.query.offset || 1;
		var key = process.env.GOOG_KEY;
		var queryString = querystring.stringify({
			q: searchStr,
			cx: customeEngine,
			num: 10,
			safe: safety,
			start: offSet,
			key: key,
			searchType: "image"
		});

  // Main function that calls the Google Search API
		request(googAPI+"?"+queryString, function (error, result, body) {
		  if (!error && result.statusCode == 200) {

      // Create a record of the search into our database to resurface
        addSearch();

      // Return the image search result
				var searchOutput = JSON.parse(result.body).items.map(function(e) {
					var newObj = {};
					newObj.url = e.link || "";
					newObj.snippet = e.snippet || "";
					newObj.thumbnail = e.image.thumbnailLink || "";
					newObj.context = e.image.contextLink || "";
					return newObj;
				});
				res.json(searchOutput);
		  }
		});

  // Helper function
    function addSearch() {
      PastSearches.find({}, function (err, hist) {
        if (err)
          throw err;
        else {

        // Delete the oldest record n > 10 to ensure we only show recent history
          if (hist.length > 9) {
            PastSearches.findOneAndRemove({}, function(err) {
              if (err)
                throw err;
            })
          }

        // Add the current search to our database
          var newSearch = new PastSearches();
          newSearch.term = searchStr;
          newSearch.when = new Date();
          newSearch.save(function(err) {
            if (err)
              throw err;
          });
        }
      });
    }
  };  // End search method ------------------------------------------------ //


  // get history method --------------------------------------------------- //
  this.getHistory = function (req, res) {
    PastSearches.find({}, function (err, hist) {
      if (err)
        throw err;
      else {
        hist = hist.map( function(e) {
          return { term: e.term, when: e.when };
        });
        res.json(hist);
      }
    });
  };  // End get history method ------------------------------------------- //

}; // End main export class ----------------------------------------------------


// Export imgSearchServer class ------------------------------------------------
module.exports = imgSearchServer;


// EOF -------------------------------------------------------------------------
