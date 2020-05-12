import { getState } from '../helpers/storage';

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

        await jvcList.init(state);
        await jvcTopic.init(state);

        await hiddenList.init(state);
        await hiddenTopic.init(state);

        await hiddenToggler.init(state);
    }
}

export default new HiddenJVC();
