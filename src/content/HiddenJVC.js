import helpers from './helpers';
import constants from './constants';
import * as storage from '../helpers/storage';

import postTemplate from './views/topic/post.handlebars';
import menuTemplate from './views/menu.handlebars';
import forumTemplate from './views/forum/forum.handlebars';
import topicTemplate from './views/topic/topic.handlebars';

class HiddenJVC {
    constructor() {
        this.modules = [];

        this.helpers = helpers;
        this.storage = storage;
        this.constants = constants;
        this.views = {
            topic: {
                post: postTemplate,
                topic: topicTemplate
            },
            forum: {
                forum: forumTemplate
            },
            menu: menuTemplate
        };
    }

    registerModule(newModule) {
        this.modules.push(newModule);
    }

    async init() {
        const state = await this.storage.getState();
        this.constants.Runtime.init(state);

        if (this.constants.Runtime.is410) {
            console.log('410 !');
            return;
        }

        for (const m of this.modules) {
            if (m.pages === 0 || m.pages & this.constants.Runtime.currentPage) {
                m.init(state).catch(console.error);
            }
        }
    }
}

export default new HiddenJVC();
