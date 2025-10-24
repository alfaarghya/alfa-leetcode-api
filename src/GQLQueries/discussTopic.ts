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
