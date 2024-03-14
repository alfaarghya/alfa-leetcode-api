import { Request } from 'express';
// User Data
interface UserDataProfile {
  aboutMe: string;
  company?: string;
  countryName?: string;
  realName: string;
  birthday?: string;
  userAvatar: string;
  ranking: number;
  reputation: number;
  school?: string;
  skillTags: string[];
  websites: string[];
}

interface MatchedUser {
  activeBadge: Badge;
  badges: Badge[];
  githubUrl: string;
  linkedinUrl?: string;
  profile: UserDataProfile;
  upcomingBadges: Badge[];
  username: string;
  twitterUrl?: string;
  submissionCalendar: string;
  submitStats: {
    totalSubmissionNum: number;
    acSubmissionNum: { count: number }[];
    count: number;
  };
}

export interface UserData {
  userContestRanking: {
    attendedContestsCount: number;
    badge: Badge;
    globalRanking: number;
    rating: number;
    totalParticipants: number;
    topPercentage: number;
  };
  userContestRankingHistory: {
    attended: boolean;
    rating: number;
    ranking: number;
    trendDirection: string;
    problemsSolved: number;
    totalProblems: number;
    finishTimeInSeconds: number;
    contest: {
      title: string;
      startTime: string;
    };
  }[];
  matchedUser: MatchedUser;
  recentAcSubmissionList: {}[];
  recentSubmissionList: {}[];
}

interface Badge {
  name: string;
  icon: string;
}

//User Details
export type FetchUserDataRequest = Request<
  { username: string },
  {},
  { username: string; limit: number },
  { limit: number }
>;

export type TransformedUserDataRequest = Request<
  {},
  {},
  { username: string; limit: number }
>;

//  ProblemData
export interface ProblemSetQuestionListData {
  problemsetQuestionList: {
    total: number;
    questions: {}[];
  };
}

interface Question {
  content: string;
  companyTagStats: string[];
  difficulty: string;
  dislikes: number;
  exampleTestcases: {}[];
  hints: {}[];
  isPaidOnly: boolean;
  likes: number;
  questionId: number;
  questionFrontendId: number;
  solution: string;
  similarQuestions: {}[];
  title: string;
  titleSlug: string;
  topicTags: string[];
}

export interface DailyProblemData {
  activeDailyCodingChallengeQuestion: {
    date: string;
    link: string;
    question: Question;
  };
}
export interface SelectProblemData {
  question: Question;
}
