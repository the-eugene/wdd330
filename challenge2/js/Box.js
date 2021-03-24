import Container from './Container.js';
import {getCurrentWeather, getOneCall} from './OpenWeather.js';

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
        getOneCall(location).then(r=>{
            console.log(r);
            let current=r.current;
            this.weather.container.innerHTML=`<div class="conditions">${current.weather[0].main}</div>
            <div class="icon">${this.buildIcon(r.dt,r.sunrise,r.sunset,current.weather[0].id)}</div>
            <div class="temperature">${current.temp.toFixed(0)}&deg;</div>
            <div class="other">
                Feels Like: ${current.feels_like.toFixed(0)}&deg;<br>
                Humidity: ${current.humidity}%
            </div>`;
            
            let daily = document.createElement('div');
            daily.classList.add('daily');
            this.forecast.container.innerHTML=this.weather.container.innerHTML;
            this.forecast.container.appendChild(daily);
            daily.addEventListener('mousedown',startScroll.bind(daily));
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