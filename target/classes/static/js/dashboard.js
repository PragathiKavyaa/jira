let currentProjectId = null;

/* LOAD PROJECTS */

fetch("http://localhost:8080/projects")
    .then(response => response.json())
    .then(projects => {

        const container = document.getElementById("projectContainer");
        container.innerHTML = "";

        projects.forEach(project => {

            const card = document.createElement("div");
            card.className = "project-card";

            card.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        `;

            card.onclick = () => {

                currentProjectId = project.id;

                /* store project for board page */
                localStorage.setItem("projectId", project.id);
                localStorage.setItem("projectName", project.name);

                /* show modal */
                showProject(
                    project.name,
                    project.lead,
                    project.team,
                    project.status
                );

            };

            container.appendChild(card);

        });

    });


/* SHOW PROJECT */

function showProject(name, lead, team, status) {

    document.getElementById("pName").innerText = name;
    document.getElementById("pLead").innerText = lead;
    document.getElementById("pTeam").innerText = team;
    document.getElementById("pStatus").innerText = status;

    document.getElementById("projectModal").style.display = "block";
}


/* CLOSE MODAL */

function closeModal() {
    document.getElementById("projectModal").style.display = "none";
}


/* CHANGE STATUS */

function changeStatus() {

    let statusElement = document.getElementById("pStatus");

    if (statusElement.innerText === "Active") {
        statusElement.innerText = "Completed";
    } else {
        statusElement.innerText = "Active";
    }

}


/* DELETE PROJECT */

function deleteProject() {

    if (!confirm("Are you sure you want to delete this project?")) {
        return;
    }

    fetch(`http://localhost:8080/projects/${currentProjectId}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                alert("Project deleted successfully");
                location.reload();   // refresh dashboard
            } else {
                alert("Delete failed");
            }
        });

}

