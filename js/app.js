	//Purpose:: Initialize geo location coordinates
	function initMap(){
		//Default options / settings
		var mapOptions = {
			center: new google.maps.LatLng(1.352083, 103.819836),
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		//Prepare and render google map based on the default options / settings
		var map = new google.maps.Map(document.getElementById("mapPlaceholder"), mapOptions);
		
		//Callback method (Refer below for more details)
		new AutocompleteDirectionsHandler(map);
	}
	
    //Purpose:: Form Auto-complete direction handlers
	function AutocompleteDirectionsHandler(map) {
		this.map = map;
		this.originPlaceId = null;
		this.destinationPlaceId = null;
		
		//Set default travel mode
		this.travelMode = 'DRIVING';
		
		//Identify the form inputs
		var originInput = document.getElementById('origin-input');
		var destinationInput = document.getElementById('destination-input');
		
		//Create google map direction objects
		this.directionsService = new google.maps.DirectionsService;
		this.directionsDisplay = new google.maps.DirectionsRenderer;
		this.directionsDisplay.setMap(map);
		
		//Create google map autocomplete objects for input fields
		var originAutocomplete = new google.maps.places.Autocomplete(originInput, {placeIdOnly: true});
		var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {placeIdOnly: true});
		
		//Set event listener (on place changed) to form fields
		this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
		this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
	}
	
	//Purpose:: Bind listeners to form input fields
	//Event Name: On Place Changed
	AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
		var me = this;
		autocomplete.bindTo('bounds', this.map);
		autocomplete.addListener('place_changed', function() {
			var place = autocomplete.getPlace();
			if (!place.place_id) {
				window.alert("Please select an option from the dropdown list.");
				return;
			}
			if (mode === 'ORIG') {
				me.originPlaceId = place.place_id;
			} else {
				me.destinationPlaceId = place.place_id;
			}
			me.route();
		});

	};
	
	//Purpose:: Trigger / draw route based on the input values
	AutocompleteDirectionsHandler.prototype.route = function() {
		if (!this.originPlaceId || !this.destinationPlaceId) {
			return;
		}
		
		//Prepare payload to the route service
		var me = this;
		this.directionsService.route({
			origin: {'placeId': this.originPlaceId},
			destination: {'placeId': this.destinationPlaceId},
			travelMode: this.travelMode
		}, function(response, status) {
			if (status === 'OK') {
				me.directionsDisplay.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	};