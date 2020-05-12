import { fr } from 'date-fns/locale';
import { parse, formatISO9075 } from 'date-fns';

import pageInfo from './PageInfo.js';
import { jvc, hidden } from '../constants';
import { getState } from '../../helpers/storage';
import { topicData, forumData } from '../helpers/jvc/topic.js';
import { getRequest, postRequest } from '../helpers/network.js';

class HiddenList {
    constructor() {
        this.topic = null;

        this.topicData = topicData;
        this.forumData = forumData;
    }

    async init() {
        if (pageInfo.currentPage !== jvc.pages.JVC_TOPIC) {
            return;
        }

        this.setupForm();

        // const startDate = this.getDate(messages[0]);
        // const endDate = this.getDate(messages[messages.length - 1]);

        // const result = await getRequest(`${hidden.API_JVC_TOPICS}/${pageInfo.jvc.topic.topicId}`, {
        //     startDate,
        //     endDate
        // });

        console.log(this.forumData);
    }

    setupForm() {
        const form = document.querySelector('#bloc-formulaire-forum');
        const jvcPostButton = form.querySelector('.btn.btn-poster-msg.js-post-message');
        jvcPostButton.insertAdjacentElement('afterend', this.createPostButton());
    }

    createPostButton() {
        const button = document.createElement('button');
        button.textContent = 'Poster';
        button.type = 'button';
        button.classList.add('btn', 'btn-poster-msg');
        button.style.backgroundColor = '#083193';
        button.addEventListener('click', async () => {
            try {
                const content = document.querySelector('textarea#message_topic').value;

                const body = {
                    forum: {
                        id: 15,
                        name: 'Forum Blabla moins de 15 ans' // ?
                    },
                    topic: { // ?
                        title: 'Enquête sur le ressenti des jeunes durant cette période de crise sanitaire et de confinement',
                        creationDate: '2020-05-09 08:05:43.117493+00',
                        firstPostContent: 'Bonjour à tous',
                        firstPostUsername: 'BaptisteGonella'
                    },
                    post: {
                        content,
                        page: 3
                    }
                };

                const state = await getState();
                if (!state.user.jwt) {
                    body.post.username = state.user.name || 'Anonymous';
                }
            } catch (err) {
                console.error(err);
            }
        });
        return button;
    }

    getDate(message) {
        const dateStr = message.querySelector('.bloc-date-msg').textContent.trim();
        const date = parse(dateStr, 'dd MMMM yyyy à kk:mm:ss', new Date(), { locale: fr });
        return formatISO9075(date);
    }
}

export default new HiddenList();
