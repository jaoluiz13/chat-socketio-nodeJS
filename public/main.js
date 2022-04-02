const socket = io();

let userName = "";
let userList = [];
let loginPage = document.querySelector("#login");
let chatPage = document.querySelector("#chat");

let loginInput = document.querySelector("#loginInput");
let textInput = document.querySelector("#chatTextInput");

loginPage.style.display = "flex";
chatPage.style.display = "none";

function renderUserList() {
  let ul = document.querySelector(".userList");
  //ul.innerHTML = "";

  userList.forEach((i) => {
    ul.innerHTML += `<li>${i}</li>`;
  });
}

function addMessage(type, user, message) {
  let ul = document.querySelector(".chatList");
  switch (type) {
    case "status":
      ul.innerHTML += `<li class="m-status">${message}</li>`;
      break;
    case "message":
      ul.innerHTML += `<li class="m-txt"><span>${user}: </span>${message}</li>`;
      break;
  }
}

loginInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    let name = loginInput.value.trim();
    if (name != "") {
      userName = name;
      document.title = `Chat:${userName}`;

      socket.emit("join-request", userName);
    } else {
      loginInput.style.border = "1px solid red";
      alert("Por favor digite seu nome");
    }
  }
});

textInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    let message = textInput.value.trim();
    textInput.value = '';
    if (message != '') {
        socket.emit("send-msg", message);
        
      } else {
        textInput.style.border = "1px solid red";
        alert("Por favor digite uma mensagem!");
      }
 
  }
  
});

socket.on("user-ok", (list) => {
  loginPage.style.display = "none";
  chatPage.style.display = "flex";
  textInput.focus();

  addMessage("status", null, "Conectado!");

  userList = list;
  renderUserList();
});

socket.on("list-update", (data) => {
  if (data.joined) {
    addMessage("status", null, `${data.joined} entrou no chat as ${data.time}`);
  }

  if (data.left) {
    addMessage("status", null, `${data.left} saiu do chat  as ${data.time}`);
  }
  userList = data.list;
  renderUserList();
});

socket.on("show-msg", (data) => {
  addMessage("message", `${data.username}`, `${data.message}| ${data.time}`);
});
