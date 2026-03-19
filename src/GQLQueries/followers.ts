export const followersQuery = `
  query getFollowers($username: String!) {
    followers(userSlug: $username) {
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
