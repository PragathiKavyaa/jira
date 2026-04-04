window.onload = function() {
    document.getElementById("descriptionModal").classList.remove("show");
};

// ----------------------
// SHOW PROJECTS
// ----------------------

fetch("http://localhost:8080/projects")
.then(res => res.json())
.then(projects => {

const list = document.getElementById("todoList");

projects.forEach(p => {

const li = document.createElement("li");
li.innerText = p.name;

// When clicking project show description
li.onclick = function(){

    console.log("Clicked!");

document.getElementById("modalTitle").innerText = p.name;
document.getElementById("modalDescription").innerText = p.description;

document.getElementById("descriptionModal").classList.add("show");

};

list.appendChild(li);

});

});


// ----------------------
// SHOW ISSUES
// ----------------------

const projectId = localStorage.getItem("projectId");

fetch("http://localhost:8080/issues/project/" + projectId)
.then(res => res.json())
.then(issues => {

issues.forEach(issue => {

const li = document.createElement("li");
li.innerText = issue.title;

// Show issue description when clicked
li.onclick = function(){

    console.log("Clicked!");
document.getElementById("modalTitle").innerText = issue.title;
document.getElementById("modalDescription").innerText = issue.description;

document.getElementById("descriptionModal").classList.add("show");

};

if(issue.status === "TODO"){
document.getElementById("todoList2").appendChild(li);
}
else if(issue.status === "IN_PROGRESS"){
document.getElementById("progressList2").appendChild(li);
}
else{
document.getElementById("doneList2").appendChild(li);
}

});

});

function closeModal(){
document.getElementById("descriptionModal").classList.remove("show");
}