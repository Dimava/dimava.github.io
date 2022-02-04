/**
 * usage: 
 * 		import('https://dimava.github.io/userscripts/fair/install.js')
 */

void async function install() {
	if (!window.Vue) {
		await _importScript('https://unpkg.com/vue@next');
	}
	if (!window.VueClassComponent) {
		await _importScript('https://unpkg.com/vue-class-component@next');
	}
	if (!window.VuePropDecoratorAVariation) {
		await _importScript('https://unpkg.com/@dimava/vue-prop-decorator-a-variation@0.3.0/dist/vue-prop-decorator-a-variation.global.js');
	}
	Object.assign(window, {
		VCC: VueClassComponent,
		VueImpl: VueClassComponent.Vue,
		VDAV: VuePropDecoratorAVariation,
		makeClass: VuePropDecoratorAVariation.makeClass,
		Component: VuePropDecoratorAVariation.Component,
	});
	console.log('Vue ready');

	await _importScript('https://dimava.github.io/userscripts/fair/cookie.js');

	await _importScript('https://dimava.github.io/userscripts/fair/simple-table.js');
}();

function _importScript(src) {
	return new Promise(r => {
		let el = document.createElement('script');
		el.addEventListener('load', r);
		el.src = src;
		document.head.append(el);
	});
}
window._importScript ??= _importScript;

function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
window.__decorate ??= __decorate;