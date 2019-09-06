(()=>{
    fetch.useCache = true;
    fetch.cached = async function cached(url) {
        if (!fetch.useCache) {
            return await fetch(url,{credentials:'include',});
        }
        let cache = await caches.open('fetch');

        let response = await cache.match(url);

        if (response) {
            return response;
        }

        response = await fetch(url,{credentials:'include',});

        if (!response.ok) {
            throw new TypeError('bad response status');
        }
        await cache.put(url,response);
        return cached(url);
    }

    fetch.document = fetchDocument = async function fetchDocument(url) {
        console.log('fetching document:', url);
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
            todo();
        }

        document.q = document.$ = s=>document.querySelector(s);
        document.qq = document.$$ = s=>[...document.querySelectorAll(s)];

        return document;
    }
}
)();
