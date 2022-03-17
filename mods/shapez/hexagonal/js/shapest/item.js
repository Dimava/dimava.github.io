import { ShapeItem } from "shapez/game/items/shape_item";
import { ShapeDefinitionManager } from "shapez/game/shape_definition_manager";
import { THEME } from "shapez/game/theme";
import { types } from "shapez/savegame/serialization";
import { SzDefinition } from "./definition";
export class SzShapeItem extends ShapeItem {
    static getId() {
        return 'szItem';
    }
    // @ts-ignore
    definition;
    constructor(definition) {
        if (SzShapeItem.constructorCache.has(definition.getHash())) {
            return SzShapeItem.constructorCache.get(definition.getHash());
        }
        super(null);
        this.definition = definition;
        this.definition.getHash();
        SzShapeItem.constructorCache.set(definition.getHash(), this);
    }
    static constructorCache = new Map();
    static getSchema() {
        return types.string;
    }
    getItemType() {
        return 'shape';
    }
    equals(other) {
        return other.getItemType() == this.getItemType() && other.definition == this.definition;
    }
    drawItemCenteredClipped(x, y, parameters, diameter) {
        if (!parameters.visibleRect.containsCircle(x, y, diameter / 2))
            return;
        if (!diameter)
            throw new Error();
        this.drawItemCenteredImpl(x, y, parameters, diameter);
    }
    getBackgroundColorAsResource() {
        return THEME.map.resources.shape;
    }
    static deserialize(data) {
        // debugger;
        console.log('deserialize', data);
        if (data.length < 4)
            debugger;
        // this.definition = SzDefinition.fromShortKey(data);
        return new SzShapeItem(new SzDefinition(data));
    }
    serialize() {
        let h = this.definition.getHash();
        if (h.length < 4)
            debugger;
        // console.log('serialize', h);
        return h;
    }
    // deserialize(data: any, root?: GameRoot): string | void {
    // 	throw new Error("Method not implemented.");
    // }
    getAsCopyableKey() {
        throw new Error("Method not implemented.");
    }
    equalsImpl(other) {
        throw new Error("Method not implemented.");
    }
    drawFullSizeOnCanvas(context, size) {
        this.definition.drawFullSizeOnCanvas(context, size);
    }
    drawItemCenteredImpl(x, y, parameters, diameter) {
        this.definition.drawCentered(x, y, parameters, diameter);
    }
    static install(mod) {
        mod.modInterface.extendClass(ShapeDefinitionManager, ({ $old }) => ({
            getShapeItemFromDefinition(definition) {
                if (!(definition instanceof SzDefinition)) {
                    return $old.getShapeItemFromDefinition.call(this, definition);
                }
                return this.shapeKeyToItem[definition.getHash()] ??= new SzShapeItem(definition);
            }
        }));
        mod.modInterface.registerItem(SzShapeItem, data => SzShapeItem.deserialize(data));
    }
}
