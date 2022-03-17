export const rmode = true;
export const PI12 = -Math.PI / 12;
export class SzContext2D {
    static fromCanvas(cv) {
        let ctx = cv.getContext('2d');
        const PI = Math.PI;
        const PI12 = -PI / 12;
        ctx.scale(cv.width / 2, cv.height / 2);
        ctx.translate(1, 1);
        ctx.rotate(-Math.PI / 2);
        ctx.scale(1 / 1.15, 1 / 1.15);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        return new SzContext2D(ctx);
    }
    clear() {
        this.ctx.clearRect(-2, -2, 4, 4);
    }
    ctx;
    constructor(ctx) {
        this.ctx = ctx;
    }
    get lineWidth() { return this.ctx.lineWidth; }
    set lineWidth(v) { this.ctx.lineWidth = v; }
    get strokeStyle() { return this.ctx.strokeStyle; }
    set strokeStyle(v) { this.ctx.strokeStyle = v; }
    get fillStyle() { return this.ctx.fillStyle; }
    set fillStyle(v) {
        this.ctx.fillStyle = v || 'black';
        if (v == 'sz-cover') {
            let gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 2);
            let c1 = '#00000000';
            let c2 = '#00000033';
            let n = 20;
            for (let i = 1; i < n; i++) {
                gradient.addColorStop((i - 0.01) / n, i % 2 ? c2 : c1);
                gradient.addColorStop((i + 0.01) / n, i % 2 ? c1 : c2);
            }
            this.ctx.fillStyle = gradient;
        }
        if (v == 'none') {
            let gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 2);
            let c1 = 'red';
            let c2 = 'blue';
            let n = 20;
            for (let i = 0; i <= n; i++) {
                gradient.addColorStop(i / n, i % 2 ? c2 : c1);
            }
            this.ctx.fillStyle = gradient;
            // this.ctx.fillStyle = 'transparent';
        }
    }
    get globalAlpha() { return this.ctx.globalAlpha; }
    set globalAlpha(v) { this.ctx.globalAlpha = v; }
    createGradientFill(source) {
        if (source.type == 'none') {
            return source.color;
        }
        if (source.type == 'radial10') {
            let g = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 2);
            const n = 10;
            g.addColorStop(0, source.color);
            for (let i = 0; i < n; i++) {
                g.addColorStop((i + 0.5) / n, source.secondaryColor);
                g.addColorStop((i + 1) / n, source.color);
            }
            return g;
        }
        throw 0;
    }
    beginPath() { this.ctx.beginPath(); return this; }
    closePath() { this.ctx.closePath(); return this; }
    stroke() { this.ctx.stroke(); return this; }
    fill() { this.ctx.fill(); return this; }
    clip() { this.ctx.clip(); return this; }
    save() { this.ctx.save(); return this; }
    restore() { this.ctx.restore(); return this; }
    scale(x, y = x) {
        this.ctx.scale(x, y);
        return this;
    }
    rotate(angle) {
        this.ctx.rotate(-angle * PI12);
        return this;
    }
    moveTo(x, y) {
        // log({ move: { x: +x.toFixed(3), y: +y.toFixed(3) } });
        this.ctx.moveTo(y, x);
        return this;
    }
    moveToR(r, a) {
        this.moveTo(-r * Math.sin(a * PI12), r * Math.cos(a * PI12));
        return this;
    }
    lineTo(x, y) {
        // log({ line: { x: +x.toFixed(3), y: +y.toFixed(3) } })
        this.ctx.lineTo(y, x);
        return this;
    }
    lineToR(radius, direction) {
        this.lineTo(-radius * Math.sin(direction * PI12), radius * Math.cos(direction * PI12));
        return this;
    }
    rToXY(radius, direction) {
        return [-radius * Math.sin(direction * PI12), radius * Math.cos(direction * PI12)];
    }
    arc(cx, cy, radius, from, to, dir) {
        this.ctx.arc(cx, cy, radius, -from * PI12, -to * PI12, dir);
        return this;
    }
    fillRect(x, y, w, h) {
        this.ctx.fillRect(x, y, w, h);
        return this;
    }
    saved(f) {
        this.save();
        f(this);
        this.restore();
    }
}
function log(...a) {
    console.error(...a);
    document.body.append(document.createElement('br'));
    for (let o of a)
        document.body.append(JSON.stringify(o));
}
