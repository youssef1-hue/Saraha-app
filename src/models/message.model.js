import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    content:{
        type: String,
        minLenhth: 1,
        maxLength: 1000,
        required: function(){
            return !this.attachments?.length
        }
    },
    attachments: {
        type: [String],
    },
    receviverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

},{
    collation: 'Route_messages',
    timestamps: true
})

export const MessageModel = mongoose.model.Message || mongoose.model('Message', messageSchema)