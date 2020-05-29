import hiddenJVC from '../HiddenJVC.js';

const { Hidden } = hiddenJVC.constants.Static;

class StyleManager {
    constructor() {
        this.pages = 0;
    }

    async init() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            :root {
                --hidden-primary-color: ${Hidden.HIDDEN_PRIMARY_COLOR}
            }
        `;
        document.head.appendChild(style);
    }
}

const styleManager = new StyleManager();
hiddenJVC.registerModule(styleManager);
