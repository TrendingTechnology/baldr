export declare const categoriesManagement: {
    detectCategoryByPath: (filePath: string) => string | undefined;
    formatFilePath: (data: import("@bldr/type-definitions/dist/node/asset").FileFormat, oldPath?: string | undefined) => string;
    process: (data: import("@bldr/type-definitions/dist/node/asset").Generic) => import("@bldr/type-definitions/dist/node/asset").Generic;
    categories: {
        cloze: import("@bldr/type-definitions/dist/node/media-category").Category;
        composition: import("@bldr/type-definitions/dist/node/media-category").Category;
        cover: import("@bldr/type-definitions/dist/node/media-category").Category;
        group: import("@bldr/type-definitions/dist/node/media-category").Category;
        instrument: import("@bldr/type-definitions/dist/node/media-category").Category;
        person: import("@bldr/type-definitions/dist/node/media-category").Category;
        photo: import("@bldr/type-definitions/dist/node/media-category").Category;
        radio: import("@bldr/type-definitions/dist/node/media-category").Category;
        recording: import("@bldr/type-definitions/dist/node/media-category").Category;
        reference: import("@bldr/type-definitions/dist/node/media-category").Category;
        score: import("@bldr/type-definitions/dist/node/media-category").Category;
        song: import("@bldr/type-definitions/dist/node/media-category").Category;
        worksheet: import("@bldr/type-definitions/dist/node/media-category").Category;
        youtube: import("@bldr/type-definitions/dist/node/media-category").Category;
        general: import("@bldr/type-definitions/dist/node/media-category").Category;
    };
    mergeNames: (...typeName: string[]) => string;
};
