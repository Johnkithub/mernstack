document.addEventListener("DOMContentLoaded", () => {

  const button = document.querySelector(".play-btn");
  const goalsContent = document.getElementById("goalsContent");
  const addBtn = document.getElementById("addGoalBtn");
  const modal = document.getElementById("goalModal");
  const saveBtn = document.getElementById("saveGoal");

  const customSelect = document.getElementById("customSelect");
  const selected = customSelect.querySelector(".select-selected");
  const options = customSelect.querySelector(".select-options");

  let selectedValue = "";

  goalsContent.style.display = "none";

  button.addEventListener("click", () => {
    goalsContent.style.display = "block";
    button.style.display = "none";
    showTodayDate();
    loadGoals();
  });

  addBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  // ==========================
// CUSTOM SELECT FIXED
// ==========================

selected.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent document click
  options.classList.toggle("hidden");
});

options.querySelectorAll("div").forEach(option => {
  option.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent bubbling
    selected.textContent = option.textContent;
    selectedValue = option.dataset.value;
    options.classList.add("hidden");
  });
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!customSelect.contains(e.target)) {
    options.classList.add("hidden");
  }
});

  saveBtn.addEventListener("click", async () => {

    const title = document.getElementById("newTitle").value.trim();

    if (!title || !selectedValue) {
      alert("Fill all fields");
      return;
    }

    const response = await fetch("http://localhost:3000/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        type: selectedValue,
        completed: false
      })
    });

    if (response.ok) {
      modal.classList.add("hidden");
      document.getElementById("newTitle").value = "";
      selected.textContent = "Select Category";
      selectedValue = "";
      loadGoals();
    }

  });

});


async function loadGoals() {

  const response = await fetch("http://localhost:3000/goals");
  const data = await response.json();

  const booksList = document.getElementById("booksList");
  const projectsList = document.getElementById("projectsList");
  const skillsCard = document.getElementById("skillsCard");

  booksList.innerHTML = "";
  projectsList.innerHTML = "";

  document.querySelectorAll(".dynamic-category").forEach(el => el.remove());

  const categoryMap = {};

  data.forEach(goal => {

    const type = goal.type.toLowerCase();

    if (type === "book") {
      appendToList(booksList, goal);
      return;
    }

    if (type === "project") {
      appendToList(projectsList, goal);
      return;
    }

    if (!categoryMap[type]) {

      const newCard = document.createElement("div");
      newCard.classList.add("glass-card", "dynamic-category");

      newCard.innerHTML = `
        <div class="card-header">
          <h2>${goal.type}</h2>
          <span class="edit-toggle">Edit</span>
        </div>
        <ul></ul>
      `;

      skillsCard.parentNode.insertBefore(newCard, skillsCard);

      categoryMap[type] = newCard.querySelector("ul");
      attachEditToggle(newCard);
    }

    appendToList(categoryMap[type], goal);
  });

  document.querySelectorAll(".glass-card").forEach(card => {
    if (card.querySelector(".edit-toggle")) {
      attachEditToggle(card);
    }
  });
}


function appendToList(list, goal) {

  const wrapper = document.createElement("div");
  wrapper.classList.add("task-item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = goal.completed;

  checkbox.addEventListener("change", () => {
    updateGoal(goal.id, checkbox.checked);
  });

  const li = document.createElement("li");
  li.textContent = goal.title;
  if (goal.completed) li.classList.add("completed");

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "−";
  removeBtn.style.display = "none";

  removeBtn.addEventListener("click", async (e) => {
    e.stopPropagation();

    const response = await fetch(`http://localhost:3000/goals/${goal.id}`, {
      method: "DELETE"
    });

    if (response.ok) loadGoals();
  });

  wrapper.appendChild(checkbox);
  wrapper.appendChild(li);
  wrapper.appendChild(removeBtn);

  list.appendChild(wrapper);
}


function attachEditToggle(card) {

  const editBtn = card.querySelector(".edit-toggle");

  if (editBtn.dataset.listenerAttached) return;
  editBtn.dataset.listenerAttached = "true";

  editBtn.addEventListener("click", () => {

    const removeButtons = card.querySelectorAll(".remove-btn");
    const isEditing = editBtn.textContent === "Done";

    editBtn.textContent = isEditing ? "Edit" : "Done";

    removeButtons.forEach(btn => {
      btn.style.display = isEditing ? "none" : "flex";
    });

  });
}


async function updateGoal(id, completed) {
  await fetch(`http://localhost:3000/goals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });
}


function showTodayDate() {
  const today = new Date();
  const todayDate = document.getElementById("todayDate");
  todayDate.innerText = today.toDateString();
  todayDate.style.display = "block";
}document.addEventListener("DOMContentLoaded", () => {

  const button = document.querySelector(".play-btn");
  const goalsContent = document.getElementById("goalsContent");
  const addBtn = document.getElementById("addGoalBtn");
  const modal = document.getElementById("goalModal");
  const saveBtn = document.getElementById("saveGoal");

  const customSelect = document.getElementById("customSelect");
  const selected = customSelect.querySelector(".select-selected");
  const options = customSelect.querySelector(".select-options");

  let selectedValue = "";

  goalsContent.style.display = "none";

  button.addEventListener("click", () => {
    goalsContent.style.display = "block";
    button.style.display = "none";
    showTodayDate();
    loadGoals();
  });

  addBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  selected.addEventListener("click", () => {
    options.classList.toggle("hidden");
  });

  options.querySelectorAll("div").forEach(option => {
    option.addEventListener("click", () => {
      selected.textContent = option.textContent;
      selectedValue = option.dataset.value;
      options.classList.add("hidden");
    });
  });

  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      options.classList.add("hidden");
    }
  });

  saveBtn.addEventListener("click", async () => {

    const title = document.getElementById("newTitle").value.trim();

    if (!title || !selectedValue) {
      alert("Fill all fields");
      return;
    }

    const response = await fetch("http://localhost:3000/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        type: selectedValue,
        completed: false
      })
    });

    if (response.ok) {
      modal.classList.add("hidden");
      document.getElementById("newTitle").value = "";
      selected.textContent = "Select Category";
      selectedValue = "";
      loadGoals();
    }

  });

});


async function loadGoals() {

  const response = await fetch("http://localhost:3000/goals");
  const data = await response.json();

  const booksList = document.getElementById("booksList");
  const projectsList = document.getElementById("projectsList");
  const skillsCard = document.getElementById("skillsCard");

  booksList.innerHTML = "";
  projectsList.innerHTML = "";

  document.querySelectorAll(".dynamic-category").forEach(el => el.remove());

  const categoryMap = {};

  data.forEach(goal => {

    const type = goal.type.toLowerCase();

    if (type === "book") {
      appendToList(booksList, goal);
      return;
    }

    if (type === "project") {
      appendToList(projectsList, goal);
      return;
    }

    if (!categoryMap[type]) {

      const newCard = document.createElement("div");
      newCard.classList.add("glass-card", "dynamic-category");

      newCard.innerHTML = `
        <div class="card-header">
          <h2>${goal.type}</h2>
          <span class="edit-toggle">Edit</span>
        </div>
        <ul></ul>
      `;

      skillsCard.parentNode.insertBefore(newCard, skillsCard);

      categoryMap[type] = newCard.querySelector("ul");
      attachEditToggle(newCard);
    }

    appendToList(categoryMap[type], goal);
  });

  document.querySelectorAll(".glass-card").forEach(card => {
    if (card.querySelector(".edit-toggle")) {
      attachEditToggle(card);
    }
  });
}


function appendToList(list, goal) {

  const wrapper = document.createElement("div");
  wrapper.classList.add("task-item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = goal.completed;

  checkbox.addEventListener("change", () => {
    updateGoal(goal.id, checkbox.checked);
  });

  const li = document.createElement("li");
  li.textContent = goal.title;
  if (goal.completed) li.classList.add("completed");

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "−";
  removeBtn.style.display = "none";

  removeBtn.addEventListener("click", async (e) => {
    e.stopPropagation();

    const response = await fetch(`http://localhost:3000/goals/${goal.id}`, {
      method: "DELETE"
    });

    if (response.ok) loadGoals();
  });

  wrapper.appendChild(checkbox);
  wrapper.appendChild(li);
  wrapper.appendChild(removeBtn);

  list.appendChild(wrapper);
}


function attachEditToggle(card) {

  const editBtn = card.querySelector(".edit-toggle");

  if (editBtn.dataset.listenerAttached) return;
  editBtn.dataset.listenerAttached = "true";

  editBtn.addEventListener("click", () => {

    const removeButtons = card.querySelectorAll(".remove-btn");
    const isEditing = editBtn.textContent === "Done";

    editBtn.textContent = isEditing ? "Edit" : "Done";

    removeButtons.forEach(btn => {
      btn.style.display = isEditing ? "none" : "flex";
    });

  });
}


async function updateGoal(id, completed) {
  await fetch(`http://localhost:3000/goals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });
}


function showTodayDate() {
  const today = new Date();
  const todayDate = document.getElementById("todayDate");
  todayDate.innerText = today.toDateString();
  todayDate.style.display = "block";
}