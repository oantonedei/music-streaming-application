window.onload = function(){
    init();
    document.getElementById('logoutBtn').onclick = logout;
    fetchAllSongs();
}

function init(){
    document.getElementById('username').innerText = sessionStorage.getItem('username');
}

function logout(){
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    location.href= 'login.html';
}

function fetchAllSongs(){
    fetch('http://localhost:3000/api/music', {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(songs => console.log(songs));

    let html = `
    <tr>
    <th>ID</th>
    <th>TITLE</th>
    <th>RELEASE DATE</th>
    <th>ACTION</th>

    </tr>
    `;

    response.forEach(element => {
        html+=`
        <tr>
        <td>${element.id}</td>
        <td>${element.title}</td>
        <td>${element.releaseDate}</td>
        <td><button>+</button></td>
    
        </tr>
        `
        
    });
    // document.getElementById('')
        
}