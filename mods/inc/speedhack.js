// speedhack.js : game speed multiplier and timeskips

// you may use this script by adding `<script src="https://dimava.github.io/mods/inc/speedhack.js"></script>` to index.html
// or putting a local copy of it next to index.html and adding `<script src="speedhack.js"></script>`
// https: version has autoupdates, but local version is more safe in case you don't trust me because it has no autoupdates

// multipliers to toggle with `[` / `]` bracket keys
Date.timeMultipliers = [0.01, 0.05, 0.25, 1, 2, 5, 10, 20];
// keybindings are modified here
Date.keybinds = {
	// bracket keys change speedhack speed
	'[': 'x--', ']': 'x++', // --/++ means 'prev'/'next' of Date.timeMultipliers
	// number keys do timeskip (in seconds)
	1: '+10', 2: '+20', 3: '+60', 4: '+300', // if over 600 game will reload
}
// optional: start speedhack when game starts
// x20 is over the cap so wil work as 'max'
// setTimeout(() => Date.speedhack(5));





// pooplib
var q = s => document.querySelector(s);
var makeStyle = (s, e) => (e = document.createElement('style'), e.innerHTML = s, document.head.append(e), e);


Date.prototype._getTime = Date.prototype._getTime || Date.prototype.getTime;

Date.timeAtStart = (new Date()).getTime();
Date.realtimeAtStart = (new Date())._getTime();
Date.deltaTime = 0;
Date.timeMulti = 1;

Date.prototype.getTime = function () {
	let timeSince = this._getTime() - Date.realtimeAtStart;
	return Math.round(Date.timeAtStart + timeSince * Date.timeMulti + Date.deltaTime);
}

Date.timeskip = function (seconds = 10) {
	return Date.deltaTime += seconds * 1000;
}
Date.speedhack = function (speed = 2) {
	if (speed == null) return;
	Date.timeAtStart = (new Date()).getTime();
	Date.realtimeAtStart = (new Date())._getTime();
	Date.deltaTime = 0;
	let i = document.querySelector('.fa-clock');
	if (i) {
		i.style.cssText = '-webkit-text-stroke-width:0'
		i.innerText = 'x' + speed;
	}
	return Date.timeMulti = speed;
}
addEventListener('keydown', event => {
	let prefix = `${event.ctrlKey ? '<' : ''}${event.shiftKey ? '^' : ''}`;
	let keybind = Date.keybinds[prefix + event.code] || Date.keybinds[prefix + event.key];
	if (!keybind) return;
	if (keybind.startsWith('+')) {
		Date.timeskip(parseFloat(keybind));
	}
	if (keybind.startsWith('x')) {
		if (keybind == 'x--') {
			Date.speedhack(Date.timeMultipliers[Date.timeMultipliers.indexOf(Date.timeMulti) - 1]);
		} else if (keybind == 'x++') {
			Date.speedhack(Date.timeMultipliers[Date.timeMultipliers.indexOf(Date.timeMulti) + 1]);
		} else {
			Date.speedhack(parseFloat(keybind.slice(1)));
		}
	}
});


// settings, keybondings and descriptions are in the top of this file