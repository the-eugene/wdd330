import {fetchAPI} from './ApiFunctions.js';
const settings={
    debug: false,
    ApiKey: "4d32b7c9c454302615b0835a8e551936",
    units: "imperial",
    base_url: 'https://api.openweathermap.org/data/2.5/',
    current_word: "weather", //current weather only
    forecast_word: "forecast", //5 day 3 hour blocks
    onecall_word: "onecall" //current, 60*1 minute, 48*1 hour, 7*day, alerts, historical. Requires lat/lon 
  }

  function buildWeatherUrl(word, location,options={}){
    let url=settings.base_url+word;
    options={appid:settings.ApiKey, units:settings.units, ...options};
    if(location.lat){options={...location, ...options};}
    else if(word==settings.onecall_word){return false;} //require lat, lon coordinates
    else if(/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(location)){
      options.zip=location;
    } else { options.q=location;}
    url+='?'+Object.entries(options)
      .map(([k,v])=>k+'='+encodeURIComponent(v))
      .join('&');
    settings.debug&&console.log('Url Crafted: ',url);
    return url;
  }

  export async function getCurrentWeather(location='70726'){
    return await fetchAPI(buildWeatherUrl(settings.current_word, location));
  }

  export async function get5DayWeather(location='70726'){
    return await fetchAPI(buildWeatherUrl(settings.forecast_word, location));
  }

  export async function getOneCall(location={lat:30.456128,lon:-90.903357}){
    return await fetchAPI(buildWeatherUrl(settings.onecall_word, location,{exclude:'minutely'}));
  }