function login(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

fetch("http://localhost:8080/users/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email:email,
password:password
})

})
.then(res => res.text())
.then(data => {

if(data === "Login Success"){

alert("Login Successful");
window.location="dashboard.html";

}else{

alert("Invalid Credentials");

}

});

}