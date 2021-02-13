export default class Container {
    constructor(parent, {tag='div', classes=['box'], text='', click=null}={}){
        this.parent=parent;
        this.container=document.createElement(tag);
        this.text=text;
        this.container.classList.add(...classes);
        this.parent.container.appendChild(this.container);
        this.container.onclick=click;
    }

    set text(t){
        //prevent overwriting nodes
        if (this.container.childElementCount==0) this.container.innerText=t;
    }
    get text(){return this.container.innerText;}

    delete(){
        this.parent.container.removeChild(this.container);
    }
}