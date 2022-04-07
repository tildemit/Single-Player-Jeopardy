/** 
File used to display visual elements of the game to the player, referencing values retrieved fromm
the API caller fall as well as the game-logic file.
*/

/** The 2D array of clues. */
var grid;
/** The number of rows and columns.*/
var dimensions = { rows: 6, cols: 6 };

/** 
Creates the right hand portion of the screen that displays the clue, question info, answer textbox,
and control buttons
*/
function createSidebar() {
    var sidebar = document.createElement("div");
    sidebar.className = "d-flex flex-column flex-grow-1 mx-2 mt-2";
    sidebar.id = "sidebar";

    var scoreE = document.createElement("h1");
    scoreE.className = "text-center m-0"
    scoreE.id = "player-score"
    /** Starts with a score of $0 */
    scoreE.innerText = "SCORE: $0";
    sidebar.appendChild(scoreE);

    var question_jumbotron = document.createElement("div");
    question_jumbotron.className = "jumbotron jumbotron-fluid my-2 flex-grow-1";

    /** Main element of the sidebar containing the clue-text as well as information
     *  about the player getting the answer right or wrong
     */
    var clue = document.createElement("h2");
    clue.className = "text-center align-middle";
    clue.id = "clue-text";
    clue.innerText = "Select a Question";
    question_jumbotron.appendChild(clue);
    sidebar.appendChild(question_jumbotron);

    /** Category of the chosen question shown under the clue */
    var category = document.createElement("h4");
    category.className = "text-center mt-0 p-0";
    category.id = "clue-category";
    category.innerText = "Category: ";
    sidebar.appendChild(category);

    /** Point value of the chosen question shown under the clue*/
    var value = document.createElement("h4");
    value.className = "text-center mb-2 p-0";
    value.id = "clue-value";
    value.innerText = "Value: ";
    sidebar.appendChild(value);
    
    /** Air data of the chosen question shown under the clue*/
    var clue_airdate = document.createElement("h4");
    clue_airdate.className = "text-center mb-2 p-0";
    clue_airdate.id = "clue-airdate";
    clue_airdate.innerText = "Air Date: ";
    sidebar.appendChild(clue_airdate);

    /** Input text box where the player will enter their answer */
    var answer = document.createElement("div");
    answer.className = "input-group";

    var input = document.createElement("input");
    input.type = "text";
    input.className = "form-control"
    input.id = "player-answer";
    input.placeholder = "Answer (not in the form of a question!)";
    answer.appendChild(input);
    sidebar.appendChild(answer);

    var button_row = document.createElement("div");
    button_row.className = "d-flex flex-row";

    /** Button to submit the desired answer */
    var submit = document.createElement("button");
    submit.type = "button";
    submit.className = "mt-2 btn btn-primary btn-block border border-light";
    submit.id = "answer-submit";
    submit.innerText = "Submit Answer";
    submit.disabled = true;
    /** Add a click event listener, using the submit function in the game logic file */
    submit.addEventListener("click", function() {
        submitAnswer();
    });
    button_row.appendChild(submit);

    /** Button to get points back for the player in case they wrongfully lost points */
    var override = document.createElement("button");
    override.type = "button";
    override.className = "mt-2 btn btn-primary btn-block border border-light";
    override.id = "answer-override";
    override.innerText = "I was correct!";
    override.disabled = true;
    /** Add a click event listener, using the override function in the game logic file */
    override.addEventListener("click", function() {
        answerOverride();
    });
    button_row.appendChild(override);
    sidebar.appendChild(button_row);
    document.getElementById("container").appendChild(sidebar);
}

/** Creates an empty button array using the dimensions var */
function initButtons() {
    grid = new Array(dimensions.rows);

    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(dimensions.cols);
        for(var j = 0; j < grid[i].length; j++){
            grid[i][j] = {
                    button_element: null,                       
                    button_text: "ERROR"  ,              
                    value: 200*i,                         
                    clue: "ERROR",      
                    answer: "ERROR",                          
                    category: "ERROR", 
                    air_date: "ERROR"  
            };
        }
    }
}

/** Function to create and fix up the clue element for the given row and column,
 * and add a click event listiner to the button
 */
function clickListener(row, col, myrow) {
    var mycol = document.createElement("div");
    mycol.className = "d-flex flex-column";

    var button = document.createElement("button");
    button.type = "button";
    button.style.width = "10em"; 
    button.style.height = "7em";
    button.className = "btn btn-primary btn-block border border-light"
    button.disabled = false;
    /** Add event listener here */
    button.addEventListener("click", function() {
        clueClick(row, col);
    });

    var btnSpan = document.createElement("span");
    /** Text in the first row are the categories, so
     * they will have white text instead of yellow
     */
    if (row == 0) {
        btnSpan.style.color = "white";
    } 
    else {
        btnSpan.style.color = "yellow";
        btnSpan.style.fontSize = "36pt";
    }
    /** Append elements accordingly */
    btnSpan.innerHTML = row == 0 ? "<strong>CATEGORY " + col + "</strong>" : "<strong>$" + 2*row + "00</strong>";
    button.appendChild(btnSpan);
    mycol.appendChild(btn);
    myrow.appendChild(mycol);
}

/** Creates the board of clues */
function createBoard() {
    initButtons();
    display()

    var board = document.createElement("div");
    board.className = "d-flex flex-column";
    board.id = "board-buttons";

    for (var r = 0; r < grid.length; r++) {
        var myrow = document.createElement("div");
        myrow.className = r == 0 ? "d-flex flex-row mx-1 my-2" : "d-flex flex-row mx-1";

        for (var c = 0; c < grid[r].length; c++) {
            /** Call clickListener on the row column, and row element to tie the clue to the button */
            clickListener(r, c, myrow)
        }
        board.appendChild(myrow);
    }

    document.getElementById("container").appendChild(board);
}

/** 
Creates the view to begin the game: the game board and sidebar.
*/
function create() {
    var container = document.createElement("div");
    container.className = "d-flex flex-row";
    container.id = "container";
    document.body.appendChild(container);
    initRequests()
    createBoard();
    createSidebar();
} 