const express = require("express")
const dotenv= require("dotenv")
const cors = require("cors")

dotenv.config()
const AWS = require("aws-sdk")
const app = express()
app.use(cors({origin:true}))
app.use(express.json())

AWS.config.update({
    apiVersion: "2010-12-01",
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    region:"ap-south-1"
})


app.use("/user",require("./routes/appRoutes"))

const PORT = process.env.PORT ||5000
app.listen(PORT,()=>{
    console.log(`App is listening to the port ${PORT}`)
})
