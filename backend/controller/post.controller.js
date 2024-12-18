import User from "../model/user.model.js";
import cloudinary from "cloudinary"
import Post from "../model/post.model.js";


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