var TimeTracking = {
	init: () => {
		document.getElementById('add').focus();
	},
	addTimeTracking: () => {
		var main = window.arguments[0],
			projectName = main.projectName,
			ko = main.ko,
			mainW = ko.windowManager.getMainWindow();
			
		mainW.extensions.timeTracking.openAddTimeTrackingWindow(projectName);
		window.close();
	},
};

window.addEventListener('load', TimeTracking.init, false);
