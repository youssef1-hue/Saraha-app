import joi from 'joi';
import mongoose from 'mongoose';


export const generalValidationFields = {
  
  otp: joi.string().pattern(
    new RegExp(/^[0-9]{6}$/)
  ),
  email: joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 3,
    tlds: { allow: ['com', 'net'] }
  }),

  password: joi.string().pattern(
    new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/)
  ),

  username: joi.string().pattern(
    new RegExp(/^[A-z]{1}[a-z]{1,24}\s[A-z]{1}[a-z]{1,24}$/)
  ).messages({
    "any.required": "username is required",
    "string.empty": "username cannot be empty"
  }),

  phone: joi.string().pattern(
    new RegExp(/^(00201|\+201|01)(0|1|2|5)\d{8}$/)
  ),

  confirmPassword: function (path = "password") {
    return joi.string().valid(joi.ref(path))
  },

  id: joi.string().custom((value, helpers) => {
    return mongoose.Types.ObjectId.isValid(value) ? value : helpers.error("Invalid userId");
  }),

  file:function (validation = []) {
    return joi.object().keys({
            fieldname: joi.string().required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),
            mimetype: joi.string().valid(...Object.values(validation)).required(),
            size: joi.number().max(5 * 1024 * 1024).required(),
            destination: joi.string().required(),
            filename: joi.string().required(),
            path: joi.string().required(),
            finalPath: joi.string().required(),
        })
  }

};
