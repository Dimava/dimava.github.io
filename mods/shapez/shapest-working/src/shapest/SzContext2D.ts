
export const rmode = true;
export const PI12 = -Math.PI / 12;

export type rotation24 = number & { _?: rotation24 }
export type char = string & { _?: char };
export type styleString = string & { _?: styleString };
export type gradient = (
	| { type: 'none', color: styleString }
	| { type: 'radial10', color: styleString, secondaryColor: styleString }
) & { type?: string, repeat?: number, color: styleString, secondaryColor?: styleString };
export type szShapeHash = `sz!${string}` & { _?: szShapeHash };

export class SzContext2D {
	static fromCanvas(cv: HTMLCanvasElement) {
		let ctx = cv.getContext('2d')!;
		const PI = Math.PI;
		const PI12 = -PI / 12;
		ctx.scale(cv.width / 2, cv.height / 2);
		ctx.translate(1, 1);
		ctx.rotate(-Math.PI / 2);
		ctx.scale(1 / 1.15, 1 / 1.15);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		return new SzContext2D(ctx);
	}
	clear() {
		this.ctx.clearRect(-2, -2, 4, 4);
	}

	ctx: CanvasRenderingContext2D;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}
	get lineWidth() { return this.ctx.lineWidth; }
	set lineWidth(v) { this.ctx.lineWidth = v; }
	get strokeStyle() { return this.ctx.strokeStyle as styleString; }
	set strokeStyle(v) { this.ctx.strokeStyle = v; }
	get fillStyle() { return this.ctx.fillStyle as styleString; }
	set fillStyle(v) {
		this.ctx.fillStyle = v || 'black';
		if (v == 'sz-cover') {
			let gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 2);
			let c1 = '#00000000';
			let c2 = '#00000033';
			let n = 20;
			for (let i = 1; i < n; i++) {
				gradient.addColorStop((i - 0.01) / n, i % 2 ? c2 : c1);
				gradient.addColorStop((i + 0.01) / n, i % 2 ? c1 : c2);
			}
			this.ctx.fillStyle = gradient;
		}
		if (v == 'none') {
			let gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 2);
			let c1 = 'red';
			let c2 = 'blue';
			let n = 20;
			for (let i = 0; i <= n; i++) {
				gradient.addColorStop(i / n, i % 2 ? c2 : c1);
			}
			this.ctx.fillStyle = gradient;
			// this.ctx.fillStyle = 'transparent';
		}
	}
	get globalAlpha() { return this.ctx.globalAlpha; }
	set globalAlpha(v) { this.ctx.globalAlpha = v; }

	createGradientFill(source: gradient): styleString | CanvasGradient {
		if (source.type == 'none') {
			return source.color;
		}
		if (source.type == 'radial10') {
			let g = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 2);
			const n = 10;

			g.addColorStop(0, source.color);
			for (let i = 0; i < n; i++) {
				g.addColorStop((i + 0.5) / n, source.secondaryColor);
				g.addColorStop((i + 1) / n, source.color);
			}
			return g;
		}
		throw 0;
	}


	beginPath() { this.ctx.beginPath(); return this; }
	closePath() { this.ctx.closePath(); return this; }
	stroke() { this.ctx.stroke(); return this; }
	fill() { this.ctx.fill(); return this; }
	clip() { this.ctx.clip(); return this; }
	save() { this.ctx.save(); return this; }
	restore() { this.ctx.restore(); return this; }

	scale(x: number, y: number = x) {
		this.ctx.scale(x, y); return this;
	}

	rotate(angle: rotation24) {
		this.ctx.rotate(-angle * PI12);
		return this;
	}
	moveTo(x: number, y: number) {
		// log({ move: { x: +x.toFixed(3), y: +y.toFixed(3) } });
		this.ctx.moveTo(y, x);
		return this;
	}
	moveToR(r: number, a: rotation24) {
		this.moveTo(-r * Math.sin(a * PI12), r * Math.cos(a * PI12));
		return this;
	}
	lineTo(x: number, y: number) {
		// log({ line: { x: +x.toFixed(3), y: +y.toFixed(3) } })
		this.ctx.lineTo(y, x);
		return this;
	}
	lineToR(radius: number, direction: rotation24) {
		this.lineTo(-radius * Math.sin(direction * PI12), radius * Math.cos(direction * PI12));
		return this;
	}
	rToXY(radius: number, direction: rotation24) {
		return [-radius * Math.sin(direction * PI12), radius * Math.cos(direction * PI12)] as const;
	}
	arc(
		cx: number, cy: number, radius: number, from: rotation24, to: rotation24, dir?: boolean
	) {
		this.ctx.arc(cx, cy, radius, -from * PI12, -to * PI12, dir);
		return this;
	}
	fillRect(x: number, y: number, w: number, h: number) {
		this.ctx.fillRect(x, y, w, h);
		return this;
	}

	saved(f: (ctx: this) => void) {
		this.save();
		f(this);
		this.restore();
	}
}


function log(...a: any[]) {
	console.error(...a);
	document.body.append(document.createElement('br'));
	for (let o of a)
		document.body.append(JSON.stringify(o));
}
