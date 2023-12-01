function addProducts(items) {
    var productDropdown = document.getElementById('product');
    for(var i=0;i<items.length;++i){
        // console.log("Here it is : "+i+" "+items[i][0])
        var option = document.createElement('option'); // Convert to lowercase and remove spaces
        option.text = items[i]["ITEM"];
        productDropdown.add(option);
    }
}
function getItems(){
    fetch('http://localhost:3000/getCustomerItems', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            // You can add other headers if needed
        }
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
            console.log('Response from the server:', data["items"][0]["ITEM"])
            addProducts(data["items"])
        })
        .catch(error => {
            console.error('Error:', error)
        })
    // addProduct();
}
function redirectToCustomerUI(){
    window.location.href = "customer.html";
}
function placeOrder(){
    fetch('http://localhost:3000/placeOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // You can add other headers if needed
        },
        body: JSON.stringify({"username":localStorage.getItem("username"),"product":document.getElementById('product').value,"qty":document.getElementById('quantity').value})
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
        })
        .catch(error => {
            console.error('Error:', error)
        })
    alert("Order placed!")
}
getItems()