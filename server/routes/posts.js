const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/posts',async (req,res)=>{
    Post.find().then(documents=>{
        console.log(documents);
        res.send(documents);
    });
});

router.get("/posts/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    });
  });

router.post('/posts',async (req,res)=>{
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

router.delete('/posts/:id',(req,res)=>{
    Post.deleteOne({_id:req.params.id}).then(result=>{
        console.log(result);
    })
    res.status(200).json({message:'Post deleted'});
});

router.put('/posts/:id',(req,res)=>{
    const post = new Post({
        _id:req.body._id,
        title: req.body.title,
        content: req.body.content
    })
    Post.updateOne({_id:req.params.id},post).then(result=>{
        console.log(result);
        res.status(200).json({message:'Update OK'});
    });
});

module.exports = router;