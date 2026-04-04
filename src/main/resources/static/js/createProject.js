document.getElementById("projectForm").addEventListener("submit", function(e){

e.preventDefault();

const project = {
name: document.getElementById("name").value,
lead: document.getElementById("lead").value,
team: document.getElementById("team").value,
status: document.getElementById("status").value,
description: document.getElementById("description").value
};

fetch("http://localhost:8080/projects",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(project)
})
.then(res=>res.json())
.then(data=>{
alert("Project Created");
document.getElementById("projectForm").reset();
});

});