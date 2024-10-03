const { ConversationModel } = require("../Models/ConversationModel");


const getConversation = async(currentuserId)=>{
   
        if(currentuserId){

            const currentuserConversation = await ConversationModel.find({
              "$or": [{ sender: currentuserId }, { receiver: currentuserId }],
            })
              .sort({ updatedAt: -1 })
              .populate("messages")
              .populate({
                path: "sender",
                select: "-password", // Exclude password
              })
              .populate({
                path: "receiver",
                select: "-password", // Exclude password
              });
    
            const conversation = currentuserConversation.map((conversationarr) => {
              const countUnseen = conversationarr.messages.reduce(
                (count, message) => {
                    msgbyID = message?.msgbyID?.toString()
                    // console.log(msgbyID)
                    if(msgbyID!==currentuserId){

                        return count + (message.seen ? 0 : 1)
                    }else{
                        return count
                    }
                
                },0
              );
              return {
                _id: conversationarr?._id,
                sender: conversationarr?.sender,
                receiver: conversationarr?.receiver,
                unseenMsg: countUnseen,
                lastMsg: conversationarr?.messages[conversationarr.messages?.length - 1],
              };
            });
    
    return conversation
        }else{
            return [];
        }
       
    
}

module.exports = getConversation