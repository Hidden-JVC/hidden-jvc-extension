import pageInfo from './PageInfo.js';
import { jvc, hidden } from '../constants';
import { getRequest } from '../helpers/network.js';

class HiddenList {
    async init() {
        if (pageInfo.currentPage !== jvc.pages.JVC_LIST) {
            return;
        }

        const topicElements = document.querySelectorAll('ul.topic-list.topic-list-admin li[data-id]');

        const topicIds = [];
        for (const topicElement of topicElements) {
            topicIds.push(topicElement.dataset.id);
        }

        const { topics } = await getRequest(hidden.API_JVC_TOPICS, { topicIds: topicIds.join(',') });
        for (const topicElement of topicElements) {
            const id = parseInt(topicElement.dataset.id);
            for (const topic of topics) {
                if (topic.Topic.Id === id) {
                    topicElement.querySelector('span.topic-subject').style.borderLeft = '5px solid #083193';
                }
            }
        }
    }
}

export default new HiddenList();
