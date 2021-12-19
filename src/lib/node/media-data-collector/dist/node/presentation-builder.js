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
        if (data.meta == null) {
            throw new Error(`The presentation “${this.absPath}” needs a property named “meta”.`);
        }
        if (data.slides == null) {
            throw new Error(`The presentation “${this.absPath}” needs a property named “slide”.`);
        }
        this.data = {
            meta: data.meta,
            slides: data.slides
        };
        this.data.meta.path = this.relPath;
    }
    enrichMetaProp() {
        const title = new titles_1.DeepTitle(this.absPath);
        const meta = title.generatePresetationMeta();
        if (this.data.meta.ref == null && meta.ref != null) {
            this.data.meta.ref = meta.ref;
        }
        if (this.data.meta.title == null && meta.title != null) {
            this.data.meta.title = meta.title;
        }
        if (this.data.meta.subtitle == null && meta.subtitle != null) {
            this.data.meta.subtitle = meta.subtitle;
        }
        if (this.data.meta.subject == null && meta.subject != null) {
            this.data.meta.subject = meta.subject;
        }
        if (this.data.meta.grade == null && meta.grade != null) {
            this.data.meta.grade = meta.grade;
        }
        if (this.data.meta.curriculum == null && meta.curriculum != null) {
            this.data.meta.curriculum = meta.curriculum;
        }
        return this;
    }
    build() {
        this.enrichMetaProp();
        return this.data;
    }
}
exports.PresentationBuilder = PresentationBuilder;
