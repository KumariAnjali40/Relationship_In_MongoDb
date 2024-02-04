const mongoose=require('mongoose');
const Schema = mongoose.Schema; 
const userSchema=mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    // Other user properties...

    // Posts created by the user
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]

},{
    versionKey:false
})


const UserModel=mongoose.model("user",userSchema);

module.exports={
    UserModel,
}