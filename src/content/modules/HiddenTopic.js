import { jvc, hidden } from '../constants';
import pageInfo from './PageInfo.js';
import { getRequest, postRequest } from '../helpers/network.js';
import { getState } from '../../helpers/storage';
import topicsTemplate from '../views/topic/topic.handlebars';

class HiddenTopic {
    constructor() {
        this.topic = null;
    }

    async init(state) {
        if (pageInfo.currentPage !== jvc.pages.HIDDEN_TOPIC) {
            return;
        }

        const form = document.querySelector('#bloc-formulaire-forum');

        const { topic } = await getRequest(`${hidden.API_TOPICS}/${state.hidden.topic.id}`, { page: state.hidden.topic.page });
        this.topic = topic;
        const page = state.hidden.topic.page;
        this.render(topic, page);
        this.setupForm(form);
        this.initQuotes();
    }

    render(topic, page) {
        const lastPage = Math.ceil(this.topic.PostsCount / 20);
        const pagination = this.getPaginationData(page, lastPage);
        const html = topicsTemplate({ topic, page, lastPage, pagination });
        document.querySelector('#forum-main-col').innerHTML = html;
    }

    getPaginationData(page, lastPage) {
        let previousRange = page - 5;
        if (previousRange < 1) {
            previousRange = 1;
        }

        let nextRange = page + 5;
        if (nextRange > lastPage) {
            nextRange = lastPage;
        }

        const pagination = [];
        for (let i = previousRange; i <= nextRange; i++) {
            pagination.push({ page: i, active: i === page });
        }

        if (pagination.length > 0) {
            if (pagination[0].page !== 1) {
                pagination.unshift({ page: false, active: false });
                pagination.unshift({ page: 1, active: false });
            }
            if (pagination[pagination.length - 1].page !== lastPage) {
                pagination.push({ page: false, active: false });
                pagination.push({ page: lastPage, active: false });
            }
        }

        return pagination;
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
                const content = document.querySelector('textarea#message_topic').value;
                const postData = { content };

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

    initQuotes() {
        const quotesButtons = document.querySelectorAll('[data-quote]');
        for (const btn of quotesButtons) {
            const postId = parseInt(btn.dataset.quote);
            const post = this.topic.Posts.find((p) => p.Post.Id === postId);
            btn.addEventListener('click', () => {
                const textarea = document.querySelector('textarea#message_topic');

                const name = post.User ? post.User.Name : post.Post.Username;
                let content = `\n> Le 04 mai 2020 à 21:33:09 ${name} a écrit: \n>`;
                content += post.Post.Content.split('\n').join('\n>');
                content += '\n\n';

                textarea.value += content;
                textarea.focus();
            });
        }
    }
}

export default new HiddenTopic();
