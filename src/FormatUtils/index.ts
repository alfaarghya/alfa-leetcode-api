import { userContest } from '../schema';
import { withSchema } from './formatter';
import { formatContestData as _formatContestData } from './userData';

export * from './problemData';
export * from './trendingTopicData';
export * from './userData';
export * from './userProfileData';

export const formatContestData = withSchema(userContest, _formatContestData);
