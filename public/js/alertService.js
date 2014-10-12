function AlertService() {

	// content: { type: "danger"|"success"|"info"|etc., title:"", fa: "fa-XXX", message: "", data: {} } 

	// this.alerts: [ content ]
	this.alerts = [];
	
	this.addAlert = function(content) {
		var newLength = this.alerts.push(content);
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

