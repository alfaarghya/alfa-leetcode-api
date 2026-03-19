export const followingQuery = `
  query getFollowing($username: String!) {
    following(userSlug: $username) {
      users {
        realName
        userAvatar
        userSlug
        aboutMe
        isFollowingMe
        isFollowedByMe
      }
    }
  }
`;
