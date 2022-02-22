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
            let p = new Promise((r, j) => {
                resolve = r;
                reject = j;
            });
            p.resolve = p.r = resolve;
            p.reject = p.j = reject;
            return p;
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
        const empty = PoopJs.PromiseExtension.empty;
        function pmap2raw(data) {
            data.result ??= Array(data.source.length);
            data.requests = data.result.map(() => empty());
            data.threads ??= 5;
            data.window ??= Infinity;
            data.completed = 0;
            data.length = data.source.length;
            data.activeThreads = 0;
            data.lastStarted = 0;
            if (data.threads <= 0)
                throw new Error();
            let allDone = empty();
            data.then = allDone.then.bind(allDone);
            let anyResolved = empty();
            async function runOne(i) {
                data.activeThreads++;
                data.beforeStart?.(data.source[i], i, data.source, data);
                data.lastStarted = i;
                let v = await data.mapper(data.source[i], i, data.source, data).catch(e => e);
                data.afterComplete?.(data.source[i], i, data.source, data);
                data.activeThreads--;
                anyResolved.resolve(null);
            }
            async function run() {
                for (let i = 0; i < data.length; i++) {
                    while (data.activeThreads < data.threads)
                        await anyResolved;
                    anyResolved = empty();
                    runOne(i);
                }
            }
            return data;
        }
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
                let earliestUpdate = this._previousState.finishedAt + Math.min(1000, 8 * this._previousState.updateDuration);
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
                this._previousState.updateDuration = timeUsed;
                this._previousState.finishedAt = performance.now();
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
        PoopJs.ObjectExtension.defineValue(window.Array.prototype, 'pmap', PoopJs.ArrayExtension.pmap);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3Bvb3Bqcy9Qcm9taXNlLnRzIiwiLi4vcG9vcGpzL0FycmF5LnRzIiwiLi4vcG9vcGpzL0RhdGVOb3dIYWNrLnRzIiwiLi4vcG9vcGpzL09iamVjdC50cyIsIi4uL3Bvb3Bqcy9lbGVtZW50LnRzIiwiLi4vcG9vcGpzL2VsbS50cyIsIi4uL3Bvb3Bqcy9ldGMudHMiLCIuLi9wb29wanMvZmV0Y2gudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvRW50aXR5RmlsdGVyZXIudHMiLCIuLi9wb29wanMvb2JzZXJ2ZXIudHMiLCIuLi9wb29wanMvUGFnaW5hdGUvUGFnaW5hdGlvbi50cyIsIi4uL3Bvb3Bqcy9QYWdpbmF0ZS9JbWFnZVNjcm9sbGluZy50cyIsIi4uL3Bvb3Bqcy9pbml0LnRzIiwiLi4vcG9vcGpzL3R5cGVzLnRzIiwiLi4vcG9vcGpzL0ZpbHRlcmVyL0ZpbHRlcmVySXRlbS50cyIsIi4uL3Bvb3Bqcy9GaWx0ZXJlci9GaWx0ZXIudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvTW9kaWZpZXIudHMiLCIuLi9wb29wanMvRmlsdGVyZXIvU29ydGVyLnRzIiwiLi4vcG9vcGpzL0ZpbHRlcmVyL3R5cGVzLnRzIiwiLi4vcG9vcGpzL1BhZ2luYXRlL21vZGlmaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLE1BQU0sQ0F1Q2Y7QUF2Q0QsV0FBVSxNQUFNO0lBRWYsSUFBaUIsZ0JBQWdCLENBbUNoQztJQW5DRCxXQUFpQixnQkFBZ0I7UUFjaEM7O1dBRUc7UUFDSCxTQUFnQixLQUFLO1lBQ3BCLElBQUksT0FBMkIsQ0FBQztZQUNoQyxJQUFJLE1BQThCLENBQUM7WUFDbkMsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQy9CLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ1osTUFBTSxHQUFHLENBQUMs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QyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekIsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQztR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LE9BQU8sR0FBRyxHQUFHLENBQUM7SUFHbkIsQ0FBQyxFQTVHZ0Isc0JBQXNCLEdBQXRCLDZCQUFzQixLQUF0Qiw2QkFBc0IsUUE0R3RDO0lBRVUsU0FBRSxHQUFHLHNCQUFzQixDQUFDLGFBQWEsQ0FBQztBQUN0RCxDQUFDLEVBakhTLE1BQU0sS0FBTixNQUFNLFFBaUhmIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgUHJvbWlzZUV4dGVuc2lvbiB7XHJcblx0XHQvLyB0eXBlIFVud3JhcHBlZFByb21pc2U8VD4gPSBQcm9taXNlPFQ+ICYge1xyXG5cdFx0Ly8gXHRyZXNvbHZlOiAodmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPikgPT4gdm9pZDtcclxuXHRcdC8vIFx0cmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xyXG5cdFx0Ly8gXHRyOiAodmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPikgPT4gdm9pZDtcclxuXHRcdC8vIFx0ajogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcclxuXHRcdC8vIH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgVW53cmFwcGVkUHJvbWlzZTxUPiBleHRlbmRzIFByb21pc2U8VD4ge1xyXG5cdFx0XHRyZXNvbHZlOiAodmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPikgPT4gdm9pZDtcclxuXHRcdFx0cmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xyXG5cdFx0XHRyOiAodmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPikgPT4gdm9pZDtcclxuXHRcdFx0ajogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENyZWF0ZXMgdW53cmFwcGVkIHByb21pc2VcclxuXHRcdCAqL1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVtcHR5PFQ+KCkge1xyXG5cdFx0XHRsZXQgcmVzb2x2ZTogKHZhbHVlOiBUKSA9PiB2b2lkO1xyXG5cdFx0XHRsZXQgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xyXG5cdFx0XHRsZXQgcCA9IG5ldyBQcm9taXNlPFQ+KChyLCBqKSA9PiB7XHJcblx0XHRcdFx0cmVzb2x2ZSA9IHI7XHJcblx0XHRcdFx0cmVqZWN0ID0gajtcclxuXHRcdFx0fSkgYXMgVW53cmFwcGVkUHJvbWlzZTxUPjtcclxuXHRcdFx0cC5yZXNvbHZlID0gcC5yID0gcmVzb2x2ZTtcclxuXHRcdFx0cC5yZWplY3QgPSBwLmogPSByZWplY3Q7XHJcblx0XHRcdHJldHVybiBwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBmcmFtZShuID0gMSk6IFByb21pc2U8bnVtYmVyPiB7XHJcblx0XHRcdHdoaWxlICgtLW4gPiAwKSB7XHJcblx0XHRcdFx0YXdhaXQgbmV3IFByb21pc2UocmVxdWVzdEFuaW1hdGlvbkZyYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVxdWVzdEFuaW1hdGlvbkZyYW1lKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1Byb21pc2UudHNcIiAvPlxyXG5uYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIEFycmF5RXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gcG1hcDxULCBWPih0aGlzOiBUW10sIG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgYTogVFtdKSA9PiBQcm9taXNlPFY+IHwgViwgdGhyZWFkcyA9IDUpOiBQcm9taXNlPFZbXT4ge1xyXG5cdFx0XHRpZiAoISh0aHJlYWRzID4gMCkpIHRocm93IG5ldyBFcnJvcigpO1xyXG5cdFx0XHRsZXQgdGFza3M6IFtULCBudW1iZXIsIFRbXV1bXSA9IHRoaXMubWFwKChlLCBpLCBhKSA9PiBbZSwgaSwgYV0pO1xyXG5cdFx0XHRsZXQgcmVzdWx0cyA9IEFycmF5PFY+KHRhc2tzLmxlbmd0aCk7XHJcblx0XHRcdGxldCBhbnlSZXNvbHZlZCA9IFByb21pc2VFeHRlbnNpb24uZW1wdHkoKTtcclxuXHRcdFx0bGV0IGZyZWVUaHJlYWRzID0gdGhyZWFkcztcclxuXHRcdFx0YXN5bmMgZnVuY3Rpb24gcnVuVGFzayh0YXNrOiBbVCwgbnVtYmVyLCBUW11dKTogUHJvbWlzZTxWPiB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHJldHVybiBhd2FpdCBtYXBwZXIoLi4udGFzayk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZXJyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRhc3luYyBmdW5jdGlvbiBydW4odGFzaykge1xyXG5cdFx0XHRcdGZyZWVUaHJlYWRzLS07XHJcblx0XHRcdFx0cmVzdWx0c1t0YXNrWzFdXSA9IGF3YWl0IHJ1blRhc2sodGFzayk7XHJcblx0XHRcdFx0ZnJlZVRocmVhZHMrKztcclxuXHRcdFx0XHRsZXQgb2xkQW55UmVzb2x2ZWQgPSBhbnlSZXNvbHZlZDtcclxuXHRcdFx0XHRhbnlSZXNvbHZlZCA9IFByb21pc2VFeHRlbnNpb24uZW1wdHkoKTtcclxuXHRcdFx0XHRvbGRBbnlSZXNvbHZlZC5yKHVuZGVmaW5lZCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgdGFzayBvZiB0YXNrcykge1xyXG5cdFx0XHRcdGlmIChmcmVlVGhyZWFkcyA9PSAwKSB7XHJcblx0XHRcdFx0XHRhd2FpdCBhbnlSZXNvbHZlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cnVuKHRhc2spO1xyXG5cdFx0XHR9XHJcblx0XHRcdHdoaWxlIChmcmVlVGhyZWFkcyA8IHRocmVhZHMpIHtcclxuXHRcdFx0XHRhd2FpdCBhbnlSZXNvbHZlZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gbWFwPFQgPSBudW1iZXI+KHRoaXM6IEFycmF5Q29uc3RydWN0b3IsIGxlbmd0aDogbnVtYmVyLCBtYXBwZXI6IChudW1iZXIpID0+IFQgPSBpID0+IGkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMobGVuZ3RoKS5maWxsKDApLm1hcCgoZSwgaSwgYSkgPT4gbWFwcGVyKGkpKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gdnNvcnQ8VD4odGhpczogVFtdLCBtYXBwZXI6IChlOiBULCBpOiBudW1iZXIsIGE6IFRbXSkgPT4gbnVtYmVyLCBzb3J0ZXI/OiAoKGE6IG51bWJlciwgYjogbnVtYmVyLCBhZTogVCwgYmU6IFQpID0+IG51bWJlcikgfCAtMSk6IFRbXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiB2c29ydDxULCBWPih0aGlzOiBUW10sIG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgYTogVFtdKSA9PiBWLCBzb3J0ZXI6ICgoYTogViwgYjogViwgYWU6IFQsIGJlOiBUKSA9PiBudW1iZXIpIHwgLTEpOiBUW107XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gdnNvcnQ8VD4odGhpczogVFtdLCBtYXBwZXI6IChlOiBULCBpOiBudW1iZXIsIGE6IFRbXSkgPT4gbnVtYmVyLCBzb3J0ZXI6ICgoYTogbnVtYmVyLCBiOiBudW1iZXIsIGFlOiBULCBiZTogVCkgPT4gbnVtYmVyKSB8IC0xID0gKGEsIGIpID0+IGEgLSBiKTogVFtdIHtcclxuXHRcdFx0bGV0IHRoZVNvcnRlciA9IHR5cGVvZiBzb3J0ZXIgPT0gJ2Z1bmN0aW9uJyA/IHNvcnRlciA6IChhLCBiKSA9PiBiIC0gYTtcclxuXHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdFx0XHQubWFwKChlLCBpLCBhKSA9PiAoeyBlLCB2OiBtYXBwZXIoZSwgaSwgYSkgfSkpXHJcblx0XHRcdFx0LnNvcnQoKGEsIGIpID0+IHRoZVNvcnRlcihhLnYsIGIudiwgYS5lLCBiLmUpKVxyXG5cdFx0XHRcdC5tYXAoZSA9PiBlLmUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGV4cG9ydCBpbnRlcmZhY2UgUE1hcERhdGE8VCwgVj4ge1xyXG5cdFx0Ly8gXHRzb3VyY2U6IFRbXSxcclxuXHRcdC8vIFx0cmVzdWx0OiAoViB8IHVuZGVmaW5lZClbXSxcclxuXHRcdC8vIFx0dGhyZWFkczogbnVtYmVyLFxyXG5cdFx0Ly8gXHR3aW5kb3c6IG51bWJlcixcclxuXHRcdC8vIFx0Y29tcGxldGVkOiBudW1iZXIsXHJcblx0XHQvLyBcdGxlbmd0aDogbnVtYmVyLFxyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdC8vIGV4cG9ydCBmdW5jdGlvbiBwbWFwX3YyPFQsIFY+KHRoaXM6IFRbXSwgbWFwcGVyOiAoZTogVCwgaTogbnVtYmVyLCBzb3VyY2U6IFRbXSwgZGF0YTogUE1hcERhdGE8VCwgVj4pID0+IFYsIGRhdGE6IFBhcnRpYWw8UE1hcERhdGE8VCwgVj4+KTogUHJvbWlzZTxWW10+IHtcclxuXHRcdC8vIFx0ZGF0YSA9IGRhdGEgYXMgUE1hcERhdGE8VCwgVj47XHJcblx0XHQvLyBcdGxldCBzb3VyY2U6IFRbXSA9IHRoaXM7XHJcblx0XHQvLyBcdGxldCByZXN1bHQ6IChWIHwgdW5kZWZpbmVkKVtdID0gc291cmNlLm1hcChlID0+ICk7XHJcblx0XHQvLyBcdGxldCB0aHJlYWRzOiBudW1iZXIgPSBkYXRhLnRocmVhZHM7XHJcblx0XHQvLyBcdGxldCB3aW5kb3c6IG51bWJlcjtcclxuXHRcdC8vIFx0bGV0IGNvbXBsZXRlZDogbnVtYmVyID0gMDtcclxuXHRcdC8vIFx0bGV0IGxlbmd0aDogbnVtYmVyID0gdGhpcy5sZW5ndGg7XHJcblxyXG5cdFx0Ly8gXHRkYXRhLlxyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdHR5cGUgUmVzb2x2ZWFibGVQcm9taXNlPFQ+ID0gUHJvbWlzZUxpa2U8VD4gJiB7XHJcblx0XHRcdHJlc29sdmUodmFsdWU6IFQpOiB2b2lkO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgUE1hcERhdGE8VCwgViwgRSA9IG5ldmVyPiBleHRlbmRzIFByb21pc2VMaWtlPChWIHwgRSlbXT4ge1xyXG5cdFx0XHQvKiogT3JpZ2luYWwgYXJyYXkgKi9cclxuXHRcdFx0c291cmNlOiBUW10sXHJcblx0XHRcdC8qKiBBc3luYyBlbGVtZW50IGNvbnZlcnRlciBmdW5jdGlvbiAqL1xyXG5cdFx0XHRtYXBwZXI6IChlOiBULCBpOiBudW1iZXIsIGE6IFRbXSwgZGF0YTogUE1hcERhdGE8VCwgViwgRT4pID0+IFByb21pc2U8ViB8IEU+LFxyXG5cdFx0XHQvKiogTWF4IG51bWJlciBvZiByZXF1ZXN0cyBhdCBvbmNlLiAgIFxyXG5cdFx0XHQgKiAgKk1heSogYmUgY2hhbmdlZCBpbiBydW50aW1lICovXHJcblx0XHRcdHRocmVhZHM6IG51bWJlcixcclxuXHRcdFx0LyoqIE1heCBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBvbGRlcnMgaW5jb21wbGV0ZSBhbmQgbmV3ZXN0IGFjdGl2ZSBlbGVtZW50cy4gICBcclxuXHRcdFx0ICogICpNYXkqIGJlIGNoYW5nZWQgaW4gcnVudGltZSAqL1xyXG5cdFx0XHR3aW5kb3c6IG51bWJlcixcclxuXHJcblx0XHRcdC8qKiBVbmZpbmlzaGVkIHJlc3VsdCBhcnJheSAqL1xyXG5cdFx0XHRyZXN1bHQ6IChWIHwgRXJyb3IgfCB1bmRlZmluZWQpW10sXHJcblx0XHRcdC8qKiBQcm9taXNlcyBmb3IgZXZlcnkgZWxlbWVudCAqL1xyXG5cdFx0XHRyZXF1ZXN0czogVW53cmFwcGVkUHJvbWlzZTxWIHwgRT5bXSxcclxuXHJcblx0XHRcdGJlZm9yZVN0YXJ0KGU6IFQsIGk6IG51bWJlciwgYTogVFtdLCBkYXRhOiBQTWFwRGF0YTxULCBWLCBFPik6IHZvaWQ7XHJcblx0XHRcdGFmdGVyQ29tcGxldGUoZTogVCwgaTogbnVtYmVyLCBhOiBUW10sIGRhdGE6IFBNYXBEYXRhPFQsIFYsIEU+KTogdm9pZDtcclxuXHJcblx0XHRcdC8qKiBMZW5ndGggb2YgdGhlIGFycmF5ICovXHJcblx0XHRcdGxlbmd0aDogbnVtYmVyLFxyXG5cdFx0XHQvKiogVGhlIG51bWJlciBvZiBlbGVtZW50cyBmaW5pc2hlZCBjb252ZXJ0aW5nICovXHJcblx0XHRcdGNvbXBsZXRlZDogbnVtYmVyLFxyXG5cdFx0XHQvKiogVGhyZWFkcyBjdXJyZW50bHkgd29ya2luZyAgIFxyXG5cdFx0XHQgKiAgaW4gdGhlIG1hcHBlciBmdW5jdGlvbjogaW5jbHVkaW5nIHRoZSBjdXJyZW50IG9uZSAqL1xyXG5cdFx0XHRhY3RpdmVUaHJlYWRzOiBudW1iZXIsXHJcblx0XHRcdGxhc3RTdGFydGVkOiBudW1iZXI7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgZW1wdHkgPSBQcm9taXNlRXh0ZW5zaW9uLmVtcHR5O1xyXG5cdFx0dHlwZSBVbndyYXBwZWRQcm9taXNlPFQ+ID0gUHJvbWlzZUV4dGVuc2lvbi5VbndyYXBwZWRQcm9taXNlPFQ+O1xyXG5cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgUE1hcFNvdXJjZTxULCBWLCBFID0gbmV2ZXI+IGV4dGVuZHMgUHJvbWlzZUxpa2U8VltdPiB7XHJcblx0XHRcdC8qKiBPcmlnaW5hbCBhcnJheSAqL1xyXG5cdFx0XHRzb3VyY2U6IFRbXSxcclxuXHRcdFx0LyoqIEFzeW5jIGVsZW1lbnQgY29udmVydGVyIGZ1bmN0aW9uICovXHJcblx0XHRcdG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgYTogVFtdLCBkYXRhOiBQTWFwRGF0YTxULCBWLCBFPikgPT4gUHJvbWlzZTxWIHwgRT4sXHJcblx0XHRcdC8qKiBBcnJheSB0byB3cml0ZSB0byAqL1xyXG5cdFx0XHRyZXN1bHQ/OiAoViB8IEVycm9yIHwgdW5kZWZpbmVkKVtdLFxyXG5cdFx0XHQvKiogTWF4IG51bWJlciBvZiByZXF1ZXN0cyBhdCBvbmNlLiAgXHJcblx0XHRcdCAqICBEZWZhdWx0OiA1XHJcblx0XHRcdCAqICAqTWF5KiBiZSBjaGFuZ2VkIGluIHJ1bnRpbWUgKi9cclxuXHRcdFx0dGhyZWFkczogbnVtYmVyLFxyXG5cdFx0XHQvKiogTWF4IGRpc3RhbmNlIGJldHdlZW4gdGhlIG9sZGVycyBpbmNvbXBsZXRlIGFuZCBuZXdlc3QgYWN0aXZlIGVsZW1lbnRzLiAgIFxyXG5cdFx0XHQgKiAgRGVmYXVsdDogdW5saW1pdGVkICAgXHJcblx0XHRcdCAqICAqTWF5KiBiZSBjaGFuZ2VkIGluIHJ1bnRpbWUgKi9cclxuXHRcdFx0d2luZG93PzogbnVtYmVyLFxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHBtYXAycmF3PFQsIFYsIEUgPSBuZXZlcj4oZGF0YTogUE1hcERhdGE8VCwgViwgRT4pOiBQTWFwRGF0YTxULCBWLCBFPiB7XHJcblx0XHRcdGRhdGEucmVzdWx0ID8/PSBBcnJheShkYXRhLnNvdXJjZS5sZW5ndGgpO1xyXG5cdFx0XHRkYXRhLnJlcXVlc3RzID0gZGF0YS5yZXN1bHQubWFwKCgpID0+IGVtcHR5KCkpO1xyXG5cdFx0XHRkYXRhLnRocmVhZHMgPz89IDU7XHJcblx0XHRcdGRhdGEud2luZG93ID8/PSBJbmZpbml0eTtcclxuXHJcblx0XHRcdGRhdGEuY29tcGxldGVkID0gMDtcclxuXHRcdFx0ZGF0YS5sZW5ndGggPSBkYXRhLnNvdXJjZS5sZW5ndGg7XHJcblx0XHRcdGRhdGEuYWN0aXZlVGhyZWFkcyA9IDA7XHJcblx0XHRcdGRhdGEubGFzdFN0YXJ0ZWQgPSAwO1xyXG5cclxuXHRcdFx0aWYgKGRhdGEudGhyZWFkcyA8PSAwKSB0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHJcblx0XHRcdGxldCBhbGxEb25lID0gZW1wdHkoKTtcclxuXHRcdFx0ZGF0YS50aGVuID0gYWxsRG9uZS50aGVuLmJpbmQoYWxsRG9uZSkgYXMgYW55O1xyXG5cclxuXHRcdFx0bGV0IGFueVJlc29sdmVkID0gZW1wdHkoKTtcclxuXHRcdFx0YXN5bmMgZnVuY3Rpb24gcnVuT25lKGk6IG51bWJlcikge1xyXG5cdFx0XHRcdGRhdGEuYWN0aXZlVGhyZWFkcysrO1xyXG5cdFx0XHRcdGRhdGEuYmVmb3JlU3RhcnQ/LihkYXRhLnNvdXJjZVtpXSwgaSwgZGF0YS5zb3VyY2UsIGRhdGEpO1xyXG5cdFx0XHRcdGRhdGEubGFzdFN0YXJ0ZWQgPSBpO1xyXG5cdFx0XHRcdGxldCB2OiBWIHwgRSA9IGF3YWl0IGRhdGEubWFwcGVyKGRhdGEuc291cmNlW2ldLCBpLCBkYXRhLnNvdXJjZSwgZGF0YSkuY2F0Y2goZSA9PiBlKTtcclxuXHRcdFx0XHRkYXRhLmFmdGVyQ29tcGxldGU/LihkYXRhLnNvdXJjZVtpXSwgaSwgZGF0YS5zb3VyY2UsIGRhdGEpO1xyXG5cdFx0XHRcdGRhdGEuYWN0aXZlVGhyZWFkcy0tO1xyXG5cdFx0XHRcdGFueVJlc29sdmVkLnJlc29sdmUobnVsbCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFzeW5jIGZ1bmN0aW9uIHJ1bigpIHtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdHdoaWxlIChkYXRhLmFjdGl2ZVRocmVhZHMgPCBkYXRhLnRocmVhZHMpIGF3YWl0IGFueVJlc29sdmVkO1xyXG5cdFx0XHRcdFx0YW55UmVzb2x2ZWQgPSBlbXB0eSgpO1xyXG5cdFx0XHRcdFx0cnVuT25lKGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRGF0ZU5vd0hhY2sge1xyXG5cclxuXHRcdGV4cG9ydCBsZXQgc3BlZWRNdWx0aXBsaWVyID0gMTtcclxuXHRcdGV4cG9ydCBsZXQgZGVsdGFPZmZzZXQgPSAwO1xyXG5cdFx0ZXhwb3J0IGxldCBzdGFydFJlYWx0aW1lID0gMDtcclxuXHRcdGV4cG9ydCBsZXQgc3RhcnRUaW1lID0gMDtcclxuXHJcblx0XHQvLyBleHBvcnQgbGV0IHNwZWVkTXVsdGlwbGllciA9IDE7XHJcblx0XHRleHBvcnQgbGV0IHBlcmZvcm1hbmNlRGVsdGFPZmZzZXQgPSAwO1xyXG5cdFx0ZXhwb3J0IGxldCBwZXJmb3JtYW5jZVN0YXJ0UmVhbHRpbWUgPSAwO1xyXG5cdFx0ZXhwb3J0IGxldCBwZXJmb3JtYW5jZVN0YXJ0VGltZSA9IDA7XHJcblxyXG5cdFx0ZXhwb3J0IGxldCB1c2VkTWV0aG9kcyA9IHtcclxuXHRcdFx0ZGF0ZTogdHJ1ZSxcclxuXHRcdFx0cGVyZm9ybWFuY2U6IHRydWUsXHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHRvRmFrZVRpbWUocmVhbHRpbWU6IG51bWJlcikge1xyXG5cdFx0XHRpZiAoIXVzZWRNZXRob2RzLmRhdGUpIHJldHVybiByZWFsdGltZTtcclxuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoXHJcblx0XHRcdFx0KHJlYWx0aW1lIC0gc3RhcnRSZWFsdGltZSkgKiBzcGVlZE11bHRpcGxpZXIgKyBzdGFydFRpbWUgKyBkZWx0YU9mZnNldFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHRvUGVyZm9ybWFuY2VGYWtlVGltZShyZWFsdGltZTogbnVtYmVyKSB7XHJcblx0XHRcdGlmICghdXNlZE1ldGhvZHMucGVyZm9ybWFuY2UpIHJldHVybiByZWFsdGltZTtcclxuXHRcdFx0cmV0dXJuIChyZWFsdGltZSAtIHBlcmZvcm1hbmNlU3RhcnRSZWFsdGltZSkgKiBzcGVlZE11bHRpcGxpZXJcclxuXHRcdFx0XHQrIHBlcmZvcm1hbmNlU3RhcnRUaW1lICsgcGVyZm9ybWFuY2VEZWx0YU9mZnNldDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IGJyYWNrZXRTcGVlZHMgPSBbMC4wNSwgMC4yNSwgMSwgMiwgNSwgMTAsIDIwLCA2MCwgMTIwXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzcGVlZGhhY2soc3BlZWQ6IG51bWJlciA9IDEpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBzcGVlZCAhPSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgRGF0ZU5vd0hhY2s6IGludmFsaWQgc3BlZWQ6ICR7c3BlZWR9YCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWN0aXZhdGUoKTtcclxuXHRcdFx0YWN0aXZhdGVQZXJmb3JtYW5jZSgpO1xyXG5cdFx0XHRzcGVlZE11bHRpcGxpZXIgPSBzcGVlZDtcclxuXHRcdFx0bG9jYXRpb24uaGFzaCA9IHNwZWVkICsgJyc7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gdGltZWp1bXAoc2Vjb25kczogbnVtYmVyKSB7XHJcblx0XHRcdGFjdGl2YXRlKCk7XHJcblx0XHRcdGFjdGl2YXRlUGVyZm9ybWFuY2UoKTtcclxuXHRcdFx0ZGVsdGFPZmZzZXQgKz0gc2Vjb25kcyAqIDEwMDA7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gc3dpdGNoU3BlZWRoYWNrKGRpcjogbnVtYmVyKSB7XHJcblx0XHRcdGxldCBjdXJyZW50SW5kZXggPSBicmFja2V0U3BlZWRzLmluZGV4T2Yoc3BlZWRNdWx0aXBsaWVyKTtcclxuXHRcdFx0aWYgKGN1cnJlbnRJbmRleCA9PSAtMSkgY3VycmVudEluZGV4ID0gYnJhY2tldFNwZWVkcy5pbmRleE9mKDEpO1xyXG5cdFx0XHRsZXQgbmV3U3BlZWQgPSBicmFja2V0U3BlZWRzW2N1cnJlbnRJbmRleCArIGRpcl07XHJcblx0XHRcdGlmIChuZXdTcGVlZCA9PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0c3BlZWRoYWNrKG5ld1NwZWVkKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG9ua2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQnJhY2tldExlZnQnKSB7XHJcblx0XHRcdFx0c3dpdGNoU3BlZWRoYWNrKC0xKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQnJhY2tldFJpZ2h0Jykge1xyXG5cdFx0XHRcdHN3aXRjaFNwZWVkaGFjaygxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGJpbmRCcmFja2V0cyhtb2RlID0gJ29uJykge1xyXG5cdFx0XHRyZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25rZXlkb3duKTtcclxuXHRcdFx0aWYgKG1vZGUgPT0gJ29uJykge1xyXG5cdFx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbmtleWRvd24pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBhY3RpdmF0ZWQgPSBmYWxzZTtcclxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG5cdFx0XHREYXRlLl9ub3cgPz89IERhdGUubm93O1xyXG5cdFx0XHREYXRlLnByb3RvdHlwZS5fZ2V0VGltZSA/Pz0gRGF0ZS5wcm90b3R5cGUuZ2V0VGltZTtcclxuXHRcdFx0c3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0c3RhcnRSZWFsdGltZSA9IERhdGUuX25vdygpO1xyXG5cdFx0XHRkZWx0YU9mZnNldCA9IDA7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKERhdGUubm93KCksIClcclxuXHRcdFx0Ly8gZGVidWdnZXI7XHJcblx0XHRcdERhdGUubm93ID0gKCkgPT4gdG9GYWtlVGltZShEYXRlLl9ub3coKSk7XHJcblx0XHRcdERhdGUucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbiAodGhpczogRGF0ZSAmIHsgX3Q/OiBudW1iZXIgfSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl90ID8/PSB0b0Zha2VUaW1lKHRoaXMuX2dldFRpbWUoKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0RGF0ZS5wcm90b3R5cGUudmFsdWVPZiA9IGZ1bmN0aW9uICh0aGlzOiBEYXRlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VGltZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFjdGl2YXRlZCA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgbGV0IHBlcmZvcm1hbmNlQWN0aXZhdGVkID0gZmFsc2U7XHJcblx0XHRmdW5jdGlvbiBhY3RpdmF0ZVBlcmZvcm1hbmNlKCkge1xyXG5cdFx0XHRwZXJmb3JtYW5jZS5fbm93ID8/PSBwZXJmb3JtYW5jZS5ub3c7XHJcblx0XHRcdHBlcmZvcm1hbmNlU3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblx0XHRcdHBlcmZvcm1hbmNlU3RhcnRSZWFsdGltZSA9IHBlcmZvcm1hbmNlLl9ub3coKTtcclxuXHRcdFx0cGVyZm9ybWFuY2VEZWx0YU9mZnNldCA9IDA7XHJcblx0XHRcdHBlcmZvcm1hbmNlLm5vdyA9ICgpID0+IHRvUGVyZm9ybWFuY2VGYWtlVGltZShwZXJmb3JtYW5jZS5fbm93KCkpO1xyXG5cdFx0XHRwZXJmb3JtYW5jZUFjdGl2YXRlZCA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgT2JqZWN0RXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZGVmaW5lVmFsdWU8VCwgSyBleHRlbmRzIGtleW9mIFQ+KG86IFQsIHA6IEssIHZhbHVlOiBUW0tdKTogVDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBkZWZpbmVWYWx1ZTxUPihvOiBULCBmbjogRnVuY3Rpb24pOiBUO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGRlZmluZVZhbHVlPFQ+KG86IFQsIHA6IGtleW9mIFQgfCBzdHJpbmcgfCBGdW5jdGlvbiwgdmFsdWU/OiBhbnkpOiBUIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBwID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRbcCwgdmFsdWVdID0gW3AubmFtZSwgcF0gYXMgW3N0cmluZywgRnVuY3Rpb25dO1xyXG5cdFx0XHR9XHJcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBwLCB7XHJcblx0XHRcdFx0dmFsdWUsXHJcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxyXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUdldHRlcjxULCBLIGV4dGVuZHMga2V5b2YgVD4obzogVCwgcDogSywgZ2V0OiAoKSA9PiBUW0tdKTogVDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBkZWZpbmVHZXR0ZXI8VD4obzogVCwgZ2V0OiBGdW5jdGlvbik6IFQ7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZGVmaW5lR2V0dGVyPFQ+KG86IFQsIHA6IHN0cmluZyB8IGtleW9mIFQgfCBGdW5jdGlvbiwgZ2V0PzogYW55KTogVCB7XHJcblx0XHRcdGlmICh0eXBlb2YgcCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0W3AsIGdldF0gPSBbcC5uYW1lLCBwXSBhcyBbc3RyaW5nLCBGdW5jdGlvbl07XHJcblx0XHRcdH1cclxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIHAsIHtcclxuXHRcdFx0XHRnZXQsXHJcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG1hcDxULCBWPihvOiBULCBtYXBwZXI6ICh2OiBWYWx1ZU9mPFQ+LCBrOiBrZXlvZiBULCBvOiBUKSA9PiBWKTogTWFwcGVkT2JqZWN0PFQsIFY+IHtcclxuXHRcdFx0bGV0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhvKSBhcyBba2V5b2YgVCwgVmFsdWVPZjxUPl1bXTtcclxuXHRcdFx0cmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhlbnRyaWVzLm1hcCgoW2ssIHZdKSA9PiBbaywgbWFwcGVyKHYsIGssIG8pXSkpIGFzIE1hcHBlZE9iamVjdDxULCBWPjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgUXVlcnlTZWxlY3RvciB7XHJcblxyXG5cdFx0ZXhwb3J0IG5hbWVzcGFjZSBXaW5kb3dRIHtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IEspOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHNlbGVjdG9yOiBTKTogVGFnRWxlbWVudEZyb21UYWdOYW1lPE4+O1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHNlbGVjdG9yKTogRTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IHNlbGVjdG9yKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcShzZWxlY3Rvcjogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuICh0aGlzPy5kb2N1bWVudCA/PyBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihzZWxlY3RvcjogSyk6IChIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10pW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxTIGV4dGVuZHMgc2VsZWN0b3IsIE4gPSBUYWdOYW1lRnJvbVNlbGVjdG9yPFM+PihzZWxlY3RvcjogUyk6IFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxOPltdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8RSBleHRlbmRzIEVsZW1lbnQ+KHNlbGVjdG9yOiBzZWxlY3Rvcik6IEVbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHNlbGVjdG9yOiBzZWxlY3Rvcik6IChIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10pW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcShzZWxlY3Rvcjogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIFsuLi4odGhpcz8uZG9jdW1lbnQgPz8gZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBuYW1lc3BhY2UgRG9jdW1lbnRRIHtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBLKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxTIGV4dGVuZHMgc2VsZWN0b3IsIE4gPSBUYWdOYW1lRnJvbVNlbGVjdG9yPFM+Pih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEUgZXh0ZW5kcyBFbGVtZW50Pih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogRTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHEodGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kb2N1bWVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IEspOiAoSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdKVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBTKTogVGFnRWxlbWVudEZyb21UYWdOYW1lPE4+W107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxFIGV4dGVuZHMgRWxlbWVudD4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IEVbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IERvY3VtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiAoSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdKVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXEodGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gWy4uLnRoaXMuZG9jdW1lbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBuYW1lc3BhY2UgRWxlbWVudFEge1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBFbGVtZW50LCBzZWxlY3RvcjogSyk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEUgZXh0ZW5kcyBFbGVtZW50Pih0aGlzOiBFbGVtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiBFO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBFbGVtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxKHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBLKTogKEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSlbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBTKTogVGFnRWxlbWVudEZyb21UYWdOYW1lPE4+W107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxFIGV4dGVuZHMgRWxlbWVudD4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogRVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogKEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSlbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxKHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gWy4uLnRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcildO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIEVsZW1lbnRFeHRlbnNpb24ge1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVtaXQ8VCBleHRlbmRzIEN1c3RvbUV2ZW50PHsgX2V2ZW50Pzogc3RyaW5nIH0+Pih0aGlzOiBFbGVtZW50LCB0eXBlOiBUWydkZXRhaWwnXVsnX2V2ZW50J10sIGRldGFpbD86IFRbJ2RldGFpbCddKTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbWl0PFQ+KHRoaXM6IEVsZW1lbnQsIHR5cGU6IHN0cmluZywgZGV0YWlsPzogVCkge1xyXG5cdFx0XHRsZXQgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQodHlwZSwge1xyXG5cdFx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdFx0ZGV0YWlsLFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gYXBwZW5kVG88RSBleHRlbmRzIEVsZW1lbnQ+KHRoaXM6IEUsIHBhcmVudDogRWxlbWVudCB8IHNlbGVjdG9yKTogRSB7XHJcblx0XHRcdGlmICh0eXBlb2YgcGFyZW50ID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0cGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJlbnQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHBhcmVudC5hcHBlbmQodGhpcyk7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRWxtIHtcclxuXHRcdHR5cGUgQ2hpbGQgPSBOb2RlIHwgc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbjtcclxuXHRcdHR5cGUgU29tZUV2ZW50ID0gRXZlbnQgJiBNb3VzZUV2ZW50ICYgS2V5Ym9hcmRFdmVudCAmIHsgdGFyZ2V0OiBIVE1MRWxlbWVudCB9O1xyXG5cdFx0dHlwZSBMaXN0ZW5lciA9ICgoZXZlbnQ6IFNvbWVFdmVudCkgPT4gYW55KVxyXG5cdFx0XHQmIHsgbmFtZT86IGAkeycnIHwgJ2JvdW5kICd9JHsnb24nIHwgJyd9JHtrZXlvZiBIVE1MRWxlbWVudEV2ZW50TWFwfWAgfCAnJyB9IHwgKChldmVudDogU29tZUV2ZW50KSA9PiBhbnkpO1xyXG5cclxuXHRcdGNvbnN0IGVsbVJlZ2V4ID0gbmV3IFJlZ0V4cChbXHJcblx0XHRcdC9eKD88dGFnPltcXHctXSspLyxcclxuXHRcdFx0LyMoPzxpZD5bXFx3LV0rKS8sXHJcblx0XHRcdC9cXC4oPzxjbGFzcz5bXFx3LV0rKS8sXHJcblx0XHRcdC9cXFsoPzxhdHRyMT5bXFx3LV0rKVxcXS8sXHJcblx0XHRcdC9cXFsoPzxhdHRyMj5bXFx3LV0rKT0oPyFbJ1wiXSkoPzx2YWwyPlteXFxdXSopXFxdLyxcclxuXHRcdFx0L1xcWyg/PGF0dHIzPltcXHctXSspPVwiKD88dmFsMz4oPzpbXlwiXXxcXFxcXCIpKilcIlxcXS8sXHJcblx0XHRcdC9cXFsoPzxhdHRyND5bXFx3LV0rKT1cIig/PHZhbDQ+KD86W14nXXxcXFxcJykqKVwiXFxdLyxcclxuXHRcdF0ubWFwKGUgPT4gZS5zb3VyY2UpLmpvaW4oJ3wnKSwgJ2cnKTtcclxuXHJcblx0XHQvKiogaWYgYGVsbWAgc2hvdWxkIGRpc2FsbG93IGxpc3RlbmVycyBub3QgZXhpc3RpbmcgYXMgYG9uICogYCBwcm9wZXJ0eSBvbiB0aGUgZWxlbWVudCAqL1xyXG5cdFx0ZXhwb3J0IGxldCBhbGxvd09ubHlFeGlzdGluZ0xpc3RlbmVycyA9IHRydWU7XHJcblxyXG5cdFx0LyoqIGlmIGBlbG1gIHNob3VsZCBhbGxvdyBvdmVycmlkaW5nIGBvbiAqIGAgbGlzdGVuZXJzIGlmIG11bHRpcGxlIG9mIHRoZW0gYXJlIHByb3ZpZGVkICovXHJcblx0XHRleHBvcnQgbGV0IGFsbG93T3ZlcnJpZGVPbkxpc3RlbmVycyA9IGZhbHNlO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG08SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IEssIC4uLmNoaWxkcmVuOiAoQ2hpbGQgfCBMaXN0ZW5lcilbXSk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG08SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcCBleHRlbmRzIEsgPyBuZXZlciA6IHNlbGVjdG9yLCAuLi5jaGlsZHJlbjogKENoaWxkIHwgTGlzdGVuZXIpW10pOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZWxtPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHNlbGVjdG9yOiBTLCAuLi5jaGlsZHJlbjogKENoaWxkIHwgTGlzdGVuZXIpW10pOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZWxtPEUgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHNlbGVjdG9yOiBzZWxlY3RvciwgLi4uY2hpbGRyZW46IChDaGlsZCB8IExpc3RlbmVyKVtdKTogRTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG0oKTogSFRNTERpdkVsZW1lbnQ7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZWxtKHNlbGVjdG9yOiBzdHJpbmcgPSAnJywgLi4uY2hpbGRyZW46IChDaGlsZCB8IExpc3RlbmVyKVtdKTogSFRNTEVsZW1lbnQge1xyXG5cdFx0XHRpZiAoc2VsZWN0b3IucmVwbGFjZUFsbChlbG1SZWdleCwgJycpICE9ICcnKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfSBgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0Ly8gbGV0IHRhZyA9ICcnO1xyXG5cdFx0XHQvLyBsZXQgZmlyc3RNYXRjaCA9IGZhbHNlO1xyXG5cdFx0XHRmb3IgKGxldCBtYXRjaCBvZiBzZWxlY3Rvci5tYXRjaEFsbChlbG1SZWdleCkpIHtcclxuXHRcdFx0XHRpZiAobWF0Y2guZ3JvdXBzLnRhZykge1xyXG5cdFx0XHRcdFx0Ly8gaWYgKHRhZyAmJiBtYXRjaC5ncm91cHMudGFnICE9IHRhZykge1xyXG5cdFx0XHRcdFx0Ly8gXHR0aHJvdyBuZXcgRXJyb3IoYHNlbGVjdG9yIGhhcyB0d28gZGlmZmVyZW50IHRhZ3MgYXQgb25jZSA6IDwke3RhZ30+IGFuZCA8JHttYXRjaC5ncm91cHMudGFnfT5gKTtcclxuXHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdC8vIHRhZyA9IG1hdGNoLmdyb3Vwcy50YWc7XHJcblx0XHRcdFx0XHQvLyBpZiAoIWZpcnN0TWF0Y2gpIHJldHVybiBlbG0odGFnICsgc2VsZWN0b3IsIC4uLmNoaWxkcmVuKTtcclxuXHRcdFx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG1hdGNoLmdyb3Vwcy50YWcpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2guZ3JvdXBzLmlkKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LmlkID0gbWF0Y2guZ3JvdXBzLmlkO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2guZ3JvdXBzLmNsYXNzKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQobWF0Y2guZ3JvdXBzLmNsYXNzKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG1hdGNoLmdyb3Vwcy5hdHRyMSkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUobWF0Y2guZ3JvdXBzLmF0dHIxLCBcInRydWVcIik7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuYXR0cjIpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG1hdGNoLmdyb3Vwcy5hdHRyMiwgbWF0Y2guZ3JvdXBzLnZhbDIpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2guZ3JvdXBzLmF0dHIzKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShtYXRjaC5ncm91cHMuYXR0cjMsIG1hdGNoLmdyb3Vwcy52YWwzLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuYXR0cjQpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG1hdGNoLmdyb3Vwcy5hdHRyNCwgbWF0Y2guZ3JvdXBzLnZhbDQucmVwbGFjZSgvXFxcXCcvZywgJ1xcJycpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gZmlyc3RNYXRjaCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGxpc3RlbmVyIG9mIGNoaWxkcmVuLmZpbHRlcihlID0+IHR5cGVvZiBlID09ICdmdW5jdGlvbicpIGFzIExpc3RlbmVyW10pIHtcclxuXHRcdFx0XHRsZXQgbmFtZTogc3RyaW5nID0gbGlzdGVuZXIubmFtZTtcclxuXHRcdFx0XHRpZiAoIW5hbWUpIG5hbWUgPSAobGlzdGVuZXIgKyAnJykubWF0Y2goL1xcYig/IWZ1bmN0aW9uXFxiKVxcdysvKVswXTtcclxuXHRcdFx0XHRpZiAoIW5hbWUpIHRocm93IG5ldyBFcnJvcigndHJ5aW5nIHRvIGJpbmQgdW5uYW1lZCBmdW5jdGlvbicpO1xyXG5cdFx0XHRcdGlmIChuYW1lLnN0YXJ0c1dpdGgoJ2JvdW5kICcpKSBuYW1lID0gbmFtZS5zbGljZSgnYm91bmQgJy5sZW5ndGgpO1xyXG5cdFx0XHRcdGlmIChuYW1lLnN0YXJ0c1dpdGgoJ29uJykpIHtcclxuXHRcdFx0XHRcdGlmICghZWxlbWVudC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgdGhyb3cgbmV3IEVycm9yKGA8ICR7ZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCl9PiBkb2VzIG5vdCBoYXZlIFwiJHtuYW1lfVwiIGxpc3RlbmVyYCk7XHJcblx0XHRcdFx0XHRpZiAoIWFsbG93T3ZlcnJpZGVPbkxpc3RlbmVycyAmJiBlbGVtZW50W25hbWVdKSB0aHJvdyBuZXcgRXJyb3IoJ292ZXJyaWRpbmcgYG9uICogYCBsaXN0ZW5lcnMgaXMgZGlzYWJsZWQnKTtcclxuXHRcdFx0XHRcdGVsZW1lbnRbbmFtZV0gPSBsaXN0ZW5lcjtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGFsbG93T25seUV4aXN0aW5nTGlzdGVuZXJzICYmIGVsZW1lbnRbJ29uJyArIG5hbWVdID09PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgPCR7ZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCl9PiBkb2VzIG5vdCBoYXZlIFwib24nJHtuYW1lfSdcIiBsaXN0ZW5lcmApO1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxlbWVudC5hcHBlbmQoLi4uY2hpbGRyZW4uZmlsdGVyKGUgPT4gdHlwZW9mIGUgIT0gJ2Z1bmN0aW9uJykgYXMgKE5vZGUgfCBzdHJpbmcpW10pO1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHNlbGVjdG9yOiBLLCBwYXJlbnQ/OiBQYXJlbnROb2RlIHwgc2VsZWN0b3IpOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHNlbGVjdG9yOiBTLCBwYXJlbnQ/OiBQYXJlbnROb2RlIHwgc2VsZWN0b3IpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtPEUgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHNlbGVjdG9yOiBzdHJpbmcsIHBhcmVudD86IFBhcmVudE5vZGUgfCBzZWxlY3Rvcik6IEU7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtKHNlbGVjdG9yOiBzdHJpbmcsIHBhcmVudD86IFBhcmVudE5vZGUgfCBzdHJpbmcpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBwYXJlbnQgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRwYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmVudCkgYXMgUGFyZW50Tm9kZTtcclxuXHRcdFx0XHRpZiAoIXBhcmVudCkgdGhyb3cgbmV3IEVycm9yKCdmYWlsZWQgdG8gZmluZCBwYXJlbnQgZWxlbWVudCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzZWxlY3Rvci5pbmNsdWRlcygnPicpKSB7XHJcblx0XHRcdFx0bGV0IHBhcmVudFNlbGVjdG9yID0gc2VsZWN0b3Iuc3BsaXQoJz4nKS5zbGljZSgwLCAtMSkuam9pbignPicpO1xyXG5cdFx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3Iuc3BsaXQoJz4nKS5wb3AoKTtcclxuXHRcdFx0XHRwYXJlbnQgPSAocGFyZW50IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHBhcmVudFNlbGVjdG9yKSBhcyBQYXJlbnROb2RlO1xyXG5cdFx0XHRcdGlmICghcGFyZW50KSB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWxlZCB0byBmaW5kIHBhcmVudCBlbGVtZW50Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGNoaWxkID0gKHBhcmVudCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdGlmIChjaGlsZCkgcmV0dXJuIGNoaWxkO1xyXG5cclxuXHRcdFx0Y2hpbGQgPSBlbG0oc2VsZWN0b3IpO1xyXG5cdFx0XHRwYXJlbnQ/LmFwcGVuZChjaGlsZCk7XHJcblx0XHRcdHJldHVybiBjaGlsZDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IGxldCBkZWJ1ZyA9IGZhbHNlO1xyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIGV0YyB7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24ga2V5YmluZChrZXk6IHN0cmluZywgZm46IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkge1xyXG5cdFx0XHRsZXQgY29kZSA9IGtleS5sZW5ndGggPT0gMSA/ICdLZXknICsga2V5LnRvVXBwZXJDYXNlKCkgOiBrZXk7XHJcblx0XHRcdGZ1bmN0aW9uIG9ua2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0XHRcdGlmIChldmVudC5jb2RlID09IGNvZGUpIHtcclxuXHRcdFx0XHRcdGZuKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bik7XHJcblx0XHRcdHJldHVybiAoKSA9PiByZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25rZXlkb3duKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gZnVsbHNjcmVlbihvbj86IGJvb2xlYW4pIHtcclxuXHRcdFx0bGV0IGNlbnRyYWwgPSBJbWFnZVNjcm9sbGluZ0V4dGVuc2lvbi5pbWFnZVNjcm9sbGluZ0FjdGl2ZSAmJiBJbWFnZVNjcm9sbGluZ0V4dGVuc2lvbi5nZXRDZW50cmFsSW1nKCk7XHJcblx0XHRcdGlmICghZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQpIHtcclxuXHRcdFx0XHRpZiAob24gPT0gZmFsc2UpIHJldHVybjtcclxuXHRcdFx0XHRhd2FpdCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4oKS5jYXRjaCgoKSA9PiB7IH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChvbiA9PSB0cnVlKSByZXR1cm47XHJcblx0XHRcdFx0YXdhaXQgZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKS5jYXRjaCgoKSA9PiB7IH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjZW50cmFsKSB7XHJcblx0XHRcdFx0Y2VudHJhbC5zY3JvbGxJbnRvVmlldygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiAhIWRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBhbnliaW5kKGtleU9yRXZlbnQ6IHN0cmluZyB8IG51bWJlciwgZm46IChldmVudDogRXZlbnQpID0+IHZvaWQpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBrZXlPckV2ZW50ID09IFwibnVtYmVyXCIpIGtleU9yRXZlbnQgPSBrZXlPckV2ZW50ICsgJyc7XHJcblx0XHRcdC8vIGRldGVjdCBpZiBpdCBpcyBldmVudFxyXG5cdFx0XHRsZXQgaXNFdmVudCA9IHdpbmRvdy5oYXNPd25Qcm9wZXJ0eSgnb24nICsga2V5T3JFdmVudCk7XHJcblx0XHRcdGlmIChpc0V2ZW50KSB7XHJcblx0XHRcdFx0YWRkRXZlbnRMaXN0ZW5lcihrZXlPckV2ZW50LCBmbik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHBhcnNlIGtleSBjb2RlXHJcblx0XHRcdGlmICghaXNOYU4ocGFyc2VJbnQoa2V5T3JFdmVudCkpKSB7XHJcblx0XHRcdFx0a2V5T3JFdmVudCA9IGBEaWdpdCR7a2V5T3JFdmVudH1gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGtleU9yRXZlbnQubGVuZ3RoID09IDEpIHtcclxuXHRcdFx0XHRrZXlPckV2ZW50ID0gYEtleSR7a2V5T3JFdmVudC50b1VwcGVyQ2FzZSgpfWA7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ID0+IHtcclxuXHRcdFx0XHRpZiAoZXYuY29kZSAhPSBrZXlPckV2ZW50KSByZXR1cm47XHJcblx0XHRcdFx0Zm4oZXYpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZnVsbHNjcmVlbk9uKGtleTogc3RyaW5nKSB7XHJcblx0XHRcdGlmIChrZXkgPT0gJ3Njcm9sbCcpIHtcclxuXHRcdFx0XHRhZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiBmdWxsc2NyZWVuKHRydWUpKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGtleWJpbmQoa2V5LCAoKSA9PiBmdWxsc2NyZWVuKCkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBmSXNGb3JGdWxsc2NyZWVuKCkge1xyXG5cdFx0XHRrZXliaW5kKCdGJywgKCkgPT4gZnVsbHNjcmVlbigpKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gaGFzaENvZGUodGhpczogc3RyaW5nKTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBoYXNoQ29kZSh2YWx1ZTogc3RyaW5nKTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBoYXNoQ29kZSh0aGlzOiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nKSB7XHJcblx0XHRcdHZhbHVlID8/PSB0aGlzO1xyXG5cdFx0XHRsZXQgaGFzaCA9IDA7XHJcblx0XHRcdGZvciAobGV0IGMgb2YgdmFsdWUpIHtcclxuXHRcdFx0XHRoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjLmNoYXJDb2RlQXQoMCk7XHJcblx0XHRcdFx0aGFzaCA9IGhhc2ggJiBoYXNoO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBoYXNoO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xyXG5cdFx0XHQvLyBTdHJpbmcucHJvdG90eXBlLmhhc2hDb2RlID0gaGFzaENvZGU7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRTY3JpcHRIYXNoKCkge1xyXG5cdFx0XHRyZXR1cm4gaGFzaENvZGUoZG9jdW1lbnQuY3VycmVudFNjcmlwdC5pbm5lckhUTUwpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiByZWxvYWRPbkN1cnJlbnRTY3JpcHRDaGFuZ2VkKHNjcmlwdE5hbWU6IHN0cmluZyA9IGxvY2F0aW9uLmhvc3RuYW1lICsgJy51anMnKSB7XHJcblx0XHRcdGxldCBzY3JpcHRJZCA9IGByZWxvYWRPbkN1cnJlbnRTY3JpcHRDaGFuZ2VkXyR7c2NyaXB0TmFtZX1gO1xyXG5cdFx0XHRsZXQgc2NyaXB0SGFzaCA9IGN1cnJlbnRTY3JpcHRIYXNoKCkgKyAnJztcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oc2NyaXB0SWQsIHNjcmlwdEhhc2gpO1xyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHtcclxuXHRcdFx0XHRpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oc2NyaXB0SWQpICE9IHNjcmlwdEhhc2gpIHtcclxuXHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBmYXN0U2Nyb2xsOiB7XHJcblx0XHRcdChzcGVlZD86IG51bWJlcik6IHZvaWQ7XHJcblx0XHRcdHNwZWVkPzogbnVtYmVyO1xyXG5cdFx0XHRhY3RpdmU/OiBib29sZWFuO1xyXG5cdFx0XHRvZmY/OiAoKSA9PiB2b2lkO1xyXG5cdFx0fSA9IGZ1bmN0aW9uIChzcGVlZCA9IDAuMjUpIHtcclxuXHRcdFx0aWYgKGZhc3RTY3JvbGwuYWN0aXZlKSBmYXN0U2Nyb2xsLm9mZigpO1xyXG5cdFx0XHRmYXN0U2Nyb2xsLmFjdGl2ZSA9IHRydWU7XHJcblx0XHRcdGZhc3RTY3JvbGwuc3BlZWQgPSBzcGVlZDtcclxuXHRcdFx0ZnVuY3Rpb24gb253aGVlbChldmVudDogTW91c2VFdmVudCAmIHsgd2hlZWxEZWx0YVk6IG51bWJlciB9KSB7XHJcblx0XHRcdFx0aWYgKGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHRcdFx0XHRpZiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSkgcmV0dXJuO1xyXG5cdFx0XHRcdHNjcm9sbEJ5KDAsIC1NYXRoLnNpZ24oZXZlbnQud2hlZWxEZWx0YVkpICogaW5uZXJIZWlnaHQgKiBmYXN0U2Nyb2xsLnNwZWVkKTtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbndoZWVsLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xyXG5cdFx0XHRmYXN0U2Nyb2xsLm9mZiA9ICgpID0+IHtcclxuXHRcdFx0XHRmYXN0U2Nyb2xsLmFjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbndoZWVsKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZmFzdFNjcm9sbC5hY3RpdmUgPSBmYWxzZTtcclxuXHRcdGZhc3RTY3JvbGwub2ZmID0gKCkgPT4geyB9O1xyXG5cclxuXHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG9ucmFmKGY6ICgpID0+IHZvaWQpIHtcclxuXHRcdFx0bGV0IGxvb3AgPSB0cnVlO1xyXG5cdFx0XHR2b2lkIGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR3aGlsZSAobG9vcCkge1xyXG5cdFx0XHRcdFx0YXdhaXQgUHJvbWlzZS5mcmFtZSgpO1xyXG5cdFx0XHRcdFx0ZigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSgpO1xyXG5cdFx0XHRyZXR1cm4gKCkgPT4geyBsb29wID0gZmFsc2UgfTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcmVzaXplT2JzZXJ2ZXI6IFJlc2l6ZU9ic2VydmVyO1xyXG5cdFx0bGV0IHJlc2l6ZUxpc3RlbmVyczogKChuZXdIZWlnaHQ6IG51bWJlciwgb2xkSGVpZ2h0OiBudW1iZXIpID0+IHZvaWQpW10gPSBbXTtcclxuXHRcdGxldCBwcmV2aW91c0JvZHlIZWlnaHQgPSAwO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG9uaGVpZ2h0Y2hhbmdlKGY6IChuZXdIZWlnaHQ6IG51bWJlciwgb2xkSGVpZ2h0OiBudW1iZXIpID0+IHZvaWQpIHtcclxuXHRcdFx0aWYgKCFyZXNpemVPYnNlcnZlcikge1xyXG5cdFx0XHRcdHByZXZpb3VzQm9keUhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cdFx0XHRcdHJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZSBvZiBlbnRyaWVzKSB7XHJcblx0XHRcdFx0XHRcdGlmIChlLnRhcmdldCAhPSBkb2N1bWVudC5ib2R5KSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdGxldCBuZXdCb2R5SGVpZ2h0ID0gZS50YXJnZXQuY2xpZW50SGVpZ2h0O1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBmIG9mIHJlc2l6ZUxpc3RlbmVycykge1xyXG5cdFx0XHRcdFx0XHRcdGYobmV3Qm9keUhlaWdodCwgcHJldmlvdXNCb2R5SGVpZ2h0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRwcmV2aW91c0JvZHlIZWlnaHQgPSBuZXdCb2R5SGVpZ2h0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJlc2l6ZU9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVzaXplTGlzdGVuZXJzLnB1c2goZik7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcigpIHtcclxuXHRcdFx0XHRyZXNpemVMaXN0ZW5lcnMuc3BsaWNlKHJlc2l6ZUxpc3RlbmVycy5pbmRleE9mKGYpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBkZWNsYXJlIGNvbnN0IGtkczoge1xyXG5cdFx0XHRbazogc3RyaW5nXTogc3RyaW5nIHwgKChlOiBLZXlib2FyZEV2ZW50ICYgTW91c2VFdmVudCkgPT4gdm9pZClcclxuXHRcdH07XHJcblxyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV0YywgJ2tkcycsIHtcclxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQoKSB7XHJcblx0XHRcdFx0bGV0IGtkcyA9IGluaXRLZHMoKTtcclxuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXRjLCAna2RzJywgeyB2YWx1ZToga2RzIH0pO1xyXG5cdFx0XHRcdHJldHVybiBrZHM7XHJcblx0XHRcdH0sXHJcblx0XHR9KTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQb29wSnMsICdrZHMnLCB7XHJcblx0XHRcdGdldDogKCkgPT4gZXRjLmtkcyxcclxuXHRcdFx0c2V0OiAodikgPT4gT2JqZWN0LmFzc2lnbihldGMua2RzLCB2KSxcclxuXHRcdH0pO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdlbmVyYXRlS2RzQ29kZXMoZTogS2V5Ym9hcmRFdmVudCAmIE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0bGV0IGJhc2VQcmVmaXggPSBgJHtlLnNoaWZ0S2V5ID8gJzwnIDogJyd9JHtlLmN0cmxLZXkgPyAnXicgOiAnJ30ke2UuYWx0S2V5ID8gJz4nIDogJyd9YDtcclxuXHRcdFx0bGV0IGJhc2VDb2RlID0gZS5jb2RlXHJcblx0XHRcdFx0PyBlLmNvZGUucmVwbGFjZSgvS2V5fERpZ2l0fEFycm93fExlZnR8UmlnaHQvLCAnJylcclxuXHRcdFx0XHQ6IFsnTE1CJywgJ1JNQicsICdNTUInXVtlLmJ1dHRvbl07XHJcblx0XHRcdGxldCBleHRyYUNvZGUgPSBlLmNvZGVcclxuXHRcdFx0XHQ/IGJhc2VDb2RlLnJlcGxhY2UoJ0NvbnRyb2wnLCAnQ3RybCcpXHJcblx0XHRcdFx0OiBiYXNlQ29kZTsvLyBbJ0xlZnQnLCAnUmlnaHQnLCAnTWlkZGxlJ11bZS5idXR0b25dO1xyXG5cdFx0XHRsZXQgcmF3Q29kZSA9IGUuY29kZSA/PyBiYXNlQ29kZTtcclxuXHRcdFx0bGV0IGtleUNvZGUgPSBlLmtleSA/PyBiYXNlQ29kZTtcclxuXHRcdFx0bGV0IGV4dHJhUHJlZml4ID0gYmFzZVByZWZpeC5yZXBsYWNlKFxyXG5cdFx0XHRcdGJhc2VDb2RlID09ICdTaGlmdCcgPyAnPCcgOiBiYXNlQ29kZSA9PSAnQ29udHJvbCcgPyAnXicgOiBiYXNlQ29kZSA9PSAnQWx0JyA/ICc+JyA6ICcnXHJcblx0XHRcdFx0LCAnJyk7XHJcblxyXG5cdFx0XHRsZXQgY29kZXMgPSBbYmFzZUNvZGUsIGV4dHJhQ29kZSwgcmF3Q29kZSwga2V5Q29kZV0uZmxhdE1hcChcclxuXHRcdFx0XHRjID0+IFtiYXNlUHJlZml4LCBleHRyYVByZWZpeF0ubWFwKHAgPT4gcCArIGMpXHJcblx0XHRcdCk7XHJcblx0XHRcdC8vLmZsYXRNYXAoZSA9PiBbZSwgZS50b1VwcGVyQ2FzZSgpLCBlLnRvTG93ZXJDYXNlKCldKTtcclxuXHRcdFx0Y29kZXMucHVzaChlLmNvZGUgPyAna2V5JyA6ICdtb3VzZScpO1xyXG5cdFx0XHRjb2Rlcy5wdXNoKCdhbnknKTtcclxuXHRcdFx0cmV0dXJuIEFycmF5LmZyb20obmV3IFNldChjb2RlcykpO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGtkc0xpc3RlbmVyKGU6IEtleWJvYXJkRXZlbnQgJiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdGxldCBjb2RlcyA9IGdlbmVyYXRlS2RzQ29kZXMoZSk7XHJcblx0XHRcdE9iamVjdC5hc3NpZ24oZSwgeyBfY29kZXM6IGNvZGVzIH0pO1xyXG5cdFx0XHRmb3IgKGxldCBjIG9mIGNvZGVzKSB7XHJcblx0XHRcdFx0bGV0IGxpc3RlbmVyID0gZXRjLmtkc1tjXTtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGxpc3RlbmVyID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRxKGxpc3RlbmVyKS5jbGljaygpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGxpc3RlbmVyID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdChldGMua2RzW2NdIGFzIGFueSkoZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBpbml0S2RzKCkge1xyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2RzTGlzdGVuZXIpO1xyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBrZHNMaXN0ZW5lcik7XHJcblx0XHRcdHJldHVybiB7fTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IF9rYmRJbml0ZWQgPSBmYWxzZTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBtYWtlS2RzKGtkczogeyBbazogc3RyaW5nXTogc3RyaW5nIHwgKChlOiBLZXlib2FyZEV2ZW50ICYgTW91c2VFdmVudCkgPT4gdm9pZCkgfSkge1xyXG5cdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihldGMua2RzLCBrZHMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRleHBvcnQgZGVjbGFyZSBsZXQga2RzOiB0eXBlb2YgZXRjLmtkcztcclxufVxyXG5cclxuLy8gaW50ZXJmYWNlIFN0cmluZyB7XHJcbi8vIFx0aGFzaENvZGU6ICgpID0+IG51bWJlcjtcclxuLy8gfVxyXG4iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IHR5cGUgZGVsdGFUaW1lID0gbnVtYmVyIHwgYCR7bnVtYmVyfSR7J3MnIHwgJ2gnIHwgJ2QnIHwgJ3cnIHwgJ3knfWAgfCBudWxsO1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRGVsdGFUaW1lKG1heEFnZTogZGVsdGFUaW1lKSB7XHJcblx0XHRpZiAodHlwZW9mIG1heEFnZSA9PSAnbnVtYmVyJykgcmV0dXJuIG1heEFnZTtcclxuXHRcdGlmICh0eXBlb2YgbWF4QWdlICE9ICdzdHJpbmcnKSByZXR1cm4gSW5maW5pdHk7XHJcblx0XHRjb25zdCBhVG9NID0geyBzOiAxZTMsIGg6IDM2MDBlMywgZDogMjQgKiAzNjAwZTMsIHc6IDcgKiAyNCAqIDM2MDBlMywgeTogMzY1ICogMjQgKiAzNjAwZTMgfTtcclxuXHRcdGxldCBuID0gcGFyc2VGbG9hdChtYXhBZ2UpO1xyXG5cdFx0bGV0IG0gPSBhVG9NW21heEFnZVttYXhBZ2UubGVuZ3RoIC0gMV1dO1xyXG5cdFx0aWYgKG4gIT0gbiB8fCAhbSkgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGRlbHRhVGltZScpO1xyXG5cdFx0cmV0dXJuIG4gKiBtO1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBGZXRjaEV4dGVuc2lvbiB7XHJcblx0XHRleHBvcnQgdHlwZSBSZXF1ZXN0SW5pdEV4ID0gUmVxdWVzdEluaXQgJiB7IG1heEFnZT86IGRlbHRhVGltZSwgeG1sPzogYm9vbGVhbiB9O1xyXG5cdFx0ZXhwb3J0IHR5cGUgUmVxdWVzdEluaXRFeEpzb24gPSBSZXF1ZXN0SW5pdCAmIHsgbWF4QWdlPzogZGVsdGFUaW1lLCBpbmRleGVkRGI/OiBib29sZWFuIH07XHJcblx0XHRleHBvcnQgbGV0IGRlZmF1bHRzOiBSZXF1ZXN0SW5pdCA9IHsgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyB9O1xyXG5cclxuXHRcdGV4cG9ydCBsZXQgY2FjaGU6IENhY2hlID0gbnVsbDtcclxuXHRcdGFzeW5jIGZ1bmN0aW9uIG9wZW5DYWNoZSgpIHtcclxuXHRcdFx0aWYgKGNhY2hlKSByZXR1cm4gY2FjaGU7XHJcblx0XHRcdGNhY2hlID0gYXdhaXQgY2FjaGVzLm9wZW4oJ2ZldGNoJyk7XHJcblx0XHRcdHJldHVybiBjYWNoZTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiB0b0R1cihkdDogZGVsdGFUaW1lKSB7XHJcblx0XHRcdGR0ID0gbm9ybWFsaXplRGVsdGFUaW1lKGR0KTtcclxuXHRcdFx0aWYgKGR0ID4gMWUxMCkgZHQgPSBEYXRlLm5vdygpIC0gZHQ7XHJcblx0XHRcdGxldCBzcGxpdCA9IChuOiBudW1iZXIsIGQ6IG51bWJlcikgPT4gW24gJSBkLCB+fihuIC8gZCldO1xyXG5cdFx0XHRsZXQgdG8yID0gKG46IG51bWJlcikgPT4gKG4gKyAnJykucGFkU3RhcnQoMiwgJzAnKTtcclxuXHRcdFx0dmFyIFttcywgc10gPSBzcGxpdChkdCwgMTAwMCk7XHJcblx0XHRcdHZhciBbcywgbV0gPSBzcGxpdChzLCA2MCk7XHJcblx0XHRcdHZhciBbbSwgaF0gPSBzcGxpdChtLCA2MCk7XHJcblx0XHRcdHZhciBbaCwgZF0gPSBzcGxpdChoLCAyNCk7XHJcblx0XHRcdHZhciBbZCwgd10gPSBzcGxpdChkLCA3KTtcclxuXHRcdFx0cmV0dXJuIHcgPiAxZTMgPyAnZm9yZXZlcicgOiB3ID8gYCR7d313JHtkfWRgIDogZCA/IGAke2R9ZCR7dG8yKGgpfWhgIDogaCArIG0gPyBgJHt0bzIoaCl9OiR7dG8yKG0pfToke3RvMihzKX1gIDogYCR7cyArIH5+bXMgLyAxMDAwfXNgO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBpc1N0YWxlKGNhY2hlZEF0OiBudW1iZXIsIG1heEFnZT86IGRlbHRhVGltZSkge1xyXG5cdFx0XHRpZiAobWF4QWdlID09IG51bGwpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIERhdGUubm93KCkgLSBjYWNoZWRBdCA+PSBub3JtYWxpemVEZWx0YVRpbWUobWF4QWdlKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FjaGVkKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdEV4ID0ge30pOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcblx0XHRcdGxldCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHRcdFx0bGV0IGNhY2hlID0gYXdhaXQgb3BlbkNhY2hlKCk7XHJcblx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGNhY2hlLm1hdGNoKHVybCk7XHJcblx0XHRcdGlmIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdHJlc3BvbnNlLmNhY2hlZEF0ID0gK3Jlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjYWNoZWQtYXQnKSB8fCAwO1xyXG5cdFx0XHRcdGlmICghaXNTdGFsZShyZXNwb25zZS5jYWNoZWRBdCwgbm9ybWFsaXplRGVsdGFUaW1lKGluaXQubWF4QWdlKSkpIHtcclxuXHRcdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgQ2FjaGVkIHJlc3BvbnNlOiAke3RvRHVyKHJlc3BvbnNlLmNhY2hlZEF0KX0gPCBjOiR7dG9EdXIoaW5pdC5tYXhBZ2UpfWAsIHVybCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgU3RhbGUgcmVzcG9uc2U6ICR7dG9EdXIocmVzcG9uc2UuY2FjaGVkQXQpfSA+IGM6JHt0b0R1cihpbml0Lm1heEFnZSl9YCwgdXJsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXNwb25zZSA9XHJcblx0XHRcdFx0IWluaXQueG1sID8gYXdhaXQgZmV0Y2godXJsLCB7IC4uLmRlZmF1bHRzLCAuLi5pbml0IH0pXHJcblx0XHRcdFx0XHQ6IGF3YWl0IHhtbFJlc3BvbnNlKHVybCwgaW5pdCk7XHJcblx0XHRcdGlmIChyZXNwb25zZS5vaykge1xyXG5cdFx0XHRcdHJlc3BvbnNlLmNhY2hlZEF0ID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0XHRsZXQgY2xvbmUgPSByZXNwb25zZS5jbG9uZSgpO1xyXG5cdFx0XHRcdGxldCBpbml0MjogUmVzcG9uc2VJbml0ID0ge1xyXG5cdFx0XHRcdFx0c3RhdHVzOiBjbG9uZS5zdGF0dXMsIHN0YXR1c1RleHQ6IGNsb25lLnN0YXR1c1RleHQsXHJcblx0XHRcdFx0XHRoZWFkZXJzOiBbWydjYWNoZWQtYXQnLCBgJHtyZXNwb25zZS5jYWNoZWRBdH1gXSwgLi4uY2xvbmUuaGVhZGVycy5lbnRyaWVzKCldXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRsZXQgcmVzdWx0UmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoY2xvbmUuYm9keSwgaW5pdDIpO1xyXG5cdFx0XHRcdGNhY2hlLnB1dCh1cmwsIHJlc3VsdFJlc3BvbnNlKTtcclxuXHRcdFx0XHRsZXQgZHQgPSBwZXJmb3JtYW5jZS5ub3coKSAtIG5vdztcclxuXHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYExvYWRlZCByZXNwb25zZTogJHt0b0R1cihkdCl9IC8gYzoke3RvRHVyKGluaXQubWF4QWdlKX1gLCB1cmwpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgRmFpbGVkIHJlc3BvbnNlOiAke3RvRHVyKHJlc3BvbnNlLmNhY2hlZEF0KX0gLyBjOiR7dG9EdXIoaW5pdC5tYXhBZ2UpfWAsIHVybCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYWNoZWREb2ModXJsOiBzdHJpbmcsIGluaXQ6IFJlcXVlc3RJbml0RXggPSB7fSk6IFByb21pc2U8RG9jdW1lbnQ+IHtcclxuXHRcdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgY2FjaGVkKHVybCwgaW5pdCk7XHJcblx0XHRcdGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG5cdFx0XHRsZXQgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG5cdFx0XHRsZXQgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAndGV4dC9odG1sJyk7XHJcblx0XHRcdGxldCBiYXNlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2Jhc2UnKTtcclxuXHRcdFx0YmFzZS5ocmVmID0gdXJsO1xyXG5cdFx0XHRkb2MuaGVhZC5hcHBlbmQoYmFzZSk7XHJcblx0XHRcdGRvYy5jYWNoZWRBdCA9IHJlc3BvbnNlLmNhY2hlZEF0O1xyXG5cdFx0XHRyZXR1cm4gZG9jO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gZG9jKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdEV4ID0ge30pOiBQcm9taXNlPERvY3VtZW50PiB7XHJcblx0XHRcdGxldCByZXNwb25zZSA9XHJcblx0XHRcdFx0IWluaXQueG1sID8gYXdhaXQgZmV0Y2godXJsLCB7IC4uLmRlZmF1bHRzLCAuLi5pbml0IH0pXHJcblx0XHRcdFx0OiBhd2FpdCB4bWxSZXNwb25zZSh1cmwsIGluaXQpO1xyXG5cdFx0XHRsZXQgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuXHRcdFx0bGV0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcclxuXHRcdFx0bGV0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcodGV4dCwgJ3RleHQvaHRtbCcpO1xyXG5cdFx0XHRsZXQgYmFzZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdiYXNlJyk7XHJcblx0XHRcdGJhc2UuaHJlZiA9IHVybDtcclxuXHRcdFx0ZG9jLmhlYWQuYXBwZW5kKGJhc2UpO1xyXG5cdFx0XHRkb2MuY2FjaGVkQXQgPSByZXNwb25zZS5jYWNoZWRBdDtcclxuXHRcdFx0cmV0dXJuIGRvYztcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24geG1sUmVzcG9uc2UodXJsOiBzdHJpbmcsIGluaXQ6IFJlcXVlc3RJbml0RXggPSB7fSk6IFByb21pc2U8UmVzcG9uc2U+IHtcclxuXHRcdFx0bGV0IHAgPSBQcm9taXNlRXh0ZW5zaW9uLmVtcHR5KCk7XHJcblx0XHRcdGxldCBvUmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdG9SZXEub25sb2FkID0gcC5yO1xyXG5cdFx0XHRvUmVxLnJlc3BvbnNlVHlwZSA9ICdkb2N1bWVudCc7XHJcblx0XHRcdG9SZXEub3BlbihcImdldFwiLCB1cmwsIHRydWUpO1xyXG5cdFx0XHRvUmVxLnNlbmQoKTtcclxuXHRcdFx0YXdhaXQgcDtcclxuXHRcdFx0aWYgKG9SZXEucmVzcG9uc2VUeXBlICE9ICdkb2N1bWVudCcpIHRocm93IG5ldyBFcnJvcignRklYTUUnKTtcclxuXHRcdFx0cmV0dXJuIG5ldyBSZXNwb25zZShvUmVxLnJlc3BvbnNlWE1MLmRvY3VtZW50RWxlbWVudC5vdXRlckhUTUwsIGluaXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBqc29uKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdCA9IHt9KTogUHJvbWlzZTx1bmtub3duPiB7XHJcblx0XHRcdHJldHVybiBmZXRjaCh1cmwsIHsgLi4uZGVmYXVsdHMsIC4uLmluaXQgfSkudGhlbihlID0+IGUuanNvbigpKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xlYXJDYWNoZSgpIHtcclxuXHRcdFx0Y2FjaGUgPSBudWxsO1xyXG5cdFx0XHRyZXR1cm4gY2FjaGVzLmRlbGV0ZSgnZmV0Y2gnKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gdW5jYWNoZSh1cmw6IHN0cmluZykge1xyXG5cdFx0XHRsZXQgY2FjaGUgPSBhd2FpdCBvcGVuQ2FjaGUoKTtcclxuXHRcdFx0bGV0IGQxID0gY2FjaGUuZGVsZXRlKHVybCk7XHJcblx0XHRcdGxldCBkMiA9IGF3YWl0IGlkYkRlbGV0ZSh1cmwpO1xyXG5cdFx0XHRyZXR1cm4gKGF3YWl0IGQxKSB8fCBkMjtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNDYWNoZWQodXJsOiBzdHJpbmcsIG9wdGlvbnM6IHsgbWF4QWdlPzogZGVsdGFUaW1lLCBpbmRleGVkRGI/OiBib29sZWFuIHwgJ29ubHknIH0gPSB7fSk6IFByb21pc2U8Ym9vbGVhbiB8ICdpZGInPiB7XHJcblx0XHRcdGlmIChvcHRpb25zLmluZGV4ZWREYikge1xyXG5cdFx0XHRcdGxldCBkYkpzb24gPSBhd2FpdCBpZGJHZXQodXJsKTtcclxuXHRcdFx0XHRpZiAoZGJKc29uKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gaXNTdGFsZShkYkpzb24uY2FjaGVkQXQsIG5vcm1hbGl6ZURlbHRhVGltZShvcHRpb25zLm1heEFnZSkpID8gZmFsc2UgOiAnaWRiJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5kZXhlZERiID09ICdvbmx5JykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBjYWNoZSA9IGF3YWl0IG9wZW5DYWNoZSgpO1xyXG5cdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBjYWNoZS5tYXRjaCh1cmwpO1xyXG5cdFx0XHRpZiAoIXJlc3BvbnNlKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChvcHRpb25zPy5tYXhBZ2UgIT0gbnVsbCkge1xyXG5cdFx0XHRcdGxldCBjYWNoZWRBdCA9ICtyZXNwb25zZS5oZWFkZXJzLmdldCgnY2FjaGVkLWF0JykgfHwgMDtcclxuXHRcdFx0XHRpZiAoaXNTdGFsZShyZXNwb25zZS5jYWNoZWRBdCwgbm9ybWFsaXplRGVsdGFUaW1lKG9wdGlvbnMubWF4QWdlKSkpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FjaGVkSnNvbih1cmw6IHN0cmluZywgaW5pdDogUmVxdWVzdEluaXRFeEpzb24gPSB7fSk6IFByb21pc2U8dW5rbm93bj4ge1xyXG5cdFx0XHRpZiAoaW5pdC5pbmRleGVkRGIpIHtcclxuXHRcdFx0XHRsZXQgZGJKc29uID0gYXdhaXQgaWRiR2V0KHVybCk7XHJcblx0XHRcdFx0aWYgKGRiSnNvbikge1xyXG5cdFx0XHRcdFx0aWYgKCFpc1N0YWxlKGRiSnNvbi5jYWNoZWRBdCwgaW5pdC5tYXhBZ2UpKSB7XHJcblx0XHRcdFx0XHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZShkYkpzb24uZGF0YSBhcyBhbnksICdjYWNoZWQnLCBkYkpzb24uY2FjaGVkQXQpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZGJKc29uLmRhdGE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGNhY2hlZCh1cmwsIGluaXQpO1xyXG5cdFx0XHRsZXQganNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHRcdFx0aWYgKCEoJ2NhY2hlZCcgaW4ganNvbikpIHtcclxuXHRcdFx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUoanNvbiwgJ2NhY2hlZCcsIHJlc3BvbnNlLmNhY2hlZEF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaW5pdC5pbmRleGVkRGIpIHtcclxuXHRcdFx0XHRpZGJQdXQodXJsLCBqc29uLCByZXNwb25zZS5jYWNoZWRBdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGpzb247XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGxldCBfaWRiSW5zdGFuY2VQcm9taXNlOiBJREJEYXRhYmFzZSB8IFByb21pc2U8SURCRGF0YWJhc2U+ID0gbnVsbDtcclxuXHRcdGxldCBpZGJJbnN0YW5jZTogSURCRGF0YWJhc2UgPSBudWxsO1xyXG5cclxuXHRcdGFzeW5jIGZ1bmN0aW9uIG9wZW5JZGIoKTogUHJvbWlzZTxJREJEYXRhYmFzZT4ge1xyXG5cdFx0XHRpZiAoaWRiSW5zdGFuY2UpIHJldHVybiBpZGJJbnN0YW5jZTtcclxuXHRcdFx0aWYgKGF3YWl0IF9pZGJJbnN0YW5jZVByb21pc2UpIHtcclxuXHRcdFx0XHRyZXR1cm4gaWRiSW5zdGFuY2U7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGlycSA9IGluZGV4ZWREQi5vcGVuKCdmZXRjaCcpO1xyXG5cdFx0XHRpcnEub251cGdyYWRlbmVlZGVkID0gZXZlbnQgPT4ge1xyXG5cdFx0XHRcdGxldCBkYiA9IGlycS5yZXN1bHQ7XHJcblx0XHRcdFx0bGV0IHN0b3JlID0gZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ2ZldGNoJywgeyBrZXlQYXRoOiAndXJsJyB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRfaWRiSW5zdGFuY2VQcm9taXNlID0gbmV3IFByb21pc2UoKHIsIGopID0+IHtcclxuXHRcdFx0XHRpcnEub25zdWNjZXNzID0gcjtcclxuXHRcdFx0XHRpcnEub25lcnJvciA9IGo7XHJcblx0XHRcdH0pLnRoZW4oKCkgPT4gaXJxLnJlc3VsdCwgKCkgPT4gbnVsbCk7XHJcblx0XHRcdGlkYkluc3RhbmNlID0gX2lkYkluc3RhbmNlUHJvbWlzZSA9IGF3YWl0IF9pZGJJbnN0YW5jZVByb21pc2U7XHJcblx0XHRcdGlmICghaWRiSW5zdGFuY2UpIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIG9wZW4gaW5kZXhlZERCJyk7XHJcblx0XHRcdHJldHVybiBpZGJJbnN0YW5jZTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gaWRiQ2xlYXIoKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignVE9ETycpXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGFzeW5jIGZ1bmN0aW9uIGlkYkdldCh1cmw6IHN0cmluZyk6IFByb21pc2U8eyB1cmw6IHN0cmluZywgZGF0YTogdW5rbm93biwgY2FjaGVkQXQ6IG51bWJlciB9IHwgdW5kZWZpbmVkPiB7XHJcblx0XHRcdGxldCBkYiA9IGF3YWl0IG9wZW5JZGIoKTtcclxuXHRcdFx0bGV0IHQgPSBkYi50cmFuc2FjdGlvbihbJ2ZldGNoJ10sICdyZWFkb25seScpO1xyXG5cdFx0XHRsZXQgcnEgPSB0Lm9iamVjdFN0b3JlKCdmZXRjaCcpLmdldCh1cmwpO1xyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UociA9PiB7XHJcblx0XHRcdFx0cnEub25zdWNjZXNzID0gKCkgPT4gcihycS5yZXN1bHQpO1xyXG5cdFx0XHRcdHJxLm9uZXJyb3IgPSAoKSA9PiByKHVuZGVmaW5lZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGFzeW5jIGZ1bmN0aW9uIGlkYlB1dCh1cmw6IHN0cmluZywgZGF0YTogdW5rbm93biwgY2FjaGVkQXQ/OiBudW1iZXIpOiBQcm9taXNlPElEQlZhbGlkS2V5IHwgdW5kZWZpbmVkPiB7XHJcblx0XHRcdGxldCBkYiA9IGF3YWl0IG9wZW5JZGIoKTtcclxuXHRcdFx0bGV0IHQgPSBkYi50cmFuc2FjdGlvbihbJ2ZldGNoJ10sICdyZWFkd3JpdGUnKTtcclxuXHRcdFx0bGV0IHJxID0gdC5vYmplY3RTdG9yZSgnZmV0Y2gnKS5wdXQoeyB1cmwsIGRhdGEsIGNhY2hlZEF0OiBjYWNoZWRBdCA/PyArbmV3IERhdGUoKSB9KTtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHIgPT4ge1xyXG5cdFx0XHRcdHJxLm9uc3VjY2VzcyA9ICgpID0+IHIocnEucmVzdWx0KTtcclxuXHRcdFx0XHRycS5vbmVycm9yID0gKCkgPT4gcih1bmRlZmluZWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRhc3luYyBmdW5jdGlvbiBpZGJEZWxldGUodXJsOiBzdHJpbmcpOiBQcm9taXNlPElEQlZhbGlkS2V5IHwgdW5kZWZpbmVkPiB7XHJcblx0XHRcdGxldCBkYiA9IGF3YWl0IG9wZW5JZGIoKTtcclxuXHRcdFx0bGV0IHQgPSBkYi50cmFuc2FjdGlvbihbJ2ZldGNoJ10sICdyZWFkd3JpdGUnKTtcclxuXHRcdFx0bGV0IHJxID0gdC5vYmplY3RTdG9yZSgnZmV0Y2gnKS5kZWxldGUodXJsKTtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHIgPT4ge1xyXG5cdFx0XHRcdHJxLm9uc3VjY2VzcyA9ICgpID0+IHIocnEucmVzdWx0KTtcclxuXHRcdFx0XHRycS5vbmVycm9yID0gKCkgPT4gcih1bmRlZmluZWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIEVudHJ5RmlsdGVyZXJFeHRlbnNpb24ge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogY2FuIGJlIGVpdGhlciBNYXAgb3IgV2Vha01hcFxyXG5cdFx0ICogKFdlYWtNYXAgaXMgbGlrZWx5IHRvIGJlIHVzZWxlc3MgaWYgdGhlcmUgYXJlIGxlc3MgdGhlbiAxMGsgb2xkIG5vZGVzIGluIG1hcClcclxuXHRcdCAqL1xyXG5cdFx0bGV0IE1hcFR5cGUgPSBNYXA7XHJcblx0XHR0eXBlIE1hcFR5cGU8SyBleHRlbmRzIG9iamVjdCwgVj4gPS8vIE1hcDxLLCBWPiB8IFxyXG5cdFx0XHRXZWFrTWFwPEssIFY+O1xyXG5cclxuXHRcdGZ1bmN0aW9uIHRvRWxBcnJheShlbnRyeVNlbGVjdG9yOiBzZWxlY3RvciB8ICgoKSA9PiBIVE1MRWxlbWVudFtdKSk6IEhUTUxFbGVtZW50W10ge1xyXG5cdFx0XHRyZXR1cm4gdHlwZW9mIGVudHJ5U2VsZWN0b3IgPT0gJ2Z1bmN0aW9uJyA/IGVudHJ5U2VsZWN0b3IoKSA6IHFxKGVudHJ5U2VsZWN0b3IpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBFbnRyeUZpbHRlcmVyPERhdGEgZXh0ZW5kcyB7fSA9IHt9PiB7XHJcblx0XHRcdGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcblx0XHRcdGVudHJ5U2VsZWN0b3I6IHNlbGVjdG9yIHwgKCgpID0+IEhUTUxFbGVtZW50W10pO1xyXG5cdFx0XHRjb25zdHJ1Y3RvcihlbnRyeVNlbGVjdG9yOiBzZWxlY3RvciB8ICgoKSA9PiBIVE1MRWxlbWVudFtdKSwgZW5hYmxlZDogYm9vbGVhbiB8ICdzb2Z0JyA9ICdzb2Z0Jykge1xyXG5cdFx0XHRcdHRoaXMuZW50cnlTZWxlY3RvciA9IGVudHJ5U2VsZWN0b3I7XHJcblx0XHRcdFx0dGhpcy5jb250YWluZXIgPSBlbG0oJy5lZi1jb250YWluZXInKTtcclxuXHJcblx0XHRcdFx0aWYgKGVuYWJsZWQgPT0gJ3NvZnQnKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNvZnREaXNhYmxlID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHRoaXMuZGlzYWJsZSgnc29mdCcpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZW5hYmxlZCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zb2Z0RGlzYWJsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBlbmFibGVkIGlzIGZhbHN5XHJcblx0XHRcdFx0XHR0aGlzLnNvZnREaXNhYmxlID0gZmFsc2U7XHJcblx0XHRcdFx0XHR0aGlzLmRpc2FibGUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5zdHlsZSgpO1xyXG5cclxuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI8UGFnaW5hdGVFeHRlbnNpb24uUE1vZGlmeUV2ZW50PigncGFnaW5hdGlvbm1vZGlmeScsICgpID0+IHRoaXMucmVxdWVzdFVwZGF0ZSgpKTtcclxuXHRcdFx0XHRldGMub25oZWlnaHRjaGFuZ2UoKCkgPT4gdGhpcy5yZXF1ZXN0VXBkYXRlKCkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRlbnRyaWVzOiBIVE1MRWxlbWVudFtdID0gW107XHJcblx0XHRcdGVudHJ5RGF0YXM6IE1hcFR5cGU8SFRNTEVsZW1lbnQsIERhdGE+ID0gbmV3IE1hcFR5cGUoKTtcclxuXHJcblx0XHRcdGdldERhdGEoZWw6IEhUTUxFbGVtZW50KTogRGF0YTtcclxuXHRcdFx0Z2V0RGF0YSgpOiBEYXRhW107XHJcblx0XHRcdGdldERhdGEoZWw/OiBIVE1MRWxlbWVudCk6IERhdGEgfCBEYXRhW10ge1xyXG5cdFx0XHRcdGlmICghZWwpIHJldHVybiB0aGlzLmVudHJpZXMubWFwKGUgPT4gdGhpcy5nZXREYXRhKGUpKTtcclxuXHRcdFx0XHRsZXQgZGF0YSA9IHRoaXMuZW50cnlEYXRhcy5nZXQoZWwpO1xyXG5cdFx0XHRcdGlmICghZGF0YSkge1xyXG5cdFx0XHRcdFx0ZGF0YSA9IHRoaXMucGFyc2VFbnRyeShlbCk7XHJcblx0XHRcdFx0XHR0aGlzLmVudHJ5RGF0YXMuc2V0KGVsLCBkYXRhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHVwZGF0ZVBlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0cmVwYXJzZVBlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0cmVxdWVzdFVwZGF0ZShyZXBhcnNlID0gZmFsc2UpIHtcclxuXHRcdFx0XHRpZiAodGhpcy51cGRhdGVQZW5kaW5nKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy51cGRhdGVQZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAocmVwYXJzZSkgdGhpcy5yZXBhcnNlUGVuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cGFyc2VyczogUGFyc2VyRm48RGF0YT5bXSA9IFtdO1xyXG5cdFx0XHR3cml0ZURhdGFBdHRyaWJ1dGUgPSBmYWxzZTtcclxuXHRcdFx0YWRkUGFyc2VyKHBhcnNlcjogUGFyc2VyRm48RGF0YT4pIHtcclxuXHRcdFx0XHR0aGlzLnBhcnNlcnMucHVzaChwYXJzZXIpO1xyXG5cdFx0XHRcdHRoaXMucmVxdWVzdFVwZGF0ZSh0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRwYXJzZUVudHJ5KGVsOiBIVE1MRWxlbWVudCk6IERhdGEge1xyXG5cdFx0XHRcdGVsLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZWYtZW50cnktY29udGFpbmVyJyk7XHJcblx0XHRcdFx0ZWwuY2xhc3NMaXN0LmFkZCgnZWYtZW50cnknKTtcclxuXHJcblx0XHRcdFx0bGV0IGRhdGE6IERhdGEgPSB7fSBhcyBEYXRhO1xyXG5cdFx0XHRcdGZvciAobGV0IHBhcnNlciBvZiB0aGlzLnBhcnNlcnMpIHtcclxuXHRcdFx0XHRcdGxldCBuZXdEYXRhID0gcGFyc2VyKGVsLCBkYXRhKTtcclxuXHRcdFx0XHRcdGlmICghbmV3RGF0YSB8fCBuZXdEYXRhID09IGRhdGEpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0aWYgKCFJc1Byb21pc2UobmV3RGF0YSkpIHtcclxuXHRcdFx0XHRcdFx0T2JqZWN0LmFzc2lnbihkYXRhLCBuZXdEYXRhKTtcclxuXHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdEYXRhLnRoZW4ocE5ld0RhdGEgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZiAocE5ld0RhdGEgJiYgcE5ld0RhdGEgIT0gZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdE9iamVjdC5hc3NpZ24oZGF0YSwgcE5ld0RhdGEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoaXMucmVxdWVzdFVwZGF0ZSgpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMud3JpdGVEYXRhQXR0cmlidXRlKSB7XHJcblx0XHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoJ2VmLWRhdGEnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhZGRJdGVtPElULCBUIGV4dGVuZHMgSVQsIElTIGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCwgUywgVFMgZXh0ZW5kcyBTICYgSVMgJiBGaWx0ZXJlckl0ZW1Tb3VyY2U+KGNvbnN0cnVjdG9yOiB7IG5ldyhkYXRhOiBUUyk6IFQgfSwgbGlzdDogSVRbXSwgZGF0YTogSVMsIHNvdXJjZTogUyk6IFQge1xyXG5cdFx0XHRcdE9iamVjdC5hc3NpZ24oZGF0YSwgc291cmNlLCB7IHBhcmVudDogdGhpcyB9KTtcclxuXHRcdFx0XHRkYXRhLm5hbWUgPz89IGRhdGEuaWQ7XHJcblx0XHRcdFx0bGV0IGl0ZW0gPSBuZXcgY29uc3RydWN0b3IoZGF0YSBhcyBUUyk7XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmaWx0ZXJzOiBJRmlsdGVyPERhdGE+W10gPSBbXTtcclxuXHRcdFx0c29ydGVyczogSVNvcnRlcjxEYXRhPltdID0gW107XHJcblx0XHRcdG1vZGlmaWVyczogSU1vZGlmaWVyPERhdGE+W10gPSBbXTtcclxuXHJcblx0XHRcdGFkZEZpbHRlcihpZDogc3RyaW5nLCBmaWx0ZXI6IEZpbHRlckZuPERhdGE+LCBkYXRhOiBGaWx0ZXJQYXJ0aWFsPERhdGE+ID0ge30pOiBGaWx0ZXI8RGF0YT4ge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oRmlsdGVyLCB0aGlzLmZpbHRlcnMsIGRhdGEsIHsgaWQsIGZpbHRlciB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRWRmlsdGVyPFYgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+KGlkOiBzdHJpbmcsIGZpbHRlcjogVmFsdWVGaWx0ZXJGbjxEYXRhLCBWPiwgZGF0YTogVmFsdWVGaWx0ZXJQYXJ0aWFsPERhdGEsIFY+KTogVmFsdWVGaWx0ZXI8RGF0YSwgVj47XHJcblx0XHRcdGFkZFZGaWx0ZXI8ViBleHRlbmRzIG51bWJlciB8IHN0cmluZz4oaWQ6IHN0cmluZywgZmlsdGVyOiBWYWx1ZUZpbHRlckZuPERhdGEsIFY+LCBkYXRhOiBWKTtcclxuXHRcdFx0YWRkVkZpbHRlcjxWIGV4dGVuZHMgbnVtYmVyIHwgc3RyaW5nPihpZDogc3RyaW5nLCBmaWx0ZXI6IFZhbHVlRmlsdGVyRm48RGF0YSwgVj4sIGRhdGE6IFZhbHVlRmlsdGVyUGFydGlhbDxEYXRhLCBWPiB8IFYpIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGRhdGEgIT0gJ29iamVjdCcgfHwgIWRhdGEpIHtcclxuXHRcdFx0XHRcdGRhdGEgPSB7IGlucHV0OiBkYXRhIGFzIFYgfTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShWYWx1ZUZpbHRlciwgdGhpcy5maWx0ZXJzLCBkYXRhLCB7IGlkLCBmaWx0ZXIgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkTUZpbHRlcihpZDogc3RyaW5nLCB2YWx1ZTogKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkgPT4gc3RyaW5nLCBkYXRhOiBNYXRjaEZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oTWF0Y2hGaWx0ZXIsIHRoaXMuZmlsdGVycywgZGF0YSwgeyBpZCwgdmFsdWUgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkVGFnRmlsdGVyKGlkOiBzdHJpbmcsIGRhdGE6IFRhZ0ZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oVGFnRmlsdGVyLCB0aGlzLmZpbHRlcnMsIGRhdGEsIHsgaWQgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkU29ydGVyPFYgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+KGlkOiBzdHJpbmcsIHNvcnRlcjogU29ydGVyRm48RGF0YSwgVj4sIGRhdGE6IFNvcnRlclBhcnRpYWxTb3VyY2U8RGF0YSwgVj4gPSB7fSk6IFNvcnRlcjxEYXRhLCBWPiB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShTb3J0ZXIsIHRoaXMuc29ydGVycywgZGF0YSwgeyBpZCwgc29ydGVyIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZE1vZGlmaWVyKGlkOiBzdHJpbmcsIG1vZGlmaWVyOiBNb2RpZmllckZuPERhdGE+LCBkYXRhOiBNb2RpZmllclBhcnRpYWw8RGF0YT4gPSB7fSk6IE1vZGlmaWVyPERhdGE+IHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKE1vZGlmaWVyLCB0aGlzLm1vZGlmaWVycywgZGF0YSwgeyBpZCwgbW9kaWZpZXIgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkUHJlZml4KGlkOiBzdHJpbmcsIHByZWZpeDogUHJlZml4ZXJGbjxEYXRhPiwgZGF0YTogUHJlZml4ZXJQYXJ0aWFsPERhdGE+ID0ge30pOiBQcmVmaXhlcjxEYXRhPiB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShQcmVmaXhlciwgdGhpcy5tb2RpZmllcnMsIGRhdGEsIHsgaWQsIHByZWZpeCB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRQYWdpbmF0aW9uSW5mbyhpZDogc3RyaW5nID0gJ3BnaW5mbycsIGRhdGE6IFBhcnRpYWw8RmlsdGVyZXJJdGVtU291cmNlPiA9IHt9KSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShQYWdpbmF0aW9uSW5mb0ZpbHRlciwgdGhpcy5maWx0ZXJzLCBkYXRhLCB7IGlkIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmaWx0ZXJFbnRyaWVzKCkge1xyXG5cdFx0XHRcdGZvciAobGV0IGVsIG9mIHRoaXMuZW50cmllcykge1xyXG5cdFx0XHRcdFx0bGV0IGRhdGEgPSB0aGlzLmdldERhdGEoZWwpO1xyXG5cdFx0XHRcdFx0bGV0IHZhbHVlID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGZvciAobGV0IGZpbHRlciBvZiB0aGlzLmZpbHRlcnMpIHtcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZSAmJiBmaWx0ZXIuYXBwbHkoZGF0YSwgZWwpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWwuY2xhc3NMaXN0LnRvZ2dsZSgnZWYtZmlsdGVyZWQtb3V0JywgIXZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdF9wcmV2aW91c1N0YXRlID0ge1xyXG5cdFx0XHRcdGFsbFNvcnRlcnNPZmY6IHRydWUsXHJcblx0XHRcdFx0dXBkYXRlRHVyYXRpb246IDAsXHJcblx0XHRcdFx0ZmluaXNoZWRBdDogMCxcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdG9yZGVyZWRFbnRyaWVzOiBIVE1MRWxlbWVudFtdID0gW107XHJcblx0XHRcdG9yZGVyTW9kZTogJ2NzcycgfCAnc3dhcCcgPSAnY3NzJztcclxuXHRcdFx0c29ydEVudHJpZXMoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZW50cmllcy5sZW5ndGggPD0gMSkgcmV0dXJuO1xyXG5cdFx0XHRcdGlmICh0aGlzLm9yZGVyZWRFbnRyaWVzLmxlbmd0aCA9PSAwKSB0aGlzLm9yZGVyZWRFbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xyXG5cdFx0XHRcdGlmICh0aGlzLnNvcnRlcnMubGVuZ3RoID09IDApIHJldHVybjtcclxuXHJcblx0XHRcdFx0bGV0IGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XHJcblx0XHRcdFx0bGV0IHBhaXJzOiBbRGF0YSwgSFRNTEVsZW1lbnRdW10gPSBlbnRyaWVzLm1hcChlID0+IFt0aGlzLmdldERhdGEoZSksIGVdKTtcclxuXHRcdFx0XHRsZXQgYWxsT2ZmID0gdHJ1ZTtcclxuXHRcdFx0XHRmb3IgKGxldCBzb3J0ZXIgb2YgdGhpcy5zb3J0ZXJzKSB7XHJcblx0XHRcdFx0XHRpZiAoc29ydGVyLm1vZGUgIT0gJ29mZicpIHtcclxuXHRcdFx0XHRcdFx0cGFpcnMgPSBzb3J0ZXIuc29ydChwYWlycyk7XHJcblx0XHRcdFx0XHRcdGFsbE9mZiA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbnRyaWVzID0gcGFpcnMubWFwKGUgPT4gZVsxXSk7XHJcblx0XHRcdFx0aWYgKHRoaXMub3JkZXJNb2RlID09ICdzd2FwJykge1xyXG5cdFx0XHRcdFx0aWYgKCFlbnRyaWVzLmV2ZXJ5KChlLCBpKSA9PiBlID09IHRoaXMub3JkZXJlZEVudHJpZXNbaV0pKSB7XHJcblx0XHRcdFx0XHRcdGxldCBiciA9IGVsbShgJHtlbnRyaWVzWzBdPy50YWdOYW1lfS5lZi1iZWZvcmUtc29ydFtoaWRkZW5dYCk7XHJcblx0XHRcdFx0XHRcdHRoaXMub3JkZXJlZEVudHJpZXNbMF0uYmVmb3JlKGJyKTtcclxuXHRcdFx0XHRcdFx0YnIuYWZ0ZXIoLi4uZW50cmllcyk7XHJcblx0XHRcdFx0XHRcdGJyLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoYWxsT2ZmICE9IHRoaXMuX3ByZXZpb3VzU3RhdGUuYWxsU29ydGVyc09mZikge1xyXG5cdFx0XHRcdFx0XHRlbnRyaWVzLm1hcCgoZSwgaSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChhbGxPZmYpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGUuY2xhc3NMaXN0LnJlbW92ZSgnZWYtcmVvcmRlcicpO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2VmLXJlb3JkZXItY29udGFpbmVyJyk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIHVzZSBgZmxleGAgb3IgYGdyaWRgIGNvbnRhaW5lciBhbmQgYG9yZGVyOnZhcigtLWVmLW9yZGVyKWAgZm9yIGNoaWxkcmVuIFxyXG5cdFx0XHRcdFx0XHRcdFx0ZS5jbGFzc0xpc3QuYWRkKCdlZi1yZW9yZGVyJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRlLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZWYtcmVvcmRlci1jb250YWluZXInKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCFhbGxPZmYpIHtcclxuXHRcdFx0XHRcdFx0ZW50cmllcy5tYXAoKGUsIGkpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRlLnN0eWxlLnNldFByb3BlcnR5KCctLWVmLW9yZGVyJywgaSArICcnKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMub3JkZXJlZEVudHJpZXMgPSBlbnRyaWVzO1xyXG5cdFx0XHRcdHRoaXMuX3ByZXZpb3VzU3RhdGUuYWxsU29ydGVyc09mZiA9IGFsbE9mZjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bW9kaWZ5RW50cmllcygpIHtcclxuXHRcdFx0XHRsZXQgZW50cmllcyA9IHRoaXMuZW50cmllcztcclxuXHRcdFx0XHRsZXQgcGFpcnM6IFtIVE1MRWxlbWVudCwgRGF0YV1bXSA9IGVudHJpZXMubWFwKGUgPT4gW2UsIHRoaXMuZ2V0RGF0YShlKV0pO1xyXG5cdFx0XHRcdGZvciAobGV0IG1vZGlmaWVyIG9mIHRoaXMubW9kaWZpZXJzKSB7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBbZSwgZF0gb2YgcGFpcnMpIHtcclxuXHRcdFx0XHRcdFx0bW9kaWZpZXIuYXBwbHkoZCwgZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtb3ZlVG9Ub3AoaXRlbTogSVNvcnRlcjxEYXRhPiB8IElNb2RpZmllcjxEYXRhPikge1xyXG5cdFx0XHRcdGlmICh0aGlzLnNvcnRlcnMuaW5jbHVkZXMoaXRlbSBhcyBJU29ydGVyPERhdGE+KSkge1xyXG5cdFx0XHRcdFx0dGhpcy5zb3J0ZXJzLnNwbGljZSh0aGlzLnNvcnRlcnMuaW5kZXhPZihpdGVtIGFzIElTb3J0ZXI8RGF0YT4pLCAxKTtcclxuXHRcdFx0XHRcdHRoaXMuc29ydGVycy5wdXNoKGl0ZW0gYXMgSVNvcnRlcjxEYXRhPik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGlmaWVycy5pbmNsdWRlcyhpdGVtIGFzIElNb2RpZmllcjxEYXRhPikpIHtcclxuXHRcdFx0XHRcdHRoaXMubW9kaWZpZXJzLnNwbGljZSh0aGlzLm1vZGlmaWVycy5pbmRleE9mKGl0ZW0gYXMgSU1vZGlmaWVyPERhdGE+KSwgMSk7XHJcblx0XHRcdFx0XHR0aGlzLm1vZGlmaWVycy5wdXNoKGl0ZW0gYXMgSU1vZGlmaWVyPERhdGE+KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZpbmRFbnRyaWVzKCk6IEhUTUxFbGVtZW50W10ge1xyXG5cdFx0XHRcdHJldHVybiB0eXBlb2YgdGhpcy5lbnRyeVNlbGVjdG9yID09ICdmdW5jdGlvbicgPyB0aGlzLmVudHJ5U2VsZWN0b3IoKSA6IHFxKHRoaXMuZW50cnlTZWxlY3Rvcik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHVwZGF0ZShyZXBhcnNlID0gdGhpcy5yZXBhcnNlUGVuZGluZykge1xyXG5cdFx0XHRcdGxldCBlYXJsaWVzdFVwZGF0ZSA9IHRoaXMuX3ByZXZpb3VzU3RhdGUuZmluaXNoZWRBdCArIE1hdGgubWluKDEwMDAsIDggKiB0aGlzLl9wcmV2aW91c1N0YXRlLnVwZGF0ZUR1cmF0aW9uKTtcclxuXHRcdFx0XHRpZiAocGVyZm9ybWFuY2Uubm93KCkgPCBlYXJsaWVzdFVwZGF0ZSkge1xyXG5cdFx0XHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMudXBkYXRlKCkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnVwZGF0ZVBlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAodGhpcy5kaXNhYmxlZCA9PSB0cnVlKSByZXR1cm47XHJcblx0XHRcdFx0bGV0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuXHRcdFx0XHRsZXQgZW50cmllcyA9IHRoaXMuZmluZEVudHJpZXMoKTtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuZGlzYWJsZWQgPT0gJ3NvZnQnKSB7XHJcblx0XHRcdFx0XHRpZiAoIWVudHJpZXMubGVuZ3RoKSByZXR1cm47XHJcblx0XHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYEVmIHNvZnQtZW5hYmxlZDogeDA9Pngke2VudHJpZXMubGVuZ3RofWAsIHRoaXMuZW50cnlTZWxlY3RvciwgdGhpcyk7XHJcblx0XHRcdFx0XHR0aGlzLmVuYWJsZSgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5kaXNhYmxlZCAhPSBmYWxzZSkgdGhyb3cgMDtcclxuXHJcblx0XHRcdFx0aWYgKCFlbnRyaWVzLmxlbmd0aCAmJiB0aGlzLnNvZnREaXNhYmxlKSB7XHJcblx0XHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYEVmIHNvZnQtZGlzYWJsZWQ6IHgke3RoaXMuZW5hYmxlLmxlbmd0aH09PngwYCwgdGhpcy5lbnRyeVNlbGVjdG9yLCB0aGlzKTtcclxuXHRcdFx0XHRcdHRoaXMuZGlzYWJsZSgnc29mdCcpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHJlcGFyc2UpIHtcclxuXHRcdFx0XHRcdHRoaXMuZW50cnlEYXRhcyA9IG5ldyBNYXBUeXBlKCk7XHJcblx0XHRcdFx0XHR0aGlzLnJlcGFyc2VQZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICghdGhpcy5jb250YWluZXIuY2xvc2VzdCgnYm9keScpKSB7XHJcblx0XHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRUbygnYm9keScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5lbnRyaWVzLmxlbmd0aCAhPSBlbnRyaWVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBFZiB1cGRhdGU6IHgke3RoaXMuZW50cmllcy5sZW5ndGh9PT54JHtlbnRyaWVzLmxlbmd0aH1gLCB0aGlzLmVudHJ5U2VsZWN0b3IsIHRoaXMpO1xyXG5cdFx0XHRcdFx0Ly8gfHwgdGhpcy5lbnRyaWVzXHJcblx0XHRcdFx0XHQvLyBUT0RPOiBzb3J0IGVudHJpZXMgaW4gaW5pdGlhbCBvcmRlclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmVudHJpZXMgPSBlbnRyaWVzO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyRW50cmllcygpO1xyXG5cdFx0XHRcdHRoaXMuc29ydEVudHJpZXMoKTtcclxuXHRcdFx0XHR0aGlzLm1vZGlmeUVudHJpZXMoKTtcclxuXHRcdFx0XHRsZXQgdGltZVVzZWQgPSBwZXJmb3JtYW5jZS5ub3coKSAtIG5vdztcclxuXHRcdFx0XHR0aGlzLl9wcmV2aW91c1N0YXRlLnVwZGF0ZUR1cmF0aW9uID0gdGltZVVzZWQ7XHJcblx0XHRcdFx0dGhpcy5fcHJldmlvdXNTdGF0ZS5maW5pc2hlZEF0ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG9mZkluY29tcGF0aWJsZShpbmNvbXBhdGlibGU6IHN0cmluZ1tdKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgZmlsdGVyIG9mIHRoaXMuZmlsdGVycykge1xyXG5cdFx0XHRcdFx0aWYgKGluY29tcGF0aWJsZS5pbmNsdWRlcyhmaWx0ZXIuaWQpKSB7XHJcblx0XHRcdFx0XHRcdGZpbHRlci50b2dnbGVNb2RlKCdvZmYnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yIChsZXQgc29ydGVyIG9mIHRoaXMuc29ydGVycykge1xyXG5cdFx0XHRcdFx0aWYgKGluY29tcGF0aWJsZS5pbmNsdWRlcyhzb3J0ZXIuaWQpKSB7XHJcblx0XHRcdFx0XHRcdHNvcnRlci50b2dnbGVNb2RlKCdvZmYnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yIChsZXQgbW9kaWZpZXIgb2YgdGhpcy5tb2RpZmllcnMpIHtcclxuXHRcdFx0XHRcdGlmIChpbmNvbXBhdGlibGUuaW5jbHVkZXMobW9kaWZpZXIuaWQpKSB7XHJcblx0XHRcdFx0XHRcdG1vZGlmaWVyLnRvZ2dsZU1vZGUoJ29mZicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3R5bGUocyA9ICcnKSB7XHJcblx0XHRcdFx0RW50cnlGaWx0ZXJlci5zdHlsZShzKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cdFx0XHRzdGF0aWMgc3R5bGUocyA9ICcnKSB7XHJcblx0XHRcdFx0bGV0IHN0eWxlID0gcSgnc3R5bGUuZWYtc3R5bGUnKSB8fCBlbG0oJ3N0eWxlLmVmLXN0eWxlJykuYXBwZW5kVG8oJ2hlYWQnKTtcclxuXHRcdFx0XHRzdHlsZS5pbm5lckhUTUwgPSBgXHJcblx0XHRcdFx0XHQuZWYtY29udGFpbmVyIHtcclxuXHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcclxuXHRcdFx0XHRcdFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IGZpeGVkO1xyXG5cdFx0XHRcdFx0XHR0b3A6IDA7XHJcblx0XHRcdFx0XHRcdHJpZ2h0OiAwO1xyXG5cdFx0XHRcdFx0XHR6LWluZGV4OiA5OTk5OTk5OTk5OTk5OTk5OTk5O1xyXG5cdFx0XHRcdFx0XHRtaW4td2lkdGg6IDEwMHB4O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0LmVmLWVudHJ5IHt9XHJcblxyXG5cdFx0XHRcdFx0LmVmLWZpbHRlcmVkLW91dCB7XHJcblx0XHRcdFx0XHRcdGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRidXR0b24uZWYtaXRlbSB7fVxyXG5cdFx0XHRcdFx0YnV0dG9uLmVmLWl0ZW1bZWYtbW9kZT1cIm9mZlwiXSB7XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpZ2h0Z3JheTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJ1dHRvbi5lZi1pdGVtW2VmLW1vZGU9XCJvblwiXSB7XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpZ2h0Z3JlZW47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRidXR0b24uZWYtaXRlbVtlZi1tb2RlPVwib3Bwb3NpdGVcIl0ge1xyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiB5ZWxsb3c7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0YnV0dG9uLmVmLWl0ZW0uZWYtZmlsdGVyID4gaW5wdXQge1xyXG5cdFx0XHRcdFx0XHRmbG9hdDogcmlnaHQ7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0W2VmLXByZWZpeF06OmJlZm9yZSB7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQ6IGF0dHIoZWYtcHJlZml4KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFtlZi1wb3N0Zml4XTo6YWZ0ZXIge1xyXG5cdFx0XHRcdFx0XHRjb250ZW50OiBhdHRyKGVmLXBvc3RmaXgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0YCArIHM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNvZnREaXNhYmxlID0gdHJ1ZTtcclxuXHRcdFx0ZGlzYWJsZWQ6IGJvb2xlYW4gfCAnc29mdCcgPSBmYWxzZTtcclxuXHRcdFx0ZGlzYWJsZShzb2Z0PzogJ3NvZnQnKSB7XHJcblx0XHRcdFx0dGhpcy5kaXNhYmxlZCA9IHRydWU7XHJcblx0XHRcdFx0aWYgKHNvZnQgPT0gJ3NvZnQnKSB0aGlzLmRpc2FibGVkID0gJ3NvZnQnO1xyXG5cdFx0XHRcdHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVuYWJsZSgpIHtcclxuXHRcdFx0XHR0aGlzLmRpc2FibGVkID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy51cGRhdGVQZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNsZWFyKCkge1xyXG5cdFx0XHRcdHRoaXMuZW50cnlEYXRhcyA9IG5ldyBNYXAoKTtcclxuXHRcdFx0XHR0aGlzLnBhcnNlcnMuc3BsaWNlKDAsIDk5OSk7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJzLnNwbGljZSgwLCA5OTkpLm1hcChlID0+IGUucmVtb3ZlKCkpO1xyXG5cdFx0XHRcdHRoaXMuc29ydGVycy5zcGxpY2UoMCwgOTk5KS5tYXAoZSA9PiBlLnJlbW92ZSgpKTtcclxuXHRcdFx0XHR0aGlzLm1vZGlmaWVycy5zcGxpY2UoMCwgOTk5KS5tYXAoZSA9PiBlLnJlbW92ZSgpKTtcclxuXHRcdFx0XHR0aGlzLmVuYWJsZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRnZXQgX2RhdGFzKCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmVudHJpZXNcclxuXHRcdFx0XHRcdC5maWx0ZXIoZSA9PiAhZS5jbGFzc0xpc3QuY29udGFpbnMoJ2VmLWZpbHRlcmVkLW91dCcpKVxyXG5cdFx0XHRcdFx0Lm1hcChlID0+IHRoaXMuZ2V0RGF0YShlKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gSXNQcm9taXNlPFQ+KHA6IFByb21pc2VMaWtlPFQ+IHwgVCk6IHAgaXMgUHJvbWlzZUxpa2U8VD4ge1xyXG5cdFx0XHRpZiAoIXApIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIHR5cGVvZiAocCBhcyBQcm9taXNlTGlrZTxUPikudGhlbiA9PSAnZnVuY3Rpb24nO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBjbGFzcyBPYnNlcnZlciB7XHJcblx0XHRcclxuXHR9XHJcbn1cclxuXHJcbi8qXHJcblxyXG5mdW5jdGlvbiBvYnNlcnZlQ2xhc3NBZGQoY2xzLCBjYikge1xyXG5cdGxldCBxdWV1ZWQgPSBmYWxzZTtcclxuXHRhc3luYyBmdW5jdGlvbiBydW4oKSB7XHJcblx0XHRpZiAocXVldWVkKSByZXR1cm47XHJcblx0XHRxdWV1ZWQgPSB0cnVlO1xyXG5cdFx0YXdhaXQgUHJvbWlzZS5mcmFtZSgpO1xyXG5cdFx0cXVldWVkID0gZmFsc2U7XHJcblx0XHRjYigpO1xyXG5cdH1cclxuXHRuZXcgTXV0YXRpb25PYnNlcnZlcihsaXN0ID0+IHtcclxuXHRcdGZvciAobGV0IG1yIG9mIGxpc3QpIHtcclxuXHRcdFx0aWYgKG1yLnR5cGUgPT0gJ2F0dHJpYnV0ZXMnICYmIG1yLmF0dHJpYnV0ZU5hbWUgPT0gJ2NsYXNzJykge1xyXG5cdFx0XHRcdGlmIChtci50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKGNscykpIHtcclxuXHRcdFx0XHRcdHJ1bigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAobXIudHlwZSA9PSAnY2hpbGRMaXN0Jykge1xyXG5cdFx0XHRcdGZvciAobGV0IGNoIG9mIG1yLmFkZGVkTm9kZXMpIHtcclxuXHRcdFx0XHRcdGlmIChjaC5jbGFzc0xpc3Q/LmNvbnRhaW5zKGNscykpIHtcclxuXHRcdFx0XHRcdFx0cnVuKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSkub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XHJcblx0XHRjaGlsZExpc3Q6IHRydWUsXHJcblx0XHRhdHRyaWJ1dGVzOiB0cnVlLFxyXG5cdFx0c3VidHJlZTogdHJ1ZSxcclxuXHR9KTtcclxufVxyXG5cclxuKi8iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBQYWdpbmF0ZUV4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IHR5cGUgUFJlcXVlc3RFdmVudCA9IEN1c3RvbUV2ZW50PHtcclxuXHRcdFx0cmVhc29uPzogS2V5Ym9hcmRFdmVudCB8IE1vdXNlRXZlbnQsXHJcblx0XHRcdGNvdW50OiBudW1iZXIsXHJcblx0XHRcdGNvbnN1bWVkOiBudW1iZXIsXHJcblx0XHRcdF9ldmVudD86ICdwYWdpbmF0aW9ucmVxdWVzdCcsXHJcblx0XHR9PjtcclxuXHRcdGV4cG9ydCB0eXBlIFBTdGFydEV2ZW50ID0gQ3VzdG9tRXZlbnQ8e1xyXG5cdFx0XHRwYWdpbmF0ZTogUGFnaW5hdGUsXHJcblx0XHRcdF9ldmVudD86ICdwYWdpbmF0aW9uc3RhcnQnLFxyXG5cdFx0fT47XHJcblx0XHRleHBvcnQgdHlwZSBQRW5kRXZlbnQgPSBDdXN0b21FdmVudDx7XHJcblx0XHRcdHBhZ2luYXRlOiBQYWdpbmF0ZSxcclxuXHRcdFx0X2V2ZW50PzogJ3BhZ2luYXRpb25lbmQnLFxyXG5cdFx0fT47XHJcblx0XHRleHBvcnQgdHlwZSBQTW9kaWZ5RXZlbnQgPSBDdXN0b21FdmVudDx7XHJcblx0XHRcdHBhZ2luYXRlOiBQYWdpbmF0ZSxcclxuXHRcdFx0YWRkZWQ6IEhUTUxFbGVtZW50W10sXHJcblx0XHRcdHJlbW92ZWQ6IEhUTUxFbGVtZW50W10sXHJcblx0XHRcdHNlbGVjdG9yOiBzZWxlY3RvcixcclxuXHRcdFx0X2V2ZW50PzogJ3BhZ2luYXRpb25tb2RpZnknLFxyXG5cdFx0fT47XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFBhZ2luYXRlIHtcclxuXHRcdFx0ZG9jOiBEb2N1bWVudDtcclxuXHJcblx0XHRcdGVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHRjb25kaXRpb246IHNlbGVjdG9yIHwgKCgpID0+IGJvb2xlYW4pO1xyXG5cdFx0XHRxdWV1ZWQgPSAwO1xyXG5cdFx0XHRydW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdF9pbml0ZWQgPSBmYWxzZTtcclxuXHRcdFx0c2hpZnRSZXF1ZXN0Q291bnQ/OiBudW1iZXIgfCAoKCkgPT4gbnVtYmVyKTtcclxuXHJcblx0XHRcdHN0YXRpYyBzaGlmdFJlcXVlc3RDb3VudCA9IDEwO1xyXG5cdFx0XHRzdGF0aWMgX2luaXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRzdGF0aWMgcmVtb3ZlRGVmYXVsdFJ1bkJpbmRpbmdzOiAoKSA9PiB2b2lkO1xyXG5cdFx0XHRzdGF0aWMgYWRkRGVmYXVsdFJ1bkJpbmRpbmdzKCkge1xyXG5cdFx0XHRcdFBhZ2luYXRlLnJlbW92ZURlZmF1bHRSdW5CaW5kaW5ncz8uKCk7XHJcblx0XHRcdFx0ZnVuY3Rpb24gb25tb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmIChldmVudC5idXR0b24gIT0gMSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0bGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBFbGVtZW50O1xyXG5cdFx0XHRcdFx0aWYgKHRhcmdldD8uY2xvc2VzdCgnYScpKSByZXR1cm47XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0bGV0IGNvdW50ID0gZXZlbnQuc2hpZnRLZXkgPyBQYWdpbmF0ZS5zaGlmdFJlcXVlc3RDb3VudCA6IDE7XHJcblx0XHRcdFx0XHRQYWdpbmF0ZS5yZXF1ZXN0UGFnaW5hdGlvbihjb3VudCwgZXZlbnQsIHRhcmdldCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZ1bmN0aW9uIG9ua2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0XHRcdFx0aWYgKGV2ZW50LmNvZGUgIT0gJ0FsdFJpZ2h0JykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdGxldCBjb3VudCA9IGV2ZW50LnNoaWZ0S2V5ID8gUGFnaW5hdGUuc2hpZnRSZXF1ZXN0Q291bnQgOiAxO1xyXG5cdFx0XHRcdFx0bGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBFbGVtZW50O1xyXG5cdFx0XHRcdFx0UGFnaW5hdGUucmVxdWVzdFBhZ2luYXRpb24oY291bnQsIGV2ZW50LCB0YXJnZXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbm1vdXNlZG93bik7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bik7XHJcblx0XHRcdFx0UGFnaW5hdGUucmVtb3ZlRGVmYXVsdFJ1bkJpbmRpbmdzID0gKCkgPT4ge1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25tb3VzZWRvd24pO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHN0YXRpYyBpbnN0YW5jZXM6IFBhZ2luYXRlW10gPSBbXTtcclxuXHJcblx0XHRcdC8vIGxpc3RlbmVyc1xyXG5cdFx0XHRpbml0KCkge1xyXG5cdFx0XHRcdGlmICghUGFnaW5hdGUucmVtb3ZlRGVmYXVsdFJ1bkJpbmRpbmdzKSB7XHJcblx0XHRcdFx0XHRQYWdpbmF0ZS5hZGREZWZhdWx0UnVuQmluZGluZ3MoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuX2luaXRlZCkgcmV0dXJuO1xyXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI8UFJlcXVlc3RFdmVudD4oJ3BhZ2luYXRpb25yZXF1ZXN0JywgdGhpcy5vblBhZ2luYXRpb25SZXF1ZXN0LmJpbmQodGhpcykpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI8UEVuZEV2ZW50PigncGFnaW5hdGlvbmVuZCcsIHRoaXMub25QYWdpbmF0aW9uRW5kLmJpbmQodGhpcykpO1xyXG5cdFx0XHRcdFBhZ2luYXRlLmluc3RhbmNlcy5wdXNoKHRoaXMpO1xyXG5cdFx0XHRcdGlmIChQb29wSnMuZGVidWcpIHtcclxuXHRcdFx0XHRcdGxldCBhY3RpdmUgPSB0aGlzLmNhbkNvbnN1bWVSZXF1ZXN0KCkgPyAnYWN0aXZlJyA6ICdpbmFjdGl2ZSc7XHJcblx0XHRcdFx0XHRpZiAoYWN0aXZlID09ICdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYFBhZ2luYXRlIGluc3RhbnRpYXRlZCAoJHthY3RpdmV9KTogYCwgdGhpcy5kYXRhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0b25QYWdpbmF0aW9uUmVxdWVzdChldmVudDogUFJlcXVlc3RFdmVudCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmNhbkNvbnN1bWVSZXF1ZXN0KCkpIHtcclxuXHRcdFx0XHRcdGV2ZW50LmRldGFpbC5jb25zdW1lZCsrO1xyXG5cdFx0XHRcdFx0bGV0IHF1ZXVlZCA9ICFldmVudC5kZXRhaWwucmVhc29uPy5zaGlmdEtleSA/IG51bGwgOiB0eXBlb2YgdGhpcy5zaGlmdFJlcXVlc3RDb3VudCA9PSAnZnVuY3Rpb24nID8gdGhpcy5zaGlmdFJlcXVlc3RDb3VudCgpIDogdGhpcy5zaGlmdFJlcXVlc3RDb3VudDtcclxuXHRcdFx0XHRcdHRoaXMucXVldWVkICs9IHF1ZXVlZCA/PyBldmVudC5kZXRhaWwuY291bnQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICghdGhpcy5ydW5uaW5nICYmIHRoaXMucXVldWVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLmNvbnN1bWVSZXF1ZXN0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRvblBhZ2luYXRpb25FbmQoZXZlbnQ6IFBFbmRFdmVudCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLnF1ZXVlZCAmJiB0aGlzLmNhbkNvbnN1bWVSZXF1ZXN0KCkpIHtcclxuXHRcdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5jYW5Db25zdW1lUmVxdWVzdCgpKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGB0aGlzIHBhZ2luYXRlIGNhbiBub3Qgd29yayBhbnltb3JlYCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5xdWV1ZWQgPSAwO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY29uc3VtZVJlcXVlc3QoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhbkNvbnN1bWVSZXF1ZXN0KCkge1xyXG5cdFx0XHRcdGlmICghdGhpcy5lbmFibGVkKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0aWYgKHRoaXMucnVubmluZykgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0aWYgKHRoaXMuY29uZGl0aW9uKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIHRoaXMuY29uZGl0aW9uID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmNvbmRpdGlvbigpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoIWRvY3VtZW50LnEodGhpcy5jb25kaXRpb24pKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzeW5jIGNvbnN1bWVSZXF1ZXN0KCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLnJ1bm5pbmcpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLnF1ZXVlZC0tO1xyXG5cdFx0XHRcdHRoaXMucnVubmluZyA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5lbWl0U3RhcnQoKTtcclxuXHRcdFx0XHRhd2FpdCB0aGlzLm9ucnVuPy4oKTtcclxuXHRcdFx0XHR0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmVtaXRFbmQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvbnJ1bjogKCkgPT4gUHJvbWlzZTx2b2lkPjtcclxuXHJcblxyXG5cdFx0XHQvLyBlbWl0dGVyc1xyXG5cdFx0XHRzdGF0aWMgcmVxdWVzdFBhZ2luYXRpb24oY291bnQgPSAxLCByZWFzb24/OiBQUmVxdWVzdEV2ZW50WydkZXRhaWwnXVsncmVhc29uJ10sIHRhcmdldDogRWxlbWVudCA9IGRvY3VtZW50LmJvZHkpIHtcclxuXHRcdFx0XHRsZXQgZGV0YWlsOiBQUmVxdWVzdEV2ZW50WydkZXRhaWwnXSA9IHsgY291bnQsIHJlYXNvbiwgY29uc3VtZWQ6IDAgfTtcclxuXHRcdFx0XHRmdW5jdGlvbiBmYWlsKGV2ZW50OiBQUmVxdWVzdEV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoZXZlbnQuZGV0YWlsLmNvbnN1bWVkID09IDApIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGBQYWdpbmF0aW9uIHJlcXVlc3QgZmFpbGVkOiBubyBsaXN0ZW5lcnNgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BhZ2luYXRpb25yZXF1ZXN0JywgZmFpbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ3BhZ2luYXRpb25yZXF1ZXN0JywgZmFpbCk7XHJcblx0XHRcdFx0dGFyZ2V0LmVtaXQ8UFJlcXVlc3RFdmVudD4oJ3BhZ2luYXRpb25yZXF1ZXN0JywgeyBjb3VudCwgcmVhc29uLCBjb25zdW1lZDogMCB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbWl0U3RhcnQoKSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5lbWl0PFBTdGFydEV2ZW50PigncGFnaW5hdGlvbnN0YXJ0JywgeyBwYWdpbmF0ZTogdGhpcyB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbWl0TW9kaWZ5KGFkZGVkLCByZW1vdmVkLCBzZWxlY3Rvcikge1xyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuZW1pdDxQTW9kaWZ5RXZlbnQ+KCdwYWdpbmF0aW9ubW9kaWZ5JywgeyBwYWdpbmF0ZTogdGhpcywgYWRkZWQsIHJlbW92ZWQsIHNlbGVjdG9yIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVtaXRFbmQoKSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5lbWl0PFBFbmRFdmVudD4oJ3BhZ2luYXRpb25lbmQnLCB7IHBhZ2luYXRlOiB0aGlzIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBmZXRjaGluZzogXHJcblx0XHRcdGFzeW5jIGZldGNoRG9jdW1lbnQobGluazogTGluaywgc3Bpbm5lciA9IHRydWUsIG1heEFnZTogZGVsdGFUaW1lID0gMCk6IFByb21pc2U8RG9jdW1lbnQ+IHtcclxuXHRcdFx0XHR0aGlzLmRvYyA9IG51bGw7XHJcblx0XHRcdFx0bGV0IGEgPSBzcGlubmVyICYmIFBhZ2luYXRlLmxpbmtUb0FuY2hvcihsaW5rKTtcclxuXHRcdFx0XHRhPy5jbGFzc0xpc3QuYWRkKCdwYWdpbmF0ZS1zcGluJyk7XHJcblx0XHRcdFx0bGluayA9IFBhZ2luYXRlLmxpbmtUb1VybChsaW5rKTtcclxuXHRcdFx0XHRsZXQgaW5pdCA9IHsgbWF4QWdlLCB4bWw6IHRoaXMuZGF0YS54bWwgfTtcclxuXHRcdFx0XHR0aGlzLmRvYyA9ICFtYXhBZ2UgPyBhd2FpdCBmZXRjaC5kb2MobGluaywgaW5pdCkgOiBhd2FpdCBmZXRjaC5jYWNoZWQuZG9jKGxpbmssIGluaXQpO1xyXG5cdFx0XHRcdGE/LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2luYXRlLXNwaW4nKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kb2M7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0YXRpYyBwcmVmZXRjaChzb3VyY2U6IHNlbGVjdG9yKSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQucXE8J2EnPihzb3VyY2UpLm1hcChlID0+IHtcclxuXHRcdFx0XHRcdGlmIChlLmhyZWYpIHtcclxuXHRcdFx0XHRcdFx0ZWxtKGBsaW5rW3JlbD1cInByZWZldGNoXCJdW2hyZWY9XCIke2UuaHJlZn1cIl1gKS5hcHBlbmRUbygnaGVhZCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gVE9ETzogaWYgZS5zcmNcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdC8vIG1vZGlmaWNhdGlvbjogXHJcblx0XHRcdGFmdGVyKHNvdXJjZTogc2VsZWN0b3IsIHRhcmdldDogc2VsZWN0b3IgPSBzb3VyY2UpIHtcclxuXHRcdFx0XHRsZXQgYWRkZWQgPSB0aGlzLmRvYy5xcShzb3VyY2UpO1xyXG5cdFx0XHRcdGlmICghYWRkZWQubGVuZ3RoKSByZXR1cm47XHJcblx0XHRcdFx0bGV0IGZvdW5kID0gZG9jdW1lbnQucXEodGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoZm91bmQubGVuZ3RoID09IDApIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgd2hlcmUgdG8gYXBwZW5kYCk7XHJcblx0XHRcdFx0Zm91bmQucG9wKCkuYWZ0ZXIoLi4uYWRkZWQpO1xyXG5cdFx0XHRcdHRoaXMuZW1pdE1vZGlmeShhZGRlZCwgW10sIHNvdXJjZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVwbGFjZUVhY2goc291cmNlOiBzZWxlY3RvciwgdGFyZ2V0OiBzZWxlY3RvciA9IHNvdXJjZSkge1xyXG5cdFx0XHRcdGxldCBhZGRlZCA9IHRoaXMuZG9jLnFxKHNvdXJjZSk7XHJcblx0XHRcdFx0bGV0IHJlbW92ZWQgPSBkb2N1bWVudC5xcSh0YXJnZXQpO1xyXG5cdFx0XHRcdGlmIChhZGRlZC5sZW5ndGggIT0gcmVtb3ZlZC5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihgYWRkZWQvcmVtb3ZlZCBjb3VudCBtaXNtYXRjaGApO1xyXG5cdFx0XHRcdHJlbW92ZWQubWFwKChlLCBpKSA9PiBlLnJlcGxhY2VXaXRoKGFkZGVkW2ldKSk7XHJcblx0XHRcdFx0dGhpcy5lbWl0TW9kaWZ5KGFkZGVkLCByZW1vdmVkLCBzb3VyY2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlcGxhY2Uoc291cmNlOiBzZWxlY3RvciwgdGFyZ2V0OiBzZWxlY3RvciA9IHNvdXJjZSkge1xyXG5cdFx0XHRcdGxldCBhZGRlZCA9IHRoaXMuZG9jLnFxKHNvdXJjZSk7XHJcblx0XHRcdFx0bGV0IHJlbW92ZWQgPSBkb2N1bWVudC5xcSh0YXJnZXQpO1xyXG5cdFx0XHRcdGlmIChhZGRlZC5sZW5ndGggIT0gcmVtb3ZlZC5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihgbm90IGltcGxlbWVudGVkYCk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVwbGFjZUVhY2goc291cmNlLCB0YXJnZXQpO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0Ly8gdXRpbFxyXG5cdFx0XHRzdGF0aWMgbGlua1RvVXJsKGxpbms6IExpbmspOiB1cmwge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgbGluayA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0aWYgKGxpbmsuc3RhcnRzV2l0aCgnaHR0cCcpKSByZXR1cm4gbGluayBhcyB1cmw7XHJcblx0XHRcdFx0XHRsaW5rID0gZG9jdW1lbnQucTwnYSc+KGxpbmspO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAobGluay50YWdOYW1lICE9ICdBJykgdGhyb3cgbmV3IEVycm9yKCdsaW5rIHNob3VsZCBiZSA8YT4gZWxlbWVudCEnKTtcclxuXHRcdFx0XHRyZXR1cm4gKGxpbmsgYXMgSFRNTEFuY2hvckVsZW1lbnQpLmhyZWYgYXMgdXJsO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0YXRpYyBsaW5rVG9BbmNob3IobGluazogTGluayk6IEhUTUxBbmNob3JFbGVtZW50IHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGxpbmsgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdGlmIChsaW5rLnN0YXJ0c1dpdGgoJ2h0dHAnKSkgcmV0dXJuIG51bGw7XHJcblx0XHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQucTwnYSc+KGxpbmspO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gbGluaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3RhdGljIHN0YXRpY0NhbGw8VD4odGhpczogdm9pZCwgZGF0YTogUGFyYW1ldGVyczxQYWdpbmF0ZVsnc3RhdGljQ2FsbCddPlswXSkge1xyXG5cdFx0XHRcdGxldCBwID0gbmV3IFBhZ2luYXRlKCk7XHJcblx0XHRcdFx0cC5zdGF0aWNDYWxsKGRhdGEpO1xyXG5cdFx0XHRcdHJldHVybiBwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyYXdEYXRhOiBhbnk7XHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRjb25kaXRpb246ICgpID0+IGJvb2xlYW47XHJcblx0XHRcdFx0cHJlZmV0Y2g6IGFueVtdO1xyXG5cdFx0XHRcdGRvYzogc2VsZWN0b3JbXTtcclxuXHRcdFx0XHRjbGljazogc2VsZWN0b3JbXTtcclxuXHRcdFx0XHRhZnRlcjogc2VsZWN0b3JbXTtcclxuXHRcdFx0XHRyZXBsYWNlOiBzZWxlY3RvcltdO1xyXG5cdFx0XHRcdG1heEFnZTogZGVsdGFUaW1lO1xyXG5cdFx0XHRcdHN0YXJ0PzogKHRoaXM6IFBhZ2luYXRlKSA9PiB2b2lkO1xyXG5cdFx0XHRcdG1vZGlmeT86ICh0aGlzOiBQYWdpbmF0ZSwgZG9jOiBEb2N1bWVudCkgPT4gdm9pZDtcclxuXHRcdFx0XHRlbmQ/OiAodGhpczogUGFnaW5hdGUsIGRvYzogRG9jdW1lbnQpID0+IHZvaWQ7XHJcblx0XHRcdFx0eG1sPzogYm9vbGVhbjtcclxuXHRcdFx0fTtcclxuXHRcdFx0c3RhdGljQ2FsbChkYXRhOiB7XHJcblx0XHRcdFx0Y29uZGl0aW9uPzogc2VsZWN0b3IgfCAoKCkgPT4gYm9vbGVhbiksXHJcblx0XHRcdFx0cHJlZmV0Y2g/OiBzZWxlY3RvciB8IHNlbGVjdG9yW10sXHJcblx0XHRcdFx0Y2xpY2s/OiBzZWxlY3RvciB8IHNlbGVjdG9yW10sXHJcblx0XHRcdFx0ZG9jPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdGFmdGVyPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdHJlcGxhY2U/OiBzZWxlY3RvciB8IHNlbGVjdG9yW10sXHJcblx0XHRcdFx0c3RhcnQ/OiAodGhpczogUGFnaW5hdGUpID0+IHZvaWQ7XHJcblx0XHRcdFx0bW9kaWZ5PzogKHRoaXM6IFBhZ2luYXRlLCBkb2M6IERvY3VtZW50KSA9PiB2b2lkO1xyXG5cdFx0XHRcdGVuZD86ICh0aGlzOiBQYWdpbmF0ZSwgZG9jOiBEb2N1bWVudCkgPT4gdm9pZDtcclxuXHRcdFx0XHRtYXhBZ2U/OiBkZWx0YVRpbWU7XHJcblx0XHRcdFx0Y2FjaGU/OiBkZWx0YVRpbWUgfCB0cnVlO1xyXG5cdFx0XHRcdHhtbD86IGJvb2xlYW47XHJcblx0XHRcdFx0cGFnZXI/OiBzZWxlY3RvciB8IHNlbGVjdG9yW107XHJcblx0XHRcdFx0c2hpZnRlZD86IG51bWJlciB8ICgoKSA9PiBudW1iZXIpO1xyXG5cdFx0XHR9KSB7XHJcblx0XHRcdFx0ZnVuY3Rpb24gdG9BcnJheTxUPih2PzogVCB8IFRbXSB8IHVuZGVmaW5lZCk6IFRbXSB7XHJcblx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh2KSkgcmV0dXJuIHY7XHJcblx0XHRcdFx0XHRpZiAodiA9PSBudWxsKSByZXR1cm4gW107XHJcblx0XHRcdFx0XHRyZXR1cm4gW3ZdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmdW5jdGlvbiB0b0NvbmRpdGlvbihzPzogc2VsZWN0b3IgfCAoKCkgPT4gYm9vbGVhbikgfCB1bmRlZmluZWQpOiAoKSA9PiBib29sZWFuIHtcclxuXHRcdFx0XHRcdGlmICghcykgcmV0dXJuICgpID0+IHRydWU7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIHMgPT0gJ3N0cmluZycpIHJldHVybiAoKSA9PiAhIWRvY3VtZW50LnEocyk7XHJcblx0XHRcdFx0XHRyZXR1cm4gcztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZnVuY3Rpb24gY2FuRmluZChhOiBzZWxlY3RvcltdKSB7XHJcblx0XHRcdFx0XHRpZiAoYS5sZW5ndGggPT0gMCkgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHRyZXR1cm4gYS5zb21lKHMgPT4gISFkb2N1bWVudC5xKHMpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZnVuY3Rpb24gZmluZE9uZShhOiBzZWxlY3RvcltdKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYS5maW5kKHMgPT4gZG9jdW1lbnQucShzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucmF3RGF0YSA9IGRhdGE7XHJcblx0XHRcdFx0dGhpcy5kYXRhID0ge1xyXG5cdFx0XHRcdFx0Y29uZGl0aW9uOiB0b0NvbmRpdGlvbihkYXRhLmNvbmRpdGlvbiksXHJcblx0XHRcdFx0XHRwcmVmZXRjaDogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5wcmVmZXRjaClcclxuXHRcdFx0XHRcdFx0LmZsYXRNYXAoZSA9PiB0b0FycmF5KGRhdGFbZV0gPz8gZSkpLFxyXG5cdFx0XHRcdFx0ZG9jOiB0b0FycmF5PHNlbGVjdG9yPihkYXRhLmRvYyksXHJcblx0XHRcdFx0XHRjbGljazogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5jbGljayksXHJcblx0XHRcdFx0XHRhZnRlcjogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5hZnRlciksXHJcblx0XHRcdFx0XHRyZXBsYWNlOiB0b0FycmF5PHNlbGVjdG9yPihkYXRhLnJlcGxhY2UpLFxyXG5cdFx0XHRcdFx0bWF4QWdlOiBkYXRhLm1heEFnZSA/PyAoZGF0YS5jYWNoZSA9PSB0cnVlID8gJzF5JyA6IGRhdGEuY2FjaGUpLFxyXG5cdFx0XHRcdFx0c3RhcnQ6IGRhdGEuc3RhcnQsIG1vZGlmeTogZGF0YS5tb2RpZnksIGVuZDogZGF0YS5lbmQsXHJcblx0XHRcdFx0XHR4bWw6IGRhdGEueG1sLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0dGhpcy5zaGlmdFJlcXVlc3RDb3VudCA9IGRhdGEuc2hpZnRlZDtcclxuXHRcdFx0XHRpZiAoZGF0YS5wYWdlcikge1xyXG5cdFx0XHRcdFx0bGV0IHBhZ2VyID0gdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5wYWdlcik7XHJcblx0XHRcdFx0XHR0aGlzLmRhdGEuZG9jID0gdGhpcy5kYXRhLmRvYy5mbGF0TWFwKGUgPT4gcGFnZXIubWFwKHAgPT4gYCR7cH0gJHtlfWApKTtcclxuXHRcdFx0XHRcdHRoaXMuZGF0YS5yZXBsYWNlLnB1c2goLi4ucGFnZXIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmNvbmRpdGlvbiA9ICgpID0+IHtcclxuXHRcdFx0XHRcdGlmICghdGhpcy5kYXRhLmNvbmRpdGlvbigpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRpZiAoIWNhbkZpbmQodGhpcy5kYXRhLmRvYykpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdGlmICghY2FuRmluZCh0aGlzLmRhdGEuY2xpY2spKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHRoaXMuaW5pdCgpO1xyXG5cdFx0XHRcdGlmICh0aGlzLmRhdGEuY29uZGl0aW9uKCkpIHtcclxuXHRcdFx0XHRcdHRoaXMuZGF0YS5wcmVmZXRjaC5tYXAocyA9PiBQYWdpbmF0ZS5wcmVmZXRjaChzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMub25ydW4gPSBhc3luYyAoKSA9PiB7XHJcblx0XHRcdFx0XHQvLyBpZiAoIWZpeGVkRGF0YS5jb25kaXRpb24oKSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5kYXRhLnN0YXJ0Py5jYWxsKHRoaXMpO1xyXG5cdFx0XHRcdFx0dGhpcy5kYXRhLmNsaWNrLm1hcChlID0+IGRvY3VtZW50LnEoZSk/LmNsaWNrKCkpO1xyXG5cdFx0XHRcdFx0bGV0IGRvYyA9IGZpbmRPbmUodGhpcy5kYXRhLmRvYyk7XHJcblx0XHRcdFx0XHRpZiAoZG9jKSB7XHJcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuZmV0Y2hEb2N1bWVudChkb2MsIHRydWUsIHRoaXMuZGF0YS5tYXhBZ2UpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRhdGEucmVwbGFjZS5tYXAocyA9PiB0aGlzLnJlcGxhY2UocykpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRhdGEuYWZ0ZXIubWFwKHMgPT4gdGhpcy5hZnRlcihzKSk7XHJcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuZGF0YS5tb2RpZnk/LmNhbGwodGhpcywgdGhpcy5kb2MpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5kYXRhLmVuZD8uY2FsbCh0aGlzLCBkb2MgJiYgdGhpcy5kb2MpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHR9XHJcblx0XHR0eXBlIFNlbE9yRWwgPSBzZWxlY3RvciB8IEhUTUxFbGVtZW50O1xyXG5cdFx0dHlwZSBTb21laG93PFQ+ID0gbnVsbCB8IFQgfCBUW10gfCAoKCkgPT4gKG51bGwgfCBUIHwgVFtdKSk7XHJcblx0XHR0eXBlIFNvbWVob3dBc3luYzxUPiA9IG51bGwgfCBUIHwgVFtdIHwgKCgpID0+IChudWxsIHwgVCB8IFRbXSB8IFByb21pc2U8bnVsbCB8IFQgfCBUW10+KSk7XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IHBhZ2luYXRlID0gT2JqZWN0LnNldFByb3RvdHlwZU9mKE9iamVjdC5hc3NpZ24oUGFnaW5hdGUuc3RhdGljQ2FsbCwgbmV3IFBhZ2luYXRlKCkpLCBQYWdpbmF0ZSk7XHJcblx0fVxyXG5cclxuXHRleHBvcnQgY29uc3QgcGFnaW5hdGUgPSBQYWdpbmF0ZUV4dGVuc2lvbi5wYWdpbmF0ZTtcclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIEltYWdlU2Nyb2xsaW5nRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgbGV0IGltYWdlU2Nyb2xsaW5nQWN0aXZlID0gZmFsc2U7XHJcblx0XHRleHBvcnQgbGV0IGltZ1NlbGVjdG9yID0gJ2ltZyc7XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGltYWdlU2Nyb2xsaW5nKHNlbGVjdG9yPzogc3RyaW5nKSB7XHJcblx0XHRcdGlmIChpbWFnZVNjcm9sbGluZ0FjdGl2ZSkgcmV0dXJuO1xyXG5cdFx0XHRpZiAoc2VsZWN0b3IpIGltZ1NlbGVjdG9yID0gc2VsZWN0b3I7XHJcblx0XHRcdGltYWdlU2Nyb2xsaW5nQWN0aXZlID0gdHJ1ZTtcclxuXHRcdFx0ZnVuY3Rpb24gb253aGVlbChldmVudDogTW91c2VFdmVudCAmIHsgd2hlZWxEZWx0YVk6IG51bWJlciB9KSB7XHJcblx0XHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5IHx8IGV2ZW50LmN0cmxLZXkpIHJldHVybjtcclxuXHRcdFx0XHRpZiAoc2Nyb2xsV2hvbGVJbWFnZSgtTWF0aC5zaWduKGV2ZW50LndoZWVsRGVsdGFZKSkpIHtcclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbndoZWVsLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xyXG5cdFx0XHRyZXR1cm4gaW1hZ2VTY3JvbGxpbmdPZmYgPSAoKSA9PiB7XHJcblx0XHRcdFx0aW1hZ2VTY3JvbGxpbmdBY3RpdmUgPSBmYWxzZTtcclxuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgb253aGVlbCk7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gYmluZEFycm93cygpIHtcclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ZW50ID0+IHtcclxuXHRcdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQXJyb3dMZWZ0Jykge1xyXG5cdFx0XHRcdFx0c2Nyb2xsV2hvbGVJbWFnZSgtMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChldmVudC5jb2RlID09ICdBcnJvd1JpZ2h0Jykge1xyXG5cdFx0XHRcdFx0c2Nyb2xsV2hvbGVJbWFnZSgxKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0XHRleHBvcnQgbGV0IGltYWdlU2Nyb2xsaW5nT2ZmID0gKCkgPT4geyB9O1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBpbWdUb1dpbmRvd0NlbnRlcihpbWc6IEVsZW1lbnQpIHtcclxuXHRcdFx0bGV0IHJlY3QgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRcdHJldHVybiAocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyIC0gaW5uZXJIZWlnaHQgLyAyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBnZXRBbGxJbWFnZUluZm8oKSB7XHJcblx0XHRcdGxldCBpbWFnZXMgPSBxcShpbWdTZWxlY3RvcikgYXMgSFRNTEltYWdlRWxlbWVudFtdO1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBpbWFnZXMubWFwKChpbWcsIGluZGV4KSA9PiB7XHJcblx0XHRcdFx0bGV0IHJlY3QgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdGltZywgcmVjdCwgaW5kZXgsXHJcblx0XHRcdFx0XHRpblNjcmVlbjogcmVjdC50b3AgPj0gLTEgJiYgcmVjdC5ib3R0b20gPD0gaW5uZXJIZWlnaHQsXHJcblx0XHRcdFx0XHRjcm9zc1NjcmVlbjogcmVjdC5ib3R0b20gPj0gMSAmJiByZWN0LnRvcCA8PSBpbm5lckhlaWdodCAtIDEsXHJcblx0XHRcdFx0XHR5VG9TY3JlZW5DZW50ZXI6IChyZWN0LnRvcCArIHJlY3QuYm90dG9tKSAvIDIgLSBpbm5lckhlaWdodCAvIDIsXHJcblx0XHRcdFx0XHRpc0luQ2VudGVyOiBNYXRoLmFicygocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyIC0gaW5uZXJIZWlnaHQgLyAyKSA8IDMsXHJcblx0XHRcdFx0XHRpc1NjcmVlbkhlaWdodDogTWF0aC5hYnMocmVjdC5oZWlnaHQgLSBpbm5lckhlaWdodCkgPCAzLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0pLmZpbHRlcihlID0+IGUucmVjdD8ud2lkdGggfHwgZS5yZWN0Py53aWR0aCk7XHJcblx0XHRcdHJldHVybiBkYXRhcztcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IHNjcm9sbFdob2xlSW1hZ2VQZW5kaW5nID0gZmFsc2U7XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGdldENlbnRyYWxJbWcoKSB7XHJcblx0XHRcdHJldHVybiBnZXRBbGxJbWFnZUluZm8oKS52c29ydChlID0+IE1hdGguYWJzKGUueVRvU2NyZWVuQ2VudGVyKSlbMF0/LmltZztcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzY3JvbGxXaG9sZUltYWdlKGRpciA9IDEpOiBib29sZWFuIHtcclxuXHRcdFx0aWYgKHNjcm9sbFdob2xlSW1hZ2VQZW5kaW5nKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0Ly8gaWYgKGRpciA9PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ3Njcm9sbGluZyBpbiBubyBkaXJlY3Rpb24hJyk7XHJcblx0XHRcdGlmICghZGlyKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHRkaXIgPSBNYXRoLnNpZ24oZGlyKTtcclxuXHRcdFx0bGV0IGRhdGFzID0gZ2V0QWxsSW1hZ2VJbmZvKCkudnNvcnQoZSA9PiBlLnlUb1NjcmVlbkNlbnRlcik7XHJcblx0XHRcdGxldCBjZW50cmFsID0gZGF0YXMudnNvcnQoZSA9PiBNYXRoLmFicyhlLnlUb1NjcmVlbkNlbnRlcikpWzBdO1xyXG5cdFx0XHRsZXQgbmV4dENlbnRyYWxJbmRleCA9IGRhdGFzLmluZGV4T2YoY2VudHJhbCk7XHJcblx0XHRcdHdoaWxlIChcclxuXHRcdFx0XHRkYXRhc1tuZXh0Q2VudHJhbEluZGV4ICsgZGlyXSAmJlxyXG5cdFx0XHRcdE1hdGguYWJzKGRhdGFzW25leHRDZW50cmFsSW5kZXggKyBkaXJdLnlUb1NjcmVlbkNlbnRlciAtIGNlbnRyYWwueVRvU2NyZWVuQ2VudGVyKSA8IDEwXHJcblx0XHRcdCkgbmV4dENlbnRyYWxJbmRleCArPSBkaXI7XHJcblx0XHRcdGNlbnRyYWwgPSBkYXRhc1tuZXh0Q2VudHJhbEluZGV4XTtcclxuXHRcdFx0bGV0IG5leHQgPSBkYXRhc1tuZXh0Q2VudHJhbEluZGV4ICsgZGlyXTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHNjcm9sbFRvSW1hZ2UoZGF0YTogdHlwZW9mIGNlbnRyYWwgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcclxuXHRcdFx0XHRpZiAoIWRhdGEpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRpZiAoc2Nyb2xsWSArIGRhdGEueVRvU2NyZWVuQ2VudGVyIDw9IDAgJiYgc2Nyb2xsWSA8PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChkYXRhLmlzU2NyZWVuSGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRkYXRhLmltZy5zY3JvbGxJbnRvVmlldygpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzY3JvbGxUbyhzY3JvbGxYLCBzY3JvbGxZICsgZGF0YS55VG9TY3JlZW5DZW50ZXIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzY3JvbGxXaG9sZUltYWdlUGVuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0UHJvbWlzZS5yYWYoMikudGhlbigoKSA9PiBzY3JvbGxXaG9sZUltYWdlUGVuZGluZyA9IGZhbHNlKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgbm8gaW1hZ2VzLCBkb24ndCBzY3JvbGw7XHJcblx0XHRcdGlmICghY2VudHJhbCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0Ly8gaWYgY3VycmVudCBpbWFnZSBpcyBvdXRzaWRlIHZpZXcsIGRvbid0IHNjcm9sbFxyXG5cdFx0XHRpZiAoIWNlbnRyYWwuY3Jvc3NTY3JlZW4pIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdC8vIGlmIGN1cnJlbnQgaW1hZ2UgaXMgaW4gY2VudGVyLCBzY3JvbGwgdG8gdGhlIG5leHQgb25lXHJcblx0XHRcdGlmIChjZW50cmFsLmlzSW5DZW50ZXIpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2Nyb2xsVG9JbWFnZShuZXh0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgdG8gc2Nyb2xsIHRvIGN1cnJlbnQgaW1hZ2UgeW91IGhhdmUgdG8gc2Nyb2xsIGluIG9wcG9zaWRlIGRpcmVjdGlvbiwgc2Nyb2xsIHRvIG5leHQgb25lXHJcblx0XHRcdGlmIChNYXRoLnNpZ24oY2VudHJhbC55VG9TY3JlZW5DZW50ZXIpICE9IGRpcikge1xyXG5cdFx0XHRcdHJldHVybiBzY3JvbGxUb0ltYWdlKG5leHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZiBjdXJyZW50IGltYWdlIGlzIGZpcnN0L2xhc3QsIGRvbid0IHNjcm9sbCBvdmVyIDI1dmggdG8gaXRcclxuXHRcdFx0aWYgKGRpciA9PSAxICYmIGNlbnRyYWwuaW5kZXggPT0gMCAmJiBjZW50cmFsLnlUb1NjcmVlbkNlbnRlciA+IGlubmVySGVpZ2h0IC8gMikge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZGlyID09IC0xICYmIGNlbnRyYWwuaW5kZXggPT0gZGF0YXMubGVuZ3RoIC0gMSAmJiBjZW50cmFsLnlUb1NjcmVlbkNlbnRlciA8IC1pbm5lckhlaWdodCAvIDIpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBzY3JvbGxUb0ltYWdlKGNlbnRyYWwpO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL0FycmF5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vRGF0ZU5vd0hhY2sudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9lbGVtZW50LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZWxtLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vRmlsdGVyZXIvRW50aXR5RmlsdGVyZXIudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9ldGMudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9mZXRjaC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL09iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL29ic2VydmVyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vUGFnaW5hdGUvUGFnaW5hdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1BhZ2luYXRlL0ltYWdlU2Nyb2xsaW5nLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vUHJvbWlzZS50c1wiIC8+XHJcblxyXG5cclxuXHJcblxyXG5cclxubmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBfX2luaXRfXyh3aW5kb3c6IFdpbmRvdyAmIHR5cGVvZiBnbG9iYWxUaGlzKTogXCJpbml0ZWRcIiB8IFwiYWxyZWFkeSBpbml0ZWRcIiB7XHJcblx0XHRpZiAoIXdpbmRvdykgd2luZG93ID0gZ2xvYmFsVGhpcy53aW5kb3cgYXMgV2luZG93ICYgdHlwZW9mIGdsb2JhbFRoaXM7XHJcblxyXG5cdFx0d2luZG93LmVsbSA9IEVsbS5lbG07XHJcblx0XHR3aW5kb3cucSA9IE9iamVjdC5hc3NpZ24oUXVlcnlTZWxlY3Rvci5XaW5kb3dRLnEsIHsgb3JFbG06IFBvb3BKcy5FbG0ucU9yRWxtIH0pO1xyXG5cdFx0d2luZG93LnFxID0gUXVlcnlTZWxlY3Rvci5XaW5kb3dRLnFxO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSwgJ3EnLCBRdWVyeVNlbGVjdG9yLkVsZW1lbnRRLnEpO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSwgJ3FxJywgUXVlcnlTZWxlY3Rvci5FbGVtZW50US5xcSk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkVsZW1lbnQucHJvdG90eXBlLCAnYXBwZW5kVG8nLCBFbGVtZW50RXh0ZW5zaW9uLmFwcGVuZFRvKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUsICdlbWl0JywgRWxlbWVudEV4dGVuc2lvbi5lbWl0KTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLCAncScsIFF1ZXJ5U2VsZWN0b3IuRG9jdW1lbnRRLnEpO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUsICdxcScsIFF1ZXJ5U2VsZWN0b3IuRG9jdW1lbnRRLnFxKTtcclxuXHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LlByb21pc2UsICdlbXB0eScsIFByb21pc2VFeHRlbnNpb24uZW1wdHkpO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5Qcm9taXNlLCAnZnJhbWUnLCBQcm9taXNlRXh0ZW5zaW9uLmZyYW1lKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuUHJvbWlzZSwgJ3JhZicsIFByb21pc2VFeHRlbnNpb24uZnJhbWUpO1xyXG5cclxuXHRcdHdpbmRvdy5mZXRjaC5jYWNoZWQgPSBGZXRjaEV4dGVuc2lvbi5jYWNoZWQgYXMgYW55O1xyXG5cdFx0d2luZG93LmZldGNoLmRvYyA9IEZldGNoRXh0ZW5zaW9uLmRvYyBhcyBhbnk7XHJcblx0XHR3aW5kb3cuZmV0Y2guanNvbiA9IEZldGNoRXh0ZW5zaW9uLmpzb24gYXMgYW55O1xyXG5cdFx0d2luZG93LmZldGNoLmNhY2hlZC5kb2MgPSBGZXRjaEV4dGVuc2lvbi5jYWNoZWREb2M7XHJcblx0XHR3aW5kb3cuZmV0Y2guZG9jLmNhY2hlZCA9IEZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYztcclxuXHRcdHdpbmRvdy5mZXRjaC5jYWNoZWREb2MgPSBGZXRjaEV4dGVuc2lvbi5jYWNoZWREb2M7XHJcblx0XHR3aW5kb3cuZmV0Y2guanNvbi5jYWNoZWQgPSBGZXRjaEV4dGVuc2lvbi5jYWNoZWRKc29uO1xyXG5cdFx0d2luZG93LmZldGNoLmNhY2hlZC5qc29uID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbjtcclxuXHRcdHdpbmRvdy5mZXRjaC5pc0NhY2hlZCA9IEZldGNoRXh0ZW5zaW9uLmlzQ2FjaGVkO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5SZXNwb25zZS5wcm90b3R5cGUsICdjYWNoZWRBdCcsIDApO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUsICdjYWNoZWRBdCcsIDApO1xyXG5cclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuT2JqZWN0LCAnZGVmaW5lVmFsdWUnLCBPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUpO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5PYmplY3QsICdkZWZpbmVHZXR0ZXInLCBPYmplY3RFeHRlbnNpb24uZGVmaW5lR2V0dGVyKTtcclxuXHRcdC8vIE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZShPYmplY3QsICdtYXAnLCBPYmplY3RFeHRlbnNpb24ubWFwKTtcclxuXHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkFycmF5LCAnbWFwJywgQXJyYXlFeHRlbnNpb24ubWFwKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuQXJyYXkucHJvdG90eXBlLCAncG1hcCcsIEFycmF5RXh0ZW5zaW9uLnBtYXApO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5BcnJheS5wcm90b3R5cGUsICd2c29ydCcsIEFycmF5RXh0ZW5zaW9uLnZzb3J0KTtcclxuXHJcblx0XHR3aW5kb3cucGFnaW5hdGUgPSBQb29wSnMucGFnaW5hdGUgYXMgYW55O1xyXG5cdFx0d2luZG93LmltYWdlU2Nyb2xsaW5nID0gUG9vcEpzLkltYWdlU2Nyb2xsaW5nRXh0ZW5zaW9uO1xyXG5cclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3csICdfX2luaXRfXycsICdhbHJlYWR5IGluaXRlZCcpO1xyXG5cdFx0cmV0dXJuICdpbml0ZWQnO1xyXG5cdH1cclxuXHJcblx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZUdldHRlcih3aW5kb3csICdfX2luaXRfXycsICgpID0+IF9faW5pdF9fKHdpbmRvdykpO1xyXG5cclxuXHRpZiAod2luZG93LmxvY2FsU3RvcmFnZS5fX2luaXRfXykge1xyXG5cdFx0d2luZG93Ll9faW5pdF9fO1xyXG5cdH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgdHlwZSBWYWx1ZU9mPFQ+ID0gVFtrZXlvZiBUXTtcclxuXHRleHBvcnQgdHlwZSBNYXBwZWRPYmplY3Q8VCwgVj4gPSB7IFtQIGluIGtleW9mIFRdOiBWIH07XHJcblxyXG5cdGV4cG9ydCB0eXBlIHNlbGVjdG9yID0gc3RyaW5nIHwgc3RyaW5nICYgeyBfPzogJ3NlbGVjdG9yJyB9XHJcblx0ZXhwb3J0IHR5cGUgdXJsID0gYGh0dHAke3N0cmluZ31gICYgeyBfPzogJ3VybCcgfTtcclxuXHRleHBvcnQgdHlwZSBMaW5rID0gSFRNTEFuY2hvckVsZW1lbnQgfCBzZWxlY3RvciB8IHVybDtcclxuXHJcblxyXG5cclxuXHJcblx0dHlwZSB0cmltU3RhcnQ8UywgQyBleHRlbmRzIHN0cmluZz4gPSBTIGV4dGVuZHMgYCR7Q30ke2luZmVyIFMxfWAgPyB0cmltU3RhcnQ8UzEsIEM+IDogUztcclxuXHR0eXBlIHRyaW1FbmQ8UywgQyBleHRlbmRzIHN0cmluZz4gPSBTIGV4dGVuZHMgYCR7aW5mZXIgUzF9JHtDfWAgPyB0cmltRW5kPFMxLCBDPiA6IFM7XHJcblx0dHlwZSB0cmltPFMsIEMgZXh0ZW5kcyBzdHJpbmcgPSAnICcgfCAnXFx0JyB8ICdcXG4nPiA9IHRyaW1TdGFydDx0cmltRW5kPFMsIEM+LCBDPjtcclxuXHJcblx0dHlwZSBzcGxpdDxTLCBDIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtpbmZlciBTMX0ke0N9JHtpbmZlciBTMn1gID8gc3BsaXQ8UzEsIEM+IHwgc3BsaXQ8UzIsIEM+IDogUztcclxuXHR0eXBlIHNwbGl0U3RhcnQ8UywgQyBleHRlbmRzIHN0cmluZz4gPSBTIGV4dGVuZHMgYCR7aW5mZXIgUzF9JHtDfSR7aW5mZXIgX1MyfWAgPyBzcGxpdFN0YXJ0PFMxLCBDPiA6IFM7XHJcblx0dHlwZSBzcGxpdEVuZDxTLCBDIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtpbmZlciBfUzF9JHtDfSR7aW5mZXIgUzJ9YCA/IHNwbGl0RW5kPFMyLCBDPiA6IFM7XHJcblxyXG5cdHR5cGUgcmVwbGFjZTxTLCBDIGV4dGVuZHMgc3RyaW5nLCBWIGV4dGVuZHMgc3RyaW5nPiA9IFMgZXh0ZW5kcyBgJHtpbmZlciBTMX0ke0N9JHtpbmZlciBTM31gID8gcmVwbGFjZTxgJHtTMX0ke1Z9JHtTM31gLCBDLCBWPiA6IFM7XHJcblxyXG5cdHR5cGUgd3MgPSAnICcgfCAnXFx0JyB8ICdcXG4nO1xyXG5cclxuXHQvLyB0eXBlIGluc2FuZVNlbGVjdG9yID0gJyBhICwgYltxd2VdIFxcbiAsIGMueCAsIGQjeSAsIHggZSAsIHg+ZiAsIHggPiBnICwgW3F3ZV0gLCBoOm5vdCh4PnkpICwgaW1nICc7XHJcblxyXG5cdC8vIHR5cGUgX2kxID0gcmVwbGFjZTxpbnNhbmVTZWxlY3RvciwgYFske3N0cmluZ31dYCwgJy4nPjtcclxuXHQvLyB0eXBlIF9pMTUgPSByZXBsYWNlPF9pMSwgYCgke3N0cmluZ30pYCwgJy4nPjtcclxuXHQvLyB0eXBlIF9pMTcgPSByZXBsYWNlPF9pMTUsIEV4Y2x1ZGU8d3MsICcgJz4sICcgJz47XHJcblx0Ly8gdHlwZSBfaTIgPSBzcGxpdDxfaTE3LCAnLCc+O1xyXG5cdC8vIHR5cGUgX2kzID0gdHJpbTxfaTI+O1xyXG5cdC8vIHR5cGUgX2k0ID0gc3BsaXRFbmQ8X2kzLCB3cyB8ICc+Jz47XHJcblx0Ly8gdHlwZSBfaTUgPSBzcGxpdFN0YXJ0PF9pNCwgJy4nIHwgJyMnIHwgJzonPjtcclxuXHQvLyB0eXBlIF9pNiA9IChIVE1MRWxlbWVudFRhZ05hbWVNYXAgJiB7ICcnOiBIVE1MRWxlbWVudCB9ICYgeyBbazogc3RyaW5nXTogSFRNTEVsZW1lbnQgfSlbX2k1XTtcclxuXHRleHBvcnQgdHlwZSBUYWdOYW1lRnJvbVNlbGVjdG9yPFMgZXh0ZW5kcyBzdHJpbmc+ID0gc3BsaXRTdGFydDxzcGxpdEVuZDx0cmltPHNwbGl0PHJlcGxhY2U8cmVwbGFjZTxyZXBsYWNlPFMsIGBbJHtzdHJpbmd9XWAsICcuJz4sIGAoJHtzdHJpbmd9KWAsICcuJz4sIEV4Y2x1ZGU8d3MsICcgJz4sICcgJz4sICcsJz4+LCB3cyB8ICc+Jz4sICcuJyB8ICcjJyB8ICc6Jz47XHJcblxyXG5cdGV4cG9ydCB0eXBlIFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxTPiA9IFMgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXAgPyBIVE1MRWxlbWVudFRhZ05hbWVNYXBbU10gOiBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuXHJcbmRlY2xhcmUgY29uc3QgX19pbml0X186IFwiaW5pdGVkXCIgfCBcImFscmVhZHkgaW5pdGVkXCI7XHJcbmRlY2xhcmUgY29uc3QgZWxtOiB0eXBlb2YgUG9vcEpzLkVsbS5lbG07XHJcbmRlY2xhcmUgY29uc3QgcTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLldpbmRvd1EucSAmIHsgb3JFbG06IHR5cGVvZiBQb29wSnMuRWxtLnFPckVsbSB9OztcclxuZGVjbGFyZSBjb25zdCBxcTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLldpbmRvd1EucXE7XHJcbmRlY2xhcmUgY29uc3QgcGFnaW5hdGU6IHR5cGVvZiBQb29wSnMucGFnaW5hdGU7XHJcbmRlY2xhcmUgY29uc3QgaW1hZ2VTY3JvbGxpbmc6IHR5cGVvZiBQb29wSnMuSW1hZ2VTY3JvbGxpbmdFeHRlbnNpb247XHJcbmRlY2xhcmUgbmFtZXNwYWNlIGZldGNoIHtcclxuXHRleHBvcnQgbGV0IGNhY2hlZDogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWQgJiB7IGRvYzogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWREb2MsIGpzb246IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbiB9O1xyXG5cdGV4cG9ydCBsZXQgZG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmRvYyAmIHsgY2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYyB9O1xyXG5cdGV4cG9ydCBsZXQgY2FjaGVkRG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYztcclxuXHRleHBvcnQgbGV0IGpzb246IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uanNvbiAmIHsgY2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZEpzb24gfTtcclxuXHRleHBvcnQgbGV0IGlzQ2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmlzQ2FjaGVkO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgV2luZG93IHtcclxuXHRyZWFkb25seSBfX2luaXRfXzogXCJpbml0ZWRcIiB8IFwiYWxyZWFkeSBpbml0ZWRcIjtcclxuXHRlbG06IHR5cGVvZiBQb29wSnMuRWxtLmVsbTtcclxuXHRxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuV2luZG93US5xICYgeyBvckVsbTogdHlwZW9mIFBvb3BKcy5FbG0ucU9yRWxtIH07XHJcblx0cXE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5XaW5kb3dRLnFxO1xyXG5cdHBhZ2luYXRlOiB0eXBlb2YgUG9vcEpzLnBhZ2luYXRlO1xyXG5cdGltYWdlU2Nyb2xsaW5nOiB0eXBlb2YgUG9vcEpzLkltYWdlU2Nyb2xsaW5nRXh0ZW5zaW9uO1xyXG5cdGZldGNoOiB7XHJcblx0XHQoaW5wdXQ6IFJlcXVlc3RJbmZvLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPjtcclxuXHRcdGNhY2hlZDogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWQgJiB7IGRvYzogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWREb2MsIGpzb246IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbiB9O1xyXG5cdFx0ZG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmRvYyAmIHsgY2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYyB9O1xyXG5cdFx0Y2FjaGVkRG9jOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZERvYztcclxuXHRcdGpzb246IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uanNvbiAmIHsgY2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZEpzb24gfTtcclxuXHRcdGlzQ2FjaGVkOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmlzQ2FjaGVkO1xyXG5cdH1cclxufVxyXG5cclxuaW50ZXJmYWNlIEVsZW1lbnQge1xyXG5cdHE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5FbGVtZW50US5xO1xyXG5cdHFxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuRWxlbWVudFEucXE7XHJcblx0YXBwZW5kVG86IHR5cGVvZiBQb29wSnMuRWxlbWVudEV4dGVuc2lvbi5hcHBlbmRUbztcclxuXHRlbWl0OiB0eXBlb2YgUG9vcEpzLkVsZW1lbnRFeHRlbnNpb24uZW1pdDtcclxuXHRhZGRFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBDdXN0b21FdmVudDx7IF9ldmVudD86IHN0cmluZyB9Pj4odHlwZTogVFsnZGV0YWlsJ11bJ19ldmVudCddLCBsaXN0ZW5lcjogKHRoaXM6IERvY3VtZW50LCBldjogVCkgPT4gYW55LCBvcHRpb25zPzogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZDtcclxufVxyXG5pbnRlcmZhY2UgRG9jdW1lbnQge1xyXG5cdHE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5Eb2N1bWVudFEucTtcclxuXHRxcTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLkRvY3VtZW50US5xcTtcclxuXHRjYWNoZWRBdDogbnVtYmVyO1xyXG5cdGFkZEV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEN1c3RvbUV2ZW50PHsgX2V2ZW50Pzogc3RyaW5nIH0+Pih0eXBlOiBUWydkZXRhaWwnXVsnX2V2ZW50J10sIGxpc3RlbmVyOiAodGhpczogRG9jdW1lbnQsIGV2OiBUKSA9PiBhbnksIG9wdGlvbnM/OiBib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgT2JqZWN0Q29uc3RydWN0b3Ige1xyXG5cdGRlZmluZVZhbHVlOiB0eXBlb2YgUG9vcEpzLk9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZTtcclxuXHRkZWZpbmVHZXR0ZXI6IHR5cGVvZiBQb29wSnMuT2JqZWN0RXh0ZW5zaW9uLmRlZmluZUdldHRlcjtcclxuXHQvLyBtYXA6IHR5cGVvZiBQb29wSnMuT2JqZWN0RXh0ZW5zaW9uLm1hcDtcclxuXHRzZXRQcm90b3R5cGVPZjxULCBQPihvOiBULCBwcm90bzogUCk6IFQgJiBQO1xyXG59XHJcbmludGVyZmFjZSBQcm9taXNlQ29uc3RydWN0b3Ige1xyXG5cdGVtcHR5OiB0eXBlb2YgUG9vcEpzLlByb21pc2VFeHRlbnNpb24uZW1wdHk7XHJcblx0ZnJhbWU6IHR5cGVvZiBQb29wSnMuUHJvbWlzZUV4dGVuc2lvbi5mcmFtZTtcclxuXHRyYWY6IHR5cGVvZiBQb29wSnMuUHJvbWlzZUV4dGVuc2lvbi5mcmFtZTtcclxufVxyXG5cclxuaW50ZXJmYWNlIEFycmF5PFQ+IHtcclxuXHR2c29ydDogdHlwZW9mIFBvb3BKcy5BcnJheUV4dGVuc2lvbi52c29ydDtcclxuXHRwbWFwOiB0eXBlb2YgUG9vcEpzLkFycmF5RXh0ZW5zaW9uLnBtYXA7XHJcbn1cclxuaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xyXG5cdG1hcDogdHlwZW9mIFBvb3BKcy5BcnJheUV4dGVuc2lvbi5tYXA7XHJcbn1cclxuXHJcbmludGVyZmFjZSBEYXRlQ29uc3RydWN0b3Ige1xyXG5cdF9ub3coKTogbnVtYmVyO1xyXG59XHJcbmludGVyZmFjZSBEYXRlIHtcclxuXHRfZ2V0VGltZSgpOiBudW1iZXI7XHJcbn1cclxuaW50ZXJmYWNlIFBlcmZvcm1hbmNlIHtcclxuXHRfbm93OiBQZXJmb3JtYW5jZVsnbm93J107XHJcbn1cclxuXHJcbmludGVyZmFjZSBSZXNwb25zZSB7XHJcblx0Y2FjaGVkQXQ6IG51bWJlcjtcclxufVxyXG5cclxuLy8gaW50ZXJmYWNlIEN1c3RvbUV2ZW50PFQ+IHtcclxuLy8gXHRkZXRhaWw/OiBUO1xyXG4vLyB9XHJcblxyXG5pbnRlcmZhY2UgRnVuY3Rpb24ge1xyXG5cdGJpbmQ8VCwgUiwgQVJHUyBleHRlbmRzIGFueVtdPih0aGlzOiAodGhpczogVCwgLi4uYXJnczogQVJHUykgPT4gUiwgdGhpc0FyZzogVCk6ICgoLi4uYXJnczogQVJHUykgPT4gUilcclxufVxyXG5cclxuLy8gZm9yY2UgYWxsb3cgJycuc3BsaXQoJy4nKS5wb3AoKSFcclxuaW50ZXJmYWNlIFN0cmluZyB7XHJcblx0c3BsaXQoc3BsaXR0ZXI6IHN0cmluZyk6IFtzdHJpbmcsIC4uLnN0cmluZ1tdXTtcclxufVxyXG5pbnRlcmZhY2UgQXJyYXk8VD4ge1xyXG5cdHBvcCgpOiB0aGlzIGV4dGVuZHMgW1QsIC4uLlRbXV0gPyBUIDogVCB8IHVuZGVmaW5lZDtcclxufVxyXG4iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIEVudHJ5RmlsdGVyZXJFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBGaWx0ZXJlckl0ZW08RGF0YT4ge1xyXG5cdFx0XHRpZDogc3RyaW5nID0gXCJcIjtcclxuXHRcdFx0bmFtZT86IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcblx0XHRcdHRocmVlV2F5OiBXYXluZXNzID0gZmFsc2U7XHJcblx0XHRcdG1vZGU6IE1vZGUgPSAnb2ZmJztcclxuXHRcdFx0cGFyZW50OiBFbnRyeUZpbHRlcmVyO1xyXG5cdFx0XHRidXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cdFx0XHRpbmNvbXBhdGlibGU/OiBzdHJpbmdbXTtcclxuXHRcdFx0aGlkZGVuID0gZmFsc2U7XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBGaWx0ZXJlckl0ZW1Tb3VyY2UpIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtJztcclxuXHRcdFx0XHRPYmplY3QuYXNzaWduKHRoaXMsIGRhdGEpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmJ1dHRvbiA9IGVsbTwnYnV0dG9uJz4oZGF0YS5idXR0b24sXHJcblx0XHRcdFx0XHRjbGljayA9PiB0aGlzLmNsaWNrKGNsaWNrKSxcclxuXHRcdFx0XHRcdGNvbnRleHRtZW51ID0+IHRoaXMuY29udGV4dG1lbnUoY29udGV4dG1lbnUpLFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFx0dGhpcy5wYXJlbnQuY29udGFpbmVyLmFwcGVuZCh0aGlzLmJ1dHRvbik7XHJcblx0XHRcdFx0aWYgKHRoaXMubmFtZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b24uYXBwZW5kKHRoaXMubmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbi50aXRsZSA9IHRoaXMuZGVzY3JpcHRpb247XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgIT0gJ29mZicpIHtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTW9kZShkYXRhLm1vZGUsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5oaWRkZW4pIHtcclxuXHRcdFx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvZmYnKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUoJ29uJyk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChldmVudC50YXJnZXQgIT0gdGhpcy5idXR0b24pIHJldHVybjtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvbicpIHtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTW9kZSh0aGlzLnRocmVlV2F5ID8gJ29wcG9zaXRlJyA6ICdvZmYnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNb2RlKCdvZmYnKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dG1lbnUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgIT0gJ29wcG9zaXRlJykge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNb2RlKCdvcHBvc2l0ZScpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUoJ29mZicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dG9nZ2xlTW9kZShtb2RlOiBNb2RlLCBmb3JjZSA9IGZhbHNlKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSBtb2RlICYmICFmb3JjZSkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMubW9kZSA9IG1vZGU7XHJcblx0XHRcdFx0dGhpcy5idXR0b24uc2V0QXR0cmlidXRlKCdlZi1tb2RlJywgbW9kZSk7XHJcblx0XHRcdFx0aWYgKG1vZGUgIT0gJ29mZicgJiYgdGhpcy5pbmNvbXBhdGlibGUpIHtcclxuXHRcdFx0XHRcdHRoaXMucGFyZW50Lm9mZkluY29tcGF0aWJsZSh0aGlzLmluY29tcGF0aWJsZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucGFyZW50LnJlcXVlc3RVcGRhdGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmVtb3ZlKCkge1xyXG5cdFx0XHRcdHRoaXMuYnV0dG9uLnJlbW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMudG9nZ2xlTW9kZSgnb2ZmJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNob3coKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRkZW4gPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmJ1dHRvbi5oaWRkZW4gPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRoaWRlKCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZGVuID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLmJ1dHRvbi5oaWRkZW4gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9GaWx0ZXJlckl0ZW0udHNcIiAvPlxyXG5cclxubmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgZmlsdGVyOiBGaWx0ZXJGbjxEYXRhPjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IEZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtZmlsdGVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKiogcmV0dXJucyBpZiBpdGVtIHNob3VsZCBiZSB2aXNpYmxlICovXHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29mZicpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IHRoaXMuZmlsdGVyKGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiA/IHZhbHVlID4gMCA6IHZhbHVlO1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29uJykgcmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvcHBvc2l0ZScpIHJldHVybiAhcmVzdWx0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFZhbHVlRmlsdGVyPERhdGEsIFYgZXh0ZW5kcyBzdHJpbmcgfCBudW1iZXI+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgZmlsdGVyOiBWYWx1ZUZpbHRlckZuPERhdGEsIFY+O1xyXG5cdFx0XHRpbnB1dDogSFRNTElucHV0RWxlbWVudDtcclxuXHRcdFx0bGFzdFZhbHVlOiBWO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogVmFsdWVGaWx0ZXJTb3VyY2U8RGF0YSwgVj4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLWZpbHRlcltlZi1tb2RlPVwib2ZmXCJdJztcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0XHRsZXQgdHlwZSA9IHR5cGVvZiBkYXRhLmlucHV0ID09ICdudW1iZXInID8gJ251bWJlcicgOiAndGV4dCc7XHJcblx0XHRcdFx0bGV0IHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoZGF0YS5pbnB1dCk7XHJcblx0XHRcdFx0bGV0IGlucHV0ID0gYGlucHV0W3R5cGU9JHt0eXBlfV1bdmFsdWU9JHt2YWx1ZX1dYDtcclxuXHRcdFx0XHR0aGlzLmlucHV0ID0gZWxtPCdpbnB1dCc+KGlucHV0LFxyXG5cdFx0XHRcdFx0aW5wdXQgPT4gdGhpcy5jaGFuZ2UoKSxcclxuXHRcdFx0XHQpLmFwcGVuZFRvKHRoaXMuYnV0dG9uKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2hhbmdlKCkge1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcclxuXHRcdFx0XHRpZiAodGhpcy5sYXN0VmFsdWUgIT0gdmFsdWUpIHtcclxuXHRcdFx0XHRcdHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHR0aGlzLnBhcmVudC5yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKiogcmV0dXJucyBpZiBpdGVtIHNob3VsZCBiZSB2aXNpYmxlICovXHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29mZicpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IHRoaXMuZmlsdGVyKHRoaXMuZ2V0VmFsdWUoKSwgZGF0YSwgZWwpO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiA/IHZhbHVlID4gMCA6IHZhbHVlO1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29uJykgcmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvcHBvc2l0ZScpIHJldHVybiAhcmVzdWx0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRnZXRWYWx1ZSgpOiBWIHtcclxuXHRcdFx0XHRsZXQgdmFsdWU6IFYgPSAodGhpcy5pbnB1dC50eXBlID09ICd0ZXh0JyA/IHRoaXMuaW5wdXQudmFsdWUgOiB0aGlzLmlucHV0LnZhbHVlQXNOdW1iZXIpIGFzIFY7XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIE1hdGNoRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgdmFsdWU6IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IHN0cmluZztcclxuXHRcdFx0aW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblx0XHRcdGxhc3RWYWx1ZTogc3RyaW5nO1xyXG5cdFx0XHRtYXRjaGVyOiAoaW5wdXQ6IHN0cmluZykgPT4gYm9vbGVhbjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IE1hdGNoRmlsdGVyU291cmNlPERhdGE+KSB7XHJcblx0XHRcdFx0ZGF0YS5idXR0b24gPz89ICdidXR0b24uZWYtaXRlbS5lZi1maWx0ZXJbZWYtbW9kZT1cIm9mZlwiXSc7XHJcblx0XHRcdFx0ZGF0YS52YWx1ZSA/Pz0gZGF0YSA9PiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0XHRsZXQgdmFsdWUgPSAhZGF0YS5pbnB1dCA/ICcnIDogSlNPTi5zdHJpbmdpZnkoZGF0YS5pbnB1dCk7XHJcblx0XHRcdFx0bGV0IGlucHV0ID0gYGlucHV0W3R5cGU9dGV4dH1dW3ZhbHVlPSR7dmFsdWV9XWA7XHJcblx0XHRcdFx0dGhpcy5pbnB1dCA9IGVsbTwnaW5wdXQnPihpbnB1dCxcclxuXHRcdFx0XHRcdGlucHV0ID0+IHRoaXMuY2hhbmdlKCksXHJcblx0XHRcdFx0KS5hcHBlbmRUbyh0aGlzLmJ1dHRvbik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNoYW5nZSgpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5sYXN0VmFsdWUgIT0gdGhpcy5pbnB1dC52YWx1ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5sYXN0VmFsdWUgPSB0aGlzLmlucHV0LnZhbHVlO1xyXG5cdFx0XHRcdFx0dGhpcy5tYXRjaGVyID0gdGhpcy5nZW5lcmF0ZU1hdGNoZXIodGhpcy5sYXN0VmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykgcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0bGV0IHJlc3VsdCA9IHRoaXMubWF0Y2hlcih0aGlzLnZhbHVlKGRhdGEsIGVsKSk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMubW9kZSA9PSAnb24nID8gcmVzdWx0IDogIXJlc3VsdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gbWF0Y2hlckNhY2hlOiBNYXA8c3RyaW5nLCAoKGlucHV0OiBzdHJpbmcpID0+IGJvb2xlYW4pPiA9IG5ldyBNYXAoKTtcclxuXHRcdFx0Ly8gZ2V0TWF0Y2hlcihzb3VyY2U6IHN0cmluZyk6IChpbnB1dDogc3RyaW5nKSA9PiBib29sZWFuIHtcclxuXHRcdFx0Ly8gXHRpZiAodGhpcy5tYXRjaGVyQ2FjaGUuaGFzKHNvdXJjZSkpIHtcclxuXHRcdFx0Ly8gXHRcdHJldHVybiB0aGlzLm1hdGNoZXJDYWNoZS5nZXQoc291cmNlKTtcclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIFx0bGV0IG1hdGNoZXIgPSB0aGlzLmdlbmVyYXRlTWF0Y2hlcihzb3VyY2UpO1xyXG5cdFx0XHQvLyBcdHRoaXMubWF0Y2hlckNhY2hlLnNldChzb3VyY2UsIG1hdGNoZXIpO1xyXG5cdFx0XHQvLyBcdHJldHVybiBtYXRjaGVyO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdGdlbmVyYXRlTWF0Y2hlcihzb3VyY2U6IHN0cmluZyk6ICgoaW5wdXQ6IHN0cmluZykgPT4gYm9vbGVhbikge1xyXG5cdFx0XHRcdHNvdXJjZSA9IHNvdXJjZS50cmltKCk7XHJcblx0XHRcdFx0aWYgKHNvdXJjZS5sZW5ndGggPT0gMCkgcmV0dXJuICgpID0+IHRydWU7XHJcblx0XHRcdFx0aWYgKHNvdXJjZS5pbmNsdWRlcygnICcpKSB7XHJcblx0XHRcdFx0XHRsZXQgcGFydHMgPSBzb3VyY2Uuc3BsaXQoJyAnKS5tYXAoZSA9PiB0aGlzLmdlbmVyYXRlTWF0Y2hlcihlKSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gKGlucHV0KSA9PiBwYXJ0cy5ldmVyeShtID0+IG0oaW5wdXQpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHNvdXJjZS5zdGFydHNXaXRoKCctJykpIHtcclxuXHRcdFx0XHRcdGlmIChzb3VyY2UubGVuZ3RoIDwgMykgcmV0dXJuICgpID0+IHRydWU7XHJcblx0XHRcdFx0XHRsZXQgYmFzZSA9IHRoaXMuZ2VuZXJhdGVNYXRjaGVyKHNvdXJjZS5zbGljZSgxKSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gKGlucHV0KSA9PiAhYmFzZShpbnB1dCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRsZXQgZmxhZ3MgPSBzb3VyY2UudG9Mb3dlckNhc2UoKSA9PSBzb3VyY2UgPyAnaScgOiAnJztcclxuXHRcdFx0XHRcdGxldCByZWdleCA9IG5ldyBSZWdFeHAoc291cmNlLCBmbGFncyk7XHJcblx0XHRcdFx0XHRyZXR1cm4gKGlucHV0KSA9PiAhIWlucHV0Lm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7IH07XHJcblx0XHRcdFx0cmV0dXJuIChpbnB1dCkgPT4gaW5wdXQuaW5jbHVkZXMoc291cmNlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHR5cGUgVGFnR2V0dGVyRm48RGF0YT4gPSBzZWxlY3RvciB8ICgoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50LCBtb2RlOiBNb2RlKSA9PiAoSFRNTEVsZW1lbnRbXSB8IHN0cmluZ1tdKSk7XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFRhZ0ZpbHRlclNvdXJjZTxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdHRhZ3M6IFRhZ0dldHRlckZuPERhdGE+O1xyXG5cdFx0XHRpbnB1dD86IHN0cmluZztcclxuXHRcdFx0aGlnaGlnaHRDbGFzcz86IHN0cmluZztcclxuXHRcdH1cclxuXHRcdHR5cGUgVGFnTWF0Y2hlciA9IHsgcG9zaXRpdmU6IGJvb2xlYW4sIG1hdGNoZXM6IChzOiBzdHJpbmcpID0+IGJvb2xlYW4gfTtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgVGFnRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdHRhZ3M6IFRhZ0dldHRlckZuPERhdGE+O1xyXG5cdFx0XHRpbnB1dDogSFRNTElucHV0RWxlbWVudDtcclxuXHRcdFx0aGlnaGlnaHRDbGFzczogc3RyaW5nO1xyXG5cclxuXHRcdFx0bGFzdFZhbHVlOiBzdHJpbmcgPSAnJztcclxuXHRcdFx0Y2FjaGVkTWF0Y2hlcjogVGFnTWF0Y2hlcltdO1xyXG5cclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IFRhZ0ZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtZmlsdGVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXQgPSBlbG08J2lucHV0Jz4oYGlucHV0W3R5cGU9dGV4dH1dYCxcclxuXHRcdFx0XHRcdGlucHV0ID0+IHRoaXMuY2hhbmdlKCksXHJcblx0XHRcdFx0KS5hcHBlbmRUbyh0aGlzLmJ1dHRvbik7XHJcblx0XHRcdFx0dGhpcy5pbnB1dC52YWx1ZSA9IGRhdGEuaW5wdXQgfHwgJyc7XHJcblx0XHRcdFx0dGhpcy50YWdzID0gZGF0YS50YWdzO1xyXG5cdFx0XHRcdHRoaXMuY2FjaGVkTWF0Y2hlciA9IFtdO1xyXG5cclxuXHRcdFx0XHR0aGlzLmhpZ2hpZ2h0Q2xhc3MgPSBkYXRhLmhpZ2hpZ2h0Q2xhc3MgPz8gJ2VmLXRhZy1oaWdobGlzaHQnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcclxuXHRcdFx0XHRsZXQgdGFncyA9IHRoaXMuZ2V0VGFncyhkYXRhLCBlbCk7XHJcblx0XHRcdFx0dGFncy5tYXAodGFnID0+IHRoaXMucmVzZXRIaWdobGlnaHQodGFnKSk7XHJcblxyXG5cdFx0XHRcdGxldCByZXN1bHRzID0gdGhpcy5jYWNoZWRNYXRjaGVyLm1hcChtID0+IHtcclxuXHRcdFx0XHRcdGxldCByID0geyBwb3NpdGl2ZTogbS5wb3NpdGl2ZSwgY291bnQ6IDAgfTtcclxuXHRcdFx0XHRcdGZvciAobGV0IHRhZyBvZiB0YWdzKSB7XHJcblx0XHRcdFx0XHRcdGxldCBzdHIgPSB0eXBlb2YgdGFnID09ICdzdHJpbmcnID8gdGFnIDogdGFnLmlubmVyVGV4dDtcclxuXHRcdFx0XHRcdFx0bGV0IHZhbCA9IG0ubWF0Y2hlcyhzdHIpO1xyXG5cdFx0XHRcdFx0XHRpZiAodmFsKSB7XHJcblx0XHRcdFx0XHRcdFx0ci5jb3VudCsrO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuaGlnaGxpZ2h0VGFnKHRhZywgbS5wb3NpdGl2ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiByZXN1bHRzLmV2ZXJ5KHIgPT4gci5wb3NpdGl2ZSA/IHIuY291bnQgPiAwIDogci5jb3VudCA9PSAwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXNldEhpZ2hsaWdodCh0YWc6IHN0cmluZyB8IEhUTUxFbGVtZW50KSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0YWcgPT0gJ3N0cmluZycpIHJldHVybjtcclxuXHRcdFx0XHR0YWcuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmhpZ2hpZ2h0Q2xhc3MpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGhpZ2hsaWdodFRhZyh0YWc6IHN0cmluZyB8IEhUTUxFbGVtZW50LCBwb3NpdGl2ZTogYm9vbGVhbikge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGFnID09ICdzdHJpbmcnKSByZXR1cm47XHJcblx0XHRcdFx0Ly8gRklYTUVcclxuXHRcdFx0XHR0YWcuY2xhc3NMaXN0LmFkZCh0aGlzLmhpZ2hpZ2h0Q2xhc3MpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRnZXRUYWdzKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50W10gfCBzdHJpbmdbXSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnRhZ3MgPT0gJ3N0cmluZycpIHJldHVybiBlbC5xcTxIVE1MRWxlbWVudD4odGhpcy50YWdzKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy50YWdzKGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGdldFRhZ1N0cmluZ3MoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogc3RyaW5nW10ge1xyXG5cdFx0XHRcdGxldCB0YWdzID0gdGhpcy5nZXRUYWdzKGRhdGEsIGVsKTtcclxuXHRcdFx0XHRpZiAodHlwZW9mIHRhZ3NbMF0gPT0gJ3N0cmluZycpIHJldHVybiB0YWdzIGFzIHN0cmluZ1tdO1xyXG5cdFx0XHRcdHJldHVybiB0YWdzLm1hcCgoZSkgPT4gZS5pbm5lclRleHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjaGFuZ2UoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubGFzdFZhbHVlID09IHRoaXMuaW5wdXQudmFsdWUpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLmxhc3RWYWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XHJcblx0XHRcdFx0dGhpcy5jYWNoZWRNYXRjaGVyID0gdGhpcy5wYXJzZU1hdGNoZXIodGhpcy5sYXN0VmFsdWUpO1xyXG5cdFx0XHRcdHRoaXMucGFyZW50LnJlcXVlc3RVcGRhdGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cGFyc2VNYXRjaGVyKG1hdGNoZXI6IHN0cmluZyk6IFRhZ01hdGNoZXJbXSB7XHJcblx0XHRcdFx0bWF0Y2hlci50cmltKCk7XHJcblx0XHRcdFx0aWYgKCFtYXRjaGVyKSByZXR1cm4gW107XHJcblxyXG5cdFx0XHRcdGlmIChtYXRjaGVyLmluY2x1ZGVzKCcgJykpIHtcclxuXHRcdFx0XHRcdGxldCBwYXJ0cyA9IG1hdGNoZXIubWF0Y2goL1wiW15cIl0qXCJ8XFxTKy9nKSB8fCBbXTtcclxuXHRcdFx0XHRcdHJldHVybiBwYXJ0cy5mbGF0TWFwKGUgPT4gdGhpcy5wYXJzZU1hdGNoZXIoZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAobWF0Y2hlci5zdGFydHNXaXRoKCctJykpIHtcclxuXHRcdFx0XHRcdGxldCBwYXJ0cyA9IHRoaXMucGFyc2VNYXRjaGVyKG1hdGNoZXIuc2xpY2UoMSkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHBhcnRzLm1hcChlID0+ICh7IHBvc2l0aXZlOiAhZS5wb3NpdGl2ZSwgbWF0Y2hlczogZS5tYXRjaGVzIH0pKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG1hdGNoZXIubWF0Y2goL1wiXlteXCJdKlwiJC8pKSB7XHJcblx0XHRcdFx0XHRtYXRjaGVyID0gbWF0Y2hlci5zbGljZSgxLCAtMSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gW3sgcG9zaXRpdmU6IHRydWUsIG1hdGNoZXM6IHRhZyA9PiB0YWcgPT0gbWF0Y2hlciB9XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG1hdGNoZXIubGVuZ3RoIDwgMykgcmV0dXJuIFtdO1xyXG5cdFx0XHRcdGlmIChtYXRjaGVyLm1hdGNoKC9cIi8pPy5sZW5ndGggPT0gMSkgcmV0dXJuIFtdO1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRsZXQgZyA9IG5ldyBSZWdFeHAobWF0Y2hlciwgJ2knKTtcclxuXHRcdFx0XHRcdHJldHVybiBbeyBwb3NpdGl2ZTogdHJ1ZSwgbWF0Y2hlczogdGFnID0+ICEhdGFnLm1hdGNoKGcpIH1dO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHsgfVxyXG5cdFx0XHRcdHJldHVybiBbeyBwb3NpdGl2ZTogdHJ1ZSwgbWF0Y2hlczogdGFnID0+IHRhZy5pbmNsdWRlcyhtYXRjaGVyKSB9XTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgY2xhc3MgUGFnaW5hdGlvbkluZm9GaWx0ZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4gaW1wbGVtZW50cyBJRmlsdGVyPERhdGE+IHtcclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogRmlsdGVyZXJJdGVtU291cmNlKSB7XHJcblx0XHRcdFx0c3VwZXIoZGF0YSk7XHJcblx0XHRcdFx0dGhpcy5pbml0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXBwbHkoKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0UGFnaW5hdGUgPSBQb29wSnMuUGFnaW5hdGVFeHRlbnNpb24uUGFnaW5hdGU7XHJcblx0XHRcdGNvdW50UGFnaW5hdGUoKSB7XHJcblx0XHRcdFx0bGV0IGRhdGEgPSB7IHJ1bm5pbmc6IDAsIHF1ZXVlZDogMCwgfTtcclxuXHRcdFx0XHRmb3IgKGxldCBwIG9mIHRoaXMuUGFnaW5hdGUuaW5zdGFuY2VzKSB7XHJcblx0XHRcdFx0XHRkYXRhLnJ1bm5pbmcgKz0gK3AucnVubmluZztcclxuXHRcdFx0XHRcdGRhdGEucXVldWVkICs9IHAucXVldWVkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dXBkYXRlSW5mbygpIHtcclxuXHRcdFx0XHRsZXQgZGF0YSA9IHRoaXMuY291bnRQYWdpbmF0ZSgpO1xyXG5cdFx0XHRcdGlmICghZGF0YS5ydW5uaW5nICYmICFkYXRhLnF1ZXVlZCkge1xyXG5cdFx0XHRcdFx0dGhpcy5oaWRkZW4gfHwgdGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuaGlkZGVuICYmIHRoaXMuc2hvdygpO1xyXG5cdFx0XHRcdFx0bGV0IHRleHQgPSBgLi4uICske2RhdGEucnVubmluZyArIGRhdGEucXVldWVkfWA7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5idXR0b24uaW5uZXJIVE1MICE9IHRleHQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5idXR0b24uaW5uZXJUZXh0ID0gdGV4dDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFzeW5jIGluaXQoKSB7XHJcblx0XHRcdFx0d2hpbGUgKHRydWUpIHtcclxuXHRcdFx0XHRcdGF3YWl0IFByb21pc2UuZnJhbWUoKTtcclxuXHRcdFx0XHRcdHRoaXMudXBkYXRlSW5mbygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn1cclxuIiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgTW9kaWZpZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4gaW1wbGVtZW50cyBJTW9kaWZpZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIG1vZGlmaWVyOiBNb2RpZmllckZuPERhdGE+O1xyXG5cdFx0XHRkZWNsYXJlIHJ1bk9uTm9DaGFuZ2U/OiBib29sZWFuO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogTW9kaWZpZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLW1vZGlmaWVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0b2dnbGVNb2RlKG1vZGU6IE1vZGUsIGZvcmNlID0gZmFsc2UpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09IG1vZGUgJiYgIWZvcmNlKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy5wYXJlbnQubW92ZVRvVG9wKHRoaXMpO1xyXG5cdFx0XHRcdHN1cGVyLnRvZ2dsZU1vZGUobW9kZSwgZm9yY2UpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpIHtcclxuXHRcdFx0XHRsZXQgb2xkTW9kZTogTW9kZSB8IG51bGwgPSBlbC5nZXRBdHRyaWJ1dGUoYGVmLW1vZGlmaWVyLSR7dGhpcy5pZH0tbW9kZWApIGFzIChNb2RlIHwgbnVsbCk7XHJcblx0XHRcdFx0aWYgKG9sZE1vZGUgPT0gdGhpcy5tb2RlICYmICF0aGlzLnJ1bk9uTm9DaGFuZ2UpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLm1vZGlmaWVyKGRhdGEsIGVsLCB0aGlzLm1vZGUsIG51bGwpO1xyXG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZShgZWYtbW9kaWZpZXItJHt0aGlzLmlkfS1tb2RlYCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBQcmVmaXhlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElNb2RpZmllcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgdGFyZ2V0OiBzZWxlY3RvciB8ICgoZTogSFRNTEVsZW1lbnQsIGRhdGE6IERhdGEsIG1vZGU6IE1vZGUpID0+IChIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10pKTtcclxuXHRcdFx0ZGVjbGFyZSBwcmVmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50LCBtb2RlOiBNb2RlKSA9PiBzdHJpbmc7XHJcblx0XHRcdGRlY2xhcmUgcG9zdGZpeD86IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUpID0+IHN0cmluZztcclxuXHRcdFx0ZGVjbGFyZSBwcmVmaXhBdHRyaWJ1dGU6IHN0cmluZztcclxuXHRcdFx0ZGVjbGFyZSBwb3N0Zml4QXR0cmlidXRlOiBzdHJpbmc7XHJcblx0XHRcdGRlY2xhcmUgYWxsOiBib29sZWFuO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogUHJlZml4ZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLW1vZGlmaWVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdGRhdGEudGFyZ2V0ID8/PSBlID0+IGU7XHJcblx0XHRcdFx0ZGF0YS5wcmVmaXhBdHRyaWJ1dGUgPz89ICdlZi1wcmVmaXgnO1xyXG5cdFx0XHRcdGRhdGEucG9zdGZpeEF0dHJpYnV0ZSA/Pz0gJ2VmLXBvc3RmaXgnO1xyXG5cdFx0XHRcdGRhdGEuYWxsID8/PSBmYWxzZTtcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSB7XHJcblx0XHRcdFx0bGV0IHRhcmdldHMgPSB0aGlzLmdldFRhcmdldHMoZWwsIGRhdGEpO1xyXG5cdFx0XHRcdGlmICh0aGlzLnByZWZpeCkge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykge1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRzLm1hcChlID0+IGUucmVtb3ZlQXR0cmlidXRlKHRoaXMucHJlZml4QXR0cmlidXRlKSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsZXQgdmFsdWUgPSB0aGlzLnByZWZpeChkYXRhLCBlbCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0XHRcdFx0dGFyZ2V0cy5tYXAoZSA9PiBlLnNldEF0dHJpYnV0ZSh0aGlzLnByZWZpeEF0dHJpYnV0ZSwgdmFsdWUpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMucG9zdGZpeCkge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykge1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRzLm1hcChlID0+IGUucmVtb3ZlQXR0cmlidXRlKHRoaXMucG9zdGZpeEF0dHJpYnV0ZSkpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gdGhpcy5wb3N0Zml4KGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRzLm1hcChlID0+IGUuc2V0QXR0cmlidXRlKHRoaXMucG9zdGZpeEF0dHJpYnV0ZSwgdmFsdWUpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGdldFRhcmdldHMoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBEYXRhKTogSFRNTEVsZW1lbnRbXSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnRhcmdldCA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuYWxsKSByZXR1cm4gZWwucXEodGhpcy50YXJnZXQpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIFtlbC5xKHRoaXMudGFyZ2V0KV07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGxldCB0YXJnZXRzID0gdGhpcy50YXJnZXQoZWwsIGRhdGEsIHRoaXMubW9kZSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gQXJyYXkuaXNBcnJheSh0YXJnZXRzKSA/IHRhcmdldHMgOiBbdGFyZ2V0c107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRW50cnlGaWx0ZXJlckV4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFNvcnRlcjxEYXRhLCBWIGV4dGVuZHMgbnVtYmVyIHwgc3RyaW5nPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElTb3J0ZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIHNvcnRlcjogU29ydGVyRm48RGF0YSwgVj47XHJcblx0XHRcdGRlY2xhcmUgY29tcGFyYXRvcjogKGE6IFYsIGI6IFYpID0+IG51bWJlcjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IFNvcnRlclNvdXJjZTxEYXRhLCBWPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtc29ydGVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdGRhdGEuY29tcGFyYXRvciA/Pz0gKGE6IFYsIGI6IFYpID0+IGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0b2dnbGVNb2RlKG1vZGU6IE1vZGUsIGZvcmNlID0gZmFsc2UpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09IG1vZGUgJiYgIWZvcmNlKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy5wYXJlbnQubW92ZVRvVG9wKHRoaXMpO1xyXG5cdFx0XHRcdHN1cGVyLnRvZ2dsZU1vZGUobW9kZSwgZm9yY2UpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzb3J0KGxpc3Q6IFtEYXRhLCBIVE1MRWxlbWVudF1bXSk6IFtEYXRhLCBIVE1MRWxlbWVudF1bXSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykgcmV0dXJuIGxpc3Q7XHJcblx0XHRcdFx0cmV0dXJuIGxpc3QudnNvcnQoKFtkYXRhLCBlbF06IFtEYXRhLCBIVE1MRWxlbWVudF0pID0+IHRoaXMuYXBwbHkoZGF0YSwgZWwpLCAoYTogViwgYjogVikgPT4gdGhpcy5jb21wYXJlKGEsIGIpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyoqIHJldHVybnMgb3JkZXIgb2YgZW50cnkgKi9cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogViB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuc29ydGVyKGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb21wYXJlKGE6IFYsIGI6IFYpOiBudW1iZXIge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29uJykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29tcGFyYXRvcihhLCBiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb3Bwb3NpdGUnKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb21wYXJhdG9yKGIsIGEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHRcdGV4cG9ydCB0eXBlIFdheW5lc3MgPSBmYWxzZSB8IHRydWUgfCAnZGlyJztcclxuXHRcdGV4cG9ydCB0eXBlIE1vZGUgPSAnb2ZmJyB8ICdvbicgfCAnb3Bwb3NpdGUnO1xyXG5cclxuXHRcdGV4cG9ydCB0eXBlIFBhcnNlckZuPERhdGE+ID0gKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogUGFydGlhbDxEYXRhPikgPT4gUGFydGlhbDxEYXRhPiB8IHZvaWQgfCBQcm9taXNlTGlrZTxQYXJ0aWFsPERhdGEgfCB2b2lkPj47XHJcblx0XHRleHBvcnQgdHlwZSBGaWx0ZXJGbjxEYXRhPiA9IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUpID0+IGJvb2xlYW47XHJcblx0XHRleHBvcnQgdHlwZSBTb3J0ZXJGbjxEYXRhLCBWPiA9IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUpID0+IFY7XHJcblx0XHRleHBvcnQgdHlwZSBNb2RpZmllckZuPERhdGE+ID0gKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSwgb2xkTW9kZTogTW9kZSB8IG51bGwpID0+IHZvaWQ7XHJcblx0XHRleHBvcnQgdHlwZSBWYWx1ZUZpbHRlckZuPERhdGEsIFY+ID0gKHZhbHVlOiBWLCBkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IGJvb2xlYW47XHJcblx0XHRleHBvcnQgdHlwZSBQcmVmaXhlckZuPERhdGE+ID0gKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSkgPT4gc3RyaW5nO1xyXG5cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgSUZpbHRlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiB7XHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW47XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIElTb3J0ZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4ge1xyXG5cdFx0XHRzb3J0KGxpc3Q6IFtEYXRhLCBIVE1MRWxlbWVudF1bXSk6IFtEYXRhLCBIVE1MRWxlbWVudF1bXTtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgSU1vZGlmaWVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IHtcclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogdm9pZDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdGJ1dHRvbj86IHNlbGVjdG9yO1xyXG5cdFx0XHRpZDogc3RyaW5nO1xyXG5cdFx0XHRuYW1lPzogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbj86IHN0cmluZztcclxuXHRcdFx0dGhyZWVXYXk/OiBXYXluZXNzO1xyXG5cdFx0XHRtb2RlPzogTW9kZTtcclxuXHRcdFx0cGFyZW50OiBFbnRyeUZpbHRlcmVyO1xyXG5cdFx0XHRpbmNvbXBhdGlibGU/OiBzdHJpbmdbXTtcclxuXHRcdFx0aGlkZGVuPzogYm9vbGVhbjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyU291cmNlPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0ZmlsdGVyOiBGaWx0ZXJGbjxEYXRhPjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgVmFsdWVGaWx0ZXJTb3VyY2U8RGF0YSwgVj4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1Tb3VyY2Uge1xyXG5cdFx0XHRmaWx0ZXI6IFZhbHVlRmlsdGVyRm48RGF0YSwgVj47XHJcblx0XHRcdGlucHV0OiBWO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBNYXRjaEZpbHRlclNvdXJjZTxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdHZhbHVlPzogKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkgPT4gc3RyaW5nO1xyXG5cdFx0XHRpbnB1dD86IHN0cmluZztcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgU29ydGVyU291cmNlPERhdGEsIFY+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0c29ydGVyOiBTb3J0ZXJGbjxEYXRhLCBWPjtcclxuXHRcdFx0Y29tcGFyYXRvcj86ICgoYTogViwgYjogVikgPT4gbnVtYmVyKSB8IFY7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIE1vZGlmaWVyU291cmNlPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0bW9kaWZpZXI6IE1vZGlmaWVyRm48RGF0YT47XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFByZWZpeGVyU291cmNlPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0dGFyZ2V0Pzogc2VsZWN0b3IgfCAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogRGF0YSwgbW9kZTogTW9kZSkgPT4gSFRNTEVsZW1lbnQpO1xyXG5cdFx0XHRwcmVmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHBvc3RmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHByZWZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0cG9zdGZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0YWxsPzogYm9vbGVhbjtcclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyZXJJdGVtUGFydGlhbCB7XHJcblx0XHRcdGJ1dHRvbj86IHNlbGVjdG9yO1xyXG5cdFx0XHRpZD86IHN0cmluZztcclxuXHRcdFx0bmFtZT86IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcblx0XHRcdHRocmVlV2F5PzogV2F5bmVzcztcclxuXHRcdFx0bW9kZT86IE1vZGU7XHJcblx0XHRcdGluY29tcGF0aWJsZT86IHN0cmluZ1tdO1xyXG5cdFx0XHRoaWRkZW4/OiBib29sZWFuO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBGaWx0ZXJQYXJ0aWFsPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCB7IH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgVmFsdWVGaWx0ZXJQYXJ0aWFsPERhdGEsIFY+IGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCB7XHJcblx0XHRcdGlucHV0OiBWO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBTb3J0ZXJQYXJ0aWFsU291cmNlPERhdGEsIFY+IGV4dGVuZHMgRmlsdGVyZXJJdGVtUGFydGlhbCB7XHJcblx0XHRcdGNvbXBhcmF0b3I/OiAoKGE6IFYsIGI6IFYpID0+IG51bWJlcikgfCBWO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBNb2RpZmllclBhcnRpYWw8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1QYXJ0aWFsIHsgfVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBQcmVmaXhlclBhcnRpYWw8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1QYXJ0aWFsIHtcclxuXHRcdFx0dGFyZ2V0Pzogc2VsZWN0b3IgfCAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogRGF0YSwgbW9kZTogTW9kZSkgPT4gSFRNTEVsZW1lbnQpO1xyXG5cdFx0XHRwcmVmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHBvc3RmaXg/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdHByZWZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0cG9zdGZpeEF0dHJpYnV0ZT86IHN0cmluZztcclxuXHRcdFx0YWxsPzogYm9vbGVhbjtcclxuXHRcdH1cclxuXHJcblx0XHR0eXBlIFVuaW9uPFNvdXJjZSwgUmVzdWx0PiA9IHtcclxuXHRcdFx0W1AgaW4ga2V5b2YgU291cmNlICYga2V5b2YgUmVzdWx0XTogU291cmNlW1BdIHwgUmVzdWx0W1BdO1xyXG5cdFx0fSAmIE9taXQ8U291cmNlLCBrZXlvZiBSZXN1bHQ+ICYgT21pdDxSZXN1bHQsIGtleW9mIFNvdXJjZT47XHJcblxyXG5cdFx0dHlwZSBPdmVycmlkZTxULCBPPiA9IE9taXQ8VCwga2V5b2YgTz4gJiBPO1xyXG5cclxuXHRcdHR5cGUgRUZTb3VyY2U8VCBleHRlbmRzIHsgc291cmNlOiBhbnkgfT4gPSBPdmVycmlkZTxPdmVycmlkZTxQYXJ0aWFsPFQ+LCBUWydzb3VyY2UnXT4sIHsgYnV0dG9uPzogc2VsZWN0b3IgfT47XHJcblxyXG5cdFx0dHlwZSBTb3VyY2U8VCBleHRlbmRzIHsgc291cmNlOiBhbnkgfT4gPSBUWydzb3VyY2UnXSAmIHtcclxuXHRcdFx0aWQ/OiBzdHJpbmc7IG5hbWU/OiBzdHJpbmc7IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG5cdFx0XHR0aHJlZVdheT86IFdheW5lc3M7IG1vZGU/OiBNb2RlOyBpbmNvbXBhdGlibGU/OiBzdHJpbmdbXTsgaGlkZGVuPzogYm9vbGVhbjtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogY2FuIGJlIGVpdGhlciBNYXAgb3IgV2Vha01hcFxyXG5cdFx0ICogKFdlYWtNYXAgaXMgbGlrZWx5IHRvIGJlIHVzZWxlc3MgaWYgdGhlcmUgYXJlIGxlc3MgdGhlbiAxMGsgb2xkIG5vZGVzIGluIG1hcClcclxuXHRcdCAqL1xyXG5cdFx0bGV0IE1hcFR5cGUgPSBNYXA7XHJcblx0XHR0eXBlIE1hcFR5cGU8SyBleHRlbmRzIG9iamVjdCwgVj4gPS8vIE1hcDxLLCBWPiB8IFxyXG5cdFx0XHRXZWFrTWFwPEssIFY+O1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGxldCBFRiA9IEVudHJ5RmlsdGVyZXJFeHRlbnNpb24uRW50cnlGaWx0ZXJlcjtcclxufSIsIiJdfQ==