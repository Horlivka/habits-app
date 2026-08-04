import { getTodayDate, isCompletedToday } from "./logic.js";

export let habits = [];

export function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

export function deleteHabit(id) {
  const isConfirmed = confirm("Are you sure you want to delete this habit?");

  if (!isConfirmed) {
    return;
  }
  habits = habits.filter((habit) => habit.id !== id);

  saveHabits();
}


export function toggleHabitComplete(id) {
  const habit = habits.find((habit) => habit.id === id);

  if (!habit) return;

  const today = getTodayDate();

  if (isCompletedToday(habit)) {
    habit.completedDates = habit.completedDates.filter(
      (date) => date !== today,
    );
  } else {
    habit.completedDates.push(today);
  }

  saveHabits();
}

export function editHabit(id) {
  const habit = habits.find((habit) => habit.id === id);

  if (!habit) return;
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
}

export function loadHabits() {
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
      id: habit.id ?? crypto.randomUUID(),
    }));
  } catch (error) {
    habits = [];
  }
}