import { formatISO9075, isAfter } from 'date-fns';

import hiddenJVC from '../HiddenJVC.js';

const { views } = hiddenJVC;
const { Runtime } = hiddenJVC.constants;
const { getRequest } = hiddenJVC.helpers.network;
const { JVC, Hidden } = hiddenJVC.constants.Static;

class JVCForum {
    constructor() {
        this.pages = JVC.Pages.JVC_FORUM;
    }

    async init() {
        await this.initJVCTopics();
        await this.initHiddenJVCTopics();
    }

    /**
     * Checks if any of the current jvc topics contains at least one hidden topic
     */
    async initJVCTopics() {
        const topicIds = Runtime.forumTopics.map((t) => t.id);

        const { topics } = await getRequest(Hidden.API_JVC_TOPICS, { topicIds });

        for (const jvcTopic of Runtime.forumTopics) {
            for (const hiddenTopic of topics) {
                if (hiddenTopic.Topic.Id === jvcTopic.id) {
                    jvcTopic.li.classList.add('hidden-topic-count-highlight');
                }
            }
        }
    }

    /**
     * Retrieve all hidden topics that can be inserted within the current jvc topics
     */
    async initHiddenJVCTopics() {
        const query = { forumId: Runtime.forumId };

        const jvcTopics = Runtime.forumTopics.filter((t) => !t.pinned);
        const { startDate, endDate } = this.getDateRange(jvcTopics);

        if (startDate !== null) {
            query.startDate = formatISO9075(startDate);
        }
        if (endDate !== null) {
            query.endDate = formatISO9075(endDate);
        }

        const { topics } = await getRequest(Hidden.API_HIDDEN_TOPICS, query);
        console.log(topics);

        for (const topic of topics) {
            topic.Url = `http://www.jeuxvideo.com/forums/0-${Runtime.forumId}-0-1-0-1-0-0.htm?hidden=1&view=topic&topicId=${topic.Topic.Id}&topicPage=1`;
        }

        const displaySelect = document.querySelector('.topic-select') !== null;

        for (const hiddenTopic of topics) {
            const hiddenDate = new Date(hiddenTopic.LastPostDate);
            for (const jvcTopic of jvcTopics) {
                if (isAfter(hiddenDate, jvcTopic.lastPostDate)) {
                    const html = views.forum.row({ topic: hiddenTopic, displaySelect });
                    jvcTopic.li.insertAdjacentHTML('beforebegin', html);
                    break;
                }
            }
        }
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
