export default function (connectedUser, post) {
    return connectedUser
        && post
        && connectedUser.userId === post.Id;
}
