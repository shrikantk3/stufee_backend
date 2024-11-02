
const JWT = require('jsonwebtoken');

function verifyToken(req, res, next){
    const token = req.header('token');
    if(!token) return res.status(401).json({message:'Access Denie!'})
    try{
        const decode = JWT.verify(token, '');
        req.uid = decode.uid;
        next();
    }catch(err){
        res.status(401).json({message:'Invalid Token!'})
    }
}

module.exports = verifyToken;