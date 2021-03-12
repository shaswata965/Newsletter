const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/sign-up.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailAddress = req.body.emailAddress;

  const data = {
    members: [{
      email_address: emailAddress,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/b5f3f0b37f";
  const options = {
    method: "POST",
    auth: "shaswata1:a49a4e9755c4b691533ef2138057e201-us1"
  };
  const request = https.request(url, options, function(response) {
    const code =  response.statusCode;
    if(code===200){
        res.sendFile(__dirname + "/success.html");
    }
    else{
          res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })

  });
  app.post("/failure", function(req,res){
    res.sendFile(__dirname + "/sign-up.html");
  })

  request.write(jsonData);
  request.end();



});

app.listen(process.env.PORT, function() {
  console.log("Server is running on port 3000");
});

// list id :b5f3f0b37f
// apikey :a49a4e9755c4b691533ef2138057e201-us1
