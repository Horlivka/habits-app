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
  saveHabits();
  renderHabits();
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

function calculateProgress(habit) {
  let progress = Math.round((habit.completedDates.length / 30) * 100);
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

function renderHabits() {
  list.textContent = "";
  let visibleHabits = getVisibleHabits();
  let today = getTodayDate();

  for (let habit of visibleHabits) {
    let completedToday = isCompletedToday(habit);
    let index = habits.indexOf(habit);
    let habitInfo = document.createElement("div");
    habitInfo.classList.add("habitInfo");
    let habitTitle = document.createElement("h3");
    habitTitle.classList.add("habitTitle");
    let habitStreak = document.createElement("p");
    habitStreak.classList.add("habitStreak");
    let habitActions = document.createElement("div");
    habitActions.classList.add("habitActions");
    let habitProgressBar = document.createElement("div");
    habitProgressBar.classList.add("habitProgressBar");
    let habitProgressFill = document.createElement("div");
    habitProgressFill.classList.add("habitProgressFill");
    let habitPercentage = document.createElement("p");
    habitPercentage.classList.add("habitPercentage");
    let progressRow = document.createElement("div");
    progressRow.classList.add("progressRow");

    let li = document.createElement("li");
    habitTitle.textContent = habit.text;
    let streak = calculateStreak(habit);
    let dayWord = streak === 1 ? "day" : "days";

    habitStreak.textContent = ` ${streak} ${dayWord} streak `;
    if (completedToday) {
      li.classList.add("done");
    }

    let progress = calculateProgress(habit);
    habitPercentage.textContent = progress + "%";
    habitProgressFill.style.width = progress + "%";

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.textContent = "🗑";

    deleteBtn.addEventListener("click", function () {
      habits.splice(index, 1);

      saveHabits();
      renderHabits();
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

      saveHabits();
      renderHabits();
    });
    let habitCategory = document.createElement("p");

    habitCategory.classList.add("habitCategory");
    habitCategory.textContent = categories[habit.category] ?? "❓ Unknown";

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
      saveHabits();
      renderHabits();
    });

    habitInfo.appendChild(habitTitle);
    habitInfo.appendChild(habitCategory);
    habitInfo.appendChild(habitStreak);

    habitActions.appendChild(doneBtn);
    habitActions.appendChild(editBtn);
    habitActions.appendChild(deleteBtn);

    progressRow.appendChild(habitProgressBar);
    habitProgressBar.appendChild(habitProgressFill);
    progressRow.appendChild(habitPercentage);

    habitInfo.appendChild(progressRow);

    li.appendChild(habitInfo);
    li.appendChild(habitActions);
    list.appendChild(li);
   
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
