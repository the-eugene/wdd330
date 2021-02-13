class Container {
    constructor(parent, {tag='div', classes=['box'], text='', click=null}={}){
        this.parent=parent;
        this.container=document.createElement(tag);
        this.text=text;
        this.container.classList.add(...classes);
        this.parent.container.appendChild(this.container);
        this.container.onclick=click;
    }

    action(a){return parent.action(a);} //default to pass events up the tree
    set text(t){
        //prevent overwriting nodes
        if (this.container.childElementCount==0) this.container.innerText=t;
    }
    get text(){return this.container.innerText;}
}

class TodDoListApp extends Container{  
    constructor(parent){
        parent.container=parent; //because this is the top of the tree
        super(parent,{classes:['toDoList']});

        //build structure
        this.header=new Container(this, {tag:'h2', text:'To Do List', classes:['toDoHeader']});
        this.body=new Container(this, {classes:['toDoBody']});
        this.body.list=new Container(this.body);
        this.body.filters=new Container(this.body,{classes:['filter']});
        this.message=new Container(this.body.filters,{classes:['message'],text:"No Tasks"});
        this.buttons={
            all: new Container(this.body.filters,{classes:['button','on'],text:"All", click:showAll}),
            act: new Container(this.body.filters,{classes:['button'],text:"Active", click:showActive}),
            cmp: new Container(this.body.filters,{classes:['button'],text:"Complete", click:showComplete})
        };

        this.footer=new Container(this,{classes:['toDoFooter']});
        this.taskinput=new Container(this.footer,{tag:"input"});
        this.taskinput.container.type="text";
        this.addbutton=new Container(this.footer,{classes:['button'], text:"Add", click:addTask})
    }

    set title(t){this.header.text=t;}
    set statusMessage(m){this.message.text=m;}

    setActive(button){
        for (const b in this.buttons) this.buttons[b].container.classList.remove('on');
        button.container.classList.add('on');
    }
};

function showAll(){myToDoList.setActive(myToDoList.buttons.all);}
function showActive(){myToDoList.setActive(myToDoList.buttons.act);}
function showComplete(){myToDoList.setActive(myToDoList.buttons.cmp);}

function addTask(){
    let tText=myToDoList.taskinput.container.value;
    if(tText){
        toDoList.push(new Task(tTask));
        myToDoListApp.update();
        localStorage.setItem('todo',JSON.stringify(toDoList));
    }
}


var toDoList=JSON.parse(localStorage.getItem('todo'))||[];

function init(){
    myToDoListApp=new TodDoListApp(document.getElementById("main"));

    myToDoListApp.title="ToDos";
};