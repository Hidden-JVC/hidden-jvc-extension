export default function (page, lastPage) {
    if (page !== lastPage) {
        return lastPage;
    } else {
        return false;
    }
}
