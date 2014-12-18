function AlertService() {

	//TODO Return the most severe type among the alerts so that the type can be used to color the icon.

	// content: { type: "danger"|"success"|"info"|etc., title:"", fa: "fa-XXX", message: "", data: {} } 

	// this.alerts: [ content ]
	this.alerts = [];
	
	this.addAlert = function(content) {
		var newLength = this.alerts.push(content);
	}

	this.addResourceAlert = function(path,title,request,httpResponse) {
		this.alerts.push({
			"type": "danger",
			"title": "Failure to Get "+title,
			"message": "The call to "+path+" failed to return data.",
			"data": { 'request':request, 'httpResponse': httpResponse }
		});
	}

	this.addDemoAlert = function() {
		this.addAlert({ 
			'title':'Demo alert', 
			'message':'Remove this when alert is working.'
		});
	}


	this.closeAlert = function(index) {
		if (index >= this.alerts.length) index = this.alerts.length-1;
		this.alerts.splice(index, 1);
	}

}

