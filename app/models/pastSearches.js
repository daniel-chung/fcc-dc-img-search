// app/models/pastSearches.js
'use strict';

// Set up ----------------------------------------------------------------------
var mongoose = require('mongoose');


// Mongoose schema -------------------------------------------------------------
var pastSearchSchema = mongoose.Schema({
    term : String,
    when : Date,
});


// Export the handler class ----------------------------------------------------
module.exports = mongoose.model('PastSearches', pastSearchSchema);


// EOF -------------------------------------------------------------------------
