const config = {
    disableCuts: true,
    disableQuadColors: false,
    debugBadLayers: true,
};
export var SzInfo;
(function (SzInfo) {
    let color;
    (function (color_1) {
        color_1.outline = "#55575a";
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
            { name: 'grey', style: 'grey', code: 'u' },
            { name: 'white', style: 'white', code: 'w' },
            { name: 'none', style: 'none', code: '-' },
        ];
        Object.assign(globalThis, { list: color_1.list });
        color_1.colorList = color_1.list.map(e => e.name);
        color_1.byName = Object.fromEntries(color_1.list.map(e => [e.name, e]));
        color_1.byChar = Object.fromEntries(color_1.list.map(e => [e.code, e]));
        color_1.byCombo = Object.fromEntries(color_1.list.filter(e => e.combo).map(e => [e.combo, e]));
        function exampleLayer(color) {
            let i = 0, d = 4;
            return new SzLayer({
                quads: [
                    { shape: 'circle', from: i, to: i += 6, color },
                    { shape: 'square', from: i, to: i += 6, color },
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
            { name: 'circle', code: 'C', combo: 'C', spawn: '6CuCuCuCuCuCu' },
            { name: 'square', code: 'R', combo: 'R', spawn: '6RuRuRuRuRuRu' },
            { name: 'star', code: 'S', combo: 'S', spawn: '6SuSuSuSuSuSu' },
            { name: 'windmill', code: 'W', combo: 'W', spawn: '6WuWuWuWuWuWu' },
        ];
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
            circleSpawn: '6CuCuCuCuCuCu',
            squareSpawn: '6RuRuRuRuRuRu',
            starSpawn: '6SuSuSuSuSuSu',
            windmillSpawn: '6WuWuWuWuWuWu',
        };
        Object.assign(quad_1.named, Object.fromEntries(Object.keys(quad_1.named6).flatMap(k => {
            let s4 = quad_1.named4[k];
            let s6 = quad_1.named6[k];
            let a = [];
            if (s4)
                a.push([k + 4, s4]);
            if (s4)
                a.push([s4, s6]);
            if (s6)
                a.push([k, s6]);
            return a;
        })));
        console.log({ named: quad_1.named });
        Object.assign(globalThis, { named: quad_1.named });
        quad_1.byName = Object.fromEntries(quad_1.list.map(e => [e.name, e]));
        quad_1.byChar = Object.fromEntries(quad_1.list.map(e => [e.code, e]));
        function exampleLayer(shape) {
            let i = 0, d = 4;
            return new SzLayer({
                quads: [
                    { shape, from: i, to: i += d, color: 'grey' },
                    { shape, from: i, to: i += d, color: 'grey' },
                    { shape, from: i, to: i += d, color: 'grey' },
                    { shape, from: i, to: i += d, color: 'grey' },
                    { shape, from: i, to: i += d, color: 'grey' },
                    { shape, from: i, to: i += d, color: 'grey' },
                ],
            });
        }
        quad_1.exampleLayer = exampleLayer;
        quad_1.quadList = quad_1.list.map(e => e.name);
    })(quad = SzInfo.quad || (SzInfo.quad = {}));
    let s = Array(100).fill(0).map((e, i) => i.toString(36)).join('').slice(0, 36);
    s += s.slice(10).toUpperCase();
    SzInfo.nToChar = s.split('');
    SzInfo.charToN = Object.fromEntries(SzInfo.nToChar.map((e, i) => [e, i]));
})(SzInfo || (SzInfo = {}));
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
const testTemplate = {
    quads: [
        { shape: 'square', color: 'green', from: 2, to: 4 },
        { shape: 'circle', color: 'pink', from: 5, to: 19 },
        { shape: 'square', color: 'green', from: 20, to: 22 },
    ],
};
export class SzLayer {
    layerIndex = 0;
    quads = [];
    static createTest() {
        let l = new SzLayer(testTemplate);
        console.error('test layer', l);
        return l;
    }
    constructor(source, layerIndex) {
        if (source) {
            this.quads = (source.quads ?? []).map(e => new SzLayerQuad(e));
            if (source.layerIndex) {
                this.layerIndex = source.layerIndex;
            }
        }
        if (layerIndex != null) {
            this.layerIndex = layerIndex;
        }
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
            this.quads.forEach(q => ctx.saved(ctx => this.fillQuad(q, ctx)));
        });
        ctx.saved(ctx => this.drawQuadOutline(ctx, true));
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
        ctx.strokeStyle = SzInfo.color.outline; // 'orange';
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
        let places = Array(24).fill('');
        let paints = Array(24).fill('');
        for (let q of this.quads) {
            for (let i = q.from; i < q.to; i++) {
                if (places[i % 24])
                    return false;
                places[i % 24] = q.shape;
            }
        }
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
        for (let i = 0; i < 24; i++)
            if (!places[i])
                paints[i] = '';
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
        if (!this.canStackWith(upper)) {
            console.error('Invalid stacking requested!');
            debugger;
            return this.clone();
        }
        if (!upper)
            return this.clone();
        return new SzLayer({
            quads: this.quads.concat(upper.quads),
        });
    }
    rotate(rot) {
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
            quads: this.quads.flatMap(convert),
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
        if (Array.isArray(paint))
            throw this;
        this.quads.map(e => e.color = paint);
        // if (!Array.isArray(paint)) paint = Array<color | null>(24).fill(paint);
        // paint.map((color, i) => {
        // 	if (color) {
        // 		this.areas.push(new SzLayerArea({
        // 			color,
        // 			from: i, to: i + 1,
        // 			shape: 'sector',
        // 		}))
        // 	}
        // });
        return this.normalize();
        ;
    }
    static fromShapezHash(hash) {
        let angle = 6;
        if (hash[0] == '6') {
            angle = 4;
            hash = hash.slice(1);
        }
        return new SzLayer({
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
        });
    }
    getHash() {
        if (this.quads.every(e => e.to - e.from == 6)) {
            return [0, 1, 2, 3].map(i => {
                let q = this.quads.find(q => q.from == i * 6);
                if (!q)
                    return '--';
                return q.getHash().slice(0, 2);
            }).join('');
        }
        return '6' + [0, 1, 2, 3, 4, 5].map(i => {
            let q = this.quads.find(q => q.from == i * 4);
            if (!q)
                return '--';
            return q.getHash().slice(0, 2);
        }).join('');
    }
    static fromShortKey(key) {
        if (key.startsWith('6') || !key.startsWith('!') && key.length == 8) {
            return SzLayer.fromShapezHash(key);
        }
        if (key.startsWith('sz!'))
            key = key.slice(3);
        if (!key.startsWith('l!z|'))
            throw new Error('invalid hash');
        let layer = new SzLayer();
        for (let part of key.split('|')) {
            if (part.startsWith('q!')) {
                let strs = part.slice('q!'.length).split(',');
                layer.quads = strs.map(e => SzLayerQuad.fromShortKey(e));
            }
        }
        return layer;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiQGRpbWF2YS9oZXhhZ29uYWwvIiwic291cmNlcyI6WyJzaGFwZXN0L2xheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sTUFBTSxHQUFHO0lBQ2QsV0FBVyxFQUFFLElBQUk7SUFDakIsaUJBQWlCLEVBQUUsS0FBSztJQUN4QixjQUFjLEVBQUUsSUFBSTtDQUNwQixDQUFBO0FBc0JELE1BQU0sS0FBVyxNQUFNLENBb050QjtBQXBORCxXQUFpQixNQUFNO0lBQ3RCLElBQWlCLEtBQUssQ0FrRHJCO0lBbERELFdBQWlCLE9BQUs7UUFDUixlQUFPLEdBQUcsU0FBUyxDQUFDO1FBRWpDLE1BQU0sa0JBQWtCLEdBQUc7WUFDMUIsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRO1lBQ3pCLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTTtZQUM1QixNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU07U0FDZixDQUFDO1FBQ1gsTUFBTSxpQkFBaUIsR0FBRztZQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU87U0FDZixDQUFDO1FBSUUsWUFBSSxHQUF5QjtZQUN6QyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDdEQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQzVELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUM1RCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDMUQs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QUM7UUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3RCxJQUFJLEtBQUssR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzFCLEtBQUssSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNoQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pEO1NBQ0Q7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoYXIsIHJvdGF0aW9uMjQsIHN0eWxlU3RyaW5nLCBTekNvbnRleHQyRCB9IGZyb20gXCIuL1N6Q29udGV4dDJELmpzXCI7XHJcblxyXG5jb25zdCBjb25maWcgPSB7XHJcblx0ZGlzYWJsZUN1dHM6IHRydWUsXHJcblx0ZGlzYWJsZVF1YWRDb2xvcnM6IGZhbHNlLFxyXG5cdGRlYnVnQmFkTGF5ZXJzOiB0cnVlLFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBjdXRTaGFwZSA9IChcclxuXHR8ICdsaW5lJ1xyXG4pO1xyXG5leHBvcnQgdHlwZSBxdWFkU2hhcGUgPSAoXHJcblx0fCAnY2lyY2xlJyB8ICdzcXVhcmUnIHwgJ3N0YXInIHwgJ3dpbmRtaWxsJ1xyXG5cdHwgJ2NvdmVyJ1xyXG4pO1xyXG5leHBvcnQgdHlwZSBhcmVhU2hhcGUgPSAoXHJcblx0fCAnd2hvbGUnIHwgJ3NlY3RvcidcclxuKTtcclxuZXhwb3J0IHR5cGUgY29sb3IgPVxyXG5cdHwgJ3JlZCcgfCAnb3JhbmdlJyB8ICd5ZWxsb3cnXHJcblx0fCAnbGF3bmdyZWVuJyB8ICdncmVlbicgfCAnY3lhbidcclxuXHR8ICdibHVlJyB8ICdwdXJwbGUnIHwgJ3BpbmsnXHJcblx0fCAnYmxhY2snIHwgJ2dyZXknIHwgJ3doaXRlJ1xyXG5cdHwgJ2NvdmVyJyB8ICdub25lJztcclxuXHJcbmV4cG9ydCB0eXBlIGNvbG9yQ2hhciA9ICdyJyB8ICdnJyB8ICdiJyB8ICctJztcclxuZXhwb3J0IHR5cGUgY29sb3JTdHJpbmcgPSBgJHtjb2xvckNoYXJ9JHtjb2xvckNoYXJ9JHtjb2xvckNoYXJ9YDtcclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgU3pJbmZvIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIGNvbG9yIHtcclxuXHRcdGV4cG9ydCBjb25zdCBvdXRsaW5lID0gXCIjNTU1NzVhXCI7XHJcblxyXG5cdFx0Y29uc3QgY29sb3JXaGVlbE5hbWVMaXN0ID0gW1xyXG5cdFx0XHQncmVkJywgJ29yYW5nZScsICd5ZWxsb3cnLFxyXG5cdFx0XHQnbGF3bmdyZWVuJywgJ2dyZWVuJywgJ2N5YW4nLFxyXG5cdFx0XHQnYmx1ZScsICdwdXJwbGUnLCAncGluaycsXHJcblx0XHRdIGFzIGNvbnN0O1xyXG5cdFx0Y29uc3QgY29sb3JHcmV5TmFtZUxpc3QgPSBbXHJcblx0XHRcdCdibGFjaycsICdncmV5JywgJ3doaXRlJyxcclxuXHRcdF0gYXMgY29uc3Q7XHJcblxyXG5cdFx0ZXhwb3J0IHR5cGUgY29sb3JJbmZvID0geyBuYW1lOiBjb2xvciwgc3R5bGU6IHN0eWxlU3RyaW5nLCBjb2RlOiBjaGFyLCBjb21ibz86IGNvbG9yU3RyaW5nIH07IC8vIGJiZ2dyclxyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBsaXN0OiByZWFkb25seSBjb2xvckluZm9bXSA9IFtcclxuXHRcdFx0eyBuYW1lOiAncmVkJywgc3R5bGU6ICdyZWQnLCBjb2RlOiAncicsIGNvbWJvOiAncnJyJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdvcmFuZ2UnLCBzdHlsZTogJ29yYW5nZScsIGNvZGU6ICdvJywgY29tYm86ICdncnInIH0sXHJcblx0XHRcdHsgbmFtZTogJ3llbGxvdycsIHN0eWxlOiAneWVsbG93JywgY29kZTogJ3knLCBjb21ibzogJ2dncicgfSxcclxuXHRcdFx0eyBuYW1lOiAnZ3JlZW4nLCBzdHlsZTogJ2dyZWVuJywgY29kZTogJ2cnLCBjb21ibzogJ2dnZycgfSxcclxuXHRcdFx0eyBuYW1lOiAnbGF3bmdyZWVuJywgc3R5bGU6ICdsYXduZ3JlZW4nLCBjb2RlOiAnbCcsIGNvbWJvOiAnYmdnJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdjeWFuJywgc3R5bGU6ICdjeWFuJywgY29kZTogJ2MnLCBjb21ibzogJ2JiZycgfSxcclxuXHRcdFx0eyBuYW1lOiAnYmx1ZScsIHN0eWxlOiAnYmx1ZScsIGNvZGU6ICdiJywgY29tYm86ICdiYmInIH0sXHJcblx0XHRcdHsgbmFtZTogJ3B1cnBsZScsIHN0eWxlOiAncHVycGxlJywgY29kZTogJ3YnLCBjb21ibzogJ2JicicgfSxcclxuXHRcdFx0eyBuYW1lOiAncGluaycsIHN0eWxlOiAncGluaycsIGNvZGU6ICdwJywgY29tYm86ICdicnInIH0sXHJcblx0XHRcdHsgbmFtZTogJ2dyZXknLCBzdHlsZTogJ2dyZXknLCBjb2RlOiAndScgfSxcclxuXHRcdFx0eyBuYW1lOiAnd2hpdGUnLCBzdHlsZTogJ3doaXRlJywgY29kZTogJ3cnIH0sXHJcblx0XHRcdHsgbmFtZTogJ25vbmUnLCBzdHlsZTogJ25vbmUnLCBjb2RlOiAnLScgfSxcclxuXHRcdF0gYXMgY29uc3Q7XHJcblx0XHRPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgbGlzdCB9KTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgY29sb3JMaXN0ID0gbGlzdC5tYXAoZSA9PiBlLm5hbWUpO1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBieU5hbWU6IFJlY29yZDxjb2xvciwgY29sb3JJbmZvPiA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0Lm1hcChlID0+IFtlLm5hbWUsIGVdIGFzIGNvbnN0KSk7XHJcblx0XHRleHBvcnQgY29uc3QgYnlDaGFyOiBSZWNvcmQ8Y2hhciwgY29sb3JJbmZvPiA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0Lm1hcChlID0+IFtlLmNvZGUsIGVdIGFzIGNvbnN0KSk7XHJcblx0XHRleHBvcnQgY29uc3QgYnlDb21ibzogUmVjb3JkPGNvbG9yU3RyaW5nLCBjb2xvckluZm8+ID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QuZmlsdGVyKGUgPT4gZS5jb21ibykubWFwKGUgPT4gW2UuY29tYm8hLCBlXSkpO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBleGFtcGxlTGF5ZXIoY29sb3I6IGNvbG9yKSB7XHJcblx0XHRcdGxldCBpID0gMCwgZCA9IDQ7XHJcblx0XHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdFx0cXVhZHM6IFtcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdjaXJjbGUnLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvciB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZTogJ3NxdWFyZScsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnY2lyY2xlJywgZnJvbTogaSwgdG86IGkgKz0gNiwgY29sb3IgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdzcXVhcmUnLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvciB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZTogJ2NpcmNsZScsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnc3F1YXJlJywgZnJvbTogaSwgdG86IGkgKz0gNiwgY29sb3IgfSxcclxuXHRcdFx0XHRdXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBxdWFkIHtcclxuXHRcdGV4cG9ydCB0eXBlIHF1YWRJbmZvID0ge1xyXG5cdFx0XHRuYW1lOiBxdWFkU2hhcGUsIGNvZGU6IGNoYXIsIGNvbWJvPzogc3RyaW5nLCBzcGF3bj86IHN0cmluZyxcclxuXHRcdFx0cGF0aD86IChjdHg6IFN6Q29udGV4dDJELCBxdWFkOiBTekxheWVyUXVhZCkgPT4gdm9pZCxcclxuXHRcdH07XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IGxpc3Q6IHF1YWRJbmZvW10gPSBbXHJcblx0XHRcdHsgbmFtZTogJ2NpcmNsZScsIGNvZGU6ICdDJywgY29tYm86ICdDJywgc3Bhd246ICc2Q3VDdUN1Q3VDdUN1JyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdzcXVhcmUnLCBjb2RlOiAnUicsIGNvbWJvOiAnUicsIHNwYXduOiAnNlJ1UnVSdVJ1UnVSdScgfSxcclxuXHRcdFx0eyBuYW1lOiAnc3RhcicsIGNvZGU6ICdTJywgY29tYm86ICdTJywgc3Bhd246ICc2U3VTdVN1U3VTdVN1JyB9LFxyXG5cdFx0XHR7IG5hbWU6ICd3aW5kbWlsbCcsIGNvZGU6ICdXJywgY29tYm86ICdXJywgc3Bhd246ICc2V3VXdVd1V3VXdVd1JyB9LFxyXG5cdFx0XTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgbmFtZWQ0ID0ge1xyXG5cclxuXHRcdFx0Y2lyY2xlU3Bhd246ICdDdUN1Q3VDdScsXHJcblx0XHRcdHNxdWFyZVNwYXduOiAnUnVSdVJ1UnUnLFxyXG5cdFx0XHRzdGFyU3Bhd246ICdTdVN1U3VTdScsXHJcblx0XHRcdHdpbmRtaWxsU3Bhd246ICdXdVd1V3VXdScsXHJcblxyXG5cdFx0XHRjaXJjbGVCb3R0b206ICctLUN1Q3UtLScsXHJcblxyXG5cdFx0XHRjaXJjbGU6IFwiQ3VDdUN1Q3VcIixcclxuXHRcdFx0Y2lyY2xlSGFsZjogXCItLS0tQ3VDdVwiLFxyXG5cdFx0XHRyZWN0OiBcIlJ1UnVSdVJ1XCIsXHJcblx0XHRcdHJlY3RIYWxmOiBcIlJ1UnUtLS0tXCIsXHJcblx0XHRcdGNpcmNsZUhhbGZSb3RhdGVkOiBcIkN1LS0tLUN1XCIsXHJcblx0XHRcdGNpcmNsZVF1YWQ6IFwiQ3UtLS0tLS1cIixcclxuXHRcdFx0Y2lyY2xlUmVkOiBcIkNyQ3JDckNyXCIsXHJcblx0XHRcdHJlY3RIYWxmQmx1ZTogXCJSYlJiLS0tLVwiLFxyXG5cdFx0XHRjaXJjbGVQdXJwbGU6IFwiQ3BDcENwQ3BcIixcclxuXHRcdFx0c3RhckN5YW46IFwiU2NTY1NjU2NcIixcclxuXHRcdFx0ZmlzaDogXCJDZ1NjU2NDZ1wiLFxyXG5cdFx0XHRibHVlcHJpbnQ6IFwiQ2JDYkNiUmI6Q3dDd0N3Q3dcIixcclxuXHRcdFx0cmVjdENpcmNsZTogXCJScFJwUnBScDpDd0N3Q3dDd1wiLFxyXG5cdFx0XHR3YXRlcm1lbG9uOiBcIi0tQ2ctLS0tOi0tQ3ItLS0tXCIsXHJcblx0XHRcdHN0YXJDaXJjbGU6IFwiU3JTclNyU3I6Q3lDeUN5Q3lcIixcclxuXHRcdFx0c3RhckNpcmNsZVN0YXI6IFwiU3JTclNyU3I6Q3lDeUN5Q3k6U3dTd1N3U3dcIixcclxuXHRcdFx0ZmFuOiBcIkNiUmJSYkNiOkN3Q3dDd0N3OldiV2JXYldiXCIsXHJcblx0XHRcdG1vbnN0ZXI6IFwiU2ctLS0tU2c6Q2dDZ0NnQ2c6LS1DeUN5LS1cIixcclxuXHRcdFx0Ym91cXVldDogXCJDcFJwQ3AtLTpTd1N3U3dTd1wiLFxyXG5cdFx0XHRsb2dvOiBcIlJ1Q3ctLUN3Oi0tLS1SdS0tXCIsXHJcblx0XHRcdHRhcmdldDogXCJDckN3Q3JDdzpDd0NyQ3dDcjpDckN3Q3JDdzpDd0NyQ3dDclwiLFxyXG5cdFx0XHRzcGVlZG9tZXRlcjogXCJDZy0tLS1DcjpDdy0tLS1DdzpTeS0tLS0tLTpDeS0tLS1DeVwiLFxyXG5cdFx0XHQvLyBzcGlrZWRCYWxsOiBcIkNjU3lDY1N5OlN5Q2NTeUNjOkNjU3lDY1N5OlN5Q2NTeUNjXCIsXHJcblx0XHRcdHNwaWtlZEJhbGw6IFwiQ2NTeUNjU3k6U3lDY1N5Q2M6Q2NTeUNjU3lcIixcclxuXHRcdFx0Y29tcGFzczogXCJDY1JjQ2NSYzpSd0N3UndDdzpTci0tU3ctLTpDeUN5Q3lDeVwiLFxyXG5cdFx0XHRwbGFudDogXCJSZy0tUmctLTpDd1J3Q3dSdzotLVJnLS1SZ1wiLFxyXG5cdFx0XHRyb2NrZXQ6IFwiQ2JDdUNiQ3U6U3ItLS0tLS06LS1DclNyQ3I6Q3dDd0N3Q3dcIixcclxuXHJcblx0XHRcdG1pbGw6IFwiQ3dDd0N3Q3c6V2JXYldiV2JcIixcclxuXHRcdFx0c3RhcjogXCJTdVN1U3VTdVwiLFxyXG5cdFx0XHRjaXJjbGVTdGFyOiBcIkN3Q3JDd0NyOlNnU2dTZ1NnXCIsXHJcblx0XHRcdGNsb3duOiBcIldyUmdXclJnOkN3Q3JDd0NyOlNnU2dTZ1NnXCIsXHJcblx0XHRcdHdpbmRtaWxsUmVkOiBcIldyV3JXcldyXCIsXHJcblx0XHRcdGZhblRyaXBsZTogXCJXcFdwV3BXcDpDd0N3Q3dDdzpXcFdwV3BXcFwiLFxyXG5cdFx0XHRmYW5RdWFkcnVwbGU6IFwiV3BXcFdwV3A6Q3dDd0N3Q3c6V3BXcFdwV3A6Q3dDd0N3Q3dcIixcclxuXHJcblx0XHRcdGJpcmQ6IFwiU3ItLS0tLS06LS1DZy0tQ2c6U2ItLVNiLS06LS1Ddy0tQ3dcIixcclxuXHRcdFx0c2Npc3NvcnM6IFwiU3ItLS0tLS06LS1DZ0NnQ2c6LS1TYi0tLS06Q3ctLUN3Q3dcIixcclxuXHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBuYW1lZDYgPSB7XHJcblx0XHRcdGNpcmNsZVNwYXduOiAnNkN1Q3VDdUN1Q3VDdScsXHJcblx0XHRcdHNxdWFyZVNwYXduOiAnNlJ1UnVSdVJ1UnVSdScsXHJcblx0XHRcdHN0YXJTcGF3bjogJzZTdVN1U3VTdVN1U3UnLFxyXG5cdFx0XHR3aW5kbWlsbFNwYXduOiAnNld1V3VXdVd1V3VXdScsXHJcblxyXG5cdFx0XHRjaXJjbGVCb3R0b206ICc2LS0tLUN1Q3VDdS0tJyxcclxuXHJcblx0XHRcdGNpcmNsZTogXCI2Q3VDdUN1Q3VDdUN1XCIsXHJcblx0XHRcdGNpcmNsZUhhbGY6IFwiNi0tLS0tLUN1Q3VDdVwiLFxyXG5cdFx0XHRyZWN0OiBcIjZSdVJ1UnVSdVJ1UnVcIixcclxuXHRcdFx0cmVjdEhhbGY6IFwiNlJ1UnVSdS0tLS0tLVwiLFxyXG5cdFx0XHRjaXJjbGVIYWxmUm90YXRlZDogXCI2Q3UtLS0tLS1DdUN1XCIsXHJcblx0XHRcdGNpcmNsZVF1YWQ6IFwiNkN1Q3UtLS0tLS0tLVwiLFxyXG5cdFx0XHRjaXJjbGVSZWQ6IFwiNkNyQ3JDckNyQ3JDclwiLFxyXG5cdFx0XHRyZWN0SGFsZkJsdWU6IFwiNlJiUmJSYi0tLS0tLVwiLFxyXG5cdFx0XHRjaXJjbGVQdXJwbGU6IFwiNkNwQ3BDcENwQ3BDcFwiLFxyXG5cdFx0XHRzdGFyQ3lhbjogXCI2U2NTY1NjU2NTY1NjXCIsXHJcblx0XHRcdGZpc2g6IFwiNkNnQ2dTY1NjQ2dDZ1wiLFxyXG5cdFx0XHRibHVlcHJpbnQ6IFwiNkNiQ2JDYkNiQ2JSYjo2Q3dDd0N3Q3dDd0N3XCIsXHJcblx0XHRcdHJlY3RDaXJjbGU6IFwiNlJwUnBScFJwUnBScDo2Q3dDd0N3Q3dDd0N3XCIsXHJcblx0XHRcdHdhdGVybWVsb246IFwiNi0tQ2dDZy0tLS0tLTo2LS1DckNyLS0tLS0tXCIsXHJcblx0XHRcdHN0YXJDaXJjbGU6IFwiNlNyU3JTclNyU3JTcjo2Q3lDeUN5Q3lDeUN5XCIsXHJcblx0XHRcdHN0YXJDaXJjbGVTdGFyOiBcIjZTclNyU3JTclNyU3I6NkN5Q3lDeUN5Q3lDeTo2U3dTd1N3U3dTd1N3XCIsXHJcblx0XHRcdGZhbjogXCI2Q2JDYlJiUmJDYkNiOjZDd0N3Q3dDd0N3Q3c6NldiV2JXYldiV2JXYlwiLFxyXG5cdFx0XHRtb25zdGVyOiBcIjZTZy0tLS0tLS0tU2c6NkNnQ2dDZ0NnQ2dDZzo2LS1DeUN5Q3lDeS0tXCIsXHJcblx0XHRcdGJvdXF1ZXQ6IFwiNkNwQ3BScENwQ3AtLTo2U3dTd1N3U3dTd1N3XCIsXHJcblx0XHRcdGxvZ286IFwiNlJ3Q3VDdy0tQ3dDdTo2LS0tLS0tUnUtLS0tXCIsXHJcblx0XHRcdHRhcmdldDogXCI2Q3JDd0NyQ3dDckN3OjZDd0NyQ3dDckN3Q3I6NkNyQ3dDckN3Q3JDdzo2Q3dDckN3Q3JDd0NyXCIsXHJcblx0XHRcdHNwZWVkb21ldGVyOiBcIjZDZ0NiLS0tLUNyQ3k6NkN3Q3ctLS0tQ3dDdzo2U2MtLS0tLS0tLS0tOjZDeUN5LS0tLUN5Q3lcIixcclxuXHRcdFx0c3Bpa2VkQmFsbDogXCI2Q2NTeUNjU3lDY1N5OjZTeUNjU3lDY1N5Q2M6NkNjU3lDY1N5Q2NTeTo2U3lDY1N5Q2NTeUNjXCIsXHJcblx0XHRcdGNvbXBhc3M6IFwiNkNjUmNSY0NjUmNSYzo2UndDd0N3UndDd0N3OjYtLS0tU3ItLS0tU2I6NkN5Q3lDeUN5Q3lDeVwiLFxyXG5cdFx0XHRwbGFudDogXCI2UmctLVJnLS1SZy0tOjZDd1J3Q3dSd0N3Unc6Ni0tUmctLVJnLS1SZ1wiLFxyXG5cdFx0XHRyb2NrZXQ6IFwiNkNiQ3VDYkN1Q2JDdTo2U3ItLS0tLS0tLS0tOjYtLUNyQ3JTckNyQ3I6NkN3Q3dDd0N3Q3dDd1wiLFxyXG5cclxuXHRcdFx0bWlsbDogXCI2Q3dDd0N3Q3dDd0N3OjZXYldiV2JXYldiV2JcIixcclxuXHRcdFx0c3RhcjogXCI2U3VTdVN1U3VTdVN1XCIsXHJcblx0XHRcdGNpcmNsZVN0YXI6IFwiNkN3Q3JDd0NyQ3dDcjo2U2dTZ1NnU2dTZ1NnXCIsXHJcblx0XHRcdGNsb3duOiBcIjZXclJnV3JSZ1dyUmc6NkN3Q3JDd0NyQ3dDcjo2U2dTZ1NnU2dTZ1NnXCIsXHJcblx0XHRcdHdpbmRtaWxsUmVkOiBcIjZXcldyV3JXcldyV3JcIixcclxuXHRcdFx0ZmFuVHJpcGxlOiBcIjZXcFdwV3BXcFdwV3A6NkN3Q3dDd0N3Q3dDdzo2V3BXcFdwV3BXcFdwXCIsXHJcblx0XHRcdGZhblF1YWRydXBsZTogXCI2V3BXcFdwV3BXcFdwOjZDd0N3Q3dDd0N3Q3c6NldwV3BXcFdwV3BXcDo2Q3dDd0N3Q3dDd0N3XCIsXHJcblxyXG5cdFx0XHRiaXJkOiBcIjZTci0tLS0tLS0tLS06Ni0tQ2dDZy0tQ2dDZzo2U2ItLS0tU2ItLS0tOjYtLUN3Q3ctLUN3Q3dcIixcclxuXHRcdFx0c2Npc3NvcnM6IFwiNlNyLS0tLS0tLS0tLTo2LS1DZ0NnQ2dDZ0NnOjYtLS0tU2ItLS0tLS06NkN3Q3ctLUN3Q3dDd1wiLFxyXG5cclxuXHJcblx0XHR9IGFzIGNvbnN0O1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBuYW1lZCA9IHtcclxuXHRcdFx0Y2lyY2xlU3Bhd246ICc2Q3VDdUN1Q3VDdUN1JyxcclxuXHRcdFx0c3F1YXJlU3Bhd246ICc2UnVSdVJ1UnVSdVJ1JyxcclxuXHRcdFx0c3RhclNwYXduOiAnNlN1U3VTdVN1U3VTdScsXHJcblx0XHRcdHdpbmRtaWxsU3Bhd246ICc2V3VXdVd1V3VXdVd1JyxcclxuXHRcdH0gYXMgY29uc3Q7XHJcblxyXG5cdFx0T2JqZWN0LmFzc2lnbihuYW1lZCwgT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5rZXlzKG5hbWVkNikuZmxhdE1hcChrID0+IHtcclxuXHRcdFx0bGV0IHM0ID0gKG5hbWVkNCBhcyBhbnkpW2tdO1xyXG5cdFx0XHRsZXQgczYgPSAobmFtZWQ2IGFzIGFueSlba107XHJcblx0XHRcdGxldCBhOiBbc3RyaW5nLCBzdHJpbmddW10gPSBbXTtcclxuXHRcdFx0aWYgKHM0KSBhLnB1c2goW2sgKyA0LCBzNF0pO1xyXG5cdFx0XHRpZiAoczQpIGEucHVzaChbczQsIHM2XSk7XHJcblx0XHRcdGlmIChzNikgYS5wdXNoKFtrLCBzNl0pO1xyXG5cdFx0XHRyZXR1cm4gYTtcclxuXHRcdH0pKSk7XHJcblx0XHRjb25zb2xlLmxvZyh7IG5hbWVkIH0pO1xyXG5cdFx0T2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCB7IG5hbWVkIH0pXHJcblxyXG5cdFx0ZXhwb3J0IHR5cGUgbmFtZWQgPSBrZXlvZiB0eXBlb2YgbmFtZWQ7XHJcblxyXG5cdFx0ZXhwb3J0IGNvbnN0IGJ5TmFtZSA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0Lm1hcChlID0+IFtlLm5hbWUsIGVdKSk7XHJcblx0XHRleHBvcnQgY29uc3QgYnlDaGFyID0gT2JqZWN0LmZyb21FbnRyaWVzKGxpc3QubWFwKGUgPT4gW2UuY29kZSwgZV0pKTtcclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZXhhbXBsZUxheWVyKHNoYXBlOiBxdWFkU2hhcGUpIHtcclxuXHRcdFx0bGV0IGkgPSAwLCBkID0gNDtcclxuXHRcdFx0cmV0dXJuIG5ldyBTekxheWVyKHtcclxuXHRcdFx0XHRxdWFkczogW1xyXG5cdFx0XHRcdFx0eyBzaGFwZSwgZnJvbTogaSwgdG86IGkgKz0gZCwgY29sb3I6ICdncmV5JyB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZSwgZnJvbTogaSwgdG86IGkgKz0gZCwgY29sb3I6ICdncmV5JyB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZSwgZnJvbTogaSwgdG86IGkgKz0gZCwgY29sb3I6ICdncmV5JyB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZSwgZnJvbTogaSwgdG86IGkgKz0gZCwgY29sb3I6ICdncmV5JyB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZSwgZnJvbTogaSwgdG86IGkgKz0gZCwgY29sb3I6ICdncmV5JyB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZSwgZnJvbTogaSwgdG86IGkgKz0gZCwgY29sb3I6ICdncmV5JyB9LFxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBxdWFkTGlzdCA9IGxpc3QubWFwKGUgPT4gZS5uYW1lKTtcclxuXHR9XHJcblxyXG5cdGxldCBzID0gQXJyYXkoMTAwKS5maWxsKDApLm1hcCgoZSwgaSkgPT4gaS50b1N0cmluZygzNikpLmpvaW4oJycpLnNsaWNlKDAsIDM2KTtcclxuXHRzICs9IHMuc2xpY2UoMTApLnRvVXBwZXJDYXNlKCk7XHJcblxyXG5cdGV4cG9ydCBjb25zdCBuVG9DaGFyOiBjaGFyW10gPSBzLnNwbGl0KCcnKTtcclxuXHRleHBvcnQgY29uc3QgY2hhclRvTjogUmVjb3JkPGNoYXIsIG51bWJlcj4gPSBPYmplY3QuZnJvbUVudHJpZXMoblRvQ2hhci5tYXAoKGUsIGkpID0+IFtlLCBpXSkpO1xyXG5cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTekxheWVyIHtcclxuXHRxdWFkczogKHtcclxuXHRcdHNoYXBlOiBxdWFkU2hhcGUsXHJcblx0XHRmcm9tOiByb3RhdGlvbjI0LCB0bzogcm90YXRpb24yNCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHR9KVtdO1xyXG59XHJcblxyXG5cclxudHlwZSBQaWNrVmFsdWVzPFQ+ID0ge1xyXG5cdFtrIGluIGtleW9mIFQgYXMgVFtrXSBleHRlbmRzICgoLi4uYXJnczogYW55KSA9PiBhbnkpID8gbmV2ZXIgOiBrXT86IFRba11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN6TGF5ZXJRdWFkIHtcclxuXHRzaGFwZTogcXVhZFNoYXBlID0gJ2NpcmNsZSc7XHJcblx0Y29sb3I6IGNvbG9yID0gJ25vbmUnO1xyXG5cdGZyb206IHJvdGF0aW9uMjQgPSAwOyB0bzogcm90YXRpb24yNCA9IDA7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZTogUGlja1ZhbHVlczxTekxheWVyUXVhZD4pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgc291cmNlKTtcclxuXHRcdGlmIChjb25maWcuZGlzYWJsZVF1YWRDb2xvcnMpIHtcclxuXHRcdFx0dGhpcy5jb2xvciA9ICdub25lJztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNsb25lKCkgeyByZXR1cm4gbmV3IFN6TGF5ZXJRdWFkKHRoaXMpOyB9XHJcblx0b3V0ZXJQYXRoKGN0eDogU3pDb250ZXh0MkQsIGxheWVyOiBTekxheWVyKSB7XHJcblx0XHRzd2l0Y2ggKHRoaXMuc2hhcGUpIHtcclxuXHRcdFx0Y2FzZSAnY2lyY2xlJzoge1xyXG5cdFx0XHRcdGN0eC5hcmMoMCwgMCwgMSwgdGhpcy5mcm9tLCB0aGlzLnRvKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FzZSAnc3F1YXJlJzoge1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDEsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0Ly8gNiAtPiBNYXRoLlNRUlQyLCAxMiAtPiAxXHJcblx0XHRcdFx0bGV0IGEgPSB0aGlzLnRvIC0gdGhpcy5mcm9tO1xyXG5cdFx0XHRcdGxldCBhciA9IGEgKiAoTWF0aC5QSSAvIDI0KTtcclxuXHRcdFx0XHRsZXQgUiA9IGEgPD0gNiA/IDEgLyBNYXRoLmNvcyhhcikgOiAxO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKFIsICh0aGlzLmZyb20gKyB0aGlzLnRvKSAvIDIpO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDEsIHRoaXMudG8pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXNlICdzdGFyJzoge1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDAuNiwgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUihNYXRoLlNRUlQyLCAodGhpcy5mcm9tICsgdGhpcy50bykgLyAyKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjYsIHRoaXMudG8pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXNlICd3aW5kbWlsbCc6IHtcclxuXHRcdFx0XHRjdHgubGluZVRvUigxLCB0aGlzLmZyb20pO1xyXG5cclxuXHRcdFx0XHRsZXQgYSA9IHRoaXMudG8gLSB0aGlzLmZyb207XHJcblx0XHRcdFx0bGV0IGFyID0gYSAqIChNYXRoLlBJIC8gMjQpO1xyXG5cdFx0XHRcdGxldCBSID0gYSA8PSA2ID8gMSAvIE1hdGguY29zKGFyKSA6IDE7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoUiwgKHRoaXMuZnJvbSArIHRoaXMudG8pIC8gMik7XHJcblxyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDAuNiwgdGhpcy50byk7XHJcblxyXG5cclxuXHRcdFx0XHQvLyBsZXQgb3JpZ2luWCA9IC1xdWFkcmFudEhhbGZTaXplO1xyXG5cdFx0XHRcdC8vIGxldCBvcmlnaW5ZID0gcXVhZHJhbnRIYWxmU2l6ZSAtIGRpbXM7XHJcblx0XHRcdFx0Ly8gY29uc3QgbW92ZUlud2FyZHMgPSBkaW1zICogMC40O1xyXG5cdFx0XHRcdC8vIGNvbnRleHQubW92ZVRvKG9yaWdpblgsIG9yaWdpblkgKyBtb3ZlSW53YXJkcyk7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5saW5lVG8ob3JpZ2luWCArIGRpbXMsIG9yaWdpblkpO1xyXG5cdFx0XHRcdC8vIGNvbnRleHQubGluZVRvKG9yaWdpblggKyBkaW1zLCBvcmlnaW5ZICsgZGltcyk7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5saW5lVG8ob3JpZ2luWCwgb3JpZ2luWSArIGRpbXMpO1xyXG5cdFx0XHRcdC8vIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5maWxsKCk7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5zdHJva2UoKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0XHRkZWZhdWx0OiB7XHJcblx0XHRcdFx0Y3R4LnNhdmVkKGN0eCA9PiB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5zaGFwZSA9PSAnY292ZXInKSB7XHJcblx0XHRcdFx0XHRcdGN0eC5zY2FsZSgxIC8gbGF5ZXIubGF5ZXJTY2FsZSgpKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0U3pJbmZvLnF1YWQuYnlOYW1lW3RoaXMuc2hhcGVdLnBhdGghKGN0eCwgdGhpcyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldEhhc2goKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBgJHtTekluZm8ucXVhZC5ieU5hbWVbdGhpcy5zaGFwZV0uY29kZVxyXG5cdFx0XHR9JHtTekluZm8uY29sb3IuYnlOYW1lW3RoaXMuY29sb3JdLmNvZGVcclxuXHRcdFx0fSR7U3pJbmZvLm5Ub0NoYXJbdGhpcy5mcm9tXVxyXG5cdFx0XHR9JHtTekluZm8ublRvQ2hhclt0aGlzLnRvXVxyXG5cdFx0XHR9YFxyXG5cdH1cclxuXHRzdGF0aWMgZnJvbVNob3J0S2V5KGU6IHN0cmluZyk6IFN6TGF5ZXJRdWFkIHtcclxuXHRcdHJldHVybiBuZXcgU3pMYXllclF1YWQoe1xyXG5cdFx0XHRzaGFwZTogU3pJbmZvLnF1YWQuYnlDaGFyW2VbMF1dLm5hbWUsXHJcblx0XHRcdGNvbG9yOiBTekluZm8uY29sb3IuYnlDaGFyW2VbMV1dLm5hbWUsXHJcblx0XHRcdGZyb206IFN6SW5mby5jaGFyVG9OW2VbMl1dLFxyXG5cdFx0XHR0bzogU3pJbmZvLmNoYXJUb05bZVszXV0sXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5cclxuY29uc3QgdGVzdFRlbXBsYXRlOiBJU3pMYXllciA9IHtcclxuXHRxdWFkczogW1xyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyLCB0bzogNCB9LFxyXG5cdFx0eyBzaGFwZTogJ2NpcmNsZScsIGNvbG9yOiAncGluaycsIGZyb206IDUsIHRvOiAxOSB9LFxyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyMCwgdG86IDIyIH0sXHJcblx0XSxcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU3pMYXllciBpbXBsZW1lbnRzIElTekxheWVyIHtcclxuXHRsYXllckluZGV4ID0gMDtcclxuXHRxdWFkczogU3pMYXllclF1YWRbXSA9IFtdO1xyXG5cclxuXHJcblx0c3RhdGljIGNyZWF0ZVRlc3QoKSB7XHJcblx0XHRsZXQgbCA9IG5ldyBTekxheWVyKHRlc3RUZW1wbGF0ZSk7XHJcblx0XHRjb25zb2xlLmVycm9yKCd0ZXN0IGxheWVyJywgbCk7XHJcblx0XHRyZXR1cm4gbDtcclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZT86IFBpY2tWYWx1ZXM8SVN6TGF5ZXI+LCBsYXllckluZGV4PzogbnVtYmVyKSB7XHJcblx0XHRpZiAoc291cmNlKSB7XHJcblx0XHRcdHRoaXMucXVhZHMgPSAoc291cmNlLnF1YWRzID8/IFtdKS5tYXAoZSA9PiBuZXcgU3pMYXllclF1YWQoZSkpO1xyXG5cdFx0XHRpZiAoKHNvdXJjZSBhcyBTekxheWVyKS5sYXllckluZGV4KSB7XHJcblx0XHRcdFx0dGhpcy5sYXllckluZGV4ID0gKHNvdXJjZSBhcyBTekxheWVyKS5sYXllckluZGV4O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobGF5ZXJJbmRleCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMubGF5ZXJJbmRleCA9IGxheWVySW5kZXg7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcy5ub3JtYWxpemUoKTtcclxuXHR9XHJcblxyXG5cdGxheWVyU2NhbGUobGF5ZXJJbmRleD86IG51bWJlcikge1xyXG5cdFx0bGF5ZXJJbmRleCA/Pz0gdGhpcy5sYXllckluZGV4O1xyXG5cdFx0cmV0dXJuIDAuOSAtIDAuMjIgKiBsYXllckluZGV4O1xyXG5cdH1cclxuXHRkcmF3Q2VudGVyZWRMYXllclNjYWxlZChjdHg6IFN6Q29udGV4dDJELCBsYXllckluZGV4PzogbnVtYmVyKSB7XHJcblx0XHRjdHguc2F2ZWQoY3R4ID0+IHtcclxuXHRcdFx0Y3R4LnNjYWxlKHRoaXMubGF5ZXJTY2FsZShsYXllckluZGV4KSk7XHJcblx0XHRcdHRoaXMuZHJhd0NlbnRlcmVkTm9ybWFsaXplZChjdHgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkcmF3Q2VudGVyZWROb3JtYWxpemVkKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdGN0eC5zYXZlZChjdHggPT4ge1xyXG5cdFx0XHR0aGlzLmNsaXBTaGFwZXMoY3R4KTtcclxuXHRcdFx0dGhpcy5xdWFkcy5mb3JFYWNoKHEgPT4gY3R4LnNhdmVkKGN0eCA9PiB0aGlzLmZpbGxRdWFkKHEsIGN0eCkpKTtcclxuXHRcdH0pO1xyXG5cdFx0Y3R4LnNhdmVkKGN0eCA9PiB0aGlzLmRyYXdRdWFkT3V0bGluZShjdHgsIHRydWUpKTtcclxuXHR9XHJcblxyXG5cclxuXHRmaWxsUXVhZChxdWFkOiBTekxheWVyUXVhZCwgY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IFN6SW5mby5jb2xvci5ieU5hbWVbcXVhZC5jb2xvcl0uc3R5bGU7XHJcblx0XHRpZiAocXVhZC5jb2xvciA9PSAnY292ZXInKSBbXHJcblx0XHRcdC8vIGN0eC5jdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW91dCdcclxuXHRcdF1cclxuXHJcblx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRjdHgubW92ZVRvKDAsIDApO1xyXG5cdFx0cXVhZC5vdXRlclBhdGgoY3R4LCB0aGlzKTtcclxuXHRcdGN0eC5maWxsKCk7XHJcblx0fVxyXG5cclxuXHJcblx0ZnVsbFF1YWRQYXRoKGN0eDogU3pDb250ZXh0MkQsIHdpdGhDdXRzPzogYm9vbGVhbikge1xyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnF1YWRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBwcmV2ID0gaSA+IDAgPyB0aGlzLnF1YWRzW2kgLSAxXSA6IHRoaXMucXVhZHMuc2xpY2UoLTEpWzBdO1xyXG5cdFx0XHRsZXQgcXVhZCA9IHRoaXMucXVhZHNbaV07XHJcblx0XHRcdGlmICh3aXRoQ3V0cyB8fCBxdWFkLmZyb20gIT0gcHJldi50byAlIDI0KSBjdHgubGluZVRvKDAsIDApO1xyXG5cdFx0XHRxdWFkLm91dGVyUGF0aChjdHgsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdFx0Y3R4LmNsb3NlUGF0aCgpO1xyXG5cdH1cclxuXHJcblx0ZHJhd1F1YWRPdXRsaW5lKGN0eDogU3pDb250ZXh0MkQsIHdpdGhDdXRzPzogYm9vbGVhbikge1xyXG5cdFx0dGhpcy5mdWxsUXVhZFBhdGgoY3R4LCB3aXRoQ3V0cyk7XHJcblx0XHRjdHgubGluZVdpZHRoID0gMC4wNTtcclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9IFN6SW5mby5jb2xvci5vdXRsaW5lOy8vICdvcmFuZ2UnO1xyXG5cdFx0Y3R4LnN0cm9rZSgpO1xyXG5cdH1cclxuXHJcblx0Y2xpcFNoYXBlcyhjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHR0aGlzLmZ1bGxRdWFkUGF0aChjdHgpO1xyXG5cdFx0Y3R4LmNsaXAoKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblxyXG5cdGNsb25lKCkge1xyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyKHRoaXMpO1xyXG5cdH1cclxuXHRpc05vcm1hbGl6ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucXVhZHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IG5leHQgPSB0aGlzLnF1YWRzW2ldO1xyXG5cdFx0XHRsZXQgcHJldiA9IHRoaXMucXVhZHNbaSAtIDFdIHx8IHRoaXMucXVhZHNbdGhpcy5xdWFkcy5sZW5ndGggLSAxXTtcclxuXHRcdFx0aWYgKG5leHQuZnJvbSA8IDAgfHwgbmV4dC5mcm9tID49IDI0KSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChuZXh0LmZyb20gPj0gbmV4dC50bykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAoaSA9PSAwKSB7XHJcblx0XHRcdFx0aWYgKHByZXYudG8gPiAyNCAmJiBwcmV2LnRvICUgMjQgPiBuZXh0LmZyb20pIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAocHJldi50byA+IG5leHQuZnJvbSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRsZXQgcGxhY2VzID0gQXJyYXk8cXVhZFNoYXBlIHwgJyc+KDI0KS5maWxsKCcnKTtcclxuXHRcdGxldCBwYWludHMgPSBBcnJheTxjb2xvciB8ICcnPigyNCkuZmlsbCgnJyk7XHJcblx0XHRmb3IgKGxldCBxIG9mIHRoaXMucXVhZHMpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IHEuZnJvbTsgaSA8IHEudG87IGkrKykge1xyXG5cdFx0XHRcdGlmIChwbGFjZXNbaSAlIDI0XSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdHBsYWNlc1tpICUgMjRdID0gcS5zaGFwZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdG5vcm1hbGl6ZSgpOiB0aGlzIHtcclxuXHRcdGlmICh0aGlzLmlzTm9ybWFsaXplZCgpKSByZXR1cm4gdGhpcztcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5xdWFkcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgcSA9IHRoaXMucXVhZHNbaV07XHJcblx0XHRcdGlmIChxLmZyb20gPiBxLnRvKSB7IHRoaXMucXVhZHMuc3BsaWNlKGksIDEpOyBpLS07IGNvbnRpbnVlOyB9XHJcblx0XHRcdGlmIChxLmZyb20gPj0gMjQpIHsgcS5mcm9tIC09IDI0OyBxLnRvIC09IDI0OyB9XHJcblx0XHR9XHJcblx0XHR0aGlzLnF1YWRzLnNvcnQoKGEsIGIpID0+IGEuZnJvbSAtIGIuZnJvbSk7XHJcblxyXG5cclxuXHRcdGxldCBwbGFjZXMgPSBBcnJheTxxdWFkU2hhcGUgfCAnJz4oMjQpLmZpbGwoJycpO1xyXG5cdFx0bGV0IHBhaW50cyA9IEFycmF5PGNvbG9yIHwgJyc+KDI0KS5maWxsKCcnKTtcclxuXHRcdGZvciAobGV0IHEgb2YgdGhpcy5xdWFkcykge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gcS5mcm9tOyBpIDwgcS50bzsgaSsrKSB7XHJcblx0XHRcdFx0cGxhY2VzW2kgJSAyNF0gPSBxLnNoYXBlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIGlmICghcGxhY2VzW2ldKSBwYWludHNbaV0gPSAnJztcclxuXHJcblx0XHRpZiAoIXRoaXMuaXNOb3JtYWxpemVkKCkpIHtcclxuXHRcdFx0T2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCB7IGxheWVyOiB0aGlzIH0pO1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKCdMYXllciBmYWlsZWQgdG8gbm9ybWFsaXplIHByb3Blcmx5IScsIHRoaXMpO1xyXG5cdFx0XHRpZiAoY29uZmlnLmRlYnVnQmFkTGF5ZXJzKSBkZWJ1Z2dlcjtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0aXNFbXB0eSgpIHtcclxuXHRcdHJldHVybiB0aGlzLnF1YWRzLmxlbmd0aCA9PSAwO1xyXG5cdH1cclxuXHJcblx0Z2V0UXVhZEF0U2VjdG9yKHM6IG51bWJlcikge1xyXG5cdFx0bGV0IHMxID0gKHMgKyAwLjUpICUgMjQsIHMyID0gczEgKyAyNDtcclxuXHRcdHJldHVybiB0aGlzLnF1YWRzLmZpbmQocSA9PlxyXG5cdFx0XHQocS5mcm9tIDwgczEgJiYgcS50byA+IHMxKSB8fCAocS5mcm9tIDwgczIgJiYgcS50byA+IHMyKVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdGNhblN0YWNrV2l0aCh1cHBlcjogU3pMYXllciB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKCF1cHBlcikgcmV0dXJuIHRydWU7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIHtcclxuXHRcdFx0bGV0IHExID0gdGhpcy5nZXRRdWFkQXRTZWN0b3IoaSk7XHJcblx0XHRcdGxldCBxMiA9IHVwcGVyLmdldFF1YWRBdFNlY3RvcihpKTtcclxuXHRcdFx0aWYgKHExICYmIHEyKSByZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0c3RhY2tXaXRoKHVwcGVyOiBTekxheWVyIHwgdW5kZWZpbmVkKTogU3pMYXllciB7XHJcblx0XHRpZiAoIXRoaXMuY2FuU3RhY2tXaXRoKHVwcGVyKSkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKCdJbnZhbGlkIHN0YWNraW5nIHJlcXVlc3RlZCEnKTtcclxuXHRcdFx0ZGVidWdnZXI7XHJcblx0XHRcdHJldHVybiB0aGlzLmNsb25lKCk7XHJcblx0XHR9XHJcblx0XHRpZiAoIXVwcGVyKSByZXR1cm4gdGhpcy5jbG9uZSgpO1xyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyKHtcclxuXHRcdFx0cXVhZHM6IHRoaXMucXVhZHMuY29uY2F0KHVwcGVyLnF1YWRzKSxcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cm90YXRlKHJvdDogcm90YXRpb24yNCkge1xyXG5cdFx0dGhpcy5xdWFkcy5tYXAoZSA9PiB7IGUuZnJvbSArPSByb3Q7IGUudG8gKz0gcm90OyB9KTtcclxuXHRcdHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpO1xyXG5cdH1cclxuXHJcblxyXG5cdGNsb25lRmlsdGVyZWRCeVF1YWRyYW50cyhpbmNsdWRlUXVhZHJhbnRzOiBudW1iZXJbXSkge1xyXG5cdFx0Y29uc3QgZ29vZCA9IChuOiBudW1iZXIpID0+IGluY2x1ZGVRdWFkcmFudHMuaW5jbHVkZXMoKH5+KG4gLyA2KSkgJSA0KTtcclxuXHJcblx0XHRsZXQgYWxsb3dlZCA9IEFycmF5KDQ4KS5maWxsKDApLm1hcCgoZSwgaSkgPT4gZ29vZChpICsgMC41KSk7XHJcblx0XHRmdW5jdGlvbiBjb252ZXJ0PFQgZXh0ZW5kcyBTekxheWVyUXVhZD4ob2xkOiBUKTogVFtdIHtcclxuXHRcdFx0bGV0IGZpbGxlZCA9IEFycmF5KDQ4KS5maWxsKDApLm1hcCgoZSwgaSkgPT4gb2xkLmZyb20gPCBpICsgMC41ICYmIGkgKyAwLjUgPCBvbGQudG8pO1xyXG5cclxuXHRcdFx0bGV0IGxhc3Q6IFQgPSBvbGQuY2xvbmUoKSBhcyBUOyBsYXN0LnRvID0gLTk5OTtcclxuXHRcdFx0bGV0IGxpc3Q6IFRbXSA9IFtdO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCA0ODsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKCFmaWxsZWRbaV0pIGNvbnRpbnVlO1xyXG5cdFx0XHRcdGlmICghYWxsb3dlZFtpXSkgY29udGludWU7XHJcblx0XHRcdFx0aWYgKGxhc3QudG8gIT0gaSkge1xyXG5cdFx0XHRcdFx0bGFzdCA9IG9sZC5jbG9uZSgpIGFzIFQ7XHJcblx0XHRcdFx0XHRsYXN0LmZyb20gPSBpO1xyXG5cdFx0XHRcdFx0bGFzdC50byA9IGkgKyAxO1xyXG5cdFx0XHRcdFx0bGlzdC5wdXNoKGxhc3QpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsYXN0LnRvKys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBsaXN0O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ldyBTekxheWVyKHtcclxuXHRcdFx0cXVhZHM6IHRoaXMucXVhZHMuZmxhdE1hcChjb252ZXJ0KSxcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Y2xvbmVBc0NvdmVyKCkge1xyXG5cdFx0ZnVuY3Rpb24gY29udmVydChxdWFkOiBTekxheWVyUXVhZCkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJRdWFkKHtcclxuXHRcdFx0XHRjb2xvcjogJ2NvdmVyJyxcclxuXHRcdFx0XHRzaGFwZTogJ2NvdmVyJyxcclxuXHRcdFx0XHRmcm9tOiBxdWFkLmZyb20sIHRvOiBxdWFkLnRvLFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdHF1YWRzOiB0aGlzLnF1YWRzLmZsYXRNYXAoY29udmVydCksXHJcblx0XHR9KS5wYWludCgnY292ZXInKS5ub3JtYWxpemUoKTtcclxuXHR9XHJcblx0cmVtb3ZlQ292ZXIoKSB7XHJcblx0XHR0aGlzLnF1YWRzID0gdGhpcy5xdWFkcy5maWx0ZXIoZSA9PiBlLnNoYXBlICE9ICdjb3ZlcicpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdGZpbHRlclBhaW50KHBhaW50OiAoY29sb3IgfCBudWxsKVtdKTogKGNvbG9yIHwgbnVsbClbXSB7XHJcblx0XHRyZXR1cm4gcGFpbnQubWFwKChlLCBpKSA9PiB7XHJcblx0XHRcdGxldCBxdWFkID0gdGhpcy5nZXRRdWFkQXRTZWN0b3IoaSk7XHJcblx0XHRcdHJldHVybiBxdWFkICYmIHF1YWQuc2hhcGUgPT0gJ2NvdmVyJyA/IG51bGwgOiBlO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdHBhaW50KHBhaW50OiAoY29sb3IgfCBudWxsKVtdIHwgY29sb3IpIHtcclxuXHRcdGlmIChBcnJheS5pc0FycmF5KHBhaW50KSkgdGhyb3cgdGhpcztcclxuXHRcdHRoaXMucXVhZHMubWFwKGU9PmUuY29sb3IgPSBwYWludCk7XHJcblx0XHQvLyBpZiAoIUFycmF5LmlzQXJyYXkocGFpbnQpKSBwYWludCA9IEFycmF5PGNvbG9yIHwgbnVsbD4oMjQpLmZpbGwocGFpbnQpO1xyXG5cdFx0Ly8gcGFpbnQubWFwKChjb2xvciwgaSkgPT4ge1xyXG5cdFx0Ly8gXHRpZiAoY29sb3IpIHtcclxuXHRcdC8vIFx0XHR0aGlzLmFyZWFzLnB1c2gobmV3IFN6TGF5ZXJBcmVhKHtcclxuXHRcdC8vIFx0XHRcdGNvbG9yLFxyXG5cdFx0Ly8gXHRcdFx0ZnJvbTogaSwgdG86IGkgKyAxLFxyXG5cdFx0Ly8gXHRcdFx0c2hhcGU6ICdzZWN0b3InLFxyXG5cdFx0Ly8gXHRcdH0pKVxyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyB9KTtcclxuXHRcdHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpOztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBmcm9tU2hhcGV6SGFzaChoYXNoOiBzdHJpbmcpIHtcclxuXHRcdGxldCBhbmdsZSA9IDY7XHJcblx0XHRpZiAoaGFzaFswXSA9PSAnNicpIHtcclxuXHRcdFx0YW5nbGUgPSA0O1xyXG5cdFx0XHRoYXNoID0gaGFzaC5zbGljZSgxKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdHF1YWRzOiBoYXNoLm1hdGNoKC8uLi9nKSEubWFwKChzLCBpKSA9PiB7XHJcblx0XHRcdFx0aWYgKHNbMF0gPT0gJy0nKSByZXR1cm4gbnVsbCBhcyBhbnkgYXMgU3pMYXllclF1YWQ7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBTekxheWVyUXVhZCh7XHJcblx0XHRcdFx0XHRzaGFwZTogU3pJbmZvLnF1YWQuYnlDaGFyW3NbMF1dLm5hbWUsXHJcblx0XHRcdFx0XHRjb2xvcjogU3pJbmZvLmNvbG9yLmJ5Q2hhcltzWzFdXS5uYW1lLFxyXG5cdFx0XHRcdFx0ZnJvbTogaSAqIGFuZ2xlLFxyXG5cdFx0XHRcdFx0dG86IChpICsgMSkgKiBhbmdsZSxcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSkuZmlsdGVyKGUgPT4gZSksXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHRnZXRIYXNoKCk6IHN0cmluZyB7XHJcblx0XHRpZiAodGhpcy5xdWFkcy5ldmVyeShlID0+IGUudG8gLSBlLmZyb20gPT0gNikpIHtcclxuXHRcdFx0cmV0dXJuIFswLCAxLCAyLCAzXS5tYXAoaSA9PiB7XHJcblx0XHRcdFx0bGV0IHEgPSB0aGlzLnF1YWRzLmZpbmQocSA9PiBxLmZyb20gPT0gaSAqIDYpO1xyXG5cdFx0XHRcdGlmICghcSkgcmV0dXJuICctLSc7XHJcblx0XHRcdFx0cmV0dXJuIHEuZ2V0SGFzaCgpLnNsaWNlKDAsIDIpO1xyXG5cdFx0XHR9KS5qb2luKCcnKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAnNicgKyBbMCwgMSwgMiwgMywgNCwgNV0ubWFwKGkgPT4ge1xyXG5cdFx0XHRsZXQgcSA9IHRoaXMucXVhZHMuZmluZChxID0+IHEuZnJvbSA9PSBpICogNCk7XHJcblx0XHRcdGlmICghcSkgcmV0dXJuICctLSc7XHJcblx0XHRcdHJldHVybiBxLmdldEhhc2goKS5zbGljZSgwLCAyKTtcclxuXHRcdH0pLmpvaW4oJycpO1xyXG5cdH1cclxuXHRzdGF0aWMgZnJvbVNob3J0S2V5KGtleTogc3RyaW5nKTogYW55IHtcclxuXHRcdGlmIChrZXkuc3RhcnRzV2l0aCgnNicpIHx8ICFrZXkuc3RhcnRzV2l0aCgnIScpICYmIGtleS5sZW5ndGggPT0gOCkge1xyXG5cdFx0XHRyZXR1cm4gU3pMYXllci5mcm9tU2hhcGV6SGFzaChrZXkpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGtleS5zdGFydHNXaXRoKCdzeiEnKSkga2V5ID0ga2V5LnNsaWNlKDMpO1xyXG5cdFx0aWYgKCFrZXkuc3RhcnRzV2l0aCgnbCF6fCcpKSB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgaGFzaCcpO1xyXG5cdFx0bGV0IGxheWVyID0gbmV3IFN6TGF5ZXIoKTtcclxuXHRcdGZvciAobGV0IHBhcnQgb2Yga2V5LnNwbGl0KCd8JykpIHtcclxuXHRcdFx0aWYgKHBhcnQuc3RhcnRzV2l0aCgncSEnKSkge1xyXG5cdFx0XHRcdGxldCBzdHJzID0gcGFydC5zbGljZSgncSEnLmxlbmd0aCkuc3BsaXQoJywnKTtcclxuXHRcdFx0XHRsYXllci5xdWFkcyA9IHN0cnMubWFwKGUgPT4gU3pMYXllclF1YWQuZnJvbVNob3J0S2V5KGUpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGxheWVyO1xyXG5cdH1cclxufVxyXG4iXX0=