
var Stats = {
	init: () => {
		var main = window.parent.arguments[0],
			ko = main.ko,
			myExt = "TimeTracking@babobski.com";
			
		console.log('init');
			
		if (!('extensions' in	ko)) ko.extensions = {};
		if (!(myExt in ko.extensions)) ko.extensions[myExt] = {};
		if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
		var appData = ko.extensions[myExt].myapp;
		
		if (typeof appData.timeTracking !== 'undefined' && appData.timeTracking.length > 0) {
			Stats.buildTotalSatsList(appData.timeTracking);
		}
	},
	buildTotalSatsList: (timeTracking) => {
		var list = document.getElementById('total_day_list'),
			stats = Stats.getStats(timeTracking),
			build = Stats.buildEl;
		
		for (var i = 0; i < stats.length; i++) {
			var tr = build('tr'),
				td01 = build('td'),
				td02 = build('td'),
				td03 = build('td'),
				td04 = build('td');
			
			td01.innerHTML = stats[i].date;
			td02.innerHTML = stats[i].project;
			td03.innerHTML = stats[i].desc;
			td04.innerHTML = stats[i].displayDuration;
			
			tr.appendChild(td01);
			tr.appendChild(td02);
			tr.appendChild(td03);
			tr.appendChild(td04);
			list.appendChild(tr);
		}
	},
	getStats: (timeTracking) => {
		var results = [];
		for (var i = 0; i < timeTracking.length; i++) {
			var dateLabel = timeTracking[i].startTime.toLocaleDateString(),
				dateExist = Stats.dateExist(results, dateLabel),
				duration = Math.abs(timeTracking[i].endTime - timeTracking[i].startTime),
				project = timeTracking[i].title,
				description = timeTracking[i].description,
				listItem = {};
				
			if (dateExist >= 0) {
				results[dateExist].duration = results[dateExist].duration + duration;
				results[dateExist].displayDuration = Stats.displayDuration(results[dateExist].duration + duration);
				results[dateExist].desc = results[dateExist].desc + '<br>' + description;
				results[dateExist].project = results[dateExist].project + '<br>' + project;
			} else {
				listItem.date = dateLabel;
				listItem.project = project;
				listItem.duration = duration;
				listItem.displayDuration = Stats.displayDuration(duration);
				listItem.desc = description;
				results.push(listItem);
			}
		}
		return results;
	},
	dateExist: (list, needle) => {
		for (var i = 0; i < list.length; i++) {
			if (list[i].date === needle) {
				return i;
			}
		}
		return -1;
	},
	displayDuration: (duration) => {
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
	buildEl: (type) => {
		return document.createElement(type);
	}
};

window.addEventListener('DOMContentLoaded', Stats.init);