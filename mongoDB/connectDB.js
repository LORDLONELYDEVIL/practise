const mongoose = require("mongoose");
//ELCc3VvE8xsxIssG
//vigneshsankar532
//mongodb+srv://vigneshsankar532:ELCc3VvE8xsxIssG@cluster0.f71fqqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const mongoURI=`mongodb+srv://vigneshsankar532:ELCc3VvE8xsxIssG@cluster0.f71fqqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const  connectDB=async()=>{
try{
    await mongoose
        .connect(mongoURI);
         console.log("connected");
}
catch (err){
    console.log(err);
}
}
module.exports= connectDB;