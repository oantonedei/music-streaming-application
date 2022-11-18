window.onload = function () {
  init();
  document.getElementById("logoutBtn").onclick = logout;
  document.getElementById("btn").onclick = buttonIcon;
  fetchAllSongs();
};

function init() {
  document.getElementById("username").innerText = sessionStorage.getItem("username");
}

function logout() {
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("token");
  location.href = "login.html";
}

function fetchAllSongs() {
  fetch("http://localhost:3000/api/music", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((songs) => console.log(songs));
}

function buttonIcon() {
  let shuffle = document.getElementById("shuffle");
  let repeat = document.getElementById("repeat");
  let repeatAll = document.getElementById("repeatAll");
    console.log(shuffle);
  if (shuffle.style.display === "block") {
    repeat.style.display = "block";
    repeatAll.style.display = "none";
    shuffle.style.display = "none";
  } else if (repeat.style.display === "block") {
    shuffle.style.display = "none";
    repeatAll.style.display = "block";
    repeat.style.display = "none";
  } else if (repeatAll.style.display === "block") {
    shuffle.style.display = "block";
    repeat.style.display = "none";
    repeatAll.style.display = "none";
  }
}
