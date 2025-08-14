import mongoose, {Schema} from "mongoose";

const conversationSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId ,
        ref : 'User',
        required : true
    },
    persona : {
        type : String ,
        enum : ['hitesh' , 'piyush'],
        required : true
    },
    title : {
        type : String ,
        
    },


},{
    timestamps : true
})

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;