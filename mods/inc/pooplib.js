// please note that using https: copy of this script instead of a file copy is a security vulnerability 

// pooplib
console._log = console.log;
Object.defineProperty(console, 'log', { get: () => console._log, set: () => { } });
makeStyle = (s, e) => (e = document.createElement('style'), e.innerHTML = s, document.head.append(e), e);
makeraf = f => ((function tick() { f && (requestAnimationFrame(tick), requestAnimationFrame(f)) })(), () => f = 0);
qq = s => [...document.querySelectorAll(s)];
q = s => document.querySelector(s);
Element.prototype.q = function (s) { return this.querySelector(s) }
Element.prototype.qq = function (s) { return [...this.querySelectorAll(s)] }
String.prototype.toKNumber = function () { return parseFloat(this.replace(' K', 'e3').replace(' M', 'e6')); }