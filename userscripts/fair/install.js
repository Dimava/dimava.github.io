// https://dimava.github.io/userscripts/fair/install.js


await async function installVue() {
	if (window.Vue) return console.log('Vue is already loaded!');;
	const scripts = [
		'https://unpkg.com/vue@next',
		'https://unpkg.com/vue-class-component@next',
		'https://unpkg.com/@dimava/vue-prop-decorator-a-variation@0.3.0/dist/vue-prop-decorator-a-variation.global.js',
		'https://dimava.github.io/userscripts/fair/vue-table.js',
	];
	for (let src of scripts) {
		let el = elm('script');
		el.async = false;
		let p = Promise.empty();
		el.addEventListener('load', p.r);
		el.src = src;
		el.appendTo('head');
		await p;
	}
	__decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
		var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.assign(window, {
		VCC: VueClassComponent,
		VueImpl: VueClassComponent.Vue,
		VDAV: VuePropDecoratorAVariation,
		makeClass: VuePropDecoratorAVariation.makeClass,
		Component: VuePropDecoratorAVariation.Component,
	});
	console.log('Vue ready');
}();