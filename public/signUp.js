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
			}, 
			success: function(data){
				console.log("success back from server"); 
				console.log(data); 

				window.location.href = "/galaxy?t=" + data.token; 
			}
		})

	})
	const getDataFromAPI = (url, dataObj) => {
		
	}

	
})