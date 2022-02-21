var PoopJs;
(function (PoopJs) {
    let PromiseExtension;
    (function (PromiseExtension) {
        /**
         * Creates unwrapped promise
         */
        function empty() {
            let resolve;
            let reject;
            return Object.assign(new Promise((r, j) => {
                resolve = r;
                reject = j;
            }), {
                resolve, reject,
                r: resolve, j: reject,
            });
        }
        PromiseExtension.empty = empty;
        async function frame(n = 1) {
            while (--n > 0) {
                await new Promise(requestAnimationFrame);
            }
            return new Promise(requestAnimationFrame);
        }
        PromiseExtension.frame = frame;
    })(PromiseExtension = PoopJs.PromiseExtension || (PoopJs.PromiseExtension = {}));
})(PoopJs || (PoopJs = {}));
/// <reference path="./Promise.ts" />
var PoopJs;
(function (PoopJs) {
    let ArrayExtension;
    (function (ArrayExtension) {
        async function pmap(mapper, threads = 5) {
            if (!(threads > 0))
                throw new Error();
            let tasks = this.map((e, i, a) => [e, i, a]);
            let results = Array(tasks.length);
            let anyResolved = PoopJs.PromiseExtension.empty();
            let freeThreads = threads;
            async function runTask(task) {
                try {
                    return await mapper(...task);
                }
                catch (err) {
                    return err;
                }
            }
            async function run(task) {
                freeThreads--;
                results[task[1]] = await runTask(task);
                freeThreads++;
                let oldAnyResolved = anyResolved;
                anyResolved = PoopJs.PromiseExtension.empty();
                oldAnyResolved.r(undefined);
            }
            for (let task of tasks) {
                if (freeThreads == 0) {
                    await anyResolved;
                }
                run(task);
            }
            while (freeThreads < threads) {
                await anyResolved;
            }
            return results;
        }
        ArrayExtension.pmap = pmap;
        function map(length, mapper = i => i) {
            return this(length).fill(0).map((e, i, a) => mapper(i));
        }
        ArrayExtension.map = map;
        function vsort(mapper, sorter = (a, b) => a - b) {
            let theSorter = typeof sorter == 'function' ? sorter : (a, b) => b - a;
            return this
                .map((e, i, a) => ({ e, v: mapper(e, i, a) }))
                .sort((a, b) => theSorter(a.v, b.v, a.e, b.e))
                .map(e => e.e);
        }
        ArrayExtension.vsort = vsort;
        class PMap {
            /** Original array */
            source = [];
            /** Async element converter function */
            mapper = (e) => e;
            /** Max number of requests at once.
             *  *May* be changed in runtime */
            threads = 5;
            /** Max distance between the olders incomplete and newest active elements.
             *  *May* be changed in runtime */
            window = Infinity;
            /** Unfinished result array */
            results = [];
            /** Promises for every element */
            requests = [];
            beforeStart = () => { };
            afterComplete = () => { };
            /** Length of the array */
            length = -1;
            /** The number of elements finished converting */
            completed = -1;
            /** Threads currently working
             *  in the mapper function: including the current one */
            activeThreads = -1;
            lastStarted = -1;
            allTasksDone;
            anyTaskResolved;
            constructor(source) {
                this.allTasksDone = Object.assign(this.emptyResult(), { pmap: this });
                this.anyTaskResolved = this.emptyResult();
                for (let k of Object.keys(this)) {
                    if (typeof source[k] == typeof this[k]) {
                        this[k] = source[k];
                    }
                    else if (source[k]) {
                        throw new Error(`PMap: invalid constructor parameter: property ${k}: expected ${typeof this[k]}, but got ${typeof source[k]}`);
                    }
                }
            }
            async startTask(arrayIndex) {
                this.activeThreads++;
                let e = this.source[arrayIndex];
                await this.beforeStart({
                    e: this.source[arrayIndex],
                    i: arrayIndex,
                    a: this.source,
                    v: undefined,
                    r: this.results,
                    pmap: this,
                });
                this.lastStarted = arrayIndex;
                let v;
                try {
                    v = await this.mapper(this.source[arrayIndex], arrayIndex, this.source, this);
                }
                catch (e) {
                    v = e;
                }
                this.results[arrayIndex] = v;
                this.requests[arrayIndex].resolve(v);
                this.completed++;
                await this.afterComplete({
                    e: this.source[arrayIndex],
                    i: arrayIndex,
                    a: this.source,
                    v: v,
                    r: this.results,
                    pmap: this,
                });
                this.activeThreads--;
                this.anyTaskResolved.resolve();
            }
            async run_internal() {
                for (let arrayIndex = 0; arrayIndex < this.length; arrayIndex++) {
                    while (this.activeThreads >= this.threads) {
                        await this.anyTaskResolved;
                        this.anyTaskResolved = this.emptyResult();
                    }
                    await this.requests[arrayIndex - this.window];
                    this.startTask(arrayIndex);
                }
                while (this.activeThreads > 0) {
                    await this.anyTaskResolved;
                    this.anyTaskResolved = this.emptyResult();
                }
                this.allTasksDone.resolve(this.results);
                return this.allTasksDone;
            }
            run() {
                this.prepare();
                this.run_internal();
                return this.allTasksDone;
            }
            pause() {
                if (this.activeThreads < this.length + this.threads)
                    this.activeThreads += this.length + this.threads;
            }
            unpause() {
                if (this.activeThreads >= this.length + this.threads)
                    this.activeThreads -= this.length + this.threads;
                this.anyTaskResolved.r();
            }
            cancel() {
                this.mapper = (() => { });
                this.beforeStart = () => { };
                this.afterComplete = () => { };
            }
            prepare() {
                if (this.length == -1)
                    this.length = this.source.length;
                if (this.results.length == 0) {
                    this.results = Array(this.length);
                }
                if (this.requests.length == 0) {
                    this.requests = this.source.map(e => this.emptyResult());
                }
                if (this.completed < 0)
                    this.completed = 0;
                if (this.activeThreads < 0)
                    this.activeThreads = 0;
                if (this.lastStarted < -1)
                    this.lastStarted = -1;
                this.anyTaskResolved = this.emptyResult();
                Object.assign(this.allTasksDone, { pmap: this });
                return this;
            }
            emptyResult() {
                let resolve;
                let reject;
                let p = new Promise((r, j) => {
                    resolve = r;
                    reject = j;
                });
                return Object.assign(p, { resolve, reject, r: resolve, j: reject });
            }
            static this_pmap(mapper, options = {}) {
                if (options == true)
                    options = Infinity;
                if (typeof options == 'number')
                    options = { threads: options };
                let pmap = new PMap({ source: this, mapper, ...options });
                return pmap.run();
            }
            static pmap(array, mapper, options = {}) {
                if (options == true)
                    options = Infinity;
                if (typeof options == 'number')
                    options = { threads: options };
                let pmap = new PMap({ source: array, mapper, ...options });
                return pmap.run();
            }
        }
        ArrayExtension.PMap = PMap;
    })(ArrayExtension = PoopJs.ArrayExtension || (PoopJs.ArrayExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let DateNowHack;
    (function (DateNowHack) {
        DateNowHack.speedMultiplier = 1;
        DateNowHack.deltaOffset = 0;
        DateNowHack.startRealtime = 0;
        DateNowHack.startTime = 0;
        // export let speedMultiplier = 1;
        DateNowHack.performanceDeltaOffset = 0;
        DateNowHack.performanceStartRealtime = 0;
        DateNowHack.performanceStartTime = 0;
        DateNowHack.usedMethods = {
            date: true,
            performance: true,
        };
        function toFakeTime(realtime) {
            if (!DateNowHack.usedMethods.date)
                return realtime;
            return Math.floor((realtime - DateNowHack.startRealtime) * DateNowHack.speedMultiplier + DateNowHack.startTime + DateNowHack.deltaOffset);
        }
        DateNowHack.toFakeTime = toFakeTime;
        function toPerformanceFakeTime(realtime) {
            if (!DateNowHack.usedMethods.performance)
                return realtime;
            return (realtime - DateNowHack.performanceStartRealtime) * DateNowHack.speedMultiplier
                + DateNowHack.performanceStartTime + DateNowHack.performanceDeltaOffset;
        }
        DateNowHack.toPerformanceFakeTime = toPerformanceFakeTime;
        DateNowHack.bracketSpeeds = [0.05, 0.25, 1, 2, 5, 10, 20, 60, 120];
        function speedhack(speed = 1) {
            if (typeof speed != 'number') {
                throw new Error(`DateNowHack: invalid speed: ${speed}`);
            }
            activate();
            activatePerformance();
            DateNowHack.speedMultiplier = speed;
            location.hash = speed + '';
        }
        DateNowHack.speedhack = speedhack;
        function timejump(seconds) {
            activate();
            activatePerformance();
            DateNowHack.deltaOffset += seconds * 1000;
        }
        DateNowHack.timejump = timejump;
        function switchSpeedhack(dir) {
            let currentIndex = DateNowHack.bracketSpeeds.indexOf(DateNowHack.speedMultiplier);
            if (currentIndex == -1)
                currentIndex = DateNowHack.bracketSpeeds.indexOf(1);
            let newSpeed = DateNowHack.bracketSpeeds[currentIndex + dir];
            if (newSpeed == undefined)
                return false;
            speedhack(newSpeed);
        }
        DateNowHack.switchSpeedhack = switchSpeedhack;
        function onkeydown(event) {
            if (event.code == 'BracketLeft') {
                switchSpeedhack(-1);
            }
            if (event.code == 'BracketRight') {
                switchSpeedhack(1);
            }
        }
        function bindBrackets(mode = 'on') {
            removeEventListener('keydown', onkeydown);
            if (mode == 'on') {
                addEventListener('keydown', onkeydown);
            }
        }
        DateNowHack.bindBrackets = bindBrackets;
        DateNowHack.activated = false;
        function activate() {
            Date._now ??= Date.now;
            Date.prototype._getTime ??= Date.prototype.getTime;
            DateNowHack.startTime = Date.now();
            DateNowHack.startRealtime = Date._now();
            DateNowHack.deltaOffset = 0;
            // console.log(Date.now(), )
            // debugger;
            Date.now = () => toFakeTime(Date._now());
            Date.prototype.getTime = function () {
                return this._t ??= toFakeTime(this._getTime());
            };
            Date.prototype.valueOf = function () {
                return this.getTime();
            };
            DateNowHack.activated = true;
        }
        DateNowHack.performanceActivated = false;
        function activatePerformance() {
            performance._now ??= performance.now;
            DateNowHack.performanceStartTime = performance.now();
            DateNowHack.performanceStartRealtime = performance._now();
            DateNowHack.performanceDeltaOffset = 0;
            performance.now = () => toPerformanceFakeTime(performance._now());
            DateNowHack.performanceActivated = true;
        }
    })(DateNowHack = PoopJs.DateNowHack || (PoopJs.DateNowHack = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let ObjectExtension;
    (function (ObjectExtension) {
        function defineValue(o, p, value) {
            if (typeof p == 'function') {
                [p, value] = [p.name, p];
            }
            Object.defineProperty(o, p, {
                value,
                configurable: true,
                enumerable: false,
                writable: true,
            });
            return o;
        }
        ObjectExtension.defineValue = defineValue;
        function defineGetter(o, p, get) {
            if (typeof p == 'function') {
                [p, get] = [p.name, p];
            }
            Object.defineProperty(o, p, {
                get,
                configurable: true,
                enumerable: false,
            });
            return o;
        }
        ObjectExtension.defineGetter = defineGetter;
        function map(o, mapper) {
            let entries = Object.entries(o);
            return Object.fromEntries(entries.map(([k, v]) => [k, mapper(v, k, o)]));
        }
        ObjectExtension.map = map;
    })(ObjectExtension = PoopJs.ObjectExtension || (PoopJs.ObjectExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let QuerySelector;
    (function (QuerySelector) {
        let WindowQ;
        (function (WindowQ) {
            function q(selector) {
                return (this?.document ?? document).querySelector(selector);
            }
            WindowQ.q = q;
            function qq(selector) {
                return [...(this?.document ?? document).querySelectorAll(selector)];
            }
            WindowQ.qq = qq;
        })(WindowQ = QuerySelector.WindowQ || (QuerySelector.WindowQ = {}));
        let DocumentQ;
        (function (DocumentQ) {
            function q(selector) {
                return this.documentElement.querySelector(selector);
            }
            DocumentQ.q = q;
            function qq(selector) {
                return [...this.documentElement.querySelectorAll(selector)];
            }
            DocumentQ.qq = qq;
        })(DocumentQ = QuerySelector.DocumentQ || (QuerySelector.DocumentQ = {}));
        let ElementQ;
        (function (ElementQ) {
            function q(selector) {
                return this.querySelector(selector);
            }
            ElementQ.q = q;
            function qq(selector) {
                return [...this.querySelectorAll(selector)];
            }
            ElementQ.qq = qq;
        })(ElementQ = QuerySelector.ElementQ || (QuerySelector.ElementQ = {}));
    })(QuerySelector = PoopJs.QuerySelector || (PoopJs.QuerySelector = {}));
    let ElementExtension;
    (function (ElementExtension) {
        function emit(type, detail) {
            let event = new CustomEvent(type, {
                bubbles: true,
                detail,
            });
            this.dispatchEvent(event);
        }
        ElementExtension.emit = emit;
        function appendTo(parent) {
            if (typeof parent == 'string') {
                parent = document.querySelector(parent);
            }
            parent.append(this);
            return this;
        }
        ElementExtension.appendTo = appendTo;
    })(ElementExtension = PoopJs.ElementExtension || (PoopJs.ElementExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let Elm;
    (function (Elm) {
        const elmRegex = new RegExp([
            /^(?<tag>[\w-]+)/,
            /#(?<id>[\w-]+)/,
            /\.(?<class>[\w-]+)/,
            /\[(?<attr1>[\w-]+)\]/,
            /\[(?<attr2>[\w-]+)=(?!['"])(?<val2>[^\]]*)\]/,
            /\[(?<attr3>[\w-]+)="(?<val3>(?:[^"]|\\")*)"\]/,
            /\[(?<attr4>[\w-]+)="(?<val4>(?:[^']|\\')*)"\]/,
        ].map(e => e.source).join('|'), 'g');
        /** if `elm` should disallow listeners not existing as `on * ` property on the element */
        Elm.allowOnlyExistingListeners = true;
        /** if `elm` should allow overriding `on * ` listeners if multiple of them are provided */
        Elm.allowOverrideOnListeners = false;
        function elm(selector = '', ...children) {
            if (selector.replaceAll(elmRegex, '') != '') {
                throw new Error(`invalid selector: ${selector} `);
            }
            let element = document.createElement('div');
            // let tag = '';
            // let firstMatch = false;
            for (let match of selector.matchAll(elmRegex)) {
                if (match.groups.tag) {
                    // if (tag && match.groups.tag != tag) {
                    // 	throw new Error(`selector has two different tags at once : <${tag}> and <${match.groups.tag}>`);
                    // }
                    // tag = match.groups.tag;
                    // if (!firstMatch) return elm(tag + selector, ...children);
                    element = document.createElement(match.groups.tag);
                }
                else if (match.groups.id) {
                    element.id = match.groups.id;
                }
                else if (match.groups.class) {
                    element.classList.add(match.groups.class);
                }
                else if (match.groups.attr1) {
                    element.setAttribute(match.groups.attr1, "true");
                }
                else if (match.groups.attr2) {
                    element.setAttribute(match.groups.attr2, match.groups.val2);
                }
                else if (match.groups.attr3) {
                    element.setAttribute(match.groups.attr3, match.groups.val3.replace(/\\"/g, '"'));
                }
                else if (match.groups.attr4) {
                    element.setAttribute(match.groups.attr4, match.groups.val4.replace(/\\'/g, '\''));
                }
                // firstMatch = false;
            }
            for (let listener of children.filter(e => typeof e == 'function')) {
                let name = listener.name;
                if (!name)
                    name = (listener + '').match(/\b(?!function\b)\w+/)[0];
                if (!name)
                    throw new Error('trying to bind unnamed function');
                if (name.startsWith('bound '))
                    name = name.slice('bound '.length);
                if (name.startsWith('on')) {
                    if (!element.hasOwnProperty(name))
                        throw new Error(`< ${element.tagName.toLowerCase()}> does not have "${name}" listener`);
                    if (!Elm.allowOverrideOnListeners && element[name])
                        throw new Error('overriding `on * ` listeners is disabled');
                    element[name] = listener;
                }
                else {
                    if (Elm.allowOnlyExistingListeners && element['on' + name] === undefined)
                        throw new Error(`<${element.tagName.toLowerCase()}> does not have "on'${name}'" listener`);
                    element.addEventListener(name, listener);
                }
            }
            element.append(...children.filter(e => typeof e != 'function'));
            return element;
        }
        Elm.elm = elm;
        function qOrElm(selector, parent) {
            if (typeof parent == 'string') {
                parent = document.querySelector(parent);
                if (!parent)
                    throw new Error('failed to find parent element');
            }
            if (selector.includes('>')) {
                let parentSelector = selector.split('>').slice(0, -1).join('>');
                selector = selector.split('>').pop();
                parent = (parent || document).querySelector(parentSelector);
                if (!parent)
                    throw new Error('failed to find parent element');
            }
            let child = (parent || document).querySelector(selector);
            if (child)
                return child;
            child = elm(selector);
            parent?.append(child);
            return child;
        }
        Elm.qOrElm = qOrElm;
    })(Elm = PoopJs.Elm || (PoopJs.Elm = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    PoopJs.debug = false;
    let etc;
    (function (etc) {
        function keybind(key, fn) {
            let code = key.length == 1 ? 'Key' + key.toUpperCase() : key;
            function onkeydown(event) {
                if (event.code == code) {
                    fn(event);
                }
            }
            addEventListener('keydown', onkeydown);
            return () => removeEventListener('keydown', onkeydown);
        }
        etc.keybind = keybind;
        async function fullscreen(on) {
            let central = PoopJs.ImageScrollingExtension.imageScrollingActive && PoopJs.ImageScrollingExtension.getCentralImg();
            if (!document.fullscreenElement) {
                if (on == false)
                    return;
                await document.documentElement.requestFullscreen().catch(() => { });
            }
            else {
                if (on == true)
                    return;
                await document.exitFullscreen().catch(() => { });
            }
            if (central) {
                central.scrollIntoView();
            }
            return !!document.fullscreenElement;
        }
        etc.fullscreen = fullscreen;
        function anybind(keyOrEvent, fn) {
            if (typeof keyOrEvent == "number")
                keyOrEvent = keyOrEvent + '';
            // detect if it is event
            let isEvent = window.hasOwnProperty('on' + keyOrEvent);
            if (isEvent) {
                addEventListener(keyOrEvent, fn);
                return;
            }
            // parse key code
            if (!isNaN(parseInt(keyOrEvent))) {
                keyOrEvent = `Digit${keyOrEvent}`;
            }
            else if (keyOrEvent.length == 1) {
                keyOrEvent = `Key${keyOrEvent.toUpperCase()}`;
            }
            addEventListener('keydown', ev => {
                if (ev.code != keyOrEvent)
                    return;
                fn(ev);
            });
        }
        etc.anybind = anybind;
        function fullscreenOn(key) {
            if (key == 'scroll') {
                addEventListener('scroll', () => fullscreen(true));
                return;
            }
            return keybind(key, () => fullscreen());
        }
        etc.fullscreenOn = fullscreenOn;
        function fIsForFullscreen() {
            keybind('F', () => fullscreen());
        }
        etc.fIsForFullscreen = fIsForFullscreen;
        function hashCode(value) {
            value ??= this;
            let hash = 0;
            for (let c of value) {
                hash = ((hash << 5) - hash) + c.charCodeAt(0);
                hash = hash & hash;
            }
            return hash;
        }
        etc.hashCode = hashCode;
        function init() {
            // String.prototype.hashCode = hashCode;
        }
        etc.init = init;
        function currentScriptHash() {
            return hashCode(document.currentScript.innerHTML);
        }
        etc.currentScriptHash = currentScriptHash;
        function reloadOnCurrentScriptChanged(scriptName = location.hostname + '.ujs') {
            let scriptId = `reloadOnCurrentScriptChanged_${scriptName}`;
            let scriptHash = currentScriptHash() + '';
            localStorage.setItem(scriptId, scriptHash);
            addEventListener('focus', () => {
                if (localStorage.getItem(scriptId) != scriptHash) {
                    location.reload();
                }
            });
        }
        etc.reloadOnCurrentScriptChanged = reloadOnCurrentScriptChanged;
        etc.fastScroll = function (speed = 0.25) {
            if (etc.fastScroll.active)
                etc.fastScroll.off();
            etc.fastScroll.active = true;
            etc.fastScroll.speed = speed;
            function onwheel(event) {
                if (event.defaultPrevented)
                    return;
                if (event.ctrlKey || event.shiftKey)
                    return;
                scrollBy(0, -Math.sign(event.wheelDeltaY) * innerHeight * etc.fastScroll.speed);
                event.preventDefault();
            }
            addEventListener('mousewheel', onwheel, { passive: false });
            etc.fastScroll.off = () => {
                etc.fastScroll.active = false;
                removeEventListener('mousewheel', onwheel);
            };
        };
        etc.fastScroll.active = false;
        etc.fastScroll.off = () => { };
        function onraf(f) {
            let loop = true;
            void async function () {
                while (loop) {
                    await Promise.frame();
                    f();
                }
            }();
            return () => { loop = false; };
        }
        etc.onraf = onraf;
        let resizeObserver;
        let resizeListeners = [];
        let previousBodyHeight = 0;
        function onheightchange(f) {
            if (!resizeObserver) {
                previousBodyHeight = document.body.clientHeight;
                resizeObserver = new ResizeObserver(entries => {
                    for (let e of entries) {
                        if (e.target != document.body)
                            continue;
                        let newBodyHeight = e.target.clientHeight;
                        for (let f of resizeListeners) {
                            f(newBodyHeight, previousBodyHeight);
                        }
                        previousBodyHeight = newBodyHeight;
                    }
                });
                resizeObserver.observe(document.body);
            }
            resizeListeners.push(f);
            return function removeListener() {
                resizeListeners.splice(resizeListeners.indexOf(f));
            };
        }
        etc.onheightchange = onheightchange;
        Object.defineProperty(etc, 'kds', {
            configurable: true,
            get() {
                let kds = initKds();
                Object.defineProperty(etc, 'kds', { value: kds });
                return kds;
            },
        });
        Object.defineProperty(PoopJs, 'kds', {
            get: () => etc.kds,
            set: (v) => Object.assign(etc.kds, v),
        });
        function generateKdsCodes(e) {
            let basePrefix = `${e.shiftKey ? '<' : ''}${e.ctrlKey ? '^' : ''}${e.altKey ? '>' : ''}`;
            let baseCode = e.code
                ? e.code.replace(/Key|Digit|Arrow|Left|Right/, '')
                : ['LMB', 'RMB', 'MMB'][e.button];
            let extraCode = e.code
                ? baseCode.replace('Control', 'Ctrl')
                : baseCode; // ['Left', 'Right', 'Middle'][e.button];
            let rawCode = e.code ?? baseCode;
            let keyCode = e.key ?? baseCode;
            let extraPrefix = basePrefix.replace(baseCode == 'Shift' ? '<' : baseCode == 'Control' ? '^' : baseCode == 'Alt' ? '>' : '', '');
            let codes = [baseCode, extraCode, rawCode, keyCode].flatMap(c => [basePrefix, extraPrefix].map(p => p + c));
            //.flatMap(e => [e, e.toUpperCase(), e.toLowerCase()]);
            codes.push(e.code ? 'key' : 'mouse');
            codes.push('any');
            return Array.from(new Set(codes));
        }
        function kdsListener(e) {
            let codes = generateKdsCodes(e);
            Object.assign(e, { _codes: codes });
            for (let c of codes) {
                let listener = etc.kds[c];
                if (typeof listener == 'string') {
                    q(listener).click();
                }
                else if (typeof listener == 'function') {
                    etc.kds[c](e);
                }
            }
        }
        etc.kdsListener = kdsListener;
        function initKds() {
            addEventListener('keydown', kdsListener);
            addEventListener('mousedown', kdsListener);
            return {};
        }
        etc._kbdInited = false;
        function makeKds(kds) {
            return Object.assign(etc.kds, kds);
        }
        etc.makeKds = makeKds;
    })(etc = PoopJs.etc || (PoopJs.etc = {}));
})(PoopJs || (PoopJs = {}));
// interface String {
// 	hashCode: () => number;
// }
var PoopJs;
(function (PoopJs) {
    function normalizeDeltaTime(maxAge) {
        if (typeof maxAge == 'number')
            return maxAge;
        if (typeof maxAge != 'string')
            return Infinity;
        const aToM = { s: 1e3, h: 3600e3, d: 24 * 3600e3, w: 7 * 24 * 3600e3, y: 365 * 24 * 3600e3 };
        let n = parseFloat(maxAge);
        let m = aToM[maxAge[maxAge.length - 1]];
        if (n != n || !m)
            throw new Error('invalid deltaTime');
        return n * m;
    }
    PoopJs.normalizeDeltaTime = normalizeDeltaTime;
    let FetchExtension;
    (function (FetchExtension) {
        FetchExtension.defaults = { credentials: 'include' };
        FetchExtension.cache = null;
        async function openCache() {
            if (FetchExtension.cache)
                return FetchExtension.cache;
            FetchExtension.cache = await caches.open('fetch');
            return FetchExtension.cache;
        }
        function toDur(dt) {
            dt = normalizeDeltaTime(dt);
            if (dt > 1e10)
                dt = Date.now() - dt;
            let split = (n, d) => [n % d, ~~(n / d)];
            let to2 = (n) => (n + '').padStart(2, '0');
            var [ms, s] = split(dt, 1000);
            var [s, m] = split(s, 60);
            var [m, h] = split(m, 60);
            var [h, d] = split(h, 24);
            var [d, w] = split(d, 7);
            return w > 1e3 ? 'forever' : w ? `${w}w${d}d` : d ? `${d}d${to2(h)}h` : h + m ? `${to2(h)}:${to2(m)}:${to2(s)}` : `${s + ~~ms / 1000}s`;
        }
        function isStale(cachedAt, maxAge) {
            if (maxAge == null)
                return false;
            return Date.now() - cachedAt >= normalizeDeltaTime(maxAge);
        }
        FetchExtension.isStale = isStale;
        async function cached(url, init = {}) {
            let now = performance.now();
            let cache = await openCache();
            let response = await cache.match(url);
            if (response) {
                response.cachedAt = +response.headers.get('cached-at') || 0;
                if (!isStale(response.cachedAt, normalizeDeltaTime(init.maxAge))) {
                    PoopJs.debug && console.log(`Cached response: ${toDur(response.cachedAt)} < c:${toDur(init.maxAge)}`, url);
                    return response;
                }
                PoopJs.debug && console.log(`Stale response: ${toDur(response.cachedAt)} > c:${toDur(init.maxAge)}`, url);
            }
            response =
                !init.xml ? await fetch(url, { ...FetchExtension.defaults, ...init })
                    : await xmlResponse(url, init);
            if (response.ok) {
                response.cachedAt = Date.now();
                let clone = response.clone();
                let init2 = {
                    status: clone.status, statusText: clone.statusText,
                    headers: [['cached-at', `${response.cachedAt}`], ...clone.headers.entries()]
                };
                let resultResponse = new Response(clone.body, init2);
                cache.put(url, resultResponse);
                let dt = performance.now() - now;
                PoopJs.debug && console.log(`Loaded response: ${toDur(dt)} / c:${toDur(init.maxAge)}`, url);
            }
            else {
                PoopJs.debug && console.log(`Failed response: ${toDur(response.cachedAt)} / c:${toDur(init.maxAge)}`, url);
            }
            return response;
        }
        FetchExtension.cached = cached;
        async function cachedDoc(url, init = {}) {
            let response = await cached(url, init);
            let text = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');
            let base = doc.createElement('base');
            base.href = url;
            doc.head.append(base);
            doc.cachedAt = response.cachedAt;
            return doc;
        }
        FetchExtension.cachedDoc = cachedDoc;
        async function doc(url, init = {}) {
            let response = !init.xml ? await fetch(url, { ...FetchExtension.defaults, ...init })
                : await xmlResponse(url, init);
            let text = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');
            let base = doc.createElement('base');
            base.href = url;
            doc.head.append(base);
            doc.cachedAt = response.cachedAt;
            return doc;
        }
        FetchExtension.doc = doc;
        async function xmlResponse(url, init = {}) {
            let p = PoopJs.PromiseExtension.empty();
            let oReq = new XMLHttpRequest();
            oReq.onload = p.r;
            oReq.responseType = 'document';
            oReq.open("get", url, true);
            oReq.send();
            await p;
            if (oReq.responseType != 'document')
                throw new Error('FIXME');
            return new Response(oReq.responseXML.documentElement.outerHTML, init);
        }
        FetchExtension.xmlResponse = xmlResponse;
        async function json(url, init = {}) {
            return fetch(url, { ...FetchExtension.defaults, ...init }).then(e => e.json());
        }
        FetchExtension.json = json;
        async function clearCache() {
            FetchExtension.cache = null;
            return caches.delete('fetch');
        }
        FetchExtension.clearCache = clearCache;
        async function uncache(url) {
            let cache = await openCache();
            let d1 = cache.delete(url);
            let d2 = await idbDelete(url);
            return (await d1) || d2;
        }
        FetchExtension.uncache = uncache;
        async function isCached(url, options = {}) {
            if (options.indexedDb) {
                let dbJson = await idbGet(url);
                if (dbJson) {
                    return isStale(dbJson.cachedAt, normalizeDeltaTime(options.maxAge)) ? false : 'idb';
                }
                if (options.indexedDb == 'only')
                    return false;
            }
            let cache = await openCache();
            let response = await cache.match(url);
            if (!response)
                return false;
            if (options?.maxAge != null) {
                let cachedAt = +response.headers.get('cached-at') || 0;
                if (isStale(response.cachedAt, normalizeDeltaTime(options.maxAge))) {
                    return false;
                }
            }
            return true;
        }
        FetchExtension.isCached = isCached;
        async function cachedJson(url, init = {}) {
            if (init.indexedDb) {
                let dbJson = await idbGet(url);
                if (dbJson) {
                    if (!isStale(dbJson.cachedAt, init.maxAge)) {
                        PoopJs.ObjectExtension.defineValue(dbJson.data, 'cached', dbJson.cachedAt);
                        return dbJson.data;
                    }
                }
            }
            let response = await cached(url, init);
            let json = await response.json();
            if (!('cached' in json)) {
                PoopJs.ObjectExtension.defineValue(json, 'cached', response.cachedAt);
            }
            if (init.indexedDb) {
                idbPut(url, json, response.cachedAt);
            }
            return json;
        }
        FetchExtension.cachedJson = cachedJson;
        let _idbInstancePromise = null;
        let idbInstance = null;
        async function openIdb() {
            if (idbInstance)
                return idbInstance;
            if (await _idbInstancePromise) {
                return idbInstance;
            }
            let irq = indexedDB.open('fetch');
            irq.onupgradeneeded = event => {
                let db = irq.result;
                let store = db.createObjectStore('fetch', { keyPath: 'url' });
            };
            _idbInstancePromise = new Promise((r, j) => {
                irq.onsuccess = r;
                irq.onerror = j;
            }).then(() => irq.result, () => null);
            idbInstance = _idbInstancePromise = await _idbInstancePromise;
            if (!idbInstance)
                throw new Error('Failed to open indexedDB');
            return idbInstance;
        }
        async function idbClear() {
            throw new Error('TODO');
        }
        FetchExtension.idbClear = idbClear;
        async function idbGet(url) {
            let db = await openIdb();
            let t = db.transaction(['fetch'], 'readonly');
            let rq = t.objectStore('fetch').get(url);
            return new Promise(r => {
                rq.onsuccess = () => r(rq.result);
                rq.onerror = () => r(undefined);
            });
        }
        async function idbPut(url, data, cachedAt) {
            let db = await openIdb();
            let t = db.transaction(['fetch'], 'readwrite');
            let rq = t.objectStore('fetch').put({ url, data, cachedAt: cachedAt ?? +new Date() });
            return new Promise(r => {
                rq.onsuccess = () => r(rq.result);
                rq.onerror = () => r(undefined);
            });
        }
        async function idbDelete(url) {
            let db = await openIdb();
            let t = db.transaction(['fetch'], 'readwrite');
            let rq = t.objectStore('fetch').delete(url);
            return new Promise(r => {
                rq.onsuccess = () => r(rq.result);
                rq.onerror = () => r(undefined);
            });
        }
    })(FetchExtension = PoopJs.FetchExtension || (PoopJs.FetchExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        /**
         * can be either Map or WeakMap
         * (WeakMap is likely to be useless if there are less then 10k old nodes in map)
         */
        let MapType = Map;
        function toElArray(entrySelector) {
            return typeof entrySelector == 'function' ? entrySelector() : qq(entrySelector);
        }
        class EntryFilterer {
            container;
            entrySelector;
            constructor(entrySelector, enabled = 'soft') {
                this.entrySelector = entrySelector;
                this.container = elm('.ef-container');
                if (enabled == 'soft') {
                    this.softDisable = true;
                    this.disable('soft');
                }
                else if (enabled) {
                    this.softDisable = false;
                }
                else {
                    // enabled is falsy
                    this.softDisable = false;
                    this.disable();
                }
                this.style();
                this.update();
                document.addEventListener('paginationmodify', () => this.requestUpdate());
                PoopJs.etc.onheightchange(() => this.requestUpdate());
            }
            entries = [];
            entryDatas = new MapType();
            getData(el) {
                if (!el)
                    return this.entries.map(e => this.getData(e));
                let data = this.entryDatas.get(el);
                if (!data) {
                    data = this.parseEntry(el);
                    this.entryDatas.set(el, data);
                }
                return data;
            }
            updatePending = false;
            reparsePending = false;
            requestUpdate(reparse = false) {
                if (this.updatePending)
                    return;
                this.updatePending = true;
                if (reparse)
                    this.reparsePending = true;
                setTimeout(() => this.update());
            }
            parsers = [];
            writeDataAttribute = false;
            addParser(parser) {
                this.parsers.push(parser);
                this.requestUpdate(true);
            }
            parseEntry(el) {
                el.parentElement.classList.add('ef-entry-container');
                el.classList.add('ef-entry');
                let data = {};
                for (let parser of this.parsers) {
                    let newData = parser(el, data);
                    if (!newData || newData == data)
                        continue;
                    if (!IsPromise(newData)) {
                        Object.assign(data, newData);
                        continue;
                    }
                    newData.then(pNewData => {
                        if (pNewData && pNewData != data) {
                            Object.assign(data, pNewData);
                        }
                        this.requestUpdate();
                    });
                }
                if (this.writeDataAttribute) {
                    el.setAttribute('ef-data', JSON.stringify(data));
                }
                return data;
            }
            addItem(constructor, list, data, source) {
                Object.assign(data, source, { parent: this });
                data.name ??= data.id;
                let item = new constructor(data);
                list.push(item);
                return item;
            }
            filters = [];
            sorters = [];
            modifiers = [];
            get byName() {
                return Object.assign(Object.fromEntries(this.filters.map(e => [e.id, e])), Object.fromEntries(this.sorters.map(e => [e.id, e])), Object.fromEntries(this.modifiers.map(e => [e.id, e])), {
                    filters: Object.fromEntries(this.filters.map(e => [e.id, e])),
                    sorters: Object.fromEntries(this.sorters.map(e => [e.id, e])),
                    modifiers: Object.fromEntries(this.modifiers.map(e => [e.id, e])),
                });
            }
            addFilter(id, filter, data = {}) {
                return this.addItem(EntryFiltererExtension.Filter, this.filters, data, { id, filter });
            }
            addVFilter(id, filter, data) {
                if (typeof data != 'object' || !data) {
                    data = { input: data };
                }
                return this.addItem(EntryFiltererExtension.ValueFilter, this.filters, data, { id, filter });
            }
            addMFilter(id, value, data) {
                return this.addItem(EntryFiltererExtension.MatchFilter, this.filters, data, { id, value });
            }
            addTagFilter(id, data) {
                return this.addItem(EntryFiltererExtension.TagFilter, this.filters, data, { id });
            }
            addSorter(id, sorter, data = {}) {
                return this.addItem(EntryFiltererExtension.Sorter, this.sorters, data, { id, sorter });
            }
            addModifier(id, modifier, data = {}) {
                return this.addItem(EntryFiltererExtension.Modifier, this.modifiers, data, { id, modifier });
            }
            addPrefix(id, prefix, data = {}) {
                return this.addItem(EntryFiltererExtension.Prefixer, this.modifiers, data, { id, prefix });
            }
            addPaginationInfo(id = 'pginfo', data = {}) {
                return this.addItem(EntryFiltererExtension.PaginationInfoFilter, this.filters, data, { id });
            }
            filterEntries() {
                for (let el of this.entries) {
                    let data = this.getData(el);
                    let value = true;
                    for (let filter of this.filters) {
                        value = value && filter.apply(data, el);
                    }
                    el.classList.toggle('ef-filtered-out', !value);
                }
            }
            _previousState = {
                allSortersOff: true,
                updateDuration: 0,
                finishedAt: 0,
            };
            orderedEntries = [];
            orderMode = 'css';
            sortEntries() {
                if (this.entries.length <= 1)
                    return;
                if (this.orderedEntries.length == 0)
                    this.orderedEntries = this.entries;
                if (this.sorters.length == 0)
                    return;
                let entries = this.entries;
                let pairs = entries.map(e => [this.getData(e), e]);
                let allOff = true;
                for (let sorter of this.sorters) {
                    if (sorter.mode != 'off') {
                        pairs = sorter.sort(pairs);
                        allOff = false;
                    }
                }
                entries = pairs.map(e => e[1]);
                if (this.orderMode == 'swap') {
                    if (!entries.every((e, i) => e == this.orderedEntries[i])) {
                        let br = elm(`${entries[0]?.tagName}.ef-before-sort[hidden]`);
                        this.orderedEntries[0].before(br);
                        br.after(...entries);
                        br.remove();
                    }
                }
                else {
                    if (allOff != this._previousState.allSortersOff) {
                        entries.map((e, i) => {
                            if (allOff) {
                                e.classList.remove('ef-reorder');
                                e.parentElement.classList.remove('ef-reorder-container');
                            }
                            else {
                                // use `flex` or `grid` container and `order:var(--ef-order)` for children 
                                e.classList.add('ef-reorder');
                                e.parentElement.classList.add('ef-reorder-container');
                            }
                        });
                    }
                    if (!allOff) {
                        entries.map((e, i) => {
                            e.style.setProperty('--ef-order', i + '');
                        });
                    }
                }
                this.orderedEntries = entries;
                this._previousState.allSortersOff = allOff;
            }
            modifyEntries() {
                let entries = this.entries;
                let pairs = entries.map(e => [e, this.getData(e)]);
                for (let modifier of this.modifiers) {
                    for (let [e, d] of pairs) {
                        modifier.apply(d, e);
                    }
                }
            }
            moveToTop(item) {
                if (this.sorters.includes(item)) {
                    this.sorters.splice(this.sorters.indexOf(item), 1);
                    this.sorters.push(item);
                }
                if (this.modifiers.includes(item)) {
                    this.modifiers.splice(this.modifiers.indexOf(item), 1);
                    this.modifiers.push(item);
                }
            }
            findEntries() {
                return typeof this.entrySelector == 'function' ? this.entrySelector() : qq(this.entrySelector);
            }
            update(reparse = this.reparsePending) {
                let earliestUpdate = this._previousState.finishedAt + Math.min(10000, 8 * this._previousState.updateDuration);
                if (performance.now() < earliestUpdate) {
                    requestAnimationFrame(() => this.update());
                    return;
                }
                this.updatePending = false;
                if (this.disabled == true)
                    return;
                let now = performance.now();
                let entries = this.findEntries();
                if (this.disabled == 'soft') {
                    if (!entries.length)
                        return;
                    PoopJs.debug && console.log(`Ef soft-enabled: x0=>x${entries.length}`, this.entrySelector, this);
                    this.enable();
                    return;
                }
                if (this.disabled != false)
                    throw 0;
                if (!entries.length && this.softDisable) {
                    PoopJs.debug && console.log(`Ef soft-disabled: x${this.enable.length}=>x0`, this.entrySelector, this);
                    this.disable('soft');
                    return;
                }
                if (reparse) {
                    this.entryDatas = new MapType();
                    this.reparsePending = false;
                }
                if (!this.container.closest('body')) {
                    this.container.appendTo('body');
                }
                if (this.entries.length != entries.length) {
                    PoopJs.debug && console.log(`Ef update: x${this.entries.length}=>x${entries.length}`, this.entrySelector, this);
                    // || this.entries
                    // TODO: sort entries in initial order
                }
                this.entries = entries;
                this.filterEntries();
                this.sortEntries();
                this.modifyEntries();
                let timeUsed = performance.now() - now;
                this._previousState.updateDuration = 10000;
                this._previousState.finishedAt = performance.now() + 10000;
                requestAnimationFrame(() => {
                    this._previousState.updateDuration = performance.now() - now;
                    this._previousState.finishedAt = performance.now();
                });
            }
            offIncompatible(incompatible) {
                for (let filter of this.filters) {
                    if (incompatible.includes(filter.id)) {
                        filter.toggleMode('off');
                    }
                }
                for (let sorter of this.sorters) {
                    if (incompatible.includes(sorter.id)) {
                        sorter.toggleMode('off');
                    }
                }
                for (let modifier of this.modifiers) {
                    if (incompatible.includes(modifier.id)) {
                        modifier.toggleMode('off');
                    }
                }
            }
            style(s = '') {
                EntryFilterer.style(s);
                return this;
            }
            static style(s = '') {
                let style = q('style.ef-style') || elm('style.ef-style').appendTo('head');
                style.innerHTML = `
					.ef-container {
						display: flex;
						flex-direction: column;
						position: fixed;
						top: 0;
						right: 0;
						z-index: 9999999999999999999;
						min-width: 100px;
					}
					.ef-entry {}

					.ef-filtered-out {
						display: none !important;
					}

					button.ef-item {}
					button.ef-item[ef-mode="off"] {
						background: lightgray;
					}
					button.ef-item[ef-mode="on"] {
						background: lightgreen;
					}
					button.ef-item[ef-mode="opposite"] {
						background: yellow;
					}

					button.ef-item.ef-filter > input {
						float: right;
					}

					[ef-prefix]::before {
						content: attr(ef-prefix);
					}
					[ef-postfix]::after {
						content: attr(ef-postfix);
					}
					
				` + s;
            }
            softDisable = true;
            disabled = false;
            disable(soft) {
                this.disabled = true;
                if (soft == 'soft')
                    this.disabled = 'soft';
                this.container.remove();
            }
            enable() {
                this.disabled = false;
                this.updatePending = false;
                this.requestUpdate();
            }
            clear() {
                this.entryDatas = new Map();
                this.parsers.splice(0, 999);
                this.filters.splice(0, 999).map(e => e.remove());
                this.sorters.splice(0, 999).map(e => e.remove());
                this.modifiers.splice(0, 999).map(e => e.remove());
                this.enable();
            }
            get _datas() {
                return this.entries
                    .filter(e => !e.classList.contains('ef-filtered-out'))
                    .map(e => this.getData(e));
            }
        }
        EntryFiltererExtension.EntryFilterer = EntryFilterer;
        function IsPromise(p) {
            if (!p)
                return false;
            return typeof p.then == 'function';
        }
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    class Observer {
    }
    PoopJs.Observer = Observer;
})(PoopJs || (PoopJs = {}));
/*

function observeClassAdd(cls, cb) {
    let queued = false;
    async function run() {
        if (queued) return;
        queued = true;
        await Promise.frame();
        queued = false;
        cb();
    }
    new MutationObserver(list => {
        for (let mr of list) {
            if (mr.type == 'attributes' && mr.attributeName == 'class') {
                if (mr.target.classList.contains(cls)) {
                    run();
                }
            }
            if (mr.type == 'childList') {
                for (let ch of mr.addedNodes) {
                    if (ch.classList?.contains(cls)) {
                        run();
                    }
                }
            }
        }
    }).observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true,
    });
}

*/ 
var PoopJs;
(function (PoopJs) {
    let PaginateExtension;
    (function (PaginateExtension) {
        class Paginate {
            doc;
            enabled = true;
            condition;
            queued = 0;
            running = false;
            _inited = false;
            shiftRequestCount;
            static shiftRequestCount = 10;
            static _inited = false;
            static removeDefaultRunBindings;
            static addDefaultRunBindings() {
                Paginate.removeDefaultRunBindings?.();
                function onmousedown(event) {
                    if (event.button != 1)
                        return;
                    let target = event.target;
                    if (target?.closest('a'))
                        return;
                    event.preventDefault();
                    let count = event.shiftKey ? Paginate.shiftRequestCount : 1;
                    Paginate.requestPagination(count, event, target);
                }
                function onkeydown(event) {
                    if (event.code != 'AltRight')
                        return;
                    event.preventDefault();
                    let count = event.shiftKey ? Paginate.shiftRequestCount : 1;
                    let target = event.target;
                    Paginate.requestPagination(count, event, target);
                }
                document.addEventListener('mousedown', onmousedown);
                document.addEventListener('keydown', onkeydown);
                Paginate.removeDefaultRunBindings = () => {
                    document.removeEventListener('mousedown', onmousedown);
                    document.removeEventListener('keydown', onkeydown);
                };
            }
            static instances = [];
            // listeners
            init() {
                if (!Paginate.removeDefaultRunBindings) {
                    Paginate.addDefaultRunBindings();
                }
                if (this._inited)
                    return;
                document.addEventListener('paginationrequest', this.onPaginationRequest.bind(this));
                document.addEventListener('paginationend', this.onPaginationEnd.bind(this));
                Paginate.instances.push(this);
                if (PoopJs.debug) {
                    let active = this.canConsumeRequest() ? 'active' : 'inactive';
                    if (active == 'active')
                        PoopJs.debug && console.log(`Paginate instantiated (${active}): `, this.data);
                }
            }
            onPaginationRequest(event) {
                if (this.canConsumeRequest()) {
                    event.detail.consumed++;
                    let queued = !event.detail.reason?.shiftKey ? null : typeof this.shiftRequestCount == 'function' ? this.shiftRequestCount() : this.shiftRequestCount;
                    this.queued += queued ?? event.detail.count;
                }
                if (!this.running && this.queued) {
                    this.consumeRequest();
                }
            }
            ;
            onPaginationEnd(event) {
                if (this.queued && this.canConsumeRequest()) {
                    requestAnimationFrame(() => {
                        if (!this.canConsumeRequest()) {
                            console.warn(`this paginate can not work anymore`);
                            this.queued = 0;
                        }
                        else {
                            this.consumeRequest();
                        }
                    });
                }
            }
            canConsumeRequest() {
                if (!this.enabled)
                    return false;
                if (this.running)
                    return true;
                if (this.condition) {
                    if (typeof this.condition == 'function') {
                        if (!this.condition())
                            return false;
                    }
                    else {
                        if (!document.q(this.condition))
                            return false;
                    }
                }
                return true;
            }
            async consumeRequest() {
                if (this.running)
                    return;
                this.queued--;
                this.running = true;
                this.emitStart();
                await this.onrun?.();
                this.running = false;
                this.emitEnd();
            }
            onrun;
            // emitters
            static requestPagination(count = 1, reason, target = document.body) {
                let detail = { count, reason, consumed: 0 };
                function fail(event) {
                    if (event.detail.consumed == 0) {
                        console.warn(`Pagination request failed: no listeners`);
                    }
                    removeEventListener('paginationrequest', fail);
                }
                addEventListener('paginationrequest', fail);
                target.emit('paginationrequest', { count, reason, consumed: 0 });
            }
            emitStart() {
                document.body.emit('paginationstart', { paginate: this });
            }
            emitModify(added, removed, selector) {
                document.body.emit('paginationmodify', { paginate: this, added, removed, selector });
            }
            emitEnd() {
                document.body.emit('paginationend', { paginate: this });
            }
            // fetching: 
            async fetchDocument(link, spinner = true, maxAge = 0) {
                this.doc = null;
                let a = spinner && Paginate.linkToAnchor(link);
                a?.classList.add('paginate-spin');
                link = Paginate.linkToUrl(link);
                let init = { maxAge, xml: this.data.xml };
                this.doc = !maxAge ? await fetch.doc(link, init) : await fetch.cached.doc(link, init);
                a?.classList.remove('paginate-spin');
                return this.doc;
            }
            static prefetch(source) {
                document.qq(source).map(e => {
                    if (e.href) {
                        elm(`link[rel="prefetch"][href="${e.href}"]`).appendTo('head');
                    }
                    // TODO: if e.src
                });
            }
            // modification: 
            after(source, target = source) {
                let added = this.doc.qq(source);
                if (!added.length)
                    return;
                let found = document.qq(target);
                if (found.length == 0)
                    throw new Error(`failed to find where to append`);
                found.pop().after(...added);
                this.emitModify(added, [], source);
            }
            replaceEach(source, target = source) {
                let added = this.doc.qq(source);
                let removed = document.qq(target);
                if (added.length != removed.length)
                    throw new Error(`added/removed count mismatch`);
                removed.map((e, i) => e.replaceWith(added[i]));
                this.emitModify(added, removed, source);
            }
            replace(source, target = source) {
                let added = this.doc.qq(source);
                let removed = document.qq(target);
                if (added.length != removed.length)
                    throw new Error(`not implemented`);
                return this.replaceEach(source, target);
            }
            // util
            static linkToUrl(link) {
                if (typeof link == 'string') {
                    if (link.startsWith('http'))
                        return link;
                    link = document.q(link);
                }
                if (link.tagName != 'A')
                    throw new Error('link should be <a> element!');
                return link.href;
            }
            static linkToAnchor(link) {
                if (typeof link == 'string') {
                    if (link.startsWith('http'))
                        return null;
                    return document.q(link);
                }
                return link;
            }
            static staticCall(data) {
                let p = new Paginate();
                p.staticCall(data);
                return p;
            }
            rawData;
            data;
            staticCall(data) {
                function toArray(v) {
                    if (Array.isArray(v))
                        return v;
                    if (v == null)
                        return [];
                    return [v];
                }
                function toCondition(s) {
                    if (!s)
                        return () => true;
                    if (typeof s == 'string')
                        return () => !!document.q(s);
                    return s;
                }
                function canFind(a) {
                    if (a.length == 0)
                        return true;
                    return a.some(s => !!document.q(s));
                }
                function findOne(a) {
                    return a.find(s => document.q(s));
                }
                this.rawData = data;
                this.data = {
                    condition: toCondition(data.condition),
                    prefetch: toArray(data.prefetch)
                        .flatMap(e => toArray(data[e] ?? e)),
                    doc: toArray(data.doc),
                    click: toArray(data.click),
                    after: toArray(data.after),
                    replace: toArray(data.replace),
                    maxAge: data.maxAge ?? (data.cache == true ? '1y' : data.cache),
                    start: data.start, modify: data.modify, end: data.end,
                    xml: data.xml,
                };
                this.shiftRequestCount = data.shifted;
                if (data.pager) {
                    let pager = toArray(data.pager);
                    this.data.doc = this.data.doc.flatMap(e => pager.map(p => `${p} ${e}`));
                    this.data.replace.push(...pager);
                }
                this.condition = () => {
                    if (!this.data.condition())
                        return false;
                    if (!canFind(this.data.doc))
                        return false;
                    if (!canFind(this.data.click))
                        return false;
                    return true;
                };
                this.init();
                if (this.data.condition()) {
                    this.data.prefetch.map(s => Paginate.prefetch(s));
                }
                this.onrun = async () => {
                    // if (!fixedData.condition()) return;
                    await this.data.start?.call(this);
                    this.data.click.map(e => document.q(e)?.click());
                    let doc = findOne(this.data.doc);
                    if (doc) {
                        await this.fetchDocument(doc, true, this.data.maxAge);
                        this.data.replace.map(s => this.replace(s));
                        this.data.after.map(s => this.after(s));
                        await this.data.modify?.call(this, this.doc);
                    }
                    await this.data.end?.call(this, doc && this.doc);
                };
            }
        }
        PaginateExtension.Paginate = Paginate;
        PaginateExtension.paginate = Object.setPrototypeOf(Object.assign(Paginate.staticCall, new Paginate()), Paginate);
    })(PaginateExtension = PoopJs.PaginateExtension || (PoopJs.PaginateExtension = {}));
    PoopJs.paginate = PaginateExtension.paginate;
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let ImageScrollingExtension;
    (function (ImageScrollingExtension) {
        ImageScrollingExtension.imageScrollingActive = false;
        ImageScrollingExtension.imgSelector = 'img';
        function imageScrolling(selector) {
            if (ImageScrollingExtension.imageScrollingActive)
                return;
            if (selector)
                ImageScrollingExtension.imgSelector = selector;
            ImageScrollingExtension.imageScrollingActive = true;
            function onwheel(event) {
                if (event.shiftKey || event.ctrlKey)
                    return;
                if (scrollWholeImage(-Math.sign(event.wheelDeltaY))) {
                    event.preventDefault();
                }
            }
            document.addEventListener('mousewheel', onwheel, { passive: false });
            return ImageScrollingExtension.imageScrollingOff = () => {
                ImageScrollingExtension.imageScrollingActive = false;
                document.removeEventListener('mousewheel', onwheel);
            };
        }
        ImageScrollingExtension.imageScrolling = imageScrolling;
        function bindArrows() {
            addEventListener('keydown', event => {
                if (event.code == 'ArrowLeft') {
                    scrollWholeImage(-1);
                }
                if (event.code == 'ArrowRight') {
                    scrollWholeImage(1);
                }
            });
        }
        ImageScrollingExtension.bindArrows = bindArrows;
        ImageScrollingExtension.imageScrollingOff = () => { };
        function imgToWindowCenter(img) {
            let rect = img.getBoundingClientRect();
            return (rect.top + rect.bottom) / 2 - innerHeight / 2;
        }
        ImageScrollingExtension.imgToWindowCenter = imgToWindowCenter;
        function getAllImageInfo() {
            let images = qq(ImageScrollingExtension.imgSelector);
            let datas = images.map((img, index) => {
                let rect = img.getBoundingClientRect();
                return {
                    img, rect, index,
                    inScreen: rect.top >= -1 && rect.bottom <= innerHeight,
                    crossScreen: rect.bottom >= 1 && rect.top <= innerHeight - 1,
                    yToScreenCenter: (rect.top + rect.bottom) / 2 - innerHeight / 2,
                    isInCenter: Math.abs((rect.top + rect.bottom) / 2 - innerHeight / 2) < 3,
                    isScreenHeight: Math.abs(rect.height - innerHeight) < 3,
                };
            }).filter(e => e.rect?.width || e.rect?.width);
            return datas;
        }
        ImageScrollingExtension.getAllImageInfo = getAllImageInfo;
        ImageScrollingExtension.scrollWholeImagePending = false;
        function getCentralImg() {
            return getAllImageInfo().vsort(e => Math.abs(e.yToScreenCenter))[0]?.img;
        }
        ImageScrollingExtension.getCentralImg = getCentralImg;
        function scrollWholeImage(dir = 1) {
            if (ImageScrollingExtension.scrollWholeImagePending)
                return true;
            // if (dir == 0) throw new Error('scrolling in no direction!');
            if (!dir)
                return false;
            dir = Math.sign(dir);
            let datas = getAllImageInfo().vsort(e => e.yToScreenCenter);
            let central = datas.vsort(e => Math.abs(e.yToScreenCenter))[0];
            let nextCentralIndex = datas.indexOf(central);
            while (datas[nextCentralIndex + dir] &&
                Math.abs(datas[nextCentralIndex + dir].yToScreenCenter - central.yToScreenCenter) < 10)
                nextCentralIndex += dir;
            central = datas[nextCentralIndex];
            let next = datas[nextCentralIndex + dir];
            function scrollToImage(data) {
                if (!data)
                    return false;
                if (scrollY + data.yToScreenCenter <= 0 && scrollY <= 0) {
                    return false;
                }
                if (data.isScreenHeight) {
                    data.img.scrollIntoView();
                }
                else {
                    scrollTo(scrollX, scrollY + data.yToScreenCenter);
                }
                ImageScrollingExtension.scrollWholeImagePending = true;
                Promise.raf(2).then(() => ImageScrollingExtension.scrollWholeImagePending = false);
                return true;
            }
            // if no images, don't scroll;
            if (!central)
                return false;
            // if current image is outside view, don't scroll
            if (!central.crossScreen)
                return false;
            // if current image is in center, scroll to the next one
            if (central.isInCenter) {
                return scrollToImage(next);
            }
            // if to scroll to current image you have to scroll in opposide direction, scroll to next one
            if (Math.sign(central.yToScreenCenter) != dir) {
                return scrollToImage(next);
            }
            // if current image is first/last, don't scroll over 25vh to it
            if (dir == 1 && central.index == 0 && central.yToScreenCenter > innerHeight / 2) {
                return false;
            }
            if (dir == -1 && central.index == datas.length - 1 && central.yToScreenCenter < -innerHeight / 2) {
                return false;
            }
            return scrollToImage(central);
        }
        ImageScrollingExtension.scrollWholeImage = scrollWholeImage;
        function saveScrollPosition() {
            let img = getCentralImg();
            let rect = img.getBoundingClientRect();
            let centerToWindowCenter = (rect.top + rect.bottom) / 2 - innerHeight / 2;
            let offset = centerToWindowCenter / rect.height;
            return { img, offset, load() { loadScrollPosition({ img, offset }); } };
        }
        ImageScrollingExtension.saveScrollPosition = saveScrollPosition;
        function loadScrollPosition(pos) {
            let rect = pos.img.getBoundingClientRect();
            let centerToWindowCenter = pos.offset * rect.height;
            let actualCenterToWindowCenter = (rect.top + rect.bottom) / 2 - innerHeight / 2;
            scrollBy(0, actualCenterToWindowCenter - centerToWindowCenter);
        }
        ImageScrollingExtension.loadScrollPosition = loadScrollPosition;
    })(ImageScrollingExtension = PoopJs.ImageScrollingExtension || (PoopJs.ImageScrollingExtension = {}));
})(PoopJs || (PoopJs = {}));
/// <reference path="./Array.ts" />
/// <reference path="./DateNowHack.ts" />
/// <reference path="./element.ts" />
/// <reference path="./elm.ts" />
/// <reference path="./Filterer/EntityFilterer.ts" />
/// <reference path="./etc.ts" />
/// <reference path="./fetch.ts" />
/// <reference path="./Object.ts" />
/// <reference path="./observer.ts" />
/// <reference path="./Paginate/Pagination.ts" />
/// <reference path="./Paginate/ImageScrolling.ts" />
/// <reference path="./Promise.ts" />
var PoopJs;
(function (PoopJs) {
    function __init__(window) {
        if (!window)
            window = globalThis.window;
        window.elm = PoopJs.Elm.elm;
        window.q = Object.assign(PoopJs.QuerySelector.WindowQ.q, { orElm: PoopJs.Elm.qOrElm });
        window.qq = PoopJs.QuerySelector.WindowQ.qq;
        PoopJs.ObjectExtension.defineValue(window.Element.prototype, 'q', PoopJs.QuerySelector.ElementQ.q);
        PoopJs.ObjectExtension.defineValue(window.Element.prototype, 'qq', PoopJs.QuerySelector.ElementQ.qq);
        PoopJs.ObjectExtension.defineValue(window.Element.prototype, 'appendTo', PoopJs.ElementExtension.appendTo);
        PoopJs.ObjectExtension.defineValue(window.Element.prototype, 'emit', PoopJs.ElementExtension.emit);
        PoopJs.ObjectExtension.defineValue(window.Document.prototype, 'q', PoopJs.QuerySelector.DocumentQ.q);
        PoopJs.ObjectExtension.defineValue(window.Document.prototype, 'qq', PoopJs.QuerySelector.DocumentQ.qq);
        PoopJs.ObjectExtension.defineValue(window.Promise, 'empty', PoopJs.PromiseExtension.empty);
        PoopJs.ObjectExtension.defineValue(window.Promise, 'frame', PoopJs.PromiseExtension.frame);
        PoopJs.ObjectExtension.defineValue(window.Promise, 'raf', PoopJs.PromiseExtension.frame);
        window.fetch.cached = PoopJs.FetchExtension.cached;
        window.fetch.doc = PoopJs.FetchExtension.doc;
        window.fetch.json = PoopJs.FetchExtension.json;
        window.fetch.cached.doc = PoopJs.FetchExtension.cachedDoc;
        window.fetch.doc.cached = PoopJs.FetchExtension.cachedDoc;
        window.fetch.cachedDoc = PoopJs.FetchExtension.cachedDoc;
        window.fetch.json.cached = PoopJs.FetchExtension.cachedJson;
        window.fetch.cached.json = PoopJs.FetchExtension.cachedJson;
        window.fetch.isCached = PoopJs.FetchExtension.isCached;
        PoopJs.ObjectExtension.defineValue(window.Response.prototype, 'cachedAt', 0);
        PoopJs.ObjectExtension.defineValue(window.Document.prototype, 'cachedAt', 0);
        PoopJs.ObjectExtension.defineValue(window.Object, 'defineValue', PoopJs.ObjectExtension.defineValue);
        PoopJs.ObjectExtension.defineValue(window.Object, 'defineGetter', PoopJs.ObjectExtension.defineGetter);
        // ObjectExtension.defineValue(Object, 'map', ObjectExtension.map);
        PoopJs.ObjectExtension.defineValue(window.Array, 'map', PoopJs.ArrayExtension.map);
        PoopJs.ObjectExtension.defineValue(window.Array.prototype, 'pmap', PoopJs.ArrayExtension.PMap.this_pmap);
        PoopJs.ObjectExtension.defineValue(window.Array.prototype, 'vsort', PoopJs.ArrayExtension.vsort);
        window.paginate = PoopJs.paginate;
        window.imageScrolling = PoopJs.ImageScrollingExtension;
        PoopJs.ObjectExtension.defineValue(window, '__init__', 'already inited');
        return 'inited';
    }
    PoopJs.__init__ = __init__;
    PoopJs.ObjectExtension.defineGetter(window, '__init__', () => __init__(window));
    if (window.localStorage.__init__) {
        window.__init__;
    }
})(PoopJs || (PoopJs = {}));
;
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        class FiltererItem {
            id = "";
            name;
            description;
            threeWay = false;
            mode = 'off';
            parent;
            button;
            incompatible;
            hidden = false;
            constructor(data) {
                data.button ??= 'button.ef-item';
                Object.assign(this, data);
                this.button = elm(data.button, click => this.click(click), contextmenu => this.contextmenu(contextmenu));
                this.parent.container.append(this.button);
                if (this.name) {
                    this.button.append(this.name);
                }
                if (this.description) {
                    this.button.title = this.description;
                }
                if (this.mode != 'off') {
                    this.toggleMode(data.mode, true);
                }
                if (this.hidden) {
                    this.hide();
                }
            }
            click(event) {
                if (this.mode == 'off') {
                    this.toggleMode('on');
                    return;
                }
                if (event.target != this.button)
                    return;
                if (this.mode == 'on') {
                    this.toggleMode(this.threeWay ? 'opposite' : 'off');
                }
                else {
                    this.toggleMode('off');
                }
            }
            contextmenu(event) {
                event.preventDefault();
                if (this.mode != 'opposite') {
                    this.toggleMode('opposite');
                }
                else {
                    this.toggleMode('off');
                }
            }
            toggleMode(mode, force = false) {
                if (this.mode == mode && !force)
                    return;
                this.mode = mode;
                this.button.setAttribute('ef-mode', mode);
                if (mode != 'off' && this.incompatible) {
                    this.parent.offIncompatible(this.incompatible);
                }
                this.parent.requestUpdate();
            }
            remove() {
                this.button.remove();
                this.toggleMode('off');
            }
            show() {
                this.hidden = false;
                this.button.hidden = false;
            }
            hide() {
                this.hidden = true;
                this.button.hidden = true;
            }
        }
        EntryFiltererExtension.FiltererItem = FiltererItem;
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
})(PoopJs || (PoopJs = {}));
/// <reference path="./FiltererItem.ts" />
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        class Filter extends EntryFiltererExtension.FiltererItem {
            constructor(data) {
                data.button ??= 'button.ef-item.ef-filter[ef-mode="off"]';
                super(data);
            }
            /** returns if item should be visible */
            apply(data, el) {
                if (this.mode == 'off')
                    return true;
                let value = this.filter(data, el, this.mode);
                let result = typeof value == "number" ? value > 0 : value;
                if (this.mode == 'on')
                    return result;
                if (this.mode == 'opposite')
                    return !result;
            }
        }
        EntryFiltererExtension.Filter = Filter;
        class ValueFilter extends EntryFiltererExtension.FiltererItem {
            input;
            lastValue;
            constructor(data) {
                data.button ??= 'button.ef-item.ef-filter[ef-mode="off"]';
                super(data);
                let type = typeof data.input == 'number' ? 'number' : 'text';
                let value = JSON.stringify(data.input);
                let input = `input[type=${type}][value=${value}]`;
                this.input = elm(input, input => this.change()).appendTo(this.button);
            }
            change() {
                let value = this.getValue();
                if (this.lastValue != value) {
                    this.lastValue = value;
                    this.parent.requestUpdate();
                }
            }
            /** returns if item should be visible */
            apply(data, el) {
                if (this.mode == 'off')
                    return true;
                let value = this.filter(this.getValue(), data, el);
                let result = typeof value == "number" ? value > 0 : value;
                if (this.mode == 'on')
                    return result;
                if (this.mode == 'opposite')
                    return !result;
            }
            getValue() {
                let value = (this.input.type == 'text' ? this.input.value : this.input.valueAsNumber);
                return value;
            }
        }
        EntryFiltererExtension.ValueFilter = ValueFilter;
        class MatchFilter extends EntryFiltererExtension.FiltererItem {
            input;
            lastValue;
            matcher;
            constructor(data) {
                data.button ??= 'button.ef-item.ef-filter[ef-mode="off"]';
                data.value ??= data => JSON.stringify(data);
                super(data);
                let value = !data.input ? '' : JSON.stringify(data.input);
                let input = `input[type=text}][value=${value}]`;
                this.input = elm(input, input => this.change()).appendTo(this.button);
            }
            change() {
                if (this.lastValue != this.input.value) {
                    this.lastValue = this.input.value;
                    this.matcher = this.generateMatcher(this.lastValue);
                }
            }
            apply(data, el) {
                if (this.mode == 'off')
                    return true;
                let result = this.matcher(this.value(data, el));
                return this.mode == 'on' ? result : !result;
            }
            // matcherCache: Map<string, ((input: string) => boolean)> = new Map();
            // getMatcher(source: string): (input: string) => boolean {
            // 	if (this.matcherCache.has(source)) {
            // 		return this.matcherCache.get(source);
            // 	}
            // 	let matcher = this.generateMatcher(source);
            // 	this.matcherCache.set(source, matcher);
            // 	return matcher;
            // }
            generateMatcher(source) {
                source = source.trim();
                if (source.length == 0)
                    return () => true;
                if (source.includes(' ')) {
                    let parts = source.split(' ').map(e => this.generateMatcher(e));
                    return (input) => parts.every(m => m(input));
                }
                if (source.startsWith('-')) {
                    if (source.length < 3)
                        return () => true;
                    let base = this.generateMatcher(source.slice(1));
                    return (input) => !base(input);
                }
                try {
                    let flags = source.toLowerCase() == source ? 'i' : '';
                    let regex = new RegExp(source, flags);
                    return (input) => !!input.match(regex);
                }
                catch (e) { }
                ;
                return (input) => input.includes(source);
            }
        }
        EntryFiltererExtension.MatchFilter = MatchFilter;
        class TagFilter extends EntryFiltererExtension.FiltererItem {
            tags;
            input;
            highightClass;
            lastValue = '';
            cachedMatcher;
            constructor(data) {
                data.button ??= 'button.ef-item.ef-filter[ef-mode="off"]';
                super(data);
                this.input = elm(`input[type=text}]`, input => this.change()).appendTo(this.button);
                this.input.value = data.input || '';
                this.tags = data.tags;
                this.cachedMatcher = [];
                this.highightClass = data.highightClass ?? 'ef-tag-highlisht';
            }
            apply(data, el) {
                let tags = this.getTags(data, el);
                tags.map(tag => this.resetHighlight(tag));
                let results = this.cachedMatcher.map(m => {
                    let r = { positive: m.positive, count: 0 };
                    for (let tag of tags) {
                        let str = typeof tag == 'string' ? tag : tag.innerText;
                        let val = m.matches(str);
                        if (val) {
                            r.count++;
                            this.highlightTag(tag, m.positive);
                        }
                    }
                    return r;
                });
                return results.every(r => r.positive ? r.count > 0 : r.count == 0);
            }
            resetHighlight(tag) {
                if (typeof tag == 'string')
                    return;
                tag.classList.remove(this.highightClass);
            }
            highlightTag(tag, positive) {
                if (typeof tag == 'string')
                    return;
                // FIXME
                tag.classList.add(this.highightClass);
            }
            getTags(data, el) {
                if (typeof this.tags == 'string')
                    return el.qq(this.tags);
                return this.tags(data, el, this.mode);
            }
            getTagStrings(data, el) {
                let tags = this.getTags(data, el);
                if (typeof tags[0] == 'string')
                    return tags;
                return tags.map((e) => e.innerText);
            }
            change() {
                if (this.lastValue == this.input.value)
                    return;
                this.lastValue = this.input.value;
                this.cachedMatcher = this.parseMatcher(this.lastValue);
                this.parent.requestUpdate();
            }
            parseMatcher(matcher) {
                matcher.trim();
                if (!matcher)
                    return [];
                if (matcher.includes(' ')) {
                    let parts = matcher.match(/"[^"]*"|\S+/g) || [];
                    return parts.flatMap(e => this.parseMatcher(e));
                }
                if (matcher.startsWith('-')) {
                    let parts = this.parseMatcher(matcher.slice(1));
                    return parts.map(e => ({ positive: !e.positive, matches: e.matches }));
                }
                if (matcher.match(/"^[^"]*"$/)) {
                    matcher = matcher.slice(1, -1);
                    return [{ positive: true, matches: tag => tag == matcher }];
                }
                if (matcher.length < 3)
                    return [];
                if (matcher.match(/"/)?.length == 1)
                    return [];
                try {
                    let g = new RegExp(matcher, 'i');
                    return [{ positive: true, matches: tag => !!tag.match(g) }];
                }
                catch (e) { }
                return [{ positive: true, matches: tag => tag.includes(matcher) }];
            }
        }
        EntryFiltererExtension.TagFilter = TagFilter;
        class PaginationInfoFilter extends EntryFiltererExtension.FiltererItem {
            constructor(data) {
                super(data);
                this.init();
            }
            apply() {
                return true;
            }
            Paginate = PoopJs.PaginateExtension.Paginate;
            countPaginate() {
                let data = { running: 0, queued: 0, };
                for (let p of this.Paginate.instances) {
                    data.running += +p.running;
                    data.queued += p.queued;
                }
                return data;
            }
            updateInfo() {
                let data = this.countPaginate();
                if (!data.running && !data.queued) {
                    this.hidden || this.hide();
                }
                else {
                    this.hidden && this.show();
                    let text = `... +${data.running + data.queued}`;
                    if (this.button.innerHTML != text) {
                        this.button.innerText = text;
                    }
                }
            }
            async init() {
                while (true) {
                    await Promise.frame();
                    this.updateInfo();
                }
            }
        }
        EntryFiltererExtension.PaginationInfoFilter = PaginationInfoFilter;
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        class Modifier extends EntryFiltererExtension.FiltererItem {
            constructor(data) {
                data.button ??= 'button.ef-item.ef-modifier[ef-mode="off"]';
                super(data);
            }
            toggleMode(mode, force = false) {
                if (this.mode == mode && !force)
                    return;
                this.parent.moveToTop(this);
                super.toggleMode(mode, force);
            }
            apply(data, el) {
                let oldMode = el.getAttribute(`ef-modifier-${this.id}-mode`);
                if (oldMode == this.mode && !this.runOnNoChange)
                    return;
                this.modifier(data, el, this.mode, null);
                el.setAttribute(`ef-modifier-${this.id}-mode`, this.mode);
            }
        }
        EntryFiltererExtension.Modifier = Modifier;
        class Prefixer extends EntryFiltererExtension.FiltererItem {
            constructor(data) {
                data.button ??= 'button.ef-item.ef-modifier[ef-mode="off"]';
                data.target ??= e => e;
                data.prefixAttribute ??= 'ef-prefix';
                data.postfixAttribute ??= 'ef-postfix';
                data.all ??= false;
                super(data);
            }
            apply(data, el) {
                let targets = this.getTargets(el, data);
                if (this.prefix) {
                    if (this.mode == 'off') {
                        targets.map(e => e.removeAttribute(this.prefixAttribute));
                    }
                    else {
                        let value = this.prefix(data, el, this.mode);
                        targets.map(e => e.setAttribute(this.prefixAttribute, value));
                    }
                }
                if (this.postfix) {
                    if (this.mode == 'off') {
                        targets.map(e => e.removeAttribute(this.postfixAttribute));
                    }
                    else {
                        let value = this.postfix(data, el, this.mode);
                        targets.map(e => e.setAttribute(this.postfixAttribute, value));
                    }
                }
            }
            getTargets(el, data) {
                if (typeof this.target == 'string') {
                    if (this.all)
                        return el.qq(this.target);
                    return [el.q(this.target)];
                }
                else {
                    let targets = this.target(el, data, this.mode);
                    return Array.isArray(targets) ? targets : [targets];
                }
            }
        }
        EntryFiltererExtension.Prefixer = Prefixer;
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        class Sorter extends EntryFiltererExtension.FiltererItem {
            constructor(data) {
                data.button ??= 'button.ef-item.ef-sorter[ef-mode="off"]';
                data.comparator ??= (a, b) => a > b ? 1 : a < b ? -1 : 0;
                super(data);
            }
            toggleMode(mode, force = false) {
                if (this.mode == mode && !force)
                    return;
                this.parent.moveToTop(this);
                super.toggleMode(mode, force);
            }
            sort(list) {
                if (this.mode == 'off')
                    return list;
                return list.vsort(([data, el]) => this.apply(data, el), (a, b) => this.compare(a, b));
            }
            /** returns order of entry */
            apply(data, el) {
                return this.sorter(data, el, this.mode);
            }
            compare(a, b) {
                if (this.mode == 'on') {
                    return this.comparator(a, b);
                }
                if (this.mode == 'opposite') {
                    return this.comparator(b, a);
                }
                return 0;
            }
        }
        EntryFiltererExtension.Sorter = Sorter;
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        /**
         * can be either Map or WeakMap
         * (WeakMap is likely to be useless if there are less then 10k old nodes in map)
         */
        let MapType = Map;
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
    PoopJs.EF = EntryFiltererExtension.EntryFilterer;
})(PoopJs || (PoopJs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3Bvb3Bqcy9Qcm9taXNlLnRzIiwiLi4vcG9vcGpzL0FycmF5LnRzIiwiLi4vcG9vcGpzL0RhdGVOb3dIYWNrLnRzIiwiLi4vcG9vcGpzL09iamVjdC50cyIsIi4uL3Bvb3Bqcy9lbGVtZW50LnRzIiwiLi4vcG9vcGpzL2VsbS50cyIsIi4uL3Bvb3Bqcy9ldGMudHMiLCIuLi9wb29wanMvZmV0Y2gudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvRW50aXR5RmlsdGVyZXIudHMiLCIuLi9wb29wanMvb2JzZXJ2ZXIudHMiLCIuLi9wb29wanMvUGFnaW5hdGUvUGFnaW5hdGlvbi50cyIsIi4uL3Bvb3Bqcy9QYWdpbmF0ZS9JbWFnZVNjcm9sbGluZy50cyIsIi4uL3Bvb3Bqcy9pbml0LnRzIiwiLi4vcG9vcGpzL3R5cGVzLnRzIiwiLi4vcG9vcGpzL0ZpbHRlcmVyL0ZpbHRlcmVySXRlbS50cyIsIi4uL3Bvb3Bqcy9GaWx0ZXJlci9GaWx0ZXIudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvTW9kaWZpZXIudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvU29ydGVyLnRzIiwiLi4vcG9vcGpzL0ZpbHRlcmVyL3R5cGVzLnRzIiwiLi4vcG9vcGpzL1BhZ2luYXRlL21vZGlmaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLE1BQU0sQ0F3Q2Y7QUF4Q0QsV0FBVSxNQUFNO0lBY2YsSUFBaUIsZ0JBQWdCLENBd0JoQztJQXhCRCxXQUFpQixnQkFBZ0I7UUFHaEM7O1dBRUc7UUFDSCxTQUFnQixLQUFLO1lBQ3BCLElBQUksT0FBMkIsQ0FBQztZQUNoQyxJQUFJLE1BQThCLENBQUM7WUFDbkMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM1QyxPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLE1BQU0s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QUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekIsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLEdBQUcs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RyxHQUFHLENBQUM7SUFHbkIsQ0FBQyxFQTVHZ0Isc0JBQXNCLEdBQXRCLDZCQUFzQixLQUF0Qiw2QkFBc0IsUUE0R3RDO0lBRVUsU0FBRSxHQUFHLHNCQUFzQixDQUFDLGFBQWEsQ0FBQztBQUN0RCxDQUFDLEVBakhTLE1BQU0sS0FBTixNQUFNLFFBaUhmIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgVW53cmFwcGVkUHJvbWlzZTxUID0gdm9pZD4gZXh0ZW5kcyBQcm9taXNlPFQ+IHtcclxuXHRcdHJlc29sdmUodmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPik6IHZvaWQ7XHJcblx0XHRyZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQ7XHJcblxyXG5cdFx0cih2YWx1ZSlcclxuXHRcdHIodmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPik6IHZvaWQ7XHJcblx0XHRqOiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xyXG5cclxuXHRcdC8vIFByb21pc2VTdGF0ZTogJ3BlbmRpbmcnIHwgJ2Z1bGZpbGxlZCcgfCAncmVqZWN0ZWQnO1xyXG5cdFx0Ly8gUHJvbWlzZVJlc3VsdD86IFQgfCBFcnJvcjtcclxuXHR9XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgUHJvbWlzZUV4dGVuc2lvbiB7XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ3JlYXRlcyB1bndyYXBwZWQgcHJvbWlzZVxyXG5cdFx0ICovXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZW1wdHk8VCA9IHZvaWQ+KCk6IFVud3JhcHBlZFByb21pc2U8VD4ge1xyXG5cdFx0XHRsZXQgcmVzb2x2ZTogKHZhbHVlOiBUKSA9PiB2b2lkO1xyXG5cdFx0XHRsZXQgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xyXG5cdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgUHJvbWlzZTxUPigociwgaikgPT4ge1xyXG5cdFx0XHRcdHJlc29sdmUgPSByO1xyXG5cdFx0XHRcdHJlamVjdCA9IGo7XHJcblx0XHRcdH0pLCB7XHJcblx0XHRcdFx0cmVzb2x2ZSwgcmVqZWN0LFxyXG5cdFx0XHRcdHI6IHJlc29sdmUsIGo6IHJlamVjdCxcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZyYW1lKG4gPSAxKTogUHJvbWlzZTxudW1iZXI+IHtcclxuXHRcdFx0d2hpbGUgKC0tbiA+IDApIHtcclxuXHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vUHJvbWlzZS50c1wiIC8+XHJcbm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBuYW1lc3BhY2UgQXJyYXlFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBwbWFwPFQsIFY+KHRoaXM6IFRbXSwgbWFwcGVyOiAoZTogVCwgaTogbnVtYmVyLCBhOiBUW10pID0+IFByb21pc2U8Vj4gfCBWLCB0aHJlYWRzID0gNSk6IFByb21pc2U8VltdPiB7XHJcblx0XHRcdGlmICghKHRocmVhZHMgPiAwKSkgdGhyb3cgbmV3IEVycm9yKCk7XHJcblx0XHRcdGxldCB0YXNrczogW1QsIG51bWJlciwgVFtdXVtdID0gdGhpcy5tYXAoKGUsIGksIGEpID0+IFtlLCBpLCBhXSk7XHJcblx0XHRcdGxldCByZXN1bHRzID0gQXJyYXk8Vj4odGFza3MubGVuZ3RoKTtcclxuXHRcdFx0bGV0IGFueVJlc29sdmVkID0gUHJvbWlzZUV4dGVuc2lvbi5lbXB0eSgpO1xyXG5cdFx0XHRsZXQgZnJlZVRocmVhZHMgPSB0aHJlYWRzO1xyXG5cdFx0XHRhc3luYyBmdW5jdGlvbiBydW5UYXNrKHRhc2s6IFtULCBudW1iZXIsIFRbXV0pOiBQcm9taXNlPFY+IHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IG1hcHBlciguLi50YXNrKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdHJldHVybiBlcnI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFzeW5jIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XHJcblx0XHRcdFx0ZnJlZVRocmVhZHMtLTtcclxuXHRcdFx0XHRyZXN1bHRzW3Rhc2tbMV1dID0gYXdhaXQgcnVuVGFzayh0YXNrKTtcclxuXHRcdFx0XHRmcmVlVGhyZWFkcysrO1xyXG5cdFx0XHRcdGxldCBvbGRBbnlSZXNvbHZlZCA9IGFueVJlc29sdmVkO1xyXG5cdFx0XHRcdGFueVJlc29sdmVkID0gUHJvbWlzZUV4dGVuc2lvbi5lbXB0eSgpO1xyXG5cdFx0XHRcdG9sZEFueVJlc29sdmVkLnIodW5kZWZpbmVkKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCB0YXNrIG9mIHRhc2tzKSB7XHJcblx0XHRcdFx0aWYgKGZyZWVUaHJlYWRzID09IDApIHtcclxuXHRcdFx0XHRcdGF3YWl0IGFueVJlc29sdmVkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRydW4odGFzayk7XHJcblx0XHRcdH1cclxuXHRcdFx0d2hpbGUgKGZyZWVUaHJlYWRzIDwgdGhyZWFkcykge1xyXG5cdFx0XHRcdGF3YWl0IGFueVJlc29sdmVkO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiByZXN1bHRzO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBtYXA8VCA9IG51bWJlcj4odGhpczogQXJyYXlDb25zdHJ1Y3RvciwgbGVuZ3RoOiBudW1iZXIsIG1hcHBlcjogKG51bWJlcikgPT4gVCA9IGkgPT4gaSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcyhsZW5ndGgpLmZpbGwoMCkubWFwKChlLCBpLCBhKSA9PiBtYXBwZXIoaSkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiB2c29ydDxUPih0aGlzOiBUW10sIG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgYTogVFtdKSA9PiBudW1iZXIsIHNvcnRlcj86ICgoYTogbnVtYmVyLCBiOiBudW1iZXIsIGFlOiBULCBiZTogVCkgPT4gbnVtYmVyKSB8IC0xKTogVFtdO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHZzb3J0PFQsIFY+KHRoaXM6IFRbXSwgbWFwcGVyOiAoZTogVCwgaTogbnVtYmVyLCBhOiBUW10pID0+IFYsIHNvcnRlcjogKChhOiBWLCBiOiBWLCBhZTogVCwgYmU6IFQpID0+IG51bWJlcikgfCAtMSk6IFRbXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiB2c29ydDxUPih0aGlzOiBUW10sIG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgYTogVFtdKSA9PiBudW1iZXIsIHNvcnRlcjogKChhOiBudW1iZXIsIGI6IG51bWJlciwgYWU6IFQsIGJlOiBUKSA9PiBudW1iZXIpIHwgLTEgPSAoYSwgYikgPT4gYSAtIGIpOiBUW10ge1xyXG5cdFx0XHRsZXQgdGhlU29ydGVyID0gdHlwZW9mIHNvcnRlciA9PSAnZnVuY3Rpb24nID8gc29ydGVyIDogKGEsIGIpID0+IGIgLSBhO1xyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0XHRcdC5tYXAoKGUsIGksIGEpID0+ICh7IGUsIHY6IG1hcHBlcihlLCBpLCBhKSB9KSlcclxuXHRcdFx0XHQuc29ydCgoYSwgYikgPT4gdGhlU29ydGVyKGEudiwgYi52LCBhLmUsIGIuZSkpXHJcblx0XHRcdFx0Lm1hcChlID0+IGUuZSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBQTWFwPFQsIFYsIEUgPSBuZXZlcj4ge1xyXG5cdFx0XHQvKiogT3JpZ2luYWwgYXJyYXkgKi9cclxuXHRcdFx0c291cmNlOiBUW10gPSBbXTtcclxuXHRcdFx0LyoqIEFzeW5jIGVsZW1lbnQgY29udmVydGVyIGZ1bmN0aW9uICovXHJcblx0XHRcdG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgYTogVFtdLCBwbWFwOiBQTWFwPFQsIFYsIEU+KSA9PiBQcm9taXNlPFYgfCBFPiA9IChlOiBUKSA9PiBlIGFzIGFueSBhcyBQcm9taXNlPFY+O1xyXG5cdFx0XHQvKiogTWF4IG51bWJlciBvZiByZXF1ZXN0cyBhdCBvbmNlLiAgIFxyXG5cdFx0XHQgKiAgKk1heSogYmUgY2hhbmdlZCBpbiBydW50aW1lICovXHJcblx0XHRcdHRocmVhZHM6IG51bWJlciA9IDU7XHJcblx0XHRcdC8qKiBNYXggZGlzdGFuY2UgYmV0d2VlbiB0aGUgb2xkZXJzIGluY29tcGxldGUgYW5kIG5ld2VzdCBhY3RpdmUgZWxlbWVudHMuICAgXHJcblx0XHRcdCAqICAqTWF5KiBiZSBjaGFuZ2VkIGluIHJ1bnRpbWUgKi9cclxuXHRcdFx0d2luZG93OiBudW1iZXIgPSBJbmZpbml0eTtcclxuXHJcblx0XHRcdC8qKiBVbmZpbmlzaGVkIHJlc3VsdCBhcnJheSAqL1xyXG5cdFx0XHRyZXN1bHRzOiAoViB8IEUgfCB1bmRlZmluZWQpW10gPSBbXTtcclxuXHRcdFx0LyoqIFByb21pc2VzIGZvciBldmVyeSBlbGVtZW50ICovXHJcblx0XHRcdHJlcXVlc3RzOiBVbndyYXBwZWRQcm9taXNlPFYgfCBFPltdID0gW107XHJcblxyXG5cdFx0XHRiZWZvcmVTdGFydDogKGRhdGE6IHtcclxuXHRcdFx0XHRlOiBULCBpOiBudW1iZXIsIGE6IFRbXSwgdj86IFYgfCBFLCByOiAoViB8IEUpW10sIHBtYXA6IFBNYXA8VCwgViwgRT5cclxuXHRcdFx0fSkgPT4gUHJvbWlzZTx2b2lkPiB8IHZvaWQgPSAoKSA9PiB7IH07XHJcblx0XHRcdGFmdGVyQ29tcGxldGU6IChkYXRhOiB7XHJcblx0XHRcdFx0ZTogVCwgaTogbnVtYmVyLCBhOiBUW10sIHY6IFYgfCBFLCByOiAoViB8IEUpW10sIHBtYXA6IFBNYXA8VCwgViwgRT5cclxuXHRcdFx0fSkgPT4gUHJvbWlzZTx2b2lkPiB8IHZvaWQgPSAoKSA9PiB7IH07XHJcblxyXG5cdFx0XHQvKiogTGVuZ3RoIG9mIHRoZSBhcnJheSAqL1xyXG5cdFx0XHRsZW5ndGg6IG51bWJlciA9IC0xO1xyXG5cdFx0XHQvKiogVGhlIG51bWJlciBvZiBlbGVtZW50cyBmaW5pc2hlZCBjb252ZXJ0aW5nICovXHJcblx0XHRcdGNvbXBsZXRlZDogbnVtYmVyID0gLTE7XHJcblx0XHRcdC8qKiBUaHJlYWRzIGN1cnJlbnRseSB3b3JraW5nICAgXHJcblx0XHRcdCAqICBpbiB0aGUgbWFwcGVyIGZ1bmN0aW9uOiBpbmNsdWRpbmcgdGhlIGN1cnJlbnQgb25lICovXHJcblx0XHRcdGFjdGl2ZVRocmVhZHM6IG51bWJlciA9IC0xO1xyXG5cdFx0XHRsYXN0U3RhcnRlZDogbnVtYmVyID0gLTE7XHJcblxyXG5cdFx0XHRhbGxUYXNrc0RvbmU6IFVud3JhcHBlZFByb21pc2U8KFYgfCBFKVtdPiAmIHsgcG1hcDogUE1hcDxULCBWLCBFPiB9O1xyXG5cdFx0XHRhbnlUYXNrUmVzb2x2ZWQ6IFVud3JhcHBlZFByb21pc2U8dm9pZD47XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3Rvcihzb3VyY2U6IFBhcnRpYWw8UE1hcDxULCBWLCBFPj4pIHtcclxuXHRcdFx0XHR0aGlzLmFsbFRhc2tzRG9uZSA9IE9iamVjdC5hc3NpZ24odGhpcy5lbXB0eVJlc3VsdDwoViB8IEUpW10+KCksIHsgcG1hcDogdGhpcyB9KTtcclxuXHRcdFx0XHR0aGlzLmFueVRhc2tSZXNvbHZlZCA9IHRoaXMuZW1wdHlSZXN1bHQoKTtcclxuXHRcdFx0XHRmb3IgKGxldCBrIG9mIE9iamVjdC5rZXlzKHRoaXMpIGFzIChrZXlvZiBQTWFwPFQsIFYsIEU+KVtdKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIHNvdXJjZVtrXSA9PSB0eXBlb2YgdGhpc1trXSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzW2tdID0gc291cmNlW2tdIGFzIGFueTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc291cmNlW2tdKSB7XHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgUE1hcDogaW52YWxpZCBjb25zdHJ1Y3RvciBwYXJhbWV0ZXI6IHByb3BlcnR5ICR7a306IGV4cGVjdGVkICR7dHlwZW9mIHRoaXNba119LCBidXQgZ290ICR7dHlwZW9mIHNvdXJjZVtrXX1gKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFzeW5jIHN0YXJ0VGFzayhhcnJheUluZGV4OiBudW1iZXIpIHtcclxuXHRcdFx0XHR0aGlzLmFjdGl2ZVRocmVhZHMrKztcclxuXHRcdFx0XHRsZXQgZSA9IHRoaXMuc291cmNlW2FycmF5SW5kZXhdO1xyXG5cdFx0XHRcdGF3YWl0IHRoaXMuYmVmb3JlU3RhcnQoe1xyXG5cdFx0XHRcdFx0ZTogdGhpcy5zb3VyY2VbYXJyYXlJbmRleF0sXHJcblx0XHRcdFx0XHRpOiBhcnJheUluZGV4LFxyXG5cdFx0XHRcdFx0YTogdGhpcy5zb3VyY2UsXHJcblx0XHRcdFx0XHR2OiB1bmRlZmluZWQsXHJcblx0XHRcdFx0XHRyOiB0aGlzLnJlc3VsdHMsXHJcblx0XHRcdFx0XHRwbWFwOiB0aGlzLFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHRoaXMubGFzdFN0YXJ0ZWQgPSBhcnJheUluZGV4O1xyXG5cdFx0XHRcdGxldCB2OiBWIHwgRTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0diA9IGF3YWl0IHRoaXMubWFwcGVyKHRoaXMuc291cmNlW2FycmF5SW5kZXhdLCBhcnJheUluZGV4LCB0aGlzLnNvdXJjZSwgdGhpcyk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0diA9IGUgYXMgRTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5yZXN1bHRzW2FycmF5SW5kZXhdID0gdjtcclxuXHRcdFx0XHR0aGlzLnJlcXVlc3RzW2FycmF5SW5kZXhdLnJlc29sdmUodik7XHJcblx0XHRcdFx0dGhpcy5jb21wbGV0ZWQrKztcclxuXHRcdFx0XHRhd2FpdCB0aGlzLmFmdGVyQ29tcGxldGUoe1xyXG5cdFx0XHRcdFx0ZTogdGhpcy5zb3VyY2VbYXJyYXlJbmRleF0sXHJcblx0XHRcdFx0XHRpOiBhcnJheUluZGV4LFxyXG5cdFx0XHRcdFx0YTogdGhpcy5zb3VyY2UsXHJcblx0XHRcdFx0XHR2OiB2LFxyXG5cdFx0XHRcdFx0cjogdGhpcy5yZXN1bHRzLFxyXG5cdFx0XHRcdFx0cG1hcDogdGhpcyxcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR0aGlzLmFjdGl2ZVRocmVhZHMtLTtcclxuXHRcdFx0XHR0aGlzLmFueVRhc2tSZXNvbHZlZC5yZXNvbHZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXN5bmMgcnVuX2ludGVybmFsKCkge1xyXG5cdFx0XHRcdGZvciAobGV0IGFycmF5SW5kZXggPSAwOyBhcnJheUluZGV4IDwgdGhpcy5sZW5ndGg7IGFycmF5SW5kZXgrKykge1xyXG5cdFx0XHRcdFx0d2hpbGUgKHRoaXMuYWN0aXZlVGhyZWFkcyA+PSB0aGlzLnRocmVhZHMpIHtcclxuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5hbnlUYXNrUmVzb2x2ZWQ7XHJcblx0XHRcdFx0XHRcdHRoaXMuYW55VGFza1Jlc29sdmVkID0gdGhpcy5lbXB0eVJlc3VsdCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMucmVxdWVzdHNbYXJyYXlJbmRleCAtIHRoaXMud2luZG93XTtcclxuXHRcdFx0XHRcdHRoaXMuc3RhcnRUYXNrKGFycmF5SW5kZXgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR3aGlsZSAodGhpcy5hY3RpdmVUaHJlYWRzID4gMCkge1xyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5hbnlUYXNrUmVzb2x2ZWQ7XHJcblx0XHRcdFx0XHR0aGlzLmFueVRhc2tSZXNvbHZlZCA9IHRoaXMuZW1wdHlSZXN1bHQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5hbGxUYXNrc0RvbmUucmVzb2x2ZSh0aGlzLnJlc3VsdHMgYXMgKFYgfCBFKVtdKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hbGxUYXNrc0RvbmU7XHJcblx0XHRcdH1cclxuXHRcdFx0cnVuKCkge1xyXG5cdFx0XHRcdHRoaXMucHJlcGFyZSgpO1xyXG5cdFx0XHRcdHRoaXMucnVuX2ludGVybmFsKCk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWxsVGFza3NEb25lO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwYXVzZSgpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5hY3RpdmVUaHJlYWRzIDwgdGhpcy5sZW5ndGggKyB0aGlzLnRocmVhZHMpXHJcblx0XHRcdFx0XHR0aGlzLmFjdGl2ZVRocmVhZHMgKz0gdGhpcy5sZW5ndGggKyB0aGlzLnRocmVhZHM7XHJcblx0XHRcdH1cclxuXHRcdFx0dW5wYXVzZSgpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5hY3RpdmVUaHJlYWRzID49IHRoaXMubGVuZ3RoICsgdGhpcy50aHJlYWRzKVxyXG5cdFx0XHRcdFx0dGhpcy5hY3RpdmVUaHJlYWRzIC09IHRoaXMubGVuZ3RoICsgdGhpcy50aHJlYWRzO1xyXG5cdFx0XHRcdHRoaXMuYW55VGFza1Jlc29sdmVkLnIoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYW5jZWwoKSB7XHJcblx0XHRcdFx0dGhpcy5tYXBwZXIgPSAoKCkgPT4geyB9KSBhcyBhbnk7XHJcblx0XHRcdFx0dGhpcy5iZWZvcmVTdGFydCA9ICgpID0+IHsgfTtcclxuXHRcdFx0XHR0aGlzLmFmdGVyQ29tcGxldGUgPSAoKSA9PiB7IH07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHByZXBhcmUoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubGVuZ3RoID09IC0xKSB0aGlzLmxlbmd0aCA9IHRoaXMuc291cmNlLmxlbmd0aDtcclxuXHRcdFx0XHRpZiAodGhpcy5yZXN1bHRzLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLnJlc3VsdHMgPSBBcnJheSh0aGlzLmxlbmd0aCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLnJlcXVlc3RzLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLnJlcXVlc3RzID0gdGhpcy5zb3VyY2UubWFwKGUgPT4gdGhpcy5lbXB0eVJlc3VsdCgpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuY29tcGxldGVkIDwgMCkgdGhpcy5jb21wbGV0ZWQgPSAwO1xyXG5cdFx0XHRcdGlmICh0aGlzLmFjdGl2ZVRocmVhZHMgPCAwKSB0aGlzLmFjdGl2ZVRocmVhZHMgPSAwO1xyXG5cdFx0XHRcdGlmICh0aGlzLmxhc3RTdGFydGVkIDwgLTEpIHRoaXMubGFzdFN0YXJ0ZWQgPSAtMTtcclxuXHRcdFx0XHR0aGlzLmFueVRhc2tSZXNvbHZlZCA9IHRoaXMuZW1wdHlSZXN1bHQoKTtcclxuXHRcdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuYWxsVGFza3NEb25lLCB7IHBtYXA6IHRoaXMgfSk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGVtcHR5UmVzdWx0PFQgPSBWIHwgRT4oKTogVW53cmFwcGVkUHJvbWlzZTxUPiB7XHJcblx0XHRcdFx0bGV0IHJlc29sdmUhOiAodmFsdWU6IFQpID0+IHZvaWQ7XHJcblx0XHRcdFx0bGV0IHJlamVjdCE6IChyZWFzb24/OiBhbnkpID0+IHZvaWQ7XHJcblx0XHRcdFx0bGV0IHAgPSBuZXcgUHJvbWlzZTxUPigociwgaikgPT4ge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSA9IHI7XHJcblx0XHRcdFx0XHRyZWplY3QgPSBqO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiBPYmplY3QuYXNzaWduKHAsIHsgcmVzb2x2ZSwgcmVqZWN0LCByOiByZXNvbHZlLCBqOiByZWplY3QgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0YXRpYyB0aGlzX3BtYXA8VCwgViwgRSA9IG5ldmVyPih0aGlzOiBUW10sIG1hcHBlcjogUE1hcDxULCBWLCBFPlsnbWFwcGVyJ10sIG9wdGlvbnM6IFBhcnRpYWw8UE1hcDxULCBWLCBFPj4gfCBudW1iZXIgfCB0cnVlID0ge30pIHtcclxuXHRcdFx0XHRpZiAob3B0aW9ucyA9PSB0cnVlKSBvcHRpb25zID0gSW5maW5pdHk7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zID09ICdudW1iZXInKSBvcHRpb25zID0geyB0aHJlYWRzOiBvcHRpb25zIH07XHJcblx0XHRcdFx0bGV0IHBtYXAgPSBuZXcgUE1hcCh7IHNvdXJjZTogdGhpcywgbWFwcGVyLCAuLi5vcHRpb25zIH0pO1xyXG5cdFx0XHRcdHJldHVybiBwbWFwLnJ1bigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0YXRpYyBwbWFwPFQsIFYsIEUgPSBuZXZlcj4oYXJyYXk6IFRbXSwgbWFwcGVyOiBQTWFwPFQsIFYsIEU+WydtYXBwZXInXSwgb3B0aW9uczogUGFydGlhbDxQTWFwPFQsIFYsIEU+PiB8IG51bWJlciB8IHRydWUgPSB7fSkge1xyXG5cdFx0XHRcdGlmIChvcHRpb25zID09IHRydWUpIG9wdGlvbnMgPSBJbmZpbml0eTtcclxuXHRcdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMgPT0gJ251bWJlcicpIG9wdGlvbnMgPSB7IHRocmVhZHM6IG9wdGlvbnMgfTtcclxuXHRcdFx0XHRsZXQgcG1hcCA9IG5ldyBQTWFwKHsgc291cmNlOiBhcnJheSwgbWFwcGVyLCAuLi5vcHRpb25zIH0pO1xyXG5cdFx0XHRcdHJldHVybiBwbWFwLnJ1bigpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBEYXRlTm93SGFjayB7XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBzcGVlZE11bHRpcGxpZXIgPSAxO1xyXG5cdFx0ZXhwb3J0IGxldCBkZWx0YU9mZnNldCA9IDA7XHJcblx0XHRleHBvcnQgbGV0IHN0YXJ0UmVhbHRpbWUgPSAwO1xyXG5cdFx0ZXhwb3J0IGxldCBzdGFydFRpbWUgPSAwO1xyXG5cclxuXHRcdC8vIGV4cG9ydCBsZXQgc3BlZWRNdWx0aXBsaWVyID0gMTtcclxuXHRcdGV4cG9ydCBsZXQgcGVyZm9ybWFuY2VEZWx0YU9mZnNldCA9IDA7XHJcblx0XHRleHBvcnQgbGV0IHBlcmZvcm1hbmNlU3RhcnRSZWFsdGltZSA9IDA7XHJcblx0XHRleHBvcnQgbGV0IHBlcmZvcm1hbmNlU3RhcnRUaW1lID0gMDtcclxuXHJcblx0XHRleHBvcnQgbGV0IHVzZWRNZXRob2RzID0ge1xyXG5cdFx0XHRkYXRlOiB0cnVlLFxyXG5cdFx0XHRwZXJmb3JtYW5jZTogdHJ1ZSxcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gdG9GYWtlVGltZShyZWFsdGltZTogbnVtYmVyKSB7XHJcblx0XHRcdGlmICghdXNlZE1ldGhvZHMuZGF0ZSkgcmV0dXJuIHJlYWx0aW1lO1xyXG5cdFx0XHRyZXR1cm4gTWF0aC5mbG9vcihcclxuXHRcdFx0XHQocmVhbHRpbWUgLSBzdGFydFJlYWx0aW1lKSAqIHNwZWVkTXVsdGlwbGllciArIHN0YXJ0VGltZSArIGRlbHRhT2Zmc2V0XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gdG9QZXJmb3JtYW5jZUZha2VUaW1lKHJlYWx0aW1lOiBudW1iZXIpIHtcclxuXHRcdFx0aWYgKCF1c2VkTWV0aG9kcy5wZXJmb3JtYW5jZSkgcmV0dXJuIHJlYWx0aW1lO1xyXG5cdFx0XHRyZXR1cm4gKHJlYWx0aW1lIC0gcGVyZm9ybWFuY2VTdGFydFJlYWx0aW1lKSAqIHNwZWVkTXVsdGlwbGllclxyXG5cdFx0XHRcdCsgcGVyZm9ybWFuY2VTdGFydFRpbWUgKyBwZXJmb3JtYW5jZURlbHRhT2Zmc2V0O1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBsZXQgYnJhY2tldFNwZWVkcyA9IFswLjA1LCAwLjI1LCAxLCAyLCA1LCAxMCwgMjAsIDYwLCAxMjBdO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHNwZWVkaGFjayhzcGVlZDogbnVtYmVyID0gMSkge1xyXG5cdFx0XHRpZiAodHlwZW9mIHNwZWVkICE9ICdudW1iZXInKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBEYXRlTm93SGFjazogaW52YWxpZCBzcGVlZDogJHtzcGVlZH1gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhY3RpdmF0ZSgpO1xyXG5cdFx0XHRhY3RpdmF0ZVBlcmZvcm1hbmNlKCk7XHJcblx0XHRcdHNwZWVkTXVsdGlwbGllciA9IHNwZWVkO1xyXG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gc3BlZWQgKyAnJztcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiB0aW1lanVtcChzZWNvbmRzOiBudW1iZXIpIHtcclxuXHRcdFx0YWN0aXZhdGUoKTtcclxuXHRcdFx0YWN0aXZhdGVQZXJmb3JtYW5jZSgpO1xyXG5cdFx0XHRkZWx0YU9mZnNldCArPSBzZWNvbmRzICogMTAwMDtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hTcGVlZGhhY2soZGlyOiBudW1iZXIpIHtcclxuXHRcdFx0bGV0IGN1cnJlbnRJbmRleCA9IGJyYWNrZXRTcGVlZHMuaW5kZXhPZihzcGVlZE11bHRpcGxpZXIpO1xyXG5cdFx0XHRpZiAoY3VycmVudEluZGV4ID09IC0xKSBjdXJyZW50SW5kZXggPSBicmFja2V0U3BlZWRzLmluZGV4T2YoMSk7XHJcblx0XHRcdGxldCBuZXdTcGVlZCA9IGJyYWNrZXRTcGVlZHNbY3VycmVudEluZGV4ICsgZGlyXTtcclxuXHRcdFx0aWYgKG5ld1NwZWVkID09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRzcGVlZGhhY2sobmV3U3BlZWQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gb25rZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcblx0XHRcdGlmIChldmVudC5jb2RlID09ICdCcmFja2V0TGVmdCcpIHtcclxuXHRcdFx0XHRzd2l0Y2hTcGVlZGhhY2soLTEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChldmVudC5jb2RlID09ICdCcmFja2V0UmlnaHQnKSB7XHJcblx0XHRcdFx0c3dpdGNoU3BlZWRoYWNrKDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gYmluZEJyYWNrZXRzKG1vZGUgPSAnb24nKSB7XHJcblx0XHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbmtleWRvd24pO1xyXG5cdFx0XHRpZiAobW9kZSA9PSAnb24nKSB7XHJcblx0XHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IGFjdGl2YXRlZCA9IGZhbHNlO1xyXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcblx0XHRcdERhdGUuX25vdyA/Pz0gRGF0ZS5ub3c7XHJcblx0XHRcdERhdGUucHJvdG90eXBlLl9nZXRUaW1lID8/PSBEYXRlLnByb3RvdHlwZS5nZXRUaW1lO1xyXG5cdFx0XHRzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHRzdGFydFJlYWx0aW1lID0gRGF0ZS5fbm93KCk7XHJcblx0XHRcdGRlbHRhT2Zmc2V0ID0gMDtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coRGF0ZS5ub3coKSwgKVxyXG5cdFx0XHQvLyBkZWJ1Z2dlcjtcclxuXHRcdFx0RGF0ZS5ub3cgPSAoKSA9PiB0b0Zha2VUaW1lKERhdGUuX25vdygpKTtcclxuXHRcdFx0RGF0ZS5wcm90b3R5cGUuZ2V0VGltZSA9IGZ1bmN0aW9uICh0aGlzOiBEYXRlICYgeyBfdD86IG51bWJlciB9KSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3QgPz89IHRvRmFrZVRpbWUodGhpcy5fZ2V0VGltZSgpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHREYXRlLnByb3RvdHlwZS52YWx1ZU9mID0gZnVuY3Rpb24gKHRoaXM6IERhdGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRUaW1lKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWN0aXZhdGVkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBsZXQgcGVyZm9ybWFuY2VBY3RpdmF0ZWQgPSBmYWxzZTtcclxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlUGVyZm9ybWFuY2UoKSB7XHJcblx0XHRcdHBlcmZvcm1hbmNlLl9ub3cgPz89IHBlcmZvcm1hbmNlLm5vdztcclxuXHRcdFx0cGVyZm9ybWFuY2VTdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHRcdFx0cGVyZm9ybWFuY2VTdGFydFJlYWx0aW1lID0gcGVyZm9ybWFuY2UuX25vdygpO1xyXG5cdFx0XHRwZXJmb3JtYW5jZURlbHRhT2Zmc2V0ID0gMDtcclxuXHRcdFx0cGVyZm9ybWFuY2Uubm93ID0gKCkgPT4gdG9QZXJmb3JtYW5jZUZha2VUaW1lKHBlcmZvcm1hbmNlLl9ub3coKSk7XHJcblx0XHRcdHBlcmZvcm1hbmNlQWN0aXZhdGVkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBPYmplY3RFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBkZWZpbmVWYWx1ZTxULCBLIGV4dGVuZHMga2V5b2YgVD4obzogVCwgcDogSywgdmFsdWU6IFRbS10pOiBUO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGRlZmluZVZhbHVlPFQ+KG86IFQsIGZuOiBGdW5jdGlvbik6IFQ7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZGVmaW5lVmFsdWU8VD4obzogVCwgcDoga2V5b2YgVCB8IHN0cmluZyB8IEZ1bmN0aW9uLCB2YWx1ZT86IGFueSk6IFQge1xyXG5cdFx0XHRpZiAodHlwZW9mIHAgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFtwLCB2YWx1ZV0gPSBbcC5uYW1lLCBwXSBhcyBbc3RyaW5nLCBGdW5jdGlvbl07XHJcblx0XHRcdH1cclxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIHAsIHtcclxuXHRcdFx0XHR2YWx1ZSxcclxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcblx0XHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXHJcblx0XHRcdFx0d3JpdGFibGU6IHRydWUsXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbztcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZGVmaW5lR2V0dGVyPFQsIEsgZXh0ZW5kcyBrZXlvZiBUPihvOiBULCBwOiBLLCBnZXQ6ICgpID0+IFRbS10pOiBUO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUdldHRlcjxUPihvOiBULCBnZXQ6IEZ1bmN0aW9uKTogVDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBkZWZpbmVHZXR0ZXI8VD4obzogVCwgcDogc3RyaW5nIHwga2V5b2YgVCB8IEZ1bmN0aW9uLCBnZXQ/OiBhbnkpOiBUIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBwID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRbcCwgZ2V0XSA9IFtwLm5hbWUsIHBdIGFzIFtzdHJpbmcsIEZ1bmN0aW9uXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobywgcCwge1xyXG5cdFx0XHRcdGdldCxcclxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcblx0XHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbztcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gbWFwPFQsIFY+KG86IFQsIG1hcHBlcjogKHY6IFZhbHVlT2Y8VD4sIGs6IGtleW9mIFQsIG86IFQpID0+IFYpOiBNYXBwZWRPYmplY3Q8VCwgVj4ge1xyXG5cdFx0XHRsZXQgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG8pIGFzIFtrZXlvZiBULCBWYWx1ZU9mPFQ+XVtdO1xyXG5cdFx0XHRyZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKGVudHJpZXMubWFwKChbaywgdl0pID0+IFtrLCBtYXBwZXIodiwgaywgbyldKSkgYXMgTWFwcGVkT2JqZWN0PFQsIFY+O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBRdWVyeVNlbGVjdG9yIHtcclxuXHJcblx0XHRleHBvcnQgbmFtZXNwYWNlIFdpbmRvd1Ege1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihzZWxlY3RvcjogSyk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4oc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEUgZXh0ZW5kcyBFbGVtZW50PihzZWxlY3Rvcjogc2VsZWN0b3IpOiBFO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihzZWxlY3Rvcjogc2VsZWN0b3IpOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxKHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gKHRoaXM/LmRvY3VtZW50ID8/IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHNlbGVjdG9yOiBLKTogKEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSlbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHNlbGVjdG9yOiBTKTogVGFnRWxlbWVudEZyb21UYWdOYW1lPE4+W107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHNlbGVjdG9yKTogRVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IHNlbGVjdG9yKTogKEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSlbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxKHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gWy4uLih0aGlzPy5kb2N1bWVudCA/PyBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcildO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IG5hbWVzcGFjZSBEb2N1bWVudFEge1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IEspOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHRoaXM6IERvY3VtZW50LCBzZWxlY3RvcjogUyk6IFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxOPjtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8RSBleHRlbmRzIEVsZW1lbnQ+KHRoaXM6IERvY3VtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiBFO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcSh0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmRvY3VtZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IERvY3VtZW50LCBzZWxlY3RvcjogSyk6IChIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10pW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxTIGV4dGVuZHMgc2VsZWN0b3IsIE4gPSBUYWdOYW1lRnJvbVNlbGVjdG9yPFM+Pih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj5bXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEUgZXh0ZW5kcyBFbGVtZW50Pih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogRVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IChIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10pW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcSh0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBbLi4udGhpcy5kb2N1bWVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcildO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IG5hbWVzcGFjZSBFbGVtZW50USB7XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBLKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxTIGV4dGVuZHMgc2VsZWN0b3IsIE4gPSBUYWdOYW1lRnJvbVNlbGVjdG9yPFM+Pih0aGlzOiBFbGVtZW50LCBzZWxlY3RvcjogUyk6IFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxOPjtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8RSBleHRlbmRzIEVsZW1lbnQ+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IEU7XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHEodGhpczogRWxlbWVudCwgc2VsZWN0b3I6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IEspOiAoSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdKVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj5bXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEUgZXh0ZW5kcyBFbGVtZW50Pih0aGlzOiBFbGVtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiBFW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBFbGVtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiAoSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdKVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXEodGhpczogRWxlbWVudCwgc2VsZWN0b3I6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBbLi4udGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRWxlbWVudEV4dGVuc2lvbiB7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZW1pdDxUIGV4dGVuZHMgQ3VzdG9tRXZlbnQ8eyBfZXZlbnQ/OiBzdHJpbmcgfT4+KHRoaXM6IEVsZW1lbnQsIHR5cGU6IFRbJ2RldGFpbCddWydfZXZlbnQnXSwgZGV0YWlsPzogVFsnZGV0YWlsJ10pO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVtaXQ8VD4odGhpczogRWxlbWVudCwgdHlwZTogc3RyaW5nLCBkZXRhaWw/OiBUKSB7XHJcblx0XHRcdGxldCBldmVudCA9IG5ldyBDdXN0b21FdmVudCh0eXBlLCB7XHJcblx0XHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0XHRkZXRhaWwsXHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBhcHBlbmRUbzxFIGV4dGVuZHMgRWxlbWVudD4odGhpczogRSwgcGFyZW50OiBFbGVtZW50IHwgc2VsZWN0b3IpOiBFIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBwYXJlbnQgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRwYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmVudCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cGFyZW50LmFwcGVuZCh0aGlzKTtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbG0ge1xyXG5cdFx0dHlwZSBDaGlsZCA9IE5vZGUgfCBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuO1xyXG5cdFx0dHlwZSBTb21lRXZlbnQgPSBFdmVudCAmIE1vdXNlRXZlbnQgJiBLZXlib2FyZEV2ZW50ICYgeyB0YXJnZXQ6IEhUTUxFbGVtZW50IH07XHJcblx0XHR0eXBlIExpc3RlbmVyID0gKChldmVudDogU29tZUV2ZW50KSA9PiBhbnkpXHJcblx0XHRcdCYgeyBuYW1lPzogYCR7JycgfCAnYm91bmQgJ30keydvbicgfCAnJ30ke2tleW9mIEhUTUxFbGVtZW50RXZlbnRNYXB9YCB8ICcnIH0gfCAoKGV2ZW50OiBTb21lRXZlbnQpID0+IGFueSk7XHJcblxyXG5cdFx0Y29uc3QgZWxtUmVnZXggPSBuZXcgUmVnRXhwKFtcclxuXHRcdFx0L14oPzx0YWc+W1xcdy1dKykvLFxyXG5cdFx0XHQvIyg/PGlkPltcXHctXSspLyxcclxuXHRcdFx0L1xcLig/PGNsYXNzPltcXHctXSspLyxcclxuXHRcdFx0L1xcWyg/PGF0dHIxPltcXHctXSspXFxdLyxcclxuXHRcdFx0L1xcWyg/PGF0dHIyPltcXHctXSspPSg/IVsnXCJdKSg/PHZhbDI+W15cXF1dKilcXF0vLFxyXG5cdFx0XHQvXFxbKD88YXR0cjM+W1xcdy1dKyk9XCIoPzx2YWwzPig/OlteXCJdfFxcXFxcIikqKVwiXFxdLyxcclxuXHRcdFx0L1xcWyg/PGF0dHI0PltcXHctXSspPVwiKD88dmFsND4oPzpbXiddfFxcXFwnKSopXCJcXF0vLFxyXG5cdFx0XS5tYXAoZSA9PiBlLnNvdXJjZSkuam9pbignfCcpLCAnZycpO1xyXG5cclxuXHRcdC8qKiBpZiBgZWxtYCBzaG91bGQgZGlzYWxsb3cgbGlzdGVuZXJzIG5vdCBleGlzdGluZyBhcyBgb24gKiBgIHByb3BlcnR5IG9uIHRoZSBlbGVtZW50ICovXHJcblx0XHRleHBvcnQgbGV0IGFsbG93T25seUV4aXN0aW5nTGlzdGVuZXJzID0gdHJ1ZTtcclxuXHJcblx0XHQvKiogaWYgYGVsbWAgc2hvdWxkIGFsbG93IG92ZXJyaWRpbmcgYG9uICogYCBsaXN0ZW5lcnMgaWYgbXVsdGlwbGUgb2YgdGhlbSBhcmUgcHJvdmlkZWQgKi9cclxuXHRcdGV4cG9ydCBsZXQgYWxsb3dPdmVycmlkZU9uTGlzdGVuZXJzID0gZmFsc2U7XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVsbTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihzZWxlY3RvcjogSywgLi4uY2hpbGRyZW46IChDaGlsZCB8IExpc3RlbmVyKVtdKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVsbTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihzZWxlY3Rvcjoga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwIGV4dGVuZHMgSyA/IG5ldmVyIDogc2VsZWN0b3IsIC4uLmNoaWxkcmVuOiAoQ2hpbGQgfCBMaXN0ZW5lcilbXSk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG08UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4oc2VsZWN0b3I6IFMsIC4uLmNoaWxkcmVuOiAoQ2hpbGQgfCBMaXN0ZW5lcilbXSk6IFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxOPjtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG08RSBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oc2VsZWN0b3I6IHNlbGVjdG9yLCAuLi5jaGlsZHJlbjogKENoaWxkIHwgTGlzdGVuZXIpW10pOiBFO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVsbSgpOiBIVE1MRGl2RWxlbWVudDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG0oc2VsZWN0b3I6IHN0cmluZyA9ICcnLCAuLi5jaGlsZHJlbjogKENoaWxkIHwgTGlzdGVuZXIpW10pOiBIVE1MRWxlbWVudCB7XHJcblx0XHRcdGlmIChzZWxlY3Rvci5yZXBsYWNlQWxsKGVsbVJlZ2V4LCAnJykgIT0gJycpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3J9IGApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHQvLyBsZXQgdGFnID0gJyc7XHJcblx0XHRcdC8vIGxldCBmaXJzdE1hdGNoID0gZmFsc2U7XHJcblx0XHRcdGZvciAobGV0IG1hdGNoIG9mIHNlbGVjdG9yLm1hdGNoQWxsKGVsbVJlZ2V4KSkge1xyXG5cdFx0XHRcdGlmIChtYXRjaC5ncm91cHMudGFnKSB7XHJcblx0XHRcdFx0XHQvLyBpZiAodGFnICYmIG1hdGNoLmdyb3Vwcy50YWcgIT0gdGFnKSB7XHJcblx0XHRcdFx0XHQvLyBcdHRocm93IG5ldyBFcnJvcihgc2VsZWN0b3IgaGFzIHR3byBkaWZmZXJlbnQgdGFncyBhdCBvbmNlIDogPCR7dGFnfT4gYW5kIDwke21hdGNoLmdyb3Vwcy50YWd9PmApO1xyXG5cdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0Ly8gdGFnID0gbWF0Y2guZ3JvdXBzLnRhZztcclxuXHRcdFx0XHRcdC8vIGlmICghZmlyc3RNYXRjaCkgcmV0dXJuIGVsbSh0YWcgKyBzZWxlY3RvciwgLi4uY2hpbGRyZW4pO1xyXG5cdFx0XHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobWF0Y2guZ3JvdXBzLnRhZyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuaWQpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuaWQgPSBtYXRjaC5ncm91cHMuaWQ7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuY2xhc3MpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZChtYXRjaC5ncm91cHMuY2xhc3MpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2guZ3JvdXBzLmF0dHIxKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShtYXRjaC5ncm91cHMuYXR0cjEsIFwidHJ1ZVwiKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG1hdGNoLmdyb3Vwcy5hdHRyMikge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUobWF0Y2guZ3JvdXBzLmF0dHIyLCBtYXRjaC5ncm91cHMudmFsMik7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuYXR0cjMpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG1hdGNoLmdyb3Vwcy5hdHRyMywgbWF0Y2guZ3JvdXBzLnZhbDMucmVwbGFjZSgvXFxcXFwiL2csICdcIicpKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG1hdGNoLmdyb3Vwcy5hdHRyNCkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUobWF0Y2guZ3JvdXBzLmF0dHI0LCBtYXRjaC5ncm91cHMudmFsNC5yZXBsYWNlKC9cXFxcJy9nLCAnXFwnJykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBmaXJzdE1hdGNoID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgbGlzdGVuZXIgb2YgY2hpbGRyZW4uZmlsdGVyKGUgPT4gdHlwZW9mIGUgPT0gJ2Z1bmN0aW9uJykgYXMgTGlzdGVuZXJbXSkge1xyXG5cdFx0XHRcdGxldCBuYW1lOiBzdHJpbmcgPSBsaXN0ZW5lci5uYW1lO1xyXG5cdFx0XHRcdGlmICghbmFtZSkgbmFtZSA9IChsaXN0ZW5lciArICcnKS5tYXRjaCgvXFxiKD8hZnVuY3Rpb25cXGIpXFx3Ky8pWzBdO1xyXG5cdFx0XHRcdGlmICghbmFtZSkgdGhyb3cgbmV3IEVycm9yKCd0cnlpbmcgdG8gYmluZCB1bm5hbWVkIGZ1bmN0aW9uJyk7XHJcblx0XHRcdFx0aWYgKG5hbWUuc3RhcnRzV2l0aCgnYm91bmQgJykpIG5hbWUgPSBuYW1lLnNsaWNlKCdib3VuZCAnLmxlbmd0aCk7XHJcblx0XHRcdFx0aWYgKG5hbWUuc3RhcnRzV2l0aCgnb24nKSkge1xyXG5cdFx0XHRcdFx0aWYgKCFlbGVtZW50Lmhhc093blByb3BlcnR5KG5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoYDwgJHtlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKX0+IGRvZXMgbm90IGhhdmUgXCIke25hbWV9XCIgbGlzdGVuZXJgKTtcclxuXHRcdFx0XHRcdGlmICghYWxsb3dPdmVycmlkZU9uTGlzdGVuZXJzICYmIGVsZW1lbnRbbmFtZV0pIHRocm93IG5ldyBFcnJvcignb3ZlcnJpZGluZyBgb24gKiBgIGxpc3RlbmVycyBpcyBkaXNhYmxlZCcpO1xyXG5cdFx0XHRcdFx0ZWxlbWVudFtuYW1lXSA9IGxpc3RlbmVyO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoYWxsb3dPbmx5RXhpc3RpbmdMaXN0ZW5lcnMgJiYgZWxlbWVudFsnb24nICsgbmFtZV0gPT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGA8JHtlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKX0+IGRvZXMgbm90IGhhdmUgXCJvbicke25hbWV9J1wiIGxpc3RlbmVyYCk7XHJcblx0XHRcdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbGVtZW50LmFwcGVuZCguLi5jaGlsZHJlbi5maWx0ZXIoZSA9PiB0eXBlb2YgZSAhPSAnZnVuY3Rpb24nKSBhcyAoTm9kZSB8IHN0cmluZylbXSk7XHJcblx0XHRcdHJldHVybiBlbGVtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBxT3JFbG08SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IEssIHBhcmVudD86IFBhcmVudE5vZGUgfCBzZWxlY3Rvcik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBxT3JFbG08UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4oc2VsZWN0b3I6IFMsIHBhcmVudD86IFBhcmVudE5vZGUgfCBzZWxlY3Rvcik6IFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxOPjtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBxT3JFbG08RSBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oc2VsZWN0b3I6IHN0cmluZywgcGFyZW50PzogUGFyZW50Tm9kZSB8IHNlbGVjdG9yKTogRTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBxT3JFbG0oc2VsZWN0b3I6IHN0cmluZywgcGFyZW50PzogUGFyZW50Tm9kZSB8IHN0cmluZykge1xyXG5cdFx0XHRpZiAodHlwZW9mIHBhcmVudCA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdHBhcmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyZW50KSBhcyBQYXJlbnROb2RlO1xyXG5cdFx0XHRcdGlmICghcGFyZW50KSB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWxlZCB0byBmaW5kIHBhcmVudCBlbGVtZW50Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHNlbGVjdG9yLmluY2x1ZGVzKCc+JykpIHtcclxuXHRcdFx0XHRsZXQgcGFyZW50U2VsZWN0b3IgPSBzZWxlY3Rvci5zcGxpdCgnPicpLnNsaWNlKDAsIC0xKS5qb2luKCc+Jyk7XHJcblx0XHRcdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5zcGxpdCgnPicpLnBvcCgpO1xyXG5cdFx0XHRcdHBhcmVudCA9IChwYXJlbnQgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3IocGFyZW50U2VsZWN0b3IpIGFzIFBhcmVudE5vZGU7XHJcblx0XHRcdFx0aWYgKCFwYXJlbnQpIHRocm93IG5ldyBFcnJvcignZmFpbGVkIHRvIGZpbmQgcGFyZW50IGVsZW1lbnQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgY2hpbGQgPSAocGFyZW50IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHRcdFx0aWYgKGNoaWxkKSByZXR1cm4gY2hpbGQ7XHJcblxyXG5cdFx0XHRjaGlsZCA9IGVsbShzZWxlY3Rvcik7XHJcblx0XHRcdHBhcmVudD8uYXBwZW5kKGNoaWxkKTtcclxuXHRcdFx0cmV0dXJuIGNoaWxkO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgbGV0IGRlYnVnID0gZmFsc2U7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgZXRjIHtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBrZXliaW5kKGtleTogc3RyaW5nLCBmbjogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKSB7XHJcblx0XHRcdGxldCBjb2RlID0ga2V5Lmxlbmd0aCA9PSAxID8gJ0tleScgKyBrZXkudG9VcHBlckNhc2UoKSA6IGtleTtcclxuXHRcdFx0ZnVuY3Rpb24gb25rZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKGV2ZW50LmNvZGUgPT0gY29kZSkge1xyXG5cdFx0XHRcdFx0Zm4oZXZlbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25rZXlkb3duKTtcclxuXHRcdFx0cmV0dXJuICgpID0+IHJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbmtleWRvd24pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBmdWxsc2NyZWVuKG9uPzogYm9vbGVhbikge1xyXG5cdFx0XHRsZXQgY2VudHJhbCA9IEltYWdlU2Nyb2xsaW5nRXh0ZW5zaW9uLmltYWdlU2Nyb2xsaW5nQWN0aXZlICYmIEltYWdlU2Nyb2xsaW5nRXh0ZW5zaW9uLmdldENlbnRyYWxJbWcoKTtcclxuXHRcdFx0aWYgKCFkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCkge1xyXG5cdFx0XHRcdGlmIChvbiA9PSBmYWxzZSkgcmV0dXJuO1xyXG5cdFx0XHRcdGF3YWl0IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbigpLmNhdGNoKCgpID0+IHsgfSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKG9uID09IHRydWUpIHJldHVybjtcclxuXHRcdFx0XHRhd2FpdCBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpLmNhdGNoKCgpID0+IHsgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGNlbnRyYWwpIHtcclxuXHRcdFx0XHRjZW50cmFsLnNjcm9sbEludG9WaWV3KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuICEhZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGFueWJpbmQoa2V5T3JFdmVudDogc3RyaW5nIHwgbnVtYmVyLCBmbjogKGV2ZW50OiBFdmVudCkgPT4gdm9pZCkge1xyXG5cdFx0XHRpZiAodHlwZW9mIGtleU9yRXZlbnQgPT0gXCJudW1iZXJcIikga2V5T3JFdmVudCA9IGtleU9yRXZlbnQgKyAnJztcclxuXHRcdFx0Ly8gZGV0ZWN0IGlmIGl0IGlzIGV2ZW50XHJcblx0XHRcdGxldCBpc0V2ZW50ID0gd2luZG93Lmhhc093blByb3BlcnR5KCdvbicgKyBrZXlPckV2ZW50KTtcclxuXHRcdFx0aWYgKGlzRXZlbnQpIHtcclxuXHRcdFx0XHRhZGRFdmVudExpc3RlbmVyKGtleU9yRXZlbnQsIGZuKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gcGFyc2Uga2V5IGNvZGVcclxuXHRcdFx0aWYgKCFpc05hTihwYXJzZUludChrZXlPckV2ZW50KSkpIHtcclxuXHRcdFx0XHRrZXlPckV2ZW50ID0gYERpZ2l0JHtrZXlPckV2ZW50fWA7XHJcblx0XHRcdH0gZWxzZSBpZiAoa2V5T3JFdmVudC5sZW5ndGggPT0gMSkge1xyXG5cdFx0XHRcdGtleU9yRXZlbnQgPSBgS2V5JHtrZXlPckV2ZW50LnRvVXBwZXJDYXNlKCl9YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXYgPT4ge1xyXG5cdFx0XHRcdGlmIChldi5jb2RlICE9IGtleU9yRXZlbnQpIHJldHVybjtcclxuXHRcdFx0XHRmbihldik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBmdWxsc2NyZWVuT24oa2V5OiBzdHJpbmcpIHtcclxuXHRcdFx0aWYgKGtleSA9PSAnc2Nyb2xsJykge1xyXG5cdFx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IGZ1bGxzY3JlZW4odHJ1ZSkpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4ga2V5YmluZChrZXksICgpID0+IGZ1bGxzY3JlZW4oKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGZJc0ZvckZ1bGxzY3JlZW4oKSB7XHJcblx0XHRcdGtleWJpbmQoJ0YnLCAoKSA9PiBmdWxsc2NyZWVuKCkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBoYXNoQ29kZSh0aGlzOiBzdHJpbmcpO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGhhc2hDb2RlKHZhbHVlOiBzdHJpbmcpO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGhhc2hDb2RlKHRoaXM6IHN0cmluZywgdmFsdWU/OiBzdHJpbmcpIHtcclxuXHRcdFx0dmFsdWUgPz89IHRoaXM7XHJcblx0XHRcdGxldCBoYXNoID0gMDtcclxuXHRcdFx0Zm9yIChsZXQgYyBvZiB2YWx1ZSkge1xyXG5cdFx0XHRcdGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGMuY2hhckNvZGVBdCgwKTtcclxuXHRcdFx0XHRoYXNoID0gaGFzaCAmIGhhc2g7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGhhc2g7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XHJcblx0XHRcdC8vIFN0cmluZy5wcm90b3R5cGUuaGFzaENvZGUgPSBoYXNoQ29kZTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gY3VycmVudFNjcmlwdEhhc2goKSB7XHJcblx0XHRcdHJldHVybiBoYXNoQ29kZShkb2N1bWVudC5jdXJyZW50U2NyaXB0LmlubmVySFRNTCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHJlbG9hZE9uQ3VycmVudFNjcmlwdENoYW5nZWQoc2NyaXB0TmFtZTogc3RyaW5nID0gbG9jYXRpb24uaG9zdG5hbWUgKyAnLnVqcycpIHtcclxuXHRcdFx0bGV0IHNjcmlwdElkID0gYHJlbG9hZE9uQ3VycmVudFNjcmlwdENoYW5nZWRfJHtzY3JpcHROYW1lfWA7XHJcblx0XHRcdGxldCBzY3JpcHRIYXNoID0gY3VycmVudFNjcmlwdEhhc2goKSArICcnO1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzY3JpcHRJZCwgc2NyaXB0SGFzaCk7XHJcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4ge1xyXG5cdFx0XHRcdGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzY3JpcHRJZCkgIT0gc2NyaXB0SGFzaCkge1xyXG5cdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IGZhc3RTY3JvbGw6IHtcclxuXHRcdFx0KHNwZWVkPzogbnVtYmVyKTogdm9pZDtcclxuXHRcdFx0c3BlZWQ/OiBudW1iZXI7XHJcblx0XHRcdGFjdGl2ZT86IGJvb2xlYW47XHJcblx0XHRcdG9mZj86ICgpID0+IHZvaWQ7XHJcblx0XHR9ID0gZnVuY3Rpb24gKHNwZWVkID0gMC4yNSkge1xyXG5cdFx0XHRpZiAoZmFzdFNjcm9sbC5hY3RpdmUpIGZhc3RTY3JvbGwub2ZmKCk7XHJcblx0XHRcdGZhc3RTY3JvbGwuYWN0aXZlID0gdHJ1ZTtcclxuXHRcdFx0ZmFzdFNjcm9sbC5zcGVlZCA9IHNwZWVkO1xyXG5cdFx0XHRmdW5jdGlvbiBvbndoZWVsKGV2ZW50OiBNb3VzZUV2ZW50ICYgeyB3aGVlbERlbHRhWTogbnVtYmVyIH0pIHtcclxuXHRcdFx0XHRpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cdFx0XHRcdGlmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50LnNoaWZ0S2V5KSByZXR1cm47XHJcblx0XHRcdFx0c2Nyb2xsQnkoMCwgLU1hdGguc2lnbihldmVudC53aGVlbERlbHRhWSkgKiBpbm5lckhlaWdodCAqIGZhc3RTY3JvbGwuc3BlZWQpO1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIG9ud2hlZWwsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XHJcblx0XHRcdGZhc3RTY3JvbGwub2ZmID0gKCkgPT4ge1xyXG5cdFx0XHRcdGZhc3RTY3JvbGwuYWN0aXZlID0gZmFsc2U7XHJcblx0XHRcdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIG9ud2hlZWwpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmYXN0U2Nyb2xsLmFjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0ZmFzdFNjcm9sbC5vZmYgPSAoKSA9PiB7IH07XHJcblxyXG5cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gb25yYWYoZjogKCkgPT4gdm9pZCkge1xyXG5cdFx0XHRsZXQgbG9vcCA9IHRydWU7XHJcblx0XHRcdHZvaWQgYXN5bmMgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHdoaWxlIChsb29wKSB7XHJcblx0XHRcdFx0XHRhd2FpdCBQcm9taXNlLmZyYW1lKCk7XHJcblx0XHRcdFx0XHRmKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KCk7XHJcblx0XHRcdHJldHVybiAoKSA9PiB7IGxvb3AgPSBmYWxzZSB9O1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCByZXNpemVPYnNlcnZlcjogUmVzaXplT2JzZXJ2ZXI7XHJcblx0XHRsZXQgcmVzaXplTGlzdGVuZXJzOiAoKG5ld0hlaWdodDogbnVtYmVyLCBvbGRIZWlnaHQ6IG51bWJlcikgPT4gdm9pZClbXSA9IFtdO1xyXG5cdFx0bGV0IHByZXZpb3VzQm9keUhlaWdodCA9IDA7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gb25oZWlnaHRjaGFuZ2UoZjogKG5ld0hlaWdodDogbnVtYmVyLCBvbGRIZWlnaHQ6IG51bWJlcikgPT4gdm9pZCkge1xyXG5cdFx0XHRpZiAoIXJlc2l6ZU9ic2VydmVyKSB7XHJcblx0XHRcdFx0cHJldmlvdXNCb2R5SGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcblx0XHRcdFx0cmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoZW50cmllcyA9PiB7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBlIG9mIGVudHJpZXMpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGUudGFyZ2V0ICE9IGRvY3VtZW50LmJvZHkpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0bGV0IG5ld0JvZHlIZWlnaHQgPSBlLnRhcmdldC5jbGllbnRIZWlnaHQ7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGYgb2YgcmVzaXplTGlzdGVuZXJzKSB7XHJcblx0XHRcdFx0XHRcdFx0ZihuZXdCb2R5SGVpZ2h0LCBwcmV2aW91c0JvZHlIZWlnaHQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHByZXZpb3VzQm9keUhlaWdodCA9IG5ld0JvZHlIZWlnaHQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXNpemVMaXN0ZW5lcnMucHVzaChmKTtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKCkge1xyXG5cdFx0XHRcdHJlc2l6ZUxpc3RlbmVycy5zcGxpY2UocmVzaXplTGlzdGVuZXJzLmluZGV4T2YoZikpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGRlY2xhcmUgY29uc3Qga2RzOiB7XHJcblx0XHRcdFtrOiBzdHJpbmddOiBzdHJpbmcgfCAoKGU6IEtleWJvYXJkRXZlbnQgJiBNb3VzZUV2ZW50KSA9PiB2b2lkKVxyXG5cdFx0fTtcclxuXHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXRjLCAna2RzJywge1xyXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcblx0XHRcdGdldCgpIHtcclxuXHRcdFx0XHRsZXQga2RzID0gaW5pdEtkcygpO1xyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShldGMsICdrZHMnLCB7IHZhbHVlOiBrZHMgfSk7XHJcblx0XHRcdFx0cmV0dXJuIGtkcztcclxuXHRcdFx0fSxcclxuXHRcdH0pO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFBvb3BKcywgJ2tkcycsIHtcclxuXHRcdFx0Z2V0OiAoKSA9PiBldGMua2RzLFxyXG5cdFx0XHRzZXQ6ICh2KSA9PiBPYmplY3QuYXNzaWduKGV0Yy5rZHMsIHYpLFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2VuZXJhdGVLZHNDb2RlcyhlOiBLZXlib2FyZEV2ZW50ICYgTW91c2VFdmVudCkge1xyXG5cdFx0XHRsZXQgYmFzZVByZWZpeCA9IGAke2Uuc2hpZnRLZXkgPyAnPCcgOiAnJ30ke2UuY3RybEtleSA/ICdeJyA6ICcnfSR7ZS5hbHRLZXkgPyAnPicgOiAnJ31gO1xyXG5cdFx0XHRsZXQgYmFzZUNvZGUgPSBlLmNvZGVcclxuXHRcdFx0XHQ/IGUuY29kZS5yZXBsYWNlKC9LZXl8RGlnaXR8QXJyb3d8TGVmdHxSaWdodC8sICcnKVxyXG5cdFx0XHRcdDogWydMTUInLCAnUk1CJywgJ01NQiddW2UuYnV0dG9uXTtcclxuXHRcdFx0bGV0IGV4dHJhQ29kZSA9IGUuY29kZVxyXG5cdFx0XHRcdD8gYmFzZUNvZGUucmVwbGFjZSgnQ29udHJvbCcsICdDdHJsJylcclxuXHRcdFx0XHQ6IGJhc2VDb2RlOy8vIFsnTGVmdCcsICdSaWdodCcsICdNaWRkbGUnXVtlLmJ1dHRvbl07XHJcblx0XHRcdGxldCByYXdDb2RlID0gZS5jb2RlID8/IGJhc2VDb2RlO1xyXG5cdFx0XHRsZXQga2V5Q29kZSA9IGUua2V5ID8/IGJhc2VDb2RlO1xyXG5cdFx0XHRsZXQgZXh0cmFQcmVmaXggPSBiYXNlUHJlZml4LnJlcGxhY2UoXHJcblx0XHRcdFx0YmFzZUNvZGUgPT0gJ1NoaWZ0JyA/ICc8JyA6IGJhc2VDb2RlID09ICdDb250cm9sJyA/ICdeJyA6IGJhc2VDb2RlID09ICdBbHQnID8gJz4nIDogJydcclxuXHRcdFx0XHQsICcnKTtcclxuXHJcblx0XHRcdGxldCBjb2RlcyA9IFtiYXNlQ29kZSwgZXh0cmFDb2RlLCByYXdDb2RlLCBrZXlDb2RlXS5mbGF0TWFwKFxyXG5cdFx0XHRcdGMgPT4gW2Jhc2VQcmVmaXgsIGV4dHJhUHJlZml4XS5tYXAocCA9PiBwICsgYylcclxuXHRcdFx0KTtcclxuXHRcdFx0Ly8uZmxhdE1hcChlID0+IFtlLCBlLnRvVXBwZXJDYXNlKCksIGUudG9Mb3dlckNhc2UoKV0pO1xyXG5cdFx0XHRjb2Rlcy5wdXNoKGUuY29kZSA/ICdrZXknIDogJ21vdXNlJyk7XHJcblx0XHRcdGNvZGVzLnB1c2goJ2FueScpO1xyXG5cdFx0XHRyZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGNvZGVzKSk7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24ga2RzTGlzdGVuZXIoZTogS2V5Ym9hcmRFdmVudCAmIE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0bGV0IGNvZGVzID0gZ2VuZXJhdGVLZHNDb2RlcyhlKTtcclxuXHRcdFx0T2JqZWN0LmFzc2lnbihlLCB7IF9jb2RlczogY29kZXMgfSk7XHJcblx0XHRcdGZvciAobGV0IGMgb2YgY29kZXMpIHtcclxuXHRcdFx0XHRsZXQgbGlzdGVuZXIgPSBldGMua2RzW2NdO1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgbGlzdGVuZXIgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdHEobGlzdGVuZXIpLmNsaWNrKCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgbGlzdGVuZXIgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0KGV0Yy5rZHNbY10gYXMgYW55KShlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGluaXRLZHMoKSB7XHJcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZHNMaXN0ZW5lcik7XHJcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGtkc0xpc3RlbmVyKTtcclxuXHRcdFx0cmV0dXJuIHt9O1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBsZXQgX2tiZEluaXRlZCA9IGZhbHNlO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG1ha2VLZHMoa2RzOiB7IFtrOiBzdHJpbmddOiBzdHJpbmcgfCAoKGU6IEtleWJvYXJkRXZlbnQgJiBNb3VzZUV2ZW50KSA9PiB2b2lkKSB9KSB7XHJcblx0XHRcdHJldHVybiBPYmplY3QuYXNzaWduKGV0Yy5rZHMsIGtkcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGV4cG9ydCBkZWNsYXJlIGxldCBrZHM6IHR5cGVvZiBldGMua2RzO1xyXG59XHJcblxyXG4vLyBpbnRlcmZhY2UgU3RyaW5nIHtcclxuLy8gXHRoYXNoQ29kZTogKCkgPT4gbnVtYmVyO1xyXG4vLyB9XHJcbiIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cclxuXHRleHBvcnQgdHlwZSBkZWx0YVRpbWUgPSBudW1iZXIgfCBgJHtudW1iZXJ9JHsncycgfCAnaCcgfCAnZCcgfCAndycgfCAneSd9YCB8IG51bGw7XHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVEZWx0YVRpbWUobWF4QWdlOiBkZWx0YVRpbWUpIHtcclxuXHRcdGlmICh0eXBlb2YgbWF4QWdlID09ICdudW1iZXInKSByZXR1cm4gbWF4QWdlO1xyXG5cdFx0aWYgKHR5cGVvZiBtYXhBZ2UgIT0gJ3N0cmluZycpIHJldHVybiBJbmZpbml0eTtcclxuXHRcdGNvbnN0IGFUb00gPSB7IHM6IDFlMywgaDogMzYwMGUzLCBkOiAyNCAqIDM2MDBlMywgdzogNyAqIDI0ICogMzYwMGUzLCB5OiAzNjUgKiAyNCAqIDM2MDBlMyB9O1xyXG5cdFx0bGV0IG4gPSBwYXJzZUZsb2F0KG1heEFnZSk7XHJcblx0XHRsZXQgbSA9IGFUb01bbWF4QWdlW21heEFnZS5sZW5ndGggLSAxXV07XHJcblx0XHRpZiAobiAhPSBuIHx8ICFtKSB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGVsdGFUaW1lJyk7XHJcblx0XHRyZXR1cm4gbiAqIG07XHJcblx0fVxyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIEZldGNoRXh0ZW5zaW9uIHtcclxuXHRcdGV4cG9ydCB0eXBlIFJlcXVlc3RJbml0RXggPSBSZXF1ZXN0SW5pdCAmIHsgbWF4QWdlPzogZGVsdGFUaW1lLCB4bWw/OiBib29sZWFuIH07XHJcblx0XHRleHBvcnQgdHlwZSBSZXF1ZXN0SW5pdEV4SnNvbiA9IFJlcXVlc3RJbml0ICYgeyBtYXhBZ2U/OiBkZWx0YVRpbWUsIGluZGV4ZWREYj86IGJvb2xlYW4gfTtcclxuXHRcdGV4cG9ydCBsZXQgZGVmYXVsdHM6IFJlcXVlc3RJbml0ID0geyBjcmVkZW50aWFsczogJ2luY2x1ZGUnIH07XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBjYWNoZTogQ2FjaGUgPSBudWxsO1xyXG5cdFx0YXN5bmMgZnVuY3Rpb24gb3BlbkNhY2hlKCkge1xyXG5cdFx0XHRpZiAoY2FjaGUpIHJldHVybiBjYWNoZTtcclxuXHRcdFx0Y2FjaGUgPSBhd2FpdCBjYWNoZXMub3BlbignZmV0Y2gnKTtcclxuXHRcdFx0cmV0dXJuIGNhY2hlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHRvRHVyKGR0OiBkZWx0YVRpbWUpIHtcclxuXHRcdFx0ZHQgPSBub3JtYWxpemVEZWx0YVRpbWUoZHQpO1xyXG5cdFx0XHRpZiAoZHQgPiAxZTEwKSBkdCA9IERhdGUubm93KCkgLSBkdDtcclxuXHRcdFx0bGV0IHNwbGl0ID0gKG46IG51bWJlciwgZDogbnVtYmVyKSA9PiBbbiAlIGQsIH5+KG4gLyBkKV07XHJcblx0XHRcdGxldCB0bzIgPSAobjogbnVtYmVyKSA9PiAobiArICcnKS5wYWRTdGFydCgyLCAnMCcpO1xyXG5cdFx0XHR2YXIgW21zLCBzXSA9IHNwbGl0KGR0LCAxMDAwKTtcclxuXHRcdFx0dmFyIFtzLCBtXSA9IHNwbGl0KHMsIDYwKTtcclxuXHRcdFx0dmFyIFttLCBoXSA9IHNwbGl0KG0sIDYwKTtcclxuXHRcdFx0dmFyIFtoLCBkXSA9IHNwbGl0KGgsIDI0KTtcclxuXHRcdFx0dmFyIFtkLCB3XSA9IHNwbGl0KGQsIDcpO1xyXG5cdFx0XHRyZXR1cm4gdyA+IDFlMyA/ICdmb3JldmVyJyA6IHcgPyBgJHt3fXcke2R9ZGAgOiBkID8gYCR7ZH1kJHt0bzIoaCl9aGAgOiBoICsgbSA/IGAke3RvMihoKX06JHt0bzIobSl9OiR7dG8yKHMpfWAgOiBgJHtzICsgfn5tcyAvIDEwMDB9c2A7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGlzU3RhbGUoY2FjaGVkQXQ6IG51bWJlciwgbWF4QWdlPzogZGVsdGFUaW1lKSB7XHJcblx0XHRcdGlmIChtYXhBZ2UgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRyZXR1cm4gRGF0ZS5ub3coKSAtIGNhY2hlZEF0ID49IG5vcm1hbGl6ZURlbHRhVGltZShtYXhBZ2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYWNoZWQodXJsOiBzdHJpbmcsIGluaXQ6IFJlcXVlc3RJbml0RXggPSB7fSk6IFByb21pc2U8UmVzcG9uc2U+IHtcclxuXHRcdFx0bGV0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cdFx0XHRsZXQgY2FjaGUgPSBhd2FpdCBvcGVuQ2FjaGUoKTtcclxuXHRcdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgY2FjaGUubWF0Y2godXJsKTtcclxuXHRcdFx0aWYgKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0cmVzcG9uc2UuY2FjaGVkQXQgPSArcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NhY2hlZC1hdCcpIHx8IDA7XHJcblx0XHRcdFx0aWYgKCFpc1N0YWxlKHJlc3BvbnNlLmNhY2hlZEF0LCBub3JtYWxpemVEZWx0YVRpbWUoaW5pdC5tYXhBZ2UpKSkge1xyXG5cdFx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBDYWNoZWQgcmVzcG9uc2U6ICR7dG9EdXIocmVzcG9uc2UuY2FjaGVkQXQpfSA8IGM6JHt0b0R1cihpbml0Lm1heEFnZSl9YCwgdXJsKTtcclxuXHRcdFx0XHRcdHJldHVybiByZXNwb25zZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBTdGFsZSByZXNwb25zZTogJHt0b0R1cihyZXNwb25zZS5jYWNoZWRBdCl9ID4gYzoke3RvRHVyKGluaXQubWF4QWdlKX1gLCB1cmwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlc3BvbnNlID1cclxuXHRcdFx0XHQhaW5pdC54bWwgPyBhd2FpdCBmZXRjaCh1cmwsIHsgLi4uZGVmYXVsdHMsIC4uLmluaXQgfSlcclxuXHRcdFx0XHRcdDogYXdhaXQgeG1sUmVzcG9uc2UodXJsLCBpbml0KTtcclxuXHRcdFx0aWYgKHJlc3BvbnNlLm9rKSB7XHJcblx0XHRcdFx0cmVzcG9uc2UuY2FjaGVkQXQgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHRcdGxldCBjbG9uZSA9IHJlc3BvbnNlLmNsb25lKCk7XHJcblx0XHRcdFx0bGV0IGluaXQyOiBSZXNwb25zZUluaXQgPSB7XHJcblx0XHRcdFx0XHRzdGF0dXM6IGNsb25lLnN0YXR1cywgc3RhdHVzVGV4dDogY2xvbmUuc3RhdHVzVGV4dCxcclxuXHRcdFx0XHRcdGhlYWRlcnM6IFtbJ2NhY2hlZC1hdCcsIGAke3Jlc3BvbnNlLmNhY2hlZEF0fWBdLCAuLi5jbG9uZS5oZWFkZXJzLmVudHJpZXMoKV1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGxldCByZXN1bHRSZXNwb25zZSA9IG5ldyBSZXNwb25zZShjbG9uZS5ib2R5LCBpbml0Mik7XHJcblx0XHRcdFx0Y2FjaGUucHV0KHVybCwgcmVzdWx0UmVzcG9uc2UpO1xyXG5cdFx0XHRcdGxldCBkdCA9IHBlcmZvcm1hbmNlLm5vdygpIC0gbm93O1xyXG5cdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgTG9hZGVkIHJlc3BvbnNlOiAke3RvRHVyKGR0KX0gLyBjOiR7dG9EdXIoaW5pdC5tYXhBZ2UpfWAsIHVybCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBGYWlsZWQgcmVzcG9uc2U6ICR7dG9EdXIocmVzcG9uc2UuY2FjaGVkQXQpfSAvIGM6JHt0b0R1cihpbml0Lm1heEFnZSl9YCwgdXJsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcmVzcG9uc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNhY2hlZERvYyh1cmw6IHN0cmluZywgaW5pdDogUmVxdWVzdEluaXRFeCA9IHt9KTogUHJvbWlzZTxEb2N1bWVudD4ge1xyXG5cdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBjYWNoZWQodXJsLCBpbml0KTtcclxuXHRcdFx0bGV0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcblx0XHRcdGxldCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcblx0XHRcdGxldCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHRleHQsICd0ZXh0L2h0bWwnKTtcclxuXHRcdFx0bGV0IGJhc2UgPSBkb2MuY3JlYXRlRWxlbWVudCgnYmFzZScpO1xyXG5cdFx0XHRiYXNlLmhyZWYgPSB1cmw7XHJcblx0XHRcdGRvYy5oZWFkLmFwcGVuZChiYXNlKTtcclxuXHRcdFx0ZG9jLmNhY2hlZEF0ID0gcmVzcG9uc2UuY2FjaGVkQXQ7XHJcblx0XHRcdHJldHVybiBkb2M7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb2ModXJsOiBzdHJpbmcsIGluaXQ6IFJlcXVlc3RJbml0RXggPSB7fSk6IFByb21pc2U8RG9jdW1lbnQ+IHtcclxuXHRcdFx0bGV0IHJlc3BvbnNlID1cclxuXHRcdFx0XHQhaW5pdC54bWwgPyBhd2FpdCBmZXRjaCh1cmwsIHsgLi4uZGVmYXVsdHMsIC4uLmluaXQgfSlcclxuXHRcdFx0XHQ6IGF3YWl0IHhtbFJlc3BvbnNlKHVybCwgaW5pdCk7XHJcblx0XHRcdGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG5cdFx0XHRsZXQgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG5cdFx0XHRsZXQgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAndGV4dC9odG1sJyk7XHJcblx0XHRcdGxldCBiYXNlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2Jhc2UnKTtcclxuXHRcdFx0YmFzZS5ocmVmID0gdXJsO1xyXG5cdFx0XHRkb2MuaGVhZC5hcHBlbmQoYmFzZSk7XHJcblx0XHRcdGRvYy5jYWNoZWRBdCA9IHJlc3BvbnNlLmNhY2hlZEF0O1xyXG5cdFx0XHRyZXR1cm4gZG9jO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiB4bWxSZXNwb25zZSh1cmw6IHN0cmluZywgaW5pdDogUmVxdWVzdEluaXRFeCA9IHt9KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG5cdFx0XHRsZXQgcCA9IFByb21pc2VFeHRlbnNpb24uZW1wdHkoKTtcclxuXHRcdFx0bGV0IG9SZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0b1JlcS5vbmxvYWQgPSBwLnI7XHJcblx0XHRcdG9SZXEucmVzcG9uc2VUeXBlID0gJ2RvY3VtZW50JztcclxuXHRcdFx0b1JlcS5vcGVuKFwiZ2V0XCIsIHVybCwgdHJ1ZSk7XHJcblx0XHRcdG9SZXEuc2VuZCgpO1xyXG5cdFx0XHRhd2FpdCBwO1xyXG5cdFx0XHRpZiAob1JlcS5yZXNwb25zZVR5cGUgIT0gJ2RvY3VtZW50JykgdGhyb3cgbmV3IEVycm9yKCdGSVhNRScpO1xyXG5cdFx0XHRyZXR1cm4gbmV3IFJlc3BvbnNlKG9SZXEucmVzcG9uc2VYTUwuZG9jdW1lbnRFbGVtZW50Lm91dGVySFRNTCwgaW5pdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGpzb24odXJsOiBzdHJpbmcsIGluaXQ6IFJlcXVlc3RJbml0ID0ge30pOiBQcm9taXNlPHVua25vd24+IHtcclxuXHRcdFx0cmV0dXJuIGZldGNoKHVybCwgeyAuLi5kZWZhdWx0cywgLi4uaW5pdCB9KS50aGVuKGUgPT4gZS5qc29uKCkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbGVhckNhY2hlKCkge1xyXG5cdFx0XHRjYWNoZSA9IG51bGw7XHJcblx0XHRcdHJldHVybiBjYWNoZXMuZGVsZXRlKCdmZXRjaCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiB1bmNhY2hlKHVybDogc3RyaW5nKSB7XHJcblx0XHRcdGxldCBjYWNoZSA9IGF3YWl0IG9wZW5DYWNoZSgpO1xyXG5cdFx0XHRsZXQgZDEgPSBjYWNoZS5kZWxldGUodXJsKTtcclxuXHRcdFx0bGV0IGQyID0gYXdhaXQgaWRiRGVsZXRlKHVybCk7XHJcblx0XHRcdHJldHVybiAoYXdhaXQgZDEpIHx8IGQyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0NhY2hlZCh1cmw6IHN0cmluZywgb3B0aW9uczogeyBtYXhBZ2U/OiBkZWx0YVRpbWUsIGluZGV4ZWREYj86IGJvb2xlYW4gfCAnb25seScgfSA9IHt9KTogUHJvbWlzZTxib29sZWFuIHwgJ2lkYic+IHtcclxuXHRcdFx0aWYgKG9wdGlvbnMuaW5kZXhlZERiKSB7XHJcblx0XHRcdFx0bGV0IGRiSnNvbiA9IGF3YWl0IGlkYkdldCh1cmwpO1xyXG5cdFx0XHRcdGlmIChkYkpzb24pIHtcclxuXHRcdFx0XHRcdHJldHVybiBpc1N0YWxlKGRiSnNvbi5jYWNoZWRBdCwgbm9ybWFsaXplRGVsdGFUaW1lKG9wdGlvbnMubWF4QWdlKSkgPyBmYWxzZSA6ICdpZGInO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmRleGVkRGIgPT0gJ29ubHknKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGNhY2hlID0gYXdhaXQgb3BlbkNhY2hlKCk7XHJcblx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGNhY2hlLm1hdGNoKHVybCk7XHJcblx0XHRcdGlmICghcmVzcG9uc2UpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0aWYgKG9wdGlvbnM/Lm1heEFnZSAhPSBudWxsKSB7XHJcblx0XHRcdFx0bGV0IGNhY2hlZEF0ID0gK3Jlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjYWNoZWQtYXQnKSB8fCAwO1xyXG5cdFx0XHRcdGlmIChpc1N0YWxlKHJlc3BvbnNlLmNhY2hlZEF0LCBub3JtYWxpemVEZWx0YVRpbWUob3B0aW9ucy5tYXhBZ2UpKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYWNoZWRKc29uKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdEV4SnNvbiA9IHt9KTogUHJvbWlzZTx1bmtub3duPiB7XHJcblx0XHRcdGlmIChpbml0LmluZGV4ZWREYikge1xyXG5cdFx0XHRcdGxldCBkYkpzb24gPSBhd2FpdCBpZGJHZXQodXJsKTtcclxuXHRcdFx0XHRpZiAoZGJKc29uKSB7XHJcblx0XHRcdFx0XHRpZiAoIWlzU3RhbGUoZGJKc29uLmNhY2hlZEF0LCBpbml0Lm1heEFnZSkpIHtcclxuXHRcdFx0XHRcdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKGRiSnNvbi5kYXRhIGFzIGFueSwgJ2NhY2hlZCcsIGRiSnNvbi5jYWNoZWRBdCk7XHJcblx0XHRcdFx0XHRcdHJldHVybiBkYkpzb24uZGF0YTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgY2FjaGVkKHVybCwgaW5pdCk7XHJcblx0XHRcdGxldCBqc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cdFx0XHRpZiAoISgnY2FjaGVkJyBpbiBqc29uKSkge1xyXG5cdFx0XHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZShqc29uLCAnY2FjaGVkJywgcmVzcG9uc2UuY2FjaGVkQXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChpbml0LmluZGV4ZWREYikge1xyXG5cdFx0XHRcdGlkYlB1dCh1cmwsIGpzb24sIHJlc3BvbnNlLmNhY2hlZEF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4ganNvbjtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0bGV0IF9pZGJJbnN0YW5jZVByb21pc2U6IElEQkRhdGFiYXNlIHwgUHJvbWlzZTxJREJEYXRhYmFzZT4gPSBudWxsO1xyXG5cdFx0bGV0IGlkYkluc3RhbmNlOiBJREJEYXRhYmFzZSA9IG51bGw7XHJcblxyXG5cdFx0YXN5bmMgZnVuY3Rpb24gb3BlbklkYigpOiBQcm9taXNlPElEQkRhdGFiYXNlPiB7XHJcblx0XHRcdGlmIChpZGJJbnN0YW5jZSkgcmV0dXJuIGlkYkluc3RhbmNlO1xyXG5cdFx0XHRpZiAoYXdhaXQgX2lkYkluc3RhbmNlUHJvbWlzZSkge1xyXG5cdFx0XHRcdHJldHVybiBpZGJJbnN0YW5jZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgaXJxID0gaW5kZXhlZERCLm9wZW4oJ2ZldGNoJyk7XHJcblx0XHRcdGlycS5vbnVwZ3JhZGVuZWVkZWQgPSBldmVudCA9PiB7XHJcblx0XHRcdFx0bGV0IGRiID0gaXJxLnJlc3VsdDtcclxuXHRcdFx0XHRsZXQgc3RvcmUgPSBkYi5jcmVhdGVPYmplY3RTdG9yZSgnZmV0Y2gnLCB7IGtleVBhdGg6ICd1cmwnIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdF9pZGJJbnN0YW5jZVByb21pc2UgPSBuZXcgUHJvbWlzZSgociwgaikgPT4ge1xyXG5cdFx0XHRcdGlycS5vbnN1Y2Nlc3MgPSByO1xyXG5cdFx0XHRcdGlycS5vbmVycm9yID0gajtcclxuXHRcdFx0fSkudGhlbigoKSA9PiBpcnEucmVzdWx0LCAoKSA9PiBudWxsKTtcclxuXHRcdFx0aWRiSW5zdGFuY2UgPSBfaWRiSW5zdGFuY2VQcm9taXNlID0gYXdhaXQgX2lkYkluc3RhbmNlUHJvbWlzZTtcclxuXHRcdFx0aWYgKCFpZGJJbnN0YW5jZSkgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gb3BlbiBpbmRleGVkREInKTtcclxuXHRcdFx0cmV0dXJuIGlkYkluc3RhbmNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBpZGJDbGVhcigpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdUT0RPJylcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0YXN5bmMgZnVuY3Rpb24gaWRiR2V0KHVybDogc3RyaW5nKTogUHJvbWlzZTx7IHVybDogc3RyaW5nLCBkYXRhOiB1bmtub3duLCBjYWNoZWRBdDogbnVtYmVyIH0gfCB1bmRlZmluZWQ+IHtcclxuXHRcdFx0bGV0IGRiID0gYXdhaXQgb3BlbklkYigpO1xyXG5cdFx0XHRsZXQgdCA9IGRiLnRyYW5zYWN0aW9uKFsnZmV0Y2gnXSwgJ3JlYWRvbmx5Jyk7XHJcblx0XHRcdGxldCBycSA9IHQub2JqZWN0U3RvcmUoJ2ZldGNoJykuZ2V0KHVybCk7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyID0+IHtcclxuXHRcdFx0XHRycS5vbnN1Y2Nlc3MgPSAoKSA9PiByKHJxLnJlc3VsdCk7XHJcblx0XHRcdFx0cnEub25lcnJvciA9ICgpID0+IHIodW5kZWZpbmVkKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0YXN5bmMgZnVuY3Rpb24gaWRiUHV0KHVybDogc3RyaW5nLCBkYXRhOiB1bmtub3duLCBjYWNoZWRBdD86IG51bWJlcik6IFByb21pc2U8SURCVmFsaWRLZXkgfCB1bmRlZmluZWQ+IHtcclxuXHRcdFx0bGV0IGRiID0gYXdhaXQgb3BlbklkYigpO1xyXG5cdFx0XHRsZXQgdCA9IGRiLnRyYW5zYWN0aW9uKFsnZmV0Y2gnXSwgJ3JlYWR3cml0ZScpO1xyXG5cdFx0XHRsZXQgcnEgPSB0Lm9iamVjdFN0b3JlKCdmZXRjaCcpLnB1dCh7IHVybCwgZGF0YSwgY2FjaGVkQXQ6IGNhY2hlZEF0ID8/ICtuZXcgRGF0ZSgpIH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UociA9PiB7XHJcblx0XHRcdFx0cnEub25zdWNjZXNzID0gKCkgPT4gcihycS5yZXN1bHQpO1xyXG5cdFx0XHRcdHJxLm9uZXJyb3IgPSAoKSA9PiByKHVuZGVmaW5lZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGFzeW5jIGZ1bmN0aW9uIGlkYkRlbGV0ZSh1cmw6IHN0cmluZyk6IFByb21pc2U8SURCVmFsaWRLZXkgfCB1bmRlZmluZWQ+IHtcclxuXHRcdFx0bGV0IGRiID0gYXdhaXQgb3BlbklkYigpO1xyXG5cdFx0XHRsZXQgdCA9IGRiLnRyYW5zYWN0aW9uKFsnZmV0Y2gnXSwgJ3JlYWR3cml0ZScpO1xyXG5cdFx0XHRsZXQgcnEgPSB0Lm9iamVjdFN0b3JlKCdmZXRjaCcpLmRlbGV0ZSh1cmwpO1xyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UociA9PiB7XHJcblx0XHRcdFx0cnEub25zdWNjZXNzID0gKCkgPT4gcihycS5yZXN1bHQpO1xyXG5cdFx0XHRcdHJxLm9uZXJyb3IgPSAoKSA9PiByKHVuZGVmaW5lZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRW50cnlGaWx0ZXJlckV4dGVuc2lvbiB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBjYW4gYmUgZWl0aGVyIE1hcCBvciBXZWFrTWFwXHJcblx0XHQgKiAoV2Vha01hcCBpcyBsaWtlbHkgdG8gYmUgdXNlbGVzcyBpZiB0aGVyZSBhcmUgbGVzcyB0aGVuIDEwayBvbGQgbm9kZXMgaW4gbWFwKVxyXG5cdFx0ICovXHJcblx0XHRsZXQgTWFwVHlwZSA9IE1hcDtcclxuXHRcdHR5cGUgTWFwVHlwZTxLIGV4dGVuZHMgb2JqZWN0LCBWPiA9Ly8gTWFwPEssIFY+IHwgXHJcblx0XHRcdFdlYWtNYXA8SywgVj47XHJcblxyXG5cdFx0ZnVuY3Rpb24gdG9FbEFycmF5KGVudHJ5U2VsZWN0b3I6IHNlbGVjdG9yIHwgKCgpID0+IEhUTUxFbGVtZW50W10pKTogSFRNTEVsZW1lbnRbXSB7XHJcblx0XHRcdHJldHVybiB0eXBlb2YgZW50cnlTZWxlY3RvciA9PSAnZnVuY3Rpb24nID8gZW50cnlTZWxlY3RvcigpIDogcXEoZW50cnlTZWxlY3Rvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIEVudHJ5RmlsdGVyZXI8RGF0YSBleHRlbmRzIHt9ID0ge30+IHtcclxuXHRcdFx0Y29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHRcdFx0ZW50cnlTZWxlY3Rvcjogc2VsZWN0b3IgfCAoKCkgPT4gSFRNTEVsZW1lbnRbXSk7XHJcblx0XHRcdGNvbnN0cnVjdG9yKGVudHJ5U2VsZWN0b3I6IHNlbGVjdG9yIHwgKCgpID0+IEhUTUxFbGVtZW50W10pLCBlbmFibGVkOiBib29sZWFuIHwgJ3NvZnQnID0gJ3NvZnQnKSB7XHJcblx0XHRcdFx0dGhpcy5lbnRyeVNlbGVjdG9yID0gZW50cnlTZWxlY3RvcjtcclxuXHRcdFx0XHR0aGlzLmNvbnRhaW5lciA9IGVsbSgnLmVmLWNvbnRhaW5lcicpO1xyXG5cclxuXHRcdFx0XHRpZiAoZW5hYmxlZCA9PSAnc29mdCcpIHtcclxuXHRcdFx0XHRcdHRoaXMuc29mdERpc2FibGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0dGhpcy5kaXNhYmxlKCdzb2Z0Jyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChlbmFibGVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNvZnREaXNhYmxlID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIGVuYWJsZWQgaXMgZmFsc3lcclxuXHRcdFx0XHRcdHRoaXMuc29mdERpc2FibGUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHRoaXMuZGlzYWJsZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnN0eWxlKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMudXBkYXRlKCk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcjxQYWdpbmF0ZUV4dGVuc2lvbi5QTW9kaWZ5RXZlbnQ+KCdwYWdpbmF0aW9ubW9kaWZ5JywgKCkgPT4gdGhpcy5yZXF1ZXN0VXBkYXRlKCkpO1xyXG5cdFx0XHRcdGV0Yy5vbmhlaWdodGNoYW5nZSgoKSA9PiB0aGlzLnJlcXVlc3RVcGRhdGUoKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGVudHJpZXM6IEhUTUxFbGVtZW50W10gPSBbXTtcclxuXHRcdFx0ZW50cnlEYXRhczogTWFwVHlwZTxIVE1MRWxlbWVudCwgRGF0YT4gPSBuZXcgTWFwVHlwZSgpO1xyXG5cclxuXHRcdFx0Z2V0RGF0YShlbDogSFRNTEVsZW1lbnQpOiBEYXRhO1xyXG5cdFx0XHRnZXREYXRhKCk6IERhdGFbXTtcclxuXHRcdFx0Z2V0RGF0YShlbD86IEhUTUxFbGVtZW50KTogRGF0YSB8IERhdGFbXSB7XHJcblx0XHRcdFx0aWYgKCFlbCkgcmV0dXJuIHRoaXMuZW50cmllcy5tYXAoZSA9PiB0aGlzLmdldERhdGEoZSkpO1xyXG5cdFx0XHRcdGxldCBkYXRhID0gdGhpcy5lbnRyeURhdGFzLmdldChlbCk7XHJcblx0XHRcdFx0aWYgKCFkYXRhKSB7XHJcblx0XHRcdFx0XHRkYXRhID0gdGhpcy5wYXJzZUVudHJ5KGVsKTtcclxuXHRcdFx0XHRcdHRoaXMuZW50cnlEYXRhcy5zZXQoZWwsIGRhdGEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dXBkYXRlUGVuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRyZXBhcnNlUGVuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRyZXF1ZXN0VXBkYXRlKHJlcGFyc2UgPSBmYWxzZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLnVwZGF0ZVBlbmRpbmcpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLnVwZGF0ZVBlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGlmIChyZXBhcnNlKSB0aGlzLnJlcGFyc2VQZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlKCkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwYXJzZXJzOiBQYXJzZXJGbjxEYXRhPltdID0gW107XHJcblx0XHRcdHdyaXRlRGF0YUF0dHJpYnV0ZSA9IGZhbHNlO1xyXG5cdFx0XHRhZGRQYXJzZXIocGFyc2VyOiBQYXJzZXJGbjxEYXRhPikge1xyXG5cdFx0XHRcdHRoaXMucGFyc2Vycy5wdXNoKHBhcnNlcik7XHJcblx0XHRcdFx0dGhpcy5yZXF1ZXN0VXBkYXRlKHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHBhcnNlRW50cnkoZWw6IEhUTUxFbGVtZW50KTogRGF0YSB7XHJcblx0XHRcdFx0ZWwucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlZi1lbnRyeS1jb250YWluZXInKTtcclxuXHRcdFx0XHRlbC5jbGFzc0xpc3QuYWRkKCdlZi1lbnRyeScpO1xyXG5cclxuXHRcdFx0XHRsZXQgZGF0YTogRGF0YSA9IHt9IGFzIERhdGE7XHJcblx0XHRcdFx0Zm9yIChsZXQgcGFyc2VyIG9mIHRoaXMucGFyc2Vycykge1xyXG5cdFx0XHRcdFx0bGV0IG5ld0RhdGEgPSBwYXJzZXIoZWwsIGRhdGEpO1xyXG5cdFx0XHRcdFx0aWYgKCFuZXdEYXRhIHx8IG5ld0RhdGEgPT0gZGF0YSkgY29udGludWU7XHJcblx0XHRcdFx0XHRpZiAoIUlzUHJvbWlzZShuZXdEYXRhKSkge1xyXG5cdFx0XHRcdFx0XHRPYmplY3QuYXNzaWduKGRhdGEsIG5ld0RhdGEpO1xyXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld0RhdGEudGhlbihwTmV3RGF0YSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmIChwTmV3RGF0YSAmJiBwTmV3RGF0YSAhPSBkYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0T2JqZWN0LmFzc2lnbihkYXRhLCBwTmV3RGF0YSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dGhpcy5yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy53cml0ZURhdGFBdHRyaWJ1dGUpIHtcclxuXHRcdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSgnZWYtZGF0YScsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFkZEl0ZW08SVQsIFQgZXh0ZW5kcyBJVCwgSVMgZXh0ZW5kcyBGaWx0ZXJlckl0ZW1QYXJ0aWFsLCBTLCBUUyBleHRlbmRzIFMgJiBJUyAmIEZpbHRlcmVySXRlbVNvdXJjZT4oY29uc3RydWN0b3I6IHsgbmV3KGRhdGE6IFRTKTogVCB9LCBsaXN0OiBJVFtdLCBkYXRhOiBJUywgc291cmNlOiBTKTogVCB7XHJcblx0XHRcdFx0T2JqZWN0LmFzc2lnbihkYXRhLCBzb3VyY2UsIHsgcGFyZW50OiB0aGlzIH0pO1xyXG5cdFx0XHRcdGRhdGEubmFtZSA/Pz0gZGF0YS5pZDtcclxuXHRcdFx0XHRsZXQgaXRlbSA9IG5ldyBjb25zdHJ1Y3RvcihkYXRhIGFzIFRTKTtcclxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZpbHRlcnM6IElGaWx0ZXI8RGF0YT5bXSA9IFtdO1xyXG5cdFx0XHRzb3J0ZXJzOiBJU29ydGVyPERhdGE+W10gPSBbXTtcclxuXHRcdFx0bW9kaWZpZXJzOiBJTW9kaWZpZXI8RGF0YT5bXSA9IFtdO1xyXG5cclxuXHRcdFx0Z2V0IGJ5TmFtZSgpIHtcclxuXHRcdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihcclxuXHRcdFx0XHRcdE9iamVjdC5mcm9tRW50cmllcyh0aGlzLmZpbHRlcnMubWFwKGUgPT4gW2UuaWQsIGVdKSksXHJcblx0XHRcdFx0XHRPYmplY3QuZnJvbUVudHJpZXModGhpcy5zb3J0ZXJzLm1hcChlID0+IFtlLmlkLCBlXSkpLFxyXG5cdFx0XHRcdFx0T2JqZWN0LmZyb21FbnRyaWVzKHRoaXMubW9kaWZpZXJzLm1hcChlID0+IFtlLmlkLCBlXSkpLFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRmaWx0ZXJzOiBPYmplY3QuZnJvbUVudHJpZXModGhpcy5maWx0ZXJzLm1hcChlID0+IFtlLmlkLCBlXSkpLFxyXG5cdFx0XHRcdFx0XHRzb3J0ZXJzOiBPYmplY3QuZnJvbUVudHJpZXModGhpcy5zb3J0ZXJzLm1hcChlID0+IFtlLmlkLCBlXSkpLFxyXG5cdFx0XHRcdFx0XHRtb2RpZmllcnM6IE9iamVjdC5mcm9tRW50cmllcyh0aGlzLm1vZGlmaWVycy5tYXAoZSA9PiBbZS5pZCwgZV0pKSxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YWRkRmlsdGVyKGlkOiBzdHJpbmcsIGZpbHRlcjogRmlsdGVyRm48RGF0YT4sIGRhdGE6IEZpbHRlclBhcnRpYWw8RGF0YT4gPSB7fSk6IEZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShGaWx0ZXIsIHRoaXMuZmlsdGVycywgZGF0YSwgeyBpZCwgZmlsdGVyIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZFZGaWx0ZXI8ViBleHRlbmRzIG51bWJlciB8IHN0cmluZz4oaWQ6IHN0cmluZywgZmlsdGVyOiBWYWx1ZUZpbHRlckZuPERhdGEsIFY+LCBkYXRhOiBWYWx1ZUZpbHRlclBhcnRpYWw8RGF0YSwgVj4pOiBWYWx1ZUZpbHRlcjxEYXRhLCBWPjtcclxuXHRcdFx0YWRkVkZpbHRlcjxWIGV4dGVuZHMgbnVtYmVyIHwgc3RyaW5nPihpZDogc3RyaW5nLCBmaWx0ZXI6IFZhbHVlRmlsdGVyRm48RGF0YSwgVj4sIGRhdGE6IFYpO1xyXG5cdFx0XHRhZGRWRmlsdGVyPFYgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+KGlkOiBzdHJpbmcsIGZpbHRlcjogVmFsdWVGaWx0ZXJGbjxEYXRhLCBWPiwgZGF0YTogVmFsdWVGaWx0ZXJQYXJ0aWFsPERhdGEsIFY+IHwgVikge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgZGF0YSAhPSAnb2JqZWN0JyB8fCAhZGF0YSkge1xyXG5cdFx0XHRcdFx0ZGF0YSA9IHsgaW5wdXQ6IGRhdGEgYXMgViB9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKFZhbHVlRmlsdGVyLCB0aGlzLmZpbHRlcnMsIGRhdGEsIHsgaWQsIGZpbHRlciB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRNRmlsdGVyKGlkOiBzdHJpbmcsIHZhbHVlOiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmcsIGRhdGE6IE1hdGNoRmlsdGVyU291cmNlPERhdGE+KSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShNYXRjaEZpbHRlciwgdGhpcy5maWx0ZXJzLCBkYXRhLCB7IGlkLCB2YWx1ZSB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRUYWdGaWx0ZXIoaWQ6IHN0cmluZywgZGF0YTogVGFnRmlsdGVyU291cmNlPERhdGE+KSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShUYWdGaWx0ZXIsIHRoaXMuZmlsdGVycywgZGF0YSwgeyBpZCB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRTb3J0ZXI8ViBleHRlbmRzIG51bWJlciB8IHN0cmluZz4oaWQ6IHN0cmluZywgc29ydGVyOiBTb3J0ZXJGbjxEYXRhLCBWPiwgZGF0YTogU29ydGVyUGFydGlhbFNvdXJjZTxEYXRhLCBWPiA9IHt9KTogU29ydGVyPERhdGEsIFY+IHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKFNvcnRlciwgdGhpcy5zb3J0ZXJzLCBkYXRhLCB7IGlkLCBzb3J0ZXIgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkTW9kaWZpZXIoaWQ6IHN0cmluZywgbW9kaWZpZXI6IE1vZGlmaWVyRm48RGF0YT4sIGRhdGE6IE1vZGlmaWVyUGFydGlhbDxEYXRhPiA9IHt9KTogTW9kaWZpZXI8RGF0YT4ge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oTW9kaWZpZXIsIHRoaXMubW9kaWZpZXJzLCBkYXRhLCB7IGlkLCBtb2RpZmllciB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRQcmVmaXgoaWQ6IHN0cmluZywgcHJlZml4OiBQcmVmaXhlckZuPERhdGE+LCBkYXRhOiBQcmVmaXhlclBhcnRpYWw8RGF0YT4gPSB7fSk6IFByZWZpeGVyPERhdGE+IHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKFByZWZpeGVyLCB0aGlzLm1vZGlmaWVycywgZGF0YSwgeyBpZCwgcHJlZml4IH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZFBhZ2luYXRpb25JbmZvKGlkOiBzdHJpbmcgPSAncGdpbmZvJywgZGF0YTogUGFydGlhbDxGaWx0ZXJlckl0ZW1Tb3VyY2U+ID0ge30pIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKFBhZ2luYXRpb25JbmZvRmlsdGVyLCB0aGlzLmZpbHRlcnMsIGRhdGEsIHsgaWQgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZpbHRlckVudHJpZXMoKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgZWwgb2YgdGhpcy5lbnRyaWVzKSB7XHJcblx0XHRcdFx0XHRsZXQgZGF0YSA9IHRoaXMuZ2V0RGF0YShlbCk7XHJcblx0XHRcdFx0XHRsZXQgdmFsdWUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZmlsdGVyIG9mIHRoaXMuZmlsdGVycykge1xyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlICYmIGZpbHRlci5hcHBseShkYXRhLCBlbCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbC5jbGFzc0xpc3QudG9nZ2xlKCdlZi1maWx0ZXJlZC1vdXQnLCAhdmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0X3ByZXZpb3VzU3RhdGUgPSB7XHJcblx0XHRcdFx0YWxsU29ydGVyc09mZjogdHJ1ZSxcclxuXHRcdFx0XHR1cGRhdGVEdXJhdGlvbjogMCxcclxuXHRcdFx0XHRmaW5pc2hlZEF0OiAwLFxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0b3JkZXJlZEVudHJpZXM6IEhUTUxFbGVtZW50W10gPSBbXTtcclxuXHRcdFx0b3JkZXJNb2RlOiAnY3NzJyB8ICdzd2FwJyA9ICdjc3MnO1xyXG5cdFx0XHRzb3J0RW50cmllcygpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5lbnRyaWVzLmxlbmd0aCA8PSAxKSByZXR1cm47XHJcblx0XHRcdFx0aWYgKHRoaXMub3JkZXJlZEVudHJpZXMubGVuZ3RoID09IDApIHRoaXMub3JkZXJlZEVudHJpZXMgPSB0aGlzLmVudHJpZXM7XHJcblx0XHRcdFx0aWYgKHRoaXMuc29ydGVycy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRsZXQgZW50cmllcyA9IHRoaXMuZW50cmllcztcclxuXHRcdFx0XHRsZXQgcGFpcnM6IFtEYXRhLCBIVE1MRWxlbWVudF1bXSA9IGVudHJpZXMubWFwKGUgPT4gW3RoaXMuZ2V0RGF0YShlKSwgZV0pO1xyXG5cdFx0XHRcdGxldCBhbGxPZmYgPSB0cnVlO1xyXG5cdFx0XHRcdGZvciAobGV0IHNvcnRlciBvZiB0aGlzLnNvcnRlcnMpIHtcclxuXHRcdFx0XHRcdGlmIChzb3J0ZXIubW9kZSAhPSAnb2ZmJykge1xyXG5cdFx0XHRcdFx0XHRwYWlycyA9IHNvcnRlci5zb3J0KHBhaXJzKTtcclxuXHRcdFx0XHRcdFx0YWxsT2ZmID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVudHJpZXMgPSBwYWlycy5tYXAoZSA9PiBlWzFdKTtcclxuXHRcdFx0XHRpZiAodGhpcy5vcmRlck1vZGUgPT0gJ3N3YXAnKSB7XHJcblx0XHRcdFx0XHRpZiAoIWVudHJpZXMuZXZlcnkoKGUsIGkpID0+IGUgPT0gdGhpcy5vcmRlcmVkRW50cmllc1tpXSkpIHtcclxuXHRcdFx0XHRcdFx0bGV0IGJyID0gZWxtKGAke2VudHJpZXNbMF0/LnRhZ05hbWV9LmVmLWJlZm9yZS1zb3J0W2hpZGRlbl1gKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5vcmRlcmVkRW50cmllc1swXS5iZWZvcmUoYnIpO1xyXG5cdFx0XHRcdFx0XHRici5hZnRlciguLi5lbnRyaWVzKTtcclxuXHRcdFx0XHRcdFx0YnIucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChhbGxPZmYgIT0gdGhpcy5fcHJldmlvdXNTdGF0ZS5hbGxTb3J0ZXJzT2ZmKSB7XHJcblx0XHRcdFx0XHRcdGVudHJpZXMubWFwKChlLCBpKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGFsbE9mZikge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZS5jbGFzc0xpc3QucmVtb3ZlKCdlZi1yZW9yZGVyJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRlLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZWYtcmVvcmRlci1jb250YWluZXInKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gdXNlIGBmbGV4YCBvciBgZ3JpZGAgY29udGFpbmVyIGFuZCBgb3JkZXI6dmFyKC0tZWYtb3JkZXIpYCBmb3IgY2hpbGRyZW4gXHJcblx0XHRcdFx0XHRcdFx0XHRlLmNsYXNzTGlzdC5hZGQoJ2VmLXJlb3JkZXInKTtcclxuXHRcdFx0XHRcdFx0XHRcdGUucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlZi1yZW9yZGVyLWNvbnRhaW5lcicpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIWFsbE9mZikge1xyXG5cdFx0XHRcdFx0XHRlbnRyaWVzLm1hcCgoZSwgaSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGUuc3R5bGUuc2V0UHJvcGVydHkoJy0tZWYtb3JkZXInLCBpICsgJycpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5vcmRlcmVkRW50cmllcyA9IGVudHJpZXM7XHJcblx0XHRcdFx0dGhpcy5fcHJldmlvdXNTdGF0ZS5hbGxTb3J0ZXJzT2ZmID0gYWxsT2ZmO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtb2RpZnlFbnRyaWVzKCkge1xyXG5cdFx0XHRcdGxldCBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xyXG5cdFx0XHRcdGxldCBwYWlyczogW0hUTUxFbGVtZW50LCBEYXRhXVtdID0gZW50cmllcy5tYXAoZSA9PiBbZSwgdGhpcy5nZXREYXRhKGUpXSk7XHJcblx0XHRcdFx0Zm9yIChsZXQgbW9kaWZpZXIgb2YgdGhpcy5tb2RpZmllcnMpIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IFtlLCBkXSBvZiBwYWlycykge1xyXG5cdFx0XHRcdFx0XHRtb2RpZmllci5hcHBseShkLCBlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG1vdmVUb1RvcChpdGVtOiBJU29ydGVyPERhdGE+IHwgSU1vZGlmaWVyPERhdGE+KSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuc29ydGVycy5pbmNsdWRlcyhpdGVtIGFzIElTb3J0ZXI8RGF0YT4pKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNvcnRlcnMuc3BsaWNlKHRoaXMuc29ydGVycy5pbmRleE9mKGl0ZW0gYXMgSVNvcnRlcjxEYXRhPiksIDEpO1xyXG5cdFx0XHRcdFx0dGhpcy5zb3J0ZXJzLnB1c2goaXRlbSBhcyBJU29ydGVyPERhdGE+KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kaWZpZXJzLmluY2x1ZGVzKGl0ZW0gYXMgSU1vZGlmaWVyPERhdGE+KSkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb2RpZmllcnMuc3BsaWNlKHRoaXMubW9kaWZpZXJzLmluZGV4T2YoaXRlbSBhcyBJTW9kaWZpZXI8RGF0YT4pLCAxKTtcclxuXHRcdFx0XHRcdHRoaXMubW9kaWZpZXJzLnB1c2goaXRlbSBhcyBJTW9kaWZpZXI8RGF0YT4pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZmluZEVudHJpZXMoKTogSFRNTEVsZW1lbnRbXSB7XHJcblx0XHRcdFx0cmV0dXJuIHR5cGVvZiB0aGlzLmVudHJ5U2VsZWN0b3IgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZW50cnlTZWxlY3RvcigpIDogcXEodGhpcy5lbnRyeVNlbGVjdG9yKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dXBkYXRlKHJlcGFyc2UgPSB0aGlzLnJlcGFyc2VQZW5kaW5nKSB7XHJcblx0XHRcdFx0bGV0IGVhcmxpZXN0VXBkYXRlID0gdGhpcy5fcHJldmlvdXNTdGF0ZS5maW5pc2hlZEF0ICsgTWF0aC5taW4oMTAwMDAsIDggKiB0aGlzLl9wcmV2aW91c1N0YXRlLnVwZGF0ZUR1cmF0aW9uKTtcclxuXHRcdFx0XHRpZiAocGVyZm9ybWFuY2Uubm93KCkgPCBlYXJsaWVzdFVwZGF0ZSkge1xyXG5cdFx0XHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMudXBkYXRlKCkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnVwZGF0ZVBlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAodGhpcy5kaXNhYmxlZCA9PSB0cnVlKSByZXR1cm47XHJcblx0XHRcdFx0bGV0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuXHRcdFx0XHRsZXQgZW50cmllcyA9IHRoaXMuZmluZEVudHJpZXMoKTtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuZGlzYWJsZWQgPT0gJ3NvZnQnKSB7XHJcblx0XHRcdFx0XHRpZiAoIWVudHJpZXMubGVuZ3RoKSByZXR1cm47XHJcblx0XHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYEVmIHNvZnQtZW5hYmxlZDogeDA9Pngke2VudHJpZXMubGVuZ3RofWAsIHRoaXMuZW50cnlTZWxlY3RvciwgdGhpcyk7XHJcblx0XHRcdFx0XHR0aGlzLmVuYWJsZSgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5kaXNhYmxlZCAhPSBmYWxzZSkgdGhyb3cgMDtcclxuXHJcblx0XHRcdFx0aWYgKCFlbnRyaWVzLmxlbmd0aCAmJiB0aGlzLnNvZnREaXNhYmxlKSB7XHJcblx0XHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYEVmIHNvZnQtZGlzYWJsZWQ6IHgke3RoaXMuZW5hYmxlLmxlbmd0aH09PngwYCwgdGhpcy5lbnRyeVNlbGVjdG9yLCB0aGlzKTtcclxuXHRcdFx0XHRcdHRoaXMuZGlzYWJsZSgnc29mdCcpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHJlcGFyc2UpIHtcclxuXHRcdFx0XHRcdHRoaXMuZW50cnlEYXRhcyA9IG5ldyBNYXBUeXBlKCk7XHJcblx0XHRcdFx0XHR0aGlzLnJlcGFyc2VQZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICghdGhpcy5jb250YWluZXIuY2xvc2VzdCgnYm9keScpKSB7XHJcblx0XHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRUbygnYm9keScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5lbnRyaWVzLmxlbmd0aCAhPSBlbnRyaWVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBFZiB1cGRhdGU6IHgke3RoaXMuZW50cmllcy5sZW5ndGh9PT54JHtlbnRyaWVzLmxlbmd0aH1gLCB0aGlzLmVudHJ5U2VsZWN0b3IsIHRoaXMpO1xyXG5cdFx0XHRcdFx0Ly8gfHwgdGhpcy5lbnRyaWVzXHJcblx0XHRcdFx0XHQvLyBUT0RPOiBzb3J0IGVudHJpZXMgaW4gaW5pdGlhbCBvcmRlclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmVudHJpZXMgPSBlbnRyaWVzO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyRW50cmllcygpO1xyXG5cdFx0XHRcdHRoaXMuc29ydEVudHJpZXMoKTtcclxuXHRcdFx0XHR0aGlzLm1vZGlmeUVudHJpZXMoKTtcclxuXHRcdFx0XHRsZXQgdGltZVVzZWQgPSBwZXJmb3JtYW5jZS5ub3coKSAtIG5vdztcclxuXHRcdFx0XHR0aGlzLl9wcmV2aW91c1N0YXRlLnVwZGF0ZUR1cmF0aW9uID0gMTAwMDA7XHJcblx0XHRcdFx0dGhpcy5fcHJldmlvdXNTdGF0ZS5maW5pc2hlZEF0ID0gcGVyZm9ybWFuY2Uubm93KCkgKyAxMDAwMDtcclxuXHRcdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5fcHJldmlvdXNTdGF0ZS51cGRhdGVEdXJhdGlvbiA9IHBlcmZvcm1hbmNlLm5vdygpIC0gbm93O1xyXG5cdFx0XHRcdFx0dGhpcy5fcHJldmlvdXNTdGF0ZS5maW5pc2hlZEF0ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG9mZkluY29tcGF0aWJsZShpbmNvbXBhdGlibGU6IHN0cmluZ1tdKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgZmlsdGVyIG9mIHRoaXMuZmlsdGVycykge1xyXG5cdFx0XHRcdFx0aWYgKGluY29tcGF0aWJsZS5pbmNsdWRlcyhmaWx0ZXIuaWQpKSB7XHJcblx0XHRcdFx0XHRcdGZpbHRlci50b2dnbGVNb2RlKCdvZmYnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yIChsZXQgc29ydGVyIG9mIHRoaXMuc29ydGVycykge1xyXG5cdFx0XHRcdFx0aWYgKGluY29tcGF0aWJsZS5pbmNsdWRlcyhzb3J0ZXIuaWQpKSB7XHJcblx0XHRcdFx0XHRcdHNvcnRlci50b2dnbGVNb2RlKCdvZmYnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yIChsZXQgbW9kaWZpZXIgb2YgdGhpcy5tb2RpZmllcnMpIHtcclxuXHRcdFx0XHRcdGlmIChpbmNvbXBhdGlibGUuaW5jbHVkZXMobW9kaWZpZXIuaWQpKSB7XHJcblx0XHRcdFx0XHRcdG1vZGlmaWVyLnRvZ2dsZU1vZGUoJ29mZicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3R5bGUocyA9ICcnKSB7XHJcblx0XHRcdFx0RW50cnlGaWx0ZXJlci5zdHlsZShzKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cdFx0XHRzdGF0aWMgc3R5bGUocyA9ICcnKSB7XHJcblx0XHRcdFx0bGV0IHN0eWxlID0gcSgnc3R5bGUuZWYtc3R5bGUnKSB8fCBlbG0oJ3N0eWxlLmVmLXN0eWxlJykuYXBwZW5kVG8oJ2hlYWQnKTtcclxuXHRcdFx0XHRzdHlsZS5pbm5lckhUTUwgPSBgXHJcblx0XHRcdFx0XHQuZWYtY29udGFpbmVyIHtcclxuXHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcclxuXHRcdFx0XHRcdFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IGZpeGVkO1xyXG5cdFx0XHRcdFx0XHR0b3A6IDA7XHJcblx0XHRcdFx0XHRcdHJpZ2h0OiAwO1xyXG5cdFx0XHRcdFx0XHR6LWluZGV4OiA5OTk5OTk5OTk5OTk5OTk5OTk5O1xyXG5cdFx0XHRcdFx0XHRtaW4td2lkdGg6IDEwMHB4O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0LmVmLWVudHJ5IHt9XHJcblxyXG5cdFx0XHRcdFx0LmVmLWZpbHRlcmVkLW91dCB7XHJcblx0XHRcdFx0XHRcdGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRidXR0b24uZWYtaXRlbSB7fVxyXG5cdFx0XHRcdFx0YnV0dG9uLmVmLWl0ZW1bZWYtbW9kZT1cIm9mZlwiXSB7XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpZ2h0Z3JheTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJ1dHRvbi5lZi1pdGVtW2VmLW1vZGU9XCJvblwiXSB7XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpZ2h0Z3JlZW47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRidXR0b24uZWYtaXRlbVtlZi1tb2RlPVwib3Bwb3NpdGVcIl0ge1xyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiB5ZWxsb3c7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0YnV0dG9uLmVmLWl0ZW0uZWYtZmlsdGVyID4gaW5wdXQge1xyXG5cdFx0XHRcdFx0XHRmbG9hdDogcmlnaHQ7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0W2VmLXByZWZpeF06OmJlZm9yZSB7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQ6IGF0dHIoZWYtcHJlZml4KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFtlZi1wb3N0Zml4XTo6YWZ0ZXIge1xyXG5cdFx0XHRcdFx0XHRjb250ZW50OiBhdHRyKGVmLXBvc3RmaXgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0YCArIHM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNvZnREaXNhYmxlID0gdHJ1ZTtcclxuXHRcdFx0ZGlzYWJsZWQ6IGJvb2xlYW4gfCAnc29mdCcgPSBmYWxzZTtcclxuXHRcdFx0ZGlzYWJsZShzb2Z0PzogJ3NvZnQnKSB7XHJcblx0XHRcdFx0dGhpcy5kaXNhYmxlZCA9IHRydWU7XHJcblx0XHRcdFx0aWYgKHNvZnQgPT0gJ3NvZnQnKSB0aGlzLmRpc2FibGVkID0gJ3NvZnQnO1xyXG5cdFx0XHRcdHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVuYWJsZSgpIHtcclxuXHRcdFx0XHR0aGlzLmRpc2FibGVkID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy51cGRhdGVQZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNsZWFyKCkge1xyXG5cdFx0XHRcdHRoaXMuZW50cnlEYXRhcyA9IG5ldyBNYXAoKTtcclxuXHRcdFx0XHR0aGlzLnBhcnNlcnMuc3BsaWNlKDAsIDk5OSk7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJzLnNwbGljZSgwLCA5OTkpLm1hcChlID0+IGUucmVtb3ZlKCkpO1xyXG5cdFx0XHRcdHRoaXMuc29ydGVycy5zcGxpY2UoMCwgOTk5KS5tYXAoZSA9PiBlLnJlbW92ZSgpKTtcclxuXHRcdFx0XHR0aGlzLm1vZGlmaWVycy5zcGxpY2UoMCwgOTk5KS5tYXAoZSA9PiBlLnJlbW92ZSgpKTtcclxuXHRcdFx0XHR0aGlzLmVuYWJsZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRnZXQgX2RhdGFzKCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmVudHJpZXNcclxuXHRcdFx0XHRcdC5maWx0ZXIoZSA9PiAhZS5jbGFzc0xpc3QuY29udGFpbnMoJ2VmLWZpbHRlcmVkLW91dCcpKVxyXG5cdFx0XHRcdFx0Lm1hcChlID0+IHRoaXMuZ2V0RGF0YShlKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gSXNQcm9taXNlPFQ+KHA6IFByb21pc2VMaWtlPFQ+IHwgVCk6IHAgaXMgUHJvbWlzZUxpa2U8VD4ge1xyXG5cdFx0XHRpZiAoIXApIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIHR5cGVvZiAocCBhcyBQcm9taXNlTGlrZTxUPikudGhlbiA9PSAnZnVuY3Rpb24nO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBjbGFzcyBPYnNlcnZlciB7XHJcblx0XHRcclxuXHR9XHJcbn1cclxuXHJcbi8qXHJcblxyXG5mdW5jdGlvbiBvYnNlcnZlQ2xhc3NBZGQoY2xzLCBjYikge1xyXG5cdGxldCBxdWV1ZWQgPSBmYWxzZTtcclxuXHRhc3luYyBmdW5jdGlvbiBydW4oKSB7XHJcblx0XHRpZiAocXVldWVkKSByZXR1cm47XHJcblx0XHRxdWV1ZWQgPSB0cnVlO1xyXG5cdFx0YXdhaXQgUHJvbWlzZS5mcmFtZSgpO1xyXG5cdFx0cXVldWVkID0gZmFsc2U7XHJcblx0XHRjYigpO1xyXG5cdH1cclxuXHRuZXcgTXV0YXRpb25PYnNlcnZlcihsaXN0ID0+IHtcclxuXHRcdGZvciAobGV0IG1yIG9mIGxpc3QpIHtcclxuXHRcdFx0aWYgKG1yLnR5cGUgPT0gJ2F0dHJpYnV0ZXMnICYmIG1yLmF0dHJpYnV0ZU5hbWUgPT0gJ2NsYXNzJykge1xyXG5cdFx0XHRcdGlmIChtci50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKGNscykpIHtcclxuXHRcdFx0XHRcdHJ1bigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAobXIudHlwZSA9PSAnY2hpbGRMaXN0Jykge1xyXG5cdFx0XHRcdGZvciAobGV0IGNoIG9mIG1yLmFkZGVkTm9kZXMpIHtcclxuXHRcdFx0XHRcdGlmIChjaC5jbGFzc0xpc3Q/LmNvbnRhaW5zKGNscykpIHtcclxuXHRcdFx0XHRcdFx0cnVuKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSkub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XHJcblx0XHRjaGlsZExpc3Q6IHRydWUsXHJcblx0XHRhdHRyaWJ1dGVzOiB0cnVlLFxyXG5cdFx0c3VidHJlZTogdHJ1ZSxcclxuXHR9KTtcclxufVxyXG5cclxuKi8iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBQYWdpbmF0ZUV4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IHR5cGUgUFJlcXVlc3RFdmVudCA9IEN1c3RvbUV2ZW50PHtcclxuXHRcdFx0cmVhc29uPzogS2V5Ym9hcmRFdmVudCB8IE1vdXNlRXZlbnQsXHJcblx0XHRcdGNvdW50OiBudW1iZXIsXHJcblx0XHRcdGNvbnN1bWVkOiBudW1iZXIsXHJcblx0XHRcdF9ldmVudD86ICdwYWdpbmF0aW9ucmVxdWVzdCcsXHJcblx0XHR9PjtcclxuXHRcdGV4cG9ydCB0eXBlIFBTdGFydEV2ZW50ID0gQ3VzdG9tRXZlbnQ8e1xyXG5cdFx0XHRwYWdpbmF0ZTogUGFnaW5hdGUsXHJcblx0XHRcdF9ldmVudD86ICdwYWdpbmF0aW9uc3RhcnQnLFxyXG5cdFx0fT47XHJcblx0XHRleHBvcnQgdHlwZSBQRW5kRXZlbnQgPSBDdXN0b21FdmVudDx7XHJcblx0XHRcdHBhZ2luYXRlOiBQYWdpbmF0ZSxcclxuXHRcdFx0X2V2ZW50PzogJ3BhZ2luYXRpb25lbmQnLFxyXG5cdFx0fT47XHJcblx0XHRleHBvcnQgdHlwZSBQTW9kaWZ5RXZlbnQgPSBDdXN0b21FdmVudDx7XHJcblx0XHRcdHBhZ2luYXRlOiBQYWdpbmF0ZSxcclxuXHRcdFx0YWRkZWQ6IEhUTUxFbGVtZW50W10sXHJcblx0XHRcdHJlbW92ZWQ6IEhUTUxFbGVtZW50W10sXHJcblx0XHRcdHNlbGVjdG9yOiBzZWxlY3RvcixcclxuXHRcdFx0X2V2ZW50PzogJ3BhZ2luYXRpb25tb2RpZnknLFxyXG5cdFx0fT47XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFBhZ2luYXRlIHtcclxuXHRcdFx0ZG9jOiBEb2N1bWVudDtcclxuXHJcblx0XHRcdGVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHRjb25kaXRpb246IHNlbGVjdG9yIHwgKCgpID0+IGJvb2xlYW4pO1xyXG5cdFx0XHRxdWV1ZWQgPSAwO1xyXG5cdFx0XHRydW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdF9pbml0ZWQgPSBmYWxzZTtcclxuXHRcdFx0c2hpZnRSZXF1ZXN0Q291bnQ/OiBudW1iZXIgfCAoKCkgPT4gbnVtYmVyKTtcclxuXHJcblx0XHRcdHN0YXRpYyBzaGlmdFJlcXVlc3RDb3VudCA9IDEwO1xyXG5cdFx0XHRzdGF0aWMgX2luaXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRzdGF0aWMgcmVtb3ZlRGVmYXVsdFJ1bkJpbmRpbmdzOiAoKSA9PiB2b2lkO1xyXG5cdFx0XHRzdGF0aWMgYWRkRGVmYXVsdFJ1bkJpbmRpbmdzKCkge1xyXG5cdFx0XHRcdFBhZ2luYXRlLnJlbW92ZURlZmF1bHRSdW5CaW5kaW5ncz8uKCk7XHJcblx0XHRcdFx0ZnVuY3Rpb24gb25tb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmIChldmVudC5idXR0b24gIT0gMSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0bGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBFbGVtZW50O1xyXG5cdFx0XHRcdFx0aWYgKHRhcmdldD8uY2xvc2VzdCgnYScpKSByZXR1cm47XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0bGV0IGNvdW50ID0gZXZlbnQuc2hpZnRLZXkgPyBQYWdpbmF0ZS5zaGlmdFJlcXVlc3RDb3VudCA6IDE7XHJcblx0XHRcdFx0XHRQYWdpbmF0ZS5yZXF1ZXN0UGFnaW5hdGlvbihjb3VudCwgZXZlbnQsIHRhcmdldCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZ1bmN0aW9uIG9ua2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0XHRcdFx0aWYgKGV2ZW50LmNvZGUgIT0gJ0FsdFJpZ2h0JykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdGxldCBjb3VudCA9IGV2ZW50LnNoaWZ0S2V5ID8gUGFnaW5hdGUuc2hpZnRSZXF1ZXN0Q291bnQgOiAxO1xyXG5cdFx0XHRcdFx0bGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBFbGVtZW50O1xyXG5cdFx0XHRcdFx0UGFnaW5hdGUucmVxdWVzdFBhZ2luYXRpb24oY291bnQsIGV2ZW50LCB0YXJnZXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbm1vdXNlZG93bik7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bik7XHJcblx0XHRcdFx0UGFnaW5hdGUucmVtb3ZlRGVmYXVsdFJ1bkJpbmRpbmdzID0gKCkgPT4ge1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25tb3VzZWRvd24pO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHN0YXRpYyBpbnN0YW5jZXM6IFBhZ2luYXRlW10gPSBbXTtcclxuXHJcblx0XHRcdC8vIGxpc3RlbmVyc1xyXG5cdFx0XHRpbml0KCkge1xyXG5cdFx0XHRcdGlmICghUGFnaW5hdGUucmVtb3ZlRGVmYXVsdFJ1bkJpbmRpbmdzKSB7XHJcblx0XHRcdFx0XHRQYWdpbmF0ZS5hZGREZWZhdWx0UnVuQmluZGluZ3MoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuX2luaXRlZCkgcmV0dXJuO1xyXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI8UFJlcXVlc3RFdmVudD4oJ3BhZ2luYXRpb25yZXF1ZXN0JywgdGhpcy5vblBhZ2luYXRpb25SZXF1ZXN0LmJpbmQodGhpcykpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI8UEVuZEV2ZW50PigncGFnaW5hdGlvbmVuZCcsIHRoaXMub25QYWdpbmF0aW9uRW5kLmJpbmQodGhpcykpO1xyXG5cdFx0XHRcdFBhZ2luYXRlLmluc3RhbmNlcy5wdXNoKHRoaXMpO1xyXG5cdFx0XHRcdGlmIChQb29wSnMuZGVidWcpIHtcclxuXHRcdFx0XHRcdGxldCBhY3RpdmUgPSB0aGlzLmNhbkNvbnN1bWVSZXF1ZXN0KCkgPyAnYWN0aXZlJyA6ICdpbmFjdGl2ZSc7XHJcblx0XHRcdFx0XHRpZiAoYWN0aXZlID09ICdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYFBhZ2luYXRlIGluc3RhbnRpYXRlZCAoJHthY3RpdmV9KTogYCwgdGhpcy5kYXRhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0b25QYWdpbmF0aW9uUmVxdWVzdChldmVudDogUFJlcXVlc3RFdmVudCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmNhbkNvbnN1bWVSZXF1ZXN0KCkpIHtcclxuXHRcdFx0XHRcdGV2ZW50LmRldGFpbC5jb25zdW1lZCsrO1xyXG5cdFx0XHRcdFx0bGV0IHF1ZXVlZCA9ICFldmVudC5kZXRhaWwucmVhc29uPy5zaGlmdEtleSA/IG51bGwgOiB0eXBlb2YgdGhpcy5zaGlmdFJlcXVlc3RDb3VudCA9PSAnZnVuY3Rpb24nID8gdGhpcy5zaGlmdFJlcXVlc3RDb3VudCgpIDogdGhpcy5zaGlmdFJlcXVlc3RDb3VudDtcclxuXHRcdFx0XHRcdHRoaXMucXVldWVkICs9IHF1ZXVlZCA/PyBldmVudC5kZXRhaWwuY291bnQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICghdGhpcy5ydW5uaW5nICYmIHRoaXMucXVldWVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLmNvbnN1bWVSZXF1ZXN0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRvblBhZ2luYXRpb25FbmQoZXZlbnQ6IFBFbmRFdmVudCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLnF1ZXVlZCAmJiB0aGlzLmNhbkNvbnN1bWVSZXF1ZXN0KCkpIHtcclxuXHRcdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5jYW5Db25zdW1lUmVxdWVzdCgpKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGB0aGlzIHBhZ2luYXRlIGNhbiBub3Qgd29yayBhbnltb3JlYCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5xdWV1ZWQgPSAwO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY29uc3VtZVJlcXVlc3QoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhbkNvbnN1bWVSZXF1ZXN0KCkge1xyXG5cdFx0XHRcdGlmICghdGhpcy5lbmFibGVkKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0aWYgKHRoaXMucnVubmluZykgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0aWYgKHRoaXMuY29uZGl0aW9uKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIHRoaXMuY29uZGl0aW9uID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmNvbmRpdGlvbigpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoIWRvY3VtZW50LnEodGhpcy5jb25kaXRpb24pKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzeW5jIGNvbnN1bWVSZXF1ZXN0KCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLnJ1bm5pbmcpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLnF1ZXVlZC0tO1xyXG5cdFx0XHRcdHRoaXMucnVubmluZyA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5lbWl0U3RhcnQoKTtcclxuXHRcdFx0XHRhd2FpdCB0aGlzLm9ucnVuPy4oKTtcclxuXHRcdFx0XHR0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmVtaXRFbmQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvbnJ1bjogKCkgPT4gUHJvbWlzZTx2b2lkPjtcclxuXHJcblxyXG5cdFx0XHQvLyBlbWl0dGVyc1xyXG5cdFx0XHRzdGF0aWMgcmVxdWVzdFBhZ2luYXRpb24oY291bnQgPSAxLCByZWFzb24/OiBQUmVxdWVzdEV2ZW50WydkZXRhaWwnXVsncmVhc29uJ10sIHRhcmdldDogRWxlbWVudCA9IGRvY3VtZW50LmJvZHkpIHtcclxuXHRcdFx0XHRsZXQgZGV0YWlsOiBQUmVxdWVzdEV2ZW50WydkZXRhaWwnXSA9IHsgY291bnQsIHJlYXNvbiwgY29uc3VtZWQ6IDAgfTtcclxuXHRcdFx0XHRmdW5jdGlvbiBmYWlsKGV2ZW50OiBQUmVxdWVzdEV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoZXZlbnQuZGV0YWlsLmNvbnN1bWVkID09IDApIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGBQYWdpbmF0aW9uIHJlcXVlc3QgZmFpbGVkOiBubyBsaXN0ZW5lcnNgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BhZ2luYXRpb25yZXF1ZXN0JywgZmFpbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ3BhZ2luYXRpb25yZXF1ZXN0JywgZmFpbCk7XHJcblx0XHRcdFx0dGFyZ2V0LmVtaXQ8UFJlcXVlc3RFdmVudD4oJ3BhZ2luYXRpb25yZXF1ZXN0JywgeyBjb3VudCwgcmVhc29uLCBjb25zdW1lZDogMCB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbWl0U3RhcnQoKSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5lbWl0PFBTdGFydEV2ZW50PigncGFnaW5hdGlvbnN0YXJ0JywgeyBwYWdpbmF0ZTogdGhpcyB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbWl0TW9kaWZ5KGFkZGVkLCByZW1vdmVkLCBzZWxlY3Rvcikge1xyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuZW1pdDxQTW9kaWZ5RXZlbnQ+KCdwYWdpbmF0aW9ubW9kaWZ5JywgeyBwYWdpbmF0ZTogdGhpcywgYWRkZWQsIHJlbW92ZWQsIHNlbGVjdG9yIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVtaXRFbmQoKSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5lbWl0PFBFbmRFdmVudD4oJ3BhZ2luYXRpb25lbmQnLCB7IHBhZ2luYXRlOiB0aGlzIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBmZXRjaGluZzogXHJcblx0XHRcdGFzeW5jIGZldGNoRG9jdW1lbnQobGluazogTGluaywgc3Bpbm5lciA9IHRydWUsIG1heEFnZTogZGVsdGFUaW1lID0gMCk6IFByb21pc2U8RG9jdW1lbnQ+IHtcclxuXHRcdFx0XHR0aGlzLmRvYyA9IG51bGw7XHJcblx0XHRcdFx0bGV0IGEgPSBzcGlubmVyICYmIFBhZ2luYXRlLmxpbmtUb0FuY2hvcihsaW5rKTtcclxuXHRcdFx0XHRhPy5jbGFzc0xpc3QuYWRkKCdwYWdpbmF0ZS1zcGluJyk7XHJcblx0XHRcdFx0bGluayA9IFBhZ2luYXRlLmxpbmtUb1VybChsaW5rKTtcclxuXHRcdFx0XHRsZXQgaW5pdCA9IHsgbWF4QWdlLCB4bWw6IHRoaXMuZGF0YS54bWwgfTtcclxuXHRcdFx0XHR0aGlzLmRvYyA9ICFtYXhBZ2UgPyBhd2FpdCBmZXRjaC5kb2MobGluaywgaW5pdCkgOiBhd2FpdCBmZXRjaC5jYWNoZWQuZG9jKGxpbmssIGluaXQpO1xyXG5cdFx0XHRcdGE/LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2luYXRlLXNwaW4nKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kb2M7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0YXRpYyBwcmVmZXRjaChzb3VyY2U6IHNlbGVjdG9yKSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQucXE8J2EnPihzb3VyY2UpLm1hcChlID0+IHtcclxuXHRcdFx0XHRcdGlmIChlLmhyZWYpIHtcclxuXHRcdFx0XHRcdFx0ZWxtKGBsaW5rW3JlbD1cInByZWZldGNoXCJdW2hyZWY9XCIke2UuaHJlZn1cIl1gKS5hcHBlbmRUbygnaGVhZCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gVE9ETzogaWYgZS5zcmNcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdC8vIG1vZGlmaWNhdGlvbjogXHJcblx0XHRcdGFmdGVyKHNvdXJjZTogc2VsZWN0b3IsIHRhcmdldDogc2VsZWN0b3IgPSBzb3VyY2UpIHtcclxuXHRcdFx0XHRsZXQgYWRkZWQgPSB0aGlzLmRvYy5xcShzb3VyY2UpO1xyXG5cdFx0XHRcdGlmICghYWRkZWQubGVuZ3RoKSByZXR1cm47XHJcblx0XHRcdFx0bGV0IGZvdW5kID0gZG9jdW1lbnQucXEodGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoZm91bmQubGVuZ3RoID09IDApIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgd2hlcmUgdG8gYXBwZW5kYCk7XHJcblx0XHRcdFx0Zm91bmQucG9wKCkuYWZ0ZXIoLi4uYWRkZWQpO1xyXG5cdFx0XHRcdHRoaXMuZW1pdE1vZGlmeShhZGRlZCwgW10sIHNvdXJjZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVwbGFjZUVhY2goc291cmNlOiBzZWxlY3RvciwgdGFyZ2V0OiBzZWxlY3RvciA9IHNvdXJjZSkge1xyXG5cdFx0XHRcdGxldCBhZGRlZCA9IHRoaXMuZG9jLnFxKHNvdXJjZSk7XHJcblx0XHRcdFx0bGV0IHJlbW92ZWQgPSBkb2N1bWVudC5xcSh0YXJnZXQpO1xyXG5cdFx0XHRcdGlmIChhZGRlZC5sZW5ndGggIT0gcmVtb3ZlZC5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihgYWRkZWQvcmVtb3ZlZCBjb3VudCBtaXNtYXRjaGApO1xyXG5cdFx0XHRcdHJlbW92ZWQubWFwKChlLCBpKSA9PiBlLnJlcGxhY2VXaXRoKGFkZGVkW2ldKSk7XHJcblx0XHRcdFx0dGhpcy5lbWl0TW9kaWZ5KGFkZGVkLCByZW1vdmVkLCBzb3VyY2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlcGxhY2Uoc291cmNlOiBzZWxlY3RvciwgdGFyZ2V0OiBzZWxlY3RvciA9IHNvdXJjZSkge1xyXG5cdFx0XHRcdGxldCBhZGRlZCA9IHRoaXMuZG9jLnFxKHNvdXJjZSk7XHJcblx0XHRcdFx0bGV0IHJlbW92ZWQgPSBkb2N1bWVudC5xcSh0YXJnZXQpO1xyXG5cdFx0XHRcdGlmIChhZGRlZC5sZW5ndGggIT0gcmVtb3ZlZC5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihgbm90IGltcGxlbWVudGVkYCk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVwbGFjZUVhY2goc291cmNlLCB0YXJnZXQpO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0Ly8gdXRpbFxyXG5cdFx0XHRzdGF0aWMgbGlua1RvVXJsKGxpbms6IExpbmspOiB1cmwge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgbGluayA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0aWYgKGxpbmsuc3RhcnRzV2l0aCgnaHR0cCcpKSByZXR1cm4gbGluayBhcyB1cmw7XHJcblx0XHRcdFx0XHRsaW5rID0gZG9jdW1lbnQucTwnYSc+KGxpbmspO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAobGluay50YWdOYW1lICE9ICdBJykgdGhyb3cgbmV3IEVycm9yKCdsaW5rIHNob3VsZCBiZSA8YT4gZWxlbWVudCEnKTtcclxuXHRcdFx0XHRyZXR1cm4gKGxpbmsgYXMgSFRNTEFuY2hvckVsZW1lbnQpLmhyZWYgYXMgdXJsO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0YXRpYyBsaW5rVG9BbmNob3IobGluazogTGluayk6IEhUTUxBbmNob3JFbGVtZW50IHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGxpbmsgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdGlmIChsaW5rLnN0YXJ0c1dpdGgoJ2h0dHAnKSkgcmV0dXJuIG51bGw7XHJcblx0XHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQucTwnYSc+KGxpbmspO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gbGluaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3RhdGljIHN0YXRpY0NhbGw8VD4odGhpczogdm9pZCwgZGF0YTogUGFyYW1ldGVyczxQYWdpbmF0ZVsnc3RhdGljQ2FsbCddPlswXSkge1xyXG5cdFx0XHRcdGxldCBwID0gbmV3IFBhZ2luYXRlKCk7XHJcblx0XHRcdFx0cC5zdGF0aWNDYWxsKGRhdGEpO1xyXG5cdFx0XHRcdHJldHVybiBwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyYXdEYXRhOiBhbnk7XHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRjb25kaXRpb246ICgpID0+IGJvb2xlYW47XHJcblx0XHRcdFx0cHJlZmV0Y2g6IGFueVtdO1xyXG5cdFx0XHRcdGRvYzogc2VsZWN0b3JbXTtcclxuXHRcdFx0XHRjbGljazogc2VsZWN0b3JbXTtcclxuXHRcdFx0XHRhZnRlcjogc2VsZWN0b3JbXTtcclxuXHRcdFx0XHRyZXBsYWNlOiBzZWxlY3RvcltdO1xyXG5cdFx0XHRcdG1heEFnZTogZGVsdGFUaW1lO1xyXG5cdFx0XHRcdHN0YXJ0PzogKHRoaXM6IFBhZ2luYXRlKSA9PiB2b2lkO1xyXG5cdFx0XHRcdG1vZGlmeT86ICh0aGlzOiBQYWdpbmF0ZSwgZG9jOiBEb2N1bWVudCkgPT4gdm9pZDtcclxuXHRcdFx0XHRlbmQ/OiAodGhpczogUGFnaW5hdGUsIGRvYzogRG9jdW1lbnQpID0+IHZvaWQ7XHJcblx0XHRcdFx0eG1sPzogYm9vbGVhbjtcclxuXHRcdFx0fTtcclxuXHRcdFx0c3RhdGljQ2FsbChkYXRhOiB7XHJcblx0XHRcdFx0Y29uZGl0aW9uPzogc2VsZWN0b3IgfCAoKCkgPT4gYm9vbGVhbiksXHJcblx0XHRcdFx0cHJlZmV0Y2g/OiBzZWxlY3RvciB8IHNlbGVjdG9yW10sXHJcblx0XHRcdFx0Y2xpY2s/OiBzZWxlY3RvciB8IHNlbGVjdG9yW10sXHJcblx0XHRcdFx0ZG9jPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdGFmdGVyPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdHJlcGxhY2U/OiBzZWxlY3RvciB8IHNlbGVjdG9yW10sXHJcblx0XHRcdFx0c3RhcnQ/OiAodGhpczogUGFnaW5hdGUpID0+IHZvaWQ7XHJcblx0XHRcdFx0bW9kaWZ5PzogKHRoaXM6IFBhZ2luYXRlLCBkb2M6IERvY3VtZW50KSA9PiB2b2lkO1xyXG5cdFx0XHRcdGVuZD86ICh0aGlzOiBQYWdpbmF0ZSwgZG9jOiBEb2N1bWVudCkgPT4gdm9pZDtcclxuXHRcdFx0XHRtYXhBZ2U/OiBkZWx0YVRpbWU7XHJcblx0XHRcdFx0Y2FjaGU/OiBkZWx0YVRpbWUgfCB0cnVlO1xyXG5cdFx0XHRcdHhtbD86IGJvb2xlYW47XHJcblx0XHRcdFx0cGFnZXI/OiBzZWxlY3RvciB8IHNlbGVjdG9yW107XHJcblx0XHRcdFx0c2hpZnRlZD86IG51bWJlciB8ICgoKSA9PiBudW1iZXIpO1xyXG5cdFx0XHR9KSB7XHJcblx0XHRcdFx0ZnVuY3Rpb24gdG9BcnJheTxUPih2PzogVCB8IFRbXSB8IHVuZGVmaW5lZCk6IFRbXSB7XHJcblx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh2KSkgcmV0dXJuIHY7XHJcblx0XHRcdFx0XHRpZiAodiA9PSBudWxsKSByZXR1cm4gW107XHJcblx0XHRcdFx0XHRyZXR1cm4gW3ZdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmdW5jdGlvbiB0b0NvbmRpdGlvbihzPzogc2VsZWN0b3IgfCAoKCkgPT4gYm9vbGVhbikgfCB1bmRlZmluZWQpOiAoKSA9PiBib29sZWFuIHtcclxuXHRcdFx0XHRcdGlmICghcykgcmV0dXJuICgpID0+IHRydWU7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIHMgPT0gJ3N0cmluZycpIHJldHVybiAoKSA9PiAhIWRvY3VtZW50LnEocyk7XHJcblx0XHRcdFx0XHRyZXR1cm4gcztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZnVuY3Rpb24gY2FuRmluZChhOiBzZWxlY3RvcltdKSB7XHJcblx0XHRcdFx0XHRpZiAoYS5sZW5ndGggPT0gMCkgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHRyZXR1cm4gYS5zb21lKHMgPT4gISFkb2N1bWVudC5xKHMpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZnVuY3Rpb24gZmluZE9uZShhOiBzZWxlY3RvcltdKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYS5maW5kKHMgPT4gZG9jdW1lbnQucShzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucmF3RGF0YSA9IGRhdGE7XHJcblx0XHRcdFx0dGhpcy5kYXRhID0ge1xyXG5cdFx0XHRcdFx0Y29uZGl0aW9uOiB0b0NvbmRpdGlvbihkYXRhLmNvbmRpdGlvbiksXHJcblx0XHRcdFx0XHRwcmVmZXRjaDogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5wcmVmZXRjaClcclxuXHRcdFx0XHRcdFx0LmZsYXRNYXAoZSA9PiB0b0FycmF5KGRhdGFbZV0gPz8gZSkpLFxyXG5cdFx0XHRcdFx0ZG9jOiB0b0FycmF5PHNlbGVjdG9yPihkYXRhLmRvYyksXHJcblx0XHRcdFx0XHRjbGljazogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5jbGljayksXHJcblx0XHRcdFx0XHRhZnRlcjogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5hZnRlciksXHJcblx0XHRcdFx0XHRyZXBsYWNlOiB0b0FycmF5PHNlbGVjdG9yPihkYXRhLnJlcGxhY2UpLFxyXG5cdFx0XHRcdFx0bWF4QWdlOiBkYXRhLm1heEFnZSA/PyAoZGF0YS5jYWNoZSA9PSB0cnVlID8gJzF5JyA6IGRhdGEuY2FjaGUpLFxyXG5cdFx0XHRcdFx0c3RhcnQ6IGRhdGEuc3RhcnQsIG1vZGlmeTogZGF0YS5tb2RpZnksIGVuZDogZGF0YS5lbmQsXHJcblx0XHRcdFx0XHR4bWw6IGRhdGEueG1sLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0dGhpcy5zaGlmdFJlcXVlc3RDb3VudCA9IGRhdGEuc2hpZnRlZDtcclxuXHRcdFx0XHRpZiAoZGF0YS5wYWdlcikge1xyXG5cdFx0XHRcdFx0bGV0IHBhZ2VyID0gdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5wYWdlcik7XHJcblx0XHRcdFx0XHR0aGlzLmRhdGEuZG9jID0gdGhpcy5kYXRhLmRvYy5mbGF0TWFwKGUgPT4gcGFnZXIubWFwKHAgPT4gYCR7cH0gJHtlfWApKTtcclxuXHRcdFx0XHRcdHRoaXMuZGF0YS5yZXBsYWNlLnB1c2goLi4ucGFnZXIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmNvbmRpdGlvbiA9ICgpID0+IHtcclxuXHRcdFx0XHRcdGlmICghdGhpcy5kYXRhLmNvbmRpdGlvbigpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRpZiAoIWNhbkZpbmQodGhpcy5kYXRhLmRvYykpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdGlmICghY2FuRmluZCh0aGlzLmRhdGEuY2xpY2spKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHRoaXMuaW5pdCgpO1xyXG5cdFx0XHRcdGlmICh0aGlzLmRhdGEuY29uZGl0aW9uKCkpIHtcclxuXHRcdFx0XHRcdHRoaXMuZGF0YS5wcmVmZXRjaC5tYXAocyA9PiBQYWdpbmF0ZS5wcmVmZXRjaChzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMub25ydW4gPSBhc3luYyAoKSA9PiB7XHJcblx0XHRcdFx0XHQvLyBpZiAoIWZpeGVkRGF0YS5jb25kaXRpb24oKSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5kYXRhLnN0YXJ0Py5jYWxsKHRoaXMpO1xyXG5cdFx0XHRcdFx0dGhpcy5kYXRhLmNsaWNrLm1hcChlID0+IGRvY3VtZW50LnEoZSk/LmNsaWNrKCkpO1xyXG5cdFx0XHRcdFx0bGV0IGRvYyA9IGZpbmRPbmUodGhpcy5kYXRhLmRvYyk7XHJcblx0XHRcdFx0XHRpZiAoZG9jKSB7XHJcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuZmV0Y2hEb2N1bWVudChkb2MsIHRydWUsIHRoaXMuZGF0YS5tYXhBZ2UpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRhdGEucmVwbGFjZS5tYXAocyA9PiB0aGlzLnJlcGxhY2UocykpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRhdGEuYWZ0ZXIubWFwKHMgPT4gdGhpcy5hZnRlcihzKSk7XHJcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuZGF0YS5tb2RpZnk/LmNhbGwodGhpcywgdGhpcy5kb2MpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5kYXRhLmVuZD8uY2FsbCh0aGlzLCBkb2MgJiYgdGhpcy5kb2MpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHR9XHJcblx0XHR0eXBlIFNlbE9yRWwgPSBzZWxlY3RvciB8IEhUTUxFbGVtZW50O1xyXG5cdFx0dHlwZSBTb21laG93PFQ+ID0gbnVsbCB8IFQgfCBUW10gfCAoKCkgPT4gKG51bGwgfCBUIHwgVFtdKSk7XHJcblx0XHR0eXBlIFNvbWVob3dBc3luYzxUPiA9IG51bGwgfCBUIHwgVFtdIHwgKCgpID0+IChudWxsIHwgVCB8IFRbXSB8IFByb21pc2U8bnVsbCB8IFQgfCBUW10+KSk7XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IHBhZ2luYXRlID0gT2JqZWN0LnNldFByb3RvdHlwZU9mKE9iamVjdC5hc3NpZ24oUGFnaW5hdGUuc3RhdGljQ2FsbCwgbmV3IFBhZ2luYXRlKCkpLCBQYWdpbmF0ZSk7XHJcblx0fVxyXG5cclxuXHRleHBvcnQgY29uc3QgcGFnaW5hdGUgPSBQYWdpbmF0ZUV4dGVuc2lvbi5wYWdpbmF0ZTtcclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIEltYWdlU2Nyb2xsaW5nRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgbGV0IGltYWdlU2Nyb2xsaW5nQWN0aXZlID0gZmFsc2U7XHJcblx0XHRleHBvcnQgbGV0IGltZ1NlbGVjdG9yID0gJ2ltZyc7XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGltYWdlU2Nyb2xsaW5nKHNlbGVjdG9yPzogc3RyaW5nKSB7XHJcblx0XHRcdGlmIChpbWFnZVNjcm9sbGluZ0FjdGl2ZSkgcmV0dXJuO1xyXG5cdFx0XHRpZiAoc2VsZWN0b3IpIGltZ1NlbGVjdG9yID0gc2VsZWN0b3I7XHJcblx0XHRcdGltYWdlU2Nyb2xsaW5nQWN0aXZlID0gdHJ1ZTtcclxuXHRcdFx0ZnVuY3Rpb24gb253aGVlbChldmVudDogTW91c2VFdmVudCAmIHsgd2hlZWxEZWx0YVk6IG51bWJlciB9KSB7XHJcblx0XHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5IHx8IGV2ZW50LmN0cmxLZXkpIHJldHVybjtcclxuXHRcdFx0XHRpZiAoc2Nyb2xsV2hvbGVJbWFnZSgtTWF0aC5zaWduKGV2ZW50LndoZWVsRGVsdGFZKSkpIHtcclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbndoZWVsLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xyXG5cdFx0XHRyZXR1cm4gaW1hZ2VTY3JvbGxpbmdPZmYgPSAoKSA9PiB7XHJcblx0XHRcdFx0aW1hZ2VTY3JvbGxpbmdBY3RpdmUgPSBmYWxzZTtcclxuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgb253aGVlbCk7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gYmluZEFycm93cygpIHtcclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ZW50ID0+IHtcclxuXHRcdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQXJyb3dMZWZ0Jykge1xyXG5cdFx0XHRcdFx0c2Nyb2xsV2hvbGVJbWFnZSgtMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChldmVudC5jb2RlID09ICdBcnJvd1JpZ2h0Jykge1xyXG5cdFx0XHRcdFx0c2Nyb2xsV2hvbGVJbWFnZSgxKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0XHRleHBvcnQgbGV0IGltYWdlU2Nyb2xsaW5nT2ZmID0gKCkgPT4geyB9O1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBpbWdUb1dpbmRvd0NlbnRlcihpbWc6IEVsZW1lbnQpIHtcclxuXHRcdFx0bGV0IHJlY3QgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRcdHJldHVybiAocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyIC0gaW5uZXJIZWlnaHQgLyAyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBnZXRBbGxJbWFnZUluZm8oKSB7XHJcblx0XHRcdGxldCBpbWFnZXMgPSBxcShpbWdTZWxlY3RvcikgYXMgSFRNTEltYWdlRWxlbWVudFtdO1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBpbWFnZXMubWFwKChpbWcsIGluZGV4KSA9PiB7XHJcblx0XHRcdFx0bGV0IHJlY3QgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdGltZywgcmVjdCwgaW5kZXgsXHJcblx0XHRcdFx0XHRpblNjcmVlbjogcmVjdC50b3AgPj0gLTEgJiYgcmVjdC5ib3R0b20gPD0gaW5uZXJIZWlnaHQsXHJcblx0XHRcdFx0XHRjcm9zc1NjcmVlbjogcmVjdC5ib3R0b20gPj0gMSAmJiByZWN0LnRvcCA8PSBpbm5lckhlaWdodCAtIDEsXHJcblx0XHRcdFx0XHR5VG9TY3JlZW5DZW50ZXI6IChyZWN0LnRvcCArIHJlY3QuYm90dG9tKSAvIDIgLSBpbm5lckhlaWdodCAvIDIsXHJcblx0XHRcdFx0XHRpc0luQ2VudGVyOiBNYXRoLmFicygocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyIC0gaW5uZXJIZWlnaHQgLyAyKSA8IDMsXHJcblx0XHRcdFx0XHRpc1NjcmVlbkhlaWdodDogTWF0aC5hYnMocmVjdC5oZWlnaHQgLSBpbm5lckhlaWdodCkgPCAzLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0pLmZpbHRlcihlID0+IGUucmVjdD8ud2lkdGggfHwgZS5yZWN0Py53aWR0aCk7XHJcblx0XHRcdHJldHVybiBkYXRhcztcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IHNjcm9sbFdob2xlSW1hZ2VQZW5kaW5nID0gZmFsc2U7XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGdldENlbnRyYWxJbWcoKSB7XHJcblx0XHRcdHJldHVybiBnZXRBbGxJbWFnZUluZm8oKS52c29ydChlID0+IE1hdGguYWJzKGUueVRvU2NyZWVuQ2VudGVyKSlbMF0/LmltZztcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzY3JvbGxXaG9sZUltYWdlKGRpciA9IDEpOiBib29sZWFuIHtcclxuXHRcdFx0aWYgKHNjcm9sbFdob2xlSW1hZ2VQZW5kaW5nKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0Ly8gaWYgKGRpciA9PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ3Njcm9sbGluZyBpbiBubyBkaXJlY3Rpb24hJyk7XHJcblx0XHRcdGlmICghZGlyKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHRkaXIgPSBNYXRoLnNpZ24oZGlyKTtcclxuXHRcdFx0bGV0IGRhdGFzID0gZ2V0QWxsSW1hZ2VJbmZvKCkudnNvcnQoZSA9PiBlLnlUb1NjcmVlbkNlbnRlcik7XHJcblx0XHRcdGxldCBjZW50cmFsID0gZGF0YXMudnNvcnQoZSA9PiBNYXRoLmFicyhlLnlUb1NjcmVlbkNlbnRlcikpWzBdO1xyXG5cdFx0XHRsZXQgbmV4dENlbnRyYWxJbmRleCA9IGRhdGFzLmluZGV4T2YoY2VudHJhbCk7XHJcblx0XHRcdHdoaWxlIChcclxuXHRcdFx0XHRkYXRhc1tuZXh0Q2VudHJhbEluZGV4ICsgZGlyXSAmJlxyXG5cdFx0XHRcdE1hdGguYWJzKGRhdGFzW25leHRDZW50cmFsSW5kZXggKyBkaXJdLnlUb1NjcmVlbkNlbnRlciAtIGNlbnRyYWwueVRvU2NyZWVuQ2VudGVyKSA8IDEwXHJcblx0XHRcdCkgbmV4dENlbnRyYWxJbmRleCArPSBkaXI7XHJcblx0XHRcdGNlbnRyYWwgPSBkYXRhc1tuZXh0Q2VudHJhbEluZGV4XTtcclxuXHRcdFx0bGV0IG5leHQgPSBkYXRhc1tuZXh0Q2VudHJhbEluZGV4ICsgZGlyXTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHNjcm9sbFRvSW1hZ2UoZGF0YTogdHlwZW9mIGNlbnRyYWwgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcclxuXHRcdFx0XHRpZiAoIWRhdGEpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRpZiAoc2Nyb2xsWSArIGRhdGEueVRvU2NyZWVuQ2VudGVyIDw9IDAgJiYgc2Nyb2xsWSA8PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChkYXRhLmlzU2NyZWVuSGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRkYXRhLmltZy5zY3JvbGxJbnRvVmlldygpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzY3JvbGxUbyhzY3JvbGxYLCBzY3JvbGxZICsgZGF0YS55VG9TY3JlZW5DZW50ZXIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzY3JvbGxXaG9sZUltYWdlUGVuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0UHJvbWlzZS5yYWYoMikudGhlbigoKSA9PiBzY3JvbGxXaG9sZUltYWdlUGVuZGluZyA9IGZhbHNlKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgbm8gaW1hZ2VzLCBkb24ndCBzY3JvbGw7XHJcblx0XHRcdGlmICghY2VudHJhbCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0Ly8gaWYgY3VycmVudCBpbWFnZSBpcyBvdXRzaWRlIHZpZXcsIGRvbid0IHNjcm9sbFxyXG5cdFx0XHRpZiAoIWNlbnRyYWwuY3Jvc3NTY3JlZW4pIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdC8vIGlmIGN1cnJlbnQgaW1hZ2UgaXMgaW4gY2VudGVyLCBzY3JvbGwgdG8gdGhlIG5leHQgb25lXHJcblx0XHRcdGlmIChjZW50cmFsLmlzSW5DZW50ZXIpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2Nyb2xsVG9JbWFnZShuZXh0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgdG8gc2Nyb2xsIHRvIGN1cnJlbnQgaW1hZ2UgeW91IGhhdmUgdG8gc2Nyb2xsIGluIG9wcG9zaWRlIGRpcmVjdGlvbiwgc2Nyb2xsIHRvIG5leHQgb25lXHJcblx0XHRcdGlmIChNYXRoLnNpZ24oY2VudHJhbC55VG9TY3JlZW5DZW50ZXIpICE9IGRpcikge1xyXG5cdFx0XHRcdHJldHVybiBzY3JvbGxUb0ltYWdlKG5leHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZiBjdXJyZW50IGltYWdlIGlzIGZpcnN0L2xhc3QsIGRvbid0IHNjcm9sbCBvdmVyIDI1dmggdG8gaXRcclxuXHRcdFx0aWYgKGRpciA9PSAxICYmIGNlbnRyYWwuaW5kZXggPT0gMCAmJiBjZW50cmFsLnlUb1NjcmVlbkNlbnRlciA+IGlubmVySGVpZ2h0IC8gMikge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZGlyID09IC0xICYmIGNlbnRyYWwuaW5kZXggPT0gZGF0YXMubGVuZ3RoIC0gMSAmJiBjZW50cmFsLnlUb1NjcmVlbkNlbnRlciA8IC1pbm5lckhlaWdodCAvIDIpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBzY3JvbGxUb0ltYWdlKGNlbnRyYWwpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzYXZlU2Nyb2xsUG9zaXRpb24oKSB7XHJcblx0XHRcdGxldCBpbWcgPSBnZXRDZW50cmFsSW1nKCk7XHJcblx0XHRcdGxldCByZWN0ID0gaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRsZXQgY2VudGVyVG9XaW5kb3dDZW50ZXIgPSAocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyIC0gaW5uZXJIZWlnaHQgLyAyO1xyXG5cdFx0XHRsZXQgb2Zmc2V0ID0gY2VudGVyVG9XaW5kb3dDZW50ZXIgLyByZWN0LmhlaWdodDtcclxuXHRcdFx0cmV0dXJuIHsgaW1nLCBvZmZzZXQsIGxvYWQoKSB7IGxvYWRTY3JvbGxQb3NpdGlvbih7IGltZywgb2Zmc2V0IH0pOyB9IH07XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gbG9hZFNjcm9sbFBvc2l0aW9uKHBvczogeyBpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIG9mZnNldDogbnVtYmVyIH0pIHtcclxuXHRcdFx0bGV0IHJlY3QgPSBwb3MuaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRsZXQgY2VudGVyVG9XaW5kb3dDZW50ZXIgPSBwb3Mub2Zmc2V0ICogcmVjdC5oZWlnaHQ7XHJcblx0XHRcdGxldCBhY3R1YWxDZW50ZXJUb1dpbmRvd0NlbnRlciA9IChyZWN0LnRvcCArIHJlY3QuYm90dG9tKSAvIDIgLSBpbm5lckhlaWdodCAvIDI7XHJcblx0XHRcdHNjcm9sbEJ5KDAsIGFjdHVhbENlbnRlclRvV2luZG93Q2VudGVyIC0gY2VudGVyVG9XaW5kb3dDZW50ZXIpO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9BcnJheS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL0RhdGVOb3dIYWNrLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZWxlbWVudC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2VsbS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL0ZpbHRlcmVyL0VudGl0eUZpbHRlcmVyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZXRjLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZmV0Y2gudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9PYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9vYnNlcnZlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1BhZ2luYXRlL1BhZ2luYXRpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9QYWdpbmF0ZS9JbWFnZVNjcm9sbGluZy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1Byb21pc2UudHNcIiAvPlxyXG5cclxuXHJcblxyXG5cclxuXHJcbm5hbWVzcGFjZSBQb29wSnMge1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gX19pbml0X18od2luZG93OiBXaW5kb3cgJiB0eXBlb2YgZ2xvYmFsVGhpcyk6IFwiaW5pdGVkXCIgfCBcImFscmVhZHkgaW5pdGVkXCIge1xyXG5cdFx0aWYgKCF3aW5kb3cpIHdpbmRvdyA9IGdsb2JhbFRoaXMud2luZG93IGFzIFdpbmRvdyAmIHR5cGVvZiBnbG9iYWxUaGlzO1xyXG5cclxuXHRcdHdpbmRvdy5lbG0gPSBFbG0uZWxtO1xyXG5cdFx0d2luZG93LnEgPSBPYmplY3QuYXNzaWduKFF1ZXJ5U2VsZWN0b3IuV2luZG93US5xLCB7IG9yRWxtOiBQb29wSnMuRWxtLnFPckVsbSB9KTtcclxuXHRcdHdpbmRvdy5xcSA9IFF1ZXJ5U2VsZWN0b3IuV2luZG93US5xcTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUsICdxJywgUXVlcnlTZWxlY3Rvci5FbGVtZW50US5xKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUsICdxcScsIFF1ZXJ5U2VsZWN0b3IuRWxlbWVudFEucXEpO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSwgJ2FwcGVuZFRvJywgRWxlbWVudEV4dGVuc2lvbi5hcHBlbmRUbyk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkVsZW1lbnQucHJvdG90eXBlLCAnZW1pdCcsIEVsZW1lbnRFeHRlbnNpb24uZW1pdCk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkRvY3VtZW50LnByb3RvdHlwZSwgJ3EnLCBRdWVyeVNlbGVjdG9yLkRvY3VtZW50US5xKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLCAncXEnLCBRdWVyeVNlbGVjdG9yLkRvY3VtZW50US5xcSk7XHJcblxyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5Qcm9taXNlLCAnZW1wdHknLCBQcm9taXNlRXh0ZW5zaW9uLmVtcHR5KTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuUHJvbWlzZSwgJ2ZyYW1lJywgUHJvbWlzZUV4dGVuc2lvbi5mcmFtZSk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LlByb21pc2UsICdyYWYnLCBQcm9taXNlRXh0ZW5zaW9uLmZyYW1lKTtcclxuXHJcblx0XHR3aW5kb3cuZmV0Y2guY2FjaGVkID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkIGFzIGFueTtcclxuXHRcdHdpbmRvdy5mZXRjaC5kb2MgPSBGZXRjaEV4dGVuc2lvbi5kb2MgYXMgYW55O1xyXG5cdFx0d2luZG93LmZldGNoLmpzb24gPSBGZXRjaEV4dGVuc2lvbi5qc29uIGFzIGFueTtcclxuXHRcdHdpbmRvdy5mZXRjaC5jYWNoZWQuZG9jID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jO1xyXG5cdFx0d2luZG93LmZldGNoLmRvYy5jYWNoZWQgPSBGZXRjaEV4dGVuc2lvbi5jYWNoZWREb2M7XHJcblx0XHR3aW5kb3cuZmV0Y2guY2FjaGVkRG9jID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jO1xyXG5cdFx0d2luZG93LmZldGNoLmpzb24uY2FjaGVkID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbjtcclxuXHRcdHdpbmRvdy5mZXRjaC5jYWNoZWQuanNvbiA9IEZldGNoRXh0ZW5zaW9uLmNhY2hlZEpzb247XHJcblx0XHR3aW5kb3cuZmV0Y2guaXNDYWNoZWQgPSBGZXRjaEV4dGVuc2lvbi5pc0NhY2hlZDtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuUmVzcG9uc2UucHJvdG90eXBlLCAnY2FjaGVkQXQnLCAwKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLCAnY2FjaGVkQXQnLCAwKTtcclxuXHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93Lk9iamVjdCwgJ2RlZmluZVZhbHVlJywgT2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuT2JqZWN0LCAnZGVmaW5lR2V0dGVyJywgT2JqZWN0RXh0ZW5zaW9uLmRlZmluZUdldHRlcik7XHJcblx0XHQvLyBPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUoT2JqZWN0LCAnbWFwJywgT2JqZWN0RXh0ZW5zaW9uLm1hcCk7XHJcblxyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5BcnJheSwgJ21hcCcsIEFycmF5RXh0ZW5zaW9uLm1hcCk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkFycmF5LnByb3RvdHlwZSwgJ3BtYXAnLCBBcnJheUV4dGVuc2lvbi5QTWFwLnRoaXNfcG1hcCk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkFycmF5LnByb3RvdHlwZSwgJ3Zzb3J0JywgQXJyYXlFeHRlbnNpb24udnNvcnQpO1xyXG5cclxuXHRcdHdpbmRvdy5wYWdpbmF0ZSA9IFBvb3BKcy5wYWdpbmF0ZSBhcyBhbnk7XHJcblx0XHR3aW5kb3cuaW1hZ2VTY3JvbGxpbmcgPSBQb29wSnMuSW1hZ2VTY3JvbGxpbmdFeHRlbnNpb247XHJcblxyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdywgJ19faW5pdF9fJywgJ2FscmVhZHkgaW5pdGVkJyk7XHJcblx0XHRyZXR1cm4gJ2luaXRlZCc7XHJcblx0fVxyXG5cclxuXHRPYmplY3RFeHRlbnNpb24uZGVmaW5lR2V0dGVyKHdpbmRvdywgJ19faW5pdF9fJywgKCkgPT4gX19pbml0X18od2luZG93KSk7XHJcblxyXG5cdGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLl9faW5pdF9fKSB7XHJcblx0XHR3aW5kb3cuX19pbml0X187XHJcblx0fVxyXG5cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCB0eXBlIFZhbHVlT2Y8VD4gPSBUW2tleW9mIFRdO1xyXG5cdGV4cG9ydCB0eXBlIE1hcHBlZE9iamVjdDxULCBWPiA9IHsgW1AgaW4ga2V5b2YgVF06IFYgfTtcclxuXHJcblx0ZXhwb3J0IHR5cGUgc2VsZWN0b3IgPSBzdHJpbmcgfCBzdHJpbmcgJiB7IF8/OiAnc2VsZWN0b3InIH1cclxuXHRleHBvcnQgdHlwZSB1cmwgPSBgaHR0cCR7c3RyaW5nfWAgJiB7IF8/OiAndXJsJyB9O1xyXG5cdGV4cG9ydCB0eXBlIExpbmsgPSBIVE1MQW5jaG9yRWxlbWVudCB8IHNlbGVjdG9yIHwgdXJsO1xyXG5cclxuXHJcblxyXG5cclxuXHR0eXBlIHRyaW1TdGFydDxTLCBDIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtDfSR7aW5mZXIgUzF9YCA/IHRyaW1TdGFydDxTMSwgQz4gOiBTO1xyXG5cdHR5cGUgdHJpbUVuZDxTLCBDIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtpbmZlciBTMX0ke0N9YCA/IHRyaW1FbmQ8UzEsIEM+IDogUztcclxuXHR0eXBlIHRyaW08UywgQyBleHRlbmRzIHN0cmluZyA9ICcgJyB8ICdcXHQnIHwgJ1xcbic+ID0gdHJpbVN0YXJ0PHRyaW1FbmQ8UywgQz4sIEM+O1xyXG5cclxuXHR0eXBlIHNwbGl0PFMsIEMgZXh0ZW5kcyBzdHJpbmc+ID0gUyBleHRlbmRzIGAke2luZmVyIFMxfSR7Q30ke2luZmVyIFMyfWAgPyBzcGxpdDxTMSwgQz4gfCBzcGxpdDxTMiwgQz4gOiBTO1xyXG5cdHR5cGUgc3BsaXRTdGFydDxTLCBDIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtpbmZlciBTMX0ke0N9JHtpbmZlciBfUzJ9YCA/IHNwbGl0U3RhcnQ8UzEsIEM+IDogUztcclxuXHR0eXBlIHNwbGl0RW5kPFMsIEMgZXh0ZW5kcyBzdHJpbmc+ID0gUyBleHRlbmRzIGAke2luZmVyIF9TMX0ke0N9JHtpbmZlciBTMn1gID8gc3BsaXRFbmQ8UzIsIEM+IDogUztcclxuXHJcblx0dHlwZSByZXBsYWNlPFMsIEMgZXh0ZW5kcyBzdHJpbmcsIFYgZXh0ZW5kcyBzdHJpbmc+ID0gUyBleHRlbmRzIGAke2luZmVyIFMxfSR7Q30ke2luZmVyIFMzfWAgPyByZXBsYWNlPGAke1MxfSR7Vn0ke1MzfWAsIEMsIFY+IDogUztcclxuXHJcblx0dHlwZSB3cyA9ICcgJyB8ICdcXHQnIHwgJ1xcbic7XHJcblxyXG5cdC8vIHR5cGUgaW5zYW5lU2VsZWN0b3IgPSAnIGEgLCBiW3F3ZV0gXFxuICwgYy54ICwgZCN5ICwgeCBlICwgeD5mICwgeCA+IGcgLCBbcXdlXSAsIGg6bm90KHg+eSkgLCBpbWcgJztcclxuXHJcblx0Ly8gdHlwZSBfaTEgPSByZXBsYWNlPGluc2FuZVNlbGVjdG9yLCBgWyR7c3RyaW5nfV1gLCAnLic+O1xyXG5cdC8vIHR5cGUgX2kxNSA9IHJlcGxhY2U8X2kxLCBgKCR7c3RyaW5nfSlgLCAnLic+O1xyXG5cdC8vIHR5cGUgX2kxNyA9IHJlcGxhY2U8X2kxNSwgRXhjbHVkZTx3cywgJyAnPiwgJyAnPjtcclxuXHQvLyB0eXBlIF9pMiA9IHNwbGl0PF9pMTcsICcsJz47XHJcblx0Ly8gdHlwZSBfaTMgPSB0cmltPF9pMj47XHJcblx0Ly8gdHlwZSBfaTQgPSBzcGxpdEVuZDxfaTMsIHdzIHwgJz4nPjtcclxuXHQvLyB0eXBlIF9pNSA9IHNwbGl0U3RhcnQ8X2k0LCAnLicgfCAnIycgfCAnOic+O1xyXG5cdC8vIHR5cGUgX2k2ID0gKEhUTUxFbGVtZW50VGFnTmFtZU1hcCAmIHsgJyc6IEhUTUxFbGVtZW50IH0gJiB7IFtrOiBzdHJpbmddOiBIVE1MRWxlbWVudCB9KVtfaTVdO1xyXG5cdGV4cG9ydCB0eXBlIFRhZ05hbWVGcm9tU2VsZWN0b3I8UyBleHRlbmRzIHN0cmluZz4gPSBzcGxpdFN0YXJ0PHNwbGl0RW5kPHRyaW08c3BsaXQ8cmVwbGFjZTxyZXBsYWNlPHJlcGxhY2U8UywgYFske3N0cmluZ31dYCwgJy4nPiwgYCgke3N0cmluZ30pYCwgJy4nPiwgRXhjbHVkZTx3cywgJyAnPiwgJyAnPiwgJywnPj4sIHdzIHwgJz4nPiwgJy4nIHwgJyMnIHwgJzonPjtcclxuXHJcblx0ZXhwb3J0IHR5cGUgVGFnRWxlbWVudEZyb21UYWdOYW1lPFM+ID0gUyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcCA/IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtTXSA6IEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG5cclxuZGVjbGFyZSBjb25zdCBfX2luaXRfXzogXCJpbml0ZWRcIiB8IFwiYWxyZWFkeSBpbml0ZWRcIjtcclxuZGVjbGFyZSBjb25zdCBlbG06IHR5cGVvZiBQb29wSnMuRWxtLmVsbTtcclxuZGVjbGFyZSBjb25zdCBxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuV2luZG93US5xICYgeyBvckVsbTogdHlwZW9mIFBvb3BKcy5FbG0ucU9yRWxtIH07O1xyXG5kZWNsYXJlIGNvbnN0IHFxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuV2luZG93US5xcTtcclxuZGVjbGFyZSBjb25zdCBwYWdpbmF0ZTogdHlwZW9mIFBvb3BKcy5wYWdpbmF0ZTtcclxuZGVjbGFyZSBjb25zdCBpbWFnZVNjcm9sbGluZzogdHlwZW9mIFBvb3BKcy5JbWFnZVNjcm9sbGluZ0V4dGVuc2lvbjtcclxuZGVjbGFyZSBuYW1lc3BhY2UgZmV0Y2gge1xyXG5cdGV4cG9ydCBsZXQgY2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZCAmIHsgZG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYywganNvbjogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWRKc29uIH07XHJcblx0ZXhwb3J0IGxldCBkb2M6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uZG9jICYgeyBjYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jIH07XHJcblx0ZXhwb3J0IGxldCBjYWNoZWREb2M6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jO1xyXG5cdGV4cG9ydCBsZXQganNvbjogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5qc29uICYgeyBjYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbiB9O1xyXG5cdGV4cG9ydCBsZXQgaXNDYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uaXNDYWNoZWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBXaW5kb3cge1xyXG5cdHJlYWRvbmx5IF9faW5pdF9fOiBcImluaXRlZFwiIHwgXCJhbHJlYWR5IGluaXRlZFwiO1xyXG5cdGVsbTogdHlwZW9mIFBvb3BKcy5FbG0uZWxtO1xyXG5cdHE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5XaW5kb3dRLnEgJiB7IG9yRWxtOiB0eXBlb2YgUG9vcEpzLkVsbS5xT3JFbG0gfTtcclxuXHRxcTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLldpbmRvd1EucXE7XHJcblx0cGFnaW5hdGU6IHR5cGVvZiBQb29wSnMucGFnaW5hdGU7XHJcblx0aW1hZ2VTY3JvbGxpbmc6IHR5cGVvZiBQb29wSnMuSW1hZ2VTY3JvbGxpbmdFeHRlbnNpb247XHJcblx0ZmV0Y2g6IHtcclxuXHRcdChpbnB1dDogUmVxdWVzdEluZm8sIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+O1xyXG5cdFx0Y2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZCAmIHsgZG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYywganNvbjogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWRKc29uIH07XHJcblx0XHRkb2M6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uZG9jICYgeyBjYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jIH07XHJcblx0XHRjYWNoZWREb2M6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jO1xyXG5cdFx0anNvbjogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5qc29uICYgeyBjYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbiB9O1xyXG5cdFx0aXNDYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uaXNDYWNoZWQ7XHJcblx0fVxyXG59XHJcblxyXG5pbnRlcmZhY2UgRWxlbWVudCB7XHJcblx0cTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLkVsZW1lbnRRLnE7XHJcblx0cXE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5FbGVtZW50US5xcTtcclxuXHRhcHBlbmRUbzogdHlwZW9mIFBvb3BKcy5FbGVtZW50RXh0ZW5zaW9uLmFwcGVuZFRvO1xyXG5cdGVtaXQ6IHR5cGVvZiBQb29wSnMuRWxlbWVudEV4dGVuc2lvbi5lbWl0O1xyXG5cdGFkZEV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEN1c3RvbUV2ZW50PHsgX2V2ZW50Pzogc3RyaW5nIH0+Pih0eXBlOiBUWydkZXRhaWwnXVsnX2V2ZW50J10sIGxpc3RlbmVyOiAodGhpczogRG9jdW1lbnQsIGV2OiBUKSA9PiBhbnksIG9wdGlvbnM/OiBib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkO1xyXG59XHJcbmludGVyZmFjZSBEb2N1bWVudCB7XHJcblx0cTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLkRvY3VtZW50US5xO1xyXG5cdHFxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuRG9jdW1lbnRRLnFxO1xyXG5cdGNhY2hlZEF0OiBudW1iZXI7XHJcblx0YWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgQ3VzdG9tRXZlbnQ8eyBfZXZlbnQ/OiBzdHJpbmcgfT4+KHR5cGU6IFRbJ2RldGFpbCddWydfZXZlbnQnXSwgbGlzdGVuZXI6ICh0aGlzOiBEb2N1bWVudCwgZXY6IFQpID0+IGFueSwgb3B0aW9ucz86IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBPYmplY3RDb25zdHJ1Y3RvciB7XHJcblx0ZGVmaW5lVmFsdWU6IHR5cGVvZiBQb29wSnMuT2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlO1xyXG5cdGRlZmluZUdldHRlcjogdHlwZW9mIFBvb3BKcy5PYmplY3RFeHRlbnNpb24uZGVmaW5lR2V0dGVyO1xyXG5cdC8vIG1hcDogdHlwZW9mIFBvb3BKcy5PYmplY3RFeHRlbnNpb24ubWFwO1xyXG5cdHNldFByb3RvdHlwZU9mPFQsIFA+KG86IFQsIHByb3RvOiBQKTogVCAmIFA7XHJcblxyXG5cclxuXHRmcm9tRW50cmllczxLIGV4dGVuZHMgc3RyaW5nIHwgbnVtYmVyIHwgc3ltYm9sLCBWPihcclxuXHRcdGVudHJpZXM6IHJlYWRvbmx5IChyZWFkb25seSBbSywgVl0pW11cclxuXHQpOiB7IFtrIGluIEtdOiBWIH07XHJcbn1cclxuaW50ZXJmYWNlIFByb21pc2VDb25zdHJ1Y3RvciB7XHJcblx0ZW1wdHk6IHR5cGVvZiBQb29wSnMuUHJvbWlzZUV4dGVuc2lvbi5lbXB0eTtcclxuXHRmcmFtZTogdHlwZW9mIFBvb3BKcy5Qcm9taXNlRXh0ZW5zaW9uLmZyYW1lO1xyXG5cdHJhZjogdHlwZW9mIFBvb3BKcy5Qcm9taXNlRXh0ZW5zaW9uLmZyYW1lO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQXJyYXk8VD4ge1xyXG5cdHZzb3J0OiB0eXBlb2YgUG9vcEpzLkFycmF5RXh0ZW5zaW9uLnZzb3J0O1xyXG5cdC8vIHBtYXA6IHR5cGVvZiBQb29wSnMuQXJyYXlFeHRlbnNpb24ucG1hcDtcclxuXHRwbWFwOiB0eXBlb2YgUG9vcEpzLkFycmF5RXh0ZW5zaW9uLlBNYXAudGhpc19wbWFwO1xyXG59XHJcbmludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcclxuXHRtYXA6IHR5cGVvZiBQb29wSnMuQXJyYXlFeHRlbnNpb24ubWFwO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRGF0ZUNvbnN0cnVjdG9yIHtcclxuXHRfbm93KCk6IG51bWJlcjtcclxufVxyXG5pbnRlcmZhY2UgRGF0ZSB7XHJcblx0X2dldFRpbWUoKTogbnVtYmVyO1xyXG59XHJcbmludGVyZmFjZSBQZXJmb3JtYW5jZSB7XHJcblx0X25vdzogUGVyZm9ybWFuY2VbJ25vdyddO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmVzcG9uc2Uge1xyXG5cdGNhY2hlZEF0OiBudW1iZXI7XHJcbn1cclxuXHJcbi8vIGludGVyZmFjZSBDdXN0b21FdmVudDxUPiB7XHJcbi8vIFx0ZGV0YWlsPzogVDtcclxuLy8gfVxyXG5cclxuaW50ZXJmYWNlIEZ1bmN0aW9uIHtcclxuXHRiaW5kPFQsIFIsIEFSR1MgZXh0ZW5kcyBhbnlbXT4odGhpczogKHRoaXM6IFQsIC4uLmFyZ3M6IEFSR1MpID0+IFIsIHRoaXNBcmc6IFQpOiAoKC4uLmFyZ3M6IEFSR1MpID0+IFIpXHJcbn1cclxuXHJcbi8vIGZvcmNlIGFsbG93ICcnLnNwbGl0KCcuJykucG9wKCkhXHJcbmludGVyZmFjZSBTdHJpbmcge1xyXG5cdHNwbGl0KHNwbGl0dGVyOiBzdHJpbmcpOiBbc3RyaW5nLCAuLi5zdHJpbmdbXV07XHJcbn1cclxuaW50ZXJmYWNlIEFycmF5PFQ+IHtcclxuXHRwb3AoKTogdGhpcyBleHRlbmRzIFtULCAuLi5UW11dID8gVCA6IFQgfCB1bmRlZmluZWQ7XHJcbn1cclxuIiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgRmlsdGVyZXJJdGVtPERhdGE+IHtcclxuXHRcdFx0aWQ6IHN0cmluZyA9IFwiXCI7XHJcblx0XHRcdG5hbWU/OiBzdHJpbmc7XHJcblx0XHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG5cdFx0XHR0aHJlZVdheTogV2F5bmVzcyA9IGZhbHNlO1xyXG5cdFx0XHRtb2RlOiBNb2RlID0gJ29mZic7XHJcblx0XHRcdHBhcmVudDogRW50cnlGaWx0ZXJlcjtcclxuXHRcdFx0YnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuXHRcdFx0aW5jb21wYXRpYmxlPzogc3RyaW5nW107XHJcblx0XHRcdGhpZGRlbiA9IGZhbHNlO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogRmlsdGVyZXJJdGVtU291cmNlKSB7XHJcblx0XHRcdFx0ZGF0YS5idXR0b24gPz89ICdidXR0b24uZWYtaXRlbSc7XHJcblx0XHRcdFx0T2JqZWN0LmFzc2lnbih0aGlzLCBkYXRhKTtcclxuXHJcblx0XHRcdFx0dGhpcy5idXR0b24gPSBlbG08J2J1dHRvbic+KGRhdGEuYnV0dG9uLFxyXG5cdFx0XHRcdFx0Y2xpY2sgPT4gdGhpcy5jbGljayhjbGljayksXHJcblx0XHRcdFx0XHRjb250ZXh0bWVudSA9PiB0aGlzLmNvbnRleHRtZW51KGNvbnRleHRtZW51KSxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHRcdHRoaXMucGFyZW50LmNvbnRhaW5lci5hcHBlbmQodGhpcy5idXR0b24pO1xyXG5cdFx0XHRcdGlmICh0aGlzLm5hbWUpIHtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uLmFwcGVuZCh0aGlzLm5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b24udGl0bGUgPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlICE9ICdvZmYnKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUoZGF0YS5tb2RlLCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuaGlkZGVuKSB7XHJcblx0XHRcdFx0XHR0aGlzLmhpZGUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNb2RlKCdvbicpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZXZlbnQudGFyZ2V0ICE9IHRoaXMuYnV0dG9uKSByZXR1cm47XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb24nKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUodGhpcy50aHJlZVdheSA/ICdvcHBvc2l0ZScgOiAnb2ZmJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTW9kZSgnb2ZmJylcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnRleHRtZW51KGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlICE9ICdvcHBvc2l0ZScpIHtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTW9kZSgnb3Bwb3NpdGUnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNb2RlKCdvZmYnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRvZ2dsZU1vZGUobW9kZTogTW9kZSwgZm9yY2UgPSBmYWxzZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gbW9kZSAmJiAhZm9yY2UpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLm1vZGUgPSBtb2RlO1xyXG5cdFx0XHRcdHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnZWYtbW9kZScsIG1vZGUpO1xyXG5cdFx0XHRcdGlmIChtb2RlICE9ICdvZmYnICYmIHRoaXMuaW5jb21wYXRpYmxlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnBhcmVudC5vZmZJbmNvbXBhdGlibGUodGhpcy5pbmNvbXBhdGlibGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnBhcmVudC5yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJlbW92ZSgpIHtcclxuXHRcdFx0XHR0aGlzLmJ1dHRvbi5yZW1vdmUoKTtcclxuXHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUoJ29mZicpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzaG93KCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZGVuID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5idXR0b24uaGlkZGVuID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0aGlkZSgpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGRlbiA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5idXR0b24uaGlkZGVuID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vRmlsdGVyZXJJdGVtLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRW50cnlGaWx0ZXJlckV4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIEZpbHRlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElGaWx0ZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIGZpbHRlcjogRmlsdGVyRm48RGF0YT47XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBGaWx0ZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLWZpbHRlcltlZi1tb2RlPVwib2ZmXCJdJztcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyoqIHJldHVybnMgaWYgaXRlbSBzaG91bGQgYmUgdmlzaWJsZSAqL1xyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvZmYnKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRsZXQgdmFsdWUgPSB0aGlzLmZpbHRlcihkYXRhLCBlbCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gdHlwZW9mIHZhbHVlID09IFwibnVtYmVyXCIgPyB2YWx1ZSA+IDAgOiB2YWx1ZTtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvbicpIHJldHVybiByZXN1bHQ7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb3Bwb3NpdGUnKSByZXR1cm4gIXJlc3VsdDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBWYWx1ZUZpbHRlcjxEYXRhLCBWIGV4dGVuZHMgc3RyaW5nIHwgbnVtYmVyPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElGaWx0ZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIGZpbHRlcjogVmFsdWVGaWx0ZXJGbjxEYXRhLCBWPjtcclxuXHRcdFx0aW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblx0XHRcdGxhc3RWYWx1ZTogVjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IFZhbHVlRmlsdGVyU291cmNlPERhdGEsIFY+KSB7XHJcblx0XHRcdFx0ZGF0YS5idXR0b24gPz89ICdidXR0b24uZWYtaXRlbS5lZi1maWx0ZXJbZWYtbW9kZT1cIm9mZlwiXSc7XHJcblx0XHRcdFx0c3VwZXIoZGF0YSk7XHJcblx0XHRcdFx0bGV0IHR5cGUgPSB0eXBlb2YgZGF0YS5pbnB1dCA9PSAnbnVtYmVyJyA/ICdudW1iZXInIDogJ3RleHQnO1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KGRhdGEuaW5wdXQpO1xyXG5cdFx0XHRcdGxldCBpbnB1dCA9IGBpbnB1dFt0eXBlPSR7dHlwZX1dW3ZhbHVlPSR7dmFsdWV9XWA7XHJcblx0XHRcdFx0dGhpcy5pbnB1dCA9IGVsbTwnaW5wdXQnPihpbnB1dCxcclxuXHRcdFx0XHRcdGlucHV0ID0+IHRoaXMuY2hhbmdlKCksXHJcblx0XHRcdFx0KS5hcHBlbmRUbyh0aGlzLmJ1dHRvbik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNoYW5nZSgpIHtcclxuXHRcdFx0XHRsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKCk7XHJcblx0XHRcdFx0aWYgKHRoaXMubGFzdFZhbHVlICE9IHZhbHVlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0dGhpcy5wYXJlbnQucmVxdWVzdFVwZGF0ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyoqIHJldHVybnMgaWYgaXRlbSBzaG91bGQgYmUgdmlzaWJsZSAqL1xyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvZmYnKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRsZXQgdmFsdWUgPSB0aGlzLmZpbHRlcih0aGlzLmdldFZhbHVlKCksIGRhdGEsIGVsKTtcclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gdHlwZW9mIHZhbHVlID09IFwibnVtYmVyXCIgPyB2YWx1ZSA+IDAgOiB2YWx1ZTtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvbicpIHJldHVybiByZXN1bHQ7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb3Bwb3NpdGUnKSByZXR1cm4gIXJlc3VsdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Z2V0VmFsdWUoKTogViB7XHJcblx0XHRcdFx0bGV0IHZhbHVlOiBWID0gKHRoaXMuaW5wdXQudHlwZSA9PSAndGV4dCcgPyB0aGlzLmlucHV0LnZhbHVlIDogdGhpcy5pbnB1dC52YWx1ZUFzTnVtYmVyKSBhcyBWO1xyXG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBNYXRjaEZpbHRlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElGaWx0ZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIHZhbHVlOiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdGlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cdFx0XHRsYXN0VmFsdWU6IHN0cmluZztcclxuXHRcdFx0bWF0Y2hlcjogKGlucHV0OiBzdHJpbmcpID0+IGJvb2xlYW47XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBNYXRjaEZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtZmlsdGVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdGRhdGEudmFsdWUgPz89IGRhdGEgPT4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcblx0XHRcdFx0c3VwZXIoZGF0YSk7XHJcblx0XHRcdFx0bGV0IHZhbHVlID0gIWRhdGEuaW5wdXQgPyAnJyA6IEpTT04uc3RyaW5naWZ5KGRhdGEuaW5wdXQpO1xyXG5cdFx0XHRcdGxldCBpbnB1dCA9IGBpbnB1dFt0eXBlPXRleHR9XVt2YWx1ZT0ke3ZhbHVlfV1gO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXQgPSBlbG08J2lucHV0Jz4oaW5wdXQsXHJcblx0XHRcdFx0XHRpbnB1dCA9PiB0aGlzLmNoYW5nZSgpLFxyXG5cdFx0XHRcdCkuYXBwZW5kVG8odGhpcy5idXR0b24pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjaGFuZ2UoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubGFzdFZhbHVlICE9IHRoaXMuaW5wdXQudmFsdWUpIHtcclxuXHRcdFx0XHRcdHRoaXMubGFzdFZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcclxuXHRcdFx0XHRcdHRoaXMubWF0Y2hlciA9IHRoaXMuZ2VuZXJhdGVNYXRjaGVyKHRoaXMubGFzdFZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29mZicpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB0aGlzLm1hdGNoZXIodGhpcy52YWx1ZShkYXRhLCBlbCkpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLm1vZGUgPT0gJ29uJyA/IHJlc3VsdCA6ICFyZXN1bHQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIG1hdGNoZXJDYWNoZTogTWFwPHN0cmluZywgKChpbnB1dDogc3RyaW5nKSA9PiBib29sZWFuKT4gPSBuZXcgTWFwKCk7XHJcblx0XHRcdC8vIGdldE1hdGNoZXIoc291cmNlOiBzdHJpbmcpOiAoaW5wdXQ6IHN0cmluZykgPT4gYm9vbGVhbiB7XHJcblx0XHRcdC8vIFx0aWYgKHRoaXMubWF0Y2hlckNhY2hlLmhhcyhzb3VyY2UpKSB7XHJcblx0XHRcdC8vIFx0XHRyZXR1cm4gdGhpcy5tYXRjaGVyQ2FjaGUuZ2V0KHNvdXJjZSk7XHJcblx0XHRcdC8vIFx0fVxyXG5cdFx0XHQvLyBcdGxldCBtYXRjaGVyID0gdGhpcy5nZW5lcmF0ZU1hdGNoZXIoc291cmNlKTtcclxuXHRcdFx0Ly8gXHR0aGlzLm1hdGNoZXJDYWNoZS5zZXQoc291cmNlLCBtYXRjaGVyKTtcclxuXHRcdFx0Ly8gXHRyZXR1cm4gbWF0Y2hlcjtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHRnZW5lcmF0ZU1hdGNoZXIoc291cmNlOiBzdHJpbmcpOiAoKGlucHV0OiBzdHJpbmcpID0+IGJvb2xlYW4pIHtcclxuXHRcdFx0XHRzb3VyY2UgPSBzb3VyY2UudHJpbSgpO1xyXG5cdFx0XHRcdGlmIChzb3VyY2UubGVuZ3RoID09IDApIHJldHVybiAoKSA9PiB0cnVlO1xyXG5cdFx0XHRcdGlmIChzb3VyY2UuaW5jbHVkZXMoJyAnKSkge1xyXG5cdFx0XHRcdFx0bGV0IHBhcnRzID0gc291cmNlLnNwbGl0KCcgJykubWFwKGUgPT4gdGhpcy5nZW5lcmF0ZU1hdGNoZXIoZSkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIChpbnB1dCkgPT4gcGFydHMuZXZlcnkobSA9PiBtKGlucHV0KSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChzb3VyY2Uuc3RhcnRzV2l0aCgnLScpKSB7XHJcblx0XHRcdFx0XHRpZiAoc291cmNlLmxlbmd0aCA8IDMpIHJldHVybiAoKSA9PiB0cnVlO1xyXG5cdFx0XHRcdFx0bGV0IGJhc2UgPSB0aGlzLmdlbmVyYXRlTWF0Y2hlcihzb3VyY2Uuc2xpY2UoMSkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIChpbnB1dCkgPT4gIWJhc2UoaW5wdXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0bGV0IGZsYWdzID0gc291cmNlLnRvTG93ZXJDYXNlKCkgPT0gc291cmNlID8gJ2knIDogJyc7XHJcblx0XHRcdFx0XHRsZXQgcmVnZXggPSBuZXcgUmVnRXhwKHNvdXJjZSwgZmxhZ3MpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIChpbnB1dCkgPT4gISFpbnB1dC5tYXRjaChyZWdleCk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkgeyB9O1xyXG5cdFx0XHRcdHJldHVybiAoaW5wdXQpID0+IGlucHV0LmluY2x1ZGVzKHNvdXJjZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0eXBlIFRhZ0dldHRlckZuPERhdGE+ID0gc2VsZWN0b3IgfCAoKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSkgPT4gKEhUTUxFbGVtZW50W10gfCBzdHJpbmdbXSkpO1xyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBUYWdGaWx0ZXJTb3VyY2U8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1Tb3VyY2Uge1xyXG5cdFx0XHR0YWdzOiBUYWdHZXR0ZXJGbjxEYXRhPjtcclxuXHRcdFx0aW5wdXQ/OiBzdHJpbmc7XHJcblx0XHRcdGhpZ2hpZ2h0Q2xhc3M/OiBzdHJpbmc7XHJcblx0XHR9XHJcblx0XHR0eXBlIFRhZ01hdGNoZXIgPSB7IHBvc2l0aXZlOiBib29sZWFuLCBtYXRjaGVzOiAoczogc3RyaW5nKSA9PiBib29sZWFuIH07XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFRhZ0ZpbHRlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElGaWx0ZXI8RGF0YT4ge1xyXG5cdFx0XHR0YWdzOiBUYWdHZXR0ZXJGbjxEYXRhPjtcclxuXHRcdFx0aW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblx0XHRcdGhpZ2hpZ2h0Q2xhc3M6IHN0cmluZztcclxuXHJcblx0XHRcdGxhc3RWYWx1ZTogc3RyaW5nID0gJyc7XHJcblx0XHRcdGNhY2hlZE1hdGNoZXI6IFRhZ01hdGNoZXJbXTtcclxuXHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBUYWdGaWx0ZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLWZpbHRlcltlZi1tb2RlPVwib2ZmXCJdJztcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0XHR0aGlzLmlucHV0ID0gZWxtPCdpbnB1dCc+KGBpbnB1dFt0eXBlPXRleHR9XWAsXHJcblx0XHRcdFx0XHRpbnB1dCA9PiB0aGlzLmNoYW5nZSgpLFxyXG5cdFx0XHRcdCkuYXBwZW5kVG8odGhpcy5idXR0b24pO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXQudmFsdWUgPSBkYXRhLmlucHV0IHx8ICcnO1xyXG5cdFx0XHRcdHRoaXMudGFncyA9IGRhdGEudGFncztcclxuXHRcdFx0XHR0aGlzLmNhY2hlZE1hdGNoZXIgPSBbXTtcclxuXHJcblx0XHRcdFx0dGhpcy5oaWdoaWdodENsYXNzID0gZGF0YS5oaWdoaWdodENsYXNzID8/ICdlZi10YWctaGlnaGxpc2h0JztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcblx0XHRcdFx0bGV0IHRhZ3MgPSB0aGlzLmdldFRhZ3MoZGF0YSwgZWwpO1xyXG5cdFx0XHRcdHRhZ3MubWFwKHRhZyA9PiB0aGlzLnJlc2V0SGlnaGxpZ2h0KHRhZykpO1xyXG5cclxuXHRcdFx0XHRsZXQgcmVzdWx0cyA9IHRoaXMuY2FjaGVkTWF0Y2hlci5tYXAobSA9PiB7XHJcblx0XHRcdFx0XHRsZXQgciA9IHsgcG9zaXRpdmU6IG0ucG9zaXRpdmUsIGNvdW50OiAwIH07XHJcblx0XHRcdFx0XHRmb3IgKGxldCB0YWcgb2YgdGFncykge1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RyID0gdHlwZW9mIHRhZyA9PSAnc3RyaW5nJyA/IHRhZyA6IHRhZy5pbm5lclRleHQ7XHJcblx0XHRcdFx0XHRcdGxldCB2YWwgPSBtLm1hdGNoZXMoc3RyKTtcclxuXHRcdFx0XHRcdFx0aWYgKHZhbCkge1xyXG5cdFx0XHRcdFx0XHRcdHIuY291bnQrKztcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmhpZ2hsaWdodFRhZyh0YWcsIG0ucG9zaXRpdmUpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gcjtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0cy5ldmVyeShyID0+IHIucG9zaXRpdmUgPyByLmNvdW50ID4gMCA6IHIuY291bnQgPT0gMCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVzZXRIaWdobGlnaHQodGFnOiBzdHJpbmcgfCBIVE1MRWxlbWVudCkge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGFnID09ICdzdHJpbmcnKSByZXR1cm47XHJcblx0XHRcdFx0dGFnLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5oaWdoaWdodENsYXNzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRoaWdobGlnaHRUYWcodGFnOiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgcG9zaXRpdmU6IGJvb2xlYW4pIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIHRhZyA9PSAnc3RyaW5nJykgcmV0dXJuO1xyXG5cdFx0XHRcdC8vIEZJWE1FXHJcblx0XHRcdFx0dGFnLmNsYXNzTGlzdC5hZGQodGhpcy5oaWdoaWdodENsYXNzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Z2V0VGFncyhkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudFtdIHwgc3RyaW5nW10ge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpcy50YWdzID09ICdzdHJpbmcnKSByZXR1cm4gZWwucXE8SFRNTEVsZW1lbnQ+KHRoaXMudGFncyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFncyhkYXRhLCBlbCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRnZXRUYWdTdHJpbmdzKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZ1tdIHtcclxuXHRcdFx0XHRsZXQgdGFncyA9IHRoaXMuZ2V0VGFncyhkYXRhLCBlbCk7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0YWdzWzBdID09ICdzdHJpbmcnKSByZXR1cm4gdGFncyBhcyBzdHJpbmdbXTtcclxuXHRcdFx0XHRyZXR1cm4gdGFncy5tYXAoKGUpID0+IGUuaW5uZXJUZXh0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2hhbmdlKCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmxhc3RWYWx1ZSA9PSB0aGlzLmlucHV0LnZhbHVlKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy5sYXN0VmFsdWUgPSB0aGlzLmlucHV0LnZhbHVlO1xyXG5cdFx0XHRcdHRoaXMuY2FjaGVkTWF0Y2hlciA9IHRoaXMucGFyc2VNYXRjaGVyKHRoaXMubGFzdFZhbHVlKTtcclxuXHRcdFx0XHR0aGlzLnBhcmVudC5yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHBhcnNlTWF0Y2hlcihtYXRjaGVyOiBzdHJpbmcpOiBUYWdNYXRjaGVyW10ge1xyXG5cdFx0XHRcdG1hdGNoZXIudHJpbSgpO1xyXG5cdFx0XHRcdGlmICghbWF0Y2hlcikgcmV0dXJuIFtdO1xyXG5cclxuXHRcdFx0XHRpZiAobWF0Y2hlci5pbmNsdWRlcygnICcpKSB7XHJcblx0XHRcdFx0XHRsZXQgcGFydHMgPSBtYXRjaGVyLm1hdGNoKC9cIlteXCJdKlwifFxcUysvZykgfHwgW107XHJcblx0XHRcdFx0XHRyZXR1cm4gcGFydHMuZmxhdE1hcChlID0+IHRoaXMucGFyc2VNYXRjaGVyKGUpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG1hdGNoZXIuc3RhcnRzV2l0aCgnLScpKSB7XHJcblx0XHRcdFx0XHRsZXQgcGFydHMgPSB0aGlzLnBhcnNlTWF0Y2hlcihtYXRjaGVyLnNsaWNlKDEpKTtcclxuXHRcdFx0XHRcdHJldHVybiBwYXJ0cy5tYXAoZSA9PiAoeyBwb3NpdGl2ZTogIWUucG9zaXRpdmUsIG1hdGNoZXM6IGUubWF0Y2hlcyB9KSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChtYXRjaGVyLm1hdGNoKC9cIl5bXlwiXSpcIiQvKSkge1xyXG5cdFx0XHRcdFx0bWF0Y2hlciA9IG1hdGNoZXIuc2xpY2UoMSwgLTEpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIFt7IHBvc2l0aXZlOiB0cnVlLCBtYXRjaGVzOiB0YWcgPT4gdGFnID09IG1hdGNoZXIgfV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChtYXRjaGVyLmxlbmd0aCA8IDMpIHJldHVybiBbXTtcclxuXHRcdFx0XHRpZiAobWF0Y2hlci5tYXRjaCgvXCIvKT8ubGVuZ3RoID09IDEpIHJldHVybiBbXTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0bGV0IGcgPSBuZXcgUmVnRXhwKG1hdGNoZXIsICdpJyk7XHJcblx0XHRcdFx0XHRyZXR1cm4gW3sgcG9zaXRpdmU6IHRydWUsIG1hdGNoZXM6IHRhZyA9PiAhIXRhZy5tYXRjaChnKSB9XTtcclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7IH1cclxuXHRcdFx0XHRyZXR1cm4gW3sgcG9zaXRpdmU6IHRydWUsIG1hdGNoZXM6IHRhZyA9PiB0YWcuaW5jbHVkZXMobWF0Y2hlcikgfV07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFBhZ2luYXRpb25JbmZvRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IEZpbHRlcmVySXRlbVNvdXJjZSkge1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHRcdHRoaXMuaW5pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFwcGx5KCkge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFBhZ2luYXRlID0gUG9vcEpzLlBhZ2luYXRlRXh0ZW5zaW9uLlBhZ2luYXRlO1xyXG5cdFx0XHRjb3VudFBhZ2luYXRlKCkge1xyXG5cdFx0XHRcdGxldCBkYXRhID0geyBydW5uaW5nOiAwLCBxdWV1ZWQ6IDAsIH07XHJcblx0XHRcdFx0Zm9yIChsZXQgcCBvZiB0aGlzLlBhZ2luYXRlLmluc3RhbmNlcykge1xyXG5cdFx0XHRcdFx0ZGF0YS5ydW5uaW5nICs9ICtwLnJ1bm5pbmc7XHJcblx0XHRcdFx0XHRkYXRhLnF1ZXVlZCArPSBwLnF1ZXVlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHVwZGF0ZUluZm8oKSB7XHJcblx0XHRcdFx0bGV0IGRhdGEgPSB0aGlzLmNvdW50UGFnaW5hdGUoKTtcclxuXHRcdFx0XHRpZiAoIWRhdGEucnVubmluZyAmJiAhZGF0YS5xdWV1ZWQpIHtcclxuXHRcdFx0XHRcdHRoaXMuaGlkZGVuIHx8IHRoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmhpZGRlbiAmJiB0aGlzLnNob3coKTtcclxuXHRcdFx0XHRcdGxldCB0ZXh0ID0gYC4uLiArJHtkYXRhLnJ1bm5pbmcgKyBkYXRhLnF1ZXVlZH1gO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuYnV0dG9uLmlubmVySFRNTCAhPSB0ZXh0KSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuYnV0dG9uLmlubmVyVGV4dCA9IHRleHQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhc3luYyBpbml0KCkge1xyXG5cdFx0XHRcdHdoaWxlICh0cnVlKSB7XHJcblx0XHRcdFx0XHRhd2FpdCBQcm9taXNlLmZyYW1lKCk7XHJcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZUluZm8oKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fVxyXG59XHJcbiIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRW50cnlGaWx0ZXJlckV4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIE1vZGlmaWVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSU1vZGlmaWVyPERhdGE+IHtcclxuXHRcdFx0ZGVjbGFyZSBtb2RpZmllcjogTW9kaWZpZXJGbjxEYXRhPjtcclxuXHRcdFx0ZGVjbGFyZSBydW5Pbk5vQ2hhbmdlPzogYm9vbGVhbjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IE1vZGlmaWVyU291cmNlPERhdGE+KSB7XHJcblx0XHRcdFx0ZGF0YS5idXR0b24gPz89ICdidXR0b24uZWYtaXRlbS5lZi1tb2RpZmllcltlZi1tb2RlPVwib2ZmXCJdJztcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dG9nZ2xlTW9kZShtb2RlOiBNb2RlLCBmb3JjZSA9IGZhbHNlKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSBtb2RlICYmICFmb3JjZSkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMucGFyZW50Lm1vdmVUb1RvcCh0aGlzKTtcclxuXHRcdFx0XHRzdXBlci50b2dnbGVNb2RlKG1vZGUsIGZvcmNlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSB7XHJcblx0XHRcdFx0bGV0IG9sZE1vZGU6IE1vZGUgfCBudWxsID0gZWwuZ2V0QXR0cmlidXRlKGBlZi1tb2RpZmllci0ke3RoaXMuaWR9LW1vZGVgKSBhcyAoTW9kZSB8IG51bGwpO1xyXG5cdFx0XHRcdGlmIChvbGRNb2RlID09IHRoaXMubW9kZSAmJiAhdGhpcy5ydW5Pbk5vQ2hhbmdlKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy5tb2RpZmllcihkYXRhLCBlbCwgdGhpcy5tb2RlLCBudWxsKTtcclxuXHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoYGVmLW1vZGlmaWVyLSR7dGhpcy5pZH0tbW9kZWAsIHRoaXMubW9kZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgY2xhc3MgUHJlZml4ZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4gaW1wbGVtZW50cyBJTW9kaWZpZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIHRhcmdldDogc2VsZWN0b3IgfCAoKGU6IEhUTUxFbGVtZW50LCBkYXRhOiBEYXRhLCBtb2RlOiBNb2RlKSA9PiAoSFRNTEVsZW1lbnQgfCBIVE1MRWxlbWVudFtdKSk7XHJcblx0XHRcdGRlY2xhcmUgcHJlZml4PzogKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSkgPT4gc3RyaW5nO1xyXG5cdFx0XHRkZWNsYXJlIHBvc3RmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50LCBtb2RlOiBNb2RlKSA9PiBzdHJpbmc7XHJcblx0XHRcdGRlY2xhcmUgcHJlZml4QXR0cmlidXRlOiBzdHJpbmc7XHJcblx0XHRcdGRlY2xhcmUgcG9zdGZpeEF0dHJpYnV0ZTogc3RyaW5nO1xyXG5cdFx0XHRkZWNsYXJlIGFsbDogYm9vbGVhbjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IFByZWZpeGVyU291cmNlPERhdGE+KSB7XHJcblx0XHRcdFx0ZGF0YS5idXR0b24gPz89ICdidXR0b24uZWYtaXRlbS5lZi1tb2RpZmllcltlZi1tb2RlPVwib2ZmXCJdJztcclxuXHRcdFx0XHRkYXRhLnRhcmdldCA/Pz0gZSA9PiBlO1xyXG5cdFx0XHRcdGRhdGEucHJlZml4QXR0cmlidXRlID8/PSAnZWYtcHJlZml4JztcclxuXHRcdFx0XHRkYXRhLnBvc3RmaXhBdHRyaWJ1dGUgPz89ICdlZi1wb3N0Zml4JztcclxuXHRcdFx0XHRkYXRhLmFsbCA/Pz0gZmFsc2U7XHJcblx0XHRcdFx0c3VwZXIoZGF0YSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkge1xyXG5cdFx0XHRcdGxldCB0YXJnZXRzID0gdGhpcy5nZXRUYXJnZXRzKGVsLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAodGhpcy5wcmVmaXgpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29mZicpIHtcclxuXHRcdFx0XHRcdFx0dGFyZ2V0cy5tYXAoZSA9PiBlLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLnByZWZpeEF0dHJpYnV0ZSkpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gdGhpcy5wcmVmaXgoZGF0YSwgZWwsIHRoaXMubW9kZSk7XHJcblx0XHRcdFx0XHRcdHRhcmdldHMubWFwKGUgPT4gZS5zZXRBdHRyaWJ1dGUodGhpcy5wcmVmaXhBdHRyaWJ1dGUsIHZhbHVlKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLnBvc3RmaXgpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29mZicpIHtcclxuXHRcdFx0XHRcdFx0dGFyZ2V0cy5tYXAoZSA9PiBlLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLnBvc3RmaXhBdHRyaWJ1dGUpKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGxldCB2YWx1ZSA9IHRoaXMucG9zdGZpeChkYXRhLCBlbCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0XHRcdFx0dGFyZ2V0cy5tYXAoZSA9PiBlLnNldEF0dHJpYnV0ZSh0aGlzLnBvc3RmaXhBdHRyaWJ1dGUsIHZhbHVlKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRnZXRUYXJnZXRzKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogRGF0YSk6IEhUTUxFbGVtZW50W10ge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpcy50YXJnZXQgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmFsbCkgcmV0dXJuIGVsLnFxKHRoaXMudGFyZ2V0KTtcclxuXHRcdFx0XHRcdHJldHVybiBbZWwucSh0aGlzLnRhcmdldCldO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsZXQgdGFyZ2V0cyA9IHRoaXMudGFyZ2V0KGVsLCBkYXRhLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIEFycmF5LmlzQXJyYXkodGFyZ2V0cykgPyB0YXJnZXRzIDogW3RhcmdldHNdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIEVudHJ5RmlsdGVyZXJFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBTb3J0ZXI8RGF0YSwgViBleHRlbmRzIG51bWJlciB8IHN0cmluZz4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4gaW1wbGVtZW50cyBJU29ydGVyPERhdGE+IHtcclxuXHRcdFx0ZGVjbGFyZSBzb3J0ZXI6IFNvcnRlckZuPERhdGEsIFY+O1xyXG5cdFx0XHRkZWNsYXJlIGNvbXBhcmF0b3I6IChhOiBWLCBiOiBWKSA9PiBudW1iZXI7XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBTb3J0ZXJTb3VyY2U8RGF0YSwgVj4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLXNvcnRlcltlZi1tb2RlPVwib2ZmXCJdJztcclxuXHRcdFx0XHRkYXRhLmNvbXBhcmF0b3IgPz89IChhOiBWLCBiOiBWKSA9PiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDtcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dG9nZ2xlTW9kZShtb2RlOiBNb2RlLCBmb3JjZSA9IGZhbHNlKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSBtb2RlICYmICFmb3JjZSkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMucGFyZW50Lm1vdmVUb1RvcCh0aGlzKTtcclxuXHRcdFx0XHRzdXBlci50b2dnbGVNb2RlKG1vZGUsIGZvcmNlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c29ydChsaXN0OiBbRGF0YSwgSFRNTEVsZW1lbnRdW10pOiBbRGF0YSwgSFRNTEVsZW1lbnRdW10ge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29mZicpIHJldHVybiBsaXN0O1xyXG5cdFx0XHRcdHJldHVybiBsaXN0LnZzb3J0KChbZGF0YSwgZWxdOiBbRGF0YSwgSFRNTEVsZW1lbnRdKSA9PiB0aGlzLmFwcGx5KGRhdGEsIGVsKSwgKGE6IFYsIGI6IFYpID0+IHRoaXMuY29tcGFyZShhLCBiKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qKiByZXR1cm5zIG9yZGVyIG9mIGVudHJ5ICovXHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IFYge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnNvcnRlcihkYXRhLCBlbCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29tcGFyZShhOiBWLCBiOiBWKTogbnVtYmVyIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvbicpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbXBhcmF0b3IoYSwgYik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29wcG9zaXRlJykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29tcGFyYXRvcihiLCBhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fVxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRW50cnlGaWx0ZXJlckV4dGVuc2lvbiB7XHJcblx0XHRleHBvcnQgdHlwZSBXYXluZXNzID0gZmFsc2UgfCB0cnVlIHwgJ2Rpcic7XHJcblx0XHRleHBvcnQgdHlwZSBNb2RlID0gJ29mZicgfCAnb24nIHwgJ29wcG9zaXRlJztcclxuXHJcblx0XHRleHBvcnQgdHlwZSBQYXJzZXJGbjxEYXRhPiA9IChlbDogSFRNTEVsZW1lbnQsIGRhdGE6IFBhcnRpYWw8RGF0YT4pID0+IFBhcnRpYWw8RGF0YT4gfCB2b2lkIHwgUHJvbWlzZUxpa2U8UGFydGlhbDxEYXRhIHwgdm9pZD4+O1xyXG5cdFx0ZXhwb3J0IHR5cGUgRmlsdGVyRm48RGF0YT4gPSAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50LCBtb2RlOiBNb2RlKSA9PiBib29sZWFuO1xyXG5cdFx0ZXhwb3J0IHR5cGUgU29ydGVyRm48RGF0YSwgVj4gPSAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50LCBtb2RlOiBNb2RlKSA9PiBWO1xyXG5cdFx0ZXhwb3J0IHR5cGUgTW9kaWZpZXJGbjxEYXRhPiA9IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUsIG9sZE1vZGU6IE1vZGUgfCBudWxsKSA9PiB2b2lkO1xyXG5cdFx0ZXhwb3J0IHR5cGUgVmFsdWVGaWx0ZXJGbjxEYXRhLCBWPiA9ICh2YWx1ZTogViwgZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBib29sZWFuO1xyXG5cdFx0ZXhwb3J0IHR5cGUgUHJlZml4ZXJGbjxEYXRhPiA9IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUpID0+IHN0cmluZztcclxuXHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIElGaWx0ZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4ge1xyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBJU29ydGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IHtcclxuXHRcdFx0c29ydChsaXN0OiBbRGF0YSwgSFRNTEVsZW1lbnRdW10pOiBbRGF0YSwgSFRNTEVsZW1lbnRdW107XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIElNb2RpZmllcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiB7XHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBGaWx0ZXJlckl0ZW1Tb3VyY2Uge1xyXG5cdFx0XHRidXR0b24/OiBzZWxlY3RvcjtcclxuXHRcdFx0aWQ6IHN0cmluZztcclxuXHRcdFx0bmFtZT86IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcblx0XHRcdHRocmVlV2F5PzogV2F5bmVzcztcclxuXHRcdFx0bW9kZT86IE1vZGU7XHJcblx0XHRcdHBhcmVudDogRW50cnlGaWx0ZXJlcjtcclxuXHRcdFx0aW5jb21wYXRpYmxlPzogc3RyaW5nW107XHJcblx0XHRcdGhpZGRlbj86IGJvb2xlYW47XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIEZpbHRlclNvdXJjZTxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdGZpbHRlcjogRmlsdGVyRm48RGF0YT47XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFZhbHVlRmlsdGVyU291cmNlPERhdGEsIFY+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0ZmlsdGVyOiBWYWx1ZUZpbHRlckZuPERhdGEsIFY+O1xyXG5cdFx0XHRpbnB1dDogVjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgTWF0Y2hGaWx0ZXJTb3VyY2U8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1Tb3VyY2Uge1xyXG5cdFx0XHR2YWx1ZT86IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IHN0cmluZztcclxuXHRcdFx0aW5wdXQ/OiBzdHJpbmc7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFNvcnRlclNvdXJjZTxEYXRhLCBWPiBleHRlbmRzIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdHNvcnRlcjogU29ydGVyRm48RGF0YSwgVj47XHJcblx0XHRcdGNvbXBhcmF0b3I/OiAoKGE6IFYsIGI6IFYpID0+IG51bWJlcikgfCBWO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBNb2RpZmllclNvdXJjZTxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdG1vZGlmaWVyOiBNb2RpZmllckZuPERhdGE+O1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBQcmVmaXhlclNvdXJjZTxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdHRhcmdldD86IHNlbGVjdG9yIHwgKChlbDogSFRNTEVsZW1lbnQsIGRhdGE6IERhdGEsIG1vZGU6IE1vZGUpID0+IEhUTUxFbGVtZW50KTtcclxuXHRcdFx0cHJlZml4PzogKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkgPT4gc3RyaW5nO1xyXG5cdFx0XHRwb3N0Zml4PzogKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkgPT4gc3RyaW5nO1xyXG5cdFx0XHRwcmVmaXhBdHRyaWJ1dGU/OiBzdHJpbmc7XHJcblx0XHRcdHBvc3RmaXhBdHRyaWJ1dGU/OiBzdHJpbmc7XHJcblx0XHRcdGFsbD86IGJvb2xlYW47XHJcblx0XHR9XHJcblxyXG5cdFx0XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIEZpbHRlcmVySXRlbVBhcnRpYWwge1xyXG5cdFx0XHRidXR0b24/OiBzZWxlY3RvcjtcclxuXHRcdFx0aWQ/OiBzdHJpbmc7XHJcblx0XHRcdG5hbWU/OiBzdHJpbmc7XHJcblx0XHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG5cdFx0XHR0aHJlZVdheT86IFdheW5lc3M7XHJcblx0XHRcdG1vZGU/OiBNb2RlO1xyXG5cdFx0XHRpbmNvbXBhdGlibGU/OiBzdHJpbmdbXTtcclxuXHRcdFx0aGlkZGVuPzogYm9vbGVhbjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyUGFydGlhbDxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVBhcnRpYWwgeyB9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFZhbHVlRmlsdGVyUGFydGlhbDxEYXRhLCBWPiBleHRlbmRzIEZpbHRlcmVySXRlbVBhcnRpYWwge1xyXG5cdFx0XHRpbnB1dDogVjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgU29ydGVyUGFydGlhbFNvdXJjZTxEYXRhLCBWPiBleHRlbmRzIEZpbHRlcmVySXRlbVBhcnRpYWwge1xyXG5cdFx0XHRjb21wYXJhdG9yPzogKChhOiBWLCBiOiBWKSA9PiBudW1iZXIpIHwgVjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgTW9kaWZpZXJQYXJ0aWFsPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCB7IH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgUHJlZml4ZXJQYXJ0aWFsPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCB7XHJcblx0XHRcdHRhcmdldD86IHNlbGVjdG9yIHwgKChlbDogSFRNTEVsZW1lbnQsIGRhdGE6IERhdGEsIG1vZGU6IE1vZGUpID0+IEhUTUxFbGVtZW50KTtcclxuXHRcdFx0cHJlZml4PzogKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkgPT4gc3RyaW5nO1xyXG5cdFx0XHRwb3N0Zml4PzogKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkgPT4gc3RyaW5nO1xyXG5cdFx0XHRwcmVmaXhBdHRyaWJ1dGU/OiBzdHJpbmc7XHJcblx0XHRcdHBvc3RmaXhBdHRyaWJ1dGU/OiBzdHJpbmc7XHJcblx0XHRcdGFsbD86IGJvb2xlYW47XHJcblx0XHR9XHJcblxyXG5cdFx0dHlwZSBVbmlvbjxTb3VyY2UsIFJlc3VsdD4gPSB7XHJcblx0XHRcdFtQIGluIGtleW9mIFNvdXJjZSAmIGtleW9mIFJlc3VsdF06IFNvdXJjZVtQXSB8IFJlc3VsdFtQXTtcclxuXHRcdH0gJiBPbWl0PFNvdXJjZSwga2V5b2YgUmVzdWx0PiAmIE9taXQ8UmVzdWx0LCBrZXlvZiBTb3VyY2U+O1xyXG5cclxuXHRcdHR5cGUgT3ZlcnJpZGU8VCwgTz4gPSBPbWl0PFQsIGtleW9mIE8+ICYgTztcclxuXHJcblx0XHR0eXBlIEVGU291cmNlPFQgZXh0ZW5kcyB7IHNvdXJjZTogYW55IH0+ID0gT3ZlcnJpZGU8T3ZlcnJpZGU8UGFydGlhbDxUPiwgVFsnc291cmNlJ10+LCB7IGJ1dHRvbj86IHNlbGVjdG9yIH0+O1xyXG5cclxuXHRcdHR5cGUgU291cmNlPFQgZXh0ZW5kcyB7IHNvdXJjZTogYW55IH0+ID0gVFsnc291cmNlJ10gJiB7XHJcblx0XHRcdGlkPzogc3RyaW5nOyBuYW1lPzogc3RyaW5nOyBkZXNjcmlwdGlvbj86IHN0cmluZztcclxuXHRcdFx0dGhyZWVXYXk/OiBXYXluZXNzOyBtb2RlPzogTW9kZTsgaW5jb21wYXRpYmxlPzogc3RyaW5nW107IGhpZGRlbj86IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIGNhbiBiZSBlaXRoZXIgTWFwIG9yIFdlYWtNYXBcclxuXHRcdCAqIChXZWFrTWFwIGlzIGxpa2VseSB0byBiZSB1c2VsZXNzIGlmIHRoZXJlIGFyZSBsZXNzIHRoZW4gMTBrIG9sZCBub2RlcyBpbiBtYXApXHJcblx0XHQgKi9cclxuXHRcdGxldCBNYXBUeXBlID0gTWFwO1xyXG5cdFx0dHlwZSBNYXBUeXBlPEsgZXh0ZW5kcyBvYmplY3QsIFY+ID0vLyBNYXA8SywgVj4gfCBcclxuXHRcdFx0V2Vha01hcDxLLCBWPjtcclxuXHR9XHJcblxyXG5cdGV4cG9ydCBsZXQgRUYgPSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uLkVudHJ5RmlsdGVyZXI7XHJcbn0iLCIiXX0=