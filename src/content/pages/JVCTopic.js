import { formatISO9075, isBefore } from 'date-fns';

import { parse } from 'open-jvcode';
import runtime from '../runtime.js';
import { API_URL } from '../constants.js';
import { getState } from '../../helpers/storage.js';
import getForumName from '../helpers/getForumName.js';
import getJVCTopicInfo from '../helpers/getJVCTopicInfo.js';
import postTemplate from '../views/jvc/topic/post.handlebars';
import { postRequest, getRequest } from '../helpers/network.js';
import editFormTemplate from '../views/jvc/topic/editForm.handlebars';

export default async function (state) {
    try {
        const topic = await getHiddenTopic();
        console.log(topic);

        initForm(topic);
        if (topic !== null) {
            highlightPagination(topic);
            insertJVCPosts(topic, state);
            // initPostDeletion();
        }
    } catch (err) {
        console.error(err);
        // createModal('Une erreur est survenue lors de la connexion au serveur d\'Hidden JVC');
    }
}

async function getHiddenTopic() {
    const query = {
        startDate: formatISO9075(runtime.topic.messages[0].creationDate)
    };

    let endDate = null;

    if (runtime.topic.messages.length > 1) {
        endDate = formatISO9075(runtime.topic.messages[topic.messages.length - 1].creationDate);
    }

    if (runtime.topic.page !== runtime.topic.lastPage) {
        const date = await runtime.getNextPageFirstPostDate();
        endDate = formatISO9075(date);
    }

    if (endDate !== null) {
        query.endDate = endDate;
    }

    const { error, topic } = await getRequest(`${API_URL}/jvc/topics/${runtime.topic.id}`, query);

    if (error) {
        throw new error(error);
    }

    return topic;
}

function initForm(topic) {
    const form = document.querySelector('#bloc-formulaire-forum');
    if (runtime.topic.isLocked) {
        console.log('locked');
    } else {
        const btn = createHiddenPostBtn(topic);
        const jvcPostButton = form.querySelector('.btn.btn-poster-msg.js-post-message');
        jvcPostButton.insertAdjacentElement('afterend', btn);
    }
}

function createHiddenPostBtn(topic) {
    const button = document.createElement('button');
    button.textContent = 'Poster sur Hidden JVC';
    button.type = 'button';
    button.classList.add('btn', 'btn-poster-msg', 'hidden-primary-color-bg');
    button.style.backgroundColor = '#083193';
    button.addEventListener('click', async () => {
        try {
            const content = document.querySelector('textarea#message_topic').value;

            const body = {
                forumId: runtime.forum.id,
                viewId: runtime.forum.viewId,
                content,
                page: runtime.topic.lastPage
            };

            if (topic === null) {
                const forumName = await getForumName(runtime.forum.id);
                const topicInfo = await getJVCTopicInfo(runtime.forum.viewId, runtime.forum.id, runtime.topic.id);

                body.forumName = forumName;
                body.topicTitle = topicInfo.title;
                body.topicDate = topicInfo.date;
                body.topicContent = topicInfo.content;
                body.topicAuthor = topicInfo.author;
            }

            const state = await getState();
            if (!state.user.jwt) {
                body.username = state.user.anonymousName || 'Anonymous';
            }
            try {
                const { error } = await postRequest(`${API_URL}/jvc/topics/${runtime.topic.id}`, body, state.user.jwt);
                if (error) {
                    console.error(error);
                    return;
                } else {
                    // location.replace(runtime.generateTopicUrl(runtime.topic.lastPage));
                }
            } catch (err) {
                console.error(err);
            }
        } catch (err) {
            console.error(err);
        }
    });
    return button;
}

function insertJVCPosts(topic, state) {
    const jvcMessages = runtime.topic.messages;

    const bottomPagination = document.querySelectorAll('.bloc-pagi-default')[1];
    const isModerator = state.user.isAdmin || state.user.moderators.filter((m) => m.ForumId === runtime.forum.id).length === 1;

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
        const postElement = document.querySelector(`[data-hidden-post-id="${hiddenPost.Post.Id}"]`);
        initPostEdition(topic, hiddenPost, postElement);
    }
}

function initPostEdition(topic, post, postElement) {
    const editBtn = postElement.querySelector('[data-post-edit]');
    editBtn.addEventListener('click', async (e) => {
        try {
            e.stopPropagation();
            const display = document.querySelector(`[data-post-display="${post.Post.Id}"]`);
            display.innerHTML = editFormTemplate({ postId: post.Post.Id, content: post.Post.Content });

            const form = document.querySelector(`[data-post-id="${post.Post.Id}"]`);
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
                    const url = `${API_URL}/jvc/topics/${topic.Topic.Id}/${post.Post.Id}`;
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
                        console.error(error);
                    } else {
                        location.reload();
                    }
                } catch (err) {
                    console.log(err);
                }
            });
        } catch (err) {
            console.error(err);
        }
    });
}

function highlightPagination(topic) {
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
