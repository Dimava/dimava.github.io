// please note that using https: copy of this script instead of a file copy is a security vulnerability 

// pooplib
console._log = console.log;
Object.defineProperty(console, 'log', { get: () => console._log, set: () => { } });
Promise.frame = () => new Promise(r => requestAnimationFrame(r));
Element.prototype.q = function (s) { return this.querySelector(s) }
Element.prototype.qq = function (s) { return [...this.querySelectorAll(s)] }
String.prototype.toKNumber = function () { return parseFloat(this.replace(' K', 'e3').replace(' M', 'e6')); }
// String.prototype.toSuperscript = function () { return this.replace(/\d/g, s => /*'⁰¹²³⁴⁵⁶⁷⁸⁹'*/'\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079'[s]) }
var makeStyle = (s, e) => (e = document.createElement('style'), e.innerHTML = s, document.head.append(e), e);
var makeraf = (f) => ((async () => { while (f) { await Promise.frame(); requestAnimationFrame(f); } })(), () => f = 0);
var qq = s => [...document.querySelectorAll(s)];
var q = s => document.querySelector(s);
