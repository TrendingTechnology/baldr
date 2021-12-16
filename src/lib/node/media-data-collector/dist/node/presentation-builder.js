"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresentationBuilder = void 0;
const titles_1 = require("@bldr/titles");
const builder_1 = require("./builder");
class PresentationBuilder extends builder_1.Builder {
    constructor(filePath) {
        super(filePath);
        const data = {};
        this.importYamlFile(this.absPath, data);
        if (data.slides == null) {
            throw new Error('No slide property.');
        }
        this.data = {
            relPath: this.relPath,
            slides: data.slides
        };
    }
    enrichMetaProp() {
        const title = new titles_1.DeepTitle(this.absPath);
        const meta = title.generatePresetationMeta();
        if (this.data.meta == null) {
            this.data.meta = meta;
        }
        else {
            if ((meta === null || meta === void 0 ? void 0 : meta.ref) == null) {
                this.data.meta.ref = meta.ref;
            }
            if ((meta === null || meta === void 0 ? void 0 : meta.title) == null) {
                this.data.meta.title = meta.title;
            }
            if ((meta === null || meta === void 0 ? void 0 : meta.subtitle) == null) {
                this.data.meta.subtitle = meta.subtitle;
            }
            if ((meta === null || meta === void 0 ? void 0 : meta.curriculum) == null) {
                this.data.meta.curriculum = meta.curriculum;
            }
            if ((meta === null || meta === void 0 ? void 0 : meta.grade) == null) {
                this.data.meta.grade = meta.grade;
            }
        }
        return this;
    }
    buildAll() {
        this.enrichMetaProp();
        return this;
    }
    export() {
        return this.data;
    }
}
exports.PresentationBuilder = PresentationBuilder;
