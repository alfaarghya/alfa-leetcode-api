import { allContestQuery } from '../GQLQueries';
import { executeGraphQL } from '../internal/graphqlClient';
import { Contest } from './dto';

interface RawContest {
  title: string;
  titleSlug: string;
  startTime: number;
  duration: number;
  isVirtual: boolean;
  containsPremium: boolean;
}

interface RawAllContests {
  allContests: RawContest[];
}

function toContest(raw: RawContest): Contest {
  return Object.assign(new Contest(), {
    title: raw.title,
    titleSlug: raw.titleSlug,
    startsAt: new Date(raw.startTime * 1000).toISOString(),
    durationSeconds: raw.duration,
    isVirtual: raw.isVirtual,
    containsPremium: raw.containsPremium,
  });
}

/** LeetCode contest schedule: full history plus the upcoming subset. */
// biome-ignore lint/complexity/noStaticOnlyClass: static methods on a class are the Graftcode-recommended stateless facade shape.
export class LeetCodeContests {
  static async getAllContests(): Promise<Contest[]> {
    const data = await executeGraphQL<RawAllContests>(allContestQuery, {});
    return data.allContests.map(toContest);
  }

  static async getUpcomingContests(): Promise<Contest[]> {
    const data = await executeGraphQL<RawAllContests>(allContestQuery, {});
    const nowEpochSeconds = Math.floor(Date.now() / 1000);
    return data.allContests
      .filter((contest) => contest.startTime > nowEpochSeconds)
      .map(toContest);
  }
}
