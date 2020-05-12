import { fr } from 'date-fns/locale';
import { parse } from 'date-fns';

const matches = location.href.match(/^http:\/\/www\.jeuxvideo\.com\/forums\/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-.*\.htm$/);
if (matches === null) {
    throw new Error('url mismatch');
}

export const topicData = getTopicData();
export const forumData = getForumData();

function getTopicData() {
    const title = document.querySelector('#bloc-title-forum').textContent.trim();
    const id = parseInt(matches[3]);
    const page = parseInt(matches[4]);

    const messages = parseMessages();

    return { id, title, page, messages };
}

function getForumData() {
    const id = parseInt(matches[2]);
    const name = document.querySelectorAll('.fil-ariane-crumb span')[2].textContent.replace('Forum', '').trim();
    return { id, name };
}

function parseMessages() {
    const messages = [];

    const elements = document.querySelectorAll('.conteneur-messages-pagi .bloc-message-forum[data-id]');
    for (const element of elements) {
        const dateStr = element.querySelector('.bloc-date-msg').textContent.trim();
        messages.push({
            id: element.dataset.id,
            username: element.querySelector('.bloc-pseudo-msg').textContent.trim(),
            htmlContent: element.querySelector('.txt-msg.text-enrichi-forum').innerHTML,
            creationDate: parse(dateStr, 'dd MMMM yyyy à HH:mm:ss', new Date(), { locale: fr })
        });
    }

    return messages;
}

