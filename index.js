const express = require("express");
const bodyParser = require("body-parser");
//const cors = require('cors');
const app = express();
const jsonParser = bodyParser.json();

let Routers = require('./Routes/routes.js')


let port = 16555;
//app.use(cors());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', Routers);

app.all("*", [require("./General/validateRequest")]);
app.listen(port, () => console.log(` app listening on port ${port}!`));

