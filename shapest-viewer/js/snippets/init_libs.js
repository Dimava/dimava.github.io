"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _jp = __importStar(require("fs-jetpack"));
const jp = _jp.cwd().endsWith('snippets') ? _jp.cwd('..') : _jp;
const libs = [
    {
        id: 'vue',
        path: 'vue/dist/vue.global',
        global: 'Vue',
    }, {
        id: 'vue-class-component',
        path: 'vue-class-component/dist/vue-class-component.global',
        global: 'VueClassComponent',
    }, {
        id: '@dimava/vue-prop-decorator-a-variation',
        path: '@dimava/vue-prop-decorator-a-variation/dist/vue-prop-decorator-a-variation.global',
        global: 'VuePropertyDefinitionAVariation',
    },
    { path: 'twind', rel: '/../twind.umd.js' },
    { path: 'twind', rel: '/../observe/observe.umd.js' },
    { path: 'twind', rel: '/../shim/shim.umd.js' },
    { path: '@dimava/poopjs' },
];
function resolve(path) {
    console.log({ path });
    try {
        return require.resolve(path);
    }
    catch { }
    try {
        return require.resolve(path + '.js');
    }
    catch { }
    throw 'fail ' + path;
}
for (let { id, path, global, rel } of libs) {
    let name = (rel ?? path).split('/').pop();
    let source = resolve(path) + (rel ?? '');
    jp.copy(source, `./dist/js/libs/${name}.js`, { overwrite: true });
    if (id && global) {
        jp.write(`./src/libs/${global}.d.ts`, `	
			import * as ${global} from "${id}";
			export as namespace ${global};
			export = ${global};
		`.replace(/\n\t+/g, '\n'));
    }
}
// jp.write('testfile', 'test');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdF9saWJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc25pcHBldHMvaW5pdF9saWJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUFrQztBQUNsQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFFaEUsTUFBTSxJQUFJLEdBQUc7SUFDWjtRQUNDLEVBQUUsRUFBRSxLQUFLO1FBQ1QsSUFBSSxFQUFFLHFCQUFxQjtRQUMzQixNQUFNLEVBQUUsS0FBSztLQUNiLEVBQUU7UUFDRixFQUFFLEVBQUUscUJBQXFCO1FBQ3pCLElBQUksRUFBRSxxREFBcUQ7UUFDM0QsTUFBTSxFQUFFLG1CQUFtQjtLQUMzQixFQUFFO1FBQ0YsRUFBRSxFQUFFLHdDQUF3QztRQUM1QyxJQUFJLEVBQUUsbUZBQW1GO1FBQ3pGLE1BQU0sRUFBRSxpQ0FBaUM7S0FDekM7SUFDRCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixFQUFFO0lBQzFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsNEJBQTRCLEVBQUU7SUFDcEQsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxzQkFBc0IsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtDQUMxQixDQUFDO0FBRUYsU0FBUyxPQUFPLENBQUMsSUFBWTtJQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQTtJQUNuQixJQUFJO1FBQUMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQUM7SUFBQyxNQUFLLEdBQUU7SUFDMUMsSUFBSTtRQUFDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUE7S0FBQztJQUFDLE1BQUssR0FBRTtJQUNsRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDckIsQ0FBQztBQUVELEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLElBQUksRUFBRTtJQUMzQyxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDMUMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGtCQUFrQixJQUFJLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2xFLElBQUksRUFBRSxJQUFJLE1BQU0sRUFBRTtRQUNqQixFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsTUFBTSxPQUFPLEVBQUU7aUJBQ3ZCLE1BQU0sVUFBVSxFQUFFO3lCQUNWLE1BQU07Y0FDakIsTUFBTTtHQUNqQixDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUMzQjtDQUNEO0FBRUQsZ0NBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgX2pwIGZyb20gJ2ZzLWpldHBhY2snO1xyXG5jb25zdCBqcCA9IF9qcC5jd2QoKS5lbmRzV2l0aCgnc25pcHBldHMnKSA/IF9qcC5jd2QoJy4uJykgOiBfanA7XHJcblxyXG5jb25zdCBsaWJzID0gW1xyXG5cdHtcclxuXHRcdGlkOiAndnVlJyxcclxuXHRcdHBhdGg6ICd2dWUvZGlzdC92dWUuZ2xvYmFsJyxcclxuXHRcdGdsb2JhbDogJ1Z1ZScsXHJcblx0fSwge1xyXG5cdFx0aWQ6ICd2dWUtY2xhc3MtY29tcG9uZW50JyxcclxuXHRcdHBhdGg6ICd2dWUtY2xhc3MtY29tcG9uZW50L2Rpc3QvdnVlLWNsYXNzLWNvbXBvbmVudC5nbG9iYWwnLFxyXG5cdFx0Z2xvYmFsOiAnVnVlQ2xhc3NDb21wb25lbnQnLFxyXG5cdH0sIHtcclxuXHRcdGlkOiAnQGRpbWF2YS92dWUtcHJvcC1kZWNvcmF0b3ItYS12YXJpYXRpb24nLFxyXG5cdFx0cGF0aDogJ0BkaW1hdmEvdnVlLXByb3AtZGVjb3JhdG9yLWEtdmFyaWF0aW9uL2Rpc3QvdnVlLXByb3AtZGVjb3JhdG9yLWEtdmFyaWF0aW9uLmdsb2JhbCcsXHJcblx0XHRnbG9iYWw6ICdWdWVQcm9wZXJ0eURlZmluaXRpb25BVmFyaWF0aW9uJyxcclxuXHR9LFxyXG5cdHsgcGF0aDogJ3R3aW5kJywgcmVsOiAnLy4uL3R3aW5kLnVtZC5qcycgfSxcclxuXHR7IHBhdGg6ICd0d2luZCcsIHJlbDogJy8uLi9vYnNlcnZlL29ic2VydmUudW1kLmpzJyB9LFxyXG5cdHsgcGF0aDogJ3R3aW5kJywgcmVsOiAnLy4uL3NoaW0vc2hpbS51bWQuanMnIH0sXHJcblx0eyBwYXRoOiAnQGRpbWF2YS9wb29wanMnIH0sXHJcbl07XHJcblxyXG5mdW5jdGlvbiByZXNvbHZlKHBhdGg6IHN0cmluZykge1xyXG5cdGNvbnNvbGUubG9nKHtwYXRofSlcclxuXHR0cnkge3JldHVybiByZXF1aXJlLnJlc29sdmUocGF0aCl9IGNhdGNoe31cclxuXHR0cnkge3JldHVybiByZXF1aXJlLnJlc29sdmUocGF0aCArICcuanMnKX0gY2F0Y2h7fVxyXG5cdHRocm93ICdmYWlsICcgKyBwYXRoXHJcbn1cclxuXHJcbmZvciAobGV0IHsgaWQsIHBhdGgsIGdsb2JhbCwgcmVsIH0gb2YgbGlicykge1xyXG5cdGxldCBuYW1lID0gKHJlbCA/PyBwYXRoKS5zcGxpdCgnLycpLnBvcCgpO1xyXG5cdGxldCBzb3VyY2UgPSByZXNvbHZlKHBhdGgpICsgKHJlbCA/PyAnJyk7XHJcblx0anAuY29weShzb3VyY2UsIGAuL2Rpc3QvanMvbGlicy8ke25hbWV9LmpzYCwgeyBvdmVyd3JpdGU6IHRydWUgfSk7XHJcblx0aWYgKGlkICYmIGdsb2JhbCkge1xyXG5cdFx0anAud3JpdGUoYC4vc3JjL2xpYnMvJHtnbG9iYWx9LmQudHNgLCBgXHRcclxuXHRcdFx0aW1wb3J0ICogYXMgJHtnbG9iYWx9IGZyb20gXCIke2lkfVwiO1xyXG5cdFx0XHRleHBvcnQgYXMgbmFtZXNwYWNlICR7Z2xvYmFsfTtcclxuXHRcdFx0ZXhwb3J0ID0gJHtnbG9iYWx9O1xyXG5cdFx0YC5yZXBsYWNlKC9cXG5cXHQrL2csICdcXG4nKSk7XHJcblx0fVxyXG59XHJcblxyXG4vLyBqcC53cml0ZSgndGVzdGZpbGUnLCAndGVzdCcpO1xyXG4iXX0=