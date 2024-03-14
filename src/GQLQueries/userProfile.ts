const query = `#graphql
query getUserProfile($username: String!) {
    allQuestionsCount {
        difficulty
        count
    }
    matchedUser(username: $username) {
        username
        githubUrl
        twitterUrl
        linkedinUrl
        contributions {
            points
            questionCount
            testcaseCount
        }
        profile {
            realName
            userAvatar
            birthday
            ranking
            reputation
            websites
            countryName
            company
            school
            skillTags
            aboutMe
            starRating
        }
        badges {
            id
            displayName
            icon
            creationDate
        }
        upcomingBadges {
            name
            icon
        }
        activeBadge {
            id
            displayName
            icon
            creationDate
        }
        submitStats {
            totalSubmissionNum {
                difficulty
                count
                submissions
            }
            acSubmissionNum {
                difficulty
                count
                submissions
            }
        }
        submissionCalendar
    }
    recentSubmissionList(username: $username, limit: 20) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
    }
}`;

export default query;
