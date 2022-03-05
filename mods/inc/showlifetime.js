// showlifetime.js : show estimated life time
// numbers in brackets are est food consumed
// decimals mean there is a high chance for 1 more food to be consumed
// estimation is based on displayed values and is not precise

// you may use this by adding `<script src="https://dimava.github.io/mods/inc/showlifetime.js"></script>` to index.html
// or putting a local copy of it next to index.html and adding `<script src="showlifetime.js"></script>`
// https: version has autoupdates, but local version is more safe in case you don't trust me because it has no autoupdates


// pooplib
Promise.frame = () => new Promise(r => requestAnimationFrame(r));
var makeStyle = (s, e) => (e = document.createElement('style'), e.innerHTML = s, document.head.append(e), e);
var makeraf = (f) => ((async () => { while (f) { await Promise.frame(); requestAnimationFrame(f); } })(), () => f = 0);
var qq = s => [...document.querySelectorAll(s)];
var q = s => document.querySelector(s);
Element.prototype.q = function (s) { return this.querySelector(s) }
Element.prototype.qq = function (s) { return [...this.querySelectorAll(s)] }
String.prototype.toKNumber = function (unround = '') {
	let s = this.replace(/\d+\.?\d*/, s => {
		if (unround == 'ceil') return s + (s.includes('.') ? '5' : '.5');
		// if (unround == 'floor') fixme
		return s;
	}).replace(' K', 'e3').replace(' M', 'e6');
	return parseFloat(s);
}
String.prototype.toSuperscript = function () { return this.replace(/\d/g, s => /*'⁰¹²³⁴⁵⁶⁷⁸⁹'*/'\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079'[s]) }

function displayLifetimeLeft() {
	let eq = (a, b, f) => f(a) == f(b);
	let dec = +this['top-current-health-decay'].innerText.toKNumber('ceil');
	let hp = +this['top-current-health'].innerText.toKNumber();
	let maxhp = +this['top-max-health'].innerText.toKNumber();
	let foods = [...qq('.inventory-row[style*=row]')]
		.map(el => {
			let span = el.q('span');
			let hp = +(span.title || span.dataset.originalTitle).toKNumber() || 0;
			let cooldown = parseFloat(el.q('.food-cooldown')?.innerText || 0) * 1000;
			let amount = +el.q('.inventory-amount').innerText.toKNumber();
			let rawEl = qq('.inventory-row')
				.find(e => e != el
					&& eq(e.q('span.item-name-column'), span, el => el.innerText.trim().split(' ').pop()));
			let rawAmount = +rawEl?.q('.inventory-amount').innerText.toKNumber() || 0;
			let isRaw = !hp && !!rawEl;
			if (isRaw) hp = +(rawEl.q('span').title || rawEl.q('span').dataset.originalTitle).toKNumber();
			if (!isRaw && rawEl && !rawEl.matches('[style*=row]')) isRaw = true;
			return { hp, cooldown, used: 0, amount, el, isRaw, rawEl, rawAmount };
		});
	if (foods.length == 0) return;
	foods = foods.filter(e => e.hp);
	let mainFoods = foods.filter(e => !e.isRaw && (e.amount || e.cooldown && (!e.rawEl || e.rawAmount)));
	let rawFoods = foods.filter(e => e.isRaw && !mainFoods.find(f => f.rawEl == e.el));
	let extraHp = 0; rawFoods.map(e => e.amount * e.hp).reduce((v, e) => v + e, 0);
	// foods.map(e => e.cooldown && (e.cooldown -= 25));
	foods = foods.filter(e => mainFoods.includes(e) || rawFoods.includes(e));
	let dt = 50;
	let decay = (t0, t1) => dec * 60 * (1.25 ** (t1 / 60e3) - 1.25 ** (t0 / 60e3)) / Math.log(1.25);
	let maxRecovery = foods.map(e => e.hp).reduce((v, e) => v + e / 5, 0);
	let minRecovery = Math.min(...foods.map(e => e.hp));
	let time = 0;
	let tickTime = 0;
	let tickDecay = 0;
	for (time; time < 3600e3; time += tickTime) {
		tickTime = 50;
		let minDecayToHeal = minRecovery - (maxhp - hp);
		for (tickTime = dt; time + tickTime < 3600e3; tickTime += dt) {
			tickDecay = decay(time, time + tickTime)
			if (tickDecay > minDecayToHeal) break;
		}
		hp -= tickDecay;
		if (hp + extraHp < 0) break;
		for (let f of foods) {
			f.cooldown -= tickTime;
			if (maxhp - hp > f.hp && f.cooldown <= 0) {
				if (!f.isRaw) {
					hp += f.hp;
					f.cooldown = 5000;
					f.used++;
				} else if (f.used < f.amount) {
					extraHp += f.hp;
					f.cooldown = 5000;
					f.used++;
				}
			}
		}
	}
	time /= 1000;
	qq('.inventory-amount[add]').map(e => e.setAttribute('add', ''));
	for (let f of foods) {
		f.el.q('.inventory-amount').setAttribute('add', f.isRaw ? '==' + f.used : f.used - f.amount);
		f.rawEl?.q('.inventory-amount').setAttribute('add', f.isRaw ? '=+' + f.used : f.used - f.amount - f.rawAmount);
		if (f.cooldown > 0 && f.cooldown < 950 && !f.isRaw)
			f.used += 0.9499 - f.cooldown * 0.001;
	}
	this['top-current-health-decay'].setAttribute('left', `+${~~(time / 60)}:${(time % 60).toFixed(1).padStart(4, '0')
		.replace(/\.(\d)/, (s, a) => a.toSuperscript())
		} (${foods.map(e => (e.isRaw ? '^' : '') + e.used.toFixed(1).replace(/\.(\d)/, (s, a) => a.toSuperscript()))
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
	span.inventory-amount[add]::after {
		content: "+"attr(add);
		vertical-align: super;
		color: green;
		font-size: 70%;
		font-weight: 500;
	}
	span.inventory-amount[add=""]::after {
		content: none;
	}
	span.inventory-amount[add^="-"]::after {
		content: attr(add);
		color: red;
	}
	span.inventory-amount[add="0"]::after {
		content: "=";
		color: blue;
		font-weight: 800;
	}
	span.inventory-amount[add^="="]::after {
		content: "==";
		color: blue;
		font-weight: 800;
	}
`, 0);