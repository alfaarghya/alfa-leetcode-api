import { Response } from 'express';

const handleRequest = async (
    res: Response,
    query: string,
    params: any
) => {
    try {
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Referer: 'https://leetcode.com',
            },
            body: JSON.stringify({
                query: query,
                variables: params,
            }),
        });

        const result = await response.json();
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }
        if (result.errors) {
            return res.send(result);
        }

        return res.json(result.data);
    } catch (err) {
        console.error('Error: ', err);
        return res.send(err);
    }
};

export default handleRequest;
