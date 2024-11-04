const express = require('express');
const router = express.Router();
const {userValidationRules,validateUser}=require('../middleware/validateInput');

const {    userRegistration,
    userLogin,
    userLogout,
    userForgotPassword,
    userResetPassword,
    deleteUser,
    updateUser,
    getUser
}=require('../controllers/userAuthentication');
const authenticate = require('../middleware/authenticate');



//register a user
router.post('/register',userRegistration);

//login a user

router.post('/login',userLogin);

//fetching profile

router.get('/getUser',authenticate,getUser);


//updating profile

router.put('/updateUser',authenticate,updateUser);

//deleting profile

router.delete('/deleteUser',authenticate,deleteUser);

//logout
router.post('/logout',authenticate,userLogout);

//forgot password
router.post('/forgot-password',userForgotPassword);

//reset password
router.put('/reset-password',authenticate,userResetPassword);


module.exports = router;