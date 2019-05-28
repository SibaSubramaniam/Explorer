function goBack(){
	/*
	function to go back to previous search page
	*/
	window.history.back();
}

function getWiki(countryName) {
	
	/*
	function to get introduction about the country using wikipedia API
	*/
	
	//using cors-anywhere as proxy for cors issues
	const url = 'https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exsentences=5&exintro&explaintext&redirects=1&titles=' + countryName;
	console.log(url);
	
	fetch(url)
	.then((resp) => resp.json())
	.then(function (data) {

		//store wiki pages from data to a variable
		let wikikey = Object.keys(data['query'].pages);

		//extract intro about the country
		var wikiData=data['query']['pages'][wikikey[0]]['extract'].replace('(listen)','');//replace audio from api

		//populate the wikipedia tag with data from wikipedia
 		document.getElementById('wikidata').innerHTML='<b>ABOUT</b><br><br>'+wikiData.replace(';','');
	})
	.catch(function (error) {

		//error handling for wikipedia api call
		document.getElementById('wikidata').innerHTML='<b>ABOUT</b><br><br>'+'Wiki Error, Check if Internet is working';
	});
}

function getPhoto(countryName){
	
	/*
	function to get photo about the country using pixabay API
	*/

	//replace parantheses (eg: Falkland Islands (Malvinas) --> Falkland Islands)
	countryName=countryName.replace(/ *\([^)]*\) */g, " ");

	//create search query for image retrival
	const url='https://pixabay.com/api/?key=12601485-88f502ad02d4b7f45b95b2c37&q='+encodeURI(countryName)+'&image_type=photo';//endcodeURI for special characters and spaces
	console.log(url);
	fetch(url)
	.then((resp) => resp.json())
	.then(function (data) {

		//get url of first image returned by api
		var imgUrl=data.hits[0].webformatURL;
		console.log(imgUrl);

		//set image for country	
		document.getElementById('countryphoto').src=imgUrl;

	})
	.catch(function (error) {
		//error handling for wikipedia api call
		document.getElementById('countryphoto').src='https://pixabay.com/get/57e6d243425bb108f5d0846096293578153edaed564c704c70267bd5914fc551_640.jpg';
	
	});
}

function initializeMap(latitude,longitude) {
  
  	/*
	function to mark the country's location on world map using google maps
	*/

	var mapOptions = {
		zoom: 4,
		center: {lat: latitude, lng: longitude}
		};
	map = new google.maps.Map(document.getElementById('map'),
	  mapOptions);

	var marker = new google.maps.Marker({
	// The below line is equivalent to writing:
	// position: new google.maps.LatLng(-34.397, 150.644)
	position: {lat: latitude, lng: longitude},
		map: map
		});

	var infowindow = new google.maps.InfoWindow({
		content: '<p>Marker Location:' + marker.getPosition() + '</p>'
		});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map, marker);
		});
}

function populate(){

	/*
	function to populate all the details for HTML page
	*/


	//get url containing country name
	var url = document.location.href;

	//retrive country name from url
	var country_name = decodeURI(url.split('?')[1].split('=')[1]);

	//set title to country name
	document.title=country_name;

	//get JSON Object from SessionStorage
	countryObj=JSON.parse(sessionStorage.getItem(country_name));;
	console.log(countryObj)
	
	//call to get details from Wikipedia
	getWiki(country_name);

	//call to get photo from pixabay
	getPhoto(country_name);

	//Populating cards along with error handling
	if(country_name!='')
		document.getElementById('countryName').innerHTML=country_name;
	if(countryObj['capital']!='')
		document.getElementById('capital').innerHTML=(countryObj['capital']);
	if(countryObj['population']!='')
		document.getElementById('population').innerHTML=(countryObj['population']);
	if(countryObj['area']!='')
		document.getElementById('area').innerHTML=(countryObj['area']);
	if(countryObj['languages'][0].name!='')
		document.getElementById('language').innerHTML=(countryObj['languages'][0].name);
	if(countryObj['flag']!='')
		document.getElementById('countryFlag').src=(countryObj['flag']);
	if(countryObj['currencies'][0].name!='')
		document.getElementById('currency').innerHTML=(countryObj['currencies'][0].name);
	if(countryObj['subregion']!='')
		document.getElementById('subregion').innerHTML=(countryObj['subregion']);
	if(countryObj['nativeName']!='')
		document.getElementById('nativename').innerHTML=(countryObj['nativeName']);
	if(countryObj['timezones'][0]!='')
		document.getElementById('timezone').innerHTML=(countryObj['timezones'][0]);

	//Create Map view
	if(countryObj['latlng'][0])
		initializeMap(countryObj['latlng'][0],countryObj['latlng'][1]);
	else
		document.getElementById('map').remove();
}

window.onload = function () {
	populate();
	
}

