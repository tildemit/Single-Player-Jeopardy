/**
This file is responsible for interacting with the jService API. Main function is 
receiving five sets of random clues from sixe categories in the database, along
with clue information (air data, point value, etc.)
*/

/** List of categories */
var categories = []
/** List of clues */
var clues = [];

/** Function to request data from jService */
function initRequests() {
  /** Create a random offset value using Math.random() so clue categories are randomized */
  var arr = []
  for (var i = 0; i < 6; i++) {
    var x =  Math.floor(1 + Math.random() * 18408);
    var request = new XMLHttpRequest();
    request.open('GET', 'https://jservice.io/api/categories?count=6&offset=' + x ,false)
    request.send();
    /** Parse response from API */
    arr.push(JSON.parse(request.response)[0]);
    request.abort();
  }

  arr.forEach(cat => {
    /** Push title name into categories */
    categories.push(cat.title);
    var clue_req = new XMLHttpRequest();
    clue_req.open("GET", "https://jservice.io/api/clues?category="+cat.id, false);
    clue_req.send();
    var cluarr = JSON.parse(clue_req.response);
    /** Push five clues into clues */
    for(var i = 0; i < 5; i++){
      clues.push(cluarr[i]); 
    }
    clue_req.abort();
  });
}
/** Function to attack clue data to each button in the grid */
function display() {
  for (var i = 0; i < 6; i++) { 
    for (var j = 0; j < 6; j++) { 
        if (i == 0) {
           grid[i][j].button_text = categories[j];
        } 
        else {
           grid[i][j].button_text = "" + (200 * i);
           var my_clue = clues[5 * j + (i-1)];
           grid[i][j].clue = my_clue.question;
           grid[i][j].value = my_clue.value;
           grid[i][j].answer = my_clue.answer;
           grid[i][j].category = categories[j];
           grid[i][j].air_date = my_clue.airdate; 
        }
    }
  }
}