
//countdown
var clock;
var ele= document.getElementById('timer');
var audio = document.getElementById("audio"); 

//pause the timer 
function pauseClock(){
	clearTimeout(clock);
}


function playbgmusic() {
	let audio = document.getElementById('bgmusic');
	console.log(audio);
	audio.play();
	audio.volume = 0.05;
}





//resume the timer
function resumeClock(){
	clock = setTimeout(countdown, 1000);
}
//función principal del fifteen-game.
 (function(){
	
	let win = document.getElementById("win");
	win.style.display = "none";
	function clockon(){
	 console.log('clock');
		var sec = 0;
		clock = setInterval(()=>{
		  ele.innerHTML = '00:'+sec;
		  sec ++;
		}, 1000) 
	 }  

	 function unpauseClock(){
		clockon();
	}
	var status = 1;
	var puzzle_fifteen = document.getElementById('puzzle_fifteen');
	// Estados iniciales del puzzle
	function iniciar(){
		clockon();
		scramble();
	}
    
	solve();
	
	
	puzzle_fifteen.addEventListener('click', function(e){
		if(status == 1){
			puzzle_fifteen.className = 'animate';
			cambiar_Celda(e.target);
		}
	});
	document.getElementById('shuffle').addEventListener('click', iniciar);
	document.getElementById('stop').addEventListener('click', pauseClock);  
	document.getElementById('res').addEventListener('click', unpauseClock);
	document.getElementById('playbtn').addEventListener('click', playbgmusic);
	
	
	// resuelve el puzzle, pero solo es llamada al inicio.
	function solve(){
		
		if(status == 0){
			return;
		}
		
		puzzle_fifteen.innerHTML = '';
		
		var n = 1;
		for(var i = 0; i <= 3; i++){
			for(var j = 0; j <= 3; j++){
				var celda = document.createElement('span');
				celda.id = 'celda-'+i+'-'+j;
				celda.style.left = (j*80+1*j+1)+'px';
				celda.style.top = (i*80+1*i+1)+'px';
				
				if(n <= 15){
					celda.classList.add('numero');
					celda.classList.add((i%2==0 && j%2>0 || i%2>0 && j%2==0) ? 'dark' : 'light');
					celda.innerHTML = (n++).toString();
				} else {
					celda.className = 'empty';
				}
				
				puzzle_fifteen.appendChild(celda);
			}
		}
		
	}

	function cambiar_Celda(celda){
		
		if(celda.clasName != 'empty'){
			
			var emptyCell = getEmptyAdjacentCell(celda);
			
			if(emptyCell){
				var tmp = {style: celda.style.cssText, id: celda.id};
				celda.style.cssText = emptyCell.style.cssText;
				celda.id = emptyCell.id;
				emptyCell.style.cssText = tmp.style;
				emptyCell.id = tmp.id;
				if(status == 1){
					setTimeout(checkOrder, 150);
				
				}
			}
		}
		
	}
   //On music
	

	function getCell(row, col){
		return document.getElementById('celda-'+row+'-'+col);
	}

	function getEmptyCell(){
		return puzzle_fifteen.querySelector('.empty');
	}

	function getEmptyAdjacentCell(celda){
		var adjacent = getAdjacentCells(celda);
		for(var i = 0; i < adjacent.length; i++){
			if(adjacent[i].className == 'empty'){
				return adjacent[i];
			}
		}
		return false;
		
	}
   //revisa el orden de las celdas
	function getAdjacentCells(celda){
		var id = celda.id.split('-');
		var row = parseInt(id[1]);
		var col = parseInt(id[2]);
		var adjacent = [];

		if(row < 3){adjacent.push(getCell(row+1, col));}			
		if(row > 0){adjacent.push(getCell(row-1, col));}
		if(col < 3){adjacent.push(getCell(row, col+1));}
		if(col > 0){adjacent.push(getCell(row, col-1));}

		return adjacent;
	}
    //verificar si el puzzle esta resuelto
	function checkOrder(){
		if(getCell(3, 3).className != 'empty'){
			return;
		}
		var n = 1;
		for(var i = 0; i <= 3; i++){
			for(var j = 0; j <= 3; j++){
				if(n <= 15 && getCell(i, j).innerHTML != n.toString()){
					return;
				}
				n++;
			}
		}
		
		win.style.display = "block";
		
		//if press button restart start again then stop clock
		document.getElementById('restart').	addEventListener('click', function(){
			win.style.display = "none";
			scramble();
			unpauseClock();
		});
	
	}
	//Organiza las celdas de forma aleatoria
	function scramble(){
		win.style.display = "none";
		var cl= 1;
		if(status == 0){
			return;
		}
		puzzle_fifteen.removeAttribute('class');
		status = 0;
		
		var previousCell;
		var i = 1;
		var interval = setInterval(function(){
			if(i <= 100){
				var adjacent = getAdjacentCells(getEmptyCell());
				if(previousCell){
					for(var j = adjacent.length-1; j >= 0; j--){
						if(adjacent[j].innerHTML == previousCell.innerHTML){
							adjacent.splice(j, 1);
						}
					}
				}
				previousCell = adjacent[rand(0, adjacent.length-1)];
				cambiar_Celda(previousCell);
				i++;
			} else {
				clearInterval(interval);
				status = 1;
			}
		}, 5);

		

	}
	
   //Genera un numero aleatorio
	function rand(from, to){

		return Math.floor(Math.random() * (to - from + 1)) + from;

	}

}());
