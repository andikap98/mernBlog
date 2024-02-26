import User from '../models/user-model.js';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';

const signup = async(req, res, next)=>{
    const {username, email, password} = req.body;
    try{

        if(!username || !email || !password || username==='' || email==='' || password===''){
            next(errorHandler(400, 'All fields are require'));
        }
        const existingUser = await User.findOne({
                $or: [{
                    email:email
                },{
                    username: username
                }]
        });
        if(existingUser){
            next(errorHandler(400, 'Username or email already exist'));
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const result = await newUser.save()
        res.status(201).json({
            message: "Sigup successful",
            data: result
        }) 
    }
    catch(error){
        next(error)
    }

}

export default {
    signup
}