// ✅ PAGE LOAD (SEPARATE)
document.addEventListener("DOMContentLoaded", function () {

    const username = localStorage.getItem("username");
    const role = (localStorage.getItem("role") || "").toUpperCase();

    if (username) {
        document.getElementById("username").innerText = username;
    }
    
    const allowedRoles = ["ADMIN", "MANAGER", "PROJECT_LEAD"];

    if (!allowedRoles.includes(role)) {
        document.querySelectorAll(".create-section").forEach(sec => {
            sec.style.display = "none";
        });

        alert("Access Denied: Only Admin, Manager, or Project Lead can create projects/issues");
        window.location.href = "/dashboard.html";
    }

}); // ✅ CLOSE DOMCONTENTLOADED

function addMember() {
    const div = document.createElement("div");
    div.className = "member";

    div.innerHTML = `
        <input type="text" placeholder="Username" class="m_username">
        <input type="email" placeholder="Email" class="m_email">
        <select class="m_role">
            <option>Developer</option>
            <option>Tester</option>
            <option>Manager</option>
        </select>

        <button type="button" class="delete-btn"
            onclick="removeMember(this)">
            Delete
        </button>
    `;

    document.getElementById("teamContainer").appendChild(div);
}

function removeMember(button) {
    button.parentElement.remove();
}

document.getElementById("projectForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const members = [];

    document.querySelectorAll(".member").forEach(m => {

        const username = m.querySelector(".m_username").value.trim();
        const email = m.querySelector(".m_email").value.trim();
        const role = m.querySelector(".m_role").value;

        // ✅ avoid empty rows
        if (username !== "") {

            members.push({
                username: username,
                email: email,
                role: role
            });
        }
    });

    // ✅ convert usernames into team string
    const teamNames = members
        .map(member => member.username)
        .join(", ");

   // ✅ get selected project lead
const projectLead = document.getElementById("projectLead").value;

// ✅ find project lead email from members list
const leadMember = members.find(
    m => m.username === projectLead
);

const project = {

    name: document.getElementById("name").value,

    projectLead: projectLead,

    status: document.getElementById("status").value,

    stage: document.getElementById("stage").value,

    description: document.getElementById("description").value,

    // ✅ save project lead email as senderEmail
    senderEmail: leadMember ? leadMember.email : "",

    team: teamNames,

    members: members
};

    // ✅ DEBUG
    console.log("PROJECT PAYLOAD:", project);

    fetch("http://localhost:8080/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "role": localStorage.getItem("role")
        },
        body: JSON.stringify(project)
    })
    .then(res => {
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(text);
            });
        }
        return res.json();
    })
    .then(data => {

        console.log("SAVED PROJECT:", data);

        alert("Project Created");

        document.getElementById("projectForm").reset();
        document.getElementById("teamContainer").innerHTML = "";
    })
    .catch(err => {
        console.error(err);
        alert(err.message);
    });

});