export default function createPagination(page, lastPage) {
    let previousRange = page - 5;
    if (previousRange < 1) {
        previousRange = 1;
    }

    let nextRange = page + 5;
    if (nextRange > lastPage) {
        nextRange = lastPage;
    }

    const pagination = [];
    for (let i = previousRange; i <= nextRange; i++) {
        pagination.push({ page: i, active: i === page });
    }

    if (pagination.length > 0) {
        if (pagination[0].page !== 1) {
            pagination.unshift({ page: false, active: false });
            pagination.unshift({ page: 1, active: false });
        }
        if (pagination[pagination.length - 1].page !== lastPage) {
            pagination.push({ page: false, active: false });
            pagination.push({ page: lastPage, active: false });
        }
    }

    return pagination;
}
