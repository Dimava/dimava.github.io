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
            for (let i = this.length - 1; i >= 0; i--) {
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
            if (mode == 'on') {
                PoopJs.kds = {
                    BracketLeft: () => switchSpeedhack(-1),
                    BracketRight: () => switchSpeedhack(1),
                };
            }
            else {
                delete PoopJs.kds.BracketLeft;
                delete PoopJs.kds.BracketRight;
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
            window._requestAnimationFrame ??= window.requestAnimationFrame;
            window.requestAnimationFrame = f => window._requestAnimationFrame(n => f(toPerformanceFakeTime(n)));
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
                scrollBy(0, -Math.sign(event.deltaY) * innerHeight * etc.fastScroll.speed);
                event.preventDefault();
            }
            addEventListener('wheel', onwheel, { passive: false });
            etc.fastScroll.off = () => {
                etc.fastScroll.active = false;
                removeEventListener('wheel', onwheel);
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
        etc.generateKdsCodes = generateKdsCodes;
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
    })(etc = PoopJs.etc || (PoopJs.etc = {}));
})(PoopJs || (PoopJs = {}));
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
            let cacheUrl = (init.cacheUrl ?? url) + '';
            if (!cacheUrl.startsWith('http'))
                cacheUrl = url + '&&cacheUrl=' + cacheUrl;
            let response = await cache.match(cacheUrl);
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
                cache.put(cacheUrl, resultResponse);
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
            PoopJs.debug && console.log(`  = `, json);
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
            // reparseEntries(entries = this.entries): Data[] {
            // 	// preparse
            // 	let parents = new Set(entries.map(e=>e.parentElement));
            // 	for (let parent of parents) {
            // 		parent.classList.add('ef-entry-container');
            // 	}
            // 	for (let e of entries) {
            // 		e.classList.add('ef-entry');
            // 	}
            // 	let datas =
            // 	for (let parser of this.parsers) {
            // 	}
            // 	return 0 as any;
            // }
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
            _earliestUpdate = 0;
            update(reparse = this.reparsePending) {
                if (this.disabled == true)
                    return;
                let earliestUpdate = this._previousState.finishedAt + Math.min(10000, 8 * this._previousState.updateDuration);
                if (performance.now() < earliestUpdate) {
                    if (this._earliestUpdate != earliestUpdate) {
                        this._earliestUpdate = earliestUpdate;
                        if (PoopJs.debug) {
                            console.log(`EF: update delayed by ${~~(performance.now() - earliestUpdate)}ms ${''} (last update duration: ${this._previousState.updateDuration})`);
                        }
                    }
                    this.updatePending = true;
                    requestAnimationFrame(() => this.update());
                    return;
                }
                this.updatePending = false;
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
                console.log(`EF: update took ${~~timeUsed}ms`);
                this._previousState.updateDuration = 10000;
                this._previousState.finishedAt = performance.now() + 10000;
                requestAnimationFrame(() => {
                    let dt = this._previousState.updateDuration = performance.now() - now;
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
                this.entryDatas = new MapType();
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
    Object.assign(globalThis, { PoopJs });
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
        onWheelScrollFailed;
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
                else {
                    this.onWheelScrollFailed?.(event);
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
            return this;
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
                    return scrolls.filter(e => Math.abs(last.rect.top - e.rect.bottom) <= 1.001 && e.fullDir == 1);
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
            if (!scrolls.length) {
                return { info: undefined, offset: -1, restore: () => { } };
            }
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
    const vars = {};
    PoopJs.styleVars = new Proxy(vars, {
        get(target, prop) {
            if (prop.startsWith('--'))
                prop = prop.slice(2);
            let style = document.body.style;
            let v = style.getPropertyValue('--' + prop);
            target[prop] = v;
            return v;
        },
        set(target, prop, v) {
            if (prop.startsWith('--'))
                prop = prop.slice(2);
            let style = document.body.style;
            target[prop] = v;
            style.setProperty('--' + prop, v + '');
            return true;
        },
    });
    PoopJs.styleVarsN = new Proxy(vars, {
        get(target, prop) {
            if (prop.startsWith('--'))
                prop = prop.slice(2);
            let style = document.body.style;
            let v = style.getPropertyValue('--' + prop);
            return +v;
        },
        set(target, prop, v) {
            if (prop.startsWith('--'))
                prop = prop.slice(2);
            let style = document.body.style;
            target[prop] = +v;
            style.setProperty('--' + prop, v + '');
            return true;
        },
    });
})(PoopJs || (PoopJs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3Bvb3Bqcy9Qcm9taXNlLnRzIiwiLi4vcG9vcGpzL0FycmF5LnRzIiwiLi4vcG9vcGpzL0RhdGVOb3dIYWNrLnRzIiwiLi4vcG9vcGpzL09iamVjdC50cyIsIi4uL3Bvb3Bqcy9lbGVtZW50LnRzIiwiLi4vcG9vcGpzL2VsbS50cyIsIi4uL3Bvb3Bqcy9ldGMudHMiLCIuLi9wb29wanMvZmV0Y2gudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvRW50aXR5RmlsdGVyZXIudHMiLCIuLi9wb29wanMvb2JzZXJ2ZXIudHMiLCIuLi9wb29wanMvUGFnaW5hdGUvUGFnaW5hdGlvbi50cyIsIi4uL3Bvb3Bqcy9QYWdpbmF0ZS9JbWFnZVNjcm9sbGluZy50cyIsIi4uL3Bvb3Bqcy9pbml0LnRzIiwiLi4vcG9vcGpzL2tleWJpbmQudHMiLCIuLi9wb29wanMvdHlwZXMudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvRmlsdGVyZXJJdGVtLnRzIiwiLi4vcG9vcGpzL0ZpbHRlcmVyL0ZpbHRlci50cyIsIi4uL3Bvb3Bqcy9GaWx0ZXJlci9Nb2RpZmllci50cyIsIi4uL3Bvb3Bqcy9GaWx0ZXJlci9Tb3J0ZXIudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvdHlwZXMudHMiLCIuLi9wb29wanMvUGFnaW5hdGUvSW1hZ2VTY3JvbGxpbmcyLnRzIiwiLi4vcG9vcGpzL1BhZ2luYXRlL21vZGlmaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLE1BQU0sQ0F1Q2Y7QUF2Q0QsV0FBVSxNQUFNO0lBY2YsSUFBaUIsZ0JBQWdCLENBdUJoQztJQXZCRCxXQUFpQixnQkFBZ0I7UUFFaEM7O1dBRUc7UUFDSCxTQUFnQixLQUFLO1lBQ3BCLElBQUksT0FBMkIsQ0FBQztZQUNoQyxJQUFJLE1BQThCLENBQUM7WUFDbkMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFJLENBQUMs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LEVBQUUsQ0FBQyxDQUFDO1lBQzVCLElBQUksRUFBRSxHQUFHLElBQUk7Z0JBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDcEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QixPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFD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LEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNoQyxJQUFJLENBQUMsR0FBVyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ3BELE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBQ0QsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFZLEVBQUUsQ0FBUztZQUNsQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO2dCQUFFLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQixLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztLQUNELENBQUMsQ0FBQztBQUVKLENBQUMsRUFwU1MsTUFBTSxLQUFOLE1BQU0sUUFvU2YiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBEZWZlcnJlZDxUID0gdm9pZD4gZXh0ZW5kcyBQcm9taXNlPFQ+IHtcclxuXHRcdHJlc29sdmUodmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPik6IHZvaWQ7XHJcblx0XHRyZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQ7XHJcblxyXG5cdFx0cih2YWx1ZSlcclxuXHRcdHIodmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPik6IHZvaWQ7XHJcblx0XHRqOiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xyXG5cclxuXHRcdC8vIFByb21pc2VTdGF0ZTogJ3BlbmRpbmcnIHwgJ2Z1bGZpbGxlZCcgfCAncmVqZWN0ZWQnO1xyXG5cdFx0Ly8gUHJvbWlzZVJlc3VsdD86IFQgfCBFcnJvcjtcclxuXHR9XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgUHJvbWlzZUV4dGVuc2lvbiB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDcmVhdGVzIHVud3JhcHBlZCBwcm9taXNlXHJcblx0XHQgKi9cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbXB0eTxUID0gdm9pZD4oKTogRGVmZXJyZWQ8VD4ge1xyXG5cdFx0XHRsZXQgcmVzb2x2ZTogKHZhbHVlOiBUKSA9PiB2b2lkO1xyXG5cdFx0XHRsZXQgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xyXG5cdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgUHJvbWlzZTxUPigociwgaikgPT4ge1xyXG5cdFx0XHRcdHJlc29sdmUgPSByO1xyXG5cdFx0XHRcdHJlamVjdCA9IGo7XHJcblx0XHRcdH0pLCB7XHJcblx0XHRcdFx0cmVzb2x2ZSwgcmVqZWN0LFxyXG5cdFx0XHRcdHI6IHJlc29sdmUsIGo6IHJlamVjdCxcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZyYW1lKG4gPSAxKTogUHJvbWlzZTxudW1iZXI+IHtcclxuXHRcdFx0d2hpbGUgKC0tbiA+IDApIHtcclxuXHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vUHJvbWlzZS50c1wiIC8+XHJcbm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBuYW1lc3BhY2UgQXJyYXlFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBwbWFwPFQsIFY+KHRoaXM6IFRbXSwgbWFwcGVyOiAoZTogVCwgaTogbnVtYmVyLCBhOiBUW10pID0+IFByb21pc2U8Vj4gfCBWLCB0aHJlYWRzID0gNSk6IFByb21pc2U8VltdPiB7XHJcblx0XHRcdGlmICghKHRocmVhZHMgPiAwKSkgdGhyb3cgbmV3IEVycm9yKCk7XHJcblx0XHRcdGxldCB0YXNrczogW1QsIG51bWJlciwgVFtdXVtdID0gdGhpcy5tYXAoKGUsIGksIGEpID0+IFtlLCBpLCBhXSk7XHJcblx0XHRcdGxldCByZXN1bHRzID0gQXJyYXk8Vj4odGFza3MubGVuZ3RoKTtcclxuXHRcdFx0bGV0IGFueVJlc29sdmVkID0gUHJvbWlzZUV4dGVuc2lvbi5lbXB0eSgpO1xyXG5cdFx0XHRsZXQgZnJlZVRocmVhZHMgPSB0aHJlYWRzO1xyXG5cdFx0XHRhc3luYyBmdW5jdGlvbiBydW5UYXNrKHRhc2s6IFtULCBudW1iZXIsIFRbXV0pOiBQcm9taXNlPFY+IHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IG1hcHBlciguLi50YXNrKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdHJldHVybiBlcnI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFzeW5jIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XHJcblx0XHRcdFx0ZnJlZVRocmVhZHMtLTtcclxuXHRcdFx0XHRyZXN1bHRzW3Rhc2tbMV1dID0gYXdhaXQgcnVuVGFzayh0YXNrKTtcclxuXHRcdFx0XHRmcmVlVGhyZWFkcysrO1xyXG5cdFx0XHRcdGxldCBvbGRBbnlSZXNvbHZlZCA9IGFueVJlc29sdmVkO1xyXG5cdFx0XHRcdGFueVJlc29sdmVkID0gUHJvbWlzZUV4dGVuc2lvbi5lbXB0eSgpO1xyXG5cdFx0XHRcdG9sZEFueVJlc29sdmVkLnIodW5kZWZpbmVkKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCB0YXNrIG9mIHRhc2tzKSB7XHJcblx0XHRcdFx0aWYgKGZyZWVUaHJlYWRzID09IDApIHtcclxuXHRcdFx0XHRcdGF3YWl0IGFueVJlc29sdmVkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRydW4odGFzayk7XHJcblx0XHRcdH1cclxuXHRcdFx0d2hpbGUgKGZyZWVUaHJlYWRzIDwgdGhyZWFkcykge1xyXG5cdFx0XHRcdGF3YWl0IGFueVJlc29sdmVkO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiByZXN1bHRzO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBtYXA8VCA9IG51bWJlcj4odGhpczogQXJyYXlDb25zdHJ1Y3RvciwgbGVuZ3RoOiBudW1iZXIsIG1hcHBlcjogKG51bWJlcikgPT4gVCA9IGkgPT4gaSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcyhsZW5ndGgpLmZpbGwoMCkubWFwKChlLCBpLCBhKSA9PiBtYXBwZXIoaSkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiB2c29ydDxUPih0aGlzOiBUW10sIG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgYTogVFtdKSA9PiBudW1iZXIsIHNvcnRlcj86ICgoYTogbnVtYmVyLCBiOiBudW1iZXIsIGFlOiBULCBiZTogVCkgPT4gbnVtYmVyKSB8IC0xKTogVFtdO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHZzb3J0PFQsIFY+KHRoaXM6IFRbXSwgbWFwcGVyOiAoZTogVCwgaTogbnVtYmVyLCBhOiBUW10pID0+IFYsIHNvcnRlcjogKChhOiBWLCBiOiBWLCBhZTogVCwgYmU6IFQpID0+IG51bWJlcikgfCAtMSk6IFRbXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiB2c29ydDxUPih0aGlzOiBUW10sIG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgYTogVFtdKSA9PiBudW1iZXIsIHNvcnRlcjogKChhOiBudW1iZXIsIGI6IG51bWJlciwgYWU6IFQsIGJlOiBUKSA9PiBudW1iZXIpIHwgLTEgPSAoYSwgYikgPT4gYSAtIGIpOiBUW10ge1xyXG5cdFx0XHRsZXQgdGhlU29ydGVyID0gdHlwZW9mIHNvcnRlciA9PSAnZnVuY3Rpb24nID8gc29ydGVyIDogKGEsIGIpID0+IGIgLSBhO1xyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0XHRcdC5tYXAoKGUsIGksIGEpID0+ICh7IGUsIHY6IG1hcHBlcihlLCBpLCBhKSB9KSlcclxuXHRcdFx0XHQuc29ydCgoYSwgYikgPT4gdGhlU29ydGVyKGEudiwgYi52LCBhLmUsIGIuZSkpXHJcblx0XHRcdFx0Lm1hcChlID0+IGUuZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGF0PFQ+KHRoaXM6IFRbXSwgaW5kZXg6IG51bWJlcik6IFQge1xyXG5cdFx0XHRyZXR1cm4gaW5kZXggPj0gMCA/IHRoaXNbaW5kZXhdIDogdGhpc1t0aGlzLmxlbmd0aCArIGluZGV4XTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZmluZExhc3Q8VCwgUyBleHRlbmRzIFQ+KHRoaXM6IFRbXSwgcHJlZGljYXRlOiAodGhpczogdm9pZCwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIG9iajogVFtdKSA9PiB2YWx1ZSBpcyBTLCB0aGlzQXJnPzogYW55KTogUyB8IHVuZGVmaW5lZDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBmaW5kTGFzdDxUPihwcmVkaWNhdGU6ICh0aGlzOiBUW10sIHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBvYmo6IFRbXSkgPT4gdW5rbm93biwgdGhpc0FyZz86IGFueSk6IFQgfCB1bmRlZmluZWQ7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZmluZExhc3Q8VCwgUyBleHRlbmRzIFQ+KHRoaXM6IFRbXSwgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIG9iajogVFtdKSA9PiB1bmtub3duLCB0aGlzQXJnPzogYW55KTogVCB8IFMgfCB1bmRlZmluZWQge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cdFx0XHRcdGlmIChwcmVkaWNhdGUodGhpc1tpXSwgaSwgdGhpcykpIHJldHVybiB0aGlzW2ldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBQTWFwPFQsIFYsIEUgPSBuZXZlcj4ge1xyXG5cdFx0XHQvKiogT3JpZ2luYWwgYXJyYXkgKi9cclxuXHRcdFx0c291cmNlOiBUW10gPSBbXTtcclxuXHRcdFx0LyoqIEFzeW5jIGVsZW1lbnQgY29udmVydGVyIGZ1bmN0aW9uICovXHJcblx0XHRcdG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgYTogVFtdLCBwbWFwOiBQTWFwPFQsIFYsIEU+KSA9PiBQcm9taXNlPFYgfCBFPiA9IChlOiBUKSA9PiBlIGFzIGFueSBhcyBQcm9taXNlPFY+O1xyXG5cdFx0XHQvKiogTWF4IG51bWJlciBvZiByZXF1ZXN0cyBhdCBvbmNlLiAgIFxyXG5cdFx0XHQgKiAgKk1heSogYmUgY2hhbmdlZCBpbiBydW50aW1lICovXHJcblx0XHRcdHRocmVhZHM6IG51bWJlciA9IDU7XHJcblx0XHRcdC8qKiBNYXggZGlzdGFuY2UgYmV0d2VlbiB0aGUgb2xkZXJzIGluY29tcGxldGUgYW5kIG5ld2VzdCBhY3RpdmUgZWxlbWVudHMuICAgXHJcblx0XHRcdCAqICAqTWF5KiBiZSBjaGFuZ2VkIGluIHJ1bnRpbWUgKi9cclxuXHRcdFx0d2luZG93OiBudW1iZXIgPSBJbmZpbml0eTtcclxuXHJcblx0XHRcdC8qKiBVbmZpbmlzaGVkIHJlc3VsdCBhcnJheSAqL1xyXG5cdFx0XHRyZXN1bHRzOiAoViB8IEUgfCB1bmRlZmluZWQpW10gPSBbXTtcclxuXHRcdFx0LyoqIFByb21pc2VzIGZvciBldmVyeSBlbGVtZW50ICovXHJcblx0XHRcdHJlcXVlc3RzOiBEZWZlcnJlZDxWIHwgRT5bXSA9IFtdO1xyXG5cclxuXHRcdFx0YmVmb3JlU3RhcnQ6IChkYXRhOiB7XHJcblx0XHRcdFx0ZTogVCwgaTogbnVtYmVyLCBhOiBUW10sIHY/OiBWIHwgRSwgcjogKFYgfCBFKVtdLCBwbWFwOiBQTWFwPFQsIFYsIEU+XHJcblx0XHRcdH0pID0+IFByb21pc2U8dm9pZD4gfCB2b2lkID0gKCkgPT4geyB9O1xyXG5cdFx0XHRhZnRlckNvbXBsZXRlOiAoZGF0YToge1xyXG5cdFx0XHRcdGU6IFQsIGk6IG51bWJlciwgYTogVFtdLCB2OiBWIHwgRSwgcjogKFYgfCBFKVtdLCBwbWFwOiBQTWFwPFQsIFYsIEU+XHJcblx0XHRcdH0pID0+IFByb21pc2U8dm9pZD4gfCB2b2lkID0gKCkgPT4geyB9O1xyXG5cclxuXHRcdFx0LyoqIExlbmd0aCBvZiB0aGUgYXJyYXkgKi9cclxuXHRcdFx0bGVuZ3RoOiBudW1iZXIgPSAtMTtcclxuXHRcdFx0LyoqIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgZmluaXNoZWQgY29udmVydGluZyAqL1xyXG5cdFx0XHRjb21wbGV0ZWQ6IG51bWJlciA9IC0xO1xyXG5cdFx0XHQvKiogVGhyZWFkcyBjdXJyZW50bHkgd29ya2luZyAgIFxyXG5cdFx0XHQgKiAgaW4gdGhlIG1hcHBlciBmdW5jdGlvbjogaW5jbHVkaW5nIHRoZSBjdXJyZW50IG9uZSAqL1xyXG5cdFx0XHRhY3RpdmVUaHJlYWRzOiBudW1iZXIgPSAtMTtcclxuXHRcdFx0bGFzdFN0YXJ0ZWQ6IG51bWJlciA9IC0xO1xyXG5cclxuXHRcdFx0YWxsVGFza3NEb25lOiBEZWZlcnJlZDwoViB8IEUpW10+ICYgeyBwbWFwOiBQTWFwPFQsIFYsIEU+IH07XHJcblx0XHRcdGFueVRhc2tSZXNvbHZlZDogRGVmZXJyZWQ8dm9pZD47XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3Rvcihzb3VyY2U6IFBhcnRpYWw8UE1hcDxULCBWLCBFPj4pIHtcclxuXHRcdFx0XHR0aGlzLmFsbFRhc2tzRG9uZSA9IE9iamVjdC5hc3NpZ24odGhpcy5lbXB0eVJlc3VsdDwoViB8IEUpW10+KCksIHsgcG1hcDogdGhpcyB9KTtcclxuXHRcdFx0XHR0aGlzLmFueVRhc2tSZXNvbHZlZCA9IHRoaXMuZW1wdHlSZXN1bHQoKTtcclxuXHRcdFx0XHRmb3IgKGxldCBrIG9mIE9iamVjdC5rZXlzKHRoaXMpIGFzIChrZXlvZiBQTWFwPFQsIFYsIEU+KVtdKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIHNvdXJjZVtrXSA9PSB0eXBlb2YgdGhpc1trXSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzW2tdID0gc291cmNlW2tdIGFzIGFueTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc291cmNlW2tdKSB7XHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgUE1hcDogaW52YWxpZCBjb25zdHJ1Y3RvciBwYXJhbWV0ZXI6IHByb3BlcnR5ICR7a306IGV4cGVjdGVkICR7dHlwZW9mIHRoaXNba119LCBidXQgZ290ICR7dHlwZW9mIHNvdXJjZVtrXX1gKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFzeW5jIHN0YXJ0VGFzayhhcnJheUluZGV4OiBudW1iZXIpIHtcclxuXHRcdFx0XHR0aGlzLmFjdGl2ZVRocmVhZHMrKztcclxuXHRcdFx0XHRsZXQgZSA9IHRoaXMuc291cmNlW2FycmF5SW5kZXhdO1xyXG5cdFx0XHRcdGF3YWl0IHRoaXMuYmVmb3JlU3RhcnQoe1xyXG5cdFx0XHRcdFx0ZTogdGhpcy5zb3VyY2VbYXJyYXlJbmRleF0sXHJcblx0XHRcdFx0XHRpOiBhcnJheUluZGV4LFxyXG5cdFx0XHRcdFx0YTogdGhpcy5zb3VyY2UsXHJcblx0XHRcdFx0XHR2OiB1bmRlZmluZWQsXHJcblx0XHRcdFx0XHRyOiB0aGlzLnJlc3VsdHMsXHJcblx0XHRcdFx0XHRwbWFwOiB0aGlzLFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHRoaXMubGFzdFN0YXJ0ZWQgPSBhcnJheUluZGV4O1xyXG5cdFx0XHRcdGxldCB2OiBWIHwgRTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0diA9IGF3YWl0IHRoaXMubWFwcGVyKHRoaXMuc291cmNlW2FycmF5SW5kZXhdLCBhcnJheUluZGV4LCB0aGlzLnNvdXJjZSwgdGhpcyk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0diA9IGUgYXMgRTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5yZXN1bHRzW2FycmF5SW5kZXhdID0gdjtcclxuXHRcdFx0XHR0aGlzLnJlcXVlc3RzW2FycmF5SW5kZXhdLnJlc29sdmUodik7XHJcblx0XHRcdFx0dGhpcy5jb21wbGV0ZWQrKztcclxuXHRcdFx0XHRhd2FpdCB0aGlzLmFmdGVyQ29tcGxldGUoe1xyXG5cdFx0XHRcdFx0ZTogdGhpcy5zb3VyY2VbYXJyYXlJbmRleF0sXHJcblx0XHRcdFx0XHRpOiBhcnJheUluZGV4LFxyXG5cdFx0XHRcdFx0YTogdGhpcy5zb3VyY2UsXHJcblx0XHRcdFx0XHR2OiB2LFxyXG5cdFx0XHRcdFx0cjogdGhpcy5yZXN1bHRzLFxyXG5cdFx0XHRcdFx0cG1hcDogdGhpcyxcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR0aGlzLmFjdGl2ZVRocmVhZHMtLTtcclxuXHRcdFx0XHR0aGlzLmFueVRhc2tSZXNvbHZlZC5yZXNvbHZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXN5bmMgcnVuX2ludGVybmFsKCkge1xyXG5cdFx0XHRcdGZvciAobGV0IGFycmF5SW5kZXggPSAwOyBhcnJheUluZGV4IDwgdGhpcy5sZW5ndGg7IGFycmF5SW5kZXgrKykge1xyXG5cdFx0XHRcdFx0d2hpbGUgKHRoaXMuYWN0aXZlVGhyZWFkcyA+PSB0aGlzLnRocmVhZHMpIHtcclxuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5hbnlUYXNrUmVzb2x2ZWQ7XHJcblx0XHRcdFx0XHRcdHRoaXMuYW55VGFza1Jlc29sdmVkID0gdGhpcy5lbXB0eVJlc3VsdCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMucmVxdWVzdHNbYXJyYXlJbmRleCAtIHRoaXMud2luZG93XTtcclxuXHRcdFx0XHRcdHRoaXMuc3RhcnRUYXNrKGFycmF5SW5kZXgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR3aGlsZSAodGhpcy5hY3RpdmVUaHJlYWRzID4gMCkge1xyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5hbnlUYXNrUmVzb2x2ZWQ7XHJcblx0XHRcdFx0XHR0aGlzLmFueVRhc2tSZXNvbHZlZCA9IHRoaXMuZW1wdHlSZXN1bHQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5hbGxUYXNrc0RvbmUucmVzb2x2ZSh0aGlzLnJlc3VsdHMgYXMgKFYgfCBFKVtdKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hbGxUYXNrc0RvbmU7XHJcblx0XHRcdH1cclxuXHRcdFx0cnVuKCkge1xyXG5cdFx0XHRcdHRoaXMucHJlcGFyZSgpO1xyXG5cdFx0XHRcdHRoaXMucnVuX2ludGVybmFsKCk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWxsVGFza3NEb25lO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwYXVzZSgpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5hY3RpdmVUaHJlYWRzIDwgdGhpcy5sZW5ndGggKyB0aGlzLnRocmVhZHMpXHJcblx0XHRcdFx0XHR0aGlzLmFjdGl2ZVRocmVhZHMgKz0gdGhpcy5sZW5ndGggKyB0aGlzLnRocmVhZHM7XHJcblx0XHRcdH1cclxuXHRcdFx0dW5wYXVzZSgpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5hY3RpdmVUaHJlYWRzID49IHRoaXMubGVuZ3RoICsgdGhpcy50aHJlYWRzKVxyXG5cdFx0XHRcdFx0dGhpcy5hY3RpdmVUaHJlYWRzIC09IHRoaXMubGVuZ3RoICsgdGhpcy50aHJlYWRzO1xyXG5cdFx0XHRcdHRoaXMuYW55VGFza1Jlc29sdmVkLnIoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYW5jZWwoKSB7XHJcblx0XHRcdFx0dGhpcy5tYXBwZXIgPSAoKCkgPT4geyB9KSBhcyBhbnk7XHJcblx0XHRcdFx0dGhpcy5iZWZvcmVTdGFydCA9ICgpID0+IHsgfTtcclxuXHRcdFx0XHR0aGlzLmFmdGVyQ29tcGxldGUgPSAoKSA9PiB7IH07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHByZXBhcmUoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubGVuZ3RoID09IC0xKSB0aGlzLmxlbmd0aCA9IHRoaXMuc291cmNlLmxlbmd0aDtcclxuXHRcdFx0XHRpZiAodGhpcy5yZXN1bHRzLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLnJlc3VsdHMgPSBBcnJheSh0aGlzLmxlbmd0aCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLnJlcXVlc3RzLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLnJlcXVlc3RzID0gdGhpcy5zb3VyY2UubWFwKGUgPT4gdGhpcy5lbXB0eVJlc3VsdCgpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuY29tcGxldGVkIDwgMCkgdGhpcy5jb21wbGV0ZWQgPSAwO1xyXG5cdFx0XHRcdGlmICh0aGlzLmFjdGl2ZVRocmVhZHMgPCAwKSB0aGlzLmFjdGl2ZVRocmVhZHMgPSAwO1xyXG5cdFx0XHRcdGlmICh0aGlzLmxhc3RTdGFydGVkIDwgLTEpIHRoaXMubGFzdFN0YXJ0ZWQgPSAtMTtcclxuXHRcdFx0XHR0aGlzLmFueVRhc2tSZXNvbHZlZCA9IHRoaXMuZW1wdHlSZXN1bHQoKTtcclxuXHRcdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuYWxsVGFza3NEb25lLCB7IHBtYXA6IHRoaXMgfSk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGVtcHR5UmVzdWx0PFQgPSBWIHwgRT4oKTogRGVmZXJyZWQ8VD4ge1xyXG5cdFx0XHRcdGxldCByZXNvbHZlITogKHZhbHVlOiBUKSA9PiB2b2lkO1xyXG5cdFx0XHRcdGxldCByZWplY3QhOiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xyXG5cdFx0XHRcdGxldCBwID0gbmV3IFByb21pc2U8VD4oKHIsIGopID0+IHtcclxuXHRcdFx0XHRcdHJlc29sdmUgPSByO1xyXG5cdFx0XHRcdFx0cmVqZWN0ID0gajtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihwLCB7IHJlc29sdmUsIHJlamVjdCwgcjogcmVzb2x2ZSwgajogcmVqZWN0IH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzdGF0aWMgdGhpc19wbWFwPFQsIFYsIEUgPSBuZXZlcj4odGhpczogVFtdLCBtYXBwZXI6IFBNYXA8VCwgViwgRT5bJ21hcHBlciddLCBvcHRpb25zOiBQYXJ0aWFsPFBNYXA8VCwgViwgRT4+IHwgbnVtYmVyIHwgdHJ1ZSA9IHt9KSB7XHJcblx0XHRcdFx0aWYgKG9wdGlvbnMgPT0gdHJ1ZSkgb3B0aW9ucyA9IEluZmluaXR5O1xyXG5cdFx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnbnVtYmVyJykgb3B0aW9ucyA9IHsgdGhyZWFkczogb3B0aW9ucyB9O1xyXG5cdFx0XHRcdGxldCBwbWFwID0gbmV3IFBNYXAoeyBzb3VyY2U6IHRoaXMsIG1hcHBlciwgLi4ub3B0aW9ucyB9KTtcclxuXHRcdFx0XHRyZXR1cm4gcG1hcC5ydW4oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdGF0aWMgcG1hcDxULCBWLCBFID0gbmV2ZXI+KGFycmF5OiBUW10sIG1hcHBlcjogUE1hcDxULCBWLCBFPlsnbWFwcGVyJ10sIG9wdGlvbnM6IFBhcnRpYWw8UE1hcDxULCBWLCBFPj4gfCBudW1iZXIgfCB0cnVlID0ge30pIHtcclxuXHRcdFx0XHRpZiAob3B0aW9ucyA9PSB0cnVlKSBvcHRpb25zID0gSW5maW5pdHk7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zID09ICdudW1iZXInKSBvcHRpb25zID0geyB0aHJlYWRzOiBvcHRpb25zIH07XHJcblx0XHRcdFx0bGV0IHBtYXAgPSBuZXcgUE1hcCh7IHNvdXJjZTogYXJyYXksIG1hcHBlciwgLi4ub3B0aW9ucyB9KTtcclxuXHRcdFx0XHRyZXR1cm4gcG1hcC5ydW4oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRGF0ZU5vd0hhY2sge1xyXG5cclxuXHRcdGV4cG9ydCBsZXQgc3BlZWRNdWx0aXBsaWVyID0gMTtcclxuXHRcdGV4cG9ydCBsZXQgZGVsdGFPZmZzZXQgPSAwO1xyXG5cdFx0ZXhwb3J0IGxldCBzdGFydFJlYWx0aW1lID0gMDtcclxuXHRcdGV4cG9ydCBsZXQgc3RhcnRUaW1lID0gMDtcclxuXHJcblx0XHQvLyBleHBvcnQgbGV0IHNwZWVkTXVsdGlwbGllciA9IDE7XHJcblx0XHRleHBvcnQgbGV0IHBlcmZvcm1hbmNlRGVsdGFPZmZzZXQgPSAwO1xyXG5cdFx0ZXhwb3J0IGxldCBwZXJmb3JtYW5jZVN0YXJ0UmVhbHRpbWUgPSAwO1xyXG5cdFx0ZXhwb3J0IGxldCBwZXJmb3JtYW5jZVN0YXJ0VGltZSA9IDA7XHJcblxyXG5cdFx0ZXhwb3J0IGxldCB1c2VkTWV0aG9kcyA9IHtcclxuXHRcdFx0ZGF0ZTogdHJ1ZSxcclxuXHRcdFx0cGVyZm9ybWFuY2U6IHRydWUsXHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHRvRmFrZVRpbWUocmVhbHRpbWU6IG51bWJlcikge1xyXG5cdFx0XHRpZiAoIXVzZWRNZXRob2RzLmRhdGUpIHJldHVybiByZWFsdGltZTtcclxuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoXHJcblx0XHRcdFx0KHJlYWx0aW1lIC0gc3RhcnRSZWFsdGltZSkgKiBzcGVlZE11bHRpcGxpZXIgKyBzdGFydFRpbWUgKyBkZWx0YU9mZnNldFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHRvUGVyZm9ybWFuY2VGYWtlVGltZShyZWFsdGltZTogbnVtYmVyKSB7XHJcblx0XHRcdGlmICghdXNlZE1ldGhvZHMucGVyZm9ybWFuY2UpIHJldHVybiByZWFsdGltZTtcclxuXHRcdFx0cmV0dXJuIChyZWFsdGltZSAtIHBlcmZvcm1hbmNlU3RhcnRSZWFsdGltZSkgKiBzcGVlZE11bHRpcGxpZXJcclxuXHRcdFx0XHQrIHBlcmZvcm1hbmNlU3RhcnRUaW1lICsgcGVyZm9ybWFuY2VEZWx0YU9mZnNldDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IGJyYWNrZXRTcGVlZHMgPSBbMC4wNSwgMC4yNSwgMSwgMiwgNSwgMTAsIDIwLCA2MCwgMTIwXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzcGVlZGhhY2soc3BlZWQ6IG51bWJlciA9IDEpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBzcGVlZCAhPSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgRGF0ZU5vd0hhY2s6IGludmFsaWQgc3BlZWQ6ICR7c3BlZWR9YCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWN0aXZhdGUoKTtcclxuXHRcdFx0YWN0aXZhdGVQZXJmb3JtYW5jZSgpO1xyXG5cdFx0XHRzcGVlZE11bHRpcGxpZXIgPSBzcGVlZDtcclxuXHRcdFx0bG9jYXRpb24uaGFzaCA9IHNwZWVkICsgJyc7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gdGltZWp1bXAoc2Vjb25kczogbnVtYmVyKSB7XHJcblx0XHRcdGFjdGl2YXRlKCk7XHJcblx0XHRcdGFjdGl2YXRlUGVyZm9ybWFuY2UoKTtcclxuXHRcdFx0ZGVsdGFPZmZzZXQgKz0gc2Vjb25kcyAqIDEwMDA7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gc3dpdGNoU3BlZWRoYWNrKGRpcjogbnVtYmVyKSB7XHJcblx0XHRcdGxldCBjdXJyZW50SW5kZXggPSBicmFja2V0U3BlZWRzLmluZGV4T2Yoc3BlZWRNdWx0aXBsaWVyKTtcclxuXHRcdFx0aWYgKGN1cnJlbnRJbmRleCA9PSAtMSkgY3VycmVudEluZGV4ID0gYnJhY2tldFNwZWVkcy5pbmRleE9mKDEpO1xyXG5cdFx0XHRsZXQgbmV3U3BlZWQgPSBicmFja2V0U3BlZWRzW2N1cnJlbnRJbmRleCArIGRpcl07XHJcblx0XHRcdGlmIChuZXdTcGVlZCA9PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0c3BlZWRoYWNrKG5ld1NwZWVkKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG9ua2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQnJhY2tldExlZnQnKSB7XHJcblx0XHRcdFx0c3dpdGNoU3BlZWRoYWNrKC0xKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQnJhY2tldFJpZ2h0Jykge1xyXG5cdFx0XHRcdHN3aXRjaFNwZWVkaGFjaygxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGJpbmRCcmFja2V0cyhtb2RlID0gJ29uJykge1xyXG5cdFx0XHRpZiAobW9kZSA9PSAnb24nKSB7XHJcblx0XHRcdFx0UG9vcEpzLmtkcyA9IHtcclxuXHRcdFx0XHRcdEJyYWNrZXRMZWZ0OiAoKSA9PiBzd2l0Y2hTcGVlZGhhY2soLTEpLFxyXG5cdFx0XHRcdFx0QnJhY2tldFJpZ2h0OiAoKSA9PiBzd2l0Y2hTcGVlZGhhY2soMSksXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkZWxldGUgUG9vcEpzLmtkcy5CcmFja2V0TGVmdDtcclxuXHRcdFx0XHRkZWxldGUgUG9vcEpzLmtkcy5CcmFja2V0UmlnaHQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IGFjdGl2YXRlZCA9IGZhbHNlO1xyXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcblx0XHRcdERhdGUuX25vdyA/Pz0gRGF0ZS5ub3c7XHJcblx0XHRcdERhdGUucHJvdG90eXBlLl9nZXRUaW1lID8/PSBEYXRlLnByb3RvdHlwZS5nZXRUaW1lO1xyXG5cdFx0XHRzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHRzdGFydFJlYWx0aW1lID0gRGF0ZS5fbm93KCk7XHJcblx0XHRcdGRlbHRhT2Zmc2V0ID0gMDtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coRGF0ZS5ub3coKSwgKVxyXG5cdFx0XHQvLyBkZWJ1Z2dlcjtcclxuXHRcdFx0RGF0ZS5ub3cgPSAoKSA9PiB0b0Zha2VUaW1lKERhdGUuX25vdygpKTtcclxuXHRcdFx0RGF0ZS5wcm90b3R5cGUuZ2V0VGltZSA9IGZ1bmN0aW9uICh0aGlzOiBEYXRlICYgeyBfdD86IG51bWJlciB9KSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3QgPz89IHRvRmFrZVRpbWUodGhpcy5fZ2V0VGltZSgpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHREYXRlLnByb3RvdHlwZS52YWx1ZU9mID0gZnVuY3Rpb24gKHRoaXM6IERhdGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRUaW1lKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWN0aXZhdGVkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBsZXQgcGVyZm9ybWFuY2VBY3RpdmF0ZWQgPSBmYWxzZTtcclxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlUGVyZm9ybWFuY2UoKSB7XHJcblx0XHRcdHBlcmZvcm1hbmNlLl9ub3cgPz89IHBlcmZvcm1hbmNlLm5vdztcclxuXHRcdFx0cGVyZm9ybWFuY2VTdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHRcdFx0cGVyZm9ybWFuY2VTdGFydFJlYWx0aW1lID0gcGVyZm9ybWFuY2UuX25vdygpO1xyXG5cdFx0XHRwZXJmb3JtYW5jZURlbHRhT2Zmc2V0ID0gMDtcclxuXHRcdFx0cGVyZm9ybWFuY2Uubm93ID0gKCkgPT4gdG9QZXJmb3JtYW5jZUZha2VUaW1lKHBlcmZvcm1hbmNlLl9ub3coKSk7XHJcblx0XHRcdHdpbmRvdy5fcmVxdWVzdEFuaW1hdGlvbkZyYW1lID8/PSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xyXG5cdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZiA9PiB3aW5kb3cuX3JlcXVlc3RBbmltYXRpb25GcmFtZShuID0+IGYodG9QZXJmb3JtYW5jZUZha2VUaW1lKG4pKSk7XHJcblx0XHRcdHBlcmZvcm1hbmNlQWN0aXZhdGVkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBPYmplY3RFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBkZWZpbmVWYWx1ZTxULCBLIGV4dGVuZHMga2V5b2YgVD4obzogVCwgcDogSywgdmFsdWU6IFRbS10pOiBUO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGRlZmluZVZhbHVlPFQ+KG86IFQsIGZuOiBGdW5jdGlvbik6IFQ7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZGVmaW5lVmFsdWU8VD4obzogVCwgcDoga2V5b2YgVCB8IHN0cmluZyB8IEZ1bmN0aW9uLCB2YWx1ZT86IGFueSk6IFQge1xyXG5cdFx0XHRpZiAodHlwZW9mIHAgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFtwLCB2YWx1ZV0gPSBbcC5uYW1lLCBwXSBhcyBbc3RyaW5nLCBGdW5jdGlvbl07XHJcblx0XHRcdH1cclxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIHAsIHtcclxuXHRcdFx0XHR2YWx1ZSxcclxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcblx0XHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXHJcblx0XHRcdFx0d3JpdGFibGU6IHRydWUsXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbztcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZGVmaW5lR2V0dGVyPFQsIEsgZXh0ZW5kcyBrZXlvZiBUPihvOiBULCBwOiBLLCBnZXQ6ICgpID0+IFRbS10pOiBUO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUdldHRlcjxUPihvOiBULCBnZXQ6IEZ1bmN0aW9uKTogVDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBkZWZpbmVHZXR0ZXI8VD4obzogVCwgcDogc3RyaW5nIHwga2V5b2YgVCB8IEZ1bmN0aW9uLCBnZXQ/OiBhbnkpOiBUIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBwID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRbcCwgZ2V0XSA9IFtwLm5hbWUsIHBdIGFzIFtzdHJpbmcsIEZ1bmN0aW9uXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobywgcCwge1xyXG5cdFx0XHRcdGdldCxcclxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcblx0XHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbztcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gbWFwPFQsIFY+KG86IFQsIG1hcHBlcjogKHY6IFZhbHVlT2Y8VD4sIGs6IGtleW9mIFQsIG86IFQpID0+IFYpOiBNYXBwZWRPYmplY3Q8VCwgVj4ge1xyXG5cdFx0XHRsZXQgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG8pIGFzIFtrZXlvZiBULCBWYWx1ZU9mPFQ+XVtdO1xyXG5cdFx0XHRyZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKGVudHJpZXMubWFwKChbaywgdl0pID0+IFtrLCBtYXBwZXIodiwgaywgbyldKSkgYXMgTWFwcGVkT2JqZWN0PFQsIFY+O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBRdWVyeVNlbGVjdG9yIHtcclxuXHJcblx0XHRleHBvcnQgbmFtZXNwYWNlIFdpbmRvd1Ege1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihzZWxlY3RvcjogSyk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4oc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEUgZXh0ZW5kcyBFbGVtZW50PihzZWxlY3Rvcjogc2VsZWN0b3IpOiBFO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihzZWxlY3Rvcjogc2VsZWN0b3IpOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxKHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gKHRoaXM/LmRvY3VtZW50ID8/IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHNlbGVjdG9yOiBLKTogKEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSlbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHNlbGVjdG9yOiBTKTogVGFnRWxlbWVudEZyb21UYWdOYW1lPE4+W107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHNlbGVjdG9yKTogRVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IHNlbGVjdG9yKTogKEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSlbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxKHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gWy4uLih0aGlzPy5kb2N1bWVudCA/PyBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcildO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IG5hbWVzcGFjZSBEb2N1bWVudFEge1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IEspOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHRoaXM6IERvY3VtZW50LCBzZWxlY3RvcjogUyk6IFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxOPjtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8RSBleHRlbmRzIEVsZW1lbnQ+KHRoaXM6IERvY3VtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiBFO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcSh0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmRvY3VtZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IERvY3VtZW50LCBzZWxlY3RvcjogSyk6IChIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10pW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxTIGV4dGVuZHMgc2VsZWN0b3IsIE4gPSBUYWdOYW1lRnJvbVNlbGVjdG9yPFM+Pih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj5bXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEUgZXh0ZW5kcyBFbGVtZW50Pih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogRVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IChIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10pW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcSh0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBbLi4udGhpcy5kb2N1bWVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcildO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IG5hbWVzcGFjZSBFbGVtZW50USB7XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBLKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxTIGV4dGVuZHMgc2VsZWN0b3IsIE4gPSBUYWdOYW1lRnJvbVNlbGVjdG9yPFM+Pih0aGlzOiBFbGVtZW50LCBzZWxlY3RvcjogUyk6IFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxOPjtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8RSBleHRlbmRzIEVsZW1lbnQ+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IEU7XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHEodGhpczogRWxlbWVudCwgc2VsZWN0b3I6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IEspOiAoSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdKVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj5bXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEUgZXh0ZW5kcyBFbGVtZW50Pih0aGlzOiBFbGVtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiBFW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBFbGVtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiAoSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdKVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXEodGhpczogRWxlbWVudCwgc2VsZWN0b3I6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBbLi4udGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRWxlbWVudEV4dGVuc2lvbiB7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZW1pdDxUIGV4dGVuZHMgQ3VzdG9tRXZlbnQ8eyBfZXZlbnQ/OiBzdHJpbmcgfT4+KHRoaXM6IEVsZW1lbnQsIHR5cGU6IFRbJ2RldGFpbCddWydfZXZlbnQnXSwgZGV0YWlsPzogVFsnZGV0YWlsJ10pO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVtaXQ8VD4odGhpczogRWxlbWVudCwgdHlwZTogc3RyaW5nLCBkZXRhaWw/OiBUKSB7XHJcblx0XHRcdGxldCBldmVudCA9IG5ldyBDdXN0b21FdmVudCh0eXBlLCB7XHJcblx0XHRcdFx0YnViYmxlczogdHJ1ZSxcclxuXHRcdFx0XHRkZXRhaWwsXHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBhcHBlbmRUbzxFIGV4dGVuZHMgRWxlbWVudD4odGhpczogRSwgcGFyZW50OiBFbGVtZW50IHwgc2VsZWN0b3IpOiBFIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBwYXJlbnQgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRwYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmVudCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cGFyZW50LmFwcGVuZCh0aGlzKTtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbG0ge1xyXG5cdFx0dHlwZSBDaGlsZCA9IE5vZGUgfCBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuO1xyXG5cdFx0dHlwZSBTb21lRXZlbnQgPSBFdmVudCAmIE1vdXNlRXZlbnQgJiBLZXlib2FyZEV2ZW50ICYgeyB0YXJnZXQ6IEhUTUxFbGVtZW50IH07XHJcblx0XHR0eXBlIExpc3RlbmVyID0gKChldmVudDogU29tZUV2ZW50KSA9PiBhbnkpXHJcblx0XHRcdCYgeyBuYW1lPzogYCR7JycgfCAnYm91bmQgJ30keydvbicgfCAnJ30ke2tleW9mIEhUTUxFbGVtZW50RXZlbnRNYXB9YCB8ICcnIH0gfCAoKGV2ZW50OiBTb21lRXZlbnQpID0+IGFueSk7XHJcblxyXG5cdFx0Y29uc3QgZWxtUmVnZXggPSBuZXcgUmVnRXhwKFtcclxuXHRcdFx0L14oPzx0YWc+W1xcdy1dKykvLFxyXG5cdFx0XHQvIyg/PGlkPltcXHctXSspLyxcclxuXHRcdFx0L1xcLig/PGNsYXNzPltcXHctXSspLyxcclxuXHRcdFx0L1xcWyg/PGF0dHIxPltcXHctXSspXFxdLyxcclxuXHRcdFx0L1xcWyg/PGF0dHIyPltcXHctXSspPSg/IVsnXCJdKSg/PHZhbDI+W15cXF1dKilcXF0vLFxyXG5cdFx0XHQvXFxbKD88YXR0cjM+W1xcdy1dKyk9XCIoPzx2YWwzPig/OlteXCJdfFxcXFxcIikqKVwiXFxdLyxcclxuXHRcdFx0L1xcWyg/PGF0dHI0PltcXHctXSspPVwiKD88dmFsND4oPzpbXiddfFxcXFwnKSopXCJcXF0vLFxyXG5cdFx0XS5tYXAoZSA9PiBlLnNvdXJjZSkuam9pbignfCcpLCAnZycpO1xyXG5cclxuXHRcdC8qKiBpZiBgZWxtYCBzaG91bGQgZGlzYWxsb3cgbGlzdGVuZXJzIG5vdCBleGlzdGluZyBhcyBgb24gKiBgIHByb3BlcnR5IG9uIHRoZSBlbGVtZW50ICovXHJcblx0XHRleHBvcnQgbGV0IGFsbG93T25seUV4aXN0aW5nTGlzdGVuZXJzID0gdHJ1ZTtcclxuXHJcblx0XHQvKiogaWYgYGVsbWAgc2hvdWxkIGFsbG93IG92ZXJyaWRpbmcgYG9uICogYCBsaXN0ZW5lcnMgaWYgbXVsdGlwbGUgb2YgdGhlbSBhcmUgcHJvdmlkZWQgKi9cclxuXHRcdGV4cG9ydCBsZXQgYWxsb3dPdmVycmlkZU9uTGlzdGVuZXJzID0gZmFsc2U7XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVsbTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihzZWxlY3RvcjogSywgLi4uY2hpbGRyZW46IChDaGlsZCB8IExpc3RlbmVyKVtdKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVsbTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihzZWxlY3Rvcjoga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwIGV4dGVuZHMgSyA/IG5ldmVyIDogc2VsZWN0b3IsIC4uLmNoaWxkcmVuOiAoQ2hpbGQgfCBMaXN0ZW5lcilbXSk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG08UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4oc2VsZWN0b3I6IFMsIC4uLmNoaWxkcmVuOiAoQ2hpbGQgfCBMaXN0ZW5lcilbXSk6IFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxOPjtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG08RSBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oc2VsZWN0b3I6IHNlbGVjdG9yLCAuLi5jaGlsZHJlbjogKENoaWxkIHwgTGlzdGVuZXIpW10pOiBFO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVsbSgpOiBIVE1MRGl2RWxlbWVudDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG0oc2VsZWN0b3I6IHN0cmluZyA9ICcnLCAuLi5jaGlsZHJlbjogKENoaWxkIHwgTGlzdGVuZXIpW10pOiBIVE1MRWxlbWVudCB7XHJcblx0XHRcdGlmIChzZWxlY3Rvci5yZXBsYWNlQWxsKGVsbVJlZ2V4LCAnJykgIT0gJycpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3J9IGApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHQvLyBsZXQgdGFnID0gJyc7XHJcblx0XHRcdC8vIGxldCBmaXJzdE1hdGNoID0gZmFsc2U7XHJcblx0XHRcdGZvciAobGV0IG1hdGNoIG9mIHNlbGVjdG9yLm1hdGNoQWxsKGVsbVJlZ2V4KSkge1xyXG5cdFx0XHRcdGlmIChtYXRjaC5ncm91cHMudGFnKSB7XHJcblx0XHRcdFx0XHQvLyBpZiAodGFnICYmIG1hdGNoLmdyb3Vwcy50YWcgIT0gdGFnKSB7XHJcblx0XHRcdFx0XHQvLyBcdHRocm93IG5ldyBFcnJvcihgc2VsZWN0b3IgaGFzIHR3byBkaWZmZXJlbnQgdGFncyBhdCBvbmNlIDogPCR7dGFnfT4gYW5kIDwke21hdGNoLmdyb3Vwcy50YWd9PmApO1xyXG5cdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0Ly8gdGFnID0gbWF0Y2guZ3JvdXBzLnRhZztcclxuXHRcdFx0XHRcdC8vIGlmICghZmlyc3RNYXRjaCkgcmV0dXJuIGVsbSh0YWcgKyBzZWxlY3RvciwgLi4uY2hpbGRyZW4pO1xyXG5cdFx0XHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobWF0Y2guZ3JvdXBzLnRhZyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuaWQpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuaWQgPSBtYXRjaC5ncm91cHMuaWQ7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuY2xhc3MpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZChtYXRjaC5ncm91cHMuY2xhc3MpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2guZ3JvdXBzLmF0dHIxKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShtYXRjaC5ncm91cHMuYXR0cjEsIFwidHJ1ZVwiKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG1hdGNoLmdyb3Vwcy5hdHRyMikge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUobWF0Y2guZ3JvdXBzLmF0dHIyLCBtYXRjaC5ncm91cHMudmFsMik7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuYXR0cjMpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG1hdGNoLmdyb3Vwcy5hdHRyMywgbWF0Y2guZ3JvdXBzLnZhbDMucmVwbGFjZSgvXFxcXFwiL2csICdcIicpKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG1hdGNoLmdyb3Vwcy5hdHRyNCkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUobWF0Y2guZ3JvdXBzLmF0dHI0LCBtYXRjaC5ncm91cHMudmFsNC5yZXBsYWNlKC9cXFxcJy9nLCAnXFwnJykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBmaXJzdE1hdGNoID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgbGlzdGVuZXIgb2YgY2hpbGRyZW4uZmlsdGVyKGUgPT4gdHlwZW9mIGUgPT0gJ2Z1bmN0aW9uJykgYXMgTGlzdGVuZXJbXSkge1xyXG5cdFx0XHRcdGxldCBuYW1lOiBzdHJpbmcgPSBsaXN0ZW5lci5uYW1lO1xyXG5cdFx0XHRcdGlmICghbmFtZSkgbmFtZSA9IChsaXN0ZW5lciArICcnKS5tYXRjaCgvXFxiKD8hZnVuY3Rpb25cXGIpXFx3Ky8pWzBdO1xyXG5cdFx0XHRcdGlmICghbmFtZSkgdGhyb3cgbmV3IEVycm9yKCd0cnlpbmcgdG8gYmluZCB1bm5hbWVkIGZ1bmN0aW9uJyk7XHJcblx0XHRcdFx0aWYgKG5hbWUuc3RhcnRzV2l0aCgnYm91bmQgJykpIG5hbWUgPSBuYW1lLnNsaWNlKCdib3VuZCAnLmxlbmd0aCk7XHJcblx0XHRcdFx0aWYgKG5hbWUuc3RhcnRzV2l0aCgnb24nKSkge1xyXG5cdFx0XHRcdFx0aWYgKCFlbGVtZW50Lmhhc093blByb3BlcnR5KG5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoYDwgJHtlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKX0+IGRvZXMgbm90IGhhdmUgXCIke25hbWV9XCIgbGlzdGVuZXJgKTtcclxuXHRcdFx0XHRcdGlmICghYWxsb3dPdmVycmlkZU9uTGlzdGVuZXJzICYmIGVsZW1lbnRbbmFtZV0pIHRocm93IG5ldyBFcnJvcignb3ZlcnJpZGluZyBgb24gKiBgIGxpc3RlbmVycyBpcyBkaXNhYmxlZCcpO1xyXG5cdFx0XHRcdFx0ZWxlbWVudFtuYW1lXSA9IGxpc3RlbmVyO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoYWxsb3dPbmx5RXhpc3RpbmdMaXN0ZW5lcnMgJiYgZWxlbWVudFsnb24nICsgbmFtZV0gPT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGA8JHtlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKX0+IGRvZXMgbm90IGhhdmUgXCJvbicke25hbWV9J1wiIGxpc3RlbmVyYCk7XHJcblx0XHRcdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbGVtZW50LmFwcGVuZCguLi5jaGlsZHJlbi5maWx0ZXIoZSA9PiB0eXBlb2YgZSAhPSAnZnVuY3Rpb24nKSBhcyAoTm9kZSB8IHN0cmluZylbXSk7XHJcblx0XHRcdHJldHVybiBlbGVtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBxT3JFbG08SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IEssIHBhcmVudD86IFBhcmVudE5vZGUgfCBzZWxlY3Rvcik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBxT3JFbG08UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4oc2VsZWN0b3I6IFMsIHBhcmVudD86IFBhcmVudE5vZGUgfCBzZWxlY3Rvcik6IFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxOPjtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBxT3JFbG08RSBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oc2VsZWN0b3I6IHN0cmluZywgcGFyZW50PzogUGFyZW50Tm9kZSB8IHNlbGVjdG9yKTogRTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBxT3JFbG0oc2VsZWN0b3I6IHN0cmluZywgcGFyZW50PzogUGFyZW50Tm9kZSB8IHN0cmluZykge1xyXG5cdFx0XHRpZiAodHlwZW9mIHBhcmVudCA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdHBhcmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyZW50KSBhcyBQYXJlbnROb2RlO1xyXG5cdFx0XHRcdGlmICghcGFyZW50KSB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWxlZCB0byBmaW5kIHBhcmVudCBlbGVtZW50Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHNlbGVjdG9yLmluY2x1ZGVzKCc+JykpIHtcclxuXHRcdFx0XHRsZXQgcGFyZW50U2VsZWN0b3IgPSBzZWxlY3Rvci5zcGxpdCgnPicpLnNsaWNlKDAsIC0xKS5qb2luKCc+Jyk7XHJcblx0XHRcdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5zcGxpdCgnPicpLnBvcCgpO1xyXG5cdFx0XHRcdHBhcmVudCA9IChwYXJlbnQgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3IocGFyZW50U2VsZWN0b3IpIGFzIFBhcmVudE5vZGU7XHJcblx0XHRcdFx0aWYgKCFwYXJlbnQpIHRocm93IG5ldyBFcnJvcignZmFpbGVkIHRvIGZpbmQgcGFyZW50IGVsZW1lbnQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgY2hpbGQgPSAocGFyZW50IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHRcdFx0aWYgKGNoaWxkKSByZXR1cm4gY2hpbGQ7XHJcblxyXG5cdFx0XHRjaGlsZCA9IGVsbShzZWxlY3Rvcik7XHJcblx0XHRcdHBhcmVudD8uYXBwZW5kKGNoaWxkKTtcclxuXHRcdFx0cmV0dXJuIGNoaWxkO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgbGV0IGRlYnVnID0gZmFsc2U7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgZXRjIHtcclxuXHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZ1bGxzY3JlZW4ob24/OiBib29sZWFuKSB7XHJcblx0XHRcdGxldCBjZW50cmFsID0gSW1hZ2VTY3JvbGxpbmdFeHRlbnNpb24uaW1hZ2VTY3JvbGxpbmdBY3RpdmUgJiYgSW1hZ2VTY3JvbGxpbmdFeHRlbnNpb24uZ2V0Q2VudHJhbEltZygpO1xyXG5cdFx0XHRpZiAoIWRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50KSB7XHJcblx0XHRcdFx0aWYgKG9uID09IGZhbHNlKSByZXR1cm47XHJcblx0XHRcdFx0YXdhaXQgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCkuY2F0Y2goKCkgPT4geyB9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAob24gPT0gdHJ1ZSkgcmV0dXJuO1xyXG5cdFx0XHRcdGF3YWl0IGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKCkuY2F0Y2goKCkgPT4geyB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY2VudHJhbCkge1xyXG5cdFx0XHRcdGNlbnRyYWwuc2Nyb2xsSW50b1ZpZXcoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gISFkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudDtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGhhc2hDb2RlKHRoaXM6IHN0cmluZyk7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gaGFzaENvZGUodmFsdWU6IHN0cmluZyk7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gaGFzaENvZGUodGhpczogc3RyaW5nLCB2YWx1ZT86IHN0cmluZykge1xyXG5cdFx0XHR2YWx1ZSA/Pz0gdGhpcztcclxuXHRcdFx0bGV0IGhhc2ggPSAwO1xyXG5cdFx0XHRmb3IgKGxldCBjIG9mIHZhbHVlKSB7XHJcblx0XHRcdFx0aGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgYy5jaGFyQ29kZUF0KDApO1xyXG5cdFx0XHRcdGhhc2ggPSBoYXNoICYgaGFzaDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gaGFzaDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRcdFx0Ly8gU3RyaW5nLnByb3RvdHlwZS5oYXNoQ29kZSA9IGhhc2hDb2RlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBjdXJyZW50U2NyaXB0SGFzaCgpIHtcclxuXHRcdFx0cmV0dXJuIGhhc2hDb2RlKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuaW5uZXJIVE1MKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcmVsb2FkT25DdXJyZW50U2NyaXB0Q2hhbmdlZChzY3JpcHROYW1lOiBzdHJpbmcgPSBsb2NhdGlvbi5ob3N0bmFtZSArICcudWpzJykge1xyXG5cdFx0XHRsZXQgc2NyaXB0SWQgPSBgcmVsb2FkT25DdXJyZW50U2NyaXB0Q2hhbmdlZF8ke3NjcmlwdE5hbWV9YDtcclxuXHRcdFx0bGV0IHNjcmlwdEhhc2ggPSBjdXJyZW50U2NyaXB0SGFzaCgpICsgJyc7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKHNjcmlwdElkLCBzY3JpcHRIYXNoKTtcclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiB7XHJcblx0XHRcdFx0aWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHNjcmlwdElkKSAhPSBzY3JpcHRIYXNoKSB7XHJcblx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBsZXQgZmFzdFNjcm9sbDoge1xyXG5cdFx0XHQoc3BlZWQ/OiBudW1iZXIpOiB2b2lkO1xyXG5cdFx0XHRzcGVlZD86IG51bWJlcjtcclxuXHRcdFx0YWN0aXZlPzogYm9vbGVhbjtcclxuXHRcdFx0b2ZmPzogKCkgPT4gdm9pZDtcclxuXHRcdH0gPSBmdW5jdGlvbiAoc3BlZWQgPSAwLjI1KSB7XHJcblx0XHRcdGlmIChmYXN0U2Nyb2xsLmFjdGl2ZSkgZmFzdFNjcm9sbC5vZmYoKTtcclxuXHRcdFx0ZmFzdFNjcm9sbC5hY3RpdmUgPSB0cnVlO1xyXG5cdFx0XHRmYXN0U2Nyb2xsLnNwZWVkID0gc3BlZWQ7XHJcblx0XHRcdGZ1bmN0aW9uIG9ud2hlZWwoZXZlbnQ6IFdoZWVsRXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cdFx0XHRcdGlmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50LnNoaWZ0S2V5KSByZXR1cm47XHJcblx0XHRcdFx0c2Nyb2xsQnkoMCwgLU1hdGguc2lnbihldmVudC5kZWx0YVkpICogaW5uZXJIZWlnaHQgKiBmYXN0U2Nyb2xsLnNwZWVkKTtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgb253aGVlbCwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcclxuXHRcdFx0ZmFzdFNjcm9sbC5vZmYgPSAoKSA9PiB7XHJcblx0XHRcdFx0ZmFzdFNjcm9sbC5hY3RpdmUgPSBmYWxzZTtcclxuXHRcdFx0XHRyZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIG9ud2hlZWwpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmYXN0U2Nyb2xsLmFjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0ZmFzdFNjcm9sbC5vZmYgPSAoKSA9PiB7IH07XHJcblxyXG5cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gb25yYWYoZjogKCkgPT4gdm9pZCkge1xyXG5cdFx0XHRsZXQgbG9vcCA9IHRydWU7XHJcblx0XHRcdHZvaWQgYXN5bmMgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHdoaWxlIChsb29wKSB7XHJcblx0XHRcdFx0XHRhd2FpdCBQcm9taXNlLmZyYW1lKCk7XHJcblx0XHRcdFx0XHRmKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KCk7XHJcblx0XHRcdHJldHVybiAoKSA9PiB7IGxvb3AgPSBmYWxzZSB9O1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCByZXNpemVPYnNlcnZlcjogUmVzaXplT2JzZXJ2ZXI7XHJcblx0XHRsZXQgcmVzaXplTGlzdGVuZXJzOiAoKG5ld0hlaWdodDogbnVtYmVyLCBvbGRIZWlnaHQ6IG51bWJlcikgPT4gdm9pZClbXSA9IFtdO1xyXG5cdFx0bGV0IHByZXZpb3VzQm9keUhlaWdodCA9IDA7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gb25oZWlnaHRjaGFuZ2UoZjogKG5ld0hlaWdodDogbnVtYmVyLCBvbGRIZWlnaHQ6IG51bWJlcikgPT4gdm9pZCkge1xyXG5cdFx0XHRpZiAoIXJlc2l6ZU9ic2VydmVyKSB7XHJcblx0XHRcdFx0cHJldmlvdXNCb2R5SGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcblx0XHRcdFx0cmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoZW50cmllcyA9PiB7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBlIG9mIGVudHJpZXMpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGUudGFyZ2V0ICE9IGRvY3VtZW50LmJvZHkpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0bGV0IG5ld0JvZHlIZWlnaHQgPSBlLnRhcmdldC5jbGllbnRIZWlnaHQ7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGYgb2YgcmVzaXplTGlzdGVuZXJzKSB7XHJcblx0XHRcdFx0XHRcdFx0ZihuZXdCb2R5SGVpZ2h0LCBwcmV2aW91c0JvZHlIZWlnaHQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHByZXZpb3VzQm9keUhlaWdodCA9IG5ld0JvZHlIZWlnaHQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXNpemVMaXN0ZW5lcnMucHVzaChmKTtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKCkge1xyXG5cdFx0XHRcdHJlc2l6ZUxpc3RlbmVycy5zcGxpY2UocmVzaXplTGlzdGVuZXJzLmluZGV4T2YoZikpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGRlY2xhcmUgY29uc3Qga2RzOiB7XHJcblx0XHRcdFtrOiBzdHJpbmddOiBzdHJpbmcgfCAoKGU6IEtleWJvYXJkRXZlbnQgJiBNb3VzZUV2ZW50KSA9PiB2b2lkKVxyXG5cdFx0fTtcclxuXHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXRjLCAna2RzJywge1xyXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcblx0XHRcdGdldCgpIHtcclxuXHRcdFx0XHRsZXQga2RzID0gaW5pdEtkcygpO1xyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShldGMsICdrZHMnLCB7IHZhbHVlOiBrZHMgfSk7XHJcblx0XHRcdFx0cmV0dXJuIGtkcztcclxuXHRcdFx0fSxcclxuXHRcdH0pO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFBvb3BKcywgJ2tkcycsIHtcclxuXHRcdFx0Z2V0OiAoKSA9PiBldGMua2RzLFxyXG5cdFx0XHRzZXQ6ICh2KSA9PiBPYmplY3QuYXNzaWduKGV0Yy5rZHMsIHYpLFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlS2RzQ29kZXMoZTogS2V5Ym9hcmRFdmVudCAmIE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0bGV0IGJhc2VQcmVmaXggPSBgJHtlLnNoaWZ0S2V5ID8gJzwnIDogJyd9JHtlLmN0cmxLZXkgPyAnXicgOiAnJ30ke2UuYWx0S2V5ID8gJz4nIDogJyd9YDtcclxuXHRcdFx0bGV0IGJhc2VDb2RlID0gZS5jb2RlXHJcblx0XHRcdFx0PyBlLmNvZGUucmVwbGFjZSgvS2V5fERpZ2l0fEFycm93fExlZnR8UmlnaHQvLCAnJylcclxuXHRcdFx0XHQ6IFsnTE1CJywgJ1JNQicsICdNTUInXVtlLmJ1dHRvbl07XHJcblx0XHRcdGxldCBleHRyYUNvZGUgPSBlLmNvZGVcclxuXHRcdFx0XHQ/IGJhc2VDb2RlLnJlcGxhY2UoJ0NvbnRyb2wnLCAnQ3RybCcpXHJcblx0XHRcdFx0OiBiYXNlQ29kZTsvLyBbJ0xlZnQnLCAnUmlnaHQnLCAnTWlkZGxlJ11bZS5idXR0b25dO1xyXG5cdFx0XHRsZXQgcmF3Q29kZSA9IGUuY29kZSA/PyBiYXNlQ29kZTtcclxuXHRcdFx0bGV0IGtleUNvZGUgPSBlLmtleSA/PyBiYXNlQ29kZTtcclxuXHRcdFx0bGV0IGV4dHJhUHJlZml4ID0gYmFzZVByZWZpeC5yZXBsYWNlKFxyXG5cdFx0XHRcdGJhc2VDb2RlID09ICdTaGlmdCcgPyAnPCcgOiBiYXNlQ29kZSA9PSAnQ29udHJvbCcgPyAnXicgOiBiYXNlQ29kZSA9PSAnQWx0JyA/ICc+JyA6ICcnXHJcblx0XHRcdFx0LCAnJyk7XHJcblxyXG5cdFx0XHRsZXQgY29kZXMgPSBbYmFzZUNvZGUsIGV4dHJhQ29kZSwgcmF3Q29kZSwga2V5Q29kZV0uZmxhdE1hcChcclxuXHRcdFx0XHRjID0+IFtiYXNlUHJlZml4LCBleHRyYVByZWZpeF0ubWFwKHAgPT4gcCArIGMpXHJcblx0XHRcdCk7XHJcblx0XHRcdC8vLmZsYXRNYXAoZSA9PiBbZSwgZS50b1VwcGVyQ2FzZSgpLCBlLnRvTG93ZXJDYXNlKCldKTtcclxuXHRcdFx0Y29kZXMucHVzaChlLmNvZGUgPyAna2V5JyA6ICdtb3VzZScpO1xyXG5cdFx0XHRjb2Rlcy5wdXNoKCdhbnknKTtcclxuXHRcdFx0cmV0dXJuIEFycmF5LmZyb20obmV3IFNldChjb2RlcykpO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGtkc0xpc3RlbmVyKGU6IEtleWJvYXJkRXZlbnQgJiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdGxldCBjb2RlcyA9IGdlbmVyYXRlS2RzQ29kZXMoZSk7XHJcblx0XHRcdE9iamVjdC5hc3NpZ24oZSwgeyBfY29kZXM6IGNvZGVzIH0pO1xyXG5cdFx0XHRmb3IgKGxldCBjIG9mIGNvZGVzKSB7XHJcblx0XHRcdFx0bGV0IGxpc3RlbmVyID0gZXRjLmtkc1tjXTtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGxpc3RlbmVyID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRxKGxpc3RlbmVyKS5jbGljaygpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGxpc3RlbmVyID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdChldGMua2RzW2NdIGFzIGFueSkoZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBpbml0S2RzKCkge1xyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2RzTGlzdGVuZXIpO1xyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBrZHNMaXN0ZW5lcik7XHJcblx0XHRcdHJldHVybiB7fTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZXhwb3J0IGRlY2xhcmUgbGV0IGtkczogdHlwZW9mIGV0Yy5rZHM7XHJcbn1cclxuXHJcbiIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cclxuXHRleHBvcnQgdHlwZSBkZWx0YVRpbWUgPSBudW1iZXIgfCBgJHtudW1iZXJ9JHsncycgfCAnaCcgfCAnZCcgfCAndycgfCAneSd9YCB8IG51bGw7XHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVEZWx0YVRpbWUobWF4QWdlOiBkZWx0YVRpbWUpIHtcclxuXHRcdGlmICh0eXBlb2YgbWF4QWdlID09ICdudW1iZXInKSByZXR1cm4gbWF4QWdlO1xyXG5cdFx0aWYgKHR5cGVvZiBtYXhBZ2UgIT0gJ3N0cmluZycpIHJldHVybiBJbmZpbml0eTtcclxuXHRcdGNvbnN0IGFUb00gPSB7IHM6IDFlMywgaDogMzYwMGUzLCBkOiAyNCAqIDM2MDBlMywgdzogNyAqIDI0ICogMzYwMGUzLCB5OiAzNjUgKiAyNCAqIDM2MDBlMyB9O1xyXG5cdFx0bGV0IG4gPSBwYXJzZUZsb2F0KG1heEFnZSk7XHJcblx0XHRsZXQgbSA9IGFUb01bbWF4QWdlW21heEFnZS5sZW5ndGggLSAxXV07XHJcblx0XHRpZiAobiAhPSBuIHx8ICFtKSB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGVsdGFUaW1lJyk7XHJcblx0XHRyZXR1cm4gbiAqIG07XHJcblx0fVxyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIEZldGNoRXh0ZW5zaW9uIHtcclxuXHRcdGV4cG9ydCB0eXBlIFJlcXVlc3RJbml0RXggPSBSZXF1ZXN0SW5pdCAmIHtcclxuXHRcdFx0bWF4QWdlPzogZGVsdGFUaW1lLFxyXG5cdFx0XHR4bWw/OiBib29sZWFuLFxyXG5cdFx0XHRjYWNoZVVybD86IHN0cmluZyB8ICdwb3N0JyAmIHsgXz86ICdwb3N0JyB9LFxyXG5cdFx0fTtcclxuXHRcdGV4cG9ydCB0eXBlIFJlcXVlc3RJbml0RXhKc29uID0gUmVxdWVzdEluaXQgJiB7IG1heEFnZT86IGRlbHRhVGltZSwgaW5kZXhlZERiPzogYm9vbGVhbiB9O1xyXG5cdFx0ZXhwb3J0IGxldCBkZWZhdWx0czogUmVxdWVzdEluaXQgPSB7IGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgfTtcclxuXHJcblx0XHRleHBvcnQgbGV0IGNhY2hlOiBDYWNoZSA9IG51bGw7XHJcblx0XHRhc3luYyBmdW5jdGlvbiBvcGVuQ2FjaGUoKSB7XHJcblx0XHRcdGlmIChjYWNoZSkgcmV0dXJuIGNhY2hlO1xyXG5cdFx0XHRjYWNoZSA9IGF3YWl0IGNhY2hlcy5vcGVuKCdmZXRjaCcpO1xyXG5cdFx0XHRyZXR1cm4gY2FjaGU7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gdG9EdXIoZHQ6IGRlbHRhVGltZSkge1xyXG5cdFx0XHRkdCA9IG5vcm1hbGl6ZURlbHRhVGltZShkdCk7XHJcblx0XHRcdGlmIChkdCA+IDFlMTApIGR0ID0gRGF0ZS5ub3coKSAtIGR0O1xyXG5cdFx0XHRsZXQgc3BsaXQgPSAobjogbnVtYmVyLCBkOiBudW1iZXIpID0+IFtuICUgZCwgfn4obiAvIGQpXTtcclxuXHRcdFx0bGV0IHRvMiA9IChuOiBudW1iZXIpID0+IChuICsgJycpLnBhZFN0YXJ0KDIsICcwJyk7XHJcblx0XHRcdHZhciBbbXMsIHNdID0gc3BsaXQoZHQsIDEwMDApO1xyXG5cdFx0XHR2YXIgW3MsIG1dID0gc3BsaXQocywgNjApO1xyXG5cdFx0XHR2YXIgW20sIGhdID0gc3BsaXQobSwgNjApO1xyXG5cdFx0XHR2YXIgW2gsIGRdID0gc3BsaXQoaCwgMjQpO1xyXG5cdFx0XHR2YXIgW2QsIHddID0gc3BsaXQoZCwgNyk7XHJcblx0XHRcdHJldHVybiB3ID4gMWUzID8gJ2ZvcmV2ZXInIDogdyA/IGAke3d9dyR7ZH1kYCA6IGQgPyBgJHtkfWQke3RvMihoKX1oYCA6IGggKyBtID8gYCR7dG8yKGgpfToke3RvMihtKX06JHt0bzIocyl9YCA6IGAke3MgKyB+fm1zIC8gMTAwMH1zYDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gaXNTdGFsZShjYWNoZWRBdDogbnVtYmVyLCBtYXhBZ2U/OiBkZWx0YVRpbWUpIHtcclxuXHRcdFx0aWYgKG1heEFnZSA9PSBudWxsKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdHJldHVybiBEYXRlLm5vdygpIC0gY2FjaGVkQXQgPj0gbm9ybWFsaXplRGVsdGFUaW1lKG1heEFnZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNhY2hlZCh1cmw6IHN0cmluZywgaW5pdDogUmVxdWVzdEluaXRFeCA9IHt9KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG5cdFx0XHRsZXQgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblx0XHRcdGxldCBjYWNoZSA9IGF3YWl0IG9wZW5DYWNoZSgpO1xyXG5cdFx0XHRsZXQgY2FjaGVVcmwgPSAoaW5pdC5jYWNoZVVybCA/PyB1cmwpICsgJyc7XHJcblx0XHRcdGlmICghY2FjaGVVcmwuc3RhcnRzV2l0aCgnaHR0cCcpKSBjYWNoZVVybCA9IHVybCArICcmJmNhY2hlVXJsPScgKyBjYWNoZVVybDtcclxuXHRcdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgY2FjaGUubWF0Y2goY2FjaGVVcmwpO1xyXG5cdFx0XHRpZiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRyZXNwb25zZS5jYWNoZWRBdCA9ICtyZXNwb25zZS5oZWFkZXJzLmdldCgnY2FjaGVkLWF0JykgfHwgMDtcclxuXHRcdFx0XHRpZiAoIWlzU3RhbGUocmVzcG9uc2UuY2FjaGVkQXQsIG5vcm1hbGl6ZURlbHRhVGltZShpbml0Lm1heEFnZSkpKSB7XHJcblx0XHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYENhY2hlZCByZXNwb25zZTogJHt0b0R1cihyZXNwb25zZS5jYWNoZWRBdCl9IDwgYzoke3RvRHVyKGluaXQubWF4QWdlKX1gLCB1cmwpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYFN0YWxlIHJlc3BvbnNlOiAke3RvRHVyKHJlc3BvbnNlLmNhY2hlZEF0KX0gPiBjOiR7dG9EdXIoaW5pdC5tYXhBZ2UpfWAsIHVybCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVzcG9uc2UgPVxyXG5cdFx0XHRcdCFpbml0LnhtbCA/IGF3YWl0IGZldGNoKHVybCwgeyAuLi5kZWZhdWx0cywgLi4uaW5pdCB9KVxyXG5cdFx0XHRcdFx0OiBhd2FpdCB4bWxSZXNwb25zZSh1cmwsIGluaXQpO1xyXG5cdFx0XHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHRcdFx0XHRyZXNwb25zZS5jYWNoZWRBdCA9IERhdGUubm93KCk7XHJcblx0XHRcdFx0bGV0IGNsb25lID0gcmVzcG9uc2UuY2xvbmUoKTtcclxuXHRcdFx0XHRsZXQgaW5pdDI6IFJlc3BvbnNlSW5pdCA9IHtcclxuXHRcdFx0XHRcdHN0YXR1czogY2xvbmUuc3RhdHVzLCBzdGF0dXNUZXh0OiBjbG9uZS5zdGF0dXNUZXh0LFxyXG5cdFx0XHRcdFx0aGVhZGVyczogW1snY2FjaGVkLWF0JywgYCR7cmVzcG9uc2UuY2FjaGVkQXR9YF0sIC4uLmNsb25lLmhlYWRlcnMuZW50cmllcygpXVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0bGV0IHJlc3VsdFJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGNsb25lLmJvZHksIGluaXQyKTtcclxuXHRcdFx0XHRjYWNoZS5wdXQoY2FjaGVVcmwsIHJlc3VsdFJlc3BvbnNlKTtcclxuXHRcdFx0XHRsZXQgZHQgPSBwZXJmb3JtYW5jZS5ub3coKSAtIG5vdztcclxuXHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYExvYWRlZCByZXNwb25zZTogJHt0b0R1cihkdCl9IC8gYzoke3RvRHVyKGluaXQubWF4QWdlKX1gLCB1cmwpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgRmFpbGVkIHJlc3BvbnNlOiAke3RvRHVyKHJlc3BvbnNlLmNhY2hlZEF0KX0gLyBjOiR7dG9EdXIoaW5pdC5tYXhBZ2UpfWAsIHVybCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYWNoZWREb2ModXJsOiBzdHJpbmcsIGluaXQ6IFJlcXVlc3RJbml0RXggPSB7fSk6IFByb21pc2U8RG9jdW1lbnQ+IHtcclxuXHRcdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgY2FjaGVkKHVybCwgaW5pdCk7XHJcblx0XHRcdGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG5cdFx0XHRsZXQgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG5cdFx0XHRsZXQgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAndGV4dC9odG1sJyk7XHJcblx0XHRcdGxldCBiYXNlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2Jhc2UnKTtcclxuXHRcdFx0YmFzZS5ocmVmID0gdXJsO1xyXG5cdFx0XHRkb2MuaGVhZC5hcHBlbmQoYmFzZSk7XHJcblx0XHRcdGRvYy5jYWNoZWRBdCA9IHJlc3BvbnNlLmNhY2hlZEF0O1xyXG5cdFx0XHRyZXR1cm4gZG9jO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gZG9jKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdEV4ID0ge30pOiBQcm9taXNlPERvY3VtZW50PiB7XHJcblx0XHRcdGxldCByZXNwb25zZSA9XHJcblx0XHRcdFx0IWluaXQueG1sID8gYXdhaXQgZmV0Y2godXJsLCB7IC4uLmRlZmF1bHRzLCAuLi5pbml0IH0pXHJcblx0XHRcdFx0XHQ6IGF3YWl0IHhtbFJlc3BvbnNlKHVybCwgaW5pdCk7XHJcblx0XHRcdGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG5cdFx0XHRsZXQgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG5cdFx0XHRsZXQgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAndGV4dC9odG1sJyk7XHJcblx0XHRcdGxldCBiYXNlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2Jhc2UnKTtcclxuXHRcdFx0YmFzZS5ocmVmID0gdXJsO1xyXG5cdFx0XHRkb2MuaGVhZC5hcHBlbmQoYmFzZSk7XHJcblx0XHRcdGRvYy5jYWNoZWRBdCA9IHJlc3BvbnNlLmNhY2hlZEF0O1xyXG5cdFx0XHRyZXR1cm4gZG9jO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiB4bWxSZXNwb25zZSh1cmw6IHN0cmluZywgaW5pdDogUmVxdWVzdEluaXRFeCA9IHt9KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG5cdFx0XHRsZXQgcCA9IFByb21pc2VFeHRlbnNpb24uZW1wdHk8UHJvZ3Jlc3NFdmVudDxFdmVudFRhcmdldD4+KCk7XHJcblx0XHRcdGxldCBvUmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdG9SZXEub25sb2FkID0gcC5yO1xyXG5cdFx0XHRvUmVxLnJlc3BvbnNlVHlwZSA9ICdkb2N1bWVudCc7XHJcblx0XHRcdG9SZXEub3BlbihcImdldFwiLCB1cmwsIHRydWUpO1xyXG5cdFx0XHRvUmVxLnNlbmQoKTtcclxuXHRcdFx0YXdhaXQgcDtcclxuXHRcdFx0aWYgKG9SZXEucmVzcG9uc2VUeXBlICE9ICdkb2N1bWVudCcpIHRocm93IG5ldyBFcnJvcignRklYTUUnKTtcclxuXHRcdFx0cmV0dXJuIG5ldyBSZXNwb25zZShvUmVxLnJlc3BvbnNlWE1MLmRvY3VtZW50RWxlbWVudC5vdXRlckhUTUwsIGluaXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBqc29uKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdCA9IHt9KTogUHJvbWlzZTx1bmtub3duPiB7XHJcblx0XHRcdHJldHVybiBmZXRjaCh1cmwsIHsgLi4uZGVmYXVsdHMsIC4uLmluaXQgfSkudGhlbihlID0+IGUuanNvbigpKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xlYXJDYWNoZSgpIHtcclxuXHRcdFx0Y2FjaGUgPSBudWxsO1xyXG5cdFx0XHRyZXR1cm4gY2FjaGVzLmRlbGV0ZSgnZmV0Y2gnKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gdW5jYWNoZSh1cmw6IHN0cmluZykge1xyXG5cdFx0XHRsZXQgY2FjaGUgPSBhd2FpdCBvcGVuQ2FjaGUoKTtcclxuXHRcdFx0bGV0IGQxID0gY2FjaGUuZGVsZXRlKHVybCk7XHJcblx0XHRcdGxldCBkMiA9IGF3YWl0IGlkYkRlbGV0ZSh1cmwpO1xyXG5cdFx0XHRyZXR1cm4gKGF3YWl0IGQxKSB8fCBkMjtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNDYWNoZWQodXJsOiBzdHJpbmcsIG9wdGlvbnM6IHsgbWF4QWdlPzogZGVsdGFUaW1lLCBpbmRleGVkRGI/OiBib29sZWFuIHwgJ29ubHknIH0gPSB7fSk6IFByb21pc2U8Ym9vbGVhbiB8ICdpZGInPiB7XHJcblx0XHRcdGlmIChvcHRpb25zLmluZGV4ZWREYikge1xyXG5cdFx0XHRcdGxldCBkYkpzb24gPSBhd2FpdCBpZGJHZXQodXJsKTtcclxuXHRcdFx0XHRpZiAoZGJKc29uKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gaXNTdGFsZShkYkpzb24uY2FjaGVkQXQsIG5vcm1hbGl6ZURlbHRhVGltZShvcHRpb25zLm1heEFnZSkpID8gZmFsc2UgOiAnaWRiJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5kZXhlZERiID09ICdvbmx5JykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBjYWNoZSA9IGF3YWl0IG9wZW5DYWNoZSgpO1xyXG5cdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBjYWNoZS5tYXRjaCh1cmwpO1xyXG5cdFx0XHRpZiAoIXJlc3BvbnNlKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChvcHRpb25zPy5tYXhBZ2UgIT0gbnVsbCkge1xyXG5cdFx0XHRcdGxldCBjYWNoZWRBdCA9ICtyZXNwb25zZS5oZWFkZXJzLmdldCgnY2FjaGVkLWF0JykgfHwgMDtcclxuXHRcdFx0XHRpZiAoaXNTdGFsZShyZXNwb25zZS5jYWNoZWRBdCwgbm9ybWFsaXplRGVsdGFUaW1lKG9wdGlvbnMubWF4QWdlKSkpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FjaGVkSnNvbih1cmw6IHN0cmluZywgaW5pdDogUmVxdWVzdEluaXRFeEpzb24gPSB7fSk6IFByb21pc2U8dW5rbm93bj4ge1xyXG5cdFx0XHRpZiAoaW5pdC5pbmRleGVkRGIpIHtcclxuXHRcdFx0XHRsZXQgZGJKc29uID0gYXdhaXQgaWRiR2V0KHVybCk7XHJcblx0XHRcdFx0aWYgKGRiSnNvbikge1xyXG5cdFx0XHRcdFx0aWYgKCFpc1N0YWxlKGRiSnNvbi5jYWNoZWRBdCwgaW5pdC5tYXhBZ2UpKSB7XHJcblx0XHRcdFx0XHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZShkYkpzb24uZGF0YSBhcyBhbnksICdjYWNoZWQnLCBkYkpzb24uY2FjaGVkQXQpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZGJKc29uLmRhdGE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGNhY2hlZCh1cmwsIGluaXQpO1xyXG5cdFx0XHRsZXQganNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGAgID0gYCwganNvbik7XHJcblxyXG5cdFx0XHRpZiAoISgnY2FjaGVkJyBpbiBqc29uKSkge1xyXG5cdFx0XHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZShqc29uLCAnY2FjaGVkJywgcmVzcG9uc2UuY2FjaGVkQXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChpbml0LmluZGV4ZWREYikge1xyXG5cdFx0XHRcdGlkYlB1dCh1cmwsIGpzb24sIHJlc3BvbnNlLmNhY2hlZEF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4ganNvbjtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0bGV0IF9pZGJJbnN0YW5jZVByb21pc2U6IElEQkRhdGFiYXNlIHwgUHJvbWlzZTxJREJEYXRhYmFzZT4gPSBudWxsO1xyXG5cdFx0bGV0IGlkYkluc3RhbmNlOiBJREJEYXRhYmFzZSA9IG51bGw7XHJcblxyXG5cdFx0YXN5bmMgZnVuY3Rpb24gb3BlbklkYigpOiBQcm9taXNlPElEQkRhdGFiYXNlPiB7XHJcblx0XHRcdGlmIChpZGJJbnN0YW5jZSkgcmV0dXJuIGlkYkluc3RhbmNlO1xyXG5cdFx0XHRpZiAoYXdhaXQgX2lkYkluc3RhbmNlUHJvbWlzZSkge1xyXG5cdFx0XHRcdHJldHVybiBpZGJJbnN0YW5jZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgaXJxID0gaW5kZXhlZERCLm9wZW4oJ2ZldGNoJyk7XHJcblx0XHRcdGlycS5vbnVwZ3JhZGVuZWVkZWQgPSBldmVudCA9PiB7XHJcblx0XHRcdFx0bGV0IGRiID0gaXJxLnJlc3VsdDtcclxuXHRcdFx0XHRsZXQgc3RvcmUgPSBkYi5jcmVhdGVPYmplY3RTdG9yZSgnZmV0Y2gnLCB7IGtleVBhdGg6ICd1cmwnIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdF9pZGJJbnN0YW5jZVByb21pc2UgPSBuZXcgUHJvbWlzZSgociwgaikgPT4ge1xyXG5cdFx0XHRcdGlycS5vbnN1Y2Nlc3MgPSByO1xyXG5cdFx0XHRcdGlycS5vbmVycm9yID0gajtcclxuXHRcdFx0fSkudGhlbigoKSA9PiBpcnEucmVzdWx0LCAoKSA9PiBudWxsKTtcclxuXHRcdFx0aWRiSW5zdGFuY2UgPSBfaWRiSW5zdGFuY2VQcm9taXNlID0gYXdhaXQgX2lkYkluc3RhbmNlUHJvbWlzZTtcclxuXHRcdFx0aWYgKCFpZGJJbnN0YW5jZSkgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gb3BlbiBpbmRleGVkREInKTtcclxuXHRcdFx0cmV0dXJuIGlkYkluc3RhbmNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBpZGJDbGVhcigpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdUT0RPJylcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0YXN5bmMgZnVuY3Rpb24gaWRiR2V0KHVybDogc3RyaW5nKTogUHJvbWlzZTx7IHVybDogc3RyaW5nLCBkYXRhOiB1bmtub3duLCBjYWNoZWRBdDogbnVtYmVyIH0gfCB1bmRlZmluZWQ+IHtcclxuXHRcdFx0bGV0IGRiID0gYXdhaXQgb3BlbklkYigpO1xyXG5cdFx0XHRsZXQgdCA9IGRiLnRyYW5zYWN0aW9uKFsnZmV0Y2gnXSwgJ3JlYWRvbmx5Jyk7XHJcblx0XHRcdGxldCBycSA9IHQub2JqZWN0U3RvcmUoJ2ZldGNoJykuZ2V0KHVybCk7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyID0+IHtcclxuXHRcdFx0XHRycS5vbnN1Y2Nlc3MgPSAoKSA9PiByKHJxLnJlc3VsdCk7XHJcblx0XHRcdFx0cnEub25lcnJvciA9ICgpID0+IHIodW5kZWZpbmVkKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0YXN5bmMgZnVuY3Rpb24gaWRiUHV0KHVybDogc3RyaW5nLCBkYXRhOiB1bmtub3duLCBjYWNoZWRBdD86IG51bWJlcik6IFByb21pc2U8SURCVmFsaWRLZXkgfCB1bmRlZmluZWQ+IHtcclxuXHRcdFx0bGV0IGRiID0gYXdhaXQgb3BlbklkYigpO1xyXG5cdFx0XHRsZXQgdCA9IGRiLnRyYW5zYWN0aW9uKFsnZmV0Y2gnXSwgJ3JlYWR3cml0ZScpO1xyXG5cdFx0XHRsZXQgcnEgPSB0Lm9iamVjdFN0b3JlKCdmZXRjaCcpLnB1dCh7IHVybCwgZGF0YSwgY2FjaGVkQXQ6IGNhY2hlZEF0ID8/ICtuZXcgRGF0ZSgpIH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UociA9PiB7XHJcblx0XHRcdFx0cnEub25zdWNjZXNzID0gKCkgPT4gcihycS5yZXN1bHQpO1xyXG5cdFx0XHRcdHJxLm9uZXJyb3IgPSAoKSA9PiByKHVuZGVmaW5lZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGFzeW5jIGZ1bmN0aW9uIGlkYkRlbGV0ZSh1cmw6IHN0cmluZyk6IFByb21pc2U8SURCVmFsaWRLZXkgfCB1bmRlZmluZWQ+IHtcclxuXHRcdFx0bGV0IGRiID0gYXdhaXQgb3BlbklkYigpO1xyXG5cdFx0XHRsZXQgdCA9IGRiLnRyYW5zYWN0aW9uKFsnZmV0Y2gnXSwgJ3JlYWR3cml0ZScpO1xyXG5cdFx0XHRsZXQgcnEgPSB0Lm9iamVjdFN0b3JlKCdmZXRjaCcpLmRlbGV0ZSh1cmwpO1xyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UociA9PiB7XHJcblx0XHRcdFx0cnEub25zdWNjZXNzID0gKCkgPT4gcihycS5yZXN1bHQpO1xyXG5cdFx0XHRcdHJxLm9uZXJyb3IgPSAoKSA9PiByKHVuZGVmaW5lZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRW50cnlGaWx0ZXJlckV4dGVuc2lvbiB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBjYW4gYmUgZWl0aGVyIE1hcCBvciBXZWFrTWFwXHJcblx0XHQgKiAoV2Vha01hcCBpcyBsaWtlbHkgdG8gYmUgdXNlbGVzcyBpZiB0aGVyZSBhcmUgbGVzcyB0aGVuIDEwayBvbGQgbm9kZXMgaW4gbWFwKVxyXG5cdFx0ICovXHJcblx0XHRsZXQgTWFwVHlwZSA9IE1hcDtcclxuXHRcdHR5cGUgTWFwVHlwZTxLIGV4dGVuZHMgb2JqZWN0LCBWPiA9Ly8gTWFwPEssIFY+IHwgXHJcblx0XHRcdFdlYWtNYXA8SywgVj47XHJcblxyXG5cdFx0ZnVuY3Rpb24gdG9FbEFycmF5KGVudHJ5U2VsZWN0b3I6IHNlbGVjdG9yIHwgKCgpID0+IEhUTUxFbGVtZW50W10pKTogSFRNTEVsZW1lbnRbXSB7XHJcblx0XHRcdHJldHVybiB0eXBlb2YgZW50cnlTZWxlY3RvciA9PSAnZnVuY3Rpb24nID8gZW50cnlTZWxlY3RvcigpIDogcXEoZW50cnlTZWxlY3Rvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIEVudHJ5RmlsdGVyZXI8RGF0YSBleHRlbmRzIHt9ID0ge30+IHtcclxuXHRcdFx0Y29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHRcdFx0ZW50cnlTZWxlY3Rvcjogc2VsZWN0b3IgfCAoKCkgPT4gSFRNTEVsZW1lbnRbXSk7XHJcblx0XHRcdGNvbnN0cnVjdG9yKGVudHJ5U2VsZWN0b3I6IHNlbGVjdG9yIHwgKCgpID0+IEhUTUxFbGVtZW50W10pLCBlbmFibGVkOiBib29sZWFuIHwgJ3NvZnQnID0gJ3NvZnQnKSB7XHJcblx0XHRcdFx0dGhpcy5lbnRyeVNlbGVjdG9yID0gZW50cnlTZWxlY3RvcjtcclxuXHRcdFx0XHR0aGlzLmNvbnRhaW5lciA9IGVsbSgnLmVmLWNvbnRhaW5lcicpO1xyXG5cclxuXHRcdFx0XHRpZiAoZW5hYmxlZCA9PSAnc29mdCcpIHtcclxuXHRcdFx0XHRcdHRoaXMuc29mdERpc2FibGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0dGhpcy5kaXNhYmxlKCdzb2Z0Jyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChlbmFibGVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNvZnREaXNhYmxlID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIGVuYWJsZWQgaXMgZmFsc3lcclxuXHRcdFx0XHRcdHRoaXMuc29mdERpc2FibGUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHRoaXMuZGlzYWJsZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnN0eWxlKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMudXBkYXRlKCk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcjxQYWdpbmF0ZUV4dGVuc2lvbi5QTW9kaWZ5RXZlbnQ+KCdwYWdpbmF0aW9ubW9kaWZ5JywgKCkgPT4gdGhpcy5yZXF1ZXN0VXBkYXRlKCkpO1xyXG5cdFx0XHRcdGV0Yy5vbmhlaWdodGNoYW5nZSgoKSA9PiB0aGlzLnJlcXVlc3RVcGRhdGUoKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGVudHJpZXM6IEhUTUxFbGVtZW50W10gPSBbXTtcclxuXHRcdFx0ZW50cnlEYXRhczogTWFwVHlwZTxIVE1MRWxlbWVudCwgRGF0YT4gPSBuZXcgTWFwVHlwZSgpO1xyXG5cclxuXHRcdFx0Z2V0RGF0YShlbDogSFRNTEVsZW1lbnQpOiBEYXRhO1xyXG5cdFx0XHRnZXREYXRhKCk6IERhdGFbXTtcclxuXHRcdFx0Z2V0RGF0YShlbD86IEhUTUxFbGVtZW50KTogRGF0YSB8IERhdGFbXSB7XHJcblx0XHRcdFx0aWYgKCFlbCkgcmV0dXJuIHRoaXMuZW50cmllcy5tYXAoZSA9PiB0aGlzLmdldERhdGEoZSkpO1xyXG5cdFx0XHRcdGxldCBkYXRhID0gdGhpcy5lbnRyeURhdGFzLmdldChlbCk7XHJcblx0XHRcdFx0aWYgKCFkYXRhKSB7XHJcblx0XHRcdFx0XHRkYXRhID0gdGhpcy5wYXJzZUVudHJ5KGVsKTtcclxuXHRcdFx0XHRcdHRoaXMuZW50cnlEYXRhcy5zZXQoZWwsIGRhdGEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dXBkYXRlUGVuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRyZXBhcnNlUGVuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRyZXF1ZXN0VXBkYXRlKHJlcGFyc2UgPSBmYWxzZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLnVwZGF0ZVBlbmRpbmcpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLnVwZGF0ZVBlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGlmIChyZXBhcnNlKSB0aGlzLnJlcGFyc2VQZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlKCkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwYXJzZXJzOiBQYXJzZXJGbjxEYXRhPltdID0gW107XHJcblx0XHRcdHdyaXRlRGF0YUF0dHJpYnV0ZSA9IGZhbHNlO1xyXG5cdFx0XHRhZGRQYXJzZXIocGFyc2VyOiBQYXJzZXJGbjxEYXRhPikge1xyXG5cdFx0XHRcdHRoaXMucGFyc2Vycy5wdXNoKHBhcnNlcik7XHJcblx0XHRcdFx0dGhpcy5yZXF1ZXN0VXBkYXRlKHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHJlcGFyc2VFbnRyaWVzKGVudHJpZXMgPSB0aGlzLmVudHJpZXMpOiBEYXRhW10ge1xyXG5cdFx0XHQvLyBcdC8vIHByZXBhcnNlXHJcblx0XHRcdC8vIFx0bGV0IHBhcmVudHMgPSBuZXcgU2V0KGVudHJpZXMubWFwKGU9PmUucGFyZW50RWxlbWVudCkpO1xyXG5cdFx0XHQvLyBcdGZvciAobGV0IHBhcmVudCBvZiBwYXJlbnRzKSB7XHJcblx0XHRcdC8vIFx0XHRwYXJlbnQuY2xhc3NMaXN0LmFkZCgnZWYtZW50cnktY29udGFpbmVyJyk7XHJcblx0XHRcdC8vIFx0fVxyXG5cdFx0XHQvLyBcdGZvciAobGV0IGUgb2YgZW50cmllcykge1xyXG5cdFx0XHQvLyBcdFx0ZS5jbGFzc0xpc3QuYWRkKCdlZi1lbnRyeScpO1xyXG5cdFx0XHQvLyBcdH1cclxuXHJcblx0XHRcdC8vIFx0bGV0IGRhdGFzID1cclxuXHRcdFx0Ly8gXHRmb3IgKGxldCBwYXJzZXIgb2YgdGhpcy5wYXJzZXJzKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIFx0cmV0dXJuIDAgYXMgYW55O1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdHBhcnNlRW50cnkoZWw6IEhUTUxFbGVtZW50KTogRGF0YSB7XHJcblx0XHRcdFx0ZWwucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlZi1lbnRyeS1jb250YWluZXInKTtcclxuXHRcdFx0XHRlbC5jbGFzc0xpc3QuYWRkKCdlZi1lbnRyeScpO1xyXG5cclxuXHRcdFx0XHRsZXQgZGF0YTogRGF0YSA9IHt9IGFzIERhdGE7XHJcblx0XHRcdFx0Zm9yIChsZXQgcGFyc2VyIG9mIHRoaXMucGFyc2Vycykge1xyXG5cdFx0XHRcdFx0bGV0IG5ld0RhdGEgPSBwYXJzZXIoZWwsIGRhdGEpO1xyXG5cdFx0XHRcdFx0aWYgKCFuZXdEYXRhIHx8IG5ld0RhdGEgPT0gZGF0YSkgY29udGludWU7XHJcblx0XHRcdFx0XHRpZiAoIUlzUHJvbWlzZShuZXdEYXRhKSkge1xyXG5cdFx0XHRcdFx0XHRPYmplY3QuYXNzaWduKGRhdGEsIG5ld0RhdGEpO1xyXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld0RhdGEudGhlbihwTmV3RGF0YSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmIChwTmV3RGF0YSAmJiBwTmV3RGF0YSAhPSBkYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0T2JqZWN0LmFzc2lnbihkYXRhLCBwTmV3RGF0YSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dGhpcy5yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy53cml0ZURhdGFBdHRyaWJ1dGUpIHtcclxuXHRcdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSgnZWYtZGF0YScsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFkZEl0ZW08SVQsIFQgZXh0ZW5kcyBJVCwgSVMgZXh0ZW5kcyBGaWx0ZXJlckl0ZW1QYXJ0aWFsLCBTLCBUUyBleHRlbmRzIFMgJiBJUyAmIEZpbHRlcmVySXRlbVNvdXJjZT4oY29uc3RydWN0b3I6IHsgbmV3KGRhdGE6IFRTKTogVCB9LCBsaXN0OiBJVFtdLCBkYXRhOiBJUywgc291cmNlOiBTKTogVCB7XHJcblx0XHRcdFx0T2JqZWN0LmFzc2lnbihkYXRhLCBzb3VyY2UsIHsgcGFyZW50OiB0aGlzIH0pO1xyXG5cdFx0XHRcdGRhdGEubmFtZSA/Pz0gZGF0YS5pZDtcclxuXHRcdFx0XHRsZXQgaXRlbSA9IG5ldyBjb25zdHJ1Y3RvcihkYXRhIGFzIFRTKTtcclxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZpbHRlcnM6IElGaWx0ZXI8RGF0YT5bXSA9IFtdO1xyXG5cdFx0XHRzb3J0ZXJzOiBJU29ydGVyPERhdGE+W10gPSBbXTtcclxuXHRcdFx0bW9kaWZpZXJzOiBJTW9kaWZpZXI8RGF0YT5bXSA9IFtdO1xyXG5cclxuXHRcdFx0Z2V0IGJ5TmFtZSgpIHtcclxuXHRcdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihcclxuXHRcdFx0XHRcdE9iamVjdC5mcm9tRW50cmllcyh0aGlzLmZpbHRlcnMubWFwKGUgPT4gW2UuaWQsIGVdKSksXHJcblx0XHRcdFx0XHRPYmplY3QuZnJvbUVudHJpZXModGhpcy5zb3J0ZXJzLm1hcChlID0+IFtlLmlkLCBlXSkpLFxyXG5cdFx0XHRcdFx0T2JqZWN0LmZyb21FbnRyaWVzKHRoaXMubW9kaWZpZXJzLm1hcChlID0+IFtlLmlkLCBlXSkpLFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRmaWx0ZXJzOiBPYmplY3QuZnJvbUVudHJpZXModGhpcy5maWx0ZXJzLm1hcChlID0+IFtlLmlkLCBlXSkpLFxyXG5cdFx0XHRcdFx0XHRzb3J0ZXJzOiBPYmplY3QuZnJvbUVudHJpZXModGhpcy5zb3J0ZXJzLm1hcChlID0+IFtlLmlkLCBlXSkpLFxyXG5cdFx0XHRcdFx0XHRtb2RpZmllcnM6IE9iamVjdC5mcm9tRW50cmllcyh0aGlzLm1vZGlmaWVycy5tYXAoZSA9PiBbZS5pZCwgZV0pKSxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YWRkRmlsdGVyKGlkOiBzdHJpbmcsIGZpbHRlcjogRmlsdGVyRm48RGF0YT4sIGRhdGE6IEZpbHRlclBhcnRpYWw8RGF0YT4gPSB7fSk6IEZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShGaWx0ZXIsIHRoaXMuZmlsdGVycywgZGF0YSwgeyBpZCwgZmlsdGVyIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZFZGaWx0ZXI8ViBleHRlbmRzIG51bWJlciB8IHN0cmluZz4oaWQ6IHN0cmluZywgZmlsdGVyOiBWYWx1ZUZpbHRlckZuPERhdGEsIFY+LCBkYXRhOiBWYWx1ZUZpbHRlclBhcnRpYWw8RGF0YSwgVj4pOiBWYWx1ZUZpbHRlcjxEYXRhLCBWPjtcclxuXHRcdFx0YWRkVkZpbHRlcjxWIGV4dGVuZHMgbnVtYmVyIHwgc3RyaW5nPihpZDogc3RyaW5nLCBmaWx0ZXI6IFZhbHVlRmlsdGVyRm48RGF0YSwgVj4sIGRhdGE6IFYpO1xyXG5cdFx0XHRhZGRWRmlsdGVyPFYgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+KGlkOiBzdHJpbmcsIGZpbHRlcjogVmFsdWVGaWx0ZXJGbjxEYXRhLCBWPiwgZGF0YTogVmFsdWVGaWx0ZXJQYXJ0aWFsPERhdGEsIFY+IHwgVikge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgZGF0YSAhPSAnb2JqZWN0JyB8fCAhZGF0YSkge1xyXG5cdFx0XHRcdFx0ZGF0YSA9IHsgaW5wdXQ6IGRhdGEgYXMgViB9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKFZhbHVlRmlsdGVyLCB0aGlzLmZpbHRlcnMsIGRhdGEsIHsgaWQsIGZpbHRlciB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRNRmlsdGVyKGlkOiBzdHJpbmcsIHZhbHVlOiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmcsIGRhdGE6IE1hdGNoRmlsdGVyU291cmNlPERhdGE+KSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShNYXRjaEZpbHRlciwgdGhpcy5maWx0ZXJzLCBkYXRhLCB7IGlkLCB2YWx1ZSB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRUYWdGaWx0ZXIoaWQ6IHN0cmluZywgZGF0YTogVGFnRmlsdGVyU291cmNlPERhdGE+KSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShUYWdGaWx0ZXIsIHRoaXMuZmlsdGVycywgZGF0YSwgeyBpZCB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRTb3J0ZXI8ViBleHRlbmRzIG51bWJlciB8IHN0cmluZz4oaWQ6IHN0cmluZywgc29ydGVyOiBTb3J0ZXJGbjxEYXRhLCBWPiwgZGF0YTogU29ydGVyUGFydGlhbFNvdXJjZTxEYXRhLCBWPiA9IHt9KTogU29ydGVyPERhdGEsIFY+IHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKFNvcnRlciwgdGhpcy5zb3J0ZXJzLCBkYXRhLCB7IGlkLCBzb3J0ZXIgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkTW9kaWZpZXIoaWQ6IHN0cmluZywgbW9kaWZpZXI6IE1vZGlmaWVyRm48RGF0YT4sIGRhdGE6IE1vZGlmaWVyUGFydGlhbDxEYXRhPiA9IHt9KTogTW9kaWZpZXI8RGF0YT4ge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oTW9kaWZpZXIsIHRoaXMubW9kaWZpZXJzLCBkYXRhLCB7IGlkLCBtb2RpZmllciB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRQcmVmaXgoaWQ6IHN0cmluZywgcHJlZml4OiBQcmVmaXhlckZuPERhdGE+LCBkYXRhOiBQcmVmaXhlclBhcnRpYWw8RGF0YT4gPSB7fSk6IFByZWZpeGVyPERhdGE+IHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKFByZWZpeGVyLCB0aGlzLm1vZGlmaWVycywgZGF0YSwgeyBpZCwgcHJlZml4IH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZFBhZ2luYXRpb25JbmZvKGlkOiBzdHJpbmcgPSAncGdpbmZvJywgZGF0YTogUGFydGlhbDxGaWx0ZXJlckl0ZW1Tb3VyY2U+ID0ge30pIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKFBhZ2luYXRpb25JbmZvRmlsdGVyLCB0aGlzLmZpbHRlcnMsIGRhdGEsIHsgaWQgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZpbHRlckVudHJpZXMoKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgZWwgb2YgdGhpcy5lbnRyaWVzKSB7XHJcblx0XHRcdFx0XHRsZXQgZGF0YSA9IHRoaXMuZ2V0RGF0YShlbCk7XHJcblx0XHRcdFx0XHRsZXQgdmFsdWUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZmlsdGVyIG9mIHRoaXMuZmlsdGVycykge1xyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlICYmIGZpbHRlci5hcHBseShkYXRhLCBlbCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbC5jbGFzc0xpc3QudG9nZ2xlKCdlZi1maWx0ZXJlZC1vdXQnLCAhdmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0X3ByZXZpb3VzU3RhdGUgPSB7XHJcblx0XHRcdFx0YWxsU29ydGVyc09mZjogdHJ1ZSxcclxuXHRcdFx0XHR1cGRhdGVEdXJhdGlvbjogMCxcclxuXHRcdFx0XHRmaW5pc2hlZEF0OiAwLFxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0b3JkZXJlZEVudHJpZXM6IEhUTUxFbGVtZW50W10gPSBbXTtcclxuXHRcdFx0b3JkZXJNb2RlOiAnY3NzJyB8ICdzd2FwJyA9ICdjc3MnO1xyXG5cdFx0XHRzb3J0RW50cmllcygpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5lbnRyaWVzLmxlbmd0aCA8PSAxKSByZXR1cm47XHJcblx0XHRcdFx0aWYgKHRoaXMub3JkZXJlZEVudHJpZXMubGVuZ3RoID09IDApIHRoaXMub3JkZXJlZEVudHJpZXMgPSB0aGlzLmVudHJpZXM7XHJcblx0XHRcdFx0aWYgKHRoaXMuc29ydGVycy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRsZXQgZW50cmllcyA9IHRoaXMuZW50cmllcztcclxuXHRcdFx0XHRsZXQgcGFpcnM6IFtEYXRhLCBIVE1MRWxlbWVudF1bXSA9IGVudHJpZXMubWFwKGUgPT4gW3RoaXMuZ2V0RGF0YShlKSwgZV0pO1xyXG5cdFx0XHRcdGxldCBhbGxPZmYgPSB0cnVlO1xyXG5cdFx0XHRcdGZvciAobGV0IHNvcnRlciBvZiB0aGlzLnNvcnRlcnMpIHtcclxuXHRcdFx0XHRcdGlmIChzb3J0ZXIubW9kZSAhPSAnb2ZmJykge1xyXG5cdFx0XHRcdFx0XHRwYWlycyA9IHNvcnRlci5zb3J0KHBhaXJzKTtcclxuXHRcdFx0XHRcdFx0YWxsT2ZmID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVudHJpZXMgPSBwYWlycy5tYXAoZSA9PiBlWzFdKTtcclxuXHRcdFx0XHRpZiAodGhpcy5vcmRlck1vZGUgPT0gJ3N3YXAnKSB7XHJcblx0XHRcdFx0XHRpZiAoIWVudHJpZXMuZXZlcnkoKGUsIGkpID0+IGUgPT0gdGhpcy5vcmRlcmVkRW50cmllc1tpXSkpIHtcclxuXHRcdFx0XHRcdFx0bGV0IGJyID0gZWxtKGAke2VudHJpZXNbMF0/LnRhZ05hbWV9LmVmLWJlZm9yZS1zb3J0W2hpZGRlbl1gKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5vcmRlcmVkRW50cmllc1swXS5iZWZvcmUoYnIpO1xyXG5cdFx0XHRcdFx0XHRici5hZnRlciguLi5lbnRyaWVzKTtcclxuXHRcdFx0XHRcdFx0YnIucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChhbGxPZmYgIT0gdGhpcy5fcHJldmlvdXNTdGF0ZS5hbGxTb3J0ZXJzT2ZmKSB7XHJcblx0XHRcdFx0XHRcdGVudHJpZXMubWFwKChlLCBpKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGFsbE9mZikge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZS5jbGFzc0xpc3QucmVtb3ZlKCdlZi1yZW9yZGVyJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRlLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZWYtcmVvcmRlci1jb250YWluZXInKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gdXNlIGBmbGV4YCBvciBgZ3JpZGAgY29udGFpbmVyIGFuZCBgb3JkZXI6dmFyKC0tZWYtb3JkZXIpYCBmb3IgY2hpbGRyZW4gXHJcblx0XHRcdFx0XHRcdFx0XHRlLmNsYXNzTGlzdC5hZGQoJ2VmLXJlb3JkZXInKTtcclxuXHRcdFx0XHRcdFx0XHRcdGUucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlZi1yZW9yZGVyLWNvbnRhaW5lcicpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIWFsbE9mZikge1xyXG5cdFx0XHRcdFx0XHRlbnRyaWVzLm1hcCgoZSwgaSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGUuc3R5bGUuc2V0UHJvcGVydHkoJy0tZWYtb3JkZXInLCBpICsgJycpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5vcmRlcmVkRW50cmllcyA9IGVudHJpZXM7XHJcblx0XHRcdFx0dGhpcy5fcHJldmlvdXNTdGF0ZS5hbGxTb3J0ZXJzT2ZmID0gYWxsT2ZmO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtb2RpZnlFbnRyaWVzKCkge1xyXG5cdFx0XHRcdGxldCBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xyXG5cdFx0XHRcdGxldCBwYWlyczogW0hUTUxFbGVtZW50LCBEYXRhXVtdID0gZW50cmllcy5tYXAoZSA9PiBbZSwgdGhpcy5nZXREYXRhKGUpXSk7XHJcblx0XHRcdFx0Zm9yIChsZXQgbW9kaWZpZXIgb2YgdGhpcy5tb2RpZmllcnMpIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IFtlLCBkXSBvZiBwYWlycykge1xyXG5cdFx0XHRcdFx0XHRtb2RpZmllci5hcHBseShkLCBlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG1vdmVUb1RvcChpdGVtOiBJU29ydGVyPERhdGE+IHwgSU1vZGlmaWVyPERhdGE+KSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuc29ydGVycy5pbmNsdWRlcyhpdGVtIGFzIElTb3J0ZXI8RGF0YT4pKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNvcnRlcnMuc3BsaWNlKHRoaXMuc29ydGVycy5pbmRleE9mKGl0ZW0gYXMgSVNvcnRlcjxEYXRhPiksIDEpO1xyXG5cdFx0XHRcdFx0dGhpcy5zb3J0ZXJzLnB1c2goaXRlbSBhcyBJU29ydGVyPERhdGE+KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kaWZpZXJzLmluY2x1ZGVzKGl0ZW0gYXMgSU1vZGlmaWVyPERhdGE+KSkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb2RpZmllcnMuc3BsaWNlKHRoaXMubW9kaWZpZXJzLmluZGV4T2YoaXRlbSBhcyBJTW9kaWZpZXI8RGF0YT4pLCAxKTtcclxuXHRcdFx0XHRcdHRoaXMubW9kaWZpZXJzLnB1c2goaXRlbSBhcyBJTW9kaWZpZXI8RGF0YT4pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZmluZEVudHJpZXMoKTogSFRNTEVsZW1lbnRbXSB7XHJcblx0XHRcdFx0cmV0dXJuIHR5cGVvZiB0aGlzLmVudHJ5U2VsZWN0b3IgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZW50cnlTZWxlY3RvcigpIDogcXEodGhpcy5lbnRyeVNlbGVjdG9yKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0X2VhcmxpZXN0VXBkYXRlID0gMDtcclxuXHRcdFx0dXBkYXRlKHJlcGFyc2UgPSB0aGlzLnJlcGFyc2VQZW5kaW5nKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZGlzYWJsZWQgPT0gdHJ1ZSkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRsZXQgZWFybGllc3RVcGRhdGUgPSB0aGlzLl9wcmV2aW91c1N0YXRlLmZpbmlzaGVkQXQgKyBNYXRoLm1pbigxMDAwMCwgOCAqIHRoaXMuX3ByZXZpb3VzU3RhdGUudXBkYXRlRHVyYXRpb24pO1xyXG5cdFx0XHRcdGlmIChwZXJmb3JtYW5jZS5ub3coKSA8IGVhcmxpZXN0VXBkYXRlKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5fZWFybGllc3RVcGRhdGUgIT0gZWFybGllc3RVcGRhdGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5fZWFybGllc3RVcGRhdGUgPSBlYXJsaWVzdFVwZGF0ZTtcclxuXHRcdFx0XHRcdFx0aWYgKFBvb3BKcy5kZWJ1Zykge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBFRjogdXBkYXRlIGRlbGF5ZWQgYnkgJHt+fihwZXJmb3JtYW5jZS5ub3coKSAtIGVhcmxpZXN0VXBkYXRlKX1tcyAkeycnXHJcblx0XHRcdFx0XHRcdFx0XHR9IChsYXN0IHVwZGF0ZSBkdXJhdGlvbjogJHt0aGlzLl9wcmV2aW91c1N0YXRlLnVwZGF0ZUR1cmF0aW9ufSlgKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy51cGRhdGVQZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy51cGRhdGVQZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0bGV0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuXHRcdFx0XHRsZXQgZW50cmllcyA9IHRoaXMuZmluZEVudHJpZXMoKTtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuZGlzYWJsZWQgPT0gJ3NvZnQnKSB7XHJcblx0XHRcdFx0XHRpZiAoIWVudHJpZXMubGVuZ3RoKSByZXR1cm47XHJcblx0XHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYEVmIHNvZnQtZW5hYmxlZDogeDA9Pngke2VudHJpZXMubGVuZ3RofWAsIHRoaXMuZW50cnlTZWxlY3RvciwgdGhpcyk7XHJcblx0XHRcdFx0XHR0aGlzLmVuYWJsZSgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5kaXNhYmxlZCAhPSBmYWxzZSkgdGhyb3cgMDtcclxuXHJcblx0XHRcdFx0aWYgKCFlbnRyaWVzLmxlbmd0aCAmJiB0aGlzLnNvZnREaXNhYmxlKSB7XHJcblx0XHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYEVmIHNvZnQtZGlzYWJsZWQ6IHgke3RoaXMuZW5hYmxlLmxlbmd0aH09PngwYCwgdGhpcy5lbnRyeVNlbGVjdG9yLCB0aGlzKTtcclxuXHRcdFx0XHRcdHRoaXMuZGlzYWJsZSgnc29mdCcpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHJlcGFyc2UpIHtcclxuXHRcdFx0XHRcdHRoaXMuZW50cnlEYXRhcyA9IG5ldyBNYXBUeXBlKCk7XHJcblx0XHRcdFx0XHR0aGlzLnJlcGFyc2VQZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICghdGhpcy5jb250YWluZXIuY2xvc2VzdCgnYm9keScpKSB7XHJcblx0XHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRUbygnYm9keScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5lbnRyaWVzLmxlbmd0aCAhPSBlbnRyaWVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBFZiB1cGRhdGU6IHgke3RoaXMuZW50cmllcy5sZW5ndGh9PT54JHtlbnRyaWVzLmxlbmd0aH1gLCB0aGlzLmVudHJ5U2VsZWN0b3IsIHRoaXMpO1xyXG5cdFx0XHRcdFx0Ly8gfHwgdGhpcy5lbnRyaWVzXHJcblx0XHRcdFx0XHQvLyBUT0RPOiBzb3J0IGVudHJpZXMgaW4gaW5pdGlhbCBvcmRlclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmVudHJpZXMgPSBlbnRyaWVzO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyRW50cmllcygpO1xyXG5cdFx0XHRcdHRoaXMuc29ydEVudHJpZXMoKTtcclxuXHRcdFx0XHR0aGlzLm1vZGlmeUVudHJpZXMoKTtcclxuXHRcdFx0XHRsZXQgdGltZVVzZWQgPSBwZXJmb3JtYW5jZS5ub3coKSAtIG5vdztcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgRUY6IHVwZGF0ZSB0b29rICR7fn50aW1lVXNlZH1tc2ApO1xyXG5cdFx0XHRcdHRoaXMuX3ByZXZpb3VzU3RhdGUudXBkYXRlRHVyYXRpb24gPSAxMDAwMDtcclxuXHRcdFx0XHR0aGlzLl9wcmV2aW91c1N0YXRlLmZpbmlzaGVkQXQgPSBwZXJmb3JtYW5jZS5ub3coKSArIDEwMDAwO1xyXG5cdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcblx0XHRcdFx0XHRsZXQgZHQgPSB0aGlzLl9wcmV2aW91c1N0YXRlLnVwZGF0ZUR1cmF0aW9uID0gcGVyZm9ybWFuY2Uubm93KCkgLSBub3c7XHJcblx0XHRcdFx0XHR0aGlzLl9wcmV2aW91c1N0YXRlLmZpbmlzaGVkQXQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0b2ZmSW5jb21wYXRpYmxlKGluY29tcGF0aWJsZTogc3RyaW5nW10pIHtcclxuXHRcdFx0XHRmb3IgKGxldCBmaWx0ZXIgb2YgdGhpcy5maWx0ZXJzKSB7XHJcblx0XHRcdFx0XHRpZiAoaW5jb21wYXRpYmxlLmluY2x1ZGVzKGZpbHRlci5pZCkpIHtcclxuXHRcdFx0XHRcdFx0ZmlsdGVyLnRvZ2dsZU1vZGUoJ29mZicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmb3IgKGxldCBzb3J0ZXIgb2YgdGhpcy5zb3J0ZXJzKSB7XHJcblx0XHRcdFx0XHRpZiAoaW5jb21wYXRpYmxlLmluY2x1ZGVzKHNvcnRlci5pZCkpIHtcclxuXHRcdFx0XHRcdFx0c29ydGVyLnRvZ2dsZU1vZGUoJ29mZicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmb3IgKGxldCBtb2RpZmllciBvZiB0aGlzLm1vZGlmaWVycykge1xyXG5cdFx0XHRcdFx0aWYgKGluY29tcGF0aWJsZS5pbmNsdWRlcyhtb2RpZmllci5pZCkpIHtcclxuXHRcdFx0XHRcdFx0bW9kaWZpZXIudG9nZ2xlTW9kZSgnb2ZmJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzdHlsZShzID0gJycpIHtcclxuXHRcdFx0XHRFbnRyeUZpbHRlcmVyLnN0eWxlKHMpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0YXRpYyBzdHlsZShzID0gJycpIHtcclxuXHRcdFx0XHRsZXQgc3R5bGUgPSBxKCdzdHlsZS5lZi1zdHlsZScpIHx8IGVsbSgnc3R5bGUuZWYtc3R5bGUnKS5hcHBlbmRUbygnaGVhZCcpO1xyXG5cdFx0XHRcdHN0eWxlLmlubmVySFRNTCA9IGBcclxuXHRcdFx0XHRcdC5lZi1jb250YWluZXIge1xyXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xyXG5cdFx0XHRcdFx0XHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogZml4ZWQ7XHJcblx0XHRcdFx0XHRcdHRvcDogMDtcclxuXHRcdFx0XHRcdFx0cmlnaHQ6IDA7XHJcblx0XHRcdFx0XHRcdHotaW5kZXg6IDk5OTk5OTk5OTk5OTk5OTk5OTk7XHJcblx0XHRcdFx0XHRcdG1pbi13aWR0aDogMTAwcHg7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQuZWYtZW50cnkge31cclxuXHJcblx0XHRcdFx0XHQuZWYtZmlsdGVyZWQtb3V0IHtcclxuXHRcdFx0XHRcdFx0ZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGJ1dHRvbi5lZi1pdGVtIHt9XHJcblx0XHRcdFx0XHRidXR0b24uZWYtaXRlbVtlZi1tb2RlPVwib2ZmXCJdIHtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZDogbGlnaHRncmF5O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnV0dG9uLmVmLWl0ZW1bZWYtbW9kZT1cIm9uXCJdIHtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZDogbGlnaHRncmVlbjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJ1dHRvbi5lZi1pdGVtW2VmLW1vZGU9XCJvcHBvc2l0ZVwiXSB7XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IHllbGxvdztcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRidXR0b24uZWYtaXRlbS5lZi1maWx0ZXIgPiBpbnB1dCB7XHJcblx0XHRcdFx0XHRcdGZsb2F0OiByaWdodDtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRbZWYtcHJlZml4XTo6YmVmb3JlIHtcclxuXHRcdFx0XHRcdFx0Y29udGVudDogYXR0cihlZi1wcmVmaXgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0W2VmLXBvc3RmaXhdOjphZnRlciB7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQ6IGF0dHIoZWYtcG9zdGZpeCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRgICsgcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c29mdERpc2FibGUgPSB0cnVlO1xyXG5cdFx0XHRkaXNhYmxlZDogYm9vbGVhbiB8ICdzb2Z0JyA9IGZhbHNlO1xyXG5cdFx0XHRkaXNhYmxlKHNvZnQ/OiAnc29mdCcpIHtcclxuXHRcdFx0XHR0aGlzLmRpc2FibGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAoc29mdCA9PSAnc29mdCcpIHRoaXMuZGlzYWJsZWQgPSAnc29mdCc7XHJcblx0XHRcdFx0dGhpcy5jb250YWluZXIucmVtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZW5hYmxlKCkge1xyXG5cdFx0XHRcdHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLnVwZGF0ZVBlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLnJlcXVlc3RVcGRhdGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2xlYXIoKSB7XHJcblx0XHRcdFx0dGhpcy5lbnRyeURhdGFzID0gbmV3IE1hcFR5cGUoKTtcclxuXHRcdFx0XHR0aGlzLnBhcnNlcnMuc3BsaWNlKDAsIDk5OSk7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJzLnNwbGljZSgwLCA5OTkpLm1hcChlID0+IGUucmVtb3ZlKCkpO1xyXG5cdFx0XHRcdHRoaXMuc29ydGVycy5zcGxpY2UoMCwgOTk5KS5tYXAoZSA9PiBlLnJlbW92ZSgpKTtcclxuXHRcdFx0XHR0aGlzLm1vZGlmaWVycy5zcGxpY2UoMCwgOTk5KS5tYXAoZSA9PiBlLnJlbW92ZSgpKTtcclxuXHRcdFx0XHR0aGlzLmVuYWJsZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRnZXQgX2RhdGFzKCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmVudHJpZXNcclxuXHRcdFx0XHRcdC5maWx0ZXIoZSA9PiAhZS5jbGFzc0xpc3QuY29udGFpbnMoJ2VmLWZpbHRlcmVkLW91dCcpKVxyXG5cdFx0XHRcdFx0Lm1hcChlID0+IHRoaXMuZ2V0RGF0YShlKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gSXNQcm9taXNlPFQ+KHA6IFByb21pc2VMaWtlPFQ+IHwgVCk6IHAgaXMgUHJvbWlzZUxpa2U8VD4ge1xyXG5cdFx0XHRpZiAoIXApIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIHR5cGVvZiAocCBhcyBQcm9taXNlTGlrZTxUPikudGhlbiA9PSAnZnVuY3Rpb24nO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBjbGFzcyBPYnNlcnZlciB7XHJcblx0XHRcclxuXHR9XHJcbn1cclxuXHJcbi8qXHJcblxyXG5mdW5jdGlvbiBvYnNlcnZlQ2xhc3NBZGQoY2xzLCBjYikge1xyXG5cdGxldCBxdWV1ZWQgPSBmYWxzZTtcclxuXHRhc3luYyBmdW5jdGlvbiBydW4oKSB7XHJcblx0XHRpZiAocXVldWVkKSByZXR1cm47XHJcblx0XHRxdWV1ZWQgPSB0cnVlO1xyXG5cdFx0YXdhaXQgUHJvbWlzZS5mcmFtZSgpO1xyXG5cdFx0cXVldWVkID0gZmFsc2U7XHJcblx0XHRjYigpO1xyXG5cdH1cclxuXHRuZXcgTXV0YXRpb25PYnNlcnZlcihsaXN0ID0+IHtcclxuXHRcdGZvciAobGV0IG1yIG9mIGxpc3QpIHtcclxuXHRcdFx0aWYgKG1yLnR5cGUgPT0gJ2F0dHJpYnV0ZXMnICYmIG1yLmF0dHJpYnV0ZU5hbWUgPT0gJ2NsYXNzJykge1xyXG5cdFx0XHRcdGlmIChtci50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKGNscykpIHtcclxuXHRcdFx0XHRcdHJ1bigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAobXIudHlwZSA9PSAnY2hpbGRMaXN0Jykge1xyXG5cdFx0XHRcdGZvciAobGV0IGNoIG9mIG1yLmFkZGVkTm9kZXMpIHtcclxuXHRcdFx0XHRcdGlmIChjaC5jbGFzc0xpc3Q/LmNvbnRhaW5zKGNscykpIHtcclxuXHRcdFx0XHRcdFx0cnVuKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSkub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XHJcblx0XHRjaGlsZExpc3Q6IHRydWUsXHJcblx0XHRhdHRyaWJ1dGVzOiB0cnVlLFxyXG5cdFx0c3VidHJlZTogdHJ1ZSxcclxuXHR9KTtcclxufVxyXG5cclxuKi8iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBQYWdpbmF0ZUV4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IHR5cGUgUFJlcXVlc3RFdmVudCA9IEN1c3RvbUV2ZW50PHtcclxuXHRcdFx0cmVhc29uPzogS2V5Ym9hcmRFdmVudCB8IE1vdXNlRXZlbnQsXHJcblx0XHRcdGNvdW50OiBudW1iZXIsXHJcblx0XHRcdGNvbnN1bWVkOiBudW1iZXIsXHJcblx0XHRcdF9ldmVudD86ICdwYWdpbmF0aW9ucmVxdWVzdCcsXHJcblx0XHR9PjtcclxuXHRcdGV4cG9ydCB0eXBlIFBTdGFydEV2ZW50ID0gQ3VzdG9tRXZlbnQ8e1xyXG5cdFx0XHRwYWdpbmF0ZTogUGFnaW5hdGUsXHJcblx0XHRcdF9ldmVudD86ICdwYWdpbmF0aW9uc3RhcnQnLFxyXG5cdFx0fT47XHJcblx0XHRleHBvcnQgdHlwZSBQRW5kRXZlbnQgPSBDdXN0b21FdmVudDx7XHJcblx0XHRcdHBhZ2luYXRlOiBQYWdpbmF0ZSxcclxuXHRcdFx0X2V2ZW50PzogJ3BhZ2luYXRpb25lbmQnLFxyXG5cdFx0fT47XHJcblx0XHRleHBvcnQgdHlwZSBQTW9kaWZ5RXZlbnQgPSBDdXN0b21FdmVudDx7XHJcblx0XHRcdHBhZ2luYXRlOiBQYWdpbmF0ZSxcclxuXHRcdFx0YWRkZWQ6IEhUTUxFbGVtZW50W10sXHJcblx0XHRcdHJlbW92ZWQ6IEhUTUxFbGVtZW50W10sXHJcblx0XHRcdHNlbGVjdG9yOiBzZWxlY3RvcixcclxuXHRcdFx0X2V2ZW50PzogJ3BhZ2luYXRpb25tb2RpZnknLFxyXG5cdFx0fT47XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFBhZ2luYXRlIHtcclxuXHRcdFx0ZG9jOiBEb2N1bWVudDtcclxuXHJcblx0XHRcdGVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHRjb25kaXRpb246IHNlbGVjdG9yIHwgKCgpID0+IGJvb2xlYW4pO1xyXG5cdFx0XHRxdWV1ZWQgPSAwO1xyXG5cdFx0XHRydW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdF9pbml0ZWQgPSBmYWxzZTtcclxuXHRcdFx0c2hpZnRSZXF1ZXN0Q291bnQ/OiBudW1iZXIgfCAoKCkgPT4gbnVtYmVyKTtcclxuXHJcblx0XHRcdHN0YXRpYyBzaGlmdFJlcXVlc3RDb3VudCA9IDEwO1xyXG5cdFx0XHRzdGF0aWMgX2luaXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRzdGF0aWMgcmVtb3ZlRGVmYXVsdFJ1bkJpbmRpbmdzOiAoKSA9PiB2b2lkO1xyXG5cdFx0XHRzdGF0aWMgYWRkRGVmYXVsdFJ1bkJpbmRpbmdzKCkge1xyXG5cdFx0XHRcdFBhZ2luYXRlLnJlbW92ZURlZmF1bHRSdW5CaW5kaW5ncz8uKCk7XHJcblx0XHRcdFx0ZnVuY3Rpb24gb25tb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmIChldmVudC5idXR0b24gIT0gMSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0bGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBFbGVtZW50O1xyXG5cdFx0XHRcdFx0aWYgKHRhcmdldD8uY2xvc2VzdCgnYScpKSByZXR1cm47XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0bGV0IGNvdW50ID0gZXZlbnQuc2hpZnRLZXkgPyBQYWdpbmF0ZS5zaGlmdFJlcXVlc3RDb3VudCA6IDE7XHJcblx0XHRcdFx0XHRQYWdpbmF0ZS5yZXF1ZXN0UGFnaW5hdGlvbihjb3VudCwgZXZlbnQsIHRhcmdldCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZ1bmN0aW9uIG9ua2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0XHRcdFx0aWYgKGV2ZW50LmNvZGUgIT0gJ0FsdFJpZ2h0JykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdGxldCBjb3VudCA9IGV2ZW50LnNoaWZ0S2V5ID8gUGFnaW5hdGUuc2hpZnRSZXF1ZXN0Q291bnQgOiAxO1xyXG5cdFx0XHRcdFx0bGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBFbGVtZW50O1xyXG5cdFx0XHRcdFx0UGFnaW5hdGUucmVxdWVzdFBhZ2luYXRpb24oY291bnQsIGV2ZW50LCB0YXJnZXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbm1vdXNlZG93bik7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bik7XHJcblx0XHRcdFx0UGFnaW5hdGUucmVtb3ZlRGVmYXVsdFJ1bkJpbmRpbmdzID0gKCkgPT4ge1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25tb3VzZWRvd24pO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHN0YXRpYyBpbnN0YW5jZXM6IFBhZ2luYXRlW10gPSBbXTtcclxuXHJcblx0XHRcdC8vIGxpc3RlbmVyc1xyXG5cdFx0XHRpbml0KCkge1xyXG5cdFx0XHRcdGlmICghUGFnaW5hdGUucmVtb3ZlRGVmYXVsdFJ1bkJpbmRpbmdzKSB7XHJcblx0XHRcdFx0XHRQYWdpbmF0ZS5hZGREZWZhdWx0UnVuQmluZGluZ3MoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuX2luaXRlZCkgcmV0dXJuO1xyXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI8UFJlcXVlc3RFdmVudD4oJ3BhZ2luYXRpb25yZXF1ZXN0JywgdGhpcy5vblBhZ2luYXRpb25SZXF1ZXN0LmJpbmQodGhpcykpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI8UEVuZEV2ZW50PigncGFnaW5hdGlvbmVuZCcsIHRoaXMub25QYWdpbmF0aW9uRW5kLmJpbmQodGhpcykpO1xyXG5cdFx0XHRcdFBhZ2luYXRlLmluc3RhbmNlcy5wdXNoKHRoaXMpO1xyXG5cdFx0XHRcdGlmIChQb29wSnMuZGVidWcpIHtcclxuXHRcdFx0XHRcdGxldCBhY3RpdmUgPSB0aGlzLmNhbkNvbnN1bWVSZXF1ZXN0KCkgPyAnYWN0aXZlJyA6ICdpbmFjdGl2ZSc7XHJcblx0XHRcdFx0XHRpZiAoYWN0aXZlID09ICdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYFBhZ2luYXRlIGluc3RhbnRpYXRlZCAoJHthY3RpdmV9KTogYCwgdGhpcy5kYXRhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0b25QYWdpbmF0aW9uUmVxdWVzdChldmVudDogUFJlcXVlc3RFdmVudCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmNhbkNvbnN1bWVSZXF1ZXN0KCkpIHtcclxuXHRcdFx0XHRcdGV2ZW50LmRldGFpbC5jb25zdW1lZCsrO1xyXG5cdFx0XHRcdFx0bGV0IHF1ZXVlZCA9ICFldmVudC5kZXRhaWwucmVhc29uPy5zaGlmdEtleSA/IG51bGwgOiB0eXBlb2YgdGhpcy5zaGlmdFJlcXVlc3RDb3VudCA9PSAnZnVuY3Rpb24nID8gdGhpcy5zaGlmdFJlcXVlc3RDb3VudCgpIDogdGhpcy5zaGlmdFJlcXVlc3RDb3VudDtcclxuXHRcdFx0XHRcdHRoaXMucXVldWVkICs9IHF1ZXVlZCA/PyBldmVudC5kZXRhaWwuY291bnQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICghdGhpcy5ydW5uaW5nICYmIHRoaXMucXVldWVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLmNvbnN1bWVSZXF1ZXN0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRvblBhZ2luYXRpb25FbmQoZXZlbnQ6IFBFbmRFdmVudCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLnF1ZXVlZCAmJiB0aGlzLmNhbkNvbnN1bWVSZXF1ZXN0KCkpIHtcclxuXHRcdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5jYW5Db25zdW1lUmVxdWVzdCgpKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGB0aGlzIHBhZ2luYXRlIGNhbiBub3Qgd29yayBhbnltb3JlYCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5xdWV1ZWQgPSAwO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY29uc3VtZVJlcXVlc3QoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhbkNvbnN1bWVSZXF1ZXN0KCkge1xyXG5cdFx0XHRcdGlmICghdGhpcy5lbmFibGVkKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0aWYgKHRoaXMucnVubmluZykgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0aWYgKHRoaXMuY29uZGl0aW9uKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIHRoaXMuY29uZGl0aW9uID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmNvbmRpdGlvbigpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoIWRvY3VtZW50LnEodGhpcy5jb25kaXRpb24pKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzeW5jIGNvbnN1bWVSZXF1ZXN0KCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLnJ1bm5pbmcpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLnF1ZXVlZC0tO1xyXG5cdFx0XHRcdHRoaXMucnVubmluZyA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5lbWl0U3RhcnQoKTtcclxuXHRcdFx0XHRhd2FpdCB0aGlzLm9ucnVuPy4oKTtcclxuXHRcdFx0XHR0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmVtaXRFbmQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvbnJ1bjogKCkgPT4gUHJvbWlzZTx2b2lkPjtcclxuXHJcblxyXG5cdFx0XHQvLyBlbWl0dGVyc1xyXG5cdFx0XHRzdGF0aWMgcmVxdWVzdFBhZ2luYXRpb24oY291bnQgPSAxLCByZWFzb24/OiBQUmVxdWVzdEV2ZW50WydkZXRhaWwnXVsncmVhc29uJ10sIHRhcmdldDogRWxlbWVudCA9IGRvY3VtZW50LmJvZHkpIHtcclxuXHRcdFx0XHRsZXQgZGV0YWlsOiBQUmVxdWVzdEV2ZW50WydkZXRhaWwnXSA9IHsgY291bnQsIHJlYXNvbiwgY29uc3VtZWQ6IDAgfTtcclxuXHRcdFx0XHRmdW5jdGlvbiBmYWlsKGV2ZW50OiBQUmVxdWVzdEV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoZXZlbnQuZGV0YWlsLmNvbnN1bWVkID09IDApIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGBQYWdpbmF0aW9uIHJlcXVlc3QgZmFpbGVkOiBubyBsaXN0ZW5lcnNgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BhZ2luYXRpb25yZXF1ZXN0JywgZmFpbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ3BhZ2luYXRpb25yZXF1ZXN0JywgZmFpbCk7XHJcblx0XHRcdFx0dGFyZ2V0LmVtaXQ8UFJlcXVlc3RFdmVudD4oJ3BhZ2luYXRpb25yZXF1ZXN0JywgeyBjb3VudCwgcmVhc29uLCBjb25zdW1lZDogMCB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbWl0U3RhcnQoKSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5lbWl0PFBTdGFydEV2ZW50PigncGFnaW5hdGlvbnN0YXJ0JywgeyBwYWdpbmF0ZTogdGhpcyB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbWl0TW9kaWZ5KGFkZGVkLCByZW1vdmVkLCBzZWxlY3Rvcikge1xyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuZW1pdDxQTW9kaWZ5RXZlbnQ+KCdwYWdpbmF0aW9ubW9kaWZ5JywgeyBwYWdpbmF0ZTogdGhpcywgYWRkZWQsIHJlbW92ZWQsIHNlbGVjdG9yIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVtaXRFbmQoKSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5lbWl0PFBFbmRFdmVudD4oJ3BhZ2luYXRpb25lbmQnLCB7IHBhZ2luYXRlOiB0aGlzIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBmZXRjaGluZzogXHJcblx0XHRcdGFzeW5jIGZldGNoRG9jdW1lbnQobGluazogTGluaywgc3Bpbm5lciA9IHRydWUsIG1heEFnZTogZGVsdGFUaW1lID0gMCk6IFByb21pc2U8RG9jdW1lbnQ+IHtcclxuXHRcdFx0XHR0aGlzLmRvYyA9IG51bGw7XHJcblx0XHRcdFx0bGV0IGEgPSBzcGlubmVyICYmIFBhZ2luYXRlLmxpbmtUb0FuY2hvcihsaW5rKTtcclxuXHRcdFx0XHRhPy5jbGFzc0xpc3QuYWRkKCdwYWdpbmF0ZS1zcGluJyk7XHJcblx0XHRcdFx0bGluayA9IFBhZ2luYXRlLmxpbmtUb1VybChsaW5rKTtcclxuXHRcdFx0XHRsZXQgaW5pdCA9IHsgbWF4QWdlLCB4bWw6IHRoaXMuZGF0YS54bWwgfTtcclxuXHRcdFx0XHR0aGlzLmRvYyA9ICFtYXhBZ2UgPyBhd2FpdCBmZXRjaC5kb2MobGluaywgaW5pdCkgOiBhd2FpdCBmZXRjaC5jYWNoZWQuZG9jKGxpbmssIGluaXQpO1xyXG5cdFx0XHRcdGE/LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2luYXRlLXNwaW4nKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kb2M7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0YXRpYyBwcmVmZXRjaChzb3VyY2U6IHNlbGVjdG9yKSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQucXE8J2EnPihzb3VyY2UpLm1hcChlID0+IHtcclxuXHRcdFx0XHRcdGlmIChlLmhyZWYpIHtcclxuXHRcdFx0XHRcdFx0ZWxtKGBsaW5rW3JlbD1cInByZWZldGNoXCJdW2hyZWY9XCIke2UuaHJlZn1cIl1gKS5hcHBlbmRUbygnaGVhZCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gVE9ETzogaWYgZS5zcmNcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdC8vIG1vZGlmaWNhdGlvbjogXHJcblx0XHRcdGFmdGVyKHNvdXJjZTogc2VsZWN0b3IsIHRhcmdldDogc2VsZWN0b3IgPSBzb3VyY2UpIHtcclxuXHRcdFx0XHRsZXQgYWRkZWQgPSB0aGlzLmRvYy5xcShzb3VyY2UpO1xyXG5cdFx0XHRcdGlmICghYWRkZWQubGVuZ3RoKSByZXR1cm47XHJcblx0XHRcdFx0bGV0IGZvdW5kID0gZG9jdW1lbnQucXEodGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoZm91bmQubGVuZ3RoID09IDApIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgd2hlcmUgdG8gYXBwZW5kYCk7XHJcblx0XHRcdFx0Zm91bmQucG9wKCkuYWZ0ZXIoLi4uYWRkZWQpO1xyXG5cdFx0XHRcdHRoaXMuZW1pdE1vZGlmeShhZGRlZCwgW10sIHNvdXJjZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVwbGFjZUVhY2goc291cmNlOiBzZWxlY3RvciwgdGFyZ2V0OiBzZWxlY3RvciA9IHNvdXJjZSkge1xyXG5cdFx0XHRcdGxldCBhZGRlZCA9IHRoaXMuZG9jLnFxKHNvdXJjZSk7XHJcblx0XHRcdFx0bGV0IHJlbW92ZWQgPSBkb2N1bWVudC5xcSh0YXJnZXQpO1xyXG5cdFx0XHRcdGlmIChhZGRlZC5sZW5ndGggIT0gcmVtb3ZlZC5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihgYWRkZWQvcmVtb3ZlZCBjb3VudCBtaXNtYXRjaGApO1xyXG5cdFx0XHRcdHJlbW92ZWQubWFwKChlLCBpKSA9PiBlLnJlcGxhY2VXaXRoKGFkZGVkW2ldKSk7XHJcblx0XHRcdFx0dGhpcy5lbWl0TW9kaWZ5KGFkZGVkLCByZW1vdmVkLCBzb3VyY2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlcGxhY2Uoc291cmNlOiBzZWxlY3RvciwgdGFyZ2V0OiBzZWxlY3RvciA9IHNvdXJjZSkge1xyXG5cdFx0XHRcdGxldCBhZGRlZCA9IHRoaXMuZG9jLnFxKHNvdXJjZSk7XHJcblx0XHRcdFx0bGV0IHJlbW92ZWQgPSBkb2N1bWVudC5xcSh0YXJnZXQpO1xyXG5cdFx0XHRcdGlmIChhZGRlZC5sZW5ndGggIT0gcmVtb3ZlZC5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihgbm90IGltcGxlbWVudGVkYCk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVwbGFjZUVhY2goc291cmNlLCB0YXJnZXQpO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0Ly8gdXRpbFxyXG5cdFx0XHRzdGF0aWMgbGlua1RvVXJsKGxpbms6IExpbmspOiB1cmwge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgbGluayA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0aWYgKGxpbmsuc3RhcnRzV2l0aCgnaHR0cCcpKSByZXR1cm4gbGluayBhcyB1cmw7XHJcblx0XHRcdFx0XHRsaW5rID0gZG9jdW1lbnQucTwnYSc+KGxpbmspO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAobGluay50YWdOYW1lICE9ICdBJykgdGhyb3cgbmV3IEVycm9yKCdsaW5rIHNob3VsZCBiZSA8YT4gZWxlbWVudCEnKTtcclxuXHRcdFx0XHRyZXR1cm4gKGxpbmsgYXMgSFRNTEFuY2hvckVsZW1lbnQpLmhyZWYgYXMgdXJsO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0YXRpYyBsaW5rVG9BbmNob3IobGluazogTGluayk6IEhUTUxBbmNob3JFbGVtZW50IHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGxpbmsgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdGlmIChsaW5rLnN0YXJ0c1dpdGgoJ2h0dHAnKSkgcmV0dXJuIG51bGw7XHJcblx0XHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQucTwnYSc+KGxpbmspO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gbGluaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3RhdGljIHN0YXRpY0NhbGw8VD4odGhpczogdm9pZCwgZGF0YTogUGFyYW1ldGVyczxQYWdpbmF0ZVsnc3RhdGljQ2FsbCddPlswXSkge1xyXG5cdFx0XHRcdGxldCBwID0gbmV3IFBhZ2luYXRlKCk7XHJcblx0XHRcdFx0cC5zdGF0aWNDYWxsKGRhdGEpO1xyXG5cdFx0XHRcdHJldHVybiBwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyYXdEYXRhOiBhbnk7XHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRjb25kaXRpb246ICgpID0+IGJvb2xlYW47XHJcblx0XHRcdFx0cHJlZmV0Y2g6IGFueVtdO1xyXG5cdFx0XHRcdGRvYzogc2VsZWN0b3JbXTtcclxuXHRcdFx0XHRjbGljazogc2VsZWN0b3JbXTtcclxuXHRcdFx0XHRhZnRlcjogc2VsZWN0b3JbXTtcclxuXHRcdFx0XHRyZXBsYWNlOiBzZWxlY3RvcltdO1xyXG5cdFx0XHRcdG1heEFnZTogZGVsdGFUaW1lO1xyXG5cdFx0XHRcdHN0YXJ0PzogKHRoaXM6IFBhZ2luYXRlKSA9PiB2b2lkO1xyXG5cdFx0XHRcdG1vZGlmeT86ICh0aGlzOiBQYWdpbmF0ZSwgZG9jOiBEb2N1bWVudCkgPT4gdm9pZDtcclxuXHRcdFx0XHRlbmQ/OiAodGhpczogUGFnaW5hdGUsIGRvYzogRG9jdW1lbnQpID0+IHZvaWQ7XHJcblx0XHRcdFx0eG1sPzogYm9vbGVhbjtcclxuXHRcdFx0fTtcclxuXHRcdFx0c3RhdGljQ2FsbChkYXRhOiB7XHJcblx0XHRcdFx0Y29uZGl0aW9uPzogc2VsZWN0b3IgfCAoKCkgPT4gYm9vbGVhbiksXHJcblx0XHRcdFx0cHJlZmV0Y2g/OiBzZWxlY3RvciB8IHNlbGVjdG9yW10sXHJcblx0XHRcdFx0Y2xpY2s/OiBzZWxlY3RvciB8IHNlbGVjdG9yW10sXHJcblx0XHRcdFx0ZG9jPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdGFmdGVyPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdHJlcGxhY2U/OiBzZWxlY3RvciB8IHNlbGVjdG9yW10sXHJcblx0XHRcdFx0c3RhcnQ/OiAodGhpczogUGFnaW5hdGUpID0+IHZvaWQ7XHJcblx0XHRcdFx0bW9kaWZ5PzogKHRoaXM6IFBhZ2luYXRlLCBkb2M6IERvY3VtZW50KSA9PiB2b2lkO1xyXG5cdFx0XHRcdGVuZD86ICh0aGlzOiBQYWdpbmF0ZSwgZG9jOiBEb2N1bWVudCkgPT4gdm9pZDtcclxuXHRcdFx0XHRtYXhBZ2U/OiBkZWx0YVRpbWU7XHJcblx0XHRcdFx0Y2FjaGU/OiBkZWx0YVRpbWUgfCB0cnVlO1xyXG5cdFx0XHRcdHhtbD86IGJvb2xlYW47XHJcblx0XHRcdFx0cGFnZXI/OiBzZWxlY3RvciB8IHNlbGVjdG9yW107XHJcblx0XHRcdFx0c2hpZnRlZD86IG51bWJlciB8ICgoKSA9PiBudW1iZXIpO1xyXG5cdFx0XHR9KSB7XHJcblx0XHRcdFx0ZnVuY3Rpb24gdG9BcnJheTxUPih2PzogVCB8IFRbXSB8IHVuZGVmaW5lZCk6IFRbXSB7XHJcblx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh2KSkgcmV0dXJuIHY7XHJcblx0XHRcdFx0XHRpZiAodiA9PSBudWxsKSByZXR1cm4gW107XHJcblx0XHRcdFx0XHRyZXR1cm4gW3ZdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmdW5jdGlvbiB0b0NvbmRpdGlvbihzPzogc2VsZWN0b3IgfCAoKCkgPT4gYm9vbGVhbikgfCB1bmRlZmluZWQpOiAoKSA9PiBib29sZWFuIHtcclxuXHRcdFx0XHRcdGlmICghcykgcmV0dXJuICgpID0+IHRydWU7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIHMgPT0gJ3N0cmluZycpIHJldHVybiAoKSA9PiAhIWRvY3VtZW50LnEocyk7XHJcblx0XHRcdFx0XHRyZXR1cm4gcztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZnVuY3Rpb24gY2FuRmluZChhOiBzZWxlY3RvcltdKSB7XHJcblx0XHRcdFx0XHRpZiAoYS5sZW5ndGggPT0gMCkgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHRyZXR1cm4gYS5zb21lKHMgPT4gISFkb2N1bWVudC5xKHMpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZnVuY3Rpb24gZmluZE9uZShhOiBzZWxlY3RvcltdKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYS5maW5kKHMgPT4gZG9jdW1lbnQucShzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucmF3RGF0YSA9IGRhdGE7XHJcblx0XHRcdFx0dGhpcy5kYXRhID0ge1xyXG5cdFx0XHRcdFx0Y29uZGl0aW9uOiB0b0NvbmRpdGlvbihkYXRhLmNvbmRpdGlvbiksXHJcblx0XHRcdFx0XHRwcmVmZXRjaDogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5wcmVmZXRjaClcclxuXHRcdFx0XHRcdFx0LmZsYXRNYXAoZSA9PiB0b0FycmF5KGRhdGFbZV0gPz8gZSkpLFxyXG5cdFx0XHRcdFx0ZG9jOiB0b0FycmF5PHNlbGVjdG9yPihkYXRhLmRvYyksXHJcblx0XHRcdFx0XHRjbGljazogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5jbGljayksXHJcblx0XHRcdFx0XHRhZnRlcjogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5hZnRlciksXHJcblx0XHRcdFx0XHRyZXBsYWNlOiB0b0FycmF5PHNlbGVjdG9yPihkYXRhLnJlcGxhY2UpLFxyXG5cdFx0XHRcdFx0bWF4QWdlOiBkYXRhLm1heEFnZSA/PyAoZGF0YS5jYWNoZSA9PSB0cnVlID8gJzF5JyA6IGRhdGEuY2FjaGUpLFxyXG5cdFx0XHRcdFx0c3RhcnQ6IGRhdGEuc3RhcnQsIG1vZGlmeTogZGF0YS5tb2RpZnksIGVuZDogZGF0YS5lbmQsXHJcblx0XHRcdFx0XHR4bWw6IGRhdGEueG1sLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0dGhpcy5zaGlmdFJlcXVlc3RDb3VudCA9IGRhdGEuc2hpZnRlZDtcclxuXHRcdFx0XHRpZiAoZGF0YS5wYWdlcikge1xyXG5cdFx0XHRcdFx0bGV0IHBhZ2VyID0gdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5wYWdlcik7XHJcblx0XHRcdFx0XHR0aGlzLmRhdGEuZG9jID0gdGhpcy5kYXRhLmRvYy5mbGF0TWFwKGUgPT4gcGFnZXIubWFwKHAgPT4gYCR7cH0gJHtlfWApKTtcclxuXHRcdFx0XHRcdHRoaXMuZGF0YS5yZXBsYWNlLnB1c2goLi4ucGFnZXIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmNvbmRpdGlvbiA9ICgpID0+IHtcclxuXHRcdFx0XHRcdGlmICghdGhpcy5kYXRhLmNvbmRpdGlvbigpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRpZiAoIWNhbkZpbmQodGhpcy5kYXRhLmRvYykpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdGlmICghY2FuRmluZCh0aGlzLmRhdGEuY2xpY2spKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHRoaXMuaW5pdCgpO1xyXG5cdFx0XHRcdGlmICh0aGlzLmRhdGEuY29uZGl0aW9uKCkpIHtcclxuXHRcdFx0XHRcdHRoaXMuZGF0YS5wcmVmZXRjaC5tYXAocyA9PiBQYWdpbmF0ZS5wcmVmZXRjaChzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMub25ydW4gPSBhc3luYyAoKSA9PiB7XHJcblx0XHRcdFx0XHQvLyBpZiAoIWZpeGVkRGF0YS5jb25kaXRpb24oKSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5kYXRhLnN0YXJ0Py5jYWxsKHRoaXMpO1xyXG5cdFx0XHRcdFx0dGhpcy5kYXRhLmNsaWNrLm1hcChlID0+IGRvY3VtZW50LnEoZSk/LmNsaWNrKCkpO1xyXG5cdFx0XHRcdFx0bGV0IGRvYyA9IGZpbmRPbmUodGhpcy5kYXRhLmRvYyk7XHJcblx0XHRcdFx0XHRpZiAoZG9jKSB7XHJcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuZmV0Y2hEb2N1bWVudChkb2MsIHRydWUsIHRoaXMuZGF0YS5tYXhBZ2UpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRhdGEucmVwbGFjZS5tYXAocyA9PiB0aGlzLnJlcGxhY2UocykpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRhdGEuYWZ0ZXIubWFwKHMgPT4gdGhpcy5hZnRlcihzKSk7XHJcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuZGF0YS5tb2RpZnk/LmNhbGwodGhpcywgdGhpcy5kb2MpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5kYXRhLmVuZD8uY2FsbCh0aGlzLCBkb2MgJiYgdGhpcy5kb2MpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHR9XHJcblx0XHR0eXBlIFNlbE9yRWwgPSBzZWxlY3RvciB8IEhUTUxFbGVtZW50O1xyXG5cdFx0dHlwZSBTb21laG93PFQ+ID0gbnVsbCB8IFQgfCBUW10gfCAoKCkgPT4gKG51bGwgfCBUIHwgVFtdKSk7XHJcblx0XHR0eXBlIFNvbWVob3dBc3luYzxUPiA9IG51bGwgfCBUIHwgVFtdIHwgKCgpID0+IChudWxsIHwgVCB8IFRbXSB8IFByb21pc2U8bnVsbCB8IFQgfCBUW10+KSk7XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IHBhZ2luYXRlID0gT2JqZWN0LnNldFByb3RvdHlwZU9mKE9iamVjdC5hc3NpZ24oUGFnaW5hdGUuc3RhdGljQ2FsbCwgbmV3IFBhZ2luYXRlKCkpLCBQYWdpbmF0ZSk7XHJcblx0fVxyXG5cclxuXHRleHBvcnQgY29uc3QgcGFnaW5hdGUgPSBQYWdpbmF0ZUV4dGVuc2lvbi5wYWdpbmF0ZTtcclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIEltYWdlU2Nyb2xsaW5nRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgbGV0IGltYWdlU2Nyb2xsaW5nQWN0aXZlID0gZmFsc2U7XHJcblx0XHRleHBvcnQgbGV0IGltZ1NlbGVjdG9yID0gJ2ltZyc7XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGltYWdlU2Nyb2xsaW5nKHNlbGVjdG9yPzogc3RyaW5nKSB7XHJcblx0XHRcdGlmIChpbWFnZVNjcm9sbGluZ0FjdGl2ZSkgcmV0dXJuO1xyXG5cdFx0XHRpZiAoc2VsZWN0b3IpIGltZ1NlbGVjdG9yID0gc2VsZWN0b3I7XHJcblx0XHRcdGltYWdlU2Nyb2xsaW5nQWN0aXZlID0gdHJ1ZTtcclxuXHRcdFx0ZnVuY3Rpb24gb253aGVlbChldmVudDogTW91c2VFdmVudCAmIHsgd2hlZWxEZWx0YVk6IG51bWJlciB9KSB7XHJcblx0XHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5IHx8IGV2ZW50LmN0cmxLZXkpIHJldHVybjtcclxuXHRcdFx0XHRpZiAoc2Nyb2xsV2hvbGVJbWFnZSgtTWF0aC5zaWduKGV2ZW50LndoZWVsRGVsdGFZKSkpIHtcclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbndoZWVsLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xyXG5cdFx0XHRyZXR1cm4gaW1hZ2VTY3JvbGxpbmdPZmYgPSAoKSA9PiB7XHJcblx0XHRcdFx0aW1hZ2VTY3JvbGxpbmdBY3RpdmUgPSBmYWxzZTtcclxuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgb253aGVlbCk7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gYmluZEFycm93cygpIHtcclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ZW50ID0+IHtcclxuXHRcdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQXJyb3dMZWZ0Jykge1xyXG5cdFx0XHRcdFx0c2Nyb2xsV2hvbGVJbWFnZSgtMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChldmVudC5jb2RlID09ICdBcnJvd1JpZ2h0Jykge1xyXG5cdFx0XHRcdFx0c2Nyb2xsV2hvbGVJbWFnZSgxKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0XHRleHBvcnQgbGV0IGltYWdlU2Nyb2xsaW5nT2ZmID0gKCkgPT4geyB9O1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBpbWdUb1dpbmRvd0NlbnRlcihpbWc6IEVsZW1lbnQpIHtcclxuXHRcdFx0bGV0IHJlY3QgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRcdHJldHVybiAocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyIC0gaW5uZXJIZWlnaHQgLyAyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBnZXRBbGxJbWFnZUluZm8oKSB7XHJcblx0XHRcdGxldCBpbWFnZXMgPSBxcShpbWdTZWxlY3RvcikgYXMgSFRNTEltYWdlRWxlbWVudFtdO1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBpbWFnZXMubWFwKChpbWcsIGluZGV4KSA9PiB7XHJcblx0XHRcdFx0bGV0IHJlY3QgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdGltZywgcmVjdCwgaW5kZXgsXHJcblx0XHRcdFx0XHRpblNjcmVlbjogcmVjdC50b3AgPj0gLTEgJiYgcmVjdC5ib3R0b20gPD0gaW5uZXJIZWlnaHQsXHJcblx0XHRcdFx0XHRjcm9zc1NjcmVlbjogcmVjdC5ib3R0b20gPj0gMSAmJiByZWN0LnRvcCA8PSBpbm5lckhlaWdodCAtIDEsXHJcblx0XHRcdFx0XHR5VG9TY3JlZW5DZW50ZXI6IChyZWN0LnRvcCArIHJlY3QuYm90dG9tKSAvIDIgLSBpbm5lckhlaWdodCAvIDIsXHJcblx0XHRcdFx0XHRpc0luQ2VudGVyOiBNYXRoLmFicygocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyIC0gaW5uZXJIZWlnaHQgLyAyKSA8IDMsXHJcblx0XHRcdFx0XHRpc1NjcmVlbkhlaWdodDogTWF0aC5hYnMocmVjdC5oZWlnaHQgLSBpbm5lckhlaWdodCkgPCAzLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0pLmZpbHRlcihlID0+IGUucmVjdD8ud2lkdGggfHwgZS5yZWN0Py53aWR0aCk7XHJcblx0XHRcdHJldHVybiBkYXRhcztcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IHNjcm9sbFdob2xlSW1hZ2VQZW5kaW5nID0gZmFsc2U7XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGdldENlbnRyYWxJbWcoKSB7XHJcblx0XHRcdHJldHVybiBnZXRBbGxJbWFnZUluZm8oKS52c29ydChlID0+IE1hdGguYWJzKGUueVRvU2NyZWVuQ2VudGVyKSlbMF0/LmltZztcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzY3JvbGxXaG9sZUltYWdlKGRpciA9IDEpOiBib29sZWFuIHtcclxuXHRcdFx0aWYgKHNjcm9sbFdob2xlSW1hZ2VQZW5kaW5nKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0Ly8gaWYgKGRpciA9PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ3Njcm9sbGluZyBpbiBubyBkaXJlY3Rpb24hJyk7XHJcblx0XHRcdGlmICghZGlyKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHRkaXIgPSBNYXRoLnNpZ24oZGlyKTtcclxuXHRcdFx0bGV0IGRhdGFzID0gZ2V0QWxsSW1hZ2VJbmZvKCkudnNvcnQoZSA9PiBlLnlUb1NjcmVlbkNlbnRlcik7XHJcblx0XHRcdGxldCBjZW50cmFsID0gZGF0YXMudnNvcnQoZSA9PiBNYXRoLmFicyhlLnlUb1NjcmVlbkNlbnRlcikpWzBdO1xyXG5cdFx0XHRsZXQgbmV4dENlbnRyYWxJbmRleCA9IGRhdGFzLmluZGV4T2YoY2VudHJhbCk7XHJcblx0XHRcdHdoaWxlIChcclxuXHRcdFx0XHRkYXRhc1tuZXh0Q2VudHJhbEluZGV4ICsgZGlyXSAmJlxyXG5cdFx0XHRcdE1hdGguYWJzKGRhdGFzW25leHRDZW50cmFsSW5kZXggKyBkaXJdLnlUb1NjcmVlbkNlbnRlciAtIGNlbnRyYWwueVRvU2NyZWVuQ2VudGVyKSA8IDEwXHJcblx0XHRcdCkgbmV4dENlbnRyYWxJbmRleCArPSBkaXI7XHJcblx0XHRcdGNlbnRyYWwgPSBkYXRhc1tuZXh0Q2VudHJhbEluZGV4XTtcclxuXHRcdFx0bGV0IG5leHQgPSBkYXRhc1tuZXh0Q2VudHJhbEluZGV4ICsgZGlyXTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHNjcm9sbFRvSW1hZ2UoZGF0YTogdHlwZW9mIGNlbnRyYWwgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcclxuXHRcdFx0XHRpZiAoIWRhdGEpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRpZiAoc2Nyb2xsWSArIGRhdGEueVRvU2NyZWVuQ2VudGVyIDw9IDAgJiYgc2Nyb2xsWSA8PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChkYXRhLmlzU2NyZWVuSGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRkYXRhLmltZy5zY3JvbGxJbnRvVmlldygpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzY3JvbGxUbyhzY3JvbGxYLCBzY3JvbGxZICsgZGF0YS55VG9TY3JlZW5DZW50ZXIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzY3JvbGxXaG9sZUltYWdlUGVuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0UHJvbWlzZS5yYWYoMikudGhlbigoKSA9PiBzY3JvbGxXaG9sZUltYWdlUGVuZGluZyA9IGZhbHNlKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgbm8gaW1hZ2VzLCBkb24ndCBzY3JvbGw7XHJcblx0XHRcdGlmICghY2VudHJhbCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0Ly8gaWYgY3VycmVudCBpbWFnZSBpcyBvdXRzaWRlIHZpZXcsIGRvbid0IHNjcm9sbFxyXG5cdFx0XHRpZiAoIWNlbnRyYWwuY3Jvc3NTY3JlZW4pIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdC8vIGlmIGN1cnJlbnQgaW1hZ2UgaXMgaW4gY2VudGVyLCBzY3JvbGwgdG8gdGhlIG5leHQgb25lXHJcblx0XHRcdGlmIChjZW50cmFsLmlzSW5DZW50ZXIpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2Nyb2xsVG9JbWFnZShuZXh0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgdG8gc2Nyb2xsIHRvIGN1cnJlbnQgaW1hZ2UgeW91IGhhdmUgdG8gc2Nyb2xsIGluIG9wcG9zaWRlIGRpcmVjdGlvbiwgc2Nyb2xsIHRvIG5leHQgb25lXHJcblx0XHRcdGlmIChNYXRoLnNpZ24oY2VudHJhbC55VG9TY3JlZW5DZW50ZXIpICE9IGRpcikge1xyXG5cdFx0XHRcdHJldHVybiBzY3JvbGxUb0ltYWdlKG5leHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZiBjdXJyZW50IGltYWdlIGlzIGZpcnN0L2xhc3QsIGRvbid0IHNjcm9sbCBvdmVyIDI1dmggdG8gaXRcclxuXHRcdFx0aWYgKGRpciA9PSAxICYmIGNlbnRyYWwuaW5kZXggPT0gMCAmJiBjZW50cmFsLnlUb1NjcmVlbkNlbnRlciA+IGlubmVySGVpZ2h0IC8gMikge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZGlyID09IC0xICYmIGNlbnRyYWwuaW5kZXggPT0gZGF0YXMubGVuZ3RoIC0gMSAmJiBjZW50cmFsLnlUb1NjcmVlbkNlbnRlciA8IC1pbm5lckhlaWdodCAvIDIpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBzY3JvbGxUb0ltYWdlKGNlbnRyYWwpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzYXZlU2Nyb2xsUG9zaXRpb24oKSB7XHJcblx0XHRcdGxldCBpbWcgPSBnZXRDZW50cmFsSW1nKCk7XHJcblx0XHRcdGxldCByZWN0ID0gaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRsZXQgY2VudGVyVG9XaW5kb3dDZW50ZXIgPSAocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyIC0gaW5uZXJIZWlnaHQgLyAyO1xyXG5cdFx0XHRsZXQgb2Zmc2V0ID0gY2VudGVyVG9XaW5kb3dDZW50ZXIgLyByZWN0LmhlaWdodDtcclxuXHRcdFx0cmV0dXJuIHsgaW1nLCBvZmZzZXQsIGxvYWQoKSB7IGxvYWRTY3JvbGxQb3NpdGlvbih7IGltZywgb2Zmc2V0IH0pOyB9IH07XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gbG9hZFNjcm9sbFBvc2l0aW9uKHBvczogeyBpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIG9mZnNldDogbnVtYmVyIH0pIHtcclxuXHRcdFx0bGV0IHJlY3QgPSBwb3MuaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRsZXQgY2VudGVyVG9XaW5kb3dDZW50ZXIgPSBwb3Mub2Zmc2V0ICogcmVjdC5oZWlnaHQ7XHJcblx0XHRcdGxldCBhY3R1YWxDZW50ZXJUb1dpbmRvd0NlbnRlciA9IChyZWN0LnRvcCArIHJlY3QuYm90dG9tKSAvIDIgLSBpbm5lckhlaWdodCAvIDI7XHJcblx0XHRcdHNjcm9sbEJ5KDAsIGFjdHVhbENlbnRlclRvV2luZG93Q2VudGVyIC0gY2VudGVyVG9XaW5kb3dDZW50ZXIpO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9BcnJheS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL0RhdGVOb3dIYWNrLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZWxlbWVudC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2VsbS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL0ZpbHRlcmVyL0VudGl0eUZpbHRlcmVyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZXRjLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZmV0Y2gudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9PYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9vYnNlcnZlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1BhZ2luYXRlL1BhZ2luYXRpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9QYWdpbmF0ZS9JbWFnZVNjcm9sbGluZy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1Byb21pc2UudHNcIiAvPlxyXG5cclxuXHJcblxyXG5cclxuXHJcbm5hbWVzcGFjZSBQb29wSnMge1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gX19pbml0X18od2luZG93OiBXaW5kb3cgJiB0eXBlb2YgZ2xvYmFsVGhpcyk6IFwiaW5pdGVkXCIgfCBcImFscmVhZHkgaW5pdGVkXCIge1xyXG5cdFx0aWYgKCF3aW5kb3cpIHdpbmRvdyA9IGdsb2JhbFRoaXMud2luZG93IGFzIFdpbmRvdyAmIHR5cGVvZiBnbG9iYWxUaGlzO1xyXG5cclxuXHRcdHdpbmRvdy5lbG0gPSBFbG0uZWxtO1xyXG5cdFx0d2luZG93LnEgPSBPYmplY3QuYXNzaWduKFF1ZXJ5U2VsZWN0b3IuV2luZG93US5xLCB7IG9yRWxtOiBQb29wSnMuRWxtLnFPckVsbSB9KTtcclxuXHRcdHdpbmRvdy5xcSA9IFF1ZXJ5U2VsZWN0b3IuV2luZG93US5xcTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUsICdxJywgUXVlcnlTZWxlY3Rvci5FbGVtZW50US5xKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUsICdxcScsIFF1ZXJ5U2VsZWN0b3IuRWxlbWVudFEucXEpO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSwgJ2FwcGVuZFRvJywgRWxlbWVudEV4dGVuc2lvbi5hcHBlbmRUbyk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkVsZW1lbnQucHJvdG90eXBlLCAnZW1pdCcsIEVsZW1lbnRFeHRlbnNpb24uZW1pdCk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkRvY3VtZW50LnByb3RvdHlwZSwgJ3EnLCBRdWVyeVNlbGVjdG9yLkRvY3VtZW50US5xKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLCAncXEnLCBRdWVyeVNlbGVjdG9yLkRvY3VtZW50US5xcSk7XHJcblxyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5Qcm9taXNlLCAnZW1wdHknLCBQcm9taXNlRXh0ZW5zaW9uLmVtcHR5KTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuUHJvbWlzZSwgJ2ZyYW1lJywgUHJvbWlzZUV4dGVuc2lvbi5mcmFtZSk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LlByb21pc2UsICdyYWYnLCBQcm9taXNlRXh0ZW5zaW9uLmZyYW1lKTtcclxuXHJcblx0XHR3aW5kb3cuZmV0Y2guY2FjaGVkID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkIGFzIGFueTtcclxuXHRcdHdpbmRvdy5mZXRjaC5kb2MgPSBGZXRjaEV4dGVuc2lvbi5kb2MgYXMgYW55O1xyXG5cdFx0d2luZG93LmZldGNoLmpzb24gPSBGZXRjaEV4dGVuc2lvbi5qc29uIGFzIGFueTtcclxuXHRcdHdpbmRvdy5mZXRjaC5jYWNoZWQuZG9jID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jO1xyXG5cdFx0d2luZG93LmZldGNoLmRvYy5jYWNoZWQgPSBGZXRjaEV4dGVuc2lvbi5jYWNoZWREb2M7XHJcblx0XHR3aW5kb3cuZmV0Y2guY2FjaGVkRG9jID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jO1xyXG5cdFx0d2luZG93LmZldGNoLmpzb24uY2FjaGVkID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbjtcclxuXHRcdHdpbmRvdy5mZXRjaC5jYWNoZWQuanNvbiA9IEZldGNoRXh0ZW5zaW9uLmNhY2hlZEpzb247XHJcblx0XHR3aW5kb3cuZmV0Y2guaXNDYWNoZWQgPSBGZXRjaEV4dGVuc2lvbi5pc0NhY2hlZDtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuUmVzcG9uc2UucHJvdG90eXBlLCAnY2FjaGVkQXQnLCAwKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLCAnY2FjaGVkQXQnLCAwKTtcclxuXHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93Lk9iamVjdCwgJ2RlZmluZVZhbHVlJywgT2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuT2JqZWN0LCAnZGVmaW5lR2V0dGVyJywgT2JqZWN0RXh0ZW5zaW9uLmRlZmluZUdldHRlcik7XHJcblx0XHQvLyBPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUoT2JqZWN0LCAnbWFwJywgT2JqZWN0RXh0ZW5zaW9uLm1hcCk7XHJcblxyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5BcnJheSwgJ21hcCcsIEFycmF5RXh0ZW5zaW9uLm1hcCk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkFycmF5LnByb3RvdHlwZSwgJ3BtYXAnLCBBcnJheUV4dGVuc2lvbi5QTWFwLnRoaXNfcG1hcCk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkFycmF5LnByb3RvdHlwZSwgJ3Zzb3J0JywgQXJyYXlFeHRlbnNpb24udnNvcnQpO1xyXG5cdFx0aWYgKCFbXS5hdClcclxuXHRcdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5BcnJheS5wcm90b3R5cGUsICdhdCcsIEFycmF5RXh0ZW5zaW9uLmF0KTtcclxuXHRcdGlmICghW10uZmluZExhc3QpXHJcblx0XHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuQXJyYXkucHJvdG90eXBlLCAnZmluZExhc3QnLCBBcnJheUV4dGVuc2lvbi5maW5kTGFzdCk7XHJcblxyXG5cdFx0d2luZG93LnBhZ2luYXRlID0gUG9vcEpzLnBhZ2luYXRlIGFzIGFueTtcclxuXHRcdHdpbmRvdy5pbWFnZVNjcm9sbGluZyA9IFBvb3BKcy5JbWFnZVNjcm9sbGluZ0V4dGVuc2lvbjtcclxuXHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LCAnX19pbml0X18nLCAnYWxyZWFkeSBpbml0ZWQnKTtcclxuXHRcdHJldHVybiAnaW5pdGVkJztcclxuXHR9XHJcblxyXG5cdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVHZXR0ZXIod2luZG93LCAnX19pbml0X18nLCAoKSA9PiBfX2luaXRfXyh3aW5kb3cpKTtcclxuXHRPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgUG9vcEpzIH0pO1xyXG5cclxuXHRpZiAod2luZG93LmxvY2FsU3RvcmFnZS5fX2luaXRfXykge1xyXG5cdFx0d2luZG93Ll9faW5pdF9fO1xyXG5cdH1cclxuXHJcbn0iLCIiLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgdHlwZSBWYWx1ZU9mPFQ+ID0gVFtrZXlvZiBUXTtcclxuXHRleHBvcnQgdHlwZSBNYXBwZWRPYmplY3Q8VCwgVj4gPSB7IFtQIGluIGtleW9mIFRdOiBWIH07XHJcblxyXG5cdGV4cG9ydCB0eXBlIHNlbGVjdG9yID0gc3RyaW5nIHwgc3RyaW5nICYgeyBfPzogJ3NlbGVjdG9yJyB9XHJcblx0ZXhwb3J0IHR5cGUgdXJsID0gYGh0dHAke3N0cmluZ31gICYgeyBfPzogJ3VybCcgfTtcclxuXHRleHBvcnQgdHlwZSBMaW5rID0gSFRNTEFuY2hvckVsZW1lbnQgfCBzZWxlY3RvciB8IHVybDtcclxuXHJcblxyXG5cclxuXHJcblx0dHlwZSB0cmltU3RhcnQ8UywgQyBleHRlbmRzIHN0cmluZz4gPSBTIGV4dGVuZHMgYCR7Q30ke2luZmVyIFMxfWAgPyB0cmltU3RhcnQ8UzEsIEM+IDogUztcclxuXHR0eXBlIHRyaW1FbmQ8UywgQyBleHRlbmRzIHN0cmluZz4gPSBTIGV4dGVuZHMgYCR7aW5mZXIgUzF9JHtDfWAgPyB0cmltRW5kPFMxLCBDPiA6IFM7XHJcblx0dHlwZSB0cmltPFMsIEMgZXh0ZW5kcyBzdHJpbmcgPSAnICcgfCAnXFx0JyB8ICdcXG4nPiA9IHRyaW1TdGFydDx0cmltRW5kPFMsIEM+LCBDPjtcclxuXHJcblx0dHlwZSBzcGxpdDxTLCBDIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtpbmZlciBTMX0ke0N9JHtpbmZlciBTMn1gID8gc3BsaXQ8UzEsIEM+IHwgc3BsaXQ8UzIsIEM+IDogUztcclxuXHR0eXBlIHNwbGl0U3RhcnQ8UywgQyBleHRlbmRzIHN0cmluZz4gPSBTIGV4dGVuZHMgYCR7aW5mZXIgUzF9JHtDfSR7aW5mZXIgX1MyfWAgPyBzcGxpdFN0YXJ0PFMxLCBDPiA6IFM7XHJcblx0dHlwZSBzcGxpdEVuZDxTLCBDIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtpbmZlciBfUzF9JHtDfSR7aW5mZXIgUzJ9YCA/IHNwbGl0RW5kPFMyLCBDPiA6IFM7XHJcblxyXG5cdHR5cGUgcmVwbGFjZTxTLCBDIGV4dGVuZHMgc3RyaW5nLCBWIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtpbmZlciBTMX0ke0N9JHtpbmZlciBTM31gID8gcmVwbGFjZTxgJHtTMX0ke1Z9JHtTM31gLCBDLCBWPiA6IFM7XHJcblxyXG5cdHR5cGUgd3MgPSAnICcgfCAnXFx0JyB8ICdcXG4nO1xyXG5cclxuXHQvLyB0eXBlIGluc2FuZVNlbGVjdG9yID0gJyBhICwgYltxd2VdIFxcbiAsIGMueCAsIGQjeSAsIHggZSAsIHg+ZiAsIHggPiBnICwgW3F3ZV0gLCBoOm5vdCh4PnkpICwgaW1nICc7XHJcblxyXG5cdC8vIHR5cGUgX2kxID0gcmVwbGFjZTxpbnNhbmVTZWxlY3RvciwgYFske3N0cmluZ31dYCwgJy4nPjtcclxuXHQvLyB0eXBlIF9pMTUgPSByZXBsYWNlPF9pMSwgYCgke3N0cmluZ30pYCwgJy4nPjtcclxuXHQvLyB0eXBlIF9pMTcgPSByZXBsYWNlPF9pMTUsIEV4Y2x1ZGU8d3MsICcgJz4sICcgJz47XHJcblx0Ly8gdHlwZSBfaTIgPSBzcGxpdDxfaTE3LCAnLCc+O1xyXG5cdC8vIHR5cGUgX2kzID0gdHJpbTxfaTI+O1xyXG5cdC8vIHR5cGUgX2k0ID0gc3BsaXRFbmQ8X2kzLCB3cyB8ICc+Jz47XHJcblx0Ly8gdHlwZSBfaTUgPSBzcGxpdFN0YXJ0PF9pNCwgJy4nIHwgJyMnIHwgJzonPjtcclxuXHQvLyB0eXBlIF9pNiA9IChIVE1MRWxlbWVudFRhZ05hbWVNYXAgJiB7ICcnOiBIVE1MRWxlbWVudCB9ICYgeyBbazogc3RyaW5nXTogSFRNTEVsZW1lbnQgfSlbX2k1XTtcclxuXHRleHBvcnQgdHlwZSBUYWdOYW1lRnJvbVNlbGVjdG9yPFMgZXh0ZW5kcyBzdHJpbmc+ID0gc3BsaXRTdGFydDxzcGxpdEVuZDx0cmltPHNwbGl0PHJlcGxhY2U8cmVwbGFjZTxyZXBsYWNlPFMsIGBbJHtzdHJpbmd9XWAsICcuJz4sIGAoJHtzdHJpbmd9KWAsICcuJz4sIEV4Y2x1ZGU8d3MsICcgJz4sICcgJz4sICcsJz4+LCB3cyB8ICc+Jz4sICcuJyB8ICcjJyB8ICc6Jz47XHJcblxyXG5cdGV4cG9ydCB0eXBlIFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxTPiA9IFMgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXAgPyBIVE1MRWxlbWVudFRhZ05hbWVNYXBbU10gOiBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuXHJcbmRlY2xhcmUgY29uc3QgX19pbml0X186IFwiaW5pdGVkXCIgfCBcImFscmVhZHkgaW5pdGVkXCI7XHJcbmRlY2xhcmUgY29uc3QgZWxtOiB0eXBlb2YgUG9vcEpzLkVsbS5lbG07XHJcbmRlY2xhcmUgY29uc3QgcTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLldpbmRvd1EucSAmIHsgb3JFbG06IHR5cGVvZiBQb29wSnMuRWxtLnFPckVsbSB9OztcclxuZGVjbGFyZSBjb25zdCBxcTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLldpbmRvd1EucXE7XHJcbmRlY2xhcmUgY29uc3QgcGFnaW5hdGU6IHR5cGVvZiBQb29wSnMucGFnaW5hdGU7XHJcbmRlY2xhcmUgY29uc3QgaW1hZ2VTY3JvbGxpbmc6IHR5cGVvZiBQb29wSnMuSW1hZ2VTY3JvbGxpbmdFeHRlbnNpb247XHJcbmRlY2xhcmUgbmFtZXNwYWNlIGZldGNoIHtcclxuXHRleHBvcnQgbGV0IGNhY2hlZDogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWQgJiB7IGRvYzogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWREb2MsIGpzb246IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbiB9O1xyXG5cdGV4cG9ydCBsZXQgZG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmRvYyAmIHsgY2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYyB9O1xyXG5cdGV4cG9ydCBsZXQgY2FjaGVkRG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYztcclxuXHRleHBvcnQgbGV0IGpzb246IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uanNvbiAmIHsgY2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZEpzb24gfTtcclxuXHRleHBvcnQgbGV0IGlzQ2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmlzQ2FjaGVkO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgV2luZG93IHtcclxuXHRyZWFkb25seSBfX2luaXRfXzogXCJpbml0ZWRcIiB8IFwiYWxyZWFkeSBpbml0ZWRcIjtcclxuXHRlbG06IHR5cGVvZiBQb29wSnMuRWxtLmVsbTtcclxuXHRxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuV2luZG93US5xICYgeyBvckVsbTogdHlwZW9mIFBvb3BKcy5FbG0ucU9yRWxtIH07XHJcblx0cXE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5XaW5kb3dRLnFxO1xyXG5cdHBhZ2luYXRlOiB0eXBlb2YgUG9vcEpzLnBhZ2luYXRlO1xyXG5cdGltYWdlU2Nyb2xsaW5nOiB0eXBlb2YgUG9vcEpzLkltYWdlU2Nyb2xsaW5nRXh0ZW5zaW9uO1xyXG5cdGZldGNoOiB7XHJcblx0XHQoaW5wdXQ6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPjtcclxuXHRcdGNhY2hlZDogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWQgJiB7IGRvYzogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWREb2MsIGpzb246IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbiB9O1xyXG5cdFx0ZG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmRvYyAmIHsgY2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYyB9O1xyXG5cdFx0Y2FjaGVkRG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYztcclxuXHRcdGpzb246IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uanNvbiAmIHsgY2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZEpzb24gfTtcclxuXHRcdGlzQ2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmlzQ2FjaGVkO1xyXG5cdH1cclxufVxyXG5cclxuaW50ZXJmYWNlIEVsZW1lbnQge1xyXG5cdHE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5FbGVtZW50US5xO1xyXG5cdHFxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuRWxlbWVudFEucXE7XHJcblx0YXBwZW5kVG86IHR5cGVvZiBQb29wSnMuRWxlbWVudEV4dGVuc2lvbi5hcHBlbmRUbztcclxuXHRlbWl0OiB0eXBlb2YgUG9vcEpzLkVsZW1lbnRFeHRlbnNpb24uZW1pdDtcclxuXHRhZGRFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBDdXN0b21FdmVudDx7IF9ldmVudD86IHN0cmluZyB9Pj4odHlwZTogVFsnZGV0YWlsJ11bJ19ldmVudCddLCBsaXN0ZW5lcjogKHRoaXM6IERvY3VtZW50LCBldjogVCkgPT4gYW55LCBvcHRpb25zPzogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZDtcclxufVxyXG5pbnRlcmZhY2UgRG9jdW1lbnQge1xyXG5cdHE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5Eb2N1bWVudFEucTtcclxuXHRxcTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLkRvY3VtZW50US5xcTtcclxuXHRjYWNoZWRBdDogbnVtYmVyO1xyXG5cdGFkZEV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEN1c3RvbUV2ZW50PHsgX2V2ZW50Pzogc3RyaW5nIH0+Pih0eXBlOiBUWydkZXRhaWwnXVsnX2V2ZW50J10sIGxpc3RlbmVyOiAodGhpczogRG9jdW1lbnQsIGV2OiBUKSA9PiBhbnksIG9wdGlvbnM/OiBib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgT2JqZWN0Q29uc3RydWN0b3Ige1xyXG5cdGRlZmluZVZhbHVlOiB0eXBlb2YgUG9vcEpzLk9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZTtcclxuXHRkZWZpbmVHZXR0ZXI6IHR5cGVvZiBQb29wSnMuT2JqZWN0RXh0ZW5zaW9uLmRlZmluZUdldHRlcjtcclxuXHQvLyBtYXA6IHR5cGVvZiBQb29wSnMuT2JqZWN0RXh0ZW5zaW9uLm1hcDtcclxuXHRzZXRQcm90b3R5cGVPZjxULCBQPihvOiBULCBwcm90bzogUCk6IFQgJiBQO1xyXG5cclxuXHJcblx0ZnJvbUVudHJpZXM8SyBleHRlbmRzIHN0cmluZyB8IG51bWJlciB8IHN5bWJvbCwgVj4oXHJcblx0XHRlbnRyaWVzOiByZWFkb25seSAocmVhZG9ubHkgW0ssIFZdKVtdXHJcblx0KTogeyBbayBpbiBLXTogViB9O1xyXG59XHJcbmludGVyZmFjZSBQcm9taXNlQ29uc3RydWN0b3Ige1xyXG5cdGVtcHR5OiB0eXBlb2YgUG9vcEpzLlByb21pc2VFeHRlbnNpb24uZW1wdHk7XHJcblx0ZnJhbWU6IHR5cGVvZiBQb29wSnMuUHJvbWlzZUV4dGVuc2lvbi5mcmFtZTtcclxuXHRyYWY6IHR5cGVvZiBQb29wSnMuUHJvbWlzZUV4dGVuc2lvbi5mcmFtZTtcclxufVxyXG5cclxuaW50ZXJmYWNlIEFycmF5PFQ+IHtcclxuXHR2c29ydDogdHlwZW9mIFBvb3BKcy5BcnJheUV4dGVuc2lvbi52c29ydDtcclxuXHQvLyBwbWFwOiB0eXBlb2YgUG9vcEpzLkFycmF5RXh0ZW5zaW9uLnBtYXA7XHJcblx0cG1hcDogdHlwZW9mIFBvb3BKcy5BcnJheUV4dGVuc2lvbi5QTWFwLnRoaXNfcG1hcDtcclxufVxyXG5pbnRlcmZhY2UgQXJyYXlDb25zdHJ1Y3RvciB7XHJcblx0bWFwOiB0eXBlb2YgUG9vcEpzLkFycmF5RXh0ZW5zaW9uLm1hcDtcclxufVxyXG5cclxuaW50ZXJmYWNlIERhdGVDb25zdHJ1Y3RvciB7XHJcblx0X25vdygpOiBudW1iZXI7XHJcbn1cclxuaW50ZXJmYWNlIERhdGUge1xyXG5cdF9nZXRUaW1lKCk6IG51bWJlcjtcclxufVxyXG5pbnRlcmZhY2UgUGVyZm9ybWFuY2Uge1xyXG5cdF9ub3c6IFBlcmZvcm1hbmNlWydub3cnXTtcclxufVxyXG5pbnRlcmZhY2UgV2luZG93IHtcclxuXHRfcmVxdWVzdEFuaW1hdGlvbkZyYW1lOiBXaW5kb3dbJ3JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmVzcG9uc2Uge1xyXG5cdGNhY2hlZEF0OiBudW1iZXI7XHJcbn1cclxuXHJcbi8vIGludGVyZmFjZSBDdXN0b21FdmVudDxUPiB7XHJcbi8vIFx0ZGV0YWlsPzogVDtcclxuLy8gfVxyXG5cclxuaW50ZXJmYWNlIEZ1bmN0aW9uIHtcclxuXHRiaW5kPFQsIFIsIEFSR1MgZXh0ZW5kcyBhbnlbXT4odGhpczogKHRoaXM6IFQsIC4uLmFyZ3M6IEFSR1MpID0+IFIsIHRoaXNBcmc6IFQpOiAoKC4uLmFyZ3M6IEFSR1MpID0+IFIpXHJcbn1cclxuXHJcbi8vIGZvcmNlIGFsbG93ICcnLnNwbGl0KCcuJykucG9wKCkhXHJcbmludGVyZmFjZSBTdHJpbmcge1xyXG5cdHNwbGl0KHNwbGl0dGVyOiBzdHJpbmcpOiBbc3RyaW5nLCAuLi5zdHJpbmdbXV07XHJcbn1cclxuaW50ZXJmYWNlIEFycmF5PFQ+IHtcclxuXHRwb3AoKTogdGhpcyBleHRlbmRzIFtULCAuLi5UW11dID8gVCA6IFQgfCB1bmRlZmluZWQ7XHJcblx0YXQoaW5kZXg6IG51bWJlcik6IFQ7XHJcblx0ZmluZExhc3Q8UyBleHRlbmRzIFQ+KHByZWRpY2F0ZTogKHRoaXM6IHZvaWQsIHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBvYmo6IFRbXSkgPT4gdmFsdWUgaXMgUywgdGhpc0FyZz86IGFueSk6IFMgfCB1bmRlZmluZWQ7XHJcblx0ZmluZExhc3QocHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIG9iajogVFtdKSA9PiB1bmtub3duLCB0aGlzQXJnPzogYW55KTogVCB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuaW50ZXJmYWNlIE1hdGgge1xyXG5cdHNpZ24oeDogbnVtYmVyKTogLTEgfCAwIHwgMTtcclxufVxyXG4iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIEVudHJ5RmlsdGVyZXJFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBGaWx0ZXJlckl0ZW08RGF0YT4ge1xyXG5cdFx0XHRpZDogc3RyaW5nID0gXCJcIjtcclxuXHRcdFx0bmFtZT86IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcblx0XHRcdHRocmVlV2F5OiBXYXluZXNzID0gZmFsc2U7XHJcblx0XHRcdG1vZGU6IE1vZGUgPSAnb2ZmJztcclxuXHRcdFx0cGFyZW50OiBFbnRyeUZpbHRlcmVyO1xyXG5cdFx0XHRidXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cdFx0XHRpbmNvbXBhdGlibGU/OiBzdHJpbmdbXTtcclxuXHRcdFx0aGlkZGVuID0gZmFsc2U7XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBGaWx0ZXJlckl0ZW1Tb3VyY2UpIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtJztcclxuXHRcdFx0XHRPYmplY3QuYXNzaWduKHRoaXMsIGRhdGEpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmJ1dHRvbiA9IGVsbTwnYnV0dG9uJz4oZGF0YS5idXR0b24sXHJcblx0XHRcdFx0XHRjbGljayA9PiB0aGlzLmNsaWNrKGNsaWNrKSxcclxuXHRcdFx0XHRcdGNvbnRleHRtZW51ID0+IHRoaXMuY29udGV4dG1lbnUoY29udGV4dG1lbnUpLFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFx0dGhpcy5wYXJlbnQuY29udGFpbmVyLmFwcGVuZCh0aGlzLmJ1dHRvbik7XHJcblx0XHRcdFx0aWYgKHRoaXMubmFtZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b24uYXBwZW5kKHRoaXMubmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbi50aXRsZSA9IHRoaXMuZGVzY3JpcHRpb247XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgIT0gJ29mZicpIHtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTW9kZShkYXRhLm1vZGUsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5oaWRkZW4pIHtcclxuXHRcdFx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvZmYnKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUoJ29uJyk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChldmVudC50YXJnZXQgIT0gdGhpcy5idXR0b24pIHJldHVybjtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvbicpIHtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTW9kZSh0aGlzLnRocmVlV2F5ID8gJ29wcG9zaXRlJyA6ICdvZmYnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNb2RlKCdvZmYnKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dG1lbnUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgIT0gJ29wcG9zaXRlJykge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNb2RlKCdvcHBvc2l0ZScpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUoJ29mZicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dG9nZ2xlTW9kZShtb2RlOiBNb2RlLCBmb3JjZSA9IGZhbHNlKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSBtb2RlICYmICFmb3JjZSkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMubW9kZSA9IG1vZGU7XHJcblx0XHRcdFx0dGhpcy5idXR0b24uc2V0QXR0cmlidXRlKCdlZi1tb2RlJywgbW9kZSk7XHJcblx0XHRcdFx0aWYgKG1vZGUgIT0gJ29mZicgJiYgdGhpcy5pbmNvbXBhdGlibGUpIHtcclxuXHRcdFx0XHRcdHRoaXMucGFyZW50Lm9mZkluY29tcGF0aWJsZSh0aGlzLmluY29tcGF0aWJsZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucGFyZW50LnJlcXVlc3RVcGRhdGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmVtb3ZlKCkge1xyXG5cdFx0XHRcdHRoaXMuYnV0dG9uLnJlbW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMudG9nZ2xlTW9kZSgnb2ZmJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNob3coKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRkZW4gPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmJ1dHRvbi5oaWRkZW4gPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRoaWRlKCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZGVuID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLmJ1dHRvbi5oaWRkZW4gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9GaWx0ZXJlckl0ZW0udHNcIiAvPlxyXG5cclxubmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgZmlsdGVyOiBGaWx0ZXJGbjxEYXRhPjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IEZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtZmlsdGVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKiogcmV0dXJucyBpZiBpdGVtIHNob3VsZCBiZSB2aXNpYmxlICovXHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29mZicpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IHRoaXMuZmlsdGVyKGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiA/IHZhbHVlID4gMCA6IHZhbHVlO1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29uJykgcmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvcHBvc2l0ZScpIHJldHVybiAhcmVzdWx0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFZhbHVlRmlsdGVyPERhdGEsIFYgZXh0ZW5kcyBzdHJpbmcgfCBudW1iZXI+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgZmlsdGVyOiBWYWx1ZUZpbHRlckZuPERhdGEsIFY+O1xyXG5cdFx0XHRpbnB1dDogSFRNTElucHV0RWxlbWVudDtcclxuXHRcdFx0bGFzdFZhbHVlOiBWO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogVmFsdWVGaWx0ZXJTb3VyY2U8RGF0YSwgVj4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLWZpbHRlcltlZi1tb2RlPVwib2ZmXCJdJztcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0XHRsZXQgdHlwZSA9IHR5cGVvZiBkYXRhLmlucHV0ID09ICdudW1iZXInID8gJ251bWJlcicgOiAndGV4dCc7XHJcblx0XHRcdFx0bGV0IHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoZGF0YS5pbnB1dCk7XHJcblx0XHRcdFx0bGV0IGlucHV0ID0gYGlucHV0W3R5cGU9JHt0eXBlfV1bdmFsdWU9JHt2YWx1ZX1dYDtcclxuXHRcdFx0XHR0aGlzLmlucHV0ID0gZWxtPCdpbnB1dCc+KGlucHV0LFxyXG5cdFx0XHRcdFx0aW5wdXQgPT4gdGhpcy5jaGFuZ2UoKSxcclxuXHRcdFx0XHQpLmFwcGVuZFRvKHRoaXMuYnV0dG9uKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2hhbmdlKCkge1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcclxuXHRcdFx0XHRpZiAodGhpcy5sYXN0VmFsdWUgIT0gdmFsdWUpIHtcclxuXHRcdFx0XHRcdHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHR0aGlzLnBhcmVudC5yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKiogcmV0dXJucyBpZiBpdGVtIHNob3VsZCBiZSB2aXNpYmxlICovXHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29mZicpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IHRoaXMuZmlsdGVyKHRoaXMuZ2V0VmFsdWUoKSwgZGF0YSwgZWwpO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiA/IHZhbHVlID4gMCA6IHZhbHVlO1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29uJykgcmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvcHBvc2l0ZScpIHJldHVybiAhcmVzdWx0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRnZXRWYWx1ZSgpOiBWIHtcclxuXHRcdFx0XHRsZXQgdmFsdWU6IFYgPSAodGhpcy5pbnB1dC50eXBlID09ICd0ZXh0JyA/IHRoaXMuaW5wdXQudmFsdWUgOiB0aGlzLmlucHV0LnZhbHVlQXNOdW1iZXIpIGFzIFY7XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIE1hdGNoRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgdmFsdWU6IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IHN0cmluZztcclxuXHRcdFx0aW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblx0XHRcdGxhc3RWYWx1ZTogc3RyaW5nO1xyXG5cdFx0XHRtYXRjaGVyOiAoaW5wdXQ6IHN0cmluZykgPT4gYm9vbGVhbjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IE1hdGNoRmlsdGVyU291cmNlPERhdGE+KSB7XHJcblx0XHRcdFx0ZGF0YS5idXR0b24gPz89ICdidXR0b24uZWYtaXRlbS5lZi1maWx0ZXJbZWYtbW9kZT1cIm9mZlwiXSc7XHJcblx0XHRcdFx0ZGF0YS52YWx1ZSA/Pz0gZGF0YSA9PiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0XHRsZXQgdmFsdWUgPSAhZGF0YS5pbnB1dCA/ICcnIDogSlNPTi5zdHJpbmdpZnkoZGF0YS5pbnB1dCk7XHJcblx0XHRcdFx0bGV0IGlucHV0ID0gYGlucHV0W3R5cGU9dGV4dH1dW3ZhbHVlPSR7dmFsdWV9XWA7XHJcblx0XHRcdFx0dGhpcy5pbnB1dCA9IGVsbTwnaW5wdXQnPihpbnB1dCxcclxuXHRcdFx0XHRcdGlucHV0ID0+IHRoaXMuY2hhbmdlKCksXHJcblx0XHRcdFx0KS5hcHBlbmRUbyh0aGlzLmJ1dHRvbik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNoYW5nZSgpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5sYXN0VmFsdWUgIT0gdGhpcy5pbnB1dC52YWx1ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXN0VmFsdWUgPSB0aGlzLmlucHV0LnZhbHVlO1xyXG5cdFx0XHRcdFx0dGhpcy5tYXRjaGVyID0gdGhpcy5nZW5lcmF0ZU1hdGNoZXIodGhpcy5sYXN0VmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0bGV0IHJlc3VsdCA9IHRoaXMubWF0Y2hlcih0aGlzLnZhbHVlKGRhdGEsIGVsKSk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMubW9kZSA9PSAnb24nID8gcmVzdWx0IDogIXJlc3VsdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gbWF0Y2hlckNhY2hlOiBNYXA8c3RyaW5nLCAoKGlucHV0OiBzdHJpbmcpID0+IGJvb2xlYW4pPiA9IG5ldyBNYXAoKTtcclxuXHRcdFx0Ly8gZ2V0TWF0Y2hlcihzb3VyY2U6IHN0cmluZyk6IChpbnB1dDogc3RyaW5nKSA9PiBib29sZWFuIHtcclxuXHRcdFx0Ly8gXHRpZiAodGhpcy5tYXRjaGVyQ2FjaGUuaGFzKHNvdXJjZSkpIHtcclxuXHRcdFx0Ly8gXHRcdHJldHVybiB0aGlzLm1hdGNoZXJDYWNoZS5nZXQoc291cmNlKTtcclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIFx0bGV0IG1hdGNoZXIgPSB0aGlzLmdlbmVyYXRlTWF0Y2hlcihzb3VyY2UpO1xyXG5cdFx0XHQvLyBcdHRoaXMubWF0Y2hlckNhY2hlLnNldChzb3VyY2UsIG1hdGNoZXIpO1xyXG5cdFx0XHQvLyBcdHJldHVybiBtYXRjaGVyO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdGdlbmVyYXRlTWF0Y2hlcihzb3VyY2U6IHN0cmluZyk6ICgoaW5wdXQ6IHN0cmluZykgPT4gYm9vbGVhbikge1xyXG5cdFx0XHRcdHNvdXJjZSA9IHNvdXJjZS50cmltKCk7XHJcblx0XHRcdFx0aWYgKHNvdXJjZS5sZW5ndGggPT0gMCkgcmV0dXJuICgpID0+IHRydWU7XHJcblx0XHRcdFx0aWYgKHNvdXJjZS5pbmNsdWRlcygnICcpKSB7XHJcblx0XHRcdFx0XHRsZXQgcGFydHMgPSBzb3VyY2Uuc3BsaXQoJyAnKS5tYXAoZSA9PiB0aGlzLmdlbmVyYXRlTWF0Y2hlcihlKSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gKGlucHV0KSA9PiBwYXJ0cy5ldmVyeShtID0+IG0oaW5wdXQpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHNvdXJjZS5zdGFydHNXaXRoKCctJykpIHtcclxuXHRcdFx0XHRcdGlmIChzb3VyY2UubGVuZ3RoIDwgMykgcmV0dXJuICgpID0+IHRydWU7XHJcblx0XHRcdFx0XHRsZXQgYmFzZSA9IHRoaXMuZ2VuZXJhdGVNYXRjaGVyKHNvdXJjZS5zbGljZSgxKSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gKGlucHV0KSA9PiAhYmFzZShpbnB1dCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRsZXQgZmxhZ3MgPSBzb3VyY2UudG9Mb3dlckNhc2UoKSA9PSBzb3VyY2UgPyAnaScgOiAnJztcclxuXHRcdFx0XHRcdGxldCByZWdleCA9IG5ldyBSZWdFeHAoc291cmNlLCBmbGFncyk7XHJcblx0XHRcdFx0XHRyZXR1cm4gKGlucHV0KSA9PiAhIWlucHV0Lm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7IH07XHJcblx0XHRcdFx0cmV0dXJuIChpbnB1dCkgPT4gaW5wdXQuaW5jbHVkZXMoc291cmNlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHR5cGUgVGFnR2V0dGVyRm48RGF0YT4gPSBzZWxlY3RvciB8ICgoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50LCBtb2RlOiBNb2RlKSA9PiAoSFRNTEVsZW1lbnRbXSB8IHN0cmluZ1tdKSk7XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFRhZ0ZpbHRlclNvdXJjZTxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdHRhZ3M6IFRhZ0dldHRlckZuPERhdGE+O1xyXG5cdFx0XHRpbnB1dD86IHN0cmluZztcclxuXHRcdFx0aGlnaGlnaHRDbGFzcz86IHN0cmluZztcclxuXHRcdH1cclxuXHRcdHR5cGUgVGFnTWF0Y2hlciA9IHsgcG9zaXRpdmU6IGJvb2xlYW4sIG1hdGNoZXM6IChzOiBzdHJpbmcpID0+IGJvb2xlYW4gfTtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgVGFnRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdHRhZ3M6IFRhZ0dldHRlckZuPERhdGE+O1xyXG5cdFx0XHRpbnB1dDogSFRNTElucHV0RWxlbWVudDtcclxuXHRcdFx0aGlnaGlnaHRDbGFzczogc3RyaW5nO1xyXG5cclxuXHRcdFx0bGFzdFZhbHVlOiBzdHJpbmcgPSAnJztcclxuXHRcdFx0Y2FjaGVkTWF0Y2hlcjogVGFnTWF0Y2hlcltdO1xyXG5cclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IFRhZ0ZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtZmlsdGVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXQgPSBlbG08J2lucHV0Jz4oYGlucHV0W3R5cGU9dGV4dH1dYCxcclxuXHRcdFx0XHRcdGlucHV0ID0+IHRoaXMuY2hhbmdlKCksXHJcblx0XHRcdFx0KS5hcHBlbmRUbyh0aGlzLmJ1dHRvbik7XHJcblx0XHRcdFx0dGhpcy5pbnB1dC52YWx1ZSA9IGRhdGEuaW5wdXQgfHwgJyc7XHJcblx0XHRcdFx0dGhpcy50YWdzID0gZGF0YS50YWdzO1xyXG5cdFx0XHRcdHRoaXMuY2FjaGVkTWF0Y2hlciA9IFtdO1xyXG5cclxuXHRcdFx0XHR0aGlzLmhpZ2hpZ2h0Q2xhc3MgPSBkYXRhLmhpZ2hpZ2h0Q2xhc3MgPz8gJ2VmLXRhZy1oaWdobGlzaHQnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcclxuXHRcdFx0XHRsZXQgdGFncyA9IHRoaXMuZ2V0VGFncyhkYXRhLCBlbCk7XHJcblx0XHRcdFx0dGFncy5tYXAodGFnID0+IHRoaXMucmVzZXRIaWdobGlnaHQodGFnKSk7XHJcblxyXG5cdFx0XHRcdGxldCByZXN1bHRzID0gdGhpcy5jYWNoZWRNYXRjaGVyLm1hcChtID0+IHtcclxuXHRcdFx0XHRcdGxldCByID0geyBwb3NpdGl2ZTogbS5wb3NpdGl2ZSwgY291bnQ6IDAgfTtcclxuXHRcdFx0XHRcdGZvciAobGV0IHRhZyBvZiB0YWdzKSB7XHJcblx0XHRcdFx0XHRcdGxldCBzdHIgPSB0eXBlb2YgdGFnID09ICdzdHJpbmcnID8gdGFnIDogdGFnLmlubmVyVGV4dDtcclxuXHRcdFx0XHRcdFx0bGV0IHZhbCA9IG0ubWF0Y2hlcyhzdHIpO1xyXG5cdFx0XHRcdFx0XHRpZiAodmFsKSB7XHJcblx0XHRcdFx0XHRcdFx0ci5jb3VudCsrO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuaGlnaGxpZ2h0VGFnKHRhZywgbS5wb3NpdGl2ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiByZXN1bHRzLmV2ZXJ5KHIgPT4gci5wb3NpdGl2ZSA/IHIuY291bnQgPiAwIDogci5jb3VudCA9PSAwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXNldEhpZ2hsaWdodCh0YWc6IHN0cmluZyB8IEhUTUxFbGVtZW50KSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0YWcgPT0gJ3N0cmluZycpIHJldHVybjtcclxuXHRcdFx0XHR0YWcuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmhpZ2hpZ2h0Q2xhc3MpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGhpZ2hsaWdodFRhZyh0YWc6IHN0cmluZyB8IEhUTUxFbGVtZW50LCBwb3NpdGl2ZTogYm9vbGVhbikge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGFnID09ICdzdHJpbmcnKSByZXR1cm47XHJcblx0XHRcdFx0Ly8gRklYTUVcclxuXHRcdFx0XHR0YWcuY2xhc3NMaXN0LmFkZCh0aGlzLmhpZ2hpZ2h0Q2xhc3MpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRnZXRUYWdzKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50W10gfCBzdHJpbmdbXSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnRhZ3MgPT0gJ3N0cmluZycpIHJldHVybiBlbC5xcTxIVE1MRWxlbWVudD4odGhpcy50YWdzKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy50YWdzKGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGdldFRhZ1N0cmluZ3MoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogc3RyaW5nW10ge1xyXG5cdFx0XHRcdGxldCB0YWdzID0gdGhpcy5nZXRUYWdzKGRhdGEsIGVsKTtcclxuXHRcdFx0XHRpZiAodHlwZW9mIHRhZ3NbMF0gPT0gJ3N0cmluZycpIHJldHVybiB0YWdzIGFzIHN0cmluZ1tdO1xyXG5cdFx0XHRcdHJldHVybiB0YWdzLm1hcCgoZSkgPT4gZS5pbm5lclRleHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjaGFuZ2UoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubGFzdFZhbHVlID09IHRoaXMuaW5wdXQudmFsdWUpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLmxhc3RWYWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XHJcblx0XHRcdFx0dGhpcy5jYWNoZWRNYXRjaGVyID0gdGhpcy5wYXJzZU1hdGNoZXIodGhpcy5sYXN0VmFsdWUpO1xyXG5cdFx0XHRcdHRoaXMucGFyZW50LnJlcXVlc3RVcGRhdGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cGFyc2VNYXRjaGVyKG1hdGNoZXI6IHN0cmluZyk6IFRhZ01hdGNoZXJbXSB7XHJcblx0XHRcdFx0bWF0Y2hlci50cmltKCk7XHJcblx0XHRcdFx0aWYgKCFtYXRjaGVyKSByZXR1cm4gW107XHJcblxyXG5cdFx0XHRcdGlmIChtYXRjaGVyLmluY2x1ZGVzKCcgJykpIHtcclxuXHRcdFx0XHRcdGxldCBwYXJ0cyA9IG1hdGNoZXIubWF0Y2goL1wiW15cIl0qXCJ8XFxTKy9nKSB8fCBbXTtcclxuXHRcdFx0XHRcdHJldHVybiBwYXJ0cy5mbGF0TWFwKGUgPT4gdGhpcy5wYXJzZU1hdGNoZXIoZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAobWF0Y2hlci5zdGFydHNXaXRoKCctJykpIHtcclxuXHRcdFx0XHRcdGxldCBwYXJ0cyA9IHRoaXMucGFyc2VNYXRjaGVyKG1hdGNoZXIuc2xpY2UoMSkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHBhcnRzLm1hcChlID0+ICh7IHBvc2l0aXZlOiAhZS5wb3NpdGl2ZSwgbWF0Y2hlczogZS5tYXRjaGVzIH0pKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG1hdGNoZXIubWF0Y2goL1wiXlteXCJdKlwiJC8pKSB7XHJcblx0XHRcdFx0XHRtYXRjaGVyID0gbWF0Y2hlci5zbGljZSgxLCAtMSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gW3sgcG9zaXRpdmU6IHRydWUsIG1hdGNoZXM6IHRhZyA9PiB0YWcgPT0gbWF0Y2hlciB9XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG1hdGNoZXIubGVuZ3RoIDwgMykgcmV0dXJuIFtdO1xyXG5cdFx0XHRcdGlmIChtYXRjaGVyLm1hdGNoKC9cIi8pPy5sZW5ndGggPT0gMSkgcmV0dXJuIFtdO1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRsZXQgZyA9IG5ldyBSZWdFeHAobWF0Y2hlciwgJ2knKTtcclxuXHRcdFx0XHRcdHJldHVybiBbeyBwb3NpdGl2ZTogdHJ1ZSwgbWF0Y2hlczogdGFnID0+ICEhdGFnLm1hdGNoKGcpIH1dO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHsgfVxyXG5cdFx0XHRcdHJldHVybiBbeyBwb3NpdGl2ZTogdHJ1ZSwgbWF0Y2hlczogdGFnID0+IHRhZy5pbmNsdWRlcyhtYXRjaGVyKSB9XTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgY2xhc3MgUGFnaW5hdGlvbkluZm9GaWx0ZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4gaW1wbGVtZW50cyBJRmlsdGVyPERhdGE+IHtcclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogRmlsdGVyZXJJdGVtU291cmNlKSB7XHJcblx0XHRcdFx0c3VwZXIoZGF0YSk7XHJcblx0XHRcdFx0dGhpcy5pbml0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXBwbHkoKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0UGFnaW5hdGUgPSBQb29wSnMuUGFnaW5hdGVFeHRlbnNpb24uUGFnaW5hdGU7XHJcblx0XHRcdGNvdW50UGFnaW5hdGUoKSB7XHJcblx0XHRcdFx0bGV0IGRhdGEgPSB7IHJ1bm5pbmc6IDAsIHF1ZXVlZDogMCwgfTtcclxuXHRcdFx0XHRmb3IgKGxldCBwIG9mIHRoaXMuUGFnaW5hdGUuaW5zdGFuY2VzKSB7XHJcblx0XHRcdFx0XHRkYXRhLnJ1bm5pbmcgKz0gK3AucnVubmluZztcclxuXHRcdFx0XHRcdGRhdGEucXVldWVkICs9IHAucXVldWVkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dXBkYXRlSW5mbygpIHtcclxuXHRcdFx0XHRsZXQgZGF0YSA9IHRoaXMuY291bnRQYWdpbmF0ZSgpO1xyXG5cdFx0XHRcdGlmICghZGF0YS5ydW5uaW5nICYmICFkYXRhLnF1ZXVlZCkge1xyXG5cdFx0XHRcdFx0dGhpcy5oaWRkZW4gfHwgdGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuaGlkZGVuICYmIHRoaXMuc2hvdygpO1xyXG5cdFx0XHRcdFx0bGV0IHRleHQgPSBgLi4uICske2RhdGEucnVubmluZyArIGRhdGEucXVldWVkfWA7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5idXR0b24uaW5uZXJIVE1MICE9IHRleHQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5idXR0b24uaW5uZXJUZXh0ID0gdGV4dDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFzeW5jIGluaXQoKSB7XHJcblx0XHRcdFx0d2hpbGUgKHRydWUpIHtcclxuXHRcdFx0XHRcdGF3YWl0IFByb21pc2UuZnJhbWUoKTtcclxuXHRcdFx0XHRcdHRoaXMudXBkYXRlSW5mbygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn1cclxuIiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgTW9kaWZpZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4gaW1wbGVtZW50cyBJTW9kaWZpZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIG1vZGlmaWVyOiBNb2RpZmllckZuPERhdGE+O1xyXG5cdFx0XHRkZWNsYXJlIHJ1bk9uTm9DaGFuZ2U/OiBib29sZWFuO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogTW9kaWZpZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLW1vZGlmaWVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0b2dnbGVNb2RlKG1vZGU6IE1vZGUsIGZvcmNlID0gZmFsc2UpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09IG1vZGUgJiYgIWZvcmNlKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy5wYXJlbnQubW92ZVRvVG9wKHRoaXMpO1xyXG5cdFx0XHRcdHN1cGVyLnRvZ2dsZU1vZGUobW9kZSwgZm9yY2UpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpIHtcclxuXHRcdFx0XHRsZXQgb2xkTW9kZTogTW9kZSB8IG51bGwgPSBlbC5nZXRBdHRyaWJ1dGUoYGVmLW1vZGlmaWVyLSR7dGhpcy5pZH0tbW9kZWApIGFzIChNb2RlIHwgbnVsbCk7XHJcblx0XHRcdFx0aWYgKG9sZE1vZGUgPT0gdGhpcy5tb2RlICYmICF0aGlzLnJ1bk9uTm9DaGFuZ2UpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLm1vZGlmaWVyKGRhdGEsIGVsLCB0aGlzLm1vZGUsIG51bGwpO1xyXG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZShgZWYtbW9kaWZpZXItJHt0aGlzLmlkfS1tb2RlYCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBQcmVmaXhlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElNb2RpZmllcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgdGFyZ2V0OiBzZWxlY3RvciB8ICgoZTogSFRNTEVsZW1lbnQsIGRhdGE6IERhdGEsIG1vZGU6IE1vZGUpID0+IChIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10pKTtcclxuXHRcdFx0ZGVjbGFyZSBwcmVmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50LCBtb2RlOiBNb2RlKSA9PiBzdHJpbmc7XHJcblx0XHRcdGRlY2xhcmUgcG9zdGZpeD86IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUpID0+IHN0cmluZztcclxuXHRcdFx0ZGVjbGFyZSBwcmVmaXhBdHRyaWJ1dGU6IHN0cmluZztcclxuXHRcdFx0ZGVjbGFyZSBwb3N0Zml4QXR0cmlidXRlOiBzdHJpbmc7XHJcblx0XHRcdGRlY2xhcmUgYWxsOiBib29sZWFuO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogUHJlZml4ZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLW1vZGlmaWVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdGRhdGEudGFyZ2V0ID8/PSBlID0+IGU7XHJcblx0XHRcdFx0ZGF0YS5wcmVmaXhBdHRyaWJ1dGUgPz89ICdlZi1wcmVmaXgnO1xyXG5cdFx0XHRcdGRhdGEucG9zdGZpeEF0dHJpYnV0ZSA/Pz0gJ2VmLXBvc3RmaXgnO1xyXG5cdFx0XHRcdGRhdGEuYWxsID8/PSBmYWxzZTtcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSB7XHJcblx0XHRcdFx0bGV0IHRhcmdldHMgPSB0aGlzLmdldFRhcmdldHMoZWwsIGRhdGEpO1xyXG5cdFx0XHRcdGlmICh0aGlzLnByZWZpeCkge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykge1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRzLm1hcChlID0+IGUucmVtb3ZlQXR0cmlidXRlKHRoaXMucHJlZml4QXR0cmlidXRlKSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsZXQgdmFsdWUgPSB0aGlzLnByZWZpeChkYXRhLCBlbCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0XHRcdFx0dGFyZ2V0cy5tYXAoZSA9PiBlLnNldEF0dHJpYnV0ZSh0aGlzLnByZWZpeEF0dHJpYnV0ZSwgdmFsdWUpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMucG9zdGZpeCkge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykge1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRzLm1hcChlID0+IGUucmVtb3ZlQXR0cmlidXRlKHRoaXMucG9zdGZpeEF0dHJpYnV0ZSkpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gdGhpcy5wb3N0Zml4KGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRzLm1hcChlID0+IGUuc2V0QXR0cmlidXRlKHRoaXMucG9zdGZpeEF0dHJpYnV0ZSwgdmFsdWUpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGdldFRhcmdldHMoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBEYXRhKTogSFRNTEVsZW1lbnRbXSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnRhcmdldCA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuYWxsKSByZXR1cm4gZWwucXEodGhpcy50YXJnZXQpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIFtlbC5xKHRoaXMudGFyZ2V0KV07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGxldCB0YXJnZXRzID0gdGhpcy50YXJnZXQoZWwsIGRhdGEsIHRoaXMubW9kZSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gQXJyYXkuaXNBcnJheSh0YXJnZXRzKSA/IHRhcmdldHMgOiBbdGFyZ2V0c107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRW50cnlGaWx0ZXJlckV4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFNvcnRlcjxEYXRhLCBWIGV4dGVuZHMgbnVtYmVyIHwgc3RyaW5nPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElTb3J0ZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIHNvcnRlcjogU29ydGVyRm48RGF0YSwgVj47XHJcblx0XHRcdGRlY2xhcmUgY29tcGFyYXRvcjogKGE6IFYsIGI6IFYpID0+IG51bWJlcjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IFNvcnRlclNvdXJjZTxEYXRhLCBWPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtc29ydGVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdGRhdGEuY29tcGFyYXRvciA/Pz0gKGE6IFYsIGI6IFYpID0+IGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0b2dnbGVNb2RlKG1vZGU6IE1vZGUsIGZvcmNlID0gZmFsc2UpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09IG1vZGUgJiYgIWZvcmNlKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy5wYXJlbnQubW92ZVRvVG9wKHRoaXMpO1xyXG5cdFx0XHRcdHN1cGVyLnRvZ2dsZU1vZGUobW9kZSwgZm9yY2UpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzb3J0KGxpc3Q6IFtEYXRhLCBIVE1MRWxlbWVudF1bXSk6IFtEYXRhLCBIVE1MRWxlbWVudF1bXSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykgcmV0dXJuIGxpc3Q7XHJcblx0XHRcdFx0cmV0dXJuIGxpc3QudnNvcnQoKFtkYXRhLCBlbF06IFtEYXRhLCBIVE1MRWxlbWVudF0pID0+IHRoaXMuYXBwbHkoZGF0YSwgZWwpLCAoYTogViwgYjogVikgPT4gdGhpcy5jb21wYXJlKGEsIGIpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyoqIHJldHVybnMgb3JkZXIgb2YgZW50cnkgKi9cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogViB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuc29ydGVyKGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb21wYXJlKGE6IFYsIGI6IFYpOiBudW1iZXIge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29uJykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29tcGFyYXRvcihhLCBiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb3Bwb3NpdGUnKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb21wYXJhdG9yKGIsIGEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHRcdGV4cG9ydCB0eXBlIFdheW5lc3MgPSBmYWxzZSB8IHRydWUgfCAnZGlyJztcclxuXHRcdGV4cG9ydCB0eXBlIE1vZGUgPSAnb2ZmJyB8ICdvbicgfCAnb3Bwb3NpdGUnO1xyXG5cclxuXHRcdGV4cG9ydCB0eXBlIFBhcnNlckZuPERhdGE+ID0gKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogUGFydGlhbDxEYXRhPikgPT4gUGFydGlhbDxEYXRhPiB8IHZvaWQgfCBQcm9taXNlTGlrZTxQYXJ0aWFsPERhdGEgfCB2b2lkPj47XHJcblx0XHRleHBvcnQgdHlwZSBGaWx0ZXJGbjxEYXRhPiA9IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUpID0+IGJvb2xlYW47XHJcblx0XHRleHBvcnQgdHlwZSBTb3J0ZXJGbjxEYXRhLCBWPiA9IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUpID0+IFY7XHJcblx0XHRleHBvcnQgdHlwZSBNb2RpZmllckZuPERhdGE+ID0gKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSwgb2xkTW9kZTogTW9kZSB8IG51bGwpID0+IHZvaWQ7XHJcblx0XHRleHBvcnQgdHlwZSBWYWx1ZUZpbHRlckZuPERhdGEsIFY+ID0gKHZhbHVlOiBWLCBkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IGJvb2xlYW47XHJcblx0XHRleHBvcnQgdHlwZSBQcmVmaXhlckZuPERhdGE+ID0gKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSkgPT4gc3RyaW5nO1xyXG5cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgSUZpbHRlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiB7XHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW47XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIElTb3J0ZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4ge1xyXG5cdFx0XHRzb3J0KGxpc3Q6IFtEYXRhLCBIVE1MRWxlbWVudF1bXSk6IFtEYXRhLCBIVE1MRWxlbWVudF1bXTtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgSU1vZGlmaWVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IHtcclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogdm9pZDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdGJ1dHRvbj86IHNlbGVjdG9yO1xyXG5cdFx0XHRpZDogc3RyaW5nO1xyXG5cdFx0XHRuYW1lPzogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbj86IHN0cmluZztcclxuXHRcdFx0dGhyZWVXYXk/OiBXYXluZXNzO1xyXG5cdFx0XHRtb2RlPzogTW9kZTtcclxuXHRcdFx0cGFyZW50OiBFbnRyeUZpbHRlcmVyO1xyXG5cdFx0XHRpbmNvbXBhdGlibGU/OiBzdHJpbmdbXTtcclxuXHRcdFx0aGlkZGVuPzogYm9vbGVhbjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyU291cmNlPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0ZmlsdGVyOiBGaWx0ZXJGbjxEYXRhPjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgVmFsdWVGaWx0ZXJTb3VyY2U8RGF0YSwgVj4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1Tb3VyY2Uge1xyXG5cdFx0XHRmaWx0ZXI6IFZhbHVlRmlsdGVyRm48RGF0YSwgVj47XHJcblx0XHRcdGlucHV0OiBWO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBNYXRjaEZpbHRlclNvdXJjZTxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdHZhbHVlPzogKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkgPT4gc3RyaW5nO1xyXG5cdFx0XHRpbnB1dD86IHN0cmluZztcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgU29ydGVyU291cmNlPERhdGEsIFY+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0c29ydGVyOiBTb3J0ZXJGbjxEYXRhLCBWPjtcclxuXHRcdFx0Y29tcGFyYXRvcj86ICgoYTogViwgYjogVikgPT4gbnVtYmVyKSB8IFY7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIE1vZGlmaWVyU291cmNlPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0bW9kaWZpZXI6IE1vZGlmaWVyRm48RGF0YT47XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFByZWZpeGVyU291cmNlPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0dGFyZ2V0Pzogc2VsZWN0b3IgfCAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogRGF0YSwgbW9kZTogTW9kZSkgPT4gSFRNTEVsZW1lbnQpO1xyXG5cdFx0XHRwcmVmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHBvc3RmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHByZWZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0cG9zdGZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0YWxsPzogYm9vbGVhbjtcclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyZXJJdGVtUGFydGlhbCB7XHJcblx0XHRcdGJ1dHRvbj86IHNlbGVjdG9yO1xyXG5cdFx0XHRpZD86IHN0cmluZztcclxuXHRcdFx0bmFtZT86IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcblx0XHRcdHRocmVlV2F5PzogV2F5bmVzcztcclxuXHRcdFx0bW9kZT86IE1vZGU7XHJcblx0XHRcdGluY29tcGF0aWJsZT86IHN0cmluZ1tdO1xyXG5cdFx0XHRoaWRkZW4/OiBib29sZWFuO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBGaWx0ZXJQYXJ0aWFsPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCB7IH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgVmFsdWVGaWx0ZXJQYXJ0aWFsPERhdGEsIFY+IGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCB7XHJcblx0XHRcdGlucHV0OiBWO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBTb3J0ZXJQYXJ0aWFsU291cmNlPERhdGEsIFY+IGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCB7XHJcblx0XHRcdGNvbXBhcmF0b3I/OiAoKGE6IFYsIGI6IFYpID0+IG51bWJlcikgfCBWO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBNb2RpZmllclBhcnRpYWw8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1QYXJ0aWFsIHsgfVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBQcmVmaXhlclBhcnRpYWw8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1QYXJ0aWFsIHtcclxuXHRcdFx0dGFyZ2V0Pzogc2VsZWN0b3IgfCAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogRGF0YSwgbW9kZTogTW9kZSkgPT4gSFRNTEVsZW1lbnQpO1xyXG5cdFx0XHRwcmVmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHBvc3RmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHByZWZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0cG9zdGZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0YWxsPzogYm9vbGVhbjtcclxuXHRcdH1cclxuXHJcblx0XHR0eXBlIFVuaW9uPFNvdXJjZSwgUmVzdWx0PiA9IHtcclxuXHRcdFx0W1AgaW4ga2V5b2YgU291cmNlICYga2V5b2YgUmVzdWx0XTogU291cmNlW1BdIHwgUmVzdWx0W1BdO1xyXG5cdFx0fSAmIE9taXQ8U291cmNlLCBrZXlvZiBSZXN1bHQ+ICYgT21pdDxSZXN1bHQsIGtleW9mIFNvdXJjZT47XHJcblxyXG5cdFx0dHlwZSBPdmVycmlkZTxULCBPPiA9IE9taXQ8VCwga2V5b2YgTz4gJiBPO1xyXG5cclxuXHRcdHR5cGUgRUZTb3VyY2U8VCBleHRlbmRzIHsgc291cmNlOiBhbnkgfT4gPSBPdmVycmlkZTxPdmVycmlkZTxQYXJ0aWFsPFQ+LCBUWydzb3VyY2UnXT4sIHsgYnV0dG9uPzogc2VsZWN0b3IgfT47XHJcblxyXG5cdFx0dHlwZSBTb3VyY2U8VCBleHRlbmRzIHsgc291cmNlOiBhbnkgfT4gPSBUWydzb3VyY2UnXSAmIHtcclxuXHRcdFx0aWQ/OiBzdHJpbmc7IG5hbWU/OiBzdHJpbmc7IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG5cdFx0XHR0aHJlZVdheT86IFdheW5lc3M7IG1vZGU/OiBNb2RlOyBpbmNvbXBhdGlibGU/OiBzdHJpbmdbXTsgaGlkZGVuPzogYm9vbGVhbjtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogY2FuIGJlIGVpdGhlciBNYXAgb3IgV2Vha01hcFxyXG5cdFx0ICogKFdlYWtNYXAgaXMgbGlrZWx5IHRvIGJlIHVzZWxlc3MgaWYgdGhlcmUgYXJlIGxlc3MgdGhlbiAxMGsgb2xkIG5vZGVzIGluIG1hcClcclxuXHRcdCAqL1xyXG5cdFx0bGV0IE1hcFR5cGUgPSBNYXA7XHJcblx0XHR0eXBlIE1hcFR5cGU8SyBleHRlbmRzIG9iamVjdCwgVj4gPS8vIE1hcDxLLCBWPiB8IFxyXG5cdFx0XHRXZWFrTWFwPEssIFY+O1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGxldCBFRiA9IEVudHJ5RmlsdGVyZXJFeHRlbnNpb24uRW50cnlGaWx0ZXJlcjtcclxufSIsIlxyXG5cclxubmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cclxuXHRleHBvcnQgY2xhc3MgU2Nyb2xsSW5mbyB7XHJcblx0XHRlbDogSFRNTEVsZW1lbnQ7XHJcblx0XHQvKiogYWJzb2x1dGUgcmVjdCAqL1xyXG5cdFx0cmVjdDogRE9NUmVjdDtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihlbDogSFRNTEVsZW1lbnQpIHtcclxuXHRcdFx0dGhpcy5lbCA9IGVsO1xyXG5cdFx0XHRsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRmdW5jdGlvbiBuKHY6IG51bWJlcikgeyByZXR1cm4gK3YudG9GaXhlZCgzKTsgfVxyXG5cdFx0XHR0aGlzLnJlY3QgPSBuZXcgRE9NUmVjdChcclxuXHRcdFx0XHRuKHJlY3QueCAvIGlubmVyV2lkdGgpLCBuKChyZWN0LnkgKyBzY3JvbGxZKSAvIGlubmVySGVpZ2h0KSxcclxuXHRcdFx0XHRuKHJlY3Qud2lkdGggLyBpbm5lcldpZHRoKSwgbihyZWN0LmhlaWdodCAvIGlubmVySGVpZ2h0KSk7XHJcblx0XHR9XHJcblx0XHR0b3BPZmZzZXQoc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZKSB7XHJcblx0XHRcdGxldCB3aW5kb3dZID0gc2Nyb2xsWSAvIGlubmVySGVpZ2h0O1xyXG5cdFx0XHRsZXQgb2Zmc2V0ID0gdGhpcy5yZWN0LnRvcCAtIHdpbmRvd1k7XHJcblx0XHRcdHJldHVybiArb2Zmc2V0LnRvRml4ZWQoMyk7XHJcblx0XHR9XHJcblx0XHRjZW50ZXJPZmZzZXQoc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZKSB7XHJcblx0XHRcdGxldCB3aW5kb3dZID0gc2Nyb2xsWSAvIGlubmVySGVpZ2h0ICsgMC41O1xyXG5cdFx0XHRsZXQgb2Zmc2V0ID0gdGhpcy5yZWN0LnRvcCArIHRoaXMucmVjdC5oZWlnaHQgLyAyIC0gd2luZG93WTtcclxuXHRcdFx0cmV0dXJuICtvZmZzZXQudG9GaXhlZCgzKTtcclxuXHRcdH1cclxuXHRcdGJvdHRvbU9mZnNldChzY3JvbGxZID0gd2luZG93LnNjcm9sbFkpIHtcclxuXHRcdFx0bGV0IHdpbmRvd1kgPSBzY3JvbGxZIC8gaW5uZXJIZWlnaHQgKyAxO1xyXG5cdFx0XHRsZXQgb2Zmc2V0ID0gdGhpcy5yZWN0LmJvdHRvbSAtIHdpbmRvd1k7XHJcblx0XHRcdHJldHVybiArb2Zmc2V0LnRvRml4ZWQoMyk7XHJcblx0XHR9XHJcblx0XHRkaXN0YW5jZUZyb21TY3JlZW4oc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZKSB7XHJcblx0XHRcdGxldCB3aW5kb3dZID0gc2Nyb2xsWSAvIGlubmVySGVpZ2h0O1xyXG5cdFx0XHRpZiAodGhpcy5yZWN0LmJvdHRvbSA8IHdpbmRvd1kgLSAwLjAwMDEpIHJldHVybiB0aGlzLnJlY3QuYm90dG9tIC0gd2luZG93WTtcclxuXHRcdFx0aWYgKHRoaXMucmVjdC50b3AgPiB3aW5kb3dZICsgMS4wMDEpIHJldHVybiB0aGlzLnJlY3QudG9wIC0gd2luZG93WSAtIDE7XHJcblx0XHR9XHJcblxyXG5cdFx0Z2V0IGZ1bGxEaXIoKSB7XHJcblx0XHRcdGlmICh0aGlzLnRvcE9mZnNldCgpIDwgLTAuMDAxKVxyXG5cdFx0XHRcdHJldHVybiAtMTtcclxuXHRcdFx0aWYgKHRoaXMuYm90dG9tT2Zmc2V0KCkgPiAwLjAwMSlcclxuXHRcdFx0XHRyZXR1cm4gMTtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRnZXQgX29mZnNldHMoKSB7XHJcblx0XHRcdHJldHVybiBbdGhpcy50b3BPZmZzZXQoKSwgdGhpcy5jZW50ZXJPZmZzZXQoKSwgdGhpcy5ib3R0b21PZmZzZXQoKV07XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGNsYXNzIEltYWdlU2Nyb2xsZXIge1xyXG5cdFx0c2VsZWN0b3IgPSAnaW1nJztcclxuXHJcblx0XHRlbmFibGVkID0gZmFsc2U7XHJcblx0XHRsaXN0ZW5lcj86IGFueTtcclxuXHJcblx0XHRzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihzZWxlY3RvciA9ICcnKSB7XHJcblx0XHRcdGlmIChzZWxlY3RvcikgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xyXG5cdFx0fVxyXG5cclxuXHRcdF93aGVlbExpc3RlbmVyPzogKGV2ZW50OiBXaGVlbEV2ZW50KSA9PiB2b2lkO1xyXG5cdFx0b25XaGVlbFNjcm9sbEZhaWxlZD86IChldmVudDogV2hlZWxFdmVudCkgPT4gdm9pZDtcclxuXHRcdGJpbmRXaGVlbCgpIHtcclxuXHRcdFx0aWYgKHRoaXMuX3doZWVsTGlzdGVuZXIpIHJldHVybjtcclxuXHRcdFx0bGV0IGwgPSB0aGlzLl93aGVlbExpc3RlbmVyID0gKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX3doZWVsTGlzdGVuZXIgIT0gbCkgcmV0dXJuIHJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgbCk7XHJcblx0XHRcdFx0aWYgKCF0aGlzLmVuYWJsZWQpIHJldHVybjtcclxuXHRcdFx0XHRpZiAoIWV2ZW50LmRlbHRhWSkgcmV0dXJuO1xyXG5cdFx0XHRcdGlmIChldmVudC5zaGlmdEtleSB8fCBldmVudC5jdHJsS2V5KSByZXR1cm47XHJcblx0XHRcdFx0aWYgKHRoaXMuc2Nyb2xsKE1hdGguc2lnbihldmVudC5kZWx0YVkpKSkge1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdHRoaXMuc3RvcFByb3BhZ2F0aW9uICYmIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm9uV2hlZWxTY3JvbGxGYWlsZWQ/LihldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5fd2hlZWxMaXN0ZW5lciwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcclxuXHRcdH1cclxuXHRcdF9hcnJvd0xpc3RlbmVyPzogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkO1xyXG5cdFx0YmluZEFycm93cygpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2Fycm93TGlzdGVuZXIpIHJldHVybjtcclxuXHRcdFx0dGhpcy5fYXJyb3dMaXN0ZW5lciA9IChldmVudCkgPT4ge1xyXG5cdFx0XHRcdGlmICghdGhpcy5lbmFibGVkKSByZXR1cm47XHJcblx0XHRcdFx0aWYgKGV2ZW50LmNvZGUgPT0gJ0Fycm93TGVmdCcpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnNjcm9sbCgtMSkpIHtcclxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5zdG9wUHJvcGFnYXRpb24gJiYgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChldmVudC5jb2RlID09ICdBcnJvd1JpZ2h0Jykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuc2Nyb2xsKDEpKSB7XHJcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3RvcFByb3BhZ2F0aW9uICYmIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2Fycm93TGlzdGVuZXIsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvKiogZW5hYmxlIHRoaXMgc2Nyb2xsZXIgKi9cclxuXHRcdG9uKHNlbGVjdG9yID0gJycpOiB0aGlzIHtcclxuXHRcdFx0aWYgKHNlbGVjdG9yKSB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XHJcblx0XHRcdHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuYmluZEFycm93cygpO1xyXG5cdFx0XHR0aGlzLmJpbmRXaGVlbCgpO1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHJcblx0XHQvKiogZGlzYWJsZSB0aGlzIHNjcm9sbGVyICovXHJcblx0XHRvZmYoc2VsZWN0b3IgPSAnJyk6IHRoaXMge1xyXG5cdFx0XHRpZiAoc2VsZWN0b3IpIHRoaXMuc2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuXHRcdFx0dGhpcy5lbmFibGVkID0gZmFsc2U7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cclxuXHRcdG1vZGU6ICdzaW5nbGUnIHwgJ2dyb3VwJyA9ICdncm91cCc7XHJcblxyXG5cdFx0LyoqIHNjcm9sbCB0byB0aGUgbmV4dCBpdGVtICovXHJcblx0XHRzY3JvbGwoZGlyOiAtMSB8IDAgfCAxKTogYm9vbGVhbiB7XHJcblx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ2dyb3VwJykge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnNjcm9sbFRvTmV4dEdyb3VwKGRpcik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnc2luZ2xlJykge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnNjcm9sbFRvTmV4dENlbnRlcihkaXIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHNjcm9sbFRvTmV4dENlbnRlcihkaXI6IC0xIHwgMCB8IDEpOiBib29sZWFuIHtcclxuXHRcdFx0bGV0IG5leHQgPSB0aGlzLl9uZXh0U2Nyb2xsVGFyZ2V0KGRpciwgJ3NpbmdsZScpO1xyXG5cdFx0XHRpZiAoUG9vcEpzLmRlYnVnKSB7IGNvbnNvbGUubG9nKGBzY3JvbGw6IGAsIG5leHQpOyB9XHJcblx0XHRcdGlmICghbmV4dCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRuZXh0LmVsLnNjcm9sbEludG9WaWV3KHsgYmxvY2s6ICdjZW50ZXInIH0pO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRzY3JvbGxUb05leHRHcm91cChkaXI6IC0xIHwgMCB8IDEpOiBib29sZWFuIHtcclxuXHRcdFx0bGV0IG5leHQgPSB0aGlzLl9uZXh0U2Nyb2xsVGFyZ2V0KGRpciwgJ2dyb3VwJyk7XHJcblx0XHRcdGlmIChQb29wSnMuZGVidWcpIHsgY29uc29sZS5sb2coYHNjcm9sbDogYCwgbmV4dCk7IH1cclxuXHRcdFx0aWYgKCFuZXh0IHx8ICFuZXh0Lmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRsZXQgeSA9IChuZXh0WzBdLnJlY3QudG9wICsgbmV4dC5hdCgtMSkucmVjdC5ib3R0b20gLSAxKSAvIDI7XHJcblx0XHRcdC8vIGZpeG1lXHJcblx0XHRcdGlmIChNYXRoLmFicyhzY3JvbGxZIC8gaW5uZXJIZWlnaHQgLSB5KSA+IDAuNzUwKSB7XHJcblx0XHRcdFx0aWYgKCF0aGlzLmdldEFsbFNjcm9sbHMoKS5maW5kKGUgPT4gZS5mdWxsRGlyID09IDApKSB7XHJcblx0XHRcdFx0XHRpZiAoUG9vcEpzLmRlYnVnKSB7IGNvbnNvbGUubG9nKGBzY3JvbGwgdG9vIGZhcmAsIG5leHQpOyB9XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHNjcm9sbFRvKDAsIHkgKiBpbm5lckhlaWdodCk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdF9uZXh0U2Nyb2xsVGFyZ2V0KGRpcjogLTEgfCAwIHwgMSwgbW9kZTogJ3NpbmdsZScpOiBTY3JvbGxJbmZvIHwgdW5kZWZpbmVkO1xyXG5cdFx0X25leHRTY3JvbGxUYXJnZXQoZGlyOiAtMSB8IDAgfCAxLCBtb2RlOiAnZ3JvdXAnKTogU2Nyb2xsSW5mb1tdIHwgdW5kZWZpbmVkO1xyXG5cdFx0X25leHRTY3JvbGxUYXJnZXQoZGlyOiAtMSB8IDAgfCAxLCBtb2RlOiAnc2luZ2xlJyB8ICdncm91cCcpIHtcclxuXHRcdFx0bGV0IHNjcm9sbHMgPSB0aGlzLmdldEFsbFNjcm9sbHMoKTtcclxuXHRcdFx0aWYgKG1vZGUgPT0gJ3NpbmdsZScpIHtcclxuXHRcdFx0XHRpZiAoZGlyID09IC0xKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gc2Nyb2xscy5maW5kTGFzdChlID0+IGUuZnVsbERpciA9PSAtMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChkaXIgPT0gMCkge1xyXG5cdFx0XHRcdFx0bGV0IGxpc3QgPSBzY3JvbGxzLmZpbHRlcihlID0+IGUuZnVsbERpciA9PSAwKTtcclxuXHRcdFx0XHRcdHJldHVybiBsaXN0W35+KGxpc3QubGVuZ3RoIC8gMildO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZGlyID09IDEpIHtcclxuXHRcdFx0XHRcdHJldHVybiBzY3JvbGxzLmZpbmQoZSA9PiBlLmZ1bGxEaXIgPT0gMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChtb2RlID09ICdncm91cCcpIHtcclxuXHRcdFx0XHRpZiAoZGlyID09IC0xKSB7XHJcblx0XHRcdFx0XHRsZXQgbGFzdCA9IHNjcm9sbHMuZmluZExhc3QoZSA9PiBlLmZ1bGxEaXIgPT0gLTEpO1xyXG5cdFx0XHRcdFx0aWYgKCFsYXN0KSByZXR1cm47XHJcblx0XHRcdFx0XHRyZXR1cm4gc2Nyb2xscy5maWx0ZXIoZSA9PiBNYXRoLmFicyhlLnJlY3QudG9wIC0gbGFzdC5yZWN0LmJvdHRvbSkgPD0gMS4wMDEgJiYgZS5mdWxsRGlyID09IC0xKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGRpciA9PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gc2Nyb2xscy5maWx0ZXIoZSA9PiBlLmZ1bGxEaXIgPT0gMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChkaXIgPT0gMSkge1xyXG5cdFx0XHRcdFx0bGV0IGxhc3QgPSBzY3JvbGxzLmZpbmQoZSA9PiBlLmZ1bGxEaXIgPT0gMSk7XHJcblx0XHRcdFx0XHRpZiAoIWxhc3QpIHJldHVybjtcclxuXHRcdFx0XHRcdHJldHVybiBzY3JvbGxzLmZpbHRlcihlID0+IE1hdGguYWJzKGxhc3QucmVjdC50b3AgLSBlLnJlY3QuYm90dG9tKSA8PSAxLjAwMSAmJiBlLmZ1bGxEaXIgPT0gMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGdldEFsbFNjcm9sbHMoKSB7XHJcblx0XHRcdHJldHVybiBxcSh0aGlzLnNlbGVjdG9yKS5tYXAoZSA9PiBuZXcgU2Nyb2xsSW5mbyhlKSkudnNvcnQoZSA9PiBlLmNlbnRlck9mZnNldCgpKTtcclxuXHRcdH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdFx0LyoqIHVzZWQgICovXHJcblx0XHRhc3luYyBrZWVwKHJlc2l6ZXI6ICgpID0+IGFueSB8IFByb21pc2U8YW55PiwgcmFmID0gZmFsc2UpIHtcclxuXHRcdFx0bGV0IHBvcyA9IHRoaXMuc2F2ZSgpO1xyXG5cdFx0XHRhd2FpdCByZXNpemVyKCk7XHJcblx0XHRcdHBvcy5yZXN0b3JlKCk7XHJcblx0XHRcdGlmIChyYWYpIHtcclxuXHRcdFx0XHRhd2FpdCBQcm9taXNlLmZyYW1lKCk7XHJcblx0XHRcdFx0cG9zLnJlc3RvcmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8qKiBzYXZlIGN1cnJlbnQgaXRlbSBzY3JvbGwgcG9zaXRpb24gKi9cclxuXHRcdHNhdmUoKTogeyBpbmZvOiBTY3JvbGxJbmZvLCBvZmZzZXQ6IG51bWJlciwgcmVzdG9yZSgpOiB2b2lkIH0ge1xyXG5cdFx0XHRsZXQgc2Nyb2xscyA9IHRoaXMuZ2V0QWxsU2Nyb2xscygpO1xyXG5cdFx0XHRpZiAoIXNjcm9sbHMubGVuZ3RoKSB7XHJcblx0XHRcdFx0cmV0dXJuIHsgaW5mbzogdW5kZWZpbmVkIGFzIGFueSwgb2Zmc2V0OiAtMSwgcmVzdG9yZTogKCkgPT4geyB9IH07XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGluZm8gPSBzY3JvbGxzLnZzb3J0KGUgPT4gTWF0aC5hYnMoZS5jZW50ZXJPZmZzZXQoKSkpWzBdO1xyXG5cdFx0XHRsZXQgb2Zmc2V0ID0gaW5mby5jZW50ZXJPZmZzZXQoKTtcclxuXHRcdFx0ZnVuY3Rpb24gcmVzdG9yZSgpIHtcclxuXHRcdFx0XHRsZXQgbmV3SW5mbyA9IG5ldyBTY3JvbGxJbmZvKGluZm8uZWwpO1xyXG5cdFx0XHRcdGxldCBuZXdPZmZzZXQgPSBuZXdJbmZvLmNlbnRlck9mZnNldCgpO1xyXG5cdFx0XHRcdHNjcm9sbFRvKDAsIHNjcm9sbFkgKyAobmV3T2Zmc2V0IC0gb2Zmc2V0KSAqIGlubmVySGVpZ2h0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4geyBpbmZvLCBvZmZzZXQsIHJlc3RvcmUgfTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0c3RhdGljIGNyZWF0ZURlZmF1bHQoKTogSW1hZ2VTY3JvbGxlciB7XHJcblx0XHRcdHJldHVybiBuZXcgSW1hZ2VTY3JvbGxlcigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGRlY2xhcmUgbGV0IGlzOiBJbWFnZVNjcm9sbGVyO1xyXG5cclxuXHRkZWZpbmVMYXp5KFBvb3BKcywgJ2lzJywgKCkgPT4gSW1hZ2VTY3JvbGxlci5jcmVhdGVEZWZhdWx0KCkpO1xyXG5cclxuXHJcblx0ZnVuY3Rpb24gZGVmaW5lTGF6eTxULCBLIGV4dGVuZHMga2V5b2YgVCwgViBleHRlbmRzIFRbS10+KFxyXG5cdFx0dGFyZ2V0OiBULCBwcm9wOiBLLCBnZXQ6ICh0aGlzOiB2b2lkKSA9PiBWXHJcblx0KSB7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCB7XHJcblx0XHRcdGdldDogKCkgPT4ge1xyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3AsIHtcclxuXHRcdFx0XHRcdHZhbHVlOiBnZXQoKSxcclxuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiB0YXJnZXRbcHJvcF07XHJcblx0XHRcdH0sXHJcblx0XHRcdHNldCh2KSB7XHJcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcCwge1xyXG5cdFx0XHRcdFx0dmFsdWU6IHYsXHJcblx0XHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcblx0XHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gdGFyZ2V0W3Byb3BdO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGNvbnN0IHZhcnMgPSB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBzdHJpbmc+O1xyXG5cdGV4cG9ydCBjb25zdCBzdHlsZVZhcnMgPSBuZXcgUHJveHkodmFycyBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCB7XHJcblx0XHRnZXQodGFyZ2V0LCBwcm9wOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdFx0XHRpZiAocHJvcC5zdGFydHNXaXRoKCctLScpKSBwcm9wID0gcHJvcC5zbGljZSgyKTtcclxuXHRcdFx0bGV0IHN0eWxlID0gZG9jdW1lbnQuYm9keS5zdHlsZTtcclxuXHRcdFx0bGV0IHYgPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCctLScgKyBwcm9wKTtcclxuXHRcdFx0dGFyZ2V0W3Byb3BdID0gdjtcclxuXHRcdFx0cmV0dXJuIHY7XHJcblx0XHR9LFxyXG5cdFx0c2V0KHRhcmdldCwgcHJvcDogc3RyaW5nLCB2OiBzdHJpbmcpOiB0cnVlIHtcclxuXHRcdFx0aWYgKHByb3Auc3RhcnRzV2l0aCgnLS0nKSkgcHJvcCA9IHByb3Auc2xpY2UoMik7XHJcblx0XHRcdGxldCBzdHlsZSA9IGRvY3VtZW50LmJvZHkuc3R5bGU7XHJcblx0XHRcdHRhcmdldFtwcm9wXSA9IHY7XHJcblx0XHRcdHN0eWxlLnNldFByb3BlcnR5KCctLScgKyBwcm9wLCB2ICsgJycpO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0sXHJcblx0fSk7XHJcblx0ZXhwb3J0IGNvbnN0IHN0eWxlVmFyc04gPSBuZXcgUHJveHkodmFycyBhcyBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+LCB7XHJcblx0XHRnZXQodGFyZ2V0LCBwcm9wOiBzdHJpbmcpOiBudW1iZXIge1xyXG5cdFx0XHRpZiAocHJvcC5zdGFydHNXaXRoKCctLScpKSBwcm9wID0gcHJvcC5zbGljZSgyKTtcclxuXHRcdFx0bGV0IHN0eWxlID0gZG9jdW1lbnQuYm9keS5zdHlsZTtcclxuXHRcdFx0bGV0IHY6IHN0cmluZyA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJy0tJyArIHByb3ApO1xyXG5cdFx0XHRyZXR1cm4gK3Y7XHJcblx0XHR9LFxyXG5cdFx0c2V0KHRhcmdldCwgcHJvcDogc3RyaW5nLCB2OiBudW1iZXIpOiB0cnVlIHtcclxuXHRcdFx0aWYgKHByb3Auc3RhcnRzV2l0aCgnLS0nKSkgcHJvcCA9IHByb3Auc2xpY2UoMik7XHJcblx0XHRcdGxldCBzdHlsZSA9IGRvY3VtZW50LmJvZHkuc3R5bGU7XHJcblx0XHRcdHRhcmdldFtwcm9wXSA9ICt2O1xyXG5cdFx0XHRzdHlsZS5zZXRQcm9wZXJ0eSgnLS0nICsgcHJvcCwgdiArICcnKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9LFxyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuIiwiIl19