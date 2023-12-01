function login(){
    console.log(document.getElementById("username").value)
    // hit the db and get the response if it is a customer or manufacturer or supplier or shipper
    fetch('http://localhost:3000/userLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // You can add other headers if needed
        },
        body: JSON.stringify({"username":document.getElementById('username').value})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            console.log("Success. In response");
            return response.json();
            // return response.json() // assuming the response is in JSON format
        })
        .then(data => {
            console.log("Success. In post response");
            console.log('Response from the server:', data)
            if(Object.keys(data).length>0 && data["users"].length>0){
                console.log("User is a valid user");
                localStorage.setItem("username", data["users"][0]["USERNAME"]);
                console.log("Local storage op: "+localStorage.getItem("username"))
                redirectToCorrespondingPage(data["users"]);
            }
            else{
                console.log("New user");
                alert("Not found in the DB. Please do sign up!")
            }

        })
        .catch(error => {
            console.error('Error:', error)
        })
}

function redirectToSignUp(){
    redirectToCorrespondingPage([{"USERTYPE":99}]);
}

function redirectToCorrespondingPage(userInfo){
    console.log(userInfo[0])
    var redirectURL = "";
    window.location.href = "";
    switch(userInfo[0]["USERTYPE"]){
        // 0 - customer 1 - manufacturer 2 - supplier 3 - shipper
        case 0:
            redirectURL = "customer.html"
            break;
        case 1:
            redirectURL = "manufacturer.html"
            break;
        case 2:
            redirectURL = "supplier.html"
            break;
        case 3:
            redirectURL = "shipper.html"
            break;
        default:
            redirectURL = "signup.html"
            break;
    }
    window.location.href = redirectURL;
}