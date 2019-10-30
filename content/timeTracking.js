var TimeTracking = {
	addTimeTracking: () => {
		var main = window.arguments[0],
			projectName = main.projectName,
			ko = main.ko,
			mainW = ko.windowManager.getMainWindow();
			
		mainW.extensions.timeTracking.openAddTimeTrackingWindow(projectName);
		window.close();
	},
};
