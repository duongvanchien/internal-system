import fetch from 'node-fetch';
import queryString from 'query-string'

export const getApi = async (payload: { url: string, body?: any, params?: any }) => {
    const { url, body, params } = payload;
    const response = await fetch(queryString.stringifyUrl({ url: url, query: params }, { arrayFormat: 'bracket' }), {
        method: 'get',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.TOKEN_CLICK_UP
        }
    })
    return response.json()
}