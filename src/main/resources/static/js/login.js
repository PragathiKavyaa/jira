document.getElementById("loginForm").addEventListener("submit", function(e){

e.preventDefault(); // 🚫 stop page reload

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const role = document.getElementById("role").value;

fetch("https://jira-khp3.onrender.com/users/login",{ //for render

    //fetch("http://localhost:8080/users/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email:email,
password:password,
role:role
})

})
.then(res => {

if(!res.ok){
    return res.text().then(err => { 
            throw new Error(err);   // ✅ show real backend message
        });
}

return res.json();
})
.then(data => {

localStorage.setItem("username", data.name);
localStorage.setItem("email", data.email); 
localStorage.setItem("role", data.role);

window.location.href="/front.html"; // ✅ redirect works

})
.catch(error => {
alert(error.message);
console.error("Login error:", error);
});

});