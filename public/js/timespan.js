/* jshint node:true */

module.exports =  function(pDefaultSlug) {

	this.fromSlug = function(slug) {
		this.slug = slug;
		if (/^calendar:\d\d\d\ds$/.test(slug)) {
			this.decade = parseInt(slug.match(/\d\d\d\d/)[0]);
		} else if (/^calendar:\d\d\d\d$/.test(slug)) {
			this.year = parseInt(slug.match(/\d\d\d\d/)[0]);
		} else if (/^calendar:\d\d\d\d-\d\d$/.test(slug)) {
			numbers = slug.match(/\d+/g);
			this.year = parseInt(numbers[0]);
			this.month = parseInt(numbers[1]);
		}
	}
	
	if (pDefaultSlug) {
		this.fromSlug(pDefaultSlug);
	} 
}

