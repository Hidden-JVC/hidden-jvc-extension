export default function (str) {
    if (!str) {
        return '';
    }
    const array = [];
    for (let i = 0; i < str.length; i += 2) {
        const index1 = '0A12B34C56D78E9F'.indexOf(str[i]);
        const index2 = '0A12B34C56D78E9F'.indexOf(str[i + 1]);
        array.push(16 * index1 + index2);
    }
    return new TextDecoder('utf8').decode(new Uint8Array(array));
}
