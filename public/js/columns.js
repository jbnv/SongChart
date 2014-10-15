// init: { slug: title }
function Columns(init) {

	if (init) {
		angular.forEach(init, function(title,slug) {
			this[slug] = { 'title': title };
		}, this);
	}

}

Columns.prototype.show = function() { 
	for (var index in arguments) {
		this[arguments[index]].hidden = false;
	}
}

Columns.prototype.showOnly = function() { 
	var columnsToShow = [];
	for (var index in arguments) {
		columnsToShow.push(arguments[index]);
	}
	angular.forEach($scope.columns, function(column,key) {
		column.hidden = (columnsToShow.indexOf(key) == -1);
	})
}

Columns.prototype.hide = function(slug) {
	for (var index in arguments) {
		this[arguments[index]].hidden = true;
	}
}
