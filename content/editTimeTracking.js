var TimeTracking = {
	init: () => {
		var main = window.arguments[0],
			ko = main.ko,
			timetracking = main.timetracking,
			project = document.getElementById('project'),
			description = document.getElementById('description'),
			startTime = document.getElementById('startTime'),
			endTime = document.getElementById('endTime');
			
		main.running = timetracking.running;
			
		project.value = timetracking.title;
		description.value = timetracking.description;
		startTime.value = timetracking.startTime;
		endTime.value = timetracking.endTime;
	},
	saveTimeTracking: () => {
		var main = window.arguments[0],
			ko = main.ko,
			mainW = ko.windowManager.getMainWindow();
		var project = document.getElementById('project'),
			desc = document.getElementById('description'),
			startTime = document.getElementById('startTime'),
			endTime = document.getElementById('endTime');
			
		if (project.value !== '' && desc.value !== '') {
			var timetrack = {
				'title': project.value,
				'description': desc.value,
				'startTime': new Date(startTime.value),
				'endTime': new Date(endTime.value),
				'running': main.running,
			};
			
			mainW.extensions.timeTracking.updateTimeTracking(timetrack, main.index);
		}
		window.close();
	},
};

window.addEventListener('load', TimeTracking.init);