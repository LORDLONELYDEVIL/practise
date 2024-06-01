const express=require("express");
const nsq=require("nsqjs");
const nodemailer=require('nodemailer');

const app=express();
const port=3000;

const reader=new nsq.Reader("email","default",{
	nsqdTCPAddresses:"localhost:4150"
})

const transporter=nodemailer.createTransport({
	service:"gmail",
	auth:{
		user:"vigneshsankar532@gmail.com",
		pass:"itelmzrhnjhxqntp"
	}
})

reader.connect();

reader.on("message",async(msg)=>{

	console.log('received mesaage [%s]',msg.body.toString());

	const {email,password}=JSON.parse(msg.body.toString());
	console.log(email,password);
	const mailOptions={
		from:"vigneshsankar532@gmail.com",
		to:email,
		subject:"login succ",
		text:"Die"
	}

	await transporter.sendMail(mailOptions,(err,info)=>{
	if (err){
		console.log('error in sending',err);
		msg.requeue();
	}
	else{
		console.log("email sent",info.response);
		msg.finish();
	}

})
})
reader.on("error", (err) => {
    console.error("NSQ reader error:", err);
});



reader.on("nsqd_closed",()=>{
	console.log("nsqd closed");
})


app.listen(port,()=>{
	console.log(`port is running on ${port}`)
})