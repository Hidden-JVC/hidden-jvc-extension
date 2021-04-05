import runtime from '../runtime.js';
import menuTemplate from '../views/menu.handlebars';

import { API_URL } from '../constants';
import { getState, setState } from '../../helpers/storage.js';

export default async function (state) {
    const toggleButtonEnbaled = runtime.currentPage === runtime.pages.JVC_FORUM || runtime.currentPage === runtime.pages.HIDDEN_FORUM;

    const html = menuTemplate({ state, toggleButtonEnbaled });
    document.querySelector('#forum-right-col .panel.panel-jv-forum').insertAdjacentHTML('afterend', html);

    if (state.user.jwt === null) {
        initLogin();
    } else {
        initLogout();
    }
}

function initLogin() {
    const loginBtn = document.querySelector('button#hidden-login');
    loginBtn.addEventListener('click', () => {
        auth(true);
    });
    const registerBtn = document.querySelector('button#hidden-register');
    registerBtn.addEventListener('click', () => {
        auth(false);
    });
}

function initLogout() {
    const logoutBtn = document.querySelector('button#hidden-logout');
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

async function auth(login) {
    try {
        const name = document.querySelector('input#hidden-name').value.trim();
        const password = document.querySelector('input#hidden-password').value.trim();

        const url = `${API_URL}/users/${login ? 'login' : 'register'}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ name, password })
        });

        const { jwt, userId, isAdmin, moderators, error } = await response.json();
        if (error) {
            console.log(error);
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
        console.error(err);
    }
}
