import { SzColorItem } from "./shapest/color.js";
import { SzDefinition } from "./shapest/definition.js";
import { SzInfo } from "./shapest/layer.js";
import { szShapeHash } from "./shapest/SzContext2D.js";
import { BaseItem, clamp, globalConfig, MapChunk, Mod, RandomNumberGenerator, ShapeDefinition } from "./shapez.js";
import { ExtendSuperclass } from "./types/common.js";

export const shapePatchChances
	: Partial<Record<SzInfo.quad.named,
		{ base: number, growth: number, cap: number }>
	> = {
	circleSpawn: { base: 100, growth: 3, cap: 100 },
	squareSpawn: { base: 70, growth: 2, cap: 100 },
	starSpawn: { base: 30, growth: 1, cap: 100 },
	windmillSpawn: { base: 20, growth: 0.5, cap: 100 },
}

export const predefinedPatches: {
	x: number, y: number, item: BaseItem | szShapeHash, dx?: number, dy?: number,
}[] = [
		{ x: 0, y: 0, item: SzColorItem.fromColor('red'), dx: 7, dy: 7 },
		{ x: -1, y: 0, item: SzInfo.quad.named.circleSpawn, dx: -9, dy: 7 },
		{ x: 0, y: -1, item: SzInfo.quad.named.squareSpawn, dx: 5, dy: -7 },
		{ x: -1, y: -1, item: SzColorItem.fromColor('green') },
		{ x: 5, y: -2, item: SzInfo.quad.named.starSpawn, dx: 5, dy: -7 },
	];



export class SpawnOwerride extends MapChunk {
	internalGenerateColorPatch(rng: RandomNumberGenerator, colorPatchSize: number, distanceToOriginInChunks: number) {
		console.log(this)
		let available = ['red', 'green'];
		if (distanceToOriginInChunks > 2) available.push('blue');
		this.internalGeneratePatch(rng, colorPatchSize, SzColorItem.fromColor(rng.choice(available)));
	}
	internalGenerateShapePatch(rng: RandomNumberGenerator, shapePatchSize: number, distanceToOriginInChunks: number) {
		let dToChance = (base: number, grow: number, maxTotal: number) =>
			Math.round(base + clamp(distanceToOriginInChunks * grow, 0, maxTotal - base));

		const quads = SzInfo.quad.byName;

		const shapes = Object.fromEntries(Object.entries(shapePatchChances).map(([k, { base, growth, cap }]) => [
			[k, dToChance(base, growth, cap)]
		]))

		let shape = this.internalGenerateRandomSubShape(rng, shapes);

		console.log(this)

		// @ts-ignore
		const definition = SzDefinition.fromShortKey(SzInfo.quad.named[shape + 'Spawn']);
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