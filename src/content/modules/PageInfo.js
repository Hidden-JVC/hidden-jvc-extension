import { jvc } from '../constants';

class PageInfo {
    constructor() {
        this.currentPage = null;

        this.jvc = {
            forumId: null,
            topic: null,
            list: null
        };

        this.hidden = {
            topic: null,
            list: null
        };
    }

    async init(state) {
        this.currentPage = jvc.pages.OTHER;
        const matches = location.href.match(/^http:\/\/www\.jeuxvideo\.com\/forums\/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-.*\.htm$/);
        if (matches === null) {
            return;
        }

        const [, pageType, forumId] = matches;
        this.jvc.forumId = forumId;
        this.jvc.forumName = document.querySelector('h2.titre-bloc.titre-bloc-forum').textContent.trim();

        if (pageType === '42') {
            this.currentPage = jvc.pages.JVC_TOPIC;
            this.jvc.topic = {
                topicId: parseInt(matches[3]),
                page: parseInt(matches[4])
            };
        } else if (pageType === '0') {
            this.currentPage = jvc.pages.JVC_LIST;
            this.jvc.list = {
                offset: parseInt(matches[6])
            };
        }

        if (state.hidden.enabled && state.hidden.view === 'list') {
            this.currentPage = jvc.pages.HIDDEN_LIST;
        } else if (state.hidden.enabled && state.hidden.view === 'topic') {
            this.currentPage = jvc.pages.HIDDEN_TOPIC;
        }

    }
}

export default new PageInfo();
