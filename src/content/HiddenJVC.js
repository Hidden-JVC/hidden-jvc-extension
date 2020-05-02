import pageInfo from './modules/PageInfo.js';
import hiddenLogin from './modules/HiddenLogin.js';
import hiddenForm from './modules/HiddenForm.js';
import hiddenList from './modules/HiddenList.js';
import hiddenTopic from './modules/HiddenTopic.js';
import hiddenToggler from './modules/HiddenToggler.js';

class HiddenJVC {
    async init() {
        await hiddenLogin.init();
        await pageInfo.init();
        await hiddenForm.init();

        await hiddenList.init();
        await hiddenTopic.init();

        await hiddenToggler.init();
    }
}

export default new HiddenJVC();
