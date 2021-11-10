// I will expland this to "How to speedhack in any web game which uses Date for timing"

// First of all we should save a way to get the correct time, the current state, and add some varuables for future time modification
Date.prototype._getTime = Date.prototype._getTime || Date.prototype.getTime;
Date._now = Date._now || Date.now;
Date.timeAtStart = Date.now();
Date.realtimeAtStart = Date._now();
Date.deltaTime = 0;
Date.timeMulti = 1;
// Then we should override all the methods which converts Date into a number. Don't forget rounding, some games will error if the time is not an integer as it should be.
Date.prototype.getTime = function() {
    let realtimeSince = this._getTime() - Date.realtimeAtStart;
    let timeSince = realtimeSince * Date.timeMulti + Date.deltaTime;
    return Math.round(Date.timeAtStart + timeSince);
}
Date.valueOf = function() { return this.getTime(); }
Date.now = function() { return new Date().getTime(); }
// Then lets make functions to modify the time: time jump and speedhack. To make a clear way to see speedhack time multiplier, we'll push it into site url
Date.timeskip = function (seconds = 10) {
    Date.deltaTime += seconds * 1000;
}
Date.speedhack = function (speed = 2) {
    Date.timeAtStart = Date.now();
    Date.realtimeAtStart = Date._now();
    Date.deltaTime = 0;
    location.hash = 'x' + speed;
    Date.timeMulti = speed;
}
// To be able to use all of this outside the console, lets make some keybindings
if (!Date._hasKeydownListener)
    addEventListener('keydown', event => {
        let fn = Date.kds[event.code] || Date.kds[event.key];
        if (fn) {
            fn(event);
            event.stopPropagation();
        }
}, true);
Date._hasKeydownListener= true;
Date.timeMultis = [1, 2, 5, 10, 20, 60];
Date.kds = {
    // number keys skip time
    1: () => Date.timeskip(10),
    2: () => Date.timeskip(30),
    3: () => Date.timeskip(1 * 60), // one minute
    4: () => Date.timeskip(5 * 60),
    5: () => Date.timeskip(15 * 60),
    6: () => Date.timeskip(60 * 60), // one hour
    // bracket keys do speedhack
    "[": () => {
        let speed = Date.timeMultis[Date.timeMultis.indexOf(Date.timeMulti)-1];
        if (speed) Date.speedhack(speed);
    },
    "]": () => {
        let speed = Date.timeMultis[Date.timeMultis.indexOf(Date.timeMulti)+1];
        if (speed) Date.speedhack(speed);
    },
}
// - number keys skip time, . You will want to change those for the games with colliding keybinds.
// Note, however, that timejumps work properly only in games with inplemented offline time.
