import Container from './Container.js';
import {getCurrentWeather, getOneCall} from './OpenWeather.js';

let debug=false;

export default class Box extends Container{
    constructor(parent){
        parent.container=parent; //because this is the top of the tree
        super(parent,{tag:"figure", classes:['weather','small']});
        this.startSpinner() //always start spinning on creation because it should at least update weather 
        this.delButton=new Container(this,{classes:["delete"], click:this.remove.bind(this)});
        this.weather=new Container(this,{classes: ['inside','current'], click: this.expand.bind(this)});
        this.forecast=new Container(this,{classes: ['inside','forecast']});
        this.place=new Container(this,{tag:"figcaption"});
    }
    startSpinner(){
        this.container.classList.add("spin");
    }
    stopSpinner(){
        this.container.classList.remove("spin");
    }
    update(location){
        this.place.location=location;
        this.place.text=location.location;
        getOneCall(location).then(r=>{
            debug&&console.log(r);
            let current=r.current;
            this.weather.container.innerHTML=`<div class="conditions">${current.weather[0].main}</div>
            <div class="icon">${this.buildIcon(r.dt,r.sunrise,r.sunset,current.weather[0].id)}</div>
            <div class="temperature">${current.temp.toFixed(0)}&deg;</div>
            <div class="other">
                Feels Like: ${current.feels_like.toFixed(0)}&deg;<br>
                Humidity: ${current.humidity}%
            </div>`;
            this.forecast.container.innerHTML=this.weather.container.innerHTML;
            let daily = document.createElement('div');
            daily.classList.add('daily');
            r.daily.forEach(day => {
                let weekday=(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"])[new Date(day.dt * 1000).getDay()];
                daily.innerHTML+=
                `<div class="day">
                    <div class="highlow">
                        <span class="high">${day.temp.max.toFixed(0)}</span>
                        <span class="low">${day.temp.min.toFixed(0)}</span>
                        <div class="icon">${this.buildIcon(1,0,2,day.weather[0].id)}</div>
                        <div class="weekday">${weekday}</div>
                    </div>
                </div>`;
            });
            let hourly = document.createElement('div');
            hourly.classList.add('hourly');
            let tempStats=r.hourly.reduce(
                (t,h)=>{
                    t.avg+=h.temp/r.hourly.length;
                    t.min=Math.min(t.min, h.temp);
                    t.max=Math.max(t.max, h.temp);
                    return t;
                },{avg: 0, min: r.hourly[0].temp, max: r.hourly[0].temp});
                tempStats.range=tempStats.max-tempStats.min;
                hourly.innerHTML=
                `<div class="limit min">Min:${tempStats.min.toFixed(0)}&deg;</div>
                <div class="limit max">Max:${tempStats.max.toFixed(0)}&deg;</div>`
            r.hourly.forEach(hour=>{
                let time=new Date(hour.dt * 1000).getHours();
                hourly.innerHTML+=
                `<div class="hour ${time==0?' daybreak':''}">
                    <div class="temp_time">${(time+11) % 12+1} ${time>11?'pm':'am'}</div>
                    <div class="temp_bar" style="height:${(hour.temp-tempStats.min)*100/tempStats.range}%;">${hour.temp.toFixed(0)}&deg;</div>
                </div>`
            });
            this.forecast.container.appendChild(hourly);
            hourly.addEventListener('mousedown',startScroll.bind(hourly));
            this.forecast.container.appendChild(daily);
            daily.addEventListener('mousedown',startScroll.bind(daily));
            this.stopSpinner();
        });
    }

    remove(e){
        e.stopPropagation();
        this.parent.deleteLocation(this.place.location);
        this.delete();
    }

    expand(){
        this.parent.toggleBox();
        this.container.classList.toggle("large");
        this.container.classList.toggle("small");        
    }

    buildIcon(date, sunrise, sunset,id){
        return '<i class="wi wi-owm-'+(date>=sunrise&&date<=sunset?'day':'night')+'-'+id+'"></i>';
    }
}

function startScroll(e) {
    let move=this;
    document.addEventListener('mousemove',moveHandler);
    document.addEventListener('mouseup',stopHandler);
    
    move.style.cursor = 'grabbing';
    move.style.userSelect = 'none';

    let left=move.scrollLeft;
    let x=e.clientX;

    function stopHandler(e){
        move.style.cursor = 'grab';
        move.style.removeProperty('user-select');
        document.removeEventListener('mousemove',moveHandler);
        document.removeEventListener('mouseup',stopHandler);
    }
    
    function moveHandler(e){
        move.scrollLeft=left+x-e.clientX;
    }
}