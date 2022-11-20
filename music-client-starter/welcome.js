window.onload = function () {
  init();
  document.getElementById("logoutBtn").onclick = logout;
  fetchAllSongs();
  fetchPlaylist();
  document.getElementById("search").onkeyup = searchSong;
  document.getElementById("btn").onclick = buttonIcon;
  document.getElementById("player").addEventListener("ended", alterPlaylist);
};

function init() {
  document.getElementById("username").innerText =
    sessionStorage.getItem("username");
}

function logout() {
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("playerArr");
  sessionStorage.removeItem("orderId");
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
    let playerArr = [];
    playlist.forEach((ob) => playerArr.push(ob));
    sessionStorage.setItem("playerArr", JSON.stringify(playerArr));
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
    let playerArr = [];
    playlist.forEach((ob) => playerArr.push(ob));
    sessionStorage.setItem("playerArr", JSON.stringify(playerArr));
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
  let playerArr = [];
  play.forEach((ob) => playerArr.push(ob));
  sessionStorage.setItem("playerArr", JSON.stringify(playerArr));

  console.log(playerArr);

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
async function playSong(orderId) {
  let playerArr = JSON.parse(sessionStorage.getItem("playerArr"));
  sessionStorage.setItem("orderId", orderId);
  currentSong = playerArr.filter((ob) => ob.orderId === orderId);
  document.getElementById("player").src =
    `http://127.0.0.1:5500/music-server/src/` +
    document.getElementById(`url${currentSong[0].orderId}`).value;
  document.getElementById("name").innerText = document.getElementById(
    `track_name${currentSong[0].orderId}`
  ).value;
}

// function next() {
//   // Check for last audio file in the playlist
//   if (i === files.length - 1) {
//     i = 0;
//   } else {
//     i++;
//   }

//   // Change the audio element source
//   music_player.src = files[i];
// }

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
  if (shuffle.style.display === "block") {
    repeat.style.display = "block";
    repeatAll.style.display = "none";
    shuffle.style.display = "none";
    document.getElementById("player").setAttribute("loop", "loop");
    sessionStorage.setItem("playType", "REPEAT");
  } else if (repeat.style.display === "block") {
    shuffle.style.display = "none";
    repeatAll.style.display = "block";
    repeat.style.display = "none";
    document.getElementById("player").removeAttribute("loop");
    sessionStorage.setItem("playType", "ORDER");
  } else if (repeatAll.style.display === "block") {
    shuffle.style.display = "block";
    repeat.style.display = "none";
    repeatAll.style.display = "none";
    document.getElementById("player").removeAttribute("loop");
    sessionStorage.setItem("playType", "SHUFFLE");
    alterPlaylist();
  }
}

function alterPlaylist() {
  let playType = sessionStorage.getItem("playType");
  let playerArr = JSON.parse(sessionStorage.getItem("playerArr"));
  let orderId = sessionStorage.getItem("orderId");
  if (playType === "ORDER") {
    orderId++;
    if (orderId > playerArr.length) {
      orderId = 1;
    }
    sessionStorage.setItem("orderId", orderId);
    document.getElementById("player").src =
      `http://127.0.0.1:5500/music-server/src/` +
      document.getElementById(`url${orderId}`).value;
    document.getElementById("name").innerText = document.getElementById(
      `track_name${orderId}`
    ).value;
  } else if (playType === "SHUFFLE") {
    orderId = Math.floor(Math.random() * (playerArr.length - 1) + 1);
    sessionStorage.setItem("orderId", orderId);
    document.getElementById("player").src =
      `http://127.0.0.1:5500/music-server/src/` +
      document.getElementById(`url${orderId}`).value;
    document.getElementById("name").innerText = document.getElementById(
      `track_name${orderId}`
    ).value;
  }
}
function prev() {
  let playType = sessionStorage.getItem("playType");
  let playerArr = JSON.parse(sessionStorage.getItem("playerArr"));
  let orderId = sessionStorage.getItem("orderId");
  if (playType === "ORDER") {
    orderId--;
    if (orderId < 1) {
      orderId = playerArr.length;
    }
    sessionStorage.setItem("orderId", orderId);
    document.getElementById("player").src =
      `http://127.0.0.1:5500/music-server/src/` +
      document.getElementById(`url${orderId}`).value;
    document.getElementById("name").innerText = document.getElementById(
      `track_name${orderId}`
    ).value;
  }
}
