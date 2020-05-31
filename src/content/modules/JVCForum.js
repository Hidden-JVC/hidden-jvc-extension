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

    async initJVCTopics() {
        // Retrieve all jvc topics ids from the list
        const topicIds = Runtime.forumTopics.map((t) => t.id);

        // From that list of ids, fetch all the topic that contains at least one hidden post
        const { topics } = await getRequest(Hidden.API_JVC_TOPICS, { topicIds });

        // Highlight them
        for (const row of Runtime.forumTopics) {
            const id = row.id;
            for (const topic of topics) {
                if (topic.Topic.Id === id) {
                    // row.li.querySelector('span.topic-subject').style.border = '3px solid var(--hidden-primary-color)';
                    for (const child of row.li.children) {
                        child.style.borderTop = '3px solid var(--hidden-primary-color)';
                        child.style.borderBottom = '3px solid var(--hidden-primary-color)';
                    }
                }
            }
        }
    }

    async initHiddenJVCTopics() {
        const query = {
            forumId: Runtime.forumId
        };
        const { startDate, endDate } = this.getDateRange();
        if (startDate !== null) {
            query.startDate = formatISO9075(startDate);
        }
        if (endDate !== null) {
            query.endDate = formatISO9075(endDate);
        }

        const { topics } = await getRequest(Hidden.API_HIDDEN_TOPICS, query);
        const unlockedTopics = Runtime.forumTopics.filter((t) => !t.pinned);
        for (const hiddenTopic of topics) {
            const hiddenDate = new Date(hiddenTopic.LastPostDate);
            for (const jvcTopic of unlockedTopics) {
                if (isAfter(hiddenDate, jvcTopic.lastPostDate)) {
                    const html = views.forum.row(hiddenTopic);
                    jvcTopic.li.insertAdjacentHTML('beforebegin', html);
                    break;
                }
            }
        }
    }

    getDateRange() {
        let startDate = null;
        let endDate = null;

        const unlockedTopics = Runtime.forumTopics.filter((t) => !t.pinned);

        if (unlockedTopics.length > 2) {
            startDate = unlockedTopics[0].lastPostDate;
            endDate = unlockedTopics[unlockedTopics.length - 1].lastPostDate;
        }

        if (Runtime.forumOffset === 1) {
            startDate = null;
        }

        return { startDate, endDate };
    }
}

const jvcForum = new JVCForum();
hiddenJVC.registerModule(jvcForum);
