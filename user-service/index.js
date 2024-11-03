require('dotenv').config();
const express=require('express');
const connectDB=require('./src/config/dbConnection');
const userRoute=require('./src/routes/userRoutes');
const app=express();
app.use(express.json());

connectDB();
app.use('/user',userRoute
);
const PORT=process.env.PORT || 3100;


const server=app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

module.exports={app,server};