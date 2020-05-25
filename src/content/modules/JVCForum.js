import hiddenJVC from '../HiddenJVC.js';

const { getRequest } = hiddenJVC.helpers.network;
const { JVC, Hidden } = hiddenJVC.constants.Static;

class JVCForum {
    constructor() {
        this.pages = JVC.Pages.JVC_FORUM;
    }

    async init() {
        // Retrieve all jvc topics ids from the list
        const topicRows = document.querySelectorAll('ul.topic-list li[data-id]');
        const topicIds = Array.prototype.map.call(topicRows, (row) => row.dataset.id);

        // From that list of ids, fetch all the topic that contains at least one hidden post
        const { topics } = await getRequest(Hidden.API_JVC_TOPICS, { topicIds });

        // Highlight them
        for (const row of topicRows) {
            const id = parseInt(row.dataset.id);
            for (const topic of topics) {
                if (topic.Topic.Id === id) {
                    row.querySelector('img.topic-img').style.boxShadow = '0px 0px 0px 3px rgba(8,49,147,1)';
                }
            }
        }
    }
}

const jvcForum = new JVCForum();
hiddenJVC.registerModule(jvcForum);
