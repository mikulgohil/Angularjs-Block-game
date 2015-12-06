var app = angular.module('gridGame', ['ngAnimate']);

app.controller("CardController", function($scope, $timeout) {

	var blockCount = '';
	var breakRow = '';
	var BlockedFilled = [];
	var timer = null;
	$scope.displaylife = 0;
	$scope.gameAttamp = false; 
	$scope.timeLimit = 100;
	$scope.isCritical = false;
	$scope.getStarted = false;
	

	var createGrid = function(){
		blockCount = $scope.gridCol * $scope.gridCol;
		breakRow = $scope.gridCol;
		BlockedFilled = randomKeyValue();
		grid = [];

		var isKeyValue = function (value) {
		  return BlockedFilled.indexOf(value) > -1;
		}

		// create each row
		for(var i = 0; i < blockCount; i++) {
			block = {};
			block.item = false;
			block.index = i;
			if(isKeyValue(i)){
				block.item = true;
				//block.arr = true;
			}
			grid.push(block);
		}
		return grid;
	}

	function removeBlock(arr) {
	    var what, a = arguments, L = a.length, ax;
	    while (L > 1 && arr.length) {
	        what = a[--L];
	        while ((ax= arr.indexOf(what)) !== -1) {
	            arr.splice(ax, 1);
	        }
	    }
	    return arr;
	}

	$scope.checkStatus = function(){
		var de = $scope.board;
		var c = true;
		for(var i = 0; i < de.length; i++){
			if(de[i].item){
				c = false	
			}
		}
		return c
	}

	$scope.changeValue = function(i){
		$scope.board[i].item = false;
		removeBlock(BlockedFilled,i);
		if($scope.checkStatus()){
			$scope.result = "win";
			$scope.stopTimer();
		}
	}


	function randomKeyValue(){
		var arr = [];
		if(BlockedFilled){
			arr = BlockedFilled;
		}
		while(arr.length < $scope.blockFill){
		  var randomnumber=Math.ceil(Math.random()*blockCount-1)
		  var found=false;
		  for(var i=0;i<arr.length;i++){
			if(arr[i]==randomnumber){found=true;break}
		  }
		  if(!found)arr[arr.length]=randomnumber;
		}
		return arr;
	}
	//  Init function
	$scope.init = function(){
		if($scope.gridCol != undefined && $scope.blockFill != undefined){
			$scope.getStarted = true;
			$scope.displaylife = $scope.life;
			BlockedFilled = '';
			$scope.resetTime();
			$scope.start();	
			$scope.gridColLen = $scope.gridCol;
			$scope.result = "";
		}else{
			$scope.result = "novalid";
		}

		
	}
	// for the timer

	// Start time function
	$scope.start = function(){
		$scope.board = createGrid();
		// Set life to gobal variable 
		$scope.timeLimit = $scope.timeSec*1000;
		($scope.startTimer =function() {
			$scope.timeLimit -= 1000;
			$scope.isCritical = $scope.timeLimit < 1000 ? true : false;
			timer = $timeout($scope.startTimer, 1000);

			if ($scope.timeLimit === 0) {
				if($scope.checkStatus() || !$scope.displaylife){
					$scope.stopTimer();
					$scope.getStarted = false;
					$scope.result = "loose";
					//$scope.gameAttamp = true;		
				}else{
					//$scope.gameAttamp = true;		
					$scope.displaylife--
					$scope.stopTimer();
					$scope.start();
				}	
			}
			
		})();
	}	

	$scope.resetTime = function(){
		$timeout.cancel(timer);
	}
//  Reset function
	$scope.reset = function(){
		$scope.getStarted = false;
		$scope.result = "quit";
		$timeout.cancel(timer);
		$scope.gridCol = '';
		$scope.blockFill = '';
		$scope.timeSec = '';
		$scope.life = '';
	}

	// function to stop the timer
	$scope.stopTimer = function() {
	  $timeout.cancel(timer);
	  
	}


}).filter('array', function() {
    return function(arrayLength) {
    	if(arrayLength){
    		arrayLength = Math.ceil(arrayLength);
	        var arr = new Array(arrayLength), i = 0;
	        for (; i < arrayLength; i++) {
	            arr[i] = i;
	        }
	        return arr;	
    	}
    }
});