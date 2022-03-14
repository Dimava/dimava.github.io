
import { override, strToH } from "../types/common.js";
import { BaseItem, BasicSerializableObject, COLOR_ITEM_SINGLETONS, DrawParameters, GameRoot, globalConfig, LogicGateSystem, makeOffscreenBuffer, Mod, ShapeDefinition, ShapeItem, ShapeLayer, smoothenDpi, THEME, types } from "../shapez.js";
import { color, SzInfo, SzLayer } from "./layer.js";
import { rmode, rotation24, SzContext2D } from "./SzContext2D.js";


export class SzDefinition extends BasicSerializableObject implements ShapeDefinition {
	static getId() {
		return "sz-definition";
	}

	static createTest() {
		return new SzDefinition({
			layers: [SzLayer.createTest()],
		});
	}



	constructor(data?: { layers: SzLayer[] } | SzDefinition | string, clone = false) {
		super();
		if (typeof data == 'string') return SzDefinition.fromShortKey(data);
		if (data?.layers) this.layers = data.layers.map((e, i) => new SzLayer(e, i));
		if (!this.layers.every(e => e.isNormalized())) {
			this.layers = SzDefinition.createTest().layers;
		}
		// console.log(this.getHash())
		if (clone) return;
		if (SzDefinition.definitionCache.has(this.getHash())) {
			return SzDefinition.definitionCache.get(this.getHash())!;
		}
		console.log(this.getHash());
	}



	layers: SzLayer[] = [];
	cachedHash: string = '';
	bufferGenerator: any;
	getClonedLayers(): ShapeLayer[] {
		throw new Error("Method not implemented.");
	}
	isEntirelyEmpty(): boolean {
		return this.layers.every(e => e.isEmpty());
	}
	getHash(): string {
		if (this.cachedHash) return this.cachedHash;
		if (!this.layers.length) debugger;
		return this.cachedHash = this.layers.map(e => e.getHash()).join(':');
	}
	drawFullSizeOnCanvas(context: CanvasRenderingContext2D, size: number): void {
		this.internalGenerateShapeBuffer(null as any, context, size, size, 1);
	}
	generateAsCanvas(size = 120) {
		const [canvas, context] = makeOffscreenBuffer(size, size, {
			smooth: true,
			label: "definition-canvas-cache-" + this.getHash(),
			reusable: false,
		});

		this.internalGenerateShapeBuffer(canvas, context, size, size, 1);
		return canvas;
	}
	cloneFilteredByQuadrants(includeQuadrants: number[]): ShapeDefinition {
		let layers = this.layers.map(e => e.cloneFilteredByQuadrants(includeQuadrants)).filter(e => !e.isEmpty());
		return new SzDefinition({ layers });
	}
	cloneRotateCW(): ShapeDefinition {
		return new SzDefinition({
			layers: this.layers.map(l => l.clone().rotate(6))
		});
	}
	cloneRotate24(n: rotation24): SzDefinition {
		return new SzDefinition({
			layers: this.layers.map(l => l.clone().rotate(n))
		});
	}
	cloneRotateCCW(): ShapeDefinition {
		return new SzDefinition({
			layers: this.layers.map(l => l.clone().rotate(24 - 6))
		});
	}
	cloneRotate180(): ShapeDefinition {
		return new SzDefinition({
			layers: this.layers.map(l => l.clone().rotate(12))
		});
	}
	cloneAndStackWith(upper: SzDefinition): ShapeDefinition {
		let bottom = this.clone(e => e.removeCover()).layers;
		let top = upper.clone().layers;
		let dh = 0;
		while (!bottom.every((l, i) => {
			return l.canStackWith(top[i - dh]);
		})) dh++;
		let overlap = bottom.length - dh;
		let newLayers = bottom.map((l, i) => {
			return l.stackWith(top[i + dh]);
		}).concat(top.slice(
			overlap
		));
		return new SzDefinition({ layers: newLayers.slice(0, 4) });
	}

	cloneAndPaintWith(color: color): SzDefinition {
		let rawPaints = Array<color | null>(24).fill(color);
		return this.clone((l, i, a) => {
			let paints = a.slice(i).reduceRight((v, e) => e.filterPaint(v), rawPaints);
			return l.removeCover().paint(paints);
		});
	}

	cloneAndPaintWith4Colors(colors: [string, string, string, string]): ShapeDefinition {
		let rawPaints: (color | null)[] = Array.from({ length: 24 }, (e, i) => {
			return colors[i % 6] as any;
		})
		return this.clone((l, i, a) => {
			let paints = a.slice(i).reduceRight((v, e) => e.filterPaint(v), rawPaints);
			return l.removeCover().paint(paints);
		});
	}

	cloneAndMakeCover() {
		return new SzDefinition({ layers: this.layers.map(e => e.cloneAsCover()) })
	}


	clone(layerMapper?: (layer: SzLayer, i: number, a: SzLayer[]) => SzLayer | SzLayer[] | null) {
		if (layerMapper) {
			return new SzDefinition({
				layers: this.layers.map(e => e.clone()).flatMap((e, i, a) => {
					return layerMapper(e, i, a) || [];
				}).filter(e => !e.isEmpty())
			});
		}
		return new SzDefinition(this, true);
	}

	static getSchema() {
		return types.string;
	}
	serialize() {
		return this.getHash();
	}
	deserialize(data: any, root?: GameRoot): string | void {
		console.log('deser', this);
	}




	// inherited
	drawCentered(x: number, y: number, parameters: DrawParameters, diameter: number): void {
		const dpi = smoothenDpi(globalConfig.shapesSharpness * parameters.zoomLevel);
		if (!this.bufferGenerator) {
			this.bufferGenerator = this.internalGenerateShapeBuffer.bind(this);
		}
		const key = diameter + "/" + dpi + "/" + this.cachedHash;
		const canvas = parameters.root.buffers.getForKey({
			key: "shapedef",
			subKey: key,
			w: diameter,
			h: diameter,
			dpi,
			redrawMethod: this.bufferGenerator,
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

		let sCtx = new SzContext2D(ctx);
		this.layers.forEach((l, i) => l.drawCenteredLayerScaled(sCtx, i));

	}

	static rawHashMap: Map<string, string> = new Map();
	static getHashfromRawHash(hash: string) {
		if (!this.rawHashMap.has(hash)) {
			this.rawHashMap.set(hash,
				hash.startsWith('sz!') ? SzDefinition.fromShortKey(hash).getHash() :
					SzDefinition.fromRawShape(hash).getHash()
			)
		}
		return this.rawHashMap.get(hash)!;
	}

	static fromRawShape(shapeDefinition: ShapeDefinition | string) {
		if (typeof shapeDefinition != 'string')
			shapeDefinition = shapeDefinition.getHash();
		return new SzDefinition({
			layers: shapeDefinition.split(':').map(e => SzLayer.fromShortKey(e))
		});
	}

	static definitionCache: Map<string, SzDefinition> = new Map();
	static fromShortKey(key: string): SzDefinition {
		if (!this.definitionCache.has(key)) {
			this.definitionCache.set(key, new SzDefinition({
				layers: key.split(':').map(e => SzLayer.fromShortKey(e))
			}));
		}
		return this.definitionCache.get(key)!;
	}

	compute_ANALYZE(root: GameRoot): [BaseItem | null, BaseItem | null] {
		let firstQuad = this.layers[0].quads[0];
		if (firstQuad.from != 0) return [null, null];
		let definition = new SzDefinition({ layers: [SzInfo.quad.exampleLayer(firstQuad.shape)] });
		// @ts-expect-error
		let color = enumShortcodeToColor[SzInfo.color.byName[firstQuad.color].code];
		return [
			COLOR_ITEM_SINGLETONS[color],
			root.shapeDefinitionMgr.getShapeItemFromDefinition(definition),
		];
	}



	static install(mod: Mod) {
		mod.modInterface.extendObject(ShapeDefinition, ({ $old }) => ({
			fromShortKey: SzDefinition.fromShortKey.bind(SzDefinition)
		}));

		mod.modInterface.extendClass(LogicGateSystem, ({ $old }) => ({
			compute_ANALYZE(parameters: any) {
				let item = parameters[0];
				if (!item || item.getItemType() !== "shape") {
					// Not a shape
					return [null as any as BaseItem, null as any as BaseItem];
				}
				let def = (item as ShapeItem).definition;
				if (def instanceof SzDefinition) {
					return def.compute_ANALYZE(this.root!) as any;
				}
				return $old.compute_ANALYZE.call(this, parameters);
			}
		}))

	}
}

