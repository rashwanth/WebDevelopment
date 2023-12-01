function redirectToCustomerUI(){
    window.location.href = "customer.html";
}

// Function to dynamically add rows to the table
function populateTable(jsonData) {
    const ordersBody = document.getElementById('ordersBody');

    // Clear existing content
    ordersBody.innerHTML = '';

    // Loop through the JSON data and add rows
    jsonData.forEach(order => {
        console.log(order)
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${order["CUSTOMER"]}</td>
        <td>${order["ITEM"]}</td>
        <td>${order["DEMANDQTY"]}</td>
        <td>${order["SUPPLIEDQTY"]}</td>
      `;
        ordersBody.appendChild(row);
    });
}
function getOrdersShippingData() {
    fetch('http://localhost:3000/orderShippingStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // You can add other headers if needed
        },
        body: JSON.stringify({ "username": localStorage.getItem("username") })
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
            populateTable(data["ordersVsShipping"]);
        })
        .catch(error => {
            console.error('Error:', error)
        })
}
getOrdersShippingData();