import {Router} from 'express';
import { decodeToken, SuccessResponse } from '../../common/utils/index.js';
import { deleteMessages, getMessage, getMessages, sendMessage } from './message.service.js';
import { localFileUpload } from '../../common/utils/multer/local.multer.js';
import { fileFieldValidation } from '../../common/utils/multer/validation.multer.js';
import { validation } from '../../middleware/validation.middleware.js';
import * as validator from './message.validation.js';
import { badRequestException } from '../../common/utils/exception.js';
import { TokenTypeEnum } from '../../common/enums/security.enum.js';
import { authentication } from '../../middleware/authentication.middleware.js';

const router = Router();

router.post('/:receiverId' ,
    async (req, res, next) => {
        if(req.headers.authorization){
           const {user , decode} = await decodeToken({token: req.headers.authorization.split(' ')[1] , tokenType:TokenTypeEnum.ACCESS});
              req.user = user;
              req.decode = decode;
        }
        next();
    },
    localFileUpload({validation: fileFieldValidation.image, sustomPath:'Messages' , maxSize: 1}).array('attachments', 2) ,
    validation(validator.sendMessage) ,
     async (req, res, next) => {
        if(!req.body?.content && !req.files?.length){
            throw badRequestException({message: 'validation error' , extra: {key: 'body' , path:['content'] , message:'Missing content'}})
        }
    const message = await sendMessage(req.params.receiverId , req.body , req.files , req.user);
   return SuccessResponse({res , status:201 , date: { message }})
});

router.get('/:messageId' ,
    authentication(),
    validation(validator.getMessage) ,
     async (req, res, next) => {
    const message = await getMessage(req.params.messageId , req.user);
   return SuccessResponse({res , status:200 , date: { message }})
});
router.delete('/:messageId' ,
    authentication(),
    validation(validator.deleteMessage) ,
     async (req, res, next) => {
    const message = await deleteMessages(req.params.messageId , req.user);
   return SuccessResponse({res , status:200 , date: { message }})
});
router.get('/list' ,
    authentication(),
     async (req, res, next) => {
    const messages = await getMessages(req.user);
   return SuccessResponse({res , status:200 , date: { messages }})
});

export default router;