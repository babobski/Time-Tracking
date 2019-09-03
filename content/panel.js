var inProgress  = false,
	currcount = 0,
	TimeTracking = {
	showTimeTracking: (force) => {
		force = force || false;
		var myExt = "TimeTracking@babobski.com";
		
		if (!('extensions' in	ko)) ko.extensions = {};
		if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
		if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
		
		var appData = ko.extensions[myExt].myapp;
		if (typeof appData.timeTracking !== 'undefined' && (appData.timeTracking.length > currcount || appData.timeTracking.length < currcount || force)) {
			TimeTracking.buildTimeTrackingList(appData.timeTracking);
			currcount = appData.timeTracking.length;
		}
		return false;
	},
	buildTimeTrackingList: (timeTracking) => {
		var list = document.getElementById('timetrackingList');
		
		list.innerHTML = '';
		for (var i = 0; i < timeTracking.length; i++) {
			var timeTrack = timeTracking[i],
				newTreeItem = document.createElement('treeitem'),
				treeRow = document.createElement('treerow'),
				projectCell = document.createElement('treecell'),
				descCell = document.createElement('treecell'),
				startDateCell = document.createElement('treecell');
				endDateCell = document.createElement('treecell');
				durationCell = document.createElement('treecell');
				
			projectCell.setAttribute('label', timeTrack.title);
			descCell.setAttribute('label', timeTrack.description);
			startDateCell.setAttribute('label', timeTrack.startTime);
			endDateCell.setAttribute('label', timeTrack.endTime);
			if (Object.prototype.toString.call(timeTrack.startTime) === '[object Date]' && Object.prototype.toString.call(timeTrack.endTime) === '[object Date]') {	
				durationCell.setAttribute('label', TimeTracking.msToTime(timeTrack.endTime - timeTrack.startTime));
			} else {
				durationCell.setAttribute('label', '...');
			}
			
			treeRow.appendChild(projectCell);
			treeRow.appendChild(descCell);
			treeRow.appendChild(startDateCell);
			treeRow.appendChild(endDateCell);
			treeRow.appendChild(durationCell);
			
			newTreeItem.appendChild(treeRow);
			list.appendChild(newTreeItem);
		}
	},
	clearTimeTracking: () => {
		var myExt = "TimeTracking@babobski.com",
			mainW = ko.windowManager.getMainWindow();
		
		inProgress = true;
		
		if (!('extensions' in	ko)) ko.extensions = {};
		if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
		if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
		var appData = ko.extensions[myExt].myapp;
		
		mainW.extensions.timeTracking.saveTimeTracking();
		appData.timeTracking = [];
		TimeTracking.buildTimeTrackingList([]);
		
		inProgress = false;
	},
	addTimeTracking: () => {
		var mainW = ko.windowManager.getMainWindow();
		mainW.extensions.timeTracking.openAddTimeTrackingWindow();
	},
	stopTimeTracking: () => {
		var myExt = "TimeTracking@babobski.com",
			mainW = ko.windowManager.getMainWindow();
		
		inProgress = true;
		
		if (!('extensions' in	ko)) ko.extensions = {};
		if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
		if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
		
		var appData = ko.extensions[myExt].myapp;
		if (typeof appData.timeTracking !== 'undefined' && appData.timeTracking.length > 0) {
			var lastItem = appData.timeTracking.pop();
			if (lastItem.running === 'true') {
				lastItem.running = 'false';
			}
			appData.timeTracking.push(lastItem);
		}
		
		mainW.extensions.timeTracking.saveTimeTracking(appData.timeTracking);
		
		inProgress = false;
	},
	updateActiveTimer: () => {
		var myExt = "TimeTracking@babobski.com",
			mainW = ko.windowManager.getMainWindow();
		
		if (inProgress) return false;
		
		if (!('extensions' in	ko)) ko.extensions = {};
		if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
		if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
		
		var appData = ko.extensions[myExt].myapp;
		if (typeof appData.timeTracking !== 'undefined' && appData.timeTracking.length > 0) {
			var lastItem = appData.timeTracking.pop();
			if (lastItem.running === 'true') {
				lastItem.endTime = new Date();
			}
			appData.timeTracking.push(lastItem);
		}
		TimeTracking.showTimeTracking(true);
		mainW.extensions.timeTracking.saveTimeTracking(appData.timeTracking);
	},
	msToTime: (duration) => {
		var milliseconds = parseInt((duration % 1000) / 100),
			seconds = Math.floor((duration / 1000) % 60),
			minutes = Math.floor((duration / (1000 * 60)) % 60),
			hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;

		return hours + ":" + minutes + ":" + seconds;
	},
	displayDate: (date) => {
		var minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes(),
			hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours(),
			day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate(),
			month = (date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
			fulldate = day + "/" + month + "/" + date.getFullYear(),
			datetime = hours + ":" + minutes + " - " + fulldate;
			
		return datetime;
	}
};

window.setInterval(() => {
	TimeTracking.showTimeTracking();
	TimeTracking.updateActiveTimer();
}, 1000);