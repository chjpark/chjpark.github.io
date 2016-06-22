'use strict';

(function() {
	//request data to be passed into the httpRequest function
	var requestData = {
		url: 'https://api.twitch.tv/kraken/search/streams?'
	};

	var settings = {
		currentPage: 1
	};

	function httpRequest(url, searchTerms) {
		//promise for asynchronously loading of data
		var requestPromise = new Promise(function(resolve, reject) {
			var head = document.head;

			window.getResponse = function(response) {
				if(response.error) {
					reject(response);
				} else {
					resolve(response);
				}
			}

			//set up JSONP requests
			var urlString = url;
			if(searchTerms) {
				urlString += 'q=' + searchTerms;
			}
			urlString += '&callback=getResponse';

			var scriptTag = document.createElement('script');
			scriptTag.type = 'text/javascript';
			scriptTag.src = urlString;
			head.appendChild(scriptTag);
			head.removeChild(scriptTag);
		});

		return requestPromise;
	};

	function newElement(type, elementClass, text) {
		var element = document.createElement(type);
		if(elementClass) {
			element.className = elementClass;
		} 
		if(text) {
			element.textContent = text;
		}
		return element;
	};

	function buildResultItem(item) {
		//return the resulting element
		var newVideoResult = newElement('div', 'twitch-video');
		var previewDiv = newElement('div', 'twitch-video-preview');
		var infoDiv = buildInfoDiv(item)

		var imgElement = addPreviewImg(item.preview.medium);
		previewDiv.appendChild(imgElement);

		newVideoResult.appendChild(previewDiv);
		newVideoResult.appendChild(infoDiv);
		return newVideoResult;
	};

	function buildInfoDiv(info) {
		var infoTitle = info.channel.status.length > 25 ? info.channel.status.slice(0, 25) + '...' : info.channel.status;
		var infoDiv = newElement('div', 'twitch-video-info');
		var title = newElement('h3', '', infoTitle);
		var game = newElement('span', 'twitch-game', info.game + ' - ' + info.viewers + ' viewers');

		var description = newElement('span', 'twitch-game-description', info.channel.description ? info.channel.description : 'No description');

		infoDiv.appendChild(title);
		infoDiv.appendChild(game);
		infoDiv.appendChild(description);
		return infoDiv;
	};

	//creates a preview img element
	function addPreviewImg(image) {
		var imageElement = newElement('img', 'twitch-video-img');
		imageElement.src = image;
		return imageElement;
	};

	//builds pager in the element
	HTMLElement.prototype.buildPager = function(links, total) {
		var self = this;
		var prevButton;
		if(links.prev) {
			prevButton = buildPagerButton(links.prev, 'prev');
			self.appendChild(prevButton);
		}

		//build current page div
		var pageTracker = newElement('span', 'page-tracker', settings.currentPage + " / " + Math.ceil(total/10));

		self.appendChild(pageTracker);
		if(settings.currentPage < Math.ceil(total/10)) {
			var nextButton = buildPagerButton(links.next, 'next');
			self.appendChild(nextButton);
		}
	};

	//helper method for buildPager
	function buildPagerButton(linkUrl, type) {
		var button = newElement('button', type+'-button', type === 'next' ? 'Next' : 'Prev');

		//create an event to add a new page
		button.onclick = function() {
			httpRequest(linkUrl).then(function(response) {
				if(button.textContent == 'Next') {
					settings.currentPage += 1;
				} else {
					settings.currentPage -= 1;
				}
				createPageResults(response);
			}, function(error){
				console.log(error);
			});
		};

		return button;
	};

	//shows the buildTotal
	HTMLElement.prototype.buildTotal = function(results) {
		var totalResults = newElement('span', 'twitch-total-results', 'Total results: ' + results._total);
		this.appendChild(totalResults);
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

	function clearResults(elementArr) {
		//clear out the results list and the results header
		elementArr.forEach(elem => {
			elem.empty();
		});
	}

	function createPageResults(response) {
		//start building out the response
		var resultsElem = document.getElementById('results');
		var resultsTotal = document.getElementById('total');
		var resultsPager = document.getElementById('pager');
		clearResults([resultsElem, resultsTotal, resultsPager]);
		//build the header
		resultsTotal.buildTotal(response);
		if(response.streams.length > 0) {
			resultsPager.buildPager(response._links, response._total);
			//build the results
			resultsElem.appendResults(response.streams);
		}
	};

	//initializes the app and sets up the events
	window.addEventListener('load', function() {
		var searchButton = document.getElementById('twitch-search-button');

		//set up the search Button's onclick
		searchButton.onclick = function() {
			var searchTerm = document.getElementById('search-term').value;
			settings.currentPage = 1;
			//start the http request
			httpRequest(requestData.url, searchTerm).then(function(response){
				createPageResults(response);
			}, function (err) {
				var resultsElem = document.getElementById('results');
				var resultsTotal = document.getElementById('total');	
				var resultsPager = document.getElementById('pager');
				clearResults([resultsElem, resultsTotal, resultsPager]);

				var errorElement = newElement('span', 'error', 'Please enter search terms and try again.');
				results.appendChild(errorElement);
			});
		};
	}, false);
})();