let input = document.querySelector("#input");
let categoryList = document.querySelector("#categoryList");
let addButton = document.querySelector("#addButton");

let allBtn = document.querySelector("#allBtn");
let activeBtn = document.querySelector("#activeBtn");
let completedBtn = document.querySelector("#completedBtn");

let list = document.querySelector("#habitsList");
let countHabits = document.querySelector("#countHabits");
let doneHabits = document.querySelector("#doneHabits");

let progressFill = document.querySelector("#progressFill");
let progressText = document.querySelector("#progressText");

let weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const DAYS_IN_PROGRESS = 30;

let habits = [];
const categories = {
  learning: "📚 Learning",
  health: "💪 Health",
  work: "💼 Work",
  home: "🏠 Home",
  personal: "🎯 Personal",
};
let filterHabits = "All";

function addHabit() {
  let habitText = input.value.trim();

  if (!habitText) {
    return;
  }
  habits.push({
    text: habitText,
    completedDates: [],
    category: categoryList.value,
  });
  input.value = "";
  updateHabits();
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function calculateStreak(habit) {
  let streak = 0;
  let currentDate = new Date();
  while (habit.completedDates.includes(formatDate(currentDate))) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

function isCompletedToday(habit) {
  let today = getTodayDate();
  return habit.completedDates.includes(today);
}

function getTodayDate() {
  return formatDate(new Date());
}

function loadHabits() {
  let savedHabits = localStorage.getItem("habits");

  if (savedHabits) {
    habits = JSON.parse(savedHabits);

    habits = habits.map((habit) => {
      if (!habit.completedDates) {
        habit.completedDates = [];
      }
      if (!habit.category) {
        habit.category = "personal";
      }

      return habit;
    });
  } else {
    habits = [];
  }
}

function updateStatistics() {
  let totalHabits = habits.length;
  let completedHabits = habits.filter((habit) =>
    isCompletedToday(habit),
  ).length;

  countHabits.textContent = "Total habits: " + totalHabits;
  doneHabits.textContent = "Completed today: " + completedHabits;

  let progress =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);
  progressFill.style.width = progress + "%";
  progressText.textContent = progress + "%";
}

function getLast30DaysCompletions(habit) {
  let today = new Date();
  let thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - DAYS_IN_PROGRESS);
  let count = 0;
  for (let completedDate of habit.completedDates) {
    let completed = new Date(completedDate);
    if (completed >= thirtyDaysAgo && completed <= today) {
      count++;
    }
  }
  return count;
}

function calculateProgress(habit) {
  let progress = Math.round(
    (getLast30DaysCompletions(habit) / DAYS_IN_PROGRESS) * 100,
  );
  return Math.min(progress, 100);
}

function updateFilterButtons() {
  let buttons = [allBtn, activeBtn, completedBtn];

  for (let button of buttons) {
    button.classList.remove("done");
  }

  let filterButtons = {
    All: allBtn,
    Active: activeBtn,
    Completed: completedBtn,
  };
  filterButtons[filterHabits].classList.add("done");
}

function getVisibleHabits() {
  let visibleHabits = [...habits];

  if (filterHabits === "Active") {
    visibleHabits = habits.filter((habit) => !isCompletedToday(habit));
  } else if (filterHabits === "Completed") {
    visibleHabits = habits.filter((habit) => isCompletedToday(habit));
  }

  return visibleHabits;
}

function createProgressBar(habit) {
  let habitProgressBar = document.createElement("div");
  habitProgressBar.classList.add("habitProgressBar");

  let habitProgressFill = document.createElement("div");
  habitProgressFill.classList.add("habitProgressFill");

  let habitPercentage = document.createElement("p");
  habitPercentage.classList.add("habitPercentage");

  let progressRow = document.createElement("div");
  progressRow.classList.add("progressRow");

  let progress = calculateProgress(habit);

  habitPercentage.textContent = progress + "%";
  habitProgressFill.style.width = progress + "%";

  progressRow.appendChild(habitProgressBar);
  habitProgressBar.appendChild(habitProgressFill);
  progressRow.appendChild(habitPercentage);

  return progressRow;
}

function createCalendar(habit) {
  let calendar = document.createElement("div");
  calendar.classList.add("habitCalendar");

  let today = getTodayDate();
  let currentDate = new Date();

  for (let i = 0; i < 7; i++) {
    let date = new Date(currentDate);
    date.setDate(date.getDate() - (6 - i));
    let formattedDate = formatDate(date);
    let isCompleted = habit.completedDates.includes(formattedDate);

    let isToday = formattedDate === today;

    let day = document.createElement("div");
    day.classList.add("calendarDay");
    let weekDay = document.createElement("span");
    weekDay.classList.add("weekDay");
    let dayNumber = document.createElement("span");
    dayNumber.classList.add("dayNumber");

    let weekDayIndex = date.getDay();
    dayNumber.textContent = date.getDate();
    weekDay.textContent = weekDays[weekDayIndex];

    if (isCompleted) {
      day.classList.add("completedDay");
    }
    if (isToday) {
      day.classList.add("today");
    }

    day.addEventListener("click", function () {
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

function updateHabits() {
  saveHabits();
  renderHabits();
}

function createActionButtons(index, habit) {
  let habitActions = document.createElement("div");
  habitActions.classList.add("habitActions");
  let today = getTodayDate();
  let completedToday = isCompletedToday(habit);

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.textContent = "🗑";

  deleteBtn.addEventListener("click", function () {
    habits.splice(index, 1);

    updateHabits();
  });

  let editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  editBtn.textContent = "🖉";

  editBtn.addEventListener("click", function () {
    let newHabitText = prompt("Edit the habit", habit.text);
    if (newHabitText === null) {
      return;
    }
    newHabitText = newHabitText.trim();

    if (newHabitText === "") {
      return;
    }

    habit.text = newHabitText;

    updateHabits();
  });
  let doneBtn = document.createElement("button");
  doneBtn.classList.add("completeBtn");

  if (completedToday) {
    doneBtn.classList.add("completed");
  }

  doneBtn.addEventListener("click", function () {
    if (completedToday) {
      habit.completedDates = habit.completedDates.filter(
        (date) => date !== today,
      );
    } else {
      habit.completedDates.push(today);
    }
    updateHabits();
  });

  habitActions.appendChild(doneBtn);
  habitActions.appendChild(deleteBtn);
  habitActions.appendChild(editBtn);
  return habitActions;
}

function createHabitCard(habit) {
  let completedToday = isCompletedToday(habit);
  let index = habits.indexOf(habit);

  let progressRow = createProgressBar(habit);
  let calendar = createCalendar(habit);
  let habitActions = createActionButtons(index, habit);

  let habitInfo = document.createElement("div");
  habitInfo.classList.add("habitInfo");

  let habitTitle = document.createElement("h3");
  habitTitle.classList.add("habitTitle");

  let habitStreak = document.createElement("p");
  habitStreak.classList.add("habitStreak");

  let li = document.createElement("li");
  habitTitle.textContent = habit.text;

  let streak = calculateStreak(habit);
  let dayWord = streak === 1 ? "day" : "days";

  habitStreak.textContent = ` ${streak} ${dayWord} streak `;
  if (completedToday) {
    li.classList.add("done");
  }

  let habitCategory = document.createElement("p");

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
  let visibleHabits = getVisibleHabits();

  for (let habit of visibleHabits) {
    let card = createHabitCard(habit);
    list.appendChild(createHabitCard(habit));
  }

  updateFilterButtons();
  updateStatistics();
}

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

allBtn.addEventListener("click", function () {
  filterHabits = "All";
  renderHabits();
});
activeBtn.addEventListener("click", function () {
  filterHabits = "Active";
  renderHabits();
});
completedBtn.addEventListener("click", function () {
  filterHabits = "Completed";
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
