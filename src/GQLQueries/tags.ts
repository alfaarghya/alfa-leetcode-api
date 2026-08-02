const query = `
    query questionTopicTags {
        questionTopicTags {
            edges {
                node {
                    name
                    slug
                }
            }
        }
    }
`;

export default query;
