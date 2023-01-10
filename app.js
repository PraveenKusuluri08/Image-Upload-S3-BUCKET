const express = require("express")
const dotenv= require("dotenv")
const cors = require("cors")
const serverless =require("serverless-http")
dotenv.config()
const AWS = require("aws-sdk")
const app = express()
app.use(cors({origin:true}))
app.use(express.json({limit:"500mb"}))

AWS.config.update({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    region:"us-east-1"
})


app.use("/app",require("./routes/appRoutes"))

const PORT = process.env.PORT ||5000
app.listen(PORT,()=>{
    console.log(`App is listening to the port ${PORT}`)
})

module.exports.handler =serverless(app)