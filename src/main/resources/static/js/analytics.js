document.addEventListener("DOMContentLoaded", function(){

const username = localStorage.getItem("username");

if(username){
document.getElementById("username").innerText = username;
}

});

// ---------------- PROJECT STATUS CHART ----------------

fetch("http://localhost:8080/projects")
.then(res=>res.json())
.then(projects=>{

let todo=0, progress=0, assigned=0, completed=0;

projects.forEach(p=>{

if(p.status==="TODO") todo++;
else if(p.status==="IN_PROGRESS") progress++;
else if(p.status==="ASSIGNED") assigned++;
else if(p.status==="COMPLETED") completed++;

});

new Chart(document.getElementById("projectChart"),{
type:"bar",
data:{
labels:["To Do","In Progress","Assigned","Completed"],
datasets:[{
label:"Projects",
data:[todo,progress,assigned,completed],
backgroundColor:["#00d4ff","#36a2eb","#ffcd56","#4caf50"]
}]
},
options:{
plugins:{
legend:{
labels:{ color:"#172B4D" }
}
},
scales:{
x:{ ticks:{ color:"#172B4D" } },
y:{ ticks:{ color:"#DFE1E6"  } }
}
}
});


// -------- PROJECTS PER TEAM --------

let teamCount={};

projects.forEach(p=>{

if(!teamCount[p.team]){
teamCount[p.team]=0;
}

teamCount[p.team]++;

});

new Chart(document.getElementById("teamChart"),{
type:"pie",
data:{
labels:Object.keys(teamCount),
datasets:[{
data:Object.values(teamCount)
}]
},
options:{
plugins:{
legend:{
labels:{ color:"#172B4D" }
}
},
scales:{
x:{
ticks:{ color:"#172B4D" },
grid:{ color:"#DFE1E6" }
},
y:{
ticks:{ color:"#172B4D" },
grid:{ color:"#DFE1E6" }
}
}
}
});

});


// ---------------- ISSUE DATA ----------------

const projectId = localStorage.getItem("projectId");

fetch("http://localhost:8080/issues/project/"+projectId)
.then(res=>res.json())
.then(issues=>{

let todo=0, progress=0, done=0;

issues.forEach(i=>{

if(i.status==="TODO") todo++;
else if(i.status==="IN_PROGRESS") progress++;
else if(i.status==="DONE") done++;

});

new Chart(document.getElementById("issueChart"),{
type:"doughnut",
data:{
labels:["To Do","In Progress","Done"],
datasets:[{
data:[todo,progress,done],
backgroundColor:["#ff6384","#36a2eb","#4caf50"]
}]
},
options:{
plugins:{
legend:{
labels:{ color:"#172B4D"}
}
}
}
});


// -------- ISSUES PER ASSIGNEE --------

let assigneeCount={};

issues.forEach(i=>{

let name = i.assignee || "Unassigned";

if(!assigneeCount[name]){
assigneeCount[name]=0;
}

assigneeCount[name]++;

});

new Chart(document.getElementById("assigneeChart"),{
type:"bar",
data:{
labels:Object.keys(assigneeCount),
datasets:[{
label:"Issues",
data:Object.values(assigneeCount),
backgroundColor:"#00d4ff"
}]
},
options:{
plugins:{
legend:{
labels:{ color:"#172B4D" }
}
},
scales:{
x:{ ticks:{ color:"#172B4D" } },
y:{ ticks:{ color:"#DFE1E6" } }
}
}
});

});