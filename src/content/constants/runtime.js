import { parse } from 'date-fns';
import { fr } from 'date-fns/locale';

import { JVC } from './static';

class RuntimeConstants {
    constructor() {
        this.currentPage = null;
        this.viewId = null;
        this.forumId = null;
        this.topicId = null;
        this.topicPage = null;
        this.forumOffset = null;

        this.is410 = null;
        this.forumName = null;
        this.forumTopics = [];
        this.topicTitle = null;
        this.topicLastPage = null;
        this.topicMessages = [];
    }

    init(state) {
        this.parseUrl();
        this.computeCurrentPage(state);
        if (this.currentPage & (JVC.Pages.JVC_FORUM | JVC.Pages.HIDDEN_FORUM | JVC.Pages.HIDDEN_TOPIC)) {
            this.parseForum();
        } else if (this.currentPage === JVC.Pages.JVC_TOPIC) {
            this.parseTopic();
        }

        const baseUrl = `${location.origin}${location.pathname}`;
        const queryAndHash = location.href.replace(baseUrl, '').replace('?', '');
        const [originalQueryStr, hash] = queryAndHash.split('#');

        const query = new URLSearchParams(originalQueryStr);

        if (state.hidden.enabled) {
            query.set('hidden', '1');
            query.set('view', state.hidden.view);
            if (state.hidden.view === 'list') {
                query.set('listPage', state.hidden.list.page);
            } else if (state.hidden.view === 'topic') {
                query.set('topicId', state.hidden.topic.id);
                query.set('topicPage', state.hidden.topic.page);
            }
        } else {
            query.set('hidden', '0');
        }

        let queryStr = '';
        if (query.toString().length > 0) {
            queryStr = `?${query.toString()}`;
        }
        let hashStr = '';
        if (typeof hash === 'string') {
            hashStr = `#${hash}`;
        }
        const url = `${baseUrl}${queryStr}${hashStr}`;
        history.replaceState(null, '', url);
    }

    parseUrl() {
        const matches = location.href.match(/^https:\/\/www\.jeuxvideo\.com\/(?:recherche\/)?forums\/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-.*\.htm/);
        if (matches === null) {
            throw new Error('Url mismatch');
        }

        this.viewId = parseInt(matches[1]);
        this.forumId = parseInt(matches[2]);
        this.topicId = parseInt(matches[3]);
        this.topicPage = parseInt(matches[4]);
        this.forumOffset = parseInt(matches[6]);
    }

    computeCurrentPage(state) {
        if (state.hidden.enabled && state.hidden.view === 'list') {
            this.currentPage = JVC.Pages.HIDDEN_FORUM;
        } else if (state.hidden.enabled && state.hidden.view === 'topic') {
            this.currentPage = JVC.Pages.HIDDEN_TOPIC;
        } else if (this.viewId === 42 || this.viewId === 1) {
            this.currentPage = JVC.Pages.JVC_TOPIC;
        } else if (this.viewId === 0) {
            this.currentPage = JVC.Pages.JVC_FORUM;
        } else {
            this.currentPage = JVC.Pages.OTHER;
        }
    }

    parseForum() {
        this.forumName = document.querySelector('h2.titre-bloc.titre-bloc-forum').textContent.trim().replace(/^Forum/, '').trim();

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

            this.forumTopics.push({
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
        this.is410 = document.querySelector('img.img-erreur') !== null;
        if (this.is410) {
            return;
        }

        this.topicTitle = document.querySelector('span#bloc-title-forum').textContent.trim();

        this.parseTopicName();
        this.parseTopicLastPage();
        this.parseTopicMessages();
    }

    parseTopicName() {
        const breadcrumbs = document.querySelectorAll('.fil-ariane-crumb span');
        for (let i = 0; i < breadcrumbs.length - 1; i++) {
            const text = breadcrumbs[i].textContent.trim();
            if (/^Tous les forums$/.test(text)) {
                this.forumName = breadcrumbs[i + 1].textContent.trim().replace(/^Forum/, '').trim();
                break;
            }
        }
    }

    parseTopicLastPage() {
        this.topicLastPage = this.topicPage;
        const lastPageButton = document.querySelector('.pagi-fin-actif');

        if (lastPageButton !== null) {
            const url = lastPageButton.href;
            const matches = url.match(/^https:\/\/www\.jeuxvideo\.com\/forums\/\d+?-\d+?-\d+?-(\d+?)-.*$/);
            if (matches !== null) {
                this.topicLastPage = parseInt(matches[1]);
            }
        }
    }

    parseTopicMessages() {
        const elements = document.querySelectorAll('.conteneur-messages-pagi .bloc-message-forum[data-id]');
        for (const element of elements) {
            const dateStr = element.querySelector('.bloc-date-msg').textContent.trim();
            this.topicMessages.push({
                id: element.dataset.id,
                username: element.querySelector('.bloc-pseudo-msg').textContent.trim(),
                htmlContent: element.querySelector('.txt-msg.text-enrichi-forum').innerHTML,
                creationDate: parse(dateStr, 'dd MMMM yyyy à HH:mm:ss', new Date(), { locale: fr }),
                element
            });
        }
    }

    async getNextPageFirstPostDate() {
        const nextPageurl = this.generateTopicUrl(this.topicPage + 1);
        const response = await fetch(nextPageurl);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const dateStr = doc.querySelector('.bloc-date-msg').textContent.trim();
        const date = parse(dateStr, 'dd MMMM yyyy à HH:mm:ss', new Date(), { locale: fr });
        return date;
    }

    generateTopicUrl(page) {
        return `https://www.jeuxvideo.com/forums/${this.viewId}-${this.forumId}-${this.topicId}-${page}-0-1-0-0.htm`;
    }
}

export default new RuntimeConstants();
