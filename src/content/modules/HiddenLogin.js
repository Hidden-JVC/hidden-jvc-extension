import { API_LOGIN, API_REGISTER } from '../constants/hidden';
import { postRequest } from '../helpers/network.js';
import loginTemplate from '../views/loginPanel.handlebars';
import { getState, setState } from '../../helpers/storage.js';

class HiddenToggler {
    async init() {
        const state = await getState();

        const html = loginTemplate({ state });
        document.querySelector('#forum-right-col .panel.panel-jv-forum').insertAdjacentHTML('afterend', html);

        if (state.user.jwt === null) {
            this.initLogin();
        } else {
            this.initLogout();
        }
    }

    initLogin() {
        const loginBtn = document.querySelector('#hidden-login');
        const register = document.querySelector('#hidden-register');

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

        register.addEventListener('click', async () => {
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
