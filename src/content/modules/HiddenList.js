import pageInfo from './PageInfo.js';
import { jvc, hidden } from '../constants';
import { getState } from '../../helpers/storage';
import { getRequest, postRequest } from '../helpers/network.js';
import topicsTemplate from '../views/topics/topics.handlebars';

class HiddenList {
    async init() {
        if (pageInfo.currentPage !== jvc.pages.HIDDEN_LIST) {
            return;
        }

        const form = document.querySelector('#bloc-formulaire-forum');

        const state = await getState();
        const { topics, count } = await getRequest(hidden.API_TOPICS, { page: state.hidden.list.page });

        this.render(topics, count, state.hidden.list.page);
        this.setupForm(form);
    }

    render(topics, count, page) {
        const html = topicsTemplate({ topics, count, page });
        document.querySelector('#forum-main-col').innerHTML = html;
    }

    setupForm(form) {
        form.querySelector('.btn.btn-poster-msg.js-post-topic').replaceWith(this.createPostButton());
        document.querySelector('#bloc-formulaire-forum-placeholder').replaceWith(form);
    }

    createPostButton() {
        const button = document.createElement('button');
        button.textContent = 'Poster';
        button.type = 'button';
        button.classList.add('btn', 'btn-poster-msg');
        button.addEventListener('click', async () => {
            try {
                const title = document.querySelector('input#titre_topic').value;
                const content = document.querySelector('.previsu-editor.text-enrichi-forum').innerHTML;
                const postData = { title, content };

                const state = await getState();
                if (!state.user.jwt) {
                    postData.username = state.user.name || 'Anonymous';
                }

                const { topicId } = await postRequest(hidden.API_TOPICS, postData, state.user.jwt);
                if (topicId) {
                    const url = `http://www.jeuxvideo.com/forums/42-3000172-38160921-1-0-1-0-presentation-et-regles-du-forum.htm?hidden=1&view=topic&topicPage=1&topicId=${topicId}`;
                    location.replace(url);
                } else {
                    throw new Error('fail to create topic');
                }
            } catch (err) {
                console.error(err);
            }
        });
        return button;
    }
}

export default new HiddenList();
