// const User=require("../models/usermodels.js");


// const showUsers=async(req,res)=>{
//     try{
//         const users=await User.find();
//         res.render("users : ",{users})
//     }
//     catch (err){
//         console.log("error in showUsers", err)
//     }
    
// }
// module.exports=showUsers;

const User = require("../models/usermodels");

const showUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render("users", { users: users }); // Assuming your view is named "users"
    } catch (err) {
        console.error("Error in showUsers:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = showUsers;