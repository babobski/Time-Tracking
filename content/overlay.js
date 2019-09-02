/**
 * Namespaces
 */
if (typeof(extensions) === 'undefined') extensions = {};
if (typeof(extensions.timeTracking) === 'undefined') extensions.timeTracking = {
	version: '1.0'
};

(function() {
	var self = this,
		prefs = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService).getBranch("ko.extensions.timeTracking.");
		
	if (!('ko.extensions' in ko)) ko.extensions = {};
	var myExt = "TimeTracking@babobski.com";
	if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
	if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
	var appData = ko.extensions[myExt].myapp;
	
	window.removeEventListener('load', self.init, false);
	window.removeEventListener('project_opened', self.handleProjectChange, false);
	
	this.addTimeTracking = (title, description, startTime, endTime, running = 'true') => {
		title = title || '';
		description = description || '';
		startTime = startTime || new Date();
		endTime = endTime || new Date(startTime.getTime());
		
		var timeTrack = {
			'title': title,
			'description': description,
			'startTime': startTime,
			'endTime': endTime,
			'running': running,
		};
		
		if (typeof appData.timeTracking !== 'undefined') {
			appData.timeTracking.push(timeTrack);
		} else {
			appData.timeTracking = [];
			appData.timeTracking.push(timeTrack);
		}
		
		prefs.setCharPref('timetracking', JSON.stringify(appData.timeTracking));
	};
	
	this.getTimeTracking = () => {
		if (typeof appData.timeTracking !== undefined) {
			return appData.timeTracking;
		}
		return null;
	};
	
	this.handleProjectChange = () => {
		var koDialog = require("ko/dialogs");
		var addTimeTracking = koDialog.confirm('Add new Time Tracking?');
		
		if (addTimeTracking) {
			var description = ko.interpolate.interpolateString('%(ask:Desciption:time tracking description)');
			var currentdate = new Date(),
			currentProject = ko.projects.manager.currentProject;
			
			if (currentProject !== null) {
				projectName = currentProject.name.replace('.komodoproject', '');
				self.addTimeTracking(projectName, description, currentdate);
			}
		}
	};
	
	this.init = () => {
		var timetrackingPref = prefs.getCharPref('timetracking');
		if (timetrackingPref.length > 0) {
            var timetracking = JSON.parse(timetrackingPref);
            var parsedTimeTracking = [];
            var reggex = /[0-9]{1,4}-[0-9]{1,2}-[0-9A-Z:.]+Z/;
            for (var i = 0; i < timetracking.length; i++) {
                var currTrack = timetracking[i];
                var startTime = currTrack.startTime;
                var endTime = currTrack.endTime;
                
                if (reggex.test(startTime)) {
                    currTrack.startTime = new Date(startTime);
                }
                
                if (reggex.test(endTime)) {
                    currTrack.endTime = new Date(endTime);
                }
                
                parsedTimeTracking.push(currTrack);
            }
			appData.timeTracking = parsedTimeTracking;
		}
	};
	
	this.openAddTimeTrackingWindow = () => {
		var features = "chrome,titlebar,centerscreen,dependent";
		var windowVars = {
			ko: ko,
		};
		window.openDialog('chrome://timeTracking/content/addTimeTracking.xul', "timeTracking", features, windowVars);
	};
	

	window.addEventListener('load', self.init, false);
	window.addEventListener('project_opened', self.handleProjectChange, false);
 
}).apply(extensions.timeTracking);
