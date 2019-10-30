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
	
	appData.force = false;

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
	
	this.updateTimeTracking = (timeTracking, index) => {
		appData.timeTracking[index] = timeTracking;
		appData.force = true;
		self.saveTimeTracking(appData.timeTracking);
	};

	this.saveTimeTracking = (timetracking = []) => {
		prefs.setCharPref('timetracking', JSON.stringify(timetracking));
	};

	this.getTimeTracking = () => {
		if (typeof appData.timeTracking !== undefined) {
			return appData.timeTracking;
		}
		return null;
	};

	this.handleProjectChange = () => {
		
		var features = "chrome,titlebar,centerscreen,dependent",
			currentProject = ko.projects.manager.currentProject;
			windowVars = {
				ko: ko,
				timetracking: this,
				projectName: (currentProject !== null ? currentProject.name.replace('.komodoproject', '') : '')
			};
		window.openDialog('chrome://timeTracking/content/timeTracking.xul', "timeTracking", features, windowVars);
		
		//var koDialog = require("ko/dialogs"),
		//	addTimeTracking = koDialog.confirm('Add new Time Tracking?');
		//
		//if (addTimeTracking) {
		//	var description = ko.interpolate.interpolateString('%(ask:Desciption:time tracking description)'),
		//		currentdate = new Date(),
		//		currentProject = ko.projects.manager.currentProject;
		//
		//	if (currentProject !== null) {
		//		projectName = currentProject.name.replace('.komodoproject', '');
		//		self.addTimeTracking(projectName, description, currentdate);
		//	}
		//}
	};

	this.init = () => {
		var timetrackingPref = prefs.getCharPref('timetracking');
		if (timetrackingPref.length > 0) {
			var timetracking = JSON.parse(timetrackingPref),
				parsedTimeTracking = [];
			var reggex = /[0-9]{1,4}-[0-9]{1,2}-[0-9A-Z:.]+Z/;
			for (var i = 0; i < timetracking.length; i++) {
				var currTrack = timetracking[i],
					startTime = currTrack.startTime,
					endTime = currTrack.endTime;

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

	this.openAddTimeTrackingWindow = (project = '') => {
		var features = "chrome,titlebar,centerscreen,dependent",
			windowVars = {
				ko: ko,
				timetracking: this,
				project: project
			};
		window.openDialog('chrome://timeTracking/content/addTimeTracking.xul', "addTimeTracking", features, windowVars);
	};
	
	this.openEditTimeTrackingWindow = (timetracking, index) => {
		var features = "chrome,titlebar,centerscreen,dependent",
			windowVars = {
				ko: ko,
				timetracking: timetracking,
				index: index,
			};
		window.openDialog('chrome://timeTracking/content/editTimeTracking.xul', "editTimeTracking", features, windowVars);
	};
	
	this.dateToYear = (date) => {
		return date.getFullYear();
	};
	
	this.dateToMonth = (date) => {
		var month = (date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
			
		return month;
	};
	
	this.dateToDay = (date) => {
		var day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate();
			
		return day;
	};
	
	this.dateToHours = (date) => {
		var hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours();
			
		return hours;
	};
	
	this.dateToMinutes = (date) => {
		var minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes();
			
		return minutes;
	};
	
	this.dateToSeconds = (date) => {
		var seconds = date.getSeconds().toString().length === 1 ? '0' + date.getSeconds() : date.getSeconds();
			
		return seconds;
	};

	window.addEventListener('load', self.init, false);
	window.addEventListener('project_opened', self.handleProjectChange, false);

}).apply(extensions.timeTracking);