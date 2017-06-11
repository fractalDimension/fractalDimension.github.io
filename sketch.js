// TODO allow for the use of es6

// how many rows board is subdivided into (MUST BE EVEN)
var row_number = 16;
// number of lines
var difficulty = 5;
// min moves to win
var shuffle_amount = 3;
var max_start_height = 3;
var min_start_height = 1;

// line dimension an spacing
var line_width_ratio = 0.1;
var line_height_ratio = 0.04;
var line_gap_ratio = 0.05;

// instantiate a global state controller object (theres probably a better way to do it)
 var stateContr = new SelectedStateController();

// array for the line objects
 var middle_lines = [];

// NOTE: variables in setup are not global scope 
function setup() {

   // Create the canvas
  createCanvas(600, 400);

  // color parameters
  colorMode(RGB, 255);

  // stop from looping thru draw()
  noLoop();

  initializeBoard(difficulty);
  
}

function draw() {
  // draw the background color
  background(50, 89, 100);
  // draw the center line
  strokeWeight(2);
  stroke('black');
  line(0, height*0.5, width, height*0.5);
  // update the display based on the internal state of the objects 
  refreshMiddleLinesDisplay();
}

// MiddleLine class
function MiddleLine ( _board_position, _id ) {
  // TODO use map instead of id
  this.id = _id;
  // start at win condition then let initialize
  this.vertical_position = 0;
  this.initial_vertical_position = _board_position;
  this.is_selected = false;
  // set the line color based on its initial distance from center
  this.line_color = colorFromHeight( this.initial_vertical_position );

  // width and height are P5 canvas globals
  this.line_width = width * line_width_ratio;
  this.line_height = height * line_height_ratio;

}

MiddleLine.prototype.display = function () {
  // choose the color based on selected status
  if ( this.is_selected == true ) {
    // purple
    strokeWeight(4);
    stroke(179, 56, 155);
  } else {
    // orange
    strokeWeight(1);
    stroke(179, 107, 56);
  }

  // voodoo: width - ( gap(i+1) + bar(i) )
  var x_val = ( ( width*line_gap_ratio )*( this.id+1 ) + ( width*line_width_ratio )*( this.id ) )
  /* voodoo: start in the middle, move in increments of the row gap times 
   * the position, and then add a small adjustment to center the line
   */
  var y_val = ( height*0.5 ) - ( ( height/row_number ) * this.vertical_position ) - (this.line_height/2);

  // By default, the first two parameters to rect() are the 
  // coordinates of the upper-left corner and the second pair
  // is the width and height
  fill( this.line_color );
  rect( x_val, y_val, this.line_width, this.line_height);
}

/**
 * A line moves itself and its neighbors in increments of its initial distance from center
 */
MiddleLine.prototype.moveUpOrDown = function (  signed_step ) {
  if ( signed_step > 0 ) {
    this.moveNeighbors( abs(this.initial_vertical_position) );
    this.vertical_position += abs(this.initial_vertical_position);
  } else {
    this.moveNeighbors( abs(this.initial_vertical_position)*(-1) );
    this.vertical_position -= abs(this.initial_vertical_position);
  }
}
MiddleLine.prototype.moveNeighbors = function ( amount ) {
  var left_dude = (this.id) - 1;
  var right_dude = (this.id) + 1;
  // only move lines that exist
  if ( !(left_dude < 0 ) ) {
    middle_lines[left_dude].vertical_position += amount;
  }
  if ( right_dude < middle_lines.length ) {
    middle_lines[right_dude].vertical_position += amount;
  }
}

function SelectedStateController () {
  // internal state keeping track of selected line to prevent looping thru to find it
  this.selected_middle_line_id = 0;

  this.moveLeftOrRight = function ( leftOrRight ) {
    // deselect the previous line then change to the next
    middle_lines[this.selected_middle_line_id].is_selected = false;
    var next = this.selected_middle_line_id + leftOrRight;
    // wrap the selected line around or inc/dec
    if ( next < 0 ) {
      middle_lines[middle_lines.length - 1].is_selected = true;
      this.selected_middle_line_id = middle_lines.length - 1;
    } else if ( next == middle_lines.length ) {
      middle_lines[0].is_selected = true;
      this.selected_middle_line_id = 0;
    } else {
      middle_lines[next].is_selected = true;
      this.selected_middle_line_id = next;
    }
  };

}

function refreshMiddleLinesDisplay () {
  // loop thru and draw all the lines
  for (i=0; i<middle_lines.length; i++) {
    middle_lines[i].display();
  }
}

function initializeBoard( difficulty_value ) {
  // create the lines
  for (i=0; i<difficulty_value; i++) {
    middle_lines.push( new MiddleLine( randomHeight(), i ));
  }
  // set the selected line as the first one
  middle_lines[0].is_selected = true;
  
  // randomize the board state by starting from a solved condition then working backwards
  for (i=0; i<shuffle_amount; i++) {
   // random number between min and max:
   // Math.floor(Math.random()*(max-min+1)+min)
   var random_line_index = Math.floor( Math.random()*( middle_lines.length ) );
   console.log('This line(0-(length-1)) was moved: ',random_line_index);
   // plusOrMinus = Math.random() < 0.5 ? -1 : 1
   var upOrDown =  Math.random() < 0.5 ? -1 : 1;
   console.log('Up(1) or down(-1): ', upOrDown);
   middle_lines[ random_line_index ].moveUpOrDown( upOrDown );
  }
}

function randomHeight () {
  // plusOrMinus = Math.random() < 0.5 ? -1 : 1
  var rand_unsigned_height = Math.floor(Math.random()*(max_start_height-min_start_height+1)+min_start_height)
  var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  return rand_unsigned_height * plusOrMinus;
}

function colorFromHeight ( signed_height ) {
  var steps = 1/(max_start_height - min_start_height);
  var abs_height = abs(signed_height);
  var inc = steps*(abs_height - min_start_height);
  // TODO find a way to move the values to the top of the file
  var start_color = color(255, 58, 51);
  var end_color = color(255, 247, 51);
  return lerpColor(start_color, end_color, inc);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    stateContr.moveLeftOrRight(-1);
  } else if (keyCode === RIGHT_ARROW) {
    stateContr.moveLeftOrRight(1);
  } else if (keyCode === UP_ARROW) {
    middle_lines[ stateContr.selected_middle_line_id ].moveUpOrDown( 1 );
  } else if (keyCode === DOWN_ARROW) {
    middle_lines[ stateContr.selected_middle_line_id ].moveUpOrDown ( -1 );
  }
  // refresh display after any changes
  redraw();
}
