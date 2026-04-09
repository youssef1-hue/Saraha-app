import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  SYSTEM_ACCESS_TOKEN_SECRET_KEY,
  SYSTEM_REFRESH_TOKEN_SECRET_KEY,
  USER_ACCESS_TOKEN_SECRET_KEY,
  USER_REFRESH_TOKEN_SECRET_KEY,
} from "../../../../config/config.service.js";
import jwt from "jsonwebtoken";
import { findOne } from "../../../models/database.repository.js";
import { UserModel } from "../../../models/user.model.js";
import {
  badRequestException,
  conflictException,
  notFoundException,
} from "../exception.js";
import { TokenTypeEnum } from "../../enums/security.enum.js";
import { RoleEnum } from "../../enums/user.enum.js";
import { randomUUID } from 'node:crypto';
import { get } from "../../services/redis.service.js";

export const generateToken = async ({
  payload = {},
  secret = USER_ACCESS_TOKEN_SECRET_KEY,
  options = {},
} = {}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async ({
  token = {},
  secret = USER_ACCESS_TOKEN_SECRET_KEY,
} = {}) => {
  return jwt.verify(token, secret);
};

export const detectSignatureLevel = async (level) => {
  let signature = {accessSignature: undefined, refreshSignature: undefined};
  switch (level) {
    case RoleEnum.admin:
      signature = {accessSignature: SYSTEM_ACCESS_TOKEN_SECRET_KEY, refreshSignature: SYSTEM_REFRESH_TOKEN_SECRET_KEY};
      break;
    default:
      signature = {accessSignature: USER_ACCESS_TOKEN_SECRET_KEY, refreshSignature: USER_REFRESH_TOKEN_SECRET_KEY};
      break;
  }

  return signature;
};
export const getTokenSignature = async ({ tokenType = TokenTypeEnum.ACCESS , level } = {}) => {
  const { accessSignature, refreshSignature } = await detectSignatureLevel(level);
  let signature = undefined;
  switch (tokenType) {
    case TokenTypeEnum.REFRESH:
      signature = refreshSignature;
      break;
    default:
      signature = accessSignature;
      break;
  }

  return signature;
};

export const decodeToken = async ({
  token,
  tokenType = TokenTypeEnum.ACCESS,
} = {}) => {
  const decoded = jwt.decode(token);
  if (!decoded?.aud.length) {
    throw badRequestException("Missing Token Audience");
  }
  const [tokenApproach , level] = decoded.aud || [];
  if (tokenType !== tokenApproach) {
    throw conflictException(`Unexpected token approach: ${tokenType} while you have used ${tokenApproach}`);
  }
  if (decoded.jti && await get(revonTokenKey({userId: decoded.sub, jti: decoded.jti}))) {
    throw notFoundException("Invalid Token");
  }
  const secret = await getTokenSignature({ tokenType: tokenApproach, level });
  const verifyData = jwt.verify(token, secret);
  const account = await findOne({
    model: UserModel,
    filter: { _id: verifyData.sub },
  });
  if (!account) {
    throw notFoundException("Account not found");
  }

  if (account.changCredentialsTime && account.changCredentialsTime?.getTime() >= decoded.iat * 1000) {
    throw notFoundException({message: "Invalid Login Session"});
  }


  return {account , decoded};
};

export const createLoginCredentials = async (user, issuer) => {
  const { accessSignature, refreshSignature } = await detectSignatureLevel(user.role);
  const jwtid = randomUUID();
  const access_token = await generateToken({
    payload: { sub: user._id, extra: 250 },
    secret: accessSignature,
    options: {
      issuer: "issuer",
      jti: jwtid,
      audience: [TokenTypeEnum.ACCESS , user.role],
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  });
  const refresh_token = await generateToken({
    payload: { sub: user._id, extra: 250 },
    secret: refreshSignature,
    options: {
      issuer: "issuer",
      audience: [TokenTypeEnum.REFRESH, user.role],
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      jti: jwtid,

    },
  });
  return { access_token, refresh_token };
};
