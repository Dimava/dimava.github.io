import { globalConfig } from "shapez/core/config";
import { smoothenDpi } from "shapez/core/dpi_manager";
import { BaseItem } from "shapez/game/base_item";
import { enumColorToShortcode } from "shapez/game/colors";
import { THEME } from "shapez/game/theme";
import { types } from "shapez/savegame/serialization";
import { SzInfo } from "./layer";
import { SzContext2D } from "./SzContext2D";
const colorCharList = ['r', 'g', 'b', '-'];
const colorStringList = colorCharList.flatMap(a => colorCharList.flatMap(b => colorCharList.map(c => `${a}${b}${c}`)));
const colorStringEnum = Object.fromEntries(colorStringList.map(e => [e, e]));
export class SzColorItem extends BaseItem {
    color;
    static getId() {
        return "sz-color";
    }
    static getSchema() {
        return types.enum(colorStringEnum);
    }
    serialize() {
        return this.color;
    }
    deserialize(data) {
        this.color = data;
    }
    getItemType() {
        return "color";
    }
    getAsCopyableKey() {
        return this.color;
    }
    equalsImpl(other) {
        return this.color === other.color;
    }
    constructor(color) {
        super();
        this.color = color;
    }
    cachedSprite;
    getBackgroundColorAsResource() {
        return THEME.map.resources[SzInfo.color.byChar[this.color[0]].name];
    }
    drawFullSizeOnCanvas(context, size) {
        // if (!this.cachedSprite) {
        // 	this.cachedSprite = Loader.getSprite("sprites/colors/" + this.color + ".png");
        // }
        // this.cachedSprite.drawCentered(context, size / 2, size / 2, size);
    }
    drawItemCenteredImpl(x, y, parameters, diameter) {
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
        new SzContext2D(ctx).saved(ctx => {
            ctx.fillStyle = '#00000022';
            for (let c of this.color) {
                ctx.fillStyle = { r: 'red', g: 'green', b: 'blue', '-': '#eeeeee44' }[c];
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 0.05;
                ctx.beginPath().arc(0, 0.5, 0.3, 0, 24).fill().stroke();
                ctx.rotate(8);
            }
        });
    }
    static fromColor(color) {
        let c = enumColorToShortcode[color];
        return new SzColorItem(c + c + c);
    }
    splitColor() {
        let c = '-';
        let s = this.color.replace(/[^-]/, C => (c = C, '-'));
        const color = { r: 'red', g: 'green', b: 'blue', '-': '-' }[c];
        let item = s == '---' ? null : new SzColorItem(s);
        return [color, item];
    }
    fillFromColor(other) {
        let s1 = this.color, s2 = other.color;
        while (s1.includes('-') && s2 != '---') {
            let l1 = s1.lastIndexOf('-');
            let c = '-';
            s2 = s2.replace(/[^-]/, C => (c = C, '-'));
            s1 = s1.replace(/-(?!.*-)/, c);
        }
        return [new SzColorItem(s1), s2 == '---' ? null : new SzColorItem(s2)];
    }
    splitIntoColors() {
        const toc = (c) => SzInfo.color.byChar[c].name;
        let s = this.color.split('').filter(e => e != '-');
        if (s.length == 0)
            return ['grey', null];
        if (s.length == 1)
            return [toc(s[0]), null];
        if (s.length == 2)
            return [toc(s[0]), toc(s[1])];
        s = s.sort();
        let c = SzInfo.color.byCombo[s.sort().join('')].name;
        return [c, c];
    }
    static install(mod) {
        mod.modInterface.registerItem(SzColorItem, data => new SzColorItem(data));
    }
}
