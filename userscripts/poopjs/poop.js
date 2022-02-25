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
        function at(index) {
            return index >= 0 ? this[index] : this[this.length + index];
        }
        ArrayExtension.at = at;
        function findLast(predicate, thisArg) {
            for (let i = this.length - 1; i; i--) {
                if (predicate(this[i], i, this))
                    return this[i];
            }
        }
        ArrayExtension.findLast = findLast;
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
        if (![].at)
            PoopJs.ObjectExtension.defineValue(window.Array.prototype, 'at', PoopJs.ArrayExtension.at);
        if (![].findLast)
            PoopJs.ObjectExtension.defineValue(window.Array.prototype, 'findLast', PoopJs.ArrayExtension.findLast);
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
var PoopJs;
(function (PoopJs) {
    class ScrollInfo {
        el;
        /** absolute rect */
        rect;
        constructor(el) {
            this.el = el;
            let rect = el.getBoundingClientRect();
            function n(v) { return +v.toFixed(3); }
            this.rect = new DOMRect(n(rect.x / innerWidth), n((rect.y + scrollY) / innerHeight), n(rect.width / innerWidth), n(rect.height / innerHeight));
        }
        topOffset(scrollY = window.scrollY) {
            let windowY = scrollY / innerHeight;
            let offset = this.rect.top - windowY;
            return +offset.toFixed(3);
        }
        centerOffset(scrollY = window.scrollY) {
            let windowY = scrollY / innerHeight + 0.5;
            let offset = this.rect.top + this.rect.height / 2 - windowY;
            return +offset.toFixed(3);
        }
        bottomOffset(scrollY = window.scrollY) {
            let windowY = scrollY / innerHeight + 1;
            let offset = this.rect.bottom - windowY;
            return +offset.toFixed(3);
        }
        distanceFromScreen(scrollY = window.scrollY) {
            let windowY = scrollY / innerHeight;
            if (this.rect.bottom < windowY - 0.0001)
                return this.rect.bottom - windowY;
            if (this.rect.top > windowY + 1.001)
                return this.rect.top - windowY - 1;
        }
        get fullDir() {
            if (this.topOffset() < -0.001)
                return -1;
            if (this.bottomOffset() > 0.001)
                return 1;
            return 0;
        }
        get _offsets() {
            return [this.topOffset(), this.centerOffset(), this.bottomOffset()];
        }
    }
    PoopJs.ScrollInfo = ScrollInfo;
    class ImageScroller {
        selector = 'img';
        enabled = false;
        listener;
        stopPropagation = false;
        constructor(selector = '') {
            if (selector)
                this.selector = selector;
        }
        _wheelListener;
        bindWheel() {
            if (this._wheelListener)
                return;
            let l = this._wheelListener = (event) => {
                if (this._wheelListener != l)
                    return removeEventListener('wheel', l);
                if (!this.enabled)
                    return;
                if (!event.deltaY)
                    return;
                if (event.shiftKey || event.ctrlKey)
                    return;
                if (this.scroll(Math.sign(event.deltaY))) {
                    event.preventDefault();
                    this.stopPropagation && event.stopImmediatePropagation();
                }
            };
            addEventListener('wheel', this._wheelListener, { passive: false });
        }
        _arrowListener;
        bindArrows() {
            if (this._arrowListener)
                return;
            this._arrowListener = (event) => {
                if (!this.enabled)
                    return;
                if (event.code == 'ArrowLeft') {
                    if (this.scroll(-1)) {
                        event.preventDefault();
                        this.stopPropagation && event.stopImmediatePropagation();
                    }
                }
                if (event.code == 'ArrowRight') {
                    if (this.scroll(1)) {
                        event.preventDefault();
                        this.stopPropagation && event.stopImmediatePropagation();
                    }
                }
            };
            addEventListener('keydown', this._arrowListener, { capture: true });
        }
        /** enable this scroller */
        on(selector = '') {
            if (selector)
                this.selector = selector;
            this.enabled = true;
            this.bindArrows();
            this.bindWheel();
        }
        /** disable this scroller */
        off(selector = '') {
            if (selector)
                this.selector = selector;
            this.enabled = false;
            return this;
        }
        mode = 'group';
        /** scroll to the next item */
        scroll(dir) {
            if (this.mode == 'group') {
                return this.scrollToNextGroup(dir);
            }
            if (this.mode == 'single') {
                return this.scrollToNextCenter(dir);
            }
        }
        scrollToNextCenter(dir) {
            let next = this._nextScrollTarget(dir, 'single');
            if (PoopJs.debug) {
                console.log(`scroll: `, next);
            }
            if (!next)
                return false;
            next.el.scrollIntoView({ block: 'center' });
            return true;
        }
        scrollToNextGroup(dir) {
            let next = this._nextScrollTarget(dir, 'group');
            if (PoopJs.debug) {
                console.log(`scroll: `, next);
            }
            if (!next || !next.length)
                return false;
            let y = (next[0].rect.top + next.at(-1).rect.bottom - 1) / 2;
            // fixme
            if (Math.abs(scrollY / innerHeight - y) > 0.750) {
                if (!this.getAllScrolls().find(e => e.fullDir == 0)) {
                    if (PoopJs.debug) {
                        console.log(`scroll too far`, next);
                    }
                    return false;
                }
            }
            scrollTo(0, y * innerHeight);
            return true;
        }
        _nextScrollTarget(dir, mode) {
            let scrolls = this.getAllScrolls();
            if (mode == 'single') {
                if (dir == -1) {
                    return scrolls.findLast(e => e.fullDir == -1);
                }
                if (dir == 0) {
                    let list = scrolls.filter(e => e.fullDir == 0);
                    return list[~~(list.length / 2)];
                }
                if (dir == 1) {
                    return scrolls.find(e => e.fullDir == 1);
                }
            }
            if (mode == 'group') {
                if (dir == -1) {
                    let last = scrolls.findLast(e => e.fullDir == -1);
                    if (!last)
                        return;
                    return scrolls.filter(e => Math.abs(e.rect.top - last.rect.bottom) <= 1.001 && e.fullDir == -1);
                }
                if (dir == 0) {
                    return scrolls.filter(e => e.fullDir == 0);
                }
                if (dir == 1) {
                    let last = scrolls.find(e => e.fullDir == 1);
                    if (!last)
                        return;
                    return last && scrolls.filter(e => Math.abs(last.rect.top - e.rect.bottom) <= 1.001 && e.fullDir == 1);
                }
            }
        }
        getAllScrolls() {
            return qq(this.selector).map(e => new ScrollInfo(e)).vsort(e => e.centerOffset());
        }
        /** used  */
        async keep(resizer, raf = false) {
            let pos = this.save();
            await resizer();
            pos.restore();
            if (raf) {
                await Promise.frame();
                pos.restore();
            }
        }
        /** save current item scroll position */
        save() {
            let scrolls = this.getAllScrolls();
            let info = scrolls.vsort(e => Math.abs(e.centerOffset()))[0];
            let offset = info.centerOffset();
            function restore() {
                let newInfo = new ScrollInfo(info.el);
                let newOffset = newInfo.centerOffset();
                scrollTo(0, scrollY + (newOffset - offset) * innerHeight);
            }
            return { info, offset, restore };
        }
        static createDefault() {
            return new ImageScroller();
        }
    }
    PoopJs.ImageScroller = ImageScroller;
    defineLazy(PoopJs, 'is', () => ImageScroller.createDefault());
    function defineLazy(target, prop, get) {
        Object.defineProperty(target, prop, {
            get: () => {
                Object.defineProperty(target, prop, {
                    value: get(),
                    configurable: true,
                    writable: true,
                });
                return target[prop];
            },
            set(v) {
                Object.defineProperty(target, prop, {
                    value: v,
                    configurable: true,
                    writable: true,
                });
                return target[prop];
            },
            configurable: true,
        });
    }
})(PoopJs || (PoopJs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3Bvb3Bqcy9Qcm9taXNlLnRzIiwiLi4vcG9vcGpzL0FycmF5LnRzIiwiLi4vcG9vcGpzL0RhdGVOb3dIYWNrLnRzIiwiLi4vcG9vcGpzL09iamVjdC50cyIsIi4uL3Bvb3Bqcy9lbGVtZW50LnRzIiwiLi4vcG9vcGpzL2VsbS50cyIsIi4uL3Bvb3Bqcy9ldGMudHMiLCIuLi9wb29wanMvZmV0Y2gudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvRW50aXR5RmlsdGVyZXIudHMiLCIuLi9wb29wanMvb2JzZXJ2ZXIudHMiLCIuLi9wb29wanMvUGFnaW5hdGUvUGFnaW5hdGlvbi50cyIsIi4uL3Bvb3Bqcy9QYWdpbmF0ZS9JbWFnZVNjcm9sbGluZy50cyIsIi4uL3Bvb3Bqcy9pbml0LnRzIiwiLi4vcG9vcGpzL3R5cGVzLnRzIiwiLi4vcG9vcGpzL0ZpbHRlcmVyL0ZpbHRlcmVySXRlbS50cyIsIi4uL3Bvb3Bqcy9GaWx0ZXJlci9GaWx0ZXIudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvTW9kaWZpZXIudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvU29ydGVyLnRzIiwiLi4vcG9vcGpzL0ZpbHRlcmVyL3R5cGVzLnRzIiwiLi4vcG9vcGpzL1BhZ2luYXRlL0ltYWdlU2Nyb2xsaW5nMi50cyIsIi4uL3Bvb3Bqcy9QYWdpbmF0ZS9tb2RpZmljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxNQUFNLENBdUNmO0FBdkNELFdBQVUsTUFBTTtJQWNmLElBQWlCLGdCQUFnQixDQXVCaEM7SUF2QkQsV0FBaUIsZ0JBQWdCO1FBRWhDOztXQUVHO1FBQ0gsU0FBZ0IsS0FBSztZQUNwQixJQUFJLE9BQTJCLENBQUM7WUFDaEMsSUFBSSxNQUE4QixDQUFDO1lBQ25DLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFB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SUFBSTtvQkFDbEIsUUFBUSxFQUFFLElBQUk7aUJBQ2QsQ0FBQyxDQUFDO2dCQUNILE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLENBQUM7WUFDRCxZQUFZLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7SUFDSixDQUFDO0FBR0YsQ0FBQyxFQTdQUyxNQUFNLEtBQU4sTUFBTSxRQTZQZiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIFVud3JhcHBlZFByb21pc2U8VCA9IHZvaWQ+IGV4dGVuZHMgUHJvbWlzZTxUPiB7XHJcblx0XHRyZXNvbHZlKHZhbHVlOiBUIHwgUHJvbWlzZUxpa2U8VD4pOiB2b2lkO1xyXG5cdFx0cmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xyXG5cclxuXHRcdHIodmFsdWUpXHJcblx0XHRyKHZhbHVlOiBUIHwgUHJvbWlzZUxpa2U8VD4pOiB2b2lkO1xyXG5cdFx0ajogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcclxuXHJcblx0XHQvLyBQcm9taXNlU3RhdGU6ICdwZW5kaW5nJyB8ICdmdWxmaWxsZWQnIHwgJ3JlamVjdGVkJztcclxuXHRcdC8vIFByb21pc2VSZXN1bHQ/OiBUIHwgRXJyb3I7XHJcblx0fVxyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIFByb21pc2VFeHRlbnNpb24ge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ3JlYXRlcyB1bndyYXBwZWQgcHJvbWlzZVxyXG5cdFx0ICovXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZW1wdHk8VCA9IHZvaWQ+KCk6IFVud3JhcHBlZFByb21pc2U8VD4ge1xyXG5cdFx0XHRsZXQgcmVzb2x2ZTogKHZhbHVlOiBUKSA9PiB2b2lkO1xyXG5cdFx0XHRsZXQgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xyXG5cdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgUHJvbWlzZTxUPigociwgaikgPT4ge1xyXG5cdFx0XHRcdHJlc29sdmUgPSByO1xyXG5cdFx0XHRcdHJlamVjdCA9IGo7XHJcblx0XHRcdH0pLCB7XHJcblx0XHRcdFx0cmVzb2x2ZSwgcmVqZWN0LFxyXG5cdFx0XHRcdHI6IHJlc29sdmUsIGo6IHJlamVjdCxcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZyYW1lKG4gPSAxKTogUHJvbWlzZTxudW1iZXI+IHtcclxuXHRcdFx0d2hpbGUgKC0tbiA+IDApIHtcclxuXHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vUHJvbWlzZS50c1wiIC8+XHJcbm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBuYW1lc3BhY2UgQXJyYXlFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBwbWFwPFQsIFY+KHRoaXM6IFRbXSwgbWFwcGVyOiAoZTogVCwgaTogbnVtYmVyLCBhOiBUW10pID0+IFByb21pc2U8Vj4gfCBWLCB0aHJlYWRzID0gNSk6IFByb21pc2U8VltdPiB7XHJcblx0XHRcdGlmICghKHRocmVhZHMgPiAwKSkgdGhyb3cgbmV3IEVycm9yKCk7XHJcblx0XHRcdGxldCB0YXNrczogW1QsIG51bWJlciwgVFtdXVtdID0gdGhpcy5tYXAoKGUsIGksIGEpID0+IFtlLCBpLCBhXSk7XHJcblx0XHRcdGxldCByZXN1bHRzID0gQXJyYXk8Vj4odGFza3MubGVuZ3RoKTtcclxuXHRcdFx0bGV0IGFueVJlc29sdmVkID0gUHJvbWlzZUV4dGVuc2lvbi5lbXB0eSgpO1xyXG5cdFx0XHRsZXQgZnJlZVRocmVhZHMgPSB0aHJlYWRzO1xyXG5cdFx0XHRhc3luYyBmdW5jdGlvbiBydW5UYXNrKHRhc2s6IFtULCBudW1iZXIsIFRbXV0pOiBQcm9taXNlPFY+IHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IG1hcHBlciguLi50YXNrKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdHJldHVybiBlcnI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFzeW5jIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XHJcblx0XHRcdFx0ZnJlZVRocmVhZHMtLTtcclxuXHRcdFx0XHRyZXN1bHRzW3Rhc2tbMV1dID0gYXdhaXQgcnVuVGFzayh0YXNrKTtcclxuXHRcdFx0XHRmcmVlVGhyZWFkcysrO1xyXG5cdFx0XHRcdGxldCBvbGRBbnlSZXNvbHZlZCA9IGFueVJlc29sdmVkO1xyXG5cdFx0XHRcdGFueVJlc29sdmVkID0gUHJvbWlzZUV4dGVuc2lvbi5lbXB0eSgpO1xyXG5cdFx0XHRcdG9sZEFueVJlc29sdmVkLnIodW5kZWZpbmVkKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCB0YXNrIG9mIHRhc2tzKSB7XHJcblx0XHRcdFx0aWYgKGZyZWVUaHJlYWRzID09IDApIHtcclxuXHRcdFx0XHRcdGF3YWl0IGFueVJlc29sdmVkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRydW4odGFzayk7XHJcblx0XHRcdH1cclxuXHRcdFx0d2hpbGUgKGZyZWVUaHJlYWRzIDwgdGhyZWFkcykge1xyXG5cdFx0XHRcdGF3YWl0IGFueVJlc29sdmVkO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiByZXN1bHRzO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBtYXA8VCA9IG51bWJlcj4odGhpczogQXJyYXlDb25zdHJ1Y3RvciwgbGVuZ3RoOiBudW1iZXIsIG1hcHBlcjogKG51bWJlcikgPT4gVCA9IGkgPT4gaSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcyhsZW5ndGgpLmZpbGwoMCkubWFwKChlLCBpLCBhKSA9PiBtYXBwZXIoaSkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiB2c29ydDxUPih0aGlzOiBUW10sIG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgYTogVFtdKSA9PiBudW1iZXIsIHNvcnRlcj86ICgoYTogbnVtYmVyLCBiOiBudW1iZXIsIGFlOiBULCBiZTogVCkgPT4gbnVtYmVyKSB8IC0xKTogVFtdO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHZzb3J0PFQsIFY+KHRoaXM6IFRbXSwgbWFwcGVyOiAoZTogVCwgaTogbnVtYmVyLCBhOiBUW10pID0+IFYsIHNvcnRlcjogKChhOiBWLCBiOiBWLCBhZTogVCwgYmU6IFQpID0+IG51bWJlcikgfCAtMSk6IFRbXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiB2c29ydDxUPih0aGlzOiBUW10sIG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgYTogVFtdKSA9PiBudW1iZXIsIHNvcnRlcjogKChhOiBudW1iZXIsIGI6IG51bWJlciwgYWU6IFQsIGJlOiBUKSA9PiBudW1iZXIpIHwgLTEgPSAoYSwgYikgPT4gYSAtIGIpOiBUW10ge1xyXG5cdFx0XHRsZXQgdGhlU29ydGVyID0gdHlwZW9mIHNvcnRlciA9PSAnZnVuY3Rpb24nID8gc29ydGVyIDogKGEsIGIpID0+IGIgLSBhO1xyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0XHRcdC5tYXAoKGUsIGksIGEpID0+ICh7IGUsIHY6IG1hcHBlcihlLCBpLCBhKSB9KSlcclxuXHRcdFx0XHQuc29ydCgoYSwgYikgPT4gdGhlU29ydGVyKGEudiwgYi52LCBhLmUsIGIuZSkpXHJcblx0XHRcdFx0Lm1hcChlID0+IGUuZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGF0PFQ+KHRoaXM6IFRbXSwgaW5kZXg6IG51bWJlcik6IFQge1xyXG5cdFx0XHRyZXR1cm4gaW5kZXggPj0gMCA/IHRoaXNbaW5kZXhdIDogdGhpc1t0aGlzLmxlbmd0aCArIGluZGV4XTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZmluZExhc3Q8VCwgUyBleHRlbmRzIFQ+KHRoaXM6IFRbXSwgcHJlZGljYXRlOiAodGhpczogdm9pZCwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIG9iajogVFtdKSA9PiB2YWx1ZSBpcyBTLCB0aGlzQXJnPzogYW55KTogUyB8IHVuZGVmaW5lZDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBmaW5kTGFzdDxUPihwcmVkaWNhdGU6ICh0aGlzOiBUW10sIHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBvYmo6IFRbXSkgPT4gdW5rbm93biwgdGhpc0FyZz86IGFueSk6IFQgfCB1bmRlZmluZWQ7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZmluZExhc3Q8VCwgUyBleHRlbmRzIFQ+KHRoaXM6IFRbXSwgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIG9iajogVFtdKSA9PiB1bmtub3duLCB0aGlzQXJnPzogYW55KTogVCB8IFMgfCB1bmRlZmluZWQge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gdGhpcy5sZW5ndGggLSAxOyBpOyBpLS0pIHtcclxuXHRcdFx0XHRpZiAocHJlZGljYXRlKHRoaXNbaV0sIGksIHRoaXMpKSByZXR1cm4gdGhpc1tpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRleHBvcnQgY2xhc3MgUE1hcDxULCBWLCBFID0gbmV2ZXI+IHtcclxuXHRcdFx0LyoqIE9yaWdpbmFsIGFycmF5ICovXHJcblx0XHRcdHNvdXJjZTogVFtdID0gW107XHJcblx0XHRcdC8qKiBBc3luYyBlbGVtZW50IGNvbnZlcnRlciBmdW5jdGlvbiAqL1xyXG5cdFx0XHRtYXBwZXI6IChlOiBULCBpOiBudW1iZXIsIGE6IFRbXSwgcG1hcDogUE1hcDxULCBWLCBFPikgPT4gUHJvbWlzZTxWIHwgRT4gPSAoZTogVCkgPT4gZSBhcyBhbnkgYXMgUHJvbWlzZTxWPjtcclxuXHRcdFx0LyoqIE1heCBudW1iZXIgb2YgcmVxdWVzdHMgYXQgb25jZS4gICBcclxuXHRcdFx0ICogICpNYXkqIGJlIGNoYW5nZWQgaW4gcnVudGltZSAqL1xyXG5cdFx0XHR0aHJlYWRzOiBudW1iZXIgPSA1O1xyXG5cdFx0XHQvKiogTWF4IGRpc3RhbmNlIGJldHdlZW4gdGhlIG9sZGVycyBpbmNvbXBsZXRlIGFuZCBuZXdlc3QgYWN0aXZlIGVsZW1lbnRzLiAgIFxyXG5cdFx0XHQgKiAgKk1heSogYmUgY2hhbmdlZCBpbiBydW50aW1lICovXHJcblx0XHRcdHdpbmRvdzogbnVtYmVyID0gSW5maW5pdHk7XHJcblxyXG5cdFx0XHQvKiogVW5maW5pc2hlZCByZXN1bHQgYXJyYXkgKi9cclxuXHRcdFx0cmVzdWx0czogKFYgfCBFIHwgdW5kZWZpbmVkKVtdID0gW107XHJcblx0XHRcdC8qKiBQcm9taXNlcyBmb3IgZXZlcnkgZWxlbWVudCAqL1xyXG5cdFx0XHRyZXF1ZXN0czogVW53cmFwcGVkUHJvbWlzZTxWIHwgRT5bXSA9IFtdO1xyXG5cclxuXHRcdFx0YmVmb3JlU3RhcnQ6IChkYXRhOiB7XHJcblx0XHRcdFx0ZTogVCwgaTogbnVtYmVyLCBhOiBUW10sIHY/OiBWIHwgRSwgcjogKFYgfCBFKVtdLCBwbWFwOiBQTWFwPFQsIFYsIEU+XHJcblx0XHRcdH0pID0+IFByb21pc2U8dm9pZD4gfCB2b2lkID0gKCkgPT4geyB9O1xyXG5cdFx0XHRhZnRlckNvbXBsZXRlOiAoZGF0YToge1xyXG5cdFx0XHRcdGU6IFQsIGk6IG51bWJlciwgYTogVFtdLCB2OiBWIHwgRSwgcjogKFYgfCBFKVtdLCBwbWFwOiBQTWFwPFQsIFYsIEU+XHJcblx0XHRcdH0pID0+IFByb21pc2U8dm9pZD4gfCB2b2lkID0gKCkgPT4geyB9O1xyXG5cclxuXHRcdFx0LyoqIExlbmd0aCBvZiB0aGUgYXJyYXkgKi9cclxuXHRcdFx0bGVuZ3RoOiBudW1iZXIgPSAtMTtcclxuXHRcdFx0LyoqIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgZmluaXNoZWQgY29udmVydGluZyAqL1xyXG5cdFx0XHRjb21wbGV0ZWQ6IG51bWJlciA9IC0xO1xyXG5cdFx0XHQvKiogVGhyZWFkcyBjdXJyZW50bHkgd29ya2luZyAgIFxyXG5cdFx0XHQgKiAgaW4gdGhlIG1hcHBlciBmdW5jdGlvbjogaW5jbHVkaW5nIHRoZSBjdXJyZW50IG9uZSAqL1xyXG5cdFx0XHRhY3RpdmVUaHJlYWRzOiBudW1iZXIgPSAtMTtcclxuXHRcdFx0bGFzdFN0YXJ0ZWQ6IG51bWJlciA9IC0xO1xyXG5cclxuXHRcdFx0YWxsVGFza3NEb25lOiBVbndyYXBwZWRQcm9taXNlPChWIHwgRSlbXT4gJiB7IHBtYXA6IFBNYXA8VCwgViwgRT4gfTtcclxuXHRcdFx0YW55VGFza1Jlc29sdmVkOiBVbndyYXBwZWRQcm9taXNlPHZvaWQ+O1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3Ioc291cmNlOiBQYXJ0aWFsPFBNYXA8VCwgViwgRT4+KSB7XHJcblx0XHRcdFx0dGhpcy5hbGxUYXNrc0RvbmUgPSBPYmplY3QuYXNzaWduKHRoaXMuZW1wdHlSZXN1bHQ8KFYgfCBFKVtdPigpLCB7IHBtYXA6IHRoaXMgfSk7XHJcblx0XHRcdFx0dGhpcy5hbnlUYXNrUmVzb2x2ZWQgPSB0aGlzLmVtcHR5UmVzdWx0KCk7XHJcblx0XHRcdFx0Zm9yIChsZXQgayBvZiBPYmplY3Qua2V5cyh0aGlzKSBhcyAoa2V5b2YgUE1hcDxULCBWLCBFPilbXSkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBzb3VyY2Vba10gPT0gdHlwZW9mIHRoaXNba10pIHtcclxuXHRcdFx0XHRcdFx0dGhpc1trXSA9IHNvdXJjZVtrXSBhcyBhbnk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHNvdXJjZVtrXSkge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFBNYXA6IGludmFsaWQgY29uc3RydWN0b3IgcGFyYW1ldGVyOiBwcm9wZXJ0eSAke2t9OiBleHBlY3RlZCAke3R5cGVvZiB0aGlzW2tdfSwgYnV0IGdvdCAke3R5cGVvZiBzb3VyY2Vba119YCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhc3luYyBzdGFydFRhc2soYXJyYXlJbmRleDogbnVtYmVyKSB7XHJcblx0XHRcdFx0dGhpcy5hY3RpdmVUaHJlYWRzKys7XHJcblx0XHRcdFx0bGV0IGUgPSB0aGlzLnNvdXJjZVthcnJheUluZGV4XTtcclxuXHRcdFx0XHRhd2FpdCB0aGlzLmJlZm9yZVN0YXJ0KHtcclxuXHRcdFx0XHRcdGU6IHRoaXMuc291cmNlW2FycmF5SW5kZXhdLFxyXG5cdFx0XHRcdFx0aTogYXJyYXlJbmRleCxcclxuXHRcdFx0XHRcdGE6IHRoaXMuc291cmNlLFxyXG5cdFx0XHRcdFx0djogdW5kZWZpbmVkLFxyXG5cdFx0XHRcdFx0cjogdGhpcy5yZXN1bHRzLFxyXG5cdFx0XHRcdFx0cG1hcDogdGhpcyxcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR0aGlzLmxhc3RTdGFydGVkID0gYXJyYXlJbmRleDtcclxuXHRcdFx0XHRsZXQgdjogViB8IEU7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHYgPSBhd2FpdCB0aGlzLm1hcHBlcih0aGlzLnNvdXJjZVthcnJheUluZGV4XSwgYXJyYXlJbmRleCwgdGhpcy5zb3VyY2UsIHRoaXMpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdHYgPSBlIGFzIEU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucmVzdWx0c1thcnJheUluZGV4XSA9IHY7XHJcblx0XHRcdFx0dGhpcy5yZXF1ZXN0c1thcnJheUluZGV4XS5yZXNvbHZlKHYpO1xyXG5cdFx0XHRcdHRoaXMuY29tcGxldGVkKys7XHJcblx0XHRcdFx0YXdhaXQgdGhpcy5hZnRlckNvbXBsZXRlKHtcclxuXHRcdFx0XHRcdGU6IHRoaXMuc291cmNlW2FycmF5SW5kZXhdLFxyXG5cdFx0XHRcdFx0aTogYXJyYXlJbmRleCxcclxuXHRcdFx0XHRcdGE6IHRoaXMuc291cmNlLFxyXG5cdFx0XHRcdFx0djogdixcclxuXHRcdFx0XHRcdHI6IHRoaXMucmVzdWx0cyxcclxuXHRcdFx0XHRcdHBtYXA6IHRoaXMsXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0dGhpcy5hY3RpdmVUaHJlYWRzLS07XHJcblx0XHRcdFx0dGhpcy5hbnlUYXNrUmVzb2x2ZWQucmVzb2x2ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzeW5jIHJ1bl9pbnRlcm5hbCgpIHtcclxuXHRcdFx0XHRmb3IgKGxldCBhcnJheUluZGV4ID0gMDsgYXJyYXlJbmRleCA8IHRoaXMubGVuZ3RoOyBhcnJheUluZGV4KyspIHtcclxuXHRcdFx0XHRcdHdoaWxlICh0aGlzLmFjdGl2ZVRocmVhZHMgPj0gdGhpcy50aHJlYWRzKSB7XHJcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuYW55VGFza1Jlc29sdmVkO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFueVRhc2tSZXNvbHZlZCA9IHRoaXMuZW1wdHlSZXN1bHQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnJlcXVlc3RzW2FycmF5SW5kZXggLSB0aGlzLndpbmRvd107XHJcblx0XHRcdFx0XHR0aGlzLnN0YXJ0VGFzayhhcnJheUluZGV4KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0d2hpbGUgKHRoaXMuYWN0aXZlVGhyZWFkcyA+IDApIHtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMuYW55VGFza1Jlc29sdmVkO1xyXG5cdFx0XHRcdFx0dGhpcy5hbnlUYXNrUmVzb2x2ZWQgPSB0aGlzLmVtcHR5UmVzdWx0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuYWxsVGFza3NEb25lLnJlc29sdmUodGhpcy5yZXN1bHRzIGFzIChWIHwgRSlbXSk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWxsVGFza3NEb25lO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJ1bigpIHtcclxuXHRcdFx0XHR0aGlzLnByZXBhcmUoKTtcclxuXHRcdFx0XHR0aGlzLnJ1bl9pbnRlcm5hbCgpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFsbFRhc2tzRG9uZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cGF1c2UoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuYWN0aXZlVGhyZWFkcyA8IHRoaXMubGVuZ3RoICsgdGhpcy50aHJlYWRzKVxyXG5cdFx0XHRcdFx0dGhpcy5hY3RpdmVUaHJlYWRzICs9IHRoaXMubGVuZ3RoICsgdGhpcy50aHJlYWRzO1xyXG5cdFx0XHR9XHJcblx0XHRcdHVucGF1c2UoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuYWN0aXZlVGhyZWFkcyA+PSB0aGlzLmxlbmd0aCArIHRoaXMudGhyZWFkcylcclxuXHRcdFx0XHRcdHRoaXMuYWN0aXZlVGhyZWFkcyAtPSB0aGlzLmxlbmd0aCArIHRoaXMudGhyZWFkcztcclxuXHRcdFx0XHR0aGlzLmFueVRhc2tSZXNvbHZlZC5yKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FuY2VsKCkge1xyXG5cdFx0XHRcdHRoaXMubWFwcGVyID0gKCgpID0+IHsgfSkgYXMgYW55O1xyXG5cdFx0XHRcdHRoaXMuYmVmb3JlU3RhcnQgPSAoKSA9PiB7IH07XHJcblx0XHRcdFx0dGhpcy5hZnRlckNvbXBsZXRlID0gKCkgPT4geyB9O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwcmVwYXJlKCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmxlbmd0aCA9PSAtMSkgdGhpcy5sZW5ndGggPSB0aGlzLnNvdXJjZS5sZW5ndGg7XHJcblx0XHRcdFx0aWYgKHRoaXMucmVzdWx0cy5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5yZXN1bHRzID0gQXJyYXkodGhpcy5sZW5ndGgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5yZXF1ZXN0cy5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5yZXF1ZXN0cyA9IHRoaXMuc291cmNlLm1hcChlID0+IHRoaXMuZW1wdHlSZXN1bHQoKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLmNvbXBsZXRlZCA8IDApIHRoaXMuY29tcGxldGVkID0gMDtcclxuXHRcdFx0XHRpZiAodGhpcy5hY3RpdmVUaHJlYWRzIDwgMCkgdGhpcy5hY3RpdmVUaHJlYWRzID0gMDtcclxuXHRcdFx0XHRpZiAodGhpcy5sYXN0U3RhcnRlZCA8IC0xKSB0aGlzLmxhc3RTdGFydGVkID0gLTE7XHJcblx0XHRcdFx0dGhpcy5hbnlUYXNrUmVzb2x2ZWQgPSB0aGlzLmVtcHR5UmVzdWx0KCk7XHJcblx0XHRcdFx0T2JqZWN0LmFzc2lnbih0aGlzLmFsbFRhc2tzRG9uZSwgeyBwbWFwOiB0aGlzIH0pO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRlbXB0eVJlc3VsdDxUID0gViB8IEU+KCk6IFVud3JhcHBlZFByb21pc2U8VD4ge1xyXG5cdFx0XHRcdGxldCByZXNvbHZlITogKHZhbHVlOiBUKSA9PiB2b2lkO1xyXG5cdFx0XHRcdGxldCByZWplY3QhOiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xyXG5cdFx0XHRcdGxldCBwID0gbmV3IFByb21pc2U8VD4oKHIsIGopID0+IHtcclxuXHRcdFx0XHRcdHJlc29sdmUgPSByO1xyXG5cdFx0XHRcdFx0cmVqZWN0ID0gajtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihwLCB7IHJlc29sdmUsIHJlamVjdCwgcjogcmVzb2x2ZSwgajogcmVqZWN0IH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzdGF0aWMgdGhpc19wbWFwPFQsIFYsIEUgPSBuZXZlcj4odGhpczogVFtdLCBtYXBwZXI6IFBNYXA8VCwgViwgRT5bJ21hcHBlciddLCBvcHRpb25zOiBQYXJ0aWFsPFBNYXA8VCwgViwgRT4+IHwgbnVtYmVyIHwgdHJ1ZSA9IHt9KSB7XHJcblx0XHRcdFx0aWYgKG9wdGlvbnMgPT0gdHJ1ZSkgb3B0aW9ucyA9IEluZmluaXR5O1xyXG5cdFx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnbnVtYmVyJykgb3B0aW9ucyA9IHsgdGhyZWFkczogb3B0aW9ucyB9O1xyXG5cdFx0XHRcdGxldCBwbWFwID0gbmV3IFBNYXAoeyBzb3VyY2U6IHRoaXMsIG1hcHBlciwgLi4ub3B0aW9ucyB9KTtcclxuXHRcdFx0XHRyZXR1cm4gcG1hcC5ydW4oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdGF0aWMgcG1hcDxULCBWLCBFID0gbmV2ZXI+KGFycmF5OiBUW10sIG1hcHBlcjogUE1hcDxULCBWLCBFPlsnbWFwcGVyJ10sIG9wdGlvbnM6IFBhcnRpYWw8UE1hcDxULCBWLCBFPj4gfCBudW1iZXIgfCB0cnVlID0ge30pIHtcclxuXHRcdFx0XHRpZiAob3B0aW9ucyA9PSB0cnVlKSBvcHRpb25zID0gSW5maW5pdHk7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zID09ICdudW1iZXInKSBvcHRpb25zID0geyB0aHJlYWRzOiBvcHRpb25zIH07XHJcblx0XHRcdFx0bGV0IHBtYXAgPSBuZXcgUE1hcCh7IHNvdXJjZTogYXJyYXksIG1hcHBlciwgLi4ub3B0aW9ucyB9KTtcclxuXHRcdFx0XHRyZXR1cm4gcG1hcC5ydW4oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRGF0ZU5vd0hhY2sge1xyXG5cclxuXHRcdGV4cG9ydCBsZXQgc3BlZWRNdWx0aXBsaWVyID0gMTtcclxuXHRcdGV4cG9ydCBsZXQgZGVsdGFPZmZzZXQgPSAwO1xyXG5cdFx0ZXhwb3J0IGxldCBzdGFydFJlYWx0aW1lID0gMDtcclxuXHRcdGV4cG9ydCBsZXQgc3RhcnRUaW1lID0gMDtcclxuXHJcblx0XHQvLyBleHBvcnQgbGV0IHNwZWVkTXVsdGlwbGllciA9IDE7XHJcblx0XHRleHBvcnQgbGV0IHBlcmZvcm1hbmNlRGVsdGFPZmZzZXQgPSAwO1xyXG5cdFx0ZXhwb3J0IGxldCBwZXJmb3JtYW5jZVN0YXJ0UmVhbHRpbWUgPSAwO1xyXG5cdFx0ZXhwb3J0IGxldCBwZXJmb3JtYW5jZVN0YXJ0VGltZSA9IDA7XHJcblxyXG5cdFx0ZXhwb3J0IGxldCB1c2VkTWV0aG9kcyA9IHtcclxuXHRcdFx0ZGF0ZTogdHJ1ZSxcclxuXHRcdFx0cGVyZm9ybWFuY2U6IHRydWUsXHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHRvRmFrZVRpbWUocmVhbHRpbWU6IG51bWJlcikge1xyXG5cdFx0XHRpZiAoIXVzZWRNZXRob2RzLmRhdGUpIHJldHVybiByZWFsdGltZTtcclxuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoXHJcblx0XHRcdFx0KHJlYWx0aW1lIC0gc3RhcnRSZWFsdGltZSkgKiBzcGVlZE11bHRpcGxpZXIgKyBzdGFydFRpbWUgKyBkZWx0YU9mZnNldFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHRvUGVyZm9ybWFuY2VGYWtlVGltZShyZWFsdGltZTogbnVtYmVyKSB7XHJcblx0XHRcdGlmICghdXNlZE1ldGhvZHMucGVyZm9ybWFuY2UpIHJldHVybiByZWFsdGltZTtcclxuXHRcdFx0cmV0dXJuIChyZWFsdGltZSAtIHBlcmZvcm1hbmNlU3RhcnRSZWFsdGltZSkgKiBzcGVlZE11bHRpcGxpZXJcclxuXHRcdFx0XHQrIHBlcmZvcm1hbmNlU3RhcnRUaW1lICsgcGVyZm9ybWFuY2VEZWx0YU9mZnNldDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IGJyYWNrZXRTcGVlZHMgPSBbMC4wNSwgMC4yNSwgMSwgMiwgNSwgMTAsIDIwLCA2MCwgMTIwXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzcGVlZGhhY2soc3BlZWQ6IG51bWJlciA9IDEpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBzcGVlZCAhPSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgRGF0ZU5vd0hhY2s6IGludmFsaWQgc3BlZWQ6ICR7c3BlZWR9YCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWN0aXZhdGUoKTtcclxuXHRcdFx0YWN0aXZhdGVQZXJmb3JtYW5jZSgpO1xyXG5cdFx0XHRzcGVlZE11bHRpcGxpZXIgPSBzcGVlZDtcclxuXHRcdFx0bG9jYXRpb24uaGFzaCA9IHNwZWVkICsgJyc7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gdGltZWp1bXAoc2Vjb25kczogbnVtYmVyKSB7XHJcblx0XHRcdGFjdGl2YXRlKCk7XHJcblx0XHRcdGFjdGl2YXRlUGVyZm9ybWFuY2UoKTtcclxuXHRcdFx0ZGVsdGFPZmZzZXQgKz0gc2Vjb25kcyAqIDEwMDA7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gc3dpdGNoU3BlZWRoYWNrKGRpcjogbnVtYmVyKSB7XHJcblx0XHRcdGxldCBjdXJyZW50SW5kZXggPSBicmFja2V0U3BlZWRzLmluZGV4T2Yoc3BlZWRNdWx0aXBsaWVyKTtcclxuXHRcdFx0aWYgKGN1cnJlbnRJbmRleCA9PSAtMSkgY3VycmVudEluZGV4ID0gYnJhY2tldFNwZWVkcy5pbmRleE9mKDEpO1xyXG5cdFx0XHRsZXQgbmV3U3BlZWQgPSBicmFja2V0U3BlZWRzW2N1cnJlbnRJbmRleCArIGRpcl07XHJcblx0XHRcdGlmIChuZXdTcGVlZCA9PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0c3BlZWRoYWNrKG5ld1NwZWVkKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG9ua2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQnJhY2tldExlZnQnKSB7XHJcblx0XHRcdFx0c3dpdGNoU3BlZWRoYWNrKC0xKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQnJhY2tldFJpZ2h0Jykge1xyXG5cdFx0XHRcdHN3aXRjaFNwZWVkaGFjaygxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGJpbmRCcmFja2V0cyhtb2RlID0gJ29uJykge1xyXG5cdFx0XHRyZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25rZXlkb3duKTtcclxuXHRcdFx0aWYgKG1vZGUgPT0gJ29uJykge1xyXG5cdFx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbmtleWRvd24pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBhY3RpdmF0ZWQgPSBmYWxzZTtcclxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG5cdFx0XHREYXRlLl9ub3cgPz89IERhdGUubm93O1xyXG5cdFx0XHREYXRlLnByb3RvdHlwZS5fZ2V0VGltZSA/Pz0gRGF0ZS5wcm90b3R5cGUuZ2V0VGltZTtcclxuXHRcdFx0c3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0c3RhcnRSZWFsdGltZSA9IERhdGUuX25vdygpO1xyXG5cdFx0XHRkZWx0YU9mZnNldCA9IDA7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKERhdGUubm93KCksIClcclxuXHRcdFx0Ly8gZGVidWdnZXI7XHJcblx0XHRcdERhdGUubm93ID0gKCkgPT4gdG9GYWtlVGltZShEYXRlLl9ub3coKSk7XHJcblx0XHRcdERhdGUucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbiAodGhpczogRGF0ZSAmIHsgX3Q/OiBudW1iZXIgfSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl90ID8/PSB0b0Zha2VUaW1lKHRoaXMuX2dldFRpbWUoKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0RGF0ZS5wcm90b3R5cGUudmFsdWVPZiA9IGZ1bmN0aW9uICh0aGlzOiBEYXRlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VGltZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFjdGl2YXRlZCA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgbGV0IHBlcmZvcm1hbmNlQWN0aXZhdGVkID0gZmFsc2U7XHJcblx0XHRmdW5jdGlvbiBhY3RpdmF0ZVBlcmZvcm1hbmNlKCkge1xyXG5cdFx0XHRwZXJmb3JtYW5jZS5fbm93ID8/PSBwZXJmb3JtYW5jZS5ub3c7XHJcblx0XHRcdHBlcmZvcm1hbmNlU3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblx0XHRcdHBlcmZvcm1hbmNlU3RhcnRSZWFsdGltZSA9IHBlcmZvcm1hbmNlLl9ub3coKTtcclxuXHRcdFx0cGVyZm9ybWFuY2VEZWx0YU9mZnNldCA9IDA7XHJcblx0XHRcdHBlcmZvcm1hbmNlLm5vdyA9ICgpID0+IHRvUGVyZm9ybWFuY2VGYWtlVGltZShwZXJmb3JtYW5jZS5fbm93KCkpO1xyXG5cdFx0XHRwZXJmb3JtYW5jZUFjdGl2YXRlZCA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgT2JqZWN0RXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZGVmaW5lVmFsdWU8VCwgSyBleHRlbmRzIGtleW9mIFQ+KG86IFQsIHA6IEssIHZhbHVlOiBUW0tdKTogVDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBkZWZpbmVWYWx1ZTxUPihvOiBULCBmbjogRnVuY3Rpb24pOiBUO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGRlZmluZVZhbHVlPFQ+KG86IFQsIHA6IGtleW9mIFQgfCBzdHJpbmcgfCBGdW5jdGlvbiwgdmFsdWU/OiBhbnkpOiBUIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBwID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRbcCwgdmFsdWVdID0gW3AubmFtZSwgcF0gYXMgW3N0cmluZywgRnVuY3Rpb25dO1xyXG5cdFx0XHR9XHJcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBwLCB7XHJcblx0XHRcdFx0dmFsdWUsXHJcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxyXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUdldHRlcjxULCBLIGV4dGVuZHMga2V5b2YgVD4obzogVCwgcDogSywgZ2V0OiAoKSA9PiBUW0tdKTogVDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBkZWZpbmVHZXR0ZXI8VD4obzogVCwgZ2V0OiBGdW5jdGlvbik6IFQ7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZGVmaW5lR2V0dGVyPFQ+KG86IFQsIHA6IHN0cmluZyB8IGtleW9mIFQgfCBGdW5jdGlvbiwgZ2V0PzogYW55KTogVCB7XHJcblx0XHRcdGlmICh0eXBlb2YgcCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0W3AsIGdldF0gPSBbcC5uYW1lLCBwXSBhcyBbc3RyaW5nLCBGdW5jdGlvbl07XHJcblx0XHRcdH1cclxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIHAsIHtcclxuXHRcdFx0XHRnZXQsXHJcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG1hcDxULCBWPihvOiBULCBtYXBwZXI6ICh2OiBWYWx1ZU9mPFQ+LCBrOiBrZXlvZiBULCBvOiBUKSA9PiBWKTogTWFwcGVkT2JqZWN0PFQsIFY+IHtcclxuXHRcdFx0bGV0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhvKSBhcyBba2V5b2YgVCwgVmFsdWVPZjxUPl1bXTtcclxuXHRcdFx0cmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhlbnRyaWVzLm1hcCgoW2ssIHZdKSA9PiBbaywgbWFwcGVyKHYsIGssIG8pXSkpIGFzIE1hcHBlZE9iamVjdDxULCBWPjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgUXVlcnlTZWxlY3RvciB7XHJcblxyXG5cdFx0ZXhwb3J0IG5hbWVzcGFjZSBXaW5kb3dRIHtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IEspOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHNlbGVjdG9yOiBTKTogVGFnRWxlbWVudEZyb21UYWdOYW1lPE4+O1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHNlbGVjdG9yKTogRTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IHNlbGVjdG9yKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcShzZWxlY3Rvcjogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuICh0aGlzPy5kb2N1bWVudCA/PyBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihzZWxlY3RvcjogSyk6IChIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10pW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxTIGV4dGVuZHMgc2VsZWN0b3IsIE4gPSBUYWdOYW1lRnJvbVNlbGVjdG9yPFM+PihzZWxlY3RvcjogUyk6IFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxOPltdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8RSBleHRlbmRzIEVsZW1lbnQ+KHNlbGVjdG9yOiBzZWxlY3Rvcik6IEVbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHNlbGVjdG9yOiBzZWxlY3Rvcik6IChIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10pW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcShzZWxlY3Rvcjogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIFsuLi4odGhpcz8uZG9jdW1lbnQgPz8gZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBuYW1lc3BhY2UgRG9jdW1lbnRRIHtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBLKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxTIGV4dGVuZHMgc2VsZWN0b3IsIE4gPSBUYWdOYW1lRnJvbVNlbGVjdG9yPFM+Pih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEUgZXh0ZW5kcyBFbGVtZW50Pih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogRTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHEodGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kb2N1bWVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IEspOiAoSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdKVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBTKTogVGFnRWxlbWVudEZyb21UYWdOYW1lPE4+W107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxFIGV4dGVuZHMgRWxlbWVudD4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IEVbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IERvY3VtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiAoSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdKVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXEodGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gWy4uLnRoaXMuZG9jdW1lbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBuYW1lc3BhY2UgRWxlbWVudFEge1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBFbGVtZW50LCBzZWxlY3RvcjogSyk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEUgZXh0ZW5kcyBFbGVtZW50Pih0aGlzOiBFbGVtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiBFO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBFbGVtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxKHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBLKTogKEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSlbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBTKTogVGFnRWxlbWVudEZyb21UYWdOYW1lPE4+W107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxFIGV4dGVuZHMgRWxlbWVudD4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogRVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogKEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSlbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxKHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gWy4uLnRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcildO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIEVsZW1lbnRFeHRlbnNpb24ge1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVtaXQ8VCBleHRlbmRzIEN1c3RvbUV2ZW50PHsgX2V2ZW50Pzogc3RyaW5nIH0+Pih0aGlzOiBFbGVtZW50LCB0eXBlOiBUWydkZXRhaWwnXVsnX2V2ZW50J10sIGRldGFpbD86IFRbJ2RldGFpbCddKTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbWl0PFQ+KHRoaXM6IEVsZW1lbnQsIHR5cGU6IHN0cmluZywgZGV0YWlsPzogVCkge1xyXG5cdFx0XHRsZXQgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQodHlwZSwge1xyXG5cdFx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdFx0ZGV0YWlsLFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gYXBwZW5kVG88RSBleHRlbmRzIEVsZW1lbnQ+KHRoaXM6IEUsIHBhcmVudDogRWxlbWVudCB8IHNlbGVjdG9yKTogRSB7XHJcblx0XHRcdGlmICh0eXBlb2YgcGFyZW50ID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0cGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJlbnQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHBhcmVudC5hcHBlbmQodGhpcyk7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRWxtIHtcclxuXHRcdHR5cGUgQ2hpbGQgPSBOb2RlIHwgc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbjtcclxuXHRcdHR5cGUgU29tZUV2ZW50ID0gRXZlbnQgJiBNb3VzZUV2ZW50ICYgS2V5Ym9hcmRFdmVudCAmIHsgdGFyZ2V0OiBIVE1MRWxlbWVudCB9O1xyXG5cdFx0dHlwZSBMaXN0ZW5lciA9ICgoZXZlbnQ6IFNvbWVFdmVudCkgPT4gYW55KVxyXG5cdFx0XHQmIHsgbmFtZT86IGAkeycnIHwgJ2JvdW5kICd9JHsnb24nIHwgJyd9JHtrZXlvZiBIVE1MRWxlbWVudEV2ZW50TWFwfWAgfCAnJyB9IHwgKChldmVudDogU29tZUV2ZW50KSA9PiBhbnkpO1xyXG5cclxuXHRcdGNvbnN0IGVsbVJlZ2V4ID0gbmV3IFJlZ0V4cChbXHJcblx0XHRcdC9eKD88dGFnPltcXHctXSspLyxcclxuXHRcdFx0LyMoPzxpZD5bXFx3LV0rKS8sXHJcblx0XHRcdC9cXC4oPzxjbGFzcz5bXFx3LV0rKS8sXHJcblx0XHRcdC9cXFsoPzxhdHRyMT5bXFx3LV0rKVxcXS8sXHJcblx0XHRcdC9cXFsoPzxhdHRyMj5bXFx3LV0rKT0oPyFbJ1wiXSkoPzx2YWwyPlteXFxdXSopXFxdLyxcclxuXHRcdFx0L1xcWyg/PGF0dHIzPltcXHctXSspPVwiKD88dmFsMz4oPzpbXlwiXXxcXFxcXCIpKilcIlxcXS8sXHJcblx0XHRcdC9cXFsoPzxhdHRyND5bXFx3LV0rKT1cIig/PHZhbDQ+KD86W14nXXxcXFxcJykqKVwiXFxdLyxcclxuXHRcdF0ubWFwKGUgPT4gZS5zb3VyY2UpLmpvaW4oJ3wnKSwgJ2cnKTtcclxuXHJcblx0XHQvKiogaWYgYGVsbWAgc2hvdWxkIGRpc2FsbG93IGxpc3RlbmVycyBub3QgZXhpc3RpbmcgYXMgYG9uICogYCBwcm9wZXJ0eSBvbiB0aGUgZWxlbWVudCAqL1xyXG5cdFx0ZXhwb3J0IGxldCBhbGxvd09ubHlFeGlzdGluZ0xpc3RlbmVycyA9IHRydWU7XHJcblxyXG5cdFx0LyoqIGlmIGBlbG1gIHNob3VsZCBhbGxvdyBvdmVycmlkaW5nIGBvbiAqIGAgbGlzdGVuZXJzIGlmIG11bHRpcGxlIG9mIHRoZW0gYXJlIHByb3ZpZGVkICovXHJcblx0XHRleHBvcnQgbGV0IGFsbG93T3ZlcnJpZGVPbkxpc3RlbmVycyA9IGZhbHNlO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG08SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IEssIC4uLmNoaWxkcmVuOiAoQ2hpbGQgfCBMaXN0ZW5lcilbXSk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG08SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcCBleHRlbmRzIEsgPyBuZXZlciA6IHNlbGVjdG9yLCAuLi5jaGlsZHJlbjogKENoaWxkIHwgTGlzdGVuZXIpW10pOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZWxtPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHNlbGVjdG9yOiBTLCAuLi5jaGlsZHJlbjogKENoaWxkIHwgTGlzdGVuZXIpW10pOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZWxtPEUgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHNlbGVjdG9yOiBzZWxlY3RvciwgLi4uY2hpbGRyZW46IChDaGlsZCB8IExpc3RlbmVyKVtdKTogRTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG0oKTogSFRNTERpdkVsZW1lbnQ7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZWxtKHNlbGVjdG9yOiBzdHJpbmcgPSAnJywgLi4uY2hpbGRyZW46IChDaGlsZCB8IExpc3RlbmVyKVtdKTogSFRNTEVsZW1lbnQge1xyXG5cdFx0XHRpZiAoc2VsZWN0b3IucmVwbGFjZUFsbChlbG1SZWdleCwgJycpICE9ICcnKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfSBgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0Ly8gbGV0IHRhZyA9ICcnO1xyXG5cdFx0XHQvLyBsZXQgZmlyc3RNYXRjaCA9IGZhbHNlO1xyXG5cdFx0XHRmb3IgKGxldCBtYXRjaCBvZiBzZWxlY3Rvci5tYXRjaEFsbChlbG1SZWdleCkpIHtcclxuXHRcdFx0XHRpZiAobWF0Y2guZ3JvdXBzLnRhZykge1xyXG5cdFx0XHRcdFx0Ly8gaWYgKHRhZyAmJiBtYXRjaC5ncm91cHMudGFnICE9IHRhZykge1xyXG5cdFx0XHRcdFx0Ly8gXHR0aHJvdyBuZXcgRXJyb3IoYHNlbGVjdG9yIGhhcyB0d28gZGlmZmVyZW50IHRhZ3MgYXQgb25jZSA6IDwke3RhZ30+IGFuZCA8JHttYXRjaC5ncm91cHMudGFnfT5gKTtcclxuXHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdC8vIHRhZyA9IG1hdGNoLmdyb3Vwcy50YWc7XHJcblx0XHRcdFx0XHQvLyBpZiAoIWZpcnN0TWF0Y2gpIHJldHVybiBlbG0odGFnICsgc2VsZWN0b3IsIC4uLmNoaWxkcmVuKTtcclxuXHRcdFx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG1hdGNoLmdyb3Vwcy50YWcpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2guZ3JvdXBzLmlkKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LmlkID0gbWF0Y2guZ3JvdXBzLmlkO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2guZ3JvdXBzLmNsYXNzKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQobWF0Y2guZ3JvdXBzLmNsYXNzKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG1hdGNoLmdyb3Vwcy5hdHRyMSkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUobWF0Y2guZ3JvdXBzLmF0dHIxLCBcInRydWVcIik7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuYXR0cjIpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG1hdGNoLmdyb3Vwcy5hdHRyMiwgbWF0Y2guZ3JvdXBzLnZhbDIpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2guZ3JvdXBzLmF0dHIzKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShtYXRjaC5ncm91cHMuYXR0cjMsIG1hdGNoLmdyb3Vwcy52YWwzLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuYXR0cjQpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG1hdGNoLmdyb3Vwcy5hdHRyNCwgbWF0Y2guZ3JvdXBzLnZhbDQucmVwbGFjZSgvXFxcXCcvZywgJ1xcJycpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gZmlyc3RNYXRjaCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGxpc3RlbmVyIG9mIGNoaWxkcmVuLmZpbHRlcihlID0+IHR5cGVvZiBlID09ICdmdW5jdGlvbicpIGFzIExpc3RlbmVyW10pIHtcclxuXHRcdFx0XHRsZXQgbmFtZTogc3RyaW5nID0gbGlzdGVuZXIubmFtZTtcclxuXHRcdFx0XHRpZiAoIW5hbWUpIG5hbWUgPSAobGlzdGVuZXIgKyAnJykubWF0Y2goL1xcYig/IWZ1bmN0aW9uXFxiKVxcdysvKVswXTtcclxuXHRcdFx0XHRpZiAoIW5hbWUpIHRocm93IG5ldyBFcnJvcigndHJ5aW5nIHRvIGJpbmQgdW5uYW1lZCBmdW5jdGlvbicpO1xyXG5cdFx0XHRcdGlmIChuYW1lLnN0YXJ0c1dpdGgoJ2JvdW5kICcpKSBuYW1lID0gbmFtZS5zbGljZSgnYm91bmQgJy5sZW5ndGgpO1xyXG5cdFx0XHRcdGlmIChuYW1lLnN0YXJ0c1dpdGgoJ29uJykpIHtcclxuXHRcdFx0XHRcdGlmICghZWxlbWVudC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgdGhyb3cgbmV3IEVycm9yKGA8ICR7ZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCl9PiBkb2VzIG5vdCBoYXZlIFwiJHtuYW1lfVwiIGxpc3RlbmVyYCk7XHJcblx0XHRcdFx0XHRpZiAoIWFsbG93T3ZlcnJpZGVPbkxpc3RlbmVycyAmJiBlbGVtZW50W25hbWVdKSB0aHJvdyBuZXcgRXJyb3IoJ292ZXJyaWRpbmcgYG9uICogYCBsaXN0ZW5lcnMgaXMgZGlzYWJsZWQnKTtcclxuXHRcdFx0XHRcdGVsZW1lbnRbbmFtZV0gPSBsaXN0ZW5lcjtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGFsbG93T25seUV4aXN0aW5nTGlzdGVuZXJzICYmIGVsZW1lbnRbJ29uJyArIG5hbWVdID09PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgPCR7ZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCl9PiBkb2VzIG5vdCBoYXZlIFwib24nJHtuYW1lfSdcIiBsaXN0ZW5lcmApO1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxlbWVudC5hcHBlbmQoLi4uY2hpbGRyZW4uZmlsdGVyKGUgPT4gdHlwZW9mIGUgIT0gJ2Z1bmN0aW9uJykgYXMgKE5vZGUgfCBzdHJpbmcpW10pO1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHNlbGVjdG9yOiBLLCBwYXJlbnQ/OiBQYXJlbnROb2RlIHwgc2VsZWN0b3IpOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHNlbGVjdG9yOiBTLCBwYXJlbnQ/OiBQYXJlbnROb2RlIHwgc2VsZWN0b3IpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtPEUgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHNlbGVjdG9yOiBzdHJpbmcsIHBhcmVudD86IFBhcmVudE5vZGUgfCBzZWxlY3Rvcik6IEU7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtKHNlbGVjdG9yOiBzdHJpbmcsIHBhcmVudD86IFBhcmVudE5vZGUgfCBzdHJpbmcpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBwYXJlbnQgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRwYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmVudCkgYXMgUGFyZW50Tm9kZTtcclxuXHRcdFx0XHRpZiAoIXBhcmVudCkgdGhyb3cgbmV3IEVycm9yKCdmYWlsZWQgdG8gZmluZCBwYXJlbnQgZWxlbWVudCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzZWxlY3Rvci5pbmNsdWRlcygnPicpKSB7XHJcblx0XHRcdFx0bGV0IHBhcmVudFNlbGVjdG9yID0gc2VsZWN0b3Iuc3BsaXQoJz4nKS5zbGljZSgwLCAtMSkuam9pbignPicpO1xyXG5cdFx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3Iuc3BsaXQoJz4nKS5wb3AoKTtcclxuXHRcdFx0XHRwYXJlbnQgPSAocGFyZW50IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHBhcmVudFNlbGVjdG9yKSBhcyBQYXJlbnROb2RlO1xyXG5cdFx0XHRcdGlmICghcGFyZW50KSB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWxlZCB0byBmaW5kIHBhcmVudCBlbGVtZW50Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGNoaWxkID0gKHBhcmVudCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdGlmIChjaGlsZCkgcmV0dXJuIGNoaWxkO1xyXG5cclxuXHRcdFx0Y2hpbGQgPSBlbG0oc2VsZWN0b3IpO1xyXG5cdFx0XHRwYXJlbnQ/LmFwcGVuZChjaGlsZCk7XHJcblx0XHRcdHJldHVybiBjaGlsZDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IGxldCBkZWJ1ZyA9IGZhbHNlO1xyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIGV0YyB7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24ga2V5YmluZChrZXk6IHN0cmluZywgZm46IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkge1xyXG5cdFx0XHRsZXQgY29kZSA9IGtleS5sZW5ndGggPT0gMSA/ICdLZXknICsga2V5LnRvVXBwZXJDYXNlKCkgOiBrZXk7XHJcblx0XHRcdGZ1bmN0aW9uIG9ua2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0XHRcdGlmIChldmVudC5jb2RlID09IGNvZGUpIHtcclxuXHRcdFx0XHRcdGZuKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bik7XHJcblx0XHRcdHJldHVybiAoKSA9PiByZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25rZXlkb3duKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gZnVsbHNjcmVlbihvbj86IGJvb2xlYW4pIHtcclxuXHRcdFx0bGV0IGNlbnRyYWwgPSBJbWFnZVNjcm9sbGluZ0V4dGVuc2lvbi5pbWFnZVNjcm9sbGluZ0FjdGl2ZSAmJiBJbWFnZVNjcm9sbGluZ0V4dGVuc2lvbi5nZXRDZW50cmFsSW1nKCk7XHJcblx0XHRcdGlmICghZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQpIHtcclxuXHRcdFx0XHRpZiAob24gPT0gZmFsc2UpIHJldHVybjtcclxuXHRcdFx0XHRhd2FpdCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4oKS5jYXRjaCgoKSA9PiB7IH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChvbiA9PSB0cnVlKSByZXR1cm47XHJcblx0XHRcdFx0YXdhaXQgZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKS5jYXRjaCgoKSA9PiB7IH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjZW50cmFsKSB7XHJcblx0XHRcdFx0Y2VudHJhbC5zY3JvbGxJbnRvVmlldygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiAhIWRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBhbnliaW5kKGtleU9yRXZlbnQ6IHN0cmluZyB8IG51bWJlciwgZm46IChldmVudDogRXZlbnQpID0+IHZvaWQpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBrZXlPckV2ZW50ID09IFwibnVtYmVyXCIpIGtleU9yRXZlbnQgPSBrZXlPckV2ZW50ICsgJyc7XHJcblx0XHRcdC8vIGRldGVjdCBpZiBpdCBpcyBldmVudFxyXG5cdFx0XHRsZXQgaXNFdmVudCA9IHdpbmRvdy5oYXNPd25Qcm9wZXJ0eSgnb24nICsga2V5T3JFdmVudCk7XHJcblx0XHRcdGlmIChpc0V2ZW50KSB7XHJcblx0XHRcdFx0YWRkRXZlbnRMaXN0ZW5lcihrZXlPckV2ZW50LCBmbik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHBhcnNlIGtleSBjb2RlXHJcblx0XHRcdGlmICghaXNOYU4ocGFyc2VJbnQoa2V5T3JFdmVudCkpKSB7XHJcblx0XHRcdFx0a2V5T3JFdmVudCA9IGBEaWdpdCR7a2V5T3JFdmVudH1gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGtleU9yRXZlbnQubGVuZ3RoID09IDEpIHtcclxuXHRcdFx0XHRrZXlPckV2ZW50ID0gYEtleSR7a2V5T3JFdmVudC50b1VwcGVyQ2FzZSgpfWA7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ID0+IHtcclxuXHRcdFx0XHRpZiAoZXYuY29kZSAhPSBrZXlPckV2ZW50KSByZXR1cm47XHJcblx0XHRcdFx0Zm4oZXYpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZnVsbHNjcmVlbk9uKGtleTogc3RyaW5nKSB7XHJcblx0XHRcdGlmIChrZXkgPT0gJ3Njcm9sbCcpIHtcclxuXHRcdFx0XHRhZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiBmdWxsc2NyZWVuKHRydWUpKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGtleWJpbmQoa2V5LCAoKSA9PiBmdWxsc2NyZWVuKCkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBmSXNGb3JGdWxsc2NyZWVuKCkge1xyXG5cdFx0XHRrZXliaW5kKCdGJywgKCkgPT4gZnVsbHNjcmVlbigpKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gaGFzaENvZGUodGhpczogc3RyaW5nKTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBoYXNoQ29kZSh2YWx1ZTogc3RyaW5nKTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBoYXNoQ29kZSh0aGlzOiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nKSB7XHJcblx0XHRcdHZhbHVlID8/PSB0aGlzO1xyXG5cdFx0XHRsZXQgaGFzaCA9IDA7XHJcblx0XHRcdGZvciAobGV0IGMgb2YgdmFsdWUpIHtcclxuXHRcdFx0XHRoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjLmNoYXJDb2RlQXQoMCk7XHJcblx0XHRcdFx0aGFzaCA9IGhhc2ggJiBoYXNoO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBoYXNoO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xyXG5cdFx0XHQvLyBTdHJpbmcucHJvdG90eXBlLmhhc2hDb2RlID0gaGFzaENvZGU7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRTY3JpcHRIYXNoKCkge1xyXG5cdFx0XHRyZXR1cm4gaGFzaENvZGUoZG9jdW1lbnQuY3VycmVudFNjcmlwdC5pbm5lckhUTUwpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiByZWxvYWRPbkN1cnJlbnRTY3JpcHRDaGFuZ2VkKHNjcmlwdE5hbWU6IHN0cmluZyA9IGxvY2F0aW9uLmhvc3RuYW1lICsgJy51anMnKSB7XHJcblx0XHRcdGxldCBzY3JpcHRJZCA9IGByZWxvYWRPbkN1cnJlbnRTY3JpcHRDaGFuZ2VkXyR7c2NyaXB0TmFtZX1gO1xyXG5cdFx0XHRsZXQgc2NyaXB0SGFzaCA9IGN1cnJlbnRTY3JpcHRIYXNoKCkgKyAnJztcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oc2NyaXB0SWQsIHNjcmlwdEhhc2gpO1xyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHtcclxuXHRcdFx0XHRpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oc2NyaXB0SWQpICE9IHNjcmlwdEhhc2gpIHtcclxuXHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBmYXN0U2Nyb2xsOiB7XHJcblx0XHRcdChzcGVlZD86IG51bWJlcik6IHZvaWQ7XHJcblx0XHRcdHNwZWVkPzogbnVtYmVyO1xyXG5cdFx0XHRhY3RpdmU/OiBib29sZWFuO1xyXG5cdFx0XHRvZmY/OiAoKSA9PiB2b2lkO1xyXG5cdFx0fSA9IGZ1bmN0aW9uIChzcGVlZCA9IDAuMjUpIHtcclxuXHRcdFx0aWYgKGZhc3RTY3JvbGwuYWN0aXZlKSBmYXN0U2Nyb2xsLm9mZigpO1xyXG5cdFx0XHRmYXN0U2Nyb2xsLmFjdGl2ZSA9IHRydWU7XHJcblx0XHRcdGZhc3RTY3JvbGwuc3BlZWQgPSBzcGVlZDtcclxuXHRcdFx0ZnVuY3Rpb24gb253aGVlbChldmVudDogTW91c2VFdmVudCAmIHsgd2hlZWxEZWx0YVk6IG51bWJlciB9KSB7XHJcblx0XHRcdFx0aWYgKGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHRcdFx0XHRpZiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSkgcmV0dXJuO1xyXG5cdFx0XHRcdHNjcm9sbEJ5KDAsIC1NYXRoLnNpZ24oZXZlbnQud2hlZWxEZWx0YVkpICogaW5uZXJIZWlnaHQgKiBmYXN0U2Nyb2xsLnNwZWVkKTtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbndoZWVsLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xyXG5cdFx0XHRmYXN0U2Nyb2xsLm9mZiA9ICgpID0+IHtcclxuXHRcdFx0XHRmYXN0U2Nyb2xsLmFjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbndoZWVsKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZmFzdFNjcm9sbC5hY3RpdmUgPSBmYWxzZTtcclxuXHRcdGZhc3RTY3JvbGwub2ZmID0gKCkgPT4geyB9O1xyXG5cclxuXHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG9ucmFmKGY6ICgpID0+IHZvaWQpIHtcclxuXHRcdFx0bGV0IGxvb3AgPSB0cnVlO1xyXG5cdFx0XHR2b2lkIGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR3aGlsZSAobG9vcCkge1xyXG5cdFx0XHRcdFx0YXdhaXQgUHJvbWlzZS5mcmFtZSgpO1xyXG5cdFx0XHRcdFx0ZigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSgpO1xyXG5cdFx0XHRyZXR1cm4gKCkgPT4geyBsb29wID0gZmFsc2UgfTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcmVzaXplT2JzZXJ2ZXI6IFJlc2l6ZU9ic2VydmVyO1xyXG5cdFx0bGV0IHJlc2l6ZUxpc3RlbmVyczogKChuZXdIZWlnaHQ6IG51bWJlciwgb2xkSGVpZ2h0OiBudW1iZXIpID0+IHZvaWQpW10gPSBbXTtcclxuXHRcdGxldCBwcmV2aW91c0JvZHlIZWlnaHQgPSAwO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG9uaGVpZ2h0Y2hhbmdlKGY6IChuZXdIZWlnaHQ6IG51bWJlciwgb2xkSGVpZ2h0OiBudW1iZXIpID0+IHZvaWQpIHtcclxuXHRcdFx0aWYgKCFyZXNpemVPYnNlcnZlcikge1xyXG5cdFx0XHRcdHByZXZpb3VzQm9keUhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cdFx0XHRcdHJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZSBvZiBlbnRyaWVzKSB7XHJcblx0XHRcdFx0XHRcdGlmIChlLnRhcmdldCAhPSBkb2N1bWVudC5ib2R5KSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdGxldCBuZXdCb2R5SGVpZ2h0ID0gZS50YXJnZXQuY2xpZW50SGVpZ2h0O1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBmIG9mIHJlc2l6ZUxpc3RlbmVycykge1xyXG5cdFx0XHRcdFx0XHRcdGYobmV3Qm9keUhlaWdodCwgcHJldmlvdXNCb2R5SGVpZ2h0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRwcmV2aW91c0JvZHlIZWlnaHQgPSBuZXdCb2R5SGVpZ2h0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJlc2l6ZU9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVzaXplTGlzdGVuZXJzLnB1c2goZik7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcigpIHtcclxuXHRcdFx0XHRyZXNpemVMaXN0ZW5lcnMuc3BsaWNlKHJlc2l6ZUxpc3RlbmVycy5pbmRleE9mKGYpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBkZWNsYXJlIGNvbnN0IGtkczoge1xyXG5cdFx0XHRbazogc3RyaW5nXTogc3RyaW5nIHwgKChlOiBLZXlib2FyZEV2ZW50ICYgTW91c2VFdmVudCkgPT4gdm9pZClcclxuXHRcdH07XHJcblxyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV0YywgJ2tkcycsIHtcclxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQoKSB7XHJcblx0XHRcdFx0bGV0IGtkcyA9IGluaXRLZHMoKTtcclxuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXRjLCAna2RzJywgeyB2YWx1ZToga2RzIH0pO1xyXG5cdFx0XHRcdHJldHVybiBrZHM7XHJcblx0XHRcdH0sXHJcblx0XHR9KTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQb29wSnMsICdrZHMnLCB7XHJcblx0XHRcdGdldDogKCkgPT4gZXRjLmtkcyxcclxuXHRcdFx0c2V0OiAodikgPT4gT2JqZWN0LmFzc2lnbihldGMua2RzLCB2KSxcclxuXHRcdH0pO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdlbmVyYXRlS2RzQ29kZXMoZTogS2V5Ym9hcmRFdmVudCAmIE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0bGV0IGJhc2VQcmVmaXggPSBgJHtlLnNoaWZ0S2V5ID8gJzwnIDogJyd9JHtlLmN0cmxLZXkgPyAnXicgOiAnJ30ke2UuYWx0S2V5ID8gJz4nIDogJyd9YDtcclxuXHRcdFx0bGV0IGJhc2VDb2RlID0gZS5jb2RlXHJcblx0XHRcdFx0PyBlLmNvZGUucmVwbGFjZSgvS2V5fERpZ2l0fEFycm93fExlZnR8UmlnaHQvLCAnJylcclxuXHRcdFx0XHQ6IFsnTE1CJywgJ1JNQicsICdNTUInXVtlLmJ1dHRvbl07XHJcblx0XHRcdGxldCBleHRyYUNvZGUgPSBlLmNvZGVcclxuXHRcdFx0XHQ/IGJhc2VDb2RlLnJlcGxhY2UoJ0NvbnRyb2wnLCAnQ3RybCcpXHJcblx0XHRcdFx0OiBiYXNlQ29kZTsvLyBbJ0xlZnQnLCAnUmlnaHQnLCAnTWlkZGxlJ11bZS5idXR0b25dO1xyXG5cdFx0XHRsZXQgcmF3Q29kZSA9IGUuY29kZSA/PyBiYXNlQ29kZTtcclxuXHRcdFx0bGV0IGtleUNvZGUgPSBlLmtleSA/PyBiYXNlQ29kZTtcclxuXHRcdFx0bGV0IGV4dHJhUHJlZml4ID0gYmFzZVByZWZpeC5yZXBsYWNlKFxyXG5cdFx0XHRcdGJhc2VDb2RlID09ICdTaGlmdCcgPyAnPCcgOiBiYXNlQ29kZSA9PSAnQ29udHJvbCcgPyAnXicgOiBiYXNlQ29kZSA9PSAnQWx0JyA/ICc+JyA6ICcnXHJcblx0XHRcdFx0LCAnJyk7XHJcblxyXG5cdFx0XHRsZXQgY29kZXMgPSBbYmFzZUNvZGUsIGV4dHJhQ29kZSwgcmF3Q29kZSwga2V5Q29kZV0uZmxhdE1hcChcclxuXHRcdFx0XHRjID0+IFtiYXNlUHJlZml4LCBleHRyYVByZWZpeF0ubWFwKHAgPT4gcCArIGMpXHJcblx0XHRcdCk7XHJcblx0XHRcdC8vLmZsYXRNYXAoZSA9PiBbZSwgZS50b1VwcGVyQ2FzZSgpLCBlLnRvTG93ZXJDYXNlKCldKTtcclxuXHRcdFx0Y29kZXMucHVzaChlLmNvZGUgPyAna2V5JyA6ICdtb3VzZScpO1xyXG5cdFx0XHRjb2Rlcy5wdXNoKCdhbnknKTtcclxuXHRcdFx0cmV0dXJuIEFycmF5LmZyb20obmV3IFNldChjb2RlcykpO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGtkc0xpc3RlbmVyKGU6IEtleWJvYXJkRXZlbnQgJiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdGxldCBjb2RlcyA9IGdlbmVyYXRlS2RzQ29kZXMoZSk7XHJcblx0XHRcdE9iamVjdC5hc3NpZ24oZSwgeyBfY29kZXM6IGNvZGVzIH0pO1xyXG5cdFx0XHRmb3IgKGxldCBjIG9mIGNvZGVzKSB7XHJcblx0XHRcdFx0bGV0IGxpc3RlbmVyID0gZXRjLmtkc1tjXTtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGxpc3RlbmVyID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRxKGxpc3RlbmVyKS5jbGljaygpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGxpc3RlbmVyID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdChldGMua2RzW2NdIGFzIGFueSkoZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBpbml0S2RzKCkge1xyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2RzTGlzdGVuZXIpO1xyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBrZHNMaXN0ZW5lcik7XHJcblx0XHRcdHJldHVybiB7fTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IF9rYmRJbml0ZWQgPSBmYWxzZTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBtYWtlS2RzKGtkczogeyBbazogc3RyaW5nXTogc3RyaW5nIHwgKChlOiBLZXlib2FyZEV2ZW50ICYgTW91c2VFdmVudCkgPT4gdm9pZCkgfSkge1xyXG5cdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihldGMua2RzLCBrZHMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRleHBvcnQgZGVjbGFyZSBsZXQga2RzOiB0eXBlb2YgZXRjLmtkcztcclxufVxyXG5cclxuLy8gaW50ZXJmYWNlIFN0cmluZyB7XHJcbi8vIFx0aGFzaENvZGU6ICgpID0+IG51bWJlcjtcclxuLy8gfVxyXG4iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IHR5cGUgZGVsdGFUaW1lID0gbnVtYmVyIHwgYCR7bnVtYmVyfSR7J3MnIHwgJ2gnIHwgJ2QnIHwgJ3cnIHwgJ3knfWAgfCBudWxsO1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRGVsdGFUaW1lKG1heEFnZTogZGVsdGFUaW1lKSB7XHJcblx0XHRpZiAodHlwZW9mIG1heEFnZSA9PSAnbnVtYmVyJykgcmV0dXJuIG1heEFnZTtcclxuXHRcdGlmICh0eXBlb2YgbWF4QWdlICE9ICdzdHJpbmcnKSByZXR1cm4gSW5maW5pdHk7XHJcblx0XHRjb25zdCBhVG9NID0geyBzOiAxZTMsIGg6IDM2MDBlMywgZDogMjQgKiAzNjAwZTMsIHc6IDcgKiAyNCAqIDM2MDBlMywgeTogMzY1ICogMjQgKiAzNjAwZTMgfTtcclxuXHRcdGxldCBuID0gcGFyc2VGbG9hdChtYXhBZ2UpO1xyXG5cdFx0bGV0IG0gPSBhVG9NW21heEFnZVttYXhBZ2UubGVuZ3RoIC0gMV1dO1xyXG5cdFx0aWYgKG4gIT0gbiB8fCAhbSkgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGRlbHRhVGltZScpO1xyXG5cdFx0cmV0dXJuIG4gKiBtO1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBGZXRjaEV4dGVuc2lvbiB7XHJcblx0XHRleHBvcnQgdHlwZSBSZXF1ZXN0SW5pdEV4ID0gUmVxdWVzdEluaXQgJiB7IG1heEFnZT86IGRlbHRhVGltZSwgeG1sPzogYm9vbGVhbiB9O1xyXG5cdFx0ZXhwb3J0IHR5cGUgUmVxdWVzdEluaXRFeEpzb24gPSBSZXF1ZXN0SW5pdCAmIHsgbWF4QWdlPzogZGVsdGFUaW1lLCBpbmRleGVkRGI/OiBib29sZWFuIH07XHJcblx0XHRleHBvcnQgbGV0IGRlZmF1bHRzOiBSZXF1ZXN0SW5pdCA9IHsgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyB9O1xyXG5cclxuXHRcdGV4cG9ydCBsZXQgY2FjaGU6IENhY2hlID0gbnVsbDtcclxuXHRcdGFzeW5jIGZ1bmN0aW9uIG9wZW5DYWNoZSgpIHtcclxuXHRcdFx0aWYgKGNhY2hlKSByZXR1cm4gY2FjaGU7XHJcblx0XHRcdGNhY2hlID0gYXdhaXQgY2FjaGVzLm9wZW4oJ2ZldGNoJyk7XHJcblx0XHRcdHJldHVybiBjYWNoZTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiB0b0R1cihkdDogZGVsdGFUaW1lKSB7XHJcblx0XHRcdGR0ID0gbm9ybWFsaXplRGVsdGFUaW1lKGR0KTtcclxuXHRcdFx0aWYgKGR0ID4gMWUxMCkgZHQgPSBEYXRlLm5vdygpIC0gZHQ7XHJcblx0XHRcdGxldCBzcGxpdCA9IChuOiBudW1iZXIsIGQ6IG51bWJlcikgPT4gW24gJSBkLCB+fihuIC8gZCldO1xyXG5cdFx0XHRsZXQgdG8yID0gKG46IG51bWJlcikgPT4gKG4gKyAnJykucGFkU3RhcnQoMiwgJzAnKTtcclxuXHRcdFx0dmFyIFttcywgc10gPSBzcGxpdChkdCwgMTAwMCk7XHJcblx0XHRcdHZhciBbcywgbV0gPSBzcGxpdChzLCA2MCk7XHJcblx0XHRcdHZhciBbbSwgaF0gPSBzcGxpdChtLCA2MCk7XHJcblx0XHRcdHZhciBbaCwgZF0gPSBzcGxpdChoLCAyNCk7XHJcblx0XHRcdHZhciBbZCwgd10gPSBzcGxpdChkLCA3KTtcclxuXHRcdFx0cmV0dXJuIHcgPiAxZTMgPyAnZm9yZXZlcicgOiB3ID8gYCR7d313JHtkfWRgIDogZCA/IGAke2R9ZCR7dG8yKGgpfWhgIDogaCArIG0gPyBgJHt0bzIoaCl9OiR7dG8yKG0pfToke3RvMihzKX1gIDogYCR7cyArIH5+bXMgLyAxMDAwfXNgO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBpc1N0YWxlKGNhY2hlZEF0OiBudW1iZXIsIG1heEFnZT86IGRlbHRhVGltZSkge1xyXG5cdFx0XHRpZiAobWF4QWdlID09IG51bGwpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIERhdGUubm93KCkgLSBjYWNoZWRBdCA+PSBub3JtYWxpemVEZWx0YVRpbWUobWF4QWdlKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FjaGVkKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdEV4ID0ge30pOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcblx0XHRcdGxldCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHRcdFx0bGV0IGNhY2hlID0gYXdhaXQgb3BlbkNhY2hlKCk7XHJcblx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGNhY2hlLm1hdGNoKHVybCk7XHJcblx0XHRcdGlmIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdHJlc3BvbnNlLmNhY2hlZEF0ID0gK3Jlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjYWNoZWQtYXQnKSB8fCAwO1xyXG5cdFx0XHRcdGlmICghaXNTdGFsZShyZXNwb25zZS5jYWNoZWRBdCwgbm9ybWFsaXplRGVsdGFUaW1lKGluaXQubWF4QWdlKSkpIHtcclxuXHRcdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgQ2FjaGVkIHJlc3BvbnNlOiAke3RvRHVyKHJlc3BvbnNlLmNhY2hlZEF0KX0gPCBjOiR7dG9EdXIoaW5pdC5tYXhBZ2UpfWAsIHVybCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgU3RhbGUgcmVzcG9uc2U6ICR7dG9EdXIocmVzcG9uc2UuY2FjaGVkQXQpfSA+IGM6JHt0b0R1cihpbml0Lm1heEFnZSl9YCwgdXJsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXNwb25zZSA9XHJcblx0XHRcdFx0IWluaXQueG1sID8gYXdhaXQgZmV0Y2godXJsLCB7IC4uLmRlZmF1bHRzLCAuLi5pbml0IH0pXHJcblx0XHRcdFx0XHQ6IGF3YWl0IHhtbFJlc3BvbnNlKHVybCwgaW5pdCk7XHJcblx0XHRcdGlmIChyZXNwb25zZS5vaykge1xyXG5cdFx0XHRcdHJlc3BvbnNlLmNhY2hlZEF0ID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0XHRsZXQgY2xvbmUgPSByZXNwb25zZS5jbG9uZSgpO1xyXG5cdFx0XHRcdGxldCBpbml0MjogUmVzcG9uc2VJbml0ID0ge1xyXG5cdFx0XHRcdFx0c3RhdHVzOiBjbG9uZS5zdGF0dXMsIHN0YXR1c1RleHQ6IGNsb25lLnN0YXR1c1RleHQsXHJcblx0XHRcdFx0XHRoZWFkZXJzOiBbWydjYWNoZWQtYXQnLCBgJHtyZXNwb25zZS5jYWNoZWRBdH1gXSwgLi4uY2xvbmUuaGVhZGVycy5lbnRyaWVzKCldXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRsZXQgcmVzdWx0UmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoY2xvbmUuYm9keSwgaW5pdDIpO1xyXG5cdFx0XHRcdGNhY2hlLnB1dCh1cmwsIHJlc3VsdFJlc3BvbnNlKTtcclxuXHRcdFx0XHRsZXQgZHQgPSBwZXJmb3JtYW5jZS5ub3coKSAtIG5vdztcclxuXHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYExvYWRlZCByZXNwb25zZTogJHt0b0R1cihkdCl9IC8gYzoke3RvRHVyKGluaXQubWF4QWdlKX1gLCB1cmwpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgRmFpbGVkIHJlc3BvbnNlOiAke3RvRHVyKHJlc3BvbnNlLmNhY2hlZEF0KX0gLyBjOiR7dG9EdXIoaW5pdC5tYXhBZ2UpfWAsIHVybCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYWNoZWREb2ModXJsOiBzdHJpbmcsIGluaXQ6IFJlcXVlc3RJbml0RXggPSB7fSk6IFByb21pc2U8RG9jdW1lbnQ+IHtcclxuXHRcdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgY2FjaGVkKHVybCwgaW5pdCk7XHJcblx0XHRcdGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG5cdFx0XHRsZXQgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG5cdFx0XHRsZXQgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAndGV4dC9odG1sJyk7XHJcblx0XHRcdGxldCBiYXNlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2Jhc2UnKTtcclxuXHRcdFx0YmFzZS5ocmVmID0gdXJsO1xyXG5cdFx0XHRkb2MuaGVhZC5hcHBlbmQoYmFzZSk7XHJcblx0XHRcdGRvYy5jYWNoZWRBdCA9IHJlc3BvbnNlLmNhY2hlZEF0O1xyXG5cdFx0XHRyZXR1cm4gZG9jO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gZG9jKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdEV4ID0ge30pOiBQcm9taXNlPERvY3VtZW50PiB7XHJcblx0XHRcdGxldCByZXNwb25zZSA9XHJcblx0XHRcdFx0IWluaXQueG1sID8gYXdhaXQgZmV0Y2godXJsLCB7IC4uLmRlZmF1bHRzLCAuLi5pbml0IH0pXHJcblx0XHRcdFx0XHQ6IGF3YWl0IHhtbFJlc3BvbnNlKHVybCwgaW5pdCk7XHJcblx0XHRcdGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG5cdFx0XHRsZXQgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG5cdFx0XHRsZXQgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAndGV4dC9odG1sJyk7XHJcblx0XHRcdGxldCBiYXNlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2Jhc2UnKTtcclxuXHRcdFx0YmFzZS5ocmVmID0gdXJsO1xyXG5cdFx0XHRkb2MuaGVhZC5hcHBlbmQoYmFzZSk7XHJcblx0XHRcdGRvYy5jYWNoZWRBdCA9IHJlc3BvbnNlLmNhY2hlZEF0O1xyXG5cdFx0XHRyZXR1cm4gZG9jO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiB4bWxSZXNwb25zZSh1cmw6IHN0cmluZywgaW5pdDogUmVxdWVzdEluaXRFeCA9IHt9KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG5cdFx0XHRsZXQgcCA9IFByb21pc2VFeHRlbnNpb24uZW1wdHk8UHJvZ3Jlc3NFdmVudDxFdmVudFRhcmdldD4+KCk7XHJcblx0XHRcdGxldCBvUmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdG9SZXEub25sb2FkID0gcC5yO1xyXG5cdFx0XHRvUmVxLnJlc3BvbnNlVHlwZSA9ICdkb2N1bWVudCc7XHJcblx0XHRcdG9SZXEub3BlbihcImdldFwiLCB1cmwsIHRydWUpO1xyXG5cdFx0XHRvUmVxLnNlbmQoKTtcclxuXHRcdFx0YXdhaXQgcDtcclxuXHRcdFx0aWYgKG9SZXEucmVzcG9uc2VUeXBlICE9ICdkb2N1bWVudCcpIHRocm93IG5ldyBFcnJvcignRklYTUUnKTtcclxuXHRcdFx0cmV0dXJuIG5ldyBSZXNwb25zZShvUmVxLnJlc3BvbnNlWE1MLmRvY3VtZW50RWxlbWVudC5vdXRlckhUTUwsIGluaXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBqc29uKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdCA9IHt9KTogUHJvbWlzZTx1bmtub3duPiB7XHJcblx0XHRcdHJldHVybiBmZXRjaCh1cmwsIHsgLi4uZGVmYXVsdHMsIC4uLmluaXQgfSkudGhlbihlID0+IGUuanNvbigpKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xlYXJDYWNoZSgpIHtcclxuXHRcdFx0Y2FjaGUgPSBudWxsO1xyXG5cdFx0XHRyZXR1cm4gY2FjaGVzLmRlbGV0ZSgnZmV0Y2gnKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gdW5jYWNoZSh1cmw6IHN0cmluZykge1xyXG5cdFx0XHRsZXQgY2FjaGUgPSBhd2FpdCBvcGVuQ2FjaGUoKTtcclxuXHRcdFx0bGV0IGQxID0gY2FjaGUuZGVsZXRlKHVybCk7XHJcblx0XHRcdGxldCBkMiA9IGF3YWl0IGlkYkRlbGV0ZSh1cmwpO1xyXG5cdFx0XHRyZXR1cm4gKGF3YWl0IGQxKSB8fCBkMjtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNDYWNoZWQodXJsOiBzdHJpbmcsIG9wdGlvbnM6IHsgbWF4QWdlPzogZGVsdGFUaW1lLCBpbmRleGVkRGI/OiBib29sZWFuIHwgJ29ubHknIH0gPSB7fSk6IFByb21pc2U8Ym9vbGVhbiB8ICdpZGInPiB7XHJcblx0XHRcdGlmIChvcHRpb25zLmluZGV4ZWREYikge1xyXG5cdFx0XHRcdGxldCBkYkpzb24gPSBhd2FpdCBpZGJHZXQodXJsKTtcclxuXHRcdFx0XHRpZiAoZGJKc29uKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gaXNTdGFsZShkYkpzb24uY2FjaGVkQXQsIG5vcm1hbGl6ZURlbHRhVGltZShvcHRpb25zLm1heEFnZSkpID8gZmFsc2UgOiAnaWRiJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5kZXhlZERiID09ICdvbmx5JykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBjYWNoZSA9IGF3YWl0IG9wZW5DYWNoZSgpO1xyXG5cdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBjYWNoZS5tYXRjaCh1cmwpO1xyXG5cdFx0XHRpZiAoIXJlc3BvbnNlKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChvcHRpb25zPy5tYXhBZ2UgIT0gbnVsbCkge1xyXG5cdFx0XHRcdGxldCBjYWNoZWRBdCA9ICtyZXNwb25zZS5oZWFkZXJzLmdldCgnY2FjaGVkLWF0JykgfHwgMDtcclxuXHRcdFx0XHRpZiAoaXNTdGFsZShyZXNwb25zZS5jYWNoZWRBdCwgbm9ybWFsaXplRGVsdGFUaW1lKG9wdGlvbnMubWF4QWdlKSkpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FjaGVkSnNvbih1cmw6IHN0cmluZywgaW5pdDogUmVxdWVzdEluaXRFeEpzb24gPSB7fSk6IFByb21pc2U8dW5rbm93bj4ge1xyXG5cdFx0XHRpZiAoaW5pdC5pbmRleGVkRGIpIHtcclxuXHRcdFx0XHRsZXQgZGJKc29uID0gYXdhaXQgaWRiR2V0KHVybCk7XHJcblx0XHRcdFx0aWYgKGRiSnNvbikge1xyXG5cdFx0XHRcdFx0aWYgKCFpc1N0YWxlKGRiSnNvbi5jYWNoZWRBdCwgaW5pdC5tYXhBZ2UpKSB7XHJcblx0XHRcdFx0XHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZShkYkpzb24uZGF0YSBhcyBhbnksICdjYWNoZWQnLCBkYkpzb24uY2FjaGVkQXQpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZGJKc29uLmRhdGE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGNhY2hlZCh1cmwsIGluaXQpO1xyXG5cdFx0XHRsZXQganNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHRcdFx0aWYgKCEoJ2NhY2hlZCcgaW4ganNvbikpIHtcclxuXHRcdFx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUoanNvbiwgJ2NhY2hlZCcsIHJlc3BvbnNlLmNhY2hlZEF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaW5pdC5pbmRleGVkRGIpIHtcclxuXHRcdFx0XHRpZGJQdXQodXJsLCBqc29uLCByZXNwb25zZS5jYWNoZWRBdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGpzb247XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGxldCBfaWRiSW5zdGFuY2VQcm9taXNlOiBJREJEYXRhYmFzZSB8IFByb21pc2U8SURCRGF0YWJhc2U+ID0gbnVsbDtcclxuXHRcdGxldCBpZGJJbnN0YW5jZTogSURCRGF0YWJhc2UgPSBudWxsO1xyXG5cclxuXHRcdGFzeW5jIGZ1bmN0aW9uIG9wZW5JZGIoKTogUHJvbWlzZTxJREJEYXRhYmFzZT4ge1xyXG5cdFx0XHRpZiAoaWRiSW5zdGFuY2UpIHJldHVybiBpZGJJbnN0YW5jZTtcclxuXHRcdFx0aWYgKGF3YWl0IF9pZGJJbnN0YW5jZVByb21pc2UpIHtcclxuXHRcdFx0XHRyZXR1cm4gaWRiSW5zdGFuY2U7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGlycSA9IGluZGV4ZWREQi5vcGVuKCdmZXRjaCcpO1xyXG5cdFx0XHRpcnEub251cGdyYWRlbmVlZGVkID0gZXZlbnQgPT4ge1xyXG5cdFx0XHRcdGxldCBkYiA9IGlycS5yZXN1bHQ7XHJcblx0XHRcdFx0bGV0IHN0b3JlID0gZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ2ZldGNoJywgeyBrZXlQYXRoOiAndXJsJyB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRfaWRiSW5zdGFuY2VQcm9taXNlID0gbmV3IFByb21pc2UoKHIsIGopID0+IHtcclxuXHRcdFx0XHRpcnEub25zdWNjZXNzID0gcjtcclxuXHRcdFx0XHRpcnEub25lcnJvciA9IGo7XHJcblx0XHRcdH0pLnRoZW4oKCkgPT4gaXJxLnJlc3VsdCwgKCkgPT4gbnVsbCk7XHJcblx0XHRcdGlkYkluc3RhbmNlID0gX2lkYkluc3RhbmNlUHJvbWlzZSA9IGF3YWl0IF9pZGJJbnN0YW5jZVByb21pc2U7XHJcblx0XHRcdGlmICghaWRiSW5zdGFuY2UpIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIG9wZW4gaW5kZXhlZERCJyk7XHJcblx0XHRcdHJldHVybiBpZGJJbnN0YW5jZTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gaWRiQ2xlYXIoKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignVE9ETycpXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGFzeW5jIGZ1bmN0aW9uIGlkYkdldCh1cmw6IHN0cmluZyk6IFByb21pc2U8eyB1cmw6IHN0cmluZywgZGF0YTogdW5rbm93biwgY2FjaGVkQXQ6IG51bWJlciB9IHwgdW5kZWZpbmVkPiB7XHJcblx0XHRcdGxldCBkYiA9IGF3YWl0IG9wZW5JZGIoKTtcclxuXHRcdFx0bGV0IHQgPSBkYi50cmFuc2FjdGlvbihbJ2ZldGNoJ10sICdyZWFkb25seScpO1xyXG5cdFx0XHRsZXQgcnEgPSB0Lm9iamVjdFN0b3JlKCdmZXRjaCcpLmdldCh1cmwpO1xyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UociA9PiB7XHJcblx0XHRcdFx0cnEub25zdWNjZXNzID0gKCkgPT4gcihycS5yZXN1bHQpO1xyXG5cdFx0XHRcdHJxLm9uZXJyb3IgPSAoKSA9PiByKHVuZGVmaW5lZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGFzeW5jIGZ1bmN0aW9uIGlkYlB1dCh1cmw6IHN0cmluZywgZGF0YTogdW5rbm93biwgY2FjaGVkQXQ/OiBudW1iZXIpOiBQcm9taXNlPElEQlZhbGlkS2V5IHwgdW5kZWZpbmVkPiB7XHJcblx0XHRcdGxldCBkYiA9IGF3YWl0IG9wZW5JZGIoKTtcclxuXHRcdFx0bGV0IHQgPSBkYi50cmFuc2FjdGlvbihbJ2ZldGNoJ10sICdyZWFkd3JpdGUnKTtcclxuXHRcdFx0bGV0IHJxID0gdC5vYmplY3RTdG9yZSgnZmV0Y2gnKS5wdXQoeyB1cmwsIGRhdGEsIGNhY2hlZEF0OiBjYWNoZWRBdCA/PyArbmV3IERhdGUoKSB9KTtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHIgPT4ge1xyXG5cdFx0XHRcdHJxLm9uc3VjY2VzcyA9ICgpID0+IHIocnEucmVzdWx0KTtcclxuXHRcdFx0XHRycS5vbmVycm9yID0gKCkgPT4gcih1bmRlZmluZWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRhc3luYyBmdW5jdGlvbiBpZGJEZWxldGUodXJsOiBzdHJpbmcpOiBQcm9taXNlPElEQlZhbGlkS2V5IHwgdW5kZWZpbmVkPiB7XHJcblx0XHRcdGxldCBkYiA9IGF3YWl0IG9wZW5JZGIoKTtcclxuXHRcdFx0bGV0IHQgPSBkYi50cmFuc2FjdGlvbihbJ2ZldGNoJ10sICdyZWFkd3JpdGUnKTtcclxuXHRcdFx0bGV0IHJxID0gdC5vYmplY3RTdG9yZSgnZmV0Y2gnKS5kZWxldGUodXJsKTtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHIgPT4ge1xyXG5cdFx0XHRcdHJxLm9uc3VjY2VzcyA9ICgpID0+IHIocnEucmVzdWx0KTtcclxuXHRcdFx0XHRycS5vbmVycm9yID0gKCkgPT4gcih1bmRlZmluZWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIEVudHJ5RmlsdGVyZXJFeHRlbnNpb24ge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogY2FuIGJlIGVpdGhlciBNYXAgb3IgV2Vha01hcFxyXG5cdFx0ICogKFdlYWtNYXAgaXMgbGlrZWx5IHRvIGJlIHVzZWxlc3MgaWYgdGhlcmUgYXJlIGxlc3MgdGhlbiAxMGsgb2xkIG5vZGVzIGluIG1hcClcclxuXHRcdCAqL1xyXG5cdFx0bGV0IE1hcFR5cGUgPSBNYXA7XHJcblx0XHR0eXBlIE1hcFR5cGU8SyBleHRlbmRzIG9iamVjdCwgVj4gPS8vIE1hcDxLLCBWPiB8IFxyXG5cdFx0XHRXZWFrTWFwPEssIFY+O1xyXG5cclxuXHRcdGZ1bmN0aW9uIHRvRWxBcnJheShlbnRyeVNlbGVjdG9yOiBzZWxlY3RvciB8ICgoKSA9PiBIVE1MRWxlbWVudFtdKSk6IEhUTUxFbGVtZW50W10ge1xyXG5cdFx0XHRyZXR1cm4gdHlwZW9mIGVudHJ5U2VsZWN0b3IgPT0gJ2Z1bmN0aW9uJyA/IGVudHJ5U2VsZWN0b3IoKSA6IHFxKGVudHJ5U2VsZWN0b3IpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBFbnRyeUZpbHRlcmVyPERhdGEgZXh0ZW5kcyB7fSA9IHt9PiB7XHJcblx0XHRcdGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcblx0XHRcdGVudHJ5U2VsZWN0b3I6IHNlbGVjdG9yIHwgKCgpID0+IEhUTUxFbGVtZW50W10pO1xyXG5cdFx0XHRjb25zdHJ1Y3RvcihlbnRyeVNlbGVjdG9yOiBzZWxlY3RvciB8ICgoKSA9PiBIVE1MRWxlbWVudFtdKSwgZW5hYmxlZDogYm9vbGVhbiB8ICdzb2Z0JyA9ICdzb2Z0Jykge1xyXG5cdFx0XHRcdHRoaXMuZW50cnlTZWxlY3RvciA9IGVudHJ5U2VsZWN0b3I7XHJcblx0XHRcdFx0dGhpcy5jb250YWluZXIgPSBlbG0oJy5lZi1jb250YWluZXInKTtcclxuXHJcblx0XHRcdFx0aWYgKGVuYWJsZWQgPT0gJ3NvZnQnKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNvZnREaXNhYmxlID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHRoaXMuZGlzYWJsZSgnc29mdCcpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZW5hYmxlZCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zb2Z0RGlzYWJsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBlbmFibGVkIGlzIGZhbHN5XHJcblx0XHRcdFx0XHR0aGlzLnNvZnREaXNhYmxlID0gZmFsc2U7XHJcblx0XHRcdFx0XHR0aGlzLmRpc2FibGUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5zdHlsZSgpO1xyXG5cclxuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI8UGFnaW5hdGVFeHRlbnNpb24uUE1vZGlmeUV2ZW50PigncGFnaW5hdGlvbm1vZGlmeScsICgpID0+IHRoaXMucmVxdWVzdFVwZGF0ZSgpKTtcclxuXHRcdFx0XHRldGMub25oZWlnaHRjaGFuZ2UoKCkgPT4gdGhpcy5yZXF1ZXN0VXBkYXRlKCkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRlbnRyaWVzOiBIVE1MRWxlbWVudFtdID0gW107XHJcblx0XHRcdGVudHJ5RGF0YXM6IE1hcFR5cGU8SFRNTEVsZW1lbnQsIERhdGE+ID0gbmV3IE1hcFR5cGUoKTtcclxuXHJcblx0XHRcdGdldERhdGEoZWw6IEhUTUxFbGVtZW50KTogRGF0YTtcclxuXHRcdFx0Z2V0RGF0YSgpOiBEYXRhW107XHJcblx0XHRcdGdldERhdGEoZWw/OiBIVE1MRWxlbWVudCk6IERhdGEgfCBEYXRhW10ge1xyXG5cdFx0XHRcdGlmICghZWwpIHJldHVybiB0aGlzLmVudHJpZXMubWFwKGUgPT4gdGhpcy5nZXREYXRhKGUpKTtcclxuXHRcdFx0XHRsZXQgZGF0YSA9IHRoaXMuZW50cnlEYXRhcy5nZXQoZWwpO1xyXG5cdFx0XHRcdGlmICghZGF0YSkge1xyXG5cdFx0XHRcdFx0ZGF0YSA9IHRoaXMucGFyc2VFbnRyeShlbCk7XHJcblx0XHRcdFx0XHR0aGlzLmVudHJ5RGF0YXMuc2V0KGVsLCBkYXRhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHVwZGF0ZVBlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0cmVwYXJzZVBlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0cmVxdWVzdFVwZGF0ZShyZXBhcnNlID0gZmFsc2UpIHtcclxuXHRcdFx0XHRpZiAodGhpcy51cGRhdGVQZW5kaW5nKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy51cGRhdGVQZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAocmVwYXJzZSkgdGhpcy5yZXBhcnNlUGVuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cGFyc2VyczogUGFyc2VyRm48RGF0YT5bXSA9IFtdO1xyXG5cdFx0XHR3cml0ZURhdGFBdHRyaWJ1dGUgPSBmYWxzZTtcclxuXHRcdFx0YWRkUGFyc2VyKHBhcnNlcjogUGFyc2VyRm48RGF0YT4pIHtcclxuXHRcdFx0XHR0aGlzLnBhcnNlcnMucHVzaChwYXJzZXIpO1xyXG5cdFx0XHRcdHRoaXMucmVxdWVzdFVwZGF0ZSh0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRwYXJzZUVudHJ5KGVsOiBIVE1MRWxlbWVudCk6IERhdGEge1xyXG5cdFx0XHRcdGVsLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZWYtZW50cnktY29udGFpbmVyJyk7XHJcblx0XHRcdFx0ZWwuY2xhc3NMaXN0LmFkZCgnZWYtZW50cnknKTtcclxuXHJcblx0XHRcdFx0bGV0IGRhdGE6IERhdGEgPSB7fSBhcyBEYXRhO1xyXG5cdFx0XHRcdGZvciAobGV0IHBhcnNlciBvZiB0aGlzLnBhcnNlcnMpIHtcclxuXHRcdFx0XHRcdGxldCBuZXdEYXRhID0gcGFyc2VyKGVsLCBkYXRhKTtcclxuXHRcdFx0XHRcdGlmICghbmV3RGF0YSB8fCBuZXdEYXRhID09IGRhdGEpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0aWYgKCFJc1Byb21pc2UobmV3RGF0YSkpIHtcclxuXHRcdFx0XHRcdFx0T2JqZWN0LmFzc2lnbihkYXRhLCBuZXdEYXRhKTtcclxuXHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdEYXRhLnRoZW4ocE5ld0RhdGEgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZiAocE5ld0RhdGEgJiYgcE5ld0RhdGEgIT0gZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdE9iamVjdC5hc3NpZ24oZGF0YSwgcE5ld0RhdGEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoaXMucmVxdWVzdFVwZGF0ZSgpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMud3JpdGVEYXRhQXR0cmlidXRlKSB7XHJcblx0XHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoJ2VmLWRhdGEnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhZGRJdGVtPElULCBUIGV4dGVuZHMgSVQsIElTIGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCwgUywgVFMgZXh0ZW5kcyBTICYgSVMgJiBGaWx0ZXJlckl0ZW1Tb3VyY2U+KGNvbnN0cnVjdG9yOiB7IG5ldyhkYXRhOiBUUyk6IFQgfSwgbGlzdDogSVRbXSwgZGF0YTogSVMsIHNvdXJjZTogUyk6IFQge1xyXG5cdFx0XHRcdE9iamVjdC5hc3NpZ24oZGF0YSwgc291cmNlLCB7IHBhcmVudDogdGhpcyB9KTtcclxuXHRcdFx0XHRkYXRhLm5hbWUgPz89IGRhdGEuaWQ7XHJcblx0XHRcdFx0bGV0IGl0ZW0gPSBuZXcgY29uc3RydWN0b3IoZGF0YSBhcyBUUyk7XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmaWx0ZXJzOiBJRmlsdGVyPERhdGE+W10gPSBbXTtcclxuXHRcdFx0c29ydGVyczogSVNvcnRlcjxEYXRhPltdID0gW107XHJcblx0XHRcdG1vZGlmaWVyczogSU1vZGlmaWVyPERhdGE+W10gPSBbXTtcclxuXHJcblx0XHRcdGdldCBieU5hbWUoKSB7XHJcblx0XHRcdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oXHJcblx0XHRcdFx0XHRPYmplY3QuZnJvbUVudHJpZXModGhpcy5maWx0ZXJzLm1hcChlID0+IFtlLmlkLCBlXSkpLFxyXG5cdFx0XHRcdFx0T2JqZWN0LmZyb21FbnRyaWVzKHRoaXMuc29ydGVycy5tYXAoZSA9PiBbZS5pZCwgZV0pKSxcclxuXHRcdFx0XHRcdE9iamVjdC5mcm9tRW50cmllcyh0aGlzLm1vZGlmaWVycy5tYXAoZSA9PiBbZS5pZCwgZV0pKSxcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0ZmlsdGVyczogT2JqZWN0LmZyb21FbnRyaWVzKHRoaXMuZmlsdGVycy5tYXAoZSA9PiBbZS5pZCwgZV0pKSxcclxuXHRcdFx0XHRcdFx0c29ydGVyczogT2JqZWN0LmZyb21FbnRyaWVzKHRoaXMuc29ydGVycy5tYXAoZSA9PiBbZS5pZCwgZV0pKSxcclxuXHRcdFx0XHRcdFx0bW9kaWZpZXJzOiBPYmplY3QuZnJvbUVudHJpZXModGhpcy5tb2RpZmllcnMubWFwKGUgPT4gW2UuaWQsIGVdKSksXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFkZEZpbHRlcihpZDogc3RyaW5nLCBmaWx0ZXI6IEZpbHRlckZuPERhdGE+LCBkYXRhOiBGaWx0ZXJQYXJ0aWFsPERhdGE+ID0ge30pOiBGaWx0ZXI8RGF0YT4ge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oRmlsdGVyLCB0aGlzLmZpbHRlcnMsIGRhdGEsIHsgaWQsIGZpbHRlciB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRWRmlsdGVyPFYgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+KGlkOiBzdHJpbmcsIGZpbHRlcjogVmFsdWVGaWx0ZXJGbjxEYXRhLCBWPiwgZGF0YTogVmFsdWVGaWx0ZXJQYXJ0aWFsPERhdGEsIFY+KTogVmFsdWVGaWx0ZXI8RGF0YSwgVj47XHJcblx0XHRcdGFkZFZGaWx0ZXI8ViBleHRlbmRzIG51bWJlciB8IHN0cmluZz4oaWQ6IHN0cmluZywgZmlsdGVyOiBWYWx1ZUZpbHRlckZuPERhdGEsIFY+LCBkYXRhOiBWKTtcclxuXHRcdFx0YWRkVkZpbHRlcjxWIGV4dGVuZHMgbnVtYmVyIHwgc3RyaW5nPihpZDogc3RyaW5nLCBmaWx0ZXI6IFZhbHVlRmlsdGVyRm48RGF0YSwgVj4sIGRhdGE6IFZhbHVlRmlsdGVyUGFydGlhbDxEYXRhLCBWPiB8IFYpIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGRhdGEgIT0gJ29iamVjdCcgfHwgIWRhdGEpIHtcclxuXHRcdFx0XHRcdGRhdGEgPSB7IGlucHV0OiBkYXRhIGFzIFYgfTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShWYWx1ZUZpbHRlciwgdGhpcy5maWx0ZXJzLCBkYXRhLCB7IGlkLCBmaWx0ZXIgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkTUZpbHRlcihpZDogc3RyaW5nLCB2YWx1ZTogKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkgPT4gc3RyaW5nLCBkYXRhOiBNYXRjaEZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oTWF0Y2hGaWx0ZXIsIHRoaXMuZmlsdGVycywgZGF0YSwgeyBpZCwgdmFsdWUgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkVGFnRmlsdGVyKGlkOiBzdHJpbmcsIGRhdGE6IFRhZ0ZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oVGFnRmlsdGVyLCB0aGlzLmZpbHRlcnMsIGRhdGEsIHsgaWQgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkU29ydGVyPFYgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+KGlkOiBzdHJpbmcsIHNvcnRlcjogU29ydGVyRm48RGF0YSwgVj4sIGRhdGE6IFNvcnRlclBhcnRpYWxTb3VyY2U8RGF0YSwgVj4gPSB7fSk6IFNvcnRlcjxEYXRhLCBWPiB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShTb3J0ZXIsIHRoaXMuc29ydGVycywgZGF0YSwgeyBpZCwgc29ydGVyIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZE1vZGlmaWVyKGlkOiBzdHJpbmcsIG1vZGlmaWVyOiBNb2RpZmllckZuPERhdGE+LCBkYXRhOiBNb2RpZmllclBhcnRpYWw8RGF0YT4gPSB7fSk6IE1vZGlmaWVyPERhdGE+IHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKE1vZGlmaWVyLCB0aGlzLm1vZGlmaWVycywgZGF0YSwgeyBpZCwgbW9kaWZpZXIgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkUHJlZml4KGlkOiBzdHJpbmcsIHByZWZpeDogUHJlZml4ZXJGbjxEYXRhPiwgZGF0YTogUHJlZml4ZXJQYXJ0aWFsPERhdGE+ID0ge30pOiBQcmVmaXhlcjxEYXRhPiB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShQcmVmaXhlciwgdGhpcy5tb2RpZmllcnMsIGRhdGEsIHsgaWQsIHByZWZpeCB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRQYWdpbmF0aW9uSW5mbyhpZDogc3RyaW5nID0gJ3BnaW5mbycsIGRhdGE6IFBhcnRpYWw8RmlsdGVyZXJJdGVtU291cmNlPiA9IHt9KSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShQYWdpbmF0aW9uSW5mb0ZpbHRlciwgdGhpcy5maWx0ZXJzLCBkYXRhLCB7IGlkIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmaWx0ZXJFbnRyaWVzKCkge1xyXG5cdFx0XHRcdGZvciAobGV0IGVsIG9mIHRoaXMuZW50cmllcykge1xyXG5cdFx0XHRcdFx0bGV0IGRhdGEgPSB0aGlzLmdldERhdGEoZWwpO1xyXG5cdFx0XHRcdFx0bGV0IHZhbHVlID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGZvciAobGV0IGZpbHRlciBvZiB0aGlzLmZpbHRlcnMpIHtcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZSAmJiBmaWx0ZXIuYXBwbHkoZGF0YSwgZWwpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWwuY2xhc3NMaXN0LnRvZ2dsZSgnZWYtZmlsdGVyZWQtb3V0JywgIXZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdF9wcmV2aW91c1N0YXRlID0ge1xyXG5cdFx0XHRcdGFsbFNvcnRlcnNPZmY6IHRydWUsXHJcblx0XHRcdFx0dXBkYXRlRHVyYXRpb246IDAsXHJcblx0XHRcdFx0ZmluaXNoZWRBdDogMCxcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdG9yZGVyZWRFbnRyaWVzOiBIVE1MRWxlbWVudFtdID0gW107XHJcblx0XHRcdG9yZGVyTW9kZTogJ2NzcycgfCAnc3dhcCcgPSAnY3NzJztcclxuXHRcdFx0c29ydEVudHJpZXMoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZW50cmllcy5sZW5ndGggPD0gMSkgcmV0dXJuO1xyXG5cdFx0XHRcdGlmICh0aGlzLm9yZGVyZWRFbnRyaWVzLmxlbmd0aCA9PSAwKSB0aGlzLm9yZGVyZWRFbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xyXG5cdFx0XHRcdGlmICh0aGlzLnNvcnRlcnMubGVuZ3RoID09IDApIHJldHVybjtcclxuXHJcblx0XHRcdFx0bGV0IGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XHJcblx0XHRcdFx0bGV0IHBhaXJzOiBbRGF0YSwgSFRNTEVsZW1lbnRdW10gPSBlbnRyaWVzLm1hcChlID0+IFt0aGlzLmdldERhdGEoZSksIGVdKTtcclxuXHRcdFx0XHRsZXQgYWxsT2ZmID0gdHJ1ZTtcclxuXHRcdFx0XHRmb3IgKGxldCBzb3J0ZXIgb2YgdGhpcy5zb3J0ZXJzKSB7XHJcblx0XHRcdFx0XHRpZiAoc29ydGVyLm1vZGUgIT0gJ29mZicpIHtcclxuXHRcdFx0XHRcdFx0cGFpcnMgPSBzb3J0ZXIuc29ydChwYWlycyk7XHJcblx0XHRcdFx0XHRcdGFsbE9mZiA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbnRyaWVzID0gcGFpcnMubWFwKGUgPT4gZVsxXSk7XHJcblx0XHRcdFx0aWYgKHRoaXMub3JkZXJNb2RlID09ICdzd2FwJykge1xyXG5cdFx0XHRcdFx0aWYgKCFlbnRyaWVzLmV2ZXJ5KChlLCBpKSA9PiBlID09IHRoaXMub3JkZXJlZEVudHJpZXNbaV0pKSB7XHJcblx0XHRcdFx0XHRcdGxldCBiciA9IGVsbShgJHtlbnRyaWVzWzBdPy50YWdOYW1lfS5lZi1iZWZvcmUtc29ydFtoaWRkZW5dYCk7XHJcblx0XHRcdFx0XHRcdHRoaXMub3JkZXJlZEVudHJpZXNbMF0uYmVmb3JlKGJyKTtcclxuXHRcdFx0XHRcdFx0YnIuYWZ0ZXIoLi4uZW50cmllcyk7XHJcblx0XHRcdFx0XHRcdGJyLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoYWxsT2ZmICE9IHRoaXMuX3ByZXZpb3VzU3RhdGUuYWxsU29ydGVyc09mZikge1xyXG5cdFx0XHRcdFx0XHRlbnRyaWVzLm1hcCgoZSwgaSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChhbGxPZmYpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGUuY2xhc3NMaXN0LnJlbW92ZSgnZWYtcmVvcmRlcicpO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2VmLXJlb3JkZXItY29udGFpbmVyJyk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIHVzZSBgZmxleGAgb3IgYGdyaWRgIGNvbnRhaW5lciBhbmQgYG9yZGVyOnZhcigtLWVmLW9yZGVyKWAgZm9yIGNoaWxkcmVuIFxyXG5cdFx0XHRcdFx0XHRcdFx0ZS5jbGFzc0xpc3QuYWRkKCdlZi1yZW9yZGVyJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRlLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZWYtcmVvcmRlci1jb250YWluZXInKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCFhbGxPZmYpIHtcclxuXHRcdFx0XHRcdFx0ZW50cmllcy5tYXAoKGUsIGkpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRlLnN0eWxlLnNldFByb3BlcnR5KCctLWVmLW9yZGVyJywgaSArICcnKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMub3JkZXJlZEVudHJpZXMgPSBlbnRyaWVzO1xyXG5cdFx0XHRcdHRoaXMuX3ByZXZpb3VzU3RhdGUuYWxsU29ydGVyc09mZiA9IGFsbE9mZjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bW9kaWZ5RW50cmllcygpIHtcclxuXHRcdFx0XHRsZXQgZW50cmllcyA9IHRoaXMuZW50cmllcztcclxuXHRcdFx0XHRsZXQgcGFpcnM6IFtIVE1MRWxlbWVudCwgRGF0YV1bXSA9IGVudHJpZXMubWFwKGUgPT4gW2UsIHRoaXMuZ2V0RGF0YShlKV0pO1xyXG5cdFx0XHRcdGZvciAobGV0IG1vZGlmaWVyIG9mIHRoaXMubW9kaWZpZXJzKSB7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBbZSwgZF0gb2YgcGFpcnMpIHtcclxuXHRcdFx0XHRcdFx0bW9kaWZpZXIuYXBwbHkoZCwgZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtb3ZlVG9Ub3AoaXRlbTogSVNvcnRlcjxEYXRhPiB8IElNb2RpZmllcjxEYXRhPikge1xyXG5cdFx0XHRcdGlmICh0aGlzLnNvcnRlcnMuaW5jbHVkZXMoaXRlbSBhcyBJU29ydGVyPERhdGE+KSkge1xyXG5cdFx0XHRcdFx0dGhpcy5zb3J0ZXJzLnNwbGljZSh0aGlzLnNvcnRlcnMuaW5kZXhPZihpdGVtIGFzIElTb3J0ZXI8RGF0YT4pLCAxKTtcclxuXHRcdFx0XHRcdHRoaXMuc29ydGVycy5wdXNoKGl0ZW0gYXMgSVNvcnRlcjxEYXRhPik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGlmaWVycy5pbmNsdWRlcyhpdGVtIGFzIElNb2RpZmllcjxEYXRhPikpIHtcclxuXHRcdFx0XHRcdHRoaXMubW9kaWZpZXJzLnNwbGljZSh0aGlzLm1vZGlmaWVycy5pbmRleE9mKGl0ZW0gYXMgSU1vZGlmaWVyPERhdGE+KSwgMSk7XHJcblx0XHRcdFx0XHR0aGlzLm1vZGlmaWVycy5wdXNoKGl0ZW0gYXMgSU1vZGlmaWVyPERhdGE+KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZpbmRFbnRyaWVzKCk6IEhUTUxFbGVtZW50W10ge1xyXG5cdFx0XHRcdHJldHVybiB0eXBlb2YgdGhpcy5lbnRyeVNlbGVjdG9yID09ICdmdW5jdGlvbicgPyB0aGlzLmVudHJ5U2VsZWN0b3IoKSA6IHFxKHRoaXMuZW50cnlTZWxlY3Rvcik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHVwZGF0ZShyZXBhcnNlID0gdGhpcy5yZXBhcnNlUGVuZGluZykge1xyXG5cdFx0XHRcdGxldCBlYXJsaWVzdFVwZGF0ZSA9IHRoaXMuX3ByZXZpb3VzU3RhdGUuZmluaXNoZWRBdCArIE1hdGgubWluKDEwMDAwLCA4ICogdGhpcy5fcHJldmlvdXNTdGF0ZS51cGRhdGVEdXJhdGlvbik7XHJcblx0XHRcdFx0aWYgKHBlcmZvcm1hbmNlLm5vdygpIDwgZWFybGllc3RVcGRhdGUpIHtcclxuXHRcdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy51cGRhdGVQZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0aWYgKHRoaXMuZGlzYWJsZWQgPT0gdHJ1ZSkgcmV0dXJuO1xyXG5cdFx0XHRcdGxldCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcblx0XHRcdFx0bGV0IGVudHJpZXMgPSB0aGlzLmZpbmRFbnRyaWVzKCk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmRpc2FibGVkID09ICdzb2Z0Jykge1xyXG5cdFx0XHRcdFx0aWYgKCFlbnRyaWVzLmxlbmd0aCkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBFZiBzb2Z0LWVuYWJsZWQ6IHgwPT54JHtlbnRyaWVzLmxlbmd0aH1gLCB0aGlzLmVudHJ5U2VsZWN0b3IsIHRoaXMpO1xyXG5cdFx0XHRcdFx0dGhpcy5lbmFibGUoKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuZGlzYWJsZWQgIT0gZmFsc2UpIHRocm93IDA7XHJcblxyXG5cdFx0XHRcdGlmICghZW50cmllcy5sZW5ndGggJiYgdGhpcy5zb2Z0RGlzYWJsZSkge1xyXG5cdFx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBFZiBzb2Z0LWRpc2FibGVkOiB4JHt0aGlzLmVuYWJsZS5sZW5ndGh9PT54MGAsIHRoaXMuZW50cnlTZWxlY3RvciwgdGhpcyk7XHJcblx0XHRcdFx0XHR0aGlzLmRpc2FibGUoJ3NvZnQnKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChyZXBhcnNlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmVudHJ5RGF0YXMgPSBuZXcgTWFwVHlwZSgpO1xyXG5cdFx0XHRcdFx0dGhpcy5yZXBhcnNlUGVuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoIXRoaXMuY29udGFpbmVyLmNsb3Nlc3QoJ2JvZHknKSkge1xyXG5cdFx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kVG8oJ2JvZHknKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuZW50cmllcy5sZW5ndGggIT0gZW50cmllcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgRWYgdXBkYXRlOiB4JHt0aGlzLmVudHJpZXMubGVuZ3RofT0+eCR7ZW50cmllcy5sZW5ndGh9YCwgdGhpcy5lbnRyeVNlbGVjdG9yLCB0aGlzKTtcclxuXHRcdFx0XHRcdC8vIHx8IHRoaXMuZW50cmllc1xyXG5cdFx0XHRcdFx0Ly8gVE9ETzogc29ydCBlbnRyaWVzIGluIGluaXRpYWwgb3JkZXJcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5lbnRyaWVzID0gZW50cmllcztcclxuXHRcdFx0XHR0aGlzLmZpbHRlckVudHJpZXMoKTtcclxuXHRcdFx0XHR0aGlzLnNvcnRFbnRyaWVzKCk7XHJcblx0XHRcdFx0dGhpcy5tb2RpZnlFbnRyaWVzKCk7XHJcblx0XHRcdFx0bGV0IHRpbWVVc2VkID0gcGVyZm9ybWFuY2Uubm93KCkgLSBub3c7XHJcblx0XHRcdFx0dGhpcy5fcHJldmlvdXNTdGF0ZS51cGRhdGVEdXJhdGlvbiA9IDEwMDAwO1xyXG5cdFx0XHRcdHRoaXMuX3ByZXZpb3VzU3RhdGUuZmluaXNoZWRBdCA9IHBlcmZvcm1hbmNlLm5vdygpICsgMTAwMDA7XHJcblx0XHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMuX3ByZXZpb3VzU3RhdGUudXBkYXRlRHVyYXRpb24gPSBwZXJmb3JtYW5jZS5ub3coKSAtIG5vdztcclxuXHRcdFx0XHRcdHRoaXMuX3ByZXZpb3VzU3RhdGUuZmluaXNoZWRBdCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRvZmZJbmNvbXBhdGlibGUoaW5jb21wYXRpYmxlOiBzdHJpbmdbXSkge1xyXG5cdFx0XHRcdGZvciAobGV0IGZpbHRlciBvZiB0aGlzLmZpbHRlcnMpIHtcclxuXHRcdFx0XHRcdGlmIChpbmNvbXBhdGlibGUuaW5jbHVkZXMoZmlsdGVyLmlkKSkge1xyXG5cdFx0XHRcdFx0XHRmaWx0ZXIudG9nZ2xlTW9kZSgnb2ZmJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvciAobGV0IHNvcnRlciBvZiB0aGlzLnNvcnRlcnMpIHtcclxuXHRcdFx0XHRcdGlmIChpbmNvbXBhdGlibGUuaW5jbHVkZXMoc29ydGVyLmlkKSkge1xyXG5cdFx0XHRcdFx0XHRzb3J0ZXIudG9nZ2xlTW9kZSgnb2ZmJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvciAobGV0IG1vZGlmaWVyIG9mIHRoaXMubW9kaWZpZXJzKSB7XHJcblx0XHRcdFx0XHRpZiAoaW5jb21wYXRpYmxlLmluY2x1ZGVzKG1vZGlmaWVyLmlkKSkge1xyXG5cdFx0XHRcdFx0XHRtb2RpZmllci50b2dnbGVNb2RlKCdvZmYnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0eWxlKHMgPSAnJykge1xyXG5cdFx0XHRcdEVudHJ5RmlsdGVyZXIuc3R5bGUocyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHRcdFx0c3RhdGljIHN0eWxlKHMgPSAnJykge1xyXG5cdFx0XHRcdGxldCBzdHlsZSA9IHEoJ3N0eWxlLmVmLXN0eWxlJykgfHwgZWxtKCdzdHlsZS5lZi1zdHlsZScpLmFwcGVuZFRvKCdoZWFkJyk7XHJcblx0XHRcdFx0c3R5bGUuaW5uZXJIVE1MID0gYFxyXG5cdFx0XHRcdFx0LmVmLWNvbnRhaW5lciB7XHJcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XHJcblx0XHRcdFx0XHRcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiBmaXhlZDtcclxuXHRcdFx0XHRcdFx0dG9wOiAwO1xyXG5cdFx0XHRcdFx0XHRyaWdodDogMDtcclxuXHRcdFx0XHRcdFx0ei1pbmRleDogOTk5OTk5OTk5OTk5OTk5OTk5OTtcclxuXHRcdFx0XHRcdFx0bWluLXdpZHRoOiAxMDBweDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC5lZi1lbnRyeSB7fVxyXG5cclxuXHRcdFx0XHRcdC5lZi1maWx0ZXJlZC1vdXQge1xyXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0YnV0dG9uLmVmLWl0ZW0ge31cclxuXHRcdFx0XHRcdGJ1dHRvbi5lZi1pdGVtW2VmLW1vZGU9XCJvZmZcIl0ge1xyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiBsaWdodGdyYXk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRidXR0b24uZWYtaXRlbVtlZi1tb2RlPVwib25cIl0ge1xyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiBsaWdodGdyZWVuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnV0dG9uLmVmLWl0ZW1bZWYtbW9kZT1cIm9wcG9zaXRlXCJdIHtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZDogeWVsbG93O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGJ1dHRvbi5lZi1pdGVtLmVmLWZpbHRlciA+IGlucHV0IHtcclxuXHRcdFx0XHRcdFx0ZmxvYXQ6IHJpZ2h0O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFtlZi1wcmVmaXhdOjpiZWZvcmUge1xyXG5cdFx0XHRcdFx0XHRjb250ZW50OiBhdHRyKGVmLXByZWZpeCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRbZWYtcG9zdGZpeF06OmFmdGVyIHtcclxuXHRcdFx0XHRcdFx0Y29udGVudDogYXR0cihlZi1wb3N0Zml4KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdGAgKyBzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzb2Z0RGlzYWJsZSA9IHRydWU7XHJcblx0XHRcdGRpc2FibGVkOiBib29sZWFuIHwgJ3NvZnQnID0gZmFsc2U7XHJcblx0XHRcdGRpc2FibGUoc29mdD86ICdzb2Z0Jykge1xyXG5cdFx0XHRcdHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHRcdGlmIChzb2Z0ID09ICdzb2Z0JykgdGhpcy5kaXNhYmxlZCA9ICdzb2Z0JztcclxuXHRcdFx0XHR0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbmFibGUoKSB7XHJcblx0XHRcdFx0dGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMudXBkYXRlUGVuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMucmVxdWVzdFVwZGF0ZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjbGVhcigpIHtcclxuXHRcdFx0XHR0aGlzLmVudHJ5RGF0YXMgPSBuZXcgTWFwKCk7XHJcblx0XHRcdFx0dGhpcy5wYXJzZXJzLnNwbGljZSgwLCA5OTkpO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVycy5zcGxpY2UoMCwgOTk5KS5tYXAoZSA9PiBlLnJlbW92ZSgpKTtcclxuXHRcdFx0XHR0aGlzLnNvcnRlcnMuc3BsaWNlKDAsIDk5OSkubWFwKGUgPT4gZS5yZW1vdmUoKSk7XHJcblx0XHRcdFx0dGhpcy5tb2RpZmllcnMuc3BsaWNlKDAsIDk5OSkubWFwKGUgPT4gZS5yZW1vdmUoKSk7XHJcblx0XHRcdFx0dGhpcy5lbmFibGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Z2V0IF9kYXRhcygpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5lbnRyaWVzXHJcblx0XHRcdFx0XHQuZmlsdGVyKGUgPT4gIWUuY2xhc3NMaXN0LmNvbnRhaW5zKCdlZi1maWx0ZXJlZC1vdXQnKSlcclxuXHRcdFx0XHRcdC5tYXAoZSA9PiB0aGlzLmdldERhdGEoZSkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIElzUHJvbWlzZTxUPihwOiBQcm9taXNlTGlrZTxUPiB8IFQpOiBwIGlzIFByb21pc2VMaWtlPFQ+IHtcclxuXHRcdFx0aWYgKCFwKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdHJldHVybiB0eXBlb2YgKHAgYXMgUHJvbWlzZUxpa2U8VD4pLnRoZW4gPT0gJ2Z1bmN0aW9uJztcclxuXHRcdH1cclxuXHR9XHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgY2xhc3MgT2JzZXJ2ZXIge1xyXG5cdFx0XHJcblx0fVxyXG59XHJcblxyXG4vKlxyXG5cclxuZnVuY3Rpb24gb2JzZXJ2ZUNsYXNzQWRkKGNscywgY2IpIHtcclxuXHRsZXQgcXVldWVkID0gZmFsc2U7XHJcblx0YXN5bmMgZnVuY3Rpb24gcnVuKCkge1xyXG5cdFx0aWYgKHF1ZXVlZCkgcmV0dXJuO1xyXG5cdFx0cXVldWVkID0gdHJ1ZTtcclxuXHRcdGF3YWl0IFByb21pc2UuZnJhbWUoKTtcclxuXHRcdHF1ZXVlZCA9IGZhbHNlO1xyXG5cdFx0Y2IoKTtcclxuXHR9XHJcblx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIobGlzdCA9PiB7XHJcblx0XHRmb3IgKGxldCBtciBvZiBsaXN0KSB7XHJcblx0XHRcdGlmIChtci50eXBlID09ICdhdHRyaWJ1dGVzJyAmJiBtci5hdHRyaWJ1dGVOYW1lID09ICdjbGFzcycpIHtcclxuXHRcdFx0XHRpZiAobXIudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhjbHMpKSB7XHJcblx0XHRcdFx0XHRydW4oKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG1yLnR5cGUgPT0gJ2NoaWxkTGlzdCcpIHtcclxuXHRcdFx0XHRmb3IgKGxldCBjaCBvZiBtci5hZGRlZE5vZGVzKSB7XHJcblx0XHRcdFx0XHRpZiAoY2guY2xhc3NMaXN0Py5jb250YWlucyhjbHMpKSB7XHJcblx0XHRcdFx0XHRcdHJ1bigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xyXG5cdFx0Y2hpbGRMaXN0OiB0cnVlLFxyXG5cdFx0YXR0cmlidXRlczogdHJ1ZSxcclxuXHRcdHN1YnRyZWU6IHRydWUsXHJcblx0fSk7XHJcbn1cclxuXHJcbiovIiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgUGFnaW5hdGVFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCB0eXBlIFBSZXF1ZXN0RXZlbnQgPSBDdXN0b21FdmVudDx7XHJcblx0XHRcdHJlYXNvbj86IEtleWJvYXJkRXZlbnQgfCBNb3VzZUV2ZW50LFxyXG5cdFx0XHRjb3VudDogbnVtYmVyLFxyXG5cdFx0XHRjb25zdW1lZDogbnVtYmVyLFxyXG5cdFx0XHRfZXZlbnQ/OiAncGFnaW5hdGlvbnJlcXVlc3QnLFxyXG5cdFx0fT47XHJcblx0XHRleHBvcnQgdHlwZSBQU3RhcnRFdmVudCA9IEN1c3RvbUV2ZW50PHtcclxuXHRcdFx0cGFnaW5hdGU6IFBhZ2luYXRlLFxyXG5cdFx0XHRfZXZlbnQ/OiAncGFnaW5hdGlvbnN0YXJ0JyxcclxuXHRcdH0+O1xyXG5cdFx0ZXhwb3J0IHR5cGUgUEVuZEV2ZW50ID0gQ3VzdG9tRXZlbnQ8e1xyXG5cdFx0XHRwYWdpbmF0ZTogUGFnaW5hdGUsXHJcblx0XHRcdF9ldmVudD86ICdwYWdpbmF0aW9uZW5kJyxcclxuXHRcdH0+O1xyXG5cdFx0ZXhwb3J0IHR5cGUgUE1vZGlmeUV2ZW50ID0gQ3VzdG9tRXZlbnQ8e1xyXG5cdFx0XHRwYWdpbmF0ZTogUGFnaW5hdGUsXHJcblx0XHRcdGFkZGVkOiBIVE1MRWxlbWVudFtdLFxyXG5cdFx0XHRyZW1vdmVkOiBIVE1MRWxlbWVudFtdLFxyXG5cdFx0XHRzZWxlY3Rvcjogc2VsZWN0b3IsXHJcblx0XHRcdF9ldmVudD86ICdwYWdpbmF0aW9ubW9kaWZ5JyxcclxuXHRcdH0+O1xyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBQYWdpbmF0ZSB7XHJcblx0XHRcdGRvYzogRG9jdW1lbnQ7XHJcblxyXG5cdFx0XHRlbmFibGVkID0gdHJ1ZTtcclxuXHRcdFx0Y29uZGl0aW9uOiBzZWxlY3RvciB8ICgoKSA9PiBib29sZWFuKTtcclxuXHRcdFx0cXVldWVkID0gMDtcclxuXHRcdFx0cnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHRfaW5pdGVkID0gZmFsc2U7XHJcblx0XHRcdHNoaWZ0UmVxdWVzdENvdW50PzogbnVtYmVyIHwgKCgpID0+IG51bWJlcik7XHJcblxyXG5cdFx0XHRzdGF0aWMgc2hpZnRSZXF1ZXN0Q291bnQgPSAxMDtcclxuXHRcdFx0c3RhdGljIF9pbml0ZWQgPSBmYWxzZTtcclxuXHRcdFx0c3RhdGljIHJlbW92ZURlZmF1bHRSdW5CaW5kaW5nczogKCkgPT4gdm9pZDtcclxuXHRcdFx0c3RhdGljIGFkZERlZmF1bHRSdW5CaW5kaW5ncygpIHtcclxuXHRcdFx0XHRQYWdpbmF0ZS5yZW1vdmVEZWZhdWx0UnVuQmluZGluZ3M/LigpO1xyXG5cdFx0XHRcdGZ1bmN0aW9uIG9ubW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoZXZlbnQuYnV0dG9uICE9IDEpIHJldHVybjtcclxuXHRcdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgRWxlbWVudDtcclxuXHRcdFx0XHRcdGlmICh0YXJnZXQ/LmNsb3Nlc3QoJ2EnKSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdGxldCBjb3VudCA9IGV2ZW50LnNoaWZ0S2V5ID8gUGFnaW5hdGUuc2hpZnRSZXF1ZXN0Q291bnQgOiAxO1xyXG5cdFx0XHRcdFx0UGFnaW5hdGUucmVxdWVzdFBhZ2luYXRpb24oY291bnQsIGV2ZW50LCB0YXJnZXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmdW5jdGlvbiBvbmtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmIChldmVudC5jb2RlICE9ICdBbHRSaWdodCcpIHJldHVybjtcclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRsZXQgY291bnQgPSBldmVudC5zaGlmdEtleSA/IFBhZ2luYXRlLnNoaWZ0UmVxdWVzdENvdW50IDogMTtcclxuXHRcdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgRWxlbWVudDtcclxuXHRcdFx0XHRcdFBhZ2luYXRlLnJlcXVlc3RQYWdpbmF0aW9uKGNvdW50LCBldmVudCwgdGFyZ2V0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25tb3VzZWRvd24pO1xyXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbmtleWRvd24pO1xyXG5cdFx0XHRcdFBhZ2luYXRlLnJlbW92ZURlZmF1bHRSdW5CaW5kaW5ncyA9ICgpID0+IHtcclxuXHRcdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9ubW91c2Vkb3duKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbmtleWRvd24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRzdGF0aWMgaW5zdGFuY2VzOiBQYWdpbmF0ZVtdID0gW107XHJcblxyXG5cdFx0XHQvLyBsaXN0ZW5lcnNcclxuXHRcdFx0aW5pdCgpIHtcclxuXHRcdFx0XHRpZiAoIVBhZ2luYXRlLnJlbW92ZURlZmF1bHRSdW5CaW5kaW5ncykge1xyXG5cdFx0XHRcdFx0UGFnaW5hdGUuYWRkRGVmYXVsdFJ1bkJpbmRpbmdzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLl9pbml0ZWQpIHJldHVybjtcclxuXHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyPFBSZXF1ZXN0RXZlbnQ+KCdwYWdpbmF0aW9ucmVxdWVzdCcsIHRoaXMub25QYWdpbmF0aW9uUmVxdWVzdC5iaW5kKHRoaXMpKTtcclxuXHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyPFBFbmRFdmVudD4oJ3BhZ2luYXRpb25lbmQnLCB0aGlzLm9uUGFnaW5hdGlvbkVuZC5iaW5kKHRoaXMpKTtcclxuXHRcdFx0XHRQYWdpbmF0ZS5pbnN0YW5jZXMucHVzaCh0aGlzKTtcclxuXHRcdFx0XHRpZiAoUG9vcEpzLmRlYnVnKSB7XHJcblx0XHRcdFx0XHRsZXQgYWN0aXZlID0gdGhpcy5jYW5Db25zdW1lUmVxdWVzdCgpID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnO1xyXG5cdFx0XHRcdFx0aWYgKGFjdGl2ZSA9PSAnYWN0aXZlJylcclxuXHRcdFx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBQYWdpbmF0ZSBpbnN0YW50aWF0ZWQgKCR7YWN0aXZlfSk6IGAsIHRoaXMuZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdG9uUGFnaW5hdGlvblJlcXVlc3QoZXZlbnQ6IFBSZXF1ZXN0RXZlbnQpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5jYW5Db25zdW1lUmVxdWVzdCgpKSB7XHJcblx0XHRcdFx0XHRldmVudC5kZXRhaWwuY29uc3VtZWQrKztcclxuXHRcdFx0XHRcdGxldCBxdWV1ZWQgPSAhZXZlbnQuZGV0YWlsLnJlYXNvbj8uc2hpZnRLZXkgPyBudWxsIDogdHlwZW9mIHRoaXMuc2hpZnRSZXF1ZXN0Q291bnQgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMuc2hpZnRSZXF1ZXN0Q291bnQoKSA6IHRoaXMuc2hpZnRSZXF1ZXN0Q291bnQ7XHJcblx0XHRcdFx0XHR0aGlzLnF1ZXVlZCArPSBxdWV1ZWQgPz8gZXZlbnQuZGV0YWlsLmNvdW50O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoIXRoaXMucnVubmluZyAmJiB0aGlzLnF1ZXVlZCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jb25zdW1lUmVxdWVzdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0b25QYWdpbmF0aW9uRW5kKGV2ZW50OiBQRW5kRXZlbnQpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5xdWV1ZWQgJiYgdGhpcy5jYW5Db25zdW1lUmVxdWVzdCgpKSB7XHJcblx0XHRcdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuY2FuQ29uc3VtZVJlcXVlc3QoKSkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihgdGhpcyBwYWdpbmF0ZSBjYW4gbm90IHdvcmsgYW55bW9yZWApO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMucXVldWVkID0gMDtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmNvbnN1bWVSZXF1ZXN0KCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjYW5Db25zdW1lUmVxdWVzdCgpIHtcclxuXHRcdFx0XHRpZiAoIXRoaXMuZW5hYmxlZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdGlmICh0aGlzLnJ1bm5pbmcpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGlmICh0aGlzLmNvbmRpdGlvbikge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLmNvbmRpdGlvbiA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5jb25kaXRpb24oKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKCFkb2N1bWVudC5xKHRoaXMuY29uZGl0aW9uKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhc3luYyBjb25zdW1lUmVxdWVzdCgpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5ydW5uaW5nKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy5xdWV1ZWQtLTtcclxuXHRcdFx0XHR0aGlzLnJ1bm5pbmcgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMuZW1pdFN0YXJ0KCk7XHJcblx0XHRcdFx0YXdhaXQgdGhpcy5vbnJ1bj8uKCk7XHJcblx0XHRcdFx0dGhpcy5ydW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5lbWl0RW5kKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0b25ydW46ICgpID0+IFByb21pc2U8dm9pZD47XHJcblxyXG5cclxuXHRcdFx0Ly8gZW1pdHRlcnNcclxuXHRcdFx0c3RhdGljIHJlcXVlc3RQYWdpbmF0aW9uKGNvdW50ID0gMSwgcmVhc29uPzogUFJlcXVlc3RFdmVudFsnZGV0YWlsJ11bJ3JlYXNvbiddLCB0YXJnZXQ6IEVsZW1lbnQgPSBkb2N1bWVudC5ib2R5KSB7XHJcblx0XHRcdFx0bGV0IGRldGFpbDogUFJlcXVlc3RFdmVudFsnZGV0YWlsJ10gPSB7IGNvdW50LCByZWFzb24sIGNvbnN1bWVkOiAwIH07XHJcblx0XHRcdFx0ZnVuY3Rpb24gZmFpbChldmVudDogUFJlcXVlc3RFdmVudCkge1xyXG5cdFx0XHRcdFx0aWYgKGV2ZW50LmRldGFpbC5jb25zdW1lZCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihgUGFnaW5hdGlvbiByZXF1ZXN0IGZhaWxlZDogbm8gbGlzdGVuZXJzYCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZW1vdmVFdmVudExpc3RlbmVyKCdwYWdpbmF0aW9ucmVxdWVzdCcsIGZhaWwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhZGRFdmVudExpc3RlbmVyKCdwYWdpbmF0aW9ucmVxdWVzdCcsIGZhaWwpO1xyXG5cdFx0XHRcdHRhcmdldC5lbWl0PFBSZXF1ZXN0RXZlbnQ+KCdwYWdpbmF0aW9ucmVxdWVzdCcsIHsgY291bnQsIHJlYXNvbiwgY29uc3VtZWQ6IDAgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZW1pdFN0YXJ0KCkge1xyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuZW1pdDxQU3RhcnRFdmVudD4oJ3BhZ2luYXRpb25zdGFydCcsIHsgcGFnaW5hdGU6IHRoaXMgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZW1pdE1vZGlmeShhZGRlZCwgcmVtb3ZlZCwgc2VsZWN0b3IpIHtcclxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmVtaXQ8UE1vZGlmeUV2ZW50PigncGFnaW5hdGlvbm1vZGlmeScsIHsgcGFnaW5hdGU6IHRoaXMsIGFkZGVkLCByZW1vdmVkLCBzZWxlY3RvciB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbWl0RW5kKCkge1xyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuZW1pdDxQRW5kRXZlbnQ+KCdwYWdpbmF0aW9uZW5kJywgeyBwYWdpbmF0ZTogdGhpcyB9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gZmV0Y2hpbmc6IFxyXG5cdFx0XHRhc3luYyBmZXRjaERvY3VtZW50KGxpbms6IExpbmssIHNwaW5uZXIgPSB0cnVlLCBtYXhBZ2U6IGRlbHRhVGltZSA9IDApOiBQcm9taXNlPERvY3VtZW50PiB7XHJcblx0XHRcdFx0dGhpcy5kb2MgPSBudWxsO1xyXG5cdFx0XHRcdGxldCBhID0gc3Bpbm5lciAmJiBQYWdpbmF0ZS5saW5rVG9BbmNob3IobGluayk7XHJcblx0XHRcdFx0YT8uY2xhc3NMaXN0LmFkZCgncGFnaW5hdGUtc3BpbicpO1xyXG5cdFx0XHRcdGxpbmsgPSBQYWdpbmF0ZS5saW5rVG9VcmwobGluayk7XHJcblx0XHRcdFx0bGV0IGluaXQgPSB7IG1heEFnZSwgeG1sOiB0aGlzLmRhdGEueG1sIH07XHJcblx0XHRcdFx0dGhpcy5kb2MgPSAhbWF4QWdlID8gYXdhaXQgZmV0Y2guZG9jKGxpbmssIGluaXQpIDogYXdhaXQgZmV0Y2guY2FjaGVkLmRvYyhsaW5rLCBpbml0KTtcclxuXHRcdFx0XHRhPy5jbGFzc0xpc3QucmVtb3ZlKCdwYWdpbmF0ZS1zcGluJyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZG9jO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzdGF0aWMgcHJlZmV0Y2goc291cmNlOiBzZWxlY3Rvcikge1xyXG5cdFx0XHRcdGRvY3VtZW50LnFxPCdhJz4oc291cmNlKS5tYXAoZSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoZS5ocmVmKSB7XHJcblx0XHRcdFx0XHRcdGVsbShgbGlua1tyZWw9XCJwcmVmZXRjaFwiXVtocmVmPVwiJHtlLmhyZWZ9XCJdYCkuYXBwZW5kVG8oJ2hlYWQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIFRPRE86IGlmIGUuc3JjXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHQvLyBtb2RpZmljYXRpb246IFxyXG5cdFx0XHRhZnRlcihzb3VyY2U6IHNlbGVjdG9yLCB0YXJnZXQ6IHNlbGVjdG9yID0gc291cmNlKSB7XHJcblx0XHRcdFx0bGV0IGFkZGVkID0gdGhpcy5kb2MucXEoc291cmNlKTtcclxuXHRcdFx0XHRpZiAoIWFkZGVkLmxlbmd0aCkgcmV0dXJuO1xyXG5cdFx0XHRcdGxldCBmb3VuZCA9IGRvY3VtZW50LnFxKHRhcmdldCk7XHJcblx0XHRcdFx0aWYgKGZvdW5kLmxlbmd0aCA9PSAwKSB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIHdoZXJlIHRvIGFwcGVuZGApO1xyXG5cdFx0XHRcdGZvdW5kLnBvcCgpLmFmdGVyKC4uLmFkZGVkKTtcclxuXHRcdFx0XHR0aGlzLmVtaXRNb2RpZnkoYWRkZWQsIFtdLCBzb3VyY2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlcGxhY2VFYWNoKHNvdXJjZTogc2VsZWN0b3IsIHRhcmdldDogc2VsZWN0b3IgPSBzb3VyY2UpIHtcclxuXHRcdFx0XHRsZXQgYWRkZWQgPSB0aGlzLmRvYy5xcShzb3VyY2UpO1xyXG5cdFx0XHRcdGxldCByZW1vdmVkID0gZG9jdW1lbnQucXEodGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoYWRkZWQubGVuZ3RoICE9IHJlbW92ZWQubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoYGFkZGVkL3JlbW92ZWQgY291bnQgbWlzbWF0Y2hgKTtcclxuXHRcdFx0XHRyZW1vdmVkLm1hcCgoZSwgaSkgPT4gZS5yZXBsYWNlV2l0aChhZGRlZFtpXSkpO1xyXG5cdFx0XHRcdHRoaXMuZW1pdE1vZGlmeShhZGRlZCwgcmVtb3ZlZCwgc291cmNlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXBsYWNlKHNvdXJjZTogc2VsZWN0b3IsIHRhcmdldDogc2VsZWN0b3IgPSBzb3VyY2UpIHtcclxuXHRcdFx0XHRsZXQgYWRkZWQgPSB0aGlzLmRvYy5xcShzb3VyY2UpO1xyXG5cdFx0XHRcdGxldCByZW1vdmVkID0gZG9jdW1lbnQucXEodGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoYWRkZWQubGVuZ3RoICE9IHJlbW92ZWQubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoYG5vdCBpbXBsZW1lbnRlZGApO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnJlcGxhY2VFYWNoKHNvdXJjZSwgdGFyZ2V0KTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdC8vIHV0aWxcclxuXHRcdFx0c3RhdGljIGxpbmtUb1VybChsaW5rOiBMaW5rKTogdXJsIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGxpbmsgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdGlmIChsaW5rLnN0YXJ0c1dpdGgoJ2h0dHAnKSkgcmV0dXJuIGxpbmsgYXMgdXJsO1xyXG5cdFx0XHRcdFx0bGluayA9IGRvY3VtZW50LnE8J2EnPihsaW5rKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGxpbmsudGFnTmFtZSAhPSAnQScpIHRocm93IG5ldyBFcnJvcignbGluayBzaG91bGQgYmUgPGE+IGVsZW1lbnQhJyk7XHJcblx0XHRcdFx0cmV0dXJuIChsaW5rIGFzIEhUTUxBbmNob3JFbGVtZW50KS5ocmVmIGFzIHVybDtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdGF0aWMgbGlua1RvQW5jaG9yKGxpbms6IExpbmspOiBIVE1MQW5jaG9yRWxlbWVudCB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBsaW5rID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRpZiAobGluay5zdGFydHNXaXRoKCdodHRwJykpIHJldHVybiBudWxsO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LnE8J2EnPihsaW5rKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGxpbms7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0YXRpYyBzdGF0aWNDYWxsPFQ+KHRoaXM6IHZvaWQsIGRhdGE6IFBhcmFtZXRlcnM8UGFnaW5hdGVbJ3N0YXRpY0NhbGwnXT5bMF0pIHtcclxuXHRcdFx0XHRsZXQgcCA9IG5ldyBQYWdpbmF0ZSgpO1xyXG5cdFx0XHRcdHAuc3RhdGljQ2FsbChkYXRhKTtcclxuXHRcdFx0XHRyZXR1cm4gcDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmF3RGF0YTogYW55O1xyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0Y29uZGl0aW9uOiAoKSA9PiBib29sZWFuO1xyXG5cdFx0XHRcdHByZWZldGNoOiBhbnlbXTtcclxuXHRcdFx0XHRkb2M6IHNlbGVjdG9yW107XHJcblx0XHRcdFx0Y2xpY2s6IHNlbGVjdG9yW107XHJcblx0XHRcdFx0YWZ0ZXI6IHNlbGVjdG9yW107XHJcblx0XHRcdFx0cmVwbGFjZTogc2VsZWN0b3JbXTtcclxuXHRcdFx0XHRtYXhBZ2U6IGRlbHRhVGltZTtcclxuXHRcdFx0XHRzdGFydD86ICh0aGlzOiBQYWdpbmF0ZSkgPT4gdm9pZDtcclxuXHRcdFx0XHRtb2RpZnk/OiAodGhpczogUGFnaW5hdGUsIGRvYzogRG9jdW1lbnQpID0+IHZvaWQ7XHJcblx0XHRcdFx0ZW5kPzogKHRoaXM6IFBhZ2luYXRlLCBkb2M6IERvY3VtZW50KSA9PiB2b2lkO1xyXG5cdFx0XHRcdHhtbD86IGJvb2xlYW47XHJcblx0XHRcdH07XHJcblx0XHRcdHN0YXRpY0NhbGwoZGF0YToge1xyXG5cdFx0XHRcdGNvbmRpdGlvbj86IHNlbGVjdG9yIHwgKCgpID0+IGJvb2xlYW4pLFxyXG5cdFx0XHRcdHByZWZldGNoPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdGNsaWNrPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdGRvYz86IHNlbGVjdG9yIHwgc2VsZWN0b3JbXSxcclxuXHRcdFx0XHRhZnRlcj86IHNlbGVjdG9yIHwgc2VsZWN0b3JbXSxcclxuXHRcdFx0XHRyZXBsYWNlPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdHN0YXJ0PzogKHRoaXM6IFBhZ2luYXRlKSA9PiB2b2lkO1xyXG5cdFx0XHRcdG1vZGlmeT86ICh0aGlzOiBQYWdpbmF0ZSwgZG9jOiBEb2N1bWVudCkgPT4gdm9pZDtcclxuXHRcdFx0XHRlbmQ/OiAodGhpczogUGFnaW5hdGUsIGRvYzogRG9jdW1lbnQpID0+IHZvaWQ7XHJcblx0XHRcdFx0bWF4QWdlPzogZGVsdGFUaW1lO1xyXG5cdFx0XHRcdGNhY2hlPzogZGVsdGFUaW1lIHwgdHJ1ZTtcclxuXHRcdFx0XHR4bWw/OiBib29sZWFuO1xyXG5cdFx0XHRcdHBhZ2VyPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdO1xyXG5cdFx0XHRcdHNoaWZ0ZWQ/OiBudW1iZXIgfCAoKCkgPT4gbnVtYmVyKTtcclxuXHRcdFx0fSkge1xyXG5cdFx0XHRcdGZ1bmN0aW9uIHRvQXJyYXk8VD4odj86IFQgfCBUW10gfCB1bmRlZmluZWQpOiBUW10ge1xyXG5cdFx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkodikpIHJldHVybiB2O1xyXG5cdFx0XHRcdFx0aWYgKHYgPT0gbnVsbCkgcmV0dXJuIFtdO1xyXG5cdFx0XHRcdFx0cmV0dXJuIFt2XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZnVuY3Rpb24gdG9Db25kaXRpb24ocz86IHNlbGVjdG9yIHwgKCgpID0+IGJvb2xlYW4pIHwgdW5kZWZpbmVkKTogKCkgPT4gYm9vbGVhbiB7XHJcblx0XHRcdFx0XHRpZiAoIXMpIHJldHVybiAoKSA9PiB0cnVlO1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBzID09ICdzdHJpbmcnKSByZXR1cm4gKCkgPT4gISFkb2N1bWVudC5xKHMpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHM7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZ1bmN0aW9uIGNhbkZpbmQoYTogc2VsZWN0b3JbXSkge1xyXG5cdFx0XHRcdFx0aWYgKGEubGVuZ3RoID09IDApIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGEuc29tZShzID0+ICEhZG9jdW1lbnQucShzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZ1bmN0aW9uIGZpbmRPbmUoYTogc2VsZWN0b3JbXSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGEuZmluZChzID0+IGRvY3VtZW50LnEocykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnJhd0RhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdHRoaXMuZGF0YSA9IHtcclxuXHRcdFx0XHRcdGNvbmRpdGlvbjogdG9Db25kaXRpb24oZGF0YS5jb25kaXRpb24pLFxyXG5cdFx0XHRcdFx0cHJlZmV0Y2g6IHRvQXJyYXk8c2VsZWN0b3I+KGRhdGEucHJlZmV0Y2gpXHJcblx0XHRcdFx0XHRcdC5mbGF0TWFwKGUgPT4gdG9BcnJheShkYXRhW2VdID8/IGUpKSxcclxuXHRcdFx0XHRcdGRvYzogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5kb2MpLFxyXG5cdFx0XHRcdFx0Y2xpY2s6IHRvQXJyYXk8c2VsZWN0b3I+KGRhdGEuY2xpY2spLFxyXG5cdFx0XHRcdFx0YWZ0ZXI6IHRvQXJyYXk8c2VsZWN0b3I+KGRhdGEuYWZ0ZXIpLFxyXG5cdFx0XHRcdFx0cmVwbGFjZTogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5yZXBsYWNlKSxcclxuXHRcdFx0XHRcdG1heEFnZTogZGF0YS5tYXhBZ2UgPz8gKGRhdGEuY2FjaGUgPT0gdHJ1ZSA/ICcxeScgOiBkYXRhLmNhY2hlKSxcclxuXHRcdFx0XHRcdHN0YXJ0OiBkYXRhLnN0YXJ0LCBtb2RpZnk6IGRhdGEubW9kaWZ5LCBlbmQ6IGRhdGEuZW5kLFxyXG5cdFx0XHRcdFx0eG1sOiBkYXRhLnhtbCxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHRoaXMuc2hpZnRSZXF1ZXN0Q291bnQgPSBkYXRhLnNoaWZ0ZWQ7XHJcblx0XHRcdFx0aWYgKGRhdGEucGFnZXIpIHtcclxuXHRcdFx0XHRcdGxldCBwYWdlciA9IHRvQXJyYXk8c2VsZWN0b3I+KGRhdGEucGFnZXIpO1xyXG5cdFx0XHRcdFx0dGhpcy5kYXRhLmRvYyA9IHRoaXMuZGF0YS5kb2MuZmxhdE1hcChlID0+IHBhZ2VyLm1hcChwID0+IGAke3B9ICR7ZX1gKSk7XHJcblx0XHRcdFx0XHR0aGlzLmRhdGEucmVwbGFjZS5wdXNoKC4uLnBhZ2VyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5jb25kaXRpb24gPSAoKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuZGF0YS5jb25kaXRpb24oKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0aWYgKCFjYW5GaW5kKHRoaXMuZGF0YS5kb2MpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRpZiAoIWNhbkZpbmQodGhpcy5kYXRhLmNsaWNrKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHR0aGlzLmluaXQoKTtcclxuXHRcdFx0XHRpZiAodGhpcy5kYXRhLmNvbmRpdGlvbigpKSB7XHJcblx0XHRcdFx0XHR0aGlzLmRhdGEucHJlZmV0Y2gubWFwKHMgPT4gUGFnaW5hdGUucHJlZmV0Y2gocykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLm9ucnVuID0gYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHRcdFx0Ly8gaWYgKCFmaXhlZERhdGEuY29uZGl0aW9uKCkpIHJldHVybjtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMuZGF0YS5zdGFydD8uY2FsbCh0aGlzKTtcclxuXHRcdFx0XHRcdHRoaXMuZGF0YS5jbGljay5tYXAoZSA9PiBkb2N1bWVudC5xKGUpPy5jbGljaygpKTtcclxuXHRcdFx0XHRcdGxldCBkb2MgPSBmaW5kT25lKHRoaXMuZGF0YS5kb2MpO1xyXG5cdFx0XHRcdFx0aWYgKGRvYykge1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLmZldGNoRG9jdW1lbnQoZG9jLCB0cnVlLCB0aGlzLmRhdGEubWF4QWdlKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5kYXRhLnJlcGxhY2UubWFwKHMgPT4gdGhpcy5yZXBsYWNlKHMpKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5kYXRhLmFmdGVyLm1hcChzID0+IHRoaXMuYWZ0ZXIocykpO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLmRhdGEubW9kaWZ5Py5jYWxsKHRoaXMsIHRoaXMuZG9jKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMuZGF0YS5lbmQ/LmNhbGwodGhpcywgZG9jICYmIHRoaXMuZG9jKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0fVxyXG5cdFx0dHlwZSBTZWxPckVsID0gc2VsZWN0b3IgfCBIVE1MRWxlbWVudDtcclxuXHRcdHR5cGUgU29tZWhvdzxUPiA9IG51bGwgfCBUIHwgVFtdIHwgKCgpID0+IChudWxsIHwgVCB8IFRbXSkpO1xyXG5cdFx0dHlwZSBTb21laG93QXN5bmM8VD4gPSBudWxsIHwgVCB8IFRbXSB8ICgoKSA9PiAobnVsbCB8IFQgfCBUW10gfCBQcm9taXNlPG51bGwgfCBUIHwgVFtdPikpO1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBwYWdpbmF0ZSA9IE9iamVjdC5zZXRQcm90b3R5cGVPZihPYmplY3QuYXNzaWduKFBhZ2luYXRlLnN0YXRpY0NhbGwsIG5ldyBQYWdpbmF0ZSgpKSwgUGFnaW5hdGUpO1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGNvbnN0IHBhZ2luYXRlID0gUGFnaW5hdGVFeHRlbnNpb24ucGFnaW5hdGU7XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBJbWFnZVNjcm9sbGluZ0V4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBpbWFnZVNjcm9sbGluZ0FjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0ZXhwb3J0IGxldCBpbWdTZWxlY3RvciA9ICdpbWcnO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBpbWFnZVNjcm9sbGluZyhzZWxlY3Rvcj86IHN0cmluZykge1xyXG5cdFx0XHRpZiAoaW1hZ2VTY3JvbGxpbmdBY3RpdmUpIHJldHVybjtcclxuXHRcdFx0aWYgKHNlbGVjdG9yKSBpbWdTZWxlY3RvciA9IHNlbGVjdG9yO1xyXG5cdFx0XHRpbWFnZVNjcm9sbGluZ0FjdGl2ZSA9IHRydWU7XHJcblx0XHRcdGZ1bmN0aW9uIG9ud2hlZWwoZXZlbnQ6IE1vdXNlRXZlbnQgJiB7IHdoZWVsRGVsdGFZOiBudW1iZXIgfSkge1xyXG5cdFx0XHRcdGlmIChldmVudC5zaGlmdEtleSB8fCBldmVudC5jdHJsS2V5KSByZXR1cm47XHJcblx0XHRcdFx0aWYgKHNjcm9sbFdob2xlSW1hZ2UoLU1hdGguc2lnbihldmVudC53aGVlbERlbHRhWSkpKSB7XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgb253aGVlbCwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcclxuXHRcdFx0cmV0dXJuIGltYWdlU2Nyb2xsaW5nT2ZmID0gKCkgPT4ge1xyXG5cdFx0XHRcdGltYWdlU2Nyb2xsaW5nQWN0aXZlID0gZmFsc2U7XHJcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIG9ud2hlZWwpO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGJpbmRBcnJvd3MoKSB7XHJcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PiB7XHJcblx0XHRcdFx0aWYgKGV2ZW50LmNvZGUgPT0gJ0Fycm93TGVmdCcpIHtcclxuXHRcdFx0XHRcdHNjcm9sbFdob2xlSW1hZ2UoLTEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQXJyb3dSaWdodCcpIHtcclxuXHRcdFx0XHRcdHNjcm9sbFdob2xlSW1hZ2UoMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGxldCBpbWFnZVNjcm9sbGluZ09mZiA9ICgpID0+IHsgfTtcclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gaW1nVG9XaW5kb3dDZW50ZXIoaW1nOiBFbGVtZW50KSB7XHJcblx0XHRcdGxldCByZWN0ID0gaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRyZXR1cm4gKHJlY3QudG9wICsgcmVjdC5ib3R0b20pIC8gMiAtIGlubmVySGVpZ2h0IC8gMjtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZ2V0QWxsSW1hZ2VJbmZvKCkge1xyXG5cdFx0XHRsZXQgaW1hZ2VzID0gcXEoaW1nU2VsZWN0b3IpIGFzIEhUTUxJbWFnZUVsZW1lbnRbXTtcclxuXHRcdFx0bGV0IGRhdGFzID0gaW1hZ2VzLm1hcCgoaW1nLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRcdGxldCByZWN0ID0gaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRpbWcsIHJlY3QsIGluZGV4LFxyXG5cdFx0XHRcdFx0aW5TY3JlZW46IHJlY3QudG9wID49IC0xICYmIHJlY3QuYm90dG9tIDw9IGlubmVySGVpZ2h0LFxyXG5cdFx0XHRcdFx0Y3Jvc3NTY3JlZW46IHJlY3QuYm90dG9tID49IDEgJiYgcmVjdC50b3AgPD0gaW5uZXJIZWlnaHQgLSAxLFxyXG5cdFx0XHRcdFx0eVRvU2NyZWVuQ2VudGVyOiAocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyIC0gaW5uZXJIZWlnaHQgLyAyLFxyXG5cdFx0XHRcdFx0aXNJbkNlbnRlcjogTWF0aC5hYnMoKHJlY3QudG9wICsgcmVjdC5ib3R0b20pIC8gMiAtIGlubmVySGVpZ2h0IC8gMikgPCAzLFxyXG5cdFx0XHRcdFx0aXNTY3JlZW5IZWlnaHQ6IE1hdGguYWJzKHJlY3QuaGVpZ2h0IC0gaW5uZXJIZWlnaHQpIDwgMyxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9KS5maWx0ZXIoZSA9PiBlLnJlY3Q/LndpZHRoIHx8IGUucmVjdD8ud2lkdGgpO1xyXG5cdFx0XHRyZXR1cm4gZGF0YXM7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBzY3JvbGxXaG9sZUltYWdlUGVuZGluZyA9IGZhbHNlO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBnZXRDZW50cmFsSW1nKCkge1xyXG5cdFx0XHRyZXR1cm4gZ2V0QWxsSW1hZ2VJbmZvKCkudnNvcnQoZSA9PiBNYXRoLmFicyhlLnlUb1NjcmVlbkNlbnRlcikpWzBdPy5pbWc7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gc2Nyb2xsV2hvbGVJbWFnZShkaXIgPSAxKTogYm9vbGVhbiB7XHJcblx0XHRcdGlmIChzY3JvbGxXaG9sZUltYWdlUGVuZGluZykgcmV0dXJuIHRydWU7XHJcblx0XHRcdC8vIGlmIChkaXIgPT0gMCkgdGhyb3cgbmV3IEVycm9yKCdzY3JvbGxpbmcgaW4gbm8gZGlyZWN0aW9uIScpO1xyXG5cdFx0XHRpZiAoIWRpcikgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0ZGlyID0gTWF0aC5zaWduKGRpcik7XHJcblx0XHRcdGxldCBkYXRhcyA9IGdldEFsbEltYWdlSW5mbygpLnZzb3J0KGUgPT4gZS55VG9TY3JlZW5DZW50ZXIpO1xyXG5cdFx0XHRsZXQgY2VudHJhbCA9IGRhdGFzLnZzb3J0KGUgPT4gTWF0aC5hYnMoZS55VG9TY3JlZW5DZW50ZXIpKVswXTtcclxuXHRcdFx0bGV0IG5leHRDZW50cmFsSW5kZXggPSBkYXRhcy5pbmRleE9mKGNlbnRyYWwpO1xyXG5cdFx0XHR3aGlsZSAoXHJcblx0XHRcdFx0ZGF0YXNbbmV4dENlbnRyYWxJbmRleCArIGRpcl0gJiZcclxuXHRcdFx0XHRNYXRoLmFicyhkYXRhc1tuZXh0Q2VudHJhbEluZGV4ICsgZGlyXS55VG9TY3JlZW5DZW50ZXIgLSBjZW50cmFsLnlUb1NjcmVlbkNlbnRlcikgPCAxMFxyXG5cdFx0XHQpIG5leHRDZW50cmFsSW5kZXggKz0gZGlyO1xyXG5cdFx0XHRjZW50cmFsID0gZGF0YXNbbmV4dENlbnRyYWxJbmRleF07XHJcblx0XHRcdGxldCBuZXh0ID0gZGF0YXNbbmV4dENlbnRyYWxJbmRleCArIGRpcl07XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBzY3JvbGxUb0ltYWdlKGRhdGE6IHR5cGVvZiBjZW50cmFsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XHJcblx0XHRcdFx0aWYgKCFkYXRhKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0aWYgKHNjcm9sbFkgKyBkYXRhLnlUb1NjcmVlbkNlbnRlciA8PSAwICYmIHNjcm9sbFkgPD0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZGF0YS5pc1NjcmVlbkhlaWdodCkge1xyXG5cdFx0XHRcdFx0ZGF0YS5pbWcuc2Nyb2xsSW50b1ZpZXcoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2Nyb2xsVG8oc2Nyb2xsWCwgc2Nyb2xsWSArIGRhdGEueVRvU2NyZWVuQ2VudGVyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c2Nyb2xsV2hvbGVJbWFnZVBlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdFByb21pc2UucmFmKDIpLnRoZW4oKCkgPT4gc2Nyb2xsV2hvbGVJbWFnZVBlbmRpbmcgPSBmYWxzZSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGlmIG5vIGltYWdlcywgZG9uJ3Qgc2Nyb2xsO1xyXG5cdFx0XHRpZiAoIWNlbnRyYWwpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdC8vIGlmIGN1cnJlbnQgaW1hZ2UgaXMgb3V0c2lkZSB2aWV3LCBkb24ndCBzY3JvbGxcclxuXHRcdFx0aWYgKCFjZW50cmFsLmNyb3NzU2NyZWVuKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHQvLyBpZiBjdXJyZW50IGltYWdlIGlzIGluIGNlbnRlciwgc2Nyb2xsIHRvIHRoZSBuZXh0IG9uZVxyXG5cdFx0XHRpZiAoY2VudHJhbC5pc0luQ2VudGVyKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNjcm9sbFRvSW1hZ2UobmV4dCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGlmIHRvIHNjcm9sbCB0byBjdXJyZW50IGltYWdlIHlvdSBoYXZlIHRvIHNjcm9sbCBpbiBvcHBvc2lkZSBkaXJlY3Rpb24sIHNjcm9sbCB0byBuZXh0IG9uZVxyXG5cdFx0XHRpZiAoTWF0aC5zaWduKGNlbnRyYWwueVRvU2NyZWVuQ2VudGVyKSAhPSBkaXIpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2Nyb2xsVG9JbWFnZShuZXh0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgY3VycmVudCBpbWFnZSBpcyBmaXJzdC9sYXN0LCBkb24ndCBzY3JvbGwgb3ZlciAyNXZoIHRvIGl0XHJcblx0XHRcdGlmIChkaXIgPT0gMSAmJiBjZW50cmFsLmluZGV4ID09IDAgJiYgY2VudHJhbC55VG9TY3JlZW5DZW50ZXIgPiBpbm5lckhlaWdodCAvIDIpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGRpciA9PSAtMSAmJiBjZW50cmFsLmluZGV4ID09IGRhdGFzLmxlbmd0aCAtIDEgJiYgY2VudHJhbC55VG9TY3JlZW5DZW50ZXIgPCAtaW5uZXJIZWlnaHQgLyAyKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gc2Nyb2xsVG9JbWFnZShjZW50cmFsKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gc2F2ZVNjcm9sbFBvc2l0aW9uKCkge1xyXG5cdFx0XHRsZXQgaW1nID0gZ2V0Q2VudHJhbEltZygpO1xyXG5cdFx0XHRsZXQgcmVjdCA9IGltZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdFx0bGV0IGNlbnRlclRvV2luZG93Q2VudGVyID0gKHJlY3QudG9wICsgcmVjdC5ib3R0b20pIC8gMiAtIGlubmVySGVpZ2h0IC8gMjtcclxuXHRcdFx0bGV0IG9mZnNldCA9IGNlbnRlclRvV2luZG93Q2VudGVyIC8gcmVjdC5oZWlnaHQ7XHJcblx0XHRcdHJldHVybiB7IGltZywgb2Zmc2V0LCBsb2FkKCkgeyBsb2FkU2Nyb2xsUG9zaXRpb24oeyBpbWcsIG9mZnNldCB9KTsgfSB9O1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGxvYWRTY3JvbGxQb3NpdGlvbihwb3M6IHsgaW1nOiBIVE1MSW1hZ2VFbGVtZW50LCBvZmZzZXQ6IG51bWJlciB9KSB7XHJcblx0XHRcdGxldCByZWN0ID0gcG9zLmltZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdFx0bGV0IGNlbnRlclRvV2luZG93Q2VudGVyID0gcG9zLm9mZnNldCAqIHJlY3QuaGVpZ2h0O1xyXG5cdFx0XHRsZXQgYWN0dWFsQ2VudGVyVG9XaW5kb3dDZW50ZXIgPSAocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyIC0gaW5uZXJIZWlnaHQgLyAyO1xyXG5cdFx0XHRzY3JvbGxCeSgwLCBhY3R1YWxDZW50ZXJUb1dpbmRvd0NlbnRlciAtIGNlbnRlclRvV2luZG93Q2VudGVyKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vQXJyYXkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9EYXRlTm93SGFjay50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2VsZW1lbnQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9lbG0udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9GaWx0ZXJlci9FbnRpdHlGaWx0ZXJlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2V0Yy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2ZldGNoLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vT2JqZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vb2JzZXJ2ZXIudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9QYWdpbmF0ZS9QYWdpbmF0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vUGFnaW5hdGUvSW1hZ2VTY3JvbGxpbmcudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9Qcm9taXNlLnRzXCIgLz5cclxuXHJcblxyXG5cclxuXHJcblxyXG5uYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIF9faW5pdF9fKHdpbmRvdzogV2luZG93ICYgdHlwZW9mIGdsb2JhbFRoaXMpOiBcImluaXRlZFwiIHwgXCJhbHJlYWR5IGluaXRlZFwiIHtcclxuXHRcdGlmICghd2luZG93KSB3aW5kb3cgPSBnbG9iYWxUaGlzLndpbmRvdyBhcyBXaW5kb3cgJiB0eXBlb2YgZ2xvYmFsVGhpcztcclxuXHJcblx0XHR3aW5kb3cuZWxtID0gRWxtLmVsbTtcclxuXHRcdHdpbmRvdy5xID0gT2JqZWN0LmFzc2lnbihRdWVyeVNlbGVjdG9yLldpbmRvd1EucSwgeyBvckVsbTogUG9vcEpzLkVsbS5xT3JFbG0gfSk7XHJcblx0XHR3aW5kb3cucXEgPSBRdWVyeVNlbGVjdG9yLldpbmRvd1EucXE7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkVsZW1lbnQucHJvdG90eXBlLCAncScsIFF1ZXJ5U2VsZWN0b3IuRWxlbWVudFEucSk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkVsZW1lbnQucHJvdG90eXBlLCAncXEnLCBRdWVyeVNlbGVjdG9yLkVsZW1lbnRRLnFxKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUsICdhcHBlbmRUbycsIEVsZW1lbnRFeHRlbnNpb24uYXBwZW5kVG8pO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSwgJ2VtaXQnLCBFbGVtZW50RXh0ZW5zaW9uLmVtaXQpO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUsICdxJywgUXVlcnlTZWxlY3Rvci5Eb2N1bWVudFEucSk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkRvY3VtZW50LnByb3RvdHlwZSwgJ3FxJywgUXVlcnlTZWxlY3Rvci5Eb2N1bWVudFEucXEpO1xyXG5cclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuUHJvbWlzZSwgJ2VtcHR5JywgUHJvbWlzZUV4dGVuc2lvbi5lbXB0eSk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LlByb21pc2UsICdmcmFtZScsIFByb21pc2VFeHRlbnNpb24uZnJhbWUpO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5Qcm9taXNlLCAncmFmJywgUHJvbWlzZUV4dGVuc2lvbi5mcmFtZSk7XHJcblxyXG5cdFx0d2luZG93LmZldGNoLmNhY2hlZCA9IEZldGNoRXh0ZW5zaW9uLmNhY2hlZCBhcyBhbnk7XHJcblx0XHR3aW5kb3cuZmV0Y2guZG9jID0gRmV0Y2hFeHRlbnNpb24uZG9jIGFzIGFueTtcclxuXHRcdHdpbmRvdy5mZXRjaC5qc29uID0gRmV0Y2hFeHRlbnNpb24uanNvbiBhcyBhbnk7XHJcblx0XHR3aW5kb3cuZmV0Y2guY2FjaGVkLmRvYyA9IEZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYztcclxuXHRcdHdpbmRvdy5mZXRjaC5kb2MuY2FjaGVkID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jO1xyXG5cdFx0d2luZG93LmZldGNoLmNhY2hlZERvYyA9IEZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYztcclxuXHRcdHdpbmRvdy5mZXRjaC5qc29uLmNhY2hlZCA9IEZldGNoRXh0ZW5zaW9uLmNhY2hlZEpzb247XHJcblx0XHR3aW5kb3cuZmV0Y2guY2FjaGVkLmpzb24gPSBGZXRjaEV4dGVuc2lvbi5jYWNoZWRKc29uO1xyXG5cdFx0d2luZG93LmZldGNoLmlzQ2FjaGVkID0gRmV0Y2hFeHRlbnNpb24uaXNDYWNoZWQ7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LlJlc3BvbnNlLnByb3RvdHlwZSwgJ2NhY2hlZEF0JywgMCk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkRvY3VtZW50LnByb3RvdHlwZSwgJ2NhY2hlZEF0JywgMCk7XHJcblxyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5PYmplY3QsICdkZWZpbmVWYWx1ZScsIE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93Lk9iamVjdCwgJ2RlZmluZUdldHRlcicsIE9iamVjdEV4dGVuc2lvbi5kZWZpbmVHZXR0ZXIpO1xyXG5cdFx0Ly8gT2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKE9iamVjdCwgJ21hcCcsIE9iamVjdEV4dGVuc2lvbi5tYXApO1xyXG5cclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuQXJyYXksICdtYXAnLCBBcnJheUV4dGVuc2lvbi5tYXApO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5BcnJheS5wcm90b3R5cGUsICdwbWFwJywgQXJyYXlFeHRlbnNpb24uUE1hcC50aGlzX3BtYXApO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5BcnJheS5wcm90b3R5cGUsICd2c29ydCcsIEFycmF5RXh0ZW5zaW9uLnZzb3J0KTtcclxuXHRcdGlmICghW10uYXQpXHJcblx0XHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuQXJyYXkucHJvdG90eXBlLCAnYXQnLCBBcnJheUV4dGVuc2lvbi5hdCk7XHJcblx0XHRpZiAoIVtdLmZpbmRMYXN0KVxyXG5cdFx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkFycmF5LnByb3RvdHlwZSwgJ2ZpbmRMYXN0JywgQXJyYXlFeHRlbnNpb24uZmluZExhc3QpO1xyXG5cclxuXHRcdHdpbmRvdy5wYWdpbmF0ZSA9IFBvb3BKcy5wYWdpbmF0ZSBhcyBhbnk7XHJcblx0XHR3aW5kb3cuaW1hZ2VTY3JvbGxpbmcgPSBQb29wSnMuSW1hZ2VTY3JvbGxpbmdFeHRlbnNpb247XHJcblxyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdywgJ19faW5pdF9fJywgJ2FscmVhZHkgaW5pdGVkJyk7XHJcblx0XHRyZXR1cm4gJ2luaXRlZCc7XHJcblx0fVxyXG5cclxuXHRPYmplY3RFeHRlbnNpb24uZGVmaW5lR2V0dGVyKHdpbmRvdywgJ19faW5pdF9fJywgKCkgPT4gX19pbml0X18od2luZG93KSk7XHJcblxyXG5cdGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLl9faW5pdF9fKSB7XHJcblx0XHR3aW5kb3cuX19pbml0X187XHJcblx0fVxyXG5cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCB0eXBlIFZhbHVlT2Y8VD4gPSBUW2tleW9mIFRdO1xyXG5cdGV4cG9ydCB0eXBlIE1hcHBlZE9iamVjdDxULCBWPiA9IHsgW1AgaW4ga2V5b2YgVF06IFYgfTtcclxuXHJcblx0ZXhwb3J0IHR5cGUgc2VsZWN0b3IgPSBzdHJpbmcgfCBzdHJpbmcgJiB7IF8/OiAnc2VsZWN0b3InIH1cclxuXHRleHBvcnQgdHlwZSB1cmwgPSBgaHR0cCR7c3RyaW5nfWAgJiB7IF8/OiAndXJsJyB9O1xyXG5cdGV4cG9ydCB0eXBlIExpbmsgPSBIVE1MQW5jaG9yRWxlbWVudCB8IHNlbGVjdG9yIHwgdXJsO1xyXG5cclxuXHJcblxyXG5cclxuXHR0eXBlIHRyaW1TdGFydDxTLCBDIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtDfSR7aW5mZXIgUzF9YCA/IHRyaW1TdGFydDxTMSwgQz4gOiBTO1xyXG5cdHR5cGUgdHJpbUVuZDxTLCBDIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtpbmZlciBTMX0ke0N9YCA/IHRyaW1FbmQ8UzEsIEM+IDogUztcclxuXHR0eXBlIHRyaW08UywgQyBleHRlbmRzIHN0cmluZyA9ICcgJyB8ICdcXHQnIHwgJ1xcbic+ID0gdHJpbVN0YXJ0PHRyaW1FbmQ8UywgQz4sIEM+O1xyXG5cclxuXHR0eXBlIHNwbGl0PFMsIEMgZXh0ZW5kcyBzdHJpbmc+ID0gUyBleHRlbmRzIGAke2luZmVyIFMxfSR7Q30ke2luZmVyIFMyfWAgPyBzcGxpdDxTMSwgQz4gfCBzcGxpdDxTMiwgQz4gOiBTO1xyXG5cdHR5cGUgc3BsaXRTdGFydDxTLCBDIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtpbmZlciBTMX0ke0N9JHtpbmZlciBfUzJ9YCA/IHNwbGl0U3RhcnQ8UzEsIEM+IDogUztcclxuXHR0eXBlIHNwbGl0RW5kPFMsIEMgZXh0ZW5kcyBzdHJpbmc+ID0gUyBleHRlbmRzIGAke2luZmVyIF9TMX0ke0N9JHtpbmZlciBTMn1gID8gc3BsaXRFbmQ8UzIsIEM+IDogUztcclxuXHJcblx0dHlwZSByZXBsYWNlPFMsIEMgZXh0ZW5kcyBzdHJpbmcsIFYgZXh0ZW5kcyBzdHJpbmc+ID0gUyBleHRlbmRzIGAke2luZmVyIFMxfSR7Q30ke2luZmVyIFMzfWAgPyByZXBsYWNlPGAke1MxfSR7Vn0ke1MzfWAsIEMsIFY+IDogUztcclxuXHJcblx0dHlwZSB3cyA9ICcgJyB8ICdcXHQnIHwgJ1xcbic7XHJcblxyXG5cdC8vIHR5cGUgaW5zYW5lU2VsZWN0b3IgPSAnIGEgLCBiW3F3ZV0gXFxuICwgYy54ICwgZCN5ICwgeCBlICwgeD5mICwgeCA+IGcgLCBbcXdlXSAsIGg6bm90KHg+eSkgLCBpbWcgJztcclxuXHJcblx0Ly8gdHlwZSBfaTEgPSByZXBsYWNlPGluc2FuZVNlbGVjdG9yLCBgWyR7c3RyaW5nfV1gLCAnLic+O1xyXG5cdC8vIHR5cGUgX2kxNSA9IHJlcGxhY2U8X2kxLCBgKCR7c3RyaW5nfSlgLCAnLic+O1xyXG5cdC8vIHR5cGUgX2kxNyA9IHJlcGxhY2U8X2kxNSwgRXhjbHVkZTx3cywgJyAnPiwgJyAnPjtcclxuXHQvLyB0eXBlIF9pMiA9IHNwbGl0PF9pMTcsICcsJz47XHJcblx0Ly8gdHlwZSBfaTMgPSB0cmltPF9pMj47XHJcblx0Ly8gdHlwZSBfaTQgPSBzcGxpdEVuZDxfaTMsIHdzIHwgJz4nPjtcclxuXHQvLyB0eXBlIF9pNSA9IHNwbGl0U3RhcnQ8X2k0LCAnLicgfCAnIycgfCAnOic+O1xyXG5cdC8vIHR5cGUgX2k2ID0gKEhUTUxFbGVtZW50VGFnTmFtZU1hcCAmIHsgJyc6IEhUTUxFbGVtZW50IH0gJiB7IFtrOiBzdHJpbmddOiBIVE1MRWxlbWVudCB9KVtfaTVdO1xyXG5cdGV4cG9ydCB0eXBlIFRhZ05hbWVGcm9tU2VsZWN0b3I8UyBleHRlbmRzIHN0cmluZz4gPSBzcGxpdFN0YXJ0PHNwbGl0RW5kPHRyaW08c3BsaXQ8cmVwbGFjZTxyZXBsYWNlPHJlcGxhY2U8UywgYFske3N0cmluZ31dYCwgJy4nPiwgYCgke3N0cmluZ30pYCwgJy4nPiwgRXhjbHVkZTx3cywgJyAnPiwgJyAnPiwgJywnPj4sIHdzIHwgJz4nPiwgJy4nIHwgJyMnIHwgJzonPjtcclxuXHJcblx0ZXhwb3J0IHR5cGUgVGFnRWxlbWVudEZyb21UYWdOYW1lPFM+ID0gUyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcCA/IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtTXSA6IEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG5cclxuZGVjbGFyZSBjb25zdCBfX2luaXRfXzogXCJpbml0ZWRcIiB8IFwiYWxyZWFkeSBpbml0ZWRcIjtcclxuZGVjbGFyZSBjb25zdCBlbG06IHR5cGVvZiBQb29wSnMuRWxtLmVsbTtcclxuZGVjbGFyZSBjb25zdCBxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuV2luZG93US5xICYgeyBvckVsbTogdHlwZW9mIFBvb3BKcy5FbG0ucU9yRWxtIH07O1xyXG5kZWNsYXJlIGNvbnN0IHFxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuV2luZG93US5xcTtcclxuZGVjbGFyZSBjb25zdCBwYWdpbmF0ZTogdHlwZW9mIFBvb3BKcy5wYWdpbmF0ZTtcclxuZGVjbGFyZSBjb25zdCBpbWFnZVNjcm9sbGluZzogdHlwZW9mIFBvb3BKcy5JbWFnZVNjcm9sbGluZ0V4dGVuc2lvbjtcclxuZGVjbGFyZSBuYW1lc3BhY2UgZmV0Y2gge1xyXG5cdGV4cG9ydCBsZXQgY2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZCAmIHsgZG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYywganNvbjogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWRKc29uIH07XHJcblx0ZXhwb3J0IGxldCBkb2M6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uZG9jICYgeyBjYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jIH07XHJcblx0ZXhwb3J0IGxldCBjYWNoZWREb2M6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jO1xyXG5cdGV4cG9ydCBsZXQganNvbjogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5qc29uICYgeyBjYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbiB9O1xyXG5cdGV4cG9ydCBsZXQgaXNDYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uaXNDYWNoZWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBXaW5kb3cge1xyXG5cdHJlYWRvbmx5IF9faW5pdF9fOiBcImluaXRlZFwiIHwgXCJhbHJlYWR5IGluaXRlZFwiO1xyXG5cdGVsbTogdHlwZW9mIFBvb3BKcy5FbG0uZWxtO1xyXG5cdHE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5XaW5kb3dRLnEgJiB7IG9yRWxtOiB0eXBlb2YgUG9vcEpzLkVsbS5xT3JFbG0gfTtcclxuXHRxcTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLldpbmRvd1EucXE7XHJcblx0cGFnaW5hdGU6IHR5cGVvZiBQb29wSnMucGFnaW5hdGU7XHJcblx0aW1hZ2VTY3JvbGxpbmc6IHR5cGVvZiBQb29wSnMuSW1hZ2VTY3JvbGxpbmdFeHRlbnNpb247XHJcblx0ZmV0Y2g6IHtcclxuXHRcdChpbnB1dDogUmVxdWVzdEluZm8sIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8UmVzcG9uc2U+O1xyXG5cdFx0Y2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZCAmIHsgZG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYywganNvbjogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWRKc29uIH07XHJcblx0XHRkb2M6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uZG9jICYgeyBjYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jIH07XHJcblx0XHRjYWNoZWREb2M6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jO1xyXG5cdFx0anNvbjogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5qc29uICYgeyBjYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbiB9O1xyXG5cdFx0aXNDYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uaXNDYWNoZWQ7XHJcblx0fVxyXG59XHJcblxyXG5pbnRlcmZhY2UgRWxlbWVudCB7XHJcblx0cTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLkVsZW1lbnRRLnE7XHJcblx0cXE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5FbGVtZW50US5xcTtcclxuXHRhcHBlbmRUbzogdHlwZW9mIFBvb3BKcy5FbGVtZW50RXh0ZW5zaW9uLmFwcGVuZFRvO1xyXG5cdGVtaXQ6IHR5cGVvZiBQb29wSnMuRWxlbWVudEV4dGVuc2lvbi5lbWl0O1xyXG5cdGFkZEV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEN1c3RvbUV2ZW50PHsgX2V2ZW50Pzogc3RyaW5nIH0+Pih0eXBlOiBUWydkZXRhaWwnXVsnX2V2ZW50J10sIGxpc3RlbmVyOiAodGhpczogRG9jdW1lbnQsIGV2OiBUKSA9PiBhbnksIG9wdGlvbnM/OiBib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkO1xyXG59XHJcbmludGVyZmFjZSBEb2N1bWVudCB7XHJcblx0cTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLkRvY3VtZW50US5xO1xyXG5cdHFxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuRG9jdW1lbnRRLnFxO1xyXG5cdGNhY2hlZEF0OiBudW1iZXI7XHJcblx0YWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgQ3VzdG9tRXZlbnQ8eyBfZXZlbnQ/OiBzdHJpbmcgfT4+KHR5cGU6IFRbJ2RldGFpbCddWydfZXZlbnQnXSwgbGlzdGVuZXI6ICh0aGlzOiBEb2N1bWVudCwgZXY6IFQpID0+IGFueSwgb3B0aW9ucz86IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBPYmplY3RDb25zdHJ1Y3RvciB7XHJcblx0ZGVmaW5lVmFsdWU6IHR5cGVvZiBQb29wSnMuT2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlO1xyXG5cdGRlZmluZUdldHRlcjogdHlwZW9mIFBvb3BKcy5PYmplY3RFeHRlbnNpb24uZGVmaW5lR2V0dGVyO1xyXG5cdC8vIG1hcDogdHlwZW9mIFBvb3BKcy5PYmplY3RFeHRlbnNpb24ubWFwO1xyXG5cdHNldFByb3RvdHlwZU9mPFQsIFA+KG86IFQsIHByb3RvOiBQKTogVCAmIFA7XHJcblxyXG5cclxuXHRmcm9tRW50cmllczxLIGV4dGVuZHMgc3RyaW5nIHwgbnVtYmVyIHwgc3ltYm9sLCBWPihcclxuXHRcdGVudHJpZXM6IHJlYWRvbmx5IChyZWFkb25seSBbSywgVl0pW11cclxuXHQpOiB7IFtrIGluIEtdOiBWIH07XHJcbn1cclxuaW50ZXJmYWNlIFByb21pc2VDb25zdHJ1Y3RvciB7XHJcblx0ZW1wdHk6IHR5cGVvZiBQb29wSnMuUHJvbWlzZUV4dGVuc2lvbi5lbXB0eTtcclxuXHRmcmFtZTogdHlwZW9mIFBvb3BKcy5Qcm9taXNlRXh0ZW5zaW9uLmZyYW1lO1xyXG5cdHJhZjogdHlwZW9mIFBvb3BKcy5Qcm9taXNlRXh0ZW5zaW9uLmZyYW1lO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQXJyYXk8VD4ge1xyXG5cdHZzb3J0OiB0eXBlb2YgUG9vcEpzLkFycmF5RXh0ZW5zaW9uLnZzb3J0O1xyXG5cdC8vIHBtYXA6IHR5cGVvZiBQb29wSnMuQXJyYXlFeHRlbnNpb24ucG1hcDtcclxuXHRwbWFwOiB0eXBlb2YgUG9vcEpzLkFycmF5RXh0ZW5zaW9uLlBNYXAudGhpc19wbWFwO1xyXG59XHJcbmludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcclxuXHRtYXA6IHR5cGVvZiBQb29wSnMuQXJyYXlFeHRlbnNpb24ubWFwO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRGF0ZUNvbnN0cnVjdG9yIHtcclxuXHRfbm93KCk6IG51bWJlcjtcclxufVxyXG5pbnRlcmZhY2UgRGF0ZSB7XHJcblx0X2dldFRpbWUoKTogbnVtYmVyO1xyXG59XHJcbmludGVyZmFjZSBQZXJmb3JtYW5jZSB7XHJcblx0X25vdzogUGVyZm9ybWFuY2VbJ25vdyddO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmVzcG9uc2Uge1xyXG5cdGNhY2hlZEF0OiBudW1iZXI7XHJcbn1cclxuXHJcbi8vIGludGVyZmFjZSBDdXN0b21FdmVudDxUPiB7XHJcbi8vIFx0ZGV0YWlsPzogVDtcclxuLy8gfVxyXG5cclxuaW50ZXJmYWNlIEZ1bmN0aW9uIHtcclxuXHRiaW5kPFQsIFIsIEFSR1MgZXh0ZW5kcyBhbnlbXT4odGhpczogKHRoaXM6IFQsIC4uLmFyZ3M6IEFSR1MpID0+IFIsIHRoaXNBcmc6IFQpOiAoKC4uLmFyZ3M6IEFSR1MpID0+IFIpXHJcbn1cclxuXHJcbi8vIGZvcmNlIGFsbG93ICcnLnNwbGl0KCcuJykucG9wKCkhXHJcbmludGVyZmFjZSBTdHJpbmcge1xyXG5cdHNwbGl0KHNwbGl0dGVyOiBzdHJpbmcpOiBbc3RyaW5nLCAuLi5zdHJpbmdbXV07XHJcbn1cclxuaW50ZXJmYWNlIEFycmF5PFQ+IHtcclxuXHRwb3AoKTogdGhpcyBleHRlbmRzIFtULCAuLi5UW11dID8gVCA6IFQgfCB1bmRlZmluZWQ7XHJcblx0YXQoaW5kZXg6IG51bWJlcik6IFQ7XHJcblx0ZmluZExhc3Q8UyBleHRlbmRzIFQ+KHByZWRpY2F0ZTogKHRoaXM6IHZvaWQsIHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBvYmo6IFRbXSkgPT4gdmFsdWUgaXMgUywgdGhpc0FyZz86IGFueSk6IFMgfCB1bmRlZmluZWQ7XHJcblx0ZmluZExhc3QocHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIG9iajogVFtdKSA9PiB1bmtub3duLCB0aGlzQXJnPzogYW55KTogVCB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuaW50ZXJmYWNlIE1hdGgge1xyXG5cdHNpZ24oeDogbnVtYmVyKTogLTEgfCAwIHwgMTtcclxufVxyXG4iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIEVudHJ5RmlsdGVyZXJFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBGaWx0ZXJlckl0ZW08RGF0YT4ge1xyXG5cdFx0XHRpZDogc3RyaW5nID0gXCJcIjtcclxuXHRcdFx0bmFtZT86IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcblx0XHRcdHRocmVlV2F5OiBXYXluZXNzID0gZmFsc2U7XHJcblx0XHRcdG1vZGU6IE1vZGUgPSAnb2ZmJztcclxuXHRcdFx0cGFyZW50OiBFbnRyeUZpbHRlcmVyO1xyXG5cdFx0XHRidXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cdFx0XHRpbmNvbXBhdGlibGU/OiBzdHJpbmdbXTtcclxuXHRcdFx0aGlkZGVuID0gZmFsc2U7XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBGaWx0ZXJlckl0ZW1Tb3VyY2UpIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtJztcclxuXHRcdFx0XHRPYmplY3QuYXNzaWduKHRoaXMsIGRhdGEpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmJ1dHRvbiA9IGVsbTwnYnV0dG9uJz4oZGF0YS5idXR0b24sXHJcblx0XHRcdFx0XHRjbGljayA9PiB0aGlzLmNsaWNrKGNsaWNrKSxcclxuXHRcdFx0XHRcdGNvbnRleHRtZW51ID0+IHRoaXMuY29udGV4dG1lbnUoY29udGV4dG1lbnUpLFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFx0dGhpcy5wYXJlbnQuY29udGFpbmVyLmFwcGVuZCh0aGlzLmJ1dHRvbik7XHJcblx0XHRcdFx0aWYgKHRoaXMubmFtZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b24uYXBwZW5kKHRoaXMubmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbi50aXRsZSA9IHRoaXMuZGVzY3JpcHRpb247XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgIT0gJ29mZicpIHtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTW9kZShkYXRhLm1vZGUsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5oaWRkZW4pIHtcclxuXHRcdFx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvZmYnKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUoJ29uJyk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChldmVudC50YXJnZXQgIT0gdGhpcy5idXR0b24pIHJldHVybjtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvbicpIHtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTW9kZSh0aGlzLnRocmVlV2F5ID8gJ29wcG9zaXRlJyA6ICdvZmYnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNb2RlKCdvZmYnKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dG1lbnUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgIT0gJ29wcG9zaXRlJykge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNb2RlKCdvcHBvc2l0ZScpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUoJ29mZicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dG9nZ2xlTW9kZShtb2RlOiBNb2RlLCBmb3JjZSA9IGZhbHNlKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSBtb2RlICYmICFmb3JjZSkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMubW9kZSA9IG1vZGU7XHJcblx0XHRcdFx0dGhpcy5idXR0b24uc2V0QXR0cmlidXRlKCdlZi1tb2RlJywgbW9kZSk7XHJcblx0XHRcdFx0aWYgKG1vZGUgIT0gJ29mZicgJiYgdGhpcy5pbmNvbXBhdGlibGUpIHtcclxuXHRcdFx0XHRcdHRoaXMucGFyZW50Lm9mZkluY29tcGF0aWJsZSh0aGlzLmluY29tcGF0aWJsZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucGFyZW50LnJlcXVlc3RVcGRhdGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmVtb3ZlKCkge1xyXG5cdFx0XHRcdHRoaXMuYnV0dG9uLnJlbW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMudG9nZ2xlTW9kZSgnb2ZmJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNob3coKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRkZW4gPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmJ1dHRvbi5oaWRkZW4gPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRoaWRlKCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZGVuID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLmJ1dHRvbi5oaWRkZW4gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9GaWx0ZXJlckl0ZW0udHNcIiAvPlxyXG5cclxubmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgZmlsdGVyOiBGaWx0ZXJGbjxEYXRhPjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IEZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtZmlsdGVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKiogcmV0dXJucyBpZiBpdGVtIHNob3VsZCBiZSB2aXNpYmxlICovXHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29mZicpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IHRoaXMuZmlsdGVyKGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiA/IHZhbHVlID4gMCA6IHZhbHVlO1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29uJykgcmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvcHBvc2l0ZScpIHJldHVybiAhcmVzdWx0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFZhbHVlRmlsdGVyPERhdGEsIFYgZXh0ZW5kcyBzdHJpbmcgfCBudW1iZXI+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgZmlsdGVyOiBWYWx1ZUZpbHRlckZuPERhdGEsIFY+O1xyXG5cdFx0XHRpbnB1dDogSFRNTElucHV0RWxlbWVudDtcclxuXHRcdFx0bGFzdFZhbHVlOiBWO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogVmFsdWVGaWx0ZXJTb3VyY2U8RGF0YSwgVj4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLWZpbHRlcltlZi1tb2RlPVwib2ZmXCJdJztcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0XHRsZXQgdHlwZSA9IHR5cGVvZiBkYXRhLmlucHV0ID09ICdudW1iZXInID8gJ251bWJlcicgOiAndGV4dCc7XHJcblx0XHRcdFx0bGV0IHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoZGF0YS5pbnB1dCk7XHJcblx0XHRcdFx0bGV0IGlucHV0ID0gYGlucHV0W3R5cGU9JHt0eXBlfV1bdmFsdWU9JHt2YWx1ZX1dYDtcclxuXHRcdFx0XHR0aGlzLmlucHV0ID0gZWxtPCdpbnB1dCc+KGlucHV0LFxyXG5cdFx0XHRcdFx0aW5wdXQgPT4gdGhpcy5jaGFuZ2UoKSxcclxuXHRcdFx0XHQpLmFwcGVuZFRvKHRoaXMuYnV0dG9uKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2hhbmdlKCkge1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcclxuXHRcdFx0XHRpZiAodGhpcy5sYXN0VmFsdWUgIT0gdmFsdWUpIHtcclxuXHRcdFx0XHRcdHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHR0aGlzLnBhcmVudC5yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKiogcmV0dXJucyBpZiBpdGVtIHNob3VsZCBiZSB2aXNpYmxlICovXHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29mZicpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IHRoaXMuZmlsdGVyKHRoaXMuZ2V0VmFsdWUoKSwgZGF0YSwgZWwpO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiA/IHZhbHVlID4gMCA6IHZhbHVlO1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29uJykgcmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvcHBvc2l0ZScpIHJldHVybiAhcmVzdWx0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRnZXRWYWx1ZSgpOiBWIHtcclxuXHRcdFx0XHRsZXQgdmFsdWU6IFYgPSAodGhpcy5pbnB1dC50eXBlID09ICd0ZXh0JyA/IHRoaXMuaW5wdXQudmFsdWUgOiB0aGlzLmlucHV0LnZhbHVlQXNOdW1iZXIpIGFzIFY7XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIE1hdGNoRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgdmFsdWU6IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IHN0cmluZztcclxuXHRcdFx0aW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblx0XHRcdGxhc3RWYWx1ZTogc3RyaW5nO1xyXG5cdFx0XHRtYXRjaGVyOiAoaW5wdXQ6IHN0cmluZykgPT4gYm9vbGVhbjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IE1hdGNoRmlsdGVyU291cmNlPERhdGE+KSB7XHJcblx0XHRcdFx0ZGF0YS5idXR0b24gPz89ICdidXR0b24uZWYtaXRlbS5lZi1maWx0ZXJbZWYtbW9kZT1cIm9mZlwiXSc7XHJcblx0XHRcdFx0ZGF0YS52YWx1ZSA/Pz0gZGF0YSA9PiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0XHRsZXQgdmFsdWUgPSAhZGF0YS5pbnB1dCA/ICcnIDogSlNPTi5zdHJpbmdpZnkoZGF0YS5pbnB1dCk7XHJcblx0XHRcdFx0bGV0IGlucHV0ID0gYGlucHV0W3R5cGU9dGV4dH1dW3ZhbHVlPSR7dmFsdWV9XWA7XHJcblx0XHRcdFx0dGhpcy5pbnB1dCA9IGVsbTwnaW5wdXQnPihpbnB1dCxcclxuXHRcdFx0XHRcdGlucHV0ID0+IHRoaXMuY2hhbmdlKCksXHJcblx0XHRcdFx0KS5hcHBlbmRUbyh0aGlzLmJ1dHRvbik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNoYW5nZSgpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5sYXN0VmFsdWUgIT0gdGhpcy5pbnB1dC52YWx1ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXN0VmFsdWUgPSB0aGlzLmlucHV0LnZhbHVlO1xyXG5cdFx0XHRcdFx0dGhpcy5tYXRjaGVyID0gdGhpcy5nZW5lcmF0ZU1hdGNoZXIodGhpcy5sYXN0VmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0bGV0IHJlc3VsdCA9IHRoaXMubWF0Y2hlcih0aGlzLnZhbHVlKGRhdGEsIGVsKSk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMubW9kZSA9PSAnb24nID8gcmVzdWx0IDogIXJlc3VsdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gbWF0Y2hlckNhY2hlOiBNYXA8c3RyaW5nLCAoKGlucHV0OiBzdHJpbmcpID0+IGJvb2xlYW4pPiA9IG5ldyBNYXAoKTtcclxuXHRcdFx0Ly8gZ2V0TWF0Y2hlcihzb3VyY2U6IHN0cmluZyk6IChpbnB1dDogc3RyaW5nKSA9PiBib29sZWFuIHtcclxuXHRcdFx0Ly8gXHRpZiAodGhpcy5tYXRjaGVyQ2FjaGUuaGFzKHNvdXJjZSkpIHtcclxuXHRcdFx0Ly8gXHRcdHJldHVybiB0aGlzLm1hdGNoZXJDYWNoZS5nZXQoc291cmNlKTtcclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIFx0bGV0IG1hdGNoZXIgPSB0aGlzLmdlbmVyYXRlTWF0Y2hlcihzb3VyY2UpO1xyXG5cdFx0XHQvLyBcdHRoaXMubWF0Y2hlckNhY2hlLnNldChzb3VyY2UsIG1hdGNoZXIpO1xyXG5cdFx0XHQvLyBcdHJldHVybiBtYXRjaGVyO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdGdlbmVyYXRlTWF0Y2hlcihzb3VyY2U6IHN0cmluZyk6ICgoaW5wdXQ6IHN0cmluZykgPT4gYm9vbGVhbikge1xyXG5cdFx0XHRcdHNvdXJjZSA9IHNvdXJjZS50cmltKCk7XHJcblx0XHRcdFx0aWYgKHNvdXJjZS5sZW5ndGggPT0gMCkgcmV0dXJuICgpID0+IHRydWU7XHJcblx0XHRcdFx0aWYgKHNvdXJjZS5pbmNsdWRlcygnICcpKSB7XHJcblx0XHRcdFx0XHRsZXQgcGFydHMgPSBzb3VyY2Uuc3BsaXQoJyAnKS5tYXAoZSA9PiB0aGlzLmdlbmVyYXRlTWF0Y2hlcihlKSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gKGlucHV0KSA9PiBwYXJ0cy5ldmVyeShtID0+IG0oaW5wdXQpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHNvdXJjZS5zdGFydHNXaXRoKCctJykpIHtcclxuXHRcdFx0XHRcdGlmIChzb3VyY2UubGVuZ3RoIDwgMykgcmV0dXJuICgpID0+IHRydWU7XHJcblx0XHRcdFx0XHRsZXQgYmFzZSA9IHRoaXMuZ2VuZXJhdGVNYXRjaGVyKHNvdXJjZS5zbGljZSgxKSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gKGlucHV0KSA9PiAhYmFzZShpbnB1dCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRsZXQgZmxhZ3MgPSBzb3VyY2UudG9Mb3dlckNhc2UoKSA9PSBzb3VyY2UgPyAnaScgOiAnJztcclxuXHRcdFx0XHRcdGxldCByZWdleCA9IG5ldyBSZWdFeHAoc291cmNlLCBmbGFncyk7XHJcblx0XHRcdFx0XHRyZXR1cm4gKGlucHV0KSA9PiAhIWlucHV0Lm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7IH07XHJcblx0XHRcdFx0cmV0dXJuIChpbnB1dCkgPT4gaW5wdXQuaW5jbHVkZXMoc291cmNlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHR5cGUgVGFnR2V0dGVyRm48RGF0YT4gPSBzZWxlY3RvciB8ICgoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50LCBtb2RlOiBNb2RlKSA9PiAoSFRNTEVsZW1lbnRbXSB8IHN0cmluZ1tdKSk7XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFRhZ0ZpbHRlclNvdXJjZTxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdHRhZ3M6IFRhZ0dldHRlckZuPERhdGE+O1xyXG5cdFx0XHRpbnB1dD86IHN0cmluZztcclxuXHRcdFx0aGlnaGlnaHRDbGFzcz86IHN0cmluZztcclxuXHRcdH1cclxuXHRcdHR5cGUgVGFnTWF0Y2hlciA9IHsgcG9zaXRpdmU6IGJvb2xlYW4sIG1hdGNoZXM6IChzOiBzdHJpbmcpID0+IGJvb2xlYW4gfTtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgVGFnRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdHRhZ3M6IFRhZ0dldHRlckZuPERhdGE+O1xyXG5cdFx0XHRpbnB1dDogSFRNTElucHV0RWxlbWVudDtcclxuXHRcdFx0aGlnaGlnaHRDbGFzczogc3RyaW5nO1xyXG5cclxuXHRcdFx0bGFzdFZhbHVlOiBzdHJpbmcgPSAnJztcclxuXHRcdFx0Y2FjaGVkTWF0Y2hlcjogVGFnTWF0Y2hlcltdO1xyXG5cclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IFRhZ0ZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtZmlsdGVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXQgPSBlbG08J2lucHV0Jz4oYGlucHV0W3R5cGU9dGV4dH1dYCxcclxuXHRcdFx0XHRcdGlucHV0ID0+IHRoaXMuY2hhbmdlKCksXHJcblx0XHRcdFx0KS5hcHBlbmRUbyh0aGlzLmJ1dHRvbik7XHJcblx0XHRcdFx0dGhpcy5pbnB1dC52YWx1ZSA9IGRhdGEuaW5wdXQgfHwgJyc7XHJcblx0XHRcdFx0dGhpcy50YWdzID0gZGF0YS50YWdzO1xyXG5cdFx0XHRcdHRoaXMuY2FjaGVkTWF0Y2hlciA9IFtdO1xyXG5cclxuXHRcdFx0XHR0aGlzLmhpZ2hpZ2h0Q2xhc3MgPSBkYXRhLmhpZ2hpZ2h0Q2xhc3MgPz8gJ2VmLXRhZy1oaWdobGlzaHQnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcclxuXHRcdFx0XHRsZXQgdGFncyA9IHRoaXMuZ2V0VGFncyhkYXRhLCBlbCk7XHJcblx0XHRcdFx0dGFncy5tYXAodGFnID0+IHRoaXMucmVzZXRIaWdobGlnaHQodGFnKSk7XHJcblxyXG5cdFx0XHRcdGxldCByZXN1bHRzID0gdGhpcy5jYWNoZWRNYXRjaGVyLm1hcChtID0+IHtcclxuXHRcdFx0XHRcdGxldCByID0geyBwb3NpdGl2ZTogbS5wb3NpdGl2ZSwgY291bnQ6IDAgfTtcclxuXHRcdFx0XHRcdGZvciAobGV0IHRhZyBvZiB0YWdzKSB7XHJcblx0XHRcdFx0XHRcdGxldCBzdHIgPSB0eXBlb2YgdGFnID09ICdzdHJpbmcnID8gdGFnIDogdGFnLmlubmVyVGV4dDtcclxuXHRcdFx0XHRcdFx0bGV0IHZhbCA9IG0ubWF0Y2hlcyhzdHIpO1xyXG5cdFx0XHRcdFx0XHRpZiAodmFsKSB7XHJcblx0XHRcdFx0XHRcdFx0ci5jb3VudCsrO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuaGlnaGxpZ2h0VGFnKHRhZywgbS5wb3NpdGl2ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiByZXN1bHRzLmV2ZXJ5KHIgPT4gci5wb3NpdGl2ZSA/IHIuY291bnQgPiAwIDogci5jb3VudCA9PSAwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXNldEhpZ2hsaWdodCh0YWc6IHN0cmluZyB8IEhUTUxFbGVtZW50KSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0YWcgPT0gJ3N0cmluZycpIHJldHVybjtcclxuXHRcdFx0XHR0YWcuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmhpZ2hpZ2h0Q2xhc3MpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGhpZ2hsaWdodFRhZyh0YWc6IHN0cmluZyB8IEhUTUxFbGVtZW50LCBwb3NpdGl2ZTogYm9vbGVhbikge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGFnID09ICdzdHJpbmcnKSByZXR1cm47XHJcblx0XHRcdFx0Ly8gRklYTUVcclxuXHRcdFx0XHR0YWcuY2xhc3NMaXN0LmFkZCh0aGlzLmhpZ2hpZ2h0Q2xhc3MpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRnZXRUYWdzKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50W10gfCBzdHJpbmdbXSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnRhZ3MgPT0gJ3N0cmluZycpIHJldHVybiBlbC5xcTxIVE1MRWxlbWVudD4odGhpcy50YWdzKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy50YWdzKGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGdldFRhZ1N0cmluZ3MoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogc3RyaW5nW10ge1xyXG5cdFx0XHRcdGxldCB0YWdzID0gdGhpcy5nZXRUYWdzKGRhdGEsIGVsKTtcclxuXHRcdFx0XHRpZiAodHlwZW9mIHRhZ3NbMF0gPT0gJ3N0cmluZycpIHJldHVybiB0YWdzIGFzIHN0cmluZ1tdO1xyXG5cdFx0XHRcdHJldHVybiB0YWdzLm1hcCgoZSkgPT4gZS5pbm5lclRleHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjaGFuZ2UoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubGFzdFZhbHVlID09IHRoaXMuaW5wdXQudmFsdWUpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLmxhc3RWYWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XHJcblx0XHRcdFx0dGhpcy5jYWNoZWRNYXRjaGVyID0gdGhpcy5wYXJzZU1hdGNoZXIodGhpcy5sYXN0VmFsdWUpO1xyXG5cdFx0XHRcdHRoaXMucGFyZW50LnJlcXVlc3RVcGRhdGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cGFyc2VNYXRjaGVyKG1hdGNoZXI6IHN0cmluZyk6IFRhZ01hdGNoZXJbXSB7XHJcblx0XHRcdFx0bWF0Y2hlci50cmltKCk7XHJcblx0XHRcdFx0aWYgKCFtYXRjaGVyKSByZXR1cm4gW107XHJcblxyXG5cdFx0XHRcdGlmIChtYXRjaGVyLmluY2x1ZGVzKCcgJykpIHtcclxuXHRcdFx0XHRcdGxldCBwYXJ0cyA9IG1hdGNoZXIubWF0Y2goL1wiW15cIl0qXCJ8XFxTKy9nKSB8fCBbXTtcclxuXHRcdFx0XHRcdHJldHVybiBwYXJ0cy5mbGF0TWFwKGUgPT4gdGhpcy5wYXJzZU1hdGNoZXIoZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAobWF0Y2hlci5zdGFydHNXaXRoKCctJykpIHtcclxuXHRcdFx0XHRcdGxldCBwYXJ0cyA9IHRoaXMucGFyc2VNYXRjaGVyKG1hdGNoZXIuc2xpY2UoMSkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHBhcnRzLm1hcChlID0+ICh7IHBvc2l0aXZlOiAhZS5wb3NpdGl2ZSwgbWF0Y2hlczogZS5tYXRjaGVzIH0pKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG1hdGNoZXIubWF0Y2goL1wiXlteXCJdKlwiJC8pKSB7XHJcblx0XHRcdFx0XHRtYXRjaGVyID0gbWF0Y2hlci5zbGljZSgxLCAtMSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gW3sgcG9zaXRpdmU6IHRydWUsIG1hdGNoZXM6IHRhZyA9PiB0YWcgPT0gbWF0Y2hlciB9XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG1hdGNoZXIubGVuZ3RoIDwgMykgcmV0dXJuIFtdO1xyXG5cdFx0XHRcdGlmIChtYXRjaGVyLm1hdGNoKC9cIi8pPy5sZW5ndGggPT0gMSkgcmV0dXJuIFtdO1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRsZXQgZyA9IG5ldyBSZWdFeHAobWF0Y2hlciwgJ2knKTtcclxuXHRcdFx0XHRcdHJldHVybiBbeyBwb3NpdGl2ZTogdHJ1ZSwgbWF0Y2hlczogdGFnID0+ICEhdGFnLm1hdGNoKGcpIH1dO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHsgfVxyXG5cdFx0XHRcdHJldHVybiBbeyBwb3NpdGl2ZTogdHJ1ZSwgbWF0Y2hlczogdGFnID0+IHRhZy5pbmNsdWRlcyhtYXRjaGVyKSB9XTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgY2xhc3MgUGFnaW5hdGlvbkluZm9GaWx0ZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4gaW1wbGVtZW50cyBJRmlsdGVyPERhdGE+IHtcclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogRmlsdGVyZXJJdGVtU291cmNlKSB7XHJcblx0XHRcdFx0c3VwZXIoZGF0YSk7XHJcblx0XHRcdFx0dGhpcy5pbml0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXBwbHkoKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0UGFnaW5hdGUgPSBQb29wSnMuUGFnaW5hdGVFeHRlbnNpb24uUGFnaW5hdGU7XHJcblx0XHRcdGNvdW50UGFnaW5hdGUoKSB7XHJcblx0XHRcdFx0bGV0IGRhdGEgPSB7IHJ1bm5pbmc6IDAsIHF1ZXVlZDogMCwgfTtcclxuXHRcdFx0XHRmb3IgKGxldCBwIG9mIHRoaXMuUGFnaW5hdGUuaW5zdGFuY2VzKSB7XHJcblx0XHRcdFx0XHRkYXRhLnJ1bm5pbmcgKz0gK3AucnVubmluZztcclxuXHRcdFx0XHRcdGRhdGEucXVldWVkICs9IHAucXVldWVkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dXBkYXRlSW5mbygpIHtcclxuXHRcdFx0XHRsZXQgZGF0YSA9IHRoaXMuY291bnRQYWdpbmF0ZSgpO1xyXG5cdFx0XHRcdGlmICghZGF0YS5ydW5uaW5nICYmICFkYXRhLnF1ZXVlZCkge1xyXG5cdFx0XHRcdFx0dGhpcy5oaWRkZW4gfHwgdGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuaGlkZGVuICYmIHRoaXMuc2hvdygpO1xyXG5cdFx0XHRcdFx0bGV0IHRleHQgPSBgLi4uICske2RhdGEucnVubmluZyArIGRhdGEucXVldWVkfWA7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5idXR0b24uaW5uZXJIVE1MICE9IHRleHQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5idXR0b24uaW5uZXJUZXh0ID0gdGV4dDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFzeW5jIGluaXQoKSB7XHJcblx0XHRcdFx0d2hpbGUgKHRydWUpIHtcclxuXHRcdFx0XHRcdGF3YWl0IFByb21pc2UuZnJhbWUoKTtcclxuXHRcdFx0XHRcdHRoaXMudXBkYXRlSW5mbygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn1cclxuIiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgTW9kaWZpZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4gaW1wbGVtZW50cyBJTW9kaWZpZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIG1vZGlmaWVyOiBNb2RpZmllckZuPERhdGE+O1xyXG5cdFx0XHRkZWNsYXJlIHJ1bk9uTm9DaGFuZ2U/OiBib29sZWFuO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogTW9kaWZpZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLW1vZGlmaWVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0b2dnbGVNb2RlKG1vZGU6IE1vZGUsIGZvcmNlID0gZmFsc2UpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09IG1vZGUgJiYgIWZvcmNlKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy5wYXJlbnQubW92ZVRvVG9wKHRoaXMpO1xyXG5cdFx0XHRcdHN1cGVyLnRvZ2dsZU1vZGUobW9kZSwgZm9yY2UpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpIHtcclxuXHRcdFx0XHRsZXQgb2xkTW9kZTogTW9kZSB8IG51bGwgPSBlbC5nZXRBdHRyaWJ1dGUoYGVmLW1vZGlmaWVyLSR7dGhpcy5pZH0tbW9kZWApIGFzIChNb2RlIHwgbnVsbCk7XHJcblx0XHRcdFx0aWYgKG9sZE1vZGUgPT0gdGhpcy5tb2RlICYmICF0aGlzLnJ1bk9uTm9DaGFuZ2UpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLm1vZGlmaWVyKGRhdGEsIGVsLCB0aGlzLm1vZGUsIG51bGwpO1xyXG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZShgZWYtbW9kaWZpZXItJHt0aGlzLmlkfS1tb2RlYCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBQcmVmaXhlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElNb2RpZmllcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgdGFyZ2V0OiBzZWxlY3RvciB8ICgoZTogSFRNTEVsZW1lbnQsIGRhdGE6IERhdGEsIG1vZGU6IE1vZGUpID0+IChIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10pKTtcclxuXHRcdFx0ZGVjbGFyZSBwcmVmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50LCBtb2RlOiBNb2RlKSA9PiBzdHJpbmc7XHJcblx0XHRcdGRlY2xhcmUgcG9zdGZpeD86IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUpID0+IHN0cmluZztcclxuXHRcdFx0ZGVjbGFyZSBwcmVmaXhBdHRyaWJ1dGU6IHN0cmluZztcclxuXHRcdFx0ZGVjbGFyZSBwb3N0Zml4QXR0cmlidXRlOiBzdHJpbmc7XHJcblx0XHRcdGRlY2xhcmUgYWxsOiBib29sZWFuO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogUHJlZml4ZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLW1vZGlmaWVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdGRhdGEudGFyZ2V0ID8/PSBlID0+IGU7XHJcblx0XHRcdFx0ZGF0YS5wcmVmaXhBdHRyaWJ1dGUgPz89ICdlZi1wcmVmaXgnO1xyXG5cdFx0XHRcdGRhdGEucG9zdGZpeEF0dHJpYnV0ZSA/Pz0gJ2VmLXBvc3RmaXgnO1xyXG5cdFx0XHRcdGRhdGEuYWxsID8/PSBmYWxzZTtcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSB7XHJcblx0XHRcdFx0bGV0IHRhcmdldHMgPSB0aGlzLmdldFRhcmdldHMoZWwsIGRhdGEpO1xyXG5cdFx0XHRcdGlmICh0aGlzLnByZWZpeCkge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykge1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRzLm1hcChlID0+IGUucmVtb3ZlQXR0cmlidXRlKHRoaXMucHJlZml4QXR0cmlidXRlKSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsZXQgdmFsdWUgPSB0aGlzLnByZWZpeChkYXRhLCBlbCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0XHRcdFx0dGFyZ2V0cy5tYXAoZSA9PiBlLnNldEF0dHJpYnV0ZSh0aGlzLnByZWZpeEF0dHJpYnV0ZSwgdmFsdWUpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMucG9zdGZpeCkge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykge1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRzLm1hcChlID0+IGUucmVtb3ZlQXR0cmlidXRlKHRoaXMucG9zdGZpeEF0dHJpYnV0ZSkpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gdGhpcy5wb3N0Zml4KGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRzLm1hcChlID0+IGUuc2V0QXR0cmlidXRlKHRoaXMucG9zdGZpeEF0dHJpYnV0ZSwgdmFsdWUpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGdldFRhcmdldHMoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBEYXRhKTogSFRNTEVsZW1lbnRbXSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnRhcmdldCA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuYWxsKSByZXR1cm4gZWwucXEodGhpcy50YXJnZXQpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIFtlbC5xKHRoaXMudGFyZ2V0KV07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGxldCB0YXJnZXRzID0gdGhpcy50YXJnZXQoZWwsIGRhdGEsIHRoaXMubW9kZSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gQXJyYXkuaXNBcnJheSh0YXJnZXRzKSA/IHRhcmdldHMgOiBbdGFyZ2V0c107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRW50cnlGaWx0ZXJlckV4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFNvcnRlcjxEYXRhLCBWIGV4dGVuZHMgbnVtYmVyIHwgc3RyaW5nPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElTb3J0ZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIHNvcnRlcjogU29ydGVyRm48RGF0YSwgVj47XHJcblx0XHRcdGRlY2xhcmUgY29tcGFyYXRvcjogKGE6IFYsIGI6IFYpID0+IG51bWJlcjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IFNvcnRlclNvdXJjZTxEYXRhLCBWPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtc29ydGVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdGRhdGEuY29tcGFyYXRvciA/Pz0gKGE6IFYsIGI6IFYpID0+IGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0b2dnbGVNb2RlKG1vZGU6IE1vZGUsIGZvcmNlID0gZmFsc2UpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09IG1vZGUgJiYgIWZvcmNlKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy5wYXJlbnQubW92ZVRvVG9wKHRoaXMpO1xyXG5cdFx0XHRcdHN1cGVyLnRvZ2dsZU1vZGUobW9kZSwgZm9yY2UpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzb3J0KGxpc3Q6IFtEYXRhLCBIVE1MRWxlbWVudF1bXSk6IFtEYXRhLCBIVE1MRWxlbWVudF1bXSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykgcmV0dXJuIGxpc3Q7XHJcblx0XHRcdFx0cmV0dXJuIGxpc3QudnNvcnQoKFtkYXRhLCBlbF06IFtEYXRhLCBIVE1MRWxlbWVudF0pID0+IHRoaXMuYXBwbHkoZGF0YSwgZWwpLCAoYTogViwgYjogVikgPT4gdGhpcy5jb21wYXJlKGEsIGIpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyoqIHJldHVybnMgb3JkZXIgb2YgZW50cnkgKi9cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogViB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuc29ydGVyKGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb21wYXJlKGE6IFYsIGI6IFYpOiBudW1iZXIge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29uJykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29tcGFyYXRvcihhLCBiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb3Bwb3NpdGUnKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb21wYXJhdG9yKGIsIGEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHRcdGV4cG9ydCB0eXBlIFdheW5lc3MgPSBmYWxzZSB8IHRydWUgfCAnZGlyJztcclxuXHRcdGV4cG9ydCB0eXBlIE1vZGUgPSAnb2ZmJyB8ICdvbicgfCAnb3Bwb3NpdGUnO1xyXG5cclxuXHRcdGV4cG9ydCB0eXBlIFBhcnNlckZuPERhdGE+ID0gKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogUGFydGlhbDxEYXRhPikgPT4gUGFydGlhbDxEYXRhPiB8IHZvaWQgfCBQcm9taXNlTGlrZTxQYXJ0aWFsPERhdGEgfCB2b2lkPj47XHJcblx0XHRleHBvcnQgdHlwZSBGaWx0ZXJGbjxEYXRhPiA9IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUpID0+IGJvb2xlYW47XHJcblx0XHRleHBvcnQgdHlwZSBTb3J0ZXJGbjxEYXRhLCBWPiA9IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUpID0+IFY7XHJcblx0XHRleHBvcnQgdHlwZSBNb2RpZmllckZuPERhdGE+ID0gKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSwgb2xkTW9kZTogTW9kZSB8IG51bGwpID0+IHZvaWQ7XHJcblx0XHRleHBvcnQgdHlwZSBWYWx1ZUZpbHRlckZuPERhdGEsIFY+ID0gKHZhbHVlOiBWLCBkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IGJvb2xlYW47XHJcblx0XHRleHBvcnQgdHlwZSBQcmVmaXhlckZuPERhdGE+ID0gKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSkgPT4gc3RyaW5nO1xyXG5cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgSUZpbHRlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiB7XHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW47XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIElTb3J0ZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4ge1xyXG5cdFx0XHRzb3J0KGxpc3Q6IFtEYXRhLCBIVE1MRWxlbWVudF1bXSk6IFtEYXRhLCBIVE1MRWxlbWVudF1bXTtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgSU1vZGlmaWVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IHtcclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogdm9pZDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdGJ1dHRvbj86IHNlbGVjdG9yO1xyXG5cdFx0XHRpZDogc3RyaW5nO1xyXG5cdFx0XHRuYW1lPzogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbj86IHN0cmluZztcclxuXHRcdFx0dGhyZWVXYXk/OiBXYXluZXNzO1xyXG5cdFx0XHRtb2RlPzogTW9kZTtcclxuXHRcdFx0cGFyZW50OiBFbnRyeUZpbHRlcmVyO1xyXG5cdFx0XHRpbmNvbXBhdGlibGU/OiBzdHJpbmdbXTtcclxuXHRcdFx0aGlkZGVuPzogYm9vbGVhbjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyU291cmNlPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0ZmlsdGVyOiBGaWx0ZXJGbjxEYXRhPjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgVmFsdWVGaWx0ZXJTb3VyY2U8RGF0YSwgVj4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1Tb3VyY2Uge1xyXG5cdFx0XHRmaWx0ZXI6IFZhbHVlRmlsdGVyRm48RGF0YSwgVj47XHJcblx0XHRcdGlucHV0OiBWO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBNYXRjaEZpbHRlclNvdXJjZTxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdHZhbHVlPzogKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkgPT4gc3RyaW5nO1xyXG5cdFx0XHRpbnB1dD86IHN0cmluZztcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgU29ydGVyU291cmNlPERhdGEsIFY+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0c29ydGVyOiBTb3J0ZXJGbjxEYXRhLCBWPjtcclxuXHRcdFx0Y29tcGFyYXRvcj86ICgoYTogViwgYjogVikgPT4gbnVtYmVyKSB8IFY7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIE1vZGlmaWVyU291cmNlPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0bW9kaWZpZXI6IE1vZGlmaWVyRm48RGF0YT47XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFByZWZpeGVyU291cmNlPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0dGFyZ2V0Pzogc2VsZWN0b3IgfCAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogRGF0YSwgbW9kZTogTW9kZSkgPT4gSFRNTEVsZW1lbnQpO1xyXG5cdFx0XHRwcmVmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHBvc3RmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHByZWZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0cG9zdGZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0YWxsPzogYm9vbGVhbjtcclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyZXJJdGVtUGFydGlhbCB7XHJcblx0XHRcdGJ1dHRvbj86IHNlbGVjdG9yO1xyXG5cdFx0XHRpZD86IHN0cmluZztcclxuXHRcdFx0bmFtZT86IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcblx0XHRcdHRocmVlV2F5PzogV2F5bmVzcztcclxuXHRcdFx0bW9kZT86IE1vZGU7XHJcblx0XHRcdGluY29tcGF0aWJsZT86IHN0cmluZ1tdO1xyXG5cdFx0XHRoaWRkZW4/OiBib29sZWFuO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBGaWx0ZXJQYXJ0aWFsPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCB7IH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgVmFsdWVGaWx0ZXJQYXJ0aWFsPERhdGEsIFY+IGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCB7XHJcblx0XHRcdGlucHV0OiBWO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBTb3J0ZXJQYXJ0aWFsU291cmNlPERhdGEsIFY+IGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCB7XHJcblx0XHRcdGNvbXBhcmF0b3I/OiAoKGE6IFYsIGI6IFYpID0+IG51bWJlcikgfCBWO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBNb2RpZmllclBhcnRpYWw8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1QYXJ0aWFsIHsgfVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBQcmVmaXhlclBhcnRpYWw8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1QYXJ0aWFsIHtcclxuXHRcdFx0dGFyZ2V0Pzogc2VsZWN0b3IgfCAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogRGF0YSwgbW9kZTogTW9kZSkgPT4gSFRNTEVsZW1lbnQpO1xyXG5cdFx0XHRwcmVmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHBvc3RmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHByZWZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0cG9zdGZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0YWxsPzogYm9vbGVhbjtcclxuXHRcdH1cclxuXHJcblx0XHR0eXBlIFVuaW9uPFNvdXJjZSwgUmVzdWx0PiA9IHtcclxuXHRcdFx0W1AgaW4ga2V5b2YgU291cmNlICYga2V5b2YgUmVzdWx0XTogU291cmNlW1BdIHwgUmVzdWx0W1BdO1xyXG5cdFx0fSAmIE9taXQ8U291cmNlLCBrZXlvZiBSZXN1bHQ+ICYgT21pdDxSZXN1bHQsIGtleW9mIFNvdXJjZT47XHJcblxyXG5cdFx0dHlwZSBPdmVycmlkZTxULCBPPiA9IE9taXQ8VCwga2V5b2YgTz4gJiBPO1xyXG5cclxuXHRcdHR5cGUgRUZTb3VyY2U8VCBleHRlbmRzIHsgc291cmNlOiBhbnkgfT4gPSBPdmVycmlkZTxPdmVycmlkZTxQYXJ0aWFsPFQ+LCBUWydzb3VyY2UnXT4sIHsgYnV0dG9uPzogc2VsZWN0b3IgfT47XHJcblxyXG5cdFx0dHlwZSBTb3VyY2U8VCBleHRlbmRzIHsgc291cmNlOiBhbnkgfT4gPSBUWydzb3VyY2UnXSAmIHtcclxuXHRcdFx0aWQ/OiBzdHJpbmc7IG5hbWU/OiBzdHJpbmc7IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG5cdFx0XHR0aHJlZVdheT86IFdheW5lc3M7IG1vZGU/OiBNb2RlOyBpbmNvbXBhdGlibGU/OiBzdHJpbmdbXTsgaGlkZGVuPzogYm9vbGVhbjtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogY2FuIGJlIGVpdGhlciBNYXAgb3IgV2Vha01hcFxyXG5cdFx0ICogKFdlYWtNYXAgaXMgbGlrZWx5IHRvIGJlIHVzZWxlc3MgaWYgdGhlcmUgYXJlIGxlc3MgdGhlbiAxMGsgb2xkIG5vZGVzIGluIG1hcClcclxuXHRcdCAqL1xyXG5cdFx0bGV0IE1hcFR5cGUgPSBNYXA7XHJcblx0XHR0eXBlIE1hcFR5cGU8SyBleHRlbmRzIG9iamVjdCwgVj4gPS8vIE1hcDxLLCBWPiB8IFxyXG5cdFx0XHRXZWFrTWFwPEssIFY+O1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGxldCBFRiA9IEVudHJ5RmlsdGVyZXJFeHRlbnNpb24uRW50cnlGaWx0ZXJlcjtcclxufSIsIlxyXG5cclxubmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cclxuXHRleHBvcnQgY2xhc3MgU2Nyb2xsSW5mbyB7XHJcblx0XHRlbDogSFRNTEVsZW1lbnQ7XHJcblx0XHQvKiogYWJzb2x1dGUgcmVjdCAqL1xyXG5cdFx0cmVjdDogRE9NUmVjdDtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihlbDogSFRNTEVsZW1lbnQpIHtcclxuXHRcdFx0dGhpcy5lbCA9IGVsO1xyXG5cdFx0XHRsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRmdW5jdGlvbiBuKHY6IG51bWJlcikgeyByZXR1cm4gK3YudG9GaXhlZCgzKTsgfVxyXG5cdFx0XHR0aGlzLnJlY3QgPSBuZXcgRE9NUmVjdChcclxuXHRcdFx0XHRuKHJlY3QueCAvIGlubmVyV2lkdGgpLCBuKChyZWN0LnkgKyBzY3JvbGxZKSAvIGlubmVySGVpZ2h0KSxcclxuXHRcdFx0XHRuKHJlY3Qud2lkdGggLyBpbm5lcldpZHRoKSwgbihyZWN0LmhlaWdodCAvIGlubmVySGVpZ2h0KSk7XHJcblx0XHR9XHJcblx0XHR0b3BPZmZzZXQoc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZKSB7XHJcblx0XHRcdGxldCB3aW5kb3dZID0gc2Nyb2xsWSAvIGlubmVySGVpZ2h0O1xyXG5cdFx0XHRsZXQgb2Zmc2V0ID0gdGhpcy5yZWN0LnRvcCAtIHdpbmRvd1k7XHJcblx0XHRcdHJldHVybiArb2Zmc2V0LnRvRml4ZWQoMyk7XHJcblx0XHR9XHJcblx0XHRjZW50ZXJPZmZzZXQoc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZKSB7XHJcblx0XHRcdGxldCB3aW5kb3dZID0gc2Nyb2xsWSAvIGlubmVySGVpZ2h0ICsgMC41O1xyXG5cdFx0XHRsZXQgb2Zmc2V0ID0gdGhpcy5yZWN0LnRvcCArIHRoaXMucmVjdC5oZWlnaHQgLyAyIC0gd2luZG93WTtcclxuXHRcdFx0cmV0dXJuICtvZmZzZXQudG9GaXhlZCgzKTtcclxuXHRcdH1cclxuXHRcdGJvdHRvbU9mZnNldChzY3JvbGxZID0gd2luZG93LnNjcm9sbFkpIHtcclxuXHRcdFx0bGV0IHdpbmRvd1kgPSBzY3JvbGxZIC8gaW5uZXJIZWlnaHQgKyAxO1xyXG5cdFx0XHRsZXQgb2Zmc2V0ID0gdGhpcy5yZWN0LmJvdHRvbSAtIHdpbmRvd1k7XHJcblx0XHRcdHJldHVybiArb2Zmc2V0LnRvRml4ZWQoMyk7XHJcblx0XHR9XHJcblx0XHRkaXN0YW5jZUZyb21TY3JlZW4oc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZKSB7XHJcblx0XHRcdGxldCB3aW5kb3dZID0gc2Nyb2xsWSAvIGlubmVySGVpZ2h0O1xyXG5cdFx0XHRpZiAodGhpcy5yZWN0LmJvdHRvbSA8IHdpbmRvd1kgLSAwLjAwMDEpIHJldHVybiB0aGlzLnJlY3QuYm90dG9tIC0gd2luZG93WTtcclxuXHRcdFx0aWYgKHRoaXMucmVjdC50b3AgPiB3aW5kb3dZICsgMS4wMDEpIHJldHVybiB0aGlzLnJlY3QudG9wIC0gd2luZG93WSAtIDE7XHJcblx0XHR9XHJcblxyXG5cdFx0Z2V0IGZ1bGxEaXIoKSB7XHJcblx0XHRcdGlmICh0aGlzLnRvcE9mZnNldCgpIDwgLTAuMDAxKVxyXG5cdFx0XHRcdHJldHVybiAtMTtcclxuXHRcdFx0aWYgKHRoaXMuYm90dG9tT2Zmc2V0KCkgPiAwLjAwMSlcclxuXHRcdFx0XHRyZXR1cm4gMTtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRnZXQgX29mZnNldHMoKSB7XHJcblx0XHRcdHJldHVybiBbdGhpcy50b3BPZmZzZXQoKSwgdGhpcy5jZW50ZXJPZmZzZXQoKSwgdGhpcy5ib3R0b21PZmZzZXQoKV07XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGNsYXNzIEltYWdlU2Nyb2xsZXIge1xyXG5cdFx0c2VsZWN0b3IgPSAnaW1nJztcclxuXHJcblx0XHRlbmFibGVkID0gZmFsc2U7XHJcblx0XHRsaXN0ZW5lcj86IGFueTtcclxuXHJcblx0XHRzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihzZWxlY3RvciA9ICcnKSB7XHJcblx0XHRcdGlmIChzZWxlY3RvcikgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xyXG5cdFx0fVxyXG5cclxuXHRcdF93aGVlbExpc3RlbmVyPzogKGV2ZW50OiBXaGVlbEV2ZW50KSA9PiB2b2lkO1xyXG5cdFx0YmluZFdoZWVsKCkge1xyXG5cdFx0XHRpZiAodGhpcy5fd2hlZWxMaXN0ZW5lcikgcmV0dXJuO1xyXG5cdFx0XHRsZXQgbCA9IHRoaXMuX3doZWVsTGlzdGVuZXIgPSAoZXZlbnQpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5fd2hlZWxMaXN0ZW5lciAhPSBsKSByZXR1cm4gcmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBsKTtcclxuXHRcdFx0XHRpZiAoIXRoaXMuZW5hYmxlZCkgcmV0dXJuO1xyXG5cdFx0XHRcdGlmICghZXZlbnQuZGVsdGFZKSByZXR1cm47XHJcblx0XHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5IHx8IGV2ZW50LmN0cmxLZXkpIHJldHVybjtcclxuXHRcdFx0XHRpZiAodGhpcy5zY3JvbGwoTWF0aC5zaWduKGV2ZW50LmRlbHRhWSkpKSB7XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0dGhpcy5zdG9wUHJvcGFnYXRpb24gJiYgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5fd2hlZWxMaXN0ZW5lciwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcclxuXHRcdH1cclxuXHRcdF9hcnJvd0xpc3RlbmVyPzogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkO1xyXG5cdFx0YmluZEFycm93cygpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2Fycm93TGlzdGVuZXIpIHJldHVybjtcclxuXHRcdFx0dGhpcy5fYXJyb3dMaXN0ZW5lciA9IChldmVudCkgPT4ge1xyXG5cdFx0XHRcdGlmICghdGhpcy5lbmFibGVkKSByZXR1cm47XHJcblx0XHRcdFx0aWYgKGV2ZW50LmNvZGUgPT0gJ0Fycm93TGVmdCcpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnNjcm9sbCgtMSkpIHtcclxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5zdG9wUHJvcGFnYXRpb24gJiYgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChldmVudC5jb2RlID09ICdBcnJvd1JpZ2h0Jykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuc2Nyb2xsKDEpKSB7XHJcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3RvcFByb3BhZ2F0aW9uICYmIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2Fycm93TGlzdGVuZXIsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvKiogZW5hYmxlIHRoaXMgc2Nyb2xsZXIgKi9cclxuXHRcdG9uKHNlbGVjdG9yID0gJycpIHtcclxuXHRcdFx0aWYgKHNlbGVjdG9yKSB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XHJcblx0XHRcdHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuYmluZEFycm93cygpO1xyXG5cdFx0XHR0aGlzLmJpbmRXaGVlbCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKiBkaXNhYmxlIHRoaXMgc2Nyb2xsZXIgKi9cclxuXHRcdG9mZihzZWxlY3RvciA9ICcnKSB7XHJcblx0XHRcdGlmIChzZWxlY3RvcikgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xyXG5cdFx0XHR0aGlzLmVuYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblxyXG5cdFx0bW9kZTogJ3NpbmdsZScgfCAnZ3JvdXAnID0gJ2dyb3VwJztcclxuXHJcblx0XHQvKiogc2Nyb2xsIHRvIHRoZSBuZXh0IGl0ZW0gKi9cclxuXHRcdHNjcm9sbChkaXI6IC0xIHwgMCB8IDEpOiBib29sZWFuIHtcclxuXHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnZ3JvdXAnKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuc2Nyb2xsVG9OZXh0R3JvdXAoZGlyKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5tb2RlID09ICdzaW5nbGUnKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuc2Nyb2xsVG9OZXh0Q2VudGVyKGRpcik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0c2Nyb2xsVG9OZXh0Q2VudGVyKGRpcjogLTEgfCAwIHwgMSk6IGJvb2xlYW4ge1xyXG5cdFx0XHRsZXQgbmV4dCA9IHRoaXMuX25leHRTY3JvbGxUYXJnZXQoZGlyLCAnc2luZ2xlJyk7XHJcblx0XHRcdGlmIChQb29wSnMuZGVidWcpIHsgY29uc29sZS5sb2coYHNjcm9sbDogYCwgbmV4dCk7IH1cclxuXHRcdFx0aWYgKCFuZXh0KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdG5leHQuZWwuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogJ2NlbnRlcicgfSk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNjcm9sbFRvTmV4dEdyb3VwKGRpcjogLTEgfCAwIHwgMSk6IGJvb2xlYW4ge1xyXG5cdFx0XHRsZXQgbmV4dCA9IHRoaXMuX25leHRTY3JvbGxUYXJnZXQoZGlyLCAnZ3JvdXAnKTtcclxuXHRcdFx0aWYgKFBvb3BKcy5kZWJ1ZykgeyBjb25zb2xlLmxvZyhgc2Nyb2xsOiBgLCBuZXh0KTsgfVxyXG5cdFx0XHRpZiAoIW5leHQgfHwgIW5leHQubGVuZ3RoKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGxldCB5ID0gKG5leHRbMF0ucmVjdC50b3AgKyBuZXh0LmF0KC0xKS5yZWN0LmJvdHRvbSAtIDEpIC8gMjtcclxuXHRcdFx0Ly8gZml4bWVcclxuXHRcdFx0aWYgKE1hdGguYWJzKHNjcm9sbFkgLyBpbm5lckhlaWdodCAtIHkpID4gMC43NTApIHtcclxuXHRcdFx0XHRpZiAoIXRoaXMuZ2V0QWxsU2Nyb2xscygpLmZpbmQoZSA9PiBlLmZ1bGxEaXIgPT0gMCkpIHtcclxuXHRcdFx0XHRcdGlmIChQb29wSnMuZGVidWcpIHsgY29uc29sZS5sb2coYHNjcm9sbCB0b28gZmFyYCwgbmV4dCk7IH1cclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0c2Nyb2xsVG8oMCwgeSAqIGlubmVySGVpZ2h0KTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0X25leHRTY3JvbGxUYXJnZXQoZGlyOiAtMSB8IDAgfCAxLCBtb2RlOiAnc2luZ2xlJyk6IFNjcm9sbEluZm8gfCB1bmRlZmluZWQ7XHJcblx0XHRfbmV4dFNjcm9sbFRhcmdldChkaXI6IC0xIHwgMCB8IDEsIG1vZGU6ICdncm91cCcpOiBTY3JvbGxJbmZvW10gfCB1bmRlZmluZWQ7XHJcblx0XHRfbmV4dFNjcm9sbFRhcmdldChkaXI6IC0xIHwgMCB8IDEsIG1vZGU6ICdzaW5nbGUnIHwgJ2dyb3VwJykge1xyXG5cdFx0XHRsZXQgc2Nyb2xscyA9IHRoaXMuZ2V0QWxsU2Nyb2xscygpO1xyXG5cdFx0XHRpZiAobW9kZSA9PSAnc2luZ2xlJykge1xyXG5cdFx0XHRcdGlmIChkaXIgPT0gLTEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBzY3JvbGxzLmZpbmRMYXN0KGUgPT4gZS5mdWxsRGlyID09IC0xKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGRpciA9PSAwKSB7XHJcblx0XHRcdFx0XHRsZXQgbGlzdCA9IHNjcm9sbHMuZmlsdGVyKGUgPT4gZS5mdWxsRGlyID09IDApO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGxpc3Rbfn4obGlzdC5sZW5ndGggLyAyKV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChkaXIgPT0gMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHNjcm9sbHMuZmluZChlID0+IGUuZnVsbERpciA9PSAxKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG1vZGUgPT0gJ2dyb3VwJykge1xyXG5cdFx0XHRcdGlmIChkaXIgPT0gLTEpIHtcclxuXHRcdFx0XHRcdGxldCBsYXN0ID0gc2Nyb2xscy5maW5kTGFzdChlID0+IGUuZnVsbERpciA9PSAtMSk7XHJcblx0XHRcdFx0XHRpZiAoIWxhc3QpIHJldHVybjtcclxuXHRcdFx0XHRcdHJldHVybiBzY3JvbGxzLmZpbHRlcihlID0+IE1hdGguYWJzKGUucmVjdC50b3AgLSBsYXN0LnJlY3QuYm90dG9tKSA8PSAxLjAwMSAmJiBlLmZ1bGxEaXIgPT0gLTEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZGlyID09IDApIHtcclxuXHRcdFx0XHRcdHJldHVybiBzY3JvbGxzLmZpbHRlcihlID0+IGUuZnVsbERpciA9PSAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGRpciA9PSAxKSB7XHJcblx0XHRcdFx0XHRsZXQgbGFzdCA9IHNjcm9sbHMuZmluZChlID0+IGUuZnVsbERpciA9PSAxKTtcclxuXHRcdFx0XHRcdGlmICghbGFzdCkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGxhc3QgJiYgc2Nyb2xscy5maWx0ZXIoZSA9PiBNYXRoLmFicyhsYXN0LnJlY3QudG9wIC0gZS5yZWN0LmJvdHRvbSkgPD0gMS4wMDEgJiYgZS5mdWxsRGlyID09IDEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRnZXRBbGxTY3JvbGxzKCkge1xyXG5cdFx0XHRyZXR1cm4gcXEodGhpcy5zZWxlY3RvcikubWFwKGUgPT4gbmV3IFNjcm9sbEluZm8oZSkpLnZzb3J0KGUgPT4gZS5jZW50ZXJPZmZzZXQoKSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRcdC8qKiB1c2VkICAqL1xyXG5cdFx0YXN5bmMga2VlcChyZXNpemVyOiAoKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPiwgcmFmID0gZmFsc2UpIHtcclxuXHRcdFx0bGV0IHBvcyA9IHRoaXMuc2F2ZSgpO1xyXG5cdFx0XHRhd2FpdCByZXNpemVyKCk7XHJcblx0XHRcdHBvcy5yZXN0b3JlKCk7XHJcblx0XHRcdGlmIChyYWYpIHtcclxuXHRcdFx0XHRhd2FpdCBQcm9taXNlLmZyYW1lKCk7XHJcblx0XHRcdFx0cG9zLnJlc3RvcmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8qKiBzYXZlIGN1cnJlbnQgaXRlbSBzY3JvbGwgcG9zaXRpb24gKi9cclxuXHRcdHNhdmUoKTogeyBpbmZvOiBTY3JvbGxJbmZvLCBvZmZzZXQ6IG51bWJlciwgcmVzdG9yZSgpOiB2b2lkIH0ge1xyXG5cdFx0XHRsZXQgc2Nyb2xscyA9IHRoaXMuZ2V0QWxsU2Nyb2xscygpO1xyXG5cdFx0XHRsZXQgaW5mbyA9IHNjcm9sbHMudnNvcnQoZSA9PiBNYXRoLmFicyhlLmNlbnRlck9mZnNldCgpKSlbMF07XHJcblx0XHRcdGxldCBvZmZzZXQgPSBpbmZvLmNlbnRlck9mZnNldCgpO1xyXG5cdFx0XHRmdW5jdGlvbiByZXN0b3JlKCkge1xyXG5cdFx0XHRcdGxldCBuZXdJbmZvID0gbmV3IFNjcm9sbEluZm8oaW5mby5lbCk7XHJcblx0XHRcdFx0bGV0IG5ld09mZnNldCA9IG5ld0luZm8uY2VudGVyT2Zmc2V0KCk7XHJcblx0XHRcdFx0c2Nyb2xsVG8oMCwgc2Nyb2xsWSArIChuZXdPZmZzZXQgLSBvZmZzZXQpICogaW5uZXJIZWlnaHQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB7IGluZm8sIG9mZnNldCwgcmVzdG9yZSB9O1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRzdGF0aWMgY3JlYXRlRGVmYXVsdCgpOiBJbWFnZVNjcm9sbGVyIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBJbWFnZVNjcm9sbGVyKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRleHBvcnQgZGVjbGFyZSBsZXQgaXM6IEltYWdlU2Nyb2xsZXI7XHJcblxyXG5cdGRlZmluZUxhenkoUG9vcEpzLCAnaXMnLCAoKSA9PiBJbWFnZVNjcm9sbGVyLmNyZWF0ZURlZmF1bHQoKSk7XHJcblxyXG5cclxuXHRmdW5jdGlvbiBkZWZpbmVMYXp5PFQsIEsgZXh0ZW5kcyBrZXlvZiBULCBWIGV4dGVuZHMgVFtLXT4oXHJcblx0XHR0YXJnZXQ6IFQsIHByb3A6IEssIGdldDogKHRoaXM6IHZvaWQpID0+IFZcclxuXHQpIHtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3AsIHtcclxuXHRcdFx0Z2V0OiAoKSA9PiB7XHJcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcCwge1xyXG5cdFx0XHRcdFx0dmFsdWU6IGdldCgpLFxyXG5cdFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdFx0d3JpdGFibGU6IHRydWUsXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIHRhcmdldFtwcm9wXTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2V0KHYpIHtcclxuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCB7XHJcblx0XHRcdFx0XHR2YWx1ZTogdixcclxuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiB0YXJnZXRbcHJvcF07XHJcblx0XHRcdH0sXHJcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG59IiwiIl19