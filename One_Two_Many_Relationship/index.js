
const express=require('express');
const { connection } = require("./db");
const swaggerJsDoc=require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');
const {UserModel} = require('./model/user.models');
const Post = require('./model/post.models');

const app=express();
app.use(express.json());


const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"User Management System",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http://localhost:4500"
            }
        ]
    },
    apis: ["./index.js"]
}

const openApiSpec=swaggerJsDoc(options);
app.use('/apidocs',swaggerUi.serve,swaggerUi.setup(openApiSpec));


/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The post title
 *           required: true
 *         content:
 *           type: string
 *           description: The post content
 *           required: true
 *         user:
 *           type: string
 *           description: The user ID who created the post
 *           format: uuid
 *           required: true
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The user name
 *           required: true
 *         email:
 *           type: string
 *           description: The user email
 *           required: true
 *         posts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Post'
 *
 *
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email
 *             required:
 *               - name
 *               - email
 *     responses:
 *       '200':
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: A success message
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *       '400':
 *         description: Bad Request - Unable to register user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   description: Error message details
 */



/**
 * @swagger
 * /posts/{id}:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The post title
 *               content:
 *                 type: string
 *                 description: The post content
 *             required:
 *               - title
 *               - content
 *     responses:
 *       '201':
 *         description: Post successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The auto-generated id of the post
 *                 title:
 *                   type: string
 *                   description: The post title
 *                 content:
 *                   type: string
 *                   description: The post content
 *                 user:
 *                   type: string
 *                   description: The user ID who created the post
 *       '400':
 *         description: Bad Request - Unable to create post
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message details"
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 *
 * /user/{userId}/posts:
 *   get:
 *     summary: Get all posts of a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved user posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The auto-generated id of the post
 *                   title:
 *                     type: string
 *                     description: The post title
 *                   content:
 *                     type: string
 *                     description: The post content
 *                   user:
 *                     type: string
 *                     description: The user ID who created the post
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */







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