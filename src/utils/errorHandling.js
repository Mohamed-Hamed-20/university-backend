export const asyncHandler = (controller) => {
  return (req, res, next) => {
    controller(req, res, next).catch(async (error) => {
      return res
        .status(error.cause || 500)
        .json({ message: error.message, stack: error.stack });
    });
  };
};

export const GlobalErrorHandling = (error, req, res, next) => {
  let result = {};
  if (process.env.NODE_ENV == "DEV") {
    result = { message: error.message, stack: error.stack };
  } else {
    result = { message: error.message };
  }
  return res.status(error.cause || 500).json(result);
};
