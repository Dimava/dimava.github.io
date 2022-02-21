const config = {
    disableCuts: true,
    disableQuadColors: true,
    debugBadLayers: true,
};
export var SzInfo;
(function (SzInfo) {
    let color;
    (function (color_1) {
        const colorWheelNameList = [
            'red', 'orange', 'yellow',
            'lawngreen', 'green', 'cyan',
            'blue', 'purple', 'pink',
        ];
        const colorGreyNameList = [
            'black', 'grey', 'white',
        ];
        color_1.list = [
            { name: 'red', style: 'red', code: 'r', combo: 'rrr' },
            { name: 'orange', style: 'orange', code: 'o', combo: 'grr' },
            { name: 'yellow', style: 'yellow', code: 'y', combo: 'ggr' },
            { name: 'green', style: 'green', code: 'g', combo: 'ggg' },
            { name: 'lawngreen', style: 'lawngreen', code: 'l', combo: 'bgg' },
            { name: 'cyan', style: 'cyan', code: 'c', combo: 'bbg' },
            { name: 'blue', style: 'blue', code: 'b', combo: 'bbb' },
            { name: 'purple', style: 'purple', code: 'v', combo: 'bbr' },
            { name: 'pink', style: 'pink', code: 'p', combo: 'brr' },
            { name: 'black', style: 'black', code: 'k' },
            { name: 'grey', style: 'grey', code: 'u' },
            { name: 'white', style: 'white', code: 'w' },
            { name: 'cover', style: 'sz-cover', code: 'j' },
            { name: 'none', style: 'none', code: '-' },
        ];
        Object.assign(globalThis, { list: color_1.list });
        color_1.colorList = color_1.list.map(e => e.name);
        color_1.byName = Object.fromEntries(color_1.list.map(e => [e.name, e]));
        color_1.byChar = Object.fromEntries(color_1.list.map(e => [e.code, e]));
        color_1.byCombo = Object.fromEntries(color_1.list.filter(e => e.combo).map(e => [e.combo, e]));
        function exampleLayer(color) {
            let i = 0;
            return new SzLayer({
                quads: [
                    { shape: 'circle', from: i, to: i += 6, color },
                    { shape: 'square', from: i, to: i += 6, color },
                    { shape: 'circle', from: i, to: i += 6, color },
                    { shape: 'square', from: i, to: i += 6, color },
                ],
                areas: [
                    { shape: 'sector', from: 0, to: 24, color },
                ]
            });
        }
        color_1.exampleLayer = exampleLayer;
    })(color = SzInfo.color || (SzInfo.color = {}));
    let quad;
    (function (quad_1) {
        quad_1.list = [
            { name: 'circle', code: 'C' },
            { name: 'square', code: 'R' },
            { name: 'star', code: 'S' },
            {
                name: 'cover', code: 'J',
                path(ctx, { from, to }) {
                    ctx.arc(0, 0, 1.15, from, to);
                },
            },
        ];
        quad_1.byName = Object.fromEntries(quad_1.list.map(e => [e.name, e]));
        quad_1.byChar = Object.fromEntries(quad_1.list.map(e => [e.code, e]));
        function exampleLayer(shape) {
            let i = 0;
            return new SzLayer({
                quads: [
                    { shape, from: i, to: i += 6, color: 'grey' },
                    { shape, from: i, to: i += 6, color: 'grey' },
                    { shape, from: i, to: i += 6, color: 'grey' },
                    { shape, from: i, to: i += 6, color: 'grey' },
                ],
                areas: [
                    { shape: 'sector', from: 0, to: 24, color: 'grey' },
                ],
            });
        }
        quad_1.exampleLayer = exampleLayer;
        // export const extraShapes: Record<string, (ctx: SzContext2D, quad: SzLayerQuad) => void> = {
        // 	clover(ctx: SzContext2D) {
        // 		// begin({ size: 1.3, path: true, zero: true });
        // 		// const inner = 0.5;
        // 		// const inner_center = 0.45;
        // 		// context.lineTo(0, inner);
        // 		// context.bezierCurveTo(0, 1, inner, 1, inner_center, inner_center);
        // 		// context.bezierCurveTo(1, inner, 1, 0, inner, 0);
        // 	},
        // 	star8(ctx: SzContext2D, { from, to }: SzLayerQuad) {
        // 		const r = 1.22 / 2, R = 1.22, d = (n: number) => from * (1 - n) + to * n;
        // 		ctx
        // 			.lineToR(r, d(0))
        // 			.lineToR(R, d(0.25))
        // 			.lineToR(r, d(0.5))
        // 			.lineToR(R, d(0.75))
        // 			.lineToR(r, d(1))
        // 	},
        // 	rhombus(ctx: SzContext2D) {
        // 	},
        // 	plus(ctx: SzContext2D, { from, to }: SzLayerQuad) {
        // 		const r = 0.4, R = 1.0, d = (n: number) => from * (1 - n) + to * n;
        // 		const rr = (r1: number, r2: number) => (r1 * r1 + r2 * r2) ** 0.5
        // 		const at = (a: number, b: number) => Math.atan2(b, a) / Math.PI * 2;
        // 		const tor = (r: number, R: number) => [rr(r, R), d(at(r, R))] as const;
        // 		ctx
        // 			.lineToR(...tor(R, 0))
        // 			.lineToR(...tor(R, r))
        // 			.lineToR(...tor(r, r))
        // 			.lineToR(...tor(r, R))
        // 			.lineToR(...tor(0, R))
        // 	},
        // 	saw(ctx: SzContext2D) {
        // 	},
        // 	sun(ctx: SzContext2D) {
        // 	},
        // 	leaf(ctx: SzContext2D) {
        // 	},
        // 	diamond(ctx: SzContext2D) {
        // 	},
        // 	mill(ctx: SzContext2D) {
        // 	},
        // 	halfleaf(ctx: SzContext2D) {
        // 	},
        // 	yinyang(ctx: SzContext2D) {
        // 	},
        // 	octagon(ctx: SzContext2D) {
        // 	},
        // 	cover(ctx: SzContext2D, { from, to }: SzLayerQuad) {
        // 		ctx.arc(0, 0, 1.15, from, to);
        // 	},
        // }
        // Object.entries(extraShapes).map(([k, v]) => list.push({ name: k } as any));
        quad_1.quadList = quad_1.list.map(e => e.name);
    })(quad = SzInfo.quad || (SzInfo.quad = {}));
    let area;
    (function (area) {
        area.list = [
            { name: 'sector', code: 's' },
            { name: 'whole', code: 'w' },
        ];
        area.byName = Object.fromEntries(area.list.map(e => [e.name, e]));
        area.byChar = Object.fromEntries(area.list.map(e => [e.code, e]));
    })(area = SzInfo.area || (SzInfo.area = {}));
    let s = Array(100).fill(0).map((e, i) => i.toString(36)).join('').slice(0, 36);
    s += s.slice(10).toUpperCase();
    SzInfo.nToChar = s.split('');
    SzInfo.charToN = Object.fromEntries(SzInfo.nToChar.map((e, i) => [e, i]));
    /* old:

    
export const shape4svg = {
    R: "M 0 0 L 1 0 L 1 1 L 0 1 Z",
    C: "M 0 0 L 1 0 A 1 1 0 0 1 0 1 Z",
    S: "M 0 0 L 0.6 0 L 1 1 L 0 0.6 Z",
    W: "M 0 0 L 0.6 0 L 1 1 L 0 1 Z",
    "-": "M 0 0",
}
function dotPos(l, a) {
    return `${l * Math.cos(Math.PI / a)} ${l * Math.sin(Math.PI / a)}`;
}

function sinPiBy(a) {
    return Math.sin(Math.PI / a);
}
function cosPiBy(a) {
    return Math.cos(Math.PI / a);
}
let shape6long = 1 / cosPiBy(6);

export const shape6svg = {
    R: `M 0 0 L 1 0 L ${dotPos(shape6long, 6)} L ${dotPos(1, 3)} Z`,
    C: `M 0 0 L 1 0 A 1 1 0 0 1 ${dotPos(1, 3)} Z`,
    S: `M 0 0 L 0.6 0 L ${dotPos(shape6long, 6)} L ${dotPos(0.6, 3)} Z`,
    W: `M 0 0 L 0.6 0 L ${dotPos(shape6long, 6)} L ${dotPos(1, 3)} Z`,
    "-": "M 0 0",
}



registerCustomShape({
    id: "rhombus",
    code: "B",
    ...customDefaults,
    draw({ dims, innerDims, layer, quad, context, color, begin }) {
        begin({ size: 1.2, path: true, zero: true });
        const rad = 0.001;
        // with rounded borders
        context.arcTo(0, 1, 1, 0, rad);
        context.arcTo(1, 0, 0, 0, rad);
    },
});

registerCustomShape({
    id: "plus",
    code: "P",
    ...customDefaults,
    draw: "M 0 0 L 1.1 0 1.1 0.5 0.5 0.5 0.5 1.1 0 1.1 z",
    tier: 3,
});

registerCustomShape({
    id: "saw",
    code: "Z",
    ...customDefaults,
    draw({ dims, innerDims, layer, quad, context, color, begin }) {
        begin({ size: 1.1, path: true, zero: true });
        const inner = 0.5;
        context.lineTo(inner, 0);
        context.bezierCurveTo(inner, 0.3, 1, 0.3, 1, 0);
        context.bezierCurveTo(
            1,
            inner,
            inner * Math.SQRT2 * 0.9,
            inner * Math.SQRT2 * 0.9,
            inner * Math.SQRT1_2,
            inner * Math.SQRT1_2
        );
        context.rotate(Math.PI / 4);
        context.bezierCurveTo(inner, 0.3, 1, 0.3, 1, 0);
        context.bezierCurveTo(
            1,
            inner,
            inner * Math.SQRT2 * 0.9,
            inner * Math.SQRT2 * 0.9,
            inner * Math.SQRT1_2,
            inner * Math.SQRT1_2
        );
    },
    tier: 3,
});

registerCustomShape({
    id: "sun",
    code: "U",
    ...customDefaults,
    spawnColor: "yellow",
    draw({ dims, innerDims, layer, quad, context, color, begin }) {
        begin({ size: 1.3, path: true, zero: true });
        const PI = Math.PI;
        const PI3 = ((PI * 3) / 8) * 0.75;
        const c = 1 / Math.cos(Math.PI / 8);
        const b = c * Math.sin(Math.PI / 8);

        context.moveTo(0, 0);
        context.rotate(Math.PI / 2);
        context.arc(c, 0, b, -PI, -PI + PI3);
        context.rotate(-Math.PI / 4);
        context.arc(c, 0, b, -PI - PI3, -PI + PI3);
        context.rotate(-Math.PI / 4);
        context.arc(c, 0, b, PI - PI3, PI);
    },
});

registerCustomShape({
    id: "leaf",
    code: "F",
    ...customDefaults,
    draw: "M 0 0 v 0.5 a 0.5 0.5 0 0 0 0.5 0.5 h 0.5 v -0.5 a 0.5 0.5 0 0 0 -0.5 -0.5 z",
});

registerCustomShape({
    id: "diamond",
    code: "D",
    ...customDefaults,
    draw: "M 0 0 l 0 0.5 0.5 0.5 0.5 0 0 -0.5 -0.5 -0.5 z",
});

registerCustomShape({
    id: "mill",
    code: "M",
    ...customDefaults,
    draw: "M 0 0 L 0 1 1 1 Z",
});

// registerCustomShape({
//     id: "halfleaf",
//     code: "H",
//     ...customDefaults,
//     draw: "100 M 0 0 L 0 100 A 45 45 0 0 0 30 30 A 45 45 0 0 0 100 0 Z",
// })

registerCustomShape({
    id: "yinyang",
    code: "Y",
    ...customDefaults,
    // draw({ dims, innerDims, layer, quad, context, color, begin }) {
    //     begin({ size: 1/(0.5+Math.SQRT1_2), path: true });

    //     /** @type{CanvasRenderingContext2D} * /
    //     let ctx = context;

    //     with (ctx) { with (Math) {
    //     ////////////////////////
    //     // draw mostly in [0,1]x[0,1] square
    //     // draw: "100 M 0 50 A 50 50 0 1 1 85 85 A 121 121 0 0 1 -85 85 A 50 50 0 0 0 0 50",
    //     moveTo(0, 0.5);
    //     arc(0.5, 0.5, 0.5, PI, PI/4)
    //     arc(0, 0, 0.5+SQRT1_2, PI/4, PI/4+PI/2, 0)
    //     arc(-0.5, 0.5, 0.5, 3*PI/4, 0, 1)

    //     moveTo(0.6, 0.5)
    //     arc(0.5, 0.5, 0.1, 0, 2*PI)
    //     }}

    // },
    draw:
        "120.71 M 0 50 A 50 50 0 1 1 85.355 85.355 A 120.71 120.71 0 0 1 -85.355 85.355 A 50 50 0 0 0 0 50 Z M 40 50 A 10 10 0 1 0 40 49.99 Z",
    tier: 4,
});

registerCustomShape({
    id: "octagon",
    code: "O",
    ...customDefaults,
    draw: "M 0 0 L 0 1 0.4142 1 1 0.4142 1 0 Z",
});

    
    */
})(SzInfo || (SzInfo = {}));
export class SzLayerCut {
    shape = 'line';
    color = 'black';
    from = 0;
    to = 0;
    constructor(source) {
        Object.assign(this, source);
    }
    clone() { return new SzLayerCut(this); }
    get smallRadius() {
        return 0.0001;
    }
    pathInside(ctx) {
        switch (this.shape) {
            case 'line': {
                ctx.lineToR(0.5, this.from);
                ctx.lineToR(this.smallRadius, this.from);
                return;
            }
            default: {
                throw log(this);
            }
        }
    }
    pathOutsize(ctx) {
        switch (this.shape) {
            case 'line': {
                ctx.lineToR(this.smallRadius, this.from);
                ctx.lineToR(0.5, this.from);
                return;
            }
            default: {
                throw log(this);
            }
        }
    }
    getHash() {
        // fixme
        return ``;
    }
    static fromShortKey(e) {
        // fixme
        return new SzLayerCut({});
    }
}
export class SzLayerQuad {
    shape = 'circle';
    color = 'none';
    from = 0;
    to = 0;
    constructor(source) {
        Object.assign(this, source);
        if (config.disableQuadColors) {
            this.color = 'none';
        }
    }
    clone() { return new SzLayerQuad(this); }
    outerPath(ctx, layer) {
        switch (this.shape) {
            case 'circle': {
                ctx.arc(0, 0, 1, this.from, this.to);
                return;
            }
            case 'square': {
                ctx.lineToR(1, this.from);
                ctx.lineToR(Math.SQRT2, (this.from + this.to) / 2);
                ctx.lineToR(1, this.to);
                return;
            }
            case 'star': {
                ctx.lineToR(0.6, this.from);
                ctx.lineToR(Math.SQRT2, (this.from + this.to) / 2);
                ctx.lineToR(0.6, this.to);
                return;
            }
            default: {
                ctx.saved(ctx => {
                    if (this.shape == 'cover') {
                        ctx.scale(1 / layer.layerScale());
                    }
                    SzInfo.quad.byName[this.shape].path(ctx, this);
                });
                return;
            }
        }
    }
    getHash() {
        return `${SzInfo.quad.byName[this.shape].code}${SzInfo.color.byName[this.color].code}${SzInfo.nToChar[this.from]}${SzInfo.nToChar[this.to]}`;
    }
    static fromShortKey(e) {
        return new SzLayerQuad({
            shape: SzInfo.quad.byChar[e[0]].name,
            color: SzInfo.color.byChar[e[1]].name,
            from: SzInfo.charToN[e[2]],
            to: SzInfo.charToN[e[3]],
        });
    }
}
export class SzLayerArea {
    shape = 'sector';
    color = 'black';
    from = 0;
    to = 0;
    constructor(source) {
        Object.assign(this, source);
    }
    clone() { return new SzLayerArea(this); }
    outerPath(ctx) {
        switch (this.shape) {
            case 'whole': {
                ctx.beginPath();
                ctx.arc(0, 0, 5, 0, 24);
                ctx.closePath();
                return;
            }
            case 'sector': {
                if (this.from == 0 && this.to == 24) {
                    ctx.beginPath();
                    ctx.arc(0, 0, 5, 0, 24);
                    ctx.closePath();
                    return;
                }
                ;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, 5, this.from, this.to);
                ctx.closePath();
                return;
            }
            default: {
                throw log(this);
            }
        }
    }
    clip(ctx) {
        this.outerPath(ctx);
        ctx.clip();
    }
    fill(ctx) {
        this.outerPath(ctx);
        ctx.fillStyle = SzInfo.color.byName[this.color].style;
        ctx.fill();
    }
    getHash() {
        return `${SzInfo.area.byName[this.shape].code}${SzInfo.color.byName[this.color].code}${SzInfo.nToChar[this.from]}${SzInfo.nToChar[this.to]}`;
    }
    static fromShortKey(e) {
        return new SzLayerArea({
            shape: SzInfo.area.byChar[e[0]].name,
            color: SzInfo.color.byChar[e[1]].name,
            from: SzInfo.charToN[e[2]],
            to: SzInfo.charToN[e[3]],
        });
    }
}
const testTemplate = {
    cuts: [
        { from: 10, to: 10, shape: 'line', color: 'blue' },
        { from: 14, to: 14, shape: 'line', color: 'blue' },
    ],
    quads: [
        { shape: 'square', color: 'green', from: 2, to: 4 },
        { shape: 'circle', color: 'pink', from: 5, to: 19 },
        { shape: 'square', color: 'green', from: 20, to: 22 },
    ],
    areas: [
        { shape: 'sector', color: 'red', from: 11, to: 13 },
    ],
};
export class SzLayer {
    layerIndex = 0;
    cuts = [];
    quads = [];
    areas = [];
    static createTest() {
        let l = new SzLayer(testTemplate);
        l.areas.map(e => {
            let r = (Math.random() - 0.5) * 8;
            e.from += r;
            e.to += r;
        });
        console.error('test layer', l);
        return l;
    }
    constructor(source, layerIndex) {
        if (source) {
            this.cuts = (source.cuts ?? []).map(e => new SzLayerCut(e));
            this.quads = (source.quads ?? []).map(e => new SzLayerQuad(e));
            this.areas = (source.areas ?? []).map(e => new SzLayerArea(e));
            if (source.layerIndex) {
                this.layerIndex = source.layerIndex;
            }
        }
        if (layerIndex != null) {
            this.layerIndex = layerIndex;
        }
        if (config.disableCuts)
            this.cuts = [];
        return this.normalize();
    }
    layerScale(layerIndex) {
        layerIndex ??= this.layerIndex;
        return 0.9 - 0.22 * layerIndex;
    }
    drawCenteredLayerScaled(ctx, layerIndex) {
        ctx.saved(ctx => {
            ctx.scale(this.layerScale(layerIndex));
            this.drawCenteredNormalized(ctx);
        });
    }
    drawCenteredNormalized(ctx) {
        ctx.saved(ctx => {
            this.clipShapes(ctx);
            // this.quads.forEach(q => ctx.saved(ctx => this.fillQuad(q, ctx)));
            this.cuts.forEach(c => ctx.saved(ctx => this.strokeCut(c, ctx)));
            this.areas.forEach(a => ctx.saved(ctx => this.fillArea(a, ctx)));
        });
        ctx.saved(ctx => this.drawQuadOutline(ctx, true));
    }
    strokeCut(cut, ctx) {
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = cut.color;
        ctx.beginPath();
        if (cut.shape == 'line') {
            ctx.rotate(cut.from);
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 1);
            ctx.stroke();
        }
        else {
            throw log('bad cut', cut);
        }
    }
    fillQuad(quad, ctx) {
        ctx.fillStyle = SzInfo.color.byName[quad.color].style;
        if (quad.color == 'cover')
            [
            // ctx.ctx.globalCompositeOperation = 'destination-out'
            ];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        quad.outerPath(ctx, this);
        ctx.fill();
    }
    fillArea(area, ctx) {
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = ctx.fillStyle = SzInfo.color.byName[area.color].style;
        area.clip(ctx);
        ctx.fill();
    }
    fullQuadPath(ctx, withCuts) {
        ctx.beginPath();
        for (let i = 0; i < this.quads.length; i++) {
            let prev = i > 0 ? this.quads[i - 1] : this.quads.slice(-1)[0];
            let quad = this.quads[i];
            if (withCuts || quad.from != prev.to % 24)
                ctx.lineTo(0, 0);
            quad.outerPath(ctx, this);
        }
        ctx.closePath();
    }
    drawQuadOutline(ctx, withCuts) {
        this.fullQuadPath(ctx, withCuts);
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = 'orange';
        ctx.stroke();
    }
    clipShapes(ctx) {
        this.fullQuadPath(ctx);
        ctx.clip();
    }
    clone() {
        return new SzLayer(this);
    }
    isNormalized() {
        for (let i = 0; i < this.quads.length; i++) {
            let next = this.quads[i];
            let prev = this.quads[i - 1] || this.quads[this.quads.length - 1];
            if (next.from < 0 || next.from > 24)
                return false;
            if (next.from >= next.to)
                return false;
            if (i == 0) {
                if (prev.to > 24 && prev.to % 24 > next.from)
                    return false;
            }
            else {
                if (prev.to > next.from)
                    return false;
            }
        }
        for (let i = 0; i < this.areas.length; i++) {
            let next = this.areas[i];
            let prev = this.areas[i - 1] || this.areas[this.areas.length - 1];
            if (next.from > 24)
                return false;
            if (next.from >= next.to)
                return false;
            if (i == 0) {
                if (prev.to > 24 && prev.to % 24 > next.from)
                    return false;
            }
            else {
                if (prev.to > next.from)
                    return false;
            }
            if (prev.to % 24 == next.from && prev.color == next.color) {
                if (prev != next)
                    return false;
                if (next.from != 0)
                    return false;
            }
        }
        // fixme: cuts check;
        return true;
    }
    normalize() {
        if (this.isNormalized())
            return this;
        for (let i = 0; i < this.quads.length; i++) {
            let q = this.quads[i];
            if (q.from > q.to) {
                this.quads.splice(i, 1);
                i--;
                continue;
            }
            if (q.from > 24) {
                q.from -= 24;
                q.to -= 24;
            }
        }
        this.quads.sort((a, b) => a.from - b.from);
        let places = Array(24).fill('');
        let paints = Array(24).fill('');
        for (let q of this.quads) {
            for (let i = q.from; i < q.to; i++) {
                places[i % 24] = q.shape;
            }
        }
        for (let a of this.areas) {
            for (let i = a.from; i < a.to; i++) {
                paints[i % 24] = a.color;
            }
        }
        for (let i = 0; i < 24; i++)
            if (!places[i])
                paints[i] = '';
        this.areas = [];
        let last;
        for (let i = 0; i < 24; i++) {
            if (!paints[i])
                continue;
            if (last && last.color == paints[i] && last.to == i) {
                last.to++;
            }
            else {
                this.areas.push(last = new SzLayerArea({
                    color: paints[i], from: i, to: i + 1, shape: 'sector',
                }));
            }
        }
        if (this.areas.length > 1) {
            if (this.areas[this.areas.length - 1].to % 24 == this.areas[0].from) {
                this.areas[this.areas.length - 1].to += this.areas[0].from;
                this.areas.splice(0, 1);
            }
        }
        // fixme: cuts
        if (!this.isNormalized()) {
            Object.assign(globalThis, { layer: this });
            console.error('Layer failed to normalize properly!', this);
            if (config.debugBadLayers)
                debugger;
        }
        return this;
    }
    isEmpty() {
        return this.quads.length == 0;
    }
    getQuadAtSector(s) {
        let s1 = (s + 0.5) % 24, s2 = s1 + 24;
        return this.quads.find(q => (q.from < s1 && q.to > s1) || (q.from < s2 && q.to > s2));
    }
    canStackWith(upper) {
        if (!upper)
            return true;
        for (let i = 0; i < 24; i++) {
            let q1 = this.getQuadAtSector(i);
            let q2 = upper.getQuadAtSector(i);
            if (q1 && q2)
                return false;
        }
        return true;
    }
    stackWith(upper) {
        if (!upper)
            return this.clone();
        return new SzLayer({
            areas: this.areas.concat(upper.areas),
            quads: this.quads.concat(upper.quads),
            cuts: this.cuts.concat(upper.cuts),
        });
    }
    rotate(rot) {
        this.areas.map(e => { e.from += rot; e.to += rot; });
        this.cuts.map(e => { e.from += rot; });
        this.quads.map(e => { e.from += rot; e.to += rot; });
        return this.normalize();
    }
    cloneFilteredByQuadrants(includeQuadrants) {
        const good = (n) => includeQuadrants.includes((~~((n + 0.5) / 6)) % 4);
        let allowed = Array(48).fill(0).map((e, i) => good(i) || good(i - 1));
        function convert(old) {
            let clone = old.clone();
            while (!allowed[clone.from] && clone.from < clone.to)
                clone.from++;
            while (!allowed[clone.to] && clone.from < clone.to)
                clone.to--;
            // if (!allowed[clone.from] || !allowed[clone.to]) return [];
            if (!(clone instanceof SzLayerCut) && clone.from == clone.to)
                return [];
            return [clone];
            //fixme cuts
            //fixme cut into two
        }
        return new SzLayer({
            areas: this.areas.flatMap(convert),
            quads: this.quads.flatMap(convert),
            cuts: this.cuts.flatMap(convert),
        });
    }
    cloneAsCover() {
        function convert(quad) {
            return new SzLayerQuad({
                color: 'cover',
                shape: 'cover',
                from: quad.from, to: quad.to,
            });
        }
        return new SzLayer({
            quads: this.quads.flatMap(convert),
        }).paint('cover').normalize();
    }
    removeCover() {
        this.quads = this.quads.filter(e => e.shape != 'cover');
        return this;
    }
    filterPaint(paint) {
        return paint.map((e, i) => {
            let quad = this.getQuadAtSector(i);
            return quad && quad.shape == 'cover' ? null : e;
        });
    }
    paint(paint) {
        if (!Array.isArray(paint))
            paint = Array(24).fill(paint);
        paint.map((color, i) => {
            if (color) {
                this.areas.push(new SzLayerArea({
                    color,
                    from: i, to: i + 1,
                    shape: 'sector',
                }));
            }
        });
        return this.normalize();
        ;
    }
    static fromShapezHash(hash) {
        const colors = { u: 'grey', r: 'red', b: 'blue', g: 'green' };
        const shapes = { C: 'circle', R: 'square', S: 'star', };
        return new SzLayer({
            areas: hash.match(/../g).map((s, i) => {
                if (s[0] == '-')
                    return null;
                return new SzLayerArea({
                    shape: 'sector',
                    color: colors[s[1]],
                    from: i * 6,
                    to: (i + 1) * 6,
                });
            }).filter(e => e),
            quads: hash.match(/../g).map((s, i) => {
                if (s[0] == '-')
                    return null;
                return new SzLayerQuad({
                    shape: shapes[s[0]],
                    color: colors[s[1]],
                    from: i * 6,
                    to: (i + 1) * 6,
                });
            }).filter(e => e),
            cuts: [],
        });
    }
    getHash() {
        return `q!${this.quads.map(e => e.getHash()).join('')}|a!${this.areas.map(e => e.getHash()).join('')}|c!${this.cuts.map(e => e.getHash()).join('')}`;
    }
    static fromShortKey(key) {
        let layer = new SzLayer();
        for (let part of key.split('|')) {
            console.log(part);
            if (part.startsWith('q!')) {
                let strs = part.slice('q!'.length).match(/..../g) || [];
                layer.quads = strs.map(e => SzLayerQuad.fromShortKey(e));
            }
            if (part.startsWith('a!')) {
                let strs = part.slice('a!'.length).match(/..../g) || [];
                layer.areas = strs.map(e => SzLayerArea.fromShortKey(e));
            }
            if (part.startsWith('c!')) {
                let strs = part.slice('c!'.length).match(/..../g) || [];
                layer.cuts = strs.map(e => SzLayerCut.fromShortKey(e));
            }
        }
        return layer;
    }
}
function log(...a) {
    console.error(...a);
    for (let o of a)
        document.body.append(JSON.stringify(o));
}
// try {
// 	hashForEach(testHash, 'shapes', drawShape, sctx);
// 	hashForEach(testHash, 'cuts', drawCut, sctx);
// 	clipShapes(testHash, sctx);
// 	// hashForEach(testHash, 'areas', drawArea, sctx);
// } catch (e: any) {
// 	log('error: ', e.stack);
// }
// ctx.globalAlpha = 0.4;
// ctx.fillRect(-2, -2, 4, 4);
// function hashForEach<K extends keyof SzDefinition>(
// 	hash: SzDefinition, k: K,
// 	mapper: (e: SzDefinition[K][0], i: number, hash: SzDefinition, ctx: SzContext2D) => void,
// 	ctx: SzContext2D,
// ) {
// 	hash[k].map((e, i) => {
// 		ctx.save();
// 		mapper(e, i, hash, ctx);
// 		ctx.restore();
// 	});
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2hhcGVzdC9sYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLE1BQU0sR0FBRztJQUNkLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLGlCQUFpQixFQUFFLElBQUk7SUFDdkIsY0FBYyxFQUFFLElBQUk7Q0FDcEIsQ0FBQTtBQXFCRCxNQUFNLEtBQVcsTUFBTSxDQTZVdEI7QUE3VUQsV0FBaUIsTUFBTTtJQUN0QixJQUFpQixLQUFLLENBbURyQjtJQW5ERCxXQUFpQixPQUFLO1FBQ3JCLE1BQU0sa0JBQWtCLEdBQUc7WUFDMUIsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRO1lBQ3pCLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTTtZQUM1QixNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU07U0FDZixDQUFDO1FBQ1gsTUFBTSxpQkFBaUIsR0FBRztZQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU87U0FDZixDQUFDO1FBSUUsWUFBSSxHQUF5QjtZQUN6QyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDdEQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQzVELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUM1RCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDMUQsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUss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QUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3hELEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2RDtTQUNEO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDO0NBQ0Q7QUFHRCxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQVE7SUFDdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQztRQUNkLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBU0QsUUFBUTtBQUNSLHFEQUFxRDtBQUNyRCxpREFBaUQ7QUFDakQsK0JBQStCO0FBQy9CLHNEQUFzRDtBQUN0RCxxQkFBcUI7QUFDckIsNEJBQTRCO0FBQzVCLElBQUk7QUFFSix5QkFBeUI7QUFDekIsOEJBQThCO0FBTTlCLHNEQUFzRDtBQUN0RCw2QkFBNkI7QUFDN0IsNkZBQTZGO0FBQzdGLHFCQUFxQjtBQUNyQixNQUFNO0FBQ04sMkJBQTJCO0FBQzNCLGdCQUFnQjtBQUNoQiw2QkFBNkI7QUFDN0IsbUJBQW1CO0FBQ25CLE9BQU87QUFDUCxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hhciwgcm90YXRpb24yNCwgc3R5bGVTdHJpbmcsIFN6Q29udGV4dDJEIH0gZnJvbSBcIi4vU3pDb250ZXh0MkQuanNcIjtcclxuXHJcbmNvbnN0IGNvbmZpZyA9IHtcclxuXHRkaXNhYmxlQ3V0czogdHJ1ZSxcclxuXHRkaXNhYmxlUXVhZENvbG9yczogdHJ1ZSxcclxuXHRkZWJ1Z0JhZExheWVyczogdHJ1ZSxcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgY3V0U2hhcGUgPSAoXHJcblx0fCAnbGluZSdcclxuKTtcclxuZXhwb3J0IHR5cGUgcXVhZFNoYXBlID0gKFxyXG5cdHwgJ2NpcmNsZScgfCAnc3F1YXJlJyB8ICdzdGFyJyB8ICdjb3ZlcidcclxuKTtcclxuZXhwb3J0IHR5cGUgYXJlYVNoYXBlID0gKFxyXG5cdHwgJ3dob2xlJyB8ICdzZWN0b3InXHJcbik7XHJcbmV4cG9ydCB0eXBlIGNvbG9yID1cclxuXHR8ICdyZWQnIHwgJ29yYW5nZScgfCAneWVsbG93J1xyXG5cdHwgJ2xhd25ncmVlbicgfCAnZ3JlZW4nIHwgJ2N5YW4nXHJcblx0fCAnYmx1ZScgfCAncHVycGxlJyB8ICdwaW5rJ1xyXG5cdHwgJ2JsYWNrJyB8ICdncmV5JyB8ICd3aGl0ZSdcclxuXHR8ICdjb3ZlcicgfCAnbm9uZSc7XHJcblxyXG5leHBvcnQgdHlwZSBjb2xvckNoYXIgPSAncicgfCAnZycgfCAnYicgfCAnLSc7XHJcbmV4cG9ydCB0eXBlIGNvbG9yU3RyaW5nID0gYCR7Y29sb3JDaGFyfSR7Y29sb3JDaGFyfSR7Y29sb3JDaGFyfWA7XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIFN6SW5mbyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBjb2xvciB7XHJcblx0XHRjb25zdCBjb2xvcldoZWVsTmFtZUxpc3QgPSBbXHJcblx0XHRcdCdyZWQnLCAnb3JhbmdlJywgJ3llbGxvdycsXHJcblx0XHRcdCdsYXduZ3JlZW4nLCAnZ3JlZW4nLCAnY3lhbicsXHJcblx0XHRcdCdibHVlJywgJ3B1cnBsZScsICdwaW5rJyxcclxuXHRcdF0gYXMgY29uc3Q7XHJcblx0XHRjb25zdCBjb2xvckdyZXlOYW1lTGlzdCA9IFtcclxuXHRcdFx0J2JsYWNrJywgJ2dyZXknLCAnd2hpdGUnLFxyXG5cdFx0XSBhcyBjb25zdDtcclxuXHJcblx0XHRleHBvcnQgdHlwZSBjb2xvckluZm8gPSB7IG5hbWU6IGNvbG9yLCBzdHlsZTogc3R5bGVTdHJpbmcsIGNvZGU6IGNoYXIsIGNvbWJvPzogY29sb3JTdHJpbmcgfTsgLy8gYmJnZ3JyXHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IGxpc3Q6IHJlYWRvbmx5IGNvbG9ySW5mb1tdID0gW1xyXG5cdFx0XHR7IG5hbWU6ICdyZWQnLCBzdHlsZTogJ3JlZCcsIGNvZGU6ICdyJywgY29tYm86ICdycnInIH0sXHJcblx0XHRcdHsgbmFtZTogJ29yYW5nZScsIHN0eWxlOiAnb3JhbmdlJywgY29kZTogJ28nLCBjb21ibzogJ2dycicgfSxcclxuXHRcdFx0eyBuYW1lOiAneWVsbG93Jywgc3R5bGU6ICd5ZWxsb3cnLCBjb2RlOiAneScsIGNvbWJvOiAnZ2dyJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdncmVlbicsIHN0eWxlOiAnZ3JlZW4nLCBjb2RlOiAnZycsIGNvbWJvOiAnZ2dnJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdsYXduZ3JlZW4nLCBzdHlsZTogJ2xhd25ncmVlbicsIGNvZGU6ICdsJywgY29tYm86ICdiZ2cnIH0sXHJcblx0XHRcdHsgbmFtZTogJ2N5YW4nLCBzdHlsZTogJ2N5YW4nLCBjb2RlOiAnYycsIGNvbWJvOiAnYmJnJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdibHVlJywgc3R5bGU6ICdibHVlJywgY29kZTogJ2InLCBjb21ibzogJ2JiYicgfSxcclxuXHRcdFx0eyBuYW1lOiAncHVycGxlJywgc3R5bGU6ICdwdXJwbGUnLCBjb2RlOiAndicsIGNvbWJvOiAnYmJyJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdwaW5rJywgc3R5bGU6ICdwaW5rJywgY29kZTogJ3AnLCBjb21ibzogJ2JycicgfSxcclxuXHRcdFx0eyBuYW1lOiAnYmxhY2snLCBzdHlsZTogJ2JsYWNrJywgY29kZTogJ2snIH0sXHJcblx0XHRcdHsgbmFtZTogJ2dyZXknLCBzdHlsZTogJ2dyZXknLCBjb2RlOiAndScgfSxcclxuXHRcdFx0eyBuYW1lOiAnd2hpdGUnLCBzdHlsZTogJ3doaXRlJywgY29kZTogJ3cnIH0sXHJcblx0XHRcdHsgbmFtZTogJ2NvdmVyJywgc3R5bGU6ICdzei1jb3ZlcicsIGNvZGU6ICdqJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdub25lJywgc3R5bGU6ICdub25lJywgY29kZTogJy0nIH0sXHJcblx0XHRdIGFzIGNvbnN0O1xyXG5cdFx0T2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCB7IGxpc3QgfSk7XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IGNvbG9yTGlzdCA9IGxpc3QubWFwKGUgPT4gZS5uYW1lKTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgYnlOYW1lOiBSZWNvcmQ8Y29sb3IsIGNvbG9ySW5mbz4gPSBPYmplY3QuZnJvbUVudHJpZXMobGlzdC5tYXAoZSA9PiBbZS5uYW1lLCBlXSBhcyBjb25zdCkpO1xyXG5cdFx0ZXhwb3J0IGNvbnN0IGJ5Q2hhcjogUmVjb3JkPGNoYXIsIGNvbG9ySW5mbz4gPSBPYmplY3QuZnJvbUVudHJpZXMobGlzdC5tYXAoZSA9PiBbZS5jb2RlLCBlXSBhcyBjb25zdCkpO1xyXG5cdFx0ZXhwb3J0IGNvbnN0IGJ5Q29tYm86IFJlY29yZDxjb2xvclN0cmluZywgY29sb3JJbmZvPiA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0LmZpbHRlcihlID0+IGUuY29tYm8pLm1hcChlID0+IFtlLmNvbWJvISwgZV0pKTtcclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZXhhbXBsZUxheWVyKGNvbG9yOiBjb2xvcikge1xyXG5cdFx0XHRsZXQgaSA9IDA7XHJcblx0XHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdFx0cXVhZHM6IFtcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdjaXJjbGUnLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvciB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZTogJ3NxdWFyZScsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnY2lyY2xlJywgZnJvbTogaSwgdG86IGkgKz0gNiwgY29sb3IgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdzcXVhcmUnLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvciB9LFxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YXJlYXM6IFtcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdzZWN0b3InLCBmcm9tOiAwLCB0bzogMjQsIGNvbG9yIH0sXHJcblx0XHRcdFx0XVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgcXVhZCB7XHJcblx0XHRleHBvcnQgdHlwZSBxdWFkSW5mbyA9IHtcclxuXHRcdFx0bmFtZTogcXVhZFNoYXBlLCBjb2RlOiBjaGFyLFxyXG5cdFx0XHRwYXRoPzogKGN0eDogU3pDb250ZXh0MkQsIHF1YWQ6IFN6TGF5ZXJRdWFkKSA9PiB2b2lkLFxyXG5cdFx0fTtcclxuXHRcdGV4cG9ydCBjb25zdCBsaXN0OiBxdWFkSW5mb1tdID0gW1xyXG5cdFx0XHR7IG5hbWU6ICdjaXJjbGUnLCBjb2RlOiAnQycgfSxcclxuXHRcdFx0eyBuYW1lOiAnc3F1YXJlJywgY29kZTogJ1InIH0sXHJcblx0XHRcdHsgbmFtZTogJ3N0YXInLCBjb2RlOiAnUycgfSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdjb3ZlcicsIGNvZGU6ICdKJyxcclxuXHRcdFx0XHRwYXRoKGN0eCwgeyBmcm9tLCB0byB9KSB7XHJcblx0XHRcdFx0XHRjdHguYXJjKDAsIDAsIDEuMTUsIGZyb20sIHRvKTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgYnlOYW1lID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UubmFtZSwgZV0pKTtcclxuXHRcdGV4cG9ydCBjb25zdCBieUNoYXIgPSBPYmplY3QuZnJvbUVudHJpZXMobGlzdC5tYXAoZSA9PiBbZS5jb2RlLCBlXSkpO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBleGFtcGxlTGF5ZXIoc2hhcGU6IHF1YWRTaGFwZSkge1xyXG5cdFx0XHRsZXQgaSA9IDA7XHJcblx0XHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdFx0cXVhZHM6IFtcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGFyZWFzOiBbXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnc2VjdG9yJywgZnJvbTogMCwgdG86IDI0LCBjb2xvcjogJ2dyZXknIH0sXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZXhwb3J0IGNvbnN0IGV4dHJhU2hhcGVzOiBSZWNvcmQ8c3RyaW5nLCAoY3R4OiBTekNvbnRleHQyRCwgcXVhZDogU3pMYXllclF1YWQpID0+IHZvaWQ+ID0ge1xyXG5cdFx0Ly8gXHRjbG92ZXIoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Ly8gXHRcdC8vIGJlZ2luKHsgc2l6ZTogMS4zLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0Ly8gXHRcdC8vIGNvbnN0IGlubmVyID0gMC41O1xyXG5cdFx0Ly8gXHRcdC8vIGNvbnN0IGlubmVyX2NlbnRlciA9IDAuNDU7XHJcblx0XHQvLyBcdFx0Ly8gY29udGV4dC5saW5lVG8oMCwgaW5uZXIpO1xyXG5cdFx0Ly8gXHRcdC8vIGNvbnRleHQuYmV6aWVyQ3VydmVUbygwLCAxLCBpbm5lciwgMSwgaW5uZXJfY2VudGVyLCBpbm5lcl9jZW50ZXIpO1xyXG5cdFx0Ly8gXHRcdC8vIGNvbnRleHQuYmV6aWVyQ3VydmVUbygxLCBpbm5lciwgMSwgMCwgaW5uZXIsIDApO1xyXG5cdFx0Ly8gXHR9LFxyXG5cdFx0Ly8gXHRzdGFyOChjdHg6IFN6Q29udGV4dDJELCB7IGZyb20sIHRvIH06IFN6TGF5ZXJRdWFkKSB7XHJcblx0XHQvLyBcdFx0Y29uc3QgciA9IDEuMjIgLyAyLCBSID0gMS4yMiwgZCA9IChuOiBudW1iZXIpID0+IGZyb20gKiAoMSAtIG4pICsgdG8gKiBuO1xyXG5cdFx0Ly8gXHRcdGN0eFxyXG5cdFx0Ly8gXHRcdFx0LmxpbmVUb1IociwgZCgwKSlcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKFIsIGQoMC4yNSkpXHJcblx0XHQvLyBcdFx0XHQubGluZVRvUihyLCBkKDAuNSkpXHJcblx0XHQvLyBcdFx0XHQubGluZVRvUihSLCBkKDAuNzUpKVxyXG5cdFx0Ly8gXHRcdFx0LmxpbmVUb1IociwgZCgxKSlcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0cmhvbWJ1cyhjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHQvLyBcdH0sXHJcblx0XHQvLyBcdHBsdXMoY3R4OiBTekNvbnRleHQyRCwgeyBmcm9tLCB0byB9OiBTekxheWVyUXVhZCkge1xyXG5cdFx0Ly8gXHRcdGNvbnN0IHIgPSAwLjQsIFIgPSAxLjAsIGQgPSAobjogbnVtYmVyKSA9PiBmcm9tICogKDEgLSBuKSArIHRvICogbjtcclxuXHRcdC8vIFx0XHRjb25zdCByciA9IChyMTogbnVtYmVyLCByMjogbnVtYmVyKSA9PiAocjEgKiByMSArIHIyICogcjIpICoqIDAuNVxyXG5cdFx0Ly8gXHRcdGNvbnN0IGF0ID0gKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBNYXRoLmF0YW4yKGIsIGEpIC8gTWF0aC5QSSAqIDI7XHJcblx0XHQvLyBcdFx0Y29uc3QgdG9yID0gKHI6IG51bWJlciwgUjogbnVtYmVyKSA9PiBbcnIociwgUiksIGQoYXQociwgUikpXSBhcyBjb25zdDtcclxuXHRcdC8vIFx0XHRjdHhcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcihSLCAwKSlcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcihSLCByKSlcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcihyLCByKSlcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcihyLCBSKSlcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcigwLCBSKSlcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0c2F3KGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0c3VuKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0bGVhZihjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHQvLyBcdH0sXHJcblx0XHQvLyBcdGRpYW1vbmQoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Ly8gXHR9LFxyXG5cdFx0Ly8gXHRtaWxsKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0aGFsZmxlYWYoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Ly8gXHR9LFxyXG5cdFx0Ly8gXHR5aW55YW5nKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0b2N0YWdvbihjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHQvLyBcdH0sXHJcblx0XHQvLyBcdGNvdmVyKGN0eDogU3pDb250ZXh0MkQsIHsgZnJvbSwgdG8gfTogU3pMYXllclF1YWQpIHtcclxuXHRcdC8vIFx0XHRjdHguYXJjKDAsIDAsIDEuMTUsIGZyb20sIHRvKTtcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIH1cclxuXHJcblx0XHQvLyBPYmplY3QuZW50cmllcyhleHRyYVNoYXBlcykubWFwKChbaywgdl0pID0+IGxpc3QucHVzaCh7IG5hbWU6IGsgfSBhcyBhbnkpKTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgcXVhZExpc3QgPSBsaXN0Lm1hcChlID0+IGUubmFtZSk7XHJcblx0fVxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgYXJlYSB7XHJcblx0XHRleHBvcnQgdHlwZSBhcmVhSW5mbyA9IHsgbmFtZTogYXJlYVNoYXBlLCBjb2RlOiBjaGFyIH07XHJcblx0XHRleHBvcnQgY29uc3QgbGlzdDogYXJlYUluZm9bXSA9IFtcclxuXHRcdFx0eyBuYW1lOiAnc2VjdG9yJywgY29kZTogJ3MnIH0sXHJcblx0XHRcdHsgbmFtZTogJ3dob2xlJywgY29kZTogJ3cnIH0sXHJcblx0XHRdO1xyXG5cdFx0ZXhwb3J0IGNvbnN0IGJ5TmFtZTogUmVjb3JkPGFyZWFTaGFwZSwgYXJlYUluZm8+ID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UubmFtZSwgZV0pKTtcclxuXHRcdGV4cG9ydCBjb25zdCBieUNoYXI6IFJlY29yZDxjaGFyLCBhcmVhSW5mbz4gPSBPYmplY3QuZnJvbUVudHJpZXMobGlzdC5tYXAoZSA9PiBbZS5jb2RlLCBlXSkpO1xyXG5cclxuXHR9XHJcblxyXG5cdGxldCBzID0gQXJyYXkoMTAwKS5maWxsKDApLm1hcCgoZSwgaSkgPT4gaS50b1N0cmluZygzNikpLmpvaW4oJycpLnNsaWNlKDAsIDM2KTtcclxuXHRzICs9IHMuc2xpY2UoMTApLnRvVXBwZXJDYXNlKCk7XHJcblxyXG5cdGV4cG9ydCBjb25zdCBuVG9DaGFyOiBjaGFyW10gPSBzLnNwbGl0KCcnKTtcclxuXHRleHBvcnQgY29uc3QgY2hhclRvTjogUmVjb3JkPGNoYXIsIG51bWJlcj4gPSBPYmplY3QuZnJvbUVudHJpZXMoblRvQ2hhci5tYXAoKGUsIGkpID0+IFtlLCBpXSkpO1xyXG5cdC8qIG9sZDogXHJcblxyXG5cdFxyXG5leHBvcnQgY29uc3Qgc2hhcGU0c3ZnID0ge1xyXG5cdFI6IFwiTSAwIDAgTCAxIDAgTCAxIDEgTCAwIDEgWlwiLFxyXG5cdEM6IFwiTSAwIDAgTCAxIDAgQSAxIDEgMCAwIDEgMCAxIFpcIixcclxuXHRTOiBcIk0gMCAwIEwgMC42IDAgTCAxIDEgTCAwIDAuNiBaXCIsXHJcblx0VzogXCJNIDAgMCBMIDAuNiAwIEwgMSAxIEwgMCAxIFpcIixcclxuXHRcIi1cIjogXCJNIDAgMFwiLFxyXG59XHJcbmZ1bmN0aW9uIGRvdFBvcyhsLCBhKSB7XHJcblx0cmV0dXJuIGAke2wgKiBNYXRoLmNvcyhNYXRoLlBJIC8gYSl9ICR7bCAqIE1hdGguc2luKE1hdGguUEkgLyBhKX1gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaW5QaUJ5KGEpIHtcclxuXHRyZXR1cm4gTWF0aC5zaW4oTWF0aC5QSSAvIGEpO1xyXG59XHJcbmZ1bmN0aW9uIGNvc1BpQnkoYSkge1xyXG5cdHJldHVybiBNYXRoLmNvcyhNYXRoLlBJIC8gYSk7XHJcbn1cclxubGV0IHNoYXBlNmxvbmcgPSAxIC8gY29zUGlCeSg2KTtcclxuXHJcbmV4cG9ydCBjb25zdCBzaGFwZTZzdmcgPSB7XHJcblx0UjogYE0gMCAwIEwgMSAwIEwgJHtkb3RQb3Moc2hhcGU2bG9uZywgNil9IEwgJHtkb3RQb3MoMSwgMyl9IFpgLFxyXG5cdEM6IGBNIDAgMCBMIDEgMCBBIDEgMSAwIDAgMSAke2RvdFBvcygxLCAzKX0gWmAsXHJcblx0UzogYE0gMCAwIEwgMC42IDAgTCAke2RvdFBvcyhzaGFwZTZsb25nLCA2KX0gTCAke2RvdFBvcygwLjYsIDMpfSBaYCxcclxuXHRXOiBgTSAwIDAgTCAwLjYgMCBMICR7ZG90UG9zKHNoYXBlNmxvbmcsIDYpfSBMICR7ZG90UG9zKDEsIDMpfSBaYCxcclxuXHRcIi1cIjogXCJNIDAgMFwiLFxyXG59XHJcblxyXG5cclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInJob21idXNcIixcclxuXHRjb2RlOiBcIkJcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHRcdGJlZ2luKHsgc2l6ZTogMS4yLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0Y29uc3QgcmFkID0gMC4wMDE7XHJcblx0XHQvLyB3aXRoIHJvdW5kZWQgYm9yZGVyc1xyXG5cdFx0Y29udGV4dC5hcmNUbygwLCAxLCAxLCAwLCByYWQpO1xyXG5cdFx0Y29udGV4dC5hcmNUbygxLCAwLCAwLCAwLCByYWQpO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwicGx1c1wiLFxyXG5cdGNvZGU6IFwiUFwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXc6IFwiTSAwIDAgTCAxLjEgMCAxLjEgMC41IDAuNSAwLjUgMC41IDEuMSAwIDEuMSB6XCIsXHJcblx0dGllcjogMyxcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJzYXdcIixcclxuXHRjb2RlOiBcIlpcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHRcdGJlZ2luKHsgc2l6ZTogMS4xLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0Y29uc3QgaW5uZXIgPSAwLjU7XHJcblx0XHRjb250ZXh0LmxpbmVUbyhpbm5lciwgMCk7XHJcblx0XHRjb250ZXh0LmJlemllckN1cnZlVG8oaW5uZXIsIDAuMywgMSwgMC4zLCAxLCAwKTtcclxuXHRcdGNvbnRleHQuYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0MSxcclxuXHRcdFx0aW5uZXIsXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMiAqIDAuOSxcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQyICogMC45LFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDFfMixcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQxXzJcclxuXHRcdCk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZShNYXRoLlBJIC8gNCk7XHJcblx0XHRjb250ZXh0LmJlemllckN1cnZlVG8oaW5uZXIsIDAuMywgMSwgMC4zLCAxLCAwKTtcclxuXHRcdGNvbnRleHQuYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0MSxcclxuXHRcdFx0aW5uZXIsXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMiAqIDAuOSxcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQyICogMC45LFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDFfMixcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQxXzJcclxuXHRcdCk7XHJcblx0fSxcclxuXHR0aWVyOiAzLFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInN1blwiLFxyXG5cdGNvZGU6IFwiVVwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdHNwYXduQ29sb3I6IFwieWVsbG93XCIsXHJcblx0ZHJhdyh7IGRpbXMsIGlubmVyRGltcywgbGF5ZXIsIHF1YWQsIGNvbnRleHQsIGNvbG9yLCBiZWdpbiB9KSB7XHJcblx0XHRiZWdpbih7IHNpemU6IDEuMywgcGF0aDogdHJ1ZSwgemVybzogdHJ1ZSB9KTtcclxuXHRcdGNvbnN0IFBJID0gTWF0aC5QSTtcclxuXHRcdGNvbnN0IFBJMyA9ICgoUEkgKiAzKSAvIDgpICogMC43NTtcclxuXHRcdGNvbnN0IGMgPSAxIC8gTWF0aC5jb3MoTWF0aC5QSSAvIDgpO1xyXG5cdFx0Y29uc3QgYiA9IGMgKiBNYXRoLnNpbihNYXRoLlBJIC8gOCk7XHJcblxyXG5cdFx0Y29udGV4dC5tb3ZlVG8oMCwgMCk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZShNYXRoLlBJIC8gMik7XHJcblx0XHRjb250ZXh0LmFyYyhjLCAwLCBiLCAtUEksIC1QSSArIFBJMyk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZSgtTWF0aC5QSSAvIDQpO1xyXG5cdFx0Y29udGV4dC5hcmMoYywgMCwgYiwgLVBJIC0gUEkzLCAtUEkgKyBQSTMpO1xyXG5cdFx0Y29udGV4dC5yb3RhdGUoLU1hdGguUEkgLyA0KTtcclxuXHRcdGNvbnRleHQuYXJjKGMsIDAsIGIsIFBJIC0gUEkzLCBQSSk7XHJcblx0fSxcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJsZWFmXCIsXHJcblx0Y29kZTogXCJGXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0ZHJhdzogXCJNIDAgMCB2IDAuNSBhIDAuNSAwLjUgMCAwIDAgMC41IDAuNSBoIDAuNSB2IC0wLjUgYSAwLjUgMC41IDAgMCAwIC0wLjUgLTAuNSB6XCIsXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwiZGlhbW9uZFwiLFxyXG5cdGNvZGU6IFwiRFwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXc6IFwiTSAwIDAgbCAwIDAuNSAwLjUgMC41IDAuNSAwIDAgLTAuNSAtMC41IC0wLjUgelwiLFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcIm1pbGxcIixcclxuXHRjb2RlOiBcIk1cIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3OiBcIk0gMCAwIEwgMCAxIDEgMSBaXCIsXHJcbn0pO1xyXG5cclxuLy8gcmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcbi8vICAgICBpZDogXCJoYWxmbGVhZlwiLFxyXG4vLyAgICAgY29kZTogXCJIXCIsXHJcbi8vICAgICAuLi5jdXN0b21EZWZhdWx0cyxcclxuLy8gICAgIGRyYXc6IFwiMTAwIE0gMCAwIEwgMCAxMDAgQSA0NSA0NSAwIDAgMCAzMCAzMCBBIDQ1IDQ1IDAgMCAwIDEwMCAwIFpcIixcclxuLy8gfSlcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInlpbnlhbmdcIixcclxuXHRjb2RlOiBcIllcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHQvLyBkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHQvLyAgICAgYmVnaW4oeyBzaXplOiAxLygwLjUrTWF0aC5TUVJUMV8yKSwgcGF0aDogdHJ1ZSB9KTtcclxuXHJcblx0Ly8gICAgIC8qKiBAdHlwZXtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9ICogL1xyXG5cdC8vICAgICBsZXQgY3R4ID0gY29udGV4dDtcclxuXHJcblx0Ly8gICAgIHdpdGggKGN0eCkgeyB3aXRoIChNYXRoKSB7XHJcblx0Ly8gICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vICAgICAvLyBkcmF3IG1vc3RseSBpbiBbMCwxXXhbMCwxXSBzcXVhcmVcclxuXHQvLyAgICAgLy8gZHJhdzogXCIxMDAgTSAwIDUwIEEgNTAgNTAgMCAxIDEgODUgODUgQSAxMjEgMTIxIDAgMCAxIC04NSA4NSBBIDUwIDUwIDAgMCAwIDAgNTBcIixcclxuXHQvLyAgICAgbW92ZVRvKDAsIDAuNSk7XHJcblx0Ly8gICAgIGFyYygwLjUsIDAuNSwgMC41LCBQSSwgUEkvNClcclxuXHQvLyAgICAgYXJjKDAsIDAsIDAuNStTUVJUMV8yLCBQSS80LCBQSS80K1BJLzIsIDApXHJcblx0Ly8gICAgIGFyYygtMC41LCAwLjUsIDAuNSwgMypQSS80LCAwLCAxKVxyXG5cclxuXHQvLyAgICAgbW92ZVRvKDAuNiwgMC41KVxyXG5cdC8vICAgICBhcmMoMC41LCAwLjUsIDAuMSwgMCwgMipQSSlcclxuXHQvLyAgICAgfX1cclxuXHJcblx0Ly8gfSxcclxuXHRkcmF3OlxyXG5cdFx0XCIxMjAuNzEgTSAwIDUwIEEgNTAgNTAgMCAxIDEgODUuMzU1IDg1LjM1NSBBIDEyMC43MSAxMjAuNzEgMCAwIDEgLTg1LjM1NSA4NS4zNTUgQSA1MCA1MCAwIDAgMCAwIDUwIFogTSA0MCA1MCBBIDEwIDEwIDAgMSAwIDQwIDQ5Ljk5IFpcIixcclxuXHR0aWVyOiA0LFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcIm9jdGFnb25cIixcclxuXHRjb2RlOiBcIk9cIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3OiBcIk0gMCAwIEwgMCAxIDAuNDE0MiAxIDEgMC40MTQyIDEgMCBaXCIsXHJcbn0pO1xyXG5cclxuXHRcclxuXHQqL1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN6TGF5ZXIge1xyXG5cdGN1dHM6ICh7XHJcblx0XHRzaGFwZTogY3V0U2hhcGUsXHJcblx0XHRmcm9tOiByb3RhdGlvbjI0LCB0bzogcm90YXRpb24yNCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHR9KVtdO1xyXG5cdHF1YWRzOiAoe1xyXG5cdFx0c2hhcGU6IHF1YWRTaGFwZSxcclxuXHRcdGZyb206IHJvdGF0aW9uMjQsIHRvOiByb3RhdGlvbjI0LFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdH0pW107XHJcblx0YXJlYXM6ICh7XHJcblx0XHRzaGFwZTogYXJlYVNoYXBlLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0ZnJvbTogcm90YXRpb24yNCwgdG86IHJvdGF0aW9uMjQsXHJcblx0fSlbXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTekxheWVyQ3V0IHtcclxuXHRzaGFwZTogY3V0U2hhcGUgPSAnbGluZSc7XHJcblx0Y29sb3I6IGNvbG9yID0gJ2JsYWNrJztcclxuXHJcblx0ZnJvbTogcm90YXRpb24yNCA9IDA7IHRvOiByb3RhdGlvbjI0ID0gMDtcclxuXHRjb25zdHJ1Y3Rvcihzb3VyY2U6IFBpY2tWYWx1ZXM8U3pMYXllckN1dD4pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgc291cmNlKTtcclxuXHR9XHJcblx0Y2xvbmUoKSB7IHJldHVybiBuZXcgU3pMYXllckN1dCh0aGlzKTsgfVxyXG5cdGdldCBzbWFsbFJhZGl1cygpIHtcclxuXHRcdHJldHVybiAwLjAwMDE7XHJcblx0fVxyXG5cdHBhdGhJbnNpZGUoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0c3dpdGNoICh0aGlzLnNoYXBlKSB7XHJcblx0XHRcdGNhc2UgJ2xpbmUnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMC41LCB0aGlzLmZyb20pO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKHRoaXMuc21hbGxSYWRpdXMsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHR0aHJvdyBsb2codGhpcyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0cGF0aE91dHNpemUoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0c3dpdGNoICh0aGlzLnNoYXBlKSB7XHJcblx0XHRcdGNhc2UgJ2xpbmUnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IodGhpcy5zbWFsbFJhZGl1cywgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjUsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHR0aHJvdyBsb2codGhpcyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0SGFzaCgpOiBzdHJpbmcge1xyXG5cdFx0Ly8gZml4bWVcclxuXHRcdHJldHVybiBgYDtcclxuXHR9XHJcblx0c3RhdGljIGZyb21TaG9ydEtleShlOiBzdHJpbmcpOiBTekxheWVyQ3V0IHtcclxuXHRcdC8vIGZpeG1lXHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJDdXQoe30pO1xyXG5cdH1cclxufVxyXG5cclxudHlwZSBQaWNrVmFsdWVzPFQ+ID0ge1xyXG5cdFtrIGluIGtleW9mIFQgYXMgVFtrXSBleHRlbmRzICgoLi4uYXJnczogYW55KSA9PiBhbnkpID8gbmV2ZXIgOiBrXT86IFRba11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN6TGF5ZXJRdWFkIHtcclxuXHRzaGFwZTogcXVhZFNoYXBlID0gJ2NpcmNsZSc7XHJcblx0Y29sb3I6IGNvbG9yID0gJ25vbmUnO1xyXG5cclxuXHRmcm9tOiByb3RhdGlvbjI0ID0gMDsgdG86IHJvdGF0aW9uMjQgPSAwO1xyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZTogUGlja1ZhbHVlczxTekxheWVyUXVhZD4pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgc291cmNlKTtcclxuXHRcdGlmIChjb25maWcuZGlzYWJsZVF1YWRDb2xvcnMpIHtcclxuXHRcdFx0dGhpcy5jb2xvciA9ICdub25lJztcclxuXHRcdH1cclxuXHR9XHJcblx0Y2xvbmUoKSB7IHJldHVybiBuZXcgU3pMYXllclF1YWQodGhpcyk7IH1cclxuXHRvdXRlclBhdGgoY3R4OiBTekNvbnRleHQyRCwgbGF5ZXI6IFN6TGF5ZXIpIHtcclxuXHRcdHN3aXRjaCAodGhpcy5zaGFwZSkge1xyXG5cdFx0XHRjYXNlICdjaXJjbGUnOiB7XHJcblx0XHRcdFx0Y3R4LmFyYygwLCAwLCAxLCB0aGlzLmZyb20sIHRoaXMudG8pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXNlICdzcXVhcmUnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMSwgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUihNYXRoLlNRUlQyLCAodGhpcy5mcm9tICsgdGhpcy50bykgLyAyKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUigxLCB0aGlzLnRvKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FzZSAnc3Rhcic6IHtcclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjYsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoTWF0aC5TUVJUMiwgKHRoaXMuZnJvbSArIHRoaXMudG8pIC8gMik7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMC42LCB0aGlzLnRvKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdGN0eC5zYXZlZChjdHggPT4ge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuc2hhcGUgPT0gJ2NvdmVyJykge1xyXG5cdFx0XHRcdFx0XHRjdHguc2NhbGUoMSAvIGxheWVyLmxheWVyU2NhbGUoKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFN6SW5mby5xdWFkLmJ5TmFtZVt0aGlzLnNoYXBlXS5wYXRoIShjdHgsIHRoaXMpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXRIYXNoKCk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gYCR7U3pJbmZvLnF1YWQuYnlOYW1lW3RoaXMuc2hhcGVdLmNvZGVcclxuXHRcdFx0fSR7U3pJbmZvLmNvbG9yLmJ5TmFtZVt0aGlzLmNvbG9yXS5jb2RlXHJcblx0XHRcdH0ke1N6SW5mby5uVG9DaGFyW3RoaXMuZnJvbV1cclxuXHRcdFx0fSR7U3pJbmZvLm5Ub0NoYXJbdGhpcy50b11cclxuXHRcdFx0fWBcclxuXHR9XHJcblx0c3RhdGljIGZyb21TaG9ydEtleShlOiBzdHJpbmcpOiBTekxheWVyUXVhZCB7XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJRdWFkKHtcclxuXHRcdFx0c2hhcGU6IFN6SW5mby5xdWFkLmJ5Q2hhcltlWzBdXS5uYW1lLFxyXG5cdFx0XHRjb2xvcjogU3pJbmZvLmNvbG9yLmJ5Q2hhcltlWzFdXS5uYW1lLFxyXG5cdFx0XHRmcm9tOiBTekluZm8uY2hhclRvTltlWzJdXSxcclxuXHRcdFx0dG86IFN6SW5mby5jaGFyVG9OW2VbM11dLFxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFN6TGF5ZXJBcmVhIHtcclxuXHRzaGFwZTogYXJlYVNoYXBlID0gJ3NlY3Rvcic7XHJcblx0Y29sb3I6IGNvbG9yID0gJ2JsYWNrJztcclxuXHJcblx0ZnJvbTogcm90YXRpb24yNCA9IDA7IHRvOiByb3RhdGlvbjI0ID0gMDtcclxuXHRjb25zdHJ1Y3Rvcihzb3VyY2U6IFBpY2tWYWx1ZXM8U3pMYXllckFyZWE+KSB7XHJcblx0XHRPYmplY3QuYXNzaWduKHRoaXMsIHNvdXJjZSk7XHJcblx0fVxyXG5cdGNsb25lKCkgeyByZXR1cm4gbmV3IFN6TGF5ZXJBcmVhKHRoaXMpOyB9XHJcblx0b3V0ZXJQYXRoKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdHN3aXRjaCAodGhpcy5zaGFwZSkge1xyXG5cdFx0XHRjYXNlICd3aG9sZSc6IHtcclxuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0Y3R4LmFyYygwLCAwLCA1LCAwLCAyNCk7XHJcblx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXNlICdzZWN0b3InOiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZnJvbSA9PSAwICYmIHRoaXMudG8gPT0gMjQpIHtcclxuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdGN0eC5hcmMoMCwgMCwgNSwgMCwgMjQpO1xyXG5cdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdGN0eC5tb3ZlVG8oMCwgMCk7XHJcblx0XHRcdFx0Y3R4LmFyYygwLCAwLCA1LCB0aGlzLmZyb20sIHRoaXMudG8pO1xyXG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdHRocm93IGxvZyh0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRjbGlwKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMub3V0ZXJQYXRoKGN0eCk7XHJcblx0XHRjdHguY2xpcCgpO1xyXG5cdH1cclxuXHRmaWxsKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMub3V0ZXJQYXRoKGN0eCk7XHJcblx0XHRjdHguZmlsbFN0eWxlID0gU3pJbmZvLmNvbG9yLmJ5TmFtZVt0aGlzLmNvbG9yXS5zdHlsZTtcclxuXHRcdGN0eC5maWxsKCk7XHJcblx0fVxyXG5cdGdldEhhc2goKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBgJHtTekluZm8uYXJlYS5ieU5hbWVbdGhpcy5zaGFwZV0uY29kZVxyXG5cdFx0XHR9JHtTekluZm8uY29sb3IuYnlOYW1lW3RoaXMuY29sb3JdLmNvZGVcclxuXHRcdFx0fSR7U3pJbmZvLm5Ub0NoYXJbdGhpcy5mcm9tXVxyXG5cdFx0XHR9JHtTekluZm8ublRvQ2hhclt0aGlzLnRvXVxyXG5cdFx0XHR9YFxyXG5cdH1cclxuXHRzdGF0aWMgZnJvbVNob3J0S2V5KGU6IHN0cmluZyk6IFN6TGF5ZXJBcmVhIHtcclxuXHRcdHJldHVybiBuZXcgU3pMYXllckFyZWEoe1xyXG5cdFx0XHRzaGFwZTogU3pJbmZvLmFyZWEuYnlDaGFyW2VbMF1dLm5hbWUsXHJcblx0XHRcdGNvbG9yOiBTekluZm8uY29sb3IuYnlDaGFyW2VbMV1dLm5hbWUsXHJcblx0XHRcdGZyb206IFN6SW5mby5jaGFyVG9OW2VbMl1dLFxyXG5cdFx0XHR0bzogU3pJbmZvLmNoYXJUb05bZVszXV0sXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5cclxuY29uc3QgdGVzdFRlbXBsYXRlOiBJU3pMYXllciA9IHtcclxuXHRjdXRzOiBbXHJcblx0XHR7IGZyb206IDEwLCB0bzogMTAsIHNoYXBlOiAnbGluZScsIGNvbG9yOiAnYmx1ZScgfSxcclxuXHRcdHsgZnJvbTogMTQsIHRvOiAxNCwgc2hhcGU6ICdsaW5lJywgY29sb3I6ICdibHVlJyB9LFxyXG5cdF0sXHJcblx0cXVhZHM6IFtcclxuXHRcdHsgc2hhcGU6ICdzcXVhcmUnLCBjb2xvcjogJ2dyZWVuJywgZnJvbTogMiwgdG86IDQgfSxcclxuXHRcdHsgc2hhcGU6ICdjaXJjbGUnLCBjb2xvcjogJ3BpbmsnLCBmcm9tOiA1LCB0bzogMTkgfSxcclxuXHRcdHsgc2hhcGU6ICdzcXVhcmUnLCBjb2xvcjogJ2dyZWVuJywgZnJvbTogMjAsIHRvOiAyMiB9LFxyXG5cdF0sXHJcblx0YXJlYXM6IFtcclxuXHRcdHsgc2hhcGU6ICdzZWN0b3InLCBjb2xvcjogJ3JlZCcsIGZyb206IDExLCB0bzogMTMgfSxcclxuXHRdLFxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTekxheWVyIGltcGxlbWVudHMgSVN6TGF5ZXIge1xyXG5cdGxheWVySW5kZXggPSAwO1xyXG5cdGN1dHM6IFN6TGF5ZXJDdXRbXSA9IFtdO1xyXG5cdHF1YWRzOiBTekxheWVyUXVhZFtdID0gW107XHJcblx0YXJlYXM6IFN6TGF5ZXJBcmVhW10gPSBbXTtcclxuXHJcblxyXG5cdHN0YXRpYyBjcmVhdGVUZXN0KCkge1xyXG5cdFx0bGV0IGwgPSBuZXcgU3pMYXllcih0ZXN0VGVtcGxhdGUpO1xyXG5cdFx0bC5hcmVhcy5tYXAoZSA9PiB7XHJcblx0XHRcdGxldCByID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogODtcclxuXHRcdFx0ZS5mcm9tICs9IHI7XHJcblx0XHRcdGUudG8gKz0gcjtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc29sZS5lcnJvcigndGVzdCBsYXllcicsIGwpO1xyXG5cdFx0cmV0dXJuIGw7XHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3Rvcihzb3VyY2U/OiBQaWNrVmFsdWVzPElTekxheWVyPiwgbGF5ZXJJbmRleD86IG51bWJlcikge1xyXG5cdFx0aWYgKHNvdXJjZSkge1xyXG5cdFx0XHR0aGlzLmN1dHMgPSAoc291cmNlLmN1dHMgPz8gW10pLm1hcChlID0+IG5ldyBTekxheWVyQ3V0KGUpKTtcclxuXHRcdFx0dGhpcy5xdWFkcyA9IChzb3VyY2UucXVhZHMgPz8gW10pLm1hcChlID0+IG5ldyBTekxheWVyUXVhZChlKSk7XHJcblx0XHRcdHRoaXMuYXJlYXMgPSAoc291cmNlLmFyZWFzID8/IFtdKS5tYXAoZSA9PiBuZXcgU3pMYXllckFyZWEoZSkpO1xyXG5cdFx0XHRpZiAoKHNvdXJjZSBhcyBTekxheWVyKS5sYXllckluZGV4KSB7XHJcblx0XHRcdFx0dGhpcy5sYXllckluZGV4ID0gKHNvdXJjZSBhcyBTekxheWVyKS5sYXllckluZGV4O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobGF5ZXJJbmRleCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMubGF5ZXJJbmRleCA9IGxheWVySW5kZXg7XHJcblx0XHR9XHJcblx0XHRpZiAoY29uZmlnLmRpc2FibGVDdXRzKSB0aGlzLmN1dHMgPSBbXTtcclxuXHRcdHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpO1xyXG5cdH1cclxuXHJcblx0bGF5ZXJTY2FsZShsYXllckluZGV4PzogbnVtYmVyKSB7XHJcblx0XHRsYXllckluZGV4ID8/PSB0aGlzLmxheWVySW5kZXg7XHJcblx0XHRyZXR1cm4gMC45IC0gMC4yMiAqIGxheWVySW5kZXg7XHJcblx0fVxyXG5cdGRyYXdDZW50ZXJlZExheWVyU2NhbGVkKGN0eDogU3pDb250ZXh0MkQsIGxheWVySW5kZXg/OiBudW1iZXIpIHtcclxuXHRcdGN0eC5zYXZlZChjdHggPT4ge1xyXG5cdFx0XHRjdHguc2NhbGUodGhpcy5sYXllclNjYWxlKGxheWVySW5kZXgpKTtcclxuXHRcdFx0dGhpcy5kcmF3Q2VudGVyZWROb3JtYWxpemVkKGN0eCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGRyYXdDZW50ZXJlZE5vcm1hbGl6ZWQoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Y3R4LnNhdmVkKGN0eCA9PiB7XHJcblx0XHRcdHRoaXMuY2xpcFNoYXBlcyhjdHgpO1xyXG5cdFx0XHQvLyB0aGlzLnF1YWRzLmZvckVhY2gocSA9PiBjdHguc2F2ZWQoY3R4ID0+IHRoaXMuZmlsbFF1YWQocSwgY3R4KSkpO1xyXG5cclxuXHRcdFx0dGhpcy5jdXRzLmZvckVhY2goYyA9PiBjdHguc2F2ZWQoY3R4ID0+IHRoaXMuc3Ryb2tlQ3V0KGMsIGN0eCkpKTtcclxuXHJcblx0XHRcdHRoaXMuYXJlYXMuZm9yRWFjaChhID0+IGN0eC5zYXZlZChjdHggPT4gdGhpcy5maWxsQXJlYShhLCBjdHgpKSk7XHJcblx0XHR9KTtcclxuXHRcdGN0eC5zYXZlZChjdHggPT4gdGhpcy5kcmF3UXVhZE91dGxpbmUoY3R4LCB0cnVlKSk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRzdHJva2VDdXQoY3V0OiBTekxheWVyQ3V0LCBjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRjdHgubGluZVdpZHRoID0gMC4wNTtcclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9IGN1dC5jb2xvcjtcclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHJcblx0XHRpZiAoY3V0LnNoYXBlID09ICdsaW5lJykge1xyXG5cdFx0XHRjdHgucm90YXRlKGN1dC5mcm9tKTtcclxuXHRcdFx0Y3R4Lm1vdmVUbygwLCAwKTtcclxuXHRcdFx0Y3R4LmxpbmVUbygwLCAxKTtcclxuXHRcdFx0Y3R4LnN0cm9rZSgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbG9nKCdiYWQgY3V0JywgY3V0KTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cdGZpbGxRdWFkKHF1YWQ6IFN6TGF5ZXJRdWFkLCBjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRjdHguZmlsbFN0eWxlID0gU3pJbmZvLmNvbG9yLmJ5TmFtZVtxdWFkLmNvbG9yXS5zdHlsZTtcclxuXHRcdGlmIChxdWFkLmNvbG9yID09ICdjb3ZlcicpIFtcclxuXHRcdFx0Ly8gY3R4LmN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3V0J1xyXG5cdFx0XVxyXG5cclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdGN0eC5tb3ZlVG8oMCwgMCk7XHJcblx0XHRxdWFkLm91dGVyUGF0aChjdHgsIHRoaXMpO1xyXG5cdFx0Y3R4LmZpbGwoKTtcclxuXHR9XHJcblxyXG5cdGZpbGxBcmVhKGFyZWE6IFN6TGF5ZXJBcmVhLCBjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRjdHgubGluZVdpZHRoID0gMC4wNTtcclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9IGN0eC5maWxsU3R5bGUgPSBTekluZm8uY29sb3IuYnlOYW1lW2FyZWEuY29sb3JdLnN0eWxlO1xyXG5cclxuXHRcdGFyZWEuY2xpcChjdHgpO1xyXG5cdFx0Y3R4LmZpbGwoKTtcclxuXHR9XHJcblxyXG5cdGZ1bGxRdWFkUGF0aChjdHg6IFN6Q29udGV4dDJELCB3aXRoQ3V0cz86IGJvb2xlYW4pIHtcclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5xdWFkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgcHJldiA9IGkgPiAwID8gdGhpcy5xdWFkc1tpIC0gMV0gOiB0aGlzLnF1YWRzLnNsaWNlKC0xKVswXTtcclxuXHRcdFx0bGV0IHF1YWQgPSB0aGlzLnF1YWRzW2ldO1xyXG5cdFx0XHRpZiAod2l0aEN1dHMgfHwgcXVhZC5mcm9tICE9IHByZXYudG8gJSAyNCkgY3R4LmxpbmVUbygwLCAwKTtcclxuXHRcdFx0cXVhZC5vdXRlclBhdGgoY3R4LCB0aGlzKTtcclxuXHRcdH1cclxuXHRcdGN0eC5jbG9zZVBhdGgoKTtcclxuXHR9XHJcblxyXG5cdGRyYXdRdWFkT3V0bGluZShjdHg6IFN6Q29udGV4dDJELCB3aXRoQ3V0cz86IGJvb2xlYW4pIHtcclxuXHRcdHRoaXMuZnVsbFF1YWRQYXRoKGN0eCwgd2l0aEN1dHMpO1xyXG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDAuMDU7XHJcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSAnb3JhbmdlJztcclxuXHRcdGN0eC5zdHJva2UoKTtcclxuXHR9XHJcblxyXG5cdGNsaXBTaGFwZXMoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0dGhpcy5mdWxsUXVhZFBhdGgoY3R4KTtcclxuXHRcdGN0eC5jbGlwKCk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRjbG9uZSgpIHtcclxuXHRcdHJldHVybiBuZXcgU3pMYXllcih0aGlzKTtcclxuXHR9XHJcblx0aXNOb3JtYWxpemVkKCk6IGJvb2xlYW4ge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnF1YWRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBuZXh0ID0gdGhpcy5xdWFkc1tpXTtcclxuXHRcdFx0bGV0IHByZXYgPSB0aGlzLnF1YWRzW2kgLSAxXSB8fCB0aGlzLnF1YWRzW3RoaXMucXVhZHMubGVuZ3RoIC0gMV07XHJcblx0XHRcdGlmIChuZXh0LmZyb20gPCAwIHx8IG5leHQuZnJvbSA+IDI0KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChuZXh0LmZyb20gPj0gbmV4dC50bykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAoaSA9PSAwKSB7XHJcblx0XHRcdFx0aWYgKHByZXYudG8gPiAyNCAmJiBwcmV2LnRvICUgMjQgPiBuZXh0LmZyb20pIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAocHJldi50byA+IG5leHQuZnJvbSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJlYXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IG5leHQgPSB0aGlzLmFyZWFzW2ldO1xyXG5cdFx0XHRsZXQgcHJldiA9IHRoaXMuYXJlYXNbaSAtIDFdIHx8IHRoaXMuYXJlYXNbdGhpcy5hcmVhcy5sZW5ndGggLSAxXTtcclxuXHRcdFx0aWYgKG5leHQuZnJvbSA+IDI0KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChuZXh0LmZyb20gPj0gbmV4dC50bykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAoaSA9PSAwKSB7XHJcblx0XHRcdFx0aWYgKHByZXYudG8gPiAyNCAmJiBwcmV2LnRvICUgMjQgPiBuZXh0LmZyb20pIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAocHJldi50byA+IG5leHQuZnJvbSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChwcmV2LnRvICUgMjQgPT0gbmV4dC5mcm9tICYmIHByZXYuY29sb3IgPT0gbmV4dC5jb2xvcikge1xyXG5cdFx0XHRcdGlmIChwcmV2ICE9IG5leHQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRpZiAobmV4dC5mcm9tICE9IDApIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gZml4bWU6IGN1dHMgY2hlY2s7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdG5vcm1hbGl6ZSgpOiB0aGlzIHtcclxuXHRcdGlmICh0aGlzLmlzTm9ybWFsaXplZCgpKSByZXR1cm4gdGhpcztcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5xdWFkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgcSA9IHRoaXMucXVhZHNbaV07XHJcblx0XHRcdGlmIChxLmZyb20gPiBxLnRvKSB7IHRoaXMucXVhZHMuc3BsaWNlKGksIDEpOyBpLS07IGNvbnRpbnVlOyB9XHJcblx0XHRcdGlmIChxLmZyb20gPiAyNCkgeyBxLmZyb20gLT0gMjQ7IHEudG8gLT0gMjQ7IH1cclxuXHRcdH1cclxuXHRcdHRoaXMucXVhZHMuc29ydCgoYSwgYikgPT4gYS5mcm9tIC0gYi5mcm9tKTtcclxuXHJcblxyXG5cdFx0bGV0IHBsYWNlcyA9IEFycmF5PHF1YWRTaGFwZSB8ICcnPigyNCkuZmlsbCgnJyk7XHJcblx0XHRsZXQgcGFpbnRzID0gQXJyYXk8Y29sb3IgfCAnJz4oMjQpLmZpbGwoJycpO1xyXG5cdFx0Zm9yIChsZXQgcSBvZiB0aGlzLnF1YWRzKSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSBxLmZyb207IGkgPCBxLnRvOyBpKyspIHtcclxuXHRcdFx0XHRwbGFjZXNbaSAlIDI0XSA9IHEuc2hhcGU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGEgb2YgdGhpcy5hcmVhcykge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gYS5mcm9tOyBpIDwgYS50bzsgaSsrKSB7XHJcblx0XHRcdFx0cGFpbnRzW2kgJSAyNF0gPSBhLmNvbG9yO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIGlmICghcGxhY2VzW2ldKSBwYWludHNbaV0gPSAnJztcclxuXHJcblxyXG5cdFx0dGhpcy5hcmVhcyA9IFtdO1xyXG5cdFx0bGV0IGxhc3Q6IFN6TGF5ZXJBcmVhIHwgdW5kZWZpbmVkO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAyNDsgaSsrKSB7XHJcblx0XHRcdGlmICghcGFpbnRzW2ldKSBjb250aW51ZTtcclxuXHRcdFx0aWYgKGxhc3QgJiYgbGFzdC5jb2xvciA9PSBwYWludHNbaV0gJiYgbGFzdC50byA9PSBpKSB7XHJcblx0XHRcdFx0bGFzdC50bysrO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuYXJlYXMucHVzaChsYXN0ID0gbmV3IFN6TGF5ZXJBcmVhKHtcclxuXHRcdFx0XHRcdGNvbG9yOiBwYWludHNbaV0gYXMgY29sb3IsIGZyb206IGksIHRvOiBpICsgMSwgc2hhcGU6ICdzZWN0b3InLFxyXG5cdFx0XHRcdH0pKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuYXJlYXMubGVuZ3RoID4gMSkge1xyXG5cdFx0XHRpZiAodGhpcy5hcmVhc1t0aGlzLmFyZWFzLmxlbmd0aCAtIDFdLnRvICUgMjQgPT0gdGhpcy5hcmVhc1swXS5mcm9tKSB7XHJcblx0XHRcdFx0dGhpcy5hcmVhc1t0aGlzLmFyZWFzLmxlbmd0aCAtIDFdLnRvICs9IHRoaXMuYXJlYXNbMF0uZnJvbTtcclxuXHRcdFx0XHR0aGlzLmFyZWFzLnNwbGljZSgwLCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gZml4bWU6IGN1dHNcclxuXHRcdGlmICghdGhpcy5pc05vcm1hbGl6ZWQoKSkge1xyXG5cdFx0XHRPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgbGF5ZXI6IHRoaXMgfSk7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0xheWVyIGZhaWxlZCB0byBub3JtYWxpemUgcHJvcGVybHkhJywgdGhpcyk7XHJcblx0XHRcdGlmIChjb25maWcuZGVidWdCYWRMYXllcnMpIGRlYnVnZ2VyO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRpc0VtcHR5KCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucXVhZHMubGVuZ3RoID09IDA7XHJcblx0fVxyXG5cclxuXHRnZXRRdWFkQXRTZWN0b3IoczogbnVtYmVyKSB7XHJcblx0XHRsZXQgczEgPSAocyArIDAuNSkgJSAyNCwgczIgPSBzMSArIDI0O1xyXG5cdFx0cmV0dXJuIHRoaXMucXVhZHMuZmluZChxID0+XHJcblx0XHRcdChxLmZyb20gPCBzMSAmJiBxLnRvID4gczEpIHx8IChxLmZyb20gPCBzMiAmJiBxLnRvID4gczIpXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0Y2FuU3RhY2tXaXRoKHVwcGVyOiBTekxheWVyIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XHJcblx0XHRpZiAoIXVwcGVyKSByZXR1cm4gdHJ1ZTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMjQ7IGkrKykge1xyXG5cdFx0XHRsZXQgcTEgPSB0aGlzLmdldFF1YWRBdFNlY3RvcihpKTtcclxuXHRcdFx0bGV0IHEyID0gdXBwZXIuZ2V0UXVhZEF0U2VjdG9yKGkpO1xyXG5cdFx0XHRpZiAocTEgJiYgcTIpIHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRzdGFja1dpdGgodXBwZXI6IFN6TGF5ZXIgfCB1bmRlZmluZWQpOiBTekxheWVyIHtcclxuXHRcdGlmICghdXBwZXIpIHJldHVybiB0aGlzLmNsb25lKCk7XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRhcmVhczogdGhpcy5hcmVhcy5jb25jYXQodXBwZXIuYXJlYXMpLFxyXG5cdFx0XHRxdWFkczogdGhpcy5xdWFkcy5jb25jYXQodXBwZXIucXVhZHMpLFxyXG5cdFx0XHRjdXRzOiB0aGlzLmN1dHMuY29uY2F0KHVwcGVyLmN1dHMpLFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyb3RhdGUocm90OiByb3RhdGlvbjI0KSB7XHJcblx0XHR0aGlzLmFyZWFzLm1hcChlID0+IHsgZS5mcm9tICs9IHJvdDsgZS50byArPSByb3Q7IH0pO1xyXG5cdFx0dGhpcy5jdXRzLm1hcChlID0+IHsgZS5mcm9tICs9IHJvdDsgfSk7XHJcblx0XHR0aGlzLnF1YWRzLm1hcChlID0+IHsgZS5mcm9tICs9IHJvdDsgZS50byArPSByb3Q7IH0pO1xyXG5cdFx0cmV0dXJuIHRoaXMubm9ybWFsaXplKCk7XHJcblx0fVxyXG5cclxuXHJcblx0Y2xvbmVGaWx0ZXJlZEJ5UXVhZHJhbnRzKGluY2x1ZGVRdWFkcmFudHM6IG51bWJlcltdKSB7XHJcblx0XHRjb25zdCBnb29kID0gKG46IG51bWJlcikgPT4gaW5jbHVkZVF1YWRyYW50cy5pbmNsdWRlcygofn4oKG4gKyAwLjUpIC8gNikpICUgNCk7XHJcblx0XHRsZXQgYWxsb3dlZCA9IEFycmF5KDQ4KS5maWxsKDApLm1hcCgoZSwgaSkgPT4gZ29vZChpKSB8fCBnb29kKGkgLSAxKSk7XHJcblx0XHRmdW5jdGlvbiBjb252ZXJ0PFQgZXh0ZW5kcyBTekxheWVyQXJlYSB8IFN6TGF5ZXJDdXQgfCBTekxheWVyUXVhZD4ob2xkOiBUKTogVFtdIHtcclxuXHRcdFx0bGV0IGNsb25lID0gb2xkLmNsb25lKCkgYXMgVDtcclxuXHRcdFx0d2hpbGUgKCFhbGxvd2VkW2Nsb25lLmZyb21dICYmIGNsb25lLmZyb20gPCBjbG9uZS50bykgY2xvbmUuZnJvbSsrO1xyXG5cdFx0XHR3aGlsZSAoIWFsbG93ZWRbY2xvbmUudG9dICYmIGNsb25lLmZyb20gPCBjbG9uZS50bykgY2xvbmUudG8tLTtcclxuXHRcdFx0Ly8gaWYgKCFhbGxvd2VkW2Nsb25lLmZyb21dIHx8ICFhbGxvd2VkW2Nsb25lLnRvXSkgcmV0dXJuIFtdO1xyXG5cdFx0XHRpZiAoIShjbG9uZSBpbnN0YW5jZW9mIFN6TGF5ZXJDdXQpICYmIGNsb25lLmZyb20gPT0gY2xvbmUudG8pIHJldHVybiBbXTtcclxuXHRcdFx0cmV0dXJuIFtjbG9uZV07XHJcblx0XHRcdC8vZml4bWUgY3V0c1xyXG5cdFx0XHQvL2ZpeG1lIGN1dCBpbnRvIHR3b1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyKHtcclxuXHRcdFx0YXJlYXM6IHRoaXMuYXJlYXMuZmxhdE1hcChjb252ZXJ0KSxcclxuXHRcdFx0cXVhZHM6IHRoaXMucXVhZHMuZmxhdE1hcChjb252ZXJ0KSxcclxuXHRcdFx0Y3V0czogdGhpcy5jdXRzLmZsYXRNYXAoY29udmVydCksXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGNsb25lQXNDb3ZlcigpIHtcclxuXHRcdGZ1bmN0aW9uIGNvbnZlcnQocXVhZDogU3pMYXllclF1YWQpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBTekxheWVyUXVhZCh7XHJcblx0XHRcdFx0Y29sb3I6ICdjb3ZlcicsXHJcblx0XHRcdFx0c2hhcGU6ICdjb3ZlcicsXHJcblx0XHRcdFx0ZnJvbTogcXVhZC5mcm9tLCB0bzogcXVhZC50byxcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRxdWFkczogdGhpcy5xdWFkcy5mbGF0TWFwKGNvbnZlcnQpLFxyXG5cdFx0fSkucGFpbnQoJ2NvdmVyJykubm9ybWFsaXplKCk7XHJcblx0fVxyXG5cdHJlbW92ZUNvdmVyKCkge1xyXG5cdFx0dGhpcy5xdWFkcyA9IHRoaXMucXVhZHMuZmlsdGVyKGUgPT4gZS5zaGFwZSAhPSAnY292ZXInKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRmaWx0ZXJQYWludChwYWludDogKGNvbG9yIHwgbnVsbClbXSk6IChjb2xvciB8IG51bGwpW10ge1xyXG5cdFx0cmV0dXJuIHBhaW50Lm1hcCgoZSwgaSkgPT4ge1xyXG5cdFx0XHRsZXQgcXVhZCA9IHRoaXMuZ2V0UXVhZEF0U2VjdG9yKGkpO1xyXG5cdFx0XHRyZXR1cm4gcXVhZCAmJiBxdWFkLnNoYXBlID09ICdjb3ZlcicgPyBudWxsIDogZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRwYWludChwYWludDogKGNvbG9yIHwgbnVsbClbXSB8IGNvbG9yKSB7XHJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkocGFpbnQpKSBwYWludCA9IEFycmF5PGNvbG9yIHwgbnVsbD4oMjQpLmZpbGwocGFpbnQpO1xyXG5cdFx0cGFpbnQubWFwKChjb2xvciwgaSkgPT4ge1xyXG5cdFx0XHRpZiAoY29sb3IpIHtcclxuXHRcdFx0XHR0aGlzLmFyZWFzLnB1c2gobmV3IFN6TGF5ZXJBcmVhKHtcclxuXHRcdFx0XHRcdGNvbG9yLFxyXG5cdFx0XHRcdFx0ZnJvbTogaSwgdG86IGkgKyAxLFxyXG5cdFx0XHRcdFx0c2hhcGU6ICdzZWN0b3InLFxyXG5cdFx0XHRcdH0pKVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpOztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBmcm9tU2hhcGV6SGFzaChoYXNoOiBzdHJpbmcpIHtcclxuXHRcdGNvbnN0IGNvbG9yczogUmVjb3JkPHN0cmluZywgY29sb3I+ID0geyB1OiAnZ3JleScsIHI6ICdyZWQnLCBiOiAnYmx1ZScsIGc6ICdncmVlbicgfTtcclxuXHRcdGNvbnN0IHNoYXBlczogUmVjb3JkPHN0cmluZywgcXVhZFNoYXBlPiA9IHsgQzogJ2NpcmNsZScsIFI6ICdzcXVhcmUnLCBTOiAnc3RhcicsIH07XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRhcmVhczogaGFzaC5tYXRjaCgvLi4vZykhLm1hcCgocywgaSkgPT4ge1xyXG5cdFx0XHRcdGlmIChzWzBdID09ICctJykgcmV0dXJuIG51bGwgYXMgYW55IGFzIFN6TGF5ZXJBcmVhO1xyXG5cdFx0XHRcdHJldHVybiBuZXcgU3pMYXllckFyZWEoe1xyXG5cdFx0XHRcdFx0c2hhcGU6ICdzZWN0b3InLFxyXG5cdFx0XHRcdFx0Y29sb3I6IGNvbG9yc1tzWzFdXSxcclxuXHRcdFx0XHRcdGZyb206IGkgKiA2LFxyXG5cdFx0XHRcdFx0dG86IChpICsgMSkgKiA2LFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KS5maWx0ZXIoZSA9PiBlKSxcclxuXHRcdFx0cXVhZHM6IGhhc2gubWF0Y2goLy4uL2cpIS5tYXAoKHMsIGkpID0+IHtcclxuXHRcdFx0XHRpZiAoc1swXSA9PSAnLScpIHJldHVybiBudWxsIGFzIGFueSBhcyBTekxheWVyUXVhZDtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJRdWFkKHtcclxuXHRcdFx0XHRcdHNoYXBlOiBzaGFwZXNbc1swXV0sXHJcblx0XHRcdFx0XHRjb2xvcjogY29sb3JzW3NbMV1dLFxyXG5cdFx0XHRcdFx0ZnJvbTogaSAqIDYsXHJcblx0XHRcdFx0XHR0bzogKGkgKyAxKSAqIDYsXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pLmZpbHRlcihlID0+IGUpLFxyXG5cdFx0XHRjdXRzOiBbXSxcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdGdldEhhc2goKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBgcSEke3RoaXMucXVhZHMubWFwKGUgPT4gZS5nZXRIYXNoKCkpLmpvaW4oJycpXHJcblx0XHRcdH18YSEke3RoaXMuYXJlYXMubWFwKGUgPT4gZS5nZXRIYXNoKCkpLmpvaW4oJycpXHJcblx0XHRcdH18YyEke3RoaXMuY3V0cy5tYXAoZSA9PiBlLmdldEhhc2goKSkuam9pbignJylcclxuXHRcdFx0fWA7XHJcblx0fVxyXG5cdHN0YXRpYyBmcm9tU2hvcnRLZXkoa2V5OiBzdHJpbmcpOiBhbnkge1xyXG5cdFx0bGV0IGxheWVyID0gbmV3IFN6TGF5ZXIoKTtcclxuXHRcdGZvciAobGV0IHBhcnQgb2Yga2V5LnNwbGl0KCd8JykpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocGFydClcclxuXHRcdFx0aWYgKHBhcnQuc3RhcnRzV2l0aCgncSEnKSkge1xyXG5cdFx0XHRcdGxldCBzdHJzID0gcGFydC5zbGljZSgncSEnLmxlbmd0aCkubWF0Y2goLy4uLi4vZykgfHwgW107XHJcblx0XHRcdFx0bGF5ZXIucXVhZHMgPSBzdHJzLm1hcChlID0+IFN6TGF5ZXJRdWFkLmZyb21TaG9ydEtleShlKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHBhcnQuc3RhcnRzV2l0aCgnYSEnKSkge1xyXG5cdFx0XHRcdGxldCBzdHJzID0gcGFydC5zbGljZSgnYSEnLmxlbmd0aCkubWF0Y2goLy4uLi4vZykgfHwgW107XHJcblx0XHRcdFx0bGF5ZXIuYXJlYXMgPSBzdHJzLm1hcChlID0+IFN6TGF5ZXJBcmVhLmZyb21TaG9ydEtleShlKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHBhcnQuc3RhcnRzV2l0aCgnYyEnKSkge1xyXG5cdFx0XHRcdGxldCBzdHJzID0gcGFydC5zbGljZSgnYyEnLmxlbmd0aCkubWF0Y2goLy4uLi4vZykgfHwgW107XHJcblx0XHRcdFx0bGF5ZXIuY3V0cyA9IHN0cnMubWFwKGUgPT4gU3pMYXllckN1dC5mcm9tU2hvcnRLZXkoZSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbGF5ZXI7XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbG9nKC4uLmE6IGFueVtdKSB7XHJcblx0Y29uc29sZS5lcnJvciguLi5hKTtcclxuXHRmb3IgKGxldCBvIG9mIGEpXHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChKU09OLnN0cmluZ2lmeShvKSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyB0cnkge1xyXG4vLyBcdGhhc2hGb3JFYWNoKHRlc3RIYXNoLCAnc2hhcGVzJywgZHJhd1NoYXBlLCBzY3R4KTtcclxuLy8gXHRoYXNoRm9yRWFjaCh0ZXN0SGFzaCwgJ2N1dHMnLCBkcmF3Q3V0LCBzY3R4KTtcclxuLy8gXHRjbGlwU2hhcGVzKHRlc3RIYXNoLCBzY3R4KTtcclxuLy8gXHQvLyBoYXNoRm9yRWFjaCh0ZXN0SGFzaCwgJ2FyZWFzJywgZHJhd0FyZWEsIHNjdHgpO1xyXG4vLyB9IGNhdGNoIChlOiBhbnkpIHtcclxuLy8gXHRsb2coJ2Vycm9yOiAnLCBlLnN0YWNrKTtcclxuLy8gfVxyXG5cclxuLy8gY3R4Lmdsb2JhbEFscGhhID0gMC40O1xyXG4vLyBjdHguZmlsbFJlY3QoLTIsIC0yLCA0LCA0KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyBmdW5jdGlvbiBoYXNoRm9yRWFjaDxLIGV4dGVuZHMga2V5b2YgU3pEZWZpbml0aW9uPihcclxuLy8gXHRoYXNoOiBTekRlZmluaXRpb24sIGs6IEssXHJcbi8vIFx0bWFwcGVyOiAoZTogU3pEZWZpbml0aW9uW0tdWzBdLCBpOiBudW1iZXIsIGhhc2g6IFN6RGVmaW5pdGlvbiwgY3R4OiBTekNvbnRleHQyRCkgPT4gdm9pZCxcclxuLy8gXHRjdHg6IFN6Q29udGV4dDJELFxyXG4vLyApIHtcclxuLy8gXHRoYXNoW2tdLm1hcCgoZSwgaSkgPT4ge1xyXG4vLyBcdFx0Y3R4LnNhdmUoKTtcclxuLy8gXHRcdG1hcHBlcihlLCBpLCBoYXNoLCBjdHgpO1xyXG4vLyBcdFx0Y3R4LnJlc3RvcmUoKTtcclxuLy8gXHR9KTtcclxuLy8gfSJdfQ==