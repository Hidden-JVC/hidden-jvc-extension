import { formatISO9075, isBefore } from 'date-fns';

import hiddenJVC from '../HiddenJVC.js';

const { getState } = hiddenJVC.storage;
const { post } = hiddenJVC.views.topic;
const { JVC, Hidden } = hiddenJVC.constants.Static;
const Runtime = hiddenJVC.constants.Runtime;
const { getRequest, postRequest } = hiddenJVC.helpers.network;

class JVCTopic {
    constructor() {
        this.pages = JVC.Pages.JVC_TOPIC;
    }

    async init() {
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

        const result = await getRequest(`${Hidden.API_JVC_TOPICS}/${Runtime.topicId}`, query);
        if (result === null) {
            return;
        }
        const { topic } = result;

        if (topic !== null) {
            this.insertJVCTopic(topic);
            this.highlightPagination(topic);
        }
    }

    setupForm() {
        const form = document.querySelector('#bloc-formulaire-forum');
        const jvcPostButton = form.querySelector('.btn.btn-poster-msg.js-post-message');
        jvcPostButton.insertAdjacentElement('afterend', this.createPostButton());
    }

    createPostButton() {
        const button = document.createElement('button');
        button.textContent = 'Poster sur Hidden JVC';
        button.type = 'button';
        button.classList.add('btn', 'btn-poster-msg');
        button.style.backgroundColor = '#083193';
        button.addEventListener('click', async () => {
            try {
                const content = document.querySelector('textarea#message_topic').value;

                const body = {
                    forum: {
                        id: Runtime.forumId,
                        name: Runtime.forumName
                    },
                    topic: {
                        title: Runtime.topicTitle,
                        viewId: Runtime.viewId,
                        firstPostDate: '2020-05-09 08:05:43.117493+00',
                        firstPostContent: 'Bonjour à tous',
                        firstPostUsername: 'BaptisteGonella'
                    },
                    post: {
                        content,
                        page: Runtime.topicLastPage
                    }
                };

                const state = await getState();
                if (!state.user.jwt) {
                    body.post.username = state.user.name || 'Anonymous';
                }

                const { postId } = await postRequest(`${Hidden.API_JVC_TOPICS}/${Runtime.topicId}`, body, state.user.jwt);
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

    insertJVCTopic(topic) {
        const jvcMessages = Runtime.topicMessages;

        const bottomPagination = document.querySelectorAll('.bloc-pagi-default')[1];

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

            if (previousPost !== null) {
                previousPost.element.insertAdjacentHTML('beforebegin', post(hiddenPost));
            } else {
                bottomPagination.insertAdjacentHTML('beforebegin', post(hiddenPost));
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
                    span.style.borderTop = '3px solid var(--hidden-primary-color)';
                    span.style.display = 'block';
                    item.insertAdjacentElement('afterbegin', span);
                }
            }
        }
    }
}

const jvcTopic = new JVCTopic();
hiddenJVC.registerModule(jvcTopic);
