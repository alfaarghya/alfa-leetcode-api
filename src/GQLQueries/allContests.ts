export const allContestQuery = `
 query allContests {
    allContests {
        title
        titleSlug
        startTime
        duration
        originStartTime
        isVirtual
        containsPremium
        }
}
`;
