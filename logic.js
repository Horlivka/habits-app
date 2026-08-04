
export const categories = {
  learning: "📚 Learning",
  health: "💪 Health",
  work: "💼 Work",
  home: "🏠 Home",
  personal: "🎯 Personal",
};
export let activeFilter = "All";
export const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

export const DAYS_IN_PROGRESS = 30;
export const DAYS_IN_WEEK = 7;

export const getCompletionsBetweenDates = (habit, startDate, endDate) => {
  return habit.completedDates.filter((date) => {
    const completed = new Date(date);

    return completed >= startDate && completed <= endDate;
  }).length;
};

export function prepareHabitData(habit) {
  return {
    habit,
    completedToday: isCompletedToday(habit),
    streak: calculateStreak(habit),
    progress: calculateProgress(habit),
  };
}

export function setActiveFilter(filter) {
  activeFilter = filter;
}

export function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export function isCompletedToday(habit) {
  const today = getTodayDate();
  return habit.completedDates.includes(today);
}

export function getTodayDate() {
  return formatDate(new Date());
}

export function getTotalHabits(habits) {
  return habits.length;
}

export function getCompletedToday(habits) {
  return habits.filter((habit) => isCompletedToday(habit)).length;
}

export function calculatePercentage(completed, total) {
  if (total === 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}

export function getLast30DaysCompletions(habit) {
  const today = new Date();
  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - (DAYS_IN_PROGRESS - 1));

  return getCompletionsBetweenDates(habit, thirtyDaysAgo, today);
}

export function calculateProgress(habit) {
  const progress = Math.round(
    (getLast30DaysCompletions(habit) / DAYS_IN_PROGRESS) * 100,
  );
  return Math.min(progress, 100);
}

export function getVisibleHabits(habits) {
  if (activeFilter === "Active") {
    return habits.filter((habit) => !isCompletedToday(habit));
  }

  if (activeFilter === "Completed") {
    return habits.filter((habit) => isCompletedToday(habit));
  }

  return habits;
}

export function getTotalCompletions(habits) {
  return habits.reduce((sum, habit) => {
    return sum + habit.completedDates.length;
  }, 0);
}

export function getBestStreak(habits) {
  let bestStreak = 0;
  for (const habit of habits) {
    const streak = calculateStreak(habit);

    if (streak > bestStreak) {
      bestStreak = streak;
    }
  }
  return bestStreak;
}

export function getWeeklyProgress(habits) {
  let count = 0;

  const today = new Date();

  const weekAgo = new Date();

  weekAgo.setDate(weekAgo.getDate() - (DAYS_IN_WEEK - 1));

  for (const habit of habits) {
    count += getCompletionsBetweenDates(habit, weekAgo, today);
  }
  const possible = habits.length * DAYS_IN_WEEK;

  if (possible === 0) {
    return 0;
  }
  return Math.round((count / possible) * 100);
}

export function calculateStreak(habit) {
  let streak = 0;
  const currentDate = new Date();
  while (habit.completedDates.includes(formatDate(currentDate))) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}
