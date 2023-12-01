function viewOrders() {
    window.location.href = "manufacturerOrders.html";
}

function viewOrdersShippingStatus(){
    // window.location.href = "customerOrdersShippingStatusView.html";
}

function redirectToLoginUI(){
    window.location.href = "index.html"
}

document.getElementById("welcomemsg").textContent = "Welcome "+localStorage.getItem("username")