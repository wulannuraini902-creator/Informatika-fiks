let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

/* ================= SAVE ================= */
function saveData() {
  localStorage.setItem("subjects", JSON.stringify(subjects));
}

/* ================= SUBJECT ================= */
function addSubject() {
  const name = document.getElementById("subjectName").value;
  const deadline = document.getElementById("deadline").value;
  const emoji = document.getElementById("emoji").value || "📘";
  const color = document.getElementById("colorPicker").value || "#00f5ff";

  if (!name) return alert("Isi nama mapel dulu yaa ✨");

  subjects.push({
    name,
    deadline,
    emoji,
    color,
    indicators: []
  });

  saveData();
  render();
}

function deleteSubject(index) {
  subjects.splice(index, 1);
  saveData();
  render();
}

/* ================= INDICATOR ================= */
function addIndicator(index) {
  subjects[index].indicators.push({
    text: "",
    deadline: "",
    done: false
  });

  saveData();
  render();
}

function deleteIndicator(sIndex, iIndex) {
  subjects[sIndex].indicators.splice(iIndex, 1);
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
  render();
}

function toggleIndicator(sIndex, iIndex) {
  subjects[sIndex].indicators[iIndex].done =
    !subjects[sIndex].indicators[iIndex].done;

  saveData();
  render();
}

/* ================= PROGRESS ================= */
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

/* ================= COUNTDOWN ================= */
function getCountdown(deadline) {
  if (!deadline) return { text: "", type: "normal" };

  const today = new Date();
  const due = new Date(deadline);

  today.setHours(0,0,0,0);
  due.setHours(0,0,0,0);

  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { text: "Overdue ❗", type: "overdue" };
  if (diff === 0) return { text: "Today 🔥", type: "today" };
  if (diff === 1) return { text: "Tomorrow ⚠️", type: "soon" };

  return { text: diff + " hari lagi", type: "normal" };
}

/* ================= RENDER ================= */
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
      <div class="card-header">
        <h2>${sub.emoji} ${sub.name}</h2>
        <button class="delete-btn" onclick="deleteSubject(${sIndex})">✖</button>
      </div>

      <p class="subject-deadline">
        ${sub.deadline ? getCountdown(sub.deadline).text : ""}
      </p>

      <div class="progress-bar">
        <div style="width:${percent}%"></div>
      </div>

      <button class="add-btn" onclick="addIndicator(${sIndex})">
        + Indikator
      </button>

      <div class="indicator-container">
        ${sub.indicators.map((ind, iIndex) => {

          const countdownObj = getCountdown(ind.deadline);

          return `
            <div class="indicator-card ${countdownObj.type}">
              
              <div class="indicator-top">
                <input type="checkbox"
                  ${ind.done ? "checked" : ""}
                  onchange="toggleIndicator(${sIndex},${iIndex})">

                <input type="text"
                  class="indicator-text"
                  placeholder="Tulis indikator..."
                  value="${ind.text}"
                  oninput="updateIndicatorText(${sIndex},${iIndex}, this.value)"
                  style="text-decoration:${ind.done ? "line-through" : "none"};">
                  
                <button class="delete-small"
                  onclick="deleteIndicator(${sIndex},${iIndex})">
                  🗑
                </button>
              </div>

              <input type="date"
                value="${ind.deadline}"
                onchange="updateIndicatorDeadline(${sIndex},${iIndex}, this.value)"
                class="date-input">

              <div class="countdown ${countdownObj.type}">
                ${countdownObj.text}
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

/* ================= METEOR EFFECT ================= */
setInterval(() => {
  const meteor = document.createElement("div");
  meteor.className = "meteor";
  meteor.style.left = Math.random() * window.innerWidth + "px";
  document.body.appendChild(meteor);

  setTimeout(() => meteor.remove(), 2000);
}, 3000);
