import Container from './Container.js';
import {getCurrentWeather, get5DayWeather} from './OpenWeather.js';

export default class Box extends Container{
    constructor(parent){
        parent.container=parent; //because this is the top of the tree
        super(parent,{tag:"figure", classes:['weather','small']});
        this.startSpinner() //always start spinning on creation because it should at least update weather 
        this.weather=new Container(this,{classes: ['inside','current'], click: this.expand.bind(this)});
        this.forecast=new Container(this,{classes: ['inside','forecast']});
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
        getCurrentWeather(location).then(r=>{
            this.weather.container.innerHTML=`<div class="conditions">${r.weather[0].main}</div>
            <div class="icon">${this.buildIcon(r.dt,r.sys.sunrise,r.sys.sunset,r.weather[0].id)}</div>
            <div class="temperature">${r.main.temp.toFixed(0)}&deg;</div>
            <div class="other">
                Feels Like: ${r.main.feels_like.toFixed(0)}&deg;<br>
                Humidity: ${r.main.humidity}%
            </div>`;
            this.forecast.container.innerHTML=this.weather.container.innerHTML;
            this.delButton=new Container(this.weather,{classes:["delete"], click:this.remove.bind(this)});
            this.stopSpinner();
        });
    }
    remove(e){
        e.stopPropagation();
        this.parent.deleteLocation(this.place.location);
        this.delete();
    }

    expand(){
        this.startSpinner();        
        get5DayWeather(this.place.location).then(r=>{
            console.log(r);
            r.list.forEach(time => {
                this.forecast.container.innerHTML+=`<div>${this.buildIcon(time.dt,r.city.sunrise,r.city.sunset,time.weather[0].id)}</div>`
            });
            // <div class="icon">
            // <i class="wi wi-owm-${period}-${r.weather[0].id}"></i></div>
            // <div class="temperature">${r.main.temp.toFixed(0)}&deg;</div>
            // <div class="other">
            //     Feels Like: ${r.main.feels_like.toFixed(0)}&deg;<br>
            //     Humidity: ${r.main.humidity}%
            // </div>`;
            // this.delButton=new Container(this.weather,{classes:["delete"], click:this.remove.bind(this)});
            this.parent.toggleBox();
            this.container.classList.toggle("large");
            this.container.classList.toggle("small");
            this.stopSpinner();
        })
    }

    buildIcon(date, sunrise, sunset,id){
        return '<i class="wi wi-owm-'+(date>=sunrise&&date<=sunset?'day':'night')+'-'+id+'"></i>';
    }
}
