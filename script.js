function goToInstructions() {
    playMainAudio();
    setTimeout(() => {
        window.location.href = "instructions.html";
    }, 1000);
}

function startQuiz() {
    window.location.href = "Mark.html";
}

const choosea = new Audio('./sounds/choodethecorrecta.mp3');
const choose = new Audio('./sounds/chooseTheCorrect.mp3');
const easy = new Audio('./sounds/english-easy.mp3');

function playMainAudio() {
    easy.play();
}

function playChooseAudios() {
    choose.play();
    choose.onended = () => {
        choosea.play();
    };
}

window.onload = function() {
    if (window.location.pathname.includes("instructions.html")) {
        playChooseAudios();
    }
};