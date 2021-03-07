function init(){
const links = [
    {label: "Week1 Notes", url: "week1/index.html"},
    {label: "Week2 Notes", url: "week2/index.html"},
    {label: "Week3 Notes", url: "week3/index.html"},
    {label: "Week4 Notes", url: "week4/index.html"},
    {label: "Week5 Notes", url: "week5/index.html"},
    {label: "Week6 - Challenge 1", url: "challenge1/index.html"}
  ];

  const links2 = [
    {label: "Week7 Notes", url: "week7/index.html"},
    {label: "Week8 Notes", url: "week8/index.html"},
    {label: "Week9 Notes", url: "week9/index.html"}
  ];


var contents=document.getElementById("Contents");
var contents2=document.getElementById("Contents2");

for (const link of links) {
    var row=document.createElement("li");
    row.innerHTML=`<a href="${link.url}">${link.label}</a>`;
    contents.appendChild(row);
}
for (const link of links2) {
  var row=document.createElement("li");
  row.innerHTML=`<a href="${link.url}">${link.label}</a>`;
  contents2.appendChild(row);
}
}