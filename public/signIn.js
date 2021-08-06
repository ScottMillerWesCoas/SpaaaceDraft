$(document).ready(function(){
	
	$('#signIn').click(e => {

		const signInObj = {}; 
		const rawSignInArr = $('.form').serializeArray(); 
		
		rawSignInArr.forEach(el => signInObj[el.name] = el.value);

		$.ajax({
			url: '/user/signIn',  
			method: "POST",
			contentType: 'application/json',
			data: JSON.stringify(signInObj), 
			error: function(err){
				const msg = err.responseJSON.message; 
				M.toast({
				  html: msg, 
				  classes: 'rounded red',
				  displayLength: 4500
				});
			}, 
			success: function(data){
				//deal with this later
				sessionStorage.setItem('spaceProjToken', data.token); 
				window.location.href = "/galaxy?t=" + data.token; 
			}
		})

	})
	
})