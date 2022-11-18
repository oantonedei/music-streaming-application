window.onload = function () {
  init();
  document.getElementById("logoutBtn").onclick = logout;
  fetchAllSongs();
  fetchPlaylist();
  document.getElementById("search").onkeyup = searchSong;
  document.getElementById("btn").onclick = buttonIcon;
};

function init() {
  document.getElementById("username").innerText =
    sessionStorage.getItem("username");
}

function logout() {
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("token");
  location.href = "login.html";
}

//FETCHING SONGS FROM API
function fetchAllSongs() {
  fetch("http://localhost:3000/api/music", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((songs) => {
      populateSongs(songs);
    });
}

//POPULATE THE SONGS TABLE WITH SONGS
function populateSongs(songs) {
  let html = `
      <table>
        <tr>
          <th></th>
          <th>Title</th>
          <th>Release Date</th>
          <th>Action</th>
        </tr>`;

  let count = 0;
  songs.forEach((row) => {
    html += `
            <tr>
                <td>${++count}</td>
                <td>${row.title}</td>
                <td>${row.releaseDate}</td>
                <td><button onclick="addToPlaylist(${count});">+</button></td>
                <input id="row_id${count}" value="${row.id}" type="hidden"/>
            </tr>
            `;
  });

  html += `</table>`;
  document.getElementById("music-lib").innerHTML = html;
}

//ADDING FROM SONGLIST TO PLAYLIST
async function addToPlaylist(count) {
  const songId = document.getElementById(`row_id${count}`).value;

  const res = await fetch("http://localhost:3000/api/playlist/add", {
    method: "POST",
    body: JSON.stringify({
      songId,
    }),
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      "Content-type": "application/json",
    },
  });
  if (res.ok) {
    const playlist = await res.json();
    addSongFunction(playlist);
  } else {
    alert("You have an Error");
  }
}

//REMOVING SONG FROM PLAYLIST
async function removeSong(count) {
  const songId = document.getElementById(`track_id${count}`).value;

  const res = await fetch("http://localhost:3000/api/playlist/remove", {
    method: "POST",
    body: JSON.stringify({
      songId,
    }),
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      "Content-type": "application/json",
    },
  });
  if (res.ok) {
    const playlist = await res.json();
    addSongFunction(playlist);
  } else {
    alert("You have an Error");
  }
}

//FETCHING THE PLAYLIST AND DISPLAYING TO USER INTERFACE
async function fetchPlaylist() {
  const resp = await fetch("http://localhost:3000/api/playlist", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  const play = await resp.json();
  addSongFunction(play);
}

//GENERIC FUNCTION TO POPULATE THE PLAYLIST
function addSongFunction(param) {
  let playlist = `
        <tr>
          <th>Order Id</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
    `;
  param.forEach((song) => {
    playlist += `
            <tr>
                <td>${song.orderId}</td>
                <td>${song.title}</td>
                <td><button onclick="playSong(${song.orderId});">play</button>
                <button onclick="removeSong(${song.orderId});">remove</button></td>
            </tr>
            <input id="url${song.orderId}" value="${song.urlPath}" type="hidden"/>
            <input id="track_name${song.orderId}" value="${song.title}" type="hidden"/>
            <input id="track_id${song.orderId}" value="${song.songId}" type="hidden"/>
        `;
  });
  document.getElementById("playlist").innerHTML = playlist;
}

//FUNCTION THAT PLAYS THE SONG ON THE MUSIC PLAYER WHEN PLAY BUTTON IS CLICKED
function playSong(count) {
  document.getElementById("player").src =
    `http://127.0.0.1:5500/finalProject/map_project/music-server/src/` +
    document.getElementById(`url${count}`).value;
  document.getElementById("name").innerText = document.getElementById(
    `track_name${count}`
  ).value;
}

//SEARCH SONGS BASED ON INPUT
async function searchSong(event) {
  const res = await fetch(
    "http://localhost:3000/api/music?search=" + event.target.value,
    {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }
  );
  const result = await res.json();
  populateSongs(result);
}

function buttonIcon() {
  let shuffle = document.getElementById("shuffle");
  let repeat = document.getElementById("repeat");
  let repeatAll = document.getElementById("repeatAll");
  console.log(repeatAll.style.display);
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
