const express = require('express');

const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Post = require('./models/post');
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

app.get('/posts',async (req,res)=>{
    Post.find().then(documents=>{
        console.log(documents);
        res.send(documents);
    });
});

app.post('/posts',async (req,res)=>{
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost=>{
        res.status(201).json({
            message:'Added!',
            postId:createdPost._id
        })
    });
    console.log(post);
});

app.delete('/posts/:id',(req,res)=>{
    Post.deleteOne({_id:req.params.id}).then(result=>{
        console.log(result);
    })
    res.status(200).json({message:'Post deleted'});
})

app.listen(5000,err=>{
    console.log("listening on port 5000");
});