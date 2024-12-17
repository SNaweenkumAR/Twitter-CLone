import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";

export const getProfile = async(req,res) => {
    try {
        const {username}=req.params;
        const user = await User.findOne({username})

        if(!user){
            return res.status(400).json({error: "User not found"})
        }

        res.status(200).json(user)

    } catch (error) {
        console.log(`Error in getProfile Controller : ${error}`)
        res.status(500).json({error : " Internal server error"})
        
    }
}
/*
export const followUnfollowUser = async(req,res) => {
      try {
            
           const {id} =req.params; 
           const userToModify =  await User.findById({_id:id})
           const currUser = await User.findById({_id:req.user._id})

           if(id === req.user._id){
            return res.status(400).json({error : "You can't Unfollow or Follow Yourself"});
           }
          if(!userToModify || !currUser){
            return res.status(400).json({error : "User not found"});
          }

          const isFollowing = currUser.following.includes(id);

          if(isFollowing){
              //unfollow 
              await User.findByIdAndUpdate({_id:id} , {$pull:{followers:req._id}})
              await User.findByIdAndUpdate({_id:req._id} , {$pull:{following:id}})    
               
              res.status(200).json({message: "Successfully Unfollowed"})

          }
          else{
            //follow
            await User.findByIdAndUpdate({_id : id} , {$push:{followers: req.user._id}})
            await User.findByIdAndUpdate({_id : req.user._id} , {$push:{following:id}})
            //send notification
            res.status(200).json({message:"Followed Successfully "})
          }


      } catch (error) {
        console.log(`Error in follow and Unfollow Controller : ${error}`)
        res.status(500).json({error : " Internal server error"})
      }
}*/
export const followUnfollowUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ error: "User ID is required in params" });
      }
  
      if (!req.user || !req.user._id) {
        return res.status(400).json({ error: "User not authenticated" });
      }
  
      if (id === req.user._id.toString()) {
        return res.status(400).json({ error: "You can't follow or unfollow yourself" });
      }
  
      const userToModify = await User.findById(id);
      const currUser = await User.findById(req.user._id);
  
      if (!userToModify || !currUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const isFollowing = currUser.following.includes(id);
  
      if (isFollowing) {
          //unfollow
        await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
        await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });


        return res.status(200).json({ message: "Successfully unfollowed" });
      } else {
        //follow
        await User.findByIdAndUpdate(id, { $addToSet: { followers: req.user._id } });
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: id } });

        const newNotification = new Notification({
              type:"follow",
              from:req.user._id,
              to:userToModify._id 
        })
          
        await newNotification.save();

        return res.status(200).json({ message: "Followed successfully" });
      }
    } catch (error) {
      console.error(`Error in follow/Unfollow User Controller: ${error.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  };


  export const getSuggestedUser = async(req,res) => {
    try {
      
      const userId = req.user._id;
      const userFollowed = await User.findById({_id:userId}).select("-password");

      const users = await User.aggregate([
         {
          $match:{
            _id: { $ne :userId},
           }
           },{
            $sample:{
              size:10
             }
           }
      ])

      const filteredUser = users.filter((user) => !userFollowed.following.includes(user._id));
      const SuggestedUsers = filteredUser.slice(0,4);

    //  SuggestedUsers.array.forEach( (user) => (user.password = null));
        SuggestedUsers.forEach((user) => (user.password = null));
      res.status(200).json(SuggestedUsers)


    } catch (error) {
      console.error(`Error in Suggested User Controller: ${error.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  