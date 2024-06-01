const query = `
    query trendingDiscuss($first: Int!) {
        cachedTrendingCategoryTopics(first: $first) {
            id
            title
            post {
                id
                creationDate
                contentPreview
                author {
                    username
                    isActive
                    profile {
                        userAvatar
                    }
                }
            }
        }
    }
`;

export default query;
