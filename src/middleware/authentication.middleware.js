import { TokenTypeEnum } from "../common/enums/security.enum.js";
import { decodeToken } from "../common/utils/index.js";
import { badRequestException } from "../common/utils/exception.js";

export const authentication = (tokenType = TokenTypeEnum.ACCESS) => {
  return async (req, res, next) => {
    try {
      const [schema, credentials] = req.headers.authorization?.split(" ") || [];

      if (!schema || !credentials) {
        throw badRequestException({ message: "Missing Authentication Credentials" });
      }

      switch (schema) {
        case "Basic":
          const [username, password] = Buffer.from(credentials, "base64").toString().split(":");
          break;

        default:
          const { account, decoded } = await decodeToken({ token: credentials, tokenType });
          req.user = account;
          req.decoded = decoded;   
          break;
      }

      return next();

    } catch (error) {
      next(error);
    }
  }
}

export const authorization = (accessRoles = []) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(badRequestException({ message: "Unauthorized Access" }));
    }
    next();
  }
}