const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    try{
        const verify=jwt.verify(req.params.token,process.env.SECRET_KEY);
        req.useData=verify;
        next();
    }
    catch(e){
        res.status(401).send();
    }  
}