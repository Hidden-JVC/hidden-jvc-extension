import io from 'socket.io-client/dist/socket.io.slim.js';

import hiddenJVC from '../HiddenJVC.js';
import menuTemplate from '../views/menu.handlebars';

import events from '../events.js';
import runtime from '../runtime.js';
import * as network from '../network.js';
import { JVC, Hidden } from '../constants';
import { getState, setState } from '../storage.js';

class HiddenMenu {
    constructor() {
        this.pages = 0;
    }

    async init(state) {
        const toggleButtonEnbaled = runtime.currentPage === JVC.Pages.JVC_FORUM || runtime.currentPage === JVC.Pages.HIDDEN_FORUM;

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
        const url = `https://www.jeuxvideo.com/forums/0-${runtime.forumId}-0-1-0-1-0-0.htm?hidden=${state.hidden.enabled ? 0 : 1}`;
        toggleLink.href = url;
        if (state.hidden.enabled) {
            toggleButton.classList.add('hidden-primary-color-bg');
            toggleButton.textContent = 'Vers JVC';
        } else {
            toggleButton.classList.remove('hidden-primary-color-bg');
            toggleButton.textContent = 'Vers Hidden JVC';
        }

        // /* eslint-disable-next-line no-undef */
        // if (process.env.HIDDEN_ENV === 'userscript') {
        //     toggleLink.addEventListener('click', async (e) => {
        //         e.preventDefault();
        //         await processHiddenUrl(toggleLink.href);
        //         location.reload();
        //     });
        // }
    }

    initLogin() {
        const loginBtn = document.querySelector('#hidden-login');
        const registerBtn = document.querySelector('#hidden-register');

        loginBtn.addEventListener('click', async () => {
            const name = document.querySelector('input#hidden-name').value;
            const password = document.querySelector('input#hidden-password').value;

            try {
                const url = `${Hidden.API_URL}/users/login`;
                const { jwt, userId, isAdmin, moderators, error } = await network.postRequest(url, { name, password });
                if (error) {
                    events.emit('add-log', 'error', error);
                } else {
                    const state = await getState();
                    state.user.jwt = jwt;
                    state.user.userId = userId;
                    state.user.isAdmin = isAdmin;
                    state.user.moderators = moderators;
                    state.user.name = name;
                    await setState(state);
                    location.reload();
                }
            } catch (err) {
                events.emit('add-log', 'error', err.message);
            }
        });

        registerBtn.addEventListener('click', async () => {
            const name = document.querySelector('input#hidden-name').value;
            const password = document.querySelector('input#hidden-password').value;

            try {
                const url = `${Hidden.API_URL}/users/register`;
                const { jwt, userId, error } = await network.postRequest(url, { name, password });
                if (error) {
                    events.emit('add-log', 'error', error);
                } else {
                    const state = await getState();
                    state.user.jwt = jwt;
                    state.user.userId = userId;
                    state.user.name = name;
                    await setState(state);
                    location.reload();
                }
            } catch (err) {
                events.emit('add-log', 'error', err.message);
            }
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
            forumId: runtime.forum.id,
            hidden: state.hidden.enabled
        };

        if (state.hidden.enabled && state.hidden.view === 'topic') {
            data.topicId = state.hidden.topic.id;
        } else if (runtime.topicId !== 0) {
            data.topicId = runtime.topic.id;
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
            events.emit('add-log', 'error', err);
        });
    }
}

const hiddenMenu = new HiddenMenu();
hiddenJVC.registerModule(hiddenMenu);
