const socket = io();

let userName = "";
let userList = [];
let loginPage = document.querySelector("#login");
let chatPage = document.querySelector("#chat");

let loginInput = document.querySelector("#loginInput");
let textInput = document.querySelector("#chatTextInput");

loginPage.style.display = "flex";
chatPage.style.display = "none";

function renderUserList (){
    let ul = document.querySelector('.userList');
    ul.innerHTML = '';

    userList.forEach(i=>{
        ul.innerHTML += `<li>${i}</li>`
    });
}

loginInput.addEventListener("keyup", (e) => {
  if (e.keyCode == 13) {
    let name = loginInput.value.trim();
    if (name != "") {
      userName = name;
      document.title = `Chat:${userName}`;

      socket.emit('join-request', userName);
    } else {
      loginInput.style.border = "1px solid red";
      alert("Por favor digite seu nome");
    }
  }
});

socket.on("user-ok", (list) => {
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex'
    textInput.focus();

    userList = list
    renderUserList();
});
