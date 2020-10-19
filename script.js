var timer = document.getElementById("timer");
var startQuizButton = document.getElementById("start-quiz");
var mainContentEl = document.getElementById("main-content");
var resultEl = document.getElementById("result");
var viewHighscoresEl = document.querySelector("a");

var currentQuestionIndex = 0;
var score = 0;
var hiscoresList = [];
var secondsLeft = 80;

// Question and answer bank
var questions = [
    {
      question: "Commonly used data types do NOT include:",
      answers: [
        { text: "strings", correct: false },
        { text: "numbers", correct: false },
        { text: "booleans", correct: false },
        { text: "alerts", correct: true },
      ],
    },
    {
      question:
        "The condition in an if/else statement is contained within _____?",
      answers: [
        { text: "parenthesis", correct: true },
        { text: "curly brackets", correct: false },
        { text: "quotation marks", correct: false },
        { text: "square brackets", correct: false },
      ],
    },
    {
        question: "In which HTML element tag do we put the JavaScript?",
        answers: [
          { text: "<body>", correct: false },
          { text: "<script>", correct: true },
          { text: "<javascript>", correct: false },
          { text: "<link>", correct: false },
        ],
    },
    {
        question:
          "String values must be enclosed within _____ when being assigned to variables?",
        answers: [
          { text: "quotes", correct: true },
          { text: "curly brackets", correct: false },
          { text: "parenthesis", correct: false },
          { text: "commas", correct: false },
        ],
      },
      {
        question: "Arrays in JavaScript can be used to store _____.",
        answers: [
          { text: "numbers and strings", correct: false },
          { text: "other Arrays", correct: false },
          { text: "booleans", correct: false },
          { text: "all of the above", correct: true },
        ],
      }
];

// Set Timer function for quiz
function setTimer() {
  var timerInterval = setInterval(function() {
    secondsLeft--;
    timer.textContent = `Time: ${secondsLeft}`;

    if(secondsLeft <= 0) { // if timer runs out, the quiz ends
      clearInterval(timerInterval);
      secondsLeft = 0;
      timer.textContent = `Time: ${secondsLeft}`;
      renderEnd();
    }

  }, 1000);
}

// Event listener for when the "start quiz" button is clicked
startQuizButton.addEventListener("click", function(event) {
    event.preventDefault();
    setTimer();
    renderQuestion();
});

// Renders questions from the questions array
function renderQuestion() {
    mainContentEl.innerHTML = "";

    if(currentQuestionIndex === questions.length) {
        renderEnd();
    }

    else {
    // Render question
    var questionEl = document.createElement("h2");
    questionEl.textContent = questions[currentQuestionIndex].question;
    mainContentEl.append(questionEl);

    // Render list of answers
    var ul = document.createElement("ul");
    mainContentEl.append(ul);

    // Loops through question bank and generates a button element for each choice
    for(var i = 0; i < questions[currentQuestionIndex].answers.length; i++) {

        var button = document.createElement("button");
        button.classList.add("button");
        if (questions[currentQuestionIndex].answers[i].correct) {
          button.setAttribute("correct", true);
        }
        button.textContent = `${i+1}. ${questions[currentQuestionIndex].answers[i].text}`;

        button.addEventListener("click", buttonClick);
  
        mainContentEl.appendChild(button);
    }

    currentQuestionIndex++; //increment currentQuestionIndex
    }
}

// Displays either right or wrong to the user based on their answer choice, could probably be improved bc of DRY
function buttonClick(event) {
    if(event.target.matches("button") && event.target.getAttribute("correct") === "true") {
        score += 100;
        resultEl.innerHTML = '<h3 id="result">Correct!</h3>';
        resultDisappear();
    }
    else {
        secondsLeft -= 10;
        resultEl.innerHTML = '<h3 id="result">Wrong!</h3>';
        resultDisappear();
    }

    renderQuestion();
}

// Timer function that makes question result message disappear after a set interval
function resultDisappear() {
    var timeUntilDisappear = 1;
    var timerInterval = setInterval(function() {
        timeUntilDisappear--;
        
        if(timeUntilDisappear === 0) {
          clearInterval(timerInterval);
          resultEl.innerHTML = "";
        }
      }, 600);
}

// Renders display for end of quiz
function renderEnd() {
    mainContentEl.innerHTML = "<h2>All done!</h2>";
    mainContentEl.append(document.createElement("p").textContent = `Your final score is ${score}`);

    var formEl = document.createElement("form");
    formEl.textContent = "Enter initials: ";
        var inputEl = document.createElement("input");
        inputEl.setAttribute("id", "initial-input");
        formEl.append(inputEl);
        var button = document.createElement("button");
        button.type = "submit";
        button.textContent = "Submit";
        button.setAttribute("id", "initial-submit");
        formEl.append(button);

    formEl.addEventListener("submit", generateHiscores);

    mainContentEl.append(formEl);

}

// Function to generate highscores
function generateHiscores(event) {
    event.preventDefault();

    var storedHiscoresList = JSON.parse(localStorage.getItem("hiscores"));
    if(storedHiscoresList !== null) {
        hiscoresList = storedHiscoresList;
    }

    var userInitials = document.getElementById("initial-input").value;

    var user = {
        userInits: userInitials,
        userScore: score
    };

    hiscoresList.push(user);

    localStorage.setItem("hiscores", JSON.stringify(hiscoresList));

    renderHiscores();
}

// Renders highscores onto page
function renderHiscores() {
    event.preventDefault();

    var storedHiscoresList = JSON.parse(localStorage.getItem("hiscores"));
    if(storedHiscoresList !== null) {
        hiscoresList = storedHiscoresList;
    }

    sortedHiscores = hiscoresList.sort((a, b) => b.userScore - a.userScore); // sorts hiscore list, returns sorted array

    mainContentEl.innerHTML = "<h2>Highscores</h2>";
    var olEl = document.createElement("ol");
    for (var i = 0; i<hiscoresList.length; i++) {
        var liEl = document.createElement("li");
        liEl.textContent = `${sortedHiscores[i].userInits} - ${sortedHiscores[i].userScore}`;
        olEl.append(liEl);
    }
    mainContentEl.append(olEl);

    // Create and append button to page
    var button = document.createElement("button");
    button.textContent = "Go back";
    button.setAttribute("id", "go-back");
    button.addEventListener("click", function(event) {
        if(event.target.getAttribute("id") === "go-back") {
            location.reload();
        }
    });
    mainContentEl.append(button);

    var button2 = document.createElement("button");
    button2.textContent = "Clear Highscores";
    button2.setAttribute("id", "clear");
    button2.addEventListener("click", function(event) {
        if(event.target.getAttribute("id") === "clear") {
            localStorage.clear(); // clears localStorage
            olEl.innerHTML = ""; // clears innerHTML
        }
    });
    mainContentEl.append(button2);
}

viewHighscoresEl.addEventListener("click", renderHiscores);