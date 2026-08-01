let input = document.querySelector("#input");
let categoryList = document.querySelector("#categoryList");
let addButton = document.querySelector("#addButton");

let allBtn = document.querySelector("#allBtn");
let activeBtn = document.querySelector("#activeBtn");
let completedBtn = document.querySelector("#completedBtn");

let list = document.querySelector("#habitsList");

let progressFill = document.querySelector("#progressFill");
let progressText = document.querySelector("#progressText");

const dashboardTotalHabits = document.querySelector("#dashboardTotalHabits");
const dashboardCompletedToday = document.querySelector(
  "#dashboardCompletedToday",
);
const dashboardTotalCompletions = document.querySelector(
  "#dashboardTotalCompletions",
);
const dashboardBestStreak = document.querySelector("#dashboardBestStreak");
const dashboardWeeklyProgress = document.querySelector(
  "#dashboardWeeklyProgress",
);

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const DAYS_IN_PROGRESS = 30;
const DAYS_IN_WEEK = 7;

const getCompletionsBetweenDates = (habit, startDate, endDate) => {
  return habit.completedDates.filter((date) => {
    const completed = new Date(date);

    return completed >= startDate && completed <= endDate;
  }).length;
};

let habits = [];
const categories = {
  learning: "📚 Learning",
  health: "💪 Health",
  work: "💼 Work",
  home: "🏠 Home",
  personal: "🎯 Personal",
};
let activeFilter = "All";

function addHabit() {
  const habitText = input.value.trim();

  if (!habitText) {
    return;
  }
  habits.push({
    id: Date.now(),
    text: habitText,
    completedDates: [],
    category: categoryList.value,
  });
  input.value = "";
  saveAndRender();
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function calculateStreak(habit) {
  let streak = 0;
  const currentDate = new Date();
  while (habit.completedDates.includes(formatDate(currentDate))) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

function isCompletedToday(habit) {
  const today = getTodayDate();
  return habit.completedDates.includes(today);
}

function getTodayDate() {
  return formatDate(new Date());
}

function loadHabits() {
  const savedHabits = localStorage.getItem("habits");

  if (!savedHabits) {
    habits = [];
    return;
  }

  try {
    habits = JSON.parse(savedHabits);

    habits = habits.map((habit) => ({
      ...habit,
      completedDates: habit.completedDates ?? [],
      category: habit.category ?? "personal",
    }));
  } catch (error) {
    habits = [];
  }
}

function getTotalHabits(habits) {
  return habits.length;
}

function getCompletedToday(habits) {
  return habits.filter((habit) => isCompletedToday(habit)).length;
}

function calculatePercentage(completed, total) {
  if (total === 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}

function updateStatistics() {
  const total = getTotalHabits(habits);
  const completed = getCompletedToday(habits);
  const progress = calculatePercentage(completed, total);

  progressFill.style.width = progress + "%";
  progressText.textContent = progress + "%";
}

function getLast30DaysCompletions(habit) {
  const today = new Date();
  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - (DAYS_IN_PROGRESS - 1));

  return getCompletionsBetweenDates(habit, thirtyDaysAgo, today);
}

function calculateProgress(habit) {
  const progress = Math.round(
    (getLast30DaysCompletions(habit) / DAYS_IN_PROGRESS) * 100,
  );
  return Math.min(progress, 100);
}

function updateFilterButtons() {
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

function getVisibleHabits() {
  if (activeFilter === "Active") {
    return habits.filter((habit) => !isCompletedToday(habit));
  }

  if (activeFilter === "Completed") {
    return habits.filter((habit) => isCompletedToday(habit));
  }

  return habits;
}

function createProgressBar(habit) {
  const habitProgressBar = document.createElement("div");
  habitProgressBar.classList.add("habitProgressBar");

  const habitProgressFill = document.createElement("div");
  habitProgressFill.classList.add("habitProgressFill");

  const habitPercentage = document.createElement("p");
  habitPercentage.classList.add("habitPercentage");

  const progressRow = document.createElement("div");
  progressRow.classList.add("progressRow");

  const progress = calculateProgress(habit);

  habitPercentage.textContent = progress + "%";
  habitProgressFill.style.width = progress + "%";

  progressRow.appendChild(habitProgressBar);
  habitProgressBar.appendChild(habitProgressFill);
  progressRow.appendChild(habitPercentage);

  return progressRow;
}

function createCalendar(habit) {
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
      updateHabits();
    });
    day.appendChild(weekDay);
    day.appendChild(dayNumber);

    calendar.appendChild(day);
  }

  return calendar;
}

function saveAndRender() {
  saveHabits();
  renderHabits();
}

function deleteHabit(id) {
  const isConfirmed = confirm("Are you sure you want to delete this habit?");

  if (!isConfirmed) {
    return;
  }
  habits = habits.filter((habit) => habit.id !== id);
  saveAndRender();
}

function toggleHabitComplete(habit) {
  const today = getTodayDate();

  if (isCompletedToday(habit)) {
    habit.completedDates = habit.completedDates.filter(
      (date) => date !== today,
    );
  } else {
    habit.completedDates.push(today);
  }

  saveAndRender();
}

function editHabit(habit) {
  let newHabitText = prompt("Edit the habit", habit.text);
  if (newHabitText === null) {
    return;
  }
  newHabitText = newHabitText.trim();

  if (newHabitText === "") {
    return;
  }

  habit.text = newHabitText;

  saveAndRender();
}

function createActionButtons(habit) {
  const habitActions = document.createElement("div");
  habitActions.classList.add("habitActions");

  const completedToday = isCompletedToday(habit);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.textContent = "🗑";

  deleteBtn.addEventListener("click", () => {
    deleteHabit(habit.id);
  });

  const editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  editBtn.textContent = "🖉";

  editBtn.addEventListener("click", function () {
    editHabit(habit);
  });

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("completeBtn");
  doneBtn.textContent = "✓";

  if (completedToday) {
    doneBtn.classList.add("completed");
  }

  doneBtn.addEventListener("click", function () {
    toggleHabitComplete(habit);
  });

  habitActions.appendChild(doneBtn);
  habitActions.appendChild(deleteBtn);
  habitActions.appendChild(editBtn);
  return habitActions;
}

function createEmptyState(title, description) {
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

function createHabitCard(habit) {
  const completedToday = isCompletedToday(habit);

  const progressRow = createProgressBar(habit);
  const calendar = createCalendar(habit);
  const habitActions = createActionButtons(habit);

  const habitInfo = document.createElement("div");
  habitInfo.classList.add("habitInfo");

  const habitTitle = document.createElement("h3");
  habitTitle.classList.add("habitTitle");

  const habitStreak = document.createElement("p");
  habitStreak.classList.add("habitStreak");

  const li = document.createElement("li");
  habitTitle.textContent = habit.text;

  const streak = calculateStreak(habit);
  const dayWord = streak === 1 ? "day" : "days";

  habitStreak.textContent = ` ${streak} ${dayWord} streak `;
  if (completedToday) {
    li.classList.add("done");
  }

  const habitCategory = document.createElement("p");

  habitCategory.classList.add("habitCategory");
  habitCategory.textContent = categories[habit.category] ?? "❓ Unknown";

  habitInfo.appendChild(habitTitle);
  habitInfo.appendChild(habitCategory);
  habitInfo.appendChild(habitStreak);
  habitInfo.appendChild(progressRow);
  habitInfo.appendChild(calendar);

  li.appendChild(habitInfo);
  li.appendChild(habitActions);
  return li;
}

function renderHabits() {
  list.textContent = "";

  const visibleHabits = getVisibleHabits();

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

function getTotalCompletions(habits) {
  return habits.reduce((sum, habit) => {
    return sum + habit.completedDates.length;
  }, 0);
}

function getBestStreak(habits) {
  let bestStreak = 0;
  for (const habit of habits) {
    const streak = calculateStreak(habit);

    if (streak > bestStreak) {
      bestStreak = streak;
    }
  }
  return bestStreak;
}

function getWeeklyProgress(habits) {
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

function updateDashboard() {
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

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

allBtn.addEventListener("click", function () {
  activeFilter = "All";
  renderHabits();
});
activeBtn.addEventListener("click", function () {
  activeFilter = "Active";
  renderHabits();
});
completedBtn.addEventListener("click", function () {
  activeFilter = "Completed";
  renderHabits();
});

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addHabit();
  }
});

addButton.addEventListener("click", addHabit);
loadHabits();
renderHabits();
