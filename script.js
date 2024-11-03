// Function to navigate to the instructions page
function goToInstructions() {
    setTimeout(() => {
        document.getElementById('main-page').style.display = 'none';
        document.getElementById('instructions-page').style.display = 'flex';
        playChooseAudios();
    }, 1000);
}

// Function to start the quiz
function startQuiz() {
    document.getElementById('instructions-page').style.display = 'none';
    document.getElementById('quiz-page').style.display = 'flex';
    // showQuestion();
    // console.log("showQuestion");
}

// Audio files
const choosea = new Audio('./sounds/choodethecorrecta.mp3');
const choose = new Audio('./sounds/chooseTheCorrect.mp3');
const iknow = new Audio('sounds/i-know.mp3');
const HowMany = new Audio('sounds/how-many.mp3');
const HowManyA = new Audio('sounds/how-many-ar.mp3');
const clap = new Audio('sounds/clap.wav');

function playChooseAudios() {
    const startQuizButton = document.querySelector('.start-quiz-button');
    if (startQuizButton) {
        startQuizButton.disabled = true; // Disable the start button
    }

    choose.play().then(() => {
        choose.onended = () => {
            choosea.play().then(() => {
                choosea.onended = () => {
                    if (startQuizButton) {
                        startQuizButton.disabled = false; // Enable the start button after audio finishes
                    }
                };
            }).catch(error => {
                console.error('Failed to play choosea audio:', error);
                if (startQuizButton) {
                    startQuizButton.disabled = false; // Enable the start button if audio fails
                }
            });
        };
    }).catch(error => {
        console.error('Failed to play choose audio:', error);
        if (startQuizButton) {
            startQuizButton.disabled = false; // Enable the start button if audio fails
        }
    });
}

function playquizAudio() {
    HowMany.play().then(() => {
        HowMany.onended = () => {
            HowManyA.play().catch(error => {
                console.error('Failed to play HowManyA audio:', error);
            });
        };
    }).catch(error => {
        console.error('Failed to play HowMany audio:', error);
    });
}

window.onload = function() {
    console.log('Window loaded');

    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    } else {
        console.error('Element with ID "loading-screen" not found.');
    }

    document.body.style.visibility = 'visible';
    const main = document.getElementById('main-page');
    main.style.display = 'flex';

    if (window.location.pathname.includes("index.html")) {
        const button = document.getElementById('startBtn');
        if (button) {
            button.classList.add('slide-down');
        } else {
            console.error('Element with ID "startBtn" not found.');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    speechBubble.style.display = 'none';
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            goToInstructions(); // User interaction: Clicking the "Play" button
        });
    } else {
        console.error('Element with ID "startBtn" not found.');
    }

    const startQuizButton = document.querySelector('.start-quiz-button');
    if (startQuizButton) {
        startQuizButton.addEventListener('click', () => {
            startQuiz();
            showQuestion() // User interaction: Clicking the "Start Quiz" button
        });
    } else {
        console.error('Element with class "start-quiz-button" not found.');
    }

    const clapButton = document.getElementById('clapButton');
    if (clapButton) {
        clapButton.addEventListener('click', () => {
            const options = document.getElementById('options');
            options.style.display = 'flex';
            clapButton.style.display = 'none';
            playClapsAndProceed(() => {
                // Generate the options array here before passing it
                const correctText = numberToText[currentClapCount];
                const randomIncorrectAnswer = generateRandomIncorrectAnswer(currentClapCount);
                const randomText = numberToText[randomIncorrectAnswer];
                const newOptions = [correctText, randomText].sort(() => Math.random() - 0.5);

                setOptions(currentClapCount, newOptions);
                setTimeout(() => {
                    updateSpeechBubblePosition(true);
                    iknow.play()
                }, 1000);
            }, null);
        });


    } else {
        console.error('Element with ID "clapButton" not found.');
    }

    // const soundButton = document.getElementById('sound-button');
    // if (soundButton) {
    //     soundButton.addEventListener('click', () => {
    //         playquizAudio(); // User interaction: Clicking the sound button
    //     });
    // } else {
    //     console.error('Element with ID "sound-button" not found.');
    // }
});

// Game variables
let score = 0;
let currentQuestionIndex = 0;
let soundEnabled = true;
let isAnswering = false;
let isSoundPlaying = false;
let currentClapCount = 0;
let currentOptions = [];

// Mapping numbers to text
const numberToText = {
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine'
};

// Audio database with updated format
const audioDatabase = {
    options: {
        Two: { en: './sounds/2.mp3', ar: './sounds/2-ar.mp3' },
        Three: { en: './sounds/3.mp3', ar: './sounds/3-ar.mp3' },
        Four: { en: './sounds/4.mp3', ar: './sounds/4-ar.mp3' },
        Six: { en: './sounds/6.mp3', ar: './sounds/6-ar.mp3' },
        Five: { en: './sounds/5.mp3', ar: './sounds/5-ar.mp3' },
        Seven: { en: './sounds/7.mp3', ar: './sounds/7-ar.mp3' },
        Eight: { en: './sounds/8.mp3', ar: './sounds/8-ar(2).mp3' },
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
const homeBtn = document.getElementById('homeBtn');
const exitBtn = document.getElementById('exitBtn');

// Bubble positions for speech bubble
const bubblePositionsRegular = [
    { top: '58%', left: '85%' },
    { top: '55%', left: '15%' },
    { top: '60%', left: '10%' },
    { top: '50%', left: '60%' },
    { top: '30%', left: '70%' },
    { top: '50%', left: '53%' }
];

const bubblePositionsSmall = [
    { top: '50%', left: '75%' },
    { top: '60%', left: '5%' }
];

// Function to get the current bubble positions based on screen size
function getBubblePositions() {
    if (window.innerWidth <= 768) {
        return bubblePositionsSmall;
    } else {
        return bubblePositionsRegular;
    }
}

// Disable options during sound playback
function disableButtons() {
    optionButtons.forEach(button => button.disabled = true);
}

// Enable options
function enableButtons() {
    optionButtons.forEach(button => button.disabled = false);
}

// Sound button click handler
soundButton.onclick = () => {
    if (!isSoundPlaying) {
        playSequentialSounds([HowMany.src, HowMany.src, HowManyA.src], () => {
            playClapsAndProceed(clapCount => {
                setOptions(currentClapCount, currentOptions);
                setTimeout(() => {
                    updateSpeechBubblePosition(true);
                }, 1000);
            }, currentClapCount);
        });
    };
}

function playClapsAndProceed(callback, clapCount = null) {
    const count = clapCount !== null ? clapCount : Math.floor(Math.random() * 8) + 2;
    currentClapCount = count;
    let currentClap = 0;
    const clapDelay = 2000;

    function playClap() {
        console.log('Playing clap', currentClap + 1, 'of', count); // Add this line
        if (currentClap < count) {
            clap.play().then(() => {
                clap.onended = playClap;
                currentClap++;
            }).catch(error => {
                console.error('Failed to play clap audio:', error);
            });
        } else if (callback) {
            callback(count);
            enableButtons();
        }
    }

    setTimeout(playClap, clapDelay);
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

    playSequentialSounds([HowMany.src, HowMany.src, HowManyA.src]);
}

// Set the options for the question with one correct and one random choice
function setOptions(clapCount, options = null) {
    currentClapCount = clapCount;
    const correctText = numberToText[clapCount];
    const randomIncorrectAnswer = generateRandomIncorrectAnswer(clapCount);
    const randomText = numberToText[randomIncorrectAnswer];
    currentOptions = options || [correctText, randomText].sort(() => Math.random() - 0.5); // Shuffle if options are not provided

    optionButtons.forEach((button, index) => {
        button.innerText = currentOptions[index];
        button.onclick = () => {
            disableButtons(); // Disable options on answer
            const selectedAnswer = currentOptions[index];
            const audioFiles = audioDatabase.options[selectedAnswer]; // Get the corresponding audio files
            if (audioFiles) {
                playSequentialSounds([audioFiles.en, audioFiles.ar], () => {
                    checkAnswer(selectedAnswer, correctText);
                });
            } else {
                checkAnswer(selectedAnswer, correctText);
            }
        };
    });
}

// Generate a random incorrect answer different from the correct one
function generateRandomIncorrectAnswer(correctAnswer) {
    let incorrectAnswer;
    do {
        incorrectAnswer = Math.floor(Math.random() * 8) + 2; // Random number between 2 and 9
    } while (incorrectAnswer === correctAnswer);
    return incorrectAnswer;
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
                setTimeout(() => {
                    showQuestion(); // Show the next question
                }, 2000);
            } else {
                endQuiz();
            }
            enableButtons();
        } else {
            score--;
            scoreElement.innerText = score;
            updateSpeechBubblePosition(false);
            setTimeout(() => {
                // Repeat the same question with the same number of claps and options
                playSequentialSounds([HowMany.src, HowMany.src, HowManyA.src], () => {
                    playClapsAndProceed(clapCount => {
                        setOptions(currentClapCount, currentOptions);
                        playSound('sounds/i-know.mp3');
                        setTimeout(() => {
                            updateSpeechBubblePosition(true);
                        }, 1000);
                    }, currentClapCount);
                });
            }, 1000);
            enableButtons(); // تأخير لمدة 1 ثانية قبل الانتقال للسؤال التالي
        }
    });
}

// Function to play single sound files and execute callback after sound ends
function playSound(file, callback) {
    if (isSoundPlaying) return;
    const audio = new Audio(file);

    // Add loading check
    audio.addEventListener('canplaythrough', () => {
        console.log(`${file} loaded and ready to play`);
    });

    isSoundPlaying = true;

    // Add iOS specific handling
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log(`${file} playing successfully`);
                audio.onended = () => {
                    isSoundPlaying = false;
                    if (callback) callback();
                    enableButtons();
                };
            })
            .catch(error => {
                console.error(`Failed to play ${file}:`, error);
                isSoundPlaying = false;
                if (callback) callback();
                enableButtons();
            });
    }
}
// Test function to check if playClapsAndProceed is triggered by user interaction
function testUserInteraction() {
    const event = window.event;
    if (event) {
        console.log('playClapsAndProceed triggered by user interaction:', event.type);
    } else {
        console.log('playClapsAndProceed not triggered by user interaction');
    }
}

// Play sounds sequentially
function playSequentialSounds(files, callback) {
    console.log('playClapsAndProceed triggered by user interaction: ended');
    testUserInteraction()
    if (files.length === 0 || isSoundPlaying) {
        if (callback) callback();
        return;
    }

    const [firstFile, ...remainingFiles] = files;
    if (typeof firstFile !== 'string') {
        console.error(`Invalid audio file path: ${firstFile}`);
        playSequentialSounds(remainingFiles, callback);
        return;
    }

    const audio = new Audio(firstFile);
    isSoundPlaying = true; // Set flag to indicate a sound is playing
    audio.play().then(() => {
        audio.onended = () => {
            isSoundPlaying = false; // Reset flag when sound ends
            playSequentialSounds(remainingFiles, callback);
        };
    }).catch(error => {
        console.error(`Failed to play audio file: ${firstFile}`, error);
        isSoundPlaying = false;
        playSequentialSounds(remainingFiles, callback);
    });
}

// Update speech bubble position based on the answer
function updateSpeechBubblePosition(isCorrect) {
    const bubblePositions = getBubblePositions();
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
    balloonAnimation.classList.remove('hidden');
    setTimeout(() => {
        balloonAnimation.classList.add('hidden');
    }, 2000);
}

// End the quiz and navigate to end page
function endQuiz() {
    document.getElementById('quiz-page').style.display = 'none';
    document.getElementById('end-container').style.display = 'block';
    endBage.textContent = score;
}

homeBtn.onclick = () => {
    window.location.href = "./index.html";
};

exitBtn.onclick = () => {
    window.location.href = "https://englisheasy.net/dashboard";
};