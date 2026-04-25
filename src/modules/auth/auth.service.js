import { UserModel , createOne, findOne } from "../../models/index.js";
import { badRequestException, conflictException , notFoundException } from "../../common/utils/exception.js";
import { compareHash, createLoginCredentials,emailTemplate,generateEncryption, generateHash, sendEmail } from "../../common/utils/index.js";
import { OAuth2Client} from 'google-auth-library';
import { ProviderEnum } from '../../common/enums/user.enum.js';
import { EmailEnum } from "../../common/enums/email.enum.js";
import { createNumberOtp } from "../../common/utils/otp.js";
import { get, set, otpKey, ttl, incr, maxAttempOtpKey, deleteKey , blockOtpKey, update, keys, baseRevonTokenKey } from "../../common/services/redis.service.js";
import { emailEvent } from './../../common/utils/email/event.email.js';
import { findOneAndUpdate } from "../../models/database.repository.js";


const sendEmailOtp = async ({email, subject , title} = {}) => {
  
  const isBloked = await ttl(blockOtpKey({email , subject}));
  if(isBloked > 0){
    throw badRequestException({message: `You have exceeded the maximum number of OTP attempts. Please try again after ${isBloked} seconds.`});
  }
  const remainingOtpTTL = await ttl(otpKey(email , subject));
  if (remainingOtpTTL > 0) {
    throw badRequestException({message: `Please wait ${remainingOtpTTL} seconds before requesting a new OTP`});
  }

  const maxTrial = await get(maxAttempOtpKey({email , subject}));
  if (maxTrial >= 3) {
    await set({
      key: blockOtpKey({email , subject }),
      value: maxTrial,
      ttl: 7 *60
    });
    throw badRequestException({message: `You have exceeded the maximum number of OTP attempts. Please try again after 7 minutes.`});
  }
    const code = await createNumberOtp();
  await set({
    key: otpKey({email , subject}),
    value: await generateHash({plaintext: `${code}`}),
    ttl: 120
  });
  emailEvent.emit('sendEmailOtp', async () => {
    await sendEmail({
    to: email,
    subject: "Confirm-Email",
    html: emailTemplate({code , title})
  })
  await incr(maxAttempOtpKey({email , subject}));
  })

}

export const signup = async (inputs) => {
  const { username, email, password, phone, firstName, lastName } = inputs;

  
  const checkUserExist = await findOne({
    model: UserModel,
    filter: { email }
  });

if (checkUserExist) {
  throw conflictException("User already exist");
}

  
  const encryptedPhone = phone ? await generateEncryption(phone) : undefined;


  const user = await createOne({
    model: UserModel,
    data: {
      firstName,
      lastName,
      email, 
      password: await generateHash({ plaintext: password }),
      phone: encryptedPhone
    },
  });

 
  await sendEmailOtp({ 
    email, 
    subject: "confirmEmail", 
    title: 'Verify your email' 
  }); 

  const safeUser = user.toObject();
  delete safeUser.password;
  return safeUser;
};
export const confirmEmail = async (inputs) => {
  const { email, otp } = inputs;
  const account = await findOne({
    model: UserModel,
    filter: {  email , confirmEmail: { $exists: false } , provider: ProviderEnum.System }
  });
  if (!account) {
    throw notFoundException({message: 'Fail  to find account'});
  }
  const hashOtp = await get(otpKey({ email , subject: EmailEnum.confirmEmail}));
  if (!hashOtp){
    throw notFoundException({message: 'Expired OTP'});
  }
  if (!await compareHash({plaintext: otp, sipherText: hashOtp})){
    throw badRequestException({message: 'Invalid OTP'});
  }
  account.confirmEmail = new Date();
  await account.save();
  await deleteKey(await keys(otpKey({ email })));
  return;
};

export const resendConfirmEmail = async (inputs) => {
  const { email} = inputs;
  const account = await findOne({
    model: UserModel,
    filter: {  email , confirmEmail: { $exists: false } , provider: ProviderEnum.System }
  });
  if (!account) {
    throw notFoundException({message: 'Fail  to find account'});
  }

  await sendEmailOtp({email, subject: EmailEnum.confirmEmail, title: 'Verify your email'});

  return;
};
export const requestForgotPasswordCode = async (inputs) => {
  const { email} = inputs;
  const account = await findOne({
    model: UserModel,
    filter: { email }
  });
  if (!account) {
    throw notFoundException({message: 'Fail  to find account'});
  }

  await sendEmailOtp({email, subject: EmailEnum.forgotPassword, title: 'Reset your password'});
  return;
};
export const verifyForgotPasswordCode = async (inputs) => {
  const { email , otp} = inputs;

  const hashOtp = await get(otpKey({ email , subject: EmailEnum.forgotPassword}));
  if (!hashOtp){
    throw notFoundException({message: 'Expired OTP'});
  }
  if (!await compareHash({plaintext: otp, sipherText: hashOtp})){
    throw badRequestException({message: 'Invalid OTP'});
  }

  return;
};
export const resetForgotPasswordCode = async (inputs) => {
  const { email , otp , password } = inputs;
  await verifyForgotPasswordCode({email , otp});
  const user = await findOneAndUpdate({
    model: UserModel,
    filter: {
      email , 
      confirmEmail: { $exists: true } ,
      provider: ProviderEnum.System
    },
    update: {
      password: await generateHash({plaintext: password}),
      changCredentialsTime: new Date()
    }
  })
  if(!user){
    throw notFoundException({message: 'Fail  to find account'});
  }
  const tokenKeys = await keys(baseRevonTokenKey(user._id));
  const otpKeys = await keys(otpKey({email , subject: EmailEnum.forgotPassword}));
  await deleteKey([...tokenKeys, ...otpKeys]);
   return;
};



export const login = async (inputs , issuer) => {
  const {email, password } = inputs;
  const user = await findOne({
    model: UserModel,
    filter: { email , provider: ProviderEnum.System },
  })
  if (!user) {
    throw notFoundException("Invalid email or password");
  }
  if(!await compareHash({plaintext: password, sipherText: user.password})) {
    throw notFoundException("Invalid email or password");
  }
 return createLoginCredentials(user , issuer)
};


const verifyGoogleAccount = async (idToken) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: "231472087554-pi1hfinh0iubtpopspesmqk93ei4nlg7.apps.googleusercontent.com",   
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw badRequestException({message:" Faild to verify Google account"});
  }
  return payload;
};

export const signupWithGmail = async (idToken, issuer) => {

  const payload = await verifyGoogleAccount(idToken);
  console.log(payload);
  const checkUserExist = await findOne({
    model: UserModel,
    filter: { email: payload.email }
  });
  if (checkUserExist) {
    throw conflictException("User already exist");
  }
  if(checkUserExist){
      if(checkUserExist.provider !== ProviderEnum.Google){
        throw conflictException("Email is already used with another provider");
      }
      return { status: 200, credentials: await loginWithGmail(idToken, issuer) };
  }
  const user = await createOne({
    model: UserModel,
    data: {
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      profilePicture: payload.picture,
      confirmEmail: new Date(),
      provider: ProviderEnum.Google
    }
  });
  return { status: 201, credentials: createLoginCredentials(user, issuer) };
};
export const loginWithGmail = async (idToken, issuer) => {

  const payload = await verifyGoogleAccount(idToken);
  console.log(payload);
  const user = await findOne({
    model: UserModel,
    filter: { email: payload.email , provider: ProviderEnum.Google },
  });
  if (!user) {
    throw conflictException("User not found");
  }
  if(checkUserExist){
      if(checkUserExist.provider !== ProviderEnum.Google){
        throw conflictException("Email is already used with another provider");
      }
      return;
  }
  return createLoginCredentials(user, issuer) ;
};
