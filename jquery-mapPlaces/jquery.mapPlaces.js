/**** 
*  jQuery Map Places
*  A jQuery plugin for showing places on a map.
*  version: 0.0.0
*  author: Sean Metzgar
****/
(function ($) {
    "use strict";
    $.mapPlaces = function (element, options) {
        /** Variable Definitions **/
        var plugin = this,
            buildVars = {},
            internal = {};
        /** Public Variables **/
        plugin.version = "0.0.0";
        /** Build Variables **/
        buildVars = {
            urlProtocol: (window.location.protocol==="https:") ? "https:" : "http:",
        };
        /** Default Settings **/
        internal.defaults = {
            loaderText: "Loading...",
            apiKey: "AIzaSyCaN2XlwZVROBpQB42yk9WNVwBtLJZgkMc",
            mapZoom: 13,
            mapLat: 40.0306,
            mapLong: -75.2328,
            icons: {},
            radiusValues: [
                {
                    name: "1/4 Mile",
                    meters: 402
                },
                {
                    name: "1/2 Mile",
                    meters: 805
                },
                {
                    name: "1 Mile",
                    meters: 1609
                },
                {
                    name: "2 Miles",
                    meters: 3219
                },
            ],
            categories: [
                {
                    name: "Services",
                    types: []
                }
            ]
        };
        /** Elements / jQuery Objects **/
        internal.$element = $(element);
        internal.element = element;
        internal.$container = null;
        internal.$loader = null;
        internal.$foundation = null;
        /** Internal Variables **/
        internal.mapCenter = null;
        internal.mapProp = {};
        internal.map = null;
        internal.placesService = null;
        internal.mapAPI = (typeof window.google !== "undefined" && typeof window.google.maps !== "undefined") ? window.google.maps : false;
        internal.mapMarkers = [];
        internal.mapInfoWindow = null;
        internal.classes = {
            containerClass: "mapPlacesContainer",
            loaderClass: "mapPlacesLoader",
            foundationClass: "mapPlacesFoundation"
        };
        /** Internal Settings Declaration **/
        internal.settings = {};
        /** Internal Methods **/
        internal.methods = {
            /** Constructor Method **/
            buildFramework: function () {
                internal.$container = $("<div class=\"" + internal.classes.containerClass + "\"></div>").appendTo(internal.$element);
                //internal.$loader = $("<p class=\"" + internal.classes.loaderClass + "\">" + internal.settings.loaderText + "</p>").appendTo(internal.$container);
                internal.$foundation = $("<div class=\"" + internal.classes.foundationClass + "\"></div>").appendTo(internal.$container);
                if (!internal.mapAPI) {
                    console.log("google load");
                    $.getScript('https://www.google.com/jsapi', function() {
                        google.load('maps', 3, { other_params: 'libraries=places&sensor=false', callback: function() {
                            internal.mapAPI = window.google.maps;
                            internal.mapInfoWindow = new internal.mapAPI.InfoWindow();
                            internal.methods.buildMap();
                        }});
                    });
                }
            },
            buildMap: function () {
                internal.mapCenter = new internal.mapAPI.LatLng(internal.settings.mapLat, internal.settings.mapLong);
                internal.mapProp = {
                    center: internal.mapCenter,
                    zoom: internal.settings.mapZoom,
                    mapTypeId: internal.mapAPI.MapTypeId.ROADMAP
                };
                internal.map = new internal.mapAPI.Map(internal.$foundation.get(0), internal.mapProp);
                internal.placesService = new internal.mapAPI.places.PlacesService(internal.map);
                internal.methods.nearbySearch(['store','church']);
            },
            nearbySearch: function(types, radius) {
                var request = {},
                    radius = (typeof radius === "number") ? radius : internal.settings.radiusValues[internal.settings.radiusValues.length - 1].meters;

                if (Array.isArray(types)) {
                    request = {
                        location: internal.mapCenter,
                        radius: radius,
                        types: types
                    };
                    internal.placesService.nearbySearch(request, internal.methods.nearbySearchCallback);
                }
            },
            nearbySearchCallback: function (results, status) {
                var place = null,
                    i = 0;
                if (status == internal.mapAPI.places.PlacesServiceStatus.OK) {
                    for (i = 0; i < results.length; i=i+1) {
                        place = results[i];
                        internal.methods.createMarker(place);
                    }
                }
            },
            createMarker: function (place) {
                var location = null,
                    marker = null;
                
                if (typeof place === "object") {
                    location = place.geometry.location;
                    marker = new internal.mapAPI.Marker({
                        map: internal.map,
                        position: location
                    });

                    internal.mapAPI.event.addListener(marker, 'click', function() {
                        console.log(place);
                        internal.mapInfoWindow.setContent(place.name);
                        internal.mapInfoWindow.open(internal.map, this);
                    });
                } 
            }         
        };
        /** Initialization Method **/
        plugin.init = function () {
            internal.settings = $.extend({}, internal.defaults, options);
            internal.methods.buildFramework();
            if(!Array.isArray) {
                Array.isArray = function (vArg) {
                    return Object.prototype.toString.call(vArg) === "[object Array]";
                };
            }
        };
        plugin.init();
    };
    $.fn.mapPlaces = function (options) {
        return this.each(function () {
            if (undefined === $(this).data("mapPlaces")) {
                var plugin = new $.mapPlaces(this, options);
                $(this).data("mapPlaces", plugin);
            }
        });
    };
}(jQuery));