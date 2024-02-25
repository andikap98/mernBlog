import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user-route.js'
import authRoutes from './routes/auth-routes.js';

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
            console.log('MongooDb is Connected');
    })
    .catch((err) =>{
        console.log(err );
    });

app.use(express.json())
app.listen(3000, ()=>{
    console.log('Server is running on port 3000!!')
});

app.use('/api/users', userRouter);
app.use('/api/auth', authRoutes);


app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message|| 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});