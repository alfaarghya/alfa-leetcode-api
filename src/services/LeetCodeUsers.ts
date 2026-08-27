import {
  AcSubmissionQuery,
  contestQuery,
  languageStatsQuery,
  skillStatsQuery,
  submissionQuery,
  userProfileCalendarQuery,
  userProfileQuery,
  userQuestionProgressQuery,
} from '../GQLQueries';
import { executeGraphQL } from '../internal/graphqlClient';
import {
  Badge,
  ContestHistoryEntry,
  ContestSummary,
  DailyCodingChallengeBadge,
  DifficultyCount,
  DifficultyPercentage,
  DifficultyTally,
  LanguageStat,
  ProgressSummary,
  SkillStatsSummary,
  SkillTagCount,
  SolvedProblemsSummary,
  Submission,
  SubmissionCalendar,
  UserBadges,
  UserProfileSummary,
} from './dto';

// Raw shapes coming back from leetcode.com/graphql - intentionally not
// exported, they never appear on the Graftcode public surface.

interface RawBadge {
  displayName?: string;
  name?: string;
  icon?: string;
}

interface RawDifficultyCount {
  difficulty: string;
  count: number;
  submissions?: number;
}

interface RawSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

interface RawUserProfile {
  matchedUser: {
    username: string;
    githubUrl: string | null;
    twitterUrl: string | null;
    linkedinUrl: string | null;
    contributions: { points: number };
    profile: {
      realName: string | null;
      userAvatar: string;
      birthday: string | null;
      ranking: number;
      reputation: number;
      websites: string[];
      countryName: string | null;
      company: string | null;
      school: string | null;
      skillTags: string[];
      aboutMe: string;
    };
    badges: RawBadge[];
    upcomingBadges: RawBadge[];
    activeBadge: RawBadge | null;
    submitStats: {
      totalSubmissionNum: RawDifficultyCount[];
      acSubmissionNum: RawDifficultyCount[];
    };
    submissionCalendar: string;
  } | null;
  recentSubmissionList: RawSubmission[];
}

interface RawContest {
  userContestRanking: {
    attendedContestsCount: number;
    rating: number;
    globalRanking: number;
    totalParticipants: number;
    topPercentage: number;
    badge: { name: string } | null;
  } | null;
  userContestRankingHistory: {
    attended: boolean;
    rating: number;
    ranking: number;
    trendDirection: string;
    problemsSolved: number;
    totalProblems: number;
    finishTimeInSeconds: number;
    contest: { title: string; startTime: number };
  }[];
}

interface RawSubmissionList {
  recentSubmissionList?: RawSubmission[];
  recentAcSubmissionList?: RawSubmission[];
}

interface RawUserCalendar {
  matchedUser: {
    userCalendar: {
      activeYears: number[];
      streak: number;
      totalActiveDays: number;
      dccBadges: { timestamp: number; badge: { name: string; icon: string } }[];
      submissionCalendar: string;
    };
  } | null;
}

interface RawSkillStats {
  matchedUser: {
    tagProblemCounts: {
      fundamental: {
        tagName: string;
        tagSlug: string;
        problemsSolved: number;
      }[];
      intermediate: {
        tagName: string;
        tagSlug: string;
        problemsSolved: number;
      }[];
      advanced: { tagName: string; tagSlug: string; problemsSolved: number }[];
    };
  } | null;
}

interface RawLanguageStats {
  matchedUser: {
    languageProblemCount: { languageName: string; problemsSolved: number }[];
  } | null;
}

interface RawProgress {
  userProfileUserQuestionProgressV2: {
    numAcceptedQuestions: { count: number; difficulty: string }[];
    numFailedQuestions: { count: number; difficulty: string }[];
    numUntouchedQuestions: { count: number; difficulty: string }[];
    userSessionBeatsPercentage: { difficulty: string; percentage: number }[];
  };
}

function toIsoFromEpochSeconds(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toISOString();
}

function toIsoFromEpochSecondsString(epochSeconds: string): string {
  const parsed = Number(epochSeconds);
  return Number.isFinite(parsed) ? toIsoFromEpochSeconds(parsed) : '';
}

function toBadge(raw: RawBadge | null | undefined): Badge {
  return Object.assign(new Badge(), {
    name: raw?.displayName ?? raw?.name ?? '',
    icon: raw?.icon ?? '',
  });
}

function toDifficultyCount(raw: RawDifficultyCount): DifficultyCount {
  return Object.assign(new DifficultyCount(), {
    difficulty: raw.difficulty,
    count: raw.count,
    submissions: raw.submissions ?? 0,
  });
}

function toSubmission(raw: RawSubmission): Submission {
  return Object.assign(new Submission(), {
    title: raw.title,
    titleSlug: raw.titleSlug,
    submittedAt: toIsoFromEpochSecondsString(raw.timestamp),
    statusDisplay: raw.statusDisplay,
    language: raw.lang,
  });
}

function toSkillTagCounts(
  entries: { tagName: string; tagSlug: string; problemsSolved: number }[],
): SkillTagCount[] {
  return entries.map((e) => Object.assign(new SkillTagCount(), e));
}

function findByDifficulty(
  counts: RawDifficultyCount[],
  difficulty: string,
): number {
  return counts.find((c) => c.difficulty === difficulty)?.count ?? 0;
}

/** LeetCode user-facing statistics: profile, badges, submissions, contests and progress. Stateless facade - every method is a static, self-contained round trip to leetcode.com/graphql. */
// biome-ignore lint/complexity/noStaticOnlyClass: static methods on a class are the Graftcode-recommended stateless facade shape.
export class LeetCodeUsers {
  static async getProfile(username: string): Promise<UserProfileSummary> {
    const data = await executeGraphQL<RawUserProfile>(userProfileQuery, {
      username,
    });
    const user = requireUser(data.matchedUser, username);

    return Object.assign(new UserProfileSummary(), {
      username: user.username,
      name: user.profile.realName ?? '',
      birthday: user.profile.birthday ?? '',
      avatarUrl: user.profile.userAvatar,
      ranking: user.profile.ranking,
      reputation: user.profile.reputation,
      contributionPoints: user.contributions.points,
      gitHubUrl: user.githubUrl ?? '',
      twitterUrl: user.twitterUrl ?? '',
      linkedInUrl: user.linkedinUrl ?? '',
      websites: user.profile.websites,
      country: user.profile.countryName ?? '',
      company: user.profile.company ?? '',
      school: user.profile.school ?? '',
      skillTags: user.profile.skillTags,
      aboutMe: user.profile.aboutMe,
    });
  }

  static async getBadges(username: string): Promise<UserBadges> {
    const data = await executeGraphQL<RawUserProfile>(userProfileQuery, {
      username,
    });
    const user = requireUser(data.matchedUser, username);

    return Object.assign(new UserBadges(), {
      badgeCount: user.badges.length,
      badges: user.badges.map(toBadge),
      upcomingBadges: user.upcomingBadges.map(toBadge),
      activeBadgeName: toBadge(user.activeBadge).name,
    });
  }

  static async getSolvedProblems(
    username: string,
  ): Promise<SolvedProblemsSummary> {
    const data = await executeGraphQL<RawUserProfile>(userProfileQuery, {
      username,
    });
    const user = requireUser(data.matchedUser, username);
    const accepted = user.submitStats.acSubmissionNum;

    return Object.assign(new SolvedProblemsSummary(), {
      totalSolved: findByDifficulty(accepted, 'All'),
      easySolved: findByDifficulty(accepted, 'Easy'),
      mediumSolved: findByDifficulty(accepted, 'Medium'),
      hardSolved: findByDifficulty(accepted, 'Hard'),
      acceptedByDifficulty: accepted.map(toDifficultyCount),
      submittedByDifficulty:
        user.submitStats.totalSubmissionNum.map(toDifficultyCount),
    });
  }

  static async getRecentSubmissions(
    username: string,
    limit: number,
  ): Promise<Submission[]> {
    const data = await executeGraphQL<RawSubmissionList>(submissionQuery, {
      username,
      limit,
    });
    return (data.recentSubmissionList ?? []).map(toSubmission);
  }

  static async getRecentAcceptedSubmissions(
    username: string,
    limit: number,
  ): Promise<Submission[]> {
    const data = await executeGraphQL<RawSubmissionList>(AcSubmissionQuery, {
      username,
      limit,
    });
    return (data.recentAcSubmissionList ?? []).map(toSubmission);
  }

  static async getSubmissionCalendar(
    username: string,
    year: number,
  ): Promise<SubmissionCalendar> {
    const data = await executeGraphQL<RawUserCalendar>(
      userProfileCalendarQuery,
      { username, year },
    );
    const calendar = requireUser(data.matchedUser, username).userCalendar;

    return Object.assign(new SubmissionCalendar(), {
      activeYears: calendar.activeYears,
      streak: calendar.streak,
      totalActiveDays: calendar.totalActiveDays,
      dailyCodingChallengeBadges: calendar.dccBadges.map((dcc) =>
        Object.assign(new DailyCodingChallengeBadge(), {
          earnedAt: toIsoFromEpochSeconds(dcc.timestamp),
          badgeName: dcc.badge.name,
          badgeIcon: dcc.badge.icon,
        }),
      ),
      submissionCalendarJson: calendar.submissionCalendar,
    });
  }

  static async getSkillStats(username: string): Promise<SkillStatsSummary> {
    const data = await executeGraphQL<RawSkillStats>(skillStatsQuery, {
      username,
    });
    const counts = requireUser(data.matchedUser, username).tagProblemCounts;

    return Object.assign(new SkillStatsSummary(), {
      fundamental: toSkillTagCounts(counts.fundamental),
      intermediate: toSkillTagCounts(counts.intermediate),
      advanced: toSkillTagCounts(counts.advanced),
    });
  }

  static async getLanguageStats(username: string): Promise<LanguageStat[]> {
    const data = await executeGraphQL<RawLanguageStats>(languageStatsQuery, {
      username,
    });
    return requireUser(data.matchedUser, username).languageProblemCount.map(
      (e) => Object.assign(new LanguageStat(), e),
    );
  }

  static async getProgress(username: string): Promise<ProgressSummary> {
    const data = await executeGraphQL<RawProgress>(userQuestionProgressQuery, {
      username,
    });
    const progress = data.userProfileUserQuestionProgressV2;

    const toTally = (
      entries: { count: number; difficulty: string }[],
    ): DifficultyTally[] =>
      entries.map((e) => Object.assign(new DifficultyTally(), e));
    const toPercentage = (
      entries: { difficulty: string; percentage: number }[],
    ): DifficultyPercentage[] =>
      entries.map((e) => Object.assign(new DifficultyPercentage(), e));

    return Object.assign(new ProgressSummary(), {
      accepted: toTally(progress.numAcceptedQuestions),
      failed: toTally(progress.numFailedQuestions),
      untouched: toTally(progress.numUntouchedQuestions),
      beatsPercentage: toPercentage(progress.userSessionBeatsPercentage),
    });
  }

  static async getContestSummary(username: string): Promise<ContestSummary> {
    const data = await executeGraphQL<RawContest>(contestQuery, { username });
    const ranking = data.userContestRanking;

    return Object.assign(new ContestSummary(), {
      attendedContestsCount: ranking?.attendedContestsCount ?? 0,
      rating: ranking?.rating ?? 0,
      globalRanking: ranking?.globalRanking ?? 0,
      totalParticipants: ranking?.totalParticipants ?? 0,
      topPercentage: ranking?.topPercentage ?? 0,
      badgeName: ranking?.badge?.name ?? '',
    });
  }

  static async getContestHistory(
    username: string,
  ): Promise<ContestHistoryEntry[]> {
    const data = await executeGraphQL<RawContest>(contestQuery, { username });

    return data.userContestRankingHistory.map((entry) =>
      Object.assign(new ContestHistoryEntry(), {
        contestTitle: entry.contest.title,
        startedAt: toIsoFromEpochSeconds(entry.contest.startTime),
        attended: entry.attended,
        rating: entry.rating,
        ranking: entry.ranking,
        trendDirection: entry.trendDirection,
        problemsSolved: entry.problemsSolved,
        totalProblems: entry.totalProblems,
        finishTimeInSeconds: entry.finishTimeInSeconds,
      }),
    );
  }
}

function requireUser<T>(matchedUser: T | null, username: string): T {
  if (matchedUser == null) {
    throw new Error(`LeetCode user "${username}" was not found`);
  }
  return matchedUser;
}
