const express = require("express");
const oracledb = require("oracledb");
const cors = require("cors");
const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.PORT || 3000;

// Replace these values with your Oracle Database credentials
const dbConfig = {
    user: "",
    password: "",
    connectString: "artemis.vsnet.gmu.edu:1521/vse18c.vsnet.gmu.edu", // e.g., 'localhost:1521/your_service_name'
  };

const corsOptions = {origin: '*'};
app.use(cors(corsOptions));


app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.get("/", (req, res) => {
  res.send("Hello, Node.js!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post("/userLogin",async (req,res)=>{
    console.log("The username provided is: "+req.body["username"]);
    // 0 - customer 1 - manufacturer 2 - supplier 3 - shipper
    var distinguisherJSON = await getUserTypeInfo(req.body["username"]);
    res.send(distinguisherJSON)
});

app.post("/viewCustomerOrders", async (req,res)=>{
    var customerOrders = await getCustomerOrders(req.body["username"]);
    res.send(customerOrders)
})
async function getCustomerOrders(username){
    var resJson = {}
    try {
        // Establish a connection to the Oracle Database
        connection = await oracledb.getConnection(dbConfig);
        connectionEstablished = true;
        // 0 - customer 1 - manufacturer 2 - supplier 3 - shipper
        const sql = `select * from customerDemand where customer='${username}'`
        
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        resJson[`users`] = result.rows;
        // console.log("Res Json:")
        // console.log(resJson)
        // if(resJson["users"][0].length>0)
        return JSON.stringify(resJson);
      } 
      catch (err) {
        console.error("Error executing query:", err.message);
        return {"Error message: ": connectionEstablished? err.message +" Ensure the syntax is in right format." : "Not connected to VPN"};
      } 
      finally {
        // Release the connection
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error("Error closing connection:", err);
          }
        }
      }
}
async function getUserTypeInfo(username){
    var resJson = {}
    try {
        // Establish a connection to the Oracle Database
        connection = await oracledb.getConnection(dbConfig);
        connectionEstablished = true;
        // 0 - customer 1 - manufacturer 2 - supplier 3 - shipper
        const sql = `select customer as username, 0 as userType from customerDemand where customer = '${username}'
        union
        select manuf as username, 1 as userType from manufOrders where manuf = '${username}'
        union
        select supplier as username, 2 as userType from supplyOrders where supplier = '${username}'
        union
        select shipper as username, 3 as userType from shipOrders where shipper = '${username}'`
        
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        resJson[`users`] = result.rows;
        // console.log("Res Json:")
        // console.log(resJson)
        // if(resJson["users"][0].length>0)
        return JSON.stringify(resJson);
      } 
      catch (err) {
        console.error("Error executing query:", err.message);
        return {"Error message: ": connectionEstablished? err.message +" Ensure the syntax is in right format." : "Not connected to VPN"};
      } 
      finally {
        // Release the connection
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error("Error closing connection:", err);
          }
        }
      }
}

app.post("/orderShippingStatus",async (req,res)=>{
    var shippingAndOrdersData = await getOrderShippingRecords(req.body["username"])
    res.send(shippingAndOrdersData)
})

async function getOrderShippingRecords(username){
    console.log(username)
    var resJson = {}
    try {
        // Establish a connection to the Oracle Database
        connection = await oracledb.getConnection(dbConfig);
        connectionEstablished = true;
        // 0 - customer 1 - manufacturer 2 - supplier 3 - shipper
        const sql = `select t1.customer,t1.item,nvl(t2.suppliedQty,0) as suppliedQty,t1.demandQty from
        (
            select customer,item,sum(qty) as demandQty from customerDemand where customer = '${username}'
            group by customer,item
        )  t1
        left join
        (
            select recipient,item,sum(qty) as suppliedQty from shipOrders
            group by recipient,item
        ) t2
        on t1.customer=t2.recipient and t1.item=t2.item
        order by customer,item`
        
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        resJson[`ordersVsShipping`] = result.rows;
        // console.log("Res Json:")
        console.log(resJson)
        // if(resJson["users"][0].length>0)
        return JSON.stringify(resJson);
      } 
      catch (err) {
        console.error("Error executing query:", err.message);
        return {"Error message: ": connectionEstablished? err.message +" Ensure the syntax is in right format." : "Not connected to VPN"};
      } 
      finally {
        // Release the connection
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error("Error closing connection:", err);
          }
        }
      }
}
app.post("/viewManufacturerOrders",async (req,res)=>{
    var shippingAndOrdersData = await getManufOrderRecords(req.body["username"])
    res.send(shippingAndOrdersData)
})
async function getManufOrderRecords(username){
    // console.log(username)
    var resJson = {}
    try {
        // Establish a connection to the Oracle Database
        connection = await oracledb.getConnection(dbConfig);
        connectionEstablished = true;
        // 0 - customer 1 - manufacturer 2 - supplier 3 - shipper
        const sql = `select * from manufOrders where manuf='${username}'`
        
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        resJson[`manufOrders`] = result.rows;
        // console.log("Res Json:")
        // console.log(resJson)
        // if(resJson["users"][0].length>0)
        return JSON.stringify(resJson);
      } 
      catch (err) {
        console.error("Error executing query:", err.message);
        return {"Error message: ": connectionEstablished? err.message +" Ensure the syntax is in right format." : "Not connected to VPN"};
      } 
      finally {
        // Release the connection
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error("Error closing connection:", err);
          }
        }
      }
}

app.get("/getCustomerItems",async (req,res)=>{
    var itemsList = await runQueryAndReturn(`select item from items where item not in ('drawer','leg','table top','desk top')`)
    // console.log(itemsList);
    res.send(JSON.stringify({"items":itemsList}))
})
app.post("/placeOrder",async(req,res)=>{
    console.log(req.body["product"]+" "+req.body["qty"])
    var reqBody = req.body
    const username = reqBody["username"],product=reqBody["product"],qty=reqBody["qty"],manufacturer = reqBody["manufacturer"]
    const bindsForCustomerUpdateOrInsert = {
            username,
            product,
            qty
          };
    await runInsertUpdateQuery(req.body,`MERGE INTO customerDemand target
    USING (
        SELECT :username AS username, :product AS product, :qty AS qty FROM dual
    ) source
    ON (target.customer = source.username AND target.item = source.product)
    WHEN MATCHED THEN
        UPDATE SET target.qty = target.qty+source.qty
    WHEN NOT MATCHED THEN
        INSERT (customer, item, qty) VALUES (source.username, source.product, source.qty)`,bindsForCustomerUpdateOrInsert)
    const bindsForManufUpdateOrInsert = {
      manufacturer,
      product,
      qty
    };
    await runInsertUpdateQuery(req.body,`MERGE INTO manufOrders target
    USING (
        SELECT :manufacturer AS manufacturer, :product AS product, :qty AS qty FROM dual
    ) source
    ON (target.item= source.product and target.manuf= source.manufacturer)
    WHEN MATCHED THEN
        UPDATE SET target.qty = target.qty+source.qty
    WHEN NOT MATCHED THEN
        INSERT (item, manuf, qty) VALUES (source.product, source.manufacturer, source.qty)`,bindsForManufUpdateOrInsert)
    // await runInsertUpdateQuery(req.body,`update manufOrders set qty=qty+ :qty where item= :product and manuf= :manufacturer commit`)
    res.status(200).send('OK');
})
async function runInsertUpdateQuery(reqBody,sqlQuery,binds){
    console.log(reqBody)
    var resJson = {}
    try {
        // Establish a connection to the Oracle Database
        connection = await oracledb.getConnection(dbConfig);
        connectionEstablished = true;
        // 0 - customer 1 - manufacturer 2 - supplier 3 - shipper
        const sql = sqlQuery
        const result = await connection.execute(sql, binds, { autoCommit: true });

        console.log(result)
        return result.rows;
      } 
      catch (err) {
        console.error("Error executing query:", err.message);
        return {"Error message: ": connectionEstablished? err.message +" Ensure the syntax is in right format." : "Not connected to VPN"};
      } 
      finally {
        // Release the connection
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error("Error closing connection:", err);
          }
        }
      }
}
// returns rows that needs to be assigned to a key and stringyfied
async function runQueryAndReturn(sqlQuery){
    // console.log(username)
    var resJson = {}
    try {
        // Establish a connection to the Oracle Database
        connection = await oracledb.getConnection(dbConfig);
        connectionEstablished = true;
        // 0 - customer 1 - manufacturer 2 - supplier 3 - shipper
        const sql = sqlQuery
        
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return result.rows;
      } 
      catch (err) {
        console.error("Error executing query:", err.message);
        return {"Error message: ": connectionEstablished? err.message +" Ensure the syntax is in right format." : "Not connected to VPN"};
      } 
      finally {
        // Release the connection
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error("Error closing connection:", err);
          }
        }
      }
}

app.get("/getManufacturers",async (req,res)=>{
  var manufacturers = await runQueryAndReturn(`select entity from busentities where etype=1`)  
  // console.log(store)
  res.send(JSON.stringify({"manufacturers":manufacturers}))
})