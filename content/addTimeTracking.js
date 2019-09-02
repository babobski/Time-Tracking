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
			} else if (endTime.value === '') {
				mainW.extensions.timeTracking.addTimeTracking(project.value, desc.value, startTime.value, undefined, 'true');
			} else {	
				mainW.extensions.timeTracking.addTimeTracking(project.value, desc.value, startTime.value, endTime.value, 'false');
			}
			window.close();
		}
	}
}