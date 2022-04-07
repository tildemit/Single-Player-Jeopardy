/**
This file runs all aspects of the game as the user interacts with it. Variables are meant to keep track of
the game's internal state (player score, is a clue currently in play, etc.).
*/

/** Is a question currently in play? */
var questionInPlay = false;
/** The player's score */
var score = 0;
/** The point value of the most recently clicked question */
var questionValue = 0;
/** The answer to the clicked question */
var questionAnswer;

/** Updates the score displayed to the user to reflect the value of the score variable. */
function updateScore(){
    if(score < 0){
        document.getElementById("player-score").innerText = "SCORE: -$" + Math.abs(score);
    } 
    else {
        document.getElementById("player-score").innerText = "SCORE: $" + score;
    }
}

/** 
What happens when the "I was right!" button is pressed, overriding what would otherwise be a wrong
answer, and correcting the points to match.
*/
function answerOverride() {
    var submitButton = document.getElementById("answer-submit");
    var overrideButton = document.getElementById("answer-override");
    var clueText = document.getElementById("clue-text");

    if (questionInPlay) {
        /** Add twice to make up for points that were lost */
        score += 2*questionValue; 
        updateScore();
        clueText.innerText = "Correct! The answer is: \"" + questionAnswer + "\".";
        overrideButton.disabled = true;
        submitButton.innerText = "Next Question";
    }
}

/**
Action when the submit button or next clue button is pressed
*/
function submitAnswer() {
    var submitButton = document.getElementById("answer-submit");
    var overrideButton = document.getElementById("answer-override");
    var clueText = document.getElementById("clue-text");
    var answerBox = document.getElementById("player-answer");

    if(submitButton.innerText === "Submit Answer"){
        /** Compare input answer to actual answer */
        if (answerBox.value.toLowerCase() == questionAnswer.toLowerCase()) {
            /** If right, tell the player and incremen their score */
            score += questionValue;
            clueText.innerText = "Correct! The answer is: \"" + questionAnswer + "\".";
        } 
        /** API doesn't have an answer to the clue */
        else if (questionAnswer.length == 0) { 
            score += questionValue;
            clueText.innerHTML = "This question is missing an answer";
        } 
        else {
            /** If wrong, give the override option and deduct points */
            score -= questionValue;
            overrideButton.disabled = false;
            clueText.innerText = "Incorrect. The answer is: " + questionAnswer + ".";
        }
        updateScore();

        /** Question is no longer in play, so change the text */
        submitButton.innerText = "Next Question";
    } 
    else if (submitButton.innerText === "Next Question"){
        // Clear the player's answer from the answer box and disable buttons
        answerBox.value = "";
        questionInPlay = false;
        submitButton.disabled = true;
        overrideButton.disabled = true;

        // Tell the player to select a clue in the main clue textbox
        clueText.innerText = "Select a Question"

        // Clear the info about the clue, as there is no clue in play
        document.getElementById("clue-category").innerText = "Category: ";
        document.getElementById("clue-value").innerText = "Value: ";
        document.getElementById("clue-airdate").innerText = "Air Date: ";

        // Change the "Next Question" button back into the "Submit Answer" button.
        submitButton.innerText = "Submit Answer";

        if (gameOver()){
            document.getElementById("clue-text").innerText = "The game is over. How did you do?";
        }
    }
}

/** Checks if category c is finished: all questions in that category have been clicked. */
function categoryFinished(c) {
    for (var row = 1; row < dimensions.rows; row++) {
        if (!grid[row][c].button_element.disabled) {
            return false;
        }
    }
    return true;
}

/** Checks if the game is over. */
function gameOver() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (!grid[i][j].button_element.disabled) {
                return false;
            }
        }
    }
    return true;
}

/** Behavior when a clue is clicked to be played */
function clueClick(r, c) {
    // Ignore presses if question is already in play
    if (questionInPlay) {
        return;
    }

    // If they click a category button, choose the lowest-value clue to play
    if (r == 0) {
        for (var row = 1; row < dimensions.rows; row++) {
            if (!grid[row][c].button_element.disabled) {
                clueClick(row, c);
                return;
            }
        }
    }

    questionInPlay = true;
    document.getElementById("answer-submit").disabled = false;
    // Disable the clicked button and display clue's text
    grid[r][c].button_element.disabled = true;
    document.getElementById("clue-text").innerText = grid[r][c].clue;

    // Display the clue's traits below the clue description, and keep track of correct and input values
    document.getElementById("clue-category").innerText = "Category: " + grid[r][c].category.toUpperCase();
    questionAnswer = grid[r][c].answer;
    questionValue = grid[r][c].value;
    document.getElementById("clue-value").innerText = "Value: $" + questionValue;
    var date = new Date(grid[r][c].air_date);
    document.getElementById("clue-airdate").innerText = "Air Date: " + date.toDateString().substring(4);

    // Check if category is finished and disable category button if it is.
    if (categoryFinished(c)) {
        grid[0][c].button_element.disabled = true;
    }
} 