import { jvc, hidden } from '../constants';
import pageInfo from './PageInfo.js';
import { getRequest } from '../helpers/network.js';
import { getState } from '../../helpers/storage';
import topicsTemplate from '../views/topic/topic.handlebars';

class HiddenTopic {
    async init() {
        if (pageInfo.currentPage !== jvc.pages.HIDDEN_TOPIC) {
            return;
        }

        try {
            const state = await getState();
            const { topic, count } = await getRequest(`${hidden.API_TOPICS}/${state.hidden.topic.id}`);
            console.log(topic);
            const page = state.hidden.topic.page;
            const lastPage = Math.ceil(count / 20);
            const html = topicsTemplate({ topic, page, lastPage });
            document.querySelector('#forum-main-col').innerHTML = html;
        } catch (err) {
            console.error(err);
        }
    }
}

export default new HiddenTopic();
