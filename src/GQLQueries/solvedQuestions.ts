const query = `#graphql
query solvedQuestions($filters: UserProgressQuestionListInput) {
    userProgressQuestionList(filters: $filters) {
        totalNum
        questions {
            frontendId
            title
            titleSlug
            difficulty
            lastSubmittedAt
            numSubmitted
            questionStatus
            topicTags {
                name
                slug
            }
        }
    }
}`;

export default query;
