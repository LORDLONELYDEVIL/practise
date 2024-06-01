const express=require("express");
const signup = require("../controller/useSignup.js");
const showUsers = require("../controller/login");


const router=express.Router();


router.post("/signup",signup);


router.get("/simple",(req,res)=>{
    res.render("../views/signUp")
})

router.get("/login",(req,res)=>{
    res.send("login page")

})

module.exports=router;



// router.get("/:id",(req,res)=>{
//     const {id}=req.params;   
//     res.send(`${id}`)
// });

// router.get("/show",showUsers);


