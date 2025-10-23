export const discussCommentsQuery = `
    query discussComments($topicId: Int!, $orderBy: String = "newest_to_oldest", $pageNo: Int = 1, $numPerPage: Int = 10) {
        topicComments(topicId: $topicId, orderBy: $orderBy, pageNo: $pageNo, numPerPage: $numPerPage) {
            data {
                id
                pinned
                pinnedBy {
                    username
                }
                post {
                    ...DiscussPost
                }
                numChildren
            }
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
        }
        author {
            isDiscussAdmin
            isDiscussStaff
            username
            nameColor
            activeBadge {
                displayName
                icon
            }
            profile {
                userAvatar
                reputation
            }
            isActive
        }
        authorIsModerator
        isOwnPost
    }

    fragment CoinReward on ScoreNode {
        id
        score
        description
        date
    }
`;
