let selectedIssueId = null;
let selectedProjectId = null;

document.addEventListener("DOMContentLoaded", function () {

    const username = localStorage.getItem("username");
    const projectId = localStorage.getItem("projectId");

    if (username) {
        document.getElementById("username").innerText = username;
    }

    loadBoardIssues();

});

// window.onload = function() {
//     document.getElementById("descriptionModal").classList.remove("show");
// };

// ----------------------
// SHOW PROJECTS
// ----------------------

fetch("http://localhost:8080/projects")
.then(res => res.json())
.then(projects => {

//const list = document.getElementById("todoList");

projects.forEach(p => {

const li = document.createElement("li");

li.innerHTML =
"<b>" + p.name + "</b><br>" +
"Status: " + p.status + "<br><br>" +
"Stage: <span class='stage-badge'>" + (p.stage || "N/A") + "</span>";
li.id = "project-" + p.id;

// When clicking project show description
li.onclick = function(){

localStorage.setItem("projectId", p.id);
localStorage.setItem("projectName", p.name);

openProject(p);

};

if(p.status === "TODO" || p.status === "Active"){
document.getElementById("todoList").appendChild(li);
}

else if(p.status === "IN_PROGRESS"){
document.getElementById("progressList").appendChild(li);
}

else if(p.status === "ASSIGNED"){
document.getElementById("assignedList").appendChild(li);
}

else if(p.status === "COMPLETED"){
document.getElementById("completedList").appendChild(li);
}

});

});

function moveProject(status){

if(!selectedProjectId) return;

const project = document.getElementById("project-" + selectedProjectId);

if(status === "TODO"){
document.getElementById("todoList").appendChild(project);
}

else if(status === "IN_PROGRESS"){
document.getElementById("progressList").appendChild(project);
}

else if(status === "ASSIGNED"){
document.getElementById("assignedList").appendChild(project);
}

else if(status === "COMPLETED"){
document.getElementById("completedList").appendChild(project);
}

/* update backend */

fetch("http://localhost:8080/projects/" + selectedProjectId + "/status?status=" + status,{
method:"PUT"
})
.then(()=>{

// notify other pages (project page)
localStorage.setItem("projectUpdated", new Date().getTime());

});

closeModal();

}

window.addEventListener("storage", function(event){

if(event.key === "deletedProjectId"){

const deletedId = event.newValue;

const project = document.getElementById("project-" + deletedId);

if(project){
project.remove();
}

}

});


// ----------------------
// SHOW ISSUES
// ----------------------

function moveIssue(status){

if(!selectedIssueId) return;

const issue = document.getElementById("issue-" + selectedIssueId);

if(!issue) return;

if(status === "TODO"){
document.getElementById("todoList2").appendChild(issue);
}

else if(status === "IN_PROGRESS"){
document.getElementById("progressList2").appendChild(issue);
}

else if(status === "DONE"){
document.getElementById("doneList2").appendChild(issue);
}

/* update backend */

fetch("http://localhost:8080/issues/" + selectedIssueId + "/status?status=" + status,{
method:"PUT"
});

closeModal();
}

window.addEventListener("storage", function(event){

if(event.key === "issueUpdated"){

console.log("Issue updated, refreshing board...");

loadBoardIssues(localStorage.getItem("projectId"));

}

});

window.addEventListener("storage", function(event){

if(event.key === "projectUpdated"){

console.log("Project status updated, refreshing board...");

// reload projects from backend
location.reload();

}

});

function loadBoardIssues(){

const projectId = localStorage.getItem("projectId");

fetch("http://localhost:8080/issues")
.then(res=>res.json())
.then(data=>{

    console.log(data);

document.getElementById("todoList2").innerHTML="";
document.getElementById("progressList2").innerHTML="";
document.getElementById("doneList2").innerHTML="";

data.forEach(issue=>{

let li=document.createElement("li");
li.innerHTML = `
<b>${issue.title}</b><br>
<small>Assignee: ${issue.assignee || "Not Assigned"}</small><br>
<small>Assigned by: ${issue.assigner || "Admin"}</small>
`;

li.id = "issue-" + issue.id;

li.onclick = function(){

selectedIssueId = issue.id;

document.getElementById("issuemodalTitle").innerText = issue.title;
document.getElementById("issuemodalDescription").innerText = issue.description;

document.getElementById("descriptionModal2").classList.add("show");

};

if(issue.status=="TODO"){
document.getElementById("todoList2").appendChild(li);
}

else if(issue.status=="IN_PROGRESS"){
document.getElementById("progressList2").appendChild(li);
}

else if(issue.status=="DONE"){
document.getElementById("doneList2").appendChild(li);
}

});

});
}

function closeModal(){
document.getElementById("descriptionModal2").classList.remove("show");
}

function logout(){
localStorage.removeItem("username");
}

if(!localStorage.getItem("username")){
    window.location.href = "/login.html";
}

function openProject(project){

localStorage.setItem("projectId", project.id);

window.location.href = "/project/project.html";

}

function updateStage(projectId, stage){

fetch("http://localhost:8080/projects/" + projectId + "/stage?stage=" + stage, {
    method: "PUT"
})
.then(() => {
    console.log("Stage updated");

    // optional refresh
    localStorage.setItem("projectUpdated", new Date().getTime());
});
}
