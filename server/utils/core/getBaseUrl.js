function getBaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return "production-url";
  } else {
    return "http://localhost:3000";
  }
}

module.exports = getBaseUrl;
