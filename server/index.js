const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const postsRoutes = require('./routes/posts');

mongoose.connect('mongodb://mongo:27017/test_db',{
    user:'test_user',
    pass:'test_user',    
    useNewUrlParser: true}).then(() => {
    console.log('successfully connected to the database');
}).catch(err => {
    console.log(err);
    process.exit();
});

app.use(cors());
app.use(bodyParser.json());
app.use(postsRoutes);
app.use('/images',express.static(path.join("/images")));
app.listen(5000,err=>{
    console.log("listening on port 5000");
});