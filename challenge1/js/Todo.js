import ToDoListApp from './ToDoListApp.js';
import utils from './utils.js';
import ls from './ls.js';


var myToDoListApp=new ToDoListApp(document.getElementById("main"));
    myToDoListApp.title="Todos";
    myToDoListApp.list.data=ls.loadList();