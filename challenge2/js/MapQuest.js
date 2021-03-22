import {fetchAPI} from './ApiFunctions.js';
const settings = {
    ApiKey: "GNAvIs0EerfHv9i2Xxhv1Zn5N0sPICQk",
    BaseURL: 'http://www.mapquestapi.com/geocoding/v1/address',

}

export function getGeoLocation(query=null) {
    if(!query){
       if(navigator.geolocation){
        return getCurrentPosition().then(r=>{return {'location':"Local Weather", 'lat':r.coords.latitude, 'lon':r.coords.longitude}});
       }
       query="Denham Springs, LA";
    }
    return fetchAPI(buildMapQuestURL(query)).then(parseMapQuestResults);
}

function getCurrentPosition(options={}){
    return new Promise(
        (resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}

function buildMapQuestURL(location) {
    return `${settings.BaseURL}?key=${settings.ApiKey}&location=${location}`;
}
function parseMapQuestResults(result){
    try{
        let lSet=result.results[0].locations;
        if (lSet.length>1) console.error("Multiple Locations Found");
        if (lSet[0].AdminArea5) console.error("No City Found");
        return {
            'location': `${lSet[0].adminArea5}, ${lSet[0].adminArea3}`,
            'lat': lSet[0].latLng.lat,
            'lon': lSet[0].latLng.lng
        };
    }
    catch (e){console.error(e);}
}