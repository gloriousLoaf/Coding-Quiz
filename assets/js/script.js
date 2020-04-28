$(document).ready(function () {
    // vars for $startBtn click
    var $startBtn = $("#start-button");
    var $highScores = $("#high-scores");
    var $toggles = $("#toggles");
    var $answerButtons = $("#answer-buttons");
    var $card = $(".card");
    var $quizCard = $("#quiz-card");

    // Animates the quiz into view
    $("#start-button").on("click", function () {
        $startBtn.animate({ opacity: "0" });
        $highScores.animate({ opacity: "1" });
        $toggles.animate({ opacity: "1" });
        $answerButtons.animate({ opacity: "1" });
        $card.animate({ opacity: "1" });
        $quizCard.animate({ opacity: "1" });
        timeLeft();
        makeQuiz();     // below questionBank[]
    });

    // Starts the count down
    var sixtySec = document.getElementById("time");
    var secLeft = 60;
    function timeLeft() {
        var timerInterval = setInterval(function theTime() {
            secLeft--;
            sixtySec.textContent = secLeft;

            /* This specific displayQuestion value is set by clearBoard() 
                below to trigger clearInterval. Makes timer work on replay! */
            if (displayQuestion.textContent == "Click Start to Try Again!") {
                resetTimer();
                clearInterval(timerInterval);
            }
            // font goes red under 10 seconds
            if (secLeft < 10) {
                sixtySec.style.color = "#ff124d";
            }
            // at 0 endGame(), see line 201
            if (secLeft === 0) {
                resetTimer();
                clearInterval(timerInterval);
                setTimeout(function () {
                    alert("Pencils down. Your score was " + score + " out of 5.");
                }, 250);
                endGame();
            }
        }, 1000);
    }

    // puts 60sec on the clock, changes Timer color back to white
    function resetTimer() {
        secLeft = 60;
        sixtySec.textContent = secLeft;
        sixtySec.style.color = "#fff";
    }


    /* Question Card */

    // Possible questions
    var questionBank = [
        {
            question: "What HTML tag is used to underline text?",
            answers: ["<em>", "<u>", "<ul>", "<s>"],
            get correctAnswer() {
                return this.answers[1];
            }
        },
        {
            question: "What is the CSS name for device adaptabilty?",
            answers: ["Adaptable", "iDisplay", "Responsive", "Shifting"],
            get correctAnswer() {
                return this.answers[2];
            }
        },
        {
            question: "How many (conditions) must else { } have?",
            answers: ["0", "1", "2", "3"],
            get correctAnswer() {
                return this.answers[0];
            }
        },
        {
            question: "What is the syntax to get an element by id?",
            answers: ['$(id:quiz)', '$"(#quiz)"', '$("#quiz")', '"($quiz)"'],
            get correctAnswer() {
                return this.answers[2];
            }
        },
        {
            question: "What is the result of numArray.push(7)?",
            answers: ["numArray[7, 12, 4, 8]", "numArray(7)[12, 4, 8]", "numArray[12, 4, 8, 7]", "numArray[12, 4, 7, 8]"],
            get correctAnswer() {
                return this.answers[2];
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
        // display current question, if index less than
        // if (questionIndex < questionBank.length) {
        displayQuestion.textContent = currentQuestion;

        // loop to assign buttons with possible answers
        for (i = 0; i <= buttons.length - 1; i++) {
            var fillButtons = questionBank[questionIndex].answers;
            buttons[i].textContent = fillButtons[i];
        }
        // }
    }

    // add listener to all answer buttons, send user clicks to appropriate functions
    var answerButtons = document.getElementById("answer-buttons");
    answerButtons.addEventListener("click", function () {
        event.preventDefault();
        // puts textContent of the clicked button into userChoice
        var userChoice = event.target.textContent;
        // for styling userChoice button if correct
        var clickedButton = event.target.style;
        // pulls rightAnswer from questionBank
        var rightAnswer = questionBank[questionIndex].correctAnswer;
        console.log("User: " + userChoice);

        // setTimeouts briefly flash green buttons for correct answers and red for wrong
        if (userChoice == rightAnswer) {
            console.log("correct");
            clickedButton.backgroundColor = "green";
            setTimeout(function () {
                clickedButton.backgroundColor = "#0275d8";
            }, 400);
            setTimeout(function () {
                correctNext();
            }, 800);
        }
        else if (userChoice !== rightAnswer) {
            console.log("nope");
            clickedButton.backgroundColor = "red";
            setTimeout(function () {
                clickedButton.backgroundColor = "#0275d8";
            }, 400);
            setTimeout(function () {
                wrongNext();
            }, 800);
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
        setTimeout(function () {
            play = confirm("Would you like to save your score?");
            if (play == true) {
                console.log(true)
                questionIndex = 0;
                scoreText.textContent = "Score: " + score;
                highScore();
            }
            else {
                clearBoard();
            }
        }, 1000);
    }

    // clearBoard() was pretty hard to get right. Resets the board to play another round.
    function clearBoard() {
        score = 0;
        scoreText.textContent = "Score: " + score;
        // hides the quiz buttons until restart
        setTimeout(function () {
            $answerButtons.animate({ opacity: "0" });
        }, 1000);

        // display Start button, nextQuestion() starts with questionIndex++, need -1 to show first question
        setTimeout(function () {
            $startBtn.animate({ opacity: "1" });
            questionIndex = -1;
            nextQuestion();
            // slightly different displayQuestion than default, used for conditional in timeLeft() up top
            displayQuestion.textContent = "Click Start to Try Again!";
        }, 1500);
    }

    // highScore() prompts for initals and appends new li's to #score-list
    function highScore() {
        var $newScore = $("#score-list");
        var $playerInit = prompt("Enter Up To 3 Initials: ").toUpperCase() + "  " + score;
        console.log($playerInit);
        $newScore.append("<li>" + $playerInit + "<li>");
        // deletes last <br> in #breakers <div> per each high score. keeps card sizing stable.
        $("#breakers br:last").remove();
        clearBoard();
    }

    // clearBtn empties high score card, resets all the <br>'s
    var clearBtn = document.getElementById("clear-button");
    clearBtn.addEventListener("click", function () {
        $(".card-text li").remove();
        $("#breakers br").remove();
        // tried to for-loop this, but that never quite worked right
        $("#breakers").append("<br>", "<br>", "<br>", "<br>", "<br>", "<br>", "<br>");
    });

    // Restart button simply calls clearBoard()
    var restartBtn = document.getElementById("restart-button");
    restartBtn.addEventListener("click", function () {
        clearBoard();
    });

});