export const userQuestionProgressQuery = `
    query userProfileUserQuestionProgressV2($username: String!) {
        userProfileUserQuestionProgressV2(userSlug: $username) {
            numAcceptedQuestions {
                count
                difficulty
            }
            numFailedQuestions {
                count
                difficulty
            }
            numUntouchedQuestions {
                count
                difficulty
            }
            userSessionBeatsPercentage {
                difficulty
                percentage
            }
        }
    }
`;
