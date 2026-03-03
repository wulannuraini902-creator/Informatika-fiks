let subjects = [];

function saveData() {
  localStorage.setItem("subjects", JSON.stringify(subjects));
}

function loadData() {
  const data = localStorage.getItem("subjects");
  if (data) {
    subjects = JSON.parse(data);
    render();
  }
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

function toggleIndicator(sIndex, iIndex) {
  subjects[sIndex].indicators[iIndex].done =
    !subjects[sIndex].indicators[iIndex].done;

  saveData();
  render();
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

      ${sub.indicators.map((ind, iIndex) => `
        <div class="indicator-card ${ind.done ? "done" : ""}">
          <input type="checkbox"
            ${ind.done ? "checked" : ""}
            onchange="toggleIndicator(${sIndex},${iIndex})">
          <input type="text"
            placeholder="Tulis indikator..."
            value="${ind.text}">
        </div>
      `).join("")}
    `;

    container.appendChild(card);
  });
}

loadData();
