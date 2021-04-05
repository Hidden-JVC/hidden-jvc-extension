import { formatISO9075, isAfter } from 'date-fns';

import hiddenJVC from '../HiddenJVC.js';

import rowTemplate from '../views/jvc/forum/row.handlebars';

import events from '../events.js';
import runtime from '../runtime.js';
import * as network from '../network.js';
import { JVC, Hidden } from '../constants';

class JVCForum {
    constructor() {
        this.pages = JVC.Pages.JVC_FORUM;

        this.forum = null;
        this.jvcTopics = null;
        this.hiddenPinnedTopics = null;
        this.hiddenTopics = null;
    }

    async init() {
        await this.getForum();
        this.initJVCTopics();
        this.initHiddenTopicsPinned();
    }

    async getForum() {
        try {
            const start = performance.now();
            const query = { forumId: runtime.forum.id };

            const topics = runtime.forum.topics.filter((t) => !t.pinned);
            const { startDate, endDate } = this.getDateRange(topics);

            if (startDate !== null) {
                query.startDate = formatISO9075(startDate);
            }
            if (endDate !== null) {
                query.endDate = formatISO9075(endDate);
            }
            const topicIds = runtime.forum.topics.map((t) => t.id);
            if (topicIds.length > 0) {
                query.topicIds = topicIds;
            }

            const url = `${Hidden.API_URL}/jvc/forums/${runtime.forum.id}`;
            const { forum, jvcTopics, hiddenPinnedTopics, hiddenTopics, error } = await network.getRequest(url, query);

            this.forum = forum;
            this.jvcTopics = jvcTopics;
            this.hiddenPinnedTopics = hiddenPinnedTopics;
            this.hiddenTopics = hiddenTopics;

            if (error) {
                return events.emit('add-log', 'error', error);
            }
            const end = performance.now();
            events.emit('add-log', 'info', `Topic JVC récupéré en ${((end - start) / 1000).toFixed(2)} secondes`);
        } catch (err) {
            events.emit('add-log', 'error', err.message);
        }
    }

    initJVCTopics() {
        try {
            for (const jvcTopic of runtime.forum.topics) {
                for (const hiddenTopic of this.jvcTopics) {
                    if (hiddenTopic.Id === jvcTopic.id) {
                        jvcTopic.li.classList.add('jvc-topic-contains-hidden-post');
                        jvcTopic.li.querySelector('.topic-count').innerHTML = `<span style="color: green"> ${hiddenTopic.PostCount} </span> / ${jvcTopic.postCount}`;
                    }
                }
            }
        } catch (err) {
            console.error(err);
            events.emit('add-log', 'error', err.message);
        }
    }

    initHiddenTopicsPinned() {
        // only on first page
        if (runtime.forum.offset !== 1) {
            return;
        }
        const pinnedJvcTopics = runtime.forum.topics.filter((t) => t.pinned);
        const displaySelect = document.querySelector('.topic-select') !== null;

        for (const topic of this.hiddenPinnedTopics) {
            topic.Url = `https://www.jeuxvideo.com/forums/0-${runtime.forum.id}-0-1-0-1-0-0.htm#1-topic-${topic.Id}-1`;
        }

        if (pinnedJvcTopics.length === 0) {
            const jvcTopic = runtime.forum.topics[0];

            for (const hiddenTopic of this.hiddenPinnedTopics) {
                const html = rowTemplate({ topic: hiddenTopic, displaySelect });
                jvcTopic.li.insertAdjacentHTML('beforebegin', html);
            }
        } else {
            for (const hiddenTopic of this.hiddenPinnedTopics) {
                const hiddenDate = new Date(hiddenTopic.LastPostCreationDate);
                for (const jvcTopic of pinnedJvcTopics) {
                    if (isAfter(hiddenDate, jvcTopic.lastPostDate)) {
                        const html = rowTemplate({ topic: hiddenTopic, displaySelect });
                        jvcTopic.li.insertAdjacentHTML('beforebegin', html);
                        break;
                    }
                }
            }
        }

        /* eslint-disable-next-line no-undef */
        // if (process.env.HIDDEN_ENV === 'userscript') {
        //     document.querySelectorAll('a.hidden-link').forEach((anchor) => {
        //         anchor.addEventListener('click', async (e) => {
        //             await processHiddenUrl(anchor.href);
        //             // e.preventDefault();
        //             // console.log(anchor.href);
        //             // location.href = anchor.href;
        //             // window.open(anchor.href, '_self');
        //             // history.pushState({}, '', anchor.href);
        //             // location.reload();
        //         });
        //     });
        // }
    }

    // async initHiddenTopics() {
    //     const jvcTopics = runtime.forum.topics.filter((t) => !t.pinned);
    //     const topics = await this.getHiddenTopics();

    //     for (const topic of topics) {
    //         topic.Url = `https://www.jeuxvideo.com/forums/0-${Runtime.forumId}-0-1-0-1-0-0.htm?hidden=1&view=topic&topicId=${topic.Topic.Id}&topicPage=1`;
    //     }

    //     const displaySelect = document.querySelector('.topic-select') !== null;

    //     for (const hiddenTopic of topics) {
    //         const hiddenDate = new Date(hiddenTopic.LastPostDate);
    //         for (const jvcTopic of jvcTopics) {
    //             if (isAfter(hiddenDate, jvcTopic.lastPostDate)) {
    //                 const html = rowTemplate({ topic: hiddenTopic, displaySelect });
    //                 jvcTopic.li.insertAdjacentHTML('beforebegin', html);
    //                 break;
    //             }
    //         }
    //     }
    // }

    getDateRange(topics) {
        let startDate = null;
        let endDate = null;

        if (topics.length > 2) {
            startDate = topics[0].lastPostDate;
            endDate = topics[topics.length - 1].lastPostDate;
        }

        if (runtime.forum.offset === 1) {
            startDate = null;
        }

        return { startDate, endDate };
    }
}

const jvcForum = new JVCForum();
hiddenJVC.registerModule(jvcForum);
