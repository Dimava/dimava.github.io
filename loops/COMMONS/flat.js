(() => {
    Flat = function Flat(name = 'flat') {

        let _flat = require('flat-cache').create(name, './cache');

        return new Proxy(_flat.all(), {
            get(o, k, p) {
                if (k == 'save')
                    return _flat.save(true);
                if (k == 'keys')
                    return _flat.keys();
                if (k == 'all')
                    return _flat.all();
                return _flat.getKey(k);
            },
            set(o, k, v) {
                return _flat.setKey(k, v);
            },
            deleteProperty(o, k) {
                    return _flat.removeKey(k);
            }
        })
    }
    let _flat = null;
    Object.defineProperty(this, 'flat', {configurable:true, get(){
        return _flat || (_flat = Flat());
    }})
})();