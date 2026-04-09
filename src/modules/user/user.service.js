import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../../../config/config.service.js";
import { LogoutEnum } from "../../common/enums/security.enum.js";
import { baseRevonTokenKey, deleteKey, keys, revonTokenKey, set } from "../../common/services/redis.service.js";
import { conflictException, notFoundException } from "../../common/utils/exception.js";
import { createLoginCredentials, decodeToken, generateDecryption, generateHash } from "../../common/utils/index.js";
import { createOne, findOne } from "../../models/database.repository.js"
import { UserModel } from "../../models/user.model.js"
import { generateEncryption } from './../../common/utils/security/encryption.security.js';
import { hash } from 'bcrypt';



const createRevokedToken = async ({userId, jti, iat}) => {
        await set({
        key: revonTokenKey({userId, jti}),
        value: jti,
        ttl
      })
}

export const logout = async (user, {flag}, { jti, iat , sub }) => {
    let status = 200;
  switch (flag) {
    case LogoutEnum.ALL:
      user.changCredentialsTime = new Date();
      await user.save();
      await deleteKey(await keys(baseRevonTokenKey(sub)));
      break;

    default:
      await createRevokedToken({
        userId: sub,
        jti,
        iat: iat + REFRESH_TOKEN_EXPIRES_IN
    })
        status = 201;
        break;
  }

  return status;
};

export const profileImage   =async (user, file)=>{
    user.profileImage = file.finalPath;
    await user.save();
    return user;
}

export const profileCoverImage   =async (user, files)=>{
    user.profileCoverImage = files.map(file => file.finalPath);
    await user.save();
    return user;
}



export const profile   =async (user)=>{
    return user; 

}



export const shareProfile   =async (userId)=>{
    const account = await findOne({
        model: UserModel,
        filter: { _id: userId },
        select: "-password"
    });
    if(!account) throw notFoundException("User not found");
    if(account.phone){
        account.phone = await generateDecryption(account.phone);
    }
    return account;
}

export const updatePassword = async ({oldPassword, password} , user , issuer) => {
  if(!await compareHash({plaintext: oldPassword, sipherText: user.password})) {
    throw badRequestException({message: 'Invalid current password'});
  }
  for (const hash of user.oldPassword || []) {
      if(!await compareHash({plaintext: password, sipherText: hash})) {
    throw badRequestException({message: 'This password is already used before, please choose another one'});
  }
  }
  user.oldPassword.push(user.password);
  user.password = await generateHash({plaintext: password});
  user.changCredentialsTime = new Date();
  await user.save();
  await deleteKey(await keys(baseRevonTokenKey(user._id)));
  return await createLoginCredentials(user , issuer);
};


export const rotateToken   =async (user , { sub, jti, iat } , issuer)=>{
    if((iat = ACCESS_TOKEN_EXPIRES_IN ) * 1000 >= Date.now() + (30000)){
        throw conflictException({message: 'Current token is still valid' });
    }
    await createRevokedToken({
        userId: sub,
        jti,
        iat: iat + REFRESH_TOKEN_EXPIRES_IN
    })
    return createLoginCredentials(user , issuer)
}