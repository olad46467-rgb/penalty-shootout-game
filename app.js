const tg = window.Telegram?.WebApp;

/*
 * Telegram-only access
 */
if (!tg || !tg.initData) {

    document.body.innerHTML = `
        <div style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            padding:30px;
            margin:0;
            background:#071a12;
            color:white;
            font-family:Arial,sans-serif;
        ">
            <div style="max-width:420px;">

                <div style="
                    font-size:64px;
                    margin-bottom:15px;
                ">
                    ⚽
                </div>

                <h2 style="
                    margin:0 0 12px;
                    font-size:24px;
                ">
                    Game available on Telegram
                </h2>

                <p style="
                    color:#c8d5cd;
                    font-size:16px;
                    line-height:1.5;
                    margin:8px 0;
                ">
                    This game can only be played inside Telegram.
                </p>

                <p style="
                    color:#c8d5cd;
                    font-size:15px;
                    line-height:1.5;
                ">
                    Open it from our Telegram bot to start playing! 🚀
                </p>

            </div>
        </div>
    `;

    throw new Error("Telegram Mini App required");
}

tg.ready();
tg.expand();


/*
 * Game variables
 */
let goals = 0;
let shots = 0;
let gameRunning = false;

const TOTAL_SHOTS = 5;


/*
 * Telegram user
 */
const user = tg.initDataUnsafe?.user;

if (user) {

    const playerName =
        document.getElementById("playerName");

    if (playerName) {

        playerName.textContent =
            `👋 ${user.first_name}`;
    }
}


/*
 * Best score
 */
let bestScore =
    Number(localStorage.getItem("penaltyBest")) || 0;

document.getElementById("best").textContent =
    bestScore;


/*
 * Elements
 */
const keeper =
    document.getElementById("keeper");

const ball =
    document.getElementById("ball");

const kicker =
    document.getElementById("kicker");

const result =
    document.getElementById("result");

const startButton =
    document.getElementById("startButton");


/*
 * Start game
 */
function startGame() {

    goals = 0;
    shots = 0;

    gameRunning = true;

    document.getElementById("goals").textContent =
        "0";

    document.getElementById("shots").textContent =
        `0/${TOTAL_SHOTS}`;

    result.textContent =
        "🎯 Choose where to shoot!";

    startButton.style.display =
        "none";

    resetScene();
}


/*
 * Shoot
 */
function shoot(direction) {

    if (!gameRunning) return;

    if (shots >= TOTAL_SHOTS) return;

    shots++;


    const directions = [
        "left",
        "center",
        "right"
    ];


    const keeperDirection =
        directions[
            Math.floor(
                Math.random() *
                directions.length
            )
        ];


    /*
     * Kicker animation
     */
    kicker.style.transform =
        "translateX(-50%) rotate(-8deg)";


    /*
     * Ball movement
     */
    if (direction === "left") {

        ball.style.left = "28%";
        ball.style.bottom = "245px";
        ball.style.transform =
            "translateX(-50%) scale(0.72)";
    }


    if (direction === "center") {

        ball.style.left = "50%";
        ball.style.bottom = "260px";
        ball.style.transform =
            "translateX(-50%) scale(0.68)";
    }


    if (direction === "right") {

        ball.style.left = "72%";
        ball.style.bottom = "245px";
        ball.style.transform =
            "translateX(-50%) scale(0.72)";
    }


    /*
     * Goalkeeper movement
     */
    if (keeperDirection === "left") {

        keeper.style.left = "25%";

        keeper.style.transform =
            "translateX(-50%) rotate(-35deg)";
    }


    if (keeperDirection === "center") {

        keeper.style.left = "50%";

        keeper.style.transform =
            "translateX(-50%)";
    }


    if (keeperDirection === "right") {

        keeper.style.left = "75%";

        keeper.style.transform =
            "translateX(-50%) rotate(35deg)";
    }


    /*
     * Result
     */
    if (direction === keeperDirection) {

        result.textContent =
            "🧤 SAVED!";

    } else {

        goals++;

        result.textContent =
            "⚽ GOOOOAL!";
    }


    document.getElementById("goals").textContent =
        goals;

    document.getElementById("shots").textContent =
        `${shots}/${TOTAL_SHOTS}`;


    /*
     * Next shot
     */
    setTimeout(() => {

        kicker.style.transform =
            "translateX(-50%)";

        if (shots >= TOTAL_SHOTS) {

            endGame();

        } else {

            resetScene();

            result.textContent =
                `🎯 Penalty ${shots + 1} of ${TOTAL_SHOTS}`;
        }

    }, 850);
}


/*
 * Reset scene
 */
function resetScene() {

    ball.style.left =
        "50%";

    ball.style.bottom =
        "92px";

    ball.style.transform =
        "translateX(-50%)";


    keeper.style.left =
        "50%";

    keeper.style.transform =
        "translateX(-50%)";
}


/*
 * End game
 */
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

    } else if (goals === 5) {

        result.textContent =
            "🔥 PERFECT SHOOTOUT! 5/5";

    } else if (goals >= 4) {

        result.textContent =
            `🏆 AMAZING! ${goals}/${TOTAL_SHOTS}`;

    } else if (goals >= 3) {

        result.textContent =
            `🔥 GREAT JOB! ${goals}/${TOTAL_SHOTS}`;

    } else if (goals >= 1) {

        result.textContent =
            `⚽ FINAL SCORE: ${goals}/${TOTAL_SHOTS}`;

    } else {

        result.textContent =
            "😢 No goals! Try again!";
    }


    startButton.textContent =
        "🔄 PLAY AGAIN";

    startButton.style.display =
        "block";
}
