console.log("hey demo1 listening");
var genurl = 'http://localhost:3000/generate'
var downloadurl = 'http://localhost:3000/download'
var data;

const headers = {
    'Content-Type': 'application/json',
    // Add any other headers if needed
  };

$('#genBtn').on('click',()=>{
    data = {val1 : $('#userInput').val()};
    // var qr_svg = qr.image($('#userInput').val());
    // qr_svg.pipe(fs.createWriteStream('myqr.png'));
    fetch(genurl,{method:'POST',headers: headers,body:JSON.stringify(data)})
    .then((response) => {
        if (!response.ok) 
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // console.log(response.body)
        // return "Ok"
        console.log("doneclient");
    })
    
})
$('#submitBtn').on('click',()=>{
    downloadImage('http://localhost:3000/myqr.png');
})

function downloadImage(url) {
    fetch(url, {
      mode : 'no-cors',
    })
      .then(response => response.blob())
      .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.download = url.replace(/^.*[\\\/]/, '');
      a.href = blobUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
  }