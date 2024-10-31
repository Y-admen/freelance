// Function to navigate to the instructions page
function goToInstructions() {
    playMainAudio();
    setTimeout(() => {
        window.location.href = "instructions.html"; // Redirect to instructions after a delay
    }, 1000);
}

function startQuiz() {
    window.location.href = "Mark.html"; // Redirect to the quiz page
}

// Audio files
const choosea = new Audio('./sounds/choodethecorrecta.mp3');
const choose = new Audio('./sounds/chooseTheCorrect.mp3');
const easy = new Audio('./sounds/english-easy.mp3');

function playMainAudio() {
    easy.play(); // Play the main audio
}

function playChooseAudios() {
    choose.play(); // Play choose audio
    choose.onended = () => {
        choosea.play(); // Play choose-a audio after the first finishes
    };
}

window.onload = function() {
    console.log('Window loaded');
    const button = document.getElementById('startBtn');
    if (button) {
        button.classList.add('slide-down');
    } else {
        console.error('Element with ID "startBtn" not found.');
    }

    if (window.location.pathname.includes("instructions.html")) {
        playChooseAudios();
    }

    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    } else {
        console.error('Element with ID "loading-screen" not found.');
    }

    document.body.style.visibility = 'visible';
};

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', goToInstructions);
    } else {
        console.error('Element with ID "startBtn" not found.');
    }
});