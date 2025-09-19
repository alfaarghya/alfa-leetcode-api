export const problemList = `
  query problemsetQuestionListV2(
    $filters: QuestionFilterInput,
    $limit: Int,
    $searchKeyword: String,
    $skip: Int,
    $sortBy: QuestionSortByInput,
    $categorySlug: String
  ) {
    problemsetQuestionListV2(
      filters: $filters
      limit: $limit
      searchKeyword: $searchKeyword
      skip: $skip
      sortBy: $sortBy
      categorySlug: $categorySlug
    ) {
      questions {
        id
        titleSlug
        title
        translatedTitle
        questionFrontendId
        paidOnly
        difficulty
        topicTags {
          name
          slug
          nameTranslated
        }
        status
        isInMyFavorites
        frequency
        acRate
        contestPoint
      }
      totalLength
      finishedLength
      hasMore
    }
  }
`;