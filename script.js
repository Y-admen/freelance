// Function to navigate to the instructions page
function goToInstructions() {
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
const instructionAudio = new Audio('./sounds/choodethecorrecta.mp3'); // Add instruction audio
const quizAudio = new Audio('./sounds/how-many.mp3'); // Add quiz audio

function playChooseAudios() {
    choose.play(); // Play choose audio
    choose.onended = () => {
        choosea.play(); // Play choose-a audio after the first finishes
    };
}

window.onload = function() {
    console.log('Window loaded');

    // Check for startBtn only on index.html
    if (window.location.pathname.includes("index.html")) {
        const button = document.getElementById('startBtn');
        if (button) {
            button.classList.add('slide-down');
        } else {
            console.error('Element with ID "startBtn" not found.');
        }
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
    // Check for startBtn only on index.html
    if (window.location.pathname.includes("index.html")) {
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                goToInstructions();
                // Ensure audio playback is triggered by user interaction
                choose.play();
            });
        } else {
            console.error('Element with ID "startBtn" not found.');
        }
    }

    // Play instruction audio on the instructions page
    if (window.location.pathname.includes("instructions.html")) {
        const startQuizButton = document.querySelector('.start-quiz-button');
        if (startQuizButton) {
            startQuizButton.addEventListener('click', () => {
                instructionAudio.play();
                instructionAudio.onended = startQuiz;
            });
        } else {
            console.error('Element with class "start-quiz-button" not found.');
        }
    }

    // Play quiz audio on the quiz page
    if (window.location.pathname.includes("Mark.html")) {
        const soundButton = document.getElementById('sound-button');
        if (soundButton) {
            soundButton.addEventListener('click', () => {
                quizAudio.play();
            });
        } else {
            console.error('Element with ID "sound-button" not found.');
        }
    }
});