import modalTemplate from '../views/modal.handlebars';

let id = 0;

export default class HiddenModal {
    constructor(options = {}) {
        id++;

        const html = modalTemplate({
            id,
            title: options.title
        });

        document.body.insertAdjacentHTML('beforeend', html);

        this.modal = document.querySelector(`#hidden-modal-${id}`);
        this.body = this.modal.querySelector('.modal-generic-content');
        this.overlay = document.querySelector(`#hidden-modal-overlay-${id}`);

        if (options.html) {
            this.body.innerHTML = options.html;
        } else if (options.message) {
            this.body.textContent = options.message;
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-close') !== null) {
                this.destroy();
            }
        });
    }

    destroy() {
        this.modal.remove();
        this.overlay.remove();
    }

    static create(options = {}) {
        const modal = new HiddenModal(options);
        return modal;
    }
}
