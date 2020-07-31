const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid meme type');
        if(isValid){
            error = null;
        }
        cb(error,'images');
    },
    filename: (req,file,cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null,name+'-'+Date.now()+'.'+ext);
    }
});

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

router.post('/posts',multer({storage:storage}).single('image'),async (req,res)=>{
    const url = req.protocol+'://'+req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url+'/images/'+req.file.filename
    });
    post.save().then(createdPost=>{
        res.status(201).json({
            message:'Added!',
            post:{
                _id:createdPost._id,
                title: createdPost.title,
                content:createdPost.content,
                imagePath:createdPost.imagePath
            }
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