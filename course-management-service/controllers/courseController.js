const express=require('express');
const mongoose=require('mongoose');
const course=require('./models/courseModel');

//creating a controller for the course
const getAllCourses=(req,res)=>{

};
//getting all the courses for a particular instructor
const getAllCoursesByInstructor=(req,res)=>{
        
};


const createCourse=(req,res)=>{

};

const getCourse=(req,res)=>{
        
    }
const updateCourse=(req,res)=>{
    
    }
const deleteCourse=(req,res)=>{
    
    }
const addModule=(req,res)=>{
    
    }
const updateModule=(req,res)=>{
    
    }
const deleteModule=(req,res)=>{
    
    }
const enrollCourse=(req,res)=>{
    
}
const getAllModules=(req,res)=>{
    
    }
const getModule=(req,res)=>{
    
    }
const completeModule=(req,res)=>{
    
    }
const getAllStudents=(req,res)=>{
    
    }
const getStudent=(req,res)=>{
    
    }

    module.exports={
        getAllCourses,
        createCourse,
        getCourse,
        updateCourse,
        deleteCourse,
        addModule,
        updateModule,
        deleteModule,
        enrollCourse,
        getAllModules,
        getModule,
        completeModule,
        getAllStudents,
        getStudent
    };0