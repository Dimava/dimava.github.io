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
            { name: 'circle', code: 'C', combo: 'C', spawn: 'sz!l!z|q!C-0o|a!su0o|c!' },
            { name: 'square', code: 'R', combo: 'R', spawn: 'sz!l!z|q!R-0c,R-co|a!su0o|c!' },
            { name: 'star', code: 'S', combo: 'S', spawn: 'sz!l!z|q!S-4c,S-ck,S-ks|a!su0o|c!' },
            { name: 'windmill', code: 'W', combo: 'W', spawn: 'sz!l!z|q!S-4c,S-ck,S-ks|a!su0o|c!' },
            {
                name: 'cover', code: 'J',
                path(ctx, { from, to }) {
                    ctx.arc(0, 0, 1.15, from, to);
                },
            },
        ];
        quad_1.named = {
            circle1: 'sz!l!z|q!C-0o|a!su0o|c!',
            circleHalfLeft: 'sz!l!z|q!C-co|a!su0o|c!',
            square2: 'sz!l!z|q!R-0c,R-co|a!su0o|c!',
            squareHalfRight: 'sz!l!z|q!R-0c|a!su0o|c!',
            circleHalfTop2: 'sz!l!z|q!C-06,C-io|a!suiu|c!',
            circleQuad1: 'sz!l!z|q!C-ou|a!su0o|c!',
            circleRed: 'sz!l!z|q!C-0o|a!sr0o|c!',
            squarehalfLeftBlue: 'sz!l!z|q!R-co|a!sb0o|c!',
            circlePurple: 'sz!l!z|q!C-0o|a!sv0o|c!',
            square3TopBlue: 'sz!l!z|q!R-ks|a!sbks|c!',
            star3Cyan: 'sz!l!z|q!S-4c,S-ck,S-ks|a!sc0o|c!',
            squid: 'sz!l!z|q!S-6c,S-ci,C-iu|a!sc6i,sgiu|c!',
        };
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
                // 6 -> Math.SQRT2, 12 -> 1
                let a = this.to - this.from;
                let ar = a * (Math.PI / 24);
                let R = a <= 6 ? 1 / Math.cos(ar) : 1;
                ctx.lineToR(R, (this.from + this.to) / 2);
                ctx.lineToR(1, this.to);
                return;
            }
            case 'star': {
                ctx.lineToR(0.6, this.from);
                ctx.lineToR(Math.SQRT2, (this.from + this.to) / 2);
                ctx.lineToR(0.6, this.to);
                return;
            }
            case 'windmill': {
                ctx.lineToR(1, this.from);
                let a = this.to - this.from;
                let ar = a * (Math.PI / 24);
                let R = a <= 6 ? 1 / Math.cos(ar) : 1;
                ctx.lineToR(R, (this.from + this.to) / 2);
                ctx.lineToR(0.6, this.to);
                // let originX = -quadrantHalfSize;
                // let originY = quadrantHalfSize - dims;
                // const moveInwards = dims * 0.4;
                // context.moveTo(originX, originY + moveInwards);
                // context.lineTo(originX + dims, originY);
                // context.lineTo(originX + dims, originY + dims);
                // context.lineTo(originX, originY + dims);
                // context.closePath();
                // context.fill();
                // context.stroke();
                break;
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
            if (next.from < 0 || next.from >= 24)
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
            if (next.from < 0 || next.from >= 24)
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
        let places = Array(24).fill('');
        let paints = Array(24).fill('');
        for (let q of this.quads) {
            for (let i = q.from; i < q.to; i++) {
                if (places[i % 24])
                    return false;
                places[i % 24] = q.shape;
            }
        }
        for (let a of this.areas) {
            for (let i = a.from; i < a.to; i++) {
                if (!places[i % 24])
                    return false;
                if (paints[i % 24])
                    return false;
                paints[i % 24] = a.color;
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
            if (q.from >= 24) {
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
                this.areas[this.areas.length - 1].to += this.areas[0].to;
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
        const good = (n) => includeQuadrants.includes((~~(n / 6)) % 4);
        let allowed = Array(48).fill(0).map((e, i) => good(i + 0.5));
        function convert(old) {
            let filled = Array(48).fill(0).map((e, i) => old.from < i + 0.5 && i + 0.5 < old.to);
            let last = old.clone();
            last.to = -999;
            let list = [];
            for (let i = 0; i < 48; i++) {
                if (!filled[i])
                    continue;
                if (!allowed[i])
                    continue;
                if (last.to != i) {
                    last = old.clone();
                    last.from = i;
                    last.to = i + 1;
                    list.push(last);
                }
                else {
                    last.to++;
                }
            }
            return list;
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
        return new SzLayer({
            areas: hash.match(/../g).map((s, i) => {
                if (s[0] == '-')
                    return null;
                return new SzLayerArea({
                    shape: 'sector',
                    color: SzInfo.color.byChar[s[1]].name,
                    from: i * 6,
                    to: (i + 1) * 6,
                });
            }).filter(e => e),
            quads: hash.match(/../g).map((s, i) => {
                if (s[0] == '-')
                    return null;
                return new SzLayerQuad({
                    shape: SzInfo.quad.byChar[s[0]].name,
                    color: SzInfo.color.byChar[s[1]].name,
                    from: i * 6,
                    to: (i + 1) * 6,
                });
            }).filter(e => e),
            cuts: [],
        });
    }
    getHash() {
        return `l!z|q!${this.quads.map(e => e.getHash()).join(',')}|a!${this.areas.map(e => e.getHash()).join(',')}|c!${this.cuts.map(e => e.getHash()).join(',')}`;
    }
    static fromShortKey(key) {
        if (!key.startsWith('l!z|'))
            throw new Error('invalid hash');
        let layer = new SzLayer();
        for (let part of key.split('|')) {
            if (part.startsWith('q!')) {
                let strs = part.slice('q!'.length).split(',');
                layer.quads = strs.map(e => SzLayerQuad.fromShortKey(e));
            }
            if (part.startsWith('a!')) {
                let strs = part.slice('a!'.length).split(',');
                layer.areas = strs.map(e => SzLayerArea.fromShortKey(e));
            }
            if (part.startsWith('c!')) {
                let strs = part.slice('c!'.length).split(',');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvX3NoYXBlc3QvbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxNQUFNLEdBQUc7SUFDZCxXQUFXLEVBQUUsSUFBSTtJQUNqQixpQkFBaUIsRUFBRSxJQUFJO0lBQ3ZCLGNBQWMsRUFBRSxJQUFJO0NBQ3BCLENBQUE7QUFzQkQsTUFBTSxLQUFXLE1BQU0sQ0FrV3RCO0FBbFdELFdBQWlCLE1BQU07SUFDdEIsSUFBaUIsS0FBSyxDQW1EckI7SUFuREQsV0FBaUIsT0FBSztRQUNyQixNQUFNLGtCQUFrQixHQUFHO1lBQzFCLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUTtZQUN6QixXQUFXLEVBQUUsT0FBTyxFQUFFLE1BQU07WUFDNUIsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNO1NBQ2YsQ0FBQztRQUNYLE1BQU0saUJBQWlCLEdBQUc7WUFDekIsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPO1NBQ2YsQ0FBQztRQUlFLFlBQUksR0FBeUI7WUFDekMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQ3RELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUM1RCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDNUQsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQzFELEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUNsRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDeEQsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQ3hELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUM1RCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDeEQsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUM1QyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1lBQzFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7WUFDNUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUMvQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1NBQ2pDLENBQUM7UUFDWCxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBSixRQUFBLElBQUksRUFBRSxDQUFDLENBQUM7UUFFdkIsaUJBQVMsR0FBRyxRQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEMsY0FBTSxHQUE2QixNQUFNLENBQUMsV0FBVyxDQUFDLFFBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQVUsQ0FBQyxDQUFDLENBQUM7UUFDM0YsY0FBTSxHQUE0QixNQUFNLENBQUMsV0FBVyxDQUFDLFFBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQVUsQ0FBQyxDQUFDLENBQUM7UUFDMUYsZUFBTyxHQUFtQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdILFNBQWdCLFlBQVksQ0FBQyxLQUFZO1lBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLE9BQU8sSUFBSSxPQUFPLENBQUM7Z0JBQ2xCLEtBQUssRUFBRTtvQkFDTixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUU7b0JBQy9DLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRTtvQkFDL0MsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFO29CQUMvQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUU7aUJBQy9DO2dCQUNELEtBQUssRUFBRTtvQkFDTixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRTtpQkFDM0M7YUFDRCxDQUFDLENBQUM7UUFDSixDQUFDO1FBYmUsb0JBQVksZUFhM0IsQ0FBQTtJQUVGLENBQUMsRUFuRGdCLEtBQUssR0FBTCxZQUFLLEtBQUwsWUFBSyxRQW1EckI7SUFDRCxJQUFpQixJQUFJLENBZ0hwQjtJQWhIRCxXQUFpQixNQUFJO1FBTVAsV0FBSSxHQUFlO1lBQy9CLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLHlCQUF5QixFQUFFO1lBQzNFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLDhCQUE4QixFQUFFO1lBQ2hGLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLG1DQUFtQyxFQUFFO1lBQ25GLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLG1DQUFtQyxFQUFFO1lBQ3ZGO2dCQUNDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUc7Z0JBQ3hCLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO29CQUNyQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDL0IsQ0FBQzthQUNEO1NBQ0QsQ0FBQztRQUVXLFlBQUssR0FBRztZQUNwQixPQUFPLEVBQUUseUJBQXlCO1lBQ2xDLGNBQWMsRUFBRSx5QkFBeUI7WUFDekMsT0FBTyxFQUFFLDhCQUE4QjtZQUN2QyxlQUFlLEVBQUUseUJBQXlCO1lBQzFDLGNBQWMsRUFBRSw4QkFBOEI7WUFDOUMsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxTQUFTLEVBQUUseUJBQXlCO1lBRXBDLGtCQUFrQixFQUFFLHlCQUF5QjtZQUM3QyxZQUFZLEVBQUUseUJBQXlCO1lBRXZDLGNBQWMsRUFBRSx5QkFBeUI7WUFFekMsU0FBUyxFQUFFLG1DQUFtQztZQUU5QyxLQUFLLEVBQUUsd0NBQXdDO1NBQ3RDLENBQUM7UUFFRSxhQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELGFBQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFckUsU0FBZ0IsWUFBWSxDQUFDLEtBQWdCO1lBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLE9BQU8sSUFBSSxPQUFPLENBQUM7Z0JBQ2xCLEtBQUssRUFBRTtvQkFDTixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7b0JBQzdDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtvQkFDN0MsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO29CQUM3QyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7aUJBQzdDO2dCQUNELEtBQUssRUFBRTtvQkFDTixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7aUJBQ25EO2FBQ0QsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQWJlLG1CQUFZLGVBYTNCLENBQUE7UUFFRCw4RkFBOEY7UUFDOUYsOEJBQThCO1FBQzlCLHFEQUFxRDtRQUNyRCwwQkFBMEI7UUFDMUIsa0NBQWtDO1FBQ2xDLGlDQUFpQztRQUNqQywwRUFBMEU7UUFDMUUsd0RBQXdEO1FBQ3hELE1BQU07UUFDTix3REFBd0Q7UUFDeEQsOEVBQThFO1FBQzlFLFFBQVE7UUFDUix1QkFBdUI7UUFDdkIsMEJBQTBCO1FBQzFCLHlCQUF5QjtRQUN6QiwwQkFBMEI7UUFDMUIsdUJBQXVCO1FBQ3ZCLE1BQU07UUFDTiwrQkFBK0I7UUFDL0IsTUFBTTtRQUNOLHVEQUF1RDtRQUN2RCx3RUFBd0U7UUFDeEUsc0VBQXNFO1FBQ3RFLHlFQUF5RTtRQUN6RSw0RUFBNEU7UUFDNUUsUUFBUTtRQUNSLDRCQUE0QjtRQUM1Qiw0QkFBNEI7UUFDNUIsNEJBQTRCO1FBQzVCLDRCQUE0QjtRQUM1Qiw0QkFBNEI7UUFDNUIsTUFBTTtRQUNOLDJCQUEyQjtRQUMzQixNQUFNO1FBQ04sMkJBQTJCO1FBQzNCLE1BQU07UUFDTiw0QkFBNEI7UUFDNUIsTUFBTTtRQUNOLCtCQUErQjtRQUMvQixNQUFNO1FBQ04sNEJBQTRCO1FBQzVCLE1BQU07UUFDTixnQ0FBZ0M7UUFDaEMsTUFBTTtRQUNOLCtCQUErQjtRQUMvQixNQUFNO1FBQ04sK0JBQStCO1FBQy9CLE1BQU07UUFDTix3REFBd0Q7UUFDeEQsbUNBQW1DO1FBQ25DLE1BQU07UUFDTixJQUFJO1FBRUosOEVBQThFO1FBRWpFLGVBQVEsR0FBRyxPQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQyxFQWhIZ0IsSUFBSSxHQUFKLFdBQUksS0FBSixXQUFJLFFBZ0hwQjtJQUNELElBQWlCLElBQUksQ0FTcEI7SUFURCxXQUFpQixJQUFJO1FBRVAsU0FBSSxHQUFlO1lBQy9CLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1lBQzdCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1NBQzVCLENBQUM7UUFDVyxXQUFNLEdBQWdDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRixXQUFNLEdBQTJCLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU5RixDQUFDLEVBVGdCLElBQUksR0FBSixXQUFJLEtBQUosV0FBSSxRQVNwQjtJQUVELElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9FLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRWxCLGNBQU8sR0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLGNBQU8sR0FBeUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQTJLRTtBQUNILENBQUMsRUFsV2dCLE1BQU0sS0FBTixNQUFNLFFBa1d0QjtBQXVCRCxNQUFNLE9BQU8sVUFBVTtJQUN0QixLQUFLLEdBQWEsTUFBTSxDQUFDO0lBQ3pCLEtBQUssR0FBVSxPQUFPLENBQUM7SUFFdkIsSUFBSSxHQUFlLENBQUMsQ0FBQztJQUFDLEVBQUUsR0FBZSxDQUFDLENBQUM7SUFDekMsWUFBWSxNQUE4QjtRQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsS0FBSyxLQUFLLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLElBQUksV0FBVztRQUNkLE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQztJQUNELFVBQVUsQ0FBQyxHQUFnQjtRQUMxQixRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDbkIsS0FBSyxNQUFNLENBQUMsQ0FBQztnQkFDWixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVCLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLE9BQU87YUFDUDtZQUNELE9BQU8sQ0FBQyxDQUFDO2dCQUNSLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hCO1NBQ0Q7SUFDRixDQUFDO0lBQ0QsV0FBVyxDQUFDLEdBQWdCO1FBQzNCLFFBQVEsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNuQixLQUFLLE1BQU0sQ0FBQyxDQUFDO2dCQUNaLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUIsT0FBTzthQUNQO1lBQ0QsT0FBTyxDQUFDLENBQUM7Z0JBQ1IsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEI7U0FDRDtJQUNGLENBQUM7SUFDRCxPQUFPO1FBQ04sUUFBUTtRQUNSLE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBUztRQUM1QixRQUFRO1FBQ1IsT0FBTyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzQixDQUFDO0NBQ0Q7QUFNRCxNQUFNLE9BQU8sV0FBVztJQUN2QixLQUFLLEdBQWMsUUFBUSxDQUFDO0lBQzVCLEtBQUssR0FBVSxNQUFNLENBQUM7SUFDdEIsSUFBSSxHQUFlLENBQUMsQ0FBQztJQUFDLEVBQUUsR0FBZSxDQUFDLENBQUM7SUFFekMsWUFBWSxNQUErQjtRQUMxQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QixJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtZQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztTQUNwQjtJQUNGLENBQUM7SUFFRCxLQUFLLEtBQUssT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekMsU0FBUyxDQUFDLEdBQWdCLEVBQUUsS0FBYztRQUN6QyxRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDbkIsS0FBSyxRQUFRLENBQUMsQ0FBQztnQkFDZCxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQyxPQUFPO2FBQ1A7WUFDRCxLQUFLLFFBQVEsQ0FBQyxDQUFDO2dCQUNkLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDMUIsMkJBQTJCO2dCQUMzQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQzVCLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsT0FBTzthQUNQO1lBQ0QsS0FBSyxNQUFNLENBQUMsQ0FBQztnQkFDWixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVCLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzFCLE9BQU87YUFDUDtZQUNELEtBQUssVUFBVSxDQUFDLENBQUM7Z0JBQ2hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFMUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM1QixJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUUxQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRzFCLG1DQUFtQztnQkFDbkMseUNBQXlDO2dCQUN6QyxrQ0FBa0M7Z0JBQ2xDLGtEQUFrRDtnQkFDbEQsMkNBQTJDO2dCQUMzQyxrREFBa0Q7Z0JBQ2xELDJDQUEyQztnQkFDM0MsdUJBQXVCO2dCQUN2QixrQkFBa0I7Z0JBQ2xCLG9CQUFvQjtnQkFDcEIsTUFBTTthQUNOO1lBQ0QsT0FBTyxDQUFDLENBQUM7Z0JBQ1IsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDZixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxFQUFFO3dCQUMxQixHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtxQkFDakM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pELENBQUMsQ0FBQyxDQUFDO2dCQUNILE9BQU87YUFDUDtTQUNEO0lBQ0YsQ0FBQztJQUNELE9BQU87UUFDTixPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQ3hDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQ25DLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUMzQixHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDekIsRUFBRSxDQUFBO0lBQ0osQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBUztRQUM1QixPQUFPLElBQUksV0FBVyxDQUFDO1lBQ3RCLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQ3BDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQ3JDLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixFQUFFLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEIsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztDQUNEO0FBQ0QsTUFBTSxPQUFPLFdBQVc7SUFDdkIsS0FBSyxHQUFjLFFBQVEsQ0FBQztJQUM1QixLQUFLLEdBQVUsT0FBTyxDQUFDO0lBRXZCLElBQUksR0FBZSxDQUFDLENBQUM7SUFBQyxFQUFFLEdBQWUsQ0FBQyxDQUFDO0lBQ3pDLFlBQVksTUFBK0I7UUFDMUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNELEtBQUssS0FBSyxPQUFPLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxTQUFTLENBQUMsR0FBZ0I7UUFDekIsUUFBUSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ25CLEtBQUssT0FBTyxDQUFDLENBQUM7Z0JBQ2IsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDeEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNoQixPQUFPO2FBQ1A7WUFDRCxLQUFLLFFBQVEsQ0FBQyxDQUFDO2dCQUNkLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUU7b0JBQ3BDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3hCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDaEIsT0FBTztpQkFDUDtnQkFBQSxDQUFDO2dCQUNGLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3JDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDaEIsT0FBTzthQUNQO1lBQ0QsT0FBTyxDQUFDLENBQUM7Z0JBQ1IsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEI7U0FDRDtJQUNGLENBQUM7SUFDRCxJQUFJLENBQUMsR0FBZ0I7UUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0QsSUFBSSxDQUFDLEdBQWdCO1FBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFDRCxPQUFPO1FBQ04sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUN4QyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUNuQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDM0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQ3pCLEVBQUUsQ0FBQTtJQUNKLENBQUM7SUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQVM7UUFDNUIsT0FBTyxJQUFJLFdBQVcsQ0FBQztZQUN0QixLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUNwQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUNyQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsRUFBRSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hCLENBQUMsQ0FBQTtJQUNILENBQUM7Q0FDRDtBQUVELE1BQU0sWUFBWSxHQUFhO0lBQzlCLElBQUksRUFBRTtRQUNMLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUNsRCxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7S0FDbEQ7SUFDRCxLQUFLLEVBQUU7UUFDTixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDbkQsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ25ELEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtLQUNyRDtJQUNELEtBQUssRUFBRTtRQUNOLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtLQUNuRDtDQUNELENBQUE7QUFJRCxNQUFNLE9BQU8sT0FBTztJQUNuQixVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsSUFBSSxHQUFpQixFQUFFLENBQUM7SUFDeEIsS0FBSyxHQUFrQixFQUFFLENBQUM7SUFDMUIsS0FBSyxHQUFrQixFQUFFLENBQUM7SUFHMUIsTUFBTSxDQUFDLFVBQVU7UUFDaEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7WUFDWixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsT0FBTyxDQUFDLENBQUM7SUFDVixDQUFDO0lBRUQsWUFBWSxNQUE2QixFQUFFLFVBQW1CO1FBQzdELElBQUksTUFBTSxFQUFFO1lBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0QsSUFBSyxNQUFrQixDQUFDLFVBQVUsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBSSxNQUFrQixDQUFDLFVBQVUsQ0FBQzthQUNqRDtTQUNEO1FBQ0QsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxNQUFNLENBQUMsV0FBVztZQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxVQUFVLENBQUMsVUFBbUI7UUFDN0IsVUFBVSxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDL0IsT0FBTyxHQUFHLEdBQUcsSUFBSSxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsdUJBQXVCLENBQUMsR0FBZ0IsRUFBRSxVQUFtQjtRQUM1RCxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2YsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELHNCQUFzQixDQUFDLEdBQWdCO1FBQ3RDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDZixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLG9FQUFvRTtZQUVwRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFakUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUtELFNBQVMsQ0FBQyxHQUFlLEVBQUUsR0FBZ0I7UUFDMUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDckIsR0FBRyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVoQixJQUFJLEdBQUcsQ0FBQyxLQUFLLElBQUksTUFBTSxFQUFFO1lBQ3hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNiO2FBQU07WUFDTixNQUFNLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDMUI7SUFFRixDQUFDO0lBQ0QsUUFBUSxDQUFDLElBQWlCLEVBQUUsR0FBZ0I7UUFDM0MsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3RELElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPO1lBQUU7WUFDMUIsdURBQXVEO2FBQ3ZELENBQUE7UUFFRCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFpQixFQUFFLEdBQWdCO1FBQzNDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRXhFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsWUFBWSxDQUFDLEdBQWdCLEVBQUUsUUFBa0I7UUFDaEQsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCxlQUFlLENBQUMsR0FBZ0IsRUFBRSxRQUFrQjtRQUNuRCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqQyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNyQixHQUFHLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztRQUMzQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsVUFBVSxDQUFDLEdBQWdCO1FBQzFCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUtELEtBQUs7UUFDSixPQUFPLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFDRCxZQUFZO1FBQ1gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsRSxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUNuRCxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNYLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUk7b0JBQUUsT0FBTyxLQUFLLENBQUM7YUFDM0Q7aUJBQU07Z0JBQ04sSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJO29CQUFFLE9BQU8sS0FBSyxDQUFDO2FBQ3RDO1NBQ0Q7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQ25ELElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRTtnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ1gsSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSTtvQkFBRSxPQUFPLEtBQUssQ0FBQzthQUMzRDtpQkFBTTtnQkFDTixJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUk7b0JBQUUsT0FBTyxLQUFLLENBQUM7YUFDdEM7WUFDRCxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUMxRCxJQUFJLElBQUksSUFBSSxJQUFJO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUMvQixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztvQkFBRSxPQUFPLEtBQUssQ0FBQzthQUNqQztTQUNEO1FBQ0QsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFpQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEQsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFhLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUNqQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDekI7U0FDRDtRQUNELEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFBRSxPQUFPLEtBQUssQ0FBQztnQkFDbEMsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFBRSxPQUFPLEtBQUssQ0FBQztnQkFDakMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQ3pCO1NBQ0Q7UUFDRCxxQkFBcUI7UUFFckIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBQ0QsU0FBUztRQUNSLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFBQyxDQUFDLEVBQUUsQ0FBQztnQkFBQyxTQUFTO2FBQUU7WUFDOUQsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRTtnQkFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUFFO1NBQy9DO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUczQyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQWlCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQWEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25DLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzthQUN6QjtTQUNEO1FBQ0QsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbkMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQ3pCO1NBQ0Q7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFHNUQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUE2QixDQUFDO1FBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQUUsU0FBUztZQUN6QixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDcEQsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO2FBQ1Y7aUJBQU07Z0JBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksV0FBVyxDQUFDO29CQUN0QyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBVSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVE7aUJBQzlELENBQUMsQ0FBQyxDQUFDO2FBQ0o7U0FDRDtRQUNELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUNwRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDekQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3hCO1NBQ0Q7UUFDRCxjQUFjO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUN6QixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLE9BQU8sQ0FBQyxLQUFLLENBQUMscUNBQXFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0QsSUFBSSxNQUFNLENBQUMsY0FBYztnQkFBRSxRQUFRLENBQUM7U0FDcEM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxPQUFPO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELGVBQWUsQ0FBQyxDQUFTO1FBQ3hCLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUN0QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQzFCLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQ3hELENBQUM7SUFDSCxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQTBCO1FBQ3RDLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxFQUFFLElBQUksRUFBRTtnQkFBRSxPQUFPLEtBQUssQ0FBQztTQUMzQjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUNELFNBQVMsQ0FBQyxLQUEwQjtRQUNuQyxJQUFJLENBQUMsS0FBSztZQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxPQUFPLENBQUM7WUFDbEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDckMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDckMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7U0FDbEMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFlO1FBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBR0Qsd0JBQXdCLENBQUMsZ0JBQTBCO1FBQ2xELE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUV2RSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM3RCxTQUFTLE9BQU8sQ0FBbUQsR0FBTTtZQUN4RSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVyRixJQUFJLElBQUksR0FBTSxHQUFHLENBQUMsS0FBSyxFQUFPLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDO1lBQy9DLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQztZQUVuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFBRSxTQUFTO2dCQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFBRSxTQUFTO2dCQUMxQixJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUNqQixJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBTyxDQUFDO29CQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztvQkFDZCxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2hCO3FCQUFNO29CQUNOLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztpQkFDVjthQUNEO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBQ0QsT0FBTyxJQUFJLE9BQU8sQ0FBQztZQUNsQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ2xDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDbEMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztTQUNoQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsWUFBWTtRQUNYLFNBQVMsT0FBTyxDQUFDLElBQWlCO1lBQ2pDLE9BQU8sSUFBSSxXQUFXLENBQUM7Z0JBQ3RCLEtBQUssRUFBRSxPQUFPO2dCQUNkLEtBQUssRUFBRSxPQUFPO2dCQUNkLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTthQUM1QixDQUFDLENBQUM7UUFDSixDQUFDO1FBQ0QsT0FBTyxJQUFJLE9BQU8sQ0FBQztZQUNsQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1NBQ2xDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUNELFdBQVc7UUFDVixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFDRCxXQUFXLENBQUMsS0FBdUI7UUFDbEMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNELEtBQUssQ0FBQyxLQUErQjtRQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFlLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2RSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RCLElBQUksS0FBSyxFQUFFO2dCQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDO29CQUMvQixLQUFLO29CQUNMLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDO29CQUNsQixLQUFLLEVBQUUsUUFBUTtpQkFDZixDQUFDLENBQUMsQ0FBQTthQUNIO1FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUFBLENBQUM7SUFDMUIsQ0FBQztJQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBWTtRQUNqQyxPQUFPLElBQUksT0FBTyxDQUFDO1lBQ2xCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRztvQkFBRSxPQUFPLElBQTBCLENBQUM7Z0JBQ25ELE9BQU8sSUFBSSxXQUFXLENBQUM7b0JBQ3RCLEtBQUssRUFBRSxRQUFRO29CQUNmLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ1gsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7aUJBQ2YsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRztvQkFBRSxPQUFPLElBQTBCLENBQUM7Z0JBQ25ELE9BQU8sSUFBSSxXQUFXLENBQUM7b0JBQ3RCLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO29CQUNwQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDO29CQUNYLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO2lCQUNmLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLEVBQUUsRUFBRTtTQUNSLENBQUMsQ0FBQztJQUNKLENBQUM7SUFHRCxPQUFPO1FBQ04sT0FBTyxTQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FDeEQsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQy9DLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUM5QyxFQUFFLENBQUM7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFXO1FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUMxQixLQUFLLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDaEMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN6RDtZQUNELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekQ7WUFDRCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZEO1NBQ0Q7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7Q0FDRDtBQUdELFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBUTtJQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEIsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2QsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFTRCxRQUFRO0FBQ1IscURBQXFEO0FBQ3JELGlEQUFpRDtBQUNqRCwrQkFBK0I7QUFDL0Isc0RBQXNEO0FBQ3RELHFCQUFxQjtBQUNyQiw0QkFBNEI7QUFDNUIsSUFBSTtBQUVKLHlCQUF5QjtBQUN6Qiw4QkFBOEI7QUFNOUIsc0RBQXNEO0FBQ3RELDZCQUE2QjtBQUM3Qiw2RkFBNkY7QUFDN0YscUJBQXFCO0FBQ3JCLE1BQU07QUFDTiwyQkFBMkI7QUFDM0IsZ0JBQWdCO0FBQ2hCLDZCQUE2QjtBQUM3QixtQkFBbUI7QUFDbkIsT0FBTztBQUNQLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGFyLCByb3RhdGlvbjI0LCBzdHlsZVN0cmluZywgU3pDb250ZXh0MkQgfSBmcm9tIFwiLi9TekNvbnRleHQyRC5qc1wiO1xyXG5cclxuY29uc3QgY29uZmlnID0ge1xyXG5cdGRpc2FibGVDdXRzOiB0cnVlLFxyXG5cdGRpc2FibGVRdWFkQ29sb3JzOiB0cnVlLFxyXG5cdGRlYnVnQmFkTGF5ZXJzOiB0cnVlLFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBjdXRTaGFwZSA9IChcclxuXHR8ICdsaW5lJ1xyXG4pO1xyXG5leHBvcnQgdHlwZSBxdWFkU2hhcGUgPSAoXHJcblx0fCAnY2lyY2xlJyB8ICdzcXVhcmUnIHwgJ3N0YXInIHwgJ3dpbmRtaWxsJ1xyXG5cdHwgJ2NvdmVyJ1xyXG4pO1xyXG5leHBvcnQgdHlwZSBhcmVhU2hhcGUgPSAoXHJcblx0fCAnd2hvbGUnIHwgJ3NlY3RvcidcclxuKTtcclxuZXhwb3J0IHR5cGUgY29sb3IgPVxyXG5cdHwgJ3JlZCcgfCAnb3JhbmdlJyB8ICd5ZWxsb3cnXHJcblx0fCAnbGF3bmdyZWVuJyB8ICdncmVlbicgfCAnY3lhbidcclxuXHR8ICdibHVlJyB8ICdwdXJwbGUnIHwgJ3BpbmsnXHJcblx0fCAnYmxhY2snIHwgJ2dyZXknIHwgJ3doaXRlJ1xyXG5cdHwgJ2NvdmVyJyB8ICdub25lJztcclxuXHJcbmV4cG9ydCB0eXBlIGNvbG9yQ2hhciA9ICdyJyB8ICdnJyB8ICdiJyB8ICctJztcclxuZXhwb3J0IHR5cGUgY29sb3JTdHJpbmcgPSBgJHtjb2xvckNoYXJ9JHtjb2xvckNoYXJ9JHtjb2xvckNoYXJ9YDtcclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgU3pJbmZvIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIGNvbG9yIHtcclxuXHRcdGNvbnN0IGNvbG9yV2hlZWxOYW1lTGlzdCA9IFtcclxuXHRcdFx0J3JlZCcsICdvcmFuZ2UnLCAneWVsbG93JyxcclxuXHRcdFx0J2xhd25ncmVlbicsICdncmVlbicsICdjeWFuJyxcclxuXHRcdFx0J2JsdWUnLCAncHVycGxlJywgJ3BpbmsnLFxyXG5cdFx0XSBhcyBjb25zdDtcclxuXHRcdGNvbnN0IGNvbG9yR3JleU5hbWVMaXN0ID0gW1xyXG5cdFx0XHQnYmxhY2snLCAnZ3JleScsICd3aGl0ZScsXHJcblx0XHRdIGFzIGNvbnN0O1xyXG5cclxuXHRcdGV4cG9ydCB0eXBlIGNvbG9ySW5mbyA9IHsgbmFtZTogY29sb3IsIHN0eWxlOiBzdHlsZVN0cmluZywgY29kZTogY2hhciwgY29tYm8/OiBjb2xvclN0cmluZyB9OyAvLyBiYmdncnJcclxuXHJcblx0XHRleHBvcnQgY29uc3QgbGlzdDogcmVhZG9ubHkgY29sb3JJbmZvW10gPSBbXHJcblx0XHRcdHsgbmFtZTogJ3JlZCcsIHN0eWxlOiAncmVkJywgY29kZTogJ3InLCBjb21ibzogJ3JycicgfSxcclxuXHRcdFx0eyBuYW1lOiAnb3JhbmdlJywgc3R5bGU6ICdvcmFuZ2UnLCBjb2RlOiAnbycsIGNvbWJvOiAnZ3JyJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICd5ZWxsb3cnLCBzdHlsZTogJ3llbGxvdycsIGNvZGU6ICd5JywgY29tYm86ICdnZ3InIH0sXHJcblx0XHRcdHsgbmFtZTogJ2dyZWVuJywgc3R5bGU6ICdncmVlbicsIGNvZGU6ICdnJywgY29tYm86ICdnZ2cnIH0sXHJcblx0XHRcdHsgbmFtZTogJ2xhd25ncmVlbicsIHN0eWxlOiAnbGF3bmdyZWVuJywgY29kZTogJ2wnLCBjb21ibzogJ2JnZycgfSxcclxuXHRcdFx0eyBuYW1lOiAnY3lhbicsIHN0eWxlOiAnY3lhbicsIGNvZGU6ICdjJywgY29tYm86ICdiYmcnIH0sXHJcblx0XHRcdHsgbmFtZTogJ2JsdWUnLCBzdHlsZTogJ2JsdWUnLCBjb2RlOiAnYicsIGNvbWJvOiAnYmJiJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdwdXJwbGUnLCBzdHlsZTogJ3B1cnBsZScsIGNvZGU6ICd2JywgY29tYm86ICdiYnInIH0sXHJcblx0XHRcdHsgbmFtZTogJ3BpbmsnLCBzdHlsZTogJ3BpbmsnLCBjb2RlOiAncCcsIGNvbWJvOiAnYnJyJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdibGFjaycsIHN0eWxlOiAnYmxhY2snLCBjb2RlOiAnaycgfSxcclxuXHRcdFx0eyBuYW1lOiAnZ3JleScsIHN0eWxlOiAnZ3JleScsIGNvZGU6ICd1JyB9LFxyXG5cdFx0XHR7IG5hbWU6ICd3aGl0ZScsIHN0eWxlOiAnd2hpdGUnLCBjb2RlOiAndycgfSxcclxuXHRcdFx0eyBuYW1lOiAnY292ZXInLCBzdHlsZTogJ3N6LWNvdmVyJywgY29kZTogJ2onIH0sXHJcblx0XHRcdHsgbmFtZTogJ25vbmUnLCBzdHlsZTogJ25vbmUnLCBjb2RlOiAnLScgfSxcclxuXHRcdF0gYXMgY29uc3Q7XHJcblx0XHRPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgbGlzdCB9KTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgY29sb3JMaXN0ID0gbGlzdC5tYXAoZSA9PiBlLm5hbWUpO1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBieU5hbWU6IFJlY29yZDxjb2xvciwgY29sb3JJbmZvPiA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0Lm1hcChlID0+IFtlLm5hbWUsIGVdIGFzIGNvbnN0KSk7XHJcblx0XHRleHBvcnQgY29uc3QgYnlDaGFyOiBSZWNvcmQ8Y2hhciwgY29sb3JJbmZvPiA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0Lm1hcChlID0+IFtlLmNvZGUsIGVdIGFzIGNvbnN0KSk7XHJcblx0XHRleHBvcnQgY29uc3QgYnlDb21ibzogUmVjb3JkPGNvbG9yU3RyaW5nLCBjb2xvckluZm8+ID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QuZmlsdGVyKGUgPT4gZS5jb21ibykubWFwKGUgPT4gW2UuY29tYm8hLCBlXSkpO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBleGFtcGxlTGF5ZXIoY29sb3I6IGNvbG9yKSB7XHJcblx0XHRcdGxldCBpID0gMDtcclxuXHRcdFx0cmV0dXJuIG5ldyBTekxheWVyKHtcclxuXHRcdFx0XHRxdWFkczogW1xyXG5cdFx0XHRcdFx0eyBzaGFwZTogJ2NpcmNsZScsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnc3F1YXJlJywgZnJvbTogaSwgdG86IGkgKz0gNiwgY29sb3IgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdjaXJjbGUnLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvciB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZTogJ3NxdWFyZScsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yIH0sXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRhcmVhczogW1xyXG5cdFx0XHRcdFx0eyBzaGFwZTogJ3NlY3RvcicsIGZyb206IDAsIHRvOiAyNCwgY29sb3IgfSxcclxuXHRcdFx0XHRdXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBxdWFkIHtcclxuXHRcdGV4cG9ydCB0eXBlIHF1YWRJbmZvID0ge1xyXG5cdFx0XHRuYW1lOiBxdWFkU2hhcGUsIGNvZGU6IGNoYXIsIGNvbWJvPzogc3RyaW5nLCBzcGF3bj86IHN0cmluZyxcclxuXHRcdFx0cGF0aD86IChjdHg6IFN6Q29udGV4dDJELCBxdWFkOiBTekxheWVyUXVhZCkgPT4gdm9pZCxcclxuXHRcdH07XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IGxpc3Q6IHF1YWRJbmZvW10gPSBbXHJcblx0XHRcdHsgbmFtZTogJ2NpcmNsZScsIGNvZGU6ICdDJywgY29tYm86ICdDJywgc3Bhd246ICdzeiFsIXp8cSFDLTBvfGEhc3Uwb3xjIScgfSxcclxuXHRcdFx0eyBuYW1lOiAnc3F1YXJlJywgY29kZTogJ1InLCBjb21ibzogJ1InLCBzcGF3bjogJ3N6IWwhenxxIVItMGMsUi1jb3xhIXN1MG98YyEnIH0sXHJcblx0XHRcdHsgbmFtZTogJ3N0YXInLCBjb2RlOiAnUycsIGNvbWJvOiAnUycsIHNwYXduOiAnc3ohbCF6fHEhUy00YyxTLWNrLFMta3N8YSFzdTBvfGMhJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICd3aW5kbWlsbCcsIGNvZGU6ICdXJywgY29tYm86ICdXJywgc3Bhd246ICdzeiFsIXp8cSFTLTRjLFMtY2ssUy1rc3xhIXN1MG98YyEnIH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnY292ZXInLCBjb2RlOiAnSicsXHJcblx0XHRcdFx0cGF0aChjdHgsIHsgZnJvbSwgdG8gfSkge1xyXG5cdFx0XHRcdFx0Y3R4LmFyYygwLCAwLCAxLjE1LCBmcm9tLCB0byk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdF07XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IG5hbWVkID0ge1xyXG5cdFx0XHRjaXJjbGUxOiAnc3ohbCF6fHEhQy0wb3xhIXN1MG98YyEnLFxyXG5cdFx0XHRjaXJjbGVIYWxmTGVmdDogJ3N6IWwhenxxIUMtY298YSFzdTBvfGMhJyxcclxuXHRcdFx0c3F1YXJlMjogJ3N6IWwhenxxIVItMGMsUi1jb3xhIXN1MG98YyEnLFxyXG5cdFx0XHRzcXVhcmVIYWxmUmlnaHQ6ICdzeiFsIXp8cSFSLTBjfGEhc3Uwb3xjIScsXHJcblx0XHRcdGNpcmNsZUhhbGZUb3AyOiAnc3ohbCF6fHEhQy0wNixDLWlvfGEhc3VpdXxjIScsXHJcblx0XHRcdGNpcmNsZVF1YWQxOiAnc3ohbCF6fHEhQy1vdXxhIXN1MG98YyEnLFxyXG5cdFx0XHRjaXJjbGVSZWQ6ICdzeiFsIXp8cSFDLTBvfGEhc3Iwb3xjIScsXHJcblxyXG5cdFx0XHRzcXVhcmVoYWxmTGVmdEJsdWU6ICdzeiFsIXp8cSFSLWNvfGEhc2Iwb3xjIScsXHJcblx0XHRcdGNpcmNsZVB1cnBsZTogJ3N6IWwhenxxIUMtMG98YSFzdjBvfGMhJyxcclxuXHJcblx0XHRcdHNxdWFyZTNUb3BCbHVlOiAnc3ohbCF6fHEhUi1rc3xhIXNia3N8YyEnLFxyXG5cclxuXHRcdFx0c3RhcjNDeWFuOiAnc3ohbCF6fHEhUy00YyxTLWNrLFMta3N8YSFzYzBvfGMhJyxcclxuXHJcblx0XHRcdHNxdWlkOiAnc3ohbCF6fHEhUy02YyxTLWNpLEMtaXV8YSFzYzZpLHNnaXV8YyEnLFxyXG5cdFx0fSBhcyBjb25zdDtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgYnlOYW1lID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UubmFtZSwgZV0pKTtcclxuXHRcdGV4cG9ydCBjb25zdCBieUNoYXIgPSBPYmplY3QuZnJvbUVudHJpZXMobGlzdC5tYXAoZSA9PiBbZS5jb2RlLCBlXSkpO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBleGFtcGxlTGF5ZXIoc2hhcGU6IHF1YWRTaGFwZSkge1xyXG5cdFx0XHRsZXQgaSA9IDA7XHJcblx0XHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdFx0cXVhZHM6IFtcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGFyZWFzOiBbXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnc2VjdG9yJywgZnJvbTogMCwgdG86IDI0LCBjb2xvcjogJ2dyZXknIH0sXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZXhwb3J0IGNvbnN0IGV4dHJhU2hhcGVzOiBSZWNvcmQ8c3RyaW5nLCAoY3R4OiBTekNvbnRleHQyRCwgcXVhZDogU3pMYXllclF1YWQpID0+IHZvaWQ+ID0ge1xyXG5cdFx0Ly8gXHRjbG92ZXIoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Ly8gXHRcdC8vIGJlZ2luKHsgc2l6ZTogMS4zLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0Ly8gXHRcdC8vIGNvbnN0IGlubmVyID0gMC41O1xyXG5cdFx0Ly8gXHRcdC8vIGNvbnN0IGlubmVyX2NlbnRlciA9IDAuNDU7XHJcblx0XHQvLyBcdFx0Ly8gY29udGV4dC5saW5lVG8oMCwgaW5uZXIpO1xyXG5cdFx0Ly8gXHRcdC8vIGNvbnRleHQuYmV6aWVyQ3VydmVUbygwLCAxLCBpbm5lciwgMSwgaW5uZXJfY2VudGVyLCBpbm5lcl9jZW50ZXIpO1xyXG5cdFx0Ly8gXHRcdC8vIGNvbnRleHQuYmV6aWVyQ3VydmVUbygxLCBpbm5lciwgMSwgMCwgaW5uZXIsIDApO1xyXG5cdFx0Ly8gXHR9LFxyXG5cdFx0Ly8gXHRzdGFyOChjdHg6IFN6Q29udGV4dDJELCB7IGZyb20sIHRvIH06IFN6TGF5ZXJRdWFkKSB7XHJcblx0XHQvLyBcdFx0Y29uc3QgciA9IDEuMjIgLyAyLCBSID0gMS4yMiwgZCA9IChuOiBudW1iZXIpID0+IGZyb20gKiAoMSAtIG4pICsgdG8gKiBuO1xyXG5cdFx0Ly8gXHRcdGN0eFxyXG5cdFx0Ly8gXHRcdFx0LmxpbmVUb1IociwgZCgwKSlcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKFIsIGQoMC4yNSkpXHJcblx0XHQvLyBcdFx0XHQubGluZVRvUihyLCBkKDAuNSkpXHJcblx0XHQvLyBcdFx0XHQubGluZVRvUihSLCBkKDAuNzUpKVxyXG5cdFx0Ly8gXHRcdFx0LmxpbmVUb1IociwgZCgxKSlcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0cmhvbWJ1cyhjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHQvLyBcdH0sXHJcblx0XHQvLyBcdHBsdXMoY3R4OiBTekNvbnRleHQyRCwgeyBmcm9tLCB0byB9OiBTekxheWVyUXVhZCkge1xyXG5cdFx0Ly8gXHRcdGNvbnN0IHIgPSAwLjQsIFIgPSAxLjAsIGQgPSAobjogbnVtYmVyKSA9PiBmcm9tICogKDEgLSBuKSArIHRvICogbjtcclxuXHRcdC8vIFx0XHRjb25zdCByciA9IChyMTogbnVtYmVyLCByMjogbnVtYmVyKSA9PiAocjEgKiByMSArIHIyICogcjIpICoqIDAuNVxyXG5cdFx0Ly8gXHRcdGNvbnN0IGF0ID0gKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBNYXRoLmF0YW4yKGIsIGEpIC8gTWF0aC5QSSAqIDI7XHJcblx0XHQvLyBcdFx0Y29uc3QgdG9yID0gKHI6IG51bWJlciwgUjogbnVtYmVyKSA9PiBbcnIociwgUiksIGQoYXQociwgUikpXSBhcyBjb25zdDtcclxuXHRcdC8vIFx0XHRjdHhcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcihSLCAwKSlcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcihSLCByKSlcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcihyLCByKSlcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcihyLCBSKSlcclxuXHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcigwLCBSKSlcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0c2F3KGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0c3VuKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0bGVhZihjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHQvLyBcdH0sXHJcblx0XHQvLyBcdGRpYW1vbmQoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Ly8gXHR9LFxyXG5cdFx0Ly8gXHRtaWxsKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0aGFsZmxlYWYoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Ly8gXHR9LFxyXG5cdFx0Ly8gXHR5aW55YW5nKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIFx0b2N0YWdvbihjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHQvLyBcdH0sXHJcblx0XHQvLyBcdGNvdmVyKGN0eDogU3pDb250ZXh0MkQsIHsgZnJvbSwgdG8gfTogU3pMYXllclF1YWQpIHtcclxuXHRcdC8vIFx0XHRjdHguYXJjKDAsIDAsIDEuMTUsIGZyb20sIHRvKTtcclxuXHRcdC8vIFx0fSxcclxuXHRcdC8vIH1cclxuXHJcblx0XHQvLyBPYmplY3QuZW50cmllcyhleHRyYVNoYXBlcykubWFwKChbaywgdl0pID0+IGxpc3QucHVzaCh7IG5hbWU6IGsgfSBhcyBhbnkpKTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgcXVhZExpc3QgPSBsaXN0Lm1hcChlID0+IGUubmFtZSk7XHJcblx0fVxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgYXJlYSB7XHJcblx0XHRleHBvcnQgdHlwZSBhcmVhSW5mbyA9IHsgbmFtZTogYXJlYVNoYXBlLCBjb2RlOiBjaGFyIH07XHJcblx0XHRleHBvcnQgY29uc3QgbGlzdDogYXJlYUluZm9bXSA9IFtcclxuXHRcdFx0eyBuYW1lOiAnc2VjdG9yJywgY29kZTogJ3MnIH0sXHJcblx0XHRcdHsgbmFtZTogJ3dob2xlJywgY29kZTogJ3cnIH0sXHJcblx0XHRdO1xyXG5cdFx0ZXhwb3J0IGNvbnN0IGJ5TmFtZTogUmVjb3JkPGFyZWFTaGFwZSwgYXJlYUluZm8+ID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UubmFtZSwgZV0pKTtcclxuXHRcdGV4cG9ydCBjb25zdCBieUNoYXI6IFJlY29yZDxjaGFyLCBhcmVhSW5mbz4gPSBPYmplY3QuZnJvbUVudHJpZXMobGlzdC5tYXAoZSA9PiBbZS5jb2RlLCBlXSkpO1xyXG5cclxuXHR9XHJcblxyXG5cdGxldCBzID0gQXJyYXkoMTAwKS5maWxsKDApLm1hcCgoZSwgaSkgPT4gaS50b1N0cmluZygzNikpLmpvaW4oJycpLnNsaWNlKDAsIDM2KTtcclxuXHRzICs9IHMuc2xpY2UoMTApLnRvVXBwZXJDYXNlKCk7XHJcblxyXG5cdGV4cG9ydCBjb25zdCBuVG9DaGFyOiBjaGFyW10gPSBzLnNwbGl0KCcnKTtcclxuXHRleHBvcnQgY29uc3QgY2hhclRvTjogUmVjb3JkPGNoYXIsIG51bWJlcj4gPSBPYmplY3QuZnJvbUVudHJpZXMoblRvQ2hhci5tYXAoKGUsIGkpID0+IFtlLCBpXSkpO1xyXG5cdC8qIG9sZDogXHJcblxyXG5cdFxyXG5leHBvcnQgY29uc3Qgc2hhcGU0c3ZnID0ge1xyXG5cdFI6IFwiTSAwIDAgTCAxIDAgTCAxIDEgTCAwIDEgWlwiLFxyXG5cdEM6IFwiTSAwIDAgTCAxIDAgQSAxIDEgMCAwIDEgMCAxIFpcIixcclxuXHRTOiBcIk0gMCAwIEwgMC42IDAgTCAxIDEgTCAwIDAuNiBaXCIsXHJcblx0VzogXCJNIDAgMCBMIDAuNiAwIEwgMSAxIEwgMCAxIFpcIixcclxuXHRcIi1cIjogXCJNIDAgMFwiLFxyXG59XHJcbmZ1bmN0aW9uIGRvdFBvcyhsLCBhKSB7XHJcblx0cmV0dXJuIGAke2wgKiBNYXRoLmNvcyhNYXRoLlBJIC8gYSl9ICR7bCAqIE1hdGguc2luKE1hdGguUEkgLyBhKX1gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaW5QaUJ5KGEpIHtcclxuXHRyZXR1cm4gTWF0aC5zaW4oTWF0aC5QSSAvIGEpO1xyXG59XHJcbmZ1bmN0aW9uIGNvc1BpQnkoYSkge1xyXG5cdHJldHVybiBNYXRoLmNvcyhNYXRoLlBJIC8gYSk7XHJcbn1cclxubGV0IHNoYXBlNmxvbmcgPSAxIC8gY29zUGlCeSg2KTtcclxuXHJcbmV4cG9ydCBjb25zdCBzaGFwZTZzdmcgPSB7XHJcblx0UjogYE0gMCAwIEwgMSAwIEwgJHtkb3RQb3Moc2hhcGU2bG9uZywgNil9IEwgJHtkb3RQb3MoMSwgMyl9IFpgLFxyXG5cdEM6IGBNIDAgMCBMIDEgMCBBIDEgMSAwIDAgMSAke2RvdFBvcygxLCAzKX0gWmAsXHJcblx0UzogYE0gMCAwIEwgMC42IDAgTCAke2RvdFBvcyhzaGFwZTZsb25nLCA2KX0gTCAke2RvdFBvcygwLjYsIDMpfSBaYCxcclxuXHRXOiBgTSAwIDAgTCAwLjYgMCBMICR7ZG90UG9zKHNoYXBlNmxvbmcsIDYpfSBMICR7ZG90UG9zKDEsIDMpfSBaYCxcclxuXHRcIi1cIjogXCJNIDAgMFwiLFxyXG59XHJcblxyXG5cclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInJob21idXNcIixcclxuXHRjb2RlOiBcIkJcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHRcdGJlZ2luKHsgc2l6ZTogMS4yLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0Y29uc3QgcmFkID0gMC4wMDE7XHJcblx0XHQvLyB3aXRoIHJvdW5kZWQgYm9yZGVyc1xyXG5cdFx0Y29udGV4dC5hcmNUbygwLCAxLCAxLCAwLCByYWQpO1xyXG5cdFx0Y29udGV4dC5hcmNUbygxLCAwLCAwLCAwLCByYWQpO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwicGx1c1wiLFxyXG5cdGNvZGU6IFwiUFwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXc6IFwiTSAwIDAgTCAxLjEgMCAxLjEgMC41IDAuNSAwLjUgMC41IDEuMSAwIDEuMSB6XCIsXHJcblx0dGllcjogMyxcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJzYXdcIixcclxuXHRjb2RlOiBcIlpcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHRcdGJlZ2luKHsgc2l6ZTogMS4xLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0Y29uc3QgaW5uZXIgPSAwLjU7XHJcblx0XHRjb250ZXh0LmxpbmVUbyhpbm5lciwgMCk7XHJcblx0XHRjb250ZXh0LmJlemllckN1cnZlVG8oaW5uZXIsIDAuMywgMSwgMC4zLCAxLCAwKTtcclxuXHRcdGNvbnRleHQuYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0MSxcclxuXHRcdFx0aW5uZXIsXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMiAqIDAuOSxcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQyICogMC45LFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDFfMixcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQxXzJcclxuXHRcdCk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZShNYXRoLlBJIC8gNCk7XHJcblx0XHRjb250ZXh0LmJlemllckN1cnZlVG8oaW5uZXIsIDAuMywgMSwgMC4zLCAxLCAwKTtcclxuXHRcdGNvbnRleHQuYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0MSxcclxuXHRcdFx0aW5uZXIsXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMiAqIDAuOSxcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQyICogMC45LFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDFfMixcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQxXzJcclxuXHRcdCk7XHJcblx0fSxcclxuXHR0aWVyOiAzLFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInN1blwiLFxyXG5cdGNvZGU6IFwiVVwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdHNwYXduQ29sb3I6IFwieWVsbG93XCIsXHJcblx0ZHJhdyh7IGRpbXMsIGlubmVyRGltcywgbGF5ZXIsIHF1YWQsIGNvbnRleHQsIGNvbG9yLCBiZWdpbiB9KSB7XHJcblx0XHRiZWdpbih7IHNpemU6IDEuMywgcGF0aDogdHJ1ZSwgemVybzogdHJ1ZSB9KTtcclxuXHRcdGNvbnN0IFBJID0gTWF0aC5QSTtcclxuXHRcdGNvbnN0IFBJMyA9ICgoUEkgKiAzKSAvIDgpICogMC43NTtcclxuXHRcdGNvbnN0IGMgPSAxIC8gTWF0aC5jb3MoTWF0aC5QSSAvIDgpO1xyXG5cdFx0Y29uc3QgYiA9IGMgKiBNYXRoLnNpbihNYXRoLlBJIC8gOCk7XHJcblxyXG5cdFx0Y29udGV4dC5tb3ZlVG8oMCwgMCk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZShNYXRoLlBJIC8gMik7XHJcblx0XHRjb250ZXh0LmFyYyhjLCAwLCBiLCAtUEksIC1QSSArIFBJMyk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZSgtTWF0aC5QSSAvIDQpO1xyXG5cdFx0Y29udGV4dC5hcmMoYywgMCwgYiwgLVBJIC0gUEkzLCAtUEkgKyBQSTMpO1xyXG5cdFx0Y29udGV4dC5yb3RhdGUoLU1hdGguUEkgLyA0KTtcclxuXHRcdGNvbnRleHQuYXJjKGMsIDAsIGIsIFBJIC0gUEkzLCBQSSk7XHJcblx0fSxcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJsZWFmXCIsXHJcblx0Y29kZTogXCJGXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0ZHJhdzogXCJNIDAgMCB2IDAuNSBhIDAuNSAwLjUgMCAwIDAgMC41IDAuNSBoIDAuNSB2IC0wLjUgYSAwLjUgMC41IDAgMCAwIC0wLjUgLTAuNSB6XCIsXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwiZGlhbW9uZFwiLFxyXG5cdGNvZGU6IFwiRFwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXc6IFwiTSAwIDAgbCAwIDAuNSAwLjUgMC41IDAuNSAwIDAgLTAuNSAtMC41IC0wLjUgelwiLFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcIm1pbGxcIixcclxuXHRjb2RlOiBcIk1cIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3OiBcIk0gMCAwIEwgMCAxIDEgMSBaXCIsXHJcbn0pO1xyXG5cclxuLy8gcmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcbi8vICAgICBpZDogXCJoYWxmbGVhZlwiLFxyXG4vLyAgICAgY29kZTogXCJIXCIsXHJcbi8vICAgICAuLi5jdXN0b21EZWZhdWx0cyxcclxuLy8gICAgIGRyYXc6IFwiMTAwIE0gMCAwIEwgMCAxMDAgQSA0NSA0NSAwIDAgMCAzMCAzMCBBIDQ1IDQ1IDAgMCAwIDEwMCAwIFpcIixcclxuLy8gfSlcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInlpbnlhbmdcIixcclxuXHRjb2RlOiBcIllcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHQvLyBkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHQvLyAgICAgYmVnaW4oeyBzaXplOiAxLygwLjUrTWF0aC5TUVJUMV8yKSwgcGF0aDogdHJ1ZSB9KTtcclxuXHJcblx0Ly8gICAgIC8qKiBAdHlwZXtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9ICogL1xyXG5cdC8vICAgICBsZXQgY3R4ID0gY29udGV4dDtcclxuXHJcblx0Ly8gICAgIHdpdGggKGN0eCkgeyB3aXRoIChNYXRoKSB7XHJcblx0Ly8gICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vICAgICAvLyBkcmF3IG1vc3RseSBpbiBbMCwxXXhbMCwxXSBzcXVhcmVcclxuXHQvLyAgICAgLy8gZHJhdzogXCIxMDAgTSAwIDUwIEEgNTAgNTAgMCAxIDEgODUgODUgQSAxMjEgMTIxIDAgMCAxIC04NSA4NSBBIDUwIDUwIDAgMCAwIDAgNTBcIixcclxuXHQvLyAgICAgbW92ZVRvKDAsIDAuNSk7XHJcblx0Ly8gICAgIGFyYygwLjUsIDAuNSwgMC41LCBQSSwgUEkvNClcclxuXHQvLyAgICAgYXJjKDAsIDAsIDAuNStTUVJUMV8yLCBQSS80LCBQSS80K1BJLzIsIDApXHJcblx0Ly8gICAgIGFyYygtMC41LCAwLjUsIDAuNSwgMypQSS80LCAwLCAxKVxyXG5cclxuXHQvLyAgICAgbW92ZVRvKDAuNiwgMC41KVxyXG5cdC8vICAgICBhcmMoMC41LCAwLjUsIDAuMSwgMCwgMipQSSlcclxuXHQvLyAgICAgfX1cclxuXHJcblx0Ly8gfSxcclxuXHRkcmF3OlxyXG5cdFx0XCIxMjAuNzEgTSAwIDUwIEEgNTAgNTAgMCAxIDEgODUuMzU1IDg1LjM1NSBBIDEyMC43MSAxMjAuNzEgMCAwIDEgLTg1LjM1NSA4NS4zNTUgQSA1MCA1MCAwIDAgMCAwIDUwIFogTSA0MCA1MCBBIDEwIDEwIDAgMSAwIDQwIDQ5Ljk5IFpcIixcclxuXHR0aWVyOiA0LFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcIm9jdGFnb25cIixcclxuXHRjb2RlOiBcIk9cIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3OiBcIk0gMCAwIEwgMCAxIDAuNDE0MiAxIDEgMC40MTQyIDEgMCBaXCIsXHJcbn0pO1xyXG5cclxuXHRcclxuXHQqL1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN6TGF5ZXIge1xyXG5cdGN1dHM6ICh7XHJcblx0XHRzaGFwZTogY3V0U2hhcGUsXHJcblx0XHRmcm9tOiByb3RhdGlvbjI0LCB0bzogcm90YXRpb24yNCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHR9KVtdO1xyXG5cdHF1YWRzOiAoe1xyXG5cdFx0c2hhcGU6IHF1YWRTaGFwZSxcclxuXHRcdGZyb206IHJvdGF0aW9uMjQsIHRvOiByb3RhdGlvbjI0LFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdH0pW107XHJcblx0YXJlYXM6ICh7XHJcblx0XHRzaGFwZTogYXJlYVNoYXBlLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0ZnJvbTogcm90YXRpb24yNCwgdG86IHJvdGF0aW9uMjQsXHJcblx0fSlbXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTekxheWVyQ3V0IHtcclxuXHRzaGFwZTogY3V0U2hhcGUgPSAnbGluZSc7XHJcblx0Y29sb3I6IGNvbG9yID0gJ2JsYWNrJztcclxuXHJcblx0ZnJvbTogcm90YXRpb24yNCA9IDA7IHRvOiByb3RhdGlvbjI0ID0gMDtcclxuXHRjb25zdHJ1Y3Rvcihzb3VyY2U6IFBpY2tWYWx1ZXM8U3pMYXllckN1dD4pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgc291cmNlKTtcclxuXHR9XHJcblx0Y2xvbmUoKSB7IHJldHVybiBuZXcgU3pMYXllckN1dCh0aGlzKTsgfVxyXG5cdGdldCBzbWFsbFJhZGl1cygpIHtcclxuXHRcdHJldHVybiAwLjAwMDE7XHJcblx0fVxyXG5cdHBhdGhJbnNpZGUoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0c3dpdGNoICh0aGlzLnNoYXBlKSB7XHJcblx0XHRcdGNhc2UgJ2xpbmUnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMC41LCB0aGlzLmZyb20pO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKHRoaXMuc21hbGxSYWRpdXMsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHR0aHJvdyBsb2codGhpcyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0cGF0aE91dHNpemUoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0c3dpdGNoICh0aGlzLnNoYXBlKSB7XHJcblx0XHRcdGNhc2UgJ2xpbmUnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IodGhpcy5zbWFsbFJhZGl1cywgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjUsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHR0aHJvdyBsb2codGhpcyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0SGFzaCgpOiBzdHJpbmcge1xyXG5cdFx0Ly8gZml4bWVcclxuXHRcdHJldHVybiBgYDtcclxuXHR9XHJcblx0c3RhdGljIGZyb21TaG9ydEtleShlOiBzdHJpbmcpOiBTekxheWVyQ3V0IHtcclxuXHRcdC8vIGZpeG1lXHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJDdXQoe30pO1xyXG5cdH1cclxufVxyXG5cclxudHlwZSBQaWNrVmFsdWVzPFQ+ID0ge1xyXG5cdFtrIGluIGtleW9mIFQgYXMgVFtrXSBleHRlbmRzICgoLi4uYXJnczogYW55KSA9PiBhbnkpID8gbmV2ZXIgOiBrXT86IFRba11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN6TGF5ZXJRdWFkIHtcclxuXHRzaGFwZTogcXVhZFNoYXBlID0gJ2NpcmNsZSc7XHJcblx0Y29sb3I6IGNvbG9yID0gJ25vbmUnO1xyXG5cdGZyb206IHJvdGF0aW9uMjQgPSAwOyB0bzogcm90YXRpb24yNCA9IDA7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZTogUGlja1ZhbHVlczxTekxheWVyUXVhZD4pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgc291cmNlKTtcclxuXHRcdGlmIChjb25maWcuZGlzYWJsZVF1YWRDb2xvcnMpIHtcclxuXHRcdFx0dGhpcy5jb2xvciA9ICdub25lJztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNsb25lKCkgeyByZXR1cm4gbmV3IFN6TGF5ZXJRdWFkKHRoaXMpOyB9XHJcblx0b3V0ZXJQYXRoKGN0eDogU3pDb250ZXh0MkQsIGxheWVyOiBTekxheWVyKSB7XHJcblx0XHRzd2l0Y2ggKHRoaXMuc2hhcGUpIHtcclxuXHRcdFx0Y2FzZSAnY2lyY2xlJzoge1xyXG5cdFx0XHRcdGN0eC5hcmMoMCwgMCwgMSwgdGhpcy5mcm9tLCB0aGlzLnRvKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FzZSAnc3F1YXJlJzoge1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDEsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0Ly8gNiAtPiBNYXRoLlNRUlQyLCAxMiAtPiAxXHJcblx0XHRcdFx0bGV0IGEgPSB0aGlzLnRvIC0gdGhpcy5mcm9tO1xyXG5cdFx0XHRcdGxldCBhciA9IGEgKiAoTWF0aC5QSSAvIDI0KTtcclxuXHRcdFx0XHRsZXQgUiA9IGEgPD0gNiA/IDEgLyBNYXRoLmNvcyhhcikgOiAxO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKFIsICh0aGlzLmZyb20gKyB0aGlzLnRvKSAvIDIpO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDEsIHRoaXMudG8pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXNlICdzdGFyJzoge1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDAuNiwgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUihNYXRoLlNRUlQyLCAodGhpcy5mcm9tICsgdGhpcy50bykgLyAyKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjYsIHRoaXMudG8pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXNlICd3aW5kbWlsbCc6IHtcclxuXHRcdFx0XHRjdHgubGluZVRvUigxLCB0aGlzLmZyb20pO1xyXG5cclxuXHRcdFx0XHRsZXQgYSA9IHRoaXMudG8gLSB0aGlzLmZyb207XHJcblx0XHRcdFx0bGV0IGFyID0gYSAqIChNYXRoLlBJIC8gMjQpO1xyXG5cdFx0XHRcdGxldCBSID0gYSA8PSA2ID8gMSAvIE1hdGguY29zKGFyKSA6IDE7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoUiwgKHRoaXMuZnJvbSArIHRoaXMudG8pIC8gMik7XHJcblxyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDAuNiwgdGhpcy50byk7XHJcblxyXG5cclxuXHRcdFx0XHQvLyBsZXQgb3JpZ2luWCA9IC1xdWFkcmFudEhhbGZTaXplO1xyXG5cdFx0XHRcdC8vIGxldCBvcmlnaW5ZID0gcXVhZHJhbnRIYWxmU2l6ZSAtIGRpbXM7XHJcblx0XHRcdFx0Ly8gY29uc3QgbW92ZUlud2FyZHMgPSBkaW1zICogMC40O1xyXG5cdFx0XHRcdC8vIGNvbnRleHQubW92ZVRvKG9yaWdpblgsIG9yaWdpblkgKyBtb3ZlSW53YXJkcyk7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5saW5lVG8ob3JpZ2luWCArIGRpbXMsIG9yaWdpblkpO1xyXG5cdFx0XHRcdC8vIGNvbnRleHQubGluZVRvKG9yaWdpblggKyBkaW1zLCBvcmlnaW5ZICsgZGltcyk7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5saW5lVG8ob3JpZ2luWCwgb3JpZ2luWSArIGRpbXMpO1xyXG5cdFx0XHRcdC8vIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5maWxsKCk7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5zdHJva2UoKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0XHRkZWZhdWx0OiB7XHJcblx0XHRcdFx0Y3R4LnNhdmVkKGN0eCA9PiB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5zaGFwZSA9PSAnY292ZXInKSB7XHJcblx0XHRcdFx0XHRcdGN0eC5zY2FsZSgxIC8gbGF5ZXIubGF5ZXJTY2FsZSgpKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0U3pJbmZvLnF1YWQuYnlOYW1lW3RoaXMuc2hhcGVdLnBhdGghKGN0eCwgdGhpcyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldEhhc2goKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBgJHtTekluZm8ucXVhZC5ieU5hbWVbdGhpcy5zaGFwZV0uY29kZVxyXG5cdFx0XHR9JHtTekluZm8uY29sb3IuYnlOYW1lW3RoaXMuY29sb3JdLmNvZGVcclxuXHRcdFx0fSR7U3pJbmZvLm5Ub0NoYXJbdGhpcy5mcm9tXVxyXG5cdFx0XHR9JHtTekluZm8ublRvQ2hhclt0aGlzLnRvXVxyXG5cdFx0XHR9YFxyXG5cdH1cclxuXHRzdGF0aWMgZnJvbVNob3J0S2V5KGU6IHN0cmluZyk6IFN6TGF5ZXJRdWFkIHtcclxuXHRcdHJldHVybiBuZXcgU3pMYXllclF1YWQoe1xyXG5cdFx0XHRzaGFwZTogU3pJbmZvLnF1YWQuYnlDaGFyW2VbMF1dLm5hbWUsXHJcblx0XHRcdGNvbG9yOiBTekluZm8uY29sb3IuYnlDaGFyW2VbMV1dLm5hbWUsXHJcblx0XHRcdGZyb206IFN6SW5mby5jaGFyVG9OW2VbMl1dLFxyXG5cdFx0XHR0bzogU3pJbmZvLmNoYXJUb05bZVszXV0sXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5leHBvcnQgY2xhc3MgU3pMYXllckFyZWEge1xyXG5cdHNoYXBlOiBhcmVhU2hhcGUgPSAnc2VjdG9yJztcclxuXHRjb2xvcjogY29sb3IgPSAnYmxhY2snO1xyXG5cclxuXHRmcm9tOiByb3RhdGlvbjI0ID0gMDsgdG86IHJvdGF0aW9uMjQgPSAwO1xyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZTogUGlja1ZhbHVlczxTekxheWVyQXJlYT4pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgc291cmNlKTtcclxuXHR9XHJcblx0Y2xvbmUoKSB7IHJldHVybiBuZXcgU3pMYXllckFyZWEodGhpcyk7IH1cclxuXHRvdXRlclBhdGgoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0c3dpdGNoICh0aGlzLnNoYXBlKSB7XHJcblx0XHRcdGNhc2UgJ3dob2xlJzoge1xyXG5cdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRjdHguYXJjKDAsIDAsIDUsIDAsIDI0KTtcclxuXHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhc2UgJ3NlY3Rvcic6IHtcclxuXHRcdFx0XHRpZiAodGhpcy5mcm9tID09IDAgJiYgdGhpcy50byA9PSAyNCkge1xyXG5cdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdFx0Y3R4LmFyYygwLCAwLCA1LCAwLCAyNCk7XHJcblx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0Y3R4Lm1vdmVUbygwLCAwKTtcclxuXHRcdFx0XHRjdHguYXJjKDAsIDAsIDUsIHRoaXMuZnJvbSwgdGhpcy50byk7XHJcblx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRkZWZhdWx0OiB7XHJcblx0XHRcdFx0dGhyb3cgbG9nKHRoaXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGNsaXAoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0dGhpcy5vdXRlclBhdGgoY3R4KTtcclxuXHRcdGN0eC5jbGlwKCk7XHJcblx0fVxyXG5cdGZpbGwoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0dGhpcy5vdXRlclBhdGgoY3R4KTtcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBTekluZm8uY29sb3IuYnlOYW1lW3RoaXMuY29sb3JdLnN0eWxlO1xyXG5cdFx0Y3R4LmZpbGwoKTtcclxuXHR9XHJcblx0Z2V0SGFzaCgpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGAke1N6SW5mby5hcmVhLmJ5TmFtZVt0aGlzLnNoYXBlXS5jb2RlXHJcblx0XHRcdH0ke1N6SW5mby5jb2xvci5ieU5hbWVbdGhpcy5jb2xvcl0uY29kZVxyXG5cdFx0XHR9JHtTekluZm8ublRvQ2hhclt0aGlzLmZyb21dXHJcblx0XHRcdH0ke1N6SW5mby5uVG9DaGFyW3RoaXMudG9dXHJcblx0XHRcdH1gXHJcblx0fVxyXG5cdHN0YXRpYyBmcm9tU2hvcnRLZXkoZTogc3RyaW5nKTogU3pMYXllckFyZWEge1xyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyQXJlYSh7XHJcblx0XHRcdHNoYXBlOiBTekluZm8uYXJlYS5ieUNoYXJbZVswXV0ubmFtZSxcclxuXHRcdFx0Y29sb3I6IFN6SW5mby5jb2xvci5ieUNoYXJbZVsxXV0ubmFtZSxcclxuXHRcdFx0ZnJvbTogU3pJbmZvLmNoYXJUb05bZVsyXV0sXHJcblx0XHRcdHRvOiBTekluZm8uY2hhclRvTltlWzNdXSxcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcblxyXG5jb25zdCB0ZXN0VGVtcGxhdGU6IElTekxheWVyID0ge1xyXG5cdGN1dHM6IFtcclxuXHRcdHsgZnJvbTogMTAsIHRvOiAxMCwgc2hhcGU6ICdsaW5lJywgY29sb3I6ICdibHVlJyB9LFxyXG5cdFx0eyBmcm9tOiAxNCwgdG86IDE0LCBzaGFwZTogJ2xpbmUnLCBjb2xvcjogJ2JsdWUnIH0sXHJcblx0XSxcclxuXHRxdWFkczogW1xyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyLCB0bzogNCB9LFxyXG5cdFx0eyBzaGFwZTogJ2NpcmNsZScsIGNvbG9yOiAncGluaycsIGZyb206IDUsIHRvOiAxOSB9LFxyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyMCwgdG86IDIyIH0sXHJcblx0XSxcclxuXHRhcmVhczogW1xyXG5cdFx0eyBzaGFwZTogJ3NlY3RvcicsIGNvbG9yOiAncmVkJywgZnJvbTogMTEsIHRvOiAxMyB9LFxyXG5cdF0sXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFN6TGF5ZXIgaW1wbGVtZW50cyBJU3pMYXllciB7XHJcblx0bGF5ZXJJbmRleCA9IDA7XHJcblx0Y3V0czogU3pMYXllckN1dFtdID0gW107XHJcblx0cXVhZHM6IFN6TGF5ZXJRdWFkW10gPSBbXTtcclxuXHRhcmVhczogU3pMYXllckFyZWFbXSA9IFtdO1xyXG5cclxuXHJcblx0c3RhdGljIGNyZWF0ZVRlc3QoKSB7XHJcblx0XHRsZXQgbCA9IG5ldyBTekxheWVyKHRlc3RUZW1wbGF0ZSk7XHJcblx0XHRsLmFyZWFzLm1hcChlID0+IHtcclxuXHRcdFx0bGV0IHIgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiA4O1xyXG5cdFx0XHRlLmZyb20gKz0gcjtcclxuXHRcdFx0ZS50byArPSByO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmVycm9yKCd0ZXN0IGxheWVyJywgbCk7XHJcblx0XHRyZXR1cm4gbDtcclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZT86IFBpY2tWYWx1ZXM8SVN6TGF5ZXI+LCBsYXllckluZGV4PzogbnVtYmVyKSB7XHJcblx0XHRpZiAoc291cmNlKSB7XHJcblx0XHRcdHRoaXMuY3V0cyA9IChzb3VyY2UuY3V0cyA/PyBbXSkubWFwKGUgPT4gbmV3IFN6TGF5ZXJDdXQoZSkpO1xyXG5cdFx0XHR0aGlzLnF1YWRzID0gKHNvdXJjZS5xdWFkcyA/PyBbXSkubWFwKGUgPT4gbmV3IFN6TGF5ZXJRdWFkKGUpKTtcclxuXHRcdFx0dGhpcy5hcmVhcyA9IChzb3VyY2UuYXJlYXMgPz8gW10pLm1hcChlID0+IG5ldyBTekxheWVyQXJlYShlKSk7XHJcblx0XHRcdGlmICgoc291cmNlIGFzIFN6TGF5ZXIpLmxheWVySW5kZXgpIHtcclxuXHRcdFx0XHR0aGlzLmxheWVySW5kZXggPSAoc291cmNlIGFzIFN6TGF5ZXIpLmxheWVySW5kZXg7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChsYXllckluZGV4ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5sYXllckluZGV4ID0gbGF5ZXJJbmRleDtcclxuXHRcdH1cclxuXHRcdGlmIChjb25maWcuZGlzYWJsZUN1dHMpIHRoaXMuY3V0cyA9IFtdO1xyXG5cdFx0cmV0dXJuIHRoaXMubm9ybWFsaXplKCk7XHJcblx0fVxyXG5cclxuXHRsYXllclNjYWxlKGxheWVySW5kZXg/OiBudW1iZXIpIHtcclxuXHRcdGxheWVySW5kZXggPz89IHRoaXMubGF5ZXJJbmRleDtcclxuXHRcdHJldHVybiAwLjkgLSAwLjIyICogbGF5ZXJJbmRleDtcclxuXHR9XHJcblx0ZHJhd0NlbnRlcmVkTGF5ZXJTY2FsZWQoY3R4OiBTekNvbnRleHQyRCwgbGF5ZXJJbmRleD86IG51bWJlcikge1xyXG5cdFx0Y3R4LnNhdmVkKGN0eCA9PiB7XHJcblx0XHRcdGN0eC5zY2FsZSh0aGlzLmxheWVyU2NhbGUobGF5ZXJJbmRleCkpO1xyXG5cdFx0XHR0aGlzLmRyYXdDZW50ZXJlZE5vcm1hbGl6ZWQoY3R4KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZHJhd0NlbnRlcmVkTm9ybWFsaXplZChjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRjdHguc2F2ZWQoY3R4ID0+IHtcclxuXHRcdFx0dGhpcy5jbGlwU2hhcGVzKGN0eCk7XHJcblx0XHRcdC8vIHRoaXMucXVhZHMuZm9yRWFjaChxID0+IGN0eC5zYXZlZChjdHggPT4gdGhpcy5maWxsUXVhZChxLCBjdHgpKSk7XHJcblxyXG5cdFx0XHR0aGlzLmN1dHMuZm9yRWFjaChjID0+IGN0eC5zYXZlZChjdHggPT4gdGhpcy5zdHJva2VDdXQoYywgY3R4KSkpO1xyXG5cclxuXHRcdFx0dGhpcy5hcmVhcy5mb3JFYWNoKGEgPT4gY3R4LnNhdmVkKGN0eCA9PiB0aGlzLmZpbGxBcmVhKGEsIGN0eCkpKTtcclxuXHRcdH0pO1xyXG5cdFx0Y3R4LnNhdmVkKGN0eCA9PiB0aGlzLmRyYXdRdWFkT3V0bGluZShjdHgsIHRydWUpKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblxyXG5cdHN0cm9rZUN1dChjdXQ6IFN6TGF5ZXJDdXQsIGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdGN0eC5saW5lV2lkdGggPSAwLjA1O1xyXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gY3V0LmNvbG9yO1xyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cclxuXHRcdGlmIChjdXQuc2hhcGUgPT0gJ2xpbmUnKSB7XHJcblx0XHRcdGN0eC5yb3RhdGUoY3V0LmZyb20pO1xyXG5cdFx0XHRjdHgubW92ZVRvKDAsIDApO1xyXG5cdFx0XHRjdHgubGluZVRvKDAsIDEpO1xyXG5cdFx0XHRjdHguc3Ryb2tlKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBsb2coJ2JhZCBjdXQnLCBjdXQpO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblx0ZmlsbFF1YWQocXVhZDogU3pMYXllclF1YWQsIGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBTekluZm8uY29sb3IuYnlOYW1lW3F1YWQuY29sb3JdLnN0eWxlO1xyXG5cdFx0aWYgKHF1YWQuY29sb3IgPT0gJ2NvdmVyJykgW1xyXG5cdFx0XHQvLyBjdHguY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1vdXQnXHJcblx0XHRdXHJcblxyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0Y3R4Lm1vdmVUbygwLCAwKTtcclxuXHRcdHF1YWQub3V0ZXJQYXRoKGN0eCwgdGhpcyk7XHJcblx0XHRjdHguZmlsbCgpO1xyXG5cdH1cclxuXHJcblx0ZmlsbEFyZWEoYXJlYTogU3pMYXllckFyZWEsIGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdGN0eC5saW5lV2lkdGggPSAwLjA1O1xyXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gY3R4LmZpbGxTdHlsZSA9IFN6SW5mby5jb2xvci5ieU5hbWVbYXJlYS5jb2xvcl0uc3R5bGU7XHJcblxyXG5cdFx0YXJlYS5jbGlwKGN0eCk7XHJcblx0XHRjdHguZmlsbCgpO1xyXG5cdH1cclxuXHJcblx0ZnVsbFF1YWRQYXRoKGN0eDogU3pDb250ZXh0MkQsIHdpdGhDdXRzPzogYm9vbGVhbikge1xyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnF1YWRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBwcmV2ID0gaSA+IDAgPyB0aGlzLnF1YWRzW2kgLSAxXSA6IHRoaXMucXVhZHMuc2xpY2UoLTEpWzBdO1xyXG5cdFx0XHRsZXQgcXVhZCA9IHRoaXMucXVhZHNbaV07XHJcblx0XHRcdGlmICh3aXRoQ3V0cyB8fCBxdWFkLmZyb20gIT0gcHJldi50byAlIDI0KSBjdHgubGluZVRvKDAsIDApO1xyXG5cdFx0XHRxdWFkLm91dGVyUGF0aChjdHgsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdFx0Y3R4LmNsb3NlUGF0aCgpO1xyXG5cdH1cclxuXHJcblx0ZHJhd1F1YWRPdXRsaW5lKGN0eDogU3pDb250ZXh0MkQsIHdpdGhDdXRzPzogYm9vbGVhbikge1xyXG5cdFx0dGhpcy5mdWxsUXVhZFBhdGgoY3R4LCB3aXRoQ3V0cyk7XHJcblx0XHRjdHgubGluZVdpZHRoID0gMC4wNTtcclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9ICdvcmFuZ2UnO1xyXG5cdFx0Y3R4LnN0cm9rZSgpO1xyXG5cdH1cclxuXHJcblx0Y2xpcFNoYXBlcyhjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHR0aGlzLmZ1bGxRdWFkUGF0aChjdHgpO1xyXG5cdFx0Y3R4LmNsaXAoKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblxyXG5cdGNsb25lKCkge1xyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyKHRoaXMpO1xyXG5cdH1cclxuXHRpc05vcm1hbGl6ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucXVhZHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IG5leHQgPSB0aGlzLnF1YWRzW2ldO1xyXG5cdFx0XHRsZXQgcHJldiA9IHRoaXMucXVhZHNbaSAtIDFdIHx8IHRoaXMucXVhZHNbdGhpcy5xdWFkcy5sZW5ndGggLSAxXTtcclxuXHRcdFx0aWYgKG5leHQuZnJvbSA8IDAgfHwgbmV4dC5mcm9tID49IDI0KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChuZXh0LmZyb20gPj0gbmV4dC50bykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAoaSA9PSAwKSB7XHJcblx0XHRcdFx0aWYgKHByZXYudG8gPiAyNCAmJiBwcmV2LnRvICUgMjQgPiBuZXh0LmZyb20pIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAocHJldi50byA+IG5leHQuZnJvbSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJlYXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IG5leHQgPSB0aGlzLmFyZWFzW2ldO1xyXG5cdFx0XHRsZXQgcHJldiA9IHRoaXMuYXJlYXNbaSAtIDFdIHx8IHRoaXMuYXJlYXNbdGhpcy5hcmVhcy5sZW5ndGggLSAxXTtcclxuXHRcdFx0aWYgKG5leHQuZnJvbSA8IDAgfHwgbmV4dC5mcm9tID49IDI0KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChuZXh0LmZyb20gPj0gbmV4dC50bykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAoaSA9PSAwKSB7XHJcblx0XHRcdFx0aWYgKHByZXYudG8gPiAyNCAmJiBwcmV2LnRvICUgMjQgPiBuZXh0LmZyb20pIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAocHJldi50byA+IG5leHQuZnJvbSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChwcmV2LnRvICUgMjQgPT0gbmV4dC5mcm9tICYmIHByZXYuY29sb3IgPT0gbmV4dC5jb2xvcikge1xyXG5cdFx0XHRcdGlmIChwcmV2ICE9IG5leHQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRpZiAobmV4dC5mcm9tICE9IDApIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IHBsYWNlcyA9IEFycmF5PHF1YWRTaGFwZSB8ICcnPigyNCkuZmlsbCgnJyk7XHJcblx0XHRsZXQgcGFpbnRzID0gQXJyYXk8Y29sb3IgfCAnJz4oMjQpLmZpbGwoJycpO1xyXG5cdFx0Zm9yIChsZXQgcSBvZiB0aGlzLnF1YWRzKSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSBxLmZyb207IGkgPCBxLnRvOyBpKyspIHtcclxuXHRcdFx0XHRpZiAocGxhY2VzW2kgJSAyNF0pIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRwbGFjZXNbaSAlIDI0XSA9IHEuc2hhcGU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGEgb2YgdGhpcy5hcmVhcykge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gYS5mcm9tOyBpIDwgYS50bzsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKCFwbGFjZXNbaSAlIDI0XSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdGlmIChwYWludHNbaSAlIDI0XSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdHBhaW50c1tpICUgMjRdID0gYS5jb2xvcjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gZml4bWU6IGN1dHMgY2hlY2s7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdG5vcm1hbGl6ZSgpOiB0aGlzIHtcclxuXHRcdGlmICh0aGlzLmlzTm9ybWFsaXplZCgpKSByZXR1cm4gdGhpcztcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5xdWFkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgcSA9IHRoaXMucXVhZHNbaV07XHJcblx0XHRcdGlmIChxLmZyb20gPiBxLnRvKSB7IHRoaXMucXVhZHMuc3BsaWNlKGksIDEpOyBpLS07IGNvbnRpbnVlOyB9XHJcblx0XHRcdGlmIChxLmZyb20gPj0gMjQpIHsgcS5mcm9tIC09IDI0OyBxLnRvIC09IDI0OyB9XHJcblx0XHR9XHJcblx0XHR0aGlzLnF1YWRzLnNvcnQoKGEsIGIpID0+IGEuZnJvbSAtIGIuZnJvbSk7XHJcblxyXG5cclxuXHRcdGxldCBwbGFjZXMgPSBBcnJheTxxdWFkU2hhcGUgfCAnJz4oMjQpLmZpbGwoJycpO1xyXG5cdFx0bGV0IHBhaW50cyA9IEFycmF5PGNvbG9yIHwgJyc+KDI0KS5maWxsKCcnKTtcclxuXHRcdGZvciAobGV0IHEgb2YgdGhpcy5xdWFkcykge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gcS5mcm9tOyBpIDwgcS50bzsgaSsrKSB7XHJcblx0XHRcdFx0cGxhY2VzW2kgJSAyNF0gPSBxLnNoYXBlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBhIG9mIHRoaXMuYXJlYXMpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IGEuZnJvbTsgaSA8IGEudG87IGkrKykge1xyXG5cdFx0XHRcdHBhaW50c1tpICUgMjRdID0gYS5jb2xvcjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAyNDsgaSsrKSBpZiAoIXBsYWNlc1tpXSkgcGFpbnRzW2ldID0gJyc7XHJcblxyXG5cclxuXHRcdHRoaXMuYXJlYXMgPSBbXTtcclxuXHRcdGxldCBsYXN0OiBTekxheWVyQXJlYSB8IHVuZGVmaW5lZDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMjQ7IGkrKykge1xyXG5cdFx0XHRpZiAoIXBhaW50c1tpXSkgY29udGludWU7XHJcblx0XHRcdGlmIChsYXN0ICYmIGxhc3QuY29sb3IgPT0gcGFpbnRzW2ldICYmIGxhc3QudG8gPT0gaSkge1xyXG5cdFx0XHRcdGxhc3QudG8rKztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmFyZWFzLnB1c2gobGFzdCA9IG5ldyBTekxheWVyQXJlYSh7XHJcblx0XHRcdFx0XHRjb2xvcjogcGFpbnRzW2ldIGFzIGNvbG9yLCBmcm9tOiBpLCB0bzogaSArIDEsIHNoYXBlOiAnc2VjdG9yJyxcclxuXHRcdFx0XHR9KSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLmFyZWFzLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0aWYgKHRoaXMuYXJlYXNbdGhpcy5hcmVhcy5sZW5ndGggLSAxXS50byAlIDI0ID09IHRoaXMuYXJlYXNbMF0uZnJvbSkge1xyXG5cdFx0XHRcdHRoaXMuYXJlYXNbdGhpcy5hcmVhcy5sZW5ndGggLSAxXS50byArPSB0aGlzLmFyZWFzWzBdLnRvO1xyXG5cdFx0XHRcdHRoaXMuYXJlYXMuc3BsaWNlKDAsIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBmaXhtZTogY3V0c1xyXG5cdFx0aWYgKCF0aGlzLmlzTm9ybWFsaXplZCgpKSB7XHJcblx0XHRcdE9iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywgeyBsYXllcjogdGhpcyB9KTtcclxuXHRcdFx0Y29uc29sZS5lcnJvcignTGF5ZXIgZmFpbGVkIHRvIG5vcm1hbGl6ZSBwcm9wZXJseSEnLCB0aGlzKTtcclxuXHRcdFx0aWYgKGNvbmZpZy5kZWJ1Z0JhZExheWVycykgZGVidWdnZXI7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGlzRW1wdHkoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5xdWFkcy5sZW5ndGggPT0gMDtcclxuXHR9XHJcblxyXG5cdGdldFF1YWRBdFNlY3RvcihzOiBudW1iZXIpIHtcclxuXHRcdGxldCBzMSA9IChzICsgMC41KSAlIDI0LCBzMiA9IHMxICsgMjQ7XHJcblx0XHRyZXR1cm4gdGhpcy5xdWFkcy5maW5kKHEgPT5cclxuXHRcdFx0KHEuZnJvbSA8IHMxICYmIHEudG8gPiBzMSkgfHwgKHEuZnJvbSA8IHMyICYmIHEudG8gPiBzMilcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRjYW5TdGFja1dpdGgodXBwZXI6IFN6TGF5ZXIgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcclxuXHRcdGlmICghdXBwZXIpIHJldHVybiB0cnVlO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAyNDsgaSsrKSB7XHJcblx0XHRcdGxldCBxMSA9IHRoaXMuZ2V0UXVhZEF0U2VjdG9yKGkpO1xyXG5cdFx0XHRsZXQgcTIgPSB1cHBlci5nZXRRdWFkQXRTZWN0b3IoaSk7XHJcblx0XHRcdGlmIChxMSAmJiBxMikgcmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdHN0YWNrV2l0aCh1cHBlcjogU3pMYXllciB8IHVuZGVmaW5lZCk6IFN6TGF5ZXIge1xyXG5cdFx0aWYgKCF1cHBlcikgcmV0dXJuIHRoaXMuY2xvbmUoKTtcclxuXHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdGFyZWFzOiB0aGlzLmFyZWFzLmNvbmNhdCh1cHBlci5hcmVhcyksXHJcblx0XHRcdHF1YWRzOiB0aGlzLnF1YWRzLmNvbmNhdCh1cHBlci5xdWFkcyksXHJcblx0XHRcdGN1dHM6IHRoaXMuY3V0cy5jb25jYXQodXBwZXIuY3V0cyksXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJvdGF0ZShyb3Q6IHJvdGF0aW9uMjQpIHtcclxuXHRcdHRoaXMuYXJlYXMubWFwKGUgPT4geyBlLmZyb20gKz0gcm90OyBlLnRvICs9IHJvdDsgfSk7XHJcblx0XHR0aGlzLmN1dHMubWFwKGUgPT4geyBlLmZyb20gKz0gcm90OyB9KTtcclxuXHRcdHRoaXMucXVhZHMubWFwKGUgPT4geyBlLmZyb20gKz0gcm90OyBlLnRvICs9IHJvdDsgfSk7XHJcblx0XHRyZXR1cm4gdGhpcy5ub3JtYWxpemUoKTtcclxuXHR9XHJcblxyXG5cclxuXHRjbG9uZUZpbHRlcmVkQnlRdWFkcmFudHMoaW5jbHVkZVF1YWRyYW50czogbnVtYmVyW10pIHtcclxuXHRcdGNvbnN0IGdvb2QgPSAobjogbnVtYmVyKSA9PiBpbmNsdWRlUXVhZHJhbnRzLmluY2x1ZGVzKCh+fihuIC8gNikpICUgNCk7XHJcblxyXG5cdFx0bGV0IGFsbG93ZWQgPSBBcnJheSg0OCkuZmlsbCgwKS5tYXAoKGUsIGkpID0+IGdvb2QoaSArIDAuNSkpO1xyXG5cdFx0ZnVuY3Rpb24gY29udmVydDxUIGV4dGVuZHMgU3pMYXllckFyZWEgfCBTekxheWVyQ3V0IHwgU3pMYXllclF1YWQ+KG9sZDogVCk6IFRbXSB7XHJcblx0XHRcdGxldCBmaWxsZWQgPSBBcnJheSg0OCkuZmlsbCgwKS5tYXAoKGUsIGkpID0+IG9sZC5mcm9tIDwgaSArIDAuNSAmJiBpICsgMC41IDwgb2xkLnRvKTtcclxuXHJcblx0XHRcdGxldCBsYXN0OiBUID0gb2xkLmNsb25lKCkgYXMgVDsgbGFzdC50byA9IC05OTk7XHJcblx0XHRcdGxldCBsaXN0OiBUW10gPSBbXTtcclxuXHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgNDg7IGkrKykge1xyXG5cdFx0XHRcdGlmICghZmlsbGVkW2ldKSBjb250aW51ZTtcclxuXHRcdFx0XHRpZiAoIWFsbG93ZWRbaV0pIGNvbnRpbnVlO1xyXG5cdFx0XHRcdGlmIChsYXN0LnRvICE9IGkpIHtcclxuXHRcdFx0XHRcdGxhc3QgPSBvbGQuY2xvbmUoKSBhcyBUO1xyXG5cdFx0XHRcdFx0bGFzdC5mcm9tID0gaTtcclxuXHRcdFx0XHRcdGxhc3QudG8gPSBpICsgMTtcclxuXHRcdFx0XHRcdGxpc3QucHVzaChsYXN0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bGFzdC50bysrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbGlzdDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdGFyZWFzOiB0aGlzLmFyZWFzLmZsYXRNYXAoY29udmVydCksXHJcblx0XHRcdHF1YWRzOiB0aGlzLnF1YWRzLmZsYXRNYXAoY29udmVydCksXHJcblx0XHRcdGN1dHM6IHRoaXMuY3V0cy5mbGF0TWFwKGNvbnZlcnQpLFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjbG9uZUFzQ292ZXIoKSB7XHJcblx0XHRmdW5jdGlvbiBjb252ZXJ0KHF1YWQ6IFN6TGF5ZXJRdWFkKSB7XHJcblx0XHRcdHJldHVybiBuZXcgU3pMYXllclF1YWQoe1xyXG5cdFx0XHRcdGNvbG9yOiAnY292ZXInLFxyXG5cdFx0XHRcdHNoYXBlOiAnY292ZXInLFxyXG5cdFx0XHRcdGZyb206IHF1YWQuZnJvbSwgdG86IHF1YWQudG8sXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyKHtcclxuXHRcdFx0cXVhZHM6IHRoaXMucXVhZHMuZmxhdE1hcChjb252ZXJ0KSxcclxuXHRcdH0pLnBhaW50KCdjb3ZlcicpLm5vcm1hbGl6ZSgpO1xyXG5cdH1cclxuXHRyZW1vdmVDb3ZlcigpIHtcclxuXHRcdHRoaXMucXVhZHMgPSB0aGlzLnF1YWRzLmZpbHRlcihlID0+IGUuc2hhcGUgIT0gJ2NvdmVyJyk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0ZmlsdGVyUGFpbnQocGFpbnQ6IChjb2xvciB8IG51bGwpW10pOiAoY29sb3IgfCBudWxsKVtdIHtcclxuXHRcdHJldHVybiBwYWludC5tYXAoKGUsIGkpID0+IHtcclxuXHRcdFx0bGV0IHF1YWQgPSB0aGlzLmdldFF1YWRBdFNlY3RvcihpKTtcclxuXHRcdFx0cmV0dXJuIHF1YWQgJiYgcXVhZC5zaGFwZSA9PSAnY292ZXInID8gbnVsbCA6IGU7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0cGFpbnQocGFpbnQ6IChjb2xvciB8IG51bGwpW10gfCBjb2xvcikge1xyXG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHBhaW50KSkgcGFpbnQgPSBBcnJheTxjb2xvciB8IG51bGw+KDI0KS5maWxsKHBhaW50KTtcclxuXHRcdHBhaW50Lm1hcCgoY29sb3IsIGkpID0+IHtcclxuXHRcdFx0aWYgKGNvbG9yKSB7XHJcblx0XHRcdFx0dGhpcy5hcmVhcy5wdXNoKG5ldyBTekxheWVyQXJlYSh7XHJcblx0XHRcdFx0XHRjb2xvcixcclxuXHRcdFx0XHRcdGZyb206IGksIHRvOiBpICsgMSxcclxuXHRcdFx0XHRcdHNoYXBlOiAnc2VjdG9yJyxcclxuXHRcdFx0XHR9KSlcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdGhpcy5ub3JtYWxpemUoKTs7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZnJvbVNoYXBlekhhc2goaGFzaDogc3RyaW5nKSB7XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRhcmVhczogaGFzaC5tYXRjaCgvLi4vZykhLm1hcCgocywgaSkgPT4ge1xyXG5cdFx0XHRcdGlmIChzWzBdID09ICctJykgcmV0dXJuIG51bGwgYXMgYW55IGFzIFN6TGF5ZXJBcmVhO1xyXG5cdFx0XHRcdHJldHVybiBuZXcgU3pMYXllckFyZWEoe1xyXG5cdFx0XHRcdFx0c2hhcGU6ICdzZWN0b3InLFxyXG5cdFx0XHRcdFx0Y29sb3I6IFN6SW5mby5jb2xvci5ieUNoYXJbc1sxXV0ubmFtZSxcclxuXHRcdFx0XHRcdGZyb206IGkgKiA2LFxyXG5cdFx0XHRcdFx0dG86IChpICsgMSkgKiA2LFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KS5maWx0ZXIoZSA9PiBlKSxcclxuXHRcdFx0cXVhZHM6IGhhc2gubWF0Y2goLy4uL2cpIS5tYXAoKHMsIGkpID0+IHtcclxuXHRcdFx0XHRpZiAoc1swXSA9PSAnLScpIHJldHVybiBudWxsIGFzIGFueSBhcyBTekxheWVyUXVhZDtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJRdWFkKHtcclxuXHRcdFx0XHRcdHNoYXBlOiBTekluZm8ucXVhZC5ieUNoYXJbc1swXV0ubmFtZSxcclxuXHRcdFx0XHRcdGNvbG9yOiBTekluZm8uY29sb3IuYnlDaGFyW3NbMV1dLm5hbWUsXHJcblx0XHRcdFx0XHRmcm9tOiBpICogNixcclxuXHRcdFx0XHRcdHRvOiAoaSArIDEpICogNixcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSkuZmlsdGVyKGUgPT4gZSksXHJcblx0XHRcdGN1dHM6IFtdLFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0Z2V0SGFzaCgpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGBsIXp8cSEke3RoaXMucXVhZHMubWFwKGUgPT4gZS5nZXRIYXNoKCkpLmpvaW4oJywnKVxyXG5cdFx0XHR9fGEhJHt0aGlzLmFyZWFzLm1hcChlID0+IGUuZ2V0SGFzaCgpKS5qb2luKCcsJylcclxuXHRcdFx0fXxjISR7dGhpcy5jdXRzLm1hcChlID0+IGUuZ2V0SGFzaCgpKS5qb2luKCcsJylcclxuXHRcdFx0fWA7XHJcblx0fVxyXG5cdHN0YXRpYyBmcm9tU2hvcnRLZXkoa2V5OiBzdHJpbmcpOiBhbnkge1xyXG5cdFx0aWYgKCFrZXkuc3RhcnRzV2l0aCgnbCF6fCcpKSB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgaGFzaCcpO1xyXG5cdFx0bGV0IGxheWVyID0gbmV3IFN6TGF5ZXIoKTtcclxuXHRcdGZvciAobGV0IHBhcnQgb2Yga2V5LnNwbGl0KCd8JykpIHtcclxuXHRcdFx0aWYgKHBhcnQuc3RhcnRzV2l0aCgncSEnKSkge1xyXG5cdFx0XHRcdGxldCBzdHJzID0gcGFydC5zbGljZSgncSEnLmxlbmd0aCkuc3BsaXQoJywnKTtcclxuXHRcdFx0XHRsYXllci5xdWFkcyA9IHN0cnMubWFwKGUgPT4gU3pMYXllclF1YWQuZnJvbVNob3J0S2V5KGUpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAocGFydC5zdGFydHNXaXRoKCdhIScpKSB7XHJcblx0XHRcdFx0bGV0IHN0cnMgPSBwYXJ0LnNsaWNlKCdhIScubGVuZ3RoKS5zcGxpdCgnLCcpO1xyXG5cdFx0XHRcdGxheWVyLmFyZWFzID0gc3Rycy5tYXAoZSA9PiBTekxheWVyQXJlYS5mcm9tU2hvcnRLZXkoZSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChwYXJ0LnN0YXJ0c1dpdGgoJ2MhJykpIHtcclxuXHRcdFx0XHRsZXQgc3RycyA9IHBhcnQuc2xpY2UoJ2MhJy5sZW5ndGgpLnNwbGl0KCcsJyk7XHJcblx0XHRcdFx0bGF5ZXIuY3V0cyA9IHN0cnMubWFwKGUgPT4gU3pMYXllckN1dC5mcm9tU2hvcnRLZXkoZSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbGF5ZXI7XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbG9nKC4uLmE6IGFueVtdKSB7XHJcblx0Y29uc29sZS5lcnJvciguLi5hKTtcclxuXHRmb3IgKGxldCBvIG9mIGEpXHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChKU09OLnN0cmluZ2lmeShvKSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyB0cnkge1xyXG4vLyBcdGhhc2hGb3JFYWNoKHRlc3RIYXNoLCAnc2hhcGVzJywgZHJhd1NoYXBlLCBzY3R4KTtcclxuLy8gXHRoYXNoRm9yRWFjaCh0ZXN0SGFzaCwgJ2N1dHMnLCBkcmF3Q3V0LCBzY3R4KTtcclxuLy8gXHRjbGlwU2hhcGVzKHRlc3RIYXNoLCBzY3R4KTtcclxuLy8gXHQvLyBoYXNoRm9yRWFjaCh0ZXN0SGFzaCwgJ2FyZWFzJywgZHJhd0FyZWEsIHNjdHgpO1xyXG4vLyB9IGNhdGNoIChlOiBhbnkpIHtcclxuLy8gXHRsb2coJ2Vycm9yOiAnLCBlLnN0YWNrKTtcclxuLy8gfVxyXG5cclxuLy8gY3R4Lmdsb2JhbEFscGhhID0gMC40O1xyXG4vLyBjdHguZmlsbFJlY3QoLTIsIC0yLCA0LCA0KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyBmdW5jdGlvbiBoYXNoRm9yRWFjaDxLIGV4dGVuZHMga2V5b2YgU3pEZWZpbml0aW9uPihcclxuLy8gXHRoYXNoOiBTekRlZmluaXRpb24sIGs6IEssXHJcbi8vIFx0bWFwcGVyOiAoZTogU3pEZWZpbml0aW9uW0tdWzBdLCBpOiBudW1iZXIsIGhhc2g6IFN6RGVmaW5pdGlvbiwgY3R4OiBTekNvbnRleHQyRCkgPT4gdm9pZCxcclxuLy8gXHRjdHg6IFN6Q29udGV4dDJELFxyXG4vLyApIHtcclxuLy8gXHRoYXNoW2tdLm1hcCgoZSwgaSkgPT4ge1xyXG4vLyBcdFx0Y3R4LnNhdmUoKTtcclxuLy8gXHRcdG1hcHBlcihlLCBpLCBoYXNoLCBjdHgpO1xyXG4vLyBcdFx0Y3R4LnJlc3RvcmUoKTtcclxuLy8gXHR9KTtcclxuLy8gfSJdfQ==