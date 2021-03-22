import Container from './Container.js';
import {getCurrentWeather} from './OpenWeather.js';

export default class Box extends Container{
    constructor(parent){
        parent.container=parent; //because this is the top of the tree
        super(parent,{tag:"figure", classes:['weather','small']});
        this.startSpinner() //always start spinning on creation because it should at least update weather 
        this.weather=new Container(this,{classes: ['inside'], click: this.expand.bind(this)});
        this.place=new Container(this,{tag:"figcaption"});
    }
    startSpinner(){
        this.spinning=true;
        this.container.classList.toggle("spin");
    }
    stopSpinner(){
        this.spinning=false;
        this.container.classList.toggle("spin");
    }
    update(location){
        this.place.location=location;
        this.place.text=location.location;
        console.log('Getting Weather for: '+location.location);
        getCurrentWeather(location).then(r=>{
            console.log(r);
            let period=r.dt>=r.sys.sunrise&&r.dt<=r.sys.sunset?'day':'night';
            this.weather.container.innerHTML=`<div class="conditions">${r.weather[0].main}</div>
            <div class="icon">
            <i class="wi wi-owm-${period}-${r.weather[0].id}"></i></div>
            <div class="temperature">${r.main.temp.toFixed(0)}&deg;</div>
            <div class="other">
                Feels Like: ${r.main.feels_like.toFixed(0)}&deg;<br>
                Humidity: ${r.main.humidity}%
            </div>`;
            this.delButton=new Container(this.weather,{classes:["delete"], click:this.remove.bind(this)});
            this.stopSpinner();
        });
    }
    remove(){
        this.parent.deleteLocation(this.place.location);
        this.delete();
    }

    expand(){
        this.parent.makeSmall();
        this.container.classList.toggle("large");
        this.container.classList.toggle("small");
    }
}
