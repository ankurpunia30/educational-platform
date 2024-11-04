const jwt=require('jsonwebtoken')

const authenticate=(req,res,next)=>{
    const token=req.header('Authorization');
    if(!token){
        return res.status(401).json({error:"Access denied"})
    }
    // console.log(token);
    try{
        
        const decoded=jwt.verify(token,process.env.TOKEN_SECRET);
        req.user=decoded;
        // console.log(req.user);
        next();
    }catch(err){
        res.status(400).json({error:"Invalid token"})
    }
}

module.exports=authenticate;   