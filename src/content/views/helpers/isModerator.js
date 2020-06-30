export default function (user, options) {
    if (user.type === 'Admin' || user.type === 'Moderator') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}
