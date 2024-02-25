import User from '../models/user-model.js';
import bcrypt from 'bcrypt'

const signup = async(req, res)=>{
    const {username, email, password} = req.body;
    try{

        if(!username || !email || !password || username==='' || email==='' || password===''){
            res.status(400).json({
                message: "All field are required"
            })
        }
        const existingUser = await User.findOne({
                $or: [{
                    email:email
                },{
                    username: username
                }]
        });
        if(existingUser){
            res.status(400).json({
                message:"Username atau Email sudah terdaftar!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
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
    catch(e){
        console.error(e);
    }

}

export default {
    signup
}