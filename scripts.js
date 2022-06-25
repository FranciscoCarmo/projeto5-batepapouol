let mensagens;
let nome;
let isPublic = true;
let nomeContato = "Todos";
let frasePrivate;

function pegarNome() {
  let caixaNome = document.querySelector(".colocarNome input");

  document.querySelector(".colocarNome").classList.remove("hidden");
  document.querySelector(".carregando").classList.add("hidden");

  if (caixaNome.value) {
    nome = caixaNome.value;
    caixaNome.value = "";
  }

  document.querySelector(".colocarNome").classList.add("hidden");
  document.querySelector(".carregando").classList.remove("hidden");

  entrarNaSala();
}

function entrarNaSala() {
  // nome = prompt("Qual seu nome de usuário? ");

  let nomeParaEnvio = {
    name: nome,
  };
  //Envia nome para o servidor
  const promessa = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants ",
    nomeParaEnvio
  );

  promessa.then(() => {
    setInterval(manterConexao, 5000, nomeParaEnvio);
    setInterval(getData, 3000);
    document.querySelector(".entrada").classList.add("hidden");
  });
  promessa.catch(tratarFalha);
}

function tratarFalha(erro) {
  const statusCode = erro.response.status;
  console.log(statusCode);

  if (statusCode == 400) {
    alert(
      "O nome de usuário escolhido não está disponível, escolha outro nome."
    );
    document.querySelector(".colocarNome").classList.remove("hidden");
    document.querySelector(".carregando").classList.add("hidden");
  }
}

function manterConexao(nomeParaEnvio) {
  const promessaManterConexao = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    nomeParaEnvio
  );

  promessaManterConexao.then();
  promessaManterConexao.catch();
}

function getData() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );

  promessa.then(processarResposta);
  promessa.catch();
}

function processarResposta(resposta) {
  mensagens = resposta.data;

  let i = 0;

  let chat = document.querySelector(".chat");
  limpaDiv(chat);

  for (let oneMessage of mensagens) {
    displayMessage(oneMessage);

    // i++;
    // console.log("plotado " + i);
  }
}

function limpaDiv(div) {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function displayMessage(oneMessage) {
  let from = oneMessage.from;
  let text = oneMessage.text;
  let time = oneMessage.time;
  let to = oneMessage.to;
  let type = oneMessage.type;

  let chat = document.querySelector(".chat");

  //Remove todas as mensagens

  //PLOTA AS MENSAGENS
  if (type == "message") {
    const newDiv = document.createElement("div");
    newDiv.classList.add("mensagem");

    newDiv.innerHTML = `<div class='tempo'>(${time})</div>
  <div class='texto'>
    <span class='from'><em>${from}</em></span> para <span class='to'><em>${to}</em></span>: <span class="frase">${text}</span>
  </div>`;

    chat.appendChild(newDiv);
  }

  //PLOTA AS MENSAGENS STATUS
  if (type == "status") {
    const newDiv = document.createElement("div");
    newDiv.classList.add("mensagem");
    newDiv.classList.add("status");

    newDiv.innerHTML = `<div class='tempo'> (${time})</div>
  <div class='texto'>
    <span class='from'><em>${from}</em></span> <span class="frase">${text}</span>
  </div>`;

    chat.appendChild(newDiv);
  }

  //PLOTA AS MENSAGENS PRIVADAS
  if (type == "private_message") {
    const newDiv = document.createElement("div");
    newDiv.classList.add("mensagem");
    newDiv.classList.add("private");

    if (from == nome || to == nome) {
      newDiv.innerHTML = `<div class='tempo'>(${time})</div>
      <div class='texto'>
        <span class='from'><em>${from}</em></span> reservadamente para <span class='to'><em>${to}</em></span>: <span class="frase">${text}</span>
      </div>`;
    } else {
      newDiv.style.display = "none";
    }

    chat.appendChild(newDiv);
  }
  // Scrolla para o último elemento

  const elementoQueQueroQueApareca = document.querySelectorAll(".mensagem");
  const ultimaMensagem = elementoQueQueroQueApareca.length - 1;

  elementoQueQueroQueApareca[ultimaMensagem].scrollIntoView();
}

function enviarMensagem() {
  const escrito = document.querySelector("input").value;

  if (isPublic) {
    objetoMensagem = {
      from: nome,
      to: nomeContato,
      text: escrito,
      type: "message", // ou "private_message" para o bônus
    };
  } else {
    objetoMensagem = {
      from: nome,
      to: nomeContato,
      text: escrito,
      type: "private_message", // ou "private_message" para o bônus
    };
  }

  const promessaEnvio = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    objetoMensagem
  );

  document.querySelector("input").value = "";

  promessaEnvio.then(getData);
  promessaEnvio.catch(window.location.reload);
}

function mostraMenu() {
  document.querySelector(".menu").classList.remove("hidden");

  let cobertura = document.querySelector(".cobertura");
  cobertura.classList.remove("hidden");

  cobertura.addEventListener("click", someMenu);

  // Adiciona click da visibilidade
  let visibilidade = document.querySelectorAll(".visibilidade .umaLinha");
  for (elemento of visibilidade) {
    elemento.addEventListener("click", escolheVisibilidade);
  }

  getNomes();
  setInterval(getNomes, 10000);
}

function escolheVisibilidade() {
  document
    .querySelector(".visibilidade .selecionado")
    .classList.remove("selecionado");

  this.classList.add("selecionado");

  let visi = this.querySelector("p").classList;

  frasePrivate = document.querySelector(".frasePrivate");

  if (visi.contains("public")) {
    isPublic = true;
    frasePrivate.classList.add("hidden");
  } else {
    isPublic = false;
    frasePrivate.classList.remove("hidden");
    frasePrivate.innerText = `Enviando para ${nomeContato} (reservadamente)`;
  }
}

function someMenu() {
  document.querySelector(".menu").classList.add("hidden");

  let cobertura = document.querySelector(".cobertura");
  cobertura.classList.add("hidden");
}

function getNomes() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/participants"
  );

  promessa.then(renderizaNomes);
  promessa.catch();
}

function renderizaNomes(resposta) {
  let online = document.querySelector(".online");

  limpaDiv(online);

  let novaDiv = document.createElement("div");
  novaDiv.innerHTML = `<div class="umaLinha">
<ion-icon name="people"></ion-icon>
<p>Todos</p>
<img src="Correct.png" alt="">
</div>`;

  let nomeNovo = novaDiv.querySelector(".umaLinha p");
  if (nomeNovo.innerText == nomeContato) {
    nomeNovo.parentNode.classList.add("selecionado");
  }

  online.append(novaDiv);

  //Coloca os noves online da API

  for (let x of resposta.data) {
    let umNome = x.name;

    novaDiv = document.createElement("div");
    novaDiv.innerHTML = `<div class="umaLinha data-identifier = "participant"">
    <ion-icon name="person-circle"></ion-icon>
 <p>${umNome}</p>
 <img src="Correct.png" alt="">
 </div>`;

    // Ve se o contato saiu e volta pro todos
    let nomeNovo = novaDiv.querySelector(".umaLinha p");
    if (nomeNovo.innerText == nomeContato) {
      nomeNovo.parentNode.classList.add("selecionado");
    }

    online.append(novaDiv);
  }

  let nomesOnline = document.querySelectorAll(".online p");

  let hasName = false;
  for (let nomeNovo of nomesOnline) {
    if (nomeNovo.innerText == nomeContato) hasName = true;
    if (nomeNovo.innerText == nome) nomeNovo.parentElement.remove();
  }

  if (hasName == false) {
    nomeContato = "Todos";
    alert(
      "A pessoa que você selecionou deixou a sala, a mensagem será enviada para todos"
    );
    document.querySelector(".online .umaLinha").classList.add("selecionado");
  }
  let visibilidade = document.querySelectorAll(".online .umaLinha");
  for (elemento of visibilidade) {
    elemento.addEventListener("click", escolheContato);
  }
}

function escolheContato() {
  document
    .querySelector(".online .selecionado")
    .classList.remove("selecionado");

  this.classList.add("selecionado");

  nomeContato = this.querySelector("p").innerText;

  frasePrivate = document.querySelector(".frasePrivate");
  frasePrivate.innerText = `Enviando para ${nomeContato} (reservadamente)`;
}

let botaoMenu = document.querySelector("header ion-icon");
botaoMenu.addEventListener("click", mostraMenu);

// Adiciona a opção de enviar mensagem com o Enter
document.addEventListener("keydown", function (event) {
  if (
    event.key == "Enter" &&
    document.querySelector("footer input").value !== ""
  )
    enviarMensagem();
});

document.addEventListener("keydown", function (event) {
  if (
    event.key == "Enter" &&
    document.querySelector(".entrada input").value !== ""
  )
    pegarNome();
});
