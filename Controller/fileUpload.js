const Busboy = require("busboy");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const multer  = require('multer');
const multerS3 = require('multer-s3');
const s3 = new AWS.S3();

const imageUploadExtractLink = (req, res) => {
  let busboy = Busboy({ headers: req.headers });
  const fID = uuidv4();
  let chunkImage = [];
  let fName, fEncoding, fType;
  busboy.on("file", (fieldname, file, info) => {
    const { filename, encoding, mimeType } = info;
    if (
      mimeType !== "image/jpeg" &&
      mimeType !== "image/png" &&
      mimeType !== "jpg"
    ) {
      return res.status(404).json({
        message: "Please give only 'png/jpeg/jpg'",
      });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    fName = `ImageUploadS3${fID}.${imageExtension}`;
    fEncoding = encoding;
    fType = mimeType;
    file.on("data", (data) => {
      console.log(data);
      chunkImage.push(data);
    });
    file.on("end", () => {
      console.log("File" + filename + "Processed");
    });
  });
  busboy.on("finish", () => {
    const Params = {
      Bucket: "nodejs-image-upload",
      Key: `${fName}`,
      Body: Buffer.concat(chunkImage),
      ServerSideEncryption: "AES256",
      ACL: "public-read",
      ContentEncoding: fEncoding,
      ContentType: fType,
    };
    s3.upload(Params, (err, info) => {
      console.log("Info", info);
      if (err) {
        return res.status(400).json({ err, error: true });
      } else {
        return res.status(201).send({
          ImageInfo: info.Location,
          message: "Image Uploaded Successfully",
        });
      }
    });
  });
  req.pipe(busboy);
};

module.exports = { imageUploadExtractLink,imageUploadS3 };
