import joi from "joi";
import { generalValidationFields } from "../../common/utils/security/validation.js";

export const login = {
  body: joi
    .object()
    .keys({
      email: joi
        .string()
        .email({
          minDomainSegments: 2,
          maxDomainSegments: 3,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      password: joi
        .string()
        .pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d)(?=.*[a-z]).{8,16}$"))
        .required(),
    })
    .required(),
};

export const signup = {
  body: login.body
    .keys({
      firstName: joi.string().min(3).max(20).required(),
      lastName: joi.string().min(3).max(20).required(),

      username: joi
        .string()
        .pattern(new RegExp("^[A-Za-z]{1,24}[A-Za-z0-9\\s]{1,24}$"))
        .required()
        .messages({
          "any.required": "Username is required",
          "string.empty": "Username cannot be empty",
        }),

      phone: joi
        .string()
        .pattern(new RegExp("^(01)[0125][0-9]{8}$"))
        .allow(null, "")
        .optional(),

      confirmPassword: joi.string().valid(joi.ref("password")).required(),
    })
    .required(),
};

export const confirmEmail = {
  body: joi
    .object()
    .keys({
      email: generalValidationFields.email.required(),
      otp: generalValidationFields.otp.required(),
    })
    .required(),
};

export const resetForgotPasswordCode = {
  body: confirmEmail.body
    .append({
      password: generalValidationFields.password.required(),
      confirmPassword: generalValidationFields
        .confirmPassword("password")
        .required(),
    })
    .required(),
};

export const resendConfirmEmail = {
  body: joi
    .object()
    .keys({
      email: generalValidationFields.email.required(),
    })
    .required(),
};