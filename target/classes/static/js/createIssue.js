document.getElementById("issueForm").addEventListener("submit", function(e){

e.preventDefault();   // prevent page refresh

const projectId = localStorage.getItem("projectId");

const issueData = {
title: document.getElementById("title").value,
description: document.getElementById("issueDescription").value,
status: document.getElementById("issueStatus").value
};

fetch("http://localhost:8080/issues/" + projectId, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(issueData)
})
.then(res => res.json())
.then(data => {
alert("Issue created successfully");
})
.catch(err => console.log("Error:", err));

});