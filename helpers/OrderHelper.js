const generateOrderId = (userId) => {
  const timestamp = Date.now().toString();
  const shortUserId = userId.substring(0, 8); // Shorten the UUID to the first 8 characters
  const randomString = Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
  return `ORDER-${shortUserId}-${timestamp}-${randomString}`;
};
module.exports = {
  generateOrderId,
};
