const problemFetch = async (res, formatData, query, varibale) => {
    await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com'
        },
        body: JSON.stringify({ query: query, variables: { titleSlug: varibale } }),
    })
        .then(result => result.json())
        .then(data => {
            if (data.errors) {
                res.send(data);
            } else {
                res.json(formatData(data.data));
            }
        })
        .catch(err => {
            console.error('Error', err);
            res.send(err);
        });
};

module.exports = problemFetch;