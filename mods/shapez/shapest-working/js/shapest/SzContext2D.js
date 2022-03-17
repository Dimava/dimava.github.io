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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3pDb250ZXh0MkQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2hhcGVzdC9TekNvbnRleHQyRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQzFCLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBV2xDLE1BQU0sT0FBTyxXQUFXO0lBQ3ZCLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBcUI7UUFDdEMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztRQUMvQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ25CLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUN0QixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM5QixHQUFHLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN0QixHQUFHLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN2QixPQUFPLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDRCxLQUFLO1FBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVB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QUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsS0FBSyxDQUFDLENBQXNCO1FBQzNCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQixDQUFDO0NBQ0Q7QUFHRCxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQVE7SUFDdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRCxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDZCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5leHBvcnQgY29uc3Qgcm1vZGUgPSB0cnVlO1xyXG5leHBvcnQgY29uc3QgUEkxMiA9IC1NYXRoLlBJIC8gMTI7XHJcblxyXG5leHBvcnQgdHlwZSByb3RhdGlvbjI0ID0gbnVtYmVyICYgeyBfPzogcm90YXRpb24yNCB9XHJcbmV4cG9ydCB0eXBlIGNoYXIgPSBzdHJpbmcgJiB7IF8/OiBjaGFyIH07XHJcbmV4cG9ydCB0eXBlIHN0eWxlU3RyaW5nID0gc3RyaW5nICYgeyBfPzogc3R5bGVTdHJpbmcgfTtcclxuZXhwb3J0IHR5cGUgZ3JhZGllbnQgPSAoXHJcblx0fCB7IHR5cGU6ICdub25lJywgY29sb3I6IHN0eWxlU3RyaW5nIH1cclxuXHR8IHsgdHlwZTogJ3JhZGlhbDEwJywgY29sb3I6IHN0eWxlU3RyaW5nLCBzZWNvbmRhcnlDb2xvcjogc3R5bGVTdHJpbmcgfVxyXG4pICYgeyB0eXBlPzogc3RyaW5nLCByZXBlYXQ/OiBudW1iZXIsIGNvbG9yOiBzdHlsZVN0cmluZywgc2Vjb25kYXJ5Q29sb3I/OiBzdHlsZVN0cmluZyB9O1xyXG5leHBvcnQgdHlwZSBzelNoYXBlSGFzaCA9IGBzeiEke3N0cmluZ31gICYgeyBfPzogc3pTaGFwZUhhc2ggfTtcclxuXHJcbmV4cG9ydCBjbGFzcyBTekNvbnRleHQyRCB7XHJcblx0c3RhdGljIGZyb21DYW52YXMoY3Y6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcblx0XHRsZXQgY3R4ID0gY3YuZ2V0Q29udGV4dCgnMmQnKSE7XHJcblx0XHRjb25zdCBQSSA9IE1hdGguUEk7XHJcblx0XHRjb25zdCBQSTEyID0gLVBJIC8gMTI7XHJcblx0XHRjdHguc2NhbGUoY3Yud2lkdGggLyAyLCBjdi5oZWlnaHQgLyAyKTtcclxuXHRcdGN0eC50cmFuc2xhdGUoMSwgMSk7XHJcblx0XHRjdHgucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcblx0XHRjdHguc2NhbGUoMSAvIDEuMTUsIDEgLyAxLjE1KTtcclxuXHRcdGN0eC5saW5lQ2FwID0gJ3JvdW5kJztcclxuXHRcdGN0eC5saW5lSm9pbiA9ICdyb3VuZCc7XHJcblx0XHRyZXR1cm4gbmV3IFN6Q29udGV4dDJEKGN0eCk7XHJcblx0fVxyXG5cdGNsZWFyKCkge1xyXG5cdFx0dGhpcy5jdHguY2xlYXJSZWN0KC0yLCAtMiwgNCwgNCk7XHJcblx0fVxyXG5cclxuXHRjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHJcblx0Y29uc3RydWN0b3IoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMuY3R4ID0gY3R4O1xyXG5cdH1cclxuXHRnZXQgbGluZVdpZHRoKCkgeyByZXR1cm4gdGhpcy5jdHgubGluZVdpZHRoOyB9XHJcblx0c2V0IGxpbmVXaWR0aCh2KSB7IHRoaXMuY3R4LmxpbmVXaWR0aCA9IHY7IH1cclxuXHRnZXQgc3Ryb2tlU3R5bGUoKSB7IHJldHVybiB0aGlzLmN0eC5zdHJva2VTdHlsZSBhcyBzdHlsZVN0cmluZzsgfVxyXG5cdHNldCBzdHJva2VTdHlsZSh2KSB7IHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gdjsgfVxyXG5cdGdldCBmaWxsU3R5bGUoKSB7IHJldHVybiB0aGlzLmN0eC5maWxsU3R5bGUgYXMgc3R5bGVTdHJpbmc7IH1cclxuXHRzZXQgZmlsbFN0eWxlKHYpIHtcclxuXHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IHYgfHwgJ2JsYWNrJztcclxuXHRcdGlmICh2ID09ICdzei1jb3ZlcicpIHtcclxuXHRcdFx0bGV0IGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoMCwgMCwgMCwgMCwgMCwgMik7XHJcblx0XHRcdGxldCBjMSA9ICcjMDAwMDAwMDAnO1xyXG5cdFx0XHRsZXQgYzIgPSAnIzAwMDAwMDMzJztcclxuXHRcdFx0bGV0IG4gPSAyMDtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBuOyBpKyspIHtcclxuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoKGkgLSAwLjAxKSAvIG4sIGkgJSAyID8gYzIgOiBjMSk7XHJcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKChpICsgMC4wMSkgLyBuLCBpICUgMiA/IGMxIDogYzIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xyXG5cdFx0fVxyXG5cdFx0aWYgKHYgPT0gJ25vbmUnKSB7XHJcblx0XHRcdGxldCBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KDAsIDAsIDAsIDAsIDAsIDIpO1xyXG5cdFx0XHRsZXQgYzEgPSAncmVkJztcclxuXHRcdFx0bGV0IGMyID0gJ2JsdWUnO1xyXG5cdFx0XHRsZXQgbiA9IDIwO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8PSBuOyBpKyspIHtcclxuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoaSAvIG4sIGkgJSAyID8gYzIgOiBjMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XHJcblx0XHRcdC8vIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICd0cmFuc3BhcmVudCc7XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldCBnbG9iYWxBbHBoYSgpIHsgcmV0dXJuIHRoaXMuY3R4Lmdsb2JhbEFscGhhOyB9XHJcblx0c2V0IGdsb2JhbEFscGhhKHYpIHsgdGhpcy5jdHguZ2xvYmFsQWxwaGEgPSB2OyB9XHJcblxyXG5cdGNyZWF0ZUdyYWRpZW50RmlsbChzb3VyY2U6IGdyYWRpZW50KTogc3R5bGVTdHJpbmcgfCBDYW52YXNHcmFkaWVudCB7XHJcblx0XHRpZiAoc291cmNlLnR5cGUgPT0gJ25vbmUnKSB7XHJcblx0XHRcdHJldHVybiBzb3VyY2UuY29sb3I7XHJcblx0XHR9XHJcblx0XHRpZiAoc291cmNlLnR5cGUgPT0gJ3JhZGlhbDEwJykge1xyXG5cdFx0XHRsZXQgZyA9IHRoaXMuY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KDAsIDAsIDAsIDAsIDAsIDIpO1xyXG5cdFx0XHRjb25zdCBuID0gMTA7XHJcblxyXG5cdFx0XHRnLmFkZENvbG9yU3RvcCgwLCBzb3VyY2UuY29sb3IpO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xyXG5cdFx0XHRcdGcuYWRkQ29sb3JTdG9wKChpICsgMC41KSAvIG4sIHNvdXJjZS5zZWNvbmRhcnlDb2xvcik7XHJcblx0XHRcdFx0Zy5hZGRDb2xvclN0b3AoKGkgKyAxKSAvIG4sIHNvdXJjZS5jb2xvcik7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGc7XHJcblx0XHR9XHJcblx0XHR0aHJvdyAwO1xyXG5cdH1cclxuXHJcblxyXG5cdGJlZ2luUGF0aCgpIHsgdGhpcy5jdHguYmVnaW5QYXRoKCk7IHJldHVybiB0aGlzOyB9XHJcblx0Y2xvc2VQYXRoKCkgeyB0aGlzLmN0eC5jbG9zZVBhdGgoKTsgcmV0dXJuIHRoaXM7IH1cclxuXHRzdHJva2UoKSB7IHRoaXMuY3R4LnN0cm9rZSgpOyByZXR1cm4gdGhpczsgfVxyXG5cdGZpbGwoKSB7IHRoaXMuY3R4LmZpbGwoKTsgcmV0dXJuIHRoaXM7IH1cclxuXHRjbGlwKCkgeyB0aGlzLmN0eC5jbGlwKCk7IHJldHVybiB0aGlzOyB9XHJcblx0c2F2ZSgpIHsgdGhpcy5jdHguc2F2ZSgpOyByZXR1cm4gdGhpczsgfVxyXG5cdHJlc3RvcmUoKSB7IHRoaXMuY3R4LnJlc3RvcmUoKTsgcmV0dXJuIHRoaXM7IH1cclxuXHJcblx0c2NhbGUoeDogbnVtYmVyLCB5OiBudW1iZXIgPSB4KSB7XHJcblx0XHR0aGlzLmN0eC5zY2FsZSh4LCB5KTsgcmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRyb3RhdGUoYW5nbGU6IHJvdGF0aW9uMjQpIHtcclxuXHRcdHRoaXMuY3R4LnJvdGF0ZSgtYW5nbGUgKiBQSTEyKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRtb3ZlVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuXHRcdC8vIGxvZyh7IG1vdmU6IHsgeDogK3gudG9GaXhlZCgzKSwgeTogK3kudG9GaXhlZCgzKSB9IH0pO1xyXG5cdFx0dGhpcy5jdHgubW92ZVRvKHksIHgpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdG1vdmVUb1IocjogbnVtYmVyLCBhOiByb3RhdGlvbjI0KSB7XHJcblx0XHR0aGlzLm1vdmVUbygtciAqIE1hdGguc2luKGEgKiBQSTEyKSwgciAqIE1hdGguY29zKGEgKiBQSTEyKSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0bGluZVRvKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcblx0XHQvLyBsb2coeyBsaW5lOiB7IHg6ICt4LnRvRml4ZWQoMyksIHk6ICt5LnRvRml4ZWQoMykgfSB9KVxyXG5cdFx0dGhpcy5jdHgubGluZVRvKHksIHgpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdGxpbmVUb1IocmFkaXVzOiBudW1iZXIsIGRpcmVjdGlvbjogcm90YXRpb24yNCkge1xyXG5cdFx0dGhpcy5saW5lVG8oLXJhZGl1cyAqIE1hdGguc2luKGRpcmVjdGlvbiAqIFBJMTIpLCByYWRpdXMgKiBNYXRoLmNvcyhkaXJlY3Rpb24gKiBQSTEyKSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0clRvWFkocmFkaXVzOiBudW1iZXIsIGRpcmVjdGlvbjogcm90YXRpb24yNCkge1xyXG5cdFx0cmV0dXJuIFstcmFkaXVzICogTWF0aC5zaW4oZGlyZWN0aW9uICogUEkxMiksIHJhZGl1cyAqIE1hdGguY29zKGRpcmVjdGlvbiAqIFBJMTIpXSBhcyBjb25zdDtcclxuXHR9XHJcblx0YXJjKFxyXG5cdFx0Y3g6IG51bWJlciwgY3k6IG51bWJlciwgcmFkaXVzOiBudW1iZXIsIGZyb206IHJvdGF0aW9uMjQsIHRvOiByb3RhdGlvbjI0LCBkaXI/OiBib29sZWFuXHJcblx0KSB7XHJcblx0XHR0aGlzLmN0eC5hcmMoY3gsIGN5LCByYWRpdXMsIC1mcm9tICogUEkxMiwgLXRvICogUEkxMiwgZGlyKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRmaWxsUmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcclxuXHRcdHRoaXMuY3R4LmZpbGxSZWN0KHgsIHksIHcsIGgpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzYXZlZChmOiAoY3R4OiB0aGlzKSA9PiB2b2lkKSB7XHJcblx0XHR0aGlzLnNhdmUoKTtcclxuXHRcdGYodGhpcyk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBsb2coLi4uYTogYW55W10pIHtcclxuXHRjb25zb2xlLmVycm9yKC4uLmEpO1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xyXG5cdGZvciAobGV0IG8gb2YgYSlcclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKEpTT04uc3RyaW5naWZ5KG8pKTtcclxufVxyXG4iXX0=