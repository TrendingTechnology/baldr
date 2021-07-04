var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { convertMarkdownToHtml } from '@bldr/markdown-to-html';
import { validateUri } from '@bldr/core-browser';
/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
class MasterIcon {
    constructor({ name, color, size, showOnSlides }) {
        if (size != null && !['small', 'large'].includes(size)) {
            throw new Error(`The property “size” of the “MasterIcon” has to be “small” or “large” not ${size}`);
        }
        this.name = name;
        this.color = color != null ? color : 'orange';
        this.showOnSlides = showOnSlides !== false;
        this.size = size != null ? size : 'small';
    }
}
/**
 * Each master slide has an instance of this class.
 */
export class Master {
    /**
     * @param spec - The specification of the master slide provided by a master
     * package.
     */
    constructor(spec) {
        this.spec = spec;
        this.icon = new MasterIcon(spec.icon);
    }
    get name() {
        return this.spec.name;
    }
    get title() {
        return this.spec.title;
    }
    get propNamesInlineMedia() {
        const inlineMarkupProps = [];
        for (const propName in this.spec.propsDef) {
            const propDef = this.spec.propsDef[propName];
            if (propDef.inlineMarkup != null && propDef.inlineMarkup) {
                inlineMarkupProps.push(propName);
            }
        }
        return inlineMarkupProps;
    }
    /**
     * Filter the master props for props which are supporting inline media.
     */
    // extractInlineMediaUris (props: LampTypes.StringObject): Set<string> {
    //   const uris = new Set<string>()
    //   function extractUrisInText (text: string) {
    //     const matches = text.matchAll(new RegExp(inlineMarkup.regExp, 'g'))
    //     for (const match of matches) {
    //       //  12    3            4
    //       // [((id):(Fuer-Elise))( caption="Für Elise")]
    //       if (match[2] === 'id') uris.add(match[1])
    //     }
    //   }
    //   for (const propName of this.propNamesInlineMedia) {
    //     const prop = props[propName]
    //     if (prop) {
    //       if (typeof prop === 'string') {
    //         extractUrisInText(prop)
    //       // `markup` in `generic` is an array.
    //       } else if (Array.isArray(prop)) {
    //         for (const item of prop) {
    //           extractUrisInText(item)
    //         }
    //       }
    //     }
    //   }
    //   return uris
    // }
    /**
     * Replace the inline media tags `[id:Beethoven]` in certain props with
     * HTML. This function must be called after the media resolution.
     */
    // renderInlineMedia (props: LampTypes.StringObject) {
    //   /**
    //    * @param {String} text
    //    */
    //   function renderOneMediaUri (text) {
    //     return text.replace(new RegExp(inlineMarkup.regExp, 'g'), function (match) {
    //       const item = new inlineMarkup.Item(match)
    //       return inlineMarkup.render(item)
    //     })
    //   }
    //   for (const propName of this.propNamesInlineMedia) {
    //     const prop = props[propName]
    //     if (prop) {
    //       if (typeof prop === 'string') {
    //         props[propName] = renderOneMediaUri(prop)
    //       // `markup` in `generic` is an array.
    //       } else if (Array.isArray(prop)) {
    //         for (let i = 0; i < prop.length; i++) {
    //           props[propName][i] = renderOneMediaUri(prop[i])
    //         }
    //       }
    //     }
    //   }
    // }
    convertMarkdownToHtml(props) {
        if (this.spec.propsDef == null) {
            return props;
        }
        for (const propName in props) {
            const prop = this.spec.propsDef[propName];
            if (prop.markup != null && prop.markup) {
                props[propName] = convertMarkdownToHtml(props[propName]);
            }
        }
        return props;
    }
    detectUnkownProps(props) {
        for (const propName in props) {
            if ((this.spec.propsDef != null) && !(propName in this.spec.propsDef)) {
                throw new Error(`The master slide “${this.name}” has no property named “${propName}”.`);
            }
        }
    }
    validateUris(props) {
        if (this.spec.propsDef == null) {
            return props;
        }
        for (const propName in props) {
            const prop = this.spec.propsDef[propName];
            if (prop.assetUri != null) {
                props[propName] = validateUri(props[propName]);
            }
        }
        return props;
    }
    /**
     * Call a master hook. Master hooks are definied in the `main.js`
     * files.
     *
     * @param hookName - The name of the master hook / function.
     * @param payload - The argument the master hook / function is called
     *   with.
     */
    callHook(hookName, payload, thisArg) {
        // eslint-disable-next-line
        if ((this.spec.hooks != null) && this.spec.hooks[hookName] != null && typeof this.spec.hooks[hookName] === 'function') {
            if (thisArg != null) {
                return this.spec.hooks[hookName].call(thisArg, payload);
            }
            return this.spec.hooks[hookName](payload);
        }
    }
    /**
     * Asynchronous version. Call a master hook. Master hooks are definied in the
     * `main.js` files.
     *
     * @param hookName - The name of the master hook / function.
     * @param payload - The argument the master hook / function is called
     *   with.
     */
    callHookAsync(hookName, payload, thisArg) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line
            if (this.spec.hooks != null && this.spec.hooks[hookName] != null && typeof this.spec.hooks[hookName] === 'function') {
                if (thisArg != null) {
                    return this.spec.hooks[hookName].call(thisArg, payload);
                }
                return this.spec.hooks[hookName](payload);
            }
        });
    }
    normalizeProps(propsRaw) {
        return this.callHook('normalizeProps', propsRaw);
    }
    normalizeUris(uris) {
        let normalizedUris;
        // To allow undefined return values of the hooks.
        if (uris == null) {
            normalizedUris = new Set();
        }
        else if (typeof uris === 'string') {
            normalizedUris = new Set([uris]);
        }
        else if (Array.isArray(uris)) {
            normalizedUris = new Set(uris);
        }
        else {
            normalizedUris = null;
        }
        if (normalizedUris != null && normalizedUris.size > 0) {
            return normalizedUris;
        }
    }
    resolveMediaUris(props) {
        const uris = this.callHook('resolveMediaUris', props);
        // const inlineUris = this.extractInlineMediaUris(props)
        // for (const uri of inlineUris) {
        //   uris.add(uri)
        // }
        return this.normalizeUris(uris);
    }
    resolveOptionalMediaUris(props) {
        const uris = this.callHook('resolveOptionalMediaUris', props);
        return this.normalizeUris(uris);
    }
    afterLoading(props, thisArg) {
        this.callHook('afterLoading', { props, master: this }, thisArg);
    }
    afterMediaResolution(props, thisArg) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.callHookAsync('afterMediaResolution', { props, master: this }, thisArg);
        });
    }
    collectPropsMain(props, thisArg) {
        const propsMain = this.callHook('collectPropsMain', props, thisArg);
        if (propsMain != null) {
            return propsMain;
        }
        return props;
    }
    collectPropsPreview(payload, thisArg) {
        const propsPreview = this.callHook('collectPropsPreview', payload, thisArg);
        if (propsPreview != null) {
            return propsPreview;
        }
        if (payload.propsMain != null) {
            return payload.propsMain;
        }
        return payload.props;
    }
    calculateStepCount(payload, thisArg) {
        return this.callHook('calculateStepCount', payload, thisArg);
    }
    titleFromProps(payload) {
        return this.callHook('titleFromProps', payload);
    }
    plainTextFromProps(props) {
        return this.callHook('plainTextFromProps', props);
    }
    leaveSlide(payload, thisArg) {
        this.callHook('leaveSlide', payload, thisArg);
    }
    enterSlide(payload, thisArg) {
        this.callHook('enterSlide', payload, thisArg);
    }
    afterSlideNoChangeOnComponent(payload, thisArg) {
        this.callHook('afterSlideNoChangeOnComponent', payload, thisArg);
    }
    leaveStep(payload, thisArg) {
        return this.callHook('leaveStep', payload, thisArg);
    }
    enterStep(payload, thisArg) {
        return this.callHook('enterStep', payload, thisArg);
    }
    afterStepNoChangeOnComponent(payload, thisArg) {
        this.callHook('afterStepNoChangeOnComponent', payload, thisArg);
    }
}
