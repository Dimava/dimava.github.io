
// This file is a library used for other mods
// it's not required as it's copypasted into them

// pooplib
console._log = console.log;
Object.defineProperty(console, 'log', { get: () => console._log, set: () => { } });
Promise.frame = () => new Promise(r => requestAnimationFrame(r));
Element.prototype.q = function (s) { return this.querySelector(s) }
Element.prototype.qq = function (s) { return [...this.querySelectorAll(s)] }
String.prototype.toKNumber = function () { return parseFloat(this.replace(' K', 'e3').replace(' M', 'e6')); }
String.prototype.toKNumber = function (unround = '') {
	let s = this.replace(/\d+\.?\d*/, s => {
		if (unround == 'ceil') return s + (s.includes('.') ? '5' : '.5');
		// if (unround == 'floor') fixme
		return s;
	}).replace(' K', 'e3').replace(' M', 'e6');
	return parseFloat(s);
}
String.prototype.toSuperscript = function () { return this.replace(/\d/g, s => /*'⁰¹²³⁴⁵⁶⁷⁸⁹'*/'\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079'[s]) }
makeStyle = (s, e) => (e = document.createElement('style'), e.innerHTML = s, document.head.append(e), e);
makeraf = (f) => ((async () => { while (f) { await Promise.frame(); requestAnimationFrame(f); } })(), () => f = () => { });
q = s => document.querySelector(s);
qq = (s, v) => [...(v = document.querySelectorAll(s), v)];
