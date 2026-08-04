import {
  input,
  list,
  allBtn,
  activeBtn,
  completedBtn,
  progressFill,
  progressText,
  dashboardTotalHabits,
  dashboardCompletedToday,
  dashboardTotalCompletions,
  dashboardBestStreak,
  dashboardWeeklyProgress,
} from "./dom.js";
import {
  activeFilter,
  weekDays,
  categories,
  prepareHabitData,
  getVisibleHabits,
  getTotalHabits,
  getCompletedToday,
  calculatePercentage,
  getTotalCompletions,
  getBestStreak,
  getWeeklyProgress,
  DAYS_IN_PROGRESS,
  DAYS_IN_WEEK,
  formatDate,
  isCompletedToday,
  getTodayDate,
} from "./logic.js";
import {
  habits,
  deleteHabit,
  editHabit,
  toggleHabitComplete,
  saveHabits,
} from "./storage.js";

export function updateFilterButtons() {
  const buttons = [allBtn, activeBtn, completedBtn];

  for (const button of buttons) {
    button.classList.remove("done");
  }

  const filterButtons = {
    All: allBtn,
    Active: activeBtn,
    Completed: completedBtn,
  };
  filterButtons[activeFilter].classList.add("done");
}

export function updateStatistics() {
  const total = getTotalHabits(habits);
  const completed = getCompletedToday(habits);
  const progress = calculatePercentage(completed, total);

  progressFill.style.width = progress + "%";
  progressText.textContent = progress + "%";
}

export function updateDashboard() {
  const totalHabits = getTotalHabits(habits);
  const completedToday = getCompletedToday(habits);
  const totalCompletions = getTotalCompletions(habits);
  const bestStreak = getBestStreak(habits);
  const weeklyProgress = getWeeklyProgress(habits);

  dashboardTotalHabits.textContent = totalHabits;
  dashboardCompletedToday.textContent = completedToday;
  dashboardTotalCompletions.textContent = totalCompletions;
  dashboardBestStreak.textContent = bestStreak;
  dashboardWeeklyProgress.textContent = weeklyProgress + "%";
}

export function createProgressBar(progress) {
  const habitProgressBar = document.createElement("div");
  habitProgressBar.classList.add("habitProgressBar");

  const habitProgressFill = document.createElement("div");
  habitProgressFill.classList.add("habitProgressFill");

  const habitPercentage = document.createElement("p");
  habitPercentage.classList.add("habitPercentage");

  const progressRow = document.createElement("div");
  progressRow.classList.add("progressRow");

  habitPercentage.textContent = progress + "%";
  habitProgressFill.style.width = progress + "%";

  progressRow.appendChild(habitProgressBar);

  habitProgressBar.appendChild(habitProgressFill);

  progressRow.appendChild(habitPercentage);

  return progressRow;
}

export function createCalendar(habit) {
  const calendar = document.createElement("div");
  calendar.classList.add("habitCalendar");

  const today = getTodayDate();
  const currentDate = new Date();

  for (let i = 0; i < DAYS_IN_WEEK; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - (6 - i));
    const formattedDate = formatDate(date);
    const isCompleted = habit.completedDates.includes(formattedDate);

    const isToday = formattedDate === today;

    const day = document.createElement("div");
    day.classList.add("calendarDay");
    const weekDay = document.createElement("span");
    weekDay.classList.add("weekDay");
    const dayNumber = document.createElement("span");
    dayNumber.classList.add("dayNumber");

    const weekDayIndex = date.getDay();
    dayNumber.textContent = date.getDate();
    weekDay.textContent = weekDays[weekDayIndex];

    if (isCompleted) {
      day.classList.add("completedDay");
    }
    if (isToday) {
      day.classList.add("today");
    }

    day.addEventListener("click", function () {
      const isCompleted = habit.completedDates.includes(formattedDate);
      if (isCompleted) {
        habit.completedDates = habit.completedDates.filter(
          (completedDate) => completedDate !== formattedDate,
        );
      } else {
        habit.completedDates.push(formattedDate);
      }
      saveHabits();
      renderHabits();
    });
    day.appendChild(weekDay);
    day.appendChild(dayNumber);

    calendar.appendChild(day);
  }

  return calendar;
}

export function createActionButtons(habit) {
  const habitActions = document.createElement("div");
  habitActions.classList.add("habitActions");

  const completedToday = isCompletedToday(habit);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.ariaLabel = `Delete habit: ${habit.text}`;
  deleteBtn.textContent = "🗑";

  deleteBtn.addEventListener("click", () => {
    deleteHabit(habit.id);
    renderHabits();
  });

  const editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  editBtn.ariaLabel = `Edit habit: ${habit.text}`;
  editBtn.textContent = "🖉";

  editBtn.addEventListener("click", function () {
    editHabit(habit.id);
    renderHabits();
  });

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("completeBtn");
  doneBtn.ariaLabel = `Done habit: ${habit.text}`;
  doneBtn.textContent = "✓";

  if (completedToday) {
    doneBtn.classList.add("completed");
  }

  doneBtn.addEventListener("click", function () {
    toggleHabitComplete(habit.id);
    renderHabits();
  });

  habitActions.append(doneBtn, editBtn, deleteBtn);
  return habitActions;
}

export function createEmptyState(title, description) {
  const emptyState = document.createElement("div");

  emptyState.classList.add("emptyState");

  emptyState.innerHTML = `
    <div>🌱</div>
     <h3>${title}</h3>
    <p>${description}</p>
    <button class="emptyButton">
      Create habit
    </button>
  `;

  const button = emptyState.querySelector(".emptyButton");

  button.addEventListener("click", () => {
    input.focus();
  });

  return emptyState;
}

export function createHabitInfo(habit, streak) {
  const habitInfo = document.createElement("div");
  habitInfo.classList.add("habitInfo");

  const habitTitle = document.createElement("h3");
  habitTitle.classList.add("habitTitle");
  habitTitle.textContent = habit.text;

  const habitCategory = document.createElement("p");
  habitCategory.classList.add("habitCategory");
  habitCategory.textContent = categories[habit.category] ?? "❓ Unknown";

  const habitStreak = document.createElement("p");
  habitStreak.classList.add("habitStreak");

  const dayWord = streak === 1 ? "day" : "days";

  habitStreak.textContent = ` ${streak} ${dayWord} streak `;

  habitInfo.appendChild(habitTitle);
  habitInfo.appendChild(habitCategory);
  habitInfo.appendChild(habitStreak);
  return habitInfo;
}

export function createHabitCard(habit) {
  const data = prepareHabitData(habit);
  const info = createHabitInfo(habit, data.streak);
  const progressRow = createProgressBar(data.progress);
  const calendar = createCalendar(habit);
  const habitActions = createActionButtons(habit);

  const li = document.createElement("li");

  if (data.completedToday) {
    li.classList.add("done");
  }

  info.appendChild(progressRow);
  info.appendChild(calendar);

  li.appendChild(info);
  li.appendChild(habitActions);
  return li;
}

export function renderHabits() {
  list.textContent = "";

  const visibleHabits = getVisibleHabits(habits);

  if (visibleHabits.length === 0) {
    if (habits.length === 0) {
      list.appendChild(
        createEmptyState(
          "No habits yet",
          "Start building your first habit today",
        ),
      );
    } else {
      list.appendChild(
        createEmptyState("No habits found", "Try changing your filter"),
      );
    }
  } else {
    for (let habit of visibleHabits) {
      const card = createHabitCard(habit);
      list.appendChild(card);
    }
  }

  updateFilterButtons();
  updateStatistics();
  updateDashboard();
}
