function loadList(){
    return JSON.parse(localStorage.getItem('todo'))||[];
}

function saveList(list){
    localStorage.setItem('todo',JSON.stringify(list));
}

export default {
saveList, loadList
}