let mensagens;
let nome;

function entrarNaSala() {
  nome = prompt("Qual seu nome de usuário? ");

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
    entrarNaSala();
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
  for (let oneMessage of mensagens) {
    displayMessage(oneMessage);

    // i++;
    // console.log("plotado " + i);
  }
}

function displayMessage(oneMessage) {
  let from = oneMessage.from;
  let text = oneMessage.text;
  let time = oneMessage.time;
  let to = oneMessage.to;
  let type = oneMessage.type;

  let chat = document.querySelector(".chat");

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

    newDiv.innerHTML = `<div class='tempo'>(${time})</div>
  <div class='texto'>
    <span class='from'><em>${from}</em></span> reservadamente para <span class='to'><em>${to}</em></span>: <span class="frase">${text}</span>
  </div>`;

    chat.appendChild(newDiv);
  }
  // Scrolla para o último elemento

  const elementoQueQueroQueApareca = document.querySelectorAll(".mensagem");
  const ultimaMensagem = elementoQueQueroQueApareca.length - 1;

  elementoQueQueroQueApareca[ultimaMensagem].scrollIntoView();
}

function enviarMensagem() {
  const escrito = document.querySelector("input").value;

  objetoMensagem = {
    from: nome,
    to: "todos",
    text: escrito,
    type: "message", // ou "private_message" para o bônus
  };

  const promessaEnvio = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    objetoMensagem
  );

  document.querySelector("input").value = "";

  promessaEnvio.then(getData);
  promessaEnvio.catch(window.location.reload);
}

// Adiciona a opção de enviar mensagem com o Enter
document.addEventListener("keydown", function (event) {
  if (event.key == "Enter" && document.querySelector("input").value !== "")
    enviarMensagem();
});

entrarNaSala();
