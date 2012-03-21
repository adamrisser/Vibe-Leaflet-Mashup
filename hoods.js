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
        layer: null,
        
        /**
         * Initialize the hoods
         * @param {Object} map leaflet map
         * @method
         */
        init: function (map) {
            
            this.map = map;
            
            // init the new hood layer
            this.layer = new L.GeoJSON();
            
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
                
                var popupContent = '<div class="iw">' + e.properties.name + ' <span class="score">' + e.properties.vibe_score + '</span></div>';
                
                var colors = self.getVibeScoreParams(e.properties.vibe_score);
               
                e.layer.setStyle({
                    fillColor: colors.rgb,
                    fillOpacity: colors.opacity,
                    opacity: 1,
                    color: "#fff",
                    weight: 1
                });
                
                // mouse over event
                e.layer.on("mouseover", function (e) { 
                    e.target._openPopup({ latlng: e.latlng });
                });

                e.layer.on("click", function (l) {
                    self.map.fitBounds(new L.LatLngBounds(l.target._latlngs));
                    l.target.setStyle({ stroke: true, color: '#000', weight: 5, opacity: 1 });
                    Hood.init({ map: self.map, placeId: e.id });
                });
             
                e.layer.bindPopup(popupContent);
            });
            
            // add each hood from the response to the new geojson layer
            $(response.features).each(function (i, feature) {
                self.layer.addGeoJSON(feature);
            });
            
            // finally, add the entire layer to the map
            self.map.addLayer(self.layer);self.map.addLayer(self.layer)
        },
        
        /**
         * Get a RGB value which represents the score.
         * Neighborhood opacity/color is determined by their score. 
         * @param {Object} score vibe score
         */
        getVibeScoreParams: function (score) {
            var rgb,
                opacity = .3;
            
            if (score >= 8) {
                rgb = 'rgb(244, 125, 68)';
            }
            else if (score >= 6) {
                rgb = 'rgb(204, 113, 71)';
            }
            else if (score >= 4) {
                rgb = 'rgb(179, 118, 89)';
            }
            else if (score >= 2) {
                rgb = 'rgb(128, 93, 77)';
            }
            else {
                rgb = 'rgb(77, 61, 54)';
            }
            
            // min opacity for score 0  = 30%
            // max opacity for score 10 = 80%
            return {
                rgb: rgb,
                opacity: opacity + score * .04
            };
        },
    };
    
    
}());