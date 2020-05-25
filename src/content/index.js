import hiddenJVC from './HiddenJVC.js';

import './modules/AdCleaner.js';
import './modules/HiddenMenu.js';
import './modules/JVCForum.js';
import './modules/JVCTopic.js';

(async function () {
    try {
        await hiddenJVC.init();
    } catch (err) {
        console.error(err);
    }
})();
