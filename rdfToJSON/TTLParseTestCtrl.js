var app = angular.module('Enterprise2MapApp');
app.controller('TTLParseTestCtrl', function ($scope, TTLParseService) {
    $scope.parsedTTL = "";
    var promise = TTLParseService.parseTTL('Factory');
    promise.then(function (resolution) {
        $scope.parsedTTL = resolution;

        //$scope.plotDataOnMap();

        var normalPopUpMap = {};
        var detailedPopUpMap = {};

        $scope.generateMapAnnotations(normalPopUpMap, detailedPopUpMap);
        


    }, function (rejection) {
        console.error(rejection);
    });

    $scope.generateMapAnnotations = function (normalPopUpMap, detailedPopUpMap)
    {
        var mymap = L.map('map', {}).setView([-0.515278, 47.501111], 2);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiczZhc2FsdGEiLCJhIjoiY2lveXUwb3dqMDBlaXZ2bHdoZjQ5dHlrbiJ9.xKMDfR_36OSyxiBT_jftig', {
            maxZoom: 18,
            attribution: 'EIS LAB 2016',
            id: 'mapbox.streets'
        }).addTo(mymap);

        // volkswagenIcon
        var iconHolder = L.Icon.extend({
            options: {
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -10]
            }
        });

        //var vw_icon = new iconHolder({iconUrl: 'data/vw-logo.png'});
        var industry_icon = new iconHolder({iconUrl: 'data/industry.png'});
        var vw_icon = new iconHolder({iconUrl: 'data/vw-logo.png'});

        // todo: loop all companies and pass them to createPopUp function
        // and save popups in respective maps against their key values that will be used later on

        processObject($scope.parsedTTL.companies, "");

        function processObject(objArray, detailsToAppendToPopUp)
        {
            for (objNumber = 0; objNumber < objArray.length; objNumber++)
            {
                // create its own popUp
                var popUpContent = createPopUp(objArray[objNumber], detailsToAppendToPopUp);

                // create its Annotation if required
                createAnnotation(objArray[objNumber], popUpContent);

                // check in case it has more arrays, process them too
                var obj = objArray[objNumber];
                var objKeys = Object.keys(obj);
                for(keyNumber=0; keyNumber < objKeys.length; keyNumber++)
                {
                    keyValue = objKeys[keyNumber];
                    subObj = obj[keyValue];
                    if(keyValue!="polygons" && subObj instanceof Array)
                    {
                        processObject(subObj, popUpContent);
                    }
                }
            }
        }

        function createPopUp(obj, detailsToAppendToPopUp)
        {
            var popupContent = "";

            //if(typeof(obj) == "object" && obj.hasOwnProperty("polygons"))
            if(typeof(obj) == "object")
            {
                objKeys = Object.keys(obj);
                for(propNumber=0; propNumber<objKeys.length; propNumber++)
                {
                    if(typeof(obj[objKeys[propNumber]]) == "object"
                        && !(typeof(obj[objKeys[propNumber]]) instanceof Array)
                        && objKeys[propNumber] != "polygons"
                        && objKeys[propNumber] != "subject")
                    {
                        if(obj[objKeys[propNumber]].type == "literal") {
                            popupContent += objKeys[propNumber] + ": " + obj[objKeys[propNumber]].value + "</br>";
                        }
                        else if(obj[objKeys[propNumber]].type == "uri") {
                            popupContent += objKeys[propNumber] + ": " + "<a href=" + obj[objKeys[propNumber]].value + "> " + obj[objKeys[propNumber]].value + " </a></br>";
                        }
                    }
                }
            }

            popupContent += detailsToAppendToPopUp;

            return popupContent;
        }

        function createAnnotation(obj, popUpContent)
        {
            if(obj.hasOwnProperty("polygons"))
            {
                if(obj.polygons.length==1)
                {
                    // create marker in this case
                    var point = polygons[0];
                    var marker = L.marker([parseFloat(point.lat.value), parseFloat(point.long.value)], {icon: industry_icon}).bindPopup(popUpContent);
                    marker.addTo(mymap);
                }
                else if(obj.polygons.length>1)
                {
                    // create polygon in this case and a marker in the middle
                    var polygonPointsArray = [];
                    for(pointNumber=0; pointNumber<obj.polygons.length; pointNumber++)
                    {
                        point = obj.polygons[pointNumber];
                        polygonPointsArray.push([parseFloat(point.lat.value), parseFloat(point.long.value)])
                    }

                    var polygonToAdd = L.polygon(polygonPointsArray);
                    polygonToAdd.addTo(mymap).bindPopup(popUpContent);

                    var centerOfPolygon = polygonToAdd.getBounds().getCenter();

                    var companyMarker = L.marker(centerOfPolygon, {icon: industry_icon}).bindPopup(popUpContent);
                    companyMarker.addTo(mymap);
                }
            }
        }
    }




    $scope.plotDataOnMap = function () {
        console.log($scope.parsedTTL);

        var companies = $scope.parsedTTL.companies;
        var markers = [];

        // all the data that is shown later on
        var polygonsPoints = [];

        // loop on the object, get the values and create objects to show on map
        for (comp = 0; comp < companies.length; comp++) {
            var company = companies[comp];
            var polygonPointsArray = [];
            polygonsPoints.push(polygonPointsArray);
            for (plan = 0; plan < company.plants.length; plan++) {
                for (fact = 0; fact < company.plants[plan].factories.length; fact++) {
                    for (poly = 0; poly < company.plants[plan].factories[fact].polygons.length; poly++) {
                        var polygon = company.plants[plan].factories[fact].polygons[poly];
                        var marker = L.marker([parseFloat(polygon.lat.value), parseFloat(polygon.long.value)], {icon: vw_icon});
                        polygonPointsArray.push([parseFloat(polygon.lat.value), parseFloat(polygon.long.value)])
                        marker.bindPopup(company.companyName.value);
                        markers.push(marker);
                    }
                }
            }
        }

        var popUpMap = {};
        var objectIdHolder;
        var mymap = L.map('map', {}).setView([-0.515278, 47.501111], 2);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiczZhc2FsdGEiLCJhIjoiY2lveXUwb3dqMDBlaXZ2bHdoZjQ5dHlrbiJ9.xKMDfR_36OSyxiBT_jftig', {
            maxZoom: 18,
            attribution: 'EIS LAB 2016',
            id: 'mapbox.streets'
        }).addTo(mymap);

        // add the markers to the mapview
        for (i = 0; i < markers.length; i++) {
            //markers[i].addTo(mymap);
            //markers[i].openPopup();
        }

        // add polygons to the mapview
        for (i = 0; i < polygonsPoints.length; i++) {
            var company = companies[i];

            var polygonPointsArray = polygonsPoints[i];
            var polygonToAdd = L.polygon(polygonPointsArray);
            polygonToAdd.addTo(mymap).bindPopup(company.companyName.value).openPopup();

            var centerOfPolygon = polygonToAdd.getBounds().getCenter();

            var companyMarker = L.marker(centerOfPolygon, {icon: vw_icon}).bindPopup(company.companyName.value);
            companyMarker.addTo(mymap);
        }

        function onEachFeature(feature, layer) {
            var popupContent = "";

            if (feature.properties) {
                if (feature.properties.OBJECTID) {
                    objectIdHolder = feature.properties.OBJECTID
                    popupContent += "Factory ID: " + feature.properties.OBJECTID + "</br></br>";
                }
                if (feature.properties.POPUP_CONTENT) {
                    popupContent += feature.properties.POPUP_CONTENT;
                }
                if (feature.properties.LINK) {
                    popupContent += "</br></br><a href=" + feature.properties.LINK + "> " + feature.properties.LINK + " </a> ";
                }
            }

            if (objectIdHolder in popUpMap) {
                layer.bindPopup(popUpMap[objectIdHolder]);
            }

            else {
                popUpMap[objectIdHolder] = popupContent;
                layer.bindPopup(popupContent);
            }
        }

        L.geoJson(all_features, {

            style: function (feature) {
                return feature.properties && feature.properties.style;
            },

            onEachFeature: onEachFeature,

            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    radius: 8,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8,
                    icon: vw_icon
                });
            }
        });
        //}).addTo(mymap);
    }

});
