require('dotenv').config();
const express=require('express');
const connectDB=require('./src/config/dbConnection');
const userRoute=require('./src/routes/userRoutes');
const logger=require('./logger');
const app=express();
app.use(express.json());

connectDB();
app.use('/user',userRoute);
// Request logging middleware
const requestLogger = (req, res, next) => {
    logger.info(`Incoming ${req.method} request to ${req.url}`);
    next(); // Pass control to the next middleware
};

// Use the logging middleware
app.use(requestLogger);
const PORT=process.env.PORT || 3100;


const server=app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

module.exports={app,server};