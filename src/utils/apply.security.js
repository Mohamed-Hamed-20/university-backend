import rateLimit from "express-rate-limit";

//Middleware Rate limiter
export const limiter = ({ Mintute, limit }) => {
  const limiterMiddleware = rateLimit({
    windowMs: Mintute * 60 * 1000 || 15 * 60000,
    max: limit || 70,
    message: {
      message: "To many Request for this service You block",
      TimeBlocked:"${Mintute} Mintute",
    },
  });

  return limiterMiddleware;
}
