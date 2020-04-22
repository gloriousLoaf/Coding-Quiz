/* Start Button & Timer functions and events */

var startBtn = document.getElementById("start-btn");
var sixtySec = document.getElementById("time");
var secLeft = 60;

startBtn.addEventListener("click", function () {
    event.preventDefault();
    startBtn.style.opacity = 0;
    displayFirst();
    timeLeft();
    makeQuiz();     // below questionBank[]
});

// quiz starts off hidden, this displays it on Start click
function displayFirst() {
    var card = document.querySelector(".card");
    card.style.opacity = 1;
    var quizCard = document.querySelector("#quiz-card");
    quizCard.style.opacity = 1;
}

// Starts the count down
function timeLeft() {
    var timerInterval = setInterval(function theTime() {
        secLeft--;
        sixtySec.textContent = secLeft;

        /* This specific displayQuestion value is set by clearBoard() 
            below to trigger clearInterval. Makes timer work on replay! */
        if (displayQuestion.textContent == "Click to Try Again!") {
            resetTimer();
            clearInterval(timerInterval);
        }
        // font goes red under 10 seconds
        if (secLeft < 10) {
            sixtySec.style.color = "#ff124d";
        }
        // at 0 answer considered wrong, next question
        if (secLeft === 0) {
            resetTimer();
            clearInterval(timerInterval);
            setTimeout(function () {
                alert("Pencils down. Your score was " + score + " out of 5.");
            }, 250);
            endGame();
        }
    }, 300);                    // don't forget to set this to 1000!!!
}

// puts 60sec on the clock, changes Timer color back to white
function resetTimer() {
    secLeft = 60;
    sixtySec.textContent = secLeft;
    sixtySec.style.color = "#fff";
}


/* Question card functions & events */

// Possible questions
var questionBank = [
    {
        question: "What is the first question?",
        answers: ["boiled denim", "Sheryl Sandberg", "Brendan Eich", "null"],
        get correctAnswer() {
            return this.answers[1];
        }
    },
    {
        question: "What is the second question?",
        answers: ["hotdogs", "Sheryl Sandberg", "Brendan Eich", "null"],
        get correctAnswer() {
            return this.answers[1];
        }
    },
    {
        question: "What is the third question?",
        answers: ["milk-steak", "Sheryl Sandberg", "Brendan Eich", "null"],
        get correctAnswer() {
            return this.answers[1];
        }
    },
    {
        question: "What is the fourth question?",
        answers: ["jellybeans (raw)", "Sheryl Sandberg", "Brendan Eich", "null"],
        get correctAnswer() {
            return this.answers[1];
        }
    },
    {
        question: "What is the fifth question?",
        answers: ["straight paint", "Sheryl Sandberg", "Brendan Eich", "null"],
        get correctAnswer() {
            return this.answers[1];
        }
    }
];

// vars for changing currently displayed question in makeQuiz()
var questionIndex = 0;
var displayQuestion = document.getElementById("display-q");
var currentQuestion = questionBank[questionIndex].question;

// vars for assigning unique answers to buttons in makeQuiz()
var buttonA = document.getElementById("button-a");
var buttonB = document.getElementById("button-b");
var buttonC = document.getElementById("button-c");
var buttonD = document.getElementById("button-d");
var buttons = [buttonA, buttonB, buttonC, buttonD];

// Making the Quiz
function makeQuiz() {
    if (questionIndex < questionBank.length) {
        displayQuestion.textContent = currentQuestion;

        // loop to assign buttons with possible answers
        for (i = 0; i <= buttons.length - 1; i++) {
            var fillButtons = questionBank[i].answers;
            buttons[i].textContent = fillButtons[i];
        }
    }
}

// add listener to all buttons, send user clicks to appropriate functions
var answerButtons = document.getElementById("answer-buttons");
answerButtons.addEventListener("click", function () {
    event.preventDefault();
    // puts textContent of the clicked button into userChoice
    var userChoice = event.target.textContent;

    // pulls rightAnswer from questionBank
    var rightAnswer = questionBank[i].correctAnswer;
    console.log("User: " + userChoice);                     // need to dislay right / wrong

    if (userChoice == rightAnswer) {
        console.log("correct");
        correctNext();
    }
    else if (userChoice !== rightAnswer) {
        console.log("nope");
        wrongNext();
    }
})

// correctNext() adds a point and calls nextQuestion()
var score = 0;
var scoreText = document.getElementById("score-text");
function correctNext() {
    score++;
    scoreText.textContent = "Score: " + score;
    nextQuestion();
}

// wrongNext() subtracts time from timer and calls nextQuestion()
function wrongNext() {
    secLeft = secLeft - 5;
    sixtySec.textContent = secLeft;
    nextQuestion();
}

// nextQuestion() called when timer is up or after user selects an answer
function nextQuestion() {
    questionIndex++;
    console.log(questionIndex);
    if (questionIndex < questionBank.length) {
        currentQuestion = questionBank[questionIndex].question;
        displayQuestion.textContent = currentQuestion;
        for (i = 0; i <= buttons.length - 1; i++) {
            var fillButtons = questionBank[questionIndex].answers;
            buttons[i].textContent = fillButtons[i];
        }
    }
    else {
        setTimeout(function () {
            alert("Pencils down. Your score was " + score + " out of 5.");
        }, 300);
        endGame();
    }
}

// endGame() prompts to save high score, OK or Cancel clearBoard()
var play;
function endGame() {
    // resetTimer();
    setTimeout(function () {
        play = confirm("Would you like to save your score?");
        if (play == true) {
            console.log(true)
            questionIndex = 0;
            // score = 0;
            scoreText.textContent = "Score: " + score;
            highScore();
        }
        else {
            clearBoard();
        }
    }, 1000);
}

function clearBoard() {
    score = 0;
    scoreText.textContent = "Score: " + score;
    // hides the quiz buttons until restart
    setTimeout(function () {
        var quizCard = document.querySelector("#quiz-card");
        quizCard.style.opacity = 0;
    }, 1000);
    // display Start button, nextQuestion() starts with questionIndex++, need -1 to show first question
    setTimeout(function () {
        startBtn.style.opacity = 1;
        questionIndex = -1;
        nextQuestion();
        // slightly different displayQuestion than default, used for conditional in timeLeft() up top
        displayQuestion.textContent = "Click to Try Again!";
    }, 1500);
}

function highScore() {
    var scoreLi = document.createElement("li")
    var playerInit = prompt("Enter Initials: ").toUpperCase() + ": " + score;
    console.log(playerInit);
    scoreLi.innerHTML = playerInit;
    console.log(scoreLi);
    document.getElementById("score-list").appendChild(scoreLi);
    clearBoard();
}


/*  CODE GRAVEYARD  */

    //          // was part of restTime()
    // new setInterval to stop timeLeft()
    // var newTimerInterval = setInterval(function () {
    //     if (secLeft === 0) {
    //         clearInterval(newTimerInterval);
    //     }
    // }, 700);
    // secLeft = 61;   // that extra second is needed to make sure the html timer says 60, not 59


    //              // was part of nextQuestion()
        // else if (questionIndex == questionBank.length - 1) {
    //     score++;
    //     scoreText.textContent = "Score: " + score;
    // }
    // else if (questionIndex == questionBank.length - 1 && score < 5) {       // &&???
    //     alert("Pencils down. Your score was " + score + " out of 5.");
    //     // endGame();
    // }
    // else {
    //     setTimeout(function () {
    //         alert("Perfect score!");
    //     }, 300);
    //     endGame();
    // }
    // if (secLeft == 0) {
    //     setTimeout(function () {
    //         alert("Pencils down. Your score was " + score + " out of 5.");
    //     }, 250);
    //     endGame();
    // }
    // else if (questionIndex > 0 && questionIndex < questionBank.length) {
    //     setTimeout(function () {
    //         alert("Pencils down. Your score was " + score + " out of 5.");
    //     }, 300);
    //     endGame();
    // }


    //              // was part of endGame()
//         play = confirm("Would you like to play again?");
//         if (play == true) {
//             console.log(true)
//             questionIndex = 0;
//             score = 0;
//             scoreText.textContent = "Score: " + score;
//             clearBoard();
//         }
//         else {
//             clearBoard();
//         }
//     }, 1000);
// }
