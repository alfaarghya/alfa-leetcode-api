export const updateNoteMutation = `
    mutation updateNote($titleSlug: String!, $content: String!) {
        updateNote(titleSlug: $titleSlug, content: $content) {
            question {
                questionId
                note
            }
        }
    }
`;
