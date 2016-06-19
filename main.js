'use strict';

(function() {
	//request data to be passed into the httpRequest function
	var requestData = {
		type: 'GET',
		url: 'https://api.twitch.tv/kraken/search/streams?q=starcraft'
	}
	function httpRequest(type, url) {
		//promise for asynchronously loading of data
		var requestPromise = new Promise(function(resolve, reject) {
			var xmlHTTP = new XMLHttpRequest();
			xmlHTTP.open(type, url, true);
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
	}

	//initializes the app and sets up the events
	window.addEventListener('load', function() {
		var searchButton = document.getElementById('twitch-search-button');

		//set up the search Button's onclick
		searchButton.onclick = function() {

			//start the http request
			httpRequest(requestData.type, requestData.url).then(function(response){
				console.log(response);
			}, function (err) {
				console.log(err);
			});
		};

	}, false);

})();
//window.twitchStreamLoader;