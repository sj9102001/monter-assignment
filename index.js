const express = require("express")

const app = express();

app.listen(8080, (req, res) => {
    console.log("Listening to requests on port 8080");
});