var TimeTracking = {
	addTimeTracking: () => {
		var main = window.arguments[0],
			ko = main.ko;
		var project = document.getElementById('project'),
			desc = document.getElementById('description'),
			startTime = document.getElementById('startTime'),
			endTime = document.getElementById('endTime');
			
		if (project.value !== '' && desc.value !== '') {
			var mainW = ko.windowManager.getMainWindow();
			if (startTime.value === '' && endTime.value === '') {
				mainW.extensions.timeTracking.addTimeTracking(project.value, desc.value, undefined, undefined, 'true');
			} else if (endTime.value === '' && startTime.value !== '') {
				mainW.extensions.timeTracking.addTimeTracking(project.value, desc.value, new Date(startTime.value), undefined, 'true');
			} else if (endTime.value !== '' && startTime.value !== '') {	
				mainW.extensions.timeTracking.addTimeTracking(project.value, desc.value, new Date(startTime.value), new Date(endTime.value), 'false');
			}
			window.close();
		}
	},
	setDate: () => {
		var startDate = document.getElementById('startTime');
		startDate.value = new Date();
	}
};

window.addEventListener('load', TimeTracking.setDate);