import Container from "./Container.js";

export default class List extends Container {
    //clear list and display items
    set data(ary){
        this.toDoList=ary;
        this.container.innerHTML='';
        ary.forEach(todo => {this.displayToDo(todo);});
        this.runfilter();
    }

    //return a copy of the data with no extra properties
    get data(){ 
        return this.toDoList.map(todo=>{
            return {id:todo.id, content:todo.content, completed:todo.completed};
        });
    }

    //set the current filtering function and update list display
    set state(f){
        this.filter=f;
        this.runfilter(this.filter);
    }

    //create and display an individual todo item
    displayToDo(todo){
        //todo item container
        todo.display=new Container(this,{classes:['listitem',todo.completed?'on':'ignore']});

        //complete task button
        todo.display.completeButton=new Container(todo.display,{
            classes:['button', 'toggle'],
            click:(()=>{
                todo.display.container.classList.toggle("on");
                todo.completed=!todo.completed;
                this.parent.parent.save();
                this.runfilter();
            })
        });

        //todo text
        todo.display.message=new Container(todo.display,{
            classes:['message'], text: todo.content
        });

        //delete button
        todo.display.deleteButton=new Container(todo.display,{
            classes:['button', 'delete'],
            click:(()=>{
                todo.display.delete();
                this.toDoList=this.toDoList.filter(e=>!(e===todo));
                this.runfilter();
                this.parent.parent.save();
            })
        });
    }

    //add a new todo item to the list
    addToDo(todo){
        this.toDoList.push(todo);
        this.displayToDo(todo);
        this.runfilter();
        this.parent.parent.save();
    }

    //update list when a button is clicked
    runfilter(){
        let f=this.filter||(()=>{return true;})
        this.toDoList.forEach((e) =>{
            if(f(e)) {
                e.display.container.classList.remove("hide");
            } else {
                e.display.container.classList.add("hide");
            }
        });
        this.parent.parent.statusMessage=this.toDoList.filter((e)=>{return !e.completed;}).length; 
    }
}