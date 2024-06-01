// var atatus = require("atatus-nodejs");

// atatus.start({
//     licenseKey: "lic_apm_86d30973c86d43d5bd05098130700e7f",
//     appName: "nodeApp",
//     enabled:true,
//     notifyHost:"10.40.30.105",
//     notifyPort:"8091",
//     useSSL:false,
//     analytics:true,
//     analyticsCaptureOutgoing: true,
//     logBody: 'all',    
// });
const nsq=require('nsqjs');
const express=require("express");
const authR=require("./routes/authRoute.js")
const {createClient} = require("@clickhouse/client");
const connectDB=require("./mongoDB/connectDB.js");

const redClient=require('./redis/redis.js');
const session=require("express-session");
const redis=require("redis");

const redisStore=require("connect-redis").default;
const passport=require("passport");

const LocalStrategy=require("passport-local").Strategy;
const User=require("./models/usermodels.js")

const bcrypt=require("bcrypt");

const path=require('path');

const app=express();

//EJS
// app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");

const client=createClient({
    url:"http://localhost:18123",
    username:'default',
    password:'',
    database:'default'
})

async function fetchData(){

    const results=await client.query({
        query:`select name from student where userID=101`,
        format:"JSONEachRow",
        wait_end_of_query:1
    })
    const dataset= await results.json();
    const stringJson=JSON.stringify(dataset);

    console.log(`clickhouse connected---${stringJson}`); 
}
fetchData();

app.use(express.json());

const port=2000;    
//6000
app.use("/",authR);

app.get('/api/users', async(req, res) => {
    const userList=await User.find();
    res.json(userList);
});

try{
    connectDB();
    app.listen(port,()=>{
        console.log(`port is running at ${port}`);

    })
}
catch (err){
    console.log(err);
}

//passport

//session
app.use(session({
    store:new redisStore({client:redClient}),
    secret:"secret",
    resave:false,
    saveUninitialized:true,
}))

app.use(passport.initialize());
app.use(passport.session());


const authUser=async(email,password,done)=>{
    console.log("function call--");

    try{
         console.log(`-----${password}---${email}-------`);

         const hpw=password;

         console.log(email);

         const validUser=await User.findOne({email});
         console.log("valid user-----",validUser);

         validPw=await validUser.password;

         console.log(hpw);
        
         const cp=await bcrypt.compare(hpw,validPw);
         console.log(cp);

         if(cp){
         console.log("user have access");
         // done(null,validUser)
         }else{
            // done(null,false)
            console.log("user dont have access");
         }

    return done(null,validUser);    
    }

    catch (err){
        console.log(err);
    }

}

passport.use(new LocalStrategy({usernameField:"email",passwordField:"password"},authUser));

passport.serializeUser((user,done)=>{
    console.log(`serialize-----`,user);
    // redClient.set("user-data",JSON.stringify(user));
    done(null,user)
})

passport.deserializeUser((id,done)=>{
        console.log(id);
        User.findById(id).then((user)=>{
        console.log("deserialize valid user-----",user)
        // const {email,password}=user;
        done(null,user)
    }).catch((err)=>{
        done(err,null)
    })

})

// nsq-------------------------------

const writer=new nsq.Writer('localhost',4150);

writer.connect();

writer.on('ready',()=>{
    
    console.log("writer connected to nsqd");
})

app.post ("/userlogin", passport.authenticate('local', {

    // successRedirect: "/Home",
    failureRedirect: "/signup",
}),async(req,res)=>{
    // const user = req.user;
    const { email, password } = req.user;
    console.log(email,password)

    if (email && password) {
        await writer.publish('email', JSON.stringify({ email, password }),err => {
            if (err) {
                console.log(err);
                return res.status(500).send("Failed to publish message");
            }
            console.log("check the consumer")
            
            res.redirect('/Home');
            writer.close();

        });
    } else {
        res.status(400).send("Invalid email and password");

    }
})

app.get("/Home",(req,res)=>{
    res.render("home")
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Failed to logout");
        }

        res.clearCookie('connect.sid', { path: '' });
        res.redirect('/ejs1');
        
    });
});
    
app.get("/ejs",(req,res)=>{
    res.render("index")
    // res.status(400).send("error");
})
app.get("/ejs1",(req,res)=>{
    res.render("index1")
})

// app.post("/loginuser",async(req,res)=>{
//     console.log("nsq----call")
//     const {email,password}=await req.body;
//     console.log(email,password);
//     if (email == '' || password == ''){
//         return req.send.json({message :"invalid credentials"})
//     }
//     if (email && password){
//         await writer.publish('email',JSON.stringify({email,password}),err=>{
//             if (err) {
//                 console.log(err);
//                 res.status(500).send("failed to publish")
//             }else{
//                 console.log("------------")
//                 res.send("login successfull message published")
//             }
//         })
//     }else{
//         res.status(400).send("invalid email and password")
//     }
// })

//redis
// if(!(redClient.connect)){
//     console.log("redis not connected");
// }
//  redClient.set("name","john");
// redClient.set("name","lord")
// const authUser=async(req,res,done)=>{
//     console.log("function call");
//     try{
//          console.log(`-----${req}`);
//          const _id=req;
//          console.log(_id);
//     const validUser=await User.findById({_id});
//     console.log("valid user-----",validUser);
//     // let authenticated_user={username,password};
//     done(null,validUser);    
//     }
//     catch (err){
//         console.log(err);
//     }
// }

//clickhouse

// createClient({
//     clickhouse_settings: {
//         async_insert: 1,
//         wait_for_async_insert: 1,
//         },
// })