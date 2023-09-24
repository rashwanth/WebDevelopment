import express from "express";
import fs from 'fs';
import qr from 'qr-image';

const app = express();
const port = 3000;

app.use(express.json())
app.use(express.static('/Users/sairaswanth/Desktop/WebDevPrac/3.1 Express Server'))
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

app.get("/",(req,res)=>{
  res.sendFile("http://localhost:3000/index.html");
})


app.post("/generate",(req,res)=>{
  // fs.writeFile('newFile',"Success",(err)=>{
  //   console.log("error");
  // });
  var qr_svg = qr.image(req.body.val1);
  qr_svg.pipe(fs.createWriteStream('myqr.png'));
  // console.log(req.body.val1)
  
  console.log('done Generating')
  // res.send(req.headers);
})

app.get("/download",(req,res)=>{
  res.download("myqr.png",(err)=>{
    if(err){
      console.log(err)
    }
    else console.log('done downloading')
  })
})