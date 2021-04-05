import { formatISO9075, isBefore } from 'date-fns';

import { parse } from 'open-jvcode';

import hiddenJVC from '../HiddenJVC.js';

import events from '../events.js';
import runtime from '../runtime.js';
import * as network from '../network.js';
import * as storage from '../storage.js';
import { JVC, Hidden } from '../constants';
import { decodeJvCare, getForumName, getJVCTopicInfo } from '../helpers';

import postTemplate from '../views/jvc/topic/post.handlebars';
import editFormTemplate from '../views/jvc/topic/editForm.handlebars';
import replyFormTemplate from '../views/jvc/topic/replyForm.handlebars';

class JVCTopic {
    constructor() {
        this.pages = JVC.Pages.JVC_TOPIC;
        this.topic = null;
        this.postPages = [];
        this.posts = [];
    }

    async init(state) {
        try {
            this.initJVCEvents();
            await this.getHiddenTopic();

            this.initForm();
            if (this.topic !== null) {
                this.highlightPagination();
                this.insertJVCPosts(state);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async getHiddenTopic() {
        const start = performance.now();
        const query = {
            startDate: formatISO9075(runtime.topic.messages[0].creationDate)
        };

        let endDate = null;

        if (runtime.topic.page !== runtime.topic.lastPage) {
            const date = await runtime.getNextPageFirstPostDate();
            endDate = formatISO9075(date);
        }

        if (endDate !== null) {
            query.endDate = endDate;
        }

        const url = `${Hidden.API_URL}/jvc/topics/${runtime.topic.id}`;
        const { error, topic, posts, pages } = await network.getRequest(url, query);

        if (error) {
            throw new Error(error);
        }

        this.topic = topic;
        this.posts = posts;
        this.postPages = pages;
        const end = performance.now();
        events.emit('add-log', 'info', `Messages récupéré en ${((end - start) / 1000).toFixed(2)} secondes`);
    }

    initJVCEvents() {
        const refreshBtns = document.querySelectorAll('.btn-actualiser-forum');
        refreshBtns.forEach((btn) => btn.addEventListener('click', () => location.reload()));

        const connectBtn = document.querySelector('.jv-nav-account-connect');
        if (connectBtn !== null) {
            connectBtn.addEventListener('click', () => {
                location.href = `https://www.jeuxvideo.com/login?url=${location.href}`;
            });
        }

        const profileBtn = document.querySelector('.jv-nav-account-user');
        if (profileBtn !== null) {
            profileBtn.addEventListener('click', () => profileBtn.classList.add('open'));
        }

        const spans = document.querySelectorAll('span.JvCare');
        for (const span of spans) {
            const jvCare = span.classList[1];
            const classes = Array.prototype.slice.call(span.classList, 2, span.classList.length);
            const url = decodeJvCare(jvCare);

            const a = document.createElement('a');
            a.href = url;
            if (classes.length > 0) {
                a.classList.add(...classes);
            }
            if (span.target) {
                a.target = span.target;
            }
            a.append(...span.childNodes);
            span.replaceWith(a);
        }
    }

    initForm() {
        const form = document.querySelector('#bloc-formulaire-forum');
        if (runtime.topic.isLocked) {
            const html = replyFormTemplate();
            form.insertAdjacentHTML('afterend', html);
            form.remove();
            const hiddenForm = document.querySelector('#hidden-form');
            const submitBtn = hiddenForm.querySelector('#form-submit');
            submitBtn.insertAdjacentElement('afterend', this.createPostButton());
            submitBtn.remove();
            // initForm(hiddenForm);
        } else {
            const jvcPostButton = form.querySelector('.btn.btn-poster-msg.js-post-message');
            jvcPostButton.insertAdjacentElement('afterend', this.createPostButton());
        }
    }

    createPostButton() {
        const button = document.createElement('button');
        button.textContent = 'Poster sur Hidden JVC';
        button.type = 'button';
        button.classList.add('btn', 'btn-poster-msg', 'hidden-primary-color-bg');
        button.style.backgroundColor = '#083193';
        button.addEventListener('click', async () => {
            try {
                const content = document.querySelector('textarea#message_topic').value;

                const body = {
                    content,
                    forumId: runtime.forum.id,
                    viewId: runtime.forum.viewId,
                    page: runtime.topic.lastPage
                };

                if (this.topic === null) {
                    const forumName = await getForumName(runtime.forum.id);
                    const topicInfo = await getJVCTopicInfo(runtime.forum.viewId, runtime.forum.id, runtime.topic.id);

                    body.forumName = forumName;
                    body.topicTitle = topicInfo.title;
                    body.topicDate = topicInfo.date;
                    body.topicContent = topicInfo.content;
                    body.topicAuthor = topicInfo.author;
                }

                const state = await storage.getState();
                if (!state.user.jwt) {
                    body.username = state.user.anonymousName || 'Anonymous';
                }
                try {
                    const url = `${Hidden.API_URL}/jvc/topics/${runtime.topic.id}`;
                    const { error } = await network.postRequest(url, body, state.user.jwt);
                    if (error) {
                        events.emit('add-log', 'error', error);
                        return;
                    } else {
                        location.reload();
                    }
                } catch (err) {
                    events.emit('add-log', 'error', err.message);
                }
            } catch (err) {
                events.emit('add-log', 'error', err.message);
            }
        });
        return button;
    }

    insertJVCPosts(state) {
        const bottomPagination = document.querySelectorAll('.bloc-pagi-default')[1];
        const isModerator = state.user.isAdmin || state.user.moderators.filter((m) => m.ForumId === runtime.forum.id).length === 1;
        const jvcMessages = runtime.topic.messages;
        for (const post of this.posts) {
            const hiddenDate = new Date(post.CreationDate);
            let previousPost = null;

            for (let i = 0; i < jvcMessages.length; i++) {
                let jvcDate = jvcMessages[i].creationDate;
                if (isBefore(hiddenDate, jvcDate)) {
                    previousPost = jvcMessages[i];
                    break;
                }
            }

            const html = postTemplate({ post, connectedUser: state.user, isModerator });
            if (previousPost !== null) {
                previousPost.element.insertAdjacentHTML('beforebegin', html);
            } else {
                bottomPagination.insertAdjacentHTML('beforebegin', html);
            }
            const postElement = document.querySelector(`[data-hidden-post-id="${post.Id}"]`);
            this.initPostEdition(post, postElement);
            this.initPostDeletion(post, postElement);
        }
    }

    initPostDeletion(post, postElement) {
        const deleteBtn = postElement.querySelector('[data-post-delete]');
        if (deleteBtn !== null) {
            deleteBtn.addEventListener('click', async (e) => {
                try {
                    e.stopPropagation();
                    const state = await storage.getState();
                    const url = `${Hidden.API_URL}/jvc/posts/${post.Id}`;
                    const { error } = await network.deleteRequest(url, state.user.jwt);
                    if (error) {
                        events.emit('add-log', 'error', error);
                    } else {
                        location.reload();
                    }
                } catch (err) {
                    events.emit('add-log', 'error', err.message);
                }
            });
        }
    }

    initPostEdition(post, postElement) {
        const editBtn = postElement.querySelector('[data-post-edit]');
        if (editBtn === null) {
            return;
        }
        editBtn.addEventListener('click', async (e) => {
            try {
                e.stopPropagation();
                const display = document.querySelector(`[data-post-display="${post.Id}"]`);
                display.innerHTML = editFormTemplate({ postId: post.Id, content: post.Content });

                const form = document.querySelector(`[data-post-id="${post.Id}"]`);

                const cancelBtn = form.querySelector('[data-cancel');
                cancelBtn.addEventListener('click', () => {
                    display.innerHTML = parse(post.Content);
                });

                const submitBtn = form.querySelector('[data-submit');
                submitBtn.addEventListener('click', async () => {
                    const textarea = form.querySelector('textarea#message_topic');

                    const data = { content: textarea.value.trim() };
                    const state = await storage.getState();
                    try {
                        const url = `${Hidden.API_URL}/jvc/posts/${post.Id}`;
                        const response = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                                'authorization': `Bearer ${state.user.jwt}`
                            },
                            body: JSON.stringify(data)
                        });
                        const { error } = await response.json();
                        if (error) {
                            events.emit('add-log', 'error', error);
                        } else {
                            location.reload();
                        }
                    } catch (err) {
                        events.emit('add-log', 'error', err.message);
                    }
                });
            } catch (err) {
                events.emit('add-log', 'error', err.message);
            }
        });
    }

    highlightPagination() {
        const paginationItems = document.querySelectorAll('.bloc-pagi-default .bloc-liste-num-page span');
        for (const item of paginationItems) {
            const paginationPage = parseInt(item.textContent.trim());
            for (const page of this.postPages) {
                if (paginationPage === page) {
                    const span = document.createElement('span');
                    span.classList.add('hidden-pagination-highlight');
                    item.insertAdjacentElement('afterbegin', span);
                }
            }
        }
    }
}

const jvcTopic = new JVCTopic();
hiddenJVC.registerModule(jvcTopic);
