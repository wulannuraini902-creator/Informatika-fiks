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
    text: "Indikator Baru",
    done: false
  });
  saveData();
  render();
}

function toggleIndicator(sIndex, iIndex) {
  subjects[sIndex].indicators[iIndex].done =
    !subjects[sIndex].indicators[iIndex].done;

  saveData();
  render();
}

function calculateOverallProgress() {
  let total = 0;
  let done = 0;

  subjects.forEach(sub => {
    sub.indicators.forEach(ind => {
      total++;
      if (ind.done) done++;
    });
  });

  let percent = total ? (done / total) * 100 : 0;
  document.getElementById("overallProgress").style.width = percent + "%";

  if (percent === 100 && total > 0) {
    confetti();
  }
}

function getCountdown(deadline) {
  const today = new Date();
  const due = new Date(deadline);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today 🔥";
  if (diff === 1) return "Tomorrow ⚠️";
  if (diff < 0) return "Overdue ❗";
  return diff + " hari lagi";
}

function render() {
  const container = document.getElementById("taskContainer");
  container.innerHTML = "";

  subjects.forEach((sub, sIndex) => {
    const card = document.createElement("div");
    card.className = "task-card";
    card.style.background = sub.color;

    let doneCount = sub.indicators.filter(i => i.done).length;
    let percent = sub.indicators.length
      ? (doneCount / sub.indicators.length) * 100
      : 0;

    card.innerHTML = `
      <h2>${sub.emoji} ${sub.name}</h2>
      <p>${getCountdown(sub.deadline)}</p>
      <div class="progress-bar">
        <div style="width:${percent}%"></div>
      </div>
      <button onclick="addIndicator(${sIndex})">+ Indikator</button>
      <div>
        ${sub.indicators.map((ind, iIndex) => `
          <div>
            <input type="checkbox"
              ${ind.done ? "checked" : ""}
              onchange="toggleIndicator(${sIndex},${iIndex})">
            ${ind.text}
          </div>
        `).join("")}
      </div>
    `;

    container.appendChild(card);
  });

  calculateOverallProgress();
}

render();
