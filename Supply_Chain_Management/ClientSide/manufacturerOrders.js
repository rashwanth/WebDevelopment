function redirectToCustomerUI(){
    window.location.href = "manufacturer.html";
}
function getOrders() {
    fetch('http://localhost:3000/viewManufacturerOrders', {
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
            console.log('Response from the server:', data["manufOrders"])
            populateTable(data["manufOrders"]);
        })
        .catch(error => {
            console.error('Error:', error)
        })
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
        <td>${order["MANUF"]}</td>
        <td>${order["ITEM"]}</td>
        <td>${order["QTY"]}</td>
      `;
        ordersBody.appendChild(row);
    });
}

getOrders()