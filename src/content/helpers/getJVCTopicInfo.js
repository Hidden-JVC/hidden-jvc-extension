import { parse } from 'date-fns';
import { fr } from 'date-fns/locale';

export default async function (viewId, forumId, topicId) {
    const url = `https://www.jeuxvideo.com/forums/${viewId}-${forumId}-${topicId}-1-0-1-0-0.htm`;

    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    /* eslint-disable-next-line */
    const firstPost = doc.querySelectorAll('.bloc-message-forum ')[0];

    /* eslint-disable-next-line */
    const title = doc.querySelector('#bloc-title-forum').textContent.trim();
    const content = firstPost.querySelector('.txt-msg.text-enrichi-forum').innerHTML.trim();
    const author = firstPost.querySelector('.bloc-pseudo-msg').textContent.trim();
    const dateStr = firstPost.querySelector('.bloc-date-msg').textContent.trim();

    const info = { title, author, dateStr, content };

    info.date = parse(info.dateStr, 'dd MMMM yyyy à HH:mm:ss', new Date(), { locale: fr });
    delete info.dateStr;

    return info;
}
