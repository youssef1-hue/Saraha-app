import { EmailEnum } from "../enums/email.enum.js";
import { redisClient } from "./../../DB/redis.connection.db.js";

export const baseRevonTokenKey = (userId ) =>{
    return `RevokedToken:${userId.toString()}`;
}


export const revonTokenKey = ({userId , jti}) =>{
    return `${baseRevonTokenKey({userId})}:${jti}`;
}

export const otpKey = ({email , subject = EmailEnum.confirmEmail}) =>{
    return `OTP::User::${email}::${subject}`;
}

export const maxAttempOtpKey = ({email , subject = EmailEnum.confirmEmail}) =>{
    return `OTP::User::${email}::${subject}::MaxTrail`;
}

export const blockOtpKey = ({email , subject = EmailEnum.confirmEmail}) =>{
    return `OTP::User::${email}::${subject}::Blocked`;
}

export const set = async ({ key, value, ttl } = {}) => {
  try {
    let data = typeof value === "string" ? value : JSON.stringify(value);
    return ttl
      ? await redisClient.set(key, data, { EX: ttl })
      : await redisClient.set(key, data);
  } catch (error) {
    console.log(`Fail in redis set operation ${error}`);
  }
};

export const update = async ({ key, value, ttl } = {}) => {
  try {
    if (!(await redisClient.exists(key))) return 0;
    return await set({ key, value, ttl });
  } catch (error) {
    console.log(`Fail in redis set operation ${error}`);
  }
};

export const get = async (key) => {
  try {
    try {
      return JSON.parse(await redisClient.get(key));
    } catch (error) {
      return await redisClient.get(key);
    }
  } catch (error) {
    console.log(`Fail in redis set operation ${error}`);
  }
};

export const ttl = async (key) => {
  try {
    return await redisClient.ttl(key);
  } catch (error) {
    console.log(`Fail in redis ttl operation ${error}`);
  }
};

export const exists = async (key) => {
  try {
    return await redisClient.exists(key);
  } catch (error) {
    console.log(`Fail in redis exists operation ${error}`);
  }
};

export const expire = async ({ key, ttl } = {}) => {
  try {
    return await redisClient.expire(key, ttl);
  } catch (error) {
    console.log(`Fail in redis add-expire operation ${error}`);
  }
};

export const incr = async ( key) => {
  try {
    return await redisClient.incr(key);
  } catch (error) {
    console.log(`Fail in redis incr operation ${error}`);
  }
};

export const mGet = async (keys = []) => {
  try {
    if (!keys.length) return 0;
    return await redisClient.mGet(keys);
  } catch (error) {
    console.log(`Fail in redis mGet operation ${error}`);
  }
};

export const keys = async (prefix) => {
  try {
    return await redisClient.keys(`${prefix}*`);
  } catch (error) {
    console.log(`Fail in redis mGet operation ${error}`);
  }
};

export const deleteKey = async (key) => {
  try {
    if (!key) return 0;
    return await redisClient.del(key);
  } catch (error) {
    console.log(`Fail in redis del operation ${error}`);
  }
};
