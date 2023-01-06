const router = require("express").Router();
const { imageUploadExtractLink, multipleImageUpload} = require("../Controller/fileUpload");
const multer = require("multer");

let upload = multer().array("files", 4);

router.post("/s3/upload", imageUploadExtractLink);

router.post("/multipleimagesupload",upload,multipleImageUpload)

module.exports = router;
