
import { AtlasSprite, BaseItem, ColorItem, DrawParameters, enumColors, enumColorToShortcode, globalConfig, Mod, smoothenDpi, THEME, types } from "../shapez.js";
import { color, colorChar, colorString, SzInfo } from "./layer.js";
import { SzContext2D } from "./SzContext2D.js";

const colorCharList: colorChar[] = ['r', 'g', 'b', '-'];
const colorStringList =
	colorCharList.flatMap(a =>
		colorCharList.flatMap(b =>
			colorCharList.map(c =>
				`${a}${b}${c}` as colorString)));
const colorStringEnum = Object.fromEntries(colorStringList.map(e => [e, e]));


export class SzColorItem extends BaseItem implements ColorItem {
	color!: colorString;
	static getId() {
		return "sz-color";
	}
	static getSchema() {
		return types.enum(colorStringEnum);
	}
	serialize() {
		return this.color;
	}
	deserialize(data: any) {
		this.color = data;
	}
	getItemType() {
		return "color" as const;
	}
	getAsCopyableKey() {
		return this.color;
	}
	equalsImpl(other: BaseItem) {
		return this.color === (other as any as SzColorItem).color;
	}
	constructor(color: colorString) {
		super();
		this.color = color;
	}
	cachedSprite!: AtlasSprite;
	getBackgroundColorAsResource() {
		return THEME.map.resources[
			SzInfo.color.byChar[this.color[0]].name
		];
	}
	drawFullSizeOnCanvas(context: CanvasRenderingContext2D, size: number) {
		// if (!this.cachedSprite) {
		// 	this.cachedSprite = Loader.getSprite("sprites/colors/" + this.color + ".png");
		// }
		// this.cachedSprite.drawCentered(context, size / 2, size / 2, size);
	}
	drawItemCenteredImpl(x: number, y: number, parameters: DrawParameters, diameter: number): void {
		const dpi = smoothenDpi(globalConfig.shapesSharpness * parameters.zoomLevel);
		const key = diameter + "/" + dpi + "/" + this.color;
		const canvas = parameters.root.buffers.getForKey({
			key: "shapedef",
			subKey: key,
			w: diameter,
			h: diameter,
			dpi,
			redrawMethod: this.internalGenerateShapeBuffer.bind(this),
		});
		parameters.context.drawImage(canvas, x - diameter / 2, y - diameter / 2, diameter, diameter);

	}


	internalGenerateShapeBuffer(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, w: number, h: number, dpi: number): void {
		// prepare context
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = 0.05;

		ctx.translate((w * dpi) / 2, (h * dpi) / 2);
		ctx.scale((dpi * w) / 2.3, (dpi * h) / 2.3);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = THEME.items.outline;
		ctx.lineWidth = THEME.items.outlineWidth / 10;

		ctx.rotate(-Math.PI / 2);

		ctx.fillStyle = THEME.items.circleBackground;
		ctx.beginPath();
		ctx.arc(0, 0, 1.15, 0, 2 * Math.PI);
		ctx.fill();

		new SzContext2D(ctx).saved(ctx => {
			ctx.fillStyle = '#00000022';
			for (let c of this.color) {
				ctx.fillStyle = { r: 'red', g: 'green', b: 'blue', '-': '#eeeeee44' }[c]!;
				ctx.strokeStyle = 'black';
				ctx.lineWidth = 0.05;
				ctx.beginPath().arc(0, 0.5, 0.3, 0, 24).fill().stroke();
				ctx.rotate(8);
			}
		});
	}

	static fromColor(color: enumColors) {
		let c = enumColorToShortcode[color];
		return new SzColorItem(c + c + c as any);
	}

	splitColor(): [enumColors, SzColorItem | null] {
		let c = '-';
		let s = this.color.replace(/[^-]/, C => (c = C, '-'));
		const color = { r: 'red', g: 'green', b: 'blue', '-': '-' }[c]!;
		let item = s == '---' ? null : new SzColorItem(s as any);
		return [color, item];
	}

	fillFromColor(other: SzColorItem): [SzColorItem, SzColorItem | null] {
		let s1: string = this.color, s2: string = other.color;
		while (s1.includes('-') && s2 != '---') {
			let l1 = s1.lastIndexOf('-');
			let c = '-';
			s2 = s2.replace(/[^-]/, C => (c = C, '-'));
			s1 = s1.replace(/-(?!.*-)/, c);
		}
		return [new SzColorItem(s1 as any), s2 == '---' ? null : new SzColorItem(s2 as any)];
	}

	splitIntoColors(): [color, color | null] {
		const toc = (c: string) => SzInfo.color.byChar[c].name
		let s = this.color.split('').filter(e => e != '-');
		if (s.length == 0) return ['grey', null];
		if (s.length == 1) return [toc(s[0]), null];
		if (s.length == 2) return [toc(s[0]), toc(s[1])];
		s = s.sort();
		let c = SzInfo.color.byCombo[s.sort().join('') as colorString].name;
		return [c, c];
	}

	static install(mod: Mod) {
		mod.modInterface.registerItem(SzColorItem, data => new SzColorItem(data));
	}
}