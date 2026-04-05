import { TokenTypeEnum } from "../common/enums/security.enum.js";
import { login } from "../modules/auth/auth.service.js";
import { decodeToken } from "../common/utils/index.js";
import { badRequestException } from "../common/utils/exception.js";

export const authentication = (tokenType = TokenTypeEnum.ACCESS) => {
  return async (req, res, next) => {
    const [schema , credentials] = req.headers.authorization?.split(" ") || [];
    if (!key || !credentials) {
      throw badRequestException({message: "Missing Authentication Credentials"});
    }
    switch (schema) {
        case "Basic":
            const [username , password] = Buffer.from(credentials, "base64").toString().split(":");
            // await login({ email, password }, `${req.protocol}://${req.host}`);
            break;
            default:
            const {user , decode} = await decodeToken({ token: credentials, tokenType });
            req.user = user;
            read.decoded = decode;   
            break;
    }
  }
}

export const authorization = (accessRoles = []) => {
    return async (req, res, next) => {
      if (!accessRoles.includes(req.user.role)) {
        throw badRequestException({message: "Unauthorized Access"});
      }
      next();
    }

}