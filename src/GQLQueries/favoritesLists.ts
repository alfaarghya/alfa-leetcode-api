export const favoritesListsQuery = `
    query favoritesLists {
        favoritesLists {
            allFavorites {
                idHash
                name
                isPublicFavorite
                viewCount
                creator
                isWatched
                questions {
                    questionId
                    title
                    titleSlug
                }
            }
        }
    }
`;
