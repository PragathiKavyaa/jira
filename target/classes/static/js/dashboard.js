document.addEventListener("DOMContentLoaded", function () {

    const username = localStorage.getItem("username");

    const usernameEl = document.getElementById("username");

    if (username && usernameEl) {
        usernameEl.innerText = username;
    }

    loadNotifications(); // 🔔
    loadProjectTable();

});

let currentProjectId = null;

/* LOAD PROJECTS */

//fetch("http://localhost:8080/projects")

fetch("https://jira-khp3.onrender.com/projects")

    .then(response => response.json())
    .then(projects => {

        const container = document.getElementById("projectContainer");

        // ✅ FIX
        if (!container) {
            console.log("projectContainer not found");
            return;
        }

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

                // ✅ GO TO PROJECT PAGE
                window.location.href = "/project/project.html";

                console.log("Lead:", project.projectLead);

            };
            container.appendChild(card);
        });

    });


/* SHOW PROJECT */

function showProject(name, lead, team, status) {

    document.getElementById("pName").innerText = name;
    document.getElementById("pLead").innerText = lead || "Not Assigned";
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

function deleteProjectById(projectId) {

     const role = localStorage.getItem("role");

    if (!(role === "ADMIN" || role === "MANAGER" || role === "PROJECT_LEAD")) {
        alert("Access Denied: You cannot delete this project");
        return;
    }

    if (!confirm("Are you sure you want to delete this project?")) return;

    //fetch("http://localhost:8080/projects/" + projectId, {
    
    fetch(`https://jira-khp3.onrender.com/projects/${projectId}`,{

        method: "DELETE",
        headers: {
            "role": role
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            alert("Project deleted!");

            loadProjectTable(); // refresh table
        })
        .catch(err => {
            console.error(err);
            alert("Error deleting project");
        });
}

function logout() {
    localStorage.removeItem("username");
}

if (!localStorage.getItem("username")) {
    window.location.href = "/login.html";
}

function loadNotifications() {

    const email = localStorage.getItem("email");

    if (!email) return;

    fetch("https://jira-khp3.onrender.com/notifications/" + email)
    //fetch("http://localhost:8080/notifications/" + email)
        .then(res => res.json())
        .then(data => {

            const notifCountEl =
                document.getElementById("notifCount");

            if (notifCountEl) {
                notifCountEl.innerText = data.length;
            }

        })
        .catch(err =>
            console.error("Notification error:", err)
        );
}

function handleNotificationClick(notification) {
    console.log("CLICKED:", notification);

    // mark as read

    fetch(`https://jira-khp3.onrender.com/notifications/read/${notification.id}`, {

    //fetch(`http://localhost:8080/notifications/read/${notification.id}`, {
        method: "PUT"
    })
     .then(() => {
        loadNotifications(); // ✅ refresh badge count

    // navigation
    if (notification.type && notification.type.toUpperCase() === "PROJECT") {
        localStorage.setItem("projectId", notification.refId);
        window.location.href = "/project/project.html";
    }

    if (notification.type && notification.type.toUpperCase() === "ISSUE") {
        localStorage.setItem("issueId", notification.refId);
        window.location.href = "/project/project.html";
    }
});
}

function openNotificationsPage() {
    window.location.href = "/notifications.html";
}

function loadProjectTable() {

    

    fetch("https://jira-khp3.onrender.com/projects")

    //fetch("http://localhost:8080/projects")
        .then(res => res.json())
        .then(projects => {
            console.log("TABLE PROJECTS:", projects);
            const tbody = document.getElementById("projectTableBody");

            // ✅ SAFETY CHECK
            if (!tbody) {
                console.error("Table body not found!");
                return;
            }
            tbody.innerHTML = "";

            if (!projects || projects.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8">No projects found</td></tr>`;
                return;
            }

            projects.forEach(project => {

                const role = localStorage.getItem("role");

                let deleteBtn = "";

                let row = document.createElement("tr");


                if (role === "ADMIN" || role === "MANAGER" || role === "PROJECT_LEAD") {
                    deleteBtn = `
        <button class="delete-btn"
            onclick="deleteProjectById(${project.id})">
            Delete
        </button>
    `;
                }

                row.innerHTML = `
                    <td>${project.id}</td>
                    <td>${project.name}</td>
                    <td>${project.description || "-"}</td>
                    <td>${project.projectLead || "-"}</td>
                    <td>${project.team || "-"}</td>
                    <td>${project.status}</td>
                    <td>${project.stage || "-"}</td>
                    <td>${deleteBtn}</td>
                `;

                tbody.appendChild(row);
            });

        })
        .catch(err => console.error("Error loading projects:", err));
}