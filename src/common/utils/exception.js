
export const conflictException = (message = "Conflict") => {
  const error = new Error(message);
  error.status = 409;
  throw error;
};

export const notFoundException = (message = "Not Found") => {
  let msg = "Not Found";
  let extra = undefined;
  if (typeof message === "object" && message !== null) {
    msg = message.message || msg;
    extra = message.extra;
  } else if (typeof message === "string") {
    msg = message;
  }
  const error = new Error(msg);
  error.status = 404;
  if (extra) error.extra = extra;
  throw error;
};

export const badRequestException = (message = "Bad Request") => {
  let msg = "Bad Request";
  let extra = undefined;
  if (typeof message === "object" && message !== null) {
    msg = message.message || msg;
    extra = message.extra;
  } else if (typeof message === "string") {
    msg = message;
  }
  const error = new Error(msg);
  error.status = 400;
  if (extra) error.extra = extra;
  throw error;
};

export const unauthorizedException = (message = "Unauthorized") => {
  const error = new Error(message);
  error.status = 401;
  throw error;
};
