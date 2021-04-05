import { getState, setState } from '../storage.js';

export default async function (url) {
    const index = url.indexOf('?');
    const state = await getState();
    if (index > -1) {
        const query = new URLSearchParams(url.substring(index + 1));

        if (query.has('hidden')) {
            state.hidden.enabled = query.get('hidden') === '1';
        } else {
            state.hidden.enabled = false;
        }

        if (query.has('view') && ['list', 'topic'].includes(query.get('view'))) {
            state.hidden.view = query.get('view');
        }

        if (query.has('listPage')) {
            state.hidden.list.page = isNaN(query.get('listPage')) ? 1 : parseInt(query.get('listPage'));
        }

        if (query.has('topicId')) {
            state.hidden.topic.id = isNaN(query.get('topicId')) ? 1 : parseInt(query.get('topicId'));
        }

        if (query.has('topicPage')) {
            state.hidden.topic.page = isNaN(query.get('topicPage')) ? 1 : parseInt(query.get('topicPage'));
        }

        if (query.has('topicUserId')) {
            if (query.get('topicUserId') === 'null') {
                state.hidden.topic.userId = null;
            } else {
                state.hidden.topic.userId = isNaN(query.get('topicUserId')) ? 1 : parseInt(query.get('topicUserId'));
            }
        }
    } else {
        state.hidden.enabled = false;
    }
    await setState(state);
}
