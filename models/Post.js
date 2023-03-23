const mongoose = require('mongoose')
const PostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
      },
      description : String,
      media : [],
      creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required : true
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }, 

});
const Post = mongoose.model("posts", PostSchema);

module.exports = Post;
