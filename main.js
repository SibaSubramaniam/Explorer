function checkalpha(myString) {
	/*
	function to check if string only contains alphabets for error handling
	
	input:myString (eg:india)

	return 0/1  1- if name comprises only alphabets (eg:india) 
				0- if name contains other than alphabets (eg:$outhAfr1ca)
	*/
  return /^[a-z]+$/i.test(myString);
}

function addElement(country){
	/*
	function to add cardviews to display
	
	input:json object of a country returned by restcountries api
	
	*/

	//cardview creation
	var elementToAdd =
         `
         <div class = "card">

            <div class  = "card-flag"> 
              <img src = "${country.flag}" />
            </div>

            <div class = "card-body"> 
      
                <h3>${country.name}</h3>

            </div>

          </div>
          `
    var countryList = document.getElementById('countryList');

    //add cardview to countryList for display
    countryList.innerHTML += elementToAdd;
}


function getDetails() {
	/*
	function to get details from restcountries api
	*/


	var country = document.getElementById('country').value;

	//creating url for api call
	const url = 'https://restcountries.eu/rest/v2/name/' + country;

	//hide error message
	document.getElementById("error").style.visibility = "hidden";

	//check whether search query is empty
	if(country==''){
		alert('Please Enter a Country Name');
	}

	//check if country name contains special characters
	else if(!checkalpha(country)){
		alert('Please Enter a Valid Country Name');
	}

	else{

	//clear session storage
	sessionStorage.clear();	

	//api call to restcountries api using fetch
	fetch(url)
	.then((resp) => resp.json())
	.then(function (data) {

		//store data from api in variable
		let countries = data;
		var countryList = document.getElementById('countryList');
		countryList.innerHTML = "";

		//Updating the note for search results
		document.getElementById('note').innerHTML='Search results for '+country;

		//map funtion to populate the countryList with cardviews
		return countries.map(function (country) {

			//call to addElement for adding cardviews
			addElement(country);

			//add the data returned by api to sessionStorage for further processing
			var name = `${country.name}`;
			sessionStorage.setItem(name, JSON.stringify(country));
		})
	})
	.catch(function (error) {

		//display error message if country not found
		document.getElementById("error").style.visibility = "visible";
	});
	}
	}

/*
event listener to check which card is clicked
*/
var div = document.getElementById('countryList');

document.getElementById('countryList').addEventListener('click', function (e) {
	var target = e.target; // Clicked element

	//traverse to parent node to get country name
	while (target && target.parentNode !==  div) {
		target = target.parentNode; // If the clicked element isn't a direct child
		if (!target) { return; } // If element doesn't exist
	}

	//getting country name
	var country_name=target.children[1].children[0].innerHTML;
	console.log(country_name);

	//re-directing to country page to display details about country
	document.location.href = 'country.html?name=' + encodeURI(country_name)//encodeuri to pass special characters eg:Åland Islands;

});

/*
onload function is used for providing details when user comes to main page using back button from country page
*/
window.onload = function () {

	if (performance.navigation.type != 1) { 
		/*
		check if page is refreshed. This is used because refreshing should not populate cardview 
		since sessionStorage will still contain data from previous searches
		*/
	
		//check if sessionStorage contains data
		if(window.sessionStorage.length!=0){

			//if user comes back after viewing a country populate the cardview using data stored in sessionStorage
			
			//get keys from sessionStorage
			keys = Object.keys(sessionStorage);
	        var i = 0, key;

	        //populating cardviews
	        for (; key = keys[i]; i++) {
	        	addElement(JSON.parse(sessionStorage.getItem(key)));
	    	}
		}
	}
}