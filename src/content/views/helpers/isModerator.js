export default function (type, options) {
    if (type === 'Admin' || type === 'Moderator') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}
