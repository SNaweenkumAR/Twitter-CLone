import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true, // Fixed indentation issue
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref:"User"
        },
      },
    ],
  },
  { timestamps: true } // Correctly set timestamps option
);

const Post = mongoose.model("Post", postSchema);

export default Post;