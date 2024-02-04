
const express=require('express');
const { connection } = require("./db");

const {UserModel} = require('./model/user.models');
const Post = require('./model/post.models');

const app=express();
app.use(express.json());


app.post("/register",async (req, res) => {
    const { name, email} = req.body;
    try {
          const user = new UserModel({ name, email });
          await user.save();
          res.status(200).json({ msg: "new user has been register", user });
    } catch (err) {
      res.status(400).json({ err });
    }
  })



  app.post('/posts/:id', async (req, res) => {
    try {
        // Assuming you have some form of authentication to get the user ID
        const userId = req.params.id; // This should come from your authentication system

        // Check if the user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new post
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            user: userId // Assign the user ID to the post
        });

        // Save the post
        await newPost.save();

        // Update the user's posts array
        user.posts.push(newPost._id);
        await user.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/user/:userId/posts', async (req, res) => {
    try {
        // Assuming you have some form of authentication to get the user ID
        const userId = req.params.userId; // This should come from your authentication system

        // Check if the user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all posts of the user
        const userPosts = await Post.find({ user: userId });

        res.status(200).json(userPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




app.listen(4500,async()=>{
    try{
       await connection
       console.log("connected to db");
       console.log("Server is running at port 4500");
    }catch(err){
        console.log(err);
    }
    
})