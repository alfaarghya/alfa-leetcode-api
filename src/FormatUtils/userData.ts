import { UserData } from '../types';

export const formatUserData = (data: UserData) => ({
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
});

export const formatBadgesData = (data: UserData) => ({
  badgesCount: data.matchedUser.badges.length,
  badges: data.matchedUser.badges,
  upcomingBadges: data.matchedUser.upcomingBadges,
  activeBadge: data.matchedUser.activeBadge,
});

export const formatContestData = (data: UserData) => ({
  contestAttend: data.userContestRanking?.attendedContestsCount,
  contestRating: data.userContestRanking?.rating,
  contestGlobalRanking: data.userContestRanking?.globalRanking,
  totalParticipants: data.userContestRanking?.totalParticipants,
  contestTopPercentage: data.userContestRanking?.topPercentage,
  contestBadges: data.userContestRanking?.badge,
  contestParticipation: data.userContestRankingHistory.filter(
    (obj) => obj.attended === true
  ),
});

export const formatContestHistoryData = (data: UserData) => ({
  count: data.userContestRankingHistory.length,
  contestHistory: data.userContestRankingHistory,
});

export const formatSolvedProblemsData = (data: UserData) => ({
  solvedProblem: data.matchedUser.submitStats.acSubmissionNum[0].count,
  easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
  mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
  hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
  totalSubmissionNum: data.matchedUser.submitStats.totalSubmissionNum,
  acSubmissionNum: data.matchedUser.submitStats.acSubmissionNum,
});

export const formatSubmissionData = (data: UserData) => ({
  count: data.recentSubmissionList.length,
  submission: data.recentSubmissionList,
});

export const formatAcSubmissionData = (data: UserData) => ({
  count: data.recentAcSubmissionList.length,
  submission: data.recentAcSubmissionList,
});

export const formatSubmissionCalendarData = (data: UserData) => ({
  submissionCalendar: data.matchedUser.submissionCalendar,
});
