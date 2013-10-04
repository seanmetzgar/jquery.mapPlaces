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
            urlProtocol: (window.location.protocol === "https:") ? "https:" : "http:"
        };
        /** Default Settings **/
        internal.defaults = {
            mapWidth: 720,
            mapHeight: 360,
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
                }
            ],
            categories: [
                {
                    name: "Churches",
                    types: [
                        "cemetery",
                        "church",
                        "hindu_temple",
                        "mosque",
                        "synagogue",
                        "place_of_worship"
                    ]
                },
                {
                    name: "Entertainment",
                    types: [
                        "amusement_park",
                        "aquarium",
                        "art_gallery",
                        "bowling_alley",
                        "casino",
                        "gym",
                        "movie_theater",
                        "museum",
                        "night_club",
                        "spa",
                        "zoo",
                        "campground",
                        "park",
                        "stadium"
                    ]
                },
                {
                    name: "Public Transit",
                    types: [
                        "bus_station",
                        "subway_station",
                        "taxi_stand",
                        "train_station"
                    ]
                },
                {
                    name: "Restraurants",
                    types: [
                        "bar",
                        "cafe",
                        "food",
                        "meal_delivery",
                        "meal_takeaway",
                        "restaurant"
                    ]
                },
                {
                    name: "Retail",
                    types: [
                        "bakery",
                        "bicycle_store",
                        "book_store",
                        "clothing_store",
                        "convenience_store",
                        "department_store",
                        "electronics_store",
                        "florist",
                        "furniture_store",
                        "gas_station",
                        "grocery_or_supermarket",
                        "hardware_store",
                        "home_goods_store",
                        "jewelry_store",
                        "liquor_store",
                        "movie_rental",
                        "pet_store",
                        "pharmacy",
                        "shoe_store",
                        "shopping_mall",
                        "store",
                        "beauty_salon",
                        "hair_care"
                    ]
                },
                {
                    name: "Services",
                    types: [
                        "airport",
                        "bank",
                        "courthouse",
                        "dentist",
                        "doctor",
                        "fire_station",
                        "hospital",
                        "laundry",
                        "library",
                        "police",
                        "post_office",
                        "school",
                        "veterinary_care"
                    ]
                }
            ]
        };
        /** Elements / jQuery Objects **/
        internal.$element = $(element);
        internal.element = element;
        internal.$container = null;
        internal.$loader = null;
        internal.$foundation = null;
        internal.$search = null;
        /** Internal Variables **/
        internal.mapCenter = null;
        internal.mapProp = {};
        internal.map = null;
        internal.placesService = null;
        internal.mapAPI = (window.google !== undefined && window.google.maps !== undefined) ? window.google.maps : false;
        internal.googleLoad = (window.google !== undefined && window.google.load !== undefined) ? window.google.load : false;
        internal.mapMarkers = [];
        internal.mapInfoWindow = null;
        internal.classes = {
            containerClass: "mapPlacesContainer",
            loaderClass: "mapPlacesLoader",
            foundationClass: "mapPlacesFoundation",
            searchClass: "mapPlacesSearch",
            searchFieldContainerClass: "mapPlacesFieldContainer"
        };
        internal.formDetails = {
            searchFormName: "mapPlacesSearchForm",
            searchFieldName: "mapPlacesSearchField"
        };
        /** Internal Settings Declaration **/
        internal.settings = {};
        /** Internal Methods **/
        internal.methods = {
            /** Constructor Method **/
            buildFramework: function () {
                internal.$container = $("<div class=\"" + internal.classes.containerClass + "\"></div>")
                    .appendTo(internal.$element);
                internal.$foundation = $("<div class=\"" + internal.classes.foundationClass + "\"></div>")
                    .appendTo(internal.$container)
                    .css({
                        "width": internal.settings.mapWidth,
                        "height": internal.settings.mapHeight
                    });
                if (!internal.mapAPI) {
                    if (!internal.googleLoad) {
                        $.getScript(buildVars.urlProtocol + "//www.google.com/jsapi", internal.methods.loadGoogleMaps);
                    } else {
                        internal.methods.loadGoogleMaps();
                    }
                }
            },
            buildMap: function () {
                internal.mapCenter = new internal.mapAPI.LatLng(internal.settings.mapLat, internal.settings.mapLong);
                internal.mapProp = {
                    center: internal.mapCenter,
                    zoom: internal.settings.mapZoom,
                    mapTypeId: internal.mapAPI.MapTypeId.ROADMAP,
                    panControl: false,
                    zoomControl: true,
                    mapTypeControl: true,
                    scaleControl: false,
                    streetViewControl: false,
                    overviewMapControl: false,
                    draggable: false,
                    disableDoubleClickZoom: true,
                    scrollwheel: false
                };
                internal.map = new internal.mapAPI.Map(internal.$foundation.get(0), internal.mapProp);
                internal.placesService = new internal.mapAPI.places.PlacesService(internal.map);
            },
            buildSearch: function () {
                var tempName = null,
                    tempId = null,
                    $tempContainer = null,
                    index = 0;
                internal.$search = $("<div class=\"" + internal.classes.searchClass + "\"></div>")
                    .prependTo(internal.$container);
                internal.$searchForm = $("<form name=\"" + internal.formDetails.searchFormName + "\"></form>").appendTo(internal.$search);
                for (index = 0; index < internal.settings.categories.length; index = index + 1) {
                    tempName = internal.settings.categories[index].name;
                    tempId = internal.formDetails.searchFieldName + "-" + index;
                    $tempContainer = $("<div class=\"" + internal.classes.searchFieldContainerClass + "\"></div>").appendTo(internal.$searchForm);
                    $("<input type=\"checkbox\" name=\""
                        + internal.formDetails.searchFieldName
                        + "\" id=\""
                        + tempId
                        + "\" value=\""
                        + index
                        + "\">")
                        .appendTo($tempContainer);
                    $("<label for=\"" + tempId + "\">" + tempName + "</label>").appendTo($tempContainer);
                }
                internal.$searchForm.find("input[name=" + internal.formDetails.searchFieldName + "]").change(function () {
                    internal.methods.clearMarkers();
                    internal.$searchForm.find("input[name=" + internal.formDetails.searchFieldName + "]:checked").each(function () {
                        index = parseInt($(this).val(), 10);
                        if (!isNaN(index) && Array.isArray(internal.settings.categories[index].types)) {
                            internal.methods.nearbySearch(internal.settings.categories[index].types, 1609);
                        }
                    });
                });
            },
            nearbySearch: function (types, radius) {
                var request = {};
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
                    index = 0;
                if (status === internal.mapAPI.places.PlacesServiceStatus.OK) {
                    for (index = 0; index < results.length; index = index + 1) {
                        place = results[index];
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

                    internal.mapAPI.event.addListener(marker, 'click', function () {
                        internal.mapInfoWindow.setContent(place.name);
                        internal.mapInfoWindow.open(internal.map, this);
                    });
                    internal.mapMarkers.push(marker);
                    marker = null;
                }
            },
            clearMarkers: function () {
                var index = 0;
                if (internal.mapMarkers.length > 0) {
                    for (index = 0; index < internal.mapMarkers.length; index = index + 1) {
                        internal.mapMarkers[index].setMap(null);
                        internal.mapMarkers[index] = null;
                    }
                    internal.mapMarkers = [];
                }
                internal.mapMarkers = [];
            },
            loadGoogleMaps: function () {
                internal.googleLoad = window.google.load;
                internal.googleLoad('maps', 3, { other_params: 'libraries=places&sensor=false', callback: function () {
                    internal.mapAPI = window.google.maps;
                    internal.mapInfoWindow = new internal.mapAPI.InfoWindow();
                    internal.methods.buildMap();
                    internal.methods.buildSearch();
                }});
            }
        };
        /** Initialization Method **/
        plugin.init = function () {
            internal.settings = $.extend({}, internal.defaults, options);
            internal.methods.buildFramework();
            if (!Array.isArray) {
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