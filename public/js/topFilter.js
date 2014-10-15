function TopFilter() {
	// The built-in limit function doesn't work if there is no limit specified--it returns zero elements.
	// The behavior needed is to return all elements.
	// Also, we want to filter on entity.rank, not just slice the array.
	return function (entityList,limit) {
		if (!entityList) return [];
		if (!limit) return entityList;
		var filteredList = [];
		angular.forEach(entityList, function(entity) {
			if (entity.rank <= limit) {
				this.push(entity);
			}
		},filteredList);
		return filteredList;
	};
}