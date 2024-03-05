import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

const verifyUser = (req, res, next) =>{
    const token = req.cookies.access_token;

    if(!token){
        return next(errorHandler);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err) {
            return next(errorHandler(401, 'Unathorized'));
        }
        req.user = user;
        next();
    })
}

export default verifyUser;