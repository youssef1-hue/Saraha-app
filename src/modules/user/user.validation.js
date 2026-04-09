import joi from 'joi';
import { generalValidationFields } from '../../common/utils/security/validation.js';
import { fileFieldValidation } from './../../common/utils/multer/validation.multer.js';


export const updatePassword = {
    body: joi.object().keys({
        oldPassword: generalValidationFields.password.required(),
        password: generalValidationFields.password.not(joi.ref('oldPassword')).required(),
        confirmPassword: generalValidationFields.confirmPassword('password').required()
    }).required()
}
export const shareProfile = {
    params: joi.object().keys({
        userId: generalValidationFields.id.required()
    }).required()
};


export const profileImage = {
    files: joi.array().items(
        generalValidationFields.file(fileFieldValidation.image).required()
    ).min(1).max(1).required()
};

export const profileCoverImage = {
    files: joi.array().items(
        generalValidationFields.file(fileFieldValidation.image).required()
    ).min(1).max(5).required()
};
export const profileAttachments = {
    files: joi.array().items(
        joi.object({
            profileImage: joi.array().items(
                generalValidationFields.file(fileFieldValidation.image).required()
            ).min(1).max(5).required(),
        }).required()
    ).required()
};