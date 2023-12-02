function addProducts(items, obj, col_Name) {
    var productDropdown = obj//document.getElementById('product');
    for(var i=0;i<items.length;++i){
        // console.log("Here it is : "+i+" "+items[i][0])
        var option = document.createElement('option'); // Convert to lowercase and remove spaces
        option.text = items[i][col_Name];
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
            addProducts(data["items"],document.getElementById('product'),"ITEM")
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
        body: JSON.stringify({"username":localStorage.getItem("username"),"product":document.getElementById('product').value,"manufacturer":document.getElementById('manufacturer').value,"qty":document.getElementById('quantity').value})
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
function getManufacturers(){
    // console.log("In getmanuf")
    fetch('http://localhost:3000/getManufacturers', {
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
            console.log('Response from the server:', data)
            addProducts(data["manufacturers"],document.getElementById('manufacturer'),"ENTITY")
        })
        .catch(error => {
            console.error('Error:', error)
        })
}
getManufacturers()
getItems()