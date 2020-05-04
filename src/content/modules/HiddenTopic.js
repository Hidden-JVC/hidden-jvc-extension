import { jvc, hidden } from '../constants';
import pageInfo from './PageInfo.js';
import { getRequest, postRequest } from '../helpers/network.js';
import { getState } from '../../helpers/storage';
import topicsTemplate from '../views/topic/topic.handlebars';

class HiddenTopic {
    constructor() {
        this.topic = null;
        this.count = 0;
    }

    async init() {
        if (pageInfo.currentPage !== jvc.pages.HIDDEN_TOPIC) {
            return;
        }

        const form = document.querySelector('#bloc-formulaire-forum');

        const state = await getState();
        const { topic, count } = await getRequest(`${hidden.API_TOPICS}/${state.hidden.topic.id}`);
        this.topic = topic;
        this.count = count;
        const page = state.hidden.topic.page;
        this.render(topic, page);
        this.setupForm(form);
    }

    render(topic, page) {
        const lastPage = Math.ceil(this.count / 20);
        const html = topicsTemplate({ topic, page, lastPage });
        document.querySelector('#forum-main-col').innerHTML = html;
    }

    setupForm(form) {
        form.querySelector('.btn.btn-poster-msg.js-post-topic').replaceWith(this.createPostButton());
        form.querySelector('.titre-bloc').textContent = 'Répondre';
        form.querySelectorAll('.form-group').forEach(function (formGroup) {
            formGroup.remove();
        });
        form.querySelector('.bloc-sondage-topic').remove();
        document.querySelector('#bloc-formulaire-forum-placeholder').replaceWith(form);
    }

    createPostButton() {
        const button = document.createElement('button');
        button.textContent = 'Poster';
        button.type = 'button';
        button.classList.add('btn', 'btn-poster-msg');
        button.addEventListener('click', async () => {
            try {
                const rawContent = document.querySelector('textarea#message_topic').value;
                const compiledContent = document.querySelector('.previsu-editor.text-enrichi-forum').innerHTML;
                const postData = { rawContent, compiledContent };

                const state = await getState();
                if (!state.user.jwt) {
                    postData.username = state.user.name || 'Anonymous';
                }

                const url = `${hidden.API_TOPICS}/${this.topic.Topic.Id}`;
                await postRequest(url, postData, state.user.jwt);
                location.reload();
            } catch (err) {
                console.error(err);
            }
        });
        return button;
    }
}

export default new HiddenTopic();
