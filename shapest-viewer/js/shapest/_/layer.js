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
        color_1.list = [...colorWheelNameList, ...colorGreyNameList].map((name, i) => ({
            name, style: name, code: name[0],
        }));
        color_1.colorList = color_1.list.map(e => e.name);
        color_1.byName = Object.fromEntries(color_1.list.map(e => [e.name, e]));
        color_1.byChar = Object.fromEntries(color_1.list.map(e => [e.code, e]));
        function exampleLayer(color) {
            let i = 0;
            return new SzLayer({
                quads: [
                    { shape: 'circle', from: i, to: i += 6, color },
                    { shape: 'square', from: i, to: i += 6, color },
                    { shape: 'circle', from: i, to: i += 6, color },
                    { shape: 'square', from: i, to: i += 6, color },
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
        ];
        function exampleLayer(shape) {
            let i = 0;
            return new SzLayer({
                quads: [
                    { shape, from: i, to: i += 6, color: 'grey' },
                    { shape, from: i, to: i += 6, color: 'grey' },
                    { shape, from: i, to: i += 6, color: 'grey' },
                    { shape, from: i, to: i += 6, color: 'grey' },
                ]
            });
        }
        quad_1.exampleLayer = exampleLayer;
        quad_1.extraShapes = {
            clover(ctx) {
                // begin({ size: 1.3, path: true, zero: true });
                // const inner = 0.5;
                // const inner_center = 0.45;
                // context.lineTo(0, inner);
                // context.bezierCurveTo(0, 1, inner, 1, inner_center, inner_center);
                // context.bezierCurveTo(1, inner, 1, 0, inner, 0);
            },
            star8(ctx, { from, to }) {
                const r = 1.22 / 2, R = 1.22, d = (n) => from * (1 - n) + to * n;
                ctx
                    .lineToR(r, d(0))
                    .lineToR(R, d(0.25))
                    .lineToR(r, d(0.5))
                    .lineToR(R, d(0.75))
                    .lineToR(r, d(1));
            },
            rhombus(ctx) {
            },
            plus(ctx, { from, to }) {
                const r = 0.4, R = 1.0, d = (n) => from * (1 - n) + to * n;
                const rr = (r1, r2) => (r1 * r1 + r2 * r2) ** 0.5;
                const at = (a, b) => Math.atan2(b, a) / Math.PI * 2;
                const tor = (r, R) => [rr(r, R), d(at(r, R))];
                ctx
                    .lineToR(...tor(R, 0))
                    .lineToR(...tor(R, r))
                    .lineToR(...tor(r, r))
                    .lineToR(...tor(r, R))
                    .lineToR(...tor(0, R));
            },
            saw(ctx) {
            },
            sun(ctx) {
            },
            leaf(ctx) {
            },
            diamond(ctx) {
            },
            mill(ctx) {
            },
            halfleaf(ctx) {
            },
            yinyang(ctx) {
            },
            octagon(ctx) {
            },
        };
        Object.entries(quad_1.extraShapes).map(([k, v]) => quad_1.list.push({ name: k }));
        quad_1.quadList = quad_1.list.map(e => e.name);
    })(quad = SzInfo.quad || (SzInfo.quad = {}));
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
}
export class SzLayerQuad {
    shape = 'circle';
    color = 'black';
    from = 0;
    to = 0;
    constructor(source) {
        Object.assign(this, source);
    }
    outerPath(ctx) {
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
                if (SzInfo.quad.extraShapes[this.shape]) {
                    SzInfo.quad.extraShapes[this.shape](ctx, this);
                    return;
                }
                throw log(this);
            }
        }
    }
}
export class SzLayerArea {
    shape = 'whole';
    color = 'black';
    from = 0;
    to = 0;
    constructor(source) {
        Object.assign(this, source);
    }
    outerPath(ctx) {
        switch (this.shape) {
            case 'whole': {
                ctx.beginPath();
                ctx.arc(0, 0, 5, 0, 24);
                ctx.closePath();
                return;
            }
            case 'sector': {
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
        ctx.fillStyle = this.color;
        ctx.fill();
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
        { shape: 'sector', color: '#ff0000', from: 11, to: 13 },
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
        if (layerIndex) {
            this.layerIndex = layerIndex;
        }
    }
    drawCenteredLayerScaled(ctx, layerIndex) {
        layerIndex ??= this.layerIndex;
        let scale = 1 - 0.22 * layerIndex;
        ctx.saved(ctx => {
            ctx.scale(scale);
            this.drawCenteredNormalized(ctx);
        });
    }
    drawCenteredNormalized(ctx) {
        ctx.saved(ctx => {
            this.clipShapes(ctx);
            this.quads.forEach(q => ctx.saved(ctx => this.fillQuad(q, ctx)));
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
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = ctx.fillStyle = quad.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        quad.outerPath(ctx);
        ctx.fill();
    }
    fillArea(area, ctx) {
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = ctx.fillStyle = area.color;
        area.clip(ctx);
        ctx.fill();
    }
    fullQuadPath(ctx, withCuts) {
        ctx.beginPath();
        for (let i = 0; i < this.quads.length; i++) {
            let prev = i > 0 ? this.quads[i - 1] : this.quads.slice(-1)[0];
            let shape = this.quads[i];
            if (withCuts || shape.from != prev.to % 24)
                ctx.lineTo(0, 0);
            shape.outerPath(ctx);
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
    rotate(rot) {
        this.areas.map(e => { e.from += rot; e.to += rot; });
        this.cuts.map(e => { e.from += rot; });
        this.quads.map(e => { e.from += rot; e.to += rot; });
        return this.normalize();
    }
    normalize() {
        this.areas = this.areas.map(e => {
            if (e.from < 0 || e.to < 0) {
                e.from += 24;
                e.to += 24;
            }
            if (e.from >= 24 && e.to >= 24) {
                e.from -= 24;
                e.to -= 24;
            }
            return e;
        }).sort((a, b) => {
            if (a.from != b.from)
                return a.from - b.from;
            if (a.to != b.to)
                return a.to - b.to;
            return 0;
        });
        this.quads = this.quads.map(e => {
            if (e.from < 0 || e.to < 0) {
                e.from += 24;
                e.to += 24;
            }
            if (e.from >= 24 && e.to >= 24) {
                e.from -= 24;
                e.to -= 24;
            }
            return e;
        }).sort((a, b) => {
            if (a.from != b.from)
                return a.from - b.from;
            if (a.to != b.to)
                return a.to - b.to;
            return 0;
        });
        this.cuts = this.cuts.map(e => {
            if (e.from < 0) {
                e.from += 24;
            }
            if (e.from >= 24) {
                e.from -= 24;
            }
            return e;
        }).sort((a, b) => {
            if (a.from != b.from)
                return a.from - b.from;
            return 0;
        });
        return this;
    }
    canStackWith(layer) {
        // can stack if: 
    }
    stackWith(layer) {
    }
    static fromShapezHash(hash) {
        const colors = { u: 'grey', r: 'red', b: 'blue', g: 'green' };
        const shapes = { C: 'circle', R: 'square', S: 'star', };
        return new SzLayer({
            areas: [],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2hhcGVzdC9fL2xheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXFCQSxNQUFNLEtBQVcsTUFBTSxDQTBSdEI7QUExUkQsV0FBaUIsTUFBTTtJQUN0QixJQUFpQixLQUFLLENBaUNyQjtJQWpDRCxXQUFpQixPQUFLO1FBQ3JCLE1BQU0sa0JBQWtCLEdBQUc7WUFDMUIsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRO1lBQ3pCLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTTtZQUM1QixNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU07U0FDZixDQUFDO1FBQ1gsTUFBTSxpQkFBaUIsR0FBRztZQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU87U0FDZixDQUFDO1FBSUUsWUFBSSxHQUNoQixDQUFDLEdBQUcsa0JBQWtCLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDL0QsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDaEMsQ0FBQyxDQUFDLENBQUM7UUFFUSxpQkFBUyxHQUFHLFFBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsQyxjQUFNLEdBQTZCLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBVSxDQUFDLENBQUMsQ0FBQztRQUMzRixjQUFNLEdBQTRCLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFD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QUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO2lCQUNmLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLEVBQUUsRUFBRTtTQUNSLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRDtBQUdELFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBUTtJQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEIsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2QsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFTRCxRQUFRO0FBQ1IscURBQXFEO0FBQ3JELGlEQUFpRDtBQUNqRCwrQkFBK0I7QUFDL0Isc0RBQXNEO0FBQ3RELHFCQUFxQjtBQUNyQiw0QkFBNEI7QUFDNUIsSUFBSTtBQUVKLHlCQUF5QjtBQUN6Qiw4QkFBOEI7QUFNOUIsc0RBQXNEO0FBQ3RELDZCQUE2QjtBQUM3Qiw2RkFBNkY7QUFDN0YscUJBQXFCO0FBQ3JCLE1BQU07QUFDTiwyQkFBMkI7QUFDM0IsZ0JBQWdCO0FBQ2hCLDZCQUE2QjtBQUM3QixtQkFBbUI7QUFDbkIsT0FBTztBQUNQLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGFyLCByb3RhdGlvbjI0LCBzdHlsZVN0cmluZywgU3pDb250ZXh0MkQgfSBmcm9tIFwiLi9TekNvbnRleHQyRC5qc1wiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgdHlwZSBjdXRTaGFwZSA9IChcclxuXHR8ICdsaW5lJ1xyXG4pO1xyXG5leHBvcnQgdHlwZSBxdWFkU2hhcGUgPSAoXHJcblx0fCAnY2lyY2xlJyB8ICdzcXVhcmUnIHwgJ3N0YXInXHJcbik7XHJcbmV4cG9ydCB0eXBlIGFyZWFTaGFwZSA9IChcclxuXHR8ICd3aG9sZScgfCAnc2VjdG9yJ1xyXG4pO1xyXG5leHBvcnQgdHlwZSBjb2xvciA9XHJcblx0fCAncmVkJyB8ICdvcmFuZ2UnIHwgJ3llbGxvdydcclxuXHR8ICdsYXduZ3JlZW4nIHwgJ2dyZWVuJyB8ICdjeWFuJ1xyXG5cdHwgJ2JsdWUnIHwgJ3B1cnBsZScgfCAncGluaydcclxuXHR8ICdibGFjaycgfCAnZ3JleScgfCAnd2hpdGUnXHJcblx0fCBgIyR7c3RyaW5nfWA7XHJcblxyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBTekluZm8ge1xyXG5cdGV4cG9ydCBuYW1lc3BhY2UgY29sb3Ige1xyXG5cdFx0Y29uc3QgY29sb3JXaGVlbE5hbWVMaXN0ID0gW1xyXG5cdFx0XHQncmVkJywgJ29yYW5nZScsICd5ZWxsb3cnLFxyXG5cdFx0XHQnbGF3bmdyZWVuJywgJ2dyZWVuJywgJ2N5YW4nLFxyXG5cdFx0XHQnYmx1ZScsICdwdXJwbGUnLCAncGluaycsXHJcblx0XHRdIGFzIGNvbnN0O1xyXG5cdFx0Y29uc3QgY29sb3JHcmV5TmFtZUxpc3QgPSBbXHJcblx0XHRcdCdibGFjaycsICdncmV5JywgJ3doaXRlJyxcclxuXHRcdF0gYXMgY29uc3Q7XHJcblxyXG5cdFx0ZXhwb3J0IHR5cGUgY29sb3JJbmZvID0geyBuYW1lOiBjb2xvciwgc3R5bGU6IHN0eWxlU3RyaW5nLCBjb2RlOiBjaGFyIH07XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IGxpc3Q6IGNvbG9ySW5mb1tdID1cclxuXHRcdFx0Wy4uLmNvbG9yV2hlZWxOYW1lTGlzdCwgLi4uY29sb3JHcmV5TmFtZUxpc3RdLm1hcCgobmFtZSwgaSkgPT4gKHtcclxuXHRcdFx0XHRuYW1lLCBzdHlsZTogbmFtZSwgY29kZTogbmFtZVswXSxcclxuXHRcdFx0fSkpO1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBjb2xvckxpc3QgPSBsaXN0Lm1hcChlID0+IGUubmFtZSk7XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IGJ5TmFtZTogUmVjb3JkPGNvbG9yLCBjb2xvckluZm8+ID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UubmFtZSwgZV0gYXMgY29uc3QpKTtcclxuXHRcdGV4cG9ydCBjb25zdCBieUNoYXI6IFJlY29yZDxjaGFyLCBjb2xvckluZm8+ID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UuY29kZSwgZV0gYXMgY29uc3QpKTtcclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZXhhbXBsZUxheWVyKGNvbG9yOiBjb2xvcikge1xyXG5cdFx0XHRsZXQgaSA9IDA7XHJcblx0XHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdFx0cXVhZHM6IFtcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdjaXJjbGUnLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvciB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZTogJ3NxdWFyZScsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnY2lyY2xlJywgZnJvbTogaSwgdG86IGkgKz0gNiwgY29sb3IgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdzcXVhcmUnLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvciB9LFxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgcXVhZCB7XHJcblx0XHRleHBvcnQgdHlwZSBxdWFkSW5mbyA9IHsgbmFtZTogcXVhZFNoYXBlLCBjb2RlOiBjaGFyIH07XHJcblx0XHRleHBvcnQgY29uc3QgbGlzdDogcXVhZEluZm9bXSA9IFtcclxuXHRcdFx0eyBuYW1lOiAnY2lyY2xlJywgY29kZTogJ0MnIH0sXHJcblx0XHRcdHsgbmFtZTogJ3NxdWFyZScsIGNvZGU6ICdSJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdzdGFyJywgY29kZTogJ1MnIH0sXHJcblx0XHRdO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBleGFtcGxlTGF5ZXIoc2hhcGU6IHF1YWRTaGFwZSkge1xyXG5cdFx0XHRsZXQgaSA9IDA7XHJcblx0XHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdFx0cXVhZHM6IFtcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRdXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBleHRyYVNoYXBlczogUmVjb3JkPHN0cmluZywgKGN0eDogU3pDb250ZXh0MkQsIHF1YWQ6IFN6TGF5ZXJRdWFkKSA9PiB2b2lkPiA9IHtcclxuXHRcdFx0Y2xvdmVyKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdFx0XHQvLyBiZWdpbih7IHNpemU6IDEuMywgcGF0aDogdHJ1ZSwgemVybzogdHJ1ZSB9KTtcclxuXHRcdFx0XHQvLyBjb25zdCBpbm5lciA9IDAuNTtcclxuXHRcdFx0XHQvLyBjb25zdCBpbm5lcl9jZW50ZXIgPSAwLjQ1O1xyXG5cdFx0XHRcdC8vIGNvbnRleHQubGluZVRvKDAsIGlubmVyKTtcclxuXHRcdFx0XHQvLyBjb250ZXh0LmJlemllckN1cnZlVG8oMCwgMSwgaW5uZXIsIDEsIGlubmVyX2NlbnRlciwgaW5uZXJfY2VudGVyKTtcclxuXHRcdFx0XHQvLyBjb250ZXh0LmJlemllckN1cnZlVG8oMSwgaW5uZXIsIDEsIDAsIGlubmVyLCAwKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c3RhcjgoY3R4OiBTekNvbnRleHQyRCwgeyBmcm9tLCB0byB9OiBTekxheWVyUXVhZCkge1xyXG5cdFx0XHRcdGNvbnN0IHIgPSAxLjIyIC8gMiwgUiA9IDEuMjIsIGQgPSAobjogbnVtYmVyKSA9PiBmcm9tICogKDEgLSBuKSArIHRvICogbjtcclxuXHRcdFx0XHRjdHhcclxuXHRcdFx0XHRcdC5saW5lVG9SKHIsIGQoMCkpXHJcblx0XHRcdFx0XHQubGluZVRvUihSLCBkKDAuMjUpKVxyXG5cdFx0XHRcdFx0LmxpbmVUb1IociwgZCgwLjUpKVxyXG5cdFx0XHRcdFx0LmxpbmVUb1IoUiwgZCgwLjc1KSlcclxuXHRcdFx0XHRcdC5saW5lVG9SKHIsIGQoMSkpXHJcblx0XHRcdH0sXHJcblx0XHRcdHJob21idXMoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRwbHVzKGN0eDogU3pDb250ZXh0MkQsIHsgZnJvbSwgdG8gfTogU3pMYXllclF1YWQpIHtcclxuXHRcdFx0XHRjb25zdCByID0gMC40LCBSID0gMS4wLCBkID0gKG46IG51bWJlcikgPT4gZnJvbSAqICgxIC0gbikgKyB0byAqIG47XHJcblx0XHRcdFx0Y29uc3QgcnIgPSAocjE6IG51bWJlciwgcjI6IG51bWJlcikgPT4gKHIxICogcjEgKyByMiAqIHIyKSAqKiAwLjVcclxuXHRcdFx0XHRjb25zdCBhdCA9IChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gTWF0aC5hdGFuMihiLCBhKSAvIE1hdGguUEkgKiAyO1xyXG5cdFx0XHRcdGNvbnN0IHRvciA9IChyOiBudW1iZXIsIFI6IG51bWJlcikgPT4gW3JyKHIsIFIpLCBkKGF0KHIsIFIpKV0gYXMgY29uc3Q7XHJcblx0XHRcdFx0Y3R4XHJcblx0XHRcdFx0XHQubGluZVRvUiguLi50b3IoUiwgMCkpXHJcblx0XHRcdFx0XHQubGluZVRvUiguLi50b3IoUiwgcikpXHJcblx0XHRcdFx0XHQubGluZVRvUiguLi50b3IociwgcikpXHJcblx0XHRcdFx0XHQubGluZVRvUiguLi50b3IociwgUikpXHJcblx0XHRcdFx0XHQubGluZVRvUiguLi50b3IoMCwgUikpXHJcblx0XHRcdH0sXHJcblx0XHRcdHNhdyhjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdH0sXHJcblx0XHRcdHN1bihjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdH0sXHJcblx0XHRcdGxlYWYoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkaWFtb25kKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdFx0fSxcclxuXHRcdFx0bWlsbChjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdH0sXHJcblx0XHRcdGhhbGZsZWFmKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdFx0fSxcclxuXHRcdFx0eWlueWFuZyhjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdH0sXHJcblx0XHRcdG9jdGFnb24oY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHR9LFxyXG5cdFx0fVxyXG5cclxuXHRcdE9iamVjdC5lbnRyaWVzKGV4dHJhU2hhcGVzKS5tYXAoKFtrLCB2XSkgPT4gbGlzdC5wdXNoKHsgbmFtZTogayB9IGFzIGFueSkpO1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBxdWFkTGlzdCA9IGxpc3QubWFwKGUgPT4gZS5uYW1lKTtcclxuXHR9XHJcblxyXG5cdC8qIG9sZDogXHJcblxyXG5cdFxyXG5leHBvcnQgY29uc3Qgc2hhcGU0c3ZnID0ge1xyXG5cdFI6IFwiTSAwIDAgTCAxIDAgTCAxIDEgTCAwIDEgWlwiLFxyXG5cdEM6IFwiTSAwIDAgTCAxIDAgQSAxIDEgMCAwIDEgMCAxIFpcIixcclxuXHRTOiBcIk0gMCAwIEwgMC42IDAgTCAxIDEgTCAwIDAuNiBaXCIsXHJcblx0VzogXCJNIDAgMCBMIDAuNiAwIEwgMSAxIEwgMCAxIFpcIixcclxuXHRcIi1cIjogXCJNIDAgMFwiLFxyXG59XHJcbmZ1bmN0aW9uIGRvdFBvcyhsLCBhKSB7XHJcblx0cmV0dXJuIGAke2wgKiBNYXRoLmNvcyhNYXRoLlBJIC8gYSl9ICR7bCAqIE1hdGguc2luKE1hdGguUEkgLyBhKX1gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaW5QaUJ5KGEpIHtcclxuXHRyZXR1cm4gTWF0aC5zaW4oTWF0aC5QSSAvIGEpO1xyXG59XHJcbmZ1bmN0aW9uIGNvc1BpQnkoYSkge1xyXG5cdHJldHVybiBNYXRoLmNvcyhNYXRoLlBJIC8gYSk7XHJcbn1cclxubGV0IHNoYXBlNmxvbmcgPSAxIC8gY29zUGlCeSg2KTtcclxuXHJcbmV4cG9ydCBjb25zdCBzaGFwZTZzdmcgPSB7XHJcblx0UjogYE0gMCAwIEwgMSAwIEwgJHtkb3RQb3Moc2hhcGU2bG9uZywgNil9IEwgJHtkb3RQb3MoMSwgMyl9IFpgLFxyXG5cdEM6IGBNIDAgMCBMIDEgMCBBIDEgMSAwIDAgMSAke2RvdFBvcygxLCAzKX0gWmAsXHJcblx0UzogYE0gMCAwIEwgMC42IDAgTCAke2RvdFBvcyhzaGFwZTZsb25nLCA2KX0gTCAke2RvdFBvcygwLjYsIDMpfSBaYCxcclxuXHRXOiBgTSAwIDAgTCAwLjYgMCBMICR7ZG90UG9zKHNoYXBlNmxvbmcsIDYpfSBMICR7ZG90UG9zKDEsIDMpfSBaYCxcclxuXHRcIi1cIjogXCJNIDAgMFwiLFxyXG59XHJcblxyXG5cclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInJob21idXNcIixcclxuXHRjb2RlOiBcIkJcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHRcdGJlZ2luKHsgc2l6ZTogMS4yLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0Y29uc3QgcmFkID0gMC4wMDE7XHJcblx0XHQvLyB3aXRoIHJvdW5kZWQgYm9yZGVyc1xyXG5cdFx0Y29udGV4dC5hcmNUbygwLCAxLCAxLCAwLCByYWQpO1xyXG5cdFx0Y29udGV4dC5hcmNUbygxLCAwLCAwLCAwLCByYWQpO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwicGx1c1wiLFxyXG5cdGNvZGU6IFwiUFwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXc6IFwiTSAwIDAgTCAxLjEgMCAxLjEgMC41IDAuNSAwLjUgMC41IDEuMSAwIDEuMSB6XCIsXHJcblx0dGllcjogMyxcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJzYXdcIixcclxuXHRjb2RlOiBcIlpcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHRcdGJlZ2luKHsgc2l6ZTogMS4xLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0Y29uc3QgaW5uZXIgPSAwLjU7XHJcblx0XHRjb250ZXh0LmxpbmVUbyhpbm5lciwgMCk7XHJcblx0XHRjb250ZXh0LmJlemllckN1cnZlVG8oaW5uZXIsIDAuMywgMSwgMC4zLCAxLCAwKTtcclxuXHRcdGNvbnRleHQuYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0MSxcclxuXHRcdFx0aW5uZXIsXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMiAqIDAuOSxcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQyICogMC45LFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDFfMixcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQxXzJcclxuXHRcdCk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZShNYXRoLlBJIC8gNCk7XHJcblx0XHRjb250ZXh0LmJlemllckN1cnZlVG8oaW5uZXIsIDAuMywgMSwgMC4zLCAxLCAwKTtcclxuXHRcdGNvbnRleHQuYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0MSxcclxuXHRcdFx0aW5uZXIsXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMiAqIDAuOSxcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQyICogMC45LFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDFfMixcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQxXzJcclxuXHRcdCk7XHJcblx0fSxcclxuXHR0aWVyOiAzLFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInN1blwiLFxyXG5cdGNvZGU6IFwiVVwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdHNwYXduQ29sb3I6IFwieWVsbG93XCIsXHJcblx0ZHJhdyh7IGRpbXMsIGlubmVyRGltcywgbGF5ZXIsIHF1YWQsIGNvbnRleHQsIGNvbG9yLCBiZWdpbiB9KSB7XHJcblx0XHRiZWdpbih7IHNpemU6IDEuMywgcGF0aDogdHJ1ZSwgemVybzogdHJ1ZSB9KTtcclxuXHRcdGNvbnN0IFBJID0gTWF0aC5QSTtcclxuXHRcdGNvbnN0IFBJMyA9ICgoUEkgKiAzKSAvIDgpICogMC43NTtcclxuXHRcdGNvbnN0IGMgPSAxIC8gTWF0aC5jb3MoTWF0aC5QSSAvIDgpO1xyXG5cdFx0Y29uc3QgYiA9IGMgKiBNYXRoLnNpbihNYXRoLlBJIC8gOCk7XHJcblxyXG5cdFx0Y29udGV4dC5tb3ZlVG8oMCwgMCk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZShNYXRoLlBJIC8gMik7XHJcblx0XHRjb250ZXh0LmFyYyhjLCAwLCBiLCAtUEksIC1QSSArIFBJMyk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZSgtTWF0aC5QSSAvIDQpO1xyXG5cdFx0Y29udGV4dC5hcmMoYywgMCwgYiwgLVBJIC0gUEkzLCAtUEkgKyBQSTMpO1xyXG5cdFx0Y29udGV4dC5yb3RhdGUoLU1hdGguUEkgLyA0KTtcclxuXHRcdGNvbnRleHQuYXJjKGMsIDAsIGIsIFBJIC0gUEkzLCBQSSk7XHJcblx0fSxcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJsZWFmXCIsXHJcblx0Y29kZTogXCJGXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0ZHJhdzogXCJNIDAgMCB2IDAuNSBhIDAuNSAwLjUgMCAwIDAgMC41IDAuNSBoIDAuNSB2IC0wLjUgYSAwLjUgMC41IDAgMCAwIC0wLjUgLTAuNSB6XCIsXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwiZGlhbW9uZFwiLFxyXG5cdGNvZGU6IFwiRFwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXc6IFwiTSAwIDAgbCAwIDAuNSAwLjUgMC41IDAuNSAwIDAgLTAuNSAtMC41IC0wLjUgelwiLFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcIm1pbGxcIixcclxuXHRjb2RlOiBcIk1cIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3OiBcIk0gMCAwIEwgMCAxIDEgMSBaXCIsXHJcbn0pO1xyXG5cclxuLy8gcmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcbi8vICAgICBpZDogXCJoYWxmbGVhZlwiLFxyXG4vLyAgICAgY29kZTogXCJIXCIsXHJcbi8vICAgICAuLi5jdXN0b21EZWZhdWx0cyxcclxuLy8gICAgIGRyYXc6IFwiMTAwIE0gMCAwIEwgMCAxMDAgQSA0NSA0NSAwIDAgMCAzMCAzMCBBIDQ1IDQ1IDAgMCAwIDEwMCAwIFpcIixcclxuLy8gfSlcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInlpbnlhbmdcIixcclxuXHRjb2RlOiBcIllcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHQvLyBkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHQvLyAgICAgYmVnaW4oeyBzaXplOiAxLygwLjUrTWF0aC5TUVJUMV8yKSwgcGF0aDogdHJ1ZSB9KTtcclxuXHJcblx0Ly8gICAgIC8qKiBAdHlwZXtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9ICogL1xyXG5cdC8vICAgICBsZXQgY3R4ID0gY29udGV4dDtcclxuXHJcblx0Ly8gICAgIHdpdGggKGN0eCkgeyB3aXRoIChNYXRoKSB7XHJcblx0Ly8gICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vICAgICAvLyBkcmF3IG1vc3RseSBpbiBbMCwxXXhbMCwxXSBzcXVhcmVcclxuXHQvLyAgICAgLy8gZHJhdzogXCIxMDAgTSAwIDUwIEEgNTAgNTAgMCAxIDEgODUgODUgQSAxMjEgMTIxIDAgMCAxIC04NSA4NSBBIDUwIDUwIDAgMCAwIDAgNTBcIixcclxuXHQvLyAgICAgbW92ZVRvKDAsIDAuNSk7XHJcblx0Ly8gICAgIGFyYygwLjUsIDAuNSwgMC41LCBQSSwgUEkvNClcclxuXHQvLyAgICAgYXJjKDAsIDAsIDAuNStTUVJUMV8yLCBQSS80LCBQSS80K1BJLzIsIDApXHJcblx0Ly8gICAgIGFyYygtMC41LCAwLjUsIDAuNSwgMypQSS80LCAwLCAxKVxyXG5cclxuXHQvLyAgICAgbW92ZVRvKDAuNiwgMC41KVxyXG5cdC8vICAgICBhcmMoMC41LCAwLjUsIDAuMSwgMCwgMipQSSlcclxuXHQvLyAgICAgfX1cclxuXHJcblx0Ly8gfSxcclxuXHRkcmF3OlxyXG5cdFx0XCIxMjAuNzEgTSAwIDUwIEEgNTAgNTAgMCAxIDEgODUuMzU1IDg1LjM1NSBBIDEyMC43MSAxMjAuNzEgMCAwIDEgLTg1LjM1NSA4NS4zNTUgQSA1MCA1MCAwIDAgMCAwIDUwIFogTSA0MCA1MCBBIDEwIDEwIDAgMSAwIDQwIDQ5Ljk5IFpcIixcclxuXHR0aWVyOiA0LFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcIm9jdGFnb25cIixcclxuXHRjb2RlOiBcIk9cIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3OiBcIk0gMCAwIEwgMCAxIDAuNDE0MiAxIDEgMC40MTQyIDEgMCBaXCIsXHJcbn0pO1xyXG5cclxuXHRcclxuXHQqL1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN6TGF5ZXIge1xyXG5cdGN1dHM6ICh7XHJcblx0XHRzaGFwZTogY3V0U2hhcGUsXHJcblx0XHRmcm9tOiByb3RhdGlvbjI0LCB0bzogcm90YXRpb24yNCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHR9KVtdO1xyXG5cdHF1YWRzOiAoe1xyXG5cdFx0c2hhcGU6IHF1YWRTaGFwZSxcclxuXHRcdGZyb206IHJvdGF0aW9uMjQsIHRvOiByb3RhdGlvbjI0LFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdH0pW107XHJcblx0YXJlYXM6ICh7XHJcblx0XHRzaGFwZTogYXJlYVNoYXBlLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0ZnJvbTogcm90YXRpb24yNCwgdG86IHJvdGF0aW9uMjQsXHJcblx0fSlbXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTekxheWVyQ3V0IHtcclxuXHRzaGFwZTogY3V0U2hhcGUgPSAnbGluZSc7XHJcblx0Y29sb3I6IGNvbG9yID0gJ2JsYWNrJztcclxuXHJcblx0ZnJvbTogcm90YXRpb24yNCA9IDA7IHRvOiByb3RhdGlvbjI0ID0gMDtcclxuXHRjb25zdHJ1Y3Rvcihzb3VyY2U6IFBhcnRpYWw8U3pMYXllckN1dD4pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgc291cmNlKTtcclxuXHR9XHJcblx0Z2V0IHNtYWxsUmFkaXVzKCkge1xyXG5cdFx0cmV0dXJuIDAuMDAwMTtcclxuXHR9XHJcblx0cGF0aEluc2lkZShjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRzd2l0Y2ggKHRoaXMuc2hhcGUpIHtcclxuXHRcdFx0Y2FzZSAnbGluZSc6IHtcclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjUsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IodGhpcy5zbWFsbFJhZGl1cywgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdHRocm93IGxvZyh0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRwYXRoT3V0c2l6ZShjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRzd2l0Y2ggKHRoaXMuc2hhcGUpIHtcclxuXHRcdFx0Y2FzZSAnbGluZSc6IHtcclxuXHRcdFx0XHRjdHgubGluZVRvUih0aGlzLnNtYWxsUmFkaXVzLCB0aGlzLmZyb20pO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDAuNSwgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdHRocm93IGxvZyh0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5leHBvcnQgY2xhc3MgU3pMYXllclF1YWQge1xyXG5cdHNoYXBlOiBxdWFkU2hhcGUgPSAnY2lyY2xlJztcclxuXHRjb2xvcjogY29sb3IgPSAnYmxhY2snO1xyXG5cclxuXHRmcm9tOiByb3RhdGlvbjI0ID0gMDsgdG86IHJvdGF0aW9uMjQgPSAwO1xyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZTogUGFydGlhbDxTekxheWVyUXVhZD4pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgc291cmNlKTtcclxuXHR9XHJcblx0b3V0ZXJQYXRoKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdHN3aXRjaCAodGhpcy5zaGFwZSkge1xyXG5cdFx0XHRjYXNlICdjaXJjbGUnOiB7XHJcblx0XHRcdFx0Y3R4LmFyYygwLCAwLCAxLCB0aGlzLmZyb20sIHRoaXMudG8pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXNlICdzcXVhcmUnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMSwgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUihNYXRoLlNRUlQyLCAodGhpcy5mcm9tICsgdGhpcy50bykgLyAyKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUigxLCB0aGlzLnRvKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FzZSAnc3Rhcic6IHtcclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjYsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoTWF0aC5TUVJUMiwgKHRoaXMuZnJvbSArIHRoaXMudG8pIC8gMik7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMC42LCB0aGlzLnRvKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdGlmIChTekluZm8ucXVhZC5leHRyYVNoYXBlc1t0aGlzLnNoYXBlXSkge1xyXG5cdFx0XHRcdFx0U3pJbmZvLnF1YWQuZXh0cmFTaGFwZXNbdGhpcy5zaGFwZV0oY3R4LCB0aGlzKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRocm93IGxvZyh0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5leHBvcnQgY2xhc3MgU3pMYXllckFyZWEge1xyXG5cdHNoYXBlOiBhcmVhU2hhcGUgPSAnd2hvbGUnO1xyXG5cdGNvbG9yOiBjb2xvciA9ICdibGFjayc7XHJcblxyXG5cdGZyb206IHJvdGF0aW9uMjQgPSAwOyB0bzogcm90YXRpb24yNCA9IDA7XHJcblx0Y29uc3RydWN0b3Ioc291cmNlOiBQYXJ0aWFsPFN6TGF5ZXJBcmVhPikge1xyXG5cdFx0T2JqZWN0LmFzc2lnbih0aGlzLCBzb3VyY2UpO1xyXG5cdH1cclxuXHRvdXRlclBhdGgoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0c3dpdGNoICh0aGlzLnNoYXBlKSB7XHJcblx0XHRcdGNhc2UgJ3dob2xlJzoge1xyXG5cdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRjdHguYXJjKDAsIDAsIDUsIDAsIDI0KTtcclxuXHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhc2UgJ3NlY3Rvcic6IHtcclxuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0Y3R4Lm1vdmVUbygwLCAwKTtcclxuXHRcdFx0XHRjdHguYXJjKDAsIDAsIDUsIHRoaXMuZnJvbSwgdGhpcy50byk7XHJcblx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRkZWZhdWx0OiB7XHJcblx0XHRcdFx0dGhyb3cgbG9nKHRoaXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGNsaXAoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0dGhpcy5vdXRlclBhdGgoY3R4KTtcclxuXHRcdGN0eC5jbGlwKCk7XHJcblx0fVxyXG5cdGZpbGwoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0dGhpcy5vdXRlclBhdGgoY3R4KTtcclxuXHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG5cdFx0Y3R4LmZpbGwoKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IHRlc3RUZW1wbGF0ZTogSVN6TGF5ZXIgPSB7XHJcblx0Y3V0czogW1xyXG5cdFx0eyBmcm9tOiAxMCwgdG86IDEwLCBzaGFwZTogJ2xpbmUnLCBjb2xvcjogJ2JsdWUnIH0sXHJcblx0XHR7IGZyb206IDE0LCB0bzogMTQsIHNoYXBlOiAnbGluZScsIGNvbG9yOiAnYmx1ZScgfSxcclxuXHRdLFxyXG5cdHF1YWRzOiBbXHJcblx0XHR7IHNoYXBlOiAnc3F1YXJlJywgY29sb3I6ICdncmVlbicsIGZyb206IDIsIHRvOiA0IH0sXHJcblx0XHR7IHNoYXBlOiAnY2lyY2xlJywgY29sb3I6ICdwaW5rJywgZnJvbTogNSwgdG86IDE5IH0sXHJcblx0XHR7IHNoYXBlOiAnc3F1YXJlJywgY29sb3I6ICdncmVlbicsIGZyb206IDIwLCB0bzogMjIgfSxcclxuXHRdLFxyXG5cdGFyZWFzOiBbXHJcblx0XHR7IHNoYXBlOiAnc2VjdG9yJywgY29sb3I6ICcjZmYwMDAwJywgZnJvbTogMTEsIHRvOiAxMyB9LFxyXG5cdF0sXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFN6TGF5ZXIgaW1wbGVtZW50cyBJU3pMYXllciB7XHJcblx0bGF5ZXJJbmRleCA9IDA7XHJcblx0Y3V0czogU3pMYXllckN1dFtdID0gW107XHJcblx0cXVhZHM6IFN6TGF5ZXJRdWFkW10gPSBbXTtcclxuXHRhcmVhczogU3pMYXllckFyZWFbXSA9IFtdO1xyXG5cclxuXHJcblx0c3RhdGljIGNyZWF0ZVRlc3QoKSB7XHJcblx0XHRsZXQgbCA9IG5ldyBTekxheWVyKHRlc3RUZW1wbGF0ZSk7XHJcblx0XHRsLmFyZWFzLm1hcChlID0+IHtcclxuXHRcdFx0bGV0IHIgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiA4O1xyXG5cdFx0XHRlLmZyb20gKz0gcjtcclxuXHRcdFx0ZS50byArPSByO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmVycm9yKCd0ZXN0IGxheWVyJywgbCk7XHJcblx0XHRyZXR1cm4gbDtcclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZT86IFBhcnRpYWw8SVN6TGF5ZXI+LCBsYXllckluZGV4PzogbnVtYmVyKSB7XHJcblx0XHRpZiAoc291cmNlKSB7XHJcblx0XHRcdHRoaXMuY3V0cyA9IChzb3VyY2UuY3V0cyA/PyBbXSkubWFwKGUgPT4gbmV3IFN6TGF5ZXJDdXQoZSkpO1xyXG5cdFx0XHR0aGlzLnF1YWRzID0gKHNvdXJjZS5xdWFkcyA/PyBbXSkubWFwKGUgPT4gbmV3IFN6TGF5ZXJRdWFkKGUpKTtcclxuXHRcdFx0dGhpcy5hcmVhcyA9IChzb3VyY2UuYXJlYXMgPz8gW10pLm1hcChlID0+IG5ldyBTekxheWVyQXJlYShlKSk7XHJcblx0XHRcdGlmICgoc291cmNlIGFzIFN6TGF5ZXIpLmxheWVySW5kZXgpIHtcclxuXHRcdFx0XHR0aGlzLmxheWVySW5kZXggPSAoc291cmNlIGFzIFN6TGF5ZXIpLmxheWVySW5kZXg7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChsYXllckluZGV4KSB7XHJcblx0XHRcdHRoaXMubGF5ZXJJbmRleCA9IGxheWVySW5kZXg7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRkcmF3Q2VudGVyZWRMYXllclNjYWxlZChjdHg6IFN6Q29udGV4dDJELCBsYXllckluZGV4PzogbnVtYmVyKSB7XHJcblx0XHRsYXllckluZGV4ID8/PSB0aGlzLmxheWVySW5kZXg7XHJcblx0XHRsZXQgc2NhbGUgPSAxIC0gMC4yMiAqIGxheWVySW5kZXg7XHJcblx0XHRjdHguc2F2ZWQoY3R4ID0+IHtcclxuXHRcdFx0Y3R4LnNjYWxlKHNjYWxlKTtcclxuXHRcdFx0dGhpcy5kcmF3Q2VudGVyZWROb3JtYWxpemVkKGN0eCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGRyYXdDZW50ZXJlZE5vcm1hbGl6ZWQoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Y3R4LnNhdmVkKGN0eCA9PiB7XHJcblx0XHRcdHRoaXMuY2xpcFNoYXBlcyhjdHgpO1xyXG5cdFx0XHR0aGlzLnF1YWRzLmZvckVhY2gocSA9PiBjdHguc2F2ZWQoY3R4ID0+IHRoaXMuZmlsbFF1YWQocSwgY3R4KSkpO1xyXG5cclxuXHRcdFx0dGhpcy5jdXRzLmZvckVhY2goYyA9PiBjdHguc2F2ZWQoY3R4ID0+IHRoaXMuc3Ryb2tlQ3V0KGMsIGN0eCkpKTtcclxuXHJcblx0XHRcdHRoaXMuYXJlYXMuZm9yRWFjaChhID0+IGN0eC5zYXZlZChjdHggPT4gdGhpcy5maWxsQXJlYShhLCBjdHgpKSk7XHJcblx0XHR9KTtcclxuXHRcdGN0eC5zYXZlZChjdHggPT4gdGhpcy5kcmF3UXVhZE91dGxpbmUoY3R4LCB0cnVlKSk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRzdHJva2VDdXQoY3V0OiBTekxheWVyQ3V0LCBjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRjdHgubGluZVdpZHRoID0gMC4wNTtcclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9IGN1dC5jb2xvcjtcclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHJcblx0XHRpZiAoY3V0LnNoYXBlID09ICdsaW5lJykge1xyXG5cdFx0XHRjdHgucm90YXRlKGN1dC5mcm9tKTtcclxuXHRcdFx0Y3R4Lm1vdmVUbygwLCAwKTtcclxuXHRcdFx0Y3R4LmxpbmVUbygwLCAxKTtcclxuXHRcdFx0Y3R4LnN0cm9rZSgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbG9nKCdiYWQgY3V0JywgY3V0KTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cdGZpbGxRdWFkKHF1YWQ6IFN6TGF5ZXJRdWFkLCBjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRjdHgubGluZVdpZHRoID0gMC4wNTtcclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9IGN0eC5maWxsU3R5bGUgPSBxdWFkLmNvbG9yO1xyXG5cclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdGN0eC5tb3ZlVG8oMCwgMCk7XHJcblx0XHRxdWFkLm91dGVyUGF0aChjdHgpO1xyXG5cdFx0Y3R4LmZpbGwoKTtcclxuXHR9XHJcblxyXG5cdGZpbGxBcmVhKGFyZWE6IFN6TGF5ZXJBcmVhLCBjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRjdHgubGluZVdpZHRoID0gMC4wNTtcclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9IGN0eC5maWxsU3R5bGUgPSBhcmVhLmNvbG9yO1xyXG5cclxuXHRcdGFyZWEuY2xpcChjdHgpO1xyXG5cdFx0Y3R4LmZpbGwoKTtcclxuXHR9XHJcblxyXG5cdGZ1bGxRdWFkUGF0aChjdHg6IFN6Q29udGV4dDJELCB3aXRoQ3V0cz86IGJvb2xlYW4pIHtcclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5xdWFkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgcHJldiA9IGkgPiAwID8gdGhpcy5xdWFkc1tpIC0gMV0gOiB0aGlzLnF1YWRzLnNsaWNlKC0xKVswXTtcclxuXHRcdFx0bGV0IHNoYXBlID0gdGhpcy5xdWFkc1tpXTtcclxuXHRcdFx0aWYgKHdpdGhDdXRzIHx8IHNoYXBlLmZyb20gIT0gcHJldi50byAlIDI0KSBjdHgubGluZVRvKDAsIDApO1xyXG5cdFx0XHRzaGFwZS5vdXRlclBhdGgoY3R4KTtcclxuXHRcdH1cclxuXHRcdGN0eC5jbG9zZVBhdGgoKTtcclxuXHR9XHJcblxyXG5cdGRyYXdRdWFkT3V0bGluZShjdHg6IFN6Q29udGV4dDJELCB3aXRoQ3V0cz86IGJvb2xlYW4pIHtcclxuXHRcdHRoaXMuZnVsbFF1YWRQYXRoKGN0eCwgd2l0aEN1dHMpO1xyXG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDAuMDU7XHJcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSAnb3JhbmdlJztcclxuXHRcdGN0eC5zdHJva2UoKTtcclxuXHR9XHJcblxyXG5cdGNsaXBTaGFwZXMoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0dGhpcy5mdWxsUXVhZFBhdGgoY3R4KTtcclxuXHRcdGN0eC5jbGlwKCk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRjbG9uZSgpIHtcclxuXHRcdHJldHVybiBuZXcgU3pMYXllcih0aGlzKTtcclxuXHR9XHJcblxyXG5cdHJvdGF0ZShyb3Q6IHJvdGF0aW9uMjQpIHtcclxuXHRcdHRoaXMuYXJlYXMubWFwKGUgPT4geyBlLmZyb20gKz0gcm90OyBlLnRvICs9IHJvdDsgfSk7XHJcblx0XHR0aGlzLmN1dHMubWFwKGUgPT4geyBlLmZyb20gKz0gcm90OyB9KTtcclxuXHRcdHRoaXMucXVhZHMubWFwKGUgPT4geyBlLmZyb20gKz0gcm90OyBlLnRvICs9IHJvdDsgfSk7XHJcblx0XHRyZXR1cm4gdGhpcy5ub3JtYWxpemUoKTtcclxuXHR9XHJcblxyXG5cdG5vcm1hbGl6ZSgpIHtcclxuXHRcdHRoaXMuYXJlYXMgPSB0aGlzLmFyZWFzLm1hcChlID0+IHtcclxuXHRcdFx0aWYgKGUuZnJvbSA8IDAgfHwgZS50byA8IDApIHsgZS5mcm9tICs9IDI0OyBlLnRvICs9IDI0OyB9XHJcblx0XHRcdGlmIChlLmZyb20gPj0gMjQgJiYgZS50byA+PSAyNCkgeyBlLmZyb20gLT0gMjQ7IGUudG8gLT0gMjQ7IH1cclxuXHRcdFx0cmV0dXJuIGU7XHJcblx0XHR9KS5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdGlmIChhLmZyb20gIT0gYi5mcm9tKSByZXR1cm4gYS5mcm9tIC0gYi5mcm9tO1xyXG5cdFx0XHRpZiAoYS50byAhPSBiLnRvKSByZXR1cm4gYS50byAtIGIudG87XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnF1YWRzID0gdGhpcy5xdWFkcy5tYXAoZSA9PiB7XHJcblx0XHRcdGlmIChlLmZyb20gPCAwIHx8IGUudG8gPCAwKSB7IGUuZnJvbSArPSAyNDsgZS50byArPSAyNDsgfVxyXG5cdFx0XHRpZiAoZS5mcm9tID49IDI0ICYmIGUudG8gPj0gMjQpIHsgZS5mcm9tIC09IDI0OyBlLnRvIC09IDI0OyB9XHJcblx0XHRcdHJldHVybiBlO1xyXG5cdFx0fSkuc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRpZiAoYS5mcm9tICE9IGIuZnJvbSkgcmV0dXJuIGEuZnJvbSAtIGIuZnJvbTtcclxuXHRcdFx0aWYgKGEudG8gIT0gYi50bykgcmV0dXJuIGEudG8gLSBiLnRvO1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5jdXRzID0gdGhpcy5jdXRzLm1hcChlID0+IHtcclxuXHRcdFx0aWYgKGUuZnJvbSA8IDApIHsgZS5mcm9tICs9IDI0OyB9XHJcblx0XHRcdGlmIChlLmZyb20gPj0gMjQpIHsgZS5mcm9tIC09IDI0OyB9XHJcblx0XHRcdHJldHVybiBlO1xyXG5cdFx0fSkuc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRpZiAoYS5mcm9tICE9IGIuZnJvbSkgcmV0dXJuIGEuZnJvbSAtIGIuZnJvbTtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Y2FuU3RhY2tXaXRoKGxheWVyOiBTekxheWVyKSB7XHJcblx0XHQvLyBjYW4gc3RhY2sgaWY6IFxyXG5cdH1cclxuXHRzdGFja1dpdGgobGF5ZXI6IFN6TGF5ZXIpIHtcclxuXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZnJvbVNoYXBlekhhc2goaGFzaDogc3RyaW5nKSB7XHJcblx0XHRjb25zdCBjb2xvcnM6IFJlY29yZDxzdHJpbmcsIGNvbG9yPiA9IHsgdTogJ2dyZXknLCByOiAncmVkJywgYjogJ2JsdWUnLCBnOiAnZ3JlZW4nIH07XHJcblx0XHRjb25zdCBzaGFwZXM6IFJlY29yZDxzdHJpbmcsIHF1YWRTaGFwZT4gPSB7IEM6ICdjaXJjbGUnLCBSOiAnc3F1YXJlJywgUzogJ3N0YXInLCB9O1xyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyKHtcclxuXHRcdFx0YXJlYXM6IFtdLFxyXG5cdFx0XHRxdWFkczogaGFzaC5tYXRjaCgvLi4vZykhLm1hcCgocywgaSkgPT4ge1xyXG5cdFx0XHRcdGlmIChzWzBdID09ICctJykgcmV0dXJuIG51bGwgYXMgYW55IGFzIFN6TGF5ZXJRdWFkO1xyXG5cdFx0XHRcdHJldHVybiBuZXcgU3pMYXllclF1YWQoe1xyXG5cdFx0XHRcdFx0c2hhcGU6IHNoYXBlc1tzWzBdXSxcclxuXHRcdFx0XHRcdGNvbG9yOiBjb2xvcnNbc1sxXV0sXHJcblx0XHRcdFx0XHRmcm9tOiBpICogNixcclxuXHRcdFx0XHRcdHRvOiAoaSArIDEpICogNixcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSkuZmlsdGVyKGUgPT4gZSksXHJcblx0XHRcdGN1dHM6IFtdLFxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbG9nKC4uLmE6IGFueVtdKSB7XHJcblx0Y29uc29sZS5lcnJvciguLi5hKTtcclxuXHRmb3IgKGxldCBvIG9mIGEpXHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChKU09OLnN0cmluZ2lmeShvKSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyB0cnkge1xyXG4vLyBcdGhhc2hGb3JFYWNoKHRlc3RIYXNoLCAnc2hhcGVzJywgZHJhd1NoYXBlLCBzY3R4KTtcclxuLy8gXHRoYXNoRm9yRWFjaCh0ZXN0SGFzaCwgJ2N1dHMnLCBkcmF3Q3V0LCBzY3R4KTtcclxuLy8gXHRjbGlwU2hhcGVzKHRlc3RIYXNoLCBzY3R4KTtcclxuLy8gXHQvLyBoYXNoRm9yRWFjaCh0ZXN0SGFzaCwgJ2FyZWFzJywgZHJhd0FyZWEsIHNjdHgpO1xyXG4vLyB9IGNhdGNoIChlOiBhbnkpIHtcclxuLy8gXHRsb2coJ2Vycm9yOiAnLCBlLnN0YWNrKTtcclxuLy8gfVxyXG5cclxuLy8gY3R4Lmdsb2JhbEFscGhhID0gMC40O1xyXG4vLyBjdHguZmlsbFJlY3QoLTIsIC0yLCA0LCA0KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyBmdW5jdGlvbiBoYXNoRm9yRWFjaDxLIGV4dGVuZHMga2V5b2YgU3pEZWZpbml0aW9uPihcclxuLy8gXHRoYXNoOiBTekRlZmluaXRpb24sIGs6IEssXHJcbi8vIFx0bWFwcGVyOiAoZTogU3pEZWZpbml0aW9uW0tdWzBdLCBpOiBudW1iZXIsIGhhc2g6IFN6RGVmaW5pdGlvbiwgY3R4OiBTekNvbnRleHQyRCkgPT4gdm9pZCxcclxuLy8gXHRjdHg6IFN6Q29udGV4dDJELFxyXG4vLyApIHtcclxuLy8gXHRoYXNoW2tdLm1hcCgoZSwgaSkgPT4ge1xyXG4vLyBcdFx0Y3R4LnNhdmUoKTtcclxuLy8gXHRcdG1hcHBlcihlLCBpLCBoYXNoLCBjdHgpO1xyXG4vLyBcdFx0Y3R4LnJlc3RvcmUoKTtcclxuLy8gXHR9KTtcclxuLy8gfSJdfQ==