import {
  input,
  categoryList,
  addButton,
  allBtn,
  activeBtn,
  completedBtn,
} from "./dom.js";
import { setActiveFilter } from "./logic.js";
import { habits, saveHabits, loadHabits, deleteHabit } from "./storage.js";
import { renderHabits } from "./render.js";

function addHabit() {
  const habitText = input.value.trim();

  if (!habitText) {
    return;
  }
  habits.push({
    id: crypto.randomUUID(),
    text: habitText,
    completedDates: [],
    category: categoryList.value,
  });
  input.value = "";
  saveHabits();
  renderHabits();
}

allBtn.addEventListener("click", function () {
  setActiveFilter("All");
  renderHabits();
});
activeBtn.addEventListener("click", function () {
  setActiveFilter("Active");
  renderHabits();
});
completedBtn.addEventListener("click", function () {
  setActiveFilter("Completed");
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
