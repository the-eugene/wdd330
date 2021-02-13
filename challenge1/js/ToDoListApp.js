import Container from './Container.js';
import List from './List.js';
import ls from './ls.js';

export default class ToDoListApp extends Container{  
    constructor(parent){
        parent.container=parent; //because this is the top of the tree
        super(parent,{classes:['toDoList']});

        //build structure
        //Title
        this.header=new Container(this, {tag:'h2', text:'To Do List', classes:['toDoHeader']});

        //box with list and status bar
        this.body=new Container(this, {classes:['toDoBody']});

            //main todo container
        this.list=new List(this.body);

            //bar below todo list
        this.body.filters=new Container(this.body,{classes:['filter']});

                //status message
        this.message=new Container(this.body.filters,{classes:['message'],text:"No Tasks"});

                //buttons - All, Completed, Active
        this.buttons={          
            all: new Container(this.body.filters,{
                classes:['button','on'],
                text:"All",
                click: (()=>{
                    this.list.state=()=>{return true;};
                    this.setActive(this.buttons.all)
                }).bind(this)
            }),
            act: new Container(this.body.filters,{
                classes:['button'],
                text:"Active",
                click: (()=>{
                    this.list.state=(item)=>{return !item.completed;}
                    this.setActive(this.buttons.act);
                }).bind(this)
            }),
            cmp: new Container(this.body.filters,{
                classes:['button'],
                text:"Complete",
                 click:(()=>{
                    this.list.state=(item)=>{return item.completed;}
                    this.setActive(this.buttons.cmp);
                }).bind(this)
            })
        };
        //bar with input for new tasks and add task button
        this.footer=new Container(this,{classes:['toDoFooter']});
        this.taskinput=new Container(this.footer,{tag:"input"});
        this.taskinput.container.type="text";
        this.addbutton=new Container(this.footer,{classes:['button'], text:"Add", click:this.addTask.bind(this)});       
    }

    set title(t){this.header.text=t;}
    set statusMessage(tasks){
        this.message.text=`${tasks>0?tasks:"No"} remaining tasks`;
    }

    setActive(button){
        for (const b in this.buttons) this.buttons[b].container.classList.remove('on');
        button.container.classList.add('on');
    }

    save(){ls.saveList(this.list.data);}

    addTask(){
        let tText=this.taskinput.container.value;
        if(tText){
            this.list.addToDo({id:Date.now(), content:tText, completed:false});
            this.taskinput.container.value="";
        }
    }    
};