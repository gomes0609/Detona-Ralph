const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        livesElement: document.querySelector(".menu-lives h2"),
        startBtn: document.getElementById("start-restart-btn") // botão START/RESTART
    },
    values: {
        gameVelocity: 900,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3,
        gameRunning: false // controla se o jogo está ativo
    },
    actions: {
        timerId: null,
        countDownTimerId: null
    }
};

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        endGame("Tempo esgotado!");
    }
}

function endGame(message) {
    clearInterval(state.actions.timerId);
    clearInterval(state.actions.countDownTimerId);
    state.values.gameRunning = false;
    state.view.startBtn.textContent = "RESTART GAME";
    state.view.startBtn.disabled = false;
    alert(message + " Sua pontuação final: " + state.values.result);
}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(() => {}); // evita erro no console se o áudio não existir
}

function randomSquare() {
    if (!state.values.gameRunning) return;

    state.view.squares.forEach((square) => { 
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                // ACERTO
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            } else {
                // ERRO: perde vida
                state.values.lives--;
                state.view.livesElement.textContent = `x${state.values.lives}`;
                playSound("wrong");

                if (state.values.lives <= 0) {
                    endGame("Vidas acabaram!");
                }
            }
        });
    });
}

function startOrRestartGame() {
    if (state.values.gameRunning) return; // evita cliques durante o jogo

    // Reset completo
    state.values.result = 0;
    state.values.currentTime = 60;
    state.values.lives = 3;
    state.values.hitPosition = 0;
    state.values.gameRunning = true;

    state.view.score.textContent = "0";
    state.view.timeLeft.textContent = "60";
    state.view.livesElement.textContent = "x3";
    state.view.startBtn.textContent = "JOGANDO...";
    state.view.startBtn.disabled = true;

    // Limpa o tabuleiro
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    // Inicia os timers
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);

    // Primeiro Ralph aparece imediatamente
    randomSquare();
}

function initialize() {
    addListenerHitBox();

    // Conecta o botão único ao jogo
    state.view.startBtn.addEventListener("click", startOrRestartGame);

    // Estado inicial: botão pronto para START
    state.view.startBtn.disabled = false;
}

initialize();