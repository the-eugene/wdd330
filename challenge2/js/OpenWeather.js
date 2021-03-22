import {fetchAPI} from './ApiFunctions.js';
const settings={
    ApiKey: "4d32b7c9c454302615b0835a8e551936",
    units: "imperial",
    base_url: 'https://api.openweathermap.org/data/2.5/',
    current_word: "weather",
    forecast_word: "forecast",
  }

  function buildWeatherUrl(word, location){
    let url=settings.base_url+word
      + '?appid='+settings.ApiKey
      + '&units='+settings.units;
    if(location.lat){ return url+`&lat=${location.lat}&lon=${location.lon}`;}
    return url+(/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(location)?`&zip=${location}`:`&q=${location}`);
  }

  export async function getCurrentWeather(location='70726'){
    return await fetchAPI(buildWeatherUrl(settings.current_word, location));
  }

  export async function get5DayWeather(location='70726'){
    return await fetchAPI(buildWeatherUrl(settings.forecast_word, location));
  }