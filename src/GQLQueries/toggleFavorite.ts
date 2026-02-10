export const addToFavoriteMutation = `
    mutation addQuestionToFavorite($favoriteIdHash: String!, $questionId: String!) {
        addQuestionToFavorite(favoriteIdHash: $favoriteIdHash, questionId: $questionId) {
            ok
        }
    }
`;

export const removeFromFavoriteMutation = `
    mutation removeQuestionFromFavorite($favoriteIdHash: String!, $questionId: String!) {
        removeQuestionFromFavorite(favoriteIdHash: $favoriteIdHash, questionId: $questionId) {
            ok
        }
    }
`;
