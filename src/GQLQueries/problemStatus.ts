export const problemStatusQuery = `
    query questionStatus($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            status
            difficulty
            isPaidOnly
        }
    }
`;
