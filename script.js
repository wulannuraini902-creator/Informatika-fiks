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
  if (!deadline) return "";

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

    let doneCount = sub.indicators.filter(i => i.done).length;
    let percent = sub.indicators.length
      ? (doneCount / sub.indicators.length) * 100
      : 0;

    card.innerHTML = `
      <h2>${sub.emoji} ${sub.name}</h2>
      <p>Deadline Subject: ${getCountdown(sub.deadline)}</p>

      <div class="progress-bar">
        <div style="width:${percent}%"></div>
      </div>

      <button onclick="addIndicator(${sIndex})">+ Indikator</button>

      <div>
        ${sub.indicators.map((ind, iIndex) => {

          const countdown = getCountdown(ind.deadline);
          const isOverdue = countdown.includes("Overdue");

          return `
          <div style="
            margin-top:12px;
            padding:12px;
            background: rgba(255,255,255,0.08);
            border-radius:12px;
            backdrop-filter: blur(8px);
            box-shadow: ${isOverdue ? "0 0 15px red" : "0 0 10px rgba(0,255,255,0.2)"};
          ">
            <input type="checkbox"
              ${ind.done ? "checked" : ""}
              onchange="toggleIndicator(${sIndex},${iIndex})">

            <input type="text"
              placeholder="Tulis indikator..."
              value="${ind.text}"
              oninput="updateIndicatorText(${sIndex},${iIndex}, this.value)"
              style="
                margin-top:8px;
                width:100%;
                background: transparent;
                border:none;
                color:white;
                font-size:14px;
                text-decoration:${ind.done ? "line-through" : "none"};
              ">

            <input type="date"
              value="${ind.deadline}"
              onchange="updateIndicatorDeadline(${sIndex},${iIndex}, this.value)"
              style="
                margin-top:8px;
                width:100%;
                background: rgba(255,255,255,0.1);
                border:none;
                border-radius:8px;
                padding:5px;
                color:white;
              ">

            <div style="
              font-size:12px;
              margin-top:5px;
              color:${isOverdue ? "red" : "#00f5ff"};
            ">
              ${countdown}
            </div>
          </div>
          `;
        }).join("")}
      </div>
    `;

    container.appendChild(card);
  });

  calculateOverallProgress();
}

render();
