import {getGeoLocation} from './MapQuest.js'
import ls from "./ls.js";
import Box from "./Box.js";

const debug=true;
const boxFrame=document.getElementById("WeatherContainer");
document.getElementById('add_go').addEventListener('click',addLocation);
document.getElementById('add_location').addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
      addLocation();
  }
});

var locations=ls.loadObject("weatherLocations");
var uiBoxes=[];

function addLocation() {
  const add=document.getElementById('add_location');
  startAddSpin();
  getGeoLocation(add.value).then(r=>{
    stopAddSpin();
    if (!r){
      displayMessage("The location provided does not seem to be a city!");
    } else if(locations.find(e=>e.location==r.location)){
      displayMessage("Could not add location: Already exists!");
    }
    else{
      const newBox=new Box(boxFrame);
      locations.push(r);
      ls.saveObject("weatherLocations",locations);
      newBox.update(locations.slice(-1)[0]);
      uiBoxes.push(newBox);
      if(uiBoxes.length==1) newBox.expand();
      add.value="";
    }
  });
}

boxFrame.deleteLocation = function(toremove) {
      debug&&console.log("Deleting: ",toremove);
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
  let mbox=document.getElementById("Message");
  mbox.innerHTML=message;
  mbox.classList.add('active');
  setTimeout(()=>mbox.classList.remove('active'),5000);

}
function startAddSpin(){document.getElementById('add_go').classList.add("spin");}
function stopAddSpin(){document.getElementById('add_go').classList.remove("spin");}

locations.forEach(l => {
  const b=new Box(boxFrame);
  uiBoxes.push(b);
  b.update(l);
  if(uiBoxes.length==1) b.expand();
});