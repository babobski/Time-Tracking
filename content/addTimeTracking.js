var TimeTracking = {
	addEndTime: false,
	init: () => {
		var main = window.arguments[0],
			project = main.project,
			timetracking = main.timetracking;
			
			if (project !== '') {
				id('project').value = project;
			}
			
			window.timeTracking = timetracking;
			TimeTracking.setDate(timetracking);
	},
	addTimeTracking: () => {
		var main = window.arguments[0],
			ko = main.ko,
			project = id('project'),
			description = id('description'),
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
			endDateTime;
			
		startDateTime = TimeTracking.createDateTime(val(startDay), parseMonth(val(startMonth)), val(startYear), val(startHours), val(startMinutes), val(startSeconds));
		endDateTime = TimeTracking.createDateTime(val(endDay), parseMonth(val(endMonth)), val(endYear), val(endHours), val(endMinutes), val(endSeconds));
		
		if (val(project) !== '' && val(description) !== '' && startDateTime instanceof Date) {
			var mainW = ko.windowManager.getMainWindow();
			if (TimeTracking.addEndTime && endDateTime instanceof Date) {
				mainW.extensions.timeTracking.addTimeTracking(val(project), val(description), startDateTime, endDateTime, 'false');
				window.close();
			} else if (!TimeTracking.addEndTime) {
				mainW.extensions.timeTracking.addTimeTracking(val(project), val(description), startDateTime, undefined, 'true');
				window.close();
			} else {
				alert('exeption');
			}
		}
	},
	createDateTime: (day, month, year, hours, minutes, seconds) => {
		var newDate = new Date(year, month, day, hours, minutes, seconds);
		return newDate;
	},
	setDate: (timeTracking) => {
		var startDate = new Date(),
			year = id('year'),
			month = id('monthday'),
			day = id('daymonth'),
			hours = id('hours'),
			minutes = id('minutes'),
			seconds = id('seconds'),
			endyear = id('endyear'),
			endmonth = id('endmonthday'),
			endday = id('enddaymonth'),
			timeTracking = window.timeTracking;
			
		year.value = timeTracking.dateToYear(startDate);
		month.value = timeTracking.dateToMonth(startDate);
		day.value = timeTracking.dateToDay(startDate);
		endyear.value = timeTracking.dateToYear(startDate);
		endmonth.value = timeTracking.dateToMonth(startDate);
		endday.value = timeTracking.dateToDay(startDate);
		hours.value = timeTracking.dateToHours(startDate);
		minutes.value = timeTracking.dateToMinutes(startDate);
		seconds.value = timeTracking.dateToSeconds(startDate);
	},
	showEndDate: () => {
		var endDate = id('endDate'),
			endTime = id('endTime'),
			enddate = new Date(),
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
		window.resizeTo(330, 250);
	}
};

function parseMonth(month) {
	return (parseInt(month) - 1);
}

function id(name) {
	return document.getElementById(name);
}

function val(element) {
	console.log(element);
	if (element !== null && element.nodeName === 'textbox') {
		return element.value;
	}
	return null;
}

window.addEventListener('load', TimeTracking.init);