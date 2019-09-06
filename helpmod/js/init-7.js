void function() {
    function initFetch(window) {
        let fetch = window.fetch;

        fetch.clearCache = async function() {
            let r = await caches.delete ('fetch');
            console.log('Fetch cache deleted!');
            return r;
        }
        if (!fetch.hasOwnProperty('useCache')) {
            fetch.useCache = true;
        }
        fetch.cached = async function cached(url, options={}) {
            if (!fetch.useCache || !window.caches)
                return fetch(url, {
                    credentials: 'include',
                });
            let cache = await caches.open('fetch');

            let response = await cache.match(url);

            if (response) {
                return response;
            }
            options.credentials = options.credentials || 'include';
            response = await fetch(url,options);

            if (!response.ok) {
                throw new TypeError('bad response status');
            }
            await cache.put(url,response);
            return cached(url);
        }

        fetch.document = async function fetchDocument(url) {
            window.console.log('fetching document:', url);
            if (!fetchDocument.parser)
                fetchDocument.parser = new DOMParser();
            let parser = fetchDocument.parser;

            let responce = await fetch.cached(url);
            let headers = responce.headers;
            let ctype = headers.get('content-type').split(';')[0];

            let text = await responce.text();

            let document = parser.parseFromString(text, ctype);
            document.redirected = responce.redirected;
            document.base = document.redirected ? null : url;
            document.url = function(a) {
                if (typeof a == 'function')
                    a = a();
                if (typeof a == 'object') {
                    if (a.href)
                        a = a.getAttribute('href');
                    else if (a.src)
                        a = a.getAttribute('src');
                }
                if (typeof a == 'string') {
                    return new URL(a,document.base).href;
                }
                throw todo();
            }
            return document;
        }

        fetch.doc = async function(url) {
            window.console.log('fetching document:', url);
            let xhr = new XMLHttpRequest();
            let p = Promise.empty();
            xhr.onload = p.r;
            xhr.open("GET", url);
            xhr.responseType = "document";
            xhr.send();
            await p.p;
            let document = xhr.responseXML;
            document.redirected = xhr.redirected;
            document.base = xhr.redirected ? null : url;
            document.url = function(a) {
                if (typeof a == 'function')
                    a = a();
                if (typeof a == 'object') {
                    if (a.href)
                        a = a.getAttribute('href');
                    else if (a.src)
                        a = a.getAttribute('src');
                }
                if (typeof a == 'string') {
                    return new URL(a,document.base).href;
                }
                throw todo();
            }
            return document;
        }
    }

    function initPromise(window) {
        async function promise_map(ar, fn, threads=5) {
            if (!ar || !ar.length)
                return [];
            threads = (+threads) > 1 ? +threads : 1;
            let result = ar.slice ? ar.slice(0) : Array.prototype.slice.call(ar, 0);
            let inProgress = 0;
            let wait, done;
            let empty = ()=>wait = new Promise(r=>done = r);
            empty();
            for (let i = 0; i < ar.length; i++) {
                if (!ar.hasOwnProperty(i))
                    continue;
                next(i);
                if (inProgress < threads)
                    continue;
                await wait;
                empty();
            }
            while (inProgress) {
                await wait;
                empty();
            }
            return result;
            async function next(i) {
                inProgress++;
                result[i] = await fn(result[i]);
                inProgress--;
                done();
            }
        }
        let Array = window.Array;
        Array.prototype.pmap = function(f, t=5) {
            return promise_map(this, f, t)
        }

        let Promise = window.Promise;
        Promise.map = promise_map;
        Promise.mapSeries = (...a)=>promise_map(...a, t);
        Promise.wait = Promise.delay = (t=10)=>new Promise(r=>setTimeout(r, t));
        Promise.frame = ()=>new Promise(r=>requestAnimationFrame(r));
        // Promise.empty = (r,j,p)=>(p = new Promise((res,rej)=>(r = res,
        // j = rej)),
        // p.p = p,
        // p.r = r,
        // p.j = j);
        Promise.empty = (r,j,p)=>(p = new Promise((res,rej)=>(r = res,
        j = rej)),
        {
            r,
            j,
            p
        });

        Promise.prototype.wait = Promise.prototype.delay = async function(t=10) {
            let val = await this;
            await Promise.wait(t);
            return val;
        }
        Promise.prototype.frame = async function() {
            let val = await this;
            await Promise.frame();
            return val;
        }
    }

    function initEtc(window) {
        let Array = window.Array;
        Array.prototype.mapSort = function(map, sort=(a,b)=>a[0] > b[0] ? 1 : -1) {
            //             function _map(e,i,a){try{return map(e,i,a)}catch(e){}};
            return this.map((e,i,a)=>([map(e, i, a), e])).sort(sort).map(e=>e[1]);
        }
        let Object = window.Object;
        Object.fromEntries = function fromEntries(iterable) {
            return [...iterable].reduce((obj,[key,val])=>{
                obj[key] = val
                return obj
            }
            , {})
        }

        Object.filter = function(obj, fn) {
            return Object.fromEntries(Object.entries(obj).filter(([k,v])=>fn(v, k)));
        }

        Object.map = function(obj, fn) {
            return Object.fromEntries(Object.entries(obj).map(([k,v])=>[k, fn(v, k)]));
        }

    }

    function initElm(window) {
        window.elm = function elm(sel='', ...children) {
            let tag = 'div'
              , classes = []
              , id = ''
              , attrs = [];
            function matchAll(r) {
                if (sel.matchAll) return sel.matchAll(r);
                let a = [];
                sel.replace(r, (...m)=>a.push(m));
                return a;
            }
            for (let match of matchAll(/([^\[\].#\s]+)|([\.#])([^\[\].#\s]+)|\[(.*?)(='(.*?)'|="(.*?)"|=(.*?)|)\]/g)) {
                if (match[2] == '.') {
                    classes.push(match[3]);
                } else if (match[1]) {
                    tag = match[1];
                } else if (match[2] == '#') {
                    id = match[3];
                } else {
                    attrs.push([match[4], match[6] || match[7] || match[8] || '']);
                }
            }
            let e = document.createElement(tag);
            if (id) {
                e.id = id;
            }
            for (let c of classes) {
                e.classList.add(c);
            }
            for (let[key,value] of attrs) {
                e.setAttribute(key, value);
            }
            if (children.length) {
                e.append(...children);
            }
            return e;
        }
    }

    function initQ(window) {
        function q(s, el=this) {
            return el.querySelector(s);
        }

        function qq(s, el=this) {
            return [...el.querySelectorAll(s)];
        }

        window.HTMLElement.prototype.q = q;
        window.HTMLElement.prototype.qq = qq;
        window.HTMLElement.prototype.appendTo = function(e) {
            if (typeof e == 'string')
                e = window.document.q(e);
            e.append(this);
            return this;
        }

        window.Window.prototype.q = function q(s, el=(this || globalThis).document) {
            return el.querySelector(s);
        }
        window.Window.prototype.qq = function qq(s, el=(this || globalThis).document) {
            return [...el.querySelectorAll(s)];
        }

        window.Document.prototype.q = q;
        window.Document.prototype.qq = qq;

    }

    function initLog(window) {
        window.log = window.console.log.bind(window.console);
    }

    function initAll(window=this || globalThis, force=false) {
        if (!force && window.hasOwnProperty('__init__'))
            return 'inited';
        initFetch(window);
        initPromise(window);
        initEtc(window);
        initElm(window);
        initQ(window);
        initLog(window);
        Object.defineProperty(window, '__init__', {
            value: 'inited',
            configurable: true,
        })
        return 'init';
    }
    Object.assign(initAll, {
        initFetch,
        initPromise,
        initEtc,
        initElm,
        initQ,
        initLog,
    })
    Object.defineProperty(Window.prototype, '__init__', {
        get: initAll,
        configurable: true,
    })
    Object.defineProperty(Window.prototype, '__init__fn', {
        value: initAll,
        configurable: true,
    })
    if (localStorage.__init__) {
        console.log('lib ready', window.__init__);
    } else {
        console.log('lib ready');
    }
}();
