import User from "../model/user.model.js";
import cloudinary from "cloudinary"
import Post from "../model/post.model.js";
import Notification from "../model/notification.model.js";
import mongoose from "mongoose";


 export const createPost = async (req,res) => {
    try {

        const {text} = req.body;
        let{img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findOne({_id:userId})

        if(!user){
            return res.status(400).json({error:"User not Found"})
        }

        if(!text && !img) {
            return res.status(400).json({error:"Post must have Image or Text"})
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img= uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user:userId,
            text,
            img
        })

        await newPost.save();
        res.status(201).json(newPost);
        
    } catch (error) {
        console.log(`Error in Create Post Controller:${error}`)
        res.status(500).json({error:"Internal server Error"})
    }
 }


 export const  deletePost = async (req,res) =>{
    try {

        const {id}  = req.params;

        const post = await Post.findOne({_id : id})

        if(!id){
            return res.status(404).json({error:"Post not Found"})
        }

        if(post.user.toString() !== req.user._id.toString()){
                return res.status(401).json({error:"You are not Authorized to Delete the Post"})
        }

        if(post.img){
            const imgId =  post.img.split("/").pop().split(".")[0];
            await cloudinary.destroy(imgId);
        }
        
         await Post.findByIdAndDelete( {_id :id });
         res.status(200).json({message:"Post Deleted Successfully "});

    } catch (error) {
        console.log(`Error in Delete Post Controller:${error}`)
        res.status(500).json({error:"Internal server Error"})
    }
 }


 export const createComment = async(req,res) => {
    try {
        
           const {text} = req.body;
           const postId = req.params.id;
           const userId =req.user._id;
           


           if(!text){
            return res.status(400).json({error : "Comment text is required"})
           }

           
    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: "Invalid Post ID" });
      }

           const post  =  await Post.findOne({_id : postId})

           if(!post){
            return res.status(404).json({error : "Post is Not Found"})
           }

           const comment ={
            user :userId,
            text
           }

              post.comments.push(comment)
              await post.save();
              res.status(200).json(post);

;

   


    } catch (error) {
        console.log(`Error in Create Comment Controller:${error}`)
        res.status(500).json({error:"Internal server Error"})
    }
 }


 export const likeUnlikePost = async (req, res) => {
   try {
     const userId = req.user._id; // User performing the like/unlike action
     const { id: postId } = req.params; // Post ID from request parameters
 
     // Find the post by ID
     const post = await Post.findOne({ _id: postId });
 
     if (!post) {
       return res.status(404).json({ error: "Post not found" });
     }
 
     // Check if the user has already liked the post
     const userLikePost = post.likes.includes(userId);
 
     if (userLikePost) {
       // Unlike the post
       await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
       await  User.updateOne({_id:userId},{$pull : {likedPosts :postId }})

       return res.status(200).json({ message: "Post unliked successfully" });
     } else {
       // Like the post
       await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });
       await  User.updateOne({_id:userId},{$addToSet : {likedPosts :postId }})
 
       // Create a notification for the like
       const notification = new Notification({
         from: userId,
         to: post.user,
         type: "like",
       });
       await notification.save();
 
       return res.status(200).json({ message: "Post liked successfully" });
     }
   } catch (error) {
     console.error(`Error in Like/Unlike Controller: ${error.message}`);
     res.status(500).json({ error: "Internal server Error" });
   }
 };


 export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 }) // Sort by newest to oldest
        .populate({
          path: "user",
          select: "-password", // Exclude the password field
        })
        .populate({
          path: "comments.user", // Populate the user field inside comments
          select: ["-password", "-email" ,"-following","-followers","-link","-bio"]// Exclude the password field
        });
  
      if (!posts || posts.length === 0) {
        return res.status(200).json([]); // Return an empty array if no posts
      }
  
      res.status(200).json(posts);
    } catch (error) {
      console.error(`Error in Get All Posts Controller: ${error.message}`);
      res.status(500).json({ error: "Internal server Error" });
    }
  };


  export const getLikedPosts = async(req,res) => {
    try {
        
        const userId = req.params.id;
        const user  = await User.findById({_id : userId})

        if(!user){
            return res.status(404).json({error : "User not Found"})
        }

        const likedPosts =  await Post.find({_id:{$in : user.likedPosts}})
                             .populate({
                                path:"user",
                                select:"-password"
                             })
                             .populate({
                                path:"comments",
                                select:["-password", "-email" ,"-following","-followers","-link","-bio"]
                             })


    if (!likedPosts.length) {
        return res.status(200).json([]); // If no liked posts, return an empty array
      }
  
      res.status(200).json(likedPosts);
        
    } catch (error) {
        console.error(`Error in Get Liked Posts Controller: ${error.message}`);
      res.status(500).json({ error: "Internal server Error" });
    }
  }
  