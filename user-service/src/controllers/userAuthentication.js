const express = require('express');
const bcrypt=require('bcryptjs');
const User=require('../models/User');




const userRegistration=async(req,res)=>{
    console.log(req.body);
    const {username,email,password,role}=req.body;
    try{
        if(!(username && email&& password && role)){
            return res.status(400).json({error:"all input fields required"});

        }
        //check if user exists
        //if user exists throw error
        //else create user
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({msg:"User already exists"});
        }

        const newUser=new User({username,email,password,role});
        await newUser.save();
       return  res.status(201).json({msg:"User created successfully"});

    }
    catch(err){
        console.log(err);
       return  res.status(500).json({msg:"Internal server error"});
    }
};

const userLogin=async(req,res)=>{
    try{

    }
    catch(err){

    }
}

const userLogout=async(req,res)=>{
    try{

    }
    catch(err){

    }
}

const userForgotPassword=async(req,res)=>{
    try{

    }
    catch(err){

    }
}

const userResetPassword=async(req,res)=>{
    try{

    }
    catch(err){

    }
}

const deleteUser=async(req,res)=>{
    try{

    }
    catch(err){

    }
}

const updateUser=async(req,res)=>{
    try{

    }
    catch(err){

    }
}

const getUser=async(req,res)=>{
    try{

    }
    catch(err){

    }
}


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
 