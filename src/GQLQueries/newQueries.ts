export const languageStatsQuery = `
    query languageStats($username: String!) {
        matchedUser(username: $username) {
            languageProblemCount {
                languageName
                problemsSolved
            }
        }
    }
`;

export const selectQuestion = `
query selectProblem($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        boundTopicId
        title
        titleSlug
        content
        translatedTitle
        translatedContent
        isPaidOnly
        difficulty
        likes
        dislikes
        isLiked
        similarQuestions
        exampleTestcases
        contributors {
            username
            profileUrl
            avatarUrl
        }
        topicTags {
            name
            slug
            translatedName
        }
        companyTagStats
        codeSnippets {
            lang
            langSlug
            code
        }
        stats
        hints
        solution {
            id
            canSeeDetail
            paidOnly
            hasVideoSolution
            paidOnlyVideo
        }
        status
        sampleTestCase
        metaData
        judgerAvailable
        judgeType
        mysqlSchemas
        enableRunCode
        enableTestMode
        enableDebugger
        envInfo
        libraryUrl
        adminUrl
        challengeQuestion {
            id
            date
            incompleteChallengeCount
            streakCount
            type
        }
        note
    }
}`

// queries.ts
export const dailyQeustion = `
query getDailyProblem {
  activeDailyCodingChallengeQuestion {
      date
      link
      question {
          questionId
          questionFrontendId
          boundTopicId
          title
          titleSlug
          content
          translatedTitle
          translatedContent
          isPaidOnly
          difficulty
          likes
          dislikes
          isLiked
          similarQuestions
          exampleTestcases
          contributors {
              username
              profileUrl
              avatarUrl
          }
          topicTags {
              name
              slug
              translatedName
          }
          companyTagStats
          codeSnippets {
              lang
              langSlug
              code
          }
          stats
          hints
          solution {
              id
              canSeeDetail
              paidOnly
              hasVideoSolution
              paidOnlyVideo
          }
          status
          sampleTestCase
          metaData
          judgerAvailable
          judgeType
          mysqlSchemas
          enableRunCode
          enableTestMode
          enableDebugger
          envInfo
          libraryUrl
          adminUrl
          challengeQuestion {
              id
              date
              incompleteChallengeCount
              streakCount
              type
          }
          note
      }
  }
}
`;

export const questionOfTodayQuery = `
  query questionOfToday {
    activeDailyCodingChallengeQuestion {
      date
      userStatus
      link
      question {
        acRate
        difficulty
        freqBar
        frontendQuestionId: questionFrontendId
        isFavor
        paidOnly: isPaidOnly
        status
        title
        titleSlug
        hasVideoSolution
        hasSolution
        topicTags {
          name
          id
          slug
        }
      }
    }
  }
`;


export const skillStatsQuery = `
    query skillStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced {
            tagName
            tagSlug
            problemsSolved
          }
          intermediate {
            tagName
            tagSlug
            problemsSolved
          }
          fundamental {
            tagName
            tagSlug
            problemsSolved
          }
        }
      }
    }
`;


// queries.ts
export const getUserProfileQuery = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    recentSubmissionList(username: $username) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      __typename
    }
    matchedUserStats: matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        __typename
      }
    }
  }
`;

// queries.ts
export const officialSolutionQuery = `
    query OfficialSolution($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        solution {
          id
          title
          content
          contentTypeId
          paidOnly
          hasVideoSolution
          paidOnlyVideo
          canSeeDetail
          rating {
            count
            average
            userRating {
              score
            }
          }
          topic {
            id
            commentCount
            topLevelCommentCount
            viewCount
            subscribed
            solutionTags {
              name
              slug
            }
            post {
              id
              status
              creationDate
              author {
                username
                isActive
                profile {
                  userAvatar
                  reputation
                }
              }
            }
          }
        }
      }
    }
`;



// queries.ts
export const userProfileCalendarQuery = `
    query UserProfileCalendar($username: String!, $year: Int!) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          activeYears
          streak
          totalActiveDays
          dccBadges {
            timestamp
            badge {
              name
              icon
            }
          }
          submissionCalendar
        }
      }
    }
`;

// queries.ts
export const userProfileUserQuestionProgressV2Query = `
    query userProfileUserQuestionProgressV2($userSlug: String!) {
        userProfileUserQuestionProgressV2(userSlug: $userSlug) {
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


export const userContestRankingInfoQuery = `
    query userContestRankingInfo($username: String!) {
        userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
            badge {
                name
            }
        }
        userContestRankingHistory(username: $username) {
            attended
            trendDirection
            problemsSolved
            totalProblems
            finishTimeInSeconds
            rating
            ranking
            contest {
                title
                startTime
            }
        }
    }
`;

export const discussCommentsQuery = `
    query discussComments($topicId: Int!, $orderBy: String = "newest_to_oldest", $pageNo: Int = 1, $numPerPage: Int = 10) {
        topicComments(topicId: $topicId, orderBy: $orderBy, pageNo: $pageNo, numPerPage: $numPerPage) {
            data {
                id
                pinned
                pinnedBy {
                    username
                    __typename
                }
                post {
                    ...DiscussPost
                    __typename
                }
                numChildren
                __typename
            }
            __typename
        }
    }

    fragment DiscussPost on PostNode {
        id
        voteCount
        voteStatus
        content
        updationDate
        creationDate
        status
        isHidden
        coinRewards {
            ...CoinReward
            __typename
        }
        author {
            isDiscussAdmin
            isDiscussStaff
            username
            nameColor
            activeBadge {
                displayName
                icon
                __typename
            }
            profile {
                userAvatar
                reputation
                __typename
            }
            isActive
            __typename
        }
        authorIsModerator
        isOwnPost
        __typename
    }

    fragment CoinReward on ScoreNode {
        id
        score
        description
        date
        __typename
    }
`;

export const discussTopicQuery = `
    query DiscussTopic($topicId: Int!) {
        topic(id: $topicId) {
            id
            viewCount
            topLevelCommentCount
            subscribed
            title
            pinned
            tags
            hideFromTrending
            post {
                ...DiscussPost
                __typename
            }
            __typename
        }
    }

    fragment DiscussPost on PostNode {
        id
        voteCount
        voteStatus
        content
        updationDate
        creationDate
        status
        isHidden
        coinRewards {
            ...CoinReward
            __typename
        }
        author {
            isDiscussAdmin
            isDiscussStaff
            username
            nameColor
            activeBadge {
                displayName
                icon
                __typename
            }
            profile {
                userAvatar
                reputation
                __typename
            }
            isActive
            __typename
        }
        authorIsModerator
        isOwnPost
        __typename
    }

    fragment CoinReward on ScoreNode {
        id
        score
        description
        date
        __typename
    }
`;

// queries.ts
export const trendingDiscussQuery = `
    query trendingDiscuss($first: Int!) {
        cachedTrendingCategoryTopics(first: $first) {
            id
            title
            post {
                id
                creationDate
                contentPreview
                author {
                    username
                    isActive
                    profile {
                        userAvatar
                        __typename
                    }
                    __typename
                }
                __typename
            }
            __typename
        }
    }
`;