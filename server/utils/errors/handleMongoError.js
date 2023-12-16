const handleMongoError = (error, res) => {
  const { code } = error;
  const mongooseErrors = {
    11000: {
      status: 400,
      message: "Item already exists",
    },
  };

  if (mongooseErrors[code]) {
    const { status, message } = mongooseErrors[code];
    return res.status(status).json({ message });
  }
};

module.exports = { handleMongoError };
