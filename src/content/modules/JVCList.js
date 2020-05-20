import { Hidden } from '../constants';
import { getRequest } from '../helpers/network.js';

class HiddenList {
    async init() {
        const topicRows = document.querySelectorAll('ul.topic-list li[data-id]');
        const topicIds = Array.prototype.map.call(topicRows, (row) => row.dataset.id);

        const { topics } = await getRequest(Hidden.API_JVC_TOPICS, { topicIds });
        for (const row of topicRows) {
            const id = parseInt(row.dataset.id);
            for (const topic of topics) {
                if (topic.Topic.Id === id) {
                    row.querySelector('span.topic-subject').style.borderLeft = '5px solid #083193';
                }
            }
        }
    }
}

export default new HiddenList();
