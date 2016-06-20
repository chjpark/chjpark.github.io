'use strict';

(function() {
	//request data to be passed into the httpRequest function
	var requestData = {
		type: 'GET',
		url: 'https://api.twitch.tv/kraken/search/streams?q='
	};

	function httpRequest(type, url, searchTerms) {
		//promise for asynchronously loading of data

		var requestPromise = new Promise(function(resolve, reject) {
			var xmlHTTP = new XMLHttpRequest();
			var query = url + searchTerms + '&offset=25';
			xmlHTTP.open(type, query, true);
			xmlHTTP.onload = function() {
				if(xmlHTTP.readyState === 4 && xmlHTTP.status === 200) {
					resolve(JSON.parse(xmlHTTP.responseText));
				} else {
					reject("Sorry, couldn't load videos!");
				}
			}

			xmlHTTP.onerror = function() {
				reject(Error('network errors!'));
			}
		
			xmlHTTP.send();
		});

		return requestPromise;
	};

	function buildResultItem(item) {
		//return the resulting element
		var newVideoResult = document.createElement('div');
		newVideoResult.className = 'twitch-video';
		return newVideoResult;
	};

	function buildNextButton() {

	};

	function buildPrevButton() {

	};

	function buildHeader(element, results) {

	};

	//appends the results of the request to the results container
	function appendResults(element, results) {
		//build out a new div element for the results
		results.forEach(stream => {
			element.appendChild(buildResultItem(stream));
		});
	};

	//initializes the app and sets up the events
	function initialize() {
		window.addEventListener('load', function() {
			var searchButton = document.getElementById('twitch-search-button');

			//set up the search Button's onclick
			searchButton.onclick = function() {
				var searchTerm = document.getElementById('search-term').value;

				//start the http request
				httpRequest(requestData.type, requestData.url, searchTerm).then(function(response){
					console.log(response);
					//start building out the response
					var resultsElem = document.getElementById('results');
					appendResults(resultsElem, response.streams);
				}, function (err) {
					console.log(err);
				});
			};

		}, false);
	};

	initialize();
})();
//window.twitchStreamLoader;