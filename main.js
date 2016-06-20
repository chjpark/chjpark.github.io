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
			var query = url + searchTerms;
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

	function newElement(type, elementClass) {
		var element = document.createElement(type);
		element.className = elementClass;
		return element;
	};

	function buildResultItem(item) {
		//return the resulting element
		var newVideoResult = newElement('div', 'twitch-video');
		var previewDiv = newElement('div', 'twitch-video-preview');
		var infoDiv = newElement('div', 'twitch-video-info');

		var imgElement = newElement('img', 'twitch-video-img');
		imgElement.src = item.preview.small;
		previewDiv.appendChild(imgElement);

		newVideoResult.appendChild(previewDiv);
		newVideoResult.appendChild(infoDiv);
		return newVideoResult;
	};

	function addPreviewImg(image) {

	}

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

	HTMLElement.prototype.empty = function() {
		var self = this;
		while(self.hasChildNodes()) {
			self.removeChild(self.lastChild);
		}
	}

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
					resultsElem.empty();
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