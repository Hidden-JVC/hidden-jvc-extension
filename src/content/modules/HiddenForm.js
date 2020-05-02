import { getState } from '../../helpers/storage';

class HiddenForm {
    async init() {
        const state = await getState();
        if (!state.hidden.enabled) {
            return;
        }

        const form = document.querySelector('#bloc-formulaire-forum');
        console.log(form);
    }
}

export default new HiddenForm();
