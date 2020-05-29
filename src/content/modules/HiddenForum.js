import { parse } from 'open-jvcode';

import hiddenJVC from '../HiddenJVC.js';

const { getState } = hiddenJVC.storage;
const { getRequest, postRequest } = hiddenJVC.helpers.network;
const { Runtime } = hiddenJVC.constants;
const { JVC, Hidden } = hiddenJVC.constants.Static;
const { forum } = hiddenJVC.views.forum;

class HiddenForum {
    constructor() {
        this.pages = JVC.Pages.HIDDEN_FORUM;
    }

    async init(state) {
        const form = document.querySelector('#bloc-formulaire-forum');

        const { topics, count } = await getRequest(Hidden.API_HIDDEN_TOPICS, {
            forumId: Runtime.forumId,
            page: state.hidden.list.page,
        });

        this.render(topics, count, state.hidden.list.page);
        this.setupForm(form);
    }

    render(topics, count, page) {
        const lastPage = Math.ceil(count / 20);
        const pagination = this.getPaginationData(page, lastPage);

        for (const topic of topics) {
            topic.Url = `http://www.jeuxvideo.com/forums/0-${Runtime.forumId}-0-1-0-1-0-0.htm?hidden=1&view=topic&topicId=${topic.Topic.Id}&topicPage=1`;
        }

        const data = {
            topics,
            page,
            lastPage,
            pagination,
            forumName: Runtime.forumName
        };

        const html = forum(data);
        document.querySelector('#forum-main-col').innerHTML = html;

        document.querySelectorAll('button.btn-actualiser-forum').forEach((btn) => {
            btn.addEventListener('click', () => location.reload());
        });
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
        document.querySelector('#bloc-formulaire-forum-placeholder').replaceWith(form);

        const preview = document.querySelector('.previsu-editor.text-enrichi-forum');
        const clone = preview.cloneNode();
        clone.style.backgroundColor = 'var(--hidden-primary-color)';
        preview.insertAdjacentElement('afterend', clone);
        preview.remove();

        const textarea = document.querySelector('textarea#message_topic');
        textarea.addEventListener('keyup', () => {
            const output = parse(textarea.value);
            clone.innerHTML = output;
        });
    }

    createPostButton() {
        const button = document.createElement('button');
        button.textContent = 'Poster';
        button.type = 'button';
        button.classList.add('btn', 'btn-poster-msg');
        button.addEventListener('click', async () => {
            try {
                const title = document.querySelector('input#titre_topic').value;
                const content = document.querySelector('textarea#message_topic').value;

                const data = {
                    topic: {
                        title,
                        forumId: Runtime.forumId,
                        forumName: Runtime.forumName
                    },
                    post: {
                        content
                    }
                };

                const state = await getState();
                if (!state.user.jwt) {
                    data.topic.username = state.user.name || 'Anonymous';
                }

                const { topicId } = await postRequest(Hidden.API_HIDDEN_TOPICS, data, state.user.jwt);
                if (topicId) {
                    const url = `http://www.jeuxvideo.com/forums/0-${Runtime.forumId}-0-1-0-1-0-0.htm?hidden=1&view=topic&topicPage=1&topicId=${topicId}`;
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

const hiddenList = new HiddenForum();
hiddenJVC.registerModule(hiddenList);
