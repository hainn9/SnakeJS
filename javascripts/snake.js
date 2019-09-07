function Snake(mapCols, mapRows, color, autoMoving){
	var LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;

	this.direction;
	this.data;
	this.path;
	this.stepIndex;
	this.accident;
	this.getHead = function(){
		return this.data[0];
	};

	this.init = function(){
		var x = autoMoving? mapCols - 4 : 3;
		var y = 0;
		this.direction = RIGHT;
		this.data = [
			{x:x, y:y},
			{x:x-1, y:y},
			{x:x-2, y:y}
		];
		this.accident = false;
	};

	this.handleKey = function(keyCode){
		var new_direction = keyCode - 37;
		if(Math.abs(this.direction - new_direction) != 2) {
			this.direction = new_direction;
		}
	};

	this.setPath = function(path){
		this.path = path;
		if(this.path) {
			this.stepIndex = path.length - 1;
		} else {
			this.stepIndex = 0;
		}
	};

	this.move = function(){
		if(this.stepIndex > 0) {
			this.stepIndex--;
			var new_pos = this.path[this.stepIndex];
			if(new_pos.x < this.data[0].x) 
				this.direction = LEFT;
			else if(new_pos.x > this.data[0].x)
				this.direction = RIGHT;
			else if(new_pos.y < this.data[0].y)
				this.direction = UP;
			else 
				this.direction = DOWN;
		}
	};

	this.draw = function(ctx){
		ctx.strokeStyle = color;
		ctx.beginPath();

		ctx.moveTo(this.data[0].x * CELL_SIZE + CELL_SIZE/2, this.data[0].y * CELL_SIZE + CELL_SIZE/2);
		for(var i = 0; i < this.data.length; i++){
			ctx.lineTo(this.data[i].x * CELL_SIZE + CELL_SIZE/2, this.data[i].y * CELL_SIZE + CELL_SIZE/2);
		}
		ctx.stroke();
	};

	this.update = function(wall, food){
		if(autoMoving)
			this.move();

		var x = this.data[0].x;
		var y = this.data[0].y;

		switch (this.direction) {
			case LEFT:
				x--;
				break;
			case RIGHT:
				x++;
				break;
			case UP:
				y--;
				break;
			case DOWN:
				y++;
				break;
			default:
				break;
		}

		// eat food
		if((x==food.x) && (y==food.y)){
			this.data.unshift(food);
			this.data.pop();
			return 1;
		}

		console.log(wall[x][y]);
		console.log(this.collide(x, y));
		if(wall[x][y]==1 || this.collide(x, y)){
            // this.accident = true;
            return 2;
		}

        this.data.unshift({x:x, y:y});
        this.data.pop();
        return 0;
	};

	this.contain = function(x, y){
		for(var i = 0; i < this.data.length; i++){
			if((x==this.data[i].x) && (y==this.data[i].y))
				return true;
		}
		return false;
	};

	this.collide = function(x, y){
		if((x<0) || (x>mapCols-1))
			return true;
		if((y<0) || (y>mapRows-1))
			return true;
		return this.contain(x, y);
	};
}