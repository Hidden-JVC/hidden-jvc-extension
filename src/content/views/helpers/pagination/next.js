export default function (page, lastPage) {
    if (page < lastPage) {
        return page + 1;
    } else {
        return false;
    }
}