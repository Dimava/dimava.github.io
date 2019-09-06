(() => {
    addEventListener('DOMContentLoaded', function() {
        let el = q('links');
        if (!el) return;
        let loc = `.${location.pathname.match(/.*\//)[0]}`;
        fs.readdirSync(loc)
            .filter(e => e.endsWith('.html')).filter(e => e != 'common.js')
            .map(e => elm(`a[href=${loc}${e}]`, e))
            .reverse()
            .map(e => el.prepend(e, elm('br')));
    });
})();