
//Load projects (same as dashboard)
let allProjects = [];
let allIssues = [];
let currentPage = 1;
const pageSize = 10;

function loadProjects() {

    fetch("http://localhost:8080/projects")
        .then(res => res.json())
        .then(projects => {

            const list = document.getElementById("projectList");
            list.innerHTML = "";

            allProjects = projects;   // store globally

            projects.forEach(project => {

                const li = document.createElement("li");
                li.innerText = project.name;

                // 👉 click project
                li.onclick = function () {
                    localStorage.setItem("projectId", project.id);

                    loadProjectDetails(project.id);
                    //loadIssues(project.id);
                    loadSubTasks(project.id);
                };

                list.appendChild(li);
            });
            renderProjects(projects);
        });

}
//Load selected project details
function loadProjectDetails(projectId) {

    const tbody = document.getElementById("issueTableBody");

    if (tbody) {
        tbody.innerHTML = "";
    }

    fetch("http://localhost:8080/projects/" + projectId)

        .then(async res => {

            console.log("PROJECT RESPONSE =", res);

            if (!res.ok) {
                throw new Error("Project not found");
            }

            const project = await res.json();

            return project;
        })

        .then(project => {

            console.log("PROJECT =", project);

            document.getElementById("projectName").innerText =
                project.name || "-";

            document.getElementById("description").innerText =
                project.description || "-";

            document.getElementById("lead").innerText =
                project.projectLead || "-";

            document.getElementById("team").innerText =
                project.team || "-";

            document.getElementById("projectStatus").innerText =
                project.status || "-";

            updateProgressBar(project.status);

            const dropdown =
                document.getElementById("stageDropdown");

            if (dropdown) {
                dropdown.value =
                    project.stage || "PLANNING";
            }

            loadIssues(projectId);
            loadTimeline(projectId);
            loadMembers(projectId);

        })

        .catch(err => {

            console.error("PROJECT LOAD ERROR =", err);

            alert("Unable to load project");
        });
}

function openProject(projectId) {

    if (!projectId) {
        alert("Invalid Project ID");
        return;
    }

    fetch("http://localhost:8080/projects/" + projectId)

        .then(res => {

            if (!res.ok) {
                throw new Error("Project not found");
            }

            localStorage.setItem("projectId", projectId);

            window.location.href =
                "/project/project.html?id=" + projectId;
        })

        .catch(() => {

            alert("Project no longer exists");
        });
}

function updateProjectStatus(status) {

    const projectId = localStorage.getItem("projectId");


    // ✅ instant UI update
    document.getElementById("projectStatus").innerText = status;
    updateProgressBar(status);

    fetch("http://localhost:8080/projects/" + projectId + "/status?status=" + status, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: status
        })
    })
        .then(() => {

            loadProjectDetails(projectId);

            // notify other pages
            localStorage.setItem("projectUpdated", new Date().getTime());

        });

}
// Load default project (when page opens)
document.addEventListener("DOMContentLoaded", function () {

    const username = localStorage.getItem("username");
    const projectId = localStorage.getItem("projectId");

    if (username) {
        document.getElementById("username").innerText = username;
    }

    loadProjects();

    if (projectId) {
        loadProjectDetails(projectId);
        //loadIssues(projectId);
        loadSubTasks(projectId);
    }
});

function loadIssues(projectId) {

    fetch("http://localhost:8080/issues/project/" + projectId)
        .then(res => res.json())
        .then(issues => {

            if (!issues) issues = [];

            // ✅ Sort newest first (assuming higher ID = newer)
            issues.sort((a, b) => b.id - a.id);

            allIssues = issues;
            currentPage = 1;

            renderIssueTable();
        })
        .catch(err => console.log("Issue load error:", err));
}

function renderIssueTable() {

    const tbody = document.getElementById("issueTableBody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    const pageData = allIssues.slice(start, end);

    if (pageData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No issues</td></tr>`;
        return;
    }

    pageData.forEach(issue => {

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${issue.title}</td>
            <td>${issue.description}</td>
            <td>${issue.assigner || "-"}</td>
            <td>${issue.assignee || "-"}</td>
            <td>${issue.status}</td>
            <td>${issue.startDate || "-"}</td>
            <td>${issue.endDate || "-"}</td>
            <td>
                <button onclick="updateIssueStatus(${issue.id}, 'TODO')">TODO</button>
                <button onclick="updateIssueStatus(${issue.id}, 'IN_PROGRESS')">IN PROGRESS</button>
                <button onclick="updateIssueStatus(${issue.id}, 'DONE')">DONE</button>
                <button class="edit-btn" onclick="editIssue(${issue.id})">Edit Dates</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    updatePaginationInfo();
}

function nextPage() {
    if ((currentPage * pageSize) < allIssues.length) {
        currentPage++;
        renderIssueTable();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderIssueTable();
    }
}

function updatePaginationInfo() {
    const totalPages = Math.ceil(allIssues.length / pageSize);
    document.getElementById("pageInfo").innerText =
        `Page ${currentPage} of ${totalPages}`;
}

function updateIssueStatus(issueId, status) {

    fetch("http://localhost:8080/issues/" + issueId + "/status?status=" + status, {
        method: "PUT"
    })
        .then(() => {

            const projectId = localStorage.getItem("projectId");

            loadIssues(projectId);

            // notify board page
            localStorage.setItem("issueUpdated", new Date().getTime());

        })
        .catch(err => console.error(err));
}

function loadSubTasks(projectId) {

    fetch("http://localhost:8080/subtasks/project/" + projectId)
        .then(res => res.json())
        .then(data => {

            const list = document.getElementById("subtaskList");
            list.innerHTML = "";

            data.forEach((task, index) => {

                let li = document.createElement("li");

                li.innerHTML =
                    "#" + (index + 1) + " " + task.title +
                    " [" + task.status + "] " +
                    "<button onclick='completeTask(" + task.id + ")'>Complete</button> " +
                    "<button onclick='deleteTask(" + task.id + ")'>Delete</button>";

                list.appendChild(li);
            });
        });
}

function addSubTask() {

    const title = document.getElementById("subtaskTitle").value;
    const projectId = localStorage.getItem("projectId");

    if (title.trim() == "") {
        alert("Enter subtask");
        return;
    }

    fetch("http://localhost:8080/subtasks", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            title: title,
            projectId: projectId

        })

    })
        .then(() => {

            document.getElementById("subtaskTitle").value = "";
            loadSubTasks(projectId);

        });

}

function deleteTask(id) {

    fetch("http://localhost:8080/subtasks/" + id, {
        method: "DELETE"
    })
        .then(() => {
            loadSubTasks(localStorage.getItem("projectId"));
        });

}

function completeTask(id) {

    fetch("http://localhost:8080/subtasks/" + id + "/complete", {
        method: "PUT"
    })
        .then(() => {
            loadSubTasks(localStorage.getItem("projectId"));
        });

}

function renderProjects(projects) {

    const list = document.getElementById("projectList");
    list.innerHTML = "";

    projects.forEach(project => {

        const li = document.createElement("li");
        li.innerHTML = `
            ${project.name}<br>
            <small class="stage-badge ${project.stage || ''}">
            ${project.stage || 'N/A'}
        </small>
        `;

        li.onclick = function () {
            localStorage.setItem("projectId", project.id);
            loadProjectDetails(project.id);
        };

        list.appendChild(li);
    });
}

function filterProjects() {

    const selected = document.getElementById("stageFilter").value;

    if (selected === "ALL") {
        renderProjects(allProjects);
    } else {
        const filtered = allProjects.filter(p => p.stage === selected);
        renderProjects(filtered);
    }
}

function updateStage(stage) {

    const projectId = localStorage.getItem("projectId");

    fetch("http://localhost:8080/projects/" + projectId + "/stage?stage=" + stage, {
        method: "PUT"
    })
        .then(() => {

            console.log("Stage updated");

            // 🔁 refresh project page
            loadProjectDetails(projectId);

            // 🔁 notify board page
            localStorage.setItem("projectUpdated", new Date().getTime());

        })
        .catch(err => console.error("Stage update error:", err));
}

function loadTimeline(projectId) {

    fetch("http://localhost:8080/issues/project/" + projectId)
        .then(res => res.json())
        .then(issues => {

            console.log("Timeline Issues:", issues); // ✅ DEBUG

            const timeline = document.getElementById("timeline");
            timeline.innerHTML = "";

            if (!issues || issues.length === 0) {
                timeline.innerHTML = "<p>No timeline data</p>";
                return;
            }

            const today = new Date();

            // ✅ Filter only active sprint issues
            const activeIssues = issues.filter(i => {
                if (!i.startDate || !i.endDate) return false;

                const start = new Date(i.startDate);
                const end = new Date(i.endDate);

                return start <= today && end >= today;
            });

            // 🚨 FIX: Handle empty dates
            if (activeIssues.length === 0) {
                timeline.innerHTML = "<p>No date data available for timeline</p>";
                return;
            }

            // ✅ Calculate timeline range
            let dates = [];

            activeIssues.forEach(i => {
                dates.push(new Date(i.startDate));
                dates.push(new Date(i.endDate));
            });

            let minDate = new Date(Math.min(...dates));
            let maxDate = new Date(Math.max(...dates));

            let totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
            if (totalDays === 0) totalDays = 1;

            activeIssues.forEach(issue => {

                //if (!issue.startDate || !issue.endDate) return;

                let start = new Date(issue.startDate);
                let end = new Date(issue.endDate);

                let offset = ((start - minDate) / (1000 * 60 * 60 * 24)) / totalDays * 100;
                let width = ((end - start) / (1000 * 60 * 60 * 24)) / totalDays * 100;

                let item = document.createElement("div");
                item.className = "timeline-item";
                item.style.position = "relative";
                item.style.height = "40px";

                item.innerHTML = `
                     <div class="timeline-title">${issue.title}</div>
                        <div class="timeline-bar" 
                        style="margin-left:${offset}%; width:${width}%;"></div>
                        <small>${issue.startDate} → ${issue.endDate}</small>
                `;

                timeline.appendChild(item);
            });

        });
}

function editIssue(issueId) {

    const startDate = prompt("Enter Start Date (YYYY-MM-DD):");
    const endDate = prompt("Enter End Date (YYYY-MM-DD):");

    if (!startDate || !endDate) {
        alert("Dates required!");
        return;
    }

    fetch("http://localhost:8080/issues/" + issueId + "/dates", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            startDate: startDate,
            endDate: endDate
        })
    })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                console.error("Backend error:", text); // 👈 THIS LINE
                throw new Error(text);
            }
            return res.text();
        })
        .then(() => {
            alert("Dates updated!");
            loadProjectDetails(localStorage.getItem("projectId"));
        })
        .catch(err => {
            console.error(err);
            alert("Error updating dates");
        });
}

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("projectIssueForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const projectId = localStorage.getItem("projectId");

        const issueData = {
            title: document.getElementById("p_title").value,
            description: document.getElementById("p_description").value,
            status: document.getElementById("p_status").value,
            assigner: document.getElementById("p_assigner").value,
            assignee: document.getElementById("p_assignee").value,
            assignerEmail: document.getElementById("p_assignerEmail").value,
            assigneeEmail: document.getElementById("p_assigneeEmail").value,
            startDate: document.getElementById("p_startDate").value,
            endDate: document.getElementById("p_endDate").value
        };

        fetch("http://localhost:8080/issues/" + projectId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "role": localStorage.getItem("role")   // ✅ FIX FOR 403
            },
            body: JSON.stringify(issueData)
        })
            .then(async res => {

                const text = await res.text();

                if (!res.ok) {
                    throw new Error(text);
                }

                return text;
            })
            .then(() => {

                alert("Issue Created!");

                // ✅ refresh project page
                loadIssues(projectId);
                loadTimeline(projectId);

                // ✅ notify board page
                localStorage.setItem("issueUpdated", new Date().getTime());

                form.reset();
            })
            .catch(err => {
                console.error("Error:", err);
                alert(err.message); // shows "Access Denied" properly
            });

    });

});

function loadMembers(projectId) {

    fetch("http://localhost:8080/members/project/" + projectId)
        .then(res => res.json())
        .then(members => {

            const teamDiv = document.getElementById("team");

            // ✅ if members exist → show new data
            if (members && members.length > 0) {

                let html = "";

                members.forEach(m => {
                    html += `&#128100; ${m.username} - <b>${m.role}</b><br>`;
                });

                teamDiv.innerHTML = html;
            }
            else {
                // 🔥 fallback to old project.team
                fetch("http://localhost:8080/projects/" + projectId)
                    .then(res => res.json())
                    .then(project => {
                        teamDiv.innerText = project.team || "No team data";
                    });
            }
        });
}

function updateProgressBar(status) {

    if (!status) return;

    status = status.toUpperCase(); // 🔥 normalize

    let percent = 0;

    if (status === "TODO") percent = 25;
    else if (status === "ASSIGNED") percent = 50;
    else if (status === "IN_PROGRESS") percent = 75;
    else if (status === "COMPLETED") percent = 100;

    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressText").innerText = percent + "% Completed";
}

