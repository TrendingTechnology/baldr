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
        if (data.meta == null) {
            throw new Error('No meta property.');
        }
        this.data = {
            slides: data.slides,
            meta: data.meta
        };
        this.data.meta.path = this.relPath;
    }
    enrichMetaProp() {
        const title = new titles_1.DeepTitle(this.absPath);
        const meta = title.generatePresetationMeta();
        if (this.data.meta.subtitle == null && meta.subtitle != null) {
            this.data.meta.subtitle = meta.subtitle;
        }
        if (this.data.meta.curriculum == null && meta.curriculum != null) {
            this.data.meta.curriculum = meta.curriculum;
        }
        if (this.data.meta.grade == null && meta.grade != null) {
            this.data.meta.grade = meta.grade;
        }
        return this;
    }
    build() {
        this.enrichMetaProp();
        return this.data;
    }
}
exports.PresentationBuilder = PresentationBuilder;
