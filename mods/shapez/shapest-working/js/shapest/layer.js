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
        Object.assign(color_1.byName, color_1.byCombo);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2hhcGVzdC9sYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLE1BQU0sR0FBRztJQUNkLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLGlCQUFpQixFQUFFLElBQUk7SUFDdkIsY0FBYyxFQUFFLElBQUk7Q0FDcEIsQ0FBQTtBQXNCRCxNQUFNLEtBQVcsTUFBTSxDQXFmdEI7QUFyZkQsV0FBaUIsTUFBTTtJQUN0QixJQUFpQixLQUFLLENBcURyQjtJQXJERCxXQUFpQixPQUFLO1FBQ3JCLE1BQU0sa0JBQWtCLEdBQUc7WUFDMUIsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRO1lBQ3pCLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTTtZQUM1QixNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU07U0FDZixDQUFDO1FBQ1gsTUFBTSxpQkFBaUIsR0FBRztZQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU87U0FDZixDQUFDO1FBSUUsWUFBSSxHQUF5QjtZQUN6QyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDdEQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQzVELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUM1RCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDMUQsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFB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SSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUMxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzlDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDekQ7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUMxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzlDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdkQ7YUFDRDtZQUNELE9BQU8sS0FBSyxDQUFDO1NBQ2I7UUFDRCxPQUFPLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEMsQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3pEZWZpbml0aW9uIH0gZnJvbSBcIi4vZGVmaW5pdGlvbi5qc1wiO1xyXG5pbXBvcnQgeyBjaGFyLCByb3RhdGlvbjI0LCBzdHlsZVN0cmluZywgU3pDb250ZXh0MkQgfSBmcm9tIFwiLi9TekNvbnRleHQyRC5qc1wiO1xyXG5cclxuY29uc3QgY29uZmlnID0ge1xyXG5cdGRpc2FibGVDdXRzOiB0cnVlLFxyXG5cdGRpc2FibGVRdWFkQ29sb3JzOiB0cnVlLFxyXG5cdGRlYnVnQmFkTGF5ZXJzOiB0cnVlLFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBjdXRTaGFwZSA9IChcclxuXHR8ICdsaW5lJ1xyXG4pO1xyXG5leHBvcnQgdHlwZSBxdWFkU2hhcGUgPSAoXHJcblx0fCAnY2lyY2xlJyB8ICdzcXVhcmUnIHwgJ3N0YXInIHwgJ3dpbmRtaWxsJ1xyXG5cdHwgJ2NvdmVyJ1xyXG4pO1xyXG5leHBvcnQgdHlwZSBhcmVhU2hhcGUgPSAoXHJcblx0fCAnd2hvbGUnIHwgJ3NlY3RvcidcclxuKTtcclxuZXhwb3J0IHR5cGUgY29sb3IgPVxyXG5cdHwgJ3JlZCcgfCAnb3JhbmdlJyB8ICd5ZWxsb3cnXHJcblx0fCAnbGF3bmdyZWVuJyB8ICdncmVlbicgfCAnY3lhbidcclxuXHR8ICdibHVlJyB8ICdwdXJwbGUnIHwgJ3BpbmsnXHJcblx0fCAnYmxhY2snIHwgJ2dyZXknIHwgJ3doaXRlJ1xyXG5cdHwgJ2NvdmVyJyB8ICdub25lJztcclxuXHJcbmV4cG9ydCB0eXBlIGNvbG9yQ2hhciA9ICdyJyB8ICdnJyB8ICdiJyB8ICctJztcclxuZXhwb3J0IHR5cGUgY29sb3JTdHJpbmcgPSBgJHtjb2xvckNoYXJ9JHtjb2xvckNoYXJ9JHtjb2xvckNoYXJ9YDtcclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgU3pJbmZvIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIGNvbG9yIHtcclxuXHRcdGNvbnN0IGNvbG9yV2hlZWxOYW1lTGlzdCA9IFtcclxuXHRcdFx0J3JlZCcsICdvcmFuZ2UnLCAneWVsbG93JyxcclxuXHRcdFx0J2xhd25ncmVlbicsICdncmVlbicsICdjeWFuJyxcclxuXHRcdFx0J2JsdWUnLCAncHVycGxlJywgJ3BpbmsnLFxyXG5cdFx0XSBhcyBjb25zdDtcclxuXHRcdGNvbnN0IGNvbG9yR3JleU5hbWVMaXN0ID0gW1xyXG5cdFx0XHQnYmxhY2snLCAnZ3JleScsICd3aGl0ZScsXHJcblx0XHRdIGFzIGNvbnN0O1xyXG5cclxuXHRcdGV4cG9ydCB0eXBlIGNvbG9ySW5mbyA9IHsgbmFtZTogY29sb3IsIHN0eWxlOiBzdHlsZVN0cmluZywgY29kZTogY2hhciwgY29tYm8/OiBjb2xvclN0cmluZyB9OyAvLyBiYmdncnJcclxuXHJcblx0XHRleHBvcnQgY29uc3QgbGlzdDogcmVhZG9ubHkgY29sb3JJbmZvW10gPSBbXHJcblx0XHRcdHsgbmFtZTogJ3JlZCcsIHN0eWxlOiAncmVkJywgY29kZTogJ3InLCBjb21ibzogJ3JycicgfSxcclxuXHRcdFx0eyBuYW1lOiAnb3JhbmdlJywgc3R5bGU6ICdvcmFuZ2UnLCBjb2RlOiAnbycsIGNvbWJvOiAnZ3JyJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICd5ZWxsb3cnLCBzdHlsZTogJ3llbGxvdycsIGNvZGU6ICd5JywgY29tYm86ICdnZ3InIH0sXHJcblx0XHRcdHsgbmFtZTogJ2dyZWVuJywgc3R5bGU6ICdncmVlbicsIGNvZGU6ICdnJywgY29tYm86ICdnZ2cnIH0sXHJcblx0XHRcdHsgbmFtZTogJ2xhd25ncmVlbicsIHN0eWxlOiAnbGF3bmdyZWVuJywgY29kZTogJ2wnLCBjb21ibzogJ2JnZycgfSxcclxuXHRcdFx0eyBuYW1lOiAnY3lhbicsIHN0eWxlOiAnY3lhbicsIGNvZGU6ICdjJywgY29tYm86ICdiYmcnIH0sXHJcblx0XHRcdHsgbmFtZTogJ2JsdWUnLCBzdHlsZTogJ2JsdWUnLCBjb2RlOiAnYicsIGNvbWJvOiAnYmJiJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdwdXJwbGUnLCBzdHlsZTogJ3B1cnBsZScsIGNvZGU6ICd2JywgY29tYm86ICdiYnInIH0sXHJcblx0XHRcdHsgbmFtZTogJ3BpbmsnLCBzdHlsZTogJ3BpbmsnLCBjb2RlOiAncCcsIGNvbWJvOiAnYnJyJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdibGFjaycsIHN0eWxlOiAnYmxhY2snLCBjb2RlOiAnaycgfSxcclxuXHRcdFx0eyBuYW1lOiAnZ3JleScsIHN0eWxlOiAnZ3JleScsIGNvZGU6ICd1JyB9LFxyXG5cdFx0XHR7IG5hbWU6ICd3aGl0ZScsIHN0eWxlOiAnd2hpdGUnLCBjb2RlOiAndycgfSxcclxuXHRcdFx0eyBuYW1lOiAnY292ZXInLCBzdHlsZTogJ3N6LWNvdmVyJywgY29kZTogJ2onIH0sXHJcblx0XHRcdHsgbmFtZTogJ25vbmUnLCBzdHlsZTogJ25vbmUnLCBjb2RlOiAnLScgfSxcclxuXHRcdF0gYXMgY29uc3Q7XHJcblx0XHRPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgbGlzdCB9KTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgY29sb3JMaXN0ID0gbGlzdC5tYXAoZSA9PiBlLm5hbWUpO1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBieU5hbWU6IFJlY29yZDxjb2xvciwgY29sb3JJbmZvPiA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0Lm1hcChlID0+IFtlLm5hbWUsIGVdIGFzIGNvbnN0KSk7XHJcblx0XHRleHBvcnQgY29uc3QgYnlDaGFyOiBSZWNvcmQ8Y2hhciwgY29sb3JJbmZvPiA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0Lm1hcChlID0+IFtlLmNvZGUsIGVdIGFzIGNvbnN0KSk7XHJcblx0XHRleHBvcnQgY29uc3QgYnlDb21ibzogUmVjb3JkPGNvbG9yU3RyaW5nLCBjb2xvckluZm8+ID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QuZmlsdGVyKGUgPT4gZS5jb21ibykubWFwKGUgPT4gW2UuY29tYm8hLCBlXSkpO1xyXG5cclxuXHRcdE9iamVjdC5hc3NpZ24oYnlOYW1lLCBieUNvbWJvKTtcclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZXhhbXBsZUxheWVyKGNvbG9yOiBjb2xvcikge1xyXG5cdFx0XHRsZXQgaSA9IDA7XHJcblx0XHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdFx0cXVhZHM6IFtcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdjaXJjbGUnLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvciB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZTogJ3NxdWFyZScsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnY2lyY2xlJywgZnJvbTogaSwgdG86IGkgKz0gNiwgY29sb3IgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdzcXVhcmUnLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvciB9LFxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0YXJlYXM6IFtcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdzZWN0b3InLCBmcm9tOiAwLCB0bzogMjQsIGNvbG9yIH0sXHJcblx0XHRcdFx0XVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgcXVhZCB7XHJcblx0XHRleHBvcnQgdHlwZSBxdWFkSW5mbyA9IHtcclxuXHRcdFx0bmFtZTogcXVhZFNoYXBlLCBjb2RlOiBjaGFyLCBjb21ibz86IHN0cmluZywgc3Bhd24/OiBzdHJpbmcsXHJcblx0XHRcdHBhdGg/OiAoY3R4OiBTekNvbnRleHQyRCwgcXVhZDogU3pMYXllclF1YWQpID0+IHZvaWQsXHJcblx0XHR9O1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBsaXN0OiBxdWFkSW5mb1tdID0gW1xyXG5cdFx0XHR7IG5hbWU6ICdjaXJjbGUnLCBjb2RlOiAnQycsIGNvbWJvOiAnQycsIHNwYXduOiAnc3ohbCF6fHEhQy0wb3xhIXN1MG98YyEnIH0sXHJcblx0XHRcdHsgbmFtZTogJ3NxdWFyZScsIGNvZGU6ICdSJywgY29tYm86ICdSJywgc3Bhd246ICdzeiFsIXp8cSFSLTBjLFItY298YSFzdTBvfGMhJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdzdGFyJywgY29kZTogJ1MnLCBjb21ibzogJ1MnLCBzcGF3bjogJ3N6IWwhenxxIVMtNGMsUy1jayxTLWtzfGEhc3Uwb3xjIScgfSxcclxuXHRcdFx0eyBuYW1lOiAnd2luZG1pbGwnLCBjb2RlOiAnVycsIGNvbWJvOiAnVycsIHNwYXduOiAnc3ohbCF6fHEhUy00YyxTLWNrLFMta3N8YSFzdTBvfGMhJyB9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ2NvdmVyJywgY29kZTogJ0onLFxyXG5cdFx0XHRcdHBhdGgoY3R4LCB7IGZyb20sIHRvIH0pIHtcclxuXHRcdFx0XHRcdGN0eC5hcmMoMCwgMCwgMS4xNSwgZnJvbSwgdG8pO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRuYW1lOiAnY2xvdmVyJyBhcyBhbnksIGNvZGU6ICdMJyxcclxuXHRcdFx0XHRwYXRoKGN0eCwgeyBmcm9tLCB0byB9KSB7XHJcblx0XHRcdFx0XHRjb25zdCByID0gMC41LCBSID0gMTtcclxuXHRcdFx0XHRcdGN0eC5yb3RhdGUoZnJvbSk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gZXhwb3J0IGNvbnN0IGV4dHJhU2hhcGVzOiBSZWNvcmQ8c3RyaW5nLCAoY3R4OiBTekNvbnRleHQyRCwgcXVhZDogU3pMYXllclF1YWQpID0+IHZvaWQ+ID0ge1xyXG5cdFx0XHRcdFx0Ly8gXHRjbG92ZXIoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHRcdFx0Ly8gXHRcdC8vIGJlZ2luKHsgc2l6ZTogMS4zLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0XHRcdFx0Y29uc3QgaW5uZXIgPSAwLjU7XHJcblx0XHRcdFx0XHRjb25zdCBpbm5lcl9jZW50ZXIgPSAwLjQ1O1xyXG5cdFx0XHRcdFx0Y3R4LmN0eC5saW5lVG8oMCwgaW5uZXIpO1xyXG5cdFx0XHRcdFx0Y3R4LmN0eC5iZXppZXJDdXJ2ZVRvKDAsIDEsIGlubmVyLCAxLCBpbm5lcl9jZW50ZXIsIGlubmVyX2NlbnRlcik7XHJcblx0XHRcdFx0XHRjdHguY3R4LmJlemllckN1cnZlVG8oMSwgaW5uZXIsIDEsIDAsIGlubmVyLCAwKTtcclxuXHRcdFx0XHRcdC8vIFx0fSxcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRuYW1lOiAnJywgY29kZTogJycsXHJcblx0XHRcdFx0Ly8gXHRzdGFyOChjdHg6IFN6Q29udGV4dDJELCB7IGZyb20sIHRvIH06IFN6TGF5ZXJRdWFkKSB7XHJcblx0XHRcdFx0Ly8gXHRcdGNvbnN0IHIgPSAxLjIyIC8gMiwgUiA9IDEuMjIsIGQgPSAobjogbnVtYmVyKSA9PiBmcm9tICogKDEgLSBuKSArIHRvICogbjtcclxuXHRcdFx0XHQvLyBcdFx0Y3R4XHJcblx0XHRcdFx0Ly8gXHRcdFx0LmxpbmVUb1IociwgZCgwKSlcclxuXHRcdFx0XHQvLyBcdFx0XHQubGluZVRvUihSLCBkKDAuMjUpKVxyXG5cdFx0XHRcdC8vIFx0XHRcdC5saW5lVG9SKHIsIGQoMC41KSlcclxuXHRcdFx0XHQvLyBcdFx0XHQubGluZVRvUihSLCBkKDAuNzUpKVxyXG5cdFx0XHRcdC8vIFx0XHRcdC5saW5lVG9SKHIsIGQoMSkpXHJcblx0XHRcdFx0Ly8gXHR9LFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0bmFtZTogJycsIGNvZGU6ICcnLFxyXG5cdFx0XHRcdC8vIFx0cmhvbWJ1cyhjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdFx0Ly8gXHR9LFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0bmFtZTogJycsIGNvZGU6ICcnLFxyXG5cdFx0XHRcdC8vIFx0cGx1cyhjdHg6IFN6Q29udGV4dDJELCB7IGZyb20sIHRvIH06IFN6TGF5ZXJRdWFkKSB7XHJcblx0XHRcdFx0Ly8gXHRcdGNvbnN0IHIgPSAwLjQsIFIgPSAxLjAsIGQgPSAobjogbnVtYmVyKSA9PiBmcm9tICogKDEgLSBuKSArIHRvICogbjtcclxuXHRcdFx0XHQvLyBcdFx0Y29uc3QgcnIgPSAocjE6IG51bWJlciwgcjI6IG51bWJlcikgPT4gKHIxICogcjEgKyByMiAqIHIyKSAqKiAwLjVcclxuXHRcdFx0XHQvLyBcdFx0Y29uc3QgYXQgPSAoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IE1hdGguYXRhbjIoYiwgYSkgLyBNYXRoLlBJICogMjtcclxuXHRcdFx0XHQvLyBcdFx0Y29uc3QgdG9yID0gKHI6IG51bWJlciwgUjogbnVtYmVyKSA9PiBbcnIociwgUiksIGQoYXQociwgUikpXSBhcyBjb25zdDtcclxuXHRcdFx0XHQvLyBcdFx0Y3R4XHJcblx0XHRcdFx0Ly8gXHRcdFx0LmxpbmVUb1IoLi4udG9yKFIsIDApKVxyXG5cdFx0XHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcihSLCByKSlcclxuXHRcdFx0XHQvLyBcdFx0XHQubGluZVRvUiguLi50b3IociwgcikpXHJcblx0XHRcdFx0Ly8gXHRcdFx0LmxpbmVUb1IoLi4udG9yKHIsIFIpKVxyXG5cdFx0XHRcdC8vIFx0XHRcdC5saW5lVG9SKC4uLnRvcigwLCBSKSlcclxuXHRcdFx0XHQvLyBcdH0sXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRuYW1lOiAnJywgY29kZTogJycsXHJcblx0XHRcdFx0Ly8gXHRzYXcoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHRcdC8vIFx0fSxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdG5hbWU6ICcnLCBjb2RlOiAnJyxcclxuXHRcdFx0XHQvLyBcdHN1bihjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdFx0Ly8gXHR9LFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0bmFtZTogJycsIGNvZGU6ICcnLFxyXG5cdFx0XHRcdC8vIFx0bGVhZihjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdFx0Ly8gXHR9LFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0bmFtZTogJycsIGNvZGU6ICcnLFxyXG5cdFx0XHRcdC8vIFx0ZGlhbW9uZChjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdFx0Ly8gXHR9LFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0bmFtZTogJycsIGNvZGU6ICcnLFxyXG5cdFx0XHRcdC8vIFx0bWlsbChjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdFx0Ly8gXHR9LFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0bmFtZTogJycsIGNvZGU6ICcnLFxyXG5cdFx0XHRcdC8vIFx0aGFsZmxlYWYoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHRcdC8vIFx0fSxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdG5hbWU6ICcnLCBjb2RlOiAnJyxcclxuXHRcdFx0XHQvLyBcdHlpbnlhbmcoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHRcdC8vIFx0fSxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdG5hbWU6ICcnLCBjb2RlOiAnJyxcclxuXHRcdFx0XHQvLyBcdG9jdGFnb24oY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHRcdC8vIFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdF0gYXMgcXVhZEluZm9bXTtcclxuXHRcdHdoaWxlIChsaXN0LmZpbmQoZSA9PiAhZS5uYW1lKSkge1xyXG5cdFx0XHRsaXN0LnNwbGljZShsaXN0LmZpbmRJbmRleChlID0+ICFlLm5hbWUpLCAxKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgY29uc3QgbmFtZWQ0ID0ge1xyXG5cclxuXHRcdFx0Y2lyY2xlU3Bhd246ICdDdUN1Q3VDdScsXHJcblx0XHRcdHNxdWFyZVNwYXduOiAnUnVSdVJ1UnUnLFxyXG5cdFx0XHRzdGFyU3Bhd246ICdTdVN1U3VTdScsXHJcblx0XHRcdHdpbmRtaWxsU3Bhd246ICdXdVd1V3VXdScsXHJcblxyXG5cdFx0XHRjaXJjbGVCb3R0b206ICctLUN1Q3UtLScsXHJcblxyXG5cdFx0XHRjaXJjbGU6IFwiQ3VDdUN1Q3VcIixcclxuXHRcdFx0Y2lyY2xlSGFsZjogXCItLS0tQ3VDdVwiLFxyXG5cdFx0XHRyZWN0OiBcIlJ1UnVSdVJ1XCIsXHJcblx0XHRcdHJlY3RIYWxmOiBcIlJ1UnUtLS0tXCIsXHJcblx0XHRcdGNpcmNsZUhhbGZSb3RhdGVkOiBcIkN1LS0tLUN1XCIsXHJcblx0XHRcdGNpcmNsZVF1YWQ6IFwiQ3UtLS0tLS1cIixcclxuXHRcdFx0Y2lyY2xlUmVkOiBcIkNyQ3JDckNyXCIsXHJcblx0XHRcdHJlY3RIYWxmQmx1ZTogXCJSYlJiLS0tLVwiLFxyXG5cdFx0XHRjaXJjbGVQdXJwbGU6IFwiQ3BDcENwQ3BcIixcclxuXHRcdFx0c3RhckN5YW46IFwiU2NTY1NjU2NcIixcclxuXHRcdFx0ZmlzaDogXCJDZ1NjU2NDZ1wiLFxyXG5cdFx0XHRibHVlcHJpbnQ6IFwiQ2JDYkNiUmI6Q3dDd0N3Q3dcIixcclxuXHRcdFx0cmVjdENpcmNsZTogXCJScFJwUnBScDpDd0N3Q3dDd1wiLFxyXG5cdFx0XHR3YXRlcm1lbG9uOiBcIi0tQ2ctLS0tOi0tQ3ItLS0tXCIsXHJcblx0XHRcdHN0YXJDaXJjbGU6IFwiU3JTclNyU3I6Q3lDeUN5Q3lcIixcclxuXHRcdFx0c3RhckNpcmNsZVN0YXI6IFwiU3JTclNyU3I6Q3lDeUN5Q3k6U3dTd1N3U3dcIixcclxuXHRcdFx0ZmFuOiBcIkNiUmJSYkNiOkN3Q3dDd0N3OldiV2JXYldiXCIsXHJcblx0XHRcdG1vbnN0ZXI6IFwiU2ctLS0tU2c6Q2dDZ0NnQ2c6LS1DeUN5LS1cIixcclxuXHRcdFx0Ym91cXVldDogXCJDcFJwQ3AtLTpTd1N3U3dTd1wiLFxyXG5cdFx0XHRsb2dvOiBcIlJ1Q3ctLUN3Oi0tLS1SdS0tXCIsXHJcblx0XHRcdHRhcmdldDogXCJDckN3Q3JDdzpDd0NyQ3dDcjpDckN3Q3JDdzpDd0NyQ3dDclwiLFxyXG5cdFx0XHRzcGVlZG9tZXRlcjogXCJDZy0tLS1DcjpDdy0tLS1DdzpTeS0tLS0tLTpDeS0tLS1DeVwiLFxyXG5cdFx0XHQvLyBzcGlrZWRCYWxsOiBcIkNjU3lDY1N5OlN5Q2NTeUNjOkNjU3lDY1N5OlN5Q2NTeUNjXCIsXHJcblx0XHRcdHNwaWtlZEJhbGw6IFwiQ2NTeUNjU3k6U3lDY1N5Q2M6Q2NTeUNjU3lcIixcclxuXHRcdFx0Y29tcGFzczogXCJDY1JjQ2NSYzpSd0N3UndDdzpTci0tU3ctLTpDeUN5Q3lDeVwiLFxyXG5cdFx0XHRwbGFudDogXCJSZy0tUmctLTpDd1J3Q3dSdzotLVJnLS1SZ1wiLFxyXG5cdFx0XHRyb2NrZXQ6IFwiQ2JDdUNiQ3U6U3ItLS0tLS06LS1DclNyQ3I6Q3dDd0N3Q3dcIixcclxuXHJcblx0XHRcdG1pbGw6IFwiQ3dDd0N3Q3c6V2JXYldiV2JcIixcclxuXHRcdFx0c3RhcjogXCJTdVN1U3VTdVwiLFxyXG5cdFx0XHRjaXJjbGVTdGFyOiBcIkN3Q3JDd0NyOlNnU2dTZ1NnXCIsXHJcblx0XHRcdGNsb3duOiBcIldyUmdXclJnOkN3Q3JDd0NyOlNnU2dTZ1NnXCIsXHJcblx0XHRcdHdpbmRtaWxsUmVkOiBcIldyV3JXcldyXCIsXHJcblx0XHRcdGZhblRyaXBsZTogXCJXcFdwV3BXcDpDd0N3Q3dDdzpXcFdwV3BXcFwiLFxyXG5cdFx0XHRmYW5RdWFkcnVwbGU6IFwiV3BXcFdwV3A6Q3dDd0N3Q3c6V3BXcFdwV3A6Q3dDd0N3Q3dcIixcclxuXHJcblx0XHRcdGJpcmQ6IFwiU3ItLS0tLS06LS1DZy0tQ2c6U2ItLVNiLS06LS1Ddy0tQ3dcIixcclxuXHRcdFx0c2Npc3NvcnM6IFwiU3ItLS0tLS06LS1DZ0NnQ2c6LS1TYi0tLS06Q3ctLUN3Q3dcIixcclxuXHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBuYW1lZDYgPSB7XHJcblx0XHRcdGNpcmNsZVNwYXduOiAnNkN1Q3VDdUN1Q3VDdScsXHJcblx0XHRcdHNxdWFyZVNwYXduOiAnNlJ1UnVSdVJ1UnVSdScsXHJcblx0XHRcdHN0YXJTcGF3bjogJzZTdVN1U3VTdVN1U3UnLFxyXG5cdFx0XHR3aW5kbWlsbFNwYXduOiAnNld1V3VXdVd1V3VXdScsXHJcblxyXG5cdFx0XHRjaXJjbGVCb3R0b206ICc2LS0tLUN1Q3VDdS0tJyxcclxuXHJcblx0XHRcdGNpcmNsZTogXCI2Q3VDdUN1Q3VDdUN1XCIsXHJcblx0XHRcdGNpcmNsZUhhbGY6IFwiNi0tLS0tLUN1Q3VDdVwiLFxyXG5cdFx0XHRyZWN0OiBcIjZSdVJ1UnVSdVJ1UnVcIixcclxuXHRcdFx0cmVjdEhhbGY6IFwiNlJ1UnVSdS0tLS0tLVwiLFxyXG5cdFx0XHRjaXJjbGVIYWxmUm90YXRlZDogXCI2Q3UtLS0tLS1DdUN1XCIsXHJcblx0XHRcdGNpcmNsZVF1YWQ6IFwiNkN1Q3UtLS0tLS0tLVwiLFxyXG5cdFx0XHRjaXJjbGVSZWQ6IFwiNkNyQ3JDckNyQ3JDclwiLFxyXG5cdFx0XHRyZWN0SGFsZkJsdWU6IFwiNlJiUmJSYi0tLS0tLVwiLFxyXG5cdFx0XHRjaXJjbGVQdXJwbGU6IFwiNkNwQ3BDcENwQ3BDcFwiLFxyXG5cdFx0XHRzdGFyQ3lhbjogXCI2U2NTY1NjU2NTY1NjXCIsXHJcblx0XHRcdGZpc2g6IFwiNkNnQ2dTY1NjQ2dDZ1wiLFxyXG5cdFx0XHRibHVlcHJpbnQ6IFwiNkNiQ2JDYkNiQ2JSYjo2Q3dDd0N3Q3dDd0N3XCIsXHJcblx0XHRcdHJlY3RDaXJjbGU6IFwiNlJwUnBScFJwUnBScDo2Q3dDd0N3Q3dDd0N3XCIsXHJcblx0XHRcdHdhdGVybWVsb246IFwiNi0tQ2dDZy0tLS0tLTo2LS1DckNyLS0tLS0tXCIsXHJcblx0XHRcdHN0YXJDaXJjbGU6IFwiNlNyU3JTclNyU3JTcjo2Q3lDeUN5Q3lDeUN5XCIsXHJcblx0XHRcdHN0YXJDaXJjbGVTdGFyOiBcIjZTclNyU3JTclNyU3I6NkN5Q3lDeUN5Q3lDeTo2U3dTd1N3U3dTd1N3XCIsXHJcblx0XHRcdGZhbjogXCI2Q2JDYlJiUmJDYkNiOjZDd0N3Q3dDd0N3Q3c6NldiV2JXYldiV2JXYlwiLFxyXG5cdFx0XHRtb25zdGVyOiBcIjZTZy0tLS0tLS0tU2c6NkNnQ2dDZ0NnQ2dDZzo2LS1DeUN5Q3lDeS0tXCIsXHJcblx0XHRcdGJvdXF1ZXQ6IFwiNkNwQ3BScENwQ3AtLTo2U3dTd1N3U3dTd1N3XCIsXHJcblx0XHRcdGxvZ286IFwiNlJ3Q3VDdy0tQ3dDdTo2LS0tLS0tUnUtLS0tXCIsXHJcblx0XHRcdHRhcmdldDogXCI2Q3JDd0NyQ3dDckN3OjZDd0NyQ3dDckN3Q3I6NkNyQ3dDckN3Q3JDdzo2Q3dDckN3Q3JDd0NyXCIsXHJcblx0XHRcdHNwZWVkb21ldGVyOiBcIjZDZ0NiLS0tLUNyQ3k6NkN3Q3ctLS0tQ3dDdzo2U2MtLS0tLS0tLS0tOjZDeUN5LS0tLUN5Q3lcIixcclxuXHRcdFx0c3Bpa2VkQmFsbDogXCI2Q2NTeUNjU3lDY1N5OjZTeUNjU3lDY1N5Q2M6NkNjU3lDY1N5Q2NTeTo2U3lDY1N5Q2NTeUNjXCIsXHJcblx0XHRcdGNvbXBhc3M6IFwiNkNjUmNSY0NjUmNSYzo2UndDd0N3UndDd0N3OjYtLS0tU3ItLS0tU2I6NkN5Q3lDeUN5Q3lDeVwiLFxyXG5cdFx0XHRwbGFudDogXCI2UmctLVJnLS1SZy0tOjZDd1J3Q3dSd0N3Unc6Ni0tUmctLVJnLS1SZ1wiLFxyXG5cdFx0XHRyb2NrZXQ6IFwiNkNiQ3VDYkN1Q2JDdTo2U3ItLS0tLS0tLS0tOjYtLUNyQ3JTckNyQ3I6NkN3Q3dDd0N3Q3dDd1wiLFxyXG5cclxuXHRcdFx0bWlsbDogXCI2Q3dDd0N3Q3dDd0N3OjZXYldiV2JXYldiV2JcIixcclxuXHRcdFx0c3RhcjogXCI2U3VTdVN1U3VTdVN1XCIsXHJcblx0XHRcdGNpcmNsZVN0YXI6IFwiNkN3Q3JDd0NyQ3dDcjo2U2dTZ1NnU2dTZ1NnXCIsXHJcblx0XHRcdGNsb3duOiBcIjZXclJnV3JSZ1dyUmc6NkN3Q3JDd0NyQ3dDcjo2U2dTZ1NnU2dTZ1NnXCIsXHJcblx0XHRcdHdpbmRtaWxsUmVkOiBcIjZXcldyV3JXcldyV3JcIixcclxuXHRcdFx0ZmFuVHJpcGxlOiBcIjZXcFdwV3BXcFdwV3A6NkN3Q3dDd0N3Q3dDdzo2V3BXcFdwV3BXcFdwXCIsXHJcblx0XHRcdGZhblF1YWRydXBsZTogXCI2V3BXcFdwV3BXcFdwOjZDd0N3Q3dDd0N3Q3c6NldwV3BXcFdwV3BXcDo2Q3dDd0N3Q3dDd0N3XCIsXHJcblxyXG5cdFx0XHRiaXJkOiBcIjZTci0tLS0tLS0tLS06Ni0tQ2dDZy0tQ2dDZzo2U2ItLS0tU2ItLS0tOjYtLUN3Q3ctLUN3Q3dcIixcclxuXHRcdFx0c2Npc3NvcnM6IFwiNlNyLS0tLS0tLS0tLTo2LS1DZ0NnQ2dDZ0NnOjYtLS0tU2ItLS0tLS06NkN3Q3ctLUN3Q3dDd1wiLFxyXG5cclxuXHJcblx0XHR9IGFzIGNvbnN0O1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBuYW1lZCA9IHtcclxuXHRcdFx0Y2lyY2xlU3Bhd246ICdzeiFsIXp8cSFDLTBvfGEhc3Uwb3xjIScsXHJcblx0XHRcdHNxdWFyZVNwYXduOiAnc3ohbCF6fHEhUi0wYyxSLWNvfGEhc3Uwb3xjIScsXHJcblx0XHRcdHN0YXJTcGF3bjogJ3N6IWwhenxxIVMtNGMsUy1jayxTLWtzfGEhc3Uwb3xjIScsXHJcblx0XHRcdHdpbmRtaWxsU3Bhd246ICdzeiFsIXp8cSFXLTA2LFctNmMsVy1jaSxXLWlvfGEhc3Uwb3xjIScsXHJcblxyXG5cclxuXHRcdFx0Y2lyY2xlMTogJ3N6IWwhenxxIUMtMG98YSFzdTBvfGMhJyxcclxuXHRcdFx0Y2lyY2xlSGFsZkxlZnQ6ICdzeiFsIXp8cSFDLWNvfGEhc3Uwb3xjIScsXHJcblx0XHRcdHNxdWFyZTI6ICdzeiFsIXp8cSFSLTBjLFItY298YSFzdTBvfGMhJyxcclxuXHRcdFx0c3F1YXJlSGFsZlJpZ2h0OiAnc3ohbCF6fHEhUi0wY3xhIXN1MG98YyEnLFxyXG5cdFx0XHRzcXVhcmVIYWxmVG9wMjogJ3N6IWwhenxxIVItNmMsUi1jaXxhIXN1Nml8YyEnLFxyXG5cdFx0XHRjaXJjbGVIYWxmVG9wMjogJ3N6IWwhenxxIUMtMDYsQy1pb3xhIXN1aXV8YyEnLFxyXG5cdFx0XHRjaXJjbGVRdWFkMTogJ3N6IWwhenxxIUMtb3V8YSFzdTBvfGMhJyxcclxuXHRcdFx0Y2lyY2xlUmVkOiAnc3ohbCF6fHEhQy0wb3xhIXNyMG98YyEnLFxyXG5cclxuXHRcdFx0Ly8gc3F1YXJlaGFsZkxlZnRCbHVlOiAnc3ohbCF6fHEhUi1jb3xhIXNiMG98YyEnLFxyXG5cdFx0XHQvLyBjaXJjbGVQdXJwbGU6ICdzeiFsIXp8cSFDLTBvfGEhc3Ywb3xjIScsXHJcblxyXG5cdFx0XHRzcXVhcmUzVG9wQmx1ZTogJ3N6IWwhenxxIVIta3N8YSFzYmtzfGMhJyxcclxuXHJcblx0XHRcdHN0YXIzQ3lhbjogJ3N6IWwhenxxIVMtNGMsUy1jayxTLWtzfGEhc2Mwb3xjIScsXHJcblx0XHRcdHNxdWlkOiAnc3ohbCF6fHEhUy02YyxTLWNpLEMtaXV8YSFzYzZpLHNnaXV8YyEnLFxyXG5cclxuXHRcdFx0ZGlhbW9uZDogJ3N6IWwhenxxIVItMDMsUi1sb3xhIXNjbHJ8YyEnLFxyXG5cclxuXHRcdFx0cGFsbTogJ3N6IWwhenxxIVMtMDIsUy0yNCxTLTQ2LFMtaWssUy1rbSxTLW1vfGEhc2dpdXxjITpsIXp8cSFSLWFlfGEhc29hZXxjITpsIXp8cSFDLTZpfGEhc3A2aXxjIScsXHJcblx0XHRcdGNvdW50ZXI6ICdzeiFsIXp8cSFDLWl1fGEhc3IyNixzZ2ltLHN5bXF8YyE6bCF6fHEhUi0yNixSLWltLFItbXF8YSFzd2l1fGMhOmwhenxxIVMtMDR8YSFzdTA0fGMhOmwhenxxIUMtaXV8YSFzdWl1fGMhJyxcclxuXHJcblx0XHRcdHdpbmRvdzogJ3N6IWwhenxxIVItMDYsUi02YyxSLWNpLFItaW98YSFzYzBvfGMhOmwhenxxIVItMjgsUi04ZSxSLWVrLFIta3F8YSFzbzBvfGMhOmwhenxxIVItNGEsUi1hZyxSLWdtLFItbXN8YSFzeTBvfGMhOmwhenxxIVItMDYsUi02YyxSLWNpLFItaW98YSFzdzBvfGMhJyxcclxuXHJcblx0XHRcdHNwbGlrZWJhbGw0ODogJ3N6IWwhenxxIUMtMDIsUy0yNCxDLTQ2LFMtNjgsQy04YSxTLWFjLEMtY2UsUy1lZyxDLWdpLFMtaWssQy1rbSxTLW1vfGEhc2MwMixzeTI0LHNjNDYsc3k2OCxzYzhhLHN5YWMsc2NjZSxzeWVnLHNjZ2ksc3lpayxzY2ttLHN5bW98YyE6bCF6fHEhUy0wMixDLTI0LFMtNDYsQy02OCxTLThhLEMtYWMsUy1jZSxDLWVnLFMtZ2ksQy1payxTLWttLEMtbW98YSFzeTAyLHNjMjQsc3k0NixzYzY4LHN5OGEsc2NhYyxzeWNlLHNjZWcsc3lnaSxzY2lrLHN5a20sc2Ntb3xjITpsIXp8cSFDLTAyLFMtMjQsQy00NixTLTY4LEMtOGEsUy1hYyxDLWNlLFMtZWcsQy1naSxTLWlrLEMta20sUy1tb3xhIXNjMDIsc3kyNCxzYzQ2LHN5Njgsc2M4YSxzeWFjLHNjY2Usc3llZyxzY2dpLHN5aWssc2NrbSxzeW1vfGMhOmwhenxxIVMtMDIsQy0yNCxTLTQ2LEMtNjgsUy04YSxDLWFjLFMtY2UsQy1lZyxTLWdpLEMtaWssUy1rbSxDLW1vfGEhc3kwMixzYzI0LHN5NDYsc2M2OCxzeThhLHNjYWMsc3ljZSxzY2VnLHN5Z2ksc2NpayxzeWttLHNjbW98YyEnLFxyXG5cdFx0fSBhcyBjb25zdDtcclxuXHJcblx0XHRleHBvcnQgdHlwZSBuYW1lZCA9IGtleW9mIHR5cGVvZiBuYW1lZDtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgYnlOYW1lID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UubmFtZSwgZV0pKTtcclxuXHRcdGV4cG9ydCBjb25zdCBieUNoYXIgPSBPYmplY3QuZnJvbUVudHJpZXMobGlzdC5tYXAoZSA9PiBbZS5jb2RlLCBlXSkpO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBleGFtcGxlTGF5ZXIoc2hhcGU6IHF1YWRTaGFwZSkge1xyXG5cdFx0XHRsZXQgaSA9IDA7XHJcblx0XHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdFx0cXVhZHM6IFtcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGUsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yOiAnZ3JleScgfSxcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGFyZWFzOiBbXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnc2VjdG9yJywgZnJvbTogMCwgdG86IDI0LCBjb2xvcjogJ2dyZXknIH0sXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIE9iamVjdC5lbnRyaWVzKGV4dHJhU2hhcGVzKS5tYXAoKFtrLCB2XSkgPT4gbGlzdC5wdXNoKHsgbmFtZTogayB9IGFzIGFueSkpO1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBxdWFkTGlzdCA9IGxpc3QubWFwKGUgPT4gZS5uYW1lKTtcclxuXHR9XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBhcmVhIHtcclxuXHRcdGV4cG9ydCB0eXBlIGFyZWFJbmZvID0geyBuYW1lOiBhcmVhU2hhcGUsIGNvZGU6IGNoYXIgfTtcclxuXHRcdGV4cG9ydCBjb25zdCBsaXN0OiBhcmVhSW5mb1tdID0gW1xyXG5cdFx0XHR7IG5hbWU6ICdzZWN0b3InLCBjb2RlOiAncycgfSxcclxuXHRcdFx0eyBuYW1lOiAnd2hvbGUnLCBjb2RlOiAndycgfSxcclxuXHRcdF07XHJcblx0XHRleHBvcnQgY29uc3QgYnlOYW1lOiBSZWNvcmQ8YXJlYVNoYXBlLCBhcmVhSW5mbz4gPSBPYmplY3QuZnJvbUVudHJpZXMobGlzdC5tYXAoZSA9PiBbZS5uYW1lLCBlXSkpO1xyXG5cdFx0ZXhwb3J0IGNvbnN0IGJ5Q2hhcjogUmVjb3JkPGNoYXIsIGFyZWFJbmZvPiA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0Lm1hcChlID0+IFtlLmNvZGUsIGVdKSk7XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IHMgPSBBcnJheSgxMDApLmZpbGwoMCkubWFwKChlLCBpKSA9PiBpLnRvU3RyaW5nKDM2KSkuam9pbignJykuc2xpY2UoMCwgMzYpO1xyXG5cdHMgKz0gcy5zbGljZSgxMCkudG9VcHBlckNhc2UoKTtcclxuXHJcblx0ZXhwb3J0IGNvbnN0IG5Ub0NoYXI6IGNoYXJbXSA9IHMuc3BsaXQoJycpO1xyXG5cdGV4cG9ydCBjb25zdCBjaGFyVG9OOiBSZWNvcmQ8Y2hhciwgbnVtYmVyPiA9IE9iamVjdC5mcm9tRW50cmllcyhuVG9DaGFyLm1hcCgoZSwgaSkgPT4gW2UsIGldKSk7XHJcblx0Lyogb2xkOiBcclxuXHJcblx0XHJcbmV4cG9ydCBjb25zdCBzaGFwZTRzdmcgPSB7XHJcblx0UjogXCJNIDAgMCBMIDEgMCBMIDEgMSBMIDAgMSBaXCIsXHJcblx0QzogXCJNIDAgMCBMIDEgMCBBIDEgMSAwIDAgMSAwIDEgWlwiLFxyXG5cdFM6IFwiTSAwIDAgTCAwLjYgMCBMIDEgMSBMIDAgMC42IFpcIixcclxuXHRXOiBcIk0gMCAwIEwgMC42IDAgTCAxIDEgTCAwIDEgWlwiLFxyXG5cdFwiLVwiOiBcIk0gMCAwXCIsXHJcbn1cclxuZnVuY3Rpb24gZG90UG9zKGwsIGEpIHtcclxuXHRyZXR1cm4gYCR7bCAqIE1hdGguY29zKE1hdGguUEkgLyBhKX0gJHtsICogTWF0aC5zaW4oTWF0aC5QSSAvIGEpfWA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNpblBpQnkoYSkge1xyXG5cdHJldHVybiBNYXRoLnNpbihNYXRoLlBJIC8gYSk7XHJcbn1cclxuZnVuY3Rpb24gY29zUGlCeShhKSB7XHJcblx0cmV0dXJuIE1hdGguY29zKE1hdGguUEkgLyBhKTtcclxufVxyXG5sZXQgc2hhcGU2bG9uZyA9IDEgLyBjb3NQaUJ5KDYpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNoYXBlNnN2ZyA9IHtcclxuXHRSOiBgTSAwIDAgTCAxIDAgTCAke2RvdFBvcyhzaGFwZTZsb25nLCA2KX0gTCAke2RvdFBvcygxLCAzKX0gWmAsXHJcblx0QzogYE0gMCAwIEwgMSAwIEEgMSAxIDAgMCAxICR7ZG90UG9zKDEsIDMpfSBaYCxcclxuXHRTOiBgTSAwIDAgTCAwLjYgMCBMICR7ZG90UG9zKHNoYXBlNmxvbmcsIDYpfSBMICR7ZG90UG9zKDAuNiwgMyl9IFpgLFxyXG5cdFc6IGBNIDAgMCBMIDAuNiAwIEwgJHtkb3RQb3Moc2hhcGU2bG9uZywgNil9IEwgJHtkb3RQb3MoMSwgMyl9IFpgLFxyXG5cdFwiLVwiOiBcIk0gMCAwXCIsXHJcbn1cclxuXHJcblxyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwicmhvbWJ1c1wiLFxyXG5cdGNvZGU6IFwiQlwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXcoeyBkaW1zLCBpbm5lckRpbXMsIGxheWVyLCBxdWFkLCBjb250ZXh0LCBjb2xvciwgYmVnaW4gfSkge1xyXG5cdFx0YmVnaW4oeyBzaXplOiAxLjIsIHBhdGg6IHRydWUsIHplcm86IHRydWUgfSk7XHJcblx0XHRjb25zdCByYWQgPSAwLjAwMTtcclxuXHRcdC8vIHdpdGggcm91bmRlZCBib3JkZXJzXHJcblx0XHRjb250ZXh0LmFyY1RvKDAsIDEsIDEsIDAsIHJhZCk7XHJcblx0XHRjb250ZXh0LmFyY1RvKDEsIDAsIDAsIDAsIHJhZCk7XHJcblx0fSxcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJwbHVzXCIsXHJcblx0Y29kZTogXCJQXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0ZHJhdzogXCJNIDAgMCBMIDEuMSAwIDEuMSAwLjUgMC41IDAuNSAwLjUgMS4xIDAgMS4xIHpcIixcclxuXHR0aWVyOiAzLFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInNhd1wiLFxyXG5cdGNvZGU6IFwiWlwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXcoeyBkaW1zLCBpbm5lckRpbXMsIGxheWVyLCBxdWFkLCBjb250ZXh0LCBjb2xvciwgYmVnaW4gfSkge1xyXG5cdFx0YmVnaW4oeyBzaXplOiAxLjEsIHBhdGg6IHRydWUsIHplcm86IHRydWUgfSk7XHJcblx0XHRjb25zdCBpbm5lciA9IDAuNTtcclxuXHRcdGNvbnRleHQubGluZVRvKGlubmVyLCAwKTtcclxuXHRcdGNvbnRleHQuYmV6aWVyQ3VydmVUbyhpbm5lciwgMC4zLCAxLCAwLjMsIDEsIDApO1xyXG5cdFx0Y29udGV4dC5iZXppZXJDdXJ2ZVRvKFxyXG5cdFx0XHQxLFxyXG5cdFx0XHRpbm5lcixcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQyICogMC45LFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDIgKiAwLjksXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMV8yLFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDFfMlxyXG5cdFx0KTtcclxuXHRcdGNvbnRleHQucm90YXRlKE1hdGguUEkgLyA0KTtcclxuXHRcdGNvbnRleHQuYmV6aWVyQ3VydmVUbyhpbm5lciwgMC4zLCAxLCAwLjMsIDEsIDApO1xyXG5cdFx0Y29udGV4dC5iZXppZXJDdXJ2ZVRvKFxyXG5cdFx0XHQxLFxyXG5cdFx0XHRpbm5lcixcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQyICogMC45LFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDIgKiAwLjksXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMV8yLFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDFfMlxyXG5cdFx0KTtcclxuXHR9LFxyXG5cdHRpZXI6IDMsXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwic3VuXCIsXHJcblx0Y29kZTogXCJVXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0c3Bhd25Db2xvcjogXCJ5ZWxsb3dcIixcclxuXHRkcmF3KHsgZGltcywgaW5uZXJEaW1zLCBsYXllciwgcXVhZCwgY29udGV4dCwgY29sb3IsIGJlZ2luIH0pIHtcclxuXHRcdGJlZ2luKHsgc2l6ZTogMS4zLCBwYXRoOiB0cnVlLCB6ZXJvOiB0cnVlIH0pO1xyXG5cdFx0Y29uc3QgUEkgPSBNYXRoLlBJO1xyXG5cdFx0Y29uc3QgUEkzID0gKChQSSAqIDMpIC8gOCkgKiAwLjc1O1xyXG5cdFx0Y29uc3QgYyA9IDEgLyBNYXRoLmNvcyhNYXRoLlBJIC8gOCk7XHJcblx0XHRjb25zdCBiID0gYyAqIE1hdGguc2luKE1hdGguUEkgLyA4KTtcclxuXHJcblx0XHRjb250ZXh0Lm1vdmVUbygwLCAwKTtcclxuXHRcdGNvbnRleHQucm90YXRlKE1hdGguUEkgLyAyKTtcclxuXHRcdGNvbnRleHQuYXJjKGMsIDAsIGIsIC1QSSwgLVBJICsgUEkzKTtcclxuXHRcdGNvbnRleHQucm90YXRlKC1NYXRoLlBJIC8gNCk7XHJcblx0XHRjb250ZXh0LmFyYyhjLCAwLCBiLCAtUEkgLSBQSTMsIC1QSSArIFBJMyk7XHJcblx0XHRjb250ZXh0LnJvdGF0ZSgtTWF0aC5QSSAvIDQpO1xyXG5cdFx0Y29udGV4dC5hcmMoYywgMCwgYiwgUEkgLSBQSTMsIFBJKTtcclxuXHR9LFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcImxlYWZcIixcclxuXHRjb2RlOiBcIkZcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3OiBcIk0gMCAwIHYgMC41IGEgMC41IDAuNSAwIDAgMCAwLjUgMC41IGggMC41IHYgLTAuNSBhIDAuNSAwLjUgMCAwIDAgLTAuNSAtMC41IHpcIixcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJkaWFtb25kXCIsXHJcblx0Y29kZTogXCJEXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0ZHJhdzogXCJNIDAgMCBsIDAgMC41IDAuNSAwLjUgMC41IDAgMCAtMC41IC0wLjUgLTAuNSB6XCIsXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwibWlsbFwiLFxyXG5cdGNvZGU6IFwiTVwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXc6IFwiTSAwIDAgTCAwIDEgMSAxIFpcIixcclxufSk7XHJcblxyXG4vLyByZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuLy8gICAgIGlkOiBcImhhbGZsZWFmXCIsXHJcbi8vICAgICBjb2RlOiBcIkhcIixcclxuLy8gICAgIC4uLmN1c3RvbURlZmF1bHRzLFxyXG4vLyAgICAgZHJhdzogXCIxMDAgTSAwIDAgTCAwIDEwMCBBIDQ1IDQ1IDAgMCAwIDMwIDMwIEEgNDUgNDUgMCAwIDAgMTAwIDAgWlwiLFxyXG4vLyB9KVxyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwieWlueWFuZ1wiLFxyXG5cdGNvZGU6IFwiWVwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdC8vIGRyYXcoeyBkaW1zLCBpbm5lckRpbXMsIGxheWVyLCBxdWFkLCBjb250ZXh0LCBjb2xvciwgYmVnaW4gfSkge1xyXG5cdC8vICAgICBiZWdpbih7IHNpemU6IDEvKDAuNStNYXRoLlNRUlQxXzIpLCBwYXRoOiB0cnVlIH0pO1xyXG5cclxuXHQvLyAgICAgLyoqIEB0eXBle0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gKiAvXHJcblx0Ly8gICAgIGxldCBjdHggPSBjb250ZXh0O1xyXG5cclxuXHQvLyAgICAgd2l0aCAoY3R4KSB7IHdpdGggKE1hdGgpIHtcclxuXHQvLyAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblx0Ly8gICAgIC8vIGRyYXcgbW9zdGx5IGluIFswLDFdeFswLDFdIHNxdWFyZVxyXG5cdC8vICAgICAvLyBkcmF3OiBcIjEwMCBNIDAgNTAgQSA1MCA1MCAwIDEgMSA4NSA4NSBBIDEyMSAxMjEgMCAwIDEgLTg1IDg1IEEgNTAgNTAgMCAwIDAgMCA1MFwiLFxyXG5cdC8vICAgICBtb3ZlVG8oMCwgMC41KTtcclxuXHQvLyAgICAgYXJjKDAuNSwgMC41LCAwLjUsIFBJLCBQSS80KVxyXG5cdC8vICAgICBhcmMoMCwgMCwgMC41K1NRUlQxXzIsIFBJLzQsIFBJLzQrUEkvMiwgMClcclxuXHQvLyAgICAgYXJjKC0wLjUsIDAuNSwgMC41LCAzKlBJLzQsIDAsIDEpXHJcblxyXG5cdC8vICAgICBtb3ZlVG8oMC42LCAwLjUpXHJcblx0Ly8gICAgIGFyYygwLjUsIDAuNSwgMC4xLCAwLCAyKlBJKVxyXG5cdC8vICAgICB9fVxyXG5cclxuXHQvLyB9LFxyXG5cdGRyYXc6XHJcblx0XHRcIjEyMC43MSBNIDAgNTAgQSA1MCA1MCAwIDEgMSA4NS4zNTUgODUuMzU1IEEgMTIwLjcxIDEyMC43MSAwIDAgMSAtODUuMzU1IDg1LjM1NSBBIDUwIDUwIDAgMCAwIDAgNTAgWiBNIDQwIDUwIEEgMTAgMTAgMCAxIDAgNDAgNDkuOTkgWlwiLFxyXG5cdHRpZXI6IDQsXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwib2N0YWdvblwiLFxyXG5cdGNvZGU6IFwiT1wiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXc6IFwiTSAwIDAgTCAwIDEgMC40MTQyIDEgMSAwLjQxNDIgMSAwIFpcIixcclxufSk7XHJcblxyXG5cdFxyXG5cdCovXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU3pMYXllciB7XHJcblx0Y3V0czogKHtcclxuXHRcdHNoYXBlOiBjdXRTaGFwZSxcclxuXHRcdGZyb206IHJvdGF0aW9uMjQsIHRvOiByb3RhdGlvbjI0LFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdH0pW107XHJcblx0cXVhZHM6ICh7XHJcblx0XHRzaGFwZTogcXVhZFNoYXBlLFxyXG5cdFx0ZnJvbTogcm90YXRpb24yNCwgdG86IHJvdGF0aW9uMjQsXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0fSlbXTtcclxuXHRhcmVhczogKHtcclxuXHRcdHNoYXBlOiBhcmVhU2hhcGUsXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0XHRmcm9tOiByb3RhdGlvbjI0LCB0bzogcm90YXRpb24yNCxcclxuXHR9KVtdO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFN6TGF5ZXJDdXQge1xyXG5cdHNoYXBlOiBjdXRTaGFwZSA9ICdsaW5lJztcclxuXHRjb2xvcjogY29sb3IgPSAnYmxhY2snO1xyXG5cclxuXHRmcm9tOiByb3RhdGlvbjI0ID0gMDsgdG86IHJvdGF0aW9uMjQgPSAwO1xyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZTogUGlja1ZhbHVlczxTekxheWVyQ3V0Pikge1xyXG5cdFx0T2JqZWN0LmFzc2lnbih0aGlzLCBzb3VyY2UpO1xyXG5cdH1cclxuXHRjbG9uZSgpIHsgcmV0dXJuIG5ldyBTekxheWVyQ3V0KHRoaXMpOyB9XHJcblx0Z2V0IHNtYWxsUmFkaXVzKCkge1xyXG5cdFx0cmV0dXJuIDAuMDAwMTtcclxuXHR9XHJcblx0cGF0aEluc2lkZShjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRzd2l0Y2ggKHRoaXMuc2hhcGUpIHtcclxuXHRcdFx0Y2FzZSAnbGluZSc6IHtcclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjUsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IodGhpcy5zbWFsbFJhZGl1cywgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdHRocm93IHRoaXM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0cGF0aE91dHNpemUoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0c3dpdGNoICh0aGlzLnNoYXBlKSB7XHJcblx0XHRcdGNhc2UgJ2xpbmUnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IodGhpcy5zbWFsbFJhZGl1cywgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjUsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHR0aHJvdyB0aGlzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldEhhc2goKTogc3RyaW5nIHtcclxuXHRcdC8vIGZpeG1lXHJcblx0XHRyZXR1cm4gYGA7XHJcblx0fVxyXG5cdHN0YXRpYyBmcm9tU2hvcnRLZXkoZTogc3RyaW5nKTogU3pMYXllckN1dCB7XHJcblx0XHQvLyBmaXhtZVxyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyQ3V0KHt9KTtcclxuXHR9XHJcbn1cclxuXHJcbnR5cGUgUGlja1ZhbHVlczxUPiA9IHtcclxuXHRbayBpbiBrZXlvZiBUIGFzIFRba10gZXh0ZW5kcyAoKC4uLmFyZ3M6IGFueSkgPT4gYW55KSA/IG5ldmVyIDoga10/OiBUW2tdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTekxheWVyUXVhZCB7XHJcblx0c2hhcGU6IHF1YWRTaGFwZSA9ICdjaXJjbGUnO1xyXG5cdGNvbG9yOiBjb2xvciA9ICdub25lJztcclxuXHRmcm9tOiByb3RhdGlvbjI0ID0gMDsgdG86IHJvdGF0aW9uMjQgPSAwO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihzb3VyY2U6IFBpY2tWYWx1ZXM8U3pMYXllclF1YWQ+KSB7XHJcblx0XHRPYmplY3QuYXNzaWduKHRoaXMsIHNvdXJjZSk7XHJcblx0XHRpZiAoY29uZmlnLmRpc2FibGVRdWFkQ29sb3JzKSB7XHJcblx0XHRcdHRoaXMuY29sb3IgPSAnbm9uZSc7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjbG9uZSgpIHsgcmV0dXJuIG5ldyBTekxheWVyUXVhZCh0aGlzKTsgfVxyXG5cdG91dGVyUGF0aChjdHg6IFN6Q29udGV4dDJELCBsYXllcjogU3pMYXllcikge1xyXG5cdFx0c3dpdGNoICh0aGlzLnNoYXBlKSB7XHJcblx0XHRcdGNhc2UgJ2NpcmNsZSc6IHtcclxuXHRcdFx0XHRjdHguYXJjKDAsIDAsIDEsIHRoaXMuZnJvbSwgdGhpcy50byk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhc2UgJ3NxdWFyZSc6IHtcclxuXHRcdFx0XHRjdHgubGluZVRvUigxLCB0aGlzLmZyb20pO1xyXG5cdFx0XHRcdC8vIDYgLT4gTWF0aC5TUVJUMiwgMTIgLT4gMVxyXG5cdFx0XHRcdGxldCBhID0gdGhpcy50byAtIHRoaXMuZnJvbTtcclxuXHRcdFx0XHRsZXQgYXIgPSBhICogKE1hdGguUEkgLyAyNCk7XHJcblx0XHRcdFx0bGV0IFIgPSBhIDw9IDYgPyAxIC8gTWF0aC5jb3MoYXIpIDogMTtcclxuXHRcdFx0XHRjdHgubGluZVRvUihSLCAodGhpcy5mcm9tICsgdGhpcy50bykgLyAyKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUigxLCB0aGlzLnRvKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FzZSAnc3Rhcic6IHtcclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjYsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoTWF0aC5TUVJUMiwgKHRoaXMuZnJvbSArIHRoaXMudG8pIC8gMik7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMC42LCB0aGlzLnRvKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FzZSAnd2luZG1pbGwnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMSwgdGhpcy5mcm9tKTtcclxuXHJcblx0XHRcdFx0bGV0IGEgPSB0aGlzLnRvIC0gdGhpcy5mcm9tO1xyXG5cdFx0XHRcdGxldCBhciA9IGEgKiAoTWF0aC5QSSAvIDI0KTtcclxuXHRcdFx0XHRsZXQgUiA9IGEgPD0gNiA/IDEgLyBNYXRoLmNvcyhhcikgOiAxO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKFIsICh0aGlzLmZyb20gKyB0aGlzLnRvKSAvIDIpO1xyXG5cclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjYsIHRoaXMudG8pO1xyXG5cclxuXHJcblx0XHRcdFx0Ly8gbGV0IG9yaWdpblggPSAtcXVhZHJhbnRIYWxmU2l6ZTtcclxuXHRcdFx0XHQvLyBsZXQgb3JpZ2luWSA9IHF1YWRyYW50SGFsZlNpemUgLSBkaW1zO1xyXG5cdFx0XHRcdC8vIGNvbnN0IG1vdmVJbndhcmRzID0gZGltcyAqIDAuNDtcclxuXHRcdFx0XHQvLyBjb250ZXh0Lm1vdmVUbyhvcmlnaW5YLCBvcmlnaW5ZICsgbW92ZUlud2FyZHMpO1xyXG5cdFx0XHRcdC8vIGNvbnRleHQubGluZVRvKG9yaWdpblggKyBkaW1zLCBvcmlnaW5ZKTtcclxuXHRcdFx0XHQvLyBjb250ZXh0LmxpbmVUbyhvcmlnaW5YICsgZGltcywgb3JpZ2luWSArIGRpbXMpO1xyXG5cdFx0XHRcdC8vIGNvbnRleHQubGluZVRvKG9yaWdpblgsIG9yaWdpblkgKyBkaW1zKTtcclxuXHRcdFx0XHQvLyBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cdFx0XHRcdC8vIGNvbnRleHQuZmlsbCgpO1xyXG5cdFx0XHRcdC8vIGNvbnRleHQuc3Ryb2tlKCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdGN0eC5zYXZlZChjdHggPT4ge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuc2hhcGUgPT0gJ2NvdmVyJykge1xyXG5cdFx0XHRcdFx0XHRjdHguc2NhbGUoMSAvIGxheWVyLmxheWVyU2NhbGUoKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFN6SW5mby5xdWFkLmJ5TmFtZVt0aGlzLnNoYXBlXS5wYXRoIShjdHgsIHRoaXMpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXRIYXNoKCk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gYCR7U3pJbmZvLnF1YWQuYnlOYW1lW3RoaXMuc2hhcGVdLmNvZGVcclxuXHRcdFx0fSR7U3pJbmZvLmNvbG9yLmJ5TmFtZVt0aGlzLmNvbG9yXS5jb2RlXHJcblx0XHRcdH0ke1N6SW5mby5uVG9DaGFyW3RoaXMuZnJvbV1cclxuXHRcdFx0fSR7U3pJbmZvLm5Ub0NoYXJbdGhpcy50b11cclxuXHRcdFx0fWBcclxuXHR9XHJcblx0c3RhdGljIGZyb21TaG9ydEtleShlOiBzdHJpbmcpOiBTekxheWVyUXVhZCB7XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJRdWFkKHtcclxuXHRcdFx0c2hhcGU6IFN6SW5mby5xdWFkLmJ5Q2hhcltlWzBdXS5uYW1lLFxyXG5cdFx0XHRjb2xvcjogU3pJbmZvLmNvbG9yLmJ5Q2hhcltlWzFdXS5uYW1lLFxyXG5cdFx0XHRmcm9tOiBTekluZm8uY2hhclRvTltlWzJdXSxcclxuXHRcdFx0dG86IFN6SW5mby5jaGFyVG9OW2VbM11dLFxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFN6TGF5ZXJBcmVhIHtcclxuXHRzaGFwZTogYXJlYVNoYXBlID0gJ3NlY3Rvcic7XHJcblx0Y29sb3I6IGNvbG9yID0gJ2JsYWNrJztcclxuXHJcblx0ZnJvbTogcm90YXRpb24yNCA9IDA7IHRvOiByb3RhdGlvbjI0ID0gMDtcclxuXHRjb25zdHJ1Y3Rvcihzb3VyY2U6IFBpY2tWYWx1ZXM8U3pMYXllckFyZWE+KSB7XHJcblx0XHRPYmplY3QuYXNzaWduKHRoaXMsIHNvdXJjZSk7XHJcblx0fVxyXG5cdGNsb25lKCkgeyByZXR1cm4gbmV3IFN6TGF5ZXJBcmVhKHRoaXMpOyB9XHJcblx0b3V0ZXJQYXRoKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdHN3aXRjaCAodGhpcy5zaGFwZSkge1xyXG5cdFx0XHRjYXNlICd3aG9sZSc6IHtcclxuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0Y3R4LmFyYygwLCAwLCA1LCAwLCAyNCk7XHJcblx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXNlICdzZWN0b3InOiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZnJvbSA9PSAwICYmIHRoaXMudG8gPT0gMjQpIHtcclxuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdGN0eC5hcmMoMCwgMCwgNSwgMCwgMjQpO1xyXG5cdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdGN0eC5tb3ZlVG8oMCwgMCk7XHJcblx0XHRcdFx0Y3R4LmFyYygwLCAwLCA1LCB0aGlzLmZyb20sIHRoaXMudG8pO1xyXG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdHRocm93IHRoaXM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0Y2xpcChjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHR0aGlzLm91dGVyUGF0aChjdHgpO1xyXG5cdFx0Y3R4LmNsaXAoKTtcclxuXHR9XHJcblx0ZmlsbChjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHR0aGlzLm91dGVyUGF0aChjdHgpO1xyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IFN6SW5mby5jb2xvci5ieU5hbWVbdGhpcy5jb2xvcl0uc3R5bGU7XHJcblx0XHRjdHguZmlsbCgpO1xyXG5cdH1cclxuXHRnZXRIYXNoKCk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gYCR7U3pJbmZvLmFyZWEuYnlOYW1lW3RoaXMuc2hhcGVdLmNvZGVcclxuXHRcdFx0fSR7U3pJbmZvLmNvbG9yLmJ5TmFtZVt0aGlzLmNvbG9yXS5jb2RlXHJcblx0XHRcdH0ke1N6SW5mby5uVG9DaGFyW3RoaXMuZnJvbV1cclxuXHRcdFx0fSR7U3pJbmZvLm5Ub0NoYXJbdGhpcy50b11cclxuXHRcdFx0fWBcclxuXHR9XHJcblx0c3RhdGljIGZyb21TaG9ydEtleShlOiBzdHJpbmcpOiBTekxheWVyQXJlYSB7XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJBcmVhKHtcclxuXHRcdFx0c2hhcGU6IFN6SW5mby5hcmVhLmJ5Q2hhcltlWzBdXS5uYW1lLFxyXG5cdFx0XHRjb2xvcjogU3pJbmZvLmNvbG9yLmJ5Q2hhcltlWzFdXS5uYW1lLFxyXG5cdFx0XHRmcm9tOiBTekluZm8uY2hhclRvTltlWzJdXSxcclxuXHRcdFx0dG86IFN6SW5mby5jaGFyVG9OW2VbM11dLFxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IHRlc3RUZW1wbGF0ZTogSVN6TGF5ZXIgPSB7XHJcblx0Y3V0czogW1xyXG5cdFx0eyBmcm9tOiAxMCwgdG86IDEwLCBzaGFwZTogJ2xpbmUnLCBjb2xvcjogJ2JsdWUnIH0sXHJcblx0XHR7IGZyb206IDE0LCB0bzogMTQsIHNoYXBlOiAnbGluZScsIGNvbG9yOiAnYmx1ZScgfSxcclxuXHRdLFxyXG5cdHF1YWRzOiBbXHJcblx0XHR7IHNoYXBlOiAnc3F1YXJlJywgY29sb3I6ICdncmVlbicsIGZyb206IDIsIHRvOiA0IH0sXHJcblx0XHR7IHNoYXBlOiAnY2lyY2xlJywgY29sb3I6ICdwaW5rJywgZnJvbTogNSwgdG86IDE5IH0sXHJcblx0XHR7IHNoYXBlOiAnc3F1YXJlJywgY29sb3I6ICdncmVlbicsIGZyb206IDIwLCB0bzogMjIgfSxcclxuXHRdLFxyXG5cdGFyZWFzOiBbXHJcblx0XHR7IHNoYXBlOiAnc2VjdG9yJywgY29sb3I6ICdyZWQnLCBmcm9tOiAxMSwgdG86IDEzIH0sXHJcblx0XSxcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU3pMYXllciBpbXBsZW1lbnRzIElTekxheWVyIHtcclxuXHRsYXllckluZGV4ID0gMDtcclxuXHRjdXRzOiBTekxheWVyQ3V0W10gPSBbXTtcclxuXHRxdWFkczogU3pMYXllclF1YWRbXSA9IFtdO1xyXG5cdGFyZWFzOiBTekxheWVyQXJlYVtdID0gW107XHJcblxyXG5cclxuXHRzdGF0aWMgY3JlYXRlVGVzdCgpIHtcclxuXHRcdGxldCBsID0gbmV3IFN6TGF5ZXIodGVzdFRlbXBsYXRlKTtcclxuXHRcdGwuYXJlYXMubWFwKGUgPT4ge1xyXG5cdFx0XHRsZXQgciA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDg7XHJcblx0XHRcdGUuZnJvbSArPSByO1xyXG5cdFx0XHRlLnRvICs9IHI7XHJcblx0XHR9KTtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ3Rlc3QgbGF5ZXInLCBsKTtcclxuXHRcdHJldHVybiBsO1xyXG5cdH1cclxuXHJcblx0Y29uc3RydWN0b3Ioc291cmNlPzogUGlja1ZhbHVlczxJU3pMYXllcj4sIGxheWVySW5kZXg/OiBudW1iZXIpIHtcclxuXHRcdGlmIChzb3VyY2UpIHtcclxuXHRcdFx0dGhpcy5jdXRzID0gKHNvdXJjZS5jdXRzID8/IFtdKS5tYXAoZSA9PiBuZXcgU3pMYXllckN1dChlKSk7XHJcblx0XHRcdHRoaXMucXVhZHMgPSAoc291cmNlLnF1YWRzID8/IFtdKS5tYXAoZSA9PiBuZXcgU3pMYXllclF1YWQoZSkpO1xyXG5cdFx0XHR0aGlzLmFyZWFzID0gKHNvdXJjZS5hcmVhcyA/PyBbXSkubWFwKGUgPT4gbmV3IFN6TGF5ZXJBcmVhKGUpKTtcclxuXHRcdFx0aWYgKChzb3VyY2UgYXMgU3pMYXllcikubGF5ZXJJbmRleCkge1xyXG5cdFx0XHRcdHRoaXMubGF5ZXJJbmRleCA9IChzb3VyY2UgYXMgU3pMYXllcikubGF5ZXJJbmRleDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKGxheWVySW5kZXggIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLmxheWVySW5kZXggPSBsYXllckluZGV4O1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbmZpZy5kaXNhYmxlQ3V0cykgdGhpcy5jdXRzID0gW107XHJcblx0XHRyZXR1cm4gdGhpcy5ub3JtYWxpemUoKTtcclxuXHR9XHJcblxyXG5cdGxheWVyU2NhbGUobGF5ZXJJbmRleD86IG51bWJlcikge1xyXG5cdFx0bGF5ZXJJbmRleCA/Pz0gdGhpcy5sYXllckluZGV4O1xyXG5cdFx0cmV0dXJuIDAuOSAtIDAuMjIgKiBsYXllckluZGV4O1xyXG5cdH1cclxuXHRkcmF3Q2VudGVyZWRMYXllclNjYWxlZChjdHg6IFN6Q29udGV4dDJELCBsYXllckluZGV4PzogbnVtYmVyKSB7XHJcblx0XHRjdHguc2F2ZWQoY3R4ID0+IHtcclxuXHRcdFx0Y3R4LnNjYWxlKHRoaXMubGF5ZXJTY2FsZShsYXllckluZGV4KSk7XHJcblx0XHRcdHRoaXMuZHJhd0NlbnRlcmVkTm9ybWFsaXplZChjdHgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkcmF3Q2VudGVyZWROb3JtYWxpemVkKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdGN0eC5zYXZlZChjdHggPT4ge1xyXG5cdFx0XHR0aGlzLmNsaXBTaGFwZXMoY3R4KTtcclxuXHRcdFx0Ly8gdGhpcy5xdWFkcy5mb3JFYWNoKHEgPT4gY3R4LnNhdmVkKGN0eCA9PiB0aGlzLmZpbGxRdWFkKHEsIGN0eCkpKTtcclxuXHJcblx0XHRcdHRoaXMuY3V0cy5mb3JFYWNoKGMgPT4gY3R4LnNhdmVkKGN0eCA9PiB0aGlzLnN0cm9rZUN1dChjLCBjdHgpKSk7XHJcblxyXG5cdFx0XHR0aGlzLmFyZWFzLmZvckVhY2goYSA9PiBjdHguc2F2ZWQoY3R4ID0+IHRoaXMuZmlsbEFyZWEoYSwgY3R4KSkpO1xyXG5cdFx0fSk7XHJcblx0XHRjdHguc2F2ZWQoY3R4ID0+IHRoaXMuZHJhd1F1YWRPdXRsaW5lKGN0eCwgdHJ1ZSkpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblx0c3Ryb2tlQ3V0KGN1dDogU3pMYXllckN1dCwgY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDAuMDU7XHJcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSBjdXQuY29sb3I7XHJcblx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblxyXG5cdFx0aWYgKGN1dC5zaGFwZSA9PSAnbGluZScpIHtcclxuXHRcdFx0Y3R4LnJvdGF0ZShjdXQuZnJvbSk7XHJcblx0XHRcdGN0eC5tb3ZlVG8oMCwgMCk7XHJcblx0XHRcdGN0eC5saW5lVG8oMCwgMSk7XHJcblx0XHRcdGN0eC5zdHJva2UoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IHRoaXM7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHRmaWxsUXVhZChxdWFkOiBTekxheWVyUXVhZCwgY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IFN6SW5mby5jb2xvci5ieU5hbWVbcXVhZC5jb2xvcl0uc3R5bGU7XHJcblx0XHRpZiAocXVhZC5jb2xvciA9PSAnY292ZXInKSBbXHJcblx0XHRcdC8vIGN0eC5jdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW91dCdcclxuXHRcdF1cclxuXHJcblx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRjdHgubW92ZVRvKDAsIDApO1xyXG5cdFx0cXVhZC5vdXRlclBhdGgoY3R4LCB0aGlzKTtcclxuXHRcdGN0eC5maWxsKCk7XHJcblx0fVxyXG5cclxuXHRmaWxsQXJlYShhcmVhOiBTekxheWVyQXJlYSwgY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDAuMDU7XHJcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSBjdHguZmlsbFN0eWxlID0gU3pJbmZvLmNvbG9yLmJ5TmFtZVthcmVhLmNvbG9yXS5zdHlsZTtcclxuXHJcblx0XHRhcmVhLmNsaXAoY3R4KTtcclxuXHRcdGN0eC5maWxsKCk7XHJcblx0fVxyXG5cclxuXHRmdWxsUXVhZFBhdGgoY3R4OiBTekNvbnRleHQyRCwgd2l0aEN1dHM/OiBib29sZWFuKSB7XHJcblx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucXVhZHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IHByZXYgPSBpID4gMCA/IHRoaXMucXVhZHNbaSAtIDFdIDogdGhpcy5xdWFkcy5zbGljZSgtMSlbMF07XHJcblx0XHRcdGxldCBxdWFkID0gdGhpcy5xdWFkc1tpXTtcclxuXHRcdFx0aWYgKHdpdGhDdXRzIHx8IHF1YWQuZnJvbSAhPSBwcmV2LnRvICUgMjQpIGN0eC5saW5lVG8oMCwgMCk7XHJcblx0XHRcdHF1YWQub3V0ZXJQYXRoKGN0eCwgdGhpcyk7XHJcblx0XHR9XHJcblx0XHRjdHguY2xvc2VQYXRoKCk7XHJcblx0fVxyXG5cclxuXHRkcmF3UXVhZE91dGxpbmUoY3R4OiBTekNvbnRleHQyRCwgd2l0aEN1dHM/OiBib29sZWFuKSB7XHJcblx0XHR0aGlzLmZ1bGxRdWFkUGF0aChjdHgsIHdpdGhDdXRzKTtcclxuXHRcdGN0eC5saW5lV2lkdGggPSAwLjA1O1xyXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ29yYW5nZSc7XHJcblx0XHRjdHguc3Ryb2tlKCk7XHJcblx0fVxyXG5cclxuXHRjbGlwU2hhcGVzKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMuZnVsbFF1YWRQYXRoKGN0eCk7XHJcblx0XHRjdHguY2xpcCgpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblx0Y2xvbmUoKSB7XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIodGhpcyk7XHJcblx0fVxyXG5cdGlzTm9ybWFsaXplZCgpOiBib29sZWFuIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5xdWFkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgbmV4dCA9IHRoaXMucXVhZHNbaV07XHJcblx0XHRcdGxldCBwcmV2ID0gdGhpcy5xdWFkc1tpIC0gMV0gfHwgdGhpcy5xdWFkc1t0aGlzLnF1YWRzLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRpZiAobmV4dC5mcm9tIDwgMCB8fCBuZXh0LmZyb20gPj0gMjQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0aWYgKG5leHQuZnJvbSA+PSBuZXh0LnRvKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChpID09IDApIHtcclxuXHRcdFx0XHRpZiAocHJldi50byA+IDI0ICYmIHByZXYudG8gJSAyNCA+IG5leHQuZnJvbSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChwcmV2LnRvID4gbmV4dC5mcm9tKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcmVhcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgbmV4dCA9IHRoaXMuYXJlYXNbaV07XHJcblx0XHRcdGxldCBwcmV2ID0gdGhpcy5hcmVhc1tpIC0gMV0gfHwgdGhpcy5hcmVhc1t0aGlzLmFyZWFzLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRpZiAobmV4dC5mcm9tIDwgMCB8fCBuZXh0LmZyb20gPj0gMjQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0aWYgKG5leHQuZnJvbSA+PSBuZXh0LnRvKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChpID09IDApIHtcclxuXHRcdFx0XHRpZiAocHJldi50byA+IDI0ICYmIHByZXYudG8gJSAyNCA+IG5leHQuZnJvbSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChwcmV2LnRvID4gbmV4dC5mcm9tKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHByZXYudG8gJSAyNCA9PSBuZXh0LmZyb20gJiYgcHJldi5jb2xvciA9PSBuZXh0LmNvbG9yKSB7XHJcblx0XHRcdFx0aWYgKHByZXYgIT0gbmV4dCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdGlmIChuZXh0LmZyb20gIT0gMCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRsZXQgcGxhY2VzID0gQXJyYXk8cXVhZFNoYXBlIHwgJyc+KDI0KS5maWxsKCcnKTtcclxuXHRcdGxldCBwYWludHMgPSBBcnJheTxjb2xvciB8ICcnPigyNCkuZmlsbCgnJyk7XHJcblx0XHRmb3IgKGxldCBxIG9mIHRoaXMucXVhZHMpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IHEuZnJvbTsgaSA8IHEudG87IGkrKykge1xyXG5cdFx0XHRcdGlmIChwbGFjZXNbaSAlIDI0XSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdHBsYWNlc1tpICUgMjRdID0gcS5zaGFwZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgYSBvZiB0aGlzLmFyZWFzKSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSBhLmZyb207IGkgPCBhLnRvOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoIXBsYWNlc1tpICUgMjRdKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0aWYgKHBhaW50c1tpICUgMjRdKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0cGFpbnRzW2kgJSAyNF0gPSBhLmNvbG9yO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBmaXhtZTogY3V0cyBjaGVjaztcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0bm9ybWFsaXplKCk6IHRoaXMge1xyXG5cdFx0aWYgKHRoaXMuaXNOb3JtYWxpemVkKCkpIHJldHVybiB0aGlzO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnF1YWRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBxID0gdGhpcy5xdWFkc1tpXTtcclxuXHRcdFx0aWYgKHEuZnJvbSA+IHEudG8pIHsgdGhpcy5xdWFkcy5zcGxpY2UoaSwgMSk7IGktLTsgY29udGludWU7IH1cclxuXHRcdFx0aWYgKHEuZnJvbSA+PSAyNCkgeyBxLmZyb20gLT0gMjQ7IHEudG8gLT0gMjQ7IH1cclxuXHRcdH1cclxuXHRcdHRoaXMucXVhZHMuc29ydCgoYSwgYikgPT4gYS5mcm9tIC0gYi5mcm9tKTtcclxuXHJcblxyXG5cdFx0bGV0IHBsYWNlcyA9IEFycmF5PHF1YWRTaGFwZSB8ICcnPigyNCkuZmlsbCgnJyk7XHJcblx0XHRsZXQgcGFpbnRzID0gQXJyYXk8Y29sb3IgfCAnJz4oMjQpLmZpbGwoJycpO1xyXG5cdFx0Zm9yIChsZXQgcSBvZiB0aGlzLnF1YWRzKSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSBxLmZyb207IGkgPCBxLnRvOyBpKyspIHtcclxuXHRcdFx0XHRwbGFjZXNbaSAlIDI0XSA9IHEuc2hhcGU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGEgb2YgdGhpcy5hcmVhcykge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gYS5mcm9tOyBpIDwgYS50bzsgaSsrKSB7XHJcblx0XHRcdFx0cGFpbnRzW2kgJSAyNF0gPSBhLmNvbG9yO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIGlmICghcGxhY2VzW2ldKSBwYWludHNbaV0gPSAnJztcclxuXHJcblxyXG5cdFx0dGhpcy5hcmVhcyA9IFtdO1xyXG5cdFx0bGV0IGxhc3Q6IFN6TGF5ZXJBcmVhIHwgdW5kZWZpbmVkO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAyNDsgaSsrKSB7XHJcblx0XHRcdGlmICghcGFpbnRzW2ldKSBjb250aW51ZTtcclxuXHRcdFx0aWYgKGxhc3QgJiYgbGFzdC5jb2xvciA9PSBwYWludHNbaV0gJiYgbGFzdC50byA9PSBpKSB7XHJcblx0XHRcdFx0bGFzdC50bysrO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuYXJlYXMucHVzaChsYXN0ID0gbmV3IFN6TGF5ZXJBcmVhKHtcclxuXHRcdFx0XHRcdGNvbG9yOiBwYWludHNbaV0gYXMgY29sb3IsIGZyb206IGksIHRvOiBpICsgMSwgc2hhcGU6ICdzZWN0b3InLFxyXG5cdFx0XHRcdH0pKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuYXJlYXMubGVuZ3RoID4gMSkge1xyXG5cdFx0XHRsZXQgbGFzdCA9IHRoaXMuYXJlYXNbdGhpcy5hcmVhcy5sZW5ndGggLSAxXVxyXG5cdFx0XHRpZiAobGFzdC5jb2xvciA9PSB0aGlzLmFyZWFzWzBdLmNvbG9yICYmIGxhc3QudG8gJSAyNCA9PSB0aGlzLmFyZWFzWzBdLmZyb20pIHtcclxuXHRcdFx0XHR0aGlzLmFyZWFzW3RoaXMuYXJlYXMubGVuZ3RoIC0gMV0udG8gKz0gdGhpcy5hcmVhc1swXS50bztcclxuXHRcdFx0XHR0aGlzLmFyZWFzLnNwbGljZSgwLCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gZml4bWU6IGN1dHNcclxuXHRcdGlmICghdGhpcy5pc05vcm1hbGl6ZWQoKSkge1xyXG5cdFx0XHRPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgbGF5ZXI6IHRoaXMgfSk7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0xheWVyIGZhaWxlZCB0byBub3JtYWxpemUgcHJvcGVybHkhJywgdGhpcyk7XHJcblx0XHRcdGlmIChjb25maWcuZGVidWdCYWRMYXllcnMpIGRlYnVnZ2VyO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRpc0VtcHR5KCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucXVhZHMubGVuZ3RoID09IDA7XHJcblx0fVxyXG5cclxuXHRnZXRRdWFkQXRTZWN0b3IoczogbnVtYmVyKSB7XHJcblx0XHRsZXQgczEgPSAocyArIDAuNSkgJSAyNCwgczIgPSBzMSArIDI0O1xyXG5cdFx0cmV0dXJuIHRoaXMucXVhZHMuZmluZChxID0+XHJcblx0XHRcdChxLmZyb20gPCBzMSAmJiBxLnRvID4gczEpIHx8IChxLmZyb20gPCBzMiAmJiBxLnRvID4gczIpXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0Y2FuU3RhY2tXaXRoKHVwcGVyOiBTekxheWVyIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XHJcblx0XHRpZiAoIXVwcGVyKSByZXR1cm4gdHJ1ZTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMjQ7IGkrKykge1xyXG5cdFx0XHRsZXQgcTEgPSB0aGlzLmdldFF1YWRBdFNlY3RvcihpKTtcclxuXHRcdFx0bGV0IHEyID0gdXBwZXIuZ2V0UXVhZEF0U2VjdG9yKGkpO1xyXG5cdFx0XHRpZiAocTEgJiYgcTIpIHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRzdGFja1dpdGgodXBwZXI6IFN6TGF5ZXIgfCB1bmRlZmluZWQpOiBTekxheWVyIHtcclxuXHRcdGlmICghdXBwZXIpIHJldHVybiB0aGlzLmNsb25lKCk7XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRhcmVhczogdGhpcy5hcmVhcy5jb25jYXQodXBwZXIuYXJlYXMpLFxyXG5cdFx0XHRxdWFkczogdGhpcy5xdWFkcy5jb25jYXQodXBwZXIucXVhZHMpLFxyXG5cdFx0XHRjdXRzOiB0aGlzLmN1dHMuY29uY2F0KHVwcGVyLmN1dHMpLFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyb3RhdGUocm90OiByb3RhdGlvbjI0KSB7XHJcblx0XHR0aGlzLmFyZWFzLm1hcChlID0+IHsgZS5mcm9tICs9IHJvdDsgZS50byArPSByb3Q7IH0pO1xyXG5cdFx0dGhpcy5jdXRzLm1hcChlID0+IHsgZS5mcm9tICs9IHJvdDsgfSk7XHJcblx0XHR0aGlzLnF1YWRzLm1hcChlID0+IHsgZS5mcm9tICs9IHJvdDsgZS50byArPSByb3Q7IH0pO1xyXG5cdFx0cmV0dXJuIHRoaXMubm9ybWFsaXplKCk7XHJcblx0fVxyXG5cclxuXHJcblx0Y2xvbmVGaWx0ZXJlZEJ5UXVhZHJhbnRzKGluY2x1ZGVRdWFkcmFudHM6IG51bWJlcltdKSB7XHJcblx0XHRjb25zdCBnb29kID0gKG46IG51bWJlcikgPT4gaW5jbHVkZVF1YWRyYW50cy5pbmNsdWRlcygofn4obiAvIDYpKSAlIDQpO1xyXG5cclxuXHRcdGxldCBhbGxvd2VkID0gQXJyYXkoNDgpLmZpbGwoMCkubWFwKChlLCBpKSA9PiBnb29kKGkgKyAwLjUpKTtcclxuXHRcdGZ1bmN0aW9uIGNvbnZlcnQ8VCBleHRlbmRzIFN6TGF5ZXJBcmVhIHwgU3pMYXllckN1dCB8IFN6TGF5ZXJRdWFkPihvbGQ6IFQpOiBUW10ge1xyXG5cdFx0XHRsZXQgZmlsbGVkID0gQXJyYXkoNDgpLmZpbGwoMCkubWFwKChlLCBpKSA9PiBvbGQuZnJvbSA8IGkgKyAwLjUgJiYgaSArIDAuNSA8IG9sZC50byk7XHJcblxyXG5cdFx0XHRsZXQgbGFzdDogVCA9IG9sZC5jbG9uZSgpIGFzIFQ7IGxhc3QudG8gPSAtOTk5O1xyXG5cdFx0XHRsZXQgbGlzdDogVFtdID0gW107XHJcblxyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDQ4OyBpKyspIHtcclxuXHRcdFx0XHRpZiAoIWZpbGxlZFtpXSkgY29udGludWU7XHJcblx0XHRcdFx0aWYgKCFhbGxvd2VkW2ldKSBjb250aW51ZTtcclxuXHRcdFx0XHRpZiAobGFzdC50byAhPSBpKSB7XHJcblx0XHRcdFx0XHRsYXN0ID0gb2xkLmNsb25lKCkgYXMgVDtcclxuXHRcdFx0XHRcdGxhc3QuZnJvbSA9IGk7XHJcblx0XHRcdFx0XHRsYXN0LnRvID0gaSArIDE7XHJcblx0XHRcdFx0XHRsaXN0LnB1c2gobGFzdCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGxhc3QudG8rKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGxpc3Q7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRhcmVhczogdGhpcy5hcmVhcy5mbGF0TWFwKGNvbnZlcnQpLFxyXG5cdFx0XHRxdWFkczogdGhpcy5xdWFkcy5mbGF0TWFwKGNvbnZlcnQpLFxyXG5cdFx0XHRjdXRzOiB0aGlzLmN1dHMuZmxhdE1hcChjb252ZXJ0KSxcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Y2xvbmVBc0NvdmVyKCkge1xyXG5cdFx0ZnVuY3Rpb24gY29udmVydChxdWFkOiBTekxheWVyUXVhZCkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJRdWFkKHtcclxuXHRcdFx0XHRjb2xvcjogJ2NvdmVyJyxcclxuXHRcdFx0XHRzaGFwZTogJ2NvdmVyJyxcclxuXHRcdFx0XHRmcm9tOiBxdWFkLmZyb20sIHRvOiBxdWFkLnRvLFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdHF1YWRzOiB0aGlzLnF1YWRzLmZsYXRNYXAoY29udmVydCksXHJcblx0XHR9KS5wYWludCgnY292ZXInKS5ub3JtYWxpemUoKTtcclxuXHR9XHJcblx0cmVtb3ZlQ292ZXIoKSB7XHJcblx0XHR0aGlzLnF1YWRzID0gdGhpcy5xdWFkcy5maWx0ZXIoZSA9PiBlLnNoYXBlICE9ICdjb3ZlcicpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdGZpbHRlclBhaW50KHBhaW50OiAoY29sb3IgfCBudWxsKVtdKTogKGNvbG9yIHwgbnVsbClbXSB7XHJcblx0XHRyZXR1cm4gcGFpbnQubWFwKChlLCBpKSA9PiB7XHJcblx0XHRcdGxldCBxdWFkID0gdGhpcy5nZXRRdWFkQXRTZWN0b3IoaSk7XHJcblx0XHRcdHJldHVybiBxdWFkICYmIHF1YWQuc2hhcGUgPT0gJ2NvdmVyJyA/IG51bGwgOiBlO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdHBhaW50KHBhaW50OiAoY29sb3IgfCBudWxsKVtdIHwgY29sb3IpIHtcclxuXHRcdGlmICghQXJyYXkuaXNBcnJheShwYWludCkpIHBhaW50ID0gQXJyYXk8Y29sb3IgfCBudWxsPigyNCkuZmlsbChwYWludCk7XHJcblx0XHRwYWludC5tYXAoKGNvbG9yLCBpKSA9PiB7XHJcblx0XHRcdGlmIChjb2xvcikge1xyXG5cdFx0XHRcdHRoaXMuYXJlYXMucHVzaChuZXcgU3pMYXllckFyZWEoe1xyXG5cdFx0XHRcdFx0Y29sb3IsXHJcblx0XHRcdFx0XHRmcm9tOiBpLCB0bzogaSArIDEsXHJcblx0XHRcdFx0XHRzaGFwZTogJ3NlY3RvcicsXHJcblx0XHRcdFx0fSkpXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHRoaXMubm9ybWFsaXplKCk7O1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGZyb21TaGFwZXpIYXNoKGhhc2g6IHN0cmluZyk6IFN6TGF5ZXI7XHJcblx0c3RhdGljIGZyb21TaGFwZXpIYXNoKGhhc2g6IHN0cmluZywgZXJyOiBib29sZWFuKTogU3pMYXllciB8IG51bGw7XHJcblx0c3RhdGljIGZyb21TaGFwZXpIYXNoKGhhc2g6IHN0cmluZywgZXJyID0gdHJ1ZSk6IFN6TGF5ZXIgfCBudWxsIHtcclxuXHRcdGlmIChoYXNoWzBdID09ICc2JykgaGFzaCA9IGhhc2guc2xpY2UoMSk7XHJcblx0XHRpZiAoaGFzaC5sZW5ndGggIT0gOCAmJiBoYXNoLmxlbmd0aCAhPSAxMikge1xyXG5cdFx0XHRpZiAoIWVycikgcmV0dXJuIG51bGw7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzaGFwZSBoYXNoOiAke2hhc2h9YCk7XHJcblx0XHR9XHJcblx0XHRsZXQgYW5nbGUgPSAyNCAvIChoYXNoLmxlbmd0aCAvIDIpO1xyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyKHtcclxuXHRcdFx0YXJlYXM6IGhhc2gubWF0Y2goLy4uL2cpIS5tYXAoKHMsIGkpID0+IHtcclxuXHRcdFx0XHRpZiAoc1swXSA9PSAnLScpIHJldHVybiBudWxsIGFzIGFueSBhcyBTekxheWVyQXJlYTtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJBcmVhKHtcclxuXHRcdFx0XHRcdHNoYXBlOiAnc2VjdG9yJyxcclxuXHRcdFx0XHRcdGNvbG9yOiBTekluZm8uY29sb3IuYnlDaGFyW3NbMV1dLm5hbWUsXHJcblx0XHRcdFx0XHRmcm9tOiBpICogYW5nbGUsXHJcblx0XHRcdFx0XHR0bzogKGkgKyAxKSAqIGFuZ2xlLFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KS5maWx0ZXIoZSA9PiBlKSxcclxuXHRcdFx0cXVhZHM6IGhhc2gubWF0Y2goLy4uL2cpIS5tYXAoKHMsIGkpID0+IHtcclxuXHRcdFx0XHRpZiAoc1swXSA9PSAnLScpIHJldHVybiBudWxsIGFzIGFueSBhcyBTekxheWVyUXVhZDtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJRdWFkKHtcclxuXHRcdFx0XHRcdHNoYXBlOiBTekluZm8ucXVhZC5ieUNoYXJbc1swXV0ubmFtZSxcclxuXHRcdFx0XHRcdGNvbG9yOiBTekluZm8uY29sb3IuYnlDaGFyW3NbMV1dLm5hbWUsXHJcblx0XHRcdFx0XHRmcm9tOiBpICogYW5nbGUsXHJcblx0XHRcdFx0XHR0bzogKGkgKyAxKSAqIGFuZ2xlLFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KS5maWx0ZXIoZSA9PiBlKSxcclxuXHRcdFx0Y3V0czogW10sXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHRnZXRIYXNoKCk6IHN0cmluZyB7XHJcblx0XHRmb3IgKGxldCBxbiBvZiBbNCwgNl0pIHtcclxuXHRcdFx0bGV0IHF3ID0gMjQgLyBxbjtcclxuXHRcdFx0aWYgKCF0aGlzLnF1YWRzLmV2ZXJ5KGUgPT4gZS5mcm9tICUgcXcgPT0gMCAmJiBlLnRvIC0gZS5mcm9tID09IHF3KSkgY29udGludWU7XHJcblx0XHRcdGlmICghdGhpcy5hcmVhcy5ldmVyeShlID0+IGUuZnJvbSAlIHF3ID09IDAgJiYgZS50byAlIHF3ID09IDApKSBjb250aW51ZTtcclxuXHJcblx0XHRcdGxldCBkYXRhID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogcW4gfSwgKF8sIGkpID0+ICh7IHNoYXBlOiAnLScsIGNvbG9yOiAnLScgfSkpO1xyXG5cdFx0XHRmb3IgKGxldCBxIG9mIHRoaXMucXVhZHMpIHtcclxuXHRcdFx0XHRkYXRhW3EuZnJvbSAvIHF3XS5zaGFwZSA9IFN6SW5mby5xdWFkLmJ5TmFtZVtxLnNoYXBlXS5jb2RlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGEgb2YgdGhpcy5hcmVhcykge1xyXG5cdFx0XHRcdGZvciAobGV0IGkgPSBhLmZyb20gLyBxdzsgaSA8IGEudG8gLyBxdzsgaSsrKSB7XHJcblx0XHRcdFx0XHRkYXRhW2kgJSBxbl0uY29sb3IgPSBTekluZm8uY29sb3IuYnlOYW1lW2EuY29sb3JdLmNvZGU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBkYXRhLm1hcCgoeyBzaGFwZSwgY29sb3IgfSkgPT4gc2hhcGUgPT0gJy0nID8gJy0tJyA6IHNoYXBlICsgY29sb3IpLmpvaW4oJycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBgbCF6fHEhJHt0aGlzLnF1YWRzLm1hcChlID0+IGUuZ2V0SGFzaCgpKS5qb2luKCcsJylcclxuXHRcdFx0fXxhISR7dGhpcy5hcmVhcy5tYXAoZSA9PiBlLmdldEhhc2goKSkuam9pbignLCcpXHJcblx0XHRcdH18YyEke3RoaXMuY3V0cy5tYXAoZSA9PiBlLmdldEhhc2goKSkuam9pbignLCcpXHJcblx0XHRcdH1gO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGZyb21TaG9ydEtleShrZXk6IHN0cmluZyk6IGFueSB7XHJcblx0XHRpZiAoa2V5LnN0YXJ0c1dpdGgoJ3N6IScpKSB7IGtleSA9IGtleS5zbGljZSgzKTsgfVxyXG5cdFx0aWYgKGtleS5zdGFydHNXaXRoKCdsIXp8JykpIHtcclxuXHRcdFx0bGV0IGxheWVyID0gbmV3IFN6TGF5ZXIoKTtcclxuXHRcdFx0Zm9yIChsZXQgcGFydCBvZiBrZXkuc3BsaXQoJ3wnKSkge1xyXG5cdFx0XHRcdGlmIChwYXJ0LnN0YXJ0c1dpdGgoJ3EhJykpIHtcclxuXHRcdFx0XHRcdGxldCBzdHJzID0gcGFydC5zbGljZSgncSEnLmxlbmd0aCkuc3BsaXQoJywnKTtcclxuXHRcdFx0XHRcdGxheWVyLnF1YWRzID0gc3Rycy5tYXAoZSA9PiBTekxheWVyUXVhZC5mcm9tU2hvcnRLZXkoZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocGFydC5zdGFydHNXaXRoKCdhIScpKSB7XHJcblx0XHRcdFx0XHRsZXQgc3RycyA9IHBhcnQuc2xpY2UoJ2EhJy5sZW5ndGgpLnNwbGl0KCcsJyk7XHJcblx0XHRcdFx0XHRsYXllci5hcmVhcyA9IHN0cnMubWFwKGUgPT4gU3pMYXllckFyZWEuZnJvbVNob3J0S2V5KGUpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHBhcnQuc3RhcnRzV2l0aCgnYyEnKSkge1xyXG5cdFx0XHRcdFx0bGV0IHN0cnMgPSBwYXJ0LnNsaWNlKCdjIScubGVuZ3RoKS5zcGxpdCgnLCcpO1xyXG5cdFx0XHRcdFx0bGF5ZXIuY3V0cyA9IHN0cnMubWFwKGUgPT4gU3pMYXllckN1dC5mcm9tU2hvcnRLZXkoZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbGF5ZXI7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gU3pMYXllci5mcm9tU2hhcGV6SGFzaChrZXkpO1xyXG5cdH1cclxufVxyXG4iXX0=