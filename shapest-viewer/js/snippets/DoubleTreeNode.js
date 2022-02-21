"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleTreeSubnode = exports.DoubleTreeNode = exports.folders = exports.knownFileExtensions = exports.rootDst = exports.rootSrc = void 0;
const fs_1 = require("fs");
const fs_jetpack_1 = __importDefault(require("fs-jetpack"));
const probe_image_size_1 = __importDefault(require("probe-image-size"));
const sharp_1 = __importDefault(require("sharp"));
exports.rootSrc = fs_jetpack_1.default.cwd('dist/img-src');
exports.rootDst = fs_jetpack_1.default.cwd('dist/img-dist');
exports.knownFileExtensions = {
    "parts": "ignored",
    "mp4": "video",
    "png": "image",
    "jpg": "image",
    "gif": "image",
    "mp3": "other",
    "webm": "video",
    "cbr": "other",
    "jpeg": "image",
    "m4v": "other",
    "!qb": "ignored",
    "mega": "ignored",
    "txt": "other",
    "mov": "video",
    "flv": "video",
    "rar": "other",
    "pdf": "other",
    "zip": "other",
    "webp": "image",
    "avi": "video",
    "html": "other",
    "json": "other",
    "js": "other",
    "ts": "other",
    "md": "other",
    "css": "other",
    "lock": "ignored",
    "cmd": "other",
    'delete': 'ignored',
    'ico': 'ignored',
    'psd': 'ignored',
};
exports.folders = exports.rootSrc.list('.').filter(e => exports.rootSrc.exists(e) == 'dir');
// folders = folders.filter(e => !e.includes('Sayika'))
class DoubleTreeNode {
    name = '';
    path = '';
    type;
    ext = '';
    extType;
    children = [];
    left;
    right;
    isHardLink = false;
    constructor(path) {
        this.path = path;
        this.ext = path.split('.').pop().toLowerCase();
        this.extType = exports.knownFileExtensions[this.ext];
        return new Promise(async (r) => {
            // console.log(this)
            let left = await new DoubleTreeSubnode(path, exports.rootSrc, this);
            let right = await new DoubleTreeSubnode(path, exports.rootDst, this);
            if (left.size > 0)
                this.left = left;
            if (right.size > 0)
                this.right = right;
            let childPaths = Array.from(new Set([...left?.children ?? [], ...right?.children ?? []])).map(e => `${path}/${e}`);
            delete left.children;
            delete right.children;
            this.children = await Promise.all(childPaths.map(e => new DoubleTreeNode(e)));
            if (this.type == 'dir') {
                delete this.left;
                delete this.right;
                delete this.ext;
                delete this.extType;
                delete this.isHardLink;
            }
            else {
                delete this.children;
                if (!this.left || !this.right) {
                    this.isHardLink = false;
                }
                else {
                    this.isHardLink = (0, fs_1.statSync)(this.leftPath).ino == (0, fs_1.statSync)(this.rightPath).ino;
                }
            }
            // console.log(path, this)
            r(this);
        });
    }
    get leftPath() {
        return exports.rootSrc.path(this.path);
    }
    get rightPath() {
        return exports.rootDst.path(this.path);
    }
    async makeHardlink() {
        // jp.__proto__.link = function(from, to) {
        // 	fs.linkSync(this.path(from), this.path(to));
        // }
        if (this.isHardLink || this.right)
            throw this;
        exports.rootDst.dir(this.rightPath + '/..');
        (0, fs_1.linkSync)(this.leftPath, this.rightPath);
        return new DoubleTreeNode(this.path);
    }
    async makeCopy() {
        exports.rootSrc.copy(this.leftPath, this.rightPath, { overwrite: true });
        return new DoubleTreeNode(this.path);
    }
    async makeSmallerImage() {
        let newHeight = this.left.height;
        if (newHeight > 1080 * 1.5)
            newHeight = 1080;
        let cv = (0, sharp_1.default)(this.leftPath, { animated: true });
        if (this.left.height > 1080 * 1.5) {
            cv = cv.resize({ fastShrinkOnLoad: false, height: 1080, withoutEnlargement: true });
        }
        cv = cv.webp({ lossless: true, reductionEffort: 6 });
        exports.rootSrc.file(this.rightPath);
        await cv.toFile(this.rightPath);
        return new DoubleTreeNode(this.path);
    }
}
exports.DoubleTreeNode = DoubleTreeNode;
class DoubleTreeSubnode {
    size = 0;
    mime = '';
    height = 0;
    width = 0;
    // absolutePath = '';
    children;
    // doesNotExist?: boolean;
    constructor(path, cwd, parent) {
        return new Promise(async (r) => {
            let data = cwd.inspect(path, { symlinks: 'follow', absolutePath: true });
            if (!data)
                return r({ size: -1 });
            parent.name = data.name;
            if (parent.type && parent.type != data.type)
                throw data;
            if (data.type == 'file') {
                parent.type = data.type;
                this.size = data.size;
                try {
                    if (exports.knownFileExtensions[parent.ext] != 'image')
                        throw new Error(`.${parent.ext} is not an image`);
                    let idata = await (0, probe_image_size_1.default)(cwd.createReadStream(data.absolutePath));
                    this.height = idata.height;
                    this.width = idata.width;
                    this.mime = idata.mime;
                }
                catch (e) {
                    this.mime = e + '';
                }
            }
            if (data.type == 'dir') {
                parent.type = data.type;
                let list = cwd.list(path);
                this.children = list;
            }
            // console.log(path, this)
            r(this);
        });
    }
}
exports.DoubleTreeSubnode = DoubleTreeSubnode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG91YmxlVHJlZU5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zbmlwcGV0cy9Eb3VibGVUcmVlTm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQkFBd0M7QUFDeEMsNERBQWlDO0FBRWpDLHdFQUFxQztBQUNyQyxrREFBMEI7QUFHYixRQUFBLE9BQU8sR0FBRyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN0QyxRQUFBLE9BQU8sR0FBRyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUd2QyxRQUFBLG1CQUFtQixHQUE0RDtJQUMzRixPQUFPLEVBQUUsU0FBUztJQUNsQixLQUFLLEVBQUUsT0FBTztJQUNkLEtBQUssRUFBRSxPQUFPO0lBQ2QsS0FBSyxFQUFFLE9BQU87SUFDZCxLQUFLLEVBQUUsT0FBTztJQUNkLEtBQUssRUFBRSxPQUFPO0lBQ2QsTUFBTSxFQUFFLE9BQU87SUFDZixLQUFLLEVBQUUsT0FBTztJQUNkLE1BQU0sRUFBRSxPQUFPO0lBQ2YsS0FBSyxFQUFFLE9BQU87SUFDZCxLQUFLLEVBQUUsU0FBUztJQUNoQixNQUFNLEVBQUUsU0FBUztJQUNqQixLQUFLLEVBQUUsT0FBTztJQUNkLEtBQUssRUFBRSxPQUFPO0lBQ2QsS0FBSyxFQUFFLE9BQU87SUFDZCxLQUFLLEVBQUUsT0FBTztJQUNkLEtBQUssRUFBRSxPQUFPO0lBQ2QsS0FBSyxFQUFFLE9BQU87SUFDZCxNQUFNLEVBQUUsT0FBTztJQUNmLEtBQUssRUFBRSxPQUFPO0lBQ2QsTUFBTSxFQUFFLE9BQU87SUFDZixNQUFNLEVBQUUsT0FBTztJQUNmLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLE9BQU87SUFDYixJQUFJLEVBQUUsT0FBTztJQUNiLEtBQUssRUFBRSxPQUFPO0lBQ2QsTUFBTSxFQUFFLFNBQVM7SUFDakIsS0FBSyxFQUFFLE9BQU87SUFDZCxRQUFRLEVB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QUN2QixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3hCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2FBQ3JCO1lBQ0QsMEJBQTBCO1lBQzFCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBUSxDQUFDO0lBQ1gsQ0FBQztDQUNEO0FBdkNELDhDQXVDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGxpbmtTeW5jLCBzdGF0U3luYyB9IGZyb20gJ2ZzJztcclxuaW1wb3J0IGpldHBhY2sgZnJvbSAnZnMtamV0cGFjayc7XHJcbmltcG9ydCB7IEZTSmV0cGFjayB9IGZyb20gJ2ZzLWpldHBhY2svdHlwZXMnO1xyXG5pbXBvcnQgaXNpemUgZnJvbSAncHJvYmUtaW1hZ2Utc2l6ZSc7XHJcbmltcG9ydCBzaGFycCBmcm9tICdzaGFycCc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJvb3RTcmMgPSBqZXRwYWNrLmN3ZCgnZGlzdC9pbWctc3JjJyk7XHJcbmV4cG9ydCBjb25zdCByb290RHN0ID0gamV0cGFjay5jd2QoJ2Rpc3QvaW1nLWRpc3QnKTtcclxuXHJcblxyXG5leHBvcnQgY29uc3Qga25vd25GaWxlRXh0ZW5zaW9uczogUmVjb3JkPHN0cmluZywgJ2ltYWdlJyB8ICd2aWRlbycgfCAnaWdub3JlZCcgfCAnb3RoZXInPiA9IHtcclxuXHRcInBhcnRzXCI6IFwiaWdub3JlZFwiLFxyXG5cdFwibXA0XCI6IFwidmlkZW9cIixcclxuXHRcInBuZ1wiOiBcImltYWdlXCIsXHJcblx0XCJqcGdcIjogXCJpbWFnZVwiLFxyXG5cdFwiZ2lmXCI6IFwiaW1hZ2VcIixcclxuXHRcIm1wM1wiOiBcIm90aGVyXCIsXHJcblx0XCJ3ZWJtXCI6IFwidmlkZW9cIixcclxuXHRcImNiclwiOiBcIm90aGVyXCIsXHJcblx0XCJqcGVnXCI6IFwiaW1hZ2VcIixcclxuXHRcIm00dlwiOiBcIm90aGVyXCIsXHJcblx0XCIhcWJcIjogXCJpZ25vcmVkXCIsXHJcblx0XCJtZWdhXCI6IFwiaWdub3JlZFwiLFxyXG5cdFwidHh0XCI6IFwib3RoZXJcIixcclxuXHRcIm1vdlwiOiBcInZpZGVvXCIsXHJcblx0XCJmbHZcIjogXCJ2aWRlb1wiLFxyXG5cdFwicmFyXCI6IFwib3RoZXJcIixcclxuXHRcInBkZlwiOiBcIm90aGVyXCIsXHJcblx0XCJ6aXBcIjogXCJvdGhlclwiLFxyXG5cdFwid2VicFwiOiBcImltYWdlXCIsXHJcblx0XCJhdmlcIjogXCJ2aWRlb1wiLFxyXG5cdFwiaHRtbFwiOiBcIm90aGVyXCIsXHJcblx0XCJqc29uXCI6IFwib3RoZXJcIixcclxuXHRcImpzXCI6IFwib3RoZXJcIixcclxuXHRcInRzXCI6IFwib3RoZXJcIixcclxuXHRcIm1kXCI6IFwib3RoZXJcIixcclxuXHRcImNzc1wiOiBcIm90aGVyXCIsXHJcblx0XCJsb2NrXCI6IFwiaWdub3JlZFwiLFxyXG5cdFwiY21kXCI6IFwib3RoZXJcIixcclxuXHQnZGVsZXRlJzogJ2lnbm9yZWQnLFxyXG5cdCdpY28nOiAnaWdub3JlZCcsXHJcblx0J3BzZCc6ICdpZ25vcmVkJyxcclxufVxyXG5cclxuZXhwb3J0IGxldCBmb2xkZXJzID0gcm9vdFNyYy5saXN0KCcuJykhLmZpbHRlcihlID0+IHJvb3RTcmMuZXhpc3RzKGUpID09ICdkaXInKTtcclxuXHJcbi8vIGZvbGRlcnMgPSBmb2xkZXJzLmZpbHRlcihlID0+ICFlLmluY2x1ZGVzKCdTYXlpa2EnKSlcclxuXHJcbmV4cG9ydCBjbGFzcyBEb3VibGVUcmVlTm9kZSB7XHJcblx0bmFtZTogc3RyaW5nID0gJyc7XHJcblx0cGF0aDogc3RyaW5nID0gJyc7XHJcblx0dHlwZSE6ICdmaWxlJyB8ICdkaXInO1xyXG5cdGV4dDogc3RyaW5nID0gJyc7XHJcblx0ZXh0VHlwZSE6ICh0eXBlb2Yga25vd25GaWxlRXh0ZW5zaW9ucylba2V5b2YgdHlwZW9mIGtub3duRmlsZUV4dGVuc2lvbnNdO1xyXG5cdGNoaWxkcmVuOiBEb3VibGVUcmVlTm9kZVtdID0gW107XHJcblx0bGVmdD86IERvdWJsZVRyZWVTdWJub2RlO1xyXG5cdHJpZ2h0PzogRG91YmxlVHJlZVN1Ym5vZGU7XHJcblx0aXNIYXJkTGluaz89IGZhbHNlO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuXHRcdHRoaXMucGF0aCA9IHBhdGg7XHJcblx0XHR0aGlzLmV4dCA9IHBhdGguc3BsaXQoJy4nKS5wb3AoKSEudG9Mb3dlckNhc2UoKTtcclxuXHRcdHRoaXMuZXh0VHlwZSA9IGtub3duRmlsZUV4dGVuc2lvbnNbdGhpcy5leHRdO1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlPERvdWJsZVRyZWVOb2RlPihhc3luYyAocikgPT4ge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyh0aGlzKVxyXG5cdFx0XHRsZXQgbGVmdCA9IGF3YWl0IG5ldyBEb3VibGVUcmVlU3Vibm9kZShwYXRoLCByb290U3JjLCB0aGlzKTtcclxuXHRcdFx0bGV0IHJpZ2h0ID0gYXdhaXQgbmV3IERvdWJsZVRyZWVTdWJub2RlKHBhdGgsIHJvb3REc3QsIHRoaXMpO1xyXG5cdFx0XHRpZiAobGVmdC5zaXplID4gMClcclxuXHRcdFx0XHR0aGlzLmxlZnQgPSBsZWZ0O1xyXG5cdFx0XHRpZiAocmlnaHQuc2l6ZSA+IDApXHJcblx0XHRcdFx0dGhpcy5yaWdodCA9IHJpZ2h0O1xyXG5cdFx0XHRsZXQgY2hpbGRQYXRocyA9IEFycmF5LmZyb20obmV3IFNldChbLi4ubGVmdD8uY2hpbGRyZW4gPz8gW10sIC4uLnJpZ2h0Py5jaGlsZHJlbiA/PyBbXV0pKS5tYXAoZSA9PiBgJHtwYXRofS8ke2V9YCk7XHJcblx0XHRcdGRlbGV0ZSBsZWZ0LmNoaWxkcmVuOyBkZWxldGUgcmlnaHQuY2hpbGRyZW47XHJcblx0XHRcdHRoaXMuY2hpbGRyZW4gPSBhd2FpdCBQcm9taXNlLmFsbChjaGlsZFBhdGhzLm1hcChlID0+IG5ldyBEb3VibGVUcmVlTm9kZShlKSkpO1xyXG5cdFx0XHRpZiAodGhpcy50eXBlID09ICdkaXInKSB7XHJcblx0XHRcdFx0ZGVsZXRlIHRoaXMubGVmdDsgZGVsZXRlIHRoaXMucmlnaHQ7IGRlbGV0ZSAodGhpcyBhcyBhbnkpLmV4dDsgZGVsZXRlICh0aGlzIGFzIGFueSkuZXh0VHlwZTtcclxuXHRcdFx0XHRkZWxldGUgdGhpcy5pc0hhcmRMaW5rO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGRlbGV0ZSAodGhpcyBhcyBhbnkpLmNoaWxkcmVuO1xyXG5cdFx0XHRcdGlmICghdGhpcy5sZWZ0IHx8ICF0aGlzLnJpZ2h0KSB7XHJcblx0XHRcdFx0XHR0aGlzLmlzSGFyZExpbmsgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5pc0hhcmRMaW5rID0gc3RhdFN5bmModGhpcy5sZWZ0UGF0aCkuaW5vID09IHN0YXRTeW5jKHRoaXMucmlnaHRQYXRoKS5pbm87XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKHBhdGgsIHRoaXMpXHJcblx0XHRcdHIodGhpcyk7XHJcblx0XHR9KSBhcyBhbnk7XHJcblx0fVxyXG5cclxuXHRnZXQgbGVmdFBhdGgoKSB7XHJcblx0XHRyZXR1cm4gcm9vdFNyYy5wYXRoKHRoaXMucGF0aCk7XHJcblx0fVxyXG5cdGdldCByaWdodFBhdGgoKSB7XHJcblx0XHRyZXR1cm4gcm9vdERzdC5wYXRoKHRoaXMucGF0aCk7XHJcblx0fVxyXG5cdGFzeW5jIG1ha2VIYXJkbGluaygpIHtcclxuXHRcdC8vIGpwLl9fcHJvdG9fXy5saW5rID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcclxuXHRcdC8vIFx0ZnMubGlua1N5bmModGhpcy5wYXRoKGZyb20pLCB0aGlzLnBhdGgodG8pKTtcclxuXHRcdC8vIH1cclxuXHRcdGlmICh0aGlzLmlzSGFyZExpbmsgfHwgdGhpcy5yaWdodClcclxuXHRcdFx0dGhyb3cgdGhpcztcclxuXHRcdHJvb3REc3QuZGlyKHRoaXMucmlnaHRQYXRoICsgJy8uLicpXHJcblx0XHRsaW5rU3luYyh0aGlzLmxlZnRQYXRoLCB0aGlzLnJpZ2h0UGF0aCk7XHJcblx0XHRyZXR1cm4gbmV3IERvdWJsZVRyZWVOb2RlKHRoaXMucGF0aCk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBtYWtlQ29weSgpIHtcclxuXHRcdHJvb3RTcmMuY29weSh0aGlzLmxlZnRQYXRoLCB0aGlzLnJpZ2h0UGF0aCwgeyBvdmVyd3JpdGU6IHRydWUgfSk7XHJcblx0XHRyZXR1cm4gbmV3IERvdWJsZVRyZWVOb2RlKHRoaXMucGF0aCk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBtYWtlU21hbGxlckltYWdlKCkge1xyXG5cdFx0bGV0IG5ld0hlaWdodCA9IHRoaXMubGVmdCEuaGVpZ2h0O1xyXG5cdFx0aWYgKG5ld0hlaWdodCA+IDEwODAgKiAxLjUpIG5ld0hlaWdodCA9IDEwODA7XHJcblxyXG5cdFx0bGV0IGN2ID0gc2hhcnAodGhpcy5sZWZ0UGF0aCwgeyBhbmltYXRlZDogdHJ1ZSB9KTtcclxuXHRcdGlmICh0aGlzLmxlZnQhLmhlaWdodCA+IDEwODAgKiAxLjUpIHtcclxuXHRcdFx0Y3YgPSBjdi5yZXNpemUoeyBmYXN0U2hyaW5rT25Mb2FkOiBmYWxzZSwgaGVpZ2h0OiAxMDgwLCB3aXRob3V0RW5sYXJnZW1lbnQ6IHRydWUgfSk7XHJcblx0XHR9XHJcblx0XHRjdiA9IGN2LndlYnAoeyBsb3NzbGVzczogdHJ1ZSwgcmVkdWN0aW9uRWZmb3J0OiA2IH0pXHJcblx0XHRyb290U3JjLmZpbGUodGhpcy5yaWdodFBhdGgpO1xyXG5cdFx0YXdhaXQgY3YudG9GaWxlKHRoaXMucmlnaHRQYXRoKTtcclxuXHRcdHJldHVybiBuZXcgRG91YmxlVHJlZU5vZGUodGhpcy5wYXRoKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEb3VibGVUcmVlU3Vibm9kZSB7XHJcblx0c2l6ZSA9IDA7XHJcblx0bWltZSA9ICcnO1xyXG5cdGhlaWdodCA9IDA7XHJcblx0d2lkdGggPSAwO1xyXG5cdC8vIGFic29sdXRlUGF0aCA9ICcnO1xyXG5cclxuXHRjaGlsZHJlbj86IHN0cmluZ1tdO1xyXG5cdC8vIGRvZXNOb3RFeGlzdD86IGJvb2xlYW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgY3dkOiBGU0pldHBhY2ssIHBhcmVudDogRG91YmxlVHJlZU5vZGUpIHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZTxEb3VibGVUcmVlU3Vibm9kZT4oYXN5bmMgciA9PiB7XHJcblx0XHRcdGxldCBkYXRhID0gY3dkLmluc3BlY3QocGF0aCwgeyBzeW1saW5rczogJ2ZvbGxvdycsIGFic29sdXRlUGF0aDogdHJ1ZSB9KSE7XHJcblx0XHRcdGlmICghZGF0YSkgcmV0dXJuIHIoeyBzaXplOiAtMSB9IGFzIGFueSk7XHJcblx0XHRcdHBhcmVudC5uYW1lID0gZGF0YS5uYW1lO1xyXG5cdFx0XHRpZiAocGFyZW50LnR5cGUgJiYgcGFyZW50LnR5cGUgIT0gZGF0YS50eXBlKSB0aHJvdyBkYXRhO1xyXG5cdFx0XHRpZiAoZGF0YS50eXBlID09ICdmaWxlJykge1xyXG5cdFx0XHRcdHBhcmVudC50eXBlID0gZGF0YS50eXBlO1xyXG5cdFx0XHRcdHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0aWYgKGtub3duRmlsZUV4dGVuc2lvbnNbcGFyZW50LmV4dF0gIT0gJ2ltYWdlJylcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGAuJHtwYXJlbnQuZXh0fSBpcyBub3QgYW4gaW1hZ2VgKTtcclxuXHRcdFx0XHRcdGxldCBpZGF0YSA9IGF3YWl0IGlzaXplKGN3ZC5jcmVhdGVSZWFkU3RyZWFtKGRhdGEuYWJzb2x1dGVQYXRoISkpO1xyXG5cdFx0XHRcdFx0dGhpcy5oZWlnaHQgPSBpZGF0YS5oZWlnaHQ7XHJcblx0XHRcdFx0XHR0aGlzLndpZHRoID0gaWRhdGEud2lkdGg7XHJcblx0XHRcdFx0XHR0aGlzLm1pbWUgPSBpZGF0YS5taW1lO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdHRoaXMubWltZSA9IGUgKyAnJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGRhdGEudHlwZSA9PSAnZGlyJykge1xyXG5cdFx0XHRcdHBhcmVudC50eXBlID0gZGF0YS50eXBlO1xyXG5cdFx0XHRcdGxldCBsaXN0ID0gY3dkLmxpc3QocGF0aCkhO1xyXG5cdFx0XHRcdHRoaXMuY2hpbGRyZW4gPSBsaXN0O1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKHBhdGgsIHRoaXMpXHJcblx0XHRcdHIodGhpcyk7XHJcblx0XHR9KSBhcyBhbnk7XHJcblx0fVxyXG59XHJcblxyXG4iXX0=