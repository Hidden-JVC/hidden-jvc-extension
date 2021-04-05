import { format } from 'date-fns';

import hiddenJVC from '../HiddenJVC.js';
import logsTemplate from '../views/logs.handlebars';

import events from '../events.js';

class HiddenMenu {
    constructor() {
        this.pages = 0;
    }

    async init() {
        const html = logsTemplate();
        document.querySelector('#forum-right-col .panel.panel-jv-forum').insertAdjacentHTML('afterend', html);

        events.on('add-log', (type, log) => {
            this.addLog(type, log);
        });
    }

    addLog(type, log) {
        const tbody = document.querySelector('#hidden-logs tbody');
        const row = document.createElement('tr');

        const date = format(new Date(), 'kk:mm:ss');
        let color = null;
        switch (type) {
            case 'error':
                color = 'hidden-log-error';
                break;
            case 'info':
                color = 'hidden-log-info';
                break;
        }
        row.innerHTML = `<td> <span class="hidden-log ${color}"> ${type} </span> </td> <td> ${date} </td> <td> ${log} </td>`;

        tbody.insertAdjacentElement('afterbegin', row);
    }
}

const logsMenu = new HiddenMenu();
hiddenJVC.registerModule(logsMenu);
