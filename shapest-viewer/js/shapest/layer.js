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
            }, {
                name: 'clover', code: 'L',
                path(ctx, { from, to }) {
                    const r = 0.5, R = 1;
                    ctx.rotate(from);
                    // export const extraShapes: Record<string, (ctx: SzContext2D, quad: SzLayerQuad) => void> = {
                    // 	clover(ctx: SzContext2D) {
                    // 		// begin({ size: 1.3, path: true, zero: true });
                    const inner = 0.5;
                    const inner_center = 0.45;
                    ctx.ctx.lineTo(0, inner);
                    ctx.ctx.bezierCurveTo(0, 1, inner, 1, inner_center, inner_center);
                    ctx.ctx.bezierCurveTo(1, inner, 1, 0, inner, 0);
                    // 	},
                }
            }, {
                name: '', code: '',
                // 	star8(ctx: SzContext2D, { from, to }: SzLayerQuad) {
                // 		const r = 1.22 / 2, R = 1.22, d = (n: number) => from * (1 - n) + to * n;
                // 		ctx
                // 			.lineToR(r, d(0))
                // 			.lineToR(R, d(0.25))
                // 			.lineToR(r, d(0.5))
                // 			.lineToR(R, d(0.75))
                // 			.lineToR(r, d(1))
                // 	},
            }, {
                name: '', code: '',
                // 	rhombus(ctx: SzContext2D) {
                // 	},
            }, {
                name: '', code: '',
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
            }, {
                name: '', code: '',
                // 	saw(ctx: SzContext2D) {
                // 	},
            }, {
                name: '', code: '',
                // 	sun(ctx: SzContext2D) {
                // 	},
            }, {
                name: '', code: '',
                // 	leaf(ctx: SzContext2D) {
                // 	},
            }, {
                name: '', code: '',
                // 	diamond(ctx: SzContext2D) {
                // 	},
            }, {
                name: '', code: '',
                // 	mill(ctx: SzContext2D) {
                // 	},
            }, {
                name: '', code: '',
                // 	halfleaf(ctx: SzContext2D) {
                // 	},
            }, {
                name: '', code: '',
                // 	yinyang(ctx: SzContext2D) {
                // 	},
            }, {
                name: '', code: '',
                // 	octagon(ctx: SzContext2D) {
                // 	},
            },
        ];
        while (quad_1.list.find(e => !e.name)) {
            quad_1.list.splice(quad_1.list.findIndex(e => !e.name), 1);
        }
        quad_1.named4 = {
            circleSpawn: 'CuCuCuCu',
            squareSpawn: 'RuRuRuRu',
            starSpawn: 'SuSuSuSu',
            windmillSpawn: 'WuWuWuWu',
            circleBottom: '--CuCu--',
            circle: "CuCuCuCu",
            circleHalf: "----CuCu",
            rect: "RuRuRuRu",
            rectHalf: "RuRu----",
            circleHalfRotated: "Cu----Cu",
            circleQuad: "Cu------",
            circleRed: "CrCrCrCr",
            rectHalfBlue: "RbRb----",
            circlePurple: "CpCpCpCp",
            starCyan: "ScScScSc",
            fish: "CgScScCg",
            blueprint: "CbCbCbRb:CwCwCwCw",
            rectCircle: "RpRpRpRp:CwCwCwCw",
            watermelon: "--Cg----:--Cr----",
            starCircle: "SrSrSrSr:CyCyCyCy",
            starCircleStar: "SrSrSrSr:CyCyCyCy:SwSwSwSw",
            fan: "CbRbRbCb:CwCwCwCw:WbWbWbWb",
            monster: "Sg----Sg:CgCgCgCg:--CyCy--",
            bouquet: "CpRpCp--:SwSwSwSw",
            logo: "RuCw--Cw:----Ru--",
            target: "CrCwCrCw:CwCrCwCr:CrCwCrCw:CwCrCwCr",
            speedometer: "Cg----Cr:Cw----Cw:Sy------:Cy----Cy",
            // spikedBall: "CcSyCcSy:SyCcSyCc:CcSyCcSy:SyCcSyCc",
            spikedBall: "CcSyCcSy:SyCcSyCc:CcSyCcSy",
            compass: "CcRcCcRc:RwCwRwCw:Sr--Sw--:CyCyCyCy",
            plant: "Rg--Rg--:CwRwCwRw:--Rg--Rg",
            rocket: "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw",
            mill: "CwCwCwCw:WbWbWbWb",
            star: "SuSuSuSu",
            circleStar: "CwCrCwCr:SgSgSgSg",
            clown: "WrRgWrRg:CwCrCwCr:SgSgSgSg",
            windmillRed: "WrWrWrWr",
            fanTriple: "WpWpWpWp:CwCwCwCw:WpWpWpWp",
            fanQuadruple: "WpWpWpWp:CwCwCwCw:WpWpWpWp:CwCwCwCw",
            bird: "Sr------:--Cg--Cg:Sb--Sb--:--Cw--Cw",
            scissors: "Sr------:--CgCgCg:--Sb----:Cw--CwCw",
        };
        quad_1.named6 = {
            circleSpawn: '6CuCuCuCuCuCu',
            squareSpawn: '6RuRuRuRuRuRu',
            starSpawn: '6SuSuSuSuSuSu',
            windmillSpawn: '6WuWuWuWuWuWu',
            circleBottom: '6----CuCuCu--',
            circle: "6CuCuCuCuCuCu",
            circleHalf: "6------CuCuCu",
            rect: "6RuRuRuRuRuRu",
            rectHalf: "6RuRuRu------",
            circleHalfRotated: "6Cu------CuCu",
            circleQuad: "6CuCu--------",
            circleRed: "6CrCrCrCrCrCr",
            rectHalfBlue: "6RbRbRb------",
            circlePurple: "6CpCpCpCpCpCp",
            starCyan: "6ScScScScScSc",
            fish: "6CgCgScScCgCg",
            blueprint: "6CbCbCbCbCbRb:6CwCwCwCwCwCw",
            rectCircle: "6RpRpRpRpRpRp:6CwCwCwCwCwCw",
            watermelon: "6--CgCg------:6--CrCr------",
            starCircle: "6SrSrSrSrSrSr:6CyCyCyCyCyCy",
            starCircleStar: "6SrSrSrSrSrSr:6CyCyCyCyCyCy:6SwSwSwSwSwSw",
            fan: "6CbCbRbRbCbCb:6CwCwCwCwCwCw:6WbWbWbWbWbWb",
            monster: "6Sg--------Sg:6CgCgCgCgCgCg:6--CyCyCyCy--",
            bouquet: "6CpCpRpCpCp--:6SwSwSwSwSwSw",
            logo: "6RwCuCw--CwCu:6------Ru----",
            target: "6CrCwCrCwCrCw:6CwCrCwCrCwCr:6CrCwCrCwCrCw:6CwCrCwCrCwCr",
            speedometer: "6CgCb----CrCy:6CwCw----CwCw:6Sc----------:6CyCy----CyCy",
            spikedBall: "6CcSyCcSyCcSy:6SyCcSyCcSyCc:6CcSyCcSyCcSy:6SyCcSyCcSyCc",
            compass: "6CcRcRcCcRcRc:6RwCwCwRwCwCw:6----Sr----Sb:6CyCyCyCyCyCy",
            plant: "6Rg--Rg--Rg--:6CwRwCwRwCwRw:6--Rg--Rg--Rg",
            rocket: "6CbCuCbCuCbCu:6Sr----------:6--CrCrSrCrCr:6CwCwCwCwCwCw",
            mill: "6CwCwCwCwCwCw:6WbWbWbWbWbWb",
            star: "6SuSuSuSuSuSu",
            circleStar: "6CwCrCwCrCwCr:6SgSgSgSgSgSg",
            clown: "6WrRgWrRgWrRg:6CwCrCwCrCwCr:6SgSgSgSgSgSg",
            windmillRed: "6WrWrWrWrWrWr",
            fanTriple: "6WpWpWpWpWpWp:6CwCwCwCwCwCw:6WpWpWpWpWpWp",
            fanQuadruple: "6WpWpWpWpWpWp:6CwCwCwCwCwCw:6WpWpWpWpWpWp:6CwCwCwCwCwCw",
            bird: "6Sr----------:6--CgCg--CgCg:6Sb----Sb----:6--CwCw--CwCw",
            scissors: "6Sr----------:6--CgCgCgCgCg:6----Sb------:6CwCw--CwCwCw",
        };
        quad_1.named = {
            circleSpawn: 'sz!l!z|q!C-0o|a!su0o|c!',
            squareSpawn: 'sz!l!z|q!R-0c,R-co|a!su0o|c!',
            starSpawn: 'sz!l!z|q!S-4c,S-ck,S-ks|a!su0o|c!',
            windmillSpawn: 'sz!l!z|q!W-06,W-6c,W-ci,W-io|a!su0o|c!',
            circle1: 'sz!l!z|q!C-0o|a!su0o|c!',
            circleHalfLeft: 'sz!l!z|q!C-co|a!su0o|c!',
            square2: 'sz!l!z|q!R-0c,R-co|a!su0o|c!',
            squareHalfRight: 'sz!l!z|q!R-0c|a!su0o|c!',
            squareHalfTop2: 'sz!l!z|q!R-6c,R-ci|a!su6i|c!',
            circleHalfTop2: 'sz!l!z|q!C-06,C-io|a!suiu|c!',
            circleQuad1: 'sz!l!z|q!C-ou|a!su0o|c!',
            circleRed: 'sz!l!z|q!C-0o|a!sr0o|c!',
            // squarehalfLeftBlue: 'sz!l!z|q!R-co|a!sb0o|c!',
            // circlePurple: 'sz!l!z|q!C-0o|a!sv0o|c!',
            square3TopBlue: 'sz!l!z|q!R-ks|a!sbks|c!',
            star3Cyan: 'sz!l!z|q!S-4c,S-ck,S-ks|a!sc0o|c!',
            squid: 'sz!l!z|q!S-6c,S-ci,C-iu|a!sc6i,sgiu|c!',
            diamond: 'sz!l!z|q!R-03,R-lo|a!sclr|c!',
            palm: 'sz!l!z|q!S-02,S-24,S-46,S-ik,S-km,S-mo|a!sgiu|c!:l!z|q!R-ae|a!soae|c!:l!z|q!C-6i|a!sp6i|c!',
            counter: 'sz!l!z|q!C-iu|a!sr26,sgim,symq|c!:l!z|q!R-26,R-im,R-mq|a!swiu|c!:l!z|q!S-04|a!su04|c!:l!z|q!C-iu|a!suiu|c!',
            window: 'sz!l!z|q!R-06,R-6c,R-ci,R-io|a!sc0o|c!:l!z|q!R-28,R-8e,R-ek,R-kq|a!so0o|c!:l!z|q!R-4a,R-ag,R-gm,R-ms|a!sy0o|c!:l!z|q!R-06,R-6c,R-ci,R-io|a!sw0o|c!',
            splikeball48: 'sz!l!z|q!C-02,S-24,C-46,S-68,C-8a,S-ac,C-ce,S-eg,C-gi,S-ik,C-km,S-mo|a!sc02,sy24,sc46,sy68,sc8a,syac,scce,syeg,scgi,syik,sckm,symo|c!:l!z|q!S-02,C-24,S-46,C-68,S-8a,C-ac,S-ce,C-eg,S-gi,C-ik,S-km,C-mo|a!sy02,sc24,sy46,sc68,sy8a,scac,syce,sceg,sygi,scik,sykm,scmo|c!:l!z|q!C-02,S-24,C-46,S-68,C-8a,S-ac,C-ce,S-eg,C-gi,S-ik,C-km,S-mo|a!sc02,sy24,sc46,sy68,sc8a,syac,scce,syeg,scgi,syik,sckm,symo|c!:l!z|q!S-02,C-24,S-46,C-68,S-8a,C-ac,S-ce,C-eg,S-gi,C-ik,S-km,C-mo|a!sy02,sc24,sy46,sc68,sy8a,scac,syce,sceg,sygi,scik,sykm,scmo|c!',
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
                throw this;
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
                throw this;
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
                throw this;
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
            throw this;
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
            let last = this.areas[this.areas.length - 1];
            if (last.color == this.areas[0].color && last.to % 24 == this.areas[0].from) {
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
    static fromShapezHash(hash, err = true) {
        if (hash[0] == '6')
            hash = hash.slice(1);
        if (hash.length != 8 && hash.length != 12) {
            if (!err)
                return null;
            throw new Error(`Invalid shape hash: ${hash}`);
        }
        let angle = 24 / (hash.length / 2);
        return new SzLayer({
            areas: hash.match(/../g).map((s, i) => {
                if (s[0] == '-')
                    return null;
                return new SzLayerArea({
                    shape: 'sector',
                    color: SzInfo.color.byChar[s[1]].name,
                    from: i * angle,
                    to: (i + 1) * angle,
                });
            }).filter(e => e),
            quads: hash.match(/../g).map((s, i) => {
                if (s[0] == '-')
                    return null;
                return new SzLayerQuad({
                    shape: SzInfo.quad.byChar[s[0]].name,
                    color: SzInfo.color.byChar[s[1]].name,
                    from: i * angle,
                    to: (i + 1) * angle,
                });
            }).filter(e => e),
            cuts: [],
        });
    }
    getHash() {
        for (let qn of [4, 6]) {
            let qw = 24 / qn;
            if (!this.quads.every(e => e.from % qw == 0 && e.to - e.from == qw))
                continue;
            if (!this.areas.every(e => e.from % qw == 0 && e.to % qw == 0))
                continue;
            let data = Array.from({ length: qn }, (_, i) => ({ shape: '-', color: '-' }));
            for (let q of this.quads) {
                data[q.from / qw].shape = SzInfo.quad.byName[q.shape].code;
            }
            for (let a of this.areas) {
                for (let i = a.from / qw; i < a.to / qw; i++) {
                    data[i % qn].color = SzInfo.color.byName[a.color].code;
                }
            }
            return data.map(({ shape, color }) => shape == '-' ? '--' : shape + color).join('');
        }
        return `l!z|q!${this.quads.map(e => e.getHash()).join(',')}|a!${this.areas.map(e => e.getHash()).join(',')}|c!${this.cuts.map(e => e.getHash()).join(',')}`;
    }
    static fromShortKey(key) {
        if (key.startsWith('sz!')) {
            key = key.slice(3);
        }
        if (key.startsWith('l!z|')) {
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
        return SzLayer.fromShapezHash(key);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2hhcGVzdC9sYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLE1BQU0sR0FBRztJQUNkLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLGlCQUFpQixFQUFFLElBQUk7SUFDdkIsY0FBYyxFQUFFLElBQUk7Q0FDcEIsQ0FBQTtBQXNCRCxNQUFNLEtBQVcsTUFBTSxDQW1mdEI7QUFuZkQsV0FBaUIsTUFBTTtJQUN0QixJQUFpQixLQUFLLENBbURyQjtJQW5ERCxXQUFpQixPQUFLO1FBQ3JCLE1BQU0sa0JBQWtCLEdBQUc7WUFDMUIsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRO1lBQ3pCLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTTtZQUM1QixNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU07U0FDZixDQUFDO1FBQ1gsTUFBTSxpQkFBaUIsR0FBRztZQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU87U0FDZixDQUFDO1FBSUUsWUFBSSxHQUF5QjtZQUN6QyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDdEQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQzVELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUM1RCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDMUQsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUss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LElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDOUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6RDtnQkFDRCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDOUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN2RDthQUNEO1lBQ0QsT0FBTyxLQUFLLENBQUM7U0FDYjtRQUNELE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTekRlZmluaXRpb24gfSBmcm9tIFwiLi9kZWZpbml0aW9uLmpzXCI7XHJcbmltcG9ydCB7IGNoYXIsIHJvdGF0aW9uMjQsIHN0eWxlU3RyaW5nLCBTekNvbnRleHQyRCB9IGZyb20gXCIuL1N6Q29udGV4dDJELmpzXCI7XHJcblxyXG5jb25zdCBjb25maWcgPSB7XHJcblx0ZGlzYWJsZUN1dHM6IHRydWUsXHJcblx0ZGlzYWJsZVF1YWRDb2xvcnM6IHRydWUsXHJcblx0ZGVidWdCYWRMYXllcnM6IHRydWUsXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIGN1dFNoYXBlID0gKFxyXG5cdHwgJ2xpbmUnXHJcbik7XHJcbmV4cG9ydCB0eXBlIHF1YWRTaGFwZSA9IChcclxuXHR8ICdjaXJjbGUnIHwgJ3NxdWFyZScgfCAnc3RhcicgfCAnd2luZG1pbGwnXHJcblx0fCAnY292ZXInXHJcbik7XHJcbmV4cG9ydCB0eXBlIGFyZWFTaGFwZSA9IChcclxuXHR8ICd3aG9sZScgfCAnc2VjdG9yJ1xyXG4pO1xyXG5leHBvcnQgdHlwZSBjb2xvciA9XHJcblx0fCAncmVkJyB8ICdvcmFuZ2UnIHwgJ3llbGxvdydcclxuXHR8ICdsYXduZ3JlZW4nIHwgJ2dyZWVuJyB8ICdjeWFuJ1xyXG5cdHwgJ2JsdWUnIHwgJ3B1cnBsZScgfCAncGluaydcclxuXHR8ICdibGFjaycgfCAnZ3JleScgfCAnd2hpdGUnXHJcblx0fCAnY292ZXInIHwgJ25vbmUnO1xyXG5cclxuZXhwb3J0IHR5cGUgY29sb3JDaGFyID0gJ3InIHwgJ2cnIHwgJ2InIHwgJy0nO1xyXG5leHBvcnQgdHlwZSBjb2xvclN0cmluZyA9IGAke2NvbG9yQ2hhcn0ke2NvbG9yQ2hhcn0ke2NvbG9yQ2hhcn1gO1xyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBTekluZm8ge1xyXG5cdGV4cG9ydCBuYW1lc3BhY2UgY29sb3Ige1xyXG5cdFx0Y29uc3QgY29sb3JXaGVlbE5hbWVMaXN0ID0gW1xyXG5cdFx0XHQncmVkJywgJ29yYW5nZScsICd5ZWxsb3cnLFxyXG5cdFx0XHQnbGF3bmdyZWVuJywgJ2dyZWVuJywgJ2N5YW4nLFxyXG5cdFx0XHQnYmx1ZScsICdwdXJwbGUnLCAncGluaycsXHJcblx0XHRdIGFzIGNvbnN0O1xyXG5cdFx0Y29uc3QgY29sb3JHcmV5TmFtZUxpc3QgPSBbXHJcblx0XHRcdCdibGFjaycsICdncmV5JywgJ3doaXRlJyxcclxuXHRcdF0gYXMgY29uc3Q7XHJcblxyXG5cdFx0ZXhwb3J0IHR5cGUgY29sb3JJbmZvID0geyBuYW1lOiBjb2xvciwgc3R5bGU6IHN0eWxlU3RyaW5nLCBjb2RlOiBjaGFyLCBjb21ibz86IGNvbG9yU3RyaW5nIH07IC8vIGJiZ2dyclxyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBsaXN0OiByZWFkb25seSBjb2xvckluZm9bXSA9IFtcclxuXHRcdFx0eyBuYW1lOiAncmVkJywgc3R5bGU6ICdyZWQnLCBjb2RlOiAncicsIGNvbWJvOiAncnJyJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdvcmFuZ2UnLCBzdHlsZTogJ29yYW5nZScsIGNvZGU6ICdvJywgY29tYm86ICdncnInIH0sXHJcblx0XHRcdHsgbmFtZTogJ3llbGxvdycsIHN0eWxlOiAneWVsbG93JywgY29kZTogJ3knLCBjb21ibzogJ2dncicgfSxcclxuXHRcdFx0eyBuYW1lOiAnZ3JlZW4nLCBzdHlsZTogJ2dyZWVuJywgY29kZTogJ2cnLCBjb21ibzogJ2dnZycgfSxcclxuXHRcdFx0eyBuYW1lOiAnbGF3bmdyZWVuJywgc3R5bGU6ICdsYXduZ3JlZW4nLCBjb2RlOiAnbCcsIGNvbWJvOiAnYmdnJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdjeWFuJywgc3R5bGU6ICdjeWFuJywgY29kZTogJ2MnLCBjb21ibzogJ2JiZycgfSxcclxuXHRcdFx0eyBuYW1lOiAnYmx1ZScsIHN0eWxlOiAnYmx1ZScsIGNvZGU6ICdiJywgY29tYm86ICdiYmInIH0sXHJcblx0XHRcdHsgbmFtZTogJ3B1cnBsZScsIHN0eWxlOiAncHVycGxlJywgY29kZTogJ3YnLCBjb21ibzogJ2JicicgfSxcclxuXHRcdFx0eyBuYW1lOiAncGluaycsIHN0eWxlOiAncGluaycsIGNvZGU6ICdwJywgY29tYm86ICdicnInIH0sXHJcblx0XHRcdHsgbmFtZTogJ2JsYWNrJywgc3R5bGU6ICdibGFjaycsIGNvZGU6ICdrJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdncmV5Jywgc3R5bGU6ICdncmV5JywgY29kZTogJ3UnIH0sXHJcblx0XHRcdHsgbmFtZTogJ3doaXRlJywgc3R5bGU6ICd3aGl0ZScsIGNvZGU6ICd3JyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdjb3ZlcicsIHN0eWxlOiAnc3otY292ZXInLCBjb2RlOiAnaicgfSxcclxuXHRcdFx0eyBuYW1lOiAnbm9uZScsIHN0eWxlOiAnbm9uZScsIGNvZGU6ICctJyB9LFxyXG5cdFx0XSBhcyBjb25zdDtcclxuXHRcdE9iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywgeyBsaXN0IH0pO1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBjb2xvckxpc3QgPSBsaXN0Lm1hcChlID0+IGUubmFtZSk7XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IGJ5TmFtZTogUmVjb3JkPGNvbG9yLCBjb2xvckluZm8+ID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UubmFtZSwgZV0gYXMgY29uc3QpKTtcclxuXHRcdGV4cG9ydCBjb25zdCBieUNoYXI6IFJlY29yZDxjaGFyLCBjb2xvckluZm8+ID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UuY29kZSwgZV0gYXMgY29uc3QpKTtcclxuXHRcdGV4cG9ydCBjb25zdCBieUNvbWJvOiBSZWNvcmQ8Y29sb3JTdHJpbmcsIGNvbG9ySW5mbz4gPSBPYmplY3QuZnJvbUVudHJpZXMobGlzdC5maWx0ZXIoZSA9PiBlLmNvbWJvKS5tYXAoZSA9PiBbZS5jb21ibyEsIGVdKSk7XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGV4YW1wbGVMYXllcihjb2xvcjogY29sb3IpIHtcclxuXHRcdFx0bGV0IGkgPSAwO1xyXG5cdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRcdHF1YWRzOiBbXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnY2lyY2xlJywgZnJvbTogaSwgdG86IGkgKz0gNiwgY29sb3IgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdzcXVhcmUnLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvciB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZTogJ2NpcmNsZScsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnc3F1YXJlJywgZnJvbTogaSwgdG86IGkgKz0gNiwgY29sb3IgfSxcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGFyZWFzOiBbXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnc2VjdG9yJywgZnJvbTogMCwgdG86IDI0LCBjb2xvciB9LFxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHRleHBvcnQgbmFtZXNwYWNlIHF1YWQge1xyXG5cdFx0ZXhwb3J0IHR5cGUgcXVhZEluZm8gPSB7XHJcblx0XHRcdG5hbWU6IHF1YWRTaGFwZSwgY29kZTogY2hhciwgY29tYm8/OiBzdHJpbmcsIHNwYXduPzogc3RyaW5nLFxyXG5cdFx0XHRwYXRoPzogKGN0eDogU3pDb250ZXh0MkQsIHF1YWQ6IFN6TGF5ZXJRdWFkKSA9PiB2b2lkLFxyXG5cdFx0fTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgbGlzdDogcXVhZEluZm9bXSA9IFtcclxuXHRcdFx0eyBuYW1lOiAnY2lyY2xlJywgY29kZTogJ0MnLCBjb21ibzogJ0MnLCBzcGF3bjogJ3N6IWwhenxxIUMtMG98YSFzdTBvfGMhJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdzcXVhcmUnLCBjb2RlOiAnUicsIGNvbWJvOiAnUicsIHNwYXduOiAnc3ohbCF6fHEhUi0wYyxSLWNvfGEhc3Uwb3xjIScgfSxcclxuXHRcdFx0eyBuYW1lOiAnc3RhcicsIGNvZGU6ICdTJywgY29tYm86ICdTJywgc3Bhd246ICdzeiFsIXp8cSFTLTRjLFMtY2ssUy1rc3xhIXN1MG98YyEnIH0sXHJcblx0XHRcdHsgbmFtZTogJ3dpbmRtaWxsJywgY29kZTogJ1cnLCBjb21ibzogJ1cnLCBzcGF3bjogJ3N6IWwhenxxIVMtNGMsUy1jayxTLWtzfGEhc3Uwb3xjIScgfSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdjb3ZlcicsIGNvZGU6ICdKJyxcclxuXHRcdFx0XHRwYXRoKGN0eCwgeyBmcm9tLCB0byB9KSB7XHJcblx0XHRcdFx0XHRjdHguYXJjKDAsIDAsIDEuMTUsIGZyb20sIHRvKTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0bmFtZTogJ2Nsb3ZlcicgYXMgYW55LCBjb2RlOiAnTCcsXHJcblx0XHRcdFx0cGF0aChjdHgsIHsgZnJvbSwgdG8gfSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgciA9IDAuNSwgUiA9IDE7XHJcblx0XHRcdFx0XHRjdHgucm90YXRlKGZyb20pO1xyXG5cclxuXHRcdFx0XHRcdC8vIGV4cG9ydCBjb25zdCBleHRyYVNoYXBlczogUmVjb3JkPHN0cmluZywgKGN0eDogU3pDb250ZXh0MkQsIHF1YWQ6IFN6TGF5ZXJRdWFkKSA9PiB2b2lkPiA9IHtcclxuXHRcdFx0XHRcdC8vIFx0Y2xvdmVyKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdFx0XHRcdC8vIFx0XHQvLyBiZWdpbih7IHNpemU6IDEuMywgcGF0aDogdHJ1ZSwgemVybzogdHJ1ZSB9KTtcclxuXHRcdFx0XHRcdGNvbnN0IGlubmVyID0gMC41O1xyXG5cdFx0XHRcdFx0Y29uc3QgaW5uZXJfY2VudGVyID0gMC40NTtcclxuXHRcdFx0XHRcdGN0eC5jdHgubGluZVRvKDAsIGlubmVyKTtcclxuXHRcdFx0XHRcdGN0eC5jdHguYmV6aWVyQ3VydmVUbygwLCAxLCBpbm5lciwgMSwgaW5uZXJfY2VudGVyLCBpbm5lcl9jZW50ZXIpO1xyXG5cdFx0XHRcdFx0Y3R4LmN0eC5iZXppZXJDdXJ2ZVRvKDEsIGlubmVyLCAxLCAwLCBpbm5lciwgMCk7XHJcblx0XHRcdFx0XHQvLyBcdH0sXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0bmFtZTogJycsIGNvZGU6ICcnLFxyXG5cdFx0XHRcdC8vIFx0c3RhcjgoY3R4OiBTekNvbnRleHQyRCwgeyBmcm9tLCB0byB9OiBTekxheWVyUXVhZCkge1xyXG5cdFx0XHRcdC8vIFx0XHRjb25zdCByID0gMS4yMiAvIDIsIFIgPSAxLjIyLCBkID0gKG46IG51bWJlcikgPT4gZnJvbSAqICgxIC0gbikgKyB0byAqIG47XHJcblx0XHRcdFx0Ly8gXHRcdGN0eFxyXG5cdFx0XHRcdC8vIFx0XHRcdC5saW5lVG9SKHIsIGQoMCkpXHJcblx0XHRcdFx0Ly8gXHRcdFx0LmxpbmVUb1IoUiwgZCgwLjI1KSlcclxuXHRcdFx0XHQvLyBcdFx0XHQubGluZVRvUihyLCBkKDAuNSkpXHJcblx0XHRcdFx0Ly8gXHRcdFx0LmxpbmVUb1IoUiwgZCgwLjc1KSlcclxuXHRcdFx0XHQvLyBcdFx0XHQubGluZVRvUihyLCBkKDEpKVxyXG5cdFx0XHRcdC8vIFx0fSxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdG5hbWU6ICcnLCBjb2RlOiAnJyxcclxuXHRcdFx0XHQvLyBcdHJob21idXMoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHRcdC8vIFx0fSxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdG5hbWU6ICcnLCBjb2RlOiAnJyxcclxuXHRcdFx0XHQvLyBcdHBsdXMoY3R4OiBTekNvbnRleHQyRCwgeyBmcm9tLCB0byB9OiBTekxheWVyUXVhZCkge1xyXG5cdFx0XHRcdC8vIFx0XHRjb25zdCByID0gMC40LCBSID0gMS4wLCBkID0gKG46IG51bWJlcikgPT4gZnJvbSAqICgxIC0gbikgKyB0byAqIG47XHJcblx0XHRcdFx0Ly8gXHRcdGNvbnN0IHJyID0gKHIxOiBudW1iZXIsIHIyOiBudW1iZXIpID0+IChyMSAqIHIxICsgcjIgKiByMikgKiogMC41XHJcblx0XHRcdFx0Ly8gXHRcdGNvbnN0IGF0ID0gKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBNYXRoLmF0YW4yKGIsIGEpIC8gTWF0aC5QSSAqIDI7XHJcblx0XHRcdFx0Ly8gXHRcdGNvbnN0IHRvciA9IChyOiBudW1iZXIsIFI6IG51bWJlcikgPT4gW3JyKHIsIFIpLCBkKGF0KHIsIFIpKV0gYXMgY29uc3Q7XHJcblx0XHRcdFx0Ly8gXHRcdGN0eFxyXG5cdFx0XHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcihSLCAwKSlcclxuXHRcdFx0XHQvLyBcdFx0XHQubGluZVRvUiguLi50b3IoUiwgcikpXHJcblx0XHRcdFx0Ly8gXHRcdFx0LmxpbmVUb1IoLi4udG9yKHIsIHIpKVxyXG5cdFx0XHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcihyLCBSKSlcclxuXHRcdFx0XHQvLyBcdFx0XHQubGluZVRvUiguLi50b3IoMCwgUikpXHJcblx0XHRcdFx0Ly8gXHR9LFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0bmFtZTogJycsIGNvZGU6ICcnLFxyXG5cdFx0XHRcdC8vIFx0c2F3KGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdFx0XHQvLyBcdH0sXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRuYW1lOiAnJywgY29kZTogJycsXHJcblx0XHRcdFx0Ly8gXHRzdW4oY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHRcdC8vIFx0fSxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdG5hbWU6ICcnLCBjb2RlOiAnJyxcclxuXHRcdFx0XHQvLyBcdGxlYWYoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHRcdC8vIFx0fSxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdG5hbWU6ICcnLCBjb2RlOiAnJyxcclxuXHRcdFx0XHQvLyBcdGRpYW1vbmQoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHRcdC8vIFx0fSxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdG5hbWU6ICcnLCBjb2RlOiAnJyxcclxuXHRcdFx0XHQvLyBcdG1pbGwoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHRcdC8vIFx0fSxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdG5hbWU6ICcnLCBjb2RlOiAnJyxcclxuXHRcdFx0XHQvLyBcdGhhbGZsZWFmKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdFx0XHQvLyBcdH0sXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRuYW1lOiAnJywgY29kZTogJycsXHJcblx0XHRcdFx0Ly8gXHR5aW55YW5nKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdFx0XHQvLyBcdH0sXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRuYW1lOiAnJywgY29kZTogJycsXHJcblx0XHRcdFx0Ly8gXHRvY3RhZ29uKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdFx0XHQvLyBcdH0sXHJcblx0XHRcdH0sXHJcblx0XHRdIGFzIHF1YWRJbmZvW107XHJcblx0XHR3aGlsZSAobGlzdC5maW5kKGUgPT4gIWUubmFtZSkpIHtcclxuXHRcdFx0bGlzdC5zcGxpY2UobGlzdC5maW5kSW5kZXgoZSA9PiAhZS5uYW1lKSwgMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IG5hbWVkNCA9IHtcclxuXHJcblx0XHRcdGNpcmNsZVNwYXduOiAnQ3VDdUN1Q3UnLFxyXG5cdFx0XHRzcXVhcmVTcGF3bjogJ1J1UnVSdVJ1JyxcclxuXHRcdFx0c3RhclNwYXduOiAnU3VTdVN1U3UnLFxyXG5cdFx0XHR3aW5kbWlsbFNwYXduOiAnV3VXdVd1V3UnLFxyXG5cclxuXHRcdFx0Y2lyY2xlQm90dG9tOiAnLS1DdUN1LS0nLFxyXG5cclxuXHRcdFx0Y2lyY2xlOiBcIkN1Q3VDdUN1XCIsXHJcblx0XHRcdGNpcmNsZUhhbGY6IFwiLS0tLUN1Q3VcIixcclxuXHRcdFx0cmVjdDogXCJSdVJ1UnVSdVwiLFxyXG5cdFx0XHRyZWN0SGFsZjogXCJSdVJ1LS0tLVwiLFxyXG5cdFx0XHRjaXJjbGVIYWxmUm90YXRlZDogXCJDdS0tLS1DdVwiLFxyXG5cdFx0XHRjaXJjbGVRdWFkOiBcIkN1LS0tLS0tXCIsXHJcblx0XHRcdGNpcmNsZVJlZDogXCJDckNyQ3JDclwiLFxyXG5cdFx0XHRyZWN0SGFsZkJsdWU6IFwiUmJSYi0tLS1cIixcclxuXHRcdFx0Y2lyY2xlUHVycGxlOiBcIkNwQ3BDcENwXCIsXHJcblx0XHRcdHN0YXJDeWFuOiBcIlNjU2NTY1NjXCIsXHJcblx0XHRcdGZpc2g6IFwiQ2dTY1NjQ2dcIixcclxuXHRcdFx0Ymx1ZXByaW50OiBcIkNiQ2JDYlJiOkN3Q3dDd0N3XCIsXHJcblx0XHRcdHJlY3RDaXJjbGU6IFwiUnBScFJwUnA6Q3dDd0N3Q3dcIixcclxuXHRcdFx0d2F0ZXJtZWxvbjogXCItLUNnLS0tLTotLUNyLS0tLVwiLFxyXG5cdFx0XHRzdGFyQ2lyY2xlOiBcIlNyU3JTclNyOkN5Q3lDeUN5XCIsXHJcblx0XHRcdHN0YXJDaXJjbGVTdGFyOiBcIlNyU3JTclNyOkN5Q3lDeUN5OlN3U3dTd1N3XCIsXHJcblx0XHRcdGZhbjogXCJDYlJiUmJDYjpDd0N3Q3dDdzpXYldiV2JXYlwiLFxyXG5cdFx0XHRtb25zdGVyOiBcIlNnLS0tLVNnOkNnQ2dDZ0NnOi0tQ3lDeS0tXCIsXHJcblx0XHRcdGJvdXF1ZXQ6IFwiQ3BScENwLS06U3dTd1N3U3dcIixcclxuXHRcdFx0bG9nbzogXCJSdUN3LS1DdzotLS0tUnUtLVwiLFxyXG5cdFx0XHR0YXJnZXQ6IFwiQ3JDd0NyQ3c6Q3dDckN3Q3I6Q3JDd0NyQ3c6Q3dDckN3Q3JcIixcclxuXHRcdFx0c3BlZWRvbWV0ZXI6IFwiQ2ctLS0tQ3I6Q3ctLS0tQ3c6U3ktLS0tLS06Q3ktLS0tQ3lcIixcclxuXHRcdFx0Ly8gc3Bpa2VkQmFsbDogXCJDY1N5Q2NTeTpTeUNjU3lDYzpDY1N5Q2NTeTpTeUNjU3lDY1wiLFxyXG5cdFx0XHRzcGlrZWRCYWxsOiBcIkNjU3lDY1N5OlN5Q2NTeUNjOkNjU3lDY1N5XCIsXHJcblx0XHRcdGNvbXBhc3M6IFwiQ2NSY0NjUmM6UndDd1J3Q3c6U3ItLVN3LS06Q3lDeUN5Q3lcIixcclxuXHRcdFx0cGxhbnQ6IFwiUmctLVJnLS06Q3dSd0N3Unc6LS1SZy0tUmdcIixcclxuXHRcdFx0cm9ja2V0OiBcIkNiQ3VDYkN1OlNyLS0tLS0tOi0tQ3JTckNyOkN3Q3dDd0N3XCIsXHJcblxyXG5cdFx0XHRtaWxsOiBcIkN3Q3dDd0N3OldiV2JXYldiXCIsXHJcblx0XHRcdHN0YXI6IFwiU3VTdVN1U3VcIixcclxuXHRcdFx0Y2lyY2xlU3RhcjogXCJDd0NyQ3dDcjpTZ1NnU2dTZ1wiLFxyXG5cdFx0XHRjbG93bjogXCJXclJnV3JSZzpDd0NyQ3dDcjpTZ1NnU2dTZ1wiLFxyXG5cdFx0XHR3aW5kbWlsbFJlZDogXCJXcldyV3JXclwiLFxyXG5cdFx0XHRmYW5UcmlwbGU6IFwiV3BXcFdwV3A6Q3dDd0N3Q3c6V3BXcFdwV3BcIixcclxuXHRcdFx0ZmFuUXVhZHJ1cGxlOiBcIldwV3BXcFdwOkN3Q3dDd0N3OldwV3BXcFdwOkN3Q3dDd0N3XCIsXHJcblxyXG5cdFx0XHRiaXJkOiBcIlNyLS0tLS0tOi0tQ2ctLUNnOlNiLS1TYi0tOi0tQ3ctLUN3XCIsXHJcblx0XHRcdHNjaXNzb3JzOiBcIlNyLS0tLS0tOi0tQ2dDZ0NnOi0tU2ItLS0tOkN3LS1Dd0N3XCIsXHJcblxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgY29uc3QgbmFtZWQ2ID0ge1xyXG5cdFx0XHRjaXJjbGVTcGF3bjogJzZDdUN1Q3VDdUN1Q3UnLFxyXG5cdFx0XHRzcXVhcmVTcGF3bjogJzZSdVJ1UnVSdVJ1UnUnLFxyXG5cdFx0XHRzdGFyU3Bhd246ICc2U3VTdVN1U3VTdVN1JyxcclxuXHRcdFx0d2luZG1pbGxTcGF3bjogJzZXdVd1V3VXdVd1V3UnLFxyXG5cclxuXHRcdFx0Y2lyY2xlQm90dG9tOiAnNi0tLS1DdUN1Q3UtLScsXHJcblxyXG5cdFx0XHRjaXJjbGU6IFwiNkN1Q3VDdUN1Q3VDdVwiLFxyXG5cdFx0XHRjaXJjbGVIYWxmOiBcIjYtLS0tLS1DdUN1Q3VcIixcclxuXHRcdFx0cmVjdDogXCI2UnVSdVJ1UnVSdVJ1XCIsXHJcblx0XHRcdHJlY3RIYWxmOiBcIjZSdVJ1UnUtLS0tLS1cIixcclxuXHRcdFx0Y2lyY2xlSGFsZlJvdGF0ZWQ6IFwiNkN1LS0tLS0tQ3VDdVwiLFxyXG5cdFx0XHRjaXJjbGVRdWFkOiBcIjZDdUN1LS0tLS0tLS1cIixcclxuXHRcdFx0Y2lyY2xlUmVkOiBcIjZDckNyQ3JDckNyQ3JcIixcclxuXHRcdFx0cmVjdEhhbGZCbHVlOiBcIjZSYlJiUmItLS0tLS1cIixcclxuXHRcdFx0Y2lyY2xlUHVycGxlOiBcIjZDcENwQ3BDcENwQ3BcIixcclxuXHRcdFx0c3RhckN5YW46IFwiNlNjU2NTY1NjU2NTY1wiLFxyXG5cdFx0XHRmaXNoOiBcIjZDZ0NnU2NTY0NnQ2dcIixcclxuXHRcdFx0Ymx1ZXByaW50OiBcIjZDYkNiQ2JDYkNiUmI6NkN3Q3dDd0N3Q3dDd1wiLFxyXG5cdFx0XHRyZWN0Q2lyY2xlOiBcIjZScFJwUnBScFJwUnA6NkN3Q3dDd0N3Q3dDd1wiLFxyXG5cdFx0XHR3YXRlcm1lbG9uOiBcIjYtLUNnQ2ctLS0tLS06Ni0tQ3JDci0tLS0tLVwiLFxyXG5cdFx0XHRzdGFyQ2lyY2xlOiBcIjZTclNyU3JTclNyU3I6NkN5Q3lDeUN5Q3lDeVwiLFxyXG5cdFx0XHRzdGFyQ2lyY2xlU3RhcjogXCI2U3JTclNyU3JTclNyOjZDeUN5Q3lDeUN5Q3k6NlN3U3dTd1N3U3dTd1wiLFxyXG5cdFx0XHRmYW46IFwiNkNiQ2JSYlJiQ2JDYjo2Q3dDd0N3Q3dDd0N3OjZXYldiV2JXYldiV2JcIixcclxuXHRcdFx0bW9uc3RlcjogXCI2U2ctLS0tLS0tLVNnOjZDZ0NnQ2dDZ0NnQ2c6Ni0tQ3lDeUN5Q3ktLVwiLFxyXG5cdFx0XHRib3VxdWV0OiBcIjZDcENwUnBDcENwLS06NlN3U3dTd1N3U3dTd1wiLFxyXG5cdFx0XHRsb2dvOiBcIjZSd0N1Q3ctLUN3Q3U6Ni0tLS0tLVJ1LS0tLVwiLFxyXG5cdFx0XHR0YXJnZXQ6IFwiNkNyQ3dDckN3Q3JDdzo2Q3dDckN3Q3JDd0NyOjZDckN3Q3JDd0NyQ3c6NkN3Q3JDd0NyQ3dDclwiLFxyXG5cdFx0XHRzcGVlZG9tZXRlcjogXCI2Q2dDYi0tLS1DckN5OjZDd0N3LS0tLUN3Q3c6NlNjLS0tLS0tLS0tLTo2Q3lDeS0tLS1DeUN5XCIsXHJcblx0XHRcdHNwaWtlZEJhbGw6IFwiNkNjU3lDY1N5Q2NTeTo2U3lDY1N5Q2NTeUNjOjZDY1N5Q2NTeUNjU3k6NlN5Q2NTeUNjU3lDY1wiLFxyXG5cdFx0XHRjb21wYXNzOiBcIjZDY1JjUmNDY1JjUmM6NlJ3Q3dDd1J3Q3dDdzo2LS0tLVNyLS0tLVNiOjZDeUN5Q3lDeUN5Q3lcIixcclxuXHRcdFx0cGxhbnQ6IFwiNlJnLS1SZy0tUmctLTo2Q3dSd0N3UndDd1J3OjYtLVJnLS1SZy0tUmdcIixcclxuXHRcdFx0cm9ja2V0OiBcIjZDYkN1Q2JDdUNiQ3U6NlNyLS0tLS0tLS0tLTo2LS1DckNyU3JDckNyOjZDd0N3Q3dDd0N3Q3dcIixcclxuXHJcblx0XHRcdG1pbGw6IFwiNkN3Q3dDd0N3Q3dDdzo2V2JXYldiV2JXYldiXCIsXHJcblx0XHRcdHN0YXI6IFwiNlN1U3VTdVN1U3VTdVwiLFxyXG5cdFx0XHRjaXJjbGVTdGFyOiBcIjZDd0NyQ3dDckN3Q3I6NlNnU2dTZ1NnU2dTZ1wiLFxyXG5cdFx0XHRjbG93bjogXCI2V3JSZ1dyUmdXclJnOjZDd0NyQ3dDckN3Q3I6NlNnU2dTZ1NnU2dTZ1wiLFxyXG5cdFx0XHR3aW5kbWlsbFJlZDogXCI2V3JXcldyV3JXcldyXCIsXHJcblx0XHRcdGZhblRyaXBsZTogXCI2V3BXcFdwV3BXcFdwOjZDd0N3Q3dDd0N3Q3c6NldwV3BXcFdwV3BXcFwiLFxyXG5cdFx0XHRmYW5RdWFkcnVwbGU6IFwiNldwV3BXcFdwV3BXcDo2Q3dDd0N3Q3dDd0N3OjZXcFdwV3BXcFdwV3A6NkN3Q3dDd0N3Q3dDd1wiLFxyXG5cclxuXHRcdFx0YmlyZDogXCI2U3ItLS0tLS0tLS0tOjYtLUNnQ2ctLUNnQ2c6NlNiLS0tLVNiLS0tLTo2LS1Dd0N3LS1Dd0N3XCIsXHJcblx0XHRcdHNjaXNzb3JzOiBcIjZTci0tLS0tLS0tLS06Ni0tQ2dDZ0NnQ2dDZzo2LS0tLVNiLS0tLS0tOjZDd0N3LS1Dd0N3Q3dcIixcclxuXHJcblxyXG5cdFx0fSBhcyBjb25zdDtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgbmFtZWQgPSB7XHJcblx0XHRcdGNpcmNsZVNwYXduOiAnc3ohbCF6fHEhQy0wb3xhIXN1MG98YyEnLFxyXG5cdFx0XHRzcXVhcmVTcGF3bjogJ3N6IWwhenxxIVItMGMsUi1jb3xhIXN1MG98YyEnLFxyXG5cdFx0XHRzdGFyU3Bhd246ICdzeiFsIXp8cSFTLTRjLFMtY2ssUy1rc3xhIXN1MG98YyEnLFxyXG5cdFx0XHR3aW5kbWlsbFNwYXduOiAnc3ohbCF6fHEhVy0wNixXLTZjLFctY2ksVy1pb3xhIXN1MG98YyEnLFxyXG5cclxuXHJcblx0XHRcdGNpcmNsZTE6ICdzeiFsIXp8cSFDLTBvfGEhc3Uwb3xjIScsXHJcblx0XHRcdGNpcmNsZUhhbGZMZWZ0OiAnc3ohbCF6fHEhQy1jb3xhIXN1MG98YyEnLFxyXG5cdFx0XHRzcXVhcmUyOiAnc3ohbCF6fHEhUi0wYyxSLWNvfGEhc3Uwb3xjIScsXHJcblx0XHRcdHNxdWFyZUhhbGZSaWdodDogJ3N6IWwhenxxIVItMGN8YSFzdTBvfGMhJyxcclxuXHRcdFx0c3F1YXJlSGFsZlRvcDI6ICdzeiFsIXp8cSFSLTZjLFItY2l8YSFzdTZpfGMhJyxcclxuXHRcdFx0Y2lyY2xlSGFsZlRvcDI6ICdzeiFsIXp8cSFDLTA2LEMtaW98YSFzdWl1fGMhJyxcclxuXHRcdFx0Y2lyY2xlUXVhZDE6ICdzeiFsIXp8cSFDLW91fGEhc3Uwb3xjIScsXHJcblx0XHRcdGNpcmNsZVJlZDogJ3N6IWwhenxxIUMtMG98YSFzcjBvfGMhJyxcclxuXHJcblx0XHRcdC8vIHNxdWFyZWhhbGZMZWZ0Qmx1ZTogJ3N6IWwhenxxIVItY298YSFzYjBvfGMhJyxcclxuXHRcdFx0Ly8gY2lyY2xlUHVycGxlOiAnc3ohbCF6fHEhQy0wb3xhIXN2MG98YyEnLFxyXG5cclxuXHRcdFx0c3F1YXJlM1RvcEJsdWU6ICdzeiFsIXp8cSFSLWtzfGEhc2Jrc3xjIScsXHJcblxyXG5cdFx0XHRzdGFyM0N5YW46ICdzeiFsIXp8cSFTLTRjLFMtY2ssUy1rc3xhIXNjMG98YyEnLFxyXG5cdFx0XHRzcXVpZDogJ3N6IWwhenxxIVMtNmMsUy1jaSxDLWl1fGEhc2M2aSxzZ2l1fGMhJyxcclxuXHJcblx0XHRcdGRpYW1vbmQ6ICdzeiFsIXp8cSFSLTAzLFItbG98YSFzY2xyfGMhJyxcclxuXHJcblx0XHRcdHBhbG06ICdzeiFsIXp8cSFTLTAyLFMtMjQsUy00NixTLWlrLFMta20sUy1tb3xhIXNnaXV8YyE6bCF6fHEhUi1hZXxhIXNvYWV8YyE6bCF6fHEhQy02aXxhIXNwNml8YyEnLFxyXG5cdFx0XHRjb3VudGVyOiAnc3ohbCF6fHEhQy1pdXxhIXNyMjYsc2dpbSxzeW1xfGMhOmwhenxxIVItMjYsUi1pbSxSLW1xfGEhc3dpdXxjITpsIXp8cSFTLTA0fGEhc3UwNHxjITpsIXp8cSFDLWl1fGEhc3VpdXxjIScsXHJcblxyXG5cdFx0XHR3aW5kb3c6ICdzeiFsIXp8cSFSLTA2LFItNmMsUi1jaSxSLWlvfGEhc2Mwb3xjITpsIXp8cSFSLTI4LFItOGUsUi1layxSLWtxfGEhc28wb3xjITpsIXp8cSFSLTRhLFItYWcsUi1nbSxSLW1zfGEhc3kwb3xjITpsIXp8cSFSLTA2LFItNmMsUi1jaSxSLWlvfGEhc3cwb3xjIScsXHJcblxyXG5cdFx0XHRzcGxpa2ViYWxsNDg6ICdzeiFsIXp8cSFDLTAyLFMtMjQsQy00NixTLTY4LEMtOGEsUy1hYyxDLWNlLFMtZWcsQy1naSxTLWlrLEMta20sUy1tb3xhIXNjMDIsc3kyNCxzYzQ2LHN5Njgsc2M4YSxzeWFjLHNjY2Usc3llZyxzY2dpLHN5aWssc2NrbSxzeW1vfGMhOmwhenxxIVMtMDIsQy0yNCxTLTQ2LEMtNjgsUy04YSxDLWFjLFMtY2UsQy1lZyxTLWdpLEMtaWssUy1rbSxDLW1vfGEhc3kwMixzYzI0LHN5NDYsc2M2OCxzeThhLHNjYWMsc3ljZSxzY2VnLHN5Z2ksc2NpayxzeWttLHNjbW98YyE6bCF6fHEhQy0wMixTLTI0LEMtNDYsUy02OCxDLThhLFMtYWMsQy1jZSxTLWVnLEMtZ2ksUy1payxDLWttLFMtbW98YSFzYzAyLHN5MjQsc2M0NixzeTY4LHNjOGEsc3lhYyxzY2NlLHN5ZWcsc2NnaSxzeWlrLHNja20sc3ltb3xjITpsIXp8cSFTLTAyLEMtMjQsUy00NixDLTY4LFMtOGEsQy1hYyxTLWNlLEMtZWcsUy1naSxDLWlrLFMta20sQy1tb3xhIXN5MDIsc2MyNCxzeTQ2LHNjNjgsc3k4YSxzY2FjLHN5Y2Usc2NlZyxzeWdpLHNjaWssc3lrbSxzY21vfGMhJyxcclxuXHRcdH0gYXMgY29uc3Q7XHJcblxyXG5cdFx0ZXhwb3J0IHR5cGUgbmFtZWQgPSBrZXlvZiB0eXBlb2YgbmFtZWQ7XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IGJ5TmFtZSA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0Lm1hcChlID0+IFtlLm5hbWUsIGVdKSk7XHJcblx0XHRleHBvcnQgY29uc3QgYnlDaGFyID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UuY29kZSwgZV0pKTtcclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZXhhbXBsZUxheWVyKHNoYXBlOiBxdWFkU2hhcGUpIHtcclxuXHRcdFx0bGV0IGkgPSAwO1xyXG5cdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRcdHF1YWRzOiBbXHJcblx0XHRcdFx0XHR7IHNoYXBlLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvcjogJ2dyZXknIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvcjogJ2dyZXknIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvcjogJ2dyZXknIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvcjogJ2dyZXknIH0sXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRhcmVhczogW1xyXG5cdFx0XHRcdFx0eyBzaGFwZTogJ3NlY3RvcicsIGZyb206IDAsIHRvOiAyNCwgY29sb3I6ICdncmV5JyB9LFxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBPYmplY3QuZW50cmllcyhleHRyYVNoYXBlcykubWFwKChbaywgdl0pID0+IGxpc3QucHVzaCh7IG5hbWU6IGsgfSBhcyBhbnkpKTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgcXVhZExpc3QgPSBsaXN0Lm1hcChlID0+IGUubmFtZSk7XHJcblx0fVxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgYXJlYSB7XHJcblx0XHRleHBvcnQgdHlwZSBhcmVhSW5mbyA9IHsgbmFtZTogYXJlYVNoYXBlLCBjb2RlOiBjaGFyIH07XHJcblx0XHRleHBvcnQgY29uc3QgbGlzdDogYXJlYUluZm9bXSA9IFtcclxuXHRcdFx0eyBuYW1lOiAnc2VjdG9yJywgY29kZTogJ3MnIH0sXHJcblx0XHRcdHsgbmFtZTogJ3dob2xlJywgY29kZTogJ3cnIH0sXHJcblx0XHRdO1xyXG5cdFx0ZXhwb3J0IGNvbnN0IGJ5TmFtZTogUmVjb3JkPGFyZWFTaGFwZSwgYXJlYUluZm8+ID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UubmFtZSwgZV0pKTtcclxuXHRcdGV4cG9ydCBjb25zdCBieUNoYXI6IFJlY29yZDxjaGFyLCBhcmVhSW5mbz4gPSBPYmplY3QuZnJvbUVudHJpZXMobGlzdC5tYXAoZSA9PiBbZS5jb2RlLCBlXSkpO1xyXG5cclxuXHR9XHJcblxyXG5cdGxldCBzID0gQXJyYXkoMTAwKS5maWxsKDApLm1hcCgoZSwgaSkgPT4gaS50b1N0cmluZygzNikpLmpvaW4oJycpLnNsaWNlKDAsIDM2KTtcclxuXHRzICs9IHMuc2xpY2UoMTApLnRvVXBwZXJDYXNlKCk7XHJcblxyXG5cdGV4cG9ydCBjb25zdCBuVG9DaGFyOiBjaGFyW10gPSBzLnNwbGl0KCcnKTtcclxuXHRleHBvcnQgY29uc3QgY2hhclRvTjogUmVjb3JkPGNoYXIsIG51bWJlcj4gPSBPYmplY3QuZnJvbUVudHJpZXMoblRvQ2hhci5tYXAoKGUsIGkpID0+IFtlLCBpXSkpO1xyXG5cdC8qIG9sZDogXHJcblxyXG5cdFxyXG5leHBvcnQgY29uc3Qgc2hhcGU0c3ZnID0ge1xyXG5cdFI6IFwiTSAwIDAgTCAxIDAgTCAxIDEgTCAwIDEgWlwiLFxyXG5cdEM6IFwiTSAwIDAgTCAxIDAgQSAxIDEgMCAwIDEgMCAxIFpcIixcclxuXHRTOiBcIk0gMCAwIEwgMC42IDAgTCAxIDEgTCAwIDAuNiBaXCIsXHJcblx0VzogXCJNIDAgMCBMIDAuNiAwIEwgMSAxIEwgMCAxIFpcIixcclxuXHRcIi1cIjogXCJNIDAgMFwiLFxyXG59XHJcbmZ1bmN0aW9uIGRvdFBvcyhsLCBhKSB7XHJcblx0cmV0dXJuIGAke2wgKiBNYXRoLmNvcyhNYXRoLlBJIC8gYSl9ICR7bCAqIE1hdGguc2luKE1hdGguUEkgLyBhKX1gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaW5QaUJ5KGEpIHtcclxuXHRyZXR1cm4gTWF0aC5zaW4oTWF0aC5QSSAvIGEpO1xyXG59XHJcbmZ1bmN0aW9uIGNvc1BpQnkoYSkge1xyXG5cdHJldHVybiBNYXRoLmNvcyhNYXRoLlBJIC8gYSk7XHJcbn1cclxubGV0IHNoYXBlNmxvbmcgPSAxIC8gY29zUGlCeSg2KTtcclxuXHJcbmV4cG9ydCBjb25zdCBzaGFwZTZzdmcgPSB7XHJcblx0UjogYE0gMCAwIEwgMSAwIEwgJHtkb3RQb3Moc2hhcGU2bG9uZywgNil9IEwgJHtkb3RQb3MoMSwgMyl9IFpgLFxyXG5cdEM6IGBNIDAgMCBMIDEgMCBBIDEgMSAwIDAgMSAke2RvdFBvcygxLCAzKX0gWmAsXHJcblx0UzogYE0gMCAwIEwgMC42IDAgTCAke2RvdFBvcyhzaGFwZTZsb25nLCA2KX0gTCAke2RvdFBvcygwLjYsIDMpfSBaYCxcclxuXHRXOiBgTSAwIDAgTCAwLjYgMCBMICR7ZG90UG9zKHNoYXBlNmxvbmcsIDYpfSBMICR7ZG90UG9zKDEsIDMpfSBaYCxcclxuXHRcIi1cIjogXCJNIDAgMFwiLFxyXG59XHJcblxyXG5cclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInJob21idXNcIixcclxuXHRjb2RlOiBcIkJcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHRcdGJlZ2luKHsgc2l6ZTogMS4yLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0Y29uc3QgcmFkID0gMC4wMDE7XHJcblx0XHQvLyB3aXRoIHJvdW5kZWQgYm9yZGVyc1xyXG5cdFx0Y29udGV4dC5hcmNUbygwLCAxLCAxLCAwLCByYWQpO1xyXG5cdFx0Y29udGV4dC5hcmNUbygxLCAwLCAwLCAwLCByYWQpO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwicGx1c1wiLFxyXG5cdGNvZGU6IFwiUFwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXc6IFwiTSAwIDAgTCAxLjEgMCAxLjEgMC41IDAuNSAwLjUgMC41IDEuMSAwIDEuMSB6XCIsXHJcblx0dGllcjogMyxcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJzYXdcIixcclxuXHRjb2RlOiBcIlpcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHRcdGJlZ2luKHsgc2l6ZTogMS4xLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0Y29uc3QgaW5uZXIgPSAwLjU7XHJcblx0XHRjb250ZXh0LmxpbmVUbyhpbm5lciwgMCk7XHJcblx0XHRjb250ZXh0LmJlemllckN1cnZlVG8oaW5uZXIsIDAuMywgMSwgMC4zLCAxLCAwKTtcclxuXHRcdGNvbnRleHQuYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0MSxcclxuXHRcdFx0aW5uZXIsXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMiAqIDAuOSxcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQyICogMC45LFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDFfMixcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQxXzJcclxuXHRcdCk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZShNYXRoLlBJIC8gNCk7XHJcblx0XHRjb250ZXh0LmJlemllckN1cnZlVG8oaW5uZXIsIDAuMywgMSwgMC4zLCAxLCAwKTtcclxuXHRcdGNvbnRleHQuYmV6aWVyQ3VydmVUbyhcclxuXHRcdFx0MSxcclxuXHRcdFx0aW5uZXIsXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMiAqIDAuOSxcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQyICogMC45LFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDFfMixcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQxXzJcclxuXHRcdCk7XHJcblx0fSxcclxuXHR0aWVyOiAzLFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInN1blwiLFxyXG5cdGNvZGU6IFwiVVwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdHNwYXduQ29sb3I6IFwieWVsbG93XCIsXHJcblx0ZHJhdyh7IGRpbXMsIGlubmVyRGltcywgbGF5ZXIsIHF1YWQsIGNvbnRleHQsIGNvbG9yLCBiZWdpbiB9KSB7XHJcblx0XHRiZWdpbih7IHNpemU6IDEuMywgcGF0aDogdHJ1ZSwgemVybzogdHJ1ZSB9KTtcclxuXHRcdGNvbnN0IFBJID0gTWF0aC5QSTtcclxuXHRcdGNvbnN0IFBJMyA9ICgoUEkgKiAzKSAvIDgpICogMC43NTtcclxuXHRcdGNvbnN0IGMgPSAxIC8gTWF0aC5jb3MoTWF0aC5QSSAvIDgpO1xyXG5cdFx0Y29uc3QgYiA9IGMgKiBNYXRoLnNpbihNYXRoLlBJIC8gOCk7XHJcblxyXG5cdFx0Y29udGV4dC5tb3ZlVG8oMCwgMCk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZShNYXRoLlBJIC8gMik7XHJcblx0XHRjb250ZXh0LmFyYyhjLCAwLCBiLCAtUEksIC1QSSArIFBJMyk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZSgtTWF0aC5QSSAvIDQpO1xyXG5cdFx0Y29udGV4dC5hcmMoYywgMCwgYiwgLVBJIC0gUEkzLCAtUEkgKyBQSTMpO1xyXG5cdFx0Y29udGV4dC5yb3RhdGUoLU1hdGguUEkgLyA0KTtcclxuXHRcdGNvbnRleHQuYXJjKGMsIDAsIGIsIFBJIC0gUEkzLCBQSSk7XHJcblx0fSxcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJsZWFmXCIsXHJcblx0Y29kZTogXCJGXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0ZHJhdzogXCJNIDAgMCB2IDAuNSBhIDAuNSAwLjUgMCAwIDAgMC41IDAuNSBoIDAuNSB2IC0wLjUgYSAwLjUgMC41IDAgMCAwIC0wLjUgLTAuNSB6XCIsXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwiZGlhbW9uZFwiLFxyXG5cdGNvZGU6IFwiRFwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXc6IFwiTSAwIDAgbCAwIDAuNSAwLjUgMC41IDAuNSAwIDAgLTAuNSAtMC41IC0wLjUgelwiLFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcIm1pbGxcIixcclxuXHRjb2RlOiBcIk1cIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3OiBcIk0gMCAwIEwgMCAxIDEgMSBaXCIsXHJcbn0pO1xyXG5cclxuLy8gcmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcbi8vICAgICBpZDogXCJoYWxmbGVhZlwiLFxyXG4vLyAgICAgY29kZTogXCJIXCIsXHJcbi8vICAgICAuLi5jdXN0b21EZWZhdWx0cyxcclxuLy8gICAgIGRyYXc6IFwiMTAwIE0gMCAwIEwgMCAxMDAgQSA0NSA0NSAwIDAgMCAzMCAzMCBBIDQ1IDQ1IDAgMCAwIDEwMCAwIFpcIixcclxuLy8gfSlcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInlpbnlhbmdcIixcclxuXHRjb2RlOiBcIllcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHQvLyBkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHQvLyAgICAgYmVnaW4oeyBzaXplOiAxLygwLjUrTWF0aC5TUVJUMV8yKSwgcGF0aDogdHJ1ZSB9KTtcclxuXHJcblx0Ly8gICAgIC8qKiBAdHlwZXtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9ICogL1xyXG5cdC8vICAgICBsZXQgY3R4ID0gY29udGV4dDtcclxuXHJcblx0Ly8gICAgIHdpdGggKGN0eCkgeyB3aXRoIChNYXRoKSB7XHJcblx0Ly8gICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vICAgICAvLyBkcmF3IG1vc3RseSBpbiBbMCwxXXhbMCwxXSBzcXVhcmVcclxuXHQvLyAgICAgLy8gZHJhdzogXCIxMDAgTSAwIDUwIEEgNTAgNTAgMCAxIDEgODUgODUgQSAxMjEgMTIxIDAgMCAxIC04NSA4NSBBIDUwIDUwIDAgMCAwIDAgNTBcIixcclxuXHQvLyAgICAgbW92ZVRvKDAsIDAuNSk7XHJcblx0Ly8gICAgIGFyYygwLjUsIDAuNSwgMC41LCBQSSwgUEkvNClcclxuXHQvLyAgICAgYXJjKDAsIDAsIDAuNStTUVJUMV8yLCBQSS80LCBQSS80K1BJLzIsIDApXHJcblx0Ly8gICAgIGFyYygtMC41LCAwLjUsIDAuNSwgMypQSS80LCAwLCAxKVxyXG5cclxuXHQvLyAgICAgbW92ZVRvKDAuNiwgMC41KVxyXG5cdC8vICAgICBhcmMoMC41LCAwLjUsIDAuMSwgMCwgMipQSSlcclxuXHQvLyAgICAgfX1cclxuXHJcblx0Ly8gfSxcclxuXHRkcmF3OlxyXG5cdFx0XCIxMjAuNzEgTSAwIDUwIEEgNTAgNTAgMCAxIDEgODUuMzU1IDg1LjM1NSBBIDEyMC43MSAxMjAuNzEgMCAwIDEgLTg1LjM1NSA4NS4zNTUgQSA1MCA1MCAwIDAgMCAwIDUwIFogTSA0MCA1MCBBIDEwIDEwIDAgMSAwIDQwIDQ5Ljk5IFpcIixcclxuXHR0aWVyOiA0LFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcIm9jdGFnb25cIixcclxuXHRjb2RlOiBcIk9cIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3OiBcIk0gMCAwIEwgMCAxIDAuNDE0MiAxIDEgMC40MTQyIDEgMCBaXCIsXHJcbn0pO1xyXG5cclxuXHRcclxuXHQqL1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN6TGF5ZXIge1xyXG5cdGN1dHM6ICh7XHJcblx0XHRzaGFwZTogY3V0U2hhcGUsXHJcblx0XHRmcm9tOiByb3RhdGlvbjI0LCB0bzogcm90YXRpb24yNCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHR9KVtdO1xyXG5cdHF1YWRzOiAoe1xyXG5cdFx0c2hhcGU6IHF1YWRTaGFwZSxcclxuXHRcdGZyb206IHJvdGF0aW9uMjQsIHRvOiByb3RhdGlvbjI0LFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdH0pW107XHJcblx0YXJlYXM6ICh7XHJcblx0XHRzaGFwZTogYXJlYVNoYXBlLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0ZnJvbTogcm90YXRpb24yNCwgdG86IHJvdGF0aW9uMjQsXHJcblx0fSlbXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTekxheWVyQ3V0IHtcclxuXHRzaGFwZTogY3V0U2hhcGUgPSAnbGluZSc7XHJcblx0Y29sb3I6IGNvbG9yID0gJ2JsYWNrJztcclxuXHJcblx0ZnJvbTogcm90YXRpb24yNCA9IDA7IHRvOiByb3RhdGlvbjI0ID0gMDtcclxuXHRjb25zdHJ1Y3Rvcihzb3VyY2U6IFBpY2tWYWx1ZXM8U3pMYXllckN1dD4pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgc291cmNlKTtcclxuXHR9XHJcblx0Y2xvbmUoKSB7IHJldHVybiBuZXcgU3pMYXllckN1dCh0aGlzKTsgfVxyXG5cdGdldCBzbWFsbFJhZGl1cygpIHtcclxuXHRcdHJldHVybiAwLjAwMDE7XHJcblx0fVxyXG5cdHBhdGhJbnNpZGUoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0c3dpdGNoICh0aGlzLnNoYXBlKSB7XHJcblx0XHRcdGNhc2UgJ2xpbmUnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMC41LCB0aGlzLmZyb20pO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKHRoaXMuc21hbGxSYWRpdXMsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHR0aHJvdyB0aGlzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdHBhdGhPdXRzaXplKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdHN3aXRjaCAodGhpcy5zaGFwZSkge1xyXG5cdFx0XHRjYXNlICdsaW5lJzoge1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKHRoaXMuc21hbGxSYWRpdXMsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMC41LCB0aGlzLmZyb20pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRkZWZhdWx0OiB7XHJcblx0XHRcdFx0dGhyb3cgdGhpcztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXRIYXNoKCk6IHN0cmluZyB7XHJcblx0XHQvLyBmaXhtZVxyXG5cdFx0cmV0dXJuIGBgO1xyXG5cdH1cclxuXHRzdGF0aWMgZnJvbVNob3J0S2V5KGU6IHN0cmluZyk6IFN6TGF5ZXJDdXQge1xyXG5cdFx0Ly8gZml4bWVcclxuXHRcdHJldHVybiBuZXcgU3pMYXllckN1dCh7fSk7XHJcblx0fVxyXG59XHJcblxyXG50eXBlIFBpY2tWYWx1ZXM8VD4gPSB7XHJcblx0W2sgaW4ga2V5b2YgVCBhcyBUW2tdIGV4dGVuZHMgKCguLi5hcmdzOiBhbnkpID0+IGFueSkgPyBuZXZlciA6IGtdPzogVFtrXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3pMYXllclF1YWQge1xyXG5cdHNoYXBlOiBxdWFkU2hhcGUgPSAnY2lyY2xlJztcclxuXHRjb2xvcjogY29sb3IgPSAnbm9uZSc7XHJcblx0ZnJvbTogcm90YXRpb24yNCA9IDA7IHRvOiByb3RhdGlvbjI0ID0gMDtcclxuXHJcblx0Y29uc3RydWN0b3Ioc291cmNlOiBQaWNrVmFsdWVzPFN6TGF5ZXJRdWFkPikge1xyXG5cdFx0T2JqZWN0LmFzc2lnbih0aGlzLCBzb3VyY2UpO1xyXG5cdFx0aWYgKGNvbmZpZy5kaXNhYmxlUXVhZENvbG9ycykge1xyXG5cdFx0XHR0aGlzLmNvbG9yID0gJ25vbmUnO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y2xvbmUoKSB7IHJldHVybiBuZXcgU3pMYXllclF1YWQodGhpcyk7IH1cclxuXHRvdXRlclBhdGgoY3R4OiBTekNvbnRleHQyRCwgbGF5ZXI6IFN6TGF5ZXIpIHtcclxuXHRcdHN3aXRjaCAodGhpcy5zaGFwZSkge1xyXG5cdFx0XHRjYXNlICdjaXJjbGUnOiB7XHJcblx0XHRcdFx0Y3R4LmFyYygwLCAwLCAxLCB0aGlzLmZyb20sIHRoaXMudG8pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXNlICdzcXVhcmUnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMSwgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHQvLyA2IC0+IE1hdGguU1FSVDIsIDEyIC0+IDFcclxuXHRcdFx0XHRsZXQgYSA9IHRoaXMudG8gLSB0aGlzLmZyb207XHJcblx0XHRcdFx0bGV0IGFyID0gYSAqIChNYXRoLlBJIC8gMjQpO1xyXG5cdFx0XHRcdGxldCBSID0gYSA8PSA2ID8gMSAvIE1hdGguY29zKGFyKSA6IDE7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoUiwgKHRoaXMuZnJvbSArIHRoaXMudG8pIC8gMik7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMSwgdGhpcy50byk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhc2UgJ3N0YXInOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMC42LCB0aGlzLmZyb20pO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKE1hdGguU1FSVDIsICh0aGlzLmZyb20gKyB0aGlzLnRvKSAvIDIpO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDAuNiwgdGhpcy50byk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhc2UgJ3dpbmRtaWxsJzoge1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDEsIHRoaXMuZnJvbSk7XHJcblxyXG5cdFx0XHRcdGxldCBhID0gdGhpcy50byAtIHRoaXMuZnJvbTtcclxuXHRcdFx0XHRsZXQgYXIgPSBhICogKE1hdGguUEkgLyAyNCk7XHJcblx0XHRcdFx0bGV0IFIgPSBhIDw9IDYgPyAxIC8gTWF0aC5jb3MoYXIpIDogMTtcclxuXHRcdFx0XHRjdHgubGluZVRvUihSLCAodGhpcy5mcm9tICsgdGhpcy50bykgLyAyKTtcclxuXHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMC42LCB0aGlzLnRvKTtcclxuXHJcblxyXG5cdFx0XHRcdC8vIGxldCBvcmlnaW5YID0gLXF1YWRyYW50SGFsZlNpemU7XHJcblx0XHRcdFx0Ly8gbGV0IG9yaWdpblkgPSBxdWFkcmFudEhhbGZTaXplIC0gZGltcztcclxuXHRcdFx0XHQvLyBjb25zdCBtb3ZlSW53YXJkcyA9IGRpbXMgKiAwLjQ7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5tb3ZlVG8ob3JpZ2luWCwgb3JpZ2luWSArIG1vdmVJbndhcmRzKTtcclxuXHRcdFx0XHQvLyBjb250ZXh0LmxpbmVUbyhvcmlnaW5YICsgZGltcywgb3JpZ2luWSk7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5saW5lVG8ob3JpZ2luWCArIGRpbXMsIG9yaWdpblkgKyBkaW1zKTtcclxuXHRcdFx0XHQvLyBjb250ZXh0LmxpbmVUbyhvcmlnaW5YLCBvcmlnaW5ZICsgZGltcyk7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHRcdFx0XHQvLyBjb250ZXh0LmZpbGwoKTtcclxuXHRcdFx0XHQvLyBjb250ZXh0LnN0cm9rZSgpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHRjdHguc2F2ZWQoY3R4ID0+IHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnNoYXBlID09ICdjb3ZlcicpIHtcclxuXHRcdFx0XHRcdFx0Y3R4LnNjYWxlKDEgLyBsYXllci5sYXllclNjYWxlKCkpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRTekluZm8ucXVhZC5ieU5hbWVbdGhpcy5zaGFwZV0ucGF0aCEoY3R4LCB0aGlzKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0SGFzaCgpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGAke1N6SW5mby5xdWFkLmJ5TmFtZVt0aGlzLnNoYXBlXS5jb2RlXHJcblx0XHRcdH0ke1N6SW5mby5jb2xvci5ieU5hbWVbdGhpcy5jb2xvcl0uY29kZVxyXG5cdFx0XHR9JHtTekluZm8ublRvQ2hhclt0aGlzLmZyb21dXHJcblx0XHRcdH0ke1N6SW5mby5uVG9DaGFyW3RoaXMudG9dXHJcblx0XHRcdH1gXHJcblx0fVxyXG5cdHN0YXRpYyBmcm9tU2hvcnRLZXkoZTogc3RyaW5nKTogU3pMYXllclF1YWQge1xyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyUXVhZCh7XHJcblx0XHRcdHNoYXBlOiBTekluZm8ucXVhZC5ieUNoYXJbZVswXV0ubmFtZSxcclxuXHRcdFx0Y29sb3I6IFN6SW5mby5jb2xvci5ieUNoYXJbZVsxXV0ubmFtZSxcclxuXHRcdFx0ZnJvbTogU3pJbmZvLmNoYXJUb05bZVsyXV0sXHJcblx0XHRcdHRvOiBTekluZm8uY2hhclRvTltlWzNdXSxcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcbmV4cG9ydCBjbGFzcyBTekxheWVyQXJlYSB7XHJcblx0c2hhcGU6IGFyZWFTaGFwZSA9ICdzZWN0b3InO1xyXG5cdGNvbG9yOiBjb2xvciA9ICdibGFjayc7XHJcblxyXG5cdGZyb206IHJvdGF0aW9uMjQgPSAwOyB0bzogcm90YXRpb24yNCA9IDA7XHJcblx0Y29uc3RydWN0b3Ioc291cmNlOiBQaWNrVmFsdWVzPFN6TGF5ZXJBcmVhPikge1xyXG5cdFx0T2JqZWN0LmFzc2lnbih0aGlzLCBzb3VyY2UpO1xyXG5cdH1cclxuXHRjbG9uZSgpIHsgcmV0dXJuIG5ldyBTekxheWVyQXJlYSh0aGlzKTsgfVxyXG5cdG91dGVyUGF0aChjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRzd2l0Y2ggKHRoaXMuc2hhcGUpIHtcclxuXHRcdFx0Y2FzZSAnd2hvbGUnOiB7XHJcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdGN0eC5hcmMoMCwgMCwgNSwgMCwgMjQpO1xyXG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FzZSAnc2VjdG9yJzoge1xyXG5cdFx0XHRcdGlmICh0aGlzLmZyb20gPT0gMCAmJiB0aGlzLnRvID09IDI0KSB7XHJcblx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0XHRjdHguYXJjKDAsIDAsIDUsIDAsIDI0KTtcclxuXHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRjdHgubW92ZVRvKDAsIDApO1xyXG5cdFx0XHRcdGN0eC5hcmMoMCwgMCwgNSwgdGhpcy5mcm9tLCB0aGlzLnRvKTtcclxuXHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHR0aHJvdyB0aGlzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGNsaXAoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0dGhpcy5vdXRlclBhdGgoY3R4KTtcclxuXHRcdGN0eC5jbGlwKCk7XHJcblx0fVxyXG5cdGZpbGwoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0dGhpcy5vdXRlclBhdGgoY3R4KTtcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBTekluZm8uY29sb3IuYnlOYW1lW3RoaXMuY29sb3JdLnN0eWxlO1xyXG5cdFx0Y3R4LmZpbGwoKTtcclxuXHR9XHJcblx0Z2V0SGFzaCgpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGAke1N6SW5mby5hcmVhLmJ5TmFtZVt0aGlzLnNoYXBlXS5jb2RlXHJcblx0XHRcdH0ke1N6SW5mby5jb2xvci5ieU5hbWVbdGhpcy5jb2xvcl0uY29kZVxyXG5cdFx0XHR9JHtTekluZm8ublRvQ2hhclt0aGlzLmZyb21dXHJcblx0XHRcdH0ke1N6SW5mby5uVG9DaGFyW3RoaXMudG9dXHJcblx0XHRcdH1gXHJcblx0fVxyXG5cdHN0YXRpYyBmcm9tU2hvcnRLZXkoZTogc3RyaW5nKTogU3pMYXllckFyZWEge1xyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyQXJlYSh7XHJcblx0XHRcdHNoYXBlOiBTekluZm8uYXJlYS5ieUNoYXJbZVswXV0ubmFtZSxcclxuXHRcdFx0Y29sb3I6IFN6SW5mby5jb2xvci5ieUNoYXJbZVsxXV0ubmFtZSxcclxuXHRcdFx0ZnJvbTogU3pJbmZvLmNoYXJUb05bZVsyXV0sXHJcblx0XHRcdHRvOiBTekluZm8uY2hhclRvTltlWzNdXSxcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcblxyXG5jb25zdCB0ZXN0VGVtcGxhdGU6IElTekxheWVyID0ge1xyXG5cdGN1dHM6IFtcclxuXHRcdHsgZnJvbTogMTAsIHRvOiAxMCwgc2hhcGU6ICdsaW5lJywgY29sb3I6ICdibHVlJyB9LFxyXG5cdFx0eyBmcm9tOiAxNCwgdG86IDE0LCBzaGFwZTogJ2xpbmUnLCBjb2xvcjogJ2JsdWUnIH0sXHJcblx0XSxcclxuXHRxdWFkczogW1xyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyLCB0bzogNCB9LFxyXG5cdFx0eyBzaGFwZTogJ2NpcmNsZScsIGNvbG9yOiAncGluaycsIGZyb206IDUsIHRvOiAxOSB9LFxyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyMCwgdG86IDIyIH0sXHJcblx0XSxcclxuXHRhcmVhczogW1xyXG5cdFx0eyBzaGFwZTogJ3NlY3RvcicsIGNvbG9yOiAncmVkJywgZnJvbTogMTEsIHRvOiAxMyB9LFxyXG5cdF0sXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFN6TGF5ZXIgaW1wbGVtZW50cyBJU3pMYXllciB7XHJcblx0bGF5ZXJJbmRleCA9IDA7XHJcblx0Y3V0czogU3pMYXllckN1dFtdID0gW107XHJcblx0cXVhZHM6IFN6TGF5ZXJRdWFkW10gPSBbXTtcclxuXHRhcmVhczogU3pMYXllckFyZWFbXSA9IFtdO1xyXG5cclxuXHJcblx0c3RhdGljIGNyZWF0ZVRlc3QoKSB7XHJcblx0XHRsZXQgbCA9IG5ldyBTekxheWVyKHRlc3RUZW1wbGF0ZSk7XHJcblx0XHRsLmFyZWFzLm1hcChlID0+IHtcclxuXHRcdFx0bGV0IHIgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiA4O1xyXG5cdFx0XHRlLmZyb20gKz0gcjtcclxuXHRcdFx0ZS50byArPSByO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmVycm9yKCd0ZXN0IGxheWVyJywgbCk7XHJcblx0XHRyZXR1cm4gbDtcclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZT86IFBpY2tWYWx1ZXM8SVN6TGF5ZXI+LCBsYXllckluZGV4PzogbnVtYmVyKSB7XHJcblx0XHRpZiAoc291cmNlKSB7XHJcblx0XHRcdHRoaXMuY3V0cyA9IChzb3VyY2UuY3V0cyA/PyBbXSkubWFwKGUgPT4gbmV3IFN6TGF5ZXJDdXQoZSkpO1xyXG5cdFx0XHR0aGlzLnF1YWRzID0gKHNvdXJjZS5xdWFkcyA/PyBbXSkubWFwKGUgPT4gbmV3IFN6TGF5ZXJRdWFkKGUpKTtcclxuXHRcdFx0dGhpcy5hcmVhcyA9IChzb3VyY2UuYXJlYXMgPz8gW10pLm1hcChlID0+IG5ldyBTekxheWVyQXJlYShlKSk7XHJcblx0XHRcdGlmICgoc291cmNlIGFzIFN6TGF5ZXIpLmxheWVySW5kZXgpIHtcclxuXHRcdFx0XHR0aGlzLmxheWVySW5kZXggPSAoc291cmNlIGFzIFN6TGF5ZXIpLmxheWVySW5kZXg7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChsYXllckluZGV4ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5sYXllckluZGV4ID0gbGF5ZXJJbmRleDtcclxuXHRcdH1cclxuXHRcdGlmIChjb25maWcuZGlzYWJsZUN1dHMpIHRoaXMuY3V0cyA9IFtdO1xyXG5cdFx0cmV0dXJuIHRoaXMubm9ybWFsaXplKCk7XHJcblx0fVxyXG5cclxuXHRsYXllclNjYWxlKGxheWVySW5kZXg/OiBudW1iZXIpIHtcclxuXHRcdGxheWVySW5kZXggPz89IHRoaXMubGF5ZXJJbmRleDtcclxuXHRcdHJldHVybiAwLjkgLSAwLjIyICogbGF5ZXJJbmRleDtcclxuXHR9XHJcblx0ZHJhd0NlbnRlcmVkTGF5ZXJTY2FsZWQoY3R4OiBTekNvbnRleHQyRCwgbGF5ZXJJbmRleD86IG51bWJlcikge1xyXG5cdFx0Y3R4LnNhdmVkKGN0eCA9PiB7XHJcblx0XHRcdGN0eC5zY2FsZSh0aGlzLmxheWVyU2NhbGUobGF5ZXJJbmRleCkpO1xyXG5cdFx0XHR0aGlzLmRyYXdDZW50ZXJlZE5vcm1hbGl6ZWQoY3R4KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZHJhd0NlbnRlcmVkTm9ybWFsaXplZChjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRjdHguc2F2ZWQoY3R4ID0+IHtcclxuXHRcdFx0dGhpcy5jbGlwU2hhcGVzKGN0eCk7XHJcblx0XHRcdC8vIHRoaXMucXVhZHMuZm9yRWFjaChxID0+IGN0eC5zYXZlZChjdHggPT4gdGhpcy5maWxsUXVhZChxLCBjdHgpKSk7XHJcblxyXG5cdFx0XHR0aGlzLmN1dHMuZm9yRWFjaChjID0+IGN0eC5zYXZlZChjdHggPT4gdGhpcy5zdHJva2VDdXQoYywgY3R4KSkpO1xyXG5cclxuXHRcdFx0dGhpcy5hcmVhcy5mb3JFYWNoKGEgPT4gY3R4LnNhdmVkKGN0eCA9PiB0aGlzLmZpbGxBcmVhKGEsIGN0eCkpKTtcclxuXHRcdH0pO1xyXG5cdFx0Y3R4LnNhdmVkKGN0eCA9PiB0aGlzLmRyYXdRdWFkT3V0bGluZShjdHgsIHRydWUpKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblxyXG5cdHN0cm9rZUN1dChjdXQ6IFN6TGF5ZXJDdXQsIGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdGN0eC5saW5lV2lkdGggPSAwLjA1O1xyXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gY3V0LmNvbG9yO1xyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cclxuXHRcdGlmIChjdXQuc2hhcGUgPT0gJ2xpbmUnKSB7XHJcblx0XHRcdGN0eC5yb3RhdGUoY3V0LmZyb20pO1xyXG5cdFx0XHRjdHgubW92ZVRvKDAsIDApO1xyXG5cdFx0XHRjdHgubGluZVRvKDAsIDEpO1xyXG5cdFx0XHRjdHguc3Ryb2tlKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyB0aGlzO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblx0ZmlsbFF1YWQocXVhZDogU3pMYXllclF1YWQsIGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBTekluZm8uY29sb3IuYnlOYW1lW3F1YWQuY29sb3JdLnN0eWxlO1xyXG5cdFx0aWYgKHF1YWQuY29sb3IgPT0gJ2NvdmVyJykgW1xyXG5cdFx0XHQvLyBjdHguY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1vdXQnXHJcblx0XHRdXHJcblxyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0Y3R4Lm1vdmVUbygwLCAwKTtcclxuXHRcdHF1YWQub3V0ZXJQYXRoKGN0eCwgdGhpcyk7XHJcblx0XHRjdHguZmlsbCgpO1xyXG5cdH1cclxuXHJcblx0ZmlsbEFyZWEoYXJlYTogU3pMYXllckFyZWEsIGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdGN0eC5saW5lV2lkdGggPSAwLjA1O1xyXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gY3R4LmZpbGxTdHlsZSA9IFN6SW5mby5jb2xvci5ieU5hbWVbYXJlYS5jb2xvcl0uc3R5bGU7XHJcblxyXG5cdFx0YXJlYS5jbGlwKGN0eCk7XHJcblx0XHRjdHguZmlsbCgpO1xyXG5cdH1cclxuXHJcblx0ZnVsbFF1YWRQYXRoKGN0eDogU3pDb250ZXh0MkQsIHdpdGhDdXRzPzogYm9vbGVhbikge1xyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnF1YWRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBwcmV2ID0gaSA+IDAgPyB0aGlzLnF1YWRzW2kgLSAxXSA6IHRoaXMucXVhZHMuc2xpY2UoLTEpWzBdO1xyXG5cdFx0XHRsZXQgcXVhZCA9IHRoaXMucXVhZHNbaV07XHJcblx0XHRcdGlmICh3aXRoQ3V0cyB8fCBxdWFkLmZyb20gIT0gcHJldi50byAlIDI0KSBjdHgubGluZVRvKDAsIDApO1xyXG5cdFx0XHRxdWFkLm91dGVyUGF0aChjdHgsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdFx0Y3R4LmNsb3NlUGF0aCgpO1xyXG5cdH1cclxuXHJcblx0ZHJhd1F1YWRPdXRsaW5lKGN0eDogU3pDb250ZXh0MkQsIHdpdGhDdXRzPzogYm9vbGVhbikge1xyXG5cdFx0dGhpcy5mdWxsUXVhZFBhdGgoY3R4LCB3aXRoQ3V0cyk7XHJcblx0XHRjdHgubGluZVdpZHRoID0gMC4wNTtcclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9ICdvcmFuZ2UnO1xyXG5cdFx0Y3R4LnN0cm9rZSgpO1xyXG5cdH1cclxuXHJcblx0Y2xpcFNoYXBlcyhjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHR0aGlzLmZ1bGxRdWFkUGF0aChjdHgpO1xyXG5cdFx0Y3R4LmNsaXAoKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblxyXG5cdGNsb25lKCkge1xyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyKHRoaXMpO1xyXG5cdH1cclxuXHRpc05vcm1hbGl6ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucXVhZHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IG5leHQgPSB0aGlzLnF1YWRzW2ldO1xyXG5cdFx0XHRsZXQgcHJldiA9IHRoaXMucXVhZHNbaSAtIDFdIHx8IHRoaXMucXVhZHNbdGhpcy5xdWFkcy5sZW5ndGggLSAxXTtcclxuXHRcdFx0aWYgKG5leHQuZnJvbSA8IDAgfHwgbmV4dC5mcm9tID49IDI0KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChuZXh0LmZyb20gPj0gbmV4dC50bykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAoaSA9PSAwKSB7XHJcblx0XHRcdFx0aWYgKHByZXYudG8gPiAyNCAmJiBwcmV2LnRvICUgMjQgPiBuZXh0LmZyb20pIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAocHJldi50byA+IG5leHQuZnJvbSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJlYXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IG5leHQgPSB0aGlzLmFyZWFzW2ldO1xyXG5cdFx0XHRsZXQgcHJldiA9IHRoaXMuYXJlYXNbaSAtIDFdIHx8IHRoaXMuYXJlYXNbdGhpcy5hcmVhcy5sZW5ndGggLSAxXTtcclxuXHRcdFx0aWYgKG5leHQuZnJvbSA8IDAgfHwgbmV4dC5mcm9tID49IDI0KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChuZXh0LmZyb20gPj0gbmV4dC50bykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAoaSA9PSAwKSB7XHJcblx0XHRcdFx0aWYgKHByZXYudG8gPiAyNCAmJiBwcmV2LnRvICUgMjQgPiBuZXh0LmZyb20pIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAocHJldi50byA+IG5leHQuZnJvbSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChwcmV2LnRvICUgMjQgPT0gbmV4dC5mcm9tICYmIHByZXYuY29sb3IgPT0gbmV4dC5jb2xvcikge1xyXG5cdFx0XHRcdGlmIChwcmV2ICE9IG5leHQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRpZiAobmV4dC5mcm9tICE9IDApIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IHBsYWNlcyA9IEFycmF5PHF1YWRTaGFwZSB8ICcnPigyNCkuZmlsbCgnJyk7XHJcblx0XHRsZXQgcGFpbnRzID0gQXJyYXk8Y29sb3IgfCAnJz4oMjQpLmZpbGwoJycpO1xyXG5cdFx0Zm9yIChsZXQgcSBvZiB0aGlzLnF1YWRzKSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSBxLmZyb207IGkgPCBxLnRvOyBpKyspIHtcclxuXHRcdFx0XHRpZiAocGxhY2VzW2kgJSAyNF0pIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRwbGFjZXNbaSAlIDI0XSA9IHEuc2hhcGU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGEgb2YgdGhpcy5hcmVhcykge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gYS5mcm9tOyBpIDwgYS50bzsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKCFwbGFjZXNbaSAlIDI0XSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdGlmIChwYWludHNbaSAlIDI0XSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdHBhaW50c1tpICUgMjRdID0gYS5jb2xvcjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gZml4bWU6IGN1dHMgY2hlY2s7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdG5vcm1hbGl6ZSgpOiB0aGlzIHtcclxuXHRcdGlmICh0aGlzLmlzTm9ybWFsaXplZCgpKSByZXR1cm4gdGhpcztcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5xdWFkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgcSA9IHRoaXMucXVhZHNbaV07XHJcblx0XHRcdGlmIChxLmZyb20gPiBxLnRvKSB7IHRoaXMucXVhZHMuc3BsaWNlKGksIDEpOyBpLS07IGNvbnRpbnVlOyB9XHJcblx0XHRcdGlmIChxLmZyb20gPj0gMjQpIHsgcS5mcm9tIC09IDI0OyBxLnRvIC09IDI0OyB9XHJcblx0XHR9XHJcblx0XHR0aGlzLnF1YWRzLnNvcnQoKGEsIGIpID0+IGEuZnJvbSAtIGIuZnJvbSk7XHJcblxyXG5cclxuXHRcdGxldCBwbGFjZXMgPSBBcnJheTxxdWFkU2hhcGUgfCAnJz4oMjQpLmZpbGwoJycpO1xyXG5cdFx0bGV0IHBhaW50cyA9IEFycmF5PGNvbG9yIHwgJyc+KDI0KS5maWxsKCcnKTtcclxuXHRcdGZvciAobGV0IHEgb2YgdGhpcy5xdWFkcykge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gcS5mcm9tOyBpIDwgcS50bzsgaSsrKSB7XHJcblx0XHRcdFx0cGxhY2VzW2kgJSAyNF0gPSBxLnNoYXBlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBhIG9mIHRoaXMuYXJlYXMpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IGEuZnJvbTsgaSA8IGEudG87IGkrKykge1xyXG5cdFx0XHRcdHBhaW50c1tpICUgMjRdID0gYS5jb2xvcjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAyNDsgaSsrKSBpZiAoIXBsYWNlc1tpXSkgcGFpbnRzW2ldID0gJyc7XHJcblxyXG5cclxuXHRcdHRoaXMuYXJlYXMgPSBbXTtcclxuXHRcdGxldCBsYXN0OiBTekxheWVyQXJlYSB8IHVuZGVmaW5lZDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMjQ7IGkrKykge1xyXG5cdFx0XHRpZiAoIXBhaW50c1tpXSkgY29udGludWU7XHJcblx0XHRcdGlmIChsYXN0ICYmIGxhc3QuY29sb3IgPT0gcGFpbnRzW2ldICYmIGxhc3QudG8gPT0gaSkge1xyXG5cdFx0XHRcdGxhc3QudG8rKztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmFyZWFzLnB1c2gobGFzdCA9IG5ldyBTekxheWVyQXJlYSh7XHJcblx0XHRcdFx0XHRjb2xvcjogcGFpbnRzW2ldIGFzIGNvbG9yLCBmcm9tOiBpLCB0bzogaSArIDEsIHNoYXBlOiAnc2VjdG9yJyxcclxuXHRcdFx0XHR9KSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLmFyZWFzLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0bGV0IGxhc3QgPSB0aGlzLmFyZWFzW3RoaXMuYXJlYXMubGVuZ3RoIC0gMV1cclxuXHRcdFx0aWYgKGxhc3QuY29sb3IgPT0gdGhpcy5hcmVhc1swXS5jb2xvciAmJiBsYXN0LnRvICUgMjQgPT0gdGhpcy5hcmVhc1swXS5mcm9tKSB7XHJcblx0XHRcdFx0dGhpcy5hcmVhc1t0aGlzLmFyZWFzLmxlbmd0aCAtIDFdLnRvICs9IHRoaXMuYXJlYXNbMF0udG87XHJcblx0XHRcdFx0dGhpcy5hcmVhcy5zcGxpY2UoMCwgMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIGZpeG1lOiBjdXRzXHJcblx0XHRpZiAoIXRoaXMuaXNOb3JtYWxpemVkKCkpIHtcclxuXHRcdFx0T2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCB7IGxheWVyOiB0aGlzIH0pO1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKCdMYXllciBmYWlsZWQgdG8gbm9ybWFsaXplIHByb3Blcmx5IScsIHRoaXMpO1xyXG5cdFx0XHRpZiAoY29uZmlnLmRlYnVnQmFkTGF5ZXJzKSBkZWJ1Z2dlcjtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0aXNFbXB0eSgpIHtcclxuXHRcdHJldHVybiB0aGlzLnF1YWRzLmxlbmd0aCA9PSAwO1xyXG5cdH1cclxuXHJcblx0Z2V0UXVhZEF0U2VjdG9yKHM6IG51bWJlcikge1xyXG5cdFx0bGV0IHMxID0gKHMgKyAwLjUpICUgMjQsIHMyID0gczEgKyAyNDtcclxuXHRcdHJldHVybiB0aGlzLnF1YWRzLmZpbmQocSA9PlxyXG5cdFx0XHQocS5mcm9tIDwgczEgJiYgcS50byA+IHMxKSB8fCAocS5mcm9tIDwgczIgJiYgcS50byA+IHMyKVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdGNhblN0YWNrV2l0aCh1cHBlcjogU3pMYXllciB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKCF1cHBlcikgcmV0dXJuIHRydWU7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIHtcclxuXHRcdFx0bGV0IHExID0gdGhpcy5nZXRRdWFkQXRTZWN0b3IoaSk7XHJcblx0XHRcdGxldCBxMiA9IHVwcGVyLmdldFF1YWRBdFNlY3RvcihpKTtcclxuXHRcdFx0aWYgKHExICYmIHEyKSByZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0c3RhY2tXaXRoKHVwcGVyOiBTekxheWVyIHwgdW5kZWZpbmVkKTogU3pMYXllciB7XHJcblx0XHRpZiAoIXVwcGVyKSByZXR1cm4gdGhpcy5jbG9uZSgpO1xyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyKHtcclxuXHRcdFx0YXJlYXM6IHRoaXMuYXJlYXMuY29uY2F0KHVwcGVyLmFyZWFzKSxcclxuXHRcdFx0cXVhZHM6IHRoaXMucXVhZHMuY29uY2F0KHVwcGVyLnF1YWRzKSxcclxuXHRcdFx0Y3V0czogdGhpcy5jdXRzLmNvbmNhdCh1cHBlci5jdXRzKSxcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cm90YXRlKHJvdDogcm90YXRpb24yNCkge1xyXG5cdFx0dGhpcy5hcmVhcy5tYXAoZSA9PiB7IGUuZnJvbSArPSByb3Q7IGUudG8gKz0gcm90OyB9KTtcclxuXHRcdHRoaXMuY3V0cy5tYXAoZSA9PiB7IGUuZnJvbSArPSByb3Q7IH0pO1xyXG5cdFx0dGhpcy5xdWFkcy5tYXAoZSA9PiB7IGUuZnJvbSArPSByb3Q7IGUudG8gKz0gcm90OyB9KTtcclxuXHRcdHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpO1xyXG5cdH1cclxuXHJcblxyXG5cdGNsb25lRmlsdGVyZWRCeVF1YWRyYW50cyhpbmNsdWRlUXVhZHJhbnRzOiBudW1iZXJbXSkge1xyXG5cdFx0Y29uc3QgZ29vZCA9IChuOiBudW1iZXIpID0+IGluY2x1ZGVRdWFkcmFudHMuaW5jbHVkZXMoKH5+KG4gLyA2KSkgJSA0KTtcclxuXHJcblx0XHRsZXQgYWxsb3dlZCA9IEFycmF5KDQ4KS5maWxsKDApLm1hcCgoZSwgaSkgPT4gZ29vZChpICsgMC41KSk7XHJcblx0XHRmdW5jdGlvbiBjb252ZXJ0PFQgZXh0ZW5kcyBTekxheWVyQXJlYSB8IFN6TGF5ZXJDdXQgfCBTekxheWVyUXVhZD4ob2xkOiBUKTogVFtdIHtcclxuXHRcdFx0bGV0IGZpbGxlZCA9IEFycmF5KDQ4KS5maWxsKDApLm1hcCgoZSwgaSkgPT4gb2xkLmZyb20gPCBpICsgMC41ICYmIGkgKyAwLjUgPCBvbGQudG8pO1xyXG5cclxuXHRcdFx0bGV0IGxhc3Q6IFQgPSBvbGQuY2xvbmUoKSBhcyBUOyBsYXN0LnRvID0gLTk5OTtcclxuXHRcdFx0bGV0IGxpc3Q6IFRbXSA9IFtdO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCA0ODsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKCFmaWxsZWRbaV0pIGNvbnRpbnVlO1xyXG5cdFx0XHRcdGlmICghYWxsb3dlZFtpXSkgY29udGludWU7XHJcblx0XHRcdFx0aWYgKGxhc3QudG8gIT0gaSkge1xyXG5cdFx0XHRcdFx0bGFzdCA9IG9sZC5jbG9uZSgpIGFzIFQ7XHJcblx0XHRcdFx0XHRsYXN0LmZyb20gPSBpO1xyXG5cdFx0XHRcdFx0bGFzdC50byA9IGkgKyAxO1xyXG5cdFx0XHRcdFx0bGlzdC5wdXNoKGxhc3QpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsYXN0LnRvKys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBsaXN0O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyKHtcclxuXHRcdFx0YXJlYXM6IHRoaXMuYXJlYXMuZmxhdE1hcChjb252ZXJ0KSxcclxuXHRcdFx0cXVhZHM6IHRoaXMucXVhZHMuZmxhdE1hcChjb252ZXJ0KSxcclxuXHRcdFx0Y3V0czogdGhpcy5jdXRzLmZsYXRNYXAoY29udmVydCksXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGNsb25lQXNDb3ZlcigpIHtcclxuXHRcdGZ1bmN0aW9uIGNvbnZlcnQocXVhZDogU3pMYXllclF1YWQpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBTekxheWVyUXVhZCh7XHJcblx0XHRcdFx0Y29sb3I6ICdjb3ZlcicsXHJcblx0XHRcdFx0c2hhcGU6ICdjb3ZlcicsXHJcblx0XHRcdFx0ZnJvbTogcXVhZC5mcm9tLCB0bzogcXVhZC50byxcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRxdWFkczogdGhpcy5xdWFkcy5mbGF0TWFwKGNvbnZlcnQpLFxyXG5cdFx0fSkucGFpbnQoJ2NvdmVyJykubm9ybWFsaXplKCk7XHJcblx0fVxyXG5cdHJlbW92ZUNvdmVyKCkge1xyXG5cdFx0dGhpcy5xdWFkcyA9IHRoaXMucXVhZHMuZmlsdGVyKGUgPT4gZS5zaGFwZSAhPSAnY292ZXInKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRmaWx0ZXJQYWludChwYWludDogKGNvbG9yIHwgbnVsbClbXSk6IChjb2xvciB8IG51bGwpW10ge1xyXG5cdFx0cmV0dXJuIHBhaW50Lm1hcCgoZSwgaSkgPT4ge1xyXG5cdFx0XHRsZXQgcXVhZCA9IHRoaXMuZ2V0UXVhZEF0U2VjdG9yKGkpO1xyXG5cdFx0XHRyZXR1cm4gcXVhZCAmJiBxdWFkLnNoYXBlID09ICdjb3ZlcicgPyBudWxsIDogZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRwYWludChwYWludDogKGNvbG9yIHwgbnVsbClbXSB8IGNvbG9yKSB7XHJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkocGFpbnQpKSBwYWludCA9IEFycmF5PGNvbG9yIHwgbnVsbD4oMjQpLmZpbGwocGFpbnQpO1xyXG5cdFx0cGFpbnQubWFwKChjb2xvciwgaSkgPT4ge1xyXG5cdFx0XHRpZiAoY29sb3IpIHtcclxuXHRcdFx0XHR0aGlzLmFyZWFzLnB1c2gobmV3IFN6TGF5ZXJBcmVhKHtcclxuXHRcdFx0XHRcdGNvbG9yLFxyXG5cdFx0XHRcdFx0ZnJvbTogaSwgdG86IGkgKyAxLFxyXG5cdFx0XHRcdFx0c2hhcGU6ICdzZWN0b3InLFxyXG5cdFx0XHRcdH0pKVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpOztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBmcm9tU2hhcGV6SGFzaChoYXNoOiBzdHJpbmcpOiBTekxheWVyO1xyXG5cdHN0YXRpYyBmcm9tU2hhcGV6SGFzaChoYXNoOiBzdHJpbmcsIGVycjogYm9vbGVhbik6IFN6TGF5ZXIgfCBudWxsO1xyXG5cdHN0YXRpYyBmcm9tU2hhcGV6SGFzaChoYXNoOiBzdHJpbmcsIGVyciA9IHRydWUpOiBTekxheWVyIHwgbnVsbCB7XHJcblx0XHRpZiAoaGFzaFswXSA9PSAnNicpIGhhc2ggPSBoYXNoLnNsaWNlKDEpO1xyXG5cdFx0aWYgKGhhc2gubGVuZ3RoICE9IDggJiYgaGFzaC5sZW5ndGggIT0gMTIpIHtcclxuXHRcdFx0aWYgKCFlcnIpIHJldHVybiBudWxsO1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2hhcGUgaGFzaDogJHtoYXNofWApO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGFuZ2xlID0gMjQgLyAoaGFzaC5sZW5ndGggLyAyKTtcclxuXHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdGFyZWFzOiBoYXNoLm1hdGNoKC8uLi9nKSEubWFwKChzLCBpKSA9PiB7XHJcblx0XHRcdFx0aWYgKHNbMF0gPT0gJy0nKSByZXR1cm4gbnVsbCBhcyBhbnkgYXMgU3pMYXllckFyZWE7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBTekxheWVyQXJlYSh7XHJcblx0XHRcdFx0XHRzaGFwZTogJ3NlY3RvcicsXHJcblx0XHRcdFx0XHRjb2xvcjogU3pJbmZvLmNvbG9yLmJ5Q2hhcltzWzFdXS5uYW1lLFxyXG5cdFx0XHRcdFx0ZnJvbTogaSAqIGFuZ2xlLFxyXG5cdFx0XHRcdFx0dG86IChpICsgMSkgKiBhbmdsZSxcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSkuZmlsdGVyKGUgPT4gZSksXHJcblx0XHRcdHF1YWRzOiBoYXNoLm1hdGNoKC8uLi9nKSEubWFwKChzLCBpKSA9PiB7XHJcblx0XHRcdFx0aWYgKHNbMF0gPT0gJy0nKSByZXR1cm4gbnVsbCBhcyBhbnkgYXMgU3pMYXllclF1YWQ7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBTekxheWVyUXVhZCh7XHJcblx0XHRcdFx0XHRzaGFwZTogU3pJbmZvLnF1YWQuYnlDaGFyW3NbMF1dLm5hbWUsXHJcblx0XHRcdFx0XHRjb2xvcjogU3pJbmZvLmNvbG9yLmJ5Q2hhcltzWzFdXS5uYW1lLFxyXG5cdFx0XHRcdFx0ZnJvbTogaSAqIGFuZ2xlLFxyXG5cdFx0XHRcdFx0dG86IChpICsgMSkgKiBhbmdsZSxcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSkuZmlsdGVyKGUgPT4gZSksXHJcblx0XHRcdGN1dHM6IFtdLFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0Z2V0SGFzaCgpOiBzdHJpbmcge1xyXG5cdFx0Zm9yIChsZXQgcW4gb2YgWzQsIDZdKSB7XHJcblx0XHRcdGxldCBxdyA9IDI0IC8gcW47XHJcblx0XHRcdGlmICghdGhpcy5xdWFkcy5ldmVyeShlID0+IGUuZnJvbSAlIHF3ID09IDAgJiYgZS50byAtIGUuZnJvbSA9PSBxdykpIGNvbnRpbnVlO1xyXG5cdFx0XHRpZiAoIXRoaXMuYXJlYXMuZXZlcnkoZSA9PiBlLmZyb20gJSBxdyA9PSAwICYmIGUudG8gJSBxdyA9PSAwKSkgY29udGludWU7XHJcblxyXG5cdFx0XHRsZXQgZGF0YSA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHFuIH0sIChfLCBpKSA9PiAoeyBzaGFwZTogJy0nLCBjb2xvcjogJy0nIH0pKTtcclxuXHRcdFx0Zm9yIChsZXQgcSBvZiB0aGlzLnF1YWRzKSB7XHJcblx0XHRcdFx0ZGF0YVtxLmZyb20gLyBxd10uc2hhcGUgPSBTekluZm8ucXVhZC5ieU5hbWVbcS5zaGFwZV0uY29kZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCBhIG9mIHRoaXMuYXJlYXMpIHtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gYS5mcm9tIC8gcXc7IGkgPCBhLnRvIC8gcXc7IGkrKykge1xyXG5cdFx0XHRcdFx0ZGF0YVtpICUgcW5dLmNvbG9yID0gU3pJbmZvLmNvbG9yLmJ5TmFtZVthLmNvbG9yXS5jb2RlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZGF0YS5tYXAoKHsgc2hhcGUsIGNvbG9yIH0pID0+IHNoYXBlID09ICctJyA/ICctLScgOiBzaGFwZSArIGNvbG9yKS5qb2luKCcnKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gYGwhenxxISR7dGhpcy5xdWFkcy5tYXAoZSA9PiBlLmdldEhhc2goKSkuam9pbignLCcpXHJcblx0XHRcdH18YSEke3RoaXMuYXJlYXMubWFwKGUgPT4gZS5nZXRIYXNoKCkpLmpvaW4oJywnKVxyXG5cdFx0XHR9fGMhJHt0aGlzLmN1dHMubWFwKGUgPT4gZS5nZXRIYXNoKCkpLmpvaW4oJywnKVxyXG5cdFx0XHR9YDtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBmcm9tU2hvcnRLZXkoa2V5OiBzdHJpbmcpOiBhbnkge1xyXG5cdFx0aWYgKGtleS5zdGFydHNXaXRoKCdzeiEnKSkgeyBrZXkgPSBrZXkuc2xpY2UoMyk7IH1cclxuXHRcdGlmIChrZXkuc3RhcnRzV2l0aCgnbCF6fCcpKSB7XHJcblx0XHRcdGxldCBsYXllciA9IG5ldyBTekxheWVyKCk7XHJcblx0XHRcdGZvciAobGV0IHBhcnQgb2Yga2V5LnNwbGl0KCd8JykpIHtcclxuXHRcdFx0XHRpZiAocGFydC5zdGFydHNXaXRoKCdxIScpKSB7XHJcblx0XHRcdFx0XHRsZXQgc3RycyA9IHBhcnQuc2xpY2UoJ3EhJy5sZW5ndGgpLnNwbGl0KCcsJyk7XHJcblx0XHRcdFx0XHRsYXllci5xdWFkcyA9IHN0cnMubWFwKGUgPT4gU3pMYXllclF1YWQuZnJvbVNob3J0S2V5KGUpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHBhcnQuc3RhcnRzV2l0aCgnYSEnKSkge1xyXG5cdFx0XHRcdFx0bGV0IHN0cnMgPSBwYXJ0LnNsaWNlKCdhIScubGVuZ3RoKS5zcGxpdCgnLCcpO1xyXG5cdFx0XHRcdFx0bGF5ZXIuYXJlYXMgPSBzdHJzLm1hcChlID0+IFN6TGF5ZXJBcmVhLmZyb21TaG9ydEtleShlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChwYXJ0LnN0YXJ0c1dpdGgoJ2MhJykpIHtcclxuXHRcdFx0XHRcdGxldCBzdHJzID0gcGFydC5zbGljZSgnYyEnLmxlbmd0aCkuc3BsaXQoJywnKTtcclxuXHRcdFx0XHRcdGxheWVyLmN1dHMgPSBzdHJzLm1hcChlID0+IFN6TGF5ZXJDdXQuZnJvbVNob3J0S2V5KGUpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGxheWVyO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIFN6TGF5ZXIuZnJvbVNoYXBlekhhc2goa2V5KTtcclxuXHR9XHJcbn1cclxuIl19