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
			var search = searchTerms ? searchTerms : ''
			var query = url + search;
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

		var imgElement = addPreviewImg(item.preview.medium);
		previewDiv.appendChild(imgElement);

		var title = newElement('h3');
		title.textContent = item.channel.status;

		infoDiv.appendChild(title);

		newVideoResult.appendChild(previewDiv);
		newVideoResult.appendChild(infoDiv);
		return newVideoResult;
	};

	//creates a preview img element
	function addPreviewImg(image) {
		var imageElement = newElement('img', 'twitch-video-img');
		imageElement.src = image;
		return imageElement;
	}

	HTMLElement.prototype.buildPager = function(links) {
		var self = this;
		var prevButton;
		if(links.prev) {
			prevButton = buildPagerButton(links.prev, 'prev');
			self.appendChild(prevButton);
		}
		var nextButton = buildPagerButton(links.next, 'next');
		self.appendChild(nextButton);
	};

	function buildPagerButton(linkUrl, type) {
		var button = newElement('div', type+'-button');
		button.textContent = type === 'next' ? 'Next' : 'Prev';

		//create an event to add a new page
		button.onclick = function() {
			httpRequest(requestData.type, linkUrl).then(function(response) {
				createPageResults(response);
			}, function(error){
				console.log(error);
			});
		};

		return button;
	};

	HTMLElement.prototype.buildTotal = function(results) {
		var self = this;
		var totalResults = newElement('span', 'twitch-total-results');
		totalResults.textContent = 'Total results: ' + results._total;

		self.appendChild(totalResults);
	};

	//appends the results of the request to the results container
	HTMLElement.prototype.appendResults = function(results) {
		//build out a new div element for the results
		var self = this;
		results.forEach(stream => {
			self.appendChild(buildResultItem(stream));
		});
	};

	//HTMLElement prototype
	HTMLElement.prototype.empty = function() {
		var self = this;
		while(self.hasChildNodes()) {
			self.removeChild(self.lastChild);
		}
	};

	function createPageResults(response) {
		//start building out the response
		var resultsElem = document.getElementById('results');
		var resultsTotal = document.getElementById('total');
		var resultsPager = document.getElementById('pager');

		//clear out the results list and the results header
		resultsElem.empty();
		resultsTotal.empty();
		resultsPager.empty();
		//build the header
		resultsTotal.buildTotal(response);
		resultsPager.buildPager(response._links);
		//build the results
		resultsElem.appendResults(response.streams);
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
					createPageResults(response);
				}, function (err) {
					console.log(err);
				});
			};

		}, false);
	};

	initialize();
})();
//window.twitchStreamLoader;