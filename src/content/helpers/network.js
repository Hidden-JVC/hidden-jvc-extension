import browser from 'webextension-polyfill';

export async function getRequest(url, queryObject = {}) {
    try {
        const query = new URLSearchParams(queryObject);
        if (query.toString().length > 0) {
            url = `${url}?${query.toString()}`;
        }
        return await browser.runtime.sendMessage({ action: 'get-request', url });
    } catch (err) {
        console.error(err);
        // Modal.create({
        //     title: 'Hidden JVC - Erreur serveur',
        //     message: 'Une erreur est survenu lors d\'une requête faite au serveur d\'Hidden JVC'
        // });
        return null;
    }
}

export async function postRequest(url, body, jwt) {
    try {
        return await browser.runtime.sendMessage({ action: 'post-request', url, body, jwt });
    } catch (err) {
        // Modal.create({
        //     title: 'Hidden JVC - Erreur serveur',
        //     message: 'Une erreur est survenu lors d\'une requête faite au serveur d\'Hidden JVC'
        // });
        return null;
    }
}
