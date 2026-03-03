let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

function saveData() {
  localStorage.setItem("subjects", JSON.stringify(subjects));
}

function openModal() {
  document.getElementById("taskModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("taskModal").style.display = "none";
}

function addSubject() {
  const name = document.getElementById("subjectName").value;
  const deadline = document.getElementById("deadline").value;
  const emoji = document.getElementById("emoji").value;
  const color = document.getElementById("colorPicker").value;

  if (!name) return alert("Isi nama dulu ya!");

  subjects.push({
    name,
    deadline,
    emoji,
    color,
    indicators: []
  });

  saveData();
  render();
  closeModal();
}

function addIndicator(index) {
  subjects[index].indicators.push({
    text: "",
    deadline: "",
    done: false
  });

  saveData();
  render();
}

function updateIndicatorText(sIndex, iIndex, value) {
  subjects[sIndex].indicators[iIndex].text = value;
  saveData();
}

function updateIndicatorDeadline(sIndex, iIndex, value) {
  subjects[sIndex].indicators[iIndex].deadline = value;
  saveData();
}

function toggleIndicator(sIndex, iIndex) {
  subjects[sIndex].indicators[iIndex].done =
    !subjects[sIndex].indicators[iIndex].done;

  saveData();
  render();
}

function getCountdown(deadline) {
  if (!deadline) return "";

  const today = new Date();
  const due = new Date(deadline);

  today.setHours(0,0,0,0);
  due.setHours(0,0,0,0);

  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return "Overdue ❗";
  if (diff === 0) return "Today 🔥";
  if (diff === 1) return "Tomorrow ⚠️";
  return diff + " hari lagi";
}

function render() {
  const container = document.getElementById("taskContainer");
  container.innerHTML = "";

  subjects.forEach((sub, sIndex) => {

    const card = document.createElement("div");
    card.className = "task-card";
    card.style.border = `2px solid ${sub.color}`;

    card.innerHTML = `
      <h2>${sub.emoji} ${sub.name}</h2>
      <button onclick="addIndicator(${sIndex})">+ Indikator</button>

      ${sub.indicators.map((ind, iIndex) => {

        const countdown = getCountdown(ind.deadline);

        let statusClass = "normal";
        if (countdown.includes("Overdue")) statusClass = "overdue";
        else if (countdown.includes("Today")) statusClass = "today";
        else if (countdown.includes("Tomorrow")) statusClass = "soon";

        return `
        <div class="indicator-card ${ind.done ? "done" : ""} ${statusClass}">

          <div class="indicator-top">
            <input type="checkbox"
              ${ind.done ? "checked" : ""}
              onchange="toggleIndicator(${sIndex},${iIndex})">

            <input type="text"
              placeholder="Tulis indikator..."
              value="${ind.text}"
              oninput="updateIndicatorText(${sIndex},${iIndex}, this.value)">
          </div>

          <div class="indicator-bottom">
            <input type="date"
              value="${ind.deadline}"
              onchange="updateIndicatorDeadline(${sIndex},${iIndex}, this.value)">

            <div class="countdown">${countdown}</div>
          </div>

        </div>
        `;
      }).join("")}
    `;

    container.appendChild(card);
  });
}

render();
