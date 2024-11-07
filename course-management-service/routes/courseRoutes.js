const express = require('express');
const router=express.Router();
const {
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
    
}=require('../controllers/courseController');
const authMiddlewear=require('../middlewares/authMiddlewear');
router.get('/',authMiddlewear,getAllCourses);
router.post('/',createCourse);
router.get('/:id',authMiddlewear,getCourse);
router.put('/:id',updateCourse);
router.delete('/:id',deleteCourse);
router.post('/:id/module',addModule);
router.put('/:id/module/:moduleId',updateModule);
router.delete('/:id/module/:moduleId',deleteModule);
router.post('/:id/enroll',authMiddlewear,enrollCourse);
router.get('/:id/modules',authMiddlewear,getAllModules);
router.get('/:id/modules/:moduleId',authMiddlewear,getModule);
router.post('/:id/modules/:moduleId/complete',authMiddlewear,completeModule);
router.get('/:id/students',authMiddlewear,getAllStudents);
router.get('/:id/students/:studentId',authMiddlewear,getStudent);


module.exports=router;