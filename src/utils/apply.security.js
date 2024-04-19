import rateLimit from "express-rate-limit";
import helmet from "helmet";

//Middleware Rate limiter
export const limiter = ({ Mintute, limit }) => {
  const limiterMiddleware = rateLimit({
    windowMs: Mintute * 60 * 1000 || 15 * 60000,
    max: limit || 70,
    message: {
      message: "To many Request for this service You block",
      TimeBlocked: "${Mintute} Mintute",
    },
  });

  return limiterMiddleware;
};

export const helmetsecurtyOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "example.com"],
    },
  },
  frameguard: { action: "deny" },
  hsts: { maxAge: 31536000, includeSubDomains: true },
};


helmet({

})