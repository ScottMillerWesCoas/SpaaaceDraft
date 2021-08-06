$(document).ready(function(){
	//leaving as example, but can use /APOD and .env to hide NASA key
	const key = "IayJ7QvF22fHrYr2wn7jElhJPsBzy4AriuZwVQEw"; 
	const APODImageURL = "https://api.nasa.gov/planetary/apod?count=20&api_key=" + key; 
	
	const oldImageURL = "https://images-api.nasa.gov/search?description=1969&media_type=image";
	const marsImageURL = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=" + key;  
	let APODPicsData = [], APODPic = 0; oldPicsData = {}, marsPicsData = {}; marsPics = {start: 0, end: 10}, oldPics = {start: 0, end: 10}; 

	
	const getDataFromAPI = (url, dataObj) => {
		$.ajax({
			url: url,  
			method: "GET", 
			error: function(err){
				console.log(err.message); 
			}, 
			success: function(data){
				console.log(data);
				if (url.indexOf('APOD') > 0) {
					APODPicsData = data;
					let el = APODPicsData[0];
					appendPic(el.hdurl, el.title, el.date, el.explanation);
					APODPic++;   
				} else if (url.indexOf('description') > 0){
					oldPicsData = data; 
					addPics(data, dataObj);  
				} else {
					marsPicsData = data; 
					addPics(data, dataObj); 
				}
				
				
			}
		})
	}

	//note - leaving 
	getDataFromAPI('/APOD', {start: 0, end: 10}); 

	const addPics = (picObj, dataObj) => {

		if (picObj.hasOwnProperty('photos')){
			console.log("marsPics"); 
			let picArray = picObj.photos.slice(dataObj.start, dataObj.end);
			for (let i = 0; i < picArray.length; i += 2){
				let el = picArray[i]; 
				appendPic(el.img_src, el.rover.name + ' ' + el.camera.full_name, el.earth_date)
			}
		} else {
			let picArray = picObj.collection.items.slice(dataObj.start, dataObj.end);
			for (let i = 0; i < picArray.length; i++){
				let el = picArray[i]; 
				appendPic(el.links[0].href, el.data[0].description, el.data[0].date_created.slice(0, 10)); 
			}
		}
		
		dataObj.start += 10; 
		dataObj.end += 10; 
	}

	const appendPic = (imgSrc, title, date, exp) => {
		if (!exp) exp = "No description listed"; 
		$('.picRow').prepend(
			`
				<div class="col-sm-12 col-lg-6">` +
					`<div class="card">` +
					`<div class="card-image waves-effect waves-block waves-light">` +
					`<img src="` +
					imgSrc +
					`" />` +
					`</div>` +
					`<div class="card-content">` +
					`<div class="row mb-0"><div class="col-sm-9 px-0"><span class="card-title grey-text text-darken-4 activator">` +
					title + 
					` Picture</div><div class="col-sm-3 pr-0"><i class="material-icons right activator">more_vert</i></span></div></div>` +
					`<div class="row mb-0"><div class="col-sm-12 px-0 pt-3"><p><a href="` +
					
					`" target="_blank">Photo Taken On Earth Date `+date+`</a></p></div></div></div>` +
					`<div class="card-reveal">
				        <span class="card-title grey-text text-darken-4"
				            >` + title + 
					
					`<i class="material-icons right">close</i></span>
				        <p>` + exp + 
					
					`</p></div></div></div>`
			)
	}


	$('#morePics').on('click', function(){
		getDataFromAPI(marsImageURL, marsPics); 
	})

	$('#moreOldPics').on('click', function(){
		getDataFromAPI(oldImageURL, oldPics); 
		
	})
	$('#APODPics').on('click', function(){
		let el = APODPicsData[APODPic]; 
		appendPic(el.hdurl, el.title, el.date, el.explanation);
		APODPic++; 
	})
})