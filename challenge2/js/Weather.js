import {getGeoLocation} from './MapQuest.js'
import ls from "./ls.js";
import Box from "./Box.js";

const boxFrame=document.getElementById("WeatherContainer");
document.getElementById('add_go').addEventListener('click',addLocation);
var locations=ls.loadObject("weatherLocations");
var uiBoxes=[];

function addLocation() {
  displayMessage("");
  const add=document.getElementById('add_location');
  const newBox=new Box(boxFrame);
  getGeoLocation(add.value).then(r=>{
    if (locations.find(e=>e.location==r.location)){
      displayMessage("Could not add location: Already exists!");
      newBox.delete();
    }
    else{
      locations.push(r);
      ls.saveObject("weatherLocations",locations);
      newBox.update(locations.slice(-1)[0]);
      uiBoxes.push(newBox);
      if(uiBoxes.length==1) newBox.expand();
    }
  });
}

boxFrame.deleteLocation = function(location) {
  locations=locations.filter(l=>{location.location!=l.location;});
  uiBoxes=uiBoxes.filter(l=>{location.location!=l.place.location.location;});
  ls.saveObject("weatherLocations",locations);
}

boxFrame.makeSmall=function(){
  uiBoxes.forEach(e => {
    e.container.classList.remove("large");
    e.container.classList.add("small");
  });
}

function displayMessage(message){
  document.getElementById("Message").innerHTML=message;
}

locations.forEach(l => {
  const b=new Box(boxFrame);
  uiBoxes.push(b);
  b.update(l);
  if(uiBoxes.length==1) b.expand();
});