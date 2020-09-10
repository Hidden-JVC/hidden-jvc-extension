import { formatISO9075, isAfter } from 'date-fns';

import hiddenJVC from '../HiddenJVC.js';

import rowTemplate from '../views/jvc/forum/row.handlebars';

const { Runtime } = hiddenJVC.constants;
const { getRequest } = hiddenJVC.helpers.network;
const { JVC, Hidden } = hiddenJVC.constants.Static;

class JVCForum {
    constructor() {
        this.pages = JVC.Pages.JVC_FORUM;
    }

    init() {
        this.initJVCTopics();
        this.initHiddenTopicsPinned();
        this.initHiddenTopics();
    }

    /**
     * Checks if any of the current jvc topics contains at least one hidden post
     */
    async initJVCTopics() {
        const topicIds = Runtime.forumTopics.map((t) => t.id);

        const { topics } = await getRequest(Hidden.API_JVC_TOPICS, { topicIds });

        for (const jvcTopic of Runtime.forumTopics) {
            for (const hiddenTopic of topics) {
                if (hiddenTopic.Topic.Id === jvcTopic.id) {
                    jvcTopic.li.classList.add('jvc-topic-contains-hidden-post');
                    jvcTopic.li.querySelector('.topic-count').innerHTML = `<span style="color: green"> ${hiddenTopic.PostsCount} </span> / ${jvcTopic.postCount}`;
                }
            }
        }
    }

    async initHiddenTopicsPinned() {
        if (Runtime.forumOffset !== 1) {
            return;
        }
        const hiddenTopics = await this.getHiddenTopicsPinned();
        const pinnedJvcTopics = Runtime.forumTopics.filter((t) => t.pinned);
        const displaySelect = document.querySelector('.topic-select') !== null;

        if (pinnedJvcTopics.length === 0) {
            const jvcTopic = Runtime.forumTopics[0];

            for (const hiddenTopic of hiddenTopics) {
                const html = rowTemplate({ topic: hiddenTopic, displaySelect });
                jvcTopic.li.insertAdjacentHTML('beforebegin', html);
            }
        } else {
            for (const hiddenTopic of hiddenTopics) {
                const hiddenDate = new Date(hiddenTopic.LastPostDate);
                for (const jvcTopic of pinnedJvcTopics) {
                    if (isAfter(hiddenDate, jvcTopic.lastPostDate)) {
                        const html = rowTemplate({ topic: hiddenTopic, displaySelect });
                        jvcTopic.li.insertAdjacentHTML('beforebegin', html);
                        break;
                    }
                }
            }
        }
    }

    /**
     * Retrieve all the hidden topics that can be inserted between the current jvc topics
     */
    async initHiddenTopics() {
        const jvcTopics = Runtime.forumTopics.filter((t) => !t.pinned);
        const topics = await this.getHiddenTopics();

        for (const topic of topics) {
            topic.Url = `https://www.jeuxvideo.com/forums/0-${Runtime.forumId}-0-1-0-1-0-0.htm?hidden=1&view=topic&topicId=${topic.Topic.Id}&topicPage=1`;
        }

        const displaySelect = document.querySelector('.topic-select') !== null;

        for (const hiddenTopic of topics) {
            const hiddenDate = new Date(hiddenTopic.LastPostDate);
            for (const jvcTopic of jvcTopics) {
                if (isAfter(hiddenDate, jvcTopic.lastPostDate)) {
                    const html = rowTemplate({ topic: hiddenTopic, displaySelect });
                    jvcTopic.li.insertAdjacentHTML('beforebegin', html);
                    break;
                }
            }
        }
    }

    async getHiddenTopicsPinned() {
        const query = { forumId: Runtime.forumId, pinned: 1 };
        const { topics } = await getRequest(Hidden.API_HIDDEN_TOPICS, query);
        return topics;
    }

    async getHiddenTopics() {
        const query = { forumId: Runtime.forumId, pinned: 0 };

        const jvcTopics = Runtime.forumTopics.filter((t) => !t.pinned);
        const { startDate, endDate } = this.getDateRange(jvcTopics);

        if (startDate !== null) {
            query.startDate = formatISO9075(startDate);
        }
        if (endDate !== null) {
            query.endDate = formatISO9075(endDate);
        }

        const { topics } = await getRequest(Hidden.API_HIDDEN_TOPICS, query);

        return topics;
    }

    getDateRange(topics) {
        let startDate = null;
        let endDate = null;

        if (topics.length > 2) {
            startDate = topics[0].lastPostDate;
            endDate = topics[topics.length - 1].lastPostDate;
        }

        if (Runtime.forumOffset === 1) {
            startDate = null;
        }

        return { startDate, endDate };
    }
}

const jvcForum = new JVCForum();
hiddenJVC.registerModule(jvcForum);
