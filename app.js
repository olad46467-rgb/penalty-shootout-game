const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

let goals = 0;
let shots = 0;
let gameRunning = false;

const TOTAL_SHOTS = 5;

const user = tg.initDataUnsafe?.user;

if (user) {
    document.getElementById("playerName").textContent =
        `👋 ${user.first_name}`;
}

let bestScore = Number(localStorage.getItem("penaltyBest")) || 0;

document.getElementById("best").textContent = bestScore;

const keeper = document.getElementById("keeper");
const ball = document.getElementById("ball");
const result = document.getElementById("result");
const startButton = document.getElementById("startButton");

function startGame() {

    goals = 0;
    shots = 0;
    gameRunning = true;

    document.getElementById("goals").textContent = goals;
    document.getElementById("shots").textContent =
        `${shots}/${TOTAL_SHOTS}`;

    result.textContent = "🎯 Choose where to shoot!";

    startButton.style.display = "none";

    resetPositions();
}

function shoot(direction) {

    if (!gameRunning) return;

    if (shots >= TOTAL_SHOTS) return;

    shots++;

    const directions = ["left", "center", "right"];

    const keeperDirection =
        directions[Math.floor(Math.random() * directions.length)];

    moveBall(direction);

    moveKeeper(keeperDirection);

    if (direction === keeperDirection) {

        result.textContent = "🧤 SAVED!";

    } else {

        goals++;

        result.textContent = "⚽ GOOOOAL!";

    }

    document.getElementById("goals").textContent = goals;

    document.getElementById("shots").textContent =
        `${shots}/${TOTAL_SHOTS}`;

    setTimeout(() => {

        if (shots >= TOTAL_SHOTS) {

            endGame();

        } else {

            resetPositions();

            result.textContent =
                `🎯 Penalty ${shots + 1} of ${TOTAL_SHOTS}`;

        }

    }, 900);
}

function moveBall(direction) {

    if (direction === "left") {

        ball.style.left = "25%";
        ball.style.bottom = "90px";

    }

    if (direction === "center") {

        ball.style.left = "50%";
        ball.style.bottom = "120px";

    }

    if (direction === "right") {

        ball.style.left = "75%";
        ball.style.bottom = "90px";

    }
}

function moveKeeper(direction) {

    if (direction === "left") {

        keeper.style.left = "25%";
        keeper.style.transform =
            "translate(-50%, -50%) rotate(-25deg)";

    }

    if (direction === "center") {

        keeper.style.left = "50%";
        keeper.style.transform =
            "translate(-50%, -50%)";

    }

    if (direction === "right") {

        keeper.style.left = "75%";
        keeper.style.transform =
            "translate(-50%, -50%) rotate(25deg)";

    }
}

function resetPositions() {

    ball.style.left = "50%";
    ball.style.bottom = "-55px";

    keeper.style.left = "50%";
    keeper.style.transform =
        "translate(-50%, -50%)";
}

function endGame() {

    gameRunning = false;

    if (goals > bestScore) {

        bestScore = goals;

        localStorage.setItem(
            "penaltyBest",
            bestScore
        );

        document.getElementById("best").textContent =
            bestScore;

        result.textContent =
            `🏆 NEW RECORD! ${goals}/${TOTAL_SHOTS}`;

    } else if (goals >= 4) {

        result.textContent =
            `🏆 AMAZING! ${goals}/${TOTAL_SHOTS}`;

    } else if (goals >= 3) {

        result.textContent =
            `🔥 GREAT SHOOTOUT! ${goals}/${TOTAL_SHOTS}`;

    } else if (goals >= 1) {

        result.textContent =
            `⚽ FINAL SCORE: ${goals}/${TOTAL_SHOTS}`;

    } else {

        result.textContent =
            `😢 0 goals. Try again!`;
    }

    startButton.textContent =
        "🔄 PLAY AGAIN";

    startButton.style.display = "block";
}
