var tree;

var canvas_dim = 800;
var max_dist = Math.floor( canvas_dim / 10 );
var min_dist = Math.floor( canvas_dim / 40 );
var num_leaves = canvas_dim;
var branch_length = Math.floor( canvas_dim / 80 );
var thickness_rate = 0.1;

function setup() {
  createCanvas(canvas_dim, canvas_dim);
  tree = new Tree();
  tree.show();
  noLoop();

}

function draw() {
	background(51);
  tree.show();
  tree.grow();
  // stop drawing
  if ( tree.grow_cycles_since_last_grown > 10 ) {
  	noLoop();
  }
}

function mouseClicked() {
	if ( !tree.initialized ) {
		tree.initialized = true;
		tree.initialize( mouseX, mouseY );
		loop();
	}
}