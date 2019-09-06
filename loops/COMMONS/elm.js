(() => {
    elm = function elm(sel = '', ...children) {
        let tag = 'div',
            cls = [],
            id = '',
            attrs = [];;
        sel = sel.replace(/^[\w\-]+/, (s => (tag = s, '')));

        sel = sel.replace(/\[(.*?)=(".*?"|'.*?'|.*?)\]/g, (s, attr, val) => (attrs.push({ attr, val }), ''));

        sel = sel.replace(/\.([\w\-]+)/g, (s, cl) => (cls.push(cl), ''));

        sel = sel.replace(/\#([\w\-]+)/g, (s, d) => (id = id || d, ''));

        if (sel != '') alert('sel is not empty!\n' + sel);

        let e = document.createElement(tag);

        if (id)
            e.id = id;

        if (cls.length)
            e.className = cls.join(' ');

        attrs.forEach(({ attr, val }) => {
            e.setAttribute(attr, val);
        });

        if (children.length)
            e.append(...children);

        return e;
    }
})();