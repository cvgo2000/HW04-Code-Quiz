var timer = document.getElementById("timer");
var startQuizButton = document.getElementById("start-quiz");
var mainContentEl = document.getElementById("main-content");
var resultEl = document.getElementById("result");
var viewHighscoresEl = document.querySelector("a");

var currentQuestionIndex = 0;
var score = 0;
var hiscoresList = [];
var secondsLeft = 120;

// Question and answer list
var questions = [
    {
      question: "What is the highest grossing film of all time without taking inflation into account?",
      answers: [
        { text: "Titanic", correct: false },
        { text: "Avatar", correct: false },
        { text: "Star Wars: The Force Awakens", correct: false },
        { text: "Avengers: Endgame", correct: true },
      ],
    },
    {
      question:
        "Which actor or actress is killed off in the opening scene of the movie Scream?",
      answers: [
        { text: "Drew Barrymore", correct: true },
        { text: "Courtney Cox", correct: false },
        { text: "Neve Campbell", correct: false },
        { text: "Rose McGowan", correct: false },
      ],
    },
    {
        question: "What is the name of Han Solo's ship?",
        answers: [
          { text: "The Peanutbutter Falcon", correct: false },
          { text: "The Millenium Falcon", correct: true },
          { text: "The X-Wing", correct: false },
          { text: "Star Destroyer", correct: false },
        ],
    },
    {
        question:
          "Which film did Steven Spielberg win his first Oscar for Best Director?",
        answers: [
          { text: "Schindler's List", correct: true },
          { text: "Jaws", correct: false },
          { text: "E.T.", correct: false },
          { text: "Catch Me If You Can", correct: false },
        ],
      },
      {
        question:
          "What is Harry Potter's patronus?",
        answers: [
          { text: "A horse", correct: false },
          { text: "An otter", correct: false },
          { text: "A stag", correct: true },
          { text: "A wolf", correct: false },
        ],
      },
      {
        question:
          "What is the first feature-length animated Disney film ever released?",
        answers: [
          { text: "Snow White and the Seven Dwarfs", correct: true },
          { text: "Fantasia", correct: false },
          { text: "Pinnochio", correct: false },
          { text: "Dumbo", correct: false },
        ],
      },
      {
        question: "What is the name of Quint's shark-hunting boat in Jaws?",
        answers: [
          { text: "The Whale", correct: false },
          { text: "The Orca", correct: false },
          { text: "The Dolphin", correct: false },
          { text: "The Shark", correct: true },
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