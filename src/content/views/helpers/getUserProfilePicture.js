export default function (post) {
    console.log(post);
    if (post.User !== null && post.User.ProfilePicture !== null) {
        return post.User.ProfilePicture;
    } else {
        return 'https://risibank.fr/cache/stickers/d209/20968-full.png';
    }
}
