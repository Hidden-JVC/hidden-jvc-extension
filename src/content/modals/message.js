import HiddenModal from './Modal.js';

class MessageModal extends HiddenModal {
    constructor(title, message) {
        super({
            title,
            message
        });
    }

    static create(title, message) {
        return new MessageModal(title, message);
    }
}

export default MessageModal;
