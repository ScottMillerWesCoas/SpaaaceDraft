$(document).ready(function() {
	$('#spacePic').on('click', () => {
		if (sessionStorage.getItem('spaceProjToken')) {
			window.location.href = '/spacePic?t=' + sessionStorage.getItem('spaceProjToken');
		} else sessionExit();
	});

	$('#galaxy').on('click', () => {
		if (sessionStorage.getItem('spaceProjToken')) {
			window.location.href = '/galaxy?t=' + sessionStorage.getItem('spaceProjToken');
		} else sessionExit(); 
	});

	$('#earth').on('click', () => {
		if (sessionStorage.getItem('spaceProjToken')) {
			window.location.href = '/planet?t=' + sessionStorage.getItem('spaceProjToken');
		} else sessionExit();
	});

	const sessionExit = () => (window.location.href = '/?err=You%20have%20been%20logged%20out.');
});
