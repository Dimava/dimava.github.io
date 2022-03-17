export function strToH(s) {
    let hash = 0;
    for (let c of s) {
        hash = (((hash << 5) - hash) + c.charCodeAt(0)) | 0;
    }
    return hash.toString(16);
}
export function override(cls, name, fn) {
    let oldFnName = name;
    while (cls.prototype[oldFnName])
        oldFnName = '_' + oldFnName;
    cls.prototype[oldFnName] = cls.prototype[name];
    cls.prototype[name] = fn(oldFnName);
}
export function ExtendSuperclass(mod, cls, makeSubclass) {
    mod.modInterface.extendClass(cls, (old) => {
        return makeSubclass(old).prototype;
    });
}
