(function () {
	
	/**
	 * Neighborhoods object
	 * @namespace
	 */
	Hoods = {
		
		/**
		 * Map reference
		 * @type {Object}
		 * @property
		 */
		map: null,
		
		/**
		 * Hoods geojson leaflet layer
		 * @type {Object}
		 * @property
		 */
		map: null,
		
		/**
		 * Initialize the hoods
  		 * @param {Object} map leaflet map
		 * @method
		 */
		init: function (map) {
			
			this.map = map;
			
			// init the new hood layer
			this.layer = new L.GeoJSON(null, {
				pointToLayer: function (latlng) {
			        return new L.CircleMarker(latlng, {
			            radius: 8,
			            fillColor: "#ff7800",
			            color: "#000",
			            weight: 1,
			            opacity: 1,
			            fillOpacity: 0.8
			        });
			    }
			});
			
			// get it and set it!
			$.when(
				this.fetch()
			// is
			).done(
				this.render
			);
		},
		
		/**
		 * Fetch the neighborhoods from the API
		 * @method
		 */
		fetch: function () {
			return $.ajax({
			    url: 'http://mqvibe-api.mapquest.com/places/search',
	            data: {
					child_of_place_id: 400649,
					type: 'neighborhood',
					sort: 'walkability',
					minSize: 0.002,
					maxSize: 15,
					walkMin: 1,
					popularityMin: 0.01,
					hits: 300
	            },
	            dataType: 'jsonp',
				context: this
	        });
		},
		
		/**
		 * Render hoods from the api
		 * @param {Object} response mqvibe hood response
		 * @method
		 */
		render: function (response) {
			var self = this;
			
			// set up events
			self.layer.on("featureparse", function (e) {
				
			    var popupContent = '<div>' + (e.properties.name + ' ' + e.properties.vibe_score).replace(/\s/g, '&nbsp;') + '</div>';
					
				// mouse over event
				e.layer.on("mouseover", function (e) { 
					e.target._openPopup({ latlng: e.latlng });
				});
			
			    e.layer.bindPopup(popupContent);
			});
			
			// add each hood from the response to the new geojson layer
			$(response.features).each(function (i, feature) {
				self.layer.addGeoJSON(feature);
			});
			
			// finally, add the entire layer to the map
			self.map.addLayer(self.layer)
		}
	};
	
	
}());