/* jshint node:true */

// An object for storing and retrieving items according to a hierarchical date structure.

var _ = require('underscore');

module.exports = function() {

	var _decades = {};
	var _years = {};
	var _months = {};
	
	this.put = function(o) {
		return {
			'byDecade': function(decade) {
				decade = parseInt(decade);
				if (!_decades[decade]) _decades[decade] = [];
				_decades[decade].push(o);
			},
			'byYear': function(year) {
				year = parseInt(year);
				if (!_years[year]) _years[year] = [];
				_years[year].push(o);
			},
			'byMonth': function(year,month) {
				v = parseInt(year)*12+parseInt(month);
				if (!_months[v]) _months[v] = [];				
				_months[v].push(o);
			}
		};
	} //put
	
	// For get, we want to get all of the entries represented by the timespan.
	this.get = function() {
		return {
			'byDecade': function(decade) { 
				decade = parseInt(decade);
				//console.log('get.byDecade',decade);
				matches = [ _decades[decade] ];
				for (y = 0; y < 10; y++) {
					matches.push(_years[decade+y]);
				}
				return _.filter(_.flatten(matches), function(o) { return o ? true : false; });
			},
			'byYear':   function(year) { 
				year = parseInt(year);
				//console.log('get.byYear',year);
				return _years[year];
			},
			'byMonth':  function(year,month) { 
				v = parseInt(year)*12+parseInt(month);
				//console.log('get.byMonth',year,month,v);
				//console.log(_months[v].length);
				return _months[v]; 
			}
		};
	} //get
	
}