const mongoose=require('mongoose');
const Schema = mongoose.Schema; 
const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    // Other post properties...

    // User who created the post
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;