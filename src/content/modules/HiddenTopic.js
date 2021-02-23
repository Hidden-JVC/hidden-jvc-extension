import { parse } from 'open-jvcode';

import hiddenJVC from '../HiddenJVC.js';

import topicTemplate from '../views/hidden/topic/topic.handlebars';
import editFormTemplate from '../views/hidden/topic/editForm.handlebars';
import loadingTemplate from '../views/hidden/topic/loading.handlebars';

const { getState } = hiddenJVC.storage;
const { Runtime } = hiddenJVC.constants;
const { JVC, Hidden } = hiddenJVC.constants.Static;
const { createPagination, network, postDateFormat, initForm, createModal, processHiddenUrl } = hiddenJVC.helpers;

class HiddenTopic {
    constructor() {
        this.pages = JVC.Pages.HIDDEN_TOPIC;

        this.topic = null;
    }

    async init(state) {
        document.querySelector('#forum-main-col').outerHTML = loadingTemplate();

        const query = {
            page: state.hidden.topic.page
        };

        if (state.hidden.topic.userId) {
            query.userId = state.hidden.topic.userId;
        }

        try {
            const { topic, error } = await network.getRequest(`${Hidden.API_HIDDEN_TOPICS}/${state.hidden.topic.id}`, query);

            if (error) {
                createModal(error);
                return;
            }

            this.topic = topic;

            this.render(state);

            if (!this.topic.Topic.Locked) {
                this.initForm();
            }

            const openWebsiteBtn = document.querySelector('#open-website');
            if (openWebsiteBtn !== null) {
                openWebsiteBtn.addEventListener('click', () => {
                    chrome.runtime.sendMessage({ action: 'open-website', path: `forums/${Runtime.forumId}/hidden/${this.topic.Topic.Id}` });
                });
            }

            /* eslint-disable-next-line no-undef */
            if (process.env.HIDDEN_ENV === 'userscript') {
                document.querySelectorAll('a.hidden-link').forEach((anchor) => {
                    anchor.addEventListener('click', async (e) => {
                        e.preventDefault();
                        await processHiddenUrl(anchor.href);
                        location.reload();
                    });
                });
            }

            // window.addEventListener('popstate', () => {
            //     alert('aze');
            //     console.log(arguments);
            // });

            // window.onpopstate = () => {
            //     alert('qsd');
            //     console.log(arguments);
            // };
            // console.log('ok');

            this.initQuotes();
            this.initReloadButtons();
            this.initModeration(state);
            this.initPostDelete();
            this.initPostEdition();
            this.initPostPin();
        } catch (err) {
            console.error(err);
            createModal('Une erreur est survenue lors de la connexion au serveur d\'Hidden JVC');
        }
    }

    render(state) {
        const topic = this.topic;
        const page = state.hidden.topic.page;
        const lastPage = Math.ceil(this.topic.PostsCount / 20);
        const pagination = createPagination(state.hidden.topic.page, lastPage);
        const isModerator = state.user.isAdmin || state.user.moderators.filter((m) => m.ForumId === Runtime.forumId).length === 1;
        const isAuthor = this.topic.Author && (state.user.userId === this.topic.Author.Id);
        let opPostOnlyUrl = null;

        const forumUrl = `https://www.jeuxvideo.com/forums/0-${Runtime.forumId}-0-1-0-1-0-0.htm`;

        if (this.topic.Author !== null) {
            if (state.hidden.topic.userId) {
                // toggle op only off
                opPostOnlyUrl = `${forumUrl}?hidden=1&topicId=${this.topic.Topic.Id}&topicPage=1&topicUserId=null`;
            } else {
                // toggle op only on
                opPostOnlyUrl = `${forumUrl}?hidden=1&topicId=${this.topic.Topic.Id}&topicPage=1&topicUserId=${this.topic.Author.Id}`;
            }
        }

        for (const post of topic.Posts) {
            if (post.User !== null) {
                post.ProfileUrl = `https://www.jeuxvideo.com/hidden-redirect/users/${post.User.Name}`;
            }
        }

        const data = {
            topic,
            page,
            connectedUser: state.user,
            isAuthor,
            isModerator,
            forumUrl,
            lastPage,
            pagination,
            opPostOnlyUrl
        };

        const html = topicTemplate(data);
        document.querySelector('#forum-main-col').outerHTML = html;
    }

    initForm() {
        const form = document.querySelector('#hidden-form');
        initForm(form);

        const submitBtn = form.querySelector('#form-submit');
        submitBtn.addEventListener('click', async () => {
            try {
                const content = form.querySelector('textarea#message_topic').value;
                const data = { content };

                const state = await getState();
                if (!state.user.jwt) {
                    data.username = state.user.anonymousName || 'Anonymous';
                }

                const url = `${Hidden.API_HIDDEN_TOPICS}/${this.topic.Topic.Id}/posts`;
                const { error } = await network.postRequest(url, data, state.user.jwt);
                if (error) {
                    createModal(error);
                } else {
                    location.reload();
                }
            } catch (err) {
                console.error(err);
                createModal('Une erreur est survenue lors de la connexion au serveur d\'Hidden JVC');
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
                const { success } = await network.postRequest(Hidden.API_HIDDEN_POSTS_MODERATION, { action: 'Delete', ids: [postId] }, state.user.jwt);
                if (success) {
                    location.reload();
                }
            });
        }
    }

    initPostEdition() {
        const buttons = document.querySelectorAll('[data-post-edit]');
        for (const btn of buttons) {
            btn.addEventListener('click', async (e) => {
                try {
                    e.stopPropagation();
                    const postId = parseInt(btn.dataset.postEdit);
                    const post = this.topic.Posts.find((p) => p.Post.Id === postId);

                    const display = document.querySelector(`[data-post-display="${postId}"]`);
                    display.innerHTML = editFormTemplate({ postId, content: post.Post.Content });

                    const form = document.querySelector(`[data-post-id="${postId}"]`);
                    initForm(form);

                    const cancelBtn = form.querySelector('[data-cancel');
                    cancelBtn.addEventListener('click', () => {
                        display.innerHTML = parse(post.Post.Content);
                    });

                    const submitBtn = form.querySelector('[data-submit');
                    submitBtn.addEventListener('click', async () => {
                        const textarea = form.querySelector('textarea#message_topic');

                        const data = {
                            content: textarea.value.trim()
                        };
                        const state = await getState();

                        try {
                            const url = `${Hidden.API_HIDDEN_TOPICS}/${this.topic.Topic.Id}/posts/${postId}`;
                            const { error } = await network.postRequest(url, data, state.user.jwt);
                            if (error) {
                                createModal(error);
                            } else {
                                location.reload();
                            }
                        } catch (err) {
                            console.error(err);
                            createModal('Une erreur est survenue lors de la connexion au serveur d\'Hidden JVC');
                        }
                    });
                } catch (err) {
                    console.error(err);
                }
            });
        }
    }

    initPostPin() {
        const buttons = document.querySelectorAll('[data-post-pin],[data-post-unpin]');
        for (const btn of buttons) {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                let postId = null;
                let pinned = null;
                if (btn.dataset.postPin) {
                    pinned = true;
                    postId = parseInt(btn.dataset.postPin);
                } else if (btn.dataset.postUnpin) {
                    pinned = false;
                    postId = parseInt(btn.dataset.postUnpin);
                }

                try {
                    const state = await getState();
                    const url = `${Hidden.API_HIDDEN_TOPICS}/${this.topic.Topic.Id}/${postId}`;
                    const { error } = await network.postRequest(url, { pinned }, state.user.jwt);
                    if (error) {
                        createModal(error);
                    } else {
                        location.reload();
                    }
                } catch (err) {
                    console.error(err);
                    createModal('Une erreur est survenue lors de la connexion au serveur d\'Hidden JVC');
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
