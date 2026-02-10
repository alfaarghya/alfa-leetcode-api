export const submissionDetailsQuery = `
    query submissionDetails($submissionId: Int!) {
        submissionDetails(submissionId: $submissionId) {
            runtime
            runtimeDisplay
            runtimePercentile
            memory
            memoryDisplay
            memoryPercentile
            code
            timestamp
            lang {
                name
                verboseName
            }
            question {
                questionId
                titleSlug
                title
            }
            notes
            topicTags {
                tagId
                slug
                name
            }
            runtimeError
            compileError
            lastTestcase
        }
    }
`;
