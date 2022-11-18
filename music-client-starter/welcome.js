window.onload = function () {
  init();
  document.getElementById("logoutBtn").onclick = logout;
  fetchAllSongs();
  fetchPlaylist();
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

function fetchAllSongs() {
  fetch("http://localhost:3000/api/music", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((songs) => {
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
      console.log(songs);
    });
}
async function addToPlaylist(count) {
  const songId = document.getElementById(`row_id${count}`).value;
  const userId = sessionStorage.getItem("userId");
  const res = await fetch("http://localhost:3000/api/playlist/add", {
    method: "POST",
    body: JSON.stringify({
      userId,
      songId,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });
  if (res.ok) {
    console.log(res);
  } else {
    alert("Error");
  }
}

async function fetchPlaylist() {
  const resp = await fetch("http://localhost:3000/api/playlist", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  const play = await resp.json();
  let playlist = `
    <table>
        <tr>
          <th></th>
          <th>Title</th>
          <th>User ID</th>
          <th>Action</th>
        </tr>
    `;
  let count = 0;
  play.forEach((song) => {
    playlist += `
            <tr>
                <td>${++count}</td>
                <td>${song.title}</td>
                <td>${song.userId}</td>
                <td><button onclick="playSong(${count});">play</button>
                <button onclick="removeSong(${
                  song.songId
                });">remove</button></td>
            </tr>
            <input id="url${count}" value="${song.urlPath}" type="hidden"/>
            <input id="track_name${count}" value="${song.title}" type="hidden"/>
        `;
  });
  playlist += `</table>`;
  document.getElementById("playlist").innerHTML = playlist;
  console.log(play);
}

function playSong(count) {
  document.getElementById("player").src =
    `http://127.0.0.1:5500/music-server/src/` +
    document.getElementById(`url${count}`).value;
  document.getElementById("name").innerText = document.getElementById(
    `track_name${count}`
  ).value;
}
// function fetchAllSongs() {
//   fetch("http://localhost:3000/api/music", {
//     headers: {
//       Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//     },
//   })
//     .then((response) => response.json())
//     .then((songs) => console.log(songs));

//   let html = `
//     <tr>
//     <th>ID</th>
//     <th>TITLE</th>
//     <th>RELEASE DATE</th>
//     <th>ACTION</th>

//     </tr>
//     `;

//   response.forEach((element) => {
//     html += `
//         <tr>
//         <td>${element.id}</td>
//         <td>${element.title}</td>
//         <td>${element.releaseDate}</td>
//         <td><button>+</button></td>

//         </tr>
//         `;
//   });
//   // document.getElementById('')
// }
