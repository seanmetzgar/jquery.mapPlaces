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
            mapZoom: 12,
            mapLat: 40.0306,
            mapLong: -75.2328
        };
        /** Elements / jQuery Objects **/
        internal.$element = $(element);
        internal.element = element;
        internal.$container = null;
        internal.$loader = null;
        internal.$foundation = null;
        internal.mapCenter = null;
        internal.mapProp = {};
        internal.map = null;
        internal.mapAPI = (typeof window.google !== "undefined" && typeof window.google.maps !== "undefined") ? window.google.maps : false;
        internal.classes = {
            containerClass: "mapPlacesContainer",
            loaderClass: "mapPlacesLoader",
            foundationClass: "mapPlacesFoundation"
        };
        /** Internal Settings Declaration **/
        internal.settings = {
        };
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
            },
            nearbySearch: function() {
                internal.placesService.nearbySearch({}, internal.methods.nearbySearchCallback);
            },
            
        };
        /** Initialization Method **/
        plugin.init = function () {
            internal.settings = $.extend({}, internal.defaults, options);
            internal.methods.buildFramework();
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