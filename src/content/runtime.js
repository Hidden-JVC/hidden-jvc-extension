import { parse } from 'date-fns';
import { fr } from 'date-fns/locale';

import { decodeJvCare } from './helpers';

class Runtime {
    constructor() {
        this.currentPage = null;

        this.forum = {
            id: 0,
            viewId: 0,
            offset: 0,
            name: null,
            topics: []
        };

        this.topic = {
            id: 0,
            page: 1,
            lastPage: 1,
            is410: false,
            isLocked: false,
            messages: []
        };

        this.pages = {
            JVC_FORUM: 1,
            JVC_TOPIC: 2,
            HIDDEN_FORUM: 4,
            HIDDEN_TOPIC: 8,
            OTHER: 16
        };
    }

    init(state) {
        this.parseUrl();
        this.computeCurrentPage(state);
        if (this.currentPage & (this.pages.JVC_FORUM | this.pages.HIDDEN_FORUM | this.pages.HIDDEN_TOPIC)) {
            this.parseForum();
        } else if (this.currentPage === this.pages.JVC_TOPIC) {
            this.parseTopic();
        }
    }

    parseUrl() {
        const matches = location.href.match(/^https:\/\/www\.jeuxvideo\.com\/(?:recherche\/)?forums\/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-.*\.htm/);
        if (matches === null) {
            throw new Error('Url mismatch');
        }

        this.forum.viewId = parseInt(matches[1]);
        this.forum.id = parseInt(matches[2]);
        this.topic.id = parseInt(matches[3]);
        this.topic.page = parseInt(matches[4]);
        this.forum.offset = parseInt(matches[6]);
    }

    computeCurrentPage(state) {
        if (state.hidden.enabled && state.hidden.view === 'list') {
            this.currentPage = this.pages.HIDDEN_FORUM;
        } else if (state.hidden.enabled && state.hidden.view === 'topic') {
            this.currentPage = this.pages.HIDDEN_TOPIC;
        } else if (this.forum.viewId === 42 || this.forum.viewId === 1) {
            this.currentPage = this.pages.JVC_TOPIC;
        } else if (this.forum.viewId === 0) {
            this.currentPage = this.pages.JVC_FORUM;
        } else {
            this.currentPage = this.pages.OTHER;
        }
    }

    parseForum() {
        this.forum.name = document.querySelector('h2.titre-bloc.titre-bloc-forum').textContent.trim().replace(/^Forum/, '').trim();
        const topics = document.querySelectorAll('.topic-list.topic-list-admin li[data-id]');
        for (const topic of topics) {
            let lastPostDate = null;
            const dateStr = topic.querySelector('.topic-date').textContent.trim();
            if (dateStr.includes('/')) {
                lastPostDate = parse(dateStr, 'dd/MM/yyyy', new Date(), { locale: fr });
            } else {
                lastPostDate = parse(dateStr, 'HH:mm:ss', new Date(), { locale: fr });
            }

            const topicImg = topic.querySelector('img.topic-img');
            const pinned = topicImg.src.includes('topic-marque-');
            const locked = topicImg.src.includes('topic-marque-off') || topicImg.src.includes('topic-lock');

            // duplicates
            const href = topic.querySelector('a.lien-jv.topic-title').href;
            const matches = href.match(/\/forums\/\d+-\d+-(\d+)-1-0-1-0-.*?.htm/);
            const id = parseInt(matches[1]);

            this.forum.topics.push({
                li: topic,
                id,
                title: topic.querySelector('a.topic-title').title,
                author: topic.querySelector('.topic-author').textContent.trim(),
                postCount: parseInt(topic.querySelector('span.topic-count').textContent),
                pinned,
                locked,
                lastPostDate
            });
        }
    }

    parseTopic() {
        this.topic.is410 = document.querySelector('img.img-erreur') !== null;
        if (this.is410) {
            return;
        }

        this.topic.isLocked = document.querySelector('.message-lock-topic') !== null;

        this.parseTopicLastPage();
        this.parseTopicMessages();
    }

    parseTopicLastPage() {
        this.topic.lastPage = this.topic.page;
        const lastPageButton = document.querySelector('.pagi-fin-actif');

        if (lastPageButton !== null) {
            const jvCare = lastPageButton.className.split(' ')[1];
            const url = decodeJvCare(jvCare);
            const matches = url.match(/\/forums\/\d+?-\d+?-\d+?-(\d+?)-.*$/);
            if (matches !== null) {
                this.topic.lastPage = parseInt(matches[1]);
            }
        }
    }

    parseTopicMessages() {
        const elements = document.querySelectorAll('.conteneur-messages-pagi .bloc-message-forum[data-id]');
        for (const element of elements) {
            const dateStr = element.querySelector('.bloc-date-msg').textContent.trim();
            this.topic.messages.push({
                id: element.dataset.id,
                username: element.querySelector('.bloc-pseudo-msg').textContent.trim(),
                htmlContent: element.querySelector('.txt-msg.text-enrichi-forum').innerHTML,
                creationDate: parse(dateStr, 'dd MMMM yyyy à HH:mm:ss', new Date(), { locale: fr }),
                element
            });
        }
    }

    async getNextPageFirstPostDate() {
        const nextPageurl = this.generateTopicUrl(this.topic.page + 1);
        const response = await fetch(nextPageurl);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const dateStr = doc.querySelector('.bloc-date-msg').textContent.trim();
        const date = parse(dateStr, 'dd MMMM yyyy à HH:mm:ss', new Date(), { locale: fr });
        return date;
    }

    generateTopicUrl(page) {
        return `https://www.jeuxvideo.com/forums/${this.forum.viewId}-${this.forum.id}-${this.topic.id}-${page}-0-1-0-0.htm`;
    }
}

export default new Runtime();
