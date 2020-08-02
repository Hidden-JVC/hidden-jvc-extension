import helpers from './helpers';
import constants from './constants';
import * as storage from '../helpers/storage';

import menuTemplate from './views/menu.handlebars';
import forumForm from './views/forum/form.handlebars';
import rowTemplate from './views/forum/row.handlebars';
import postTemplate from './views/topic/post.handlebars';
import forumTemplate from './views/forum/forum.handlebars';
import topicTemplate from './views/topic/topic.handlebars';
import topicFormTemplate from './views/topic/form.handlebars';

import modals from './modals';

import './scss/main.scss';

class HiddenJVC {
    constructor() {
        this.modules = [];

        this.helpers = helpers;
        this.storage = storage;
        this.constants = constants;
        this.modals = modals;
        this.views = {
            topic: {
                post: postTemplate,
                topic: topicTemplate,
                topicForm: topicFormTemplate
            },
            forum: {
                forum: forumTemplate,
                row: rowTemplate,
                form: forumForm
            },
            menu: menuTemplate
        };
    }

    registerModule(newModule) {
        this.modules.push(newModule);
    }

    async init() {
        const state = await this.storage.getState();
        try {
            this.constants.Runtime.init(state);
        } catch (err) {
            console.error(err);
            this.Modal.create({ title: 'Hidden JVC - Erreur de parsing', message: err.message });
            return;
        }

        if (this.constants.Runtime.is410) {
            console.log('410 !');
            return;
        }

        for (const m of this.modules) {
            if (m.pages === 0 || m.pages & this.constants.Runtime.currentPage) {
                m.init(state).catch((err) => {
                    console.error(err);
                    this.Modal.create({ title: 'Hidden JVC - Erreur inattendue', message: err.message });
                });
            }
        }
    }
}

export default new HiddenJVC();
