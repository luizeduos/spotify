// Função para iniciar o jogo
function startGame() {
  // Substitui o botão Iniciar jogo por uma contagem regressiva e depois cria um botão para chamar a promessa player
  const gameContainer = document.getElementById("game-container");
  const startButton = document.getElementById("start-game");
  const playerButton = document.getElementById("play-music");
  const lblResposta = document.getElementById("lbl-resposta");
  const resposta = document.getElementById("resposta");
  const btnResposta = document.getElementById("btn-resposta");
  const animatedElement = document.getElementById("boxz");
  startButton.remove();
  const countdown = document.createElement("h1");
  countdown.innerText = "3";
  gameContainer.appendChild(countdown);
  setTimeout(() => {
    countdown.innerText = "2";
    setTimeout(() => {
      countdown.innerText = "1";
      setTimeout(() => {
        countdown.remove();
        playerButton.classList.remove("hidden");
        resposta.classList.remove("hidden");
        lblResposta.classList.remove("hidden");
        btnResposta.classList.remove("hidden");
        animatedElement.classList.remove("hidden");
      }, 1000);
    }, 1000);
  }, 1000);
}

let player;
let trackName;
let playlist = []; // Array para armazenar as músicas da playlist
let pontos = 0;

function getToken() {
  fetch("../assets/json/token.json").then((response) => response.json()).then((data) => {
    token = data.token;
  });
}
getToken();

window.onSpotifyWebPlaybackSDKReady = () => {
  // Trocar o token abaixo a cada hora, precisa estar logado, através do link https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started 
  player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });

  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    const connect_to_device = () => {
      let playlistUri = "spotify:playlist:37i9dQZF1DZ06evO0LuyqI";
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: "PUT",
        body: JSON.stringify({
          context_uri: playlistUri,
          play: false,
        }),
        headers: new Headers({
          "Authorization": "Bearer " + token,
        }),
      }).then(response => console.log(response))
        .then(data => {
          // Adicionar listener para o evento de mudança de estado de reprodução
          player.addListener('player_state_changed', ({
            track_window
          }) => {
            trackName = track_window.current_track.name;
            trackName = trackName.toLowerCase();
            console.log('Current Track:', trackName);
          });
        });
    }
    connect_to_device();
  });

  // Botão play music para tocar a música por 13 segundos
  document.getElementById("play-music").addEventListener('click', () => {
    player.togglePlay();
    setTimeout(() => {
      player.pause();
    }, 5000);
  });

  // Botão resposta para verificar se a resposta está correta, apagar a resposta e mudar a música do play-music para a próxima
  document.getElementById("btn-resposta").addEventListener('click', (event) => {
    event.preventDefault();
    let resposta = document.getElementById("resposta").value;
    resposta = resposta.toLowerCase();
    if (resposta == trackName) {
      alert("Você Acertou, Parabéns!");
      document.getElementById("resposta").value = "";

      pontos++; // Incrementa os pontos em 1
      document.getElementById("pontuacao").innerHTML = `${pontos}`; // Atualiza a exibição da pontuação

      const pointsElement = document.getElementById("icon");
      // Verifica a contagem de pontos e adiciona a classe correspondente
      if (pontos >= 5 && pontos < 10) {
        pointsElement.classList.add("orange");
      } else if (pontos >= 10 && pontos < 15) {
        pointsElement.classList.remove("orange");
        pointsElement.classList.add("blue");
      } else if (pontos >= 15 && pontos < 25) {
        pointsElement.classList.remove("blue");
        pointsElement.classList.add("yellow");
      } else if (pontos >= 25) {
        pointsElement.classList.remove("yellow");
        pointsElement.classList.add("red", "fa-beat");
      }

      player.nextTrack();
      setTimeout(() => {
        player.pause();
      }, 1300);
    } else {
      alert("Você errou, tente novamente!");
    }
  });

  player.connect();
};
const pause = document.querySelector('#pauseButton')

pause.onclick = function () {
  pause.classList.toggle('fa-play')
  pause.classList.toggle('fa-pause')
}