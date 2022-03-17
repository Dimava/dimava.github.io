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
            // let gradient = this.ctx.createLinearGradient(-2, 2, 2, -2);
            let c1 = '#00000000';
            let c2 = '#00000066';
            let n = 20;
            // let n = 20 * 2 * 2;
            // for (let i = 0; i <= n; i++) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3pDb250ZXh0MkQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvX3NoYXBlc3QvU3pDb250ZXh0MkQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQztBQUMxQixNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQVdsQyxNQUFNLE9BQU8sV0FBVztJQUN2QixNQUFNLENBQUMsVUFBVSxDQUFDLEVBQXFCO1FBQ3RDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLENBQUM7UUFDL0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNuQixNQUFNLElBQUksR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDdEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDOUIsR0FBRyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdEIsR0FBRyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDdkIsT0FBTyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsS0FBSztRQUNKLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FB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RUFBRSxDQUFTO1FBQ2xELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELEtBQUssQ0FBQyxDQUFzQjtRQUMzQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEIsQ0FBQztDQUNEO0FBR0QsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFRO0lBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkQsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2QsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZXhwb3J0IGNvbnN0IHJtb2RlID0gdHJ1ZTtcclxuZXhwb3J0IGNvbnN0IFBJMTIgPSAtTWF0aC5QSSAvIDEyO1xyXG5cclxuZXhwb3J0IHR5cGUgcm90YXRpb24yNCA9IG51bWJlciAmIHsgXz86IHJvdGF0aW9uMjQgfVxyXG5leHBvcnQgdHlwZSBjaGFyID0gc3RyaW5nICYgeyBfPzogY2hhciB9O1xyXG5leHBvcnQgdHlwZSBzdHlsZVN0cmluZyA9IHN0cmluZyAmIHsgXz86IHN0eWxlU3RyaW5nIH07XHJcbmV4cG9ydCB0eXBlIGdyYWRpZW50ID0gKFxyXG5cdHwgeyB0eXBlOiAnbm9uZScsIGNvbG9yOiBzdHlsZVN0cmluZyB9XHJcblx0fCB7IHR5cGU6ICdyYWRpYWwxMCcsIGNvbG9yOiBzdHlsZVN0cmluZywgc2Vjb25kYXJ5Q29sb3I6IHN0eWxlU3RyaW5nIH1cclxuKSAmIHsgdHlwZT86IHN0cmluZywgcmVwZWF0PzogbnVtYmVyLCBjb2xvcjogc3R5bGVTdHJpbmcsIHNlY29uZGFyeUNvbG9yPzogc3R5bGVTdHJpbmcgfTtcclxuZXhwb3J0IHR5cGUgc3pTaGFwZUhhc2ggPSBgc3ohJHtzdHJpbmd9YCAmIHsgXz86IHN6U2hhcGVIYXNoIH07XHJcblxyXG5leHBvcnQgY2xhc3MgU3pDb250ZXh0MkQge1xyXG5cdHN0YXRpYyBmcm9tQ2FudmFzKGN2OiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG5cdFx0bGV0IGN0eCA9IGN2LmdldENvbnRleHQoJzJkJykhO1xyXG5cdFx0Y29uc3QgUEkgPSBNYXRoLlBJO1xyXG5cdFx0Y29uc3QgUEkxMiA9IC1QSSAvIDEyO1xyXG5cdFx0Y3R4LnNjYWxlKGN2LndpZHRoIC8gMiwgY3YuaGVpZ2h0IC8gMik7XHJcblx0XHRjdHgudHJhbnNsYXRlKDEsIDEpO1xyXG5cdFx0Y3R4LnJvdGF0ZSgtTWF0aC5QSSAvIDIpO1xyXG5cdFx0Y3R4LnNjYWxlKDEgLyAxLjE1LCAxIC8gMS4xNSk7XHJcblx0XHRjdHgubGluZUNhcCA9ICdyb3VuZCc7XHJcblx0XHRjdHgubGluZUpvaW4gPSAncm91bmQnO1xyXG5cdFx0cmV0dXJuIG5ldyBTekNvbnRleHQyRChjdHgpO1xyXG5cdH1cclxuXHRjbGVhcigpIHtcclxuXHRcdHRoaXMuY3R4LmNsZWFyUmVjdCgtMiwgLTIsIDQsIDQpO1xyXG5cdH1cclxuXHJcblx0Y3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcblx0XHR0aGlzLmN0eCA9IGN0eDtcclxuXHR9XHJcblx0Z2V0IGxpbmVXaWR0aCgpIHsgcmV0dXJuIHRoaXMuY3R4LmxpbmVXaWR0aDsgfVxyXG5cdHNldCBsaW5lV2lkdGgodikgeyB0aGlzLmN0eC5saW5lV2lkdGggPSB2OyB9XHJcblx0Z2V0IHN0cm9rZVN0eWxlKCkgeyByZXR1cm4gdGhpcy5jdHguc3Ryb2tlU3R5bGUgYXMgc3R5bGVTdHJpbmc7IH1cclxuXHRzZXQgc3Ryb2tlU3R5bGUodikgeyB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IHY7IH1cclxuXHRnZXQgZmlsbFN0eWxlKCkgeyByZXR1cm4gdGhpcy5jdHguZmlsbFN0eWxlIGFzIHN0eWxlU3RyaW5nOyB9XHJcblx0c2V0IGZpbGxTdHlsZSh2KSB7XHJcblx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSB2IHx8ICdibGFjayc7XHJcblx0XHRpZiAodiA9PSAnc3otY292ZXInKSB7XHJcblx0XHRcdGxldCBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KDAsIDAsIDAsIDAsIDAsIDIpO1xyXG5cdFx0XHQvLyBsZXQgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgtMiwgMiwgMiwgLTIpO1xyXG5cdFx0XHRsZXQgYzEgPSAnIzAwMDAwMDAwJztcclxuXHRcdFx0bGV0IGMyID0gJyMwMDAwMDA2Nic7XHJcblx0XHRcdGxldCBuID0gMjA7XHJcblx0XHRcdC8vIGxldCBuID0gMjAgKiAyICogMjtcclxuXHRcdFx0Ly8gZm9yIChsZXQgaSA9IDA7IGkgPD0gbjsgaSsrKSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgbjsgaSsrKSB7XHJcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKChpIC0gMC4wMSkgLyBuLCBpICUgMiA/IGMyIDogYzEpO1xyXG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgoaSArIDAuMDEpIC8gbiwgaSAlIDIgPyBjMSA6IGMyKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcclxuXHRcdH1cclxuXHRcdGlmICh2ID09ICdub25lJykge1xyXG5cdFx0XHRsZXQgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCgwLCAwLCAwLCAwLCAwLCAyKTtcclxuXHRcdFx0bGV0IGMxID0gJ3JlZCc7XHJcblx0XHRcdGxldCBjMiA9ICdibHVlJztcclxuXHRcdFx0bGV0IG4gPSAyMDtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gbjsgaSsrKSB7XHJcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKGkgLyBuLCBpICUgMiA/IGMyIDogYzEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xyXG5cdFx0XHQvLyB0aGlzLmN0eC5maWxsU3R5bGUgPSAndHJhbnNwYXJlbnQnO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXQgZ2xvYmFsQWxwaGEoKSB7IHJldHVybiB0aGlzLmN0eC5nbG9iYWxBbHBoYTsgfVxyXG5cdHNldCBnbG9iYWxBbHBoYSh2KSB7IHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gdjsgfVxyXG5cclxuXHRjcmVhdGVHcmFkaWVudEZpbGwoc291cmNlOiBncmFkaWVudCk6IHN0eWxlU3RyaW5nIHwgQ2FudmFzR3JhZGllbnQge1xyXG5cdFx0aWYgKHNvdXJjZS50eXBlID09ICdub25lJykge1xyXG5cdFx0XHRyZXR1cm4gc291cmNlLmNvbG9yO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHNvdXJjZS50eXBlID09ICdyYWRpYWwxMCcpIHtcclxuXHRcdFx0bGV0IGcgPSB0aGlzLmN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCgwLCAwLCAwLCAwLCAwLCAyKTtcclxuXHRcdFx0Y29uc3QgbiA9IDEwO1xyXG5cclxuXHRcdFx0Zy5hZGRDb2xvclN0b3AoMCwgc291cmNlLmNvbG9yKTtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcclxuXHRcdFx0XHRnLmFkZENvbG9yU3RvcCgoaSArIDAuNSkgLyBuLCBzb3VyY2Uuc2Vjb25kYXJ5Q29sb3IpO1xyXG5cdFx0XHRcdGcuYWRkQ29sb3JTdG9wKChpICsgMSkgLyBuLCBzb3VyY2UuY29sb3IpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBnO1xyXG5cdFx0fVxyXG5cdFx0dGhyb3cgMDtcclxuXHR9XHJcblxyXG5cclxuXHRiZWdpblBhdGgoKSB7IHRoaXMuY3R4LmJlZ2luUGF0aCgpOyByZXR1cm4gdGhpczsgfVxyXG5cdGNsb3NlUGF0aCgpIHsgdGhpcy5jdHguY2xvc2VQYXRoKCk7IHJldHVybiB0aGlzOyB9XHJcblx0c3Ryb2tlKCkgeyB0aGlzLmN0eC5zdHJva2UoKTsgcmV0dXJuIHRoaXM7IH1cclxuXHRmaWxsKCkgeyB0aGlzLmN0eC5maWxsKCk7IHJldHVybiB0aGlzOyB9XHJcblx0Y2xpcCgpIHsgdGhpcy5jdHguY2xpcCgpOyByZXR1cm4gdGhpczsgfVxyXG5cdHNhdmUoKSB7IHRoaXMuY3R4LnNhdmUoKTsgcmV0dXJuIHRoaXM7IH1cclxuXHRyZXN0b3JlKCkgeyB0aGlzLmN0eC5yZXN0b3JlKCk7IHJldHVybiB0aGlzOyB9XHJcblxyXG5cdHNjYWxlKHg6IG51bWJlciwgeTogbnVtYmVyID0geCkge1xyXG5cdFx0dGhpcy5jdHguc2NhbGUoeCwgeSk7IHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cm90YXRlKGFuZ2xlOiByb3RhdGlvbjI0KSB7XHJcblx0XHR0aGlzLmN0eC5yb3RhdGUoLWFuZ2xlICogUEkxMik7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0bW92ZVRvKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcblx0XHQvLyBsb2coeyBtb3ZlOiB7IHg6ICt4LnRvRml4ZWQoMyksIHk6ICt5LnRvRml4ZWQoMykgfSB9KTtcclxuXHRcdHRoaXMuY3R4Lm1vdmVUbyh5LCB4KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRtb3ZlVG9SKHI6IG51bWJlciwgYTogcm90YXRpb24yNCkge1xyXG5cdFx0dGhpcy5tb3ZlVG8oLXIgKiBNYXRoLnNpbihhICogUEkxMiksIHIgKiBNYXRoLmNvcyhhICogUEkxMikpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdGxpbmVUbyh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0Ly8gbG9nKHsgbGluZTogeyB4OiAreC50b0ZpeGVkKDMpLCB5OiAreS50b0ZpeGVkKDMpIH0gfSlcclxuXHRcdHRoaXMuY3R4LmxpbmVUbyh5LCB4KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRsaW5lVG9SKHJhZGl1czogbnVtYmVyLCBkaXJlY3Rpb246IHJvdGF0aW9uMjQpIHtcclxuXHRcdHRoaXMubGluZVRvKC1yYWRpdXMgKiBNYXRoLnNpbihkaXJlY3Rpb24gKiBQSTEyKSwgcmFkaXVzICogTWF0aC5jb3MoZGlyZWN0aW9uICogUEkxMikpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdHJUb1hZKHJhZGl1czogbnVtYmVyLCBkaXJlY3Rpb246IHJvdGF0aW9uMjQpIHtcclxuXHRcdHJldHVybiBbLXJhZGl1cyAqIE1hdGguc2luKGRpcmVjdGlvbiAqIFBJMTIpLCByYWRpdXMgKiBNYXRoLmNvcyhkaXJlY3Rpb24gKiBQSTEyKV0gYXMgY29uc3Q7XHJcblx0fVxyXG5cdGFyYyhcclxuXHRcdGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHJhZGl1czogbnVtYmVyLCBmcm9tOiByb3RhdGlvbjI0LCB0bzogcm90YXRpb24yNCwgZGlyPzogYm9vbGVhblxyXG5cdCkge1xyXG5cdFx0dGhpcy5jdHguYXJjKGN4LCBjeSwgcmFkaXVzLCAtZnJvbSAqIFBJMTIsIC10byAqIFBJMTIsIGRpcik7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0ZmlsbFJlY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XHJcblx0XHR0aGlzLmN0eC5maWxsUmVjdCh4LCB5LCB3LCBoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c2F2ZWQoZjogKGN0eDogdGhpcykgPT4gdm9pZCkge1xyXG5cdFx0dGhpcy5zYXZlKCk7XHJcblx0XHRmKHRoaXMpO1xyXG5cdFx0dGhpcy5yZXN0b3JlKCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbG9nKC4uLmE6IGFueVtdKSB7XHJcblx0Y29uc29sZS5lcnJvciguLi5hKTtcclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcclxuXHRmb3IgKGxldCBvIG9mIGEpXHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChKU09OLnN0cmluZ2lmeShvKSk7XHJcbn1cclxuIl19