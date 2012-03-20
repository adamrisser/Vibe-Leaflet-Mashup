(function () {
	
	/**
	 * Tile URL
	 * @type {String}
	 * @private
	 */
    var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
	
	/**
	 * Sub domains for tiles
	 * @type {Array<String>}
	 * @private
	 */
	subDomains = ['otile1','otile2','otile3','otile4'],
	
	/**
	 * Copyrights
	 * @type {String}
	 * @private
	 */
	mapquestAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>,' +
		'<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.';
    
	/**
	 * Mapquest tile layer
	 * @type {String}
	 * @private
	 */
    mq = new L.TileLayer(mapquestUrl, {
        maxZoom: 18,
        attribution: mapquestAttrib,
        subdomains: subDomains
    }),
    
	/**
	 * Denver LatLng point
	 * @type {Object}
	 * @private
	 */
    denver = new L.LatLng(39.738742358207745, -104.98406410217285);
    
	/**
	 * @type {Object}
	 * @global
	 */
	map = new L.Map('map');

	// init the map
    map.setView(denver, 12).addLayer(mq);
    
	// init the hoods
    Hoods.init(map);

}());