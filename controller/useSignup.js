const User=require("../models/usermodels.js");
const bcrypt=require('bcrypt');


const signup =async(req,res)=>{
    try{
        const {fullname,username,email,password}=req.body;

        if(!username || !fullname || !password || !email){

        return res.status(500).send({message:"send require fields"});
        }
        // const salt=await bcrypt.genSalt(10);

        bcrypt
            .hash(password,10)
            .then((hashedPW)=>{
                const user=new User({
                    fullname,
                    username,
                    email,
                    password:hashedPW  
                })  
                user
                .save()
                .then((result)=>{
                    res.status(200).json({message:"user created ",result})

                
                })
                .catch((e)=>{
                    console.log("error in user model", e)
                })
            })   
    }
    catch (err){
        res.status(400).send({message:"check the controller"});
    }
   
}
module.exports=signup;


