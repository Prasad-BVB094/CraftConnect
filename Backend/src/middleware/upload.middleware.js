const multer = require("multer");

const storage = multer.memoryStorage();

module.exports = multer({
  storage,
  limits: { files: 5 }
});
