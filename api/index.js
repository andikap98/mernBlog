import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
            console.log('MongooDb is Connected');
    })
    .catch((err) =>{
        console.log(err );
    })
app.listen(3000, ()=>{
    console.log('Server is running on port 3000!!')
});