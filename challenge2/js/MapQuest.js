import {fetchAPI} from './ApiFunctions.js';
const settings = {
    ApiKey: "GNAvIs0EerfHv9i2Xxhv1Zn5N0sPICQk",
    BaseURL: 'https://www.mapquestapi.com/geocoding/v1/',
    forward: 'address',
    reverse: 'reverse',
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
                });
        } else query="Denham Springs, LA";
    }
    return fetchAPI(buildMapQuestURL(settings.forward,query)).then(parseMapQuestResults);
}

function buildMapQuestURL(word,location) {
    let url=`${settings.BaseURL}${word}?key=${settings.ApiKey}&location=${location}`;
    settings.debug && console.debug("MapQuest URL:", url);
    return url;
}

function parseMapQuestResults(result){
    settings.debug && console.debug("JSON:",result);
    try{
        let lSet=result.results[0].locations;
        if (lSet.length>1) {console.warn("Multiple Locations Found, using the first one");}
        settings.debug && console.log("Fetched:", lSet[0]);
        if (lSet[0].geocodeQuality=="COUNTRY" || lSet[0].geocodeQuality=="STATE") throw new Error("Precise Location Not Found");
        return {
            'location': buildLocationString(lSet[0].adminArea5, lSet[0].adminArea3, lSet[0].adminArea1=='US'?'':lSet[0].adminArea1),
            'lat': lSet[0].latLng.lat,
            'lon': lSet[0].latLng.lng
        };
    }
    catch (e){console.error(e);}
}

function getCurrentPosition(options={}){
    return new Promise(
        (resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}

function buildLocationString(...args){
    return args.filter(a=>a).join(", ");
}