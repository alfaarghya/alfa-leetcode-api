/**
 * DTOs exposed on the Graftcode surface (see `src/services`).
 *
 * Per the Graftcode rules for public method signatures: primitives, strings,
 * plain arrays of those, and plain nested DTOs composed of the same — no
 * `object`/`unknown`, no index signatures, no `Map`/`Set`.
 *
 * These are declared as plain classes with default-initialized fields
 * (rather than `interface`) on purpose: a TypeScript `interface` is erased
 * at compile time and leaves no runtime trace, so Graftcode Gateway's
 * module analyzer cannot resolve its field names/types and falls back to
 * `any`. A class with default field values compiles to real field
 * assignments the analyzer can introspect, which is what turns each of
 * these into its own fully-typed entry in the generated contract. None of
 * these classes carry behavior or hidden state - they are pure data.
 *
 * Timestamps that LeetCode returns as unix-epoch seconds are converted to
 * ISO-8601 strings here so the contract stays cross-language friendly.
 */

export class Badge {
  name: string = '';
  icon: string = '';
}

export class UserProfileSummary {
  username: string = '';
  name: string = '';
  birthday: string = '';
  avatarUrl: string = '';
  ranking: number = 0;
  reputation: number = 0;
  contributionPoints: number = 0;
  gitHubUrl: string = '';
  twitterUrl: string = '';
  linkedInUrl: string = '';
  websites: string[] = [];
  country: string = '';
  company: string = '';
  school: string = '';
  skillTags: string[] = [];
  aboutMe: string = '';
}

export class UserBadges {
  badgeCount: number = 0;
  badges: Badge[] = [];
  upcomingBadges: Badge[] = [];
  activeBadgeName: string = '';
}

export class DifficultyCount {
  difficulty: string = '';
  count: number = 0;
  submissions: number = 0;
}

export class SolvedProblemsSummary {
  totalSolved: number = 0;
  easySolved: number = 0;
  mediumSolved: number = 0;
  hardSolved: number = 0;
  acceptedByDifficulty: DifficultyCount[] = [];
  submittedByDifficulty: DifficultyCount[] = [];
}

export class Submission {
  title: string = '';
  titleSlug: string = '';
  submittedAt: string = '';
  statusDisplay: string = '';
  language: string = '';
}

export class DailyCodingChallengeBadge {
  earnedAt: string = '';
  badgeName: string = '';
  badgeIcon: string = '';
}

export class SubmissionCalendar {
  activeYears: number[] = [];
  streak: number = 0;
  totalActiveDays: number = 0;
  dailyCodingChallengeBadges: DailyCodingChallengeBadge[] = [];
  submissionCalendarJson: string = '';
}

export class SkillTagCount {
  tagName: string = '';
  tagSlug: string = '';
  problemsSolved: number = 0;
}

export class SkillStatsSummary {
  fundamental: SkillTagCount[] = [];
  intermediate: SkillTagCount[] = [];
  advanced: SkillTagCount[] = [];
}

export class LanguageStat {
  languageName: string = '';
  problemsSolved: number = 0;
}

export class DifficultyTally {
  difficulty: string = '';
  count: number = 0;
}

export class DifficultyPercentage {
  difficulty: string = '';
  percentage: number = 0;
}

export class ProgressSummary {
  accepted: DifficultyTally[] = [];
  failed: DifficultyTally[] = [];
  untouched: DifficultyTally[] = [];
  beatsPercentage: DifficultyPercentage[] = [];
}

export class ContestSummary {
  attendedContestsCount: number = 0;
  rating: number = 0;
  globalRanking: number = 0;
  totalParticipants: number = 0;
  topPercentage: number = 0;
  badgeName: string = '';
}

export class ContestHistoryEntry {
  contestTitle: string = '';
  startedAt: string = '';
  attended: boolean = false;
  rating: number = 0;
  ranking: number = 0;
  trendDirection: string = '';
  problemsSolved: number = 0;
  totalProblems: number = 0;
  finishTimeInSeconds: number = 0;
}

export class TopicTag {
  name: string = '';
  slug: string = '';
}

export class ProblemDetail {
  problemUrl: string = '';
  questionId: string = '';
  questionFrontendId: string = '';
  title: string = '';
  titleSlug: string = '';
  difficulty: string = '';
  isPaidOnly: boolean = false;
  contentHtml: string = '';
  exampleTestcases: string = '';
  topicTags: TopicTag[] = [];
  hints: string[] = [];
  companyTagStatsJson: string = '';
  similarQuestionsJson: string = '';
  likes: number = 0;
  dislikes: number = 0;
  publishedAt: string = '';
}

export class ProblemSummary {
  questionFrontendId: string = '';
  title: string = '';
  titleSlug: string = '';
  difficulty: string = '';
  isPaidOnly: boolean = false;
  acceptanceRate: number = 0;
  topicTags: TopicTag[] = [];
  hasSolution: boolean = false;
  hasVideoSolution: boolean = false;
}

export class ProblemListResult {
  totalCount: number = 0;
  problems: ProblemSummary[] = [];
}

export class ProblemTag {
  name: string = '';
  slug: string = '';
}

export class Contest {
  title: string = '';
  titleSlug: string = '';
  startsAt: string = '';
  durationSeconds: number = 0;
  isVirtual: boolean = false;
  containsPremium: boolean = false;
}

export class TrendingTopic {
  topicId: number = 0;
  title: string = '';
  postId: number = 0;
  postedAt: string = '';
  contentPreview: string = '';
  authorUsername: string = '';
  authorIsActive: boolean = false;
  authorAvatarUrl: string = '';
}
