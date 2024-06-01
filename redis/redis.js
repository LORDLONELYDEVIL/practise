
const redis=require('redis');

const redClient=redis.createClient({
   host:"localhost",
   port:6370
});
   

(async()=>{
   await redClient.connect();
})()

redClient.on("ready",async()=>{
   console.log("redis connected")
   redClient.set("hero","Red");
   const value=await redClient.get("hero");
   console.log(value)

})

redClient.on("error",(err)=>{
   console.log(err);
})


module.exports=redClient;










































