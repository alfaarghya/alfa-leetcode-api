const query = `query ($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList( 
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
    ) {
        total: totalNum
        questions: data {
            acRate 
            difficulty 
            freqBar 
            questionFrontendId 
            isFavor
            isPaidOnly 
            status 
            title 
            titleSlug 
            topicTags { 
                name 
                id 
                slug 
            } 
            hasSolution 
            hasVideoSolution
        }
    }
}`;

module.exports = query;