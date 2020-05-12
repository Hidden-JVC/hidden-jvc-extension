import hiddenJVC from './HiddenJVC.js';

(async function () {
    try {
        await hiddenJVC.init();
    } catch (err) {
        console.error(err);
    }
})();
