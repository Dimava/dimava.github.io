// showlifetime.js : show estimated life time
// numbers in brackets are est food consumed
// decimals mean there is a high chance for 1 more food to be consumed
// estimation is based on displayed values and is not precise

// you may use this by adding `<script src="https://dimava.github.io/mods/inc/showlifetime.js"></script>` to index.html
// or putting a local copy of it next to index.html and adding `<script src="showlifetime.js"></script>`
// https: version has autoupdates, but local version is more safe in case you don't trust me because it has no autoupdates


// pooplib
makeStyle = (s, e) => (e = document.createElement('style'), e.innerHTML = s, document.head.append(e), e);
makeraf = f => ((function tick() { f && (requestAnimationFrame(tick), requestAnimationFrame(f)) })(), () => f = 0);
qq = s => [...document.querySelectorAll(s)];
q = s => document.querySelector(s);
Element.prototype.q = function (s) { return this.querySelector(s) }
Element.prototype.qq = function (s) { return [...this.querySelectorAll(s)] }
String.prototype.toKNumber = function () { return parseFloat(this.replace(' K', 'e3').replace(' M', 'e6')); }
String.prototype.toSuperscript = function () { return this.replace(/\d/g, s => /*'⁰¹²³⁴⁵⁶⁷⁸⁹'*/'\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079'[s]) }

function displayLifetimeLeft() {
	let dec = this['top-current-health-decay'].innerText.toKNumber();
	let hp = this['top-current-health'].innerText.toKNumber();
	let maxhp = this['top-max-health'].innerText.toKNumber();
	let decay = t => dec * 1.25 ** (t / 60);
	let foods = qq('.inventory-row[style*=row]')
		.map(el => {
			let span = el.q('span');
			let hp = (span.title || span.dataset.originalTitle).toKNumber();
			let cooldown = parseFloat(el.q('.food-cooldown')?.innerText || 0) * 1000 - 50;
			return { hp, cooldown, used: 0 };
		})
		.filter(e => e.hp);
	let time;
	let dt = 50;
	for (time = 0; time < 3600 * 1e3; time += dt) {
		hp -= decay(time * 0.001) * 0.1;
		if (hp < 0) break;
		for (let f of foods) {
			if (f.cooldown > 0) f.cooldown -= dt;
			if (maxhp - hp > f.hp && f.cooldown <= 0) {
				hp += f.hp;
				f.cooldown = 5000;
				f.used++;
			}
		}
	}
	time /= 1000;
	for (let f of foods) {
		if (f.cooldown < 500)
			f.used += 1 - f.cooldown * 0.001;
	}
	this['top-current-health-decay'].setAttribute('left', `+${~~(time / 60)}:${(time % 60).toFixed(1).padStart(4, '0')
		.replace(/\.(\d)/, (s, a) => a.toSuperscript())
		} (${foods.map(e => e.used.toFixed(1).replace(/\.(\d)/, (s, a) => a.toSuperscript()))
		} )`);
}
makeraf(displayLifetimeLeft);
makeStyle(`
	span#top-current-health-decay::after {
		content: attr(left);
		font-size: 0.7em;
		position: absolute;
		-webkit-text-fill-color: white;
		-webkit-text-stroke-width: 0;
		font-weight: normal;
	}
	span#top-current-health {
		width: 70px;
		display: inline-block;
	}
`);