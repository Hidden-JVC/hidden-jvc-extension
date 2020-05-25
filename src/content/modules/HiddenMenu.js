import hiddenJVC from '../HiddenJVC.js';

const { views } = hiddenJVC;
const { Hidden } = hiddenJVC.constants.Static;
const { getState, setState } = hiddenJVC.storage;
const { postRequest } = hiddenJVC.helpers.network;

class HiddenMenu {
    constructor() {
        this.pages = 0;
    }

    async init(state) {
        const html = views.menu({ state });
        document.querySelector('#forum-right-col .panel.panel-jv-forum').insertAdjacentHTML('afterend', html);

        this.initToggle(state);
        if (state.user.jwt === null) {
            this.initLogin();
        } else {
            this.initLogout();
        }
    }

    initToggle(state) {
        const toggleLink = document.querySelector('a#hidden-toggle');
        const toggleButton = toggleLink.querySelector('button');
        toggleLink.href = `${location.href}?hidden=${state.hidden.enabled ? 0 : 1}`;
        if (state.hidden.enabled) {
            toggleButton.style.backgroundColor = '#c85025';
            toggleButton.textContent = state.hidden.enabled = 'Activé';
        } else {
            toggleButton.textContent = state.hidden.enabled = 'Désactivé';
        }
    }

    initLogin() {
        const loginBtn = document.querySelector('#hidden-login');
        const registerBtn = document.querySelector('#hidden-register');
        const saveNameBtn = document.querySelector('#hidden-save-name');

        loginBtn.addEventListener('click', async () => {
            const name = document.querySelector('input#hidden-name').value;
            const password = document.querySelector('input#hidden-password').value;

            const { jwt } = await postRequest(Hidden.API_LOGIN, { name, password });
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

            const { jwt } = await postRequest(Hidden.API_REGISTER, { name, password });
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

const hiddenMenu = new HiddenMenu();
hiddenJVC.registerModule(hiddenMenu);
