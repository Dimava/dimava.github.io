import { ExtendSuperclass } from "./common.js";
import { SzDefinition } from "./shapest/definition.js";
import { SzInfo } from "./shapest/layer.js";
import { szShapeHash6 } from "./shapest/SzContext2D.js";
import { BaseItem, clamp, COLOR_ITEM_SINGLETONS, globalConfig, MapChunk, Mod, RandomNumberGenerator, ShapeDefinition } from "./types/shapez.js";


export const shapePatchChances
	: Partial<Record<SzInfo.quad.named,
		{ base: number, growth: number, cap: number }>
	> = {
	circleSpawn: { base: 50, growth: 3, cap: 100 },
	squareSpawn: { base: 100, growth: 2, cap: 100 },
	starSpawn: { base: 20, growth: 1, cap: 100 },
	windmillSpawn: { base: 6, growth: 0.5, cap: 100 },
}

export const predefinedPatches: {
	x: number, y: number, item: BaseItem | szShapeHash6, dx?: number, dy?: number,
}[] = [
		{
			x: 0, y: 0, item:
				// SzColorItem.fromColor('red')
				COLOR_ITEM_SINGLETONS.red
			, dx: 7, dy: 7
		},
		{ x: -1, y: 0, item: SzInfo.quad.named.circleSpawn, dx: -9, dy: 7 },
		{ x: 0, y: -1, item: SzInfo.quad.named.squareSpawn, dx: 5, dy: -7 },
		{
			x: -1, y: -1, item:
				// SzColorItem.fromColor('green')
				COLOR_ITEM_SINGLETONS.green
		},
		{ x: 5, y: -2, item: SzInfo.quad.named.starSpawn, dx: 5, dy: -7 },
	];


export class SpawnOwerride extends MapChunk {
	// internalGenerateColorPatch(rng: RandomNumberGenerator, colorPatchSize: number, distanceToOriginInChunks: number) {
	// 	console.log(this)
	// 	let available = ['red', 'green'];
	// 	if (distanceToOriginInChunks > 2) available.push('blue');
	// 	this.internalGeneratePatch(rng, colorPatchSize, SzColorItem.fromColor(rng.choice(available)));
	// }
	internalGenerateShapePatch(rng: RandomNumberGenerator, shapePatchSize: number, distanceToOriginInChunks: number) {
		let dToChance = (base: number, grow: number, maxTotal: number) =>
			Math.round(base + clamp(distanceToOriginInChunks * grow, 0, maxTotal - base));

		let weights = Object.fromEntries(Object.entries(shapePatchChances).map(([k, { base, growth, cap }]) =>
			[k as SzInfo.quad.named, dToChance(base, growth, cap)]
		))



		if (distanceToOriginInChunks < 7) {
			// Initial chunks can not spawn the good stuff
			weights.starSpawn = 0;
			weights.windmillSpawn = 0;
		}

		let quadNames: string[] = [];

		let next = this.internalGenerateRandomSubShape(rng, weights);
		quadNames.push(next);
		if (distanceToOriginInChunks >= 10) {
			let next = this.internalGenerateRandomSubShape(rng, weights);
			while (quadNames.concat(next).filter(e => e == 'windmillSpawn').length > 1)
				next = this.internalGenerateRandomSubShape(rng, weights);
			quadNames.push(next);
		}
		if (distanceToOriginInChunks >= 15) {
			let next = this.internalGenerateRandomSubShape(rng, weights);
			while (quadNames.concat(next).filter(e => e == 'windmillSpawn').length > 1)
				next = this.internalGenerateRandomSubShape(rng, weights);
			quadNames.push(next);
		}

		let quadHashes = (quadNames as SzInfo.quad.named[]).map(e => SzInfo.quad.named[e]);

		let hash = '6' + quadHashes.map((e, i, a) => {
			let l = 12 / a.length;
			return e.slice(1 + l * i, 1 + l * (i + 1));
		}).join('');


		const definition = SzDefinition.fromShortKey(hash);
		this.internalGeneratePatch(
			rng,
			shapePatchSize,
			this.root.shapeDefinitionMgr.getShapeItemFromDefinition(definition)
		);

	}
	generatePredefined(rng: RandomNumberGenerator) {
		let def = predefinedPatches.find(p => p.x == this.x && p.y == this.y);
		if (!def) return false;

		let item = def.item instanceof BaseItem ? def.item
			: this.root.shapeDefinitionMgr.getShapeItemFromDefinition(ShapeDefinition.fromShortKey(def.item));

		let dx = def.dx == null ? null as any : def.dx + (def.dx > 0 ? 0 : globalConfig.mapChunkSize);
		let dy = def.dy == null ? null as any : def.dy + (def.dy > 0 ? 0 : globalConfig.mapChunkSize);

		this.internalGeneratePatch(rng, 2, item, dx, dy);
		return true;
	}

	static install(mod: Mod) {

		ExtendSuperclass(mod, MapChunk, () => SpawnOwerride);

	}

}