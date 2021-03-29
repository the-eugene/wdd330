import {fetchAPI} from './ApiFunctions.js';
const settings = {
    ApiKey: "GNAvIs0EerfHv9i2Xxhv1Zn5N0sPICQk",
    BaseURL: 'https://www.mapquestapi.com/geocoding/v1/',
    forward: 'address',
    reverse: 'reverse',
    zoom: 7,
    debug: false
}

export function getGeoLocation(query=null) {
    settings.debug && console.debug("Getting Location for: '"+query+"'");
    if(!query){
        settings.debug && console.debug("Empty query, attempting geolocation API");
        if(navigator.geolocation){
            settings.debug && console.debug("Getting location from geolocation API");
            return getCurrentPosition()
            .then(r=>{
                    settings.debug && console.debug(`Got ${r.coords.latitude} by ${r.coords.longitude}`);
                    return fetchAPI(buildMapQuestURL(settings.reverse,r.coords.latitude + ','+ r.coords.longitude))
                    .then(parseMapQuestResults);
                },
                r=>{
                    settings.debug && console.log("Permission Rejected? I'm dejected. Default injected.");
                    return fetchAPI(buildMapQuestURL(settings.forward,"Rexburg, ID")).then(parseMapQuestResults);
                });
        } else query="Rexburg, ID";
    }
    return fetchAPI(buildMapQuestURL(settings.forward,query)).then(parseMapQuestResults);
}

function buildMapQuestURL(word,location) {
    let url=`${settings.BaseURL}${word}?key=${settings.ApiKey}&location=${location}`;
    settings.debug && console.debug("MapQuest URL:", url);
    return url;
}

function parseMapQuestResults(result){
    if(result){
        settings.debug && console.debug("JSON:",result);
        try{
            let lSet=result.results[0].locations;
            if (lSet.length>1) {console.warn("Multiple Locations Found, using the first one");}
            settings.debug && console.log("Fetched:", lSet[0]);
            if (lSet[0].geocodeQuality=="COUNTRY" || lSet[0].geocodeQuality=="STATE") throw new Error("Precise Location Not Found");
            return {
                location: buildLocationString(lSet[0].adminArea5, lSet[0].adminArea3, lSet[0].adminArea1=='US'?'':lSet[0].adminArea1),
                lat: lSet[0].latLng.lat,
                lon: lSet[0].latLng.lng,
                x: lon2tile(lSet[0].latLng.lng,settings.zoom),
                y: lat2tile(lSet[0].latLng.lat,settings.zoom)
            };
        }
        catch (e){
            console.error(settings.debug?e:"Is that really a place?");
            return 'none';
        }
    }
    else {settings.debug && console.debug("Nothing was returned from MapQuest API");}
}

function getCurrentPosition(options={}){
    return new Promise(
        (resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}

function buildLocationString(...args){
    return args.filter(a=>a).join(", ");
}

function lon2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lat2tile(lat,zoom) { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }