class AttributeSetter {
    constructor(attributeName, defaultValue) {
        this.attributeName = attributeName;
        this.attributeValue = defaultValue;
        this.defaultValue = defaultValue;
    }
    get attributeValueAsString() {
        return String(this.attributeValue);
    }
    set(attributeValue) {
        this.attributeValue = attributeValue;
        const elements = document.querySelectorAll(`[${this.attributeName}]`);
        for (const element of elements) {
            element.attributes[this.attributeName].value = this.attributeValueAsString;
        }
    }
    reset() {
        this.set(this.defaultValue);
    }
}
class StringAttributeSetter extends AttributeSetter {
}
class BooleanAttributeSetter extends AttributeSetter {
    toggle() {
        this.set(!this.attributeValue);
        return this.attributeValue;
    }
}
class DarkModeSetter extends BooleanAttributeSetter {
    constructor() {
        super('b-dark-mode', false);
    }
}
class CenterVerticallySetter extends BooleanAttributeSetter {
    constructor() {
        super('b-center-vertically', false);
    }
}
class ContentThemeSetter extends StringAttributeSetter {
    constructor() {
        super('b-content-theme', 'default');
    }
    set(themeName) {
        super.set(themeName);
        const elements = document.querySelectorAll(`[${this.attributeName}]`);
        for (const element of elements) {
            // Preview slide editor has content-theme handwriting, which should
            // be unchangeable.
            if ((element.attributes['b-content-theme-unchangeable']) == null) {
                element.attributes[this.attributeName].value = this.attributeValueAsString;
            }
        }
    }
}
class UiThemeSetter extends StringAttributeSetter {
    constructor() {
        super('b-ui-theme', 'default');
    }
}
export class StyleConfigurator {
    constructor() {
        this.setterCollection = {
            darkMode: new DarkModeSetter(),
            contentTheme: new ContentThemeSetter(),
            uiTheme: new UiThemeSetter(),
            centerVertically: new CenterVerticallySetter()
        };
        this.toggleFullscreen = function () {
            if (document.fullscreenElement == null) {
                document.documentElement.requestFullscreen();
            }
            else {
                document.exitFullscreen();
            }
        };
        const body = document.querySelector('body');
        if (body != null) {
            body.setAttribute(this.setterCollection.darkMode.attributeName, 'false');
        }
    }
    reset() {
        for (const setterName in this.setterCollection) {
            const name = setterName;
            if (this.setterCollection[name] != null) {
                this.setterCollection[name].reset();
            }
            else {
                throw new Error(`Unkown style config “${name}”.`);
            }
        }
    }
    set(styleConfig) {
        for (const setterName in styleConfig) {
            const name = setterName;
            if (this.setterCollection[name] != null) {
                this.setterCollection[name].set(styleConfig[name]);
            }
            else {
                throw new Error(`Unkown style config “${name}”.`);
            }
        }
    }
    toggleDarkMode() {
        this.setterCollection.darkMode.toggle();
    }
    toggleCenterVertically() {
        this.setterCollection.centerVertically.toggle();
    }
    setContentTheme(themeName) {
        this.setterCollection.contentTheme.set(themeName);
    }
    setUiTheme(themeName) {
        this.setterCollection.uiTheme.set(themeName);
    }
}
export const styleConfigurator = new StyleConfigurator();
