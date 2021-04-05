export async function getRequest(url, queryObject = {}) {
    const query = new URLSearchParams(queryObject);
    if (query.toString().length > 0) {
        url = `${url}?${query.toString()}`;
    }
    const response = await fetch(url);
    return response.json();
}

export async function postRequest(url, body, jwt) {
    const headers = {
        'content-type': 'application/json'
    };
    if (jwt) {
        headers.authorization = `Bearer ${jwt}`;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });
    return await response.json();
}

export async function deleteRequest(url, jwt) {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            authorization: `Bearer ${jwt}`
        }
    });
    return await response.json();
}
