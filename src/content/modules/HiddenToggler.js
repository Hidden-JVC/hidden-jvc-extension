import buttonTemplate from '../views/misc/button.handlebars';

/**
 * Add a button to toggle between JVC and Hidden JVC
 */
class HiddenToggler {
    async init(state) {
        const buttonText = state.hidden.enabled ? 'JVC' : 'Hidden JVC';
        const button = this.createButton(buttonText);
        button.addEventListener('click', async () => {
            const url = `${location.href}?hidden=${state.hidden.enabled ? 0 : 1}`;
            window.location.replace(url);
        });
    }

    createButton(text) {
        const id = 'hidden-jvc-toggler-btn';
        const buttonHtml = buttonTemplate({ id, text });
        const container = document.querySelector('.bloc-pre-pagi-forum.bloc-outils-top .bloc-pre-right');
        container.insertAdjacentHTML('afterbegin', buttonHtml);
        return container.querySelector(`#${id}`);
    }
}

export default new HiddenToggler();
