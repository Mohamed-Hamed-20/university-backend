import rateLimit from "express-rate-limit";

export const limiter = async ({ windowMs, limit }) => {
  const limiter = rateLimit({
    windowMs: windowMs,
    limit: limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });

  return limiter;
};
