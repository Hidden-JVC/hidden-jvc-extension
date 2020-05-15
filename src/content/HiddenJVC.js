import { jvc } from './constants';
import { getState } from '../helpers/storage';
import jvcTopicHelper from './helpers/JVCTopic.js';

import jvcList from './modules/JVCList.js';
import jvcTopic from './modules/JVCTopic.js';
import pageInfo from './modules/PageInfo.js';
import hiddenLogin from './modules/HiddenLogin.js';
import hiddenList from './modules/HiddenList.js';
import hiddenTopic from './modules/HiddenTopic.js';
import hiddenToggler from './modules/HiddenToggler.js';

class HiddenJVC {
    async init() {
        const state = await getState();

        await hiddenLogin.init(state);
        await pageInfo.init(state);

        if (pageInfo.currentPage === jvc.pages.JVC_LIST) {
            await jvcList.init(state);
        }

        if (pageInfo.currentPage === jvc.pages.JVC_TOPIC) {
            await jvcTopicHelper.init();
            await jvcTopic.init(state);
        }

        if (pageInfo.currentPage === jvc.pages.HIDDEN_LIST) {
            await hiddenList.init(state);
        }

        if (pageInfo.currentPage === jvc.pages.HIDDEN_TOPIC) {
            await hiddenTopic.init(state);
        }

        await hiddenToggler.init(state);
    }
}

export default new HiddenJVC();
