import { BaseItem, DrawParameters, Mod, ShapeDefinition, ShapeDefinitionManager, ShapeItem, THEME, types } from "../shapez.js";
import { SzDefinition } from "./definition.js";


export class SzShapeItem extends ShapeItem implements ShapeItem {
	static getId() {
		return 'szItem';
	}
	// @ts-ignore
	definition!: SzDefinition;
	constructor(definition: SzDefinition) {
		if (SzShapeItem.constructorCache.has(definition.getHash())) {
			return SzShapeItem.constructorCache.get(definition.getHash())!;
		}
		super(null as any);
		this.definition = definition;
		this.definition.getHash();
		SzShapeItem.constructorCache.set(definition.getHash(), this);
	}
	static constructorCache: Map<string, SzShapeItem> = new Map();

	static getSchema() {
		return types.string;
	}
	getItemType() {
		return 'shape';
	}
	equals(other: BaseItem): boolean {
		return other.getItemType() == this.getItemType() && (other as SzShapeItem).definition == this.definition;
	}
	drawItemCenteredClipped(x: number, y: number, parameters: DrawParameters, diameter?: number): void {
		if (!parameters.visibleRect.containsCircle(x, y, diameter! / 2)) return;
		if (!diameter) throw new Error();
		this.drawItemCenteredImpl(x, y, parameters, diameter);
	}
	getBackgroundColorAsResource(): string {
		return THEME.map.resources.shape;
	}


	static deserialize(data: any) {
		// debugger;
		console.log('deserialize', data);
		if (data.length < 4) debugger;
		// this.definition = SzDefinition.fromShortKey(data);
		return new SzShapeItem(new SzDefinition(data));
	}
	serialize(): string | number | object {
		let h = this.definition.getHash();
		if (h.length < 4) debugger;
		// console.log('serialize', h);
		return h;
	}
	// deserialize(data: any, root?: GameRoot): string | void {
	// 	throw new Error("Method not implemented.");
	// }


	getAsCopyableKey(): string {
		throw new Error("Method not implemented.");
	}
	equalsImpl(other: BaseItem): boolean {
		throw new Error("Method not implemented.");
	}
	drawFullSizeOnCanvas(context: CanvasRenderingContext2D, size: number): void {
		this.definition.drawFullSizeOnCanvas(context, size);
	}
	drawItemCenteredImpl(x: number, y: number, parameters: DrawParameters, diameter: number): void {
		this.definition.drawCentered(x, y, parameters, diameter);
	}



	static install(mod: Mod) {

		mod.modInterface.extendClass(ShapeDefinitionManager, ({ $old }) => ({
			getShapeItemFromDefinition(this: ShapeDefinitionManager, definition: ShapeDefinition): ShapeItem {
				if (!(definition instanceof SzDefinition)) {
					return $old.getShapeItemFromDefinition.call(this, definition);
				}
				return (this.shapeKeyToItem as Record<string, ShapeItem>)[definition.getHash()] ??= new SzShapeItem(definition);
			}
		}));

		mod.modInterface.registerItem(SzShapeItem, data => SzShapeItem.deserialize(data));
	}

}

