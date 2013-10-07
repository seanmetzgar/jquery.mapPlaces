jQuery(function () {
    "use strict";
    jQuery(".mapContainer").mapPlaces({
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
                ],
                icon: "images/churches.png"
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
                ],
                icon: "images/entertainment.png"
            },
            {
                name: "Public Transit",
                types: [
                    "bus_station",
                    "subway_station",
                    "taxi_stand",
                    "train_station"
                ],
                icon: "images/transit.png"
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
                ],
                icon: "images/restaurants.png"
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
                ],
                icon: "images/retail.png"
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
                ],
                icon: "images/services.png"
            }
        ]
    });
});