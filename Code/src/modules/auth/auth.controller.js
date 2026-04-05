import { Router } from "express";
import { signup, login, signupWithGmail, confirmEmail, resendConfirmEmail, requestForgotPasswordCode, resetForgotPasswordCode, verifyForgotPasswordCode } from "./auth.service.js";
import SuccessResponse from "../../common/utils/respone/success.response.js";
import * as validators from "./auth.validation.js";
import { validation } from "../../middleware/validation.middleware.js";

const router = Router();


// مثال لتعديل الـ signup
router.post("/signup",
  validation(validators.signup),
  async (req, res, next) => {
    try {
      const account = await signup(req.body);
      return SuccessResponse(res, "User created successfully", account, 201);
    } catch (error) {
      next(error); 
    }
});

router.patch("/confirm-email",
  validation(validators.confirmEmail) ,
   async (req, res, next) => {
  const account = await confirmEmail(req.body);
  return SuccessResponse(res);
});

router.patch("/resend-confirm-email",
  validation(validators.resendConfirmEmail) ,
  async (req, res, next) => {
  await resendConfirmEmail(req.body);
  return SuccessResponse(res);
});

router.post("/request-forgot-password-code",
  validation(validators.requestForgotPasswordCode) ,
   async (req, res, next) => {
  await requestForgotPasswordCode(req.body);
  return SuccessResponse(res);
});

router.patch("/verify-forgot-password-code",
  validation(validators.verifyForgotPasswordCode) ,
   async (req, res, next) => {
  await verifyForgotPasswordCode(req.body);
  return SuccessResponse(res);
});
router.patch("/reset-forgot-password-code",
  validation(validators.resetForgotPasswordCode) ,
   async (req, res, next) => {
  await resetForgotPasswordCode(req.body);
  return SuccessResponse(res);
});

router.post("/login",validation(validators.login) , async (req, res, next) => {
  const crede = await login(req.body , `${req.protocol}://${req.host}`);

  return SuccessResponse(res, "User logged in successfully", crede, 200);
});

router.post("/signup/gmail", async (req, res, next) => {
  const { status, credentials } = await signupWithGmail(req.body.idToken , `${req.protocol}://${req.host}`);
  return SuccessResponse(res, "User created successfully", { ...credentials }, status);
});

export default router;
