function createIssue(){

const title = document.getElementById("title").value;
const assignee = document.getElementById("assignee").value;
const status = document.getElementById("status").value;

fetch("http://localhost:8080/issues",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
title:title,
assignee:assignee,
status:status
})

})
.then(res => res.json())
.then(data => {

alert("Project Added Successfully");

window.location="dashboard.html";

});

}