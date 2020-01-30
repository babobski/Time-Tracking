var inProgress  = false,
	currcount = 0,
	TimeTracking = {
	showTimeTracking: () => {
		var myExt = "TimeTracking@babobski.com";
		
		if (!('extensions' in	ko)) ko.extensions = {};
		if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
		if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
		
		var appData = ko.extensions[myExt].myapp;
		var force = appData.force;
		if (typeof appData.timeTracking !== 'undefined' && (appData.timeTracking.length > currcount || appData.timeTracking.length < currcount || force)) {
			TimeTracking.buildTimeTrackingList(appData.timeTracking);
			TimeTracking.disableItemButtons();
			currcount = appData.timeTracking.length;
			appData.force = false;
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
			startDateCell.setAttribute('label', TimeTracking.displayDate(timeTrack.startTime));
			startDateCell.setAttribute('data-time', timeTrack.startTime);
			endDateCell.setAttribute('label', TimeTracking.displayDate(timeTrack.endTime));
			endDateCell.setAttribute('data-time', timeTrack.endTime);
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
	editTimeTracking: () => {
		var myExt = "TimeTracking@babobski.com",
			Tree = document.getElementById('timetrackingTree'),
			view = Tree.view,
			selection = view.selection;
			
		if (!('extensions' in	ko)) ko.extensions = {};
		if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
		if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
		var appData = ko.extensions[myExt].myapp;
		
		if (selection.count > 0) {
			var currItem = appData.timeTracking[selection.currentIndex];
			var mainW = ko.windowManager.getMainWindow();
			mainW.extensions.timeTracking.openEditTimeTrackingWindow(currItem, selection.currentIndex);
		}
	},
	removeTimeTracking: () => {
		var myExt = "TimeTracking@babobski.com",
			Tree = document.getElementById('timetrackingTree'),
			view = Tree.view,
			selection = view.selection;
			
		if (!('extensions' in	ko)) ko.extensions = {};
		if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
		if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
		var appData = ko.extensions[myExt].myapp;
		
		if (selection.count > 0) {
			var mainW = ko.windowManager.getMainWindow();
			appData.timeTracking.splice(selection.currentIndex, 1);
			appData.force = true;
			mainW.extensions.timeTracking.saveTimeTracking(currItem, selection.currentIndex);
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
		var mainW = ko.windowManager.getMainWindow();
		mainW.extensions.timeTracking.stopTimeTracking();
	},
	resumeTimeTracking: () => {
		var myExt = "TimeTracking@babobski.com",
			mainW = ko.windowManager.getMainWindow(),
			Tree = document.getElementById('timetrackingTree'),
			view = Tree.view,
			selection = view.selection;
			
		if (!('extensions' in	ko)) ko.extensions = {};
		if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
		if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
		var appData = ko.extensions[myExt].myapp;
		
		if (typeof appData.timeTracking !== 'undefined' && appData.timeTracking.length > 0 && selection.count > 0) {
			var selectedItem = appData.timeTracking.slice(selection.currentIndex, selection.currentIndex+1);
			var newTimeTrack = {
				'title': selectedItem[0].title,
				'description': selectedItem[0].description,
				'startTime': new Date(),
				'endTime': new Date(),
				'running': 'true',
				'active': 'true',
				'timeElapsed': 0,
			};
			appData.timeTracking.push(newTimeTrack);
		}
		
		mainW.extensions.timeTracking.saveTimeTracking(appData.timeTracking);
		
		inProgress = false;
	},
	updateActiveTimer: () => {
		var myExt = "TimeTracking@babobski.com",
			mainW = ko.windowManager.getMainWindow(),
			treeChildren = id('timetrackingList');
		
		if (inProgress) return false;
		
		if (!('extensions' in	ko)) ko.extensions = {};
		if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
		if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
		
		var appData = ko.extensions[myExt].myapp;
		var newDate = new Date();
		if (typeof appData.timeTracking !== 'undefined' && appData.timeTracking.length > 0) {
			var lastItem = appData.timeTracking.pop();
			if (lastItem.running === 'true') {
				lastItem.endTime = newDate;
				if (treeChildren.childElementCount > 0) {
					var lastTreeItem = treeChildren.childNodes[(treeChildren.childElementCount - 1)],
						lastTreeRow = lastTreeItem.childNodes[0],
						startDateCell = lastTreeRow.childNodes[(lastTreeRow.childElementCount - 3)],
						endDateCell = lastTreeRow.childNodes[lastTreeRow.childElementCount - 2],
						durationCell = lastTreeRow.childNodes[lastTreeRow.childElementCount - 1],
						startDate = new Date(startDateCell.getAttribute('data-time'));
					
					endDateCell.setAttribute('label', TimeTracking.displayDate(newDate));
					durationCell.setAttribute('label', TimeTracking.msToTime(newDate - startDate));
					endDateCell.setAttribute('data-time', newDate);
				}
			}
			appData.timeTracking.push(lastItem);
		}
		
		mainW.extensions.timeTracking.saveTimeTracking(appData.timeTracking);
	},
	msToTime: (duration) => {
		var seconds = Math.floor((duration / 1000) % 60),
			minutes = Math.floor((duration / (1000 * 60)) % 60),
			hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
			days = Math.floor(duration / (1000 * 60 * 60 * 24)),
			pad = function(n) {
				return n < 10 ? '0' + n : n;
			},
			display = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
			
		if (days > 0) {
			return days + "d " + display;
		}

		return display;
	},
	displayDate: (date) => {
		var minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes(),
			hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours(),
			day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate(),
			month = (date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
			fulldate = day + "/" + month + "/" + date.getFullYear(),
			datetime = hours + ":" + minutes + " - " + fulldate;
			
		return datetime;
	},
	enableDisableButtons: (tree) => {
		var view = tree.view,
			selection = view.selection;
			
		if (selection.count > 0) {
			TimeTracking.eneableItemButtons();
		} else {
			TimeTracking.disableItemButtons();
		}
	},
	eneableItemButtons: () => {
		var removeBtn = id('removeTimeTracking'),
			editBtn = id('editTimeTracking'),
			resumeBtn = id('resumeTimeTracking');
		
		removeBtn.removeAttribute('disabled');
		editBtn.removeAttribute('disabled');
		resumeBtn.removeAttribute('disabled');
	},
	disableItemButtons: () => {
		var removeBtn = id('removeTimeTracking'),
			editBtn = id('editTimeTracking'),
			resumeBtn = id('resumeTimeTracking');
		
		removeBtn.setAttribute('disabled', true);
		editBtn.setAttribute('disabled', true);
		resumeBtn.setAttribute('disabled', true);
	},
};

function id(name) {
	return document.getElementById(name);
}

window.setInterval(() => {
	TimeTracking.showTimeTracking();
	TimeTracking.updateActiveTimer();
}, 1000);