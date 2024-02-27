import User from '../models/user-model.js';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'

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

const signin = async(req, res, next)=>{
    const {email, password} = req.body;
    if(!email || !password || email===''|| password===''){
        next(errorHandler(400, 'All fields are required'))
    }
    try {
        
        const validUser = await User.findOne({ email });

        if(!validUser){
            return next(errorHandler(404, 'Email not found'))
        }

        const validPassword = await bcrypt.compare(password, validUser.password);

        if(!validPassword){
            return next(errorHandler(400, 'Password wrong'));
        }

        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        
        // mengambil semua data kecuali password menggunakan destructuring
        const {password: pass, ...rest} = validUser._doc;
        res
            .status(200)
            .cookie('access_token', token, {
                httpOnly: true
            })
            .json(rest);

    } catch (error) {
        next(error)
    }
}

export default {
    signup,
    signin
}