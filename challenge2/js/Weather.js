import {getGeoLocation} from './MapQuest.js'
import ls from "./ls.js";
import Box from "./Box.js";

const boxFrame=document.getElementById("WeatherContainer");
document.getElementById('add_go').addEventListener('click',addLocation);
const locations=ls.loadObject("weatherLocations");
const uiBoxes=[];
locations.forEach(l => {
  const b=new Box(boxFrame);
  uiBoxes.push(b);
  b.update(l);
});

function addLocation() {
  const add=document.getElementById('add_location');
  const newBox=new Box(boxFrame);
  uiBoxes.push(newBox);
  getGeoLocation(add.value).then(r=>{
    uiBoxes.push(newBox);
    newBox.idx=locations.length;
    locations.push(r);
    ls.saveObject("weatherLocations",locations);
    newBox.update(locations.slice(-1)[0]);
  });
}

function deleteLocation(location) {
  locations=locations.filter(l=>{location!=l});
  ls.saveObject("weatherLocations",locations);
}