import { notFoundException } from "../../common/utils/exception.js";
import { createOne, findOne } from "../../models/database.repository.js";
import { MessageModel } from "../../models/message.model.js";
import { UserModel } from "../../models/user.model.js";

export const sendMessage = async (
  receiverId,
  { content = undefined } = {},
  files,
  user
) => {

  const account = await findOne({
    model: UserModel,
    filter: { _id: receiverId, confirmEmail: { $exists: true } }
  });

  if (!account) {
    throw new notFoundException("Fail to find matching receiver account");
  }

  const message = await createOne({
    model: MessageModel,
    data: {
      content,
      attachments: files.map((file) => file.finalPath),
      receiverId,
      senderId: user ? user._id : undefined
    }
  });

  return message;
};

export const getMessage = async (messageId, user) => {
    const message = await findOne({
        model: MessageModel,
        filter: {
            _id: messageId,
            $or: [
                { senderId: user._id },
                { receiverId: user._id }]
        },
        select: '-senderId'
    });

    if (!message) {
        throw new notFoundException("Fail to find matching message");
    }
    
    return message;
};
export const getMessages = async (user) => {
    const messages = await find({
        model: MessageModel,
        filter: {
            $or: [
                { senderId: user._id },
                { receiverId: user._id }]
        },
        select: '-senderId'
    });

    return messages;
};
export const deleteMessages = async (messageId, user) => {
    const message = await findOneAndDelete({
        model: MessageModel,
        filter: {
            _id: messageId,
             receiverId: user._id 
        },
        select: '-senderId'
    });

    if (!message) {
        throw new notFoundException("Fail to find matching messages");
    }

    return message;
};