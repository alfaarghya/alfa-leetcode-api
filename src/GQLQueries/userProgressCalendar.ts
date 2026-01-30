export const userProgressCalendarQuery = `query userProgressCalendarV2(
  $queryType: ProgressCalendarQueryTypeEnum!
  $year: Int!
  $month: Int
  $groupByWeek: Boolean
) {
  userProgressCalendarV2(
    queryType: $queryType
    year: $year
    month: $month
    groupByWeek: $groupByWeek
  ) {
    dateSolvedInfoWithinMonth {
      date
      easySolvedNum
      mediumSolvedNum
      hardSolvedNum
    }

    dateSubmissionNumWithinMonth {
      date
      numSubmitted
    }

    monthSolvedInfoWithinYear {
      month
      easySolvedNum
      mediumSolvedNum
      hardSolvedNum
    }

    monthSubmissionNumWithinYear {
      month
      numSubmitted
    }

    weekSolvedInfoWithinMonth {
      weekStartDate
      easySolvedNum
      mediumSolvedNum
      hardSolvedNum
    }

    weekSubmissionNumWithinMonth {
      weekStartDate
      numSubmitted
    }
  }
}
`;
