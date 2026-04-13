export const userStatusQuery = `
    query globalData {
        userStatus {
            userId
            isSignedIn
            isPremium
            isVerified
            username
            avatar
            isAdmin
            checkedInToday
            notificationStatus {
                lastModified
                numUnread
            }
        }
    }
`;
