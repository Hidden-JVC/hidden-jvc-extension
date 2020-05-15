import { parse } from 'date-fns';
import { fr } from 'date-fns/locale';

class JVCTopic {
    constructor() {
        this.id = null;
        this.viewId = null;
        this.title = null;
        this.page = null;
        this.lastPage = null;
        this.posts = null;

        this.forumId = null;
        this.forumName = null;
    }

    async init() {
        const matches = location.href.match(/^http:\/\/www\.jeuxvideo\.com\/forums\/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-.*\.htm(?:#.*?)?$/);
        if (matches === null) {
            throw new Error('Format d\'url inconnu');
        }

        this.viewId = parseInt(matches[1]);
        this.forumId = parseInt(matches[2]);
        this.id = parseInt(matches[3]);
        this.page = parseInt(matches[4]);

        this.title = document.querySelector('.titre-bloc.titre-bloc-forum').textContent.replace(/Sujet\s*:/, '').trim();
        this.forumName = document.querySelectorAll('.fil-ariane-crumb span')[2].textContent.replace('Forum', '').trim();

        this.posts = parsePosts();
        this.lastPage = getLastPage(this.page);
    }

    async getNextPageFirstPostDate() {
        const nextPageurl = `http://www.jeuxvideo.com/forums/${this.viewId}-${this.forumId}-${this.id}-${this.page + 1}-0-1-0-0.htm`;
        const response = await fetch(nextPageurl);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const dateStr = doc.querySelector('.bloc-date-msg').textContent.trim();
        const date = parse(dateStr, 'dd MMMM yyyy à HH:mm:ss', new Date(), { locale: fr });
        return date;
    }
}

export default new JVCTopic();

function parsePosts() {
    const messages = [];

    const elements = document.querySelectorAll('.conteneur-messages-pagi .bloc-message-forum[data-id]');
    for (const element of elements) {
        const dateStr = element.querySelector('.bloc-date-msg').textContent.trim();
        messages.push({
            id: element.dataset.id,
            username: element.querySelector('.bloc-pseudo-msg').textContent.trim(),
            htmlContent: element.querySelector('.txt-msg.text-enrichi-forum').innerHTML,
            creationDate: parse(dateStr, 'dd MMMM yyyy à HH:mm:ss', new Date(), { locale: fr }),
            element
        });
    }

    return messages;
}

function getLastPage(page) {
    let lastPage = page;
    const lastPageButton = document.querySelector('.pagi-fin-actif');

    if (lastPageButton !== null) {
        const url = lastPageButton.href;
        const matches = url.match(/^http:\/\/www\.jeuxvideo\.com\/forums\/\d+?-\d+?-\d+?-(\d+?)-.*$/);
        if (matches !== null) {
            lastPage = parseInt(matches[1]);
        }
    }

    return lastPage;
}
