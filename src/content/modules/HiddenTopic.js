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

        if (state.hidden.topic.userId) {
            query.userId = state.hidden.topic.userId;
        }

        const result = await network.getRequest(`${Hidden.API_HIDDEN_TOPICS}/${state.hidden.topic.id}`, query);
        if (result === null) {
            return;
        }
        this.topic = result.topic;

        this.render(state);

        if (!this.topic.Topic.Locked) {
            this.initForm();
        }
        this.initQuotes();
        this.initReloadButtons();
        this.initModeration(state);
        this.initPostDelete();
    }

    render(state) {
        const topic = this.topic;
        const page = state.hidden.topic.page;
        const lastPage = Math.ceil(this.topic.PostsCount / 20);
        const pagination = createPagination(state.hidden.topic.page, lastPage);
        let opPostOnlyUrl = null;

        const forumUrl = `https://www.jeuxvideo.com/forums/0-${Runtime.forumId}-0-1-0-1-0-0.htm`;

        if (this.topic.User !== null) {
            if (state.hidden.topic.userId) {
                // toggle op only off
                opPostOnlyUrl = `${forumUrl}?hidden=1&topicId=${this.topic.Topic.Id}&topicPage=1&topicUserId=null`;
            } else {
                // toggle op only on
                opPostOnlyUrl = `${forumUrl}?hidden=1&topicId=${this.topic.Topic.Id}&topicPage=1&topicUserId=${this.topic.User.Id}`;
            }
        }

        const data = {
            topic,
            page,
            user: state.user,
            forumUrl,
            lastPage,
            pagination,
            opPostOnlyUrl
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

    initPostDelete() {
        const buttons = document.querySelectorAll('[data-post-delete]');
        for (const btn of buttons) {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const postId = btn.dataset.postDelete;
                const state = await getState();
                const { success } = await network.postRequest(Hidden.API_HIDDEN_TOPICS_MODERATION, { action: 'delete', postIds: [postId] }, state.user.jwt);
                if (success) {
                    location.reload();
                }
            });
        }
    }

    initReloadButtons() {
        document.querySelectorAll('[data-reload]').forEach((btn) => {
            btn.addEventListener('click', () => location.reload());
        });
    }

    initModeration(state) {
        const topicIds = [this.topic.Topic.Id];

        const lockTopicBtn = document.querySelector('#lock-topic-btn');
        if (lockTopicBtn !== null) {
            lockTopicBtn.addEventListener('click', async () => {
                const { success } = await network.postRequest(Hidden.API_HIDDEN_TOPICS_MODERATION, { action: 'lock', topicIds }, state.user.jwt);
                if (success) {
                    location.reload();
                } else {
                    console.log('fail');
                }
            });
        }

        const unlockTopicBtn = document.querySelector('#unlock-topic-btn');
        if (unlockTopicBtn !== null) {
            unlockTopicBtn.addEventListener('click', async () => {
                const { success } = await network.postRequest(Hidden.API_HIDDEN_TOPICS_MODERATION, { action: 'unlock', topicIds }, state.user.jwt);
                if (success) {
                    location.reload();
                }
            });
        }

        const deleteTopicBtn = document.querySelector('#delete-topic-btn');
        if (deleteTopicBtn !== null) {
            deleteTopicBtn.addEventListener('click', async () => {
                const { success } = await network.postRequest(Hidden.API_HIDDEN_TOPICS_MODERATION, { action: 'delete', topicIds }, state.user.jwt);
                if (success) {
                    location.reload();
                    location.href = `https://www.jeuxvideo.com/forums/0-${Runtime.forumId}-0-1-0-1-0-0.htm?hidden=1&view=list`;
                }
            });
        }
    }
}

const hiddenTopic = new HiddenTopic();
hiddenJVC.registerModule(hiddenTopic);
