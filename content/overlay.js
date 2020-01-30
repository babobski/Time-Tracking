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
		.getService(Components.interfaces.nsIPrefService).getBranch("ko.extensions.timeTracking."),
		observerSvc = Components.classes["@mozilla.org/observer-service;1"].
		getService(Components.interfaces.nsIObserverService);

	if (!('ko.extensions' in ko)) ko.extensions = {};
	var myExt = "TimeTracking@babobski.com";
	if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
	if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
	var appData = ko.extensions[myExt].myapp;
	
	appData.force = false;

	window.removeEventListener('load', self.init, false);
	window.removeEventListener('project_opened', self.handleProjectChange, false);

	this.addTimeTracking = (title, description, startTime, endTime, running = 'true', active = 'true') => {
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
			'active': active,
			'timeElapsed': 0,
		};

		if (typeof appData.timeTracking !== 'undefined') {
			appData.timeTracking.push(timeTrack);
		} else {
			appData.timeTracking = [];
			appData.timeTracking.push(timeTrack);
		}

		prefs.setCharPref('timetracking', JSON.stringify(appData.timeTracking));
	};
	
	this.stopTimeTracking = (active = true) => {
		if (typeof appData.timeTracking !== 'undefined' && appData.timeTracking.length > 0) {
			var lastItem = appData.timeTracking.pop();
			if (lastItem.running === 'true') {
				lastItem.running = 'false';
				lastItem.timeElapsed = lastItem.timeElapsed + (new Date(lastItem.endTime) - new Date(lastItem.startTime));
			}
			if (active && lastItem.active === 'true') {
				lastItem.active = 'false';
			}
			appData.timeTracking.push(lastItem);
			appData.force = true;
			
			this.saveTimeTracking(appData.timeTracking);
		}
	};
	
	this.updateTimeTracking = (timeTracking, index) => {
		appData.timeTracking[index] = timeTracking;
		appData.force = true;
		self.saveTimeTracking(appData.timeTracking);
	};
	
	this.log = (mssg) => {
		console.log(mssg);
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
		
		var features = "chrome,titlebar,centerscreen,dependent,modal",
			currentProject = ko.projects.manager.currentProject;
			windowVars = {
				ko: ko,
				timetracking: this,
				projectName: (currentProject !== null ? currentProject.name.replace('.komodoproject', '') : '')
			};
		window.openDialog('chrome://timeTracking/content/timeTracking.xul', "timeTracking", features, windowVars);
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
				
				if (currTrack.active === 'true' && currTrack.running === 'false') {
					var askContinueRunning = ko.dialogs.yesNo('A time track was active when closing komodo, do you want to track the time komodo was closed?');
					if (askContinueRunning === 'Yes') {
						currTrack.running = 'true';
					} else {
						currTrack.active = 'false';
					}
				}

				parsedTimeTracking.push(currTrack);
			}
			appData.timeTracking = parsedTimeTracking;
		}
	};
	
	this.shutDown = () => {
		self.stopTimeTracking(false);
	};

	this.openAddTimeTrackingWindow = (project = '') => {
		var features = "chrome,titlebar,centerscreen,dependent,modal",
			windowVars = {
				ko: ko,
				timetracking: this,
				project: project,
				mode: 'add'
			};
		window.openDialog('chrome://timeTracking/content/addTimeTracking.xul', "addTimeTracking", features, windowVars);
	};
	
	this.openEditTimeTrackingWindow = (timeTrack, index) => {
		var features = "chrome,titlebar,centerscreen,dependent,modal",
			windowVars = {
				ko: ko,
				timetracking: this,
				timeTrack: timeTrack,
				index: index,
				project: null,
				mode: 'edit'
			};
		window.openDialog('chrome://timeTracking/content/addTimeTracking.xul', "addTimeTracking", features, windowVars);
	};
	
	this.openSettingsWindow = () => {
		var features = "chrome,centerscreen,dependent";
		window.openDialog('chrome://timeTracking/content/pref-overlay.xul', "openTimeTrackingSettings", features);
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
	
	this._addDynamicToolbarButton = () => {
		const db = require('ko/dynamic-button');
		var isView = () => {
			return ko.views.manager.currentView;
		};
		
		const button = db.register({
			label: "Time Tracking",
			tooltip: "Time Tracking",
			icon: "clock-o",
			menuitems: [
				{
					label: "Add Time Tracking",
					name: "addTimeTrack",
					command: () => {
						extensions.timeTracking.openAddTimeTrackingWindow();
					}
				},
				{
					label: "Stop Time Tracking",
					name: "stopTimeTrack",
					command: () => {
						extensions.timeTracking.stopTimeTracking();
					}
				},
				{
					label: "Settings",
					name: "openSettings",
					command: () => {
						extensions.timeTracking.openSettingsWindow();
					}
				},
			],
			isEnabled: () => {
				return true;
			},
		});
	};
	
	self._addDynamicToolbarButton();

	window.addEventListener('load', self.init, false);
	window.addEventListener('project_opened', self.handleProjectChange, false);
	observerSvc.addObserver(self.shutDown, "quit-application-requested", false);

}).apply(extensions.timeTracking);