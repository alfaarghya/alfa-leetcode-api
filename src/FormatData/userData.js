exports.formatUserData = (data) => {
  return {
    username: data.matchedUser.username,
    name: data.matchedUser.profile.realName,
    birthday: data.matchedUser.profile.birthday,
    avatar: data.matchedUser.profile.userAvatar,
    ranking: data.matchedUser.profile.ranking,
    reputation: data.matchedUser.profile.reputation,
    gitHub: data.matchedUser.githubUrl,
    twitter: data.matchedUser.twitterUrl,
    linkedIN: data.matchedUser.linkedinUrl,
    website: data.matchedUser.profile.websites,
    country: data.matchedUser.profile.countryName,
    company: data.matchedUser.profile.company,
    school: data.matchedUser.profile.school,
    skillTags: data.matchedUser.profile.skillTags,
    about: data.matchedUser.profile.aboutMe,
  };
};

exports.formatBadgesData = (data) => {
  return {
    badgesCount: data.matchedUser.badges.length,
    badges: data.matchedUser.badges,
    upcomingBadges: data.matchedUser.upcomingBadges,
    activeBadge: data.matchedUser.activeBadge,
  };
};
exports.formatContestData = (data) => {
  return {
    contestAttend: data.userContestRanking.attendedContestsCount,
    contestRating: data.userContestRanking.rating,
    contestGlobalRanking: data.userContestRanking.globalRanking,
    totalParticipants: data.userContestRanking.totalParticipants,
    contestTopPercentage: data.userContestRanking.topPercentage,
    contestBadges: data.userContestRanking.badge,
    contestParticipation: data.userContestRankingHistory.filter(
      (obj) => obj.attended === true
    ),
  };
};
exports.formatContestHistoryData = (data) => {
  return {
    count: data.userContestRankingHistory.length,
    contestHistory: data.userContestRankingHistory,
  };
};
exports.formatSolvedProblemsData = (data) => {
  return {
    solvedProblem: data.matchedUser.submitStats.acSubmissionNum[0].count,
    easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
    mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
    hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
    totalSubmissionNum: data.matchedUser.submitStats.totalSubmissionNum,
    acSubmissionNum: data.matchedUser.submitStats.acSubmissionNum,
  };
};
exports.formatSubmissionData = (data) => {
  return {
    count: data.recentSubmissionList.length,
    submission: data.recentSubmissionList,
  };
};
exports.formatAcSubmissionData = (data) => {
  return {
    count: data.recentAcSubmissionList.length,
    submission: data.recentAcSubmissionList,
  };
};
exports.formatSubmissionCalendarData = (data) => {
  return {
    submissionCalendar: data.matchedUser.submissionCalendar,
  };
};
