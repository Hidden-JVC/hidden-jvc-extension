import hiddenJVC from '../HiddenJVC.js';

class AdCleaner {
    constructor() {
        this.pages = 0;
    }

    async init() {
        const wootBox = document.querySelector('#forum-right-col .sideWootbox');
        if (wootBox !== null) {
            wootBox.remove();
        }
    }
}

const adCleaner = new AdCleaner();
hiddenJVC.registerModule(adCleaner);
