function signup(){

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

fetch("http://localhost:8080/users/signup",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name:name,
email:email,
password:password
})

})
.then(res=>res.json())
.then(data=>{
alert("User Registered Successfully");
window.location="login.html";
})

}

