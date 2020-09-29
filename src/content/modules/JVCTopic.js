import { formatISO9075, isBefore } from 'date-fns';

import { parse } from 'open-jvcode';

import hiddenJVC from '../HiddenJVC.js';
import replyFormTemplate from '../views/jvc/topic/replyForm.handlebars';
import editFormTemplate from '../views/jvc/topic/editForm.handlebars';
import postTemplate from '../views/jvc/topic/post.handlebars';

const { initForm, network, getForumName, getJVCTopicInfo } = hiddenJVC.helpers;
const { getState } = hiddenJVC.storage;
const Runtime = hiddenJVC.constants.Runtime;
const { JVC, Hidden } = hiddenJVC.constants.Static;

class JVCTopic {
    constructor() {
        this.pages = JVC.Pages.JVC_TOPIC;
        this.topic = null;
    }

    async init(state) {
        this.setupForm();
        const query = {
            startDate: formatISO9075(Runtime.topicMessages[0].creationDate)
        };

        if (
            Runtime.topicPage !== Runtime.topicLastPage &&
            Runtime.topicMessages.length > 1
        ) {
            const endDate = await Runtime.getNextPageFirstPostDate();
            query.endDate = formatISO9075(endDate);
        }

        const result = await network.getRequest(`${Hidden.API_JVC_TOPICS}/${Runtime.topicId}`, query);
        if (result === null) {
            console.error('api error');
            return;
        }
        const { topic } = result;
        this.topic = topic;

        if (topic !== null) {
            this.insertJVCTopic(topic, state);
            this.highlightPagination(topic);
            this.initPostEdition(topic);
            this.initPostDeletion();
        }
    }

    setupForm() {
        const form = document.querySelector('#bloc-formulaire-forum');
        if (Runtime.isLocked) {
            const html = replyFormTemplate();
            form.insertAdjacentHTML('afterend', html);
            form.remove();
            const hiddenForm = document.querySelector('#hidden-form');
            const submitBtn = hiddenForm.querySelector('#form-submit');
            submitBtn.insertAdjacentElement('afterend', this.createPostButton());
            submitBtn.remove();
            initForm(hiddenForm);
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
                    forumId: Runtime.forumId,
                    viewId: Runtime.viewId,
                    content,
                    page: Runtime.topicLastPage
                };

                if (this.topic === null) {
                    const forumName = await getForumName(Runtime.forumId);
                    const topicInfo = await getJVCTopicInfo(Runtime.viewId, Runtime.forumId, Runtime.topicId);

                    body.forumName = forumName;
                    body.topicTitle = topicInfo.title;
                    body.topicDate = topicInfo.date;
                    body.topicContent = topicInfo.content;
                    body.topicAuthor = topicInfo.author;
                }

                const state = await getState();
                if (!state.user.jwt) {
                    body.username = state.user.name || 'Anonymous';
                }

                const { postId } = await network.postRequest(`${Hidden.API_JVC_TOPICS}/${Runtime.topicId}`, body, state.user.jwt);
                if (typeof postId !== 'number') {
                    throw new Error('fail to create post');
                } else {
                    location.replace(Runtime.generateTopicUrl(Runtime.topicLastPage));
                }
            } catch (err) {
                console.error(err);
            }
        });
        return button;
    }

    insertJVCTopic(topic, state) {
        const jvcMessages = Runtime.topicMessages;

        const bottomPagination = document.querySelectorAll('.bloc-pagi-default')[1];
        const isModerator = state.user.isAdmin || state.user.moderators.filter((m) => m.ForumId === Runtime.forumId).length === 1;

        for (const hiddenPost of topic.Posts) {
            const hiddenDate = new Date(hiddenPost.Post.CreationDate);
            let previousPost = null;

            for (let i = 0; i < jvcMessages.length; i++) {
                let jvcDate = jvcMessages[i].creationDate;
                if (isBefore(hiddenDate, jvcDate)) {
                    previousPost = jvcMessages[i];
                    break;
                }
            }

            const data = { post: hiddenPost, connectedUser: state.user, isModerator };
            if (previousPost !== null) {
                previousPost.element.insertAdjacentHTML('beforebegin', postTemplate(data));
            } else {
                bottomPagination.insertAdjacentHTML('beforebegin', postTemplate(data));
            }
        }
    }

    highlightPagination(topic) {
        const paginationItems = document.querySelectorAll('.bloc-pagi-default .bloc-liste-num-page span');
        for (const item of paginationItems) {
            const paginationPage = parseInt(item.textContent.trim());
            for (const page of topic.Pages) {
                if (paginationPage === page) {
                    const span = document.createElement('span');
                    span.classList.add('hidden-pagination-highlight');
                    item.insertAdjacentElement('afterbegin', span);
                }
            }
        }
    }

    initPostEdition(topic) {
        const buttons = document.querySelectorAll('[data-post-edit]');
        for (const btn of buttons) {
            btn.addEventListener('click', async (e) => {
                try {
                    e.stopPropagation();
                    const postId = parseInt(btn.dataset.postEdit);
                    const post = topic.Posts.find((p) => p.Post.Id === postId);

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

                        const url = `${Hidden.API_JVC_TOPICS}/${topic.Topic.Id}/${postId}`;
                        const { success } = await network.postRequest(url, data, state.user.jwt);
                        if (success) {
                            location.reload();
                        }
                    });
                } catch (err) {
                    console.error(err);
                }
            });
        }
    }

    initPostDeletion() {
        const buttons = document.querySelectorAll('[data-post-delete]');
        for (const btn of buttons) {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const postId = btn.dataset.postDelete;
                const state = await getState();
                const { success } = await network.postRequest(Hidden.API_JVC_POSTS_MODERATION, { action: 'DeletePost', ids: [postId] }, state.user.jwt);
                if (success) {
                    location.reload();
                }
            });
        }
    }
}

const jvcTopic = new JVCTopic();
hiddenJVC.registerModule(jvcTopic);
