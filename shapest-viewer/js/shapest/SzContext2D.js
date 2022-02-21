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
            for (let i = 0; i <= n; i++) {
                gradient.addColorStop(i / n, i % 2 ? c2 : c1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3pDb250ZXh0MkQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2hhcGVzdC9TekNvbnRleHQyRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQzFCLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBUWxDLE1BQU0sT0FBTyxXQUFXO0lBQ3ZCLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBcUI7UUFDdEMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztRQUMvQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ25CLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUN0QixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM5QixHQUFHLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN0QixHQUFHLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN2QixPQUFPLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDRCxLQUFLO1FBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFD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QztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ2xELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELEtBQUssQ0FBQyxDQUFzQjtRQUMzQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEIsQ0FBQztDQUNEO0FBR0QsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFRO0lBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkQsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2QsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZXhwb3J0IGNvbnN0IHJtb2RlID0gdHJ1ZTtcclxuZXhwb3J0IGNvbnN0IFBJMTIgPSAtTWF0aC5QSSAvIDEyO1xyXG5cclxuZXhwb3J0IHR5cGUgcm90YXRpb24yNCA9IG51bWJlciAmIHsgXz86IHJvdGF0aW9uMjQgfVxyXG5leHBvcnQgdHlwZSBjaGFyID0gc3RyaW5nICYgeyBfPzogY2hhciB9O1xyXG5leHBvcnQgdHlwZSBzdHlsZVN0cmluZyA9IHN0cmluZyAmIHsgXz86IHN0eWxlU3RyaW5nIH07XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTekNvbnRleHQyRCB7XHJcblx0c3RhdGljIGZyb21DYW52YXMoY3Y6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcblx0XHRsZXQgY3R4ID0gY3YuZ2V0Q29udGV4dCgnMmQnKSE7XHJcblx0XHRjb25zdCBQSSA9IE1hdGguUEk7XHJcblx0XHRjb25zdCBQSTEyID0gLVBJIC8gMTI7XHJcblx0XHRjdHguc2NhbGUoY3Yud2lkdGggLyAyLCBjdi5oZWlnaHQgLyAyKTtcclxuXHRcdGN0eC50cmFuc2xhdGUoMSwgMSk7XHJcblx0XHRjdHgucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcblx0XHRjdHguc2NhbGUoMSAvIDEuMTUsIDEgLyAxLjE1KTtcclxuXHRcdGN0eC5saW5lQ2FwID0gJ3JvdW5kJztcclxuXHRcdGN0eC5saW5lSm9pbiA9ICdyb3VuZCc7XHJcblx0XHRyZXR1cm4gbmV3IFN6Q29udGV4dDJEKGN0eCk7XHJcblx0fVxyXG5cdGNsZWFyKCkge1xyXG5cdFx0dGhpcy5jdHguY2xlYXJSZWN0KC0yLCAtMiwgNCwgNCk7XHJcblx0fVxyXG5cclxuXHRjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHJcblx0Y29uc3RydWN0b3IoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMuY3R4ID0gY3R4O1xyXG5cdH1cclxuXHRnZXQgbGluZVdpZHRoKCkgeyByZXR1cm4gdGhpcy5jdHgubGluZVdpZHRoOyB9XHJcblx0c2V0IGxpbmVXaWR0aCh2KSB7IHRoaXMuY3R4LmxpbmVXaWR0aCA9IHY7IH1cclxuXHRnZXQgc3Ryb2tlU3R5bGUoKSB7IHJldHVybiB0aGlzLmN0eC5zdHJva2VTdHlsZSBhcyBzdHlsZVN0cmluZzsgfVxyXG5cdHNldCBzdHJva2VTdHlsZSh2KSB7IHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gdjsgfVxyXG5cdGdldCBmaWxsU3R5bGUoKSB7IHJldHVybiB0aGlzLmN0eC5maWxsU3R5bGUgYXMgc3R5bGVTdHJpbmc7IH1cclxuXHRzZXQgZmlsbFN0eWxlKHYpIHtcclxuXHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IHYgfHwgJ2JsYWNrJztcclxuXHRcdGlmICh2ID09ICdzei1jb3ZlcicpIHtcclxuXHRcdFx0bGV0IGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoMCwgMCwgMCwgMCwgMCwgMik7XHJcblx0XHRcdGxldCBjMSA9ICcjMDAwMDAwMDAnO1xyXG5cdFx0XHRsZXQgYzIgPSAnIzAwMDAwMDMzJztcclxuXHRcdFx0bGV0IG4gPSAyMDtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gbjsgaSsrKSB7XHJcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKGkvbiwgaSUyP2MyOmMxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcclxuXHRcdH1cclxuXHRcdGlmICh2ID09ICdub25lJykge1xyXG5cdFx0XHRsZXQgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCgwLCAwLCAwLCAwLCAwLCAyKTtcclxuXHRcdFx0bGV0IGMxID0gJ3JlZCc7XHJcblx0XHRcdGxldCBjMiA9ICdibHVlJztcclxuXHRcdFx0bGV0IG4gPSAyMDtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gbjsgaSsrKSB7XHJcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKGkvbiwgaSUyP2MyOmMxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcclxuXHRcdFx0Ly8gdGhpcy5jdHguZmlsbFN0eWxlID0gJ3RyYW5zcGFyZW50JztcclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0IGdsb2JhbEFscGhhKCkgeyByZXR1cm4gdGhpcy5jdHguZ2xvYmFsQWxwaGE7IH1cclxuXHRzZXQgZ2xvYmFsQWxwaGEodikgeyB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IHY7IH1cclxuXHJcblxyXG5cdGJlZ2luUGF0aCgpIHsgdGhpcy5jdHguYmVnaW5QYXRoKCk7IHJldHVybiB0aGlzOyB9XHJcblx0Y2xvc2VQYXRoKCkgeyB0aGlzLmN0eC5jbG9zZVBhdGgoKTsgcmV0dXJuIHRoaXM7IH1cclxuXHRzdHJva2UoKSB7IHRoaXMuY3R4LnN0cm9rZSgpOyByZXR1cm4gdGhpczsgfVxyXG5cdGZpbGwoKSB7IHRoaXMuY3R4LmZpbGwoKTsgcmV0dXJuIHRoaXM7IH1cclxuXHRjbGlwKCkgeyB0aGlzLmN0eC5jbGlwKCk7IHJldHVybiB0aGlzOyB9XHJcblx0c2F2ZSgpIHsgdGhpcy5jdHguc2F2ZSgpOyByZXR1cm4gdGhpczsgfVxyXG5cdHJlc3RvcmUoKSB7IHRoaXMuY3R4LnJlc3RvcmUoKTsgcmV0dXJuIHRoaXM7IH1cclxuXHJcblx0c2NhbGUoeDogbnVtYmVyLCB5OiBudW1iZXIgPSB4KSB7XHJcblx0XHR0aGlzLmN0eC5zY2FsZSh4LCB5KTsgcmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRyb3RhdGUoYW5nbGU6IHJvdGF0aW9uMjQpIHtcclxuXHRcdHRoaXMuY3R4LnJvdGF0ZSgtYW5nbGUgKiBQSTEyKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRtb3ZlVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuXHRcdC8vIGxvZyh7IG1vdmU6IHsgeDogK3gudG9GaXhlZCgzKSwgeTogK3kudG9GaXhlZCgzKSB9IH0pO1xyXG5cdFx0dGhpcy5jdHgubW92ZVRvKHksIHgpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdG1vdmVUb1IocjogbnVtYmVyLCBhOiByb3RhdGlvbjI0KSB7XHJcblx0XHR0aGlzLm1vdmVUbygtciAqIE1hdGguc2luKGEgKiBQSTEyKSwgciAqIE1hdGguY29zKGEgKiBQSTEyKSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0bGluZVRvKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcblx0XHQvLyBsb2coeyBsaW5lOiB7IHg6ICt4LnRvRml4ZWQoMyksIHk6ICt5LnRvRml4ZWQoMykgfSB9KVxyXG5cdFx0dGhpcy5jdHgubGluZVRvKHksIHgpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdGxpbmVUb1IocmFkaXVzOiBudW1iZXIsIGRpcmVjdGlvbjogcm90YXRpb24yNCkge1xyXG5cdFx0dGhpcy5saW5lVG8oLXJhZGl1cyAqIE1hdGguc2luKGRpcmVjdGlvbiAqIFBJMTIpLCByYWRpdXMgKiBNYXRoLmNvcyhkaXJlY3Rpb24gKiBQSTEyKSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0clRvWFkocmFkaXVzOiBudW1iZXIsIGRpcmVjdGlvbjogcm90YXRpb24yNCkge1xyXG5cdFx0cmV0dXJuIFstcmFkaXVzICogTWF0aC5zaW4oZGlyZWN0aW9uICogUEkxMiksIHJhZGl1cyAqIE1hdGguY29zKGRpcmVjdGlvbiAqIFBJMTIpXSBhcyBjb25zdDtcclxuXHR9XHJcblx0YXJjKFxyXG5cdFx0Y3g6IG51bWJlciwgY3k6IG51bWJlciwgcmFkaXVzOiBudW1iZXIsIGZyb206IHJvdGF0aW9uMjQsIHRvOiByb3RhdGlvbjI0LCBkaXI/OiBib29sZWFuXHJcblx0KSB7XHJcblx0XHR0aGlzLmN0eC5hcmMoY3gsIGN5LCByYWRpdXMsIC1mcm9tICogUEkxMiwgLXRvICogUEkxMiwgZGlyKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRmaWxsUmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcclxuXHRcdHRoaXMuY3R4LmZpbGxSZWN0KHgsIHksIHcsIGgpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzYXZlZChmOiAoY3R4OiB0aGlzKSA9PiB2b2lkKSB7XHJcblx0XHR0aGlzLnNhdmUoKTtcclxuXHRcdGYodGhpcyk7XHJcblx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBsb2coLi4uYTogYW55W10pIHtcclxuXHRjb25zb2xlLmVycm9yKC4uLmEpO1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xyXG5cdGZvciAobGV0IG8gb2YgYSlcclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKEpTT04uc3RyaW5naWZ5KG8pKTtcclxufVxyXG4iXX0=