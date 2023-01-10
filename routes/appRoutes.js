const router = require("express").Router();
const { imageUploadExtractLink, multipleImageUpload, multipleImageUploadCommerseProducts} = require("../Controller/fileUpload");
const multer = require("multer");

let upload = multer().array("files",4)

let upload1 = multer().any()

router.post("/s3/upload", imageUploadExtractLink);

router.post("/multipleimagesupload",upload,multipleImageUpload)

router.post("/multipleimagesuploadcommerseproducts",upload1,multipleImageUploadCommerseProducts)

module.exports = router;
