import hiddenJVC from './HiddenJVC.js';

import './modules/AdCleaner.js';
import './modules/StyleManager.js';
import './modules/HiddenMenu.js';
import './modules/JVCForum.js';
import './modules/JVCTopic.js';
import './modules/HiddenForum.js';
import './modules/HiddenTopic.js';

(async function () {
    try {
        await hiddenJVC.init();
    } catch (err) {
        console.error(err);
    }
})();
