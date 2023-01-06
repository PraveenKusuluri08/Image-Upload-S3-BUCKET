const Busboy = require("busboy")
const { v4: uuidv4 } = require("uuid")
const AWS = require("aws-sdk")
const s3 = new AWS.S3()

const imageUploadExtractLink = (req, res) => {
  let busboy = Busboy({ headers: req.headers })
  const fID = uuidv4()
  let chunkImage = []
  let fName, fEncoding, fType
  busboy.on("file", (fieldname, file, info) => {
    const { filename, encoding, mimeType } = info
    const imageExtension = filename.split(".")[filename.split(".").length - 1]
    fName = `ImageUploadS3${fID}.${imageExtension}`
    fEncoding = encoding
    fType = mimeType
    file.on("data", (data) => {
      console.log(data)
      chunkImage.push(data)
    })
    file.on("end", () => {
      console.log("File" + filename + "Processed")
    })
  })
  busboy.on("finish", () => {
    const Params = {
      Bucket: "nodejs-image-upload",
      Key: `${fName}`,
      Body: Buffer.concat(chunkImage),
      ServerSideEncryption: "AES256",
      ACL: "public-read",
      ContentEncoding: fEncoding,
      ContentType: fType,
    }
    s3.upload(Params, (err, info) => {
      console.log("Info", info)
      if (err) {
        return res.status(400).json({ err, error: true })
      } else {
        return res.status(201).send({
          ImageInfo: info.Location,
          message: "Image Uploaded Successfully",
        })
      }
    })
  })
  req.pipe(busboy)
}

const multipleImageUpload = (req, res, err) => {
  let imageUrls=[]
  let itemId=req.body["itemId"]
  let params
  const files = req.files
  console.log(files, req.body["itemId"])
  for(let i=0;i<files.length;i++) {
    if(files[i].mimetype!=="image/png"&&files[i].mimetype!=="image/jpg"&&images[i].mimetype!=="image/jpeg") {
      console.log(files[i]["mimetype"]!=="image/png");
      return res.status(404).json({
        message:"Please give only 'png/jpeg/jpg'"
      })
    }
  }
  console.log("first",files.length)
  for (let i = 0; i < files.length; i++) {
    params={
      Bucket:"commerse-products",
      Key: `${itemId}/${new Date().getTime()}-${files[i]["mimetype"]}-${files[i]["originalname"]}`,
      Body: files[i]["buffer"],
      ACL: "public-read",
    }
    s3.upload(params,((err,info)=>{
      console.log("first->",info)
      if(err) {
        console.log(err)
         res.status(400).json({err,error:true})
      } else{
        imageUrls.push(info)
        if(imageUrls.length == files.length){
        return res.json({ "error": false, "Message": "File Uploaded SuceesFully", Data: imageUrls});
      }
    }
    }))
  }
}

module.exports = { imageUploadExtractLink, multipleImageUpload }
