import { char, rotation24, styleString, SzContext2D } from "./SzContext2D.js";

const config = {
	disableCuts: true,
	disableQuadColors: false,
	debugBadLayers: true,
}

export type cutShape = (
	| 'line'
);
export type quadShape = (
	| 'circle' | 'square' | 'star' | 'windmill'
	| 'cover'
);
export type areaShape = (
	| 'whole' | 'sector'
);
export type color =
	| 'red' | 'orange' | 'yellow'
	| 'lawngreen' | 'green' | 'cyan'
	| 'blue' | 'purple' | 'pink'
	| 'black' | 'grey' | 'white'
	| 'cover' | 'none';

export type colorChar = 'r' | 'g' | 'b' | '-';
export type colorString = `${colorChar}${colorChar}${colorChar}`;

export namespace SzInfo {
	export namespace color {
		export const outline = "#55575a";

		const colorWheelNameList = [
			'red', 'orange', 'yellow',
			'lawngreen', 'green', 'cyan',
			'blue', 'purple', 'pink',
		] as const;
		const colorGreyNameList = [
			'black', 'grey', 'white',
		] as const;

		export type colorInfo = { name: color, style: styleString, code: char, combo?: colorString }; // bbggrr

		export const list: readonly colorInfo[] = [
			{ name: 'red', style: 'red', code: 'r', combo: 'rrr' },
			{ name: 'orange', style: 'orange', code: 'o', combo: 'grr' },
			{ name: 'yellow', style: 'yellow', code: 'y', combo: 'ggr' },
			{ name: 'green', style: 'green', code: 'g', combo: 'ggg' },
			{ name: 'lawngreen', style: 'lawngreen', code: 'l', combo: 'bgg' },
			{ name: 'cyan', style: 'cyan', code: 'c', combo: 'bbg' },
			{ name: 'blue', style: 'blue', code: 'b', combo: 'bbb' },
			{ name: 'purple', style: 'purple', code: 'v', combo: 'bbr' },
			{ name: 'pink', style: 'pink', code: 'p', combo: 'brr' },
			{ name: 'grey', style: 'grey', code: 'u' },
			{ name: 'white', style: 'white', code: 'w' },
			{ name: 'none', style: 'none', code: '-' },
		] as const;
		Object.assign(globalThis, { list });

		export const colorList = list.map(e => e.name);

		export const byName: Record<color, colorInfo> = Object.fromEntries(list.map(e => [e.name, e] as const));
		export const byChar: Record<char, colorInfo> = Object.fromEntries(list.map(e => [e.code, e] as const));
		export const byCombo: Record<colorString, colorInfo> = Object.fromEntries(list.filter(e => e.combo).map(e => [e.combo!, e]));

		export function exampleLayer(color: color) {
			let i = 0, d = 4;
			return new SzLayer({
				quads: [
					{ shape: 'circle', from: i, to: i += 6, color },
					{ shape: 'square', from: i, to: i += 6, color },
					{ shape: 'circle', from: i, to: i += 6, color },
					{ shape: 'square', from: i, to: i += 6, color },
					{ shape: 'circle', from: i, to: i += 6, color },
					{ shape: 'square', from: i, to: i += 6, color },
				]
			});
		}

	}
	export namespace quad {
		export type quadInfo = {
			name: quadShape, code: char, combo?: string, spawn?: string,
			path?: (ctx: SzContext2D, quad: SzLayerQuad) => void,
		};

		export const list: quadInfo[] = [
			{ name: 'circle', code: 'C', combo: 'C', spawn: '6CuCuCuCuCuCu' },
			{ name: 'square', code: 'R', combo: 'R', spawn: '6RuRuRuRuRuRu' },
			{ name: 'star', code: 'S', combo: 'S', spawn: '6SuSuSuSuSuSu' },
			{ name: 'windmill', code: 'W', combo: 'W', spawn: '6WuWuWuWuWuWu' },
		];

		export const named4 = {

			circleSpawn: 'CuCuCuCu',
			squareSpawn: 'RuRuRuRu',
			starSpawn: 'SuSuSuSu',
			windmillSpawn: 'WuWuWuWu',

			circleBottom: '--CuCu--',

			circle: "CuCuCuCu",
			circleHalf: "----CuCu",
			rect: "RuRuRuRu",
			rectHalf: "RuRu----",
			circleHalfRotated: "Cu----Cu",
			circleQuad: "Cu------",
			circleRed: "CrCrCrCr",
			rectHalfBlue: "RbRb----",
			circlePurple: "CpCpCpCp",
			starCyan: "ScScScSc",
			fish: "CgScScCg",
			blueprint: "CbCbCbRb:CwCwCwCw",
			rectCircle: "RpRpRpRp:CwCwCwCw",
			watermelon: "--Cg----:--Cr----",
			starCircle: "SrSrSrSr:CyCyCyCy",
			starCircleStar: "SrSrSrSr:CyCyCyCy:SwSwSwSw",
			fan: "CbRbRbCb:CwCwCwCw:WbWbWbWb",
			monster: "Sg----Sg:CgCgCgCg:--CyCy--",
			bouquet: "CpRpCp--:SwSwSwSw",
			logo: "RuCw--Cw:----Ru--",
			target: "CrCwCrCw:CwCrCwCr:CrCwCrCw:CwCrCwCr",
			speedometer: "Cg----Cr:Cw----Cw:Sy------:Cy----Cy",
			// spikedBall: "CcSyCcSy:SyCcSyCc:CcSyCcSy:SyCcSyCc",
			spikedBall: "CcSyCcSy:SyCcSyCc:CcSyCcSy",
			compass: "CcRcCcRc:RwCwRwCw:Sr--Sw--:CyCyCyCy",
			plant: "Rg--Rg--:CwRwCwRw:--Rg--Rg",
			rocket: "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw",

			mill: "CwCwCwCw:WbWbWbWb",
			star: "SuSuSuSu",
			circleStar: "CwCrCwCr:SgSgSgSg",
			clown: "WrRgWrRg:CwCrCwCr:SgSgSgSg",
			windmillRed: "WrWrWrWr",
			fanTriple: "WpWpWpWp:CwCwCwCw:WpWpWpWp",
			fanQuadruple: "WpWpWpWp:CwCwCwCw:WpWpWpWp:CwCwCwCw",

			bird: "Sr------:--Cg--Cg:Sb--Sb--:--Cw--Cw",
			scissors: "Sr------:--CgCgCg:--Sb----:Cw--CwCw",


		}

		export const named6 = {
			circleSpawn: '6CuCuCuCuCuCu',
			squareSpawn: '6RuRuRuRuRuRu',
			starSpawn: '6SuSuSuSuSuSu',
			windmillSpawn: '6WuWuWuWuWuWu',

			circleBottom: '6----CuCuCu--',

			circle: "6CuCuCuCuCuCu",
			circleHalf: "6------CuCuCu",
			rect: "6RuRuRuRuRuRu",
			rectHalf: "6RuRuRu------",
			circleHalfRotated: "6Cu------CuCu",
			circleQuad: "6CuCu--------",
			circleRed: "6CrCrCrCrCrCr",
			rectHalfBlue: "6RbRbRb------",
			circlePurple: "6CpCpCpCpCpCp",
			starCyan: "6ScScScScScSc",
			fish: "6CgCgScScCgCg",
			blueprint: "6CbCbCbCbCbRb:6CwCwCwCwCwCw",
			rectCircle: "6RpRpRpRpRpRp:6CwCwCwCwCwCw",
			watermelon: "6--CgCg------:6--CrCr------",
			starCircle: "6SrSrSrSrSrSr:6CyCyCyCyCyCy",
			starCircleStar: "6SrSrSrSrSrSr:6CyCyCyCyCyCy:6SwSwSwSwSwSw",
			fan: "6CbCbRbRbCbCb:6CwCwCwCwCwCw:6WbWbWbWbWbWb",
			monster: "6Sg--------Sg:6CgCgCgCgCgCg:6--CyCyCyCy--",
			bouquet: "6CpCpRpCpCp--:6SwSwSwSwSwSw",
			logo: "6RwCuCw--CwCu:6------Ru----",
			target: "6CrCwCrCwCrCw:6CwCrCwCrCwCr:6CrCwCrCwCrCw:6CwCrCwCrCwCr",
			speedometer: "6CgCb----CrCy:6CwCw----CwCw:6Sc----------:6CyCy----CyCy",
			spikedBall: "6CcSyCcSyCcSy:6SyCcSyCcSyCc:6CcSyCcSyCcSy:6SyCcSyCcSyCc",
			compass: "6CcRcRcCcRcRc:6RwCwCwRwCwCw:6----Sr----Sb:6CyCyCyCyCyCy",
			plant: "6Rg--Rg--Rg--:6CwRwCwRwCwRw:6--Rg--Rg--Rg",
			rocket: "6CbCuCbCuCbCu:6Sr----------:6--CrCrSrCrCr:6CwCwCwCwCwCw",

			mill: "6CwCwCwCwCwCw:6WbWbWbWbWbWb",
			star: "6SuSuSuSuSuSu",
			circleStar: "6CwCrCwCrCwCr:6SgSgSgSgSgSg",
			clown: "6WrRgWrRgWrRg:6CwCrCwCrCwCr:6SgSgSgSgSgSg",
			windmillRed: "6WrWrWrWrWrWr",
			fanTriple: "6WpWpWpWpWpWp:6CwCwCwCwCwCw:6WpWpWpWpWpWp",
			fanQuadruple: "6WpWpWpWpWpWp:6CwCwCwCwCwCw:6WpWpWpWpWpWp:6CwCwCwCwCwCw",

			bird: "6Sr----------:6--CgCg--CgCg:6Sb----Sb----:6--CwCw--CwCw",
			scissors: "6Sr----------:6--CgCgCgCgCg:6----Sb------:6CwCw--CwCwCw",


		} as const;

		export const named = {
			circleSpawn: '6CuCuCuCuCuCu',
			squareSpawn: '6RuRuRuRuRuRu',
			starSpawn: '6SuSuSuSuSuSu',
			windmillSpawn: '6WuWuWuWuWuWu',
		} as const;

		Object.assign(named, Object.fromEntries(Object.keys(named6).flatMap(k => {
			let s4 = (named4 as any)[k];
			let s6 = (named6 as any)[k];
			let a: [string, string][] = [];
			if (s4) a.push([k + 4, s4]);
			if (s4) a.push([s4, s6]);
			if (s6) a.push([k, s6]);
			return a;
		})));
		console.log({ named });
		Object.assign(globalThis, { named })

		export type named = keyof typeof named;

		export const byName = Object.fromEntries(list.map(e => [e.name, e]));
		export const byChar = Object.fromEntries(list.map(e => [e.code, e]));

		export function exampleLayer(shape: quadShape) {
			let i = 0, d = 4;
			return new SzLayer({
				quads: [
					{ shape, from: i, to: i += d, color: 'grey' },
					{ shape, from: i, to: i += d, color: 'grey' },
					{ shape, from: i, to: i += d, color: 'grey' },
					{ shape, from: i, to: i += d, color: 'grey' },
					{ shape, from: i, to: i += d, color: 'grey' },
					{ shape, from: i, to: i += d, color: 'grey' },
				],
			});
		}

		export const quadList = list.map(e => e.name);
	}

	let s = Array(100).fill(0).map((e, i) => i.toString(36)).join('').slice(0, 36);
	s += s.slice(10).toUpperCase();

	export const nToChar: char[] = s.split('');
	export const charToN: Record<char, number> = Object.fromEntries(nToChar.map((e, i) => [e, i]));

}



export interface ISzLayer {
	quads: ({
		shape: quadShape,
		from: rotation24, to: rotation24,
		color: color,
	})[];
}


type PickValues<T> = {
	[k in keyof T as T[k] extends ((...args: any) => any) ? never : k]?: T[k]
}

export class SzLayerQuad {
	shape: quadShape = 'circle';
	color: color = 'none';
	from: rotation24 = 0; to: rotation24 = 0;

	constructor(source: PickValues<SzLayerQuad>) {
		Object.assign(this, source);
		if (config.disableQuadColors) {
			this.color = 'none';
		}
	}

	clone() { return new SzLayerQuad(this); }
	outerPath(ctx: SzContext2D, layer: SzLayer) {
		switch (this.shape) {
			case 'circle': {
				ctx.arc(0, 0, 1, this.from, this.to);
				return;
			}
			case 'square': {
				ctx.lineToR(1, this.from);
				// 6 -> Math.SQRT2, 12 -> 1
				let a = this.to - this.from;
				let ar = a * (Math.PI / 24);
				let R = a <= 6 ? 1 / Math.cos(ar) : 1;
				ctx.lineToR(R, (this.from + this.to) / 2);
				ctx.lineToR(1, this.to);
				return;
			}
			case 'star': {
				ctx.lineToR(0.6, this.from);
				ctx.lineToR(Math.SQRT2, (this.from + this.to) / 2);
				ctx.lineToR(0.6, this.to);
				return;
			}
			case 'windmill': {
				ctx.lineToR(1, this.from);

				let a = this.to - this.from;
				let ar = a * (Math.PI / 24);
				let R = a <= 6 ? 1 / Math.cos(ar) : 1;
				ctx.lineToR(R, (this.from + this.to) / 2);

				ctx.lineToR(0.6, this.to);


				// let originX = -quadrantHalfSize;
				// let originY = quadrantHalfSize - dims;
				// const moveInwards = dims * 0.4;
				// context.moveTo(originX, originY + moveInwards);
				// context.lineTo(originX + dims, originY);
				// context.lineTo(originX + dims, originY + dims);
				// context.lineTo(originX, originY + dims);
				// context.closePath();
				// context.fill();
				// context.stroke();
				break;
			}
			default: {
				ctx.saved(ctx => {
					if (this.shape == 'cover') {
						ctx.scale(1 / layer.layerScale())
					}
					SzInfo.quad.byName[this.shape].path!(ctx, this);
				});
				return;
			}
		}
	}
	getHash(): string {
		return `${SzInfo.quad.byName[this.shape].code
			}${SzInfo.color.byName[this.color].code
			}${SzInfo.nToChar[this.from]
			}${SzInfo.nToChar[this.to]
			}`
	}
	static fromShortKey(e: string): SzLayerQuad {
		return new SzLayerQuad({
			shape: SzInfo.quad.byChar[e[0]].name,
			color: SzInfo.color.byChar[e[1]].name,
			from: SzInfo.charToN[e[2]],
			to: SzInfo.charToN[e[3]],
		})
	}
}

const testTemplate: ISzLayer = {
	quads: [
		{ shape: 'square', color: 'green', from: 2, to: 4 },
		{ shape: 'circle', color: 'pink', from: 5, to: 19 },
		{ shape: 'square', color: 'green', from: 20, to: 22 },
	],
}



export class SzLayer implements ISzLayer {
	layerIndex = 0;
	quads: SzLayerQuad[] = [];


	static createTest() {
		let l = new SzLayer(testTemplate);
		console.error('test layer', l);
		return l;
	}

	constructor(source?: PickValues<ISzLayer>, layerIndex?: number) {
		if (source) {
			this.quads = (source.quads ?? []).map(e => new SzLayerQuad(e));
			if ((source as SzLayer).layerIndex) {
				this.layerIndex = (source as SzLayer).layerIndex;
			}
		}
		if (layerIndex != null) {
			this.layerIndex = layerIndex;
		}
		return this.normalize();
	}

	layerScale(layerIndex?: number) {
		layerIndex ??= this.layerIndex;
		return 0.9 - 0.22 * layerIndex;
	}
	drawCenteredLayerScaled(ctx: SzContext2D, layerIndex?: number) {
		ctx.saved(ctx => {
			ctx.scale(this.layerScale(layerIndex));
			this.drawCenteredNormalized(ctx);
		});
	}

	drawCenteredNormalized(ctx: SzContext2D) {
		ctx.saved(ctx => {
			this.clipShapes(ctx);
			this.quads.forEach(q => ctx.saved(ctx => this.fillQuad(q, ctx)));
		});
		ctx.saved(ctx => this.drawQuadOutline(ctx, true));
	}


	fillQuad(quad: SzLayerQuad, ctx: SzContext2D) {
		ctx.fillStyle = SzInfo.color.byName[quad.color].style;
		if (quad.color == 'cover') [
			// ctx.ctx.globalCompositeOperation = 'destination-out'
		]

		ctx.beginPath();
		ctx.moveTo(0, 0);
		quad.outerPath(ctx, this);
		ctx.fill();
	}


	fullQuadPath(ctx: SzContext2D, withCuts?: boolean) {
		ctx.beginPath();
		for (let i = 0; i < this.quads.length; i++) {
			let prev = i > 0 ? this.quads[i - 1] : this.quads.slice(-1)[0];
			let quad = this.quads[i];
			if (withCuts || quad.from != prev.to % 24) ctx.lineTo(0, 0);
			quad.outerPath(ctx, this);
		}
		ctx.closePath();
	}

	drawQuadOutline(ctx: SzContext2D, withCuts?: boolean) {
		this.fullQuadPath(ctx, withCuts);
		ctx.lineWidth = 0.05;
		ctx.strokeStyle = SzInfo.color.outline;// 'orange';
		ctx.stroke();
	}

	clipShapes(ctx: SzContext2D) {
		this.fullQuadPath(ctx);
		ctx.clip();
	}




	clone() {
		return new SzLayer(this);
	}
	isNormalized(): boolean {
		for (let i = 0; i < this.quads.length; i++) {
			let next = this.quads[i];
			let prev = this.quads[i - 1] || this.quads[this.quads.length - 1];
			if (next.from < 0 || next.from >= 24) return false;
			if (next.from >= next.to) return false;
			if (i == 0) {
				if (prev.to > 24 && prev.to % 24 > next.from) return false;
			} else {
				if (prev.to > next.from) return false;
			}
		}
		let places = Array<quadShape | ''>(24).fill('');
		let paints = Array<color | ''>(24).fill('');
		for (let q of this.quads) {
			for (let i = q.from; i < q.to; i++) {
				if (places[i % 24]) return false;
				places[i % 24] = q.shape;
			}
		}
		return true;
	}
	normalize(): this {
		if (this.isNormalized()) return this;
		for (let i = 0; i < this.quads.length; i++) {
			let q = this.quads[i];
			if (q.from > q.to) { this.quads.splice(i, 1); i--; continue; }
			if (q.from >= 24) { q.from -= 24; q.to -= 24; }
		}
		this.quads.sort((a, b) => a.from - b.from);


		let places = Array<quadShape | ''>(24).fill('');
		let paints = Array<color | ''>(24).fill('');
		for (let q of this.quads) {
			for (let i = q.from; i < q.to; i++) {
				places[i % 24] = q.shape;
			}
		}
		for (let i = 0; i < 24; i++) if (!places[i]) paints[i] = '';

		if (!this.isNormalized()) {
			Object.assign(globalThis, { layer: this });
			console.error('Layer failed to normalize properly!', this);
			if (config.debugBadLayers) debugger;
		}
		return this;
	}

	isEmpty() {
		return this.quads.length == 0;
	}

	getQuadAtSector(s: number) {
		let s1 = (s + 0.5) % 24, s2 = s1 + 24;
		return this.quads.find(q =>
			(q.from < s1 && q.to > s1) || (q.from < s2 && q.to > s2)
		);
	}

	canStackWith(upper: SzLayer | undefined): boolean {
		if (!upper) return true;
		for (let i = 0; i < 24; i++) {
			let q1 = this.getQuadAtSector(i);
			let q2 = upper.getQuadAtSector(i);
			if (q1 && q2) return false;
		}
		return true;
	}
	stackWith(upper: SzLayer | undefined): SzLayer {
		if (!upper) return this.clone();
		return new SzLayer({
			quads: this.quads.concat(upper.quads),
		});
	}

	rotate(rot: rotation24) {
		this.quads.map(e => { e.from += rot; e.to += rot; });
		return this.normalize();
	}


	cloneFilteredByQuadrants(includeQuadrants: number[]) {
		const good = (n: number) => includeQuadrants.includes((~~(n / 6)) % 4);

		let allowed = Array(48).fill(0).map((e, i) => good(i + 0.5));
		function convert<T extends SzLayerQuad>(old: T): T[] {
			let filled = Array(48).fill(0).map((e, i) => old.from < i + 0.5 && i + 0.5 < old.to);

			let last: T = old.clone() as T; last.to = -999;
			let list: T[] = [];

			for (let i = 0; i < 48; i++) {
				if (!filled[i]) continue;
				if (!allowed[i]) continue;
				if (last.to != i) {
					last = old.clone() as T;
					last.from = i;
					last.to = i + 1;
					list.push(last);
				} else {
					last.to++;
				}
			}
			return list;
		}
		return new SzLayer({
			quads: this.quads.flatMap(convert),
		});
	}

	cloneAsCover() {
		function convert(quad: SzLayerQuad) {
			return new SzLayerQuad({
				color: 'cover',
				shape: 'cover',
				from: quad.from, to: quad.to,
			});
		}
		return new SzLayer({
			quads: this.quads.flatMap(convert),
		}).paint('cover').normalize();
	}
	removeCover() {
		this.quads = this.quads.filter(e => e.shape != 'cover');
		return this;
	}
	filterPaint(paint: (color | null)[]): (color | null)[] {
		return paint.map((e, i) => {
			let quad = this.getQuadAtSector(i);
			return quad && quad.shape == 'cover' ? null : e;
		});
	}
	paint(paint: (color | null)[] | color) {
		if (Array.isArray(paint)) throw this;
		this.quads.map(e=>e.color = paint);
		// if (!Array.isArray(paint)) paint = Array<color | null>(24).fill(paint);
		// paint.map((color, i) => {
		// 	if (color) {
		// 		this.areas.push(new SzLayerArea({
		// 			color,
		// 			from: i, to: i + 1,
		// 			shape: 'sector',
		// 		}))
		// 	}
		// });
		return this.normalize();;
	}

	static fromShapezHash(hash: string) {
		let angle = 6;
		if (hash[0] == '6') {
			angle = 4;
			hash = hash.slice(1);
		}
		return new SzLayer({
			quads: hash.match(/../g)!.map((s, i) => {
				if (s[0] == '-') return null as any as SzLayerQuad;
				return new SzLayerQuad({
					shape: SzInfo.quad.byChar[s[0]].name,
					color: SzInfo.color.byChar[s[1]].name,
					from: i * angle,
					to: (i + 1) * angle,
				});
			}).filter(e => e),
		});
	}


	getHash(): string {
		if (this.quads.every(e => e.to - e.from == 6)) {
			return [0, 1, 2, 3].map(i => {
				let q = this.quads.find(q => q.from == i * 6);
				if (!q) return '--';
				return q.getHash().slice(0, 2);
			}).join('');
		}
		return '6' + [0, 1, 2, 3, 4, 5].map(i => {
			let q = this.quads.find(q => q.from == i * 4);
			if (!q) return '--';
			return q.getHash().slice(0, 2);
		}).join('');
	}
	static fromShortKey(key: string): any {
		if (key.startsWith('6') || !key.startsWith('!') && key.length == 8) {
			return SzLayer.fromShapezHash(key);
		}
		if (key.startsWith('sz!')) key = key.slice(3);
		if (!key.startsWith('l!z|')) throw new Error('invalid hash');
		let layer = new SzLayer();
		for (let part of key.split('|')) {
			if (part.startsWith('q!')) {
				let strs = part.slice('q!'.length).split(',');
				layer.quads = strs.map(e => SzLayerQuad.fromShortKey(e));
			}
		}
		return layer;
	}
}
