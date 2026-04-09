import { badRequestException } from "../common/utils/exception.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const errors = [];
    for (const key of Object.keys(schema) || []) {
      console.log({ key, schema: schema[key], data: req[key] });
      const validationResult = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (validationResult.error) {
        errors.push({
          key,
          details: validationResult.error.details.map((ele) => {
            return { message: ele.message, path: ele.path };
          }),
        });
      }
    }
    if (errors.length) {
      throw badRequestException({ message: "validation error", extra: errors });
    }
    next();
  };
};
