let currentUser = null;

// Simula login com localStorage
function login() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Digite um nome válido!");

  currentUser = username;

  let users = JSON.parse(localStorage.getItem("users") || "{}");
  if (!users[username]) {
    users[username] = { points: 0 };
    localStorage.setItem("users", JSON.stringify(users));
  }

  document.getElementById("auth-section").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("logout-btn").style.display = "block";
  document.getElementById("user-name").innerText = username;

  updatePointsDisplay();
  updateRanking();
  startScanner();
}

function logout() {
  currentUser = null;
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";
  document.getElementById("auth-section").style.display = "block";
  if (html5QrcodeScanner) html5QrcodeScanner.clear();
}

function updatePointsDisplay() {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const points = users[currentUser]?.points || 0;
  document.getElementById("user-points").innerText = points;
}

function updateRanking() {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const list = Object.entries(users)
    .sort((a, b) => b[1].points - a[1].points)
    .slice(0, 5);

  const ul = document.getElementById("ranking-list");
  ul.innerHTML = "";
  list.forEach(([name, data], index) => {
    const li = document.createElement("li");
    li.innerText = `${index + 1}º ${name} - ${data.points} pts`;
    ul.appendChild(li);
  });
}

function onScanSuccess(decodedText, decodedResult) {
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (decodedText.startsWith("ECO-PONTO-")) {
    users[currentUser].points += 10; // Pode ser dinâmico
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("result").innerText = `Descarte registrado! +10 pontos 🎉`;
    updatePointsDisplay();
    updateRanking();
    html5QrcodeScanner.clear(); // Opcional: parar após leitura
    setTimeout(() => startScanner(), 2000);
  } else {
    document.getElementById("result").innerText = `QR inválido.`;
  }
}

let html5QrcodeScanner;

function startScanner() {
  html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: 250 },
    false
  );
  html5QrcodeScanner.render(onScanSuccess);
}