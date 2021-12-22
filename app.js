const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    //Now, inside our data object, we have to provide all the key value pairs that Mailchimp is going to recognize.

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/9e59f4b14a"

    const options = {
        method: "POST",
        auth: "devendra:288c61ad82ab2ab97092238c8e909911-us20"
    };

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();



});

app.post("/failure", function (req, res) {
    res.redirect("/");
})
//process.env.PORT -->defined by heroku

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});


//API Key
//288c61ad82ab2ab97092238c8e909911-us20

//List ID
//9e59f4b14a