import Conversation from "../models/conversations.models";
import Message from "../models/messages.models";
import { hitesh,piyush } from "../utils/ai.js";

export const getAllMessages = async (req,res) => {
    try {
        const {conversationId } = req.params;
        if(!conversationId){
            return res.status(400).json({message: "Conversation ID is required"});
        }
        const messages = await Message.find({conversationId});
        if(!messages){
             return res.status(404).json({message: "No messages found"});
        }
        const filteredMessages = messages.map((message) => {
            return {
                role:message.role,
                content:message.content
            }
        })
        return res.status(200).json({
            success : true,
            message : "Messages retrieved successfully",
            messages:filteredMessages
        });

        
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message: "Internal Server Error while fetching messages"});
        
    }
}
export const createMessage = async (req,res) => {
    try {
         const {conversationId } = req.params;
         const {content} = req.body;
        if(!conversationId){
            return res.status(400).json({message: "Conversation ID is required"});
        }
        const conversation = await Conversation.findById(conversationId);
        if(!conversation){
            return res.status(404).json({message: "Conversation not found"});
        }
        let messages = await Message.find({conversationId}).sort({ createdAt: -1 }).limit(100);
        messages=messages.reverse();
        if(!messages.length){
            const title = content.trim().split(/\s+/);
            if(title.length<=3){
                conversation.title = title.join(" ");
            }else{
                let str = title.slice(0,3).join(" ");
                conversation.title = str + " ...";
            }
            await conversation.save();
        }
        const history = {
            role: 'developer',
            content: `User which is asking the question is ${req.user.name} and his email is ${req.user.email}`
        }

         const filteredMessages = messages.map((message) => {
            return {
                role:message.role,
                content:message.content
            }
        })

        const newMessage = {
            role: 'user',
            content: content.trim(),
        };

        let rawContent;

        if(conversation.persona==='hitesh'){
            rawContent= hitesh(history,filteredMessages,newMessage)
        }else{
            rawContent = piyush(history,filteredMessages,newMessage)
        }
        if(!rawContent){
            return res.status(400).json({message: "Error in generating response"});
        }
        const parsed = {
            role: 'assistant',
            content: rawContent
        };

        const userMessage = await Message.create({
            conversationId: conversationId,
            role: 'user',
            content: content.trim(),
        }) 

        const assistantMessage = await Message.create({
            conversationId: conversationId,
            role: 'assistant',
            content: rawContent
        });

        return res.status(200).json({success : true , message : 'message created successfully',parsed});

        




        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error while creating message" });
        
    }
}