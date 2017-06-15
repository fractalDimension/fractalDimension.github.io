function Tree() {
	this.leaves = [];
	this.branches = [];
	this.initialized = false;

	this.continue_grow = true;
	this.grow_cycles_since_last_grown = 0;

	for (var i = 0; i < num_leaves; i++) {
		this.leaves.push(new Leaf());
	}


	this.initialize = function ( x, y) {
		var position = createVector( x, y );
		var direction = createVector( 0, -1 );
		var root_branch = new Branch( null, position, direction);
		this.branches.push(root_branch);

		var current = root_branch;
		var found = false;
		while ( !found ) {
			for (var i = 0; i < this.leaves.length; i++) {
				var d = p5.Vector.dist( current.position, this.leaves[i].position );
				if ( d < max_dist) {
					found = true
				}
			}
			if ( !found ) {
				current = current.next();
				this.branches.push(current);
			}
		}
	}

	

	this.grow = function () {
		var num_leaves_left = this.leaves.length;

		for (var i = 0; i < this.leaves.length; i++) {
			var leaf = this.leaves[i];

			var closest_branch = null;
			var record = width + height;
			for (var k = 0; k < this.branches.length; k++) {
				var d = p5.Vector.dist( leaf.position, this.branches[k].position );
				if ( d < min_dist ) {
					leaf.reached = true;
					closest_branch = null;
					break;
				} else if ( d > max_dist ) {
					// do nothing
				} else if ( closest_branch == null || d < record ) {
					closest_branch = this.branches[k];
					record = d;
				}
			}
			if ( closest_branch != null ) {
				var new_direction = p5.Vector.sub( leaf.position, closest_branch.position );
				new_direction.normalize();
				closest_branch.direction.add(new_direction);
				closest_branch.count++;
			}
		}

		for (var i = this.leaves.length-1; i >= 0; i--) {
			if ( this.leaves[i].reached ) {
				this.leaves.splice( i, 1 );
			}
		}
		for (var i = this.branches.length-1; i >= 0; i--) {
			var branch = this.branches[i];
			if ( branch.count > 0 ) {
				branch.direction.div( branch.count );
				this.branches.push( branch.next() );
			}
			branch.thickness += thickness_rate;
			branch.reset();
		}
		if ( num_leaves_left == this.leaves.length ) {
			this.grow_cycles_since_last_grown++;
		} else {
			this.grow_cycles_since_last_grown = 0;
		}
	}
	
	this.show = function() {
		for (var i = 0; i < this.leaves.length; i++) {
			this.leaves[i].show();
		}

		for (var i = 0; i < this.branches.length; i++) {
			this.branches[i].show();
		}
	}
}