

function getMessageData(){

	$('#contact-submit').click(function(){
		//MUST have to,subject,text pattern!
		var to,subject,text;
    	subject = $('#name-id').val();
    	to = $('#email-id').val();
    	text = $('#message-id').val();
    	
   		
    	$.get("http://localhost:8000/send", {subject:subject, to:to, text:text},
		function(data){
			console.log(data);
		});
	});
}



$(function(){
	getMessageData();
})