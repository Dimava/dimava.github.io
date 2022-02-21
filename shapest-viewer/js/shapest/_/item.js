// import { globalConfig } from "shapez/core/config";
// import { smoothenDpi } from "shapez/core/dpi_manager";
// import { DrawParameters } from "shapez/core/draw_utils";
// import { ShapeItem } from "shapez/game/items/shape_item";
// import { THEME } from "shapez/game/theme";
// import { types } from "shapez/savegame/serialization";
// import { ShapestDefinition } from "./definition";
// import { ShapestLayer } from "./layers/layer";
// import { Pi2, shapeHash } from "./types";
import { ShapeItem } from "shapez/game/items/shape_item";
import { types } from "shapez/savegame/serialization";
import { SzDefinition } from "./definition";
export class SzItem extends ShapeItem {
    static getId() {
        return 'szItem';
    }
    // @ts-ignore
    definition;
    constructor(definition) {
        super(null);
        this.definition = definition;
        this.definition.getHash();
    }
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
        throw new Error("Method not implemented.");
    }
    static deserialize(data) {
        console.log('deserialize', data);
        return new SzItem(new SzDefinition(JSON.parse(data)));
    }
    serialize() {
        return JSON.stringify(this.definition);
        // debugger;
        return this.definition.serialize();
        throw new Error("Method not implemented.");
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
        throw new Error("Method not implemented.");
    }
    drawItemCenteredImpl(x, y, parameters, diameter) {
        this.definition.drawCentered(x, y, parameters, diameter);
    }
}
// export class ShapestItem extends ShapeItem {
// 	static getId() {
// 		return "shapest";
// 	}
// 	static getSchema() {
// 		return types.string;
// 	}
// 	static isValidShortKey(hash: shapeHash) {
// 		return hash.split(':').every(e => ShapestLayer.isValidKey(e));
// 	}
// 	static fromShortKey(hash: shapeHash) {
// 		return new ShapestItem(hash);
// 	}
// 	hash: shapeHash;
// 	constructor(hash: shapeHash) {
// 		super(null as any);
// 		this.hash = hash;
// 	}
// 	serialize() { return this.hash; }
// 	deserialize(data: string) { this.hash = data; }
// 	// @ts-ignore
// 	get definition() {
// 		return new ShapestDefinition(this.hash);
// 	}
// 	set definition(d: any) { }
// 	drawItemCenteredImpl(x: number, y: number, parameters: DrawParameters, diameter: number) {
// 		this.drawCentered(x, y, parameters, diameter);
// 	}
// 	/**
// 	 * Draws the shape definition
// 	 */
// 	drawCentered(x: number, y: number, parameters: DrawParameters, diameter = 20) {
// 		const dpi = smoothenDpi(globalConfig.shapesSharpness * parameters.zoomLevel);
// 		const key = diameter + "/" + dpi + "/" + this.hash;
// 		const canvas = parameters.root.buffers.getForKey({
// 			key: "shapedef",
// 			subKey: key,
// 			w: diameter,
// 			h: diameter,
// 			dpi,
// 			redrawMethod: this.internalGenerateShapeBuffer.bind(this),
// 		});
// 		parameters.context.drawImage(canvas, x - diameter / 2, y - diameter / 2, diameter, diameter);
// 	}
// 	getItemType() { return "shape" as const; }
// 	getAsCopyableKey(): string { return this.hash; }
// 	getHash(): string { return this.hash; }
// 	equalsImpl(other: ShapestItem) { return this.hash == other.hash; }
// 	getBackgroundColorAsResource() {
// 		return THEME.map.resources.shape;
// 	}
// 	/** Draws the item to a canvas */
// 	drawFullSizeOnCanvas(context: CanvasRenderingContext2D, size: number) {
// 		this.internalGenerateShapeBuffer(null, context, size, size, 1);
// 	}
// 	// /**
// 	//  * @param {number} x
// 	//  * @param {number} y
// 	//  * @param {DrawParameters} parameters
// 	//  * @param {number=} diameter
// 	//  */
// 	// drawItemCenteredImpl(x, y, parameters, diameter = globalConfig.defaultItemDiameter) {
// 	//     this.drawCentered(x, y, parameters, diameter);
// 	// }
// 	// /**
// 	//  * Draws the shape definition
// 	//  * @param {number} x
// 	//  * @param {number} y
// 	//  * @param {DrawParameters} parameters
// 	//  * @param {number=} diameter
// 	//  */
// 	// drawCentered(x, y, parameters, diameter = 20) {
// 	//     const dpi = smoothenDpi(globalConfig.shapesSharpness * parameters.zoomLevel);
// 	//     const key = diameter + "/" + dpi + "/" + this.hash;
// 	//     const canvas = parameters.root.buffers.getForKey({
// 	//         key: "shapedef",
// 	//         subKey: key,
// 	//         w: diameter,
// 	//         h: diameter,
// 	//         dpi,
// 	//         redrawMethod: this.internalGenerateShapeBuffer.bind(this),
// 	//     });
// 	//     parameters.context.drawImage(canvas, x - diameter / 2, y - diameter / 2, diameter, diameter);
// 	// }
// 	internalGenerateShapeBuffer(canvas: HTMLCanvasElement | null, context: CanvasRenderingContext2D, w: number, h: number, dpi: number) {
// 		context.translate((w * dpi) / 2, (h * dpi) / 2);
// 		context.scale((dpi * w) / 2.3, (dpi * h) / 2.3);
// 		context.fillStyle = "#e9ecf7";
// 		context.fillStyle = THEME.items.circleBackground;
// 		context.beginPath();
// 		context.arc(0, 0, 1.15, 0, Pi2);
// 		context.fill();
// 		for (let layer of this.layers) {
// 			context.save();
// 			context.strokeStyle = THEME.items.outline;
// 			context.lineWidth = THEME.items.outlineWidth / 10;
// 			context.miterLimit = 2;
// 			context.textAlign = "center";
// 			context.textBaseline = "middle";
// 			layer.draw(context)
// 			context.restore();
// 		}
// 	}
// 	// /**
// 	//  * Generates this shape as a canvas
// 	//  * @param {number} size
// 	//  */
// 	// generateAsCanvas(size = 120) {
// 	//     const [canvas, context] = makeOffscreenBuffer(size, size, {
// 	//         smooth: true,
// 	//         label: "definition-canvas-cache-" + this.getHash(),
// 	//         reusable: false,
// 	//     });
// 	//     this.internalGenerateShapeBuffer(canvas, context, size, size, 1);
// 	//     return canvas;
// 	// }
// 	// /**
// 	//  * @returns {ShapestItemDefinition}
// 	//  */
// 	// get do() {
// 	//     return new ShapestItemDefinition(this);
// 	// }
// 	// /**
// 	//  * @returns {ShapestItemDefinition}
// 	//  */
// 	// get definition() {
// 	//     return new ShapestItemDefinition(this);
// 	// }
// 	// set definition(v) { }
// 	get layers() {
// 		return this.hash.split(':').map((e, i) => ShapestLayer.fromShape(this.hash, i));
// 	}
// 	// cloneRotateCW
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zaGFwZXN0L18vaXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxREFBcUQ7QUFDckQseURBQXlEO0FBQ3pELDJEQUEyRDtBQUMzRCw0REFBNEQ7QUFDNUQsNkNBQTZDO0FBQzdDLHlEQUF5RDtBQUN6RCxvREFBb0Q7QUFDcEQsaURBQWlEO0FBQ2pELDRDQUE0QztBQUk1QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFHekQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFJNUMsTUFBTSxPQUFPLE1BQU8sU0FBUSxTQUFTO0lBQ3BDLE1BQU0sQ0FBQyxLQUFLO1FBQ1gsT0FBTyxRQUFRLENBQUM7SUFDakIsQ0FBQztJQUNELGFBQWE7SUFDYixVQUFVLENBQWdCO0lBQzFCLFlBQVksVUFBd0I7UUFDbkMsS0FBSyxDQUFDLElBQVcsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxTQUFTO1FBQ1QsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3hCLENBQUM7SUFDSixXQUFXO1FBQ1YsT0FBTyxPQUFPLENBQUM7SUFDaEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFlO1FBQ3JCLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSyxLQUFnQixDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3JHLENBQUM7SUFDRCx1QkFBdUIsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLFVBQTBCLEVBQUUsUUFBaUI7UUFDMUYs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cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHsgZ2xvYmFsQ29uZmlnIH0gZnJvbSBcInNoYXBlei9jb3JlL2NvbmZpZ1wiO1xyXG4vLyBpbXBvcnQgeyBzbW9vdGhlbkRwaSB9IGZyb20gXCJzaGFwZXovY29yZS9kcGlfbWFuYWdlclwiO1xyXG4vLyBpbXBvcnQgeyBEcmF3UGFyYW1ldGVycyB9IGZyb20gXCJzaGFwZXovY29yZS9kcmF3X3V0aWxzXCI7XHJcbi8vIGltcG9ydCB7IFNoYXBlSXRlbSB9IGZyb20gXCJzaGFwZXovZ2FtZS9pdGVtcy9zaGFwZV9pdGVtXCI7XHJcbi8vIGltcG9ydCB7IFRIRU1FIH0gZnJvbSBcInNoYXBlei9nYW1lL3RoZW1lXCI7XHJcbi8vIGltcG9ydCB7IHR5cGVzIH0gZnJvbSBcInNoYXBlei9zYXZlZ2FtZS9zZXJpYWxpemF0aW9uXCI7XHJcbi8vIGltcG9ydCB7IFNoYXBlc3REZWZpbml0aW9uIH0gZnJvbSBcIi4vZGVmaW5pdGlvblwiO1xyXG4vLyBpbXBvcnQgeyBTaGFwZXN0TGF5ZXIgfSBmcm9tIFwiLi9sYXllcnMvbGF5ZXJcIjtcclxuLy8gaW1wb3J0IHsgUGkyLCBzaGFwZUhhc2ggfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5cclxuaW1wb3J0IHsgRHJhd1BhcmFtZXRlcnMgfSBmcm9tIFwic2hhcGV6L2NvcmUvZHJhd19wYXJhbWV0ZXJzXCI7XHJcbmltcG9ydCB7IEJhc2VJdGVtIH0gZnJvbSBcInNoYXBlei9nYW1lL2Jhc2VfaXRlbVwiO1xyXG5pbXBvcnQgeyBTaGFwZUl0ZW0gfSBmcm9tIFwic2hhcGV6L2dhbWUvaXRlbXMvc2hhcGVfaXRlbVwiO1xyXG5pbXBvcnQgeyBHYW1lUm9vdCB9IGZyb20gXCJzaGFwZXovZ2FtZS9yb290XCI7XHJcbmltcG9ydCB7IFNoYXBlRGVmaW5pdGlvbiB9IGZyb20gXCJzaGFwZXovZ2FtZS9zaGFwZV9kZWZpbml0aW9uXCI7XHJcbmltcG9ydCB7IHR5cGVzIH0gZnJvbSBcInNoYXBlei9zYXZlZ2FtZS9zZXJpYWxpemF0aW9uXCI7XHJcbmltcG9ydCB7IFN6RGVmaW5pdGlvbiB9IGZyb20gXCIuL2RlZmluaXRpb25cIjtcclxuaW1wb3J0IHsgU3pMYXllciB9IGZyb20gXCIuL2xheWVyXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFN6SXRlbSBleHRlbmRzIFNoYXBlSXRlbSBpbXBsZW1lbnRzIFNoYXBlSXRlbSB7XHJcblx0c3RhdGljIGdldElkKCkge1xyXG5cdFx0cmV0dXJuICdzekl0ZW0nO1xyXG5cdH1cclxuXHQvLyBAdHMtaWdub3JlXHJcblx0ZGVmaW5pdGlvbiE6IFN6RGVmaW5pdGlvbjtcclxuXHRjb25zdHJ1Y3RvcihkZWZpbml0aW9uOiBTekRlZmluaXRpb24pIHtcclxuXHRcdHN1cGVyKG51bGwgYXMgYW55KTtcclxuXHRcdHRoaXMuZGVmaW5pdGlvbiA9IGRlZmluaXRpb247XHJcblx0XHR0aGlzLmRlZmluaXRpb24uZ2V0SGFzaCgpO1xyXG5cdH1cclxuXHRzdGF0aWMgZ2V0U2NoZW1hKCkge1xyXG4gICAgICAgIHJldHVybiB0eXBlcy5zdHJpbmc7XHJcbiAgICB9XHJcblx0Z2V0SXRlbVR5cGUoKSB7XHJcblx0XHRyZXR1cm4gJ3NoYXBlJztcclxuXHR9XHJcblx0ZXF1YWxzKG90aGVyOiBCYXNlSXRlbSk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIG90aGVyLmdldEl0ZW1UeXBlKCkgPT0gdGhpcy5nZXRJdGVtVHlwZSgpICYmIChvdGhlciBhcyBTekl0ZW0pLmRlZmluaXRpb24gPT0gdGhpcy5kZWZpbml0aW9uO1xyXG5cdH1cclxuXHRkcmF3SXRlbUNlbnRlcmVkQ2xpcHBlZCh4OiBudW1iZXIsIHk6IG51bWJlciwgcGFyYW1ldGVyczogRHJhd1BhcmFtZXRlcnMsIGRpYW1ldGVyPzogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRpZiAoIXBhcmFtZXRlcnMudmlzaWJsZVJlY3QuY29udGFpbnNDaXJjbGUoeCwgeSwgZGlhbWV0ZXIhIC8gMikpIHJldHVybjtcclxuXHRcdGlmICghZGlhbWV0ZXIpIHRocm93IG5ldyBFcnJvcigpO1xyXG5cdFx0dGhpcy5kcmF3SXRlbUNlbnRlcmVkSW1wbCh4LCB5LCBwYXJhbWV0ZXJzLCBkaWFtZXRlcik7XHJcblx0fVxyXG5cdGdldEJhY2tncm91bmRDb2xvckFzUmVzb3VyY2UoKTogc3RyaW5nIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xyXG5cdH1cclxuXHJcblxyXG5cdHN0YXRpYyBkZXNlcmlhbGl6ZShkYXRhOiBhbnkpOiBTekl0ZW0ge1xyXG5cdFx0Y29uc29sZS5sb2coJ2Rlc2VyaWFsaXplJywgZGF0YSk7XHJcblx0XHRyZXR1cm4gbmV3IFN6SXRlbShcclxuXHRcdFx0bmV3IFN6RGVmaW5pdGlvbihcclxuXHRcdFx0XHRKU09OLnBhcnNlKGRhdGEpLFxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH1cclxuXHRzZXJpYWxpemUoKTogc3RyaW5nIHwgbnVtYmVyIHwgb2JqZWN0IHtcclxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmRlZmluaXRpb24pO1xyXG5cdFx0Ly8gZGVidWdnZXI7XHJcblx0XHRyZXR1cm4gdGhpcy5kZWZpbml0aW9uLnNlcmlhbGl6ZSgpO1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XHJcblx0fVxyXG5cdC8vIGRlc2VyaWFsaXplKGRhdGE6IGFueSwgcm9vdD86IEdhbWVSb290KTogc3RyaW5nIHwgdm9pZCB7XHJcblx0Ly8gXHR0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcclxuXHQvLyB9XHJcblxyXG5cclxuXHRnZXRBc0NvcHlhYmxlS2V5KCk6IHN0cmluZyB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcclxuXHR9XHJcblx0ZXF1YWxzSW1wbChvdGhlcjogQmFzZUl0ZW0pOiBib29sZWFuIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xyXG5cdH1cclxuXHRkcmF3RnVsbFNpemVPbkNhbnZhcyhjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XHJcblx0fVxyXG5cdGRyYXdJdGVtQ2VudGVyZWRJbXBsKHg6IG51bWJlciwgeTogbnVtYmVyLCBwYXJhbWV0ZXJzOiBEcmF3UGFyYW1ldGVycywgZGlhbWV0ZXI6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0dGhpcy5kZWZpbml0aW9uLmRyYXdDZW50ZXJlZCh4LCB5LCBwYXJhbWV0ZXJzLCBkaWFtZXRlcik7XHJcblx0fVxyXG5cclxufVxyXG5cclxuXHJcbi8vIGV4cG9ydCBjbGFzcyBTaGFwZXN0SXRlbSBleHRlbmRzIFNoYXBlSXRlbSB7XHJcbi8vIFx0c3RhdGljIGdldElkKCkge1xyXG4vLyBcdFx0cmV0dXJuIFwic2hhcGVzdFwiO1xyXG4vLyBcdH1cclxuLy8gXHRzdGF0aWMgZ2V0U2NoZW1hKCkge1xyXG4vLyBcdFx0cmV0dXJuIHR5cGVzLnN0cmluZztcclxuLy8gXHR9XHJcbi8vIFx0c3RhdGljIGlzVmFsaWRTaG9ydEtleShoYXNoOiBzaGFwZUhhc2gpIHtcclxuLy8gXHRcdHJldHVybiBoYXNoLnNwbGl0KCc6JykuZXZlcnkoZSA9PiBTaGFwZXN0TGF5ZXIuaXNWYWxpZEtleShlKSk7XHJcbi8vIFx0fVxyXG4vLyBcdHN0YXRpYyBmcm9tU2hvcnRLZXkoaGFzaDogc2hhcGVIYXNoKSB7XHJcbi8vIFx0XHRyZXR1cm4gbmV3IFNoYXBlc3RJdGVtKGhhc2gpO1xyXG4vLyBcdH1cclxuLy8gXHRoYXNoOiBzaGFwZUhhc2g7XHJcbi8vIFx0Y29uc3RydWN0b3IoaGFzaDogc2hhcGVIYXNoKSB7XHJcbi8vIFx0XHRzdXBlcihudWxsIGFzIGFueSk7XHJcbi8vIFx0XHR0aGlzLmhhc2ggPSBoYXNoO1xyXG4vLyBcdH1cclxuLy8gXHRzZXJpYWxpemUoKSB7IHJldHVybiB0aGlzLmhhc2g7IH1cclxuLy8gXHRkZXNlcmlhbGl6ZShkYXRhOiBzdHJpbmcpIHsgdGhpcy5oYXNoID0gZGF0YTsgfVxyXG4vLyBcdC8vIEB0cy1pZ25vcmVcclxuLy8gXHRnZXQgZGVmaW5pdGlvbigpIHtcclxuLy8gXHRcdHJldHVybiBuZXcgU2hhcGVzdERlZmluaXRpb24odGhpcy5oYXNoKTtcclxuLy8gXHR9XHJcbi8vIFx0c2V0IGRlZmluaXRpb24oZDogYW55KSB7IH1cclxuXHJcbi8vIFx0ZHJhd0l0ZW1DZW50ZXJlZEltcGwoeDogbnVtYmVyLCB5OiBudW1iZXIsIHBhcmFtZXRlcnM6IERyYXdQYXJhbWV0ZXJzLCBkaWFtZXRlcjogbnVtYmVyKSB7XHJcbi8vIFx0XHR0aGlzLmRyYXdDZW50ZXJlZCh4LCB5LCBwYXJhbWV0ZXJzLCBkaWFtZXRlcik7XHJcbi8vIFx0fVxyXG5cclxuLy8gXHQvKipcclxuLy8gXHQgKiBEcmF3cyB0aGUgc2hhcGUgZGVmaW5pdGlvblxyXG4vLyBcdCAqL1xyXG4vLyBcdGRyYXdDZW50ZXJlZCh4OiBudW1iZXIsIHk6IG51bWJlciwgcGFyYW1ldGVyczogRHJhd1BhcmFtZXRlcnMsIGRpYW1ldGVyID0gMjApIHtcclxuLy8gXHRcdGNvbnN0IGRwaSA9IHNtb290aGVuRHBpKGdsb2JhbENvbmZpZy5zaGFwZXNTaGFycG5lc3MgKiBwYXJhbWV0ZXJzLnpvb21MZXZlbCk7XHJcbi8vIFx0XHRjb25zdCBrZXkgPSBkaWFtZXRlciArIFwiL1wiICsgZHBpICsgXCIvXCIgKyB0aGlzLmhhc2g7XHJcbi8vIFx0XHRjb25zdCBjYW52YXMgPSBwYXJhbWV0ZXJzLnJvb3QuYnVmZmVycy5nZXRGb3JLZXkoe1xyXG4vLyBcdFx0XHRrZXk6IFwic2hhcGVkZWZcIixcclxuLy8gXHRcdFx0c3ViS2V5OiBrZXksXHJcbi8vIFx0XHRcdHc6IGRpYW1ldGVyLFxyXG4vLyBcdFx0XHRoOiBkaWFtZXRlcixcclxuLy8gXHRcdFx0ZHBpLFxyXG4vLyBcdFx0XHRyZWRyYXdNZXRob2Q6IHRoaXMuaW50ZXJuYWxHZW5lcmF0ZVNoYXBlQnVmZmVyLmJpbmQodGhpcyksXHJcbi8vIFx0XHR9KTtcclxuLy8gXHRcdHBhcmFtZXRlcnMuY29udGV4dC5kcmF3SW1hZ2UoY2FudmFzLCB4IC0gZGlhbWV0ZXIgLyAyLCB5IC0gZGlhbWV0ZXIgLyAyLCBkaWFtZXRlciwgZGlhbWV0ZXIpO1xyXG4vLyBcdH1cclxuXHJcblxyXG5cclxuLy8gXHRnZXRJdGVtVHlwZSgpIHsgcmV0dXJuIFwic2hhcGVcIiBhcyBjb25zdDsgfVxyXG4vLyBcdGdldEFzQ29weWFibGVLZXkoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaGFzaDsgfVxyXG4vLyBcdGdldEhhc2goKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaGFzaDsgfVxyXG4vLyBcdGVxdWFsc0ltcGwob3RoZXI6IFNoYXBlc3RJdGVtKSB7IHJldHVybiB0aGlzLmhhc2ggPT0gb3RoZXIuaGFzaDsgfVxyXG4vLyBcdGdldEJhY2tncm91bmRDb2xvckFzUmVzb3VyY2UoKSB7XHJcbi8vIFx0XHRyZXR1cm4gVEhFTUUubWFwLnJlc291cmNlcy5zaGFwZTtcclxuLy8gXHR9XHJcblxyXG4vLyBcdC8qKiBEcmF3cyB0aGUgaXRlbSB0byBhIGNhbnZhcyAqL1xyXG4vLyBcdGRyYXdGdWxsU2l6ZU9uQ2FudmFzKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgc2l6ZTogbnVtYmVyKSB7XHJcbi8vIFx0XHR0aGlzLmludGVybmFsR2VuZXJhdGVTaGFwZUJ1ZmZlcihudWxsLCBjb250ZXh0LCBzaXplLCBzaXplLCAxKTtcclxuLy8gXHR9XHJcblxyXG4vLyBcdC8vIC8qKlxyXG4vLyBcdC8vICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbi8vIFx0Ly8gICogQHBhcmFtIHtudW1iZXJ9IHlcclxuLy8gXHQvLyAgKiBAcGFyYW0ge0RyYXdQYXJhbWV0ZXJzfSBwYXJhbWV0ZXJzXHJcbi8vIFx0Ly8gICogQHBhcmFtIHtudW1iZXI9fSBkaWFtZXRlclxyXG4vLyBcdC8vICAqL1xyXG4vLyBcdC8vIGRyYXdJdGVtQ2VudGVyZWRJbXBsKHgsIHksIHBhcmFtZXRlcnMsIGRpYW1ldGVyID0gZ2xvYmFsQ29uZmlnLmRlZmF1bHRJdGVtRGlhbWV0ZXIpIHtcclxuLy8gXHQvLyAgICAgdGhpcy5kcmF3Q2VudGVyZWQoeCwgeSwgcGFyYW1ldGVycywgZGlhbWV0ZXIpO1xyXG4vLyBcdC8vIH1cclxuXHJcbi8vIFx0Ly8gLyoqXHJcbi8vIFx0Ly8gICogRHJhd3MgdGhlIHNoYXBlIGRlZmluaXRpb25cclxuLy8gXHQvLyAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4vLyBcdC8vICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbi8vIFx0Ly8gICogQHBhcmFtIHtEcmF3UGFyYW1ldGVyc30gcGFyYW1ldGVyc1xyXG4vLyBcdC8vICAqIEBwYXJhbSB7bnVtYmVyPX0gZGlhbWV0ZXJcclxuLy8gXHQvLyAgKi9cclxuLy8gXHQvLyBkcmF3Q2VudGVyZWQoeCwgeSwgcGFyYW1ldGVycywgZGlhbWV0ZXIgPSAyMCkge1xyXG4vLyBcdC8vICAgICBjb25zdCBkcGkgPSBzbW9vdGhlbkRwaShnbG9iYWxDb25maWcuc2hhcGVzU2hhcnBuZXNzICogcGFyYW1ldGVycy56b29tTGV2ZWwpO1xyXG4vLyBcdC8vICAgICBjb25zdCBrZXkgPSBkaWFtZXRlciArIFwiL1wiICsgZHBpICsgXCIvXCIgKyB0aGlzLmhhc2g7XHJcbi8vIFx0Ly8gICAgIGNvbnN0IGNhbnZhcyA9IHBhcmFtZXRlcnMucm9vdC5idWZmZXJzLmdldEZvcktleSh7XHJcbi8vIFx0Ly8gICAgICAgICBrZXk6IFwic2hhcGVkZWZcIixcclxuLy8gXHQvLyAgICAgICAgIHN1YktleToga2V5LFxyXG4vLyBcdC8vICAgICAgICAgdzogZGlhbWV0ZXIsXHJcbi8vIFx0Ly8gICAgICAgICBoOiBkaWFtZXRlcixcclxuLy8gXHQvLyAgICAgICAgIGRwaSxcclxuLy8gXHQvLyAgICAgICAgIHJlZHJhd01ldGhvZDogdGhpcy5pbnRlcm5hbEdlbmVyYXRlU2hhcGVCdWZmZXIuYmluZCh0aGlzKSxcclxuLy8gXHQvLyAgICAgfSk7XHJcbi8vIFx0Ly8gICAgIHBhcmFtZXRlcnMuY29udGV4dC5kcmF3SW1hZ2UoY2FudmFzLCB4IC0gZGlhbWV0ZXIgLyAyLCB5IC0gZGlhbWV0ZXIgLyAyLCBkaWFtZXRlciwgZGlhbWV0ZXIpO1xyXG4vLyBcdC8vIH1cclxuXHJcblxyXG4vLyBcdGludGVybmFsR2VuZXJhdGVTaGFwZUJ1ZmZlcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCwgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCB3OiBudW1iZXIsIGg6IG51bWJlciwgZHBpOiBudW1iZXIpIHtcclxuLy8gXHRcdGNvbnRleHQudHJhbnNsYXRlKCh3ICogZHBpKSAvIDIsIChoICogZHBpKSAvIDIpO1xyXG4vLyBcdFx0Y29udGV4dC5zY2FsZSgoZHBpICogdykgLyAyLjMsIChkcGkgKiBoKSAvIDIuMyk7XHJcblxyXG4vLyBcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBcIiNlOWVjZjdcIjtcclxuXHJcbi8vIFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IFRIRU1FLml0ZW1zLmNpcmNsZUJhY2tncm91bmQ7XHJcbi8vIFx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4vLyBcdFx0Y29udGV4dC5hcmMoMCwgMCwgMS4xNSwgMCwgUGkyKTtcclxuLy8gXHRcdGNvbnRleHQuZmlsbCgpO1xyXG5cclxuLy8gXHRcdGZvciAobGV0IGxheWVyIG9mIHRoaXMubGF5ZXJzKSB7XHJcbi8vIFx0XHRcdGNvbnRleHQuc2F2ZSgpO1xyXG5cclxuLy8gXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9IFRIRU1FLml0ZW1zLm91dGxpbmU7XHJcbi8vIFx0XHRcdGNvbnRleHQubGluZVdpZHRoID0gVEhFTUUuaXRlbXMub3V0bGluZVdpZHRoIC8gMTA7XHJcbi8vIFx0XHRcdGNvbnRleHQubWl0ZXJMaW1pdCA9IDI7XHJcbi8vIFx0XHRcdGNvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuLy8gXHRcdFx0Y29udGV4dC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG5cclxuLy8gXHRcdFx0bGF5ZXIuZHJhdyhjb250ZXh0KVxyXG5cclxuLy8gXHRcdFx0Y29udGV4dC5yZXN0b3JlKCk7XHJcbi8vIFx0XHR9XHJcbi8vIFx0fVxyXG5cclxuLy8gXHQvLyAvKipcclxuLy8gXHQvLyAgKiBHZW5lcmF0ZXMgdGhpcyBzaGFwZSBhcyBhIGNhbnZhc1xyXG4vLyBcdC8vICAqIEBwYXJhbSB7bnVtYmVyfSBzaXplXHJcbi8vIFx0Ly8gICovXHJcbi8vIFx0Ly8gZ2VuZXJhdGVBc0NhbnZhcyhzaXplID0gMTIwKSB7XHJcbi8vIFx0Ly8gICAgIGNvbnN0IFtjYW52YXMsIGNvbnRleHRdID0gbWFrZU9mZnNjcmVlbkJ1ZmZlcihzaXplLCBzaXplLCB7XHJcbi8vIFx0Ly8gICAgICAgICBzbW9vdGg6IHRydWUsXHJcbi8vIFx0Ly8gICAgICAgICBsYWJlbDogXCJkZWZpbml0aW9uLWNhbnZhcy1jYWNoZS1cIiArIHRoaXMuZ2V0SGFzaCgpLFxyXG4vLyBcdC8vICAgICAgICAgcmV1c2FibGU6IGZhbHNlLFxyXG4vLyBcdC8vICAgICB9KTtcclxuXHJcbi8vIFx0Ly8gICAgIHRoaXMuaW50ZXJuYWxHZW5lcmF0ZVNoYXBlQnVmZmVyKGNhbnZhcywgY29udGV4dCwgc2l6ZSwgc2l6ZSwgMSk7XHJcbi8vIFx0Ly8gICAgIHJldHVybiBjYW52YXM7XHJcbi8vIFx0Ly8gfVxyXG5cclxuLy8gXHQvLyAvKipcclxuLy8gXHQvLyAgKiBAcmV0dXJucyB7U2hhcGVzdEl0ZW1EZWZpbml0aW9ufVxyXG4vLyBcdC8vICAqL1xyXG4vLyBcdC8vIGdldCBkbygpIHtcclxuLy8gXHQvLyAgICAgcmV0dXJuIG5ldyBTaGFwZXN0SXRlbURlZmluaXRpb24odGhpcyk7XHJcbi8vIFx0Ly8gfVxyXG4vLyBcdC8vIC8qKlxyXG4vLyBcdC8vICAqIEByZXR1cm5zIHtTaGFwZXN0SXRlbURlZmluaXRpb259XHJcbi8vIFx0Ly8gICovXHJcbi8vIFx0Ly8gZ2V0IGRlZmluaXRpb24oKSB7XHJcbi8vIFx0Ly8gICAgIHJldHVybiBuZXcgU2hhcGVzdEl0ZW1EZWZpbml0aW9uKHRoaXMpO1xyXG4vLyBcdC8vIH1cclxuLy8gXHQvLyBzZXQgZGVmaW5pdGlvbih2KSB7IH1cclxuXHJcblxyXG4vLyBcdGdldCBsYXllcnMoKSB7XHJcbi8vIFx0XHRyZXR1cm4gdGhpcy5oYXNoLnNwbGl0KCc6JykubWFwKChlLCBpKSA9PiBTaGFwZXN0TGF5ZXIuZnJvbVNoYXBlKHRoaXMuaGFzaCwgaSkpO1xyXG4vLyBcdH1cclxuXHJcbi8vIFx0Ly8gY2xvbmVSb3RhdGVDV1xyXG4vLyB9Il19