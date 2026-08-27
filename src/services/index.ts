/**
 * Graftcode surface for alfa-leetcode-api.
 *
 * Everything exported from this file is the public contract that Graftcode
 * Gateway (`gg`) turns into a strongly-typed client for any consumer
 * language - see GRAFTCODE.md. Keep this barrel to service classes and
 * plain DTOs only; nothing framework-specific, no custom error types.
 */

export {
  Badge,
  Contest,
  ContestHistoryEntry,
  ContestSummary,
  DailyCodingChallengeBadge,
  DifficultyCount,
  DifficultyPercentage,
  DifficultyTally,
  LanguageStat,
  ProblemDetail,
  ProblemListResult,
  ProblemSummary,
  ProblemTag,
  ProgressSummary,
  SkillStatsSummary,
  SkillTagCount,
  SolvedProblemsSummary,
  Submission,
  SubmissionCalendar,
  TopicTag,
  TrendingTopic,
  UserBadges,
  UserProfileSummary,
} from './dto';
export { LeetCodeContests } from './LeetCodeContests';
export { LeetCodeDiscussions } from './LeetCodeDiscussions';
export { LeetCodeProblems } from './LeetCodeProblems';
export { LeetCodeUsers } from './LeetCodeUsers';
