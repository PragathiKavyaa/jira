document.getElementById("loginForm").addEventListener("submit", function(e){

e.preventDefault(); // 🚫 stop page reload

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

//fetch("http://localhost:8080/users/login",{

fetch("/users/login",{ //for render

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email:email,
password:password
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