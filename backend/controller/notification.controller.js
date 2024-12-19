 import Notification from "../model/notification.model.js";

 export const getNotifications = async(req,res) =>{
    try {

         const userId =  req.user._id;

         const notification = await Notification.find({ to :  userId})
                            .populate({
                                path:"from",
                                select:"username profileImg"
                            })
      
                await Notification.updateMany({ to : userId } , { read : true})

                res.status(200).json(notification)
        
    } catch (error) {
         console.log(`Error in Get Notifications Controller : ${error}`);
         res.status(500).json({error:"Internal server Error"})
    }
 }



 
 export const deleteNotifications = async(req,res) =>{
    try {

        const userId =  req.user._id;

        await Notification.deleteMany({ to : userId})

        res.status(200).json({message : "Notification is Deleted successfully"})
        
    } catch (error) {
         console.log(`Error in Delete Notifications Controller : ${error}`);
         res.status(500).json({error:"Internal server Error"})
    }
 }