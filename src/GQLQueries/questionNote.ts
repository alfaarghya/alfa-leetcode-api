export const questionNoteQuery = `
    query questionNote($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            note
        }
    }
`;
