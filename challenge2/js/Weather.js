import {getGeoLocation} from './MapQuest.js'
import ls from "./ls.js";
import Box from "./Box.js";

const debug=true;
const boxFrame=document.getElementById("WeatherContainer");
document.getElementById('add_go').addEventListener('click',addLocation);
var locations=ls.loadObject("weatherLocations");
var uiBoxes=[];

function addLocation() {
  displayMessage("");
  const add=document.getElementById('add_location');
  const newBox=new Box(boxFrame);
  getGeoLocation(add.value).then(r=>{
    if (!r){
      displayMessage("The location provided does not seem to be a city!");
      newBox.delete();
    } else if(locations.find(e=>e.location==r.location)){
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

boxFrame.deleteLocation = function(toremove) {
      debug&&console.log("Deleting: ",location);
      debug&&console.log("Before: ",uiBoxes);
  locations=locations.filter(l=>{return toremove.location!=l.location;});
  uiBoxes=uiBoxes.filter(l=>{return toremove.location!=l.place.location.location;}); 
      debug&&console.log("After: ",uiBoxes);
  ls.saveObject("weatherLocations",locations);
}

boxFrame.toggleBox=function(){
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