function Leaf() {
	this.position = createVector( random( width ), random( height ) );
	this.reached = false;

	this.show = function() {
		fill(236, 102, 4);
		noStroke();
		ellipse( this.position.x, this.position.y, 4, 4 );
	} 
}