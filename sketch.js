var tree;

var canvas_dim = 800;
var canv_width = window.innerWidth  - 25;
var canv_height = window.innerHeight - 25;
var canv_area_root = Math.sqrt(canv_width*canv_height);
var max_dist = Math.floor( canv_area_root / 10 );
var min_dist = Math.floor( canv_area_root / 40 );
var num_leaves = canvas_dim;
var branch_length = Math.floor( canv_area_root / 80 );
var thickness_rate = 0.1;

function setup() {
  createCanvas(canv_width, canv_height);
  tree = new Tree();
  tree.show();
  noLoop();

}

function draw() {
	background(51);
  tree.show();
  tree.grow();
}

function mouseClicked() {
  if ( !tree.initialized ) {
    tree.initialized = true;
    tree.initialize( mouseX, mouseY );
    loop();
  } else {
    tree = new Tree();
    background(51);
    tree.show();
  }
}

// for mobile
function touchStarted() {
  if ( !tree.initialized ) {
    tree.initialized = true;
    tree.initialize( mouseX, mouseY );
    loop();
  } else {
    tree = new Tree();
    background(51);
    tree.show();
  }
}