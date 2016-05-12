$(document).ready(function() {
    
	$('.ajax-modal').modaljx();
		
});
		
var onSuccess = function (html){
			
	console.log("called onSuccess() function.");

	$('.ajax-modal').modaljx();
			
};
		
var onFail = function (){
			
	console.log("called onFail() function.");
			
};
		
var onClose = function (){
			
	console.log("called onClose() function.");
			
};