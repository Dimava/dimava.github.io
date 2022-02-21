var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SzLayer, SzLayerQuad, SzInfo, SzLayerArea } from './shapest/layer.js';
import { SzContext2D } from './shapest/SzContext2D.js';
const testTemplate = {
    cuts: [
    // { from: 10, to: 10, shape: 'line', color: 'blue' },
    // { from: 14, to: 14, shape: 'line', color: 'blue' },
    ],
    quads: [
        { shape: 'square', color: 'green', from: 2, to: 4 },
        { shape: 'circle', color: 'pink', from: 5, to: 19 },
        { shape: 'square', color: 'green', from: 20, to: 22 },
    ],
    areas: [
    // { shape: 'sector', color: '#ff0000', from: 11, to: 13 },
    ],
};
let layer = // new SzLayer();
 SzLayer.fromShortKey('q!C-06C-6cC-ciC-io|a!su06su6csucisuio|c!');
// SzInfo.quad.exampleLayer('circle');
// new SzLayer();
// new SzLayer(testTemplate);
let rawData = {
    layer, layers: [layer]
};
let data = Vue.reactive({ source: rawData });
Object.assign(globalThis, { layer, data, rawData });
// let layer = SzLayer.createTest();
// layer.drawCenteredNormalized(sctx);
let LayerCanvasVue = class LayerCanvasVue extends VueImpl.with(makeClass({
    layer: [SzLayer],
    layers: [Array],
    size: Number,
})) {
    get _t() {
        return `
			<canvas ref="cv"
				:width="size" :height="size"
				style="border: 1px solid black;"
				:style="{width: size + 'px', height: size + 'px'}"
				@click=redraw() />
		`;
    }
    v_ctx = null;
    get ctx() {
        if (this.v_ctx)
            return this.v_ctx;
        if (!this.$refs.cv)
            return null;
        return this.v_ctx = SzContext2D.fromCanvas(this.$refs.cv);
    }
    mounted() {
        this.redraw();
    }
    redraw() {
        if (!this.ctx)
            return;
        this.ctx.clear();
        if (this.layer) {
            this.layer.drawCenteredNormalized(this.ctx);
        }
        if (this.layers) {
            this.layers.map((e, i) => {
                e.drawCenteredLayerScaled(this.ctx, i);
            });
        }
    }
};
__decorate([
    Template
], LayerCanvasVue.prototype, "_t", null);
LayerCanvasVue = __decorate([
    GlobalComponent({
        watch: {
            layers: {
                handler: function (val) {
                    this.redraw();
                },
                deep: true,
            }
        }
    })
], LayerCanvasVue);
let QuadEditorVue = class QuadEditorVue extends VueImpl.with(makeClass({
    quad: [SzLayerQuad],
    area: [SzLayerArea],
})) {
    get _t() {
        let c = this.allColors[0];
        let q = this.allQuads[0];
        return `
			<a-row>
				<LayerCanvasVue :size="64" :layer="layer" :key="layer.getHash()" />
				&emsp;
				<div style="line-height:0" >
					<LayerCanvasVue :size="32" v-if="quad"
						v-for="${q} of ${this.allQuads}"
						:title="${q}"
						:layer="${this.quadLayer(q)}"
						:class="${this.quad.shape == q ? 'selected' : 'unselected'}"
						@click="${this.quad.shape = q}" />
					<br>
					<LayerCanvasVue :size="32" v-if="area"
						v-for="${c} of ${this.allColors}"
						:title="${c}"
						:layer="${this.colorLayer(c)}"
						:class="${this.area.color == c ? 'selected' : 'unselected'}"
						@click="${this.area.color = c}" />
					<br>
					<a-slider
						range :min="0" :max="30" :marks="${{ 0: '', 6: '', 12: '', 18: '', 24: '', 30: '' }}"
						v-model:value="fromTo"
						style="width: 300px" />
				</div>
			</a-row>
		`;
    }
    rnd = 0;
    get layer() {
        this.rnd;
        if (this.quad) {
            return new SzLayer({
                quads: [this.quad],
                areas: [new SzLayerArea({ from: 0, to: 24, color: 'grey', shape: 'sector' })],
            });
        }
        if (this.area) {
            return new SzLayer({
                quads: [new SzLayerQuad({ to: 24 })],
                areas: [this.area],
            });
        }
        return SzInfo.color.exampleLayer('grey');
    }
    get allColors() {
        return SzInfo.color.colorList;
    }
    get allQuads() {
        return SzInfo.quad.quadList;
    }
    colorLayer(color) {
        return SzInfo.color.exampleLayer(color);
    }
    quadLayer(shape) {
        return SzInfo.quad.exampleLayer(shape);
    }
    get fromTo() {
        let e = this.quad || this.area;
        return [e.from, e.to];
    }
    set fromTo([from, to]) {
        let e = this.quad || this.area;
        if (e.to == to) {
            e.to += from - e.from;
            e.from = from;
        }
        else {
            e.to = to;
        }
    }
};
__decorate([
    Template
], QuadEditorVue.prototype, "_t", null);
QuadEditorVue = __decorate([
    GlobalComponent
], QuadEditorVue);
class LayerVue extends VueImpl.with(makeClass({
    source: null,
})) {
    get _t() {
        return `
			<APP>
				<h1> Shapest viewer </h1>
				<a-row>
					<a-col>
						<LayerCanvasVue :size="256" :layers="layers" />
						<template v-for="(l, i) of layers">
							<br v-if="i % 2 == 0">
							<LayerCanvasVue :size="128" :layer="l"
								:class="i == selectedLayer ? 'selected' : 'unselected'"
								@click="selectedLayerIndex = i"
								/>
						</template>
						<br>
						<button @click="${this.popLayer}"> - </button>
						<button @click="${this.pushLayer}"> + </button>
						<br>
						<input :value="${this.hash}" @change="hash=$event.target.value" style="width: 100%;font-family: monospace;font-size: small;" />
					</a-col>
					<a-col>
						<QuadEditorVue
							v-for="(quad, i) of selectedLayer.quads" :key="selectedLayerIndex + i*10"
							:quad="quad" />
						<button @click="${this.popQuad}"> - </button>
						<button @click="${this.pushQuad}"> + </button>
						<QuadEditorVue
							v-for="(area, i) of selectedLayer.areas" :key="selectedLayerIndex + i*10"
							:area="area" />
						<button @click="${this.popArea}"> - </button>
						<button @click="${this.pushArea}"> + </button>
					</a-col>
				</a-row>
			</APP>
		`;
    }
    ;
    get layers() {
        return this.source.layers;
    }
    selectedLayerIndex = 0;
    get selectedLayer() {
        return this.layers[this.selectedLayerIndex];
    }
    mounted() {
        // this.pushQuad();
        // this.pushQuad();
        // this.pushQuad();
        // this.pushQuad();
    }
    ctx = null;
    setFromTo(quad, v) {
        quad.from = v[0];
        quad.to = v[1];
    }
    popQuad() {
        this.selectedLayer.quads.pop();
    }
    pushQuad() {
        let from = this.selectedLayer.quads.slice(-1)[0]?.to ?? 0;
        this.selectedLayer.quads.push(new SzLayerQuad({ from, to: from + 6 }));
    }
    popArea() {
        this.selectedLayer.areas.pop();
    }
    pushArea() {
        let from = this.selectedLayer.areas.slice(-1)[0]?.to ?? 0;
        this.selectedLayer.areas.push(new SzLayerArea({ from, to: from + 6 }));
    }
    popLayer() { this.layers.pop(); }
    pushLayer() {
        this.layers.push(SzLayer.fromShortKey('q!C-06C-6cC-ciC-io|a!su06su6csucisuio|c!'));
    }
    get hash() {
        return 'sz!' + this.layers.map(e => e.clone().getHash()).join(':');
    }
    set hash(v) {
        this.source.layers = v.slice(3).split(':').map(SzLayer.fromShortKey);
    }
}
__decorate([
    Template
], LayerVue.prototype, "_t", null);
createApp(LayerVue, data).use(antd).mount('body');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZpZXdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQSxPQUFPLEVBQUUsT0FBTyxFQUFZLFdBQVcsRUFBRSxNQUFNLEVBQW9CLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzFHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUd2RCxNQUFNLFlBQVksR0FBYTtJQUM5QixJQUFJLEVBQUU7SUFDTCxzREFBc0Q7SUFDdEQsc0RBQXNEO0tBQ3REO0lBQ0QsS0FBSyxFQUFFO1FBQ04sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ25ELEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNuRCxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7S0FDckQ7SUFDRCxLQUFLLEVBQUU7SUFDTiwyREFBMkQ7S0FDM0Q7Q0FDRCxDQUFBO0FBRUQsSUFBSSxLQUFLLEdBQUUsaUJBQWlCO0NBQzNCLE9BQU8sQ0FBQyxZQUFZLENBQUMsMENBQTBDLENBQUMsQ0FBQTtBQUNqRSxzQ0FBc0M7QUFDdEMsaUJBQWlCO0FBQ2pCLDZCQUE2QjtBQUU3QixJQUFJLE9BQU8sR0FBRztJQUNiLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDdEIsQ0FBQTtBQUNELElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUM3QyxNQUFNLENB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LEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuaW1wb3J0IHsgUHJvcE9wdGlvbnNXaXRoIH0gZnJvbSAnQGRpbWF2YS92dWUtcHJvcC1kZWNvcmF0b3ItYS12YXJpYXRpb24nO1xyXG5pbXBvcnQgeyBTekxheWVyLCBJU3pMYXllciwgU3pMYXllclF1YWQsIFN6SW5mbywgY29sb3IsIHF1YWRTaGFwZSwgU3pMYXllckFyZWEgfSBmcm9tICcuL3NoYXBlc3QvbGF5ZXIuanMnXHJcbmltcG9ydCB7IFN6Q29udGV4dDJEIH0gZnJvbSAnLi9zaGFwZXN0L1N6Q29udGV4dDJELmpzJztcclxuXHJcblxyXG5jb25zdCB0ZXN0VGVtcGxhdGU6IElTekxheWVyID0ge1xyXG5cdGN1dHM6IFtcclxuXHRcdC8vIHsgZnJvbTogMTAsIHRvOiAxMCwgc2hhcGU6ICdsaW5lJywgY29sb3I6ICdibHVlJyB9LFxyXG5cdFx0Ly8geyBmcm9tOiAxNCwgdG86IDE0LCBzaGFwZTogJ2xpbmUnLCBjb2xvcjogJ2JsdWUnIH0sXHJcblx0XSxcclxuXHRxdWFkczogW1xyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyLCB0bzogNCB9LFxyXG5cdFx0eyBzaGFwZTogJ2NpcmNsZScsIGNvbG9yOiAncGluaycsIGZyb206IDUsIHRvOiAxOSB9LFxyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyMCwgdG86IDIyIH0sXHJcblx0XSxcclxuXHRhcmVhczogW1xyXG5cdFx0Ly8geyBzaGFwZTogJ3NlY3RvcicsIGNvbG9yOiAnI2ZmMDAwMCcsIGZyb206IDExLCB0bzogMTMgfSxcclxuXHRdLFxyXG59XHJcblxyXG5sZXQgbGF5ZXIgPS8vIG5ldyBTekxheWVyKCk7XHJcblx0U3pMYXllci5mcm9tU2hvcnRLZXkoJ3EhQy0wNkMtNmNDLWNpQy1pb3xhIXN1MDZzdTZjc3VjaXN1aW98YyEnKVxyXG4vLyBTekluZm8ucXVhZC5leGFtcGxlTGF5ZXIoJ2NpcmNsZScpO1xyXG4vLyBuZXcgU3pMYXllcigpO1xyXG4vLyBuZXcgU3pMYXllcih0ZXN0VGVtcGxhdGUpO1xyXG5cclxubGV0IHJhd0RhdGEgPSB7XHJcblx0bGF5ZXIsIGxheWVyczogW2xheWVyXVxyXG59XHJcbmxldCBkYXRhID0gVnVlLnJlYWN0aXZlKHsgc291cmNlOiByYXdEYXRhIH0pO1xyXG5PYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgbGF5ZXIsIGRhdGEsIHJhd0RhdGEgfSk7XHJcbi8vIGxldCBsYXllciA9IFN6TGF5ZXIuY3JlYXRlVGVzdCgpO1xyXG5cclxuLy8gbGF5ZXIuZHJhd0NlbnRlcmVkTm9ybWFsaXplZChzY3R4KTtcclxuXHJcblxyXG5AR2xvYmFsQ29tcG9uZW50KHtcclxuXHR3YXRjaDoge1xyXG5cdFx0bGF5ZXJzOiB7XHJcblx0XHRcdGhhbmRsZXI6IGZ1bmN0aW9uICh2YWwpIHtcclxuXHRcdFx0XHR0aGlzLnJlZHJhdygpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkZWVwOiB0cnVlLFxyXG5cdFx0fVxyXG5cdH1cclxufSlcclxuY2xhc3MgTGF5ZXJDYW52YXNWdWUgZXh0ZW5kcyBWdWVJbXBsLndpdGgobWFrZUNsYXNzKHtcclxuXHRsYXllcjogW1N6TGF5ZXJdLFxyXG5cdGxheWVyczogW0FycmF5XSBhcyBhbnkgYXMgUHJvcE9wdGlvbnNXaXRoPFN6TGF5ZXJbXSwgbmV2ZXIsIGZhbHNlPixcclxuXHRzaXplOiBOdW1iZXIsXHJcbn0pKSB7XHJcblx0QFRlbXBsYXRlXHJcblx0Z2V0IF90KCkge1xyXG5cdFx0cmV0dXJuIGBcclxuXHRcdFx0PGNhbnZhcyByZWY9XCJjdlwiXHJcblx0XHRcdFx0OndpZHRoPVwic2l6ZVwiIDpoZWlnaHQ9XCJzaXplXCJcclxuXHRcdFx0XHRzdHlsZT1cImJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1wiXHJcblx0XHRcdFx0OnN0eWxlPVwie3dpZHRoOiBzaXplICsgJ3B4JywgaGVpZ2h0OiBzaXplICsgJ3B4J31cIlxyXG5cdFx0XHRcdEBjbGljaz1yZWRyYXcoKSAvPlxyXG5cdFx0YDtcclxuXHR9XHJcblx0dl9jdHg6IFN6Q29udGV4dDJEID0gbnVsbCBhcyBhbnk7XHJcblx0Z2V0IGN0eCgpIHtcclxuXHRcdGlmICh0aGlzLnZfY3R4KSByZXR1cm4gdGhpcy52X2N0eDtcclxuXHRcdGlmICghdGhpcy4kcmVmcy5jdikgcmV0dXJuIG51bGw7XHJcblx0XHRyZXR1cm4gdGhpcy52X2N0eCA9IFN6Q29udGV4dDJELmZyb21DYW52YXModGhpcy4kcmVmcy5jdiBhcyBIVE1MQ2FudmFzRWxlbWVudCk7XHJcblx0fVxyXG5cdG1vdW50ZWQoKSB7XHJcblx0XHR0aGlzLnJlZHJhdygpO1xyXG5cdH1cclxuXHRyZWRyYXcoKSB7XHJcblx0XHRpZiAoIXRoaXMuY3R4KSByZXR1cm47XHJcblx0XHR0aGlzLmN0eC5jbGVhcigpO1xyXG5cdFx0aWYgKHRoaXMubGF5ZXIpIHtcclxuXHRcdFx0dGhpcy5sYXllci5kcmF3Q2VudGVyZWROb3JtYWxpemVkKHRoaXMuY3R4KTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLmxheWVycykge1xyXG5cdFx0XHR0aGlzLmxheWVycy5tYXAoKGUsIGkpID0+IHtcclxuXHRcdFx0XHRlLmRyYXdDZW50ZXJlZExheWVyU2NhbGVkKHRoaXMuY3R4ISwgaSk7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5AR2xvYmFsQ29tcG9uZW50XHJcbmNsYXNzIFF1YWRFZGl0b3JWdWUgZXh0ZW5kcyBWdWVJbXBsLndpdGgobWFrZUNsYXNzKHtcclxuXHRxdWFkOiBbU3pMYXllclF1YWRdIGFzIGFueSBhcyBQcm9wT3B0aW9uc1dpdGg8U3pMYXllclF1YWQsIG5ldmVyLCB0cnVlPixcclxuXHRhcmVhOiBbU3pMYXllckFyZWFdIGFzIGFueSBhcyBQcm9wT3B0aW9uc1dpdGg8U3pMYXllckFyZWEsIG5ldmVyLCB0cnVlPixcclxufSkpIHtcclxuXHRAVGVtcGxhdGVcclxuXHRnZXQgX3QoKSB7XHJcblx0XHRsZXQgYyA9IHRoaXMuYWxsQ29sb3JzWzBdO1xyXG5cdFx0bGV0IHEgPSB0aGlzLmFsbFF1YWRzWzBdO1xyXG5cdFx0cmV0dXJuIGBcclxuXHRcdFx0PGEtcm93PlxyXG5cdFx0XHRcdDxMYXllckNhbnZhc1Z1ZSA6c2l6ZT1cIjY0XCIgOmxheWVyPVwibGF5ZXJcIiA6a2V5PVwibGF5ZXIuZ2V0SGFzaCgpXCIgLz5cclxuXHRcdFx0XHQmZW1zcDtcclxuXHRcdFx0XHQ8ZGl2IHN0eWxlPVwibGluZS1oZWlnaHQ6MFwiID5cclxuXHRcdFx0XHRcdDxMYXllckNhbnZhc1Z1ZSA6c2l6ZT1cIjMyXCIgdi1pZj1cInF1YWRcIlxyXG5cdFx0XHRcdFx0XHR2LWZvcj1cIiR7cX0gb2YgJHt0aGlzLmFsbFF1YWRzfVwiXHJcblx0XHRcdFx0XHRcdDp0aXRsZT1cIiR7cX1cIlxyXG5cdFx0XHRcdFx0XHQ6bGF5ZXI9XCIke3RoaXMucXVhZExheWVyKHEpfVwiXHJcblx0XHRcdFx0XHRcdDpjbGFzcz1cIiR7dGhpcy5xdWFkLnNoYXBlID09IHEgPyAnc2VsZWN0ZWQnIDogJ3Vuc2VsZWN0ZWQnfVwiXHJcblx0XHRcdFx0XHRcdEBjbGljaz1cIiR7dGhpcy5xdWFkLnNoYXBlID0gcX1cIiAvPlxyXG5cdFx0XHRcdFx0PGJyPlxyXG5cdFx0XHRcdFx0PExheWVyQ2FudmFzVnVlIDpzaXplPVwiMzJcIiB2LWlmPVwiYXJlYVwiXHJcblx0XHRcdFx0XHRcdHYtZm9yPVwiJHtjfSBvZiAke3RoaXMuYWxsQ29sb3JzfVwiXHJcblx0XHRcdFx0XHRcdDp0aXRsZT1cIiR7Y31cIlxyXG5cdFx0XHRcdFx0XHQ6bGF5ZXI9XCIke3RoaXMuY29sb3JMYXllcihjKX1cIlxyXG5cdFx0XHRcdFx0XHQ6Y2xhc3M9XCIke3RoaXMuYXJlYS5jb2xvciA9PSBjID8gJ3NlbGVjdGVkJyA6ICd1bnNlbGVjdGVkJ31cIlxyXG5cdFx0XHRcdFx0XHRAY2xpY2s9XCIke3RoaXMuYXJlYS5jb2xvciA9IGN9XCIgLz5cclxuXHRcdFx0XHRcdDxicj5cclxuXHRcdFx0XHRcdDxhLXNsaWRlclxyXG5cdFx0XHRcdFx0XHRyYW5nZSA6bWluPVwiMFwiIDptYXg9XCIzMFwiIDptYXJrcz1cIiR7eyAwOiAnJywgNjogJycsIDEyOiAnJywgMTg6ICcnLCAyNDogJycsIDMwOiAnJyB9fVwiXHJcblx0XHRcdFx0XHRcdHYtbW9kZWw6dmFsdWU9XCJmcm9tVG9cIlxyXG5cdFx0XHRcdFx0XHRzdHlsZT1cIndpZHRoOiAzMDBweFwiIC8+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvYS1yb3c+XHJcblx0XHRgO1xyXG5cdH1cclxuXHRybmQgPSAwO1xyXG5cdGdldCBsYXllcigpIHtcclxuXHRcdHRoaXMucm5kO1xyXG5cdFx0aWYgKHRoaXMucXVhZCkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRcdHF1YWRzOiBbdGhpcy5xdWFkXSxcclxuXHRcdFx0XHRhcmVhczogW25ldyBTekxheWVyQXJlYSh7IGZyb206IDAsIHRvOiAyNCwgY29sb3I6ICdncmV5Jywgc2hhcGU6ICdzZWN0b3InIH0pXSxcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5hcmVhKSB7XHJcblx0XHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdFx0cXVhZHM6IFtuZXcgU3pMYXllclF1YWQoeyB0bzogMjQgfSldLFxyXG5cdFx0XHRcdGFyZWFzOiBbdGhpcy5hcmVhXSxcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gU3pJbmZvLmNvbG9yLmV4YW1wbGVMYXllcignZ3JleScpO1xyXG5cdH1cclxuXHRnZXQgYWxsQ29sb3JzKCkge1xyXG5cdFx0cmV0dXJuIFN6SW5mby5jb2xvci5jb2xvckxpc3Q7XHJcblx0fVxyXG5cdGdldCBhbGxRdWFkcygpIHtcclxuXHRcdHJldHVybiBTekluZm8ucXVhZC5xdWFkTGlzdDtcclxuXHR9XHJcblx0Y29sb3JMYXllcihjb2xvcjogY29sb3IpIHtcclxuXHRcdHJldHVybiBTekluZm8uY29sb3IuZXhhbXBsZUxheWVyKGNvbG9yKTtcclxuXHR9XHJcblx0cXVhZExheWVyKHNoYXBlOiBxdWFkU2hhcGUpIHtcclxuXHRcdHJldHVybiBTekluZm8ucXVhZC5leGFtcGxlTGF5ZXIoc2hhcGUpO1xyXG5cdH1cclxuXHRnZXQgZnJvbVRvKCk6IFtudW1iZXIsIG51bWJlcl0ge1xyXG5cdFx0bGV0IGUgPSB0aGlzLnF1YWQgfHwgdGhpcy5hcmVhO1xyXG5cdFx0cmV0dXJuIFtlLmZyb20sIGUudG9dO1xyXG5cdH1cclxuXHRzZXQgZnJvbVRvKFtmcm9tLCB0b106IFtudW1iZXIsIG51bWJlcl0pIHtcclxuXHRcdGxldCBlID0gdGhpcy5xdWFkIHx8IHRoaXMuYXJlYTtcclxuXHRcdGlmIChlLnRvID09IHRvKSB7XHJcblx0XHRcdGUudG8gKz0gZnJvbSAtIGUuZnJvbTtcclxuXHRcdFx0ZS5mcm9tID0gZnJvbTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGUudG8gPSB0bztcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5jbGFzcyBMYXllclZ1ZSBleHRlbmRzIFZ1ZUltcGwud2l0aChtYWtlQ2xhc3Moe1xyXG5cdHNvdXJjZTogbnVsbCBhcyBhbnkgYXMgUHJvcE9wdGlvbnNXaXRoPHsgbGF5ZXJzOiBTekxheWVyW10gfSwgbmV2ZXIsIHRydWU+LFxyXG59KSkge1xyXG5cdEBUZW1wbGF0ZVxyXG5cdGdldCBfdCgpIHtcclxuXHRcdHJldHVybiBgXHJcblx0XHRcdDxBUFA+XHJcblx0XHRcdFx0PGgxPiBTaGFwZXN0IHZpZXdlciA8L2gxPlxyXG5cdFx0XHRcdDxhLXJvdz5cclxuXHRcdFx0XHRcdDxhLWNvbD5cclxuXHRcdFx0XHRcdFx0PExheWVyQ2FudmFzVnVlIDpzaXplPVwiMjU2XCIgOmxheWVycz1cImxheWVyc1wiIC8+XHJcblx0XHRcdFx0XHRcdDx0ZW1wbGF0ZSB2LWZvcj1cIihsLCBpKSBvZiBsYXllcnNcIj5cclxuXHRcdFx0XHRcdFx0XHQ8YnIgdi1pZj1cImkgJSAyID09IDBcIj5cclxuXHRcdFx0XHRcdFx0XHQ8TGF5ZXJDYW52YXNWdWUgOnNpemU9XCIxMjhcIiA6bGF5ZXI9XCJsXCJcclxuXHRcdFx0XHRcdFx0XHRcdDpjbGFzcz1cImkgPT0gc2VsZWN0ZWRMYXllciA/ICdzZWxlY3RlZCcgOiAndW5zZWxlY3RlZCdcIlxyXG5cdFx0XHRcdFx0XHRcdFx0QGNsaWNrPVwic2VsZWN0ZWRMYXllckluZGV4ID0gaVwiXHJcblx0XHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHQ8L3RlbXBsYXRlPlxyXG5cdFx0XHRcdFx0XHQ8YnI+XHJcblx0XHRcdFx0XHRcdDxidXR0b24gQGNsaWNrPVwiJHt0aGlzLnBvcExheWVyfVwiPiAtIDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHQ8YnV0dG9uIEBjbGljaz1cIiR7dGhpcy5wdXNoTGF5ZXJ9XCI+ICsgPC9idXR0b24+XHJcblx0XHRcdFx0XHRcdDxicj5cclxuXHRcdFx0XHRcdFx0PGlucHV0IDp2YWx1ZT1cIiR7dGhpcy5oYXNofVwiIEBjaGFuZ2U9XCJoYXNoPSRldmVudC50YXJnZXQudmFsdWVcIiBzdHlsZT1cIndpZHRoOiAxMDAlO2ZvbnQtZmFtaWx5OiBtb25vc3BhY2U7Zm9udC1zaXplOiBzbWFsbDtcIiAvPlxyXG5cdFx0XHRcdFx0PC9hLWNvbD5cclxuXHRcdFx0XHRcdDxhLWNvbD5cclxuXHRcdFx0XHRcdFx0PFF1YWRFZGl0b3JWdWVcclxuXHRcdFx0XHRcdFx0XHR2LWZvcj1cIihxdWFkLCBpKSBvZiBzZWxlY3RlZExheWVyLnF1YWRzXCIgOmtleT1cInNlbGVjdGVkTGF5ZXJJbmRleCArIGkqMTBcIlxyXG5cdFx0XHRcdFx0XHRcdDpxdWFkPVwicXVhZFwiIC8+XHJcblx0XHRcdFx0XHRcdDxidXR0b24gQGNsaWNrPVwiJHt0aGlzLnBvcFF1YWR9XCI+IC0gPC9idXR0b24+XHJcblx0XHRcdFx0XHRcdDxidXR0b24gQGNsaWNrPVwiJHt0aGlzLnB1c2hRdWFkfVwiPiArIDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHQ8UXVhZEVkaXRvclZ1ZVxyXG5cdFx0XHRcdFx0XHRcdHYtZm9yPVwiKGFyZWEsIGkpIG9mIHNlbGVjdGVkTGF5ZXIuYXJlYXNcIiA6a2V5PVwic2VsZWN0ZWRMYXllckluZGV4ICsgaSoxMFwiXHJcblx0XHRcdFx0XHRcdFx0OmFyZWE9XCJhcmVhXCIgLz5cclxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBAY2xpY2s9XCIke3RoaXMucG9wQXJlYX1cIj4gLSA8L2J1dHRvbj5cclxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBAY2xpY2s9XCIke3RoaXMucHVzaEFyZWF9XCI+ICsgPC9idXR0b24+XHJcblx0XHRcdFx0XHQ8L2EtY29sPlxyXG5cdFx0XHRcdDwvYS1yb3c+XHJcblx0XHRcdDwvQVBQPlxyXG5cdFx0YDtcclxuXHR9O1xyXG5cdGdldCBsYXllcnMoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5zb3VyY2UubGF5ZXJzO1xyXG5cdH1cclxuXHRzZWxlY3RlZExheWVySW5kZXggPSAwO1xyXG5cdGdldCBzZWxlY3RlZExheWVyKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMubGF5ZXJzW3RoaXMuc2VsZWN0ZWRMYXllckluZGV4XTtcclxuXHR9XHJcblxyXG5cdG1vdW50ZWQoKSB7XHJcblx0XHQvLyB0aGlzLnB1c2hRdWFkKCk7XHJcblx0XHQvLyB0aGlzLnB1c2hRdWFkKCk7XHJcblx0XHQvLyB0aGlzLnB1c2hRdWFkKCk7XHJcblx0XHQvLyB0aGlzLnB1c2hRdWFkKCk7XHJcblx0fVxyXG5cclxuXHRjdHg6IFN6Q29udGV4dDJEIHwgbnVsbCA9IG51bGw7XHJcblxyXG5cdHNldEZyb21UbyhxdWFkOiBTekxheWVyUXVhZCwgdjogW251bWJlciwgbnVtYmVyXSkge1xyXG5cdFx0cXVhZC5mcm9tID0gdlswXTtcclxuXHRcdHF1YWQudG8gPSB2WzFdO1xyXG5cdH1cclxuXHJcblx0cG9wUXVhZCgpIHtcclxuXHRcdHRoaXMuc2VsZWN0ZWRMYXllci5xdWFkcy5wb3AoKTtcclxuXHR9XHJcblx0cHVzaFF1YWQoKSB7XHJcblx0XHRsZXQgZnJvbSA9IHRoaXMuc2VsZWN0ZWRMYXllci5xdWFkcy5zbGljZSgtMSlbMF0/LnRvID8/IDA7XHJcblx0XHR0aGlzLnNlbGVjdGVkTGF5ZXIucXVhZHMucHVzaChuZXcgU3pMYXllclF1YWQoeyBmcm9tLCB0bzogZnJvbSArIDYgfSkpO1xyXG5cdH1cclxuXHRwb3BBcmVhKCkge1xyXG5cdFx0dGhpcy5zZWxlY3RlZExheWVyLmFyZWFzLnBvcCgpO1xyXG5cdH1cclxuXHRwdXNoQXJlYSgpIHtcclxuXHRcdGxldCBmcm9tID0gdGhpcy5zZWxlY3RlZExheWVyLmFyZWFzLnNsaWNlKC0xKVswXT8udG8gPz8gMDtcclxuXHRcdHRoaXMuc2VsZWN0ZWRMYXllci5hcmVhcy5wdXNoKG5ldyBTekxheWVyQXJlYSh7IGZyb20sIHRvOiBmcm9tICsgNiB9KSk7XHJcblx0fVxyXG5cclxuXHRwb3BMYXllcigpIHsgdGhpcy5sYXllcnMucG9wKCk7IH1cclxuXHRwdXNoTGF5ZXIoKSB7XHJcblx0XHR0aGlzLmxheWVycy5wdXNoKFxyXG5cdFx0XHRTekxheWVyLmZyb21TaG9ydEtleSgncSFDLTA2Qy02Y0MtY2lDLWlvfGEhc3UwNnN1NmNzdWNpc3Vpb3xjIScpXHJcblx0XHQpO1xyXG5cdH1cclxuXHRnZXQgaGFzaCgpIHtcclxuXHRcdHJldHVybiAnc3ohJyArIHRoaXMubGF5ZXJzLm1hcChlID0+IGUuY2xvbmUoKS5nZXRIYXNoKCkpLmpvaW4oJzonKTtcclxuXHR9XHJcblx0c2V0IGhhc2godikge1xyXG5cdFx0dGhpcy5zb3VyY2UubGF5ZXJzID0gdi5zbGljZSgzKS5zcGxpdCgnOicpLm1hcChTekxheWVyLmZyb21TaG9ydEtleSk7XHJcblx0fVxyXG59XHJcblxyXG5jcmVhdGVBcHAoTGF5ZXJWdWUsIGRhdGEpLnVzZShhbnRkKS5tb3VudCgnYm9keScpOyJdfQ==