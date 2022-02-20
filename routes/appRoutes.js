const router = require("express").Router();
const { imageUploadExtractLink} = require("../Controller/fileUpload");

router.post("/s3/upload", imageUploadExtractLink);


module.exports = router;
