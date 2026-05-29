document.addEventListener("DOMContentLoaded", function () {

    const username = localStorage.getItem("username");

    if (username) {
        document.getElementById("username").innerText = username;
    }

    // -------- PROJECT DATA --------

    fetch("https://jira-khp3.onrender.com/projects")
        .then(res => {

            if (!res.ok) {
                throw new Error("HTTP " + res.status);
            }

            return res.json();
        })

        .then(projects => {

            console.log("Projects:", projects);

            let todo = 0, progress = 0, assigned = 0, completed = 0;

            projects.forEach(p => {

                if (p.status === "TODO") todo++;
                else if (p.status === "IN_PROGRESS") progress++;
                else if (p.status === "ASSIGNED") assigned++;
                else if (p.status === "COMPLETED") completed++;

            });

            // PROJECT STATUS CHART

            new Chart(document.getElementById("projectChart"), {
                type: "bar",
                data: {
                    labels: ["To Do", "In Progress", "Assigned", "Completed"],
                    datasets: [{
                        label: "Projects",
                        data: [todo, progress, assigned, completed],
                        backgroundColor: ["#00d4ff", "#36a2eb", "#ffcd56", "#4caf50"]
                    }]
                }
            });

            // PROJECTS PER TEAM

            let teamCount = {};

            projects.forEach(p => {

                let team = p.team || "No Team";

                if (!teamCount[team]) {
                    teamCount[team] = 0;
                }

                teamCount[team]++;
            });

            new Chart(document.getElementById("teamChart"), {
                type: "pie",
                data: {
                    labels: Object.keys(teamCount),
                    datasets: [{
                        data: Object.values(teamCount)
                    }]
                }
            });

        })

        .catch(err => {
            console.error("Projects fetch error:", err);
        });


    // -------- ISSUE DATA --------

    const projectId = localStorage.getItem("projectId");

    if (!projectId) {
        console.error("Project ID missing");
        return;
    }

    fetch("https://jira-khp3.onrender.com/issues/project/" + projectId)

        .then(res => {

            if (!res.ok) {
                throw new Error("HTTP " + res.status);
            }

            return res.json();
        })

        .then(issues => {

            console.log("Issues:", issues);

            let todo = 0, progress = 0, done = 0;

            issues.forEach(i => {

                if (i.status === "TODO") todo++;
                else if (i.status === "IN_PROGRESS") progress++;
                else if (i.status === "DONE") done++;

            });

            // ISSUE STATUS CHART

            new Chart(document.getElementById("issueChart"), {
                type: "doughnut",
                data: {
                    labels: ["To Do", "In Progress", "Done"],
                    datasets: [{
                        data: [todo, progress, done],
                        backgroundColor: ["#ff6384", "#36a2eb", "#4caf50"]
                    }]
                }
            });

            // ISSUES PER ASSIGNEE

            let assigneeCount = {};

            issues.forEach(i => {

                let name = i.assignee || "Unassigned";

                if (!assigneeCount[name]) {
                    assigneeCount[name] = 0;
                }

                assigneeCount[name]++;

            });

            new Chart(document.getElementById("assigneeChart"), {
                type: "bar",
                data: {
                    labels: Object.keys(assigneeCount),
                    datasets: [{
                        label: "Issues",
                        data: Object.values(assigneeCount),
                        backgroundColor: "#00d4ff"
                    }]
                }
            });

        })

        .catch(err => {
            console.error("Issues fetch error:", err);
        });

});