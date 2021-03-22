function loadObject(key){
    return JSON.parse(localStorage.getItem(key))||[];
}

function saveObject(key,obj){
    localStorage.setItem(key,JSON.stringify(obj));
}

export default {
saveObject, loadObject
}