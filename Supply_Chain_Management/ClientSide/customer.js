function viewOrders() {
    window.location.href = "customerOrdersView.html";
}
function redirectToLoginUI(){
    window.location.href = "index.html";
}
function viewOrdersShippingStatus(){
    window.location.href = "customerOrdersShippingStatusView.html";
}

function redirectToCustomerOrder(){
    window.location.href = "customerPlaceOrder.html";
}

document.getElementById("welcomemsg").textContent = "Welcome "+localStorage.getItem("username")