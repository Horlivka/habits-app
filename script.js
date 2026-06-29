let input = document.querySelector("#input");
let addButton = document.querySelector("#addButton");
let allBtn = document.querySelector("#allBtn");
let activeBtn = document.querySelector("#activeBtn");
let completedBtn = document.querySelector("#completedBtn");
let clearBtn = document.querySelector("#clearBtn");

let list = document.querySelector("#habitsList");
let countHabits = document.querySelector("#countHabits");
let doneHabits = document.querySelector("#doneHabits");

let progressFill = document.querySelector("#progressFill");
let progressText = document.querySelector("#progressText");

let habits = [];
let filterHabits = "All";

function addHabit() {
  let habitText = input.value.trim();
  if (!habitText) {
    return;
  }
  habits.push({
    text: habitText,
    done: false,
    completedDate: [],
  });
  input.value = "";
  saveHabits();
  renderHabits();
}

function loadHabits() {
  let savedHabits = localStorage.getItem("habits");

  if (savedHabits) {
    habits = JSON.parse(savedHabits);
  } else {
    habits = [];
  }
}

function updateStatistics() {
  let totalHabits = habits.length;
  let completedHabits = habits.filter((habit) => habit.done).length;

  countHabits.textContent = "Total habits: " + totalHabits;
  doneHabits.textContent = "Completed: " + completedHabits;

  let progress =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);
  progressFill.style.width = progress + "%";
  progressText.textContent = progress + "%";
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
    visibleHabits = habits.filter((habit) => !habit.done);
  } else if (filterHabits === "Completed") {
    visibleHabits = habits.filter((habit) => habit.done);
  }
  
  return visibleHabits;
}

function renderHabits() {
  list.textContent = "";
  let visibleHabits = getVisibleHabits();

  for (let habit of visibleHabits) {
    let index = habits.indexOf(habit);

    let li = document.createElement("li");
    li.textContent = habit.text;

    if (habit.done) {
      li.classList.add("done");
    }

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function () {
      habits.splice(index, 1);

      saveHabits();
      renderHabits();
    });

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

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

    let doneBtn = document.createElement("button");
    doneBtn.textContent = habit.done ? "Undo" : "Done";

    doneBtn.addEventListener("click", function () {
      habit.done = !habit.done;
      saveHabits();
      renderHabits();
    });

    li.appendChild(doneBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

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
clearBtn.addEventListener("click", function () {
  habits = habits.filter((habit) => !habit.done);
  saveHabits();
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
