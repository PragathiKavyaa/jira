console.log("notifications.js loaded");

window.addEventListener("DOMContentLoaded", loadNotifications);

function loadNotifications() {

    const email = localStorage.getItem("email");

    const tbody = document.getElementById(
        "notificationTableBody"
    );
    if (!tbody) {
        console.error("Table body not found");
        return;
    }

    const role = localStorage.getItem("role");

    let url = "";
    if (role === "ADMIN" || role === "MANAGER") {

        // ✅ send role parameter
        url = "http://localhost:8080/notifications/all?role=" + role;

    } else {

        url = "http://localhost:8080/notifications/user/" + email;
    }

    fetch(url)

        .then(res => res.json())

        .then(data => {

            console.log("NOTIFICATIONS:", data);

            if (role === "ADMIN" || role === "MANAGER") {

                data = data.filter(n =>
                    !n.message?.startsWith("You are assigned to project")
                );
            }

            tbody.innerHTML = "";

            if (!data || data.length === 0) {

                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            No Notifications Found
                        </td>
                    </tr>
                `;

                return;
            }
            data.forEach(n => {
                const statusClass =
                    n.status === "ACCEPTED"
                        ? "accepted"
                        : n.status === "REJECTED"
                            ? "rejected"
                            : "pending";

                let buttons = `
                    <button class="open-btn"
                        onclick="openProject(${n.refId}, ${n.id})">
                        Open
                    </button>
                `;

                if (n.status === "PENDING" || n.status == null) {

                    buttons += `
                        <button class="accept-btn"
                            onclick="acceptNotification(${n.id})">
                            Accept
                        </button>   

                        <button class="reject-btn"
                            onclick="rejectNotification(${n.id})">
                            Reject
                        </button>
                    `;
                }

                tbody.innerHTML += `

                    <tr>

                        <td>
                            ${n.projectTitle || "MiniJira Project"}
                        </td>

                        <td>
                            ${n.message || "-"}
                        </td>

                        <td>
    <div class="assigner">

        <span class="assigner-name">
            ${n.senderName || "Project Manager"}
        </span>

        <span class="assigner-email">
            ${n.senderEmail || "-"}
        </span>

    </div>
</td>
                        <td>
                            <span class="status ${statusClass}">
                                ${n.status || "PENDING"}
                            </span>
                        </td>

                        <td>
    <span class="stage">
        ${n.stage || "IN_PROGRESS"}
    </span>
</td>
                        <td>
                            <div class="action-buttons">
                                ${buttons}
                            </div>
                        </td>

                    </tr>
                `;
            });

        })
        .catch(err => {
            console.error("Notification Error:", err);
        });
}

function acceptNotification(id) {

    fetch("http://localhost:8080/notifications/accept/" + id, {
        method: "PUT"
    })
        .then(res => {

            if (!res.ok) {
                throw new Error("Failed to accept notification");
            }

            return res.text();
        })
        .then(() => {

            alert("Notification Accepted");

            loadNotifications();

        })
        .catch(err => {
            console.error(err);
        });
}

function rejectNotification(id) {

    fetch("http://localhost:8080/notifications/reject/" + id, {
        method: "PUT"
    })
        .then(res => {

            if (!res.ok) {
                throw new Error("Failed to reject notification");
            }

            return res.text();
        })
        .then(() => {

            alert("Notification Rejected");

            loadNotifications();

        })
        .catch(err => {
            console.error(err);
        });
}


function openProject(projectId, notificationId) {

    fetch("http://localhost:8080/notifications/read/" + notificationId, {
        method: "PUT"
    })
        .then(() => {

            localStorage.setItem("projectId", projectId);

            window.location.href = "/project/project.html";
        })
        .catch(err => console.error(err));
}