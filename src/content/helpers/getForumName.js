export default async function (forumId) {
    const forumUrl = `https://www.jeuxvideo.com/forums/0-${forumId}-0-1-0-1-0-0.htm`;
    
    const response = await fetch(forumUrl);
    const html = await response.text();

    const matches = html.match(/<title>(.*?)<\/title>/);
    if (matches === null) {
        throw new Error('aze');
    }

    const title = matches[1]
        .replace(/-\s* jeuxvideo.com/, '')
        .replace(/^Forum/, '')
        .trim();

    return title;
}