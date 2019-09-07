var CELL_SIZE = 10;
var FPS = 10;
var WIDTH = 400;
var HEIGHT = 400;

function Game(canvas_id){
	var _playerScores = 0; 
	var _comScores = 0; 
	var _targetScores;
    var _pressedKey;
    var _cols = WIDTH/CELL_SIZE;
    var _rows = HEIGHT/CELL_SIZE;
	var _comSnake = new Snake(_cols,_rows,"red",true);
    var _walls = [];
    var _canvas = document.getElementById(canvas_id);
    var _context = _canvas.getContext('2d');
    _context.fillStyle = "black";
	var _fps = FPS;
    
    var _food = {};
    var _running = false;    
    var _timer;
	var _bfs;

	var _playerMode = true;
	if(_playerMode)
		_playerSnake = new Snake(_cols, _rows, "blue", false);

	this.init = function(){
		_canvas.width = WIDTH;
		_canvas.height = HEIGHT + 100;

		_canvas.onkeydown = function(key){
			if(key.keyCode == 13) {
				if(!_running)
					startGame();
			}
			else if(_running)
				_pressedKey = key.keyCode;
		};

		_context.textAlign = "center";
        _context.font = "36px Arial";
        _context.fillText("Snake",WIDTH/2,HEIGHT/3);
        _context.font = "16px Arial";
        _context.fillText("Press Enter to Start",WIDTH/2,HEIGHT/2);
	};

	function startGame(){
		_pressedKey = null;
		clearInterval(_timer);
		_comSnake.init();
		_playerSnake.init();
		createMap();
		_bfs = new BreathFirstSearch(_walls,_cols,_rows);
		createFood();
		_running = true;
		_timer = setInterval(update, 1000/_fps);
		_targetScores = (Math.floor(Math.random() * 20) == 0)?20:Math.floor(Math.random() * 20);
	};

	function createMap(){
		for(var i = 0; i < _cols; i+=2){
			_walls[i] = [];
			_walls[i+1] = [];
			for(var j = 0; j < _rows; j+=2){
				val = (j>4 && Math.floor(Math.random() * 20)<2)?1:0;
				_walls[i][j] = val;
				_walls[i+1][j] = val;
				_walls[i][j+1] = val;
				_walls[i+1][j+1] = val;
			}
		}
	};

	function createFood(){
		var x = Math.floor(Math.random()*_cols);
		var y;
		do {
			y = Math.floor(Math.random() * _rows);
		} while (_walls[x][y] || _comSnake.contain(x, y))

		_food = {x:x, y:y};
		_comSnake.setPath(_bfs.findPath(_comSnake.data, _comSnake.getHead(), _food));
	};

	function endGame(text){
		_running = false;
		_context.save();
		_context.fillStyle = "rgba(0, 0, 0, 0.2";
		_context.fillRect(0, 0, WIDTH, HEIGHT);
		_context.restore();
		_context.fillStyle = "red";
		_context.textAlign = "center";
		_context.fillText(text + " Win! Press enter to restart!", WIDTH/2, HEIGHT/2);
	};

	function draw(){
		_context.beginPath();
		_context.clearRect(0, 0, WIDTH, HEIGHT+100);
		_context.fillStyle = "rgba(0, 0, 0, 0.2";
		_context.fillRect(0, 0, WIDTH, HEIGHT);
		_context.lineWidth = CELL_SIZE;
		_context.lineCap = "round";
		_context.lineJoin = "round";
		_comSnake.draw(_context);
		_playerSnake.draw(_context);

		// food
		_context.fillStyle = "green";
        _context.beginPath();
        _context.arc((_food.x*CELL_SIZE)+CELL_SIZE/2, (_food.y*CELL_SIZE)+CELL_SIZE/2, CELL_SIZE/2, 0, Math.PI*2, false);
        _context.fill();

        // wall
        _context.fillStyle = "black";
        for(var i = 0; i < _cols; i++){
        	for(var j = 0; j < _rows; j++){
        		if(_walls[i][j])
        			_context.fillRect(i*CELL_SIZE, j*CELL_SIZE, CELL_SIZE, CELL_SIZE);
        	}
        }
        _context.textAlign = "left";
        _context.font = "20px Arial";
		_context.fillText("Player: "+_playerScores,10,HEIGHT+80); 

		_context.textAlign = "right";
		_context.font = "20px Arial";
		_context.fillText("COM: "+_comScores,350,HEIGHT+80);

		_context.textAlign = "center"; 
		_context.font = "20px Arial";
		_context.fillText("TARGET: "+_targetScores,190,HEIGHT+50);
	};

	function update(){
		if(!_running)
			return;

		_playerSnake.handleKey(_pressedKey);
		var retPlayer =_playerSnake.update(_walls,_food);
		if(retPlayer == 1){
			_playerScores++;
			createFood();
		} 

		if(!_comSnake.path)
			_comSnake.setPath(_bfs.findPath(_comSnake.data, _comSnake.getHead(), _food), _food);
		var ret = _comSnake.update(_walls, _food);
		if(ret == 1){
			_comScores++;
			createFood();
		}


		draw();

		if((_playerScores == _targetScores && _comScores < _targetScores) /*|| _playerSnake.accident*/){
			endGame("You");
			_playerScores = 0;
			_comScores = 0;
			return;
		} 
		else if(_playerScores < _targetScores && _comScores == _targetScores){
			endGame("COM");
			_playerScores = 0;
			_comScores = 0;
			return;
		}
	};
}