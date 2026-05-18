document.getElementById("issueForm").addEventListener("submit", function(e){

e.preventDefault();   // prevent page refresh

const projectId = localStorage.getItem("projectId");

const issueData = {
title: document.getElementById("title").value,
description: document.getElementById("issueDescription").value,
status: document.getElementById("issueStatus").value,
assigner: document.getElementById("assigner").value,
assignee: document.getElementById("assignee").value,
startDate: document.getElementById("startDate").value,
endDate: document.getElementById("endDate").value
};

fetch("http://localhost:8080/issues/" + projectId, {
method: "POST",
headers: {
"Content-Type": "application/json",
"role": localStorage.getItem("role")
},
body: JSON.stringify(issueData)
})
.then(res => res.json())
.then(data => {
alert("Issue created successfully");
document.getElementById("issueForm").reset();

//loadIssues(projectId);   // refresh issue list
})
.catch(err => console.log("Error:", err));

});

document.addEventListener("DOMContentLoaded", function () {

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (username) {
        document.getElementById("username").innerText = username;
    }

    // 🚫 Restrict access
    if(role !== "ADMIN"){
        document.querySelectorAll(".create-section").forEach(sec => {
            sec.style.display = "none";
        });

        alert("Access Denied: Only Admin can create projects/issues");

        // optional redirect
        window.location.href = "/dashboard.html";
    }

});

function loadIssues(projectId){

fetch("http://localhost:8080/issues/project/" + projectId)
.then(res => res.json())
.then(data => {

document.getElementById("todoList2").innerHTML = "";
document.getElementById("progressList2").innerHTML = "";
document.getElementById("doneList2").innerHTML = "";

data.forEach(issue=>{

let li=document.createElement("li");

li.innerHTML=
"<b>"+issue.title+"</b><br>"+
"Status: "+issue.status+"<br>"+
"<button onclick=\"updateIssueStatus("+issue.id+",'TODO')\">TODO</button>"+
"<button onclick=\"updateIssueStatus("+issue.id+",'IN_PROGRESS')\">IN PROGRESS</button>"+
"<button onclick=\"updateIssueStatus("+issue.id+",'DONE')\">DONE</button>";

document.getElementById("issueList").appendChild(li);

});

});
}

function logout(){
localStorage.removeItem("username");
}

if(!localStorage.getItem("username")){
    window.location.href = "/login.html";
}