$(document).ready(function(){
	
	$('#signUp').click(e => {
		
		const signUpObj = {}; 
		const rawSignUpArr = $('.form').serializeArray(); 
		
		rawSignUpArr.forEach(el => {
			signUpObj[el.name] = el.value; 
		}); 
		console.log(signUpObj); 
		$.ajax({
			url: '/user/signUp',  
			method: "POST",
			contentType: 'application/json',
			data: JSON.stringify(signUpObj), 
			error: function(err){
				console.log(err); 
				let errStr = ""; 
				if (err.responseJSON.hasOwnProperty('errors')){
					
					err.responseJSON.errors.forEach( el => {
						if (el.msg) errStr += el.msg + '</br>'; 
					}); 
					M.toast({
					  html: errStr, 
					  classes: 'rounded red',
					  displayLength: 4500
					});
				}
			}, 
			success: function(data){
				console.log("success back from server"); 
				console.log(data); 
				//deal with this later
				sessionStorage.setItem('spaceProjToken', data.token);
				window.location.href = "/galaxy?t=" + data.token; 
			}
		})

	})
	const getDataFromAPI = (url, dataObj) => {
		
	}

	
})