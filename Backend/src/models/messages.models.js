import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema({
    conversationId : {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required : true
    }, 
    role : {
        type: String,
        enum : ['user', 'assistant'],
        required : true

    },
    content : {
        type : String,
        required : true
    }, 

},{
    timestamps : true
})

const Message = mongoose.model('Message', messageSchema);

export default Message;