const express = require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User');
const { sendRegistrationEmail } = require('../../mail-service/mailService');
const logger = require('../../logger');



const userRegistration=async(req,res)=>{
    
    const {username,email,password,role}=req.body;
    try{
        if(!(username && email&& password && role)){
            return res.status(400).json({error:"all input fields required"});

        }
        logger.info(`Attempting to register user with email: ${email}`);
        //check if user exists
        //if user exists throw error
        //else create user
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({msg:"User already exists"});
        }
        //hash password
        const hashedPassword=await bcrypt.hash(password,10);
        
        const newUser=new User({username,email,password:hashedPassword,role});
        await newUser.save();
        await sendRegistrationEmail(newUser.email, newUser.username);
        logger.info(`User registered successfully: ${email}`);
       return  res.status(201).json({msg:"User created successfully"});

    }
    catch(err){
        console.log(err);
       return  res.status(500).json({msg:"Internal server error"});
    }
};

const userLogin=async(req,res)=>{
    const {email,password,role}=req.body;
    try{
        //check if fields are empty
        if(!(email && password)){
            return res.status(400).json({msg:"All input fields required"});
        }
        logger.info(`User login attempt: ${email}`);
        //check if user exists
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"User does not exist"});
        }
        // console.log(user);
        //check if password is correct
        const validPassword=await bcrypt.compare(password,user.password);
        if(!validPassword){
            return res.status(400).json({msg:"Invalid password"});
        }
        // console.log(user.role);
        //check if role is correct
        if(user.role!==role){
            return res.status(400).json({msg:"Invalid role"});
        }
        //create token
        const token=jwt.sign({id:user._id,email:user.email,role:user.role},process.env.TOKEN_SECRET,{expiresIn:"1h"});
        //send token
        console.log(token);
        res.header('authorization',token);
        // console.log(token);
        logger.info(`User login Succesfull: ${email}`);
        return res.status(200).json({msg:"Login successful"});

    }
    catch(err){
        console.log(err);
         return  res.status(500).json({msg:"Internal server error"});
    }
}

const userLogout=async(req,res)=>{
    try{
        // console.log(req.headers);
        const email=req.user.email;
        logger.info(`User logout: ${email}`);
        res.removeHeader('authorization'); // Remove the header entirely

        return res.status(200).json({msg:"Logout successful"});


    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal server error"});
    }
}

const userForgotPassword=async(req,res)=>{
    const {email}=req.body;
    try{
        //input validation
        if(!email){
            return res.status(400).json({msg:"Email required"});
        }
        //check if email exists
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"User does not exist"});
        }
        //generate token
        
        // const token=jwt.sign({id:user._id,email:user.email},process.env.TOKEN_SECRET,{expiresIn:"1h"});
        
        //send token
        //send email
        // return res.status(200).json({msg:"Token sent to email"});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal server error"});
    }
}

const userResetPassword=async(req,res)=>{
    try{

    }
    catch(err){

    }
}

const deleteUser = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if email is provided
        if (!email) {
            return res.status(400).json({ msg: 'Email is required' });
        }

        // Find and delete the user by email
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Success response
        return res.status(200).json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};


const updateUser = async (req, res) => {
    const { email, updates } = req.body;

    try {
        // Check if email and updates are provided
        if (!email || !updates) {
            return res.status(400).json({ msg: 'Email and updates are required' });
        }

        // Find and update the user by email
        const user = await User.findOneAndUpdate({ email }, updates, { new: true });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Success response with updated user data
        return res.status(200).json({
            msg: 'User updated successfully',
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};


const getUser = async (req, res) => {
    const { email } = req.body;
    try {
        // Check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // If user is found, send a success response with user data
        return res.status(200).json({
            msg: 'User found',
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};




module.exports={
    userRegistration,
    userLogin,
    userLogout,
    userForgotPassword,
    userResetPassword,
    deleteUser,
    updateUser,
    getUser
} 
 