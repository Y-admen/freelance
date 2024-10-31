// Game variables
let score = 0;
let currentQuestionIndex = 0;
let soundEnabled = true;
let isAnswering = false;
let isSoundPlaying = false;

// Audio setup
const iknow = new Audio('sounds/i-know.mp3');
const HowMany = new Audio('sounds/how-many.mp3');
const HowManyA = new Audio('sounds/how-many-ar.mp3');
const clap = new Audio('sounds/clap.wav');

// Audio database with updated format
const audioDatabase = {
    options: {
        Two: { en: './sounds/2.mp3', ar: './sounds/2-ar.mp3' },
        Three: { en: './sounds/3.mp3', ar: './sounds/3-ar.mp3' },
        Four: { en: './sounds/4.mp3', ar: './sounds/4-ar.mp3' },
        Five: { en: './sounds/5.mp3', ar: './sounds/5-ar.mp3' },
        Seven: { en: './sounds/7.mp3', ar: './sounds/7-ar.mp3' },
        Eight: { en: './sounds/8.mp3', ar: './sounds/8-ar.mp3' },
        Nine: { en: './sounds/9.mp3', ar: './sounds/9-ar.mp3' }
    }
};

// Questions array
const questions = Array(10).fill({ text: "How many times did your teacher clap?" });


// DOM Elements
const questionText = document.getElementById("question-text");
const scoreElement = document.getElementById("score");
const soundButton = document.getElementById("sound-button");
const balloonAnimation = document.getElementById("balloon-animation");
const speechBubble = document.getElementById("speech-bubble");
const optionButtons = document.querySelectorAll(".option-button");
const endBage = document.getElementById("final-score");

// Bubble positions for speech bubble
const bubblePositions = [
    { top: '58%', left: '85%' },
    { top: '55%', left: '15%' },
    { top: '60%', left: '10%' },
    { top: '50%', left: '60%' },
    { top: '30%', left: '70%' },
    { top: '50%', left: '53%' }
];

// Mapping numbers to text
const numberToText = {
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine"
};

window.addEventListener('load', () => {
    // Hide loading screen
    document.getElementById('loading-screen').style.display = 'none';

    // Show the main content
    document.body.style.visibility = 'visible';
});

// Disable options during sound playback
function disableButtons() {
    optionButtons.forEach((button) => {
        button.disabled = true; // تعطيل الأزرار
    });
}

// Enable options
function enableButtons() {
    optionButtons.forEach((button) => {
        button.disabled = false; // إعادة تفعيل الأزرار
    });
}

// Sound button click handler
soundButton.onclick = () => {
    if (!isAnswering) {
        // إيقاف صوت التصفيق إذا كان يشغل حاليًا
        clap.pause();
        clap.currentTime = 0; // إعادة تعيين الصوت إلى البداية

        playSequentialSounds([HowMany, HowMany, HowManyA], () => {
            playClapsAndProceed(() => {
                playSound('sounds/i-know.mp3');
                updateSpeechBubblePosition(true);
            });
        });
    }
};

// Generate a random number of claps and play them after a delay
function playClapsAndProceed(callback) {
    const clapCount = Math.floor(Math.random() * 8) + 2; // Random number between 2 and 9
    let currentClap = 0;
    const clapDelay = 2000; // Delay in milliseconds before starting the claps

    function playClap() {
        if (currentClap < clapCount) {
            clap.play();
            clap.onended = playClap;
            currentClap++;
        } else if (callback) {
            callback(clapCount);
            enableButtons(); // Enable options after finishing clap sounds
        }
    }

    setTimeout(playClap, clapDelay); // Start clapping after delay
}


function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.classList.remove('hidden'); // إظهار الفتافيت

    for (let i = 0; i < 100; i++) { // عدد الفتافيت المراد إضافتها
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');

        // تعيين موقع عشوائي للفتافيت على الشاشة
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // لون عشوائي

        confettiContainer.appendChild(confetti); // إضافة الفتافيت للحاوية

        const fallDuration = Math.random() * 1 + 1; // تحديد مدة السقوط
        confetti.style.animationDuration = `${fallDuration}s`;

        setTimeout(() => {
            confetti.remove(); // حذف الفتافيت بعد انتهاء الحركة
        }, fallDuration * 1000);
    }
}

// Display the current question, set bubble, and play question sounds
function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.innerText = question.text;

    disableButtons(); // Disable options at the start

    playSequentialSounds([HowMany, HowMany, HowManyA], () => {
        playClapsAndProceed(clapCount => {
            // Set the correct and random option
            setOptions(clapCount);
            playSound('sounds/i-know.mp3')
            setTimeout(() => {
                updateSpeechBubblePosition(true);
            }, 1000);

        });
    });
}

// Set the options for the question with one correct and one random choice
function setOptions(correctCount) {
    const correctText = numberToText[correctCount];
    const randomIncorrectAnswer = generateRandomIncorrectAnswer(correctCount);
    const randomText = numberToText[randomIncorrectAnswer];
    const answers = [correctText, randomText].sort(() => Math.random() - 0.5); // Shuffle

    optionButtons.forEach((button, index) => {
        button.innerText = answers[index];
        button.onclick = () => {
            disableButtons(); // Disable options on answer
            checkAnswer(answers[index], correctText);
        };
    });
}

// Generate a random incorrect answer different from the correct one
function generateRandomIncorrectAnswer(correctAnswer) {
    const options = Object.keys(numberToText).map(Number).filter(opt => opt !== correctAnswer);
    return options[Math.floor(Math.random() * options.length)];
}

// Check answer and play appropriate sounds
function checkAnswer(selectedAnswer, correctAnswerText) {
    const isCorrect = selectedAnswer === correctAnswerText;
    const feedbackAudio = isCorrect ? "./sounds/Excellent.mp3" : "./sounds/false.mp3";

    playSound(feedbackAudio, () => {
        if (isCorrect) {
            createConfetti();
            score++;
            scoreElement.innerText = score;
            currentQuestionIndex++;
            const winAudio = new Audio('./sounds/win.mp3');
            winAudio.play();
            if (currentQuestionIndex < questions.length) {
                showQuestion(); // Show the next question
            } else {
                endQuiz();
            }
            enableButtons();
        } else {
            score--;
            scoreElement.innerText = score;
            updateSpeechBubblePosition(false);
            setTimeout(() => {
                showQuestion(); // Show the next question// إعادة تفعيل الأزرار بعد الانتقال للسؤال التالي
            }, 1000);
            enableButtons(); // تأخير لمدة 1 ثانية قبل الانتقال للسؤال التالي
        }
    });
}

// Function to play single sound files and execute callback after sound ends
function playSound(file, callback) {
    if (isSoundPlaying) return;
    const audio = new Audio(file);
    isSoundPlaying = true;
    audio.play();
    audio.onended = () => {
        isSoundPlaying = false;
        if (callback) callback();
        enableButtons(); // Enable options after sound ends
    };
}

// Play sounds sequentially
function playSequentialSounds(sounds, callback) {
    if (sounds.length === 0 || isSoundPlaying) {
        if (callback) callback();
        return;
    }

    const [firstSound, ...remainingSounds] = sounds;
    isSoundPlaying = true; // Set flag to indicate a sound is playing
    firstSound.play();
    firstSound.onended = () => {
        isSoundPlaying = false; // Reset flag when sound ends
        playSequentialSounds(remainingSounds, callback);
    };
}

// Update speech bubble position based on the answer
function updateSpeechBubblePosition(isCorrect) {
    if (isCorrect) {
        const bubblePosition = bubblePositions[currentQuestionIndex % bubblePositions.length];
        speechBubble.style.top = bubblePosition.top;
        speechBubble.style.left = bubblePosition.left;
        speechBubble.style.display = 'block'; // Show the bubble when needed
    } else {
        speechBubble.style.display = 'none'; // Hide if the answer is incorrect
    }
}

// Celebration animation
function showCelebration() {
    balloonAnimation.style.display = "block";
    setTimeout(() => {
        balloonAnimation.style.display = "none";
    }, 2000);
}

// End the quiz and navigate to end page
function endQuiz() {
    endBage.style.display = "block";
    endBage.innerText = `Your final score is: ${score}`;
}

// Initialize the game
function initializeGame() {
    speechBubble.style.display = 'none'; // Hide the bubble at the start
    showQuestion(); // Show the first question
}

// Start the game
initializeGame();