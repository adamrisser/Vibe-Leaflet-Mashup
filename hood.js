/**
 * An individual neighborhood object.
 */
var Hood = function() {

	return {

		/**
		 * Our map
		 * @type {Object}
		 */
		map: null,

		/**
		 * Our geojson layer
		 * @type {Object}
		 */
		layer: null,

		/**
		 * The current hood.
		 * @type {int}
		 */
		placeId: null,

		/**
		 * Initialize this hood.
		 * @param  {Object} config object for thie hood
		 * @return {void}        
		 */
		init: function(config) {
			this.map = config.map;
			this.placeId = config.placeId;

            this.layer = new L.GeoJSON();
            
            // (boilerplate) identical initialization process to neighborhoods
            $.when(
                this.fetch(), this.fetchPois(8)
            ).done(
                this.render
            );
		},

		/**
		 * Fetches our neighborhood info.
		 * @return {Object} a jQuery promise
		 */
		fetch: function() {
            return $.ajax({
                url: 'http://mqvibe-api.mapquest.com/places/search',
                data: {
                	place_id: this.placeId, 
                	include_categories: 1,
                	include_children: 1
                },
                dataType: 'jsonp',
                context: this
            });
		},

		/**
		 * Fetches the pois for this neighborhood and the supplied category id.
		 * @param  {int} catId of the pois to fetch
		 * @return {Object}       jqeury promise object
		 */
		fetchPois: function(catId) {
            return $.ajax({
                url: 'http://mqvibe-api.mapquest.com/places/search',
                data: {
                	id: this.placeId,
                	include_pois: 1, 
                	poi_category_id: catId, 
                	poi_new: 0
                },
                dataType: 'jsonp',
                context: this
            });
		},

		/**
		 * Render our neighborhood and all it's pois for the category.
		 * @return {[type]} [description]
		 */
		render: function(responsePlace, responsePois) {
			var self = Hood,
				children = responsePlace[0].features[0].children.features,
				pois = responsePois[0].features[0].pois;

			// set up events
            self.layer.on("featureparse", function (e) {
                
                var popupContent = '<div class="iw">' + e.properties.name + '</span></div>';
               
                e.layer.setStyle({
                    fillColor: 'dbed11',
                    fillOpacity: .3,
                    opacity: 1,
                    color: "#000",
                    weight: 1
                });
                
                // mouse over event
                e.layer.on("mouseover", function (e) { 
                    e.target._openPopup({ latlng: e.latlng });
                });
             
                e.layer.bindPopup(popupContent);
            });

			$(children).each(function (i, child) {
                self.layer.addGeoJSON(child);
            });

            self.map.addLayer(self.layer);

            $(pois).each(function (i, poi) {
            	var marker = new L.Marker(new L.LatLng(poi.latLng.lat, poi.latLng.lng));
            	self.map.addLayer(marker);
            });
		}

	};

}();