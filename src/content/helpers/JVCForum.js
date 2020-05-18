class JVCForum {
    constructor() {
        this.id = null;
        this.name = null;
        this.viewId = null;
        this.offset = null;
    }

    async init() {
        const matches = location.href.match(/^http:\/\/www\.jeuxvideo\.com\/forums\/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-.*\.htm(?:#.*?)?$/);
        if (matches === null) {
            throw new Error('Format d\'url inconnu');
        }

        this.id = parseInt(matches[2]);
        this.viewId = parseInt(matches[1]);
        this.offset = parseInt(matches[6]);

        // this.name = document.querySelectorAll('.fil-ariane-crumb span')[2].textContent.replace('Forum', '').trim();
    }
}

export default new JVCForum();
