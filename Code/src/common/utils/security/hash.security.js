import { genSalt, hash, compare } from "bcrypt";
import argon2 from "argon2";
import { SALT_ROUND } from "../../../../config/config.service.js";
import { HashApproaxhEnum } from "../../enums/security.enum.js";

export const generateHash = async ({
  plaintext,
  salt = SALT_ROUND,
  minor = "b",
  approach = HashApproaxhEnum.BCRYPT,
}) => {
  let hashValue;
  switch (approach) {
    case HashApproaxhEnum.ARGON2:
      hashValue = await argon2.hash(palintext);
      break;
    default:
      const generateSalt = await genSalt(salt, minor);
      hashValue = await hash(plaintext, generateSalt);
      break;
  }
  return hashValue;
};

export const compareHash = async ({
  plaintext,
  sipherText,
  approach = HashApproaxhEnum.BCRYPT,
}) => {
  let match = false;
  switch (approach) {
    case HashApproaxhEnum.ARGON2:
      match = await argon2.verify(sipherText, plaintext);
      break;
    default:
      match = await compare(plaintext, sipherText);
      break;
  }
  return match;
};
