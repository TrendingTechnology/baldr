/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions/presentation
 */
export declare namespace PresentationType {
    /**
      * The meta informations of a presentation file.
      */
    interface Meta {
        /**
         * An unique ID.
         */
        id: string;
        /**
         * The title of the presentation.
         */
        title: string;
        /**
         * The subtitle of the presentation.
         */
        subtitle?: string;
        /**
         * The grade the presentation belongs to.
         */
        grade: number;
        /**
         * Relation to the curriculum.
         */
        curriculum: string;
        /**
         * URL of the curriculum web page.
         */
        curriculumUrl?: string;
    }
    /**
     * The type of the YAML file format of a presentation `Praesentation.baldr.yml`
     */
    interface FileFormat {
        meta: Meta;
        slides: object;
    }
}
