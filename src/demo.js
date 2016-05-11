$(document).ready(function() {
    
			$('.ajax-modal').modaljx();
		
		});
		
		var onSuccessCallback = function (html){
			
			console.log("called onSuccessCallback() function.");
		
			$('.ajax-modal').modaljx();
			
		};
		
		var onErrorCallback = function (){
			
			console.log("called onErrorCallback() function.");
			
		};
		
		var onCloseCallback = function (){
			
			console.log("called onCloseCallback() function.");
			
		};