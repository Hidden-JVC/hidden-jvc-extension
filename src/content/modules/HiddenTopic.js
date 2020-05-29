import { parse } from 'open-jvcode';

import hiddenJVC from '../HiddenJVC.js';

const { getState } = hiddenJVC.storage;
const { Runtime } = hiddenJVC.constants;
const { JVC, Hidden } = hiddenJVC.constants.Static;
const { topic: topicTemplate } = hiddenJVC.views.topic;
const { createPagination, network, postDateFormat } = hiddenJVC.helpers;

class HiddenTopic {
    constructor() {
        this.pages = JVC.Pages.HIDDEN_TOPIC;

        this.topic = null;
    }

    async init(state) {
        const query = {
            page: state.hidden.topic.page
        };

        if (state.hidden.topic.userIdFilter) {
            query.userId = state.hidden.topic.userIdFilter;
        }

        const { topic } = await network.getRequest(`${Hidden.API_HIDDEN_TOPICS}/${state.hidden.topic.id}`, query);
        this.topic = topic;

        this.render(state);

        this.initForm();
        this.initQuotes();
        this.initReloadButtons();
    }

    render(state) {
        const lastPage = Math.ceil(this.topic.PostsCount / 20);
        const pagination = createPagination(state.hidden.topic.page, lastPage);
        const forumUrl = `http://www.jeuxvideo.com/forums/0-${Runtime.forumId}-0-1-0-1-0-0.htm?hidden=0`;

        const data = {
            topic: this.topic,
            page: state.hidden.topic.page,
            forumUrl,
            lastPage,
            pagination
        };

        const html = topicTemplate(data);
        document.querySelector('#forum-main-col').innerHTML = html;
    }

    initForm() {
        const textarea = document.querySelector('#hidden-form textarea#message_topic');

        const buttons = document.querySelectorAll('[data-edit]');
        for (const btn of buttons) {
            btn.addEventListener('click', () => {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;

                const before = textarea.value.substring(0, start);
                const selected = textarea.value.substring(start, end);
                const after = textarea.value.substring(end, textarea.value.length);

                const edit = btn.dataset.edit;
                switch (edit) {
                    case 'bold':
                        textarea.value = `${before}**${selected}**${after}`;
                        break;
                    case 'italic':
                        textarea.value = `${before}*${selected}*${after}`;
                        break;
                    case 'underline':
                        textarea.value = `${before}<ins>${selected}</ins>${after}`;
                        break;
                    case 'del':
                        textarea.value = `${before}~~${selected}~~${after}`;
                        break;
                    case 'spoil':
                        textarea.value = `${before}<spoil>${selected}</spoil>${after}`;
                        break;
                }
                textarea.focus();
                textarea.selectionEnd = end;
                this.updatePreview();
            });
        }

        textarea.addEventListener('keyup', this.updatePreview);

        const submitBtn = document.querySelector('#hidden-form #form-submit');
        submitBtn.addEventListener('click', async () => {
            try {
                const content = document.querySelector('textarea#message_topic').value;
                const data = { post: { content } };

                const state = await getState();
                if (!state.user.jwt) {
                    data.post.username = state.user.name || 'Anonymous';
                }

                const url = `${Hidden.API_HIDDEN_TOPICS}/${this.topic.Topic.Id}`;
                await network.postRequest(url, data, state.user.jwt);
                location.reload();
            } catch (err) {
                console.error(err);
            }
        });
    }

    updatePreview() {
        const textarea = document.querySelector('#hidden-form textarea#message_topic');
        const preview = document.querySelector('#hidden-form .previsu-editor');
        preview.innerHTML = parse(textarea.value);
    }

    initQuotes() {
        const quotesButtons = document.querySelectorAll('[data-quote]');
        for (const btn of quotesButtons) {
            const postId = parseInt(btn.dataset.quote);
            const post = this.topic.Posts.find((p) => p.Post.Id === postId);
            const textarea = document.querySelector('textarea#message_topic');

            btn.addEventListener('click', () => {
                const name = post.User ? post.User.Name : post.Post.Username;
                let content = `\n> Le ${postDateFormat(post.Post.CreationDate)} ${name} a écrit: \n>`;
                content += post.Post.Content.split('\n').join('\n>');
                content += '\n\n';

                textarea.value += content;
                textarea.focus();
                this.updatePreview();
            });
        }
    }

    initReloadButtons() {
        document.querySelectorAll('[data-reload]').forEach((btn) => {
            btn.addEventListener('click', () => location.reload());
        });
    }
}

const hiddenTopic = new HiddenTopic();
hiddenJVC.registerModule(hiddenTopic);
