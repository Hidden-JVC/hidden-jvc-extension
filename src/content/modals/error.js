import HiddenModal from './Modal.js';

class ErrorModal extends HiddenModal {
    constructor(message) {
        super({
            title: 'Erreur',
            message
        });
    }

    static create(message) {
        return new ErrorModal(message);
    }
}

export default ErrorModal;
