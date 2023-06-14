const AWS = require('../config/s3')
const path = require("path");
const multer = require('multer')
const multerS3 = require('multer-s3')

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: process.env.S3_BUCKET_NAME,
    key(req, file, cb) {
      cb(
        null,
        `${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
  limit: { fileSize: 20 * 1024 * 1024 },
});

module.exports = upload