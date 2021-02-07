function init(){
const links = [
    {label: "Week1 Notes", url: "week1/index.html"},
    {label: "Week2 Notes", url: "week2/index.html"},
    {label: "Week3 Notes", url: "week3/index.html"},
    {label: "Week4 Notes", url: "week4/index.html"},
    {label: "Week5 Notes", url: "week5/index.html"}
  ];

var contents=document.getElementById("Contents");
for (const link of links) {
    var row=document.createElement("li");
    row.innerHTML=`<a href="${link.url}">${link.label}</a>`;
    contents.appendChild(row);
}
}