var TimeTracking = {
	addEndTime: false,
	init: () => {
		var main = window.arguments[0],
			project = main.project,
			mode = main.mode,
			timetracking = main.timetracking;
			
			id('project').focus();
			
			window.timeTracking = timetracking;
			
			switch (mode) {
				case 'add':
					if (project !== '') {
						id('project').value = project;
					}
					
					TimeTracking.setDate();
					break;
				case 'edit':
					TimeTracking.switchToEditMode();
					
					var timeTrack = main.timeTrack;
					TimeTracking.setDate(timeTrack);
					break;
			}
			
			TimeTracking.setTypes(main);
	},
	setTypes: (main) => {
		var prefs = main.prefs,
			ko = main.ko,
			types = prefs.getCharPref('trackingTypes'),
			typesArray = types.split(','),
			typesPopup = document.getElementById('type'),
			main2 = ko.windowManager.getMainWindow();
		
		if (typesArray.length > 0) {
			for (var i = 0; i < typesArray.length; i++) {
				typesPopup.appendItem(typesArray[i], typesArray[i]);
			}
		}
	},
	addTimeTracking: () => {
		var main = window.arguments[0],
			ko = main.ko,
			project = id('project'),
			description = id('description'),
			type = id('type'),
			startDay = id('daymonth'),
			startMonth = id('monthday'),
			startYear = id('year'),
			startHours = id('hours'),
			startMinutes = id('minutes'),
			startSeconds = id('seconds'),
			endDay = id('enddaymonth'),
			endMonth = id('endmonthday'),
			endYear = id('endyear'),
			endHours = id('endhours'),
			endMinutes = id('endminutes'),
			endSeconds = id('endseconds'),
			startDateTime,
			endDateTime,
			typeVal;
			
		var mainW = ko.windowManager.getMainWindow();
			
		startDateTime = TimeTracking.createDateTime(val(startDay), parseMonth(val(startMonth)), val(startYear), val(startHours), val(startMinutes), val(startSeconds));
		endDateTime = TimeTracking.createDateTime(val(endDay), parseMonth(val(endMonth)), val(endYear), val(endHours), val(endMinutes), val(endSeconds));
		
		typeVal = type.selectedItem !== null ? type.value : '';
		
		if (val(project) !== '' && val(description) !== '' && startDateTime instanceof Date) {
			if (TimeTracking.addEndTime && endDateTime instanceof Date) {
				mainW.extensions.timeTracking.addTimeTracking(val(project), val(description), typeVal, startDateTime, endDateTime, 'false');
				window.close();
			} else if (!TimeTracking.addEndTime) {
				mainW.extensions.timeTracking.addTimeTracking(val(project), val(description), typeVal, startDateTime, undefined, 'true');
				window.close();
			} 
		}
	},
	updateTimetracking: () => {
		var main = window.arguments[0],
			ko = main.ko,
			mainW = ko.windowManager.getMainWindow(),
			project = id('project'),
			description = id('description'),
			type = id('type'),
			startDay = id('daymonth'),
			startMonth = id('monthday'),
			startYear = id('year'),
			startHours = id('hours'),
			startMinutes = id('minutes'),
			startSeconds = id('seconds'),
			endDay = id('enddaymonth'),
			endMonth = id('endmonthday'),
			endYear = id('endyear'),
			endHours = id('endhours'),
			endMinutes = id('endminutes'),
			endSeconds = id('endseconds'),
			startDateTime,
			endDateTime,
			typeVal;
			
		startDateTime = TimeTracking.createDateTime(val(startDay), parseMonth(val(startMonth)), val(startYear), val(startHours), val(startMinutes), val(startSeconds));
		endDateTime = TimeTracking.createDateTime(val(endDay), parseMonth(val(endMonth)), val(endYear), val(endHours), val(endMinutes), val(endSeconds));
		
		typeVal = type.selectedItem !== null ? type.value : '';
		
		if (val(project) !== '' && val(description) !== '' && startDateTime instanceof Date) {
			
			var timetrack = {
				'title': val(project),
				'description': val(description),
				'type': typeVal,
				'startTime': startDateTime,
				'endTime': endDateTime,
				'running': main.mode === 'edit' ? main.timeTrack.running : 'true',
				'active': main.mode === 'edit' ? main.timeTrack.timeElapsed : 'true',
				'timeElapsed': main.mode === 'edit' ? main.timeTrack.timeElapsed : 0,
			};
			
			mainW.extensions.timeTracking.updateTimeTracking(timetrack, main.index);
			window.close();
		}
	},
	createDateTime: (day, month, year, hours, minutes, seconds) => {
		var newDate = new Date(year, month, day, hours, minutes, seconds);
		return newDate;
	},
	setDate: (timeTrack) => {
		timeTrack = timeTrack || undefined;
		var startDate = new Date(),
			endDate = null,
			project = id('project'),
			description = id('description'),
			type = id('type'),
			startDay = id('daymonth'),
			startMonth = id('monthday'),
			startYear = id('year'),
			startHours = id('hours'),
			startMinutes = id('minutes'),
			startSeconds = id('seconds'),
			timeTracking = window.timeTracking;
		
		
		if (timeTrack) {
			project.value = timeTrack.title;
			description.value = timeTrack.description;
			type.value = timeTrack.type;
			startDate = new Date(timeTrack.startTime);
			timeTracking.log(timeTrack.endTime);
			timeTracking.log(timeTrack.endTime.length);
			endDate = new Date(timeTrack.endTime);
		}
		
		startDay.value = timeTracking.dateToDay(startDate);
		startMonth.value = timeTracking.dateToMonth(startDate);
		startYear.value = timeTracking.dateToYear(startDate);
		startHours.value = timeTracking.dateToHours(startDate);
		startMinutes.value = timeTracking.dateToMinutes(startDate);
		startSeconds.value = timeTracking.dateToSeconds(startDate);
		
		if (endDate !== null) {
			setTimeout(() => {
				TimeTracking.showEndDate(endDate);
			}, 0);
		}
	},
	showEndDate: (enddate) => {
		enddate = enddate || new Date();
		var endDate = id('endDate'),
			endTime = id('endTime'),
			endhours = id('endhours'),
			endminutes = id('endminutes'),
			endseconds = id('endseconds'),
			endyear = id('endyear'),
			endmonth = id('endmonthday'),
			endday = id('enddaymonth');
			
		TimeTracking.addEndTime = true;
			
		endyear.value = timeTracking.dateToYear(enddate);
		endmonth.value = timeTracking.dateToMonth(enddate);
		endday.value = timeTracking.dateToDay(enddate);
		endhours.value = timeTracking.dateToHours(enddate);
		endminutes.value = timeTracking.dateToMinutes(enddate);
		endseconds.value = timeTracking.dateToSeconds(enddate);
		
		endDate.style.display = '-moz-box';
		endTime.style.display = '-moz-box';
		window.resizeTo(330, 263);
	},
	switchToEditMode: () => {
		id('titlebar').innerHTML = 'Edit Time Tracking';
		id('add').style.display = 'none';
		id('edit').style.display = '-moz-box';
	}
};

function parseMonth(month) {
	return (parseInt(month) - 1);
}

function id(name) {
	return document.getElementById(name);
}

function val(element) {
	if (element !== null && element.nodeName === 'textbox') {
		return element.value;
	}
	return null;
}

window.addEventListener('load', TimeTracking.init);