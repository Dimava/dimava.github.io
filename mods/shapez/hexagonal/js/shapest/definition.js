import { makeOffscreenBuffer } from "shapez/core/buffer_utils";
import { globalConfig } from "shapez/core/config";
import { smoothenDpi } from "shapez/core/dpi_manager";
import { enumShortcodeToColor } from "shapez/game/colors";
import { COLOR_ITEM_SINGLETONS } from "shapez/game/items/color_item";
import { ShapeDefinition } from "shapez/game/shape_definition";
import { LogicGateSystem } from "shapez/game/systems/logic_gate";
import { THEME } from "shapez/game/theme";
import { BasicSerializableObject, types } from "shapez/savegame/serialization";
import { SzInfo, SzLayer } from "./layer";
import { SzContext2D } from "./SzContext2D";
export class SzDefinition extends BasicSerializableObject {
    static getId() {
        return "sz-definition";
    }
    static createTest() {
        return new SzDefinition({
            layers: [SzLayer.createTest()],
        });
    }
    constructor(data, clone = false) {
        super();
        if (typeof data == 'string')
            return SzDefinition.fromShortKey(data);
        if (data?.layers)
            this.layers = data.layers.map((e, i) => new SzLayer(e, i));
        if (!this.layers.every(e => e.isNormalized())) {
            this.layers = SzDefinition.createTest().layers;
        }
        // console.log(this.getHash())
        if (clone)
            return;
        if (SzDefinition.definitionCache.has(this.getHash())) {
            return SzDefinition.definitionCache.get(this.getHash());
        }
        console.log(this.getHash());
    }
    layers = [];
    cachedHash = '';
    bufferGenerator;
    getClonedLayers() {
        throw new Error("Method not implemented.");
    }
    isEntirelyEmpty() {
        return this.layers.every(e => e.isEmpty());
    }
    getHash() {
        if (this.cachedHash)
            return this.cachedHash;
        if (!this.layers.length)
            debugger;
        return this.cachedHash = this.layers.map(e => e.getHash()).join(':');
    }
    drawFullSizeOnCanvas(context, size) {
        this.internalGenerateShapeBuffer(null, context, size, size, 1);
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
    cloneFilteredByQuadrants(includeQuadrants) {
        let layers = this.layers.map(e => e.cloneFilteredByQuadrants(includeQuadrants)).filter(e => !e.isEmpty());
        return new SzDefinition({ layers });
    }
    cloneRotateCW() {
        return new SzDefinition({
            layers: this.layers.map(l => l.clone().rotate(4))
        });
    }
    cloneRotate24(n) {
        return new SzDefinition({
            layers: this.layers.map(l => l.clone().rotate(n))
        });
    }
    cloneRotateCCW() {
        return new SzDefinition({
            layers: this.layers.map(l => l.clone().rotate(24 - 4))
        });
    }
    cloneRotate180() {
        return new SzDefinition({
            layers: this.layers.map(l => l.clone().rotate(12))
        });
    }
    cloneAndStackWith(upper) {
        let bottom = this.clone(e => e.removeCover()).layers;
        let top = upper.clone().layers;
        let dh = 0;
        while (!bottom.every((l, i) => {
            return l.canStackWith(top[i - dh]);
        }))
            dh++;
        let overlap = bottom.length - dh;
        let newLayers = bottom.map((l, i) => {
            return l.stackWith(top[i + dh]);
        }).concat(top.slice(overlap));
        return new SzDefinition({ layers: newLayers.slice(0, 4) });
    }
    cloneAndPaintWith(color) {
        let rawPaints = Array(24).fill(color);
        if (color == 'purple')
            color = 'pink';
        return this.clone((l, i, a) => l.clone().paint(color));
        // return this.clone((l, i, a) => {
        // 	let paints = a.slice(i).reduceRight((v, e) => e.filterPaint(v), rawPaints);
        // 	return l.removeCover().paint(paints);
        // });
    }
    cloneAndPaintWith4Colors(colors) {
        throw new Error("Method not implemented.");
    }
    cloneAndMakeCover() {
        return new SzDefinition({ layers: this.layers.map(e => e.cloneAsCover()) });
    }
    clone(layerMapper) {
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
    deserialize(data, root) {
        console.log('deser', this);
    }
    // inherited
    drawCentered(x, y, parameters, diameter) {
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
    internalGenerateShapeBuffer(canvas, ctx, w, h, dpi) {
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
    static rawHashMap = new Map();
    static getHashfromRawHash(hash) {
        if (!this.rawHashMap.has(hash)) {
            this.rawHashMap.set(hash, SzDefinition.fromShortKey(hash).getHash());
        }
        return this.rawHashMap.get(hash);
    }
    static fromRawShape(shapeDefinition) {
        if (typeof shapeDefinition != 'string')
            shapeDefinition = shapeDefinition.getHash();
        return new SzDefinition({
            layers: shapeDefinition.split(':').map(e => SzLayer.fromShortKey(e))
        });
    }
    static definitionCache = new Map();
    static fromShortKey(key) {
        if (!this.definitionCache.has(key)) {
            this.definitionCache.set(key, new SzDefinition({
                layers: key.split(':').map(e => SzLayer.fromShortKey(e))
            }));
        }
        return this.definitionCache.get(key);
    }
    compute_ANALYZE(root) {
        let firstQuad = this.layers[0].quads[0];
        if (firstQuad.from != 0)
            return [null, null];
        let definition = new SzDefinition({ layers: [SzInfo.quad.exampleLayer(firstQuad.shape)] });
        // @ts-expect-error
        let color = enumShortcodeToColor[SzInfo.color.byName[firstQuad.color].code];
        return [
            COLOR_ITEM_SINGLETONS[color],
            root.shapeDefinitionMgr.getShapeItemFromDefinition(definition),
        ];
    }
    static install(mod) {
        mod.modInterface.extendObject(ShapeDefinition, ({ $old }) => ({
            fromShortKey(key) {
                return SzDefinition.fromShortKey(key);
            },
            isValidShortKey(key) {
                try {
                    SzDefinition.fromShortKey(key);
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
        }));
        mod.modInterface.extendClass(LogicGateSystem, ({ $old }) => ({
            compute_ANALYZE(parameters) {
                let item = parameters[0];
                if (!item || item.getItemType() !== "shape") {
                    // Not a shape
                    return [null, null];
                }
                let def = item.definition;
                if (def instanceof SzDefinition) {
                    return def.compute_ANALYZE(this.root);
                }
                return $old.compute_ANALYZE.call(this, parameters);
            }
        }));
    }
}
