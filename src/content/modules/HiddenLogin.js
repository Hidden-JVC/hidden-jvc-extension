import { postRequest } from '../helpers/network.js';
import loginTemplate from '../views/loginPanel.handlebars';
import { getState, setState } from '../../helpers/storage.js';
import { API_LOGIN, API_REGISTER } from '../constants/Hidden';

class HiddenToggler {
    async init(state) {
        const toggleUrl = `${location.href}?hidden=${state.hidden.enabled ? 0 : 1}`;
        const html = loginTemplate({ state, toggleUrl });
        document.querySelector('#forum-right-col .panel.panel-jv-forum').insertAdjacentHTML('afterend', html);

        if (state.user.jwt === null) {
            this.initLogin();
        } else {
            this.initLogout();
        }
    }

    initLogin() {
        const loginBtn = document.querySelector('#hidden-login');
        const registerBtn = document.querySelector('#hidden-register');
        const saveNameBtn = document.querySelector('#hidden-save-name');

        loginBtn.addEventListener('click', async () => {
            const name = document.querySelector('input#hidden-name').value;
            const password = document.querySelector('input#hidden-password').value;

            const { jwt } = await postRequest(API_LOGIN, { name, password });
            if (jwt) {
                const state = await getState();
                state.user.jwt = jwt;
                state.user.name = name;
                await setState(state);
                location.reload();
            }
        });

        registerBtn.addEventListener('click', async () => {
            const name = document.querySelector('input#hidden-name').value;
            const password = document.querySelector('input#hidden-password').value;

            const { jwt } = await postRequest(API_REGISTER, { name, password });
            if (jwt) {
                const state = await getState();
                state.user.jwt = jwt;
                state.user.name = name;
                await setState(state);
                location.reload();
            }
        });

        saveNameBtn.addEventListener('click', async () => {
            const name = document.querySelector('input#hidden-anonymous-name').value;
            const state = await getState();
            state.user.name = name;
            await setState(state);
        });
    }

    initLogout() {
        const logoutBtn = document.querySelector('#hidden-logout');
        logoutBtn.addEventListener('click', async () => {
            const state = await getState();
            state.user.jwt = null;
            await setState(state);
            location.reload();
        });
    }
}

export default new HiddenToggler();
