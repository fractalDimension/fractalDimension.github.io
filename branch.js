function Branch( parent, position, direction ) {
	this.position = position;
	this.parent = parent;
	this.direction = direction;
	this.original_direction = this.direction.copy();
	this.count = 0;
	this.length = branch_length;
	this.thickness = 1;

	this.reset = function () {
		this.direction = this.original_direction.copy();
		this.count = 0;
	}

	this.next = function() {
		var next_direction = p5.Vector.mult( this.direction, this.length );
		var next_position = p5.Vector.add( this.position, next_direction );
		return new Branch( this, next_position, this.direction.copy() );
	}

	this.show = function() {
		if ( parent != null ) {
			strokeWeight( Math.floor( this.thickness ) );
			stroke(232, 236, 4);
			line( this.parent.position.x, this.parent.position.y, this.position.x, this.position.y);
		}
	}
}