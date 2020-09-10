import io from 'socket.io-client/dist/socket.io.slim.js';

import hiddenJVC from '../HiddenJVC.js';
import menuTemplate from '../views/menu.handlebars';

const { getState, setState } = hiddenJVC.storage;
const { postRequest } = hiddenJVC.helpers.network;
const { ErrorModal, MessageModal } = hiddenJVC.modals;
const { Runtime, Static: { JVC, Hidden } } = hiddenJVC.constants;

class HiddenMenu {
    constructor() {
        this.pages = 0;
    }

    async init(state) {
        const toggleButtonEnbaled = Runtime.currentPage === JVC.Pages.JVC_FORUM || Runtime.currentPage === JVC.Pages.HIDDEN_FORUM;

        const html = menuTemplate({ state, toggleButtonEnbaled });
        document.querySelector('#forum-right-col .panel.panel-jv-forum').insertAdjacentHTML('afterend', html);

        this.initUsersCount(state);
        if (toggleButtonEnbaled) {
            this.initToggle(state);
        }
        if (state.user.jwt === null) {
            this.initLogin();
        } else {
            this.initLogout();
        }
    }

    initToggle(state) {
        const toggleLink = document.querySelector('a#hidden-toggle');
        const toggleButton = toggleLink.querySelector('button');
        const url = `https://www.jeuxvideo.com/forums/0-${Runtime.forumId}-0-1-0-1-0-0.htm?hidden=${state.hidden.enabled ? 0 : 1}`;
        toggleLink.href = url;
        if (state.hidden.enabled) {
            toggleButton.classList.add('hidden-primary-color-bg');
            toggleButton.textContent = 'Activé';
        } else {
            toggleButton.classList.remove('hidden-primary-color-bg');
            toggleButton.textContent = 'Désactivé';
        }
    }

    initLogin() {
        const loginBtn = document.querySelector('#hidden-login');
        const registerBtn = document.querySelector('#hidden-register');

        loginBtn.addEventListener('click', async () => {
            const name = document.querySelector('input#hidden-name').value;
            const password = document.querySelector('input#hidden-password').value;

            try {
                const { jwt, userId, isAdmin, moderators, error } = await postRequest(Hidden.API_LOGIN, { name, password });
                if (jwt) {
                    const state = await getState();
                    state.user.jwt = jwt;
                    state.user.userId = userId;
                    state.user.isAdmin = isAdmin;
                    state.user.moderators = moderators;
                    state.user.registeredName = name;
                    await setState(state);
                    location.reload();
                } else if (error) {
                    MessageModal.create('Informations', 'Vos identifiants sont incorrects');
                }
            } catch (err) {
                console.error(err);
                ErrorModal(err.message);
            }
        });

        registerBtn.addEventListener('click', async () => {
            const name = document.querySelector('input#hidden-name').value;
            const password = document.querySelector('input#hidden-password').value;

            try {
                const { jwt, userId, error } = await postRequest(Hidden.API_REGISTER, { name, password });
                if (jwt) {
                    const state = await getState();
                    state.user.jwt = jwt;
                    state.user.userId = userId;
                    state.user.registeredName = name;
                    await setState(state);
                    location.reload();
                } else if (error) {
                    MessageModal.create('Informations', error);
                }
            } catch (err) {
                console.error(err);
                ErrorModal(err.message);
            }
        });

        const editNameBtn = document.querySelector('#hidden-edit-name');
        const displayName = document.querySelector('#hidden-display-name');
        const saveNameBtn = document.querySelector('#hidden-save-name');
        const nameInput = document.querySelector('#hidden-anonymous-name');

        editNameBtn.addEventListener('click', () => {
            displayName.style.display = 'none';
            editNameBtn.style.display = 'none';

            nameInput.style.display = 'block';
            saveNameBtn.style.display = 'block';
        });

        saveNameBtn.addEventListener('click', async () => {
            displayName.style.display = 'block';
            editNameBtn.style.display = 'block';

            nameInput.style.display = 'none';
            saveNameBtn.style.display = 'none';

            const name = nameInput.value;
            displayName.textContent = name;
            const state = await getState();
            state.user.anonymousName = name;
            await setState(state);
        });
    }

    initLogout() {
        const logoutBtn = document.querySelector('#hidden-logout');
        logoutBtn.addEventListener('click', async () => {
            const state = await getState();
            state.user.jwt = null;
            state.user.userId = null;
            state.user.isAdmin = false;
            state.user.moderators = [];
            state.user.registeredName = null;
            await setState(state);
            location.reload();
        });
    }

    initUsersCount(state) {
        const data = {
            forumId: Runtime.forumId,
            hidden: state.hidden.enabled
        };

        if (state.hidden.enabled && state.hidden.view === 'topic') {
            data.topicId = state.hidden.topic.id;
        } else if (Runtime.topicId !== 0) {
            data.topicId = Runtime.topicId;
        }

        const socket = io.connect(Hidden.SOCKET_URL, { transports: ['websocket'] });

        socket.on('connect', () => {
            socket.emit('get-users-count', data, (response) => {
                if (response && typeof response.forumCount === 'number') {
                    const countElement = document.querySelector('.nb-connect-fofo');
                    countElement.textContent = `${data.topicId ? response.topicCount : response.forumCount} connecté(s)`;
                }
            });
        });

        socket.on('connect_error', function (err) {
            console.error(err);
        });
    }
}

const hiddenMenu = new HiddenMenu();
hiddenJVC.registerModule(hiddenMenu);
