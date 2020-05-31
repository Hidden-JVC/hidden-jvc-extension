import modalTemplate from '../views/modal.handlebars';

let id = 0;

export default class HiddenModal {
    constructor(options = {}) {
        id++;

        const html = modalTemplate({
            id,
            title: options.title,
            message: options.message
        });

        document.body.insertAdjacentHTML('beforeend', html);

        this.modal = document.querySelector(`#hidden-modal-${id}`);
        this.overlay = document.querySelector(`#hidden-modal-overlay-${id}`);

        this.modal.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-close') !== null) {
                this.modal.remove();
                this.overlay.remove();
            }
        });
    }

    static create(options = {}) {
        const modal = new HiddenModal(options);
        return modal;
    }
}
