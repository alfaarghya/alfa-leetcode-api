export const streakCounterQuery = `
    query streakCounter {
        streakCounter {
            streakCount
            daysSkipped
            currentDayCompleted
        }
    }
`;
