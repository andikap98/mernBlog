import { errorHandler } from "../utils/error.js";
import User from "../models/user-model.js";
import bcrypt from 'bcrypt'

const test = (req, res)=>{
    res.json({
        msg:"API is Working"
    })
}

const update = async(req, res, next) =>{
    const idUser = req.params.idUser;
    const {username, email, password, profilePicture} = req.body;
    try {
        // const existingUser = await User.findOne({_id: idUser})
        if (req.user.id !== idUser){
            return next(errorHandler(403, 'You are not allowed to update this user'));
        }

        if(password){
            if(password.length < 6){
                return next(errorHandler(400, 'Password must be at  least 6 characters'))
            }
            password = await bcrypt.hash(password, 10)
        }

        if(username.length < 7 || username.length >20){
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
        }
        else if(username.includes(' ')){
            return next(errorHandler(400, 'Username cannot caontain space'))
        }
        else if(username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, 'Usename must be lowecase'));
        }
        else if(!username.match(/^[a-zA-z0-9]+$/)){
            return next(errorHandler(400, 'Username can only conatains letters and numbers'))
        }

        const updateUser = await User.findByIdAndUpdate(idUser,{
            $set:{
                username,
                email,
                password,
                profilePicture,
            }
        }, {new: true})
        const{password: pass, ...rest } = updateUser._doc;
        res.status(200).json({
            data: rest
        })
        
    } catch (error) {
        console.error(error);
        return next(errorHandler(500, 'Internal Server Error'))
    }
}

export default {
    test,
    update
}