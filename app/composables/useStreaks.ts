import { eachDayOfInterval, format, isSameDay, subDays, parseISO, compareDesc } from 'date-fns';

export const useStreaks = () => {
    const calculateCurrentStreak = (dates: string[]) => {
        if (!dates.length) return 0;

        // Check if today or yesterday is completed to start the streak
        const today = new Date();
        const yesterday = subDays(today, 1);
        const todayStr = format(today, 'yyyy-MM-dd');
        const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

        let currentCheckDate = today;
        if (!dates.includes(todayStr)) {
            if (dates.includes(yesterdayStr)) {
                currentCheckDate = yesterday;
            } else {
                return 0;
            }
        }

        let count = 0;
        while (true) {
            if (dates.includes(format(currentCheckDate, 'yyyy-MM-dd'))) {
                count++;
                currentCheckDate = subDays(currentCheckDate, 1);
            } else {
                break;
            }
        }
        return count;
    };

    const calculateBestStreak = (dates: string[]) => {
        if (!dates.length) return 0;

        const sortedDates = [...dates].sort(); // Ascending
        let maxStreak = 0;
        let currentStreak = 0;
        let prevDate: Date | null = null;

        for (const dateStr of sortedDates) {
            const date = parseISO(dateStr);
            if (!prevDate) {
                currentStreak = 1;
            } else {
                const diff = (date.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);
                if (diff === 1) { // Consecutive day
                    currentStreak++;
                } else if (diff > 1) { // Gap found
                    maxStreak = Math.max(maxStreak, currentStreak);
                    currentStreak = 1;
                }
                // If diff === 0 (duplicate), do nothing
            }
            prevDate = date;
        }
        return Math.max(maxStreak, currentStreak);
    };

    return {
        calculateCurrentStreak,
        calculateBestStreak
    };
};
