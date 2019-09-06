(()=>{
    log = console.log.bind(console);
    todo = function todo() {
        throw new Error('Not implemented!');
    }

    bug = function bug() {
        throw new Error('Invalid usage');
    }
    if (globalThis.nw) {
        w = nw.Window.get();
        fs = require('fs');

        fs.readdirSync("./commons/").filter(e=>e.match(/^(?!common).*js$/))//
        .map(e=>document.writeln(`<script type="text/javascript" src="commons/${e}"></script>`));
    } else {

        ;["elm.js", "fetch.js", "flat.js", "js.js", "key.js", "nw.js", "Promise.js", "querySelector.js", "relativeLink.js", "title.js"]//
        .map(e=>document.writeln(`<script type="text/javascript" src="commons/${e}"></script>`));
    }
    //     console.log(document.readyState)
}
)();
