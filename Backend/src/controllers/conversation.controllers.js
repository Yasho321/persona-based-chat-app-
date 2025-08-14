import Conversation from "../models/conversations.models.js";

export const getAllConversations = async (req, res) => {
    try {
        const { persona } = req.body;
        const userId = req.user._id;

        if (!persona) {
            return res.status(400).json({ success: false, message: "Persona is required" });
        }

        await Conversation.deleteMany({
            userId: userId,
            persona: persona,
            $or: [
                { title: { $exists: false } }, 
                { title: null },               
                { title: "" }                   
            ]
        });

        const conversations = await Conversation.find({
            userId: userId,
            persona: persona
        }).sort({ createdAt: -1 }).limit(20);

        if (!conversations) {
            return res.status(404).json({ success: false, message: "No conversations found" });
        }

        return res.status(200).json({
            success: true,
            conversations: conversations,
            message: "All conversations fetched"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching conversations"
        });
    }
};
export const createConversation = async (req, res) => {
    try {
        const { persona } = req.body;
        const userId = req.user._id;
        if (!persona) {
            return res.status(400).json({ success: false, message: "Persona is required" });
        }
        const conversation = await Conversation.create({
            userId: userId,
            persona: persona

        });
        if(!conversation){
            return res.status(400).json({ success: false, message: "Failed to create conversation"})
        }
        return res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            conversation: conversation
        })

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating conversation"
        })
        
    }
}
export const deleteConversation = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user._id;
        const conversation = await Conversation.findById(id);
        if(!conversation){
            return res.status(404).json({ success: false, message: "Conversation not found"})
        }
        if(conversation.userId.toString() !== userId.toString()){
            return res.status(403).json({ success: false, message: "You are not authorized to delete this conversation" })
        }
        await conversation.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Conversation deleted successfully"
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting conversation"
        })
    }
}